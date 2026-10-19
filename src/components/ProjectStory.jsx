import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import ProjectPreview from "./ProjectPreview";
import { useExploreMotion } from "./MotionSettings";

const PHASES = ["The problem", "The approach", "The result"];

// Real document sections drive the visual; the story never captures scrolling.
export default function ProjectStory({ project, onOpen, children }) {
  const { reduced, full } = useExploreMotion();
  const [phase, setPhase] = useState(0);
  const chapters = useRef([]);
  const id = useId();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setPhase(Number(entry.target.dataset.phase));
        }
      },
      { rootMargin: "-25% 0px -35% 0px", threshold: 0 },
    );
    chapters.current.forEach((chapter) => chapter && observer.observe(chapter));
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <div className="story-visual" data-phase={phase}>
        <button
          type="button"
          className="project-image-button"
          onClick={() => onOpen(project)}
          aria-label={`Open ${project.title} case study`}
        >
          <ProjectPreview kind={project.id} />
          <span className="preview-open">
            <ArrowUpRight size={21} />
          </span>
        </button>
        <div className="story-visual-caption" aria-hidden="true">
          <div className="story-phase-label">
            <span>BEHIND THE BUILD</span>
            <strong>{PHASES[phase]}</strong>
          </div>
          <div className="story-phase-track">
            {PHASES.map((label, i) => (
              <span key={label} className={phase === i ? "is-current" : ""}>
                {String(i + 1).padStart(2, "0")}
                <i />
              </span>
            ))}
          </div>
          <motion.p
            key={phase}
            initial={reduced ? false : { opacity: 0.5, y: full ? 8 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.35 }}
          >
            {phase === 0
              ? project.tagline
              : phase === 1
                ? project.story.architecture
                    .slice(0, 3)
                    .map((step) => step.stage)
                    .join(" → ")
                : project.story.results[0]}
          </motion.p>
        </div>
      </div>
      <div className="project-copy">
        {children}
        <div
          className="story-chapters"
          aria-label={`${project.title}: behind the build`}
        >
          {PHASES.map((label, index) => (
            <section
              key={label}
              ref={(node) => {
                chapters.current[index] = node;
              }}
              data-phase={index}
              className={`story-chapter${phase === index ? " is-current" : ""}`}
              aria-labelledby={`${id}-${index}`}
            >
              <span className="story-chapter-number" aria-hidden="true">
                0{index + 1}
              </span>
              <h4 id={`${id}-${index}`}>{label}</h4>
              {index === 2 ? (
                <ul>
                  {project.story.results.map((result) => (
                    <li key={result}>{result}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  {index === 0 ? project.story.problem : project.story.solution}
                </p>
              )}
            </section>
          ))}
        </div>
        <button className="case-link" onClick={() => onOpen(project)}>
          Open full case study
          <ArrowUpRight size={16} />
        </button>
      </div>
    </>
  );
}
