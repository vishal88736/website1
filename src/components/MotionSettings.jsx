import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { MotionConfig } from "framer-motion";

const MotionSettingsContext = createContext(null);
export const MOTION_LEVELS = ["full", "subtle", "off"];

function savedPreference() {
  try {
    const saved = localStorage.getItem("va-motion");
    return MOTION_LEVELS.includes(saved) ? saved : "full";
  } catch {
    return "full";
  }
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function systemSnapshot() {
  return Boolean(window.matchMedia?.(REDUCED_QUERY).matches);
}
function subscribeSystemMotion(listener) {
  const query = window.matchMedia?.(REDUCED_QUERY);
  if (!query) return () => {};
  if (query.addEventListener) {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }
  query.addListener(listener);
  return () => query.removeListener(listener);
}

export function MotionSettingsProvider({ children }) {
  const [preference, setPreference] = useState(savedPreference);
  const systemReduced = useSyncExternalStore(
    subscribeSystemMotion,
    systemSnapshot,
    () => true,
  );
  const level = systemReduced ? "off" : preference;

  useLayoutEffect(() => {
    function apply() {
      const effective =
        document.documentElement.dataset.view === "recruiter" ? "off" : level;
      document.documentElement.dataset.motion = effective;
    }
    try {
      localStorage.setItem("va-motion", preference);
    } catch {
      /* The controls still work without storage. */
    }
    apply();
    window.addEventListener("portfolio:view-change", apply);
    return () => window.removeEventListener("portfolio:view-change", apply);
  }, [preference, level]);

  return (
    <MotionSettingsContext.Provider
      value={{ preference, setPreference, level, systemReduced }}
    >
      <MotionConfig reducedMotion={level === "full" ? "never" : "always"}>
        {children}
      </MotionConfig>
    </MotionSettingsContext.Provider>
  );
}

export function useMotionSettings() {
  const settings = useContext(MotionSettingsContext);
  if (!settings)
    throw new Error("Motion settings require MotionSettingsProvider");
  return settings;
}

export function useExploreMotion() {
  const { level } = useMotionSettings();
  return {
    level,
    reduced: level === "off",
    subtle: level === "subtle",
    full: level === "full",
  };
}
