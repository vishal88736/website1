import { createContext, useContext } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const MotionReadyContext = createContext(true);

export default function MotionReveal({
  as = "div",
  children,
  className = "",
  delay = 0,
  ...props
}) {
  const ready = useContext(MotionReadyContext);
  const reduced = useReducedMotion();
  const Component = motion[as];
  const heading =
    className.includes("section-heading") || className.includes("about-intro");
  // Headings remain readable even before a viewport callback runs.
  const hidden = heading
    ? { opacity: 1, y: 16, clipPath: "none" }
    : { opacity: 0, y: 48, scale: 0.97 };
  const shown = heading
    ? { opacity: 1, y: 0, clipPath: "none" }
    : { opacity: 1, y: 0, scale: 1 };
  return (
    <Component
      {...props}
      className={className}
      initial={reduced ? false : hidden}
      whileInView={ready ? shown : undefined}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduced ? 0 : 0.75,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Component>
  );
}
