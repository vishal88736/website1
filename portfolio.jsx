import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, Github, Linkedin, Mail, Twitter, ChevronRight,
  Sparkles, Code2, Cpu, Database, Layers, ShieldCheck, Terminal,
  ExternalLink, Sun, Moon, ArrowRight, Play, CheckCircle2,
  FileText, Activity, Server, Zap, Compass, Send, Search, Command,
  Copy, Check, Radio, CornerDownLeft
} from "lucide-react";

/* =================================================================
   DATA & CONSTANTS
================================================================= */

const ROLES = [
  "AI Engineer",
  "Machine Learning Engineer",
  "Generative AI Developer",
  "Intelligent Systems Architect"
];

const CORE_EXPERTISE = [
  {
    category: "Artificial Intelligence",
    skills: ["LLMs", "Retrieval-Augmented Generation (RAG)", "Model Context Protocol (MCP)", "LangChain", "LangGraph", "Prompt Engineering"]
  },
  {
    category: "Machine Learning",
    skills: ["Machine Learning", "Deep Learning", "Feature Engineering", "Model Evaluation", "Mathematics", "Statistics"]
  },
  {
    category: "Computer Vision",
    skills: ["YOLOv8", "OCR", "OpenCV", "Image Processing", "Edge AI"]
  },
  {
    category: "Backend & Cloud",
    skills: ["FastAPI", "REST APIs", "AWS", "Docker", "MongoDB", "PostgreSQL"]
  },
  {
    category: "Languages",
    skills: ["Python", "C++", "SQL", "TypeScript", "JavaScript"]
  },
  {
    category: "Tools & Ecosystem",
    skills: ["Git", "GitHub", "Linux", "VS Code", "Jupyter", "Kaggle"]
  }
];

