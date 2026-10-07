import { useEffect } from "react";
import Lenis from "lenis";

/**
 * JS smooth scroller (Lenis) — the single owner of smoothing.
 * - Uses Lenis' built-in autoRaf loop (no manual rAF chain to leak).
 * - Intercepts in-page anchor clicks and scrolls with a header offset.
 * - Moves keyboard focus to the target (skip-link / a11y).
 * - Handles an initial location.hash on load.
 * - Disabled when the user prefers reduced motion (native jump instead).
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
    if (document.body.style.overflow === "hidden") lenis.stop();

    function focusTarget(target) {
      if (!target) return;
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus({ preventScroll: true });
    }

    function scrollToTarget(target, { immediate = false } = {}) {
      // Recalculate after a viewport or font change before resolving the anchor.
      lenis.resize();
      if (immediate) {
        lenis.scrollTo(target, { immediate: true, force: true });
      } else {
        // Lenis reads the root scroll-padding, including the responsive header.
        lenis.scrollTo(target, { duration: 1.2 });
      }
    }

    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id.length < 2) return;
      let target;
      try { target = document.getElementById(decodeURIComponent(id.slice(1))); } catch { return; }
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target);
      history.replaceState(null, "", id);
      focusTarget(target);
    }
    document.addEventListener("click", onClick);

    // Deep link on load (e.g. /#work): jump past the loader without animation.
    if (window.location.hash.length > 1) {
      let initial;
      try { initial = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); } catch { /* Ignore malformed URL fragments. */ }
      if (initial) {
        requestAnimationFrame(() => scrollToTarget(initial, { immediate: true }));
      }
    }

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
