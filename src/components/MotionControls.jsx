import { useEffect, useId, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useMotionSettings } from "./MotionSettings";

const OPTIONS = [
  ["full", "Full", "Scroll stories, depth & playful details."],
  ["subtle", "Subtle", "Soft fades and gentle entrances."],
  ["off", "Off", "Instant changes. No decorative movement."],
];

export default function MotionControls() {
  const { preference, setPreference, systemReduced } = useMotionSettings();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const trigger = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    function outside(event) {
      if (!ref.current?.contains(event.target)) setOpen(false);
    }
    function key(event) {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setOpen(false);
      trigger.current?.focus();
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <div
      className="motion-control"
      ref={ref}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="icon-button motion-trigger"
        aria-label="Animation settings"
        aria-expanded={open}
        aria-controls={id}
        title="Animation settings"
        onClick={() => setOpen(!open)}
      >
        <SlidersHorizontal size={17} />
      </button>
      {open && (
        <div id={id} className="motion-popover">
          <div className="motion-heading">
            <div>
              <span>AT YOUR PACE</span>
              <h3>A little motion?</h3>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Close animation settings"
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              <X size={16} />
            </button>
          </div>
          <div
            className="motion-options"
            role="group"
            aria-label="Animation intensity"
          >
            {OPTIONS.map(([value, label, description]) => (
              <button
                type="button"
                key={value}
                aria-pressed={preference === value}
                onClick={() => setPreference(value)}
              >
                <strong>{label}</strong>
                <span>{description}</span>
                <i aria-hidden="true" />
              </button>
            ))}
          </div>
          <p role="status">
            {systemReduced
              ? "Your device requests reduced motion, so animations are off. Your selection is saved for when that preference changes."
              : "Saved for your next visit. Recruiter always stays still."}
          </p>
        </div>
      )}
    </div>
  );
}