const FLAGSHIP_PROJECTS = [
  {
    id: "sanjeevani",
    number: "01",
    title: "Sanjeevani",
    tagline: "Multilingual Voice-First Healthcare AI Triage",
    accent: "#f59e0b",
    videoPlaceholder: "https://assets.mixkit.co/videos/preview/mixkit-medical-technology-animation-41586-large.mp4",
    poster: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80",
    story: {
      problem: "Healthcare advice in rural regions is bottlenecked by dialect barriers, high diagnostic costs, and critical time delays.",
      solution: "A voice-first assistant supporting 6+ Indic languages that transcribes, translates, and triages patient symptoms grounded in official WHO medical guidance.",
      architecture: [
        { stage: "Speech Input", tech: "IndicConformer", detail: "Transcribes raw audio into Indic text tokens in real time." },
        { stage: "Translation", tech: "IndicTrans2", detail: "Translates regional Indic languages into English for core LLM processing." },
        { stage: "Retrieval", tech: "FAISS Vector RAG", detail: "Performs dense semantic vector search against WHO medical guidelines." },
        { stage: "Reasoning", tech: "Gemma LLM", detail: "Drafts grounded clinical triage advice with source citation bounds." },
        { stage: "Verification", tech: "WHO Medical Rules", detail: "Runs automated deterministic safety checks before back-translating audio." }
      ],
      challenge: "Pipeline Latency & Reliability: Chaining 5 separate AI models (speech, translation, vector retrieval, LLM generation, and back-translation) while guaranteeing end-to-end response times under 1.2s.",
      results: [
        "6+ Indic Dialects Supported",
        "Sub-1.2s End-to-End Latency",
        "100% Grounded in WHO Guidelines"
      ],
      techStack: ["PyTorch", "Gemma", "IndicTrans2", "IndicConformer", "FAISS", "AWS Bedrock", "RAG"]
    },
    github: "https://github.com/vishal88736/sanjeevani"
  },
  {
    id: "codrix",
    number: "02",
    title: "Codrix.AI",
    tagline: "Codebase Intelligence & AST Knowledge Graph",
    accent: "#3b82f6",
    videoPlaceholder: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-data-41582-large.mp4",
    poster: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    story: {
      problem: "Onboarding onto complex multi-repository codebases requires days of manual code tracing and opaque architectural context.",
      solution: "Normalizes raw source repositories into Abstract Syntax Trees (AST) mapped into a vector queryable dependency graph for real-time architectural interrogation.",
      architecture: [
        { stage: "Source Code", tech: "Git / Local Repo", detail: "Indexes repository file trees and tracks git delta commits." },
        { stage: "AST Parsing", tech: "Tree-sitter Engine", detail: "Parses source code into structured Abstract Syntax Trees." },
        { stage: "Graph Extraction", tech: "Symbol Dependency Tree", detail: "Maps caller-callee bindings, class hierarchies, and import graphs." },
        { stage: "Vector Index", tech: "FAISS / Embeddings", detail: "Embeds code snippets and docstrings for semantic symbol query." },
        { stage: "Multi-Agent Query", tech: "LangChain Agents", detail: "Runs blast-radius analysis to evaluate code modification impacts." }
      ],
      challenge: "Semantic Precision: Preserving scope boundaries, caller-callee relationships, and multi-language syntax definitions across thousands of source files simultaneously.",
      results: [
        "Instant Blast-Radius Analysis",
        "Multi-Language AST Normalization",
        "10x Faster Codebase Onboarding"
      ],
      techStack: ["Python", "Tree-sitter", "LangChain", "FAISS", "Multi-Agent Systems", "Vector Search"]
    },
    github: "https://github.com/vishal88736"
  },
  {
    id: "careertrajectory",
    number: "03",
    title: "CareerTrajectory AI",
    tagline: "Redefining Talent Intelligence Beyond Traditional ATS",
    accent: "#8b5cf6",
    videoPlaceholder: "https://assets.mixkit.co/videos/preview/mixkit-network-connection-lines-in-the-dark-41588-large.mp4",
    poster: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80",
    story: {
      problem: "Traditional ATS keyword matching fails to evaluate engineering capability, project sophistication, learning trajectory, or actual candidate problem-solving maturity.",
      solution: "A multi-agent talent intelligence platform using specialized LLM agents, Neo4j knowledge graphs, and vector search to evaluate candidates, predict growth trajectory, and produce explainable ranking reports.",
      architecture: [
        { stage: "Resume Parsing", tech: "Multi-Modal Parsing", detail: "Deep semantic extraction of projects, research, technical depth, and competitive programming." },
        { stage: "Embedding Generation", tech: "Vector Embeddings", detail: "Generates dense semantic vector embeddings for job-candidate context matching." },
        { stage: "Knowledge Graph", tech: "Neo4j Graph Database", detail: "Maps caller skills, class hierarchies, project dependencies, and domain bindings." },
        { stage: "Multi-Agent Analysis", tech: "LangGraph Agents", detail: "Orchestrates Resume, Job, Skill, Momentum, and Behavioral Evidence agents." },
        { stage: "Explainable Output", tech: "Explainability Engine", detail: "Produces recruiter-friendly summaries, interview topic prompts, and future potential scores." }
      ],
      challenge: "Explainable Multi-Agent Latency: Coordinating 7 specialized LLM agents while delivering transparent candidate rankings without black-box opacity or high latency.",
      results: [
        "Multi-Agent Candidate Evaluation",
        "Explainable Transparent Scoring",
        "10x Deeper Technical Capability Ranking"
      ],
      techStack: ["React", "TypeScript", "FastAPI", "Python", "LangGraph", "LangChain", "AWS Bedrock", "Neo4j", "PostgreSQL", "RAG"]
    },
    github: "https://github.com/vishal88736"
  },
  {
    id: "cottonfield",
    number: "04",
    title: "Cotton Field Analysis",
    tagline: "AI-Powered Crop Intelligence from High-Resolution Orthomosaic Imagery",
    accent: "#10b981",
    videoPlaceholder: "https://assets.mixkit.co/videos/preview/mixkit-technology-network-lines-and-dots-41580-large.mp4",
    poster: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    story: {
      problem: "Manual inspection of thousands of plants across large-scale field survey orthomosaics is slow, costly, and inconsistent under variable lighting, shadows, and aerial blur.",
      solution: "A computer vision pipeline combining Restormer/FFTFormer image enhancement with deep learning crop classification on high-resolution orthomosaic patch tiles.",
      architecture: [
        { stage: "Drone Survey", tech: "1080p Aerial Imagery", detail: "Collects high-resolution drone orthomosaic imagery across large field acreage." },
        { stage: "Orthomosaic Tiling", tech: "Patch Extraction", detail: "Divides multi-gigabyte orthomosaic images into manageable spatial patch tiles." },
        { stage: "Image Enhancement", tech: "Restormer / FFTFormer", detail: "Restores image quality, denoises low-quality regions, and enhances contrast before model inference." },
        { stage: "Deep Learning", tech: "PyTorch Classification", detail: "Runs deep neural network classification on enhanced crop patch tiles." },
        { stage: "Field Insights", tech: "Health Map Generation", detail: "Generates field-level crop health condition reports across entire farms." }
      ],
      challenge: "High-Resolution Memory & Restoration: Processing multi-gigabyte orthomosaic maps without memory exhaustion while boosting classification accuracy via restoration preprocessing.",
      results: [
        "Field-Scale Orthomosaic Intelligence",
        "Restormer Image Restoration Pipeline",
        "Robust Crop Health Classification"
      ],
      techStack: ["PyTorch", "OpenCV", "Computer Vision", "Restormer", "FFTFormer", "Python", "Image Processing", "Deep Learning"]
    },
    github: "https://github.com/vishal88736"
  }
];

const UPCOMING_PROJECTS = [
  {
    id: "cryptrix",
    title: "Cryptrix",
    subtitle: "AI Trading Intelligence Platform",
    status: "IN DEVELOPMENT",
    accent: "#f59e0b",
    desc: "Building an AI-powered platform for crypto market intelligence, sentiment analysis, and trading insights with intelligent monitoring and automated signal analysis.",
    tech: ["LangGraph", "FastAPI", "WebSockets", "Crypto Intelligence"]
  },
  {
    id: "novatune",
    title: "NovaTune",
    subtitle: "Next-Generation AI Workflows",
    status: "RESEARCH & DEVELOPMENT",
    accent: "#3b82f6",
    desc: "Exploring and designing a new AI system focused on advanced intelligent workflows, automated agent execution, and scalable AI user experiences.",
    tech: ["Multi-Agent Systems", "Agentic AI", "Autonomous Workflows"]
  }
];

const JOURNEY_MILESTONES = [
  {
    org: "AWS AI for Bharat",
    role: "AI Fellow",
    period: "2024 — Present",
    desc: "Selected for AWS's national AI fellowship program. Shipped production AI systems leveraging AWS Bedrock and SageMaker."
  },
  {
    org: "IIIT Naya Raipur",
    role: "B.Tech, Data Science & Artificial Intelligence",
    period: "2022 — 2026",
    desc: "Core coursework in machine learning, deep learning, data structures, and computer vision. Independent research in RAG & multi-agent systems."
  },
  {
    org: "Competitive Programming",
    role: "CodeChef 2★ · 200+ Problems Solved",
    period: "Ongoing",
    desc: "Rigorous problem solving across core graph algorithms, dynamic programming, and computational complexity."
  },
  {
    org: "Research & Hackathons",
    role: "Finalist & Open Source Contributor",
    period: "Ongoing",
    desc: "Building open-source developer tooling, multi-agent AI frameworks, and edge vision models."
  }
];

