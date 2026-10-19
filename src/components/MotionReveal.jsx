import { useExploreMotion } from "./MotionSettings";
import { createContext, useContext } from "react";
import { motion } from "framer-motion";

export const MotionReadyContext = createContext(true);

export default function MotionReveal({
  as = "div",
  children,
  className = "",
  delay = 0,
  ...props
}) {
  const ready = useContext(MotionReadyContext);
  const { reduced, subtle } = useExploreMotion();
  const Component = motion[as];
  const heading =
    className.includes("section-heading") || className.includes("about-intro");
  // Headings remain readable even before a viewport callback runs.
  const hidden = heading
    ? { opacity: 1, y: subtle ? 8 : 28, clipPath: "none" }
    : { opacity: 0, y: subtle ? 12 : 64 };
  const shown = heading
    ? { opacity: 1, y: 0, clipPath: "none" }
    : { opacity: 1, y: 0 };
  return (
    <Component
      {...props}
      className={className}
      initial={reduced ? false : hidden}
      animate={reduced ? shown : undefined}
      whileInView={ready ? shown : undefined}
      viewport={{ once: true, amount: 0.08, margin: "0px 0px 8% 0px" }}
      transition={{
        duration: reduced ? 0 : subtle ? 0.45 : 1.2,
        delay: reduced ? 0 : subtle ? Math.min(delay, 0.1) : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Component>
  );
}
