import {
  ArrowDown,
  ArrowUpRight,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Printer,
} from "lucide-react";
import { expertise, links, milestones, projects } from "../data/portfolio";
import { Monogram } from "./Monogram";

export default function RecruiterView({ onOpenProject, menuOpen }) {
  return (
    <main
      className="recruiter-page shell"
      id="main"
      tabIndex={-1}
      inert={menuOpen ? "" : undefined}
    >
      <section
        className="recruiter-profile"
        id="top"
        aria-labelledby="recruiter-name"
      >
        <div className="recruiter-profile-copy">
          <span className="recruiter-monogram" aria-hidden="true">
            <Monogram />
          </span>
          <p className="availability">
            <span className="status-dot" />
            Open to opportunities
          </p>
          <h1 id="recruiter-name">
            Vishal Agrawal<span>.</span>
          </h1>
          <p className="recruiter-role">AI & Machine Learning Engineer</p>
          <p className="recruiter-location">
            <MapPin size={13} />
            IIIT Naya Raipur, India<span>IST · UTC+05:30</span>
          </p>
          <p className="recruiter-summary">
            I build intelligent systems across LLM pipelines, multilingual voice
            AI, codebase intelligence, and computer vision. I’m interested in
            the full path from a research question to a useful application.
          </p>
        </div>
        <div className="recruiter-quick-links" aria-label="Professional links">
          <span className="recruiter-eyebrow">THE USEFUL LINKS</span>
          <a
            className="button button-primary"
            href={links.resume}
            target="_blank"
            rel="noreferrer"
          >
            <FileText size={15} />
            View resume
            <ArrowUpRight size={14} />
          </a>
          <a
            className="button button-outline"
            href={links.github}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={15} />
            GitHub
            <ArrowUpRight size={14} />
          </a>
          <a
            className="button button-outline"
            href={links.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin size={15} />
            LinkedIn
            <ArrowUpRight size={14} />
          </a>
          <a className="button button-outline" href={links.email}>
            <Mail size={15} />
            Email me
            <ArrowUpRight size={14} />
          </a>
          <button
            type="button"
            className="button button-outline recruiter-print"
            onClick={() => window.print()}
          >
            <Printer size={15} />
            Print / Save PDF
          </button>
          <p className="recruiter-print-hint">
            Choose “Save as PDF” in your print dialog.
          </p>
          <a className="recruiter-jump" href="#work">
            Jump to projects
            <ArrowDown size={13} />
          </a>
        </div>
      </section>

      <div className="recruiter-stats" aria-label="Career highlights">
        <div>
          <strong>{String(projects.length).padStart(2, "0")}</strong>
          <span>Selected AI & engineering projects</span>
        </div>
        <div>
          <strong>1st</strong>
          <span>AI Durg & Gemma 4 Hackathon</span>
        </div>
        <div>
          <strong>200+</strong>
          <span>Programming problems solved</span>
        </div>
        <div>
          <strong>{String(expertise.length).padStart(2, "0")}</strong>
          <span>Areas in my engineering toolkit</span>
        </div>
      </div>

      <div className="recruiter-layout">
        <div className="recruiter-main-column">
          <section
            className="recruiter-projects"
            id="work"
            aria-labelledby="recruiter-projects-title"
          >
            <div className="recruiter-section-heading">
              <h2 id="recruiter-projects-title">Selected projects</h2>
              <span>{String(projects.length).padStart(2, "0")} PROJECTS</span>
            </div>
            <div className="recruiter-project-grid">
              {projects.map((project) => (
                <article className="recruiter-project" key={project.id}>
                  <span className="recruiter-eyebrow">
                    {project.number} / {project.category}
                  </span>
                  <h3>{project.title}</h3>
                  <p className="recruiter-project-tagline">{project.tagline}</p>
                  <p>{project.summary}</p>
                  <div className="chip-row">
                    {project.story.techStack.slice(0, 4).map((tech) => (
                      <span className="chip" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="recruiter-project-links">
                    <button
                      type="button"
                      onClick={() => onOpenProject(project)}
                    >
                      Case study
                      <ArrowUpRight size={13} />
                    </button>
                    <a href={project.github} target="_blank" rel="noreferrer">
                      <Github size={13} />
                      {project.github === links.github
                        ? "GitHub profile"
                        : "Source"}
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section
            className="recruiter-recognition"
            id="recognition"
            aria-labelledby="recruiter-recognition-title"
          >
            <div className="recruiter-section-heading">
              <h2 id="recruiter-recognition-title">Recognition & milestones</h2>
            </div>
            <div className="recruiter-timeline">
              {milestones.map((item) => (
                <article key={item.org}>
                  <div>
                    <h3>{item.org}</h3>
                    <span>{item.period}</span>
                  </div>
                  <p className="recruiter-timeline-role">{item.role}</p>
                  <p>{item.desc}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
        <aside className="recruiter-sidebar">
          <section
            className="recruiter-panel"
            id="about"
            aria-labelledby="recruiter-skills-title"
          >
            <h2 id="recruiter-skills-title">Skills & tools</h2>
            {expertise.map((group) => (
              <div className="recruiter-skill-group" key={group.category}>
                <h3>{group.category}</h3>
                <div className="chip-row">
                  {group.skills.map((skill) => (
                    <span className="chip" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
          <section
            className="recruiter-panel"
            aria-labelledby="recruiter-background-title"
          >
            <h2 id="recruiter-background-title">Background & interests</h2>
            <h3>IIIT Naya Raipur, India</h3>
            <p>
              Applied AI, machine learning, and the engineering behind
              intelligent applications.
            </p>
            <p>Open to AI engineering roles and research collaborations.</p>
            <a
              className="text-link"
              href={links.resume}
              target="_blank"
              rel="noreferrer"
            >
              Full background in my resume
              <ArrowUpRight size={14} />
            </a>
          </section>
          <section
            className="recruiter-panel recruiter-contact"
            id="contact"
            aria-labelledby="recruiter-contact-title"
          >
            <h2 id="recruiter-contact-title">Let’s connect</h2>
            <p>Have a role, research problem, or project in mind?</p>
            <a href={links.email}>
              {links.email.replace("mailto:", "")}
              <ArrowUpRight size={14} />
            </a>
            <a
              className="text-link"
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              Connect on LinkedIn
              <ArrowUpRight size={14} />
            </a>
          </section>
        </aside>
      </div>
    </main>
  );
}