const SOCIAL_LINKS = {
  github: "https://github.com/vishal88736",
  linkedin: "https://www.linkedin.com/in/vishal-agrawal-1ba44532b/",
  twitter: "https://x.com/vishal__0604",
  email: "mailto:agrawalvishal804@gmail.com",
  resume: "https://drive.google.com/file/d/1cRQsrwSxCf0lg_XXxF1i7ahrhkEpK7yd/view?usp=drive_link"
};

const PALETTE_COMMANDS = [
  { id: "expertise", label: "Core Expertise", category: "Navigation", hint: "AI, ML, Vision, Cloud, Languages" },
  { id: "projects", label: "Flagship Projects", category: "Navigation", hint: "Sanjeevani, Codrix.AI, CareerTrajectory AI, Cotton Field" },
  { id: "sanjeevani", label: "Sanjeevani AI", category: "Flagship Work", hint: "Voice-first multilingual healthcare triage" },
  { id: "codrix", label: "Codrix.AI", category: "Flagship Work", hint: "Codebase AST knowledge graph" },
  { id: "careertrajectory", label: "CareerTrajectory AI", category: "Flagship Work", hint: "Talent intelligence & candidate evaluation platform" },
  { id: "cottonfield", label: "Cotton Field Analysis", category: "Flagship Work", hint: "Crop health AI from orthomosaic imagery" },
  { id: "upcoming", label: "Upcoming Projects", category: "Navigation", hint: "Cryptrix & NovaTune in active R&D" },
  { id: "journey", label: "Milestones & Journey", category: "Navigation", hint: "AWS Fellow, IIIT Naya Raipur" },
  { id: "contact", label: "Contact & Inquiries", category: "Navigation", hint: "Send a direct message" },
  { id: "action-copy-email", label: "Copy Email Address", category: "Actions", hint: "agrawalvishal804@gmail.com", action: "copy-email" },
  { id: "action-resume", label: "Open Resume (Google Drive)", category: "External", hint: "View PDF Resume", action: "open-resume" },
  { id: "action-toggle-theme", label: "Toggle Theme (Dark / Light)", category: "Actions", hint: "Switch visual theme", action: "toggle-theme" },
  { id: "action-github", label: "Open GitHub Profile", category: "External", hint: "github.com/vishal88736", action: "open-github" }
];

/* =================================================================
   CINEMATIC SPLASH SCREEN WITH 3D BOUNCING LETTERS & SCANNER BEAM
================================================================= */

