import { useExploreMotion } from "./MotionSettings";
import { useContext, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { MotionReadyContext } from "./MotionReveal";

// Local motion values keep pointer effects off React's render path.
export function usePointerTilt(strength = 4) {
  const { full } = useExploreMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(tiltY, { stiffness: 180, damping: 22 });
  const pointerX = useMotionValue("50%");
  const pointerY = useMotionValue("50%");
  const active = useMotionValue(0);
  function reset() {
    tiltX.set(0);
    tiltY.set(0);
    active.set(0);
  }
  useEffect(() => {
    if (!full) reset();
  }, [full]);
  return {
    style: !full
      ? { rotateX: 0, rotateY: 0, "--pointer-active": 0 }
      : {
          rotateX,
          rotateY,
          transformPerspective: 1100,
          "--pointer-x": pointerX,
          "--pointer-y": pointerY,
          "--pointer-active": active,
        },
    onPointerMove(event) {
      if (
        !full ||
        event.pointerType !== "mouse" ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      )
        return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = Math.max(
        0,
        Math.min(1, (event.clientX - bounds.left) / bounds.width),
      );
      const y = Math.max(
        0,
        Math.min(1, (event.clientY - bounds.top) / bounds.height),
      );
      tiltX.set((0.5 - y) * strength * 2);
      tiltY.set((x - 0.5) * strength * 2);
      pointerX.set(`${x * 100}%`);
      pointerY.set(`${y * 100}%`);
      active.set(1);
    },
    onPointerLeave: reset,
    onPointerCancel: reset,
  };
}

export function PointerSurface({ children, className = "", strength = 5 }) {
  const pointer = usePointerTilt(strength);
  return (
    <motion.div className={`pointer-surface ${className}`} {...pointer}>
      {children}
    </motion.div>
  );
}

export function ScrollScene({ children, ...props }) {
  const ref = useRef(null);
  const { full } = useExploreMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 26 });
  const artDrift = useTransform(smooth, [0, 1], ["0px", "-85px"]);
  const copyDrift = useTransform(smooth, [0, 1], ["0px", "32px"]);
  return (
    <motion.section
      {...props}
      ref={ref}
      style={
        !full
          ? { "--art-drift": "0px", "--copy-drift": "0px" }
          : { "--art-drift": artDrift, "--copy-drift": copyDrift }
      }
    >
      <div className="scene-grid" aria-hidden="true" />
      <div className="scene-light" aria-hidden="true" />
      {children}
    </motion.section>
  );
}

export function KineticText({ text, delay = 0 }) {
  const ref = useRef(null);
  const ready = useContext(MotionReadyContext);
  const { full } = useExploreMotion();
  const visible = useInView(ref, { once: true, amount: 0.2 });
  if (!full)
    return (
      <span className="kinetic-line" ref={ref}>
        {text}
      </span>
    );
  return (
    <span className="kinetic-line" ref={ref}>
      <span className="sr-only">{text}</span>
      <span className="kinetic-characters" aria-hidden="true">
        {Array.from(text).map((letter, i) => (
          <motion.span
            key={`${i}-${letter}`}
            className="kinetic-character"
            initial={{ y: "115%", rotateX: -70, opacity: 0 }}
            animate={
              ready && visible ? { y: "0%", rotateX: 0, opacity: 1 } : undefined
            }
            whileHover={
              !full
                ? undefined
                : {
                    y: -7,
                    transition: { type: "spring", stiffness: 420, damping: 14 },
                  }
            }
            transition={{
              duration: 0.75,
              delay: delay + i * 0.028,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {letter === " " ? "\u00a0" : letter}
          </motion.span>
        ))}
      </span>
    </span>
  );
}
