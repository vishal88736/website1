import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Butter-smooth scrolling with correct cleanup.
 * - Uses Lenis' built-in autoRaf loop (no manual rAF chain to leak).
 * - Intercepts in-page anchor clicks and scrolls with a header offset.
 * - Disabled when the user prefers reduced motion.
 * - Exposes the instance on window.__lenis so modal/menu code can stop/start it.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      autoRaf: true,
    });
    window.__lenis = lenis;

    function onClick(event) {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -84, duration: 1.4 });
      history.replaceState(null, "", id);
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
      if (window.__lenis === lenis) window.__lenis = undefined;
    };
  }, []);

  return children;
}

export function stopSmooth() {
  window.__lenis?.stop();
}

export function startSmooth() {
  window.__lenis?.start();
}
