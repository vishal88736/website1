import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { flushSync } from "react-dom";
import { ArrowDown, ArrowUp, ArrowUpRight, Award, Brain, Check, Code2, Copy, Cpu, Eye, FlaskConical, GitBranch, Github, Linkedin, LoaderCircle, Menu, Moon, Send, Server, Sparkles, Sun, Trophy, X } from "lucide-react";
import { projects, expertise, upcoming, milestones, links } from "./src/data/portfolio";
import { startSmooth, stopSmooth } from "./src/components/SmoothScroll";
import NeuralSculpture from "./src/components/NeuralSculpture";
import ProjectPreview from "./src/components/ProjectPreview";
import ColorPalette, { PALETTES } from "./src/components/ColorPalette";
import AmbientElements, { Monogram, SectionOrnament } from "./src/components/AmbientElements";
import "./src/styles/portfolio.css";

const EMAIL = links.email.replace("mailto:", "");
const EASE = [0.22, 1, 0.36, 1];
const NAV = [["work", "Work"], ["about", "About"], ["recognition", "Recognition"], ["upcoming", "The lab"]];
const ROLES = ["AI Engineer", "Machine Learning Engineer", "Generative AI Developer", "Intelligent Systems Architect"];
const SKILL_ICONS = [Brain, Cpu, Eye, Server, Code2, GitBranch];
const MARQUEE = ["Machine learning", "Generative AI", "RAG pipelines", "Agentic systems", "Computer vision", "Multilingual voice AI", "LLMOps", "Vector search", "AST knowledge graphs", "FastAPI"];
const FILTERS = [{ label: "All projects", id: "all", count: "06" }, { label: "AI & agents", id: "ai", count: "05" }, { label: "Computer vision", id: "vision", count: "01" }];

