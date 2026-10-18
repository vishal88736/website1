import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Monogram } from "./Monogram";

export default function LoadingScreen({ onComplete }) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let minimumTimer, deadlineTimer, exitTimer;
    const minimum = new Promise((resolve) => {
      minimumTimer = setTimeout(resolve, reduced ? 180 : 900);
    });
    const deadline = new Promise((resolve) => {
      deadlineTimer = setTimeout(resolve, 1800);
    });
    const fonts = document.fonts?.ready?.catch(() => {}) ?? Promise.resolve();
    Promise.all([minimum, Promise.race([fonts, deadline])]).then(() => {
      if (disposed) return;
      clearTimeout(deadlineTimer);
      setReady(true);
      exitTimer = setTimeout(onComplete, reduced ? 0 : 280);
    });
    function keyboard(event) {
      if (event.key === "Escape") onComplete();
    }
    document.addEventListener("keydown", keyboard);
    return () => {
      disposed = true;
      [minimumTimer, deadlineTimer, exitTimer].forEach(clearTimeout);
      document.removeEventListener("keydown", keyboard);
    };
  }, [onComplete, reduced]);

  return (
    <motion.div
      className={`loading-screen${ready ? " is-ready" : ""}`}
      initial={false}
      exit={reduced ? { opacity: 0 } : { y: "-100%" }}
      transition={{ duration: reduced ? 0 : 0.65, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="loading-top">
        <span>VISHAL AGRAWAL</span>
        <span>AI & MACHINE LEARNING</span>
      </div>
      <div className="loading-center">
        <div className="loading-emblem" aria-hidden="true">
          <span className="loading-orbit orbit-outer" />
          <span className="loading-orbit orbit-inner" />
          <Monogram />
          <span className="loading-orbit-dot" />
        </div>
        <div className="loading-wordmark" aria-hidden="true">
          Ideas. Code.
          <br />
          <span>Intelligence.</span>
        </div>
        <p className="loading-status" role="status" aria-live="polite">
          <span className="status-dot" />
          {ready ? "Ready to explore." : "Loading portfolio…"}
        </p>
      </div>
      <div className="loading-bottom">
        <div>
          <span>CURIOUS BY NATURE. ENGINEER BY CRAFT.</span>
          <div className="loading-track" aria-hidden="true">
            <i />
          </div>
        </div>
        <button type="button" onClick={onComplete}>
          Skip intro
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
