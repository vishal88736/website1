import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Palette, X } from "lucide-react";

export const PALETTES = [
  { id: "ember", name: "Ember", color: "#bc8c60", description: "Warm & grounded" },
  { id: "lavender", name: "Lavender", color: "#aa8cdc", description: "A little imagination" },
  { id: "ocean", name: "Ocean", color: "#6baccf", description: "Calm & expansive" },
  { id: "sage", name: "Sage", color: "#87ad8c", description: "Room to grow" },
  { id: "rose", name: "Rose", color: "#ca8d9e", description: "Soft & expressive" },
  { id: "amber", name: "Amber", color: "#c5a14b", description: "A brighter outlook" },
];

export default function ColorPalette({ palette, onChange }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function outside(event) {
      if (!root.current?.contains(event.target)) setOpen(false);
    }
    function keyboard(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyboard);
    };
  }, [open]);

  return (
    <div className="palette-control" ref={root} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button
        ref={trigger}
        className={`palette-trigger icon-button${open ? " is-open" : ""}`}
        aria-label="Choose a color palette"
        aria-expanded={open}
        aria-controls="color-palette"
        title="Make it yours — choose a palette"
        onClick={() => setOpen(value => !value)}
      >
        <Palette size={18} />
        <span className="palette-indicator" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="color-palette"
            className="palette-popover"
            initial={reduced ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            <div className="palette-heading">
              <div><span>A LITTLE PERSONAL TOUCH</span><h3>Make it yours.</h3></div>
              <button className="palette-close" onClick={() => { setOpen(false); trigger.current?.focus(); }} aria-label="Close color palette"><X size={16} /></button>
            </div>
            <div className="palette-options" role="group" aria-label="Color palettes">
              {PALETTES.map(option => (
                <button
                  key={option.id}
                  className={`palette-option${palette === option.id ? " is-selected" : ""}`}
                  aria-pressed={palette === option.id}
                  onClick={() => onChange(option.id)}
                >
                  <span className="palette-swatch" style={{ "--swatch": option.color }}>{palette === option.id && <Check size={17} strokeWidth={2.5} />}</span>
                  <strong>{option.name}</strong>
                  <small>{option.description}</small>
                </button>
              ))}
            </div>
            <p className="palette-footnote"><span className="status-dot" />Your palette stays with you. Works in light & dark.</p>
            <span className="sr-only" role="status">{PALETTES.find(option => option.id === palette)?.name} palette selected.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