function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay, ease: EASE }}>{children}</motion.div>;
}
function SectionLabel({ number, children }) {
  return <p className="section-label"><span>{number}</span><span className="label-line" />{children}</p>;
}
function Brand({ footer = false }) {
  return <a className={`brand${footer ? " footer-brand" : ""}`} href="#top" aria-label="Vishal Agrawal, back to top"><span className="brand-mark"><Monogram /></span><span className="brand-lockup"><strong>vishal agrawal<span className="brand-period">.</span></strong><small>AI & MACHINE LEARNING</small></span></a>;
}
function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame;
    let endTimer;
    const start = performance.now();
    function tick(now) {
      const value = Math.min((now - start) / 1050, 1);
      setProgress(Math.round(value * 100));
      if (value < 1) frame = requestAnimationFrame(tick);
      else endTimer = setTimeout(onDone, 150);
    }
    frame = requestAnimationFrame(tick);
    function escape(event) { if (event.key === "Escape") onDone(); }
    document.addEventListener("keydown", escape);
    return () => { cancelAnimationFrame(frame); clearTimeout(endTimer); document.removeEventListener("keydown", escape); };
  }, [onDone]);
  return <motion.div className="loader" role="status" aria-label="Loading Vishal Agrawal’s portfolio" initial={{ opacity: 1 }} exit={{ y: "-100%" }} transition={{ duration: 0.75, ease: EASE }}><div className="loader-top"><span>VISHAL AGRAWAL</span><span>A LITTLE CURIOSITY GOES A LONG WAY.</span></div><div className="loader-center"><span className="loader-symbol"><Monogram /></span><p>Connecting the dots<span className="loader-ellipsis">...</span></p></div><div className="loader-bottom"><span>ENGINEERING INTELLIGENCE</span><span>{String(progress).padStart(3, "0")}<small>%</small></span><div className="loader-line"><i style={{ transform: `scaleX(${progress / 100})` }} /></div></div></motion.div>;
}
function LocalTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const interval = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(interval); }, []);
  return <>{new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now)} IST</>;
}
const ProjectCard = forwardRef(function ProjectCard({ project, onOpen, index }, ref) {
  const reduced = useReducedMotion();
  return <motion.article ref={ref} layout={!reduced} className="project-card" initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.55, ease: EASE, delay: Math.min(index * 0.05, 0.15) }}>
    <button className="project-image-button" onClick={() => onOpen(project)} aria-label={`Open ${project.title} case study`}><ProjectPreview kind={project.id} /><span className="preview-open"><ArrowUpRight size={21} /></span></button>
    <div className="project-copy"><div className="project-meta"><span>{project.number} / {project.category}</span>{project.id === "sanjeevani" && <span className="project-award"><Trophy size={12} /> 1st place</span>}</div><div className="project-title-row"><h3>{project.title}</h3><a className="icon-button project-source" href={project.github} target="_blank" rel="noreferrer" aria-label={project.github === links.github ? `${project.title}: visit GitHub profile` : `${project.title}: view repository`}><Github size={18} /></a></div><p>{project.summary}</p><div className="chip-row">{project.story.techStack.map(tech => <span className="chip" key={tech}>{tech}</span>)}</div><button className="case-link" onClick={() => onOpen(project)}>Explore the project<ArrowUpRight size={16} /></button></div>
  </motion.article>;
});
function CaseStudy({ project, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const el = dialog.current;
    if (project && !el.open) el.showModal();
    if (!project && el.open) el.close();
    if (project) el.scrollTop = 0;
  }, [project]);
  return <dialog ref={dialog} className="case-dialog" data-lenis-prevent aria-labelledby="case-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose(); } }}>
    {project && <div className="case-content"><div className="case-top"><span className="section-label">PROJECT {project.number} / {project.category}</span><button className="icon-button" onClick={onClose} aria-label="Close case study" autoFocus><X size={20} /></button></div><h2 id="case-title">{project.title}<span>.</span></h2><p className="case-tagline">{project.tagline}</p><ProjectPreview kind={project.id} /><div className="case-story"><section><SectionLabel number="01">The problem</SectionLabel><p>{project.story.problem}</p></section><section><SectionLabel number="02">The approach</SectionLabel><p>{project.story.solution}</p></section></div><section className="case-architecture"><h3>Inside the architecture<span>↗</span></h3>{project.story.architecture.map((step, i) => <div className="architecture-step" key={step.stage}><span className="architecture-number">0{i + 1}</span><div><h4>{step.stage}<span>{step.tech}</span></h4><p>{step.detail}</p></div></div>)}</section><section className="case-challenge"><h3>The engineering challenge</h3><p>{project.story.challenge}</p></section><section className="case-results"><h3>What came out of it</h3><ul>{project.story.results.map(result => <li key={result}><Check size={15} />{result}</li>)}</ul></section><div className="chip-row">{project.story.techStack.map(tech => <span className="chip" key={tech}>{tech}</span>)}</div><a className="button button-primary" href={project.github} target="_blank" rel="noreferrer"><Github size={16} />{project.github === links.github ? "Visit GitHub profile" : "Explore the source"}<ArrowUpRight size={16} /></a></div>}
  </dialog>;
}
function ContactForm({ notify }) {
  const [status, setStatus] = useState("idle");
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  async function submit(event) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    const requestController = new AbortController();
    controller.current = requestController;
    const timeout = setTimeout(() => requestController.abort(), 15000);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name: data.get("name"), email: data.get("email"), message: data.get("message"), _subject: "Portfolio inquiry", _honey: data.get("_honey") }), signal: requestController.signal });
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== "true")) throw new Error("Submission failed");
      setStatus("success"); form.reset(); notify("Message sent. Thanks for reaching out!");
    } catch { setStatus("error"); }
    finally { clearTimeout(timeout); }
  }
  return <div className="contact-form"><div className="form-heading"><h3>A good conversation starts here.</h3><ArrowUpRight size={22} /></div><form onSubmit={submit}><div className="form-fields"><label>Your name<input name="name" autoComplete="name" placeholder="How should I call you?" required maxLength={120} /></label><label>Email address<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label></div><label>Your idea, opportunity, or hello<textarea name="message" rows={4} placeholder="Tell me a little about what you have in mind..." required maxLength={5000} /></label><input className="honeypot" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" /><div className="form-bottom"><button className="button button-primary" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send message"}{status === "sending" ? <LoaderCircle className="spin" size={16} /> : <Send size={15} />}</button><p className={`form-status status-${status}`} role="status">{status === "success" ? "Delivered. I’ll get back to you soon." : status === "error" ? "Unable to send. Please try again or email me directly." : "Straight to my inbox."}</p></div></form></div>;
}
export default function Portfolio() {
  const reduced = useReducedMotion();
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");
  const [palette, setPalette] = useState(() => { const saved = document.documentElement.dataset.palette; return PALETTES.some(option => option.id === saved) ? saved : "ember"; });
  const [loading, setLoading] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState("all");
  const [roleIndex, setRoleIndex] = useState(0);
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);
  const toastTimer = useRef(null);
  const copyTimer = useRef(null);
  const menuRef = useRef(null);
  const menuButton = useRef(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const finishLoading = useCallback(() => setLoading(false), []);
  const visibleProjects = projects.filter(p => filter === "all" || (filter === "vision" ? p.id === "cottonfield" : p.id !== "cottonfield"));
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.palette = palette;
    try { localStorage.setItem("va-theme", theme); localStorage.setItem("va-palette", palette); } catch { /* Preferences remain usable without storage. */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
  }, [theme, palette]);
  function toggleTheme(event) {
    const next = theme === "dark" ? "light" : "dark";
    function apply() { flushSync(() => setTheme(next)); }
    if (document.startViewTransition && !reduced) {
      const rect = event.currentTarget.getBoundingClientRect();
      document.documentElement.style.setProperty("--theme-x", `${rect.left + rect.width / 2}px`);
      document.documentElement.style.setProperty("--theme-y", `${rect.top + rect.height / 2}px`);
      document.startViewTransition(apply);
    } else apply();
  }
  useEffect(() => {
    const covered = loading || menuOpen || selectedProject !== null;
    if (covered) { document.body.style.overflow = "hidden"; stopSmooth(); }
    else { document.body.style.overflow = ""; startSmooth(); }
    return () => { document.body.style.overflow = ""; startSmooth(); };
  }, [loading, menuOpen, selectedProject]);
  useEffect(() => {
    if (loading || reduced) return;
    const interval = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 3500);
    return () => clearInterval(interval);
  }, [loading, reduced]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-15% 0px -70% 0px" });
    ["top", "work", "about", "recognition", "upcoming", "contact"].forEach(id => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const previousFocus = document.activeElement;
    menuRef.current?.querySelector("a")?.focus();
    function keyboard(event) {
      if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); return; }
      if (event.key !== "Tab") return;
      const elements = [menuButton.current, ...menuRef.current.querySelectorAll("a")].filter(Boolean);
      const first = elements[0]; const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    function onResize() { if (window.innerWidth > 900) setMenuOpen(false); }
    document.addEventListener("keydown", keyboard); window.addEventListener("resize", onResize);
    return () => { document.removeEventListener("keydown", keyboard); window.removeEventListener("resize", onResize); if (document.activeElement === document.body || menuRef.current?.contains(document.activeElement)) previousFocus?.focus({ preventScroll: true }); };
  }, [menuOpen]);
  useEffect(() => () => { clearTimeout(toastTimer.current); clearTimeout(copyTimer.current); }, []);
  function notify(message) { setToast(message); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(""), 4000); }
  async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); notify("Email address copied."); }
    catch { notify("Please use the email link to reach me."); }
    clearTimeout(copyTimer.current); copyTimer.current = setTimeout(() => setCopied(false), 3000);
  }
  const heroMotion = (delay) => ({ initial: reduced ? false : { opacity: 0, y: 24 }, animate: loading ? {} : { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay } });
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <AmbientElements />
    <AnimatePresence>{loading && <Loader key="loader" onDone={finishLoading} />}</AnimatePresence>
    <header className="site-header"><div className="header-inner"><Brand /><nav className="desktop-nav" aria-label="Main navigation">{NAV.map(([id,label]) => <a href={`#${id}`} key={id} className={active === id ? "is-active" : ""} aria-current={active === id ? "location" : undefined}>{label}{id === "upcoming" && <span className="nav-dot" />}</a>)}</nav><div className="header-actions"><ColorPalette palette={palette} onChange={setPalette} /><button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}><Sun size={16} className={theme === "light" ? "theme-active" : ""} /><Moon size={15} className={theme === "dark" ? "theme-active" : ""} /><span className={`theme-thumb theme-${theme}`} /></button><a className="header-cta" href="#contact">Let’s talk<ArrowUpRight size={15} /></a><button ref={menuButton} className="icon-button menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div></div><motion.div className="scroll-progress" style={{ scaleX: reduced ? scrollYProgress : progress }} /></header>
    <AnimatePresence>{menuOpen && <motion.nav ref={menuRef} id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: reduced ? 0 : 0.25 }}>{[...NAV, ["contact", "Contact"]].map(([id,label],i) => <a href={`#${id}`} key={id} onClick={() => { setMenuOpen(false); startSmooth(); }}><span><small>0{i + 1}</small>{label}</span><ArrowUpRight size={24} /></a>)}<p className="mobile-nav-note"><span className="status-dot" />Open to roles & research collaborations</p></motion.nav>}</AnimatePresence>
    <main id="main" inert={menuOpen || loading ? "" : undefined}>
      <section className="hero shell" id="top"><div className="hero-topline"><motion.p {...heroMotion(0.1)}><span className="little-star">✳</span> A LITTLE CURIOSITY. A LOT OF POSSIBILITY.</motion.p><motion.span className="availability" {...heroMotion(0.15)}><span className="status-dot" />Open to opportunities</motion.span></div><div className="hero-main"><div className="hero-copy"><motion.div className="hero-intro" {...heroMotion(0.15)}><span className="intro-line" />HEY, I’M VISHAL AGRAWAL</motion.div><motion.h1 {...heroMotion(0.22)}>Turning ideas<br />into <span className="hero-accent">intelligence<span className="title-period">.</span></span></motion.h1><motion.div className="role-rotator" {...heroMotion(0.3)}><span className="role-slash">/</span><AnimatePresence mode="wait" initial={false}><motion.span key={roleIndex} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>{ROLES[roleIndex]}</motion.span></AnimatePresence></motion.div><motion.p className="hero-description" {...heroMotion(0.37)}>I build intelligent systems that bridge research<br className="desktop-break" /> and the real world. Thoughtfully engineered.<br className="desktop-break" /> Endlessly curious.</motion.p><motion.div className="hero-actions" {...heroMotion(0.44)}><a className="button button-primary" href="#work">Explore my work<ArrowDown size={16} /></a><a className="button button-outline" href={links.resume} target="_blank" rel="noreferrer">View resume<ArrowUpRight size={16} /></a></motion.div><motion.div className="hero-socials" {...heroMotion(0.5)}><a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a><a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a><a href={links.twitter} target="_blank" rel="noreferrer" aria-label="X / Twitter"><span className="x-social">𝕏</span></a><span className="social-divider" /><span>BASED AT IIIT NAYA RAIPUR, INDIA</span></motion.div></div><motion.div className="hero-art" {...heroMotion(0.25)}><NeuralSculpture theme={theme} palette={palette} /></motion.div></div><motion.div className="hero-bottom" {...heroMotion(0.55)}><div className="hero-note"><span className="note-arrow">↳</span><span>Looking for an opportunity<br /><strong>to explore, build & make a difference.</strong></span></div><div className="hero-mini-stats"><span><strong>06</strong>SELECTED PROJECTS</span><span><strong>01<span>st</span></strong>HACKATHON WINNER</span><span><strong>200<span>+</span></strong>PROBLEMS SOLVED</span></div><a href="#work" className="scroll-cue"><span>KEEP EXPLORING</span><span className="scroll-icon"><ArrowDown size={15} /></span></a></motion.div></section>
      <div className="marquee" aria-label="Focus areas: machine learning, generative AI, RAG, agentic systems, computer vision, multilingual voice AI, LLMOps, vector search, AST knowledge graphs and FastAPI"><div className="marquee-track" aria-hidden="true">{[0,1].map(copy => <div className="marquee-group" key={copy}>{MARQUEE.map(item => <span key={item}><span className="marquee-star">✳</span>{item}</span>)}</div>)}</div></div>
      <section className="work-section section shell" id="work"><SectionOrnament /><Reveal className="section-heading"><div><SectionLabel number="01">SELECTED WORK</SectionLabel><h2>Ideas, brought<br />to <em>life.</em><span className="heading-spark">✳</span></h2></div><p>A few things I’ve built to understand,<br />reason, and solve real problems.<br /><span>From the first question to the final system.</span></p></Reveal><Reveal className="work-toolbar"><div className="project-filters" role="group" aria-label="Filter projects">{FILTERS.map(item => <button className={filter === item.id ? "is-selected" : ""} aria-pressed={filter === item.id} key={item.id} onClick={() => setFilter(item.id)}>{item.label}<span>{item.count}</span></button>)}</div><span className="work-count" role="status">{String(visibleProjects.length).padStart(2,"0")} PROJECTS / EXPLORE BELOW<ArrowDown size={12} /></span></Reveal><motion.div layout={!reduced} className={`projects-grid${visibleProjects.length === 1 ? " single-project" : ""}`}><AnimatePresence mode="popLayout">{visibleProjects.map((project,i) => <ProjectCard project={project} index={i} key={project.id} onOpen={setSelectedProject} />)}</AnimatePresence></motion.div><Reveal className="work-footer"><span>EVERY PROJECT STARTED WITH “WHAT IF?”</span><a className="text-link" href={links.github} target="_blank" rel="noreferrer">More on GitHub<Github size={15} /><ArrowUpRight size={14} /></a></Reveal></section>
      <section className="about-section section shell" id="about"><SectionOrnament variant="spark" /><Reveal className="about-intro"><div><SectionLabel number="02">THE PERSON BEHIND THE PROJECTS</SectionLabel><h2>Curiosity is the input.<br /><em>Engineering is the craft.</em></h2></div><Sparkles className="about-spark" size={43} /></Reveal><div className="about-grid"><Reveal className="identity-card"><div className="identity-top"><span>AN ENGINEER, ALWAYS EXPLORING.</span><span>↗</span></div><div className="identity-art" aria-hidden="true"><div className="identity-orbit orbit-a" /><div className="identity-orbit orbit-b" /><div className="identity-orbit orbit-c" /><Monogram className="identity-monogram" /><div className="identity-coordinate">CURIOSITY / CODE / REAL-WORLD IMPACT</div></div><div className="identity-bottom"><span><strong>Vishal Agrawal</strong><small>AI & Machine Learning Engineer</small></span><span className="identity-location"><span className="status-dot" />IIIT Naya Raipur, India</span></div></Reveal><Reveal className="about-copy" delay={0.1}><p className="about-lead">I’m Vishal, an AI and machine learning engineer based at IIIT Naya Raipur, India.</p><p>My work spans production LLM pipelines, multilingual voice systems, codebase intelligence, and computer vision. I’m interested in the full path from a model’s potential to a system that works in the real world.</p><div className="about-principles"><span><span>01</span>Think deeply.</span><span><span>02</span>Build thoughtfully.</span><span><span>03</span>Keep exploring.</span></div><a className="text-link" href={links.resume} target="_blank" rel="noreferrer">A little more about me<ArrowUpRight size={17} /></a></Reveal></div><Reveal className="toolkit-heading"><h3>My toolkit<span> / always evolving</span></h3><span>THE TOOLS BEHIND THE THINKING</span></Reveal><div className="expertise-grid">{expertise.map((item,i) => { const Icon = SKILL_ICONS[i]; return <Reveal key={item.category} delay={(i % 3) * 0.06}><article className="expertise-card"><div className="expertise-top"><span className="expertise-icon"><Icon size={21} /></span><span>0{i+1}</span></div><h3>{item.category}</h3><div className="expertise-skills">{item.skills.map(skill => <span key={skill}>{skill}</span>)}</div></article></Reveal>; })}</div></section>
      <section className="recognition-section section shell" id="recognition"><SectionOrnament /><Reveal className="section-heading"><div><SectionLabel number="03">A FEW MOMENTS THAT MATTER</SectionLabel><h2>Small milestones.<br /><em>Forward motion.</em></h2></div><p>Building, competing, and getting better<br />with every iteration.<br /><span>Here’s a little of the journey so far.</span></p></Reveal><div className="milestones">{milestones.map((item,i) => { const Icon = [Trophy, Award, Code2][i]; return <Reveal key={item.org} delay={i*0.06}><article className={`milestone milestone-${i}`}><div className="milestone-icon"><Icon size={23} /></div><div className="milestone-body"><div className="milestone-top"><span>{item.role}</span><span>{item.period}</span></div><h3>{item.org}</h3><p>{item.desc}</p></div><span className="milestone-deco" aria-hidden="true">0{i+1}</span></article></Reveal>; })}</div></section>
      <section className="lab-section section shell" id="upcoming"><SectionOrnament variant="spark" /><Reveal className="section-heading"><div><SectionLabel number="04">CURRENTLY ON THE WORKBENCH</SectionLabel><h2>Still curious.<br />Still <em>building.</em></h2></div><p>A peek into what comes next.<br />New questions. New experiments.<br /><span>Good things take a little exploration.</span></p></Reveal><div className="lab-grid">{upcoming.map((item,i) => <Reveal key={item.id} delay={i*0.1}><article className={`lab-card lab-${item.id}`}><div className="lab-top"><span className="lab-status"><span className="status-dot" />{item.status}</span><FlaskConical size={18} /></div><div className="lab-art" aria-hidden="true">{item.id === "cryptrix" ? <><span className="lab-wave wave-a" /><span className="lab-wave wave-b" /><span className="lab-wave wave-c" /><div className="lab-art-symbol">c<span>↗</span></div></> : <><div className="nova-orbit nova-one" /><div className="nova-orbit nova-two" /><div className="nova-orbit nova-three" /><div className="lab-art-symbol"><Sparkles size={54} strokeWidth={1} /></div></>}</div><div className="lab-copy"><h3>{item.title}<ArrowUpRight size={23} /></h3><p className="lab-subtitle">{item.subtitle}</p><p>{item.desc}</p><div className="chip-row">{item.tech.map(tech => <span className="chip" key={tech}>{tech}</span>)}</div></div><div className="lab-bottom"><span>IN PROGRESS</span><span>NOT YET SHIPPED</span></div></article></Reveal>)}</div><Reveal className="lab-invite"><span>Working on agentic systems, voice AI, or applied LLMs?</span><a className="text-link" href="#contact">Let’s connect<ArrowUpRight size={16} /></a></Reveal></section>
      <section className="contact-section section shell" id="contact"><Reveal className="contact-banner"><SectionOrnament /><div className="contact-banner-top"><SectionLabel number="05">THE NEXT CHAPTER</SectionLabel><span className="availability"><span className="status-dot" />Open to meaningful opportunities</span></div><div className="contact-title"><h2>Good ideas deserve<br /><em>good company.</em></h2><a href={links.email} className="contact-big-arrow" aria-label="Email Vishal"><ArrowUpRight /></a></div><p>AI engineering roles, research collaborations,<br />or a good conversation about intelligent systems. Let’s talk.</p><div className="contact-grid"><div className="contact-details"><p className="contact-prompt">HAVE SOMETHING IN MIND?</p><div className="email-row"><a href={links.email}>{EMAIL}</a><button className="icon-button" onClick={copyEmail} aria-label="Copy email address">{copied ? <Check size={17} /> : <Copy size={17} />}</button></div><span className="contact-rule" /><p className="contact-prompt">ELSEWHERE ON THE INTERNET</p><div className="social-links"><a href={links.github} target="_blank" rel="noreferrer"><Github size={16} />GitHub<ArrowUpRight size={14} /></a><a href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} />LinkedIn<ArrowUpRight size={14} /></a><a href={links.twitter} target="_blank" rel="noreferrer"><span>𝕏</span>Twitter / X<ArrowUpRight size={14} /></a></div><div className="contact-location"><span className="status-dot" /><span>IIIT NAYA RAIPUR, INDIA<br /><strong><LocalTime /></strong></span></div></div><ContactForm notify={notify} /></div></Reveal></section>
    </main>
    <footer className="site-footer shell"><div className="footer-top"><Brand footer /><span>MADE WITH CURIOSITY & A LITTLE CAFFEINE.</span><a className="back-top" href="#top">Back to top<ArrowUp size={15} /></a></div><div className="footer-giant" aria-hidden="true">vishal agrawal<span>✳</span></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Vishal Agrawal</p><span>THOUGHTFULLY ENGINEERED. ENDLESSLY CURIOUS.</span><span><span className="status-dot" />Thanks for stopping by.</span></div></footer>
    <CaseStudy project={selectedProject} onClose={() => setSelectedProject(null)} />
    <AnimatePresence>{toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 10, x: "-50%" }}><Check size={16} />{toast}</motion.div>}</AnimatePresence>
  </>;
}