function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const nameLetters = "VISHAL AGRAWAL".split("");

  return (
    <motion.div
      className="splash-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(16px)" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="splash-ambient-glow" />

      <div className="splash-content">
        {/* Animated 3D VA Logo */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotateX: -60, rotateY: 45 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0, rotateY: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="splash-logo-container"
        >
          <VALogo size={72} />
        </motion.div>

        {/* 3D Perspective Letter Flip & Bounce */}
        <div className="splash-name">
          {nameLetters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ y: 45, opacity: 0, rotateX: 90, scale: 0.5 }}
              animate={{
                y: [45, -18, 0],
                opacity: 1,
                rotateX: [90, -15, 0],
                scale: [0.5, 1.25, 1],
              }}
              transition={{
                duration: 0.75,
                delay: 0.25 + index * 0.04,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="splash-letter"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        {/* Tech Slogan with Scanner Line Beam */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="splash-slogan"
        >
          <span className="splash-slogan-line" />
          <span className="slogan-text-glow">ENGINEERING THE INTELLIGENCE LAYER</span>
          <span className="splash-slogan-line" />
        </motion.div>

        {/* Progress Track */}
        <div className="splash-progress-track">
          <motion.div
            className="splash-progress-bar"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.6, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* =================================================================
   SMOOTH 3D TILT PERSPECTIVE CARD
================================================================= */

function TiltCard({ children, className = "", ...props }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: y * -10, y: x * 10 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* =================================================================
   TOAST NOTIFICATION
================================================================= */

function Toast({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="toast-container"
    >
      <CheckCircle2 size={16} className="toast-icon" />
      <span>{message}</span>
    </motion.div>
  );
}

/* =================================================================
   INTERACTIVE ARCHITECTURE PIPELINE INSPECTOR
================================================================= */

function InteractiveArchitecturePipeline({ steps }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="interactive-arch-wrapper">
      <div className="arch-steps-container">
        {steps.map((arch, i) => {
          const isActive = activeStep === i;
          return (
            <motion.div
              key={arch.stage}
              className={`arch-step-interactive ${isActive ? "arch-step--active" : ""}`}
              onClick={() => setActiveStep(i)}
              whileHover={{ scale: 1.02, x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="arch-step-header">
                <span className="arch-num">0{i + 1}</span>
                <span className="arch-stage">{arch.stage}</span>
              </div>
              <span className="arch-tech">{arch.tech}</span>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="arch-detail-box"
        >
          <span className="arch-detail-tag">STAGE 0{activeStep + 1} BREAKDOWN</span>
          <h4 className="arch-detail-title">{steps[activeStep].stage} ({steps[activeStep].tech})</h4>
          <p className="arch-detail-desc">{steps[activeStep].detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* =================================================================
   COMMAND PALETTE MODAL (Cmd+K)
================================================================= */

function CommandPalette({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return PALETTE_COMMANDS;
    return PALETTE_COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase()) ||
        cmd.hint.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="palette-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          className="palette-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="palette-search-bar">
            <Search size={18} className="palette-search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search commands, projects, actions... (ESC to exit)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="palette-kbd">ESC</span>
          </div>

          <div className="palette-list">
            {filteredCommands.length === 0 ? (
              <div className="palette-empty">No matching commands found</div>
            ) : (
              filteredCommands.map((cmd) => (
                <button
                  key={cmd.id}
                  className="palette-item"
                  onClick={() => onSelect(cmd)}
                >
                  <div className="palette-item-left">
                    <span className="palette-item-cat">{cmd.category}</span>
                    <span className="palette-item-label">{cmd.label}</span>
                  </div>
                  <div className="palette-item-right">
                    <span className="palette-item-hint">{cmd.hint}</span>
                    <CornerDownLeft size={14} className="palette-enter-icon" />
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="palette-footer">
            <span>Navigation: Use mouse or keyboard</span>
            <span>Shortcut: <kbd>⌘K</kbd> or <kbd>Ctrl+K</kbd></span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* =================================================================
   CUSTOM HARDWARE-ACCELERATED CURSOR & MAGNETIC BUTTON
================================================================= */

function MagneticButton({ children, className = "", onClick, ...props }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 250, damping: 18, mass: 0.5 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const target = e.target;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <motion.div
        className="cursor-dot"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovered ? 2.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 35 }}
      />
      <motion.div
        className="cursor-ring"
        animate={{
          x: mousePosition.x - 18,
          y: mousePosition.y - 18,
          scale: isHovered ? 1.4 : 1,
          borderColor: isHovered ? "var(--accent)" : "var(--border-strong)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </>
  );
}

/* =================================================================
   VA BRAND MONOGRAM LOGO
================================================================= */

function VALogo({ size = 32, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="var(--card-bg)" stroke="var(--border)" strokeWidth="1" />
      <path d="M11 13L18.5 28H21.5L29 13" stroke="var(--accent)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.5 13L30 28" stroke="var(--text-dim)" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/* =================================================================
   MAIN PORTFOLIO COMPONENT
================================================================= */

export default function Portfolio() {
  const [theme, setTheme] = useState("dark");
  const [roleIdx, setRoleIdx] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIdx((prev) => (prev + 1) % ROLES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard?.writeText("agrawalvishal804@gmail.com");
    triggerToast("Copied agrawalvishal804@gmail.com to clipboard");
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePaletteSelect = (cmd) => {
    setPaletteOpen(false);
    if (cmd.action === "copy-email") {
      copyEmailToClipboard();
    } else if (cmd.action === "open-resume") {
      window.open(SOCIAL_LINKS.resume, "_blank");
    } else if (cmd.action === "toggle-theme") {
      setTheme((t) => (t === "dark" ? "light" : "dark"));
      triggerToast(`Switched theme to ${theme === "dark" ? "Light Mode" : "Dark Mode"}`);
    } else if (cmd.action === "open-github") {
      window.open(SOCIAL_LINKS.github, "_blank");
    } else {
      scrollToSection(cmd.id);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = contactForm;
    triggerToast("Sending message to agrawalvishal804@gmail.com...");

    try {
      const response = await fetch("https://formsubmit.co/ajax/agrawalvishal804@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `Portfolio Message from ${name}`
        })
      });

      if (response.ok) {
        setContactSent(true);
        triggerToast("Message sent successfully to agrawalvishal804@gmail.com!");
        setContactForm({ name: "", email: "", message: "" });
        return;
      }
    } catch (err) {
      console.warn("FormSubmit fetch fallback to mailto", err);
    }

    // Fallback to pre-filled mailto directly to agrawalvishal804@gmail.com
    const subject = encodeURIComponent(`Portfolio Message from ${name || "Visitor"}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`);
    window.location.href = `mailto:agrawalvishal804@gmail.com?subject=${subject}&body=${body}`;
    setContactSent(true);
    triggerToast("Opening mail client...");
  };

  return (
    <div className={`portfolio-root theme-${theme}`}>
      <style>{CSS}</style>
      <CustomCursor />

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMsg && <Toast message={toastMsg} />}
      </AnimatePresence>

      {/* COMMAND PALETTE */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelect={handlePaletteSelect}
      />

      {/* SPLASH SCREEN */}
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-inner">
          <button className="brand-btn" onClick={() => scrollToSection("hero")}>
            <VALogo size={32} />
            <div className="brand-text">
              <span className="brand-name">Vishal Agrawal</span>
              <span className="brand-sub">AI & Systems</span>
            </div>
          </button>

          {/* LIVE STATUS PILL */}
          <div className="live-status-pill" onClick={copyEmailToClipboard} title="Click to copy email">
            <span className="status-dot-pulse" />
            <span className="status-text">AVAILABLE FOR PRODUCTION AI ROLES</span>
          </div>

          <nav className="nav-links">
            <button onClick={() => scrollToSection("expertise")}>Expertise</button>
            <button onClick={() => scrollToSection("projects")}>Work</button>
            <button onClick={() => scrollToSection("journey")}>Journey</button>
            <button onClick={() => scrollToSection("contact")}>Contact</button>
          </nav>

          <div className="navbar-actions">
            <button
              className="icon-toggle"
              onClick={() => setPaletteOpen(true)}
              title="Command Palette (⌘K)"
            >
              <Search size={16} />
            </button>
            <button
              className="icon-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle color theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <a href={SOCIAL_LINKS.resume} target="_blank" rel="noreferrer" className="btn btn-nav">
              <FileText size={15} /> Resume
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="hero-background-glow" />
        <div className="hero-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hero-eyebrow"
          >
            <span>VISHAL AGRAWAL</span>
            <span className="eyebrow-divider">•</span>
            <span>BUILDING PRODUCTION AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hero-headline"
          >
            Engineering <br />
            Intelligent <br />
            <span className="text-gradient">AI Systems.</span>
          </motion.h1>

          <div className="hero-role-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={roleIdx}
                initial={{ opacity: 0, y: 14, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.95 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
                className="hero-role-text"
              >
                {ROLES[roleIdx]}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hero-subtext"
          >
            Architecting production LLM pipelines, voice-first multilingual AI models,
            AST codebase intelligence, and real-time edge computer vision systems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hero-actions"
          >
            <MagneticButton className="btn btn-primary" onClick={() => scrollToSection("projects")}>
              Explore Flagship Work <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton className="btn btn-secondary" onClick={() => scrollToSection("contact")}>
              Get in Touch
            </MagneticButton>
            <button className="btn btn-ghost" onClick={() => setPaletteOpen(true)}>
              <Command size={15} /> Press ⌘K
            </button>
          </motion.div>
        </div>
      </section>

      {/* CORE EXPERTISE */}
      <section id="expertise" className="section expertise-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">CORE EXPERTISE</span>
            <h2 className="section-title">Technical Domains & Capabilities</h2>
            <p className="section-desc">
              Core competencies spanning production Generative AI, deep learning, computer vision, and cloud infrastructure.
            </p>
          </div>

          <div className="expertise-list">
            {CORE_EXPERTISE.map((item, idx) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="expertise-row"
              >
                <h3 className="expertise-category">{item.category}</h3>
                <div className="expertise-skills">
                  {item.skills.map((skill, sIdx) => (
                    <span key={skill} className="expertise-skill-item">
                      {skill}
                      {sIdx < item.skills.length - 1 && <span className="expertise-bullet">•</span>}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FLAGSHIP PROJECTS SHOWCASE */}
      <section id="projects" className="section projects-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">FEATURED WORK</span>
            <h2 className="section-title">Flagship Engineering Projects</h2>
            <p className="section-desc">
              Four production-focused systems engineered from zero to execution. Click any architecture stage below to inspect system details.
            </p>
          </div>

          <div className="projects-list">
            {FLAGSHIP_PROJECTS.map((project) => (
              <TiltCard key={project.id} className="project-tilt-wrap">
                <article id={project.id} className="project-product-page">
                  {/* Project Header */}
                  <div className="project-meta-row">
                    <div className="project-number-badge">{project.number}</div>
                    <div className="project-title-group">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-tagline">{project.tagline}</p>
                    </div>
                    <div className="project-action-links">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="project-github-link"
                        title="View Source on GitHub"
                      >
                        <Github size={16} /> Source <ArrowUpRight size={14} />
                      </a>
                      {project.id === "sanjeevani" || project.id === "careertrajectory" ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="project-action-link"
                        >
                          Live Demo <ExternalLink size={14} />
                        </a>
                      ) : (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="project-action-link"
                        >
                          Documentation <FileText size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Video / Visual Banner */}
                  <div className="project-banner-container">
                    <video
                      className="project-banner-video"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={project.poster}
                    >
                      <source src={project.videoPlaceholder} type="video/mp4" />
                      Your browser does not support HTML5 video.
                    </video>
                    <div className="project-banner-overlay" />

                    {/* Audio Waveform Visualizer for Sanjeevani */}
                    {project.id === "sanjeevani" && (
                      <div className="waveform-bar-wrap">
                        <span className="waveform-label">Indic Speech Processing</span>
                        <div className="waveform-bars">
                          {[40, 70, 30, 90, 50, 80, 40, 100, 60, 30, 85].map((h, i) => (
                            <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Storytelling Grid */}
                  <div className="project-story-grid">
                    {/* Problem & Solution */}
                    <div className="story-block story-block--main">
                      <div className="story-item">
                        <span className="story-label">THE PROBLEM</span>
                        <p className="story-text">{project.story.problem}</p>
                      </div>
                      <div className="story-item">
                        <span className="story-label">THE SOLUTION</span>
                        <p className="story-text">{project.story.solution}</p>
                      </div>
                    </div>

                    {/* Interactive Architecture Inspector */}
                    <div className="story-block story-block--architecture">
                      <span className="story-label">SYSTEM ARCHITECTURE (INTERACTIVE)</span>
                      <InteractiveArchitecturePipeline steps={project.story.architecture} />
                    </div>

                    {/* Engineering Challenge & Key Results */}
                    <div className="story-block story-block--engineering">
                      <div className="story-item">
                        <span className="story-label">ENGINEERING CHALLENGE</span>
                        <p className="story-text">{project.story.challenge}</p>
                      </div>
                      <div className="story-item">
                        <span className="story-label">KEY RESULTS</span>
                        <ul className="results-list">
                          {project.story.results.map((res) => (
                            <li key={res}>
                              <CheckCircle2 size={15} className="text-accent" />
                              <span>{res}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack Footer */}
                  <div className="project-tech-footer">
                    <span className="tech-footer-label">ENGINEERING STACK:</span>
                    <div className="tech-pills">
                      {project.story.techStack.map((tech) => (
                        <span key={tech} className="tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING PROJECTS SECTION */}
      <section id="upcoming" className="section upcoming-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">ACTIVE R&D & IN DEVELOPMENT</span>
            <h2 className="section-title">Upcoming Projects</h2>
            <p className="section-desc">
              Projects I'm currently building and researching in trading intelligence, agentic workflows, and system architecture.
            </p>
          </div>

          <div className="upcoming-grid">
            {UPCOMING_PROJECTS.map((proj, idx) => (
              <TiltCard key={proj.id} className="upcoming-tilt-wrap">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="upcoming-card"
                >
                  <div className="upcoming-card-header">
                    <span className="upcoming-badge" style={{ borderColor: proj.accent, color: proj.accent }}>
                      <span className="status-dot-pulse" style={{ background: proj.accent }} />
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="upcoming-title">{proj.title}</h3>
                  <p className="upcoming-subtitle">{proj.subtitle}</p>
                  <p className="upcoming-desc">{proj.desc}</p>

                  <div className="upcoming-tech-pills">
                    {proj.tech.map((t) => (
                      <span key={t} className="upcoming-tech-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* MINIMAL JOURNEY SECTION */}
      <section id="journey" className="section journey-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">MILESTONES</span>
            <h2 className="section-title">The Journey So Far</h2>
            <p className="section-desc">
              Academic foundation, industry fellowships, and problem-solving benchmarks.
            </p>
          </div>

          <div className="journey-list">
            {JOURNEY_MILESTONES.map((item) => (
              <TiltCard key={item.org} className="journey-tilt-wrap">
                <div className="journey-item">
                  <div className="journey-meta">
                    <span className="journey-org">{item.org}</span>
                    <span className="journey-period">{item.period}</span>
                  </div>
                  <div className="journey-content">
                    <h3 className="journey-role">{item.role}</h3>
                    <p className="journey-desc">{item.desc}</p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT & GET IN TOUCH */}
      <section id="contact" className="section contact-section">
        <div className="section-container">
          <div className="contact-grid">
            <div className="contact-info">
              <span className="section-eyebrow">GET IN TOUCH</span>
              <h2 className="contact-title">Let's build something intelligent.</h2>
              <p className="contact-desc">
                Open for AI Engineering roles, research collaborations, and production systems engineering.
              </p>

              <div className="contact-details">
                <button onClick={copyEmailToClipboard} className="contact-detail-item contact-detail-btn">
                  <Mail size={18} /> agrawalvishal804@gmail.com <Copy size={14} className="copy-icon" />
                </button>
                <div className="contact-detail-item">
                  <Compass size={18} /> IIIT Naya Raipur, India
                </div>
              </div>

              <div className="social-links">
                <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="social-btn">
                  <Github size={18} />
                </a>
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="social-btn">
                  <Linkedin size={18} />
                </a>
                <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noreferrer" className="social-btn">
                  <Twitter size={18} />
                </a>
              </div>
            </div>

            <div className="contact-form-container">
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    placeholder="Tell me about your project or opportunity..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  Send Message <Send size={15} />
                </button>
                {contactSent && (
                  <p className="contact-success-msg">
                    <CheckCircle2 size={15} /> Message sent directly to agrawalvishal804@gmail.com!
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <VALogo size={28} />
            <span>Vishal Agrawal</span>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} Vishal Agrawal. Engineered with intent.
          </p>
          <div className="footer-links">
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noreferrer">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =================================================================
   CSS STYLESHEET (SINGLE Unified Warm Amber & Obsidian System)
================================================================= */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

html, body, #root {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  min-height: 100vh !important;
  background-color: #09090b !important;
  overflow-x: hidden;
}

/* -------- COLOR SYSTEM TOKENS -------- */
.portfolio-root {
  --bg: #09090b;
  --bg-elevated: #121215;
  --card-bg: #16161a;
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);
  --text: #fafafa;
  --text-muted: #a1a1aa;
  --text-dim: #71717a;
  --accent: #f59e0b;
  --accent-soft: rgba(245, 158, 11, 0.12);
  --accent-glow: rgba(245, 158, 11, 0.25);
  
  background-color: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.portfolio-root.theme-light {
  --bg: #faf9f6;
  --bg-elevated: #ffffff;
  --card-bg: #ffffff;
  --border: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.18);
  --text: #18181b;
  --text-muted: #52525b;
  --text-dim: #a1a1aa;
  --accent: #d97706;
  --accent-soft: rgba(217, 119, 6, 0.1);
  --accent-glow: rgba(217, 119, 6, 0.18);
}

.portfolio-root * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* -------- 3D TILT WRAPPERS -------- */
.philosophy-card-tilt-wrap, .project-tilt-wrap, .journey-tilt-wrap {
  width: 100%;
  transform-style: preserve-3d;
}

/* -------- TOAST NOTIFICATION -------- */
.toast-container {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  background: var(--bg-elevated);
  border: 1px solid var(--accent);
  color: var(--text);
  padding: 10px 20px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 500;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}
.toast-icon { color: var(--accent); }

/* -------- COMMAND PALETTE -------- */
.palette-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

.palette-modal {
  width: 100%;
  max-width: 600px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-strong);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5);
}

.palette-search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
}

.palette-search-icon { color: var(--accent); }

.palette-search-bar input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--text);
  font-family: inherit;
}

.palette-kbd {
  font-size: 11px;
  font-weight: 700;
  background: var(--card-bg);
  border: 1px solid var(--border);
  padding: 3px 8px;
  border-radius: 6px;
  color: var(--text-dim);
}

.palette-list {
  max-height: 340px;
  overflow-y: auto;
  padding: 8px;
}

.palette-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-dim);
  font-size: 14px;
}

.palette-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 10px;
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}

.palette-item:hover {
  background: var(--accent-soft);
}

.palette-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.palette-item-cat {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--card-bg);
  padding: 2px 8px;
  border-radius: 4px;
}

.palette-item-label {
  font-size: 14px;
  font-weight: 500;
}

.palette-item-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.palette-item-hint {
  font-size: 12px;
  color: var(--text-dim);
}

.palette-enter-icon {
  color: var(--text-dim);
  opacity: 0.6;
}

.palette-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  background: var(--card-bg);
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-dim);
}

.palette-footer kbd {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--accent);
}

/* -------- LIVE STATUS PILL IN NAVBAR -------- */
.live-status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-soft);
  border: 1px solid var(--accent);
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.live-status-pill:hover {
  transform: scale(1.03);
}

.status-dot-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: pulseDot 1.8s infinite;
}

@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.6; }
}

.status-text {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent);
}

@media (max-width: 1024px) {
  .live-status-pill { display: none; }
}

/* -------- SPLASH SCREEN OPENING ANIMATION -------- */
.splash-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1200px;
}

.splash-ambient-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 350px;
  background: radial-gradient(ellipse at center, var(--accent-soft), transparent 70%);
  pointer-events: none;
  opacity: 0.8;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  padding: 24px;
  position: relative;
  z-index: 2;
}

.splash-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 40px var(--accent-glow));
}

.splash-name {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(28px, 5.5vw, 52px);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text);
  overflow: hidden;
}

.splash-letter {
  display: inline-block;
  transform-origin: center bottom;
  text-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

.splash-slogan {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.22em;
  color: var(--accent);
  text-transform: uppercase;
}

.slogan-text-glow {
  text-shadow: 0 0 10px var(--accent-glow);
}

.splash-slogan-line {
  width: 36px;
  height: 1px;
  background: var(--accent);
  opacity: 0.6;
}

.splash-progress-track {
  width: 240px;
  height: 2px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 14px;
}

.splash-progress-bar {
  height: 100%;
  background: var(--accent);
  box-shadow: 0 0 16px var(--accent);
}

/* -------- CURSOR -------- */
.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
}

.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
}

@media (hover: none) {
  .cursor-dot, .cursor-ring { display: none; }
}

/* -------- NAVBAR -------- */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(9, 9, 11, 0.75);
  border-bottom: 1px solid var(--border);
  transition: background 0.3s;
}
.theme-light .navbar {
  background: rgba(250, 249, 246, 0.8);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
}

.brand-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.brand-name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.02em;
}

.brand-sub {
  font-size: 11px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-links button {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-links button:hover {
  color: var(--text);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.icon-toggle:hover {
  color: var(--accent);
  border-color: var(--accent);
}

/* -------- BUTTONS -------- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--accent);
  color: #000000;
  box-shadow: 0 4px 20px var(--accent-glow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px var(--accent-glow);
}

.btn-secondary {
  background: var(--bg-elevated);
  border-color: var(--border-strong);
  color: var(--text);
}

.btn-secondary:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.btn-ghost:hover {
  color: var(--text);
  border-color: var(--accent);
  background: var(--accent-soft);
}

.btn-nav {
  padding: 8px 16px;
  font-size: 13px;
  background: var(--bg-elevated);
  border-color: var(--border);
  color: var(--text);
}

.btn-nav:hover {
  border-color: var(--accent);
}

.btn-full {
  width: 100%;
  justify-content: center;
}

/* -------- HERO SECTION -------- */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 140px 24px 80px;
}

.hero-background-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse at center, var(--accent-soft), transparent 70%);
  pointer-events: none;
  opacity: 0.6;
}

.hero-container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--accent);
  margin-bottom: 24px;
}

.eyebrow-divider {
  opacity: 0.4;
}

.hero-headline {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(42px, 7.5vw, 84px);
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 24px;
}

.text-gradient {
  background: linear-gradient(135deg, var(--text) 30%, var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-role-wrapper {
  height: 36px;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.hero-role-text {
  font-size: clamp(18px, 2.5vw, 24px);
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.hero-subtext {
  font-size: 17px;
  line-height: 1.65;
  color: var(--text-muted);
  max-width: 640px;
  margin: 0 auto 40px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* -------- SECTIONS & LAYOUT -------- */
.section {
  padding: 120px 24px;
}

.section-container {
  max-width: 1100px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 64px;
  text-align: left;
}

.section-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--accent);
  display: block;
  margin-bottom: 12px;
}

.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(32px, 4.5vw, 48px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 16px;
}

.section-desc {
  font-size: 17px;
  color: var(--text-muted);
  max-width: 620px;
  line-height: 1.6;
}

/* -------- CORE EXPERTISE SECTION -------- */
.expertise-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
}

.expertise-row {
  display: grid;
  grid-template-columns: 280px 1fr;
  align-items: center;
  gap: 32px;
  padding: 32px 16px;
  border-bottom: 1px solid var(--border);
  border-radius: 8px;
  transition: background 0.25s, padding-left 0.25s;
}

.expertise-row:hover {
  background: var(--accent-soft);
  padding-left: 24px;
}

.expertise-category {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.02em;
}

.expertise-skills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
}

.expertise-skill-item {
  font-size: 16px;
  color: var(--text-muted);
  font-weight: 400;
  letter-spacing: -0.01em;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  transition: color 0.2s;
}

.expertise-row:hover .expertise-skill-item {
  color: var(--text);
}

.expertise-bullet {
  color: var(--accent);
  opacity: 0.6;
  font-size: 12px;
}

@media (max-width: 768px) {
  .expertise-row {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 24px 8px;
  }
}

/* -------- FLAGSHIP PROJECTS SHOWCASE -------- */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 96px;
}

.project-product-page {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 44px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  transition: border-color 0.3s;
}

.project-product-page:hover {
  border-color: var(--border-strong);
}

.project-meta-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.project-number-badge {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 6px 14px;
  border-radius: 8px;
}

.project-title-group {
  flex: 1;
}

.project-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.project-tagline {
  font-size: 15px;
  color: var(--text-muted);
  margin-top: 4px;
}

.project-github-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: all 0.2s;
}

.project-github-link:hover {
  color: var(--text);
  border-color: var(--accent);
}

.project-banner-container {
  position: relative;
  width: 100%;
  height: 380px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 40px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
}

.project-banner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6));
  pointer-events: none;
}

.project-banner-badge {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* WAVEFORM ANIMATION FOR SANJEEVANI */
.waveform-bar-wrap {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(8px);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--border);
}
.waveform-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.05em;
}
.waveform-bars {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 16px;
}
.waveform-bars span {
  width: 3px;
  background: var(--accent);
  border-radius: 2px;
  animation: wavePulse 1.2s ease-in-out infinite alternate;
}
@keyframes wavePulse {
  0% { transform: scaleY(0.2); opacity: 0.4; }
  100% { transform: scaleY(1.2); opacity: 1; }
}

.project-story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
}

.story-block {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.story-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent);
  text-transform: uppercase;
}

.story-text {
  font-size: 14.5px;
  color: var(--text-muted);
  line-height: 1.65;
}

/* INTERACTIVE ARCHITECTURE PIPELINE */
.interactive-arch-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.arch-steps-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.arch-step-interactive {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.arch-step-interactive:hover {
  border-color: var(--border-strong);
}

.arch-step--active {
  border-color: var(--accent) !important;
  background: var(--accent-soft);
}

.arch-step-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.arch-num {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
}

.arch-stage {
  font-size: 13px;
  font-weight: 600;
}

.arch-tech {
  font-size: 11.5px;
  color: var(--text-dim);
}

.arch-detail-box {
  background: var(--bg-elevated);
  border: 1px solid var(--accent);
  padding: 16px;
  border-radius: 12px;
}

.arch-detail-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent);
  display: block;
  margin-bottom: 4px;
}

.arch-detail-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.arch-detail-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

.results-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.results-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-muted);
}

.text-accent {
  color: var(--accent);
}

.project-tech-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}

.tech-footer-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-dim);
}

.tech-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-pill {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.project-action-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.project-action-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  transition: all 0.2s;
}

.project-action-link:hover {
  color: var(--text);
  border-color: var(--accent);
  background: var(--accent-soft);
}

/* -------- UPCOMING PROJECTS SECTION -------- */
.upcoming-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.upcoming-tilt-wrap {
  width: 100%;
  transform-style: preserve-3d;
}

.upcoming-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.upcoming-card:hover {
  border-color: var(--border-strong);
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}

.upcoming-card-header {
  margin-bottom: 20px;
}

.upcoming-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid;
  background: var(--accent-soft);
}

.upcoming-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}

.upcoming-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 16px;
}

.upcoming-desc {
  font-size: 14.5px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 28px;
  flex: 1;
}

.upcoming-tech-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.upcoming-tech-pill {
  font-size: 11.5px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  color: var(--text-dim);
}

/* -------- JOURNEY SECTION -------- */
.journey-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.journey-item {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
  padding: 32px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  transition: border-color 0.3s;
}

.journey-item:hover {
  border-color: var(--accent);
}

.journey-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.journey-org {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 17px;
  font-weight: 700;
}

.journey-period {
  font-size: 13px;
  color: var(--accent);
  font-weight: 500;
}

.journey-role {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.journey-desc {
  font-size: 14.5px;
  color: var(--text-muted);
  line-height: 1.6;
}

/* -------- CONTACT SECTION -------- */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 64px;
  align-items: start;
}

.contact-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 16px;
}

.contact-desc {
  font-size: 16px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 36px;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 36px;
}

.contact-detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  font-size: 15px;
  text-decoration: none;
  transition: color 0.2s;
}

.contact-detail-btn {
  background: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
}

.contact-detail-item:hover {
  color: var(--accent);
}

.copy-icon {
  opacity: 0.6;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
}

.social-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
  transform: translateY(-2px);
}

.contact-form-container {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
}

.form-group input, .form-group textarea {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text);
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus, .form-group textarea:focus {
  border-color: var(--accent);
}

.contact-success-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: var(--accent);
  margin-top: 8px;
}

/* -------- FOOTER -------- */
.footer {
  border-top: 1px solid var(--border);
  padding: 48px 24px;
  background: var(--bg-elevated);
}

.footer-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
}

.footer-copy {
  font-size: 13.5px;
  color: var(--text-dim);
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: var(--text-dim);
  text-decoration: none;
  font-size: 13.5px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--accent);
}

/* -------- RESPONSIVE MEDIA QUERIES -------- */
@media (max-width: 860px) {
  .nav-links { display: none; }
  .project-product-page { padding: 24px; }
  .project-banner-container { height: 240px; }
  .journey-item { grid-template-columns: 1fr; gap: 12px; }
  .contact-grid { grid-template-columns: 1fr; }
}
`;