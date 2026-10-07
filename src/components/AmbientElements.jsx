import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function Monogram({ className = "" }) {
  return <svg className={className} viewBox="0 0 44 42" fill="none" aria-hidden="true"><path d="M6 12L14.5 31L23 12M20.5 31L29 12L37.5 31M24 23H34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function AmbientElements() {
  const glow = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    let frame;
    function move(event) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!glow.current) return;
        glow.current.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
        glow.current.classList.add("is-visible");
      });
    }
    function leave() { glow.current?.classList.remove("is-visible"); }
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [reduced]);

  return <>
    <div className="ambient-field" aria-hidden="true">
      <div className="ambient-wash wash-one" />
      <div className="ambient-wash wash-two" />
      <div className="ambient-wash wash-three" />
      {Array.from({ length: 10 }, (_, i) => <span key={i} className={`ambient-particle${i % 3 === 0 ? " particle-cross" : ""}`} style={{ "--particle-x": `${5 + ((i * 31) % 89)}%`, "--particle-y": `${8 + ((i * 17) % 83)}%`, "--particle-delay": `${i * -2.9}s`, "--particle-duration": `${18 + (i % 4) * 5}s` }}>{i % 3 === 0 ? "+" : ""}</span>)}
    </div>
    <div className="cursor-glow" ref={glow} aria-hidden="true" />
    <div className="edge-note edge-left" aria-hidden="true"><span />CURIOUS BY NATURE. ENGINEER BY CRAFT.</div>
    <div className="edge-note edge-right" aria-hidden="true">BUILDING WHAT COMES NEXT.<span /></div>
  </>;
}

export function SectionOrnament({ variant = "orbit" }) {
  return <div className={`section-ornament ornament-${variant}`} aria-hidden="true">
    {variant === "spark" ? <><span className="ornament-spark">✳</span><span className="ornament-small-spark">✦</span></> : <svg viewBox="0 0 180 180" fill="none"><ellipse cx="90" cy="90" rx="70" ry="34" /><ellipse cx="90" cy="90" rx="70" ry="34" transform="rotate(60 90 90)" /><ellipse cx="90" cy="90" rx="70" ry="34" transform="rotate(120 90 90)" /><circle cx="90" cy="90" r="5" /><circle cx="160" cy="90" r="3" className="ornament-dot" /></svg>}
  </div>;
}
