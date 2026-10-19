import { useExploreMotion } from "./MotionSettings";
import { useContext, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MotionReadyContext } from "./MotionReveal";

export function MagneticLink({
  children,
  className = "",
  hoverRotate = 0,
  ...props
}) {
  const { full } = useExploreMotion();
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 260, damping: 19 });
  const y = useSpring(targetY, { stiffness: 260, damping: 19 });
  function reset() {
    targetX.set(0);
    targetY.set(0);
  }
  useEffect(() => {
    if (!full) reset();
  }, [full]);
  return (
    <motion.a
      {...props}
      className={`magnetic-link ${className}`}
      style={!full ? { x: 0, y: 0, rotate: 0, scale: 1 } : { x, y }}
      onPointerMove={(event) => {
        if (
          !full ||
          event.pointerType !== "mouse" ||
          !window.matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        targetX.set(
          Math.max(
            -10,
            Math.min(10, (event.clientX - rect.left - rect.width / 2) * 0.14),
          ),
        );
        targetY.set(
          Math.max(
            -8,
            Math.min(8, (event.clientY - rect.top - rect.height / 2) * 0.18),
          ),
        );
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onBlur={reset}
      whileHover={!full ? undefined : { scale: 1.035, rotate: hoverRotate }}
      whileTap={!full ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      {children}
    </motion.a>
  );
}

export function ClickFeedback() {
  const ready = useContext(MotionReadyContext);
  const { full } = useExploreMotion();
  const [rings, setRings] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Set());
  useEffect(() => {
    if (!ready || !full) {
      setRings([]);
      return;
    }
    function show(event) {
      if (
        document.documentElement.dataset.view !== "explore" ||
        event.button !== 0 ||
        !(event.target instanceof Element)
      )
        return;
      const control = event.target.closest(
        ".button, .icon-button, .case-link, .project-filters button, .canvas-controls button",
      );
      if (
        !control ||
        control.matches(":disabled") ||
        control.getAttribute("aria-disabled") === "true"
      )
        return;
      const id = nextId.current++;
      setRings((previous) => [
        ...previous.slice(-3),
        { id, x: event.clientX, y: event.clientY },
      ]);
      const timer = setTimeout(() => {
        setRings((previous) => previous.filter((ring) => ring.id !== id));
        timers.current.delete(timer);
      }, 650);
      timers.current.add(timer);
    }
    document.addEventListener("pointerdown", show, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", show);
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    };
  }, [ready, full]);
  if (!full) return null;
  return (
    <div className="click-feedback" aria-hidden="true">
      {rings.map((ring) => (
        <span
          className="click-feedback-ring"
          key={ring.id}
          style={{ left: ring.x, top: ring.y }}
        />
      ))}
    </div>
  );
}
