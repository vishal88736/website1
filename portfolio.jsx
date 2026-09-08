import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useInView,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Menu,
  Plus,
  X,
  Sun,
  Moon,
  Send,
  Terminal,
  Brain,
  Cpu,
  Eye,
  Server,
  Code2,
  GitBranch,
} from "lucide-react";
import {
  projects,
  expertise,
  upcoming,
  milestones,
  links,
} from "./src/data/portfolio";
import { stopSmooth, startSmooth } from "./src/components/SmoothScroll";
import "./src/styles/portfolio.css";

const EMAIL = links.email.replace("mailto:", "");
const ROLES = [
  "AI Engineer",
  "Machine Learning Engineer",
  "Generative AI Developer",
  "Intelligent Systems Architect",
];
const NAVIGATION = [
  ["work", "Work"],
  ["upcoming", "Upcoming"],
  ["about", "About"],
  ["recognition", "Recognition"],
];
const MARQUEE_ITEMS = [
  "ML Systems",
  "Deep Learning",
  "RAG Pipelines",
  "Agentic AI",
  "LLM Apps",
  "LLMOps",
  "Multilingual Voice AI",
  "Vector Search",
  "AST Knowledge Graphs",
  "FastAPI",
];
const GLOBE_STACK = ["ML", "DL", "RAG", "Agentic AI", "LLM", "LLMOps"];
const EXPERTISE_ICONS = {
  "Artificial Intelligence": Brain,
  "Machine Learning": Cpu,
  "Computer Vision": Eye,
  "Backend & Cloud": Server,
  Languages: Code2,
  "Tools & Ecosystem": GitBranch,
};
const EASE = [0.22, 1, 0.36, 1];

/* ============================== hooks ============================== */

function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "dark",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("va-theme", theme);
    } catch {
      /* private mode — theme simply won't persist */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "light" ? "#f2eee3" : "#070907";
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}

function useScrolled(offset = 16) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

function useFinePointer() {
  const [fine] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: fine)").matches,
  );
  return fine;
}

function useCountUp(
  target,
  { decimals = 0, duration = 1500, started = true } = {},
) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!started) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started, reduced]);
  return value.toFixed(decimals);
}

/* ====================== motion primitives ====================== */

function Reveal({ children, className = "", delay = 0, y = 28 }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Magnetic({ children, strength = 7 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  function onMove(event) {
    if (reduced || !fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = event.clientX - (r.left + r.width / 2);
    const y = event.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }
  return (
    <span
      ref={ref}
      className="magnetic"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        display: "inline-flex",
        transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </span>
  );
}

/** Card wrapper: cursor spotlight + subtle 3D tilt (fine pointers only). */
function TiltCard({ children, className = "", max = 4 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  function onMove(event) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (event.clientX - r.left) / r.width;
    const py = (event.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--sx", `${px * 100}%`);
    if (reduced || !fine) return;
    el.style.transform = `translateY(-4px) perspective(1100px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }
  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  );
}

/* ============================== loader ============================== */

function Loader({ onDone }) {
  const [count, setCount] = useState(0);
  const done = useRef(false);
  function finish() {
    if (done.current) return;
    done.current = true;
    onDone();
  }
  useEffect(() => {
    let raf;
    const duration = 1250;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setCount(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(finish, 220);
      }
    };
    raf = requestAnimationFrame(tick);
    function onKey(event) {
      if (event.key === "Escape") finish();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <motion.div
      className="loader"
      onClick={finish}
      role="status"
      aria-label="Loading portfolio"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="loader-inner"
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.35, ease: "easeIn" }}
      >
        <div className="loader-mark">
          va<span>.</span>
        </div>
        <div className="loader-name">VISHAL AGRAWAL — PORTFOLIO</div>
        <div className="loader-count">
          {String(count).padStart(3, "0")} / 100
        </div>
        <div className="loader-bar">
          <i style={{ transform: `scaleX(${count / 100})` }} />
        </div>
        <div className="loader-hint">CLICK ANYWHERE TO SKIP</div>
      </motion.div>
    </motion.div>
  );
}

/* ============================ cursor aura ============================ */

function CursorAura() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  useEffect(() => {
    if (reduced || !fine || !ref.current) return;
    const el = ref.current;
    let x = -500;
    let y = -500;
    let tx = x;
    let ty = y;
    let raf;
    let shown = false;
    function onMove(event) {
      tx = event.clientX;
      ty = event.clientY;
      if (!shown) {
        shown = true;
        el.classList.add("is-visible");
      }
    }
    function loop() {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced, fine]);
  if (reduced || !fine) return null;
  return <div ref={ref} className="cursor-aura" aria-hidden="true" />;
}

/* ============================ theme toggle ============================ */

function ThemeToggle({ theme, onToggle }) {
  const dark = theme !== "light";
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={!dark}
      title={dark ? "Light mode" : "Dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -70, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 70, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.3, ease: EASE }}
          style={{ display: "inline-flex" }}
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* ===================== local time + side rails ===================== */

function LocalTime({ showSeconds = true }) {
  const reduced = useReducedMotion();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), reduced ? 30000 : 1000);
    return () => clearInterval(id);
  }, [reduced]);
  const withSeconds = showSeconds && !reduced;
  const formatted = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    ...(withSeconds ? { second: "2-digit" } : {}),
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(now);
  return <>{formatted}</>;
}

function SideRails() {
  const year = new Date().getFullYear();
  return (
    <>
      <span className="side-rail left" aria-hidden="true">
        VISHAL AGRAWAL — PORTFOLIO © {year}
      </span>
      <span className="side-rail right" aria-hidden="true">
        AI ENGINEER — NEW RAIPUR, IN
      </span>
    </>
  );
}

/* ========================= hero particle field ========================= */

const FIELD_RGB = { dark: "185,217,176", light: "32,92,55" };

function HeroField({ theme }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rgb = FIELD_RGB[theme] || FIELD_RGB.dark;
    let raf;
    let running = true;
    let points = [];
    const mouse = { x: -9999, y: -9999 };
    const parent = canvas.parentElement;

    function seed() {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(1.75, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(
        28,
        Math.min(90, Math.floor((rect.width * rect.height) / 22000)),
      );
      points = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    }

    function draw() {
      const rect = parent.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        const dxm = mouse.x - p.x;
        const dym = mouse.y - p.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 170 && dm > 1) {
          p.x += (dxm / dm) * 0.5;
          p.y += (dym / dm) * 0.5;
        }
        if (p.x < 0 || p.x > rect.width) p.vx *= -1;
        if (p.y < 0 || p.y > rect.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(rect.width, p.x));
        p.y = Math.max(0, Math.min(rect.height, p.y));
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${rgb},${((1 - d / 130) * 0.32).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of points) {
        ctx.fillStyle = `rgba(${rgb},0.75)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onPointer(event) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    }

    seed();
    if (reduced) {
      draw();
    } else {
      loop();
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);
    window.addEventListener("resize", seed);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", seed);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [theme, reduced]);

  return <canvas ref={ref} className="hero-field" aria-hidden="true" />;
}

/* ========================= neural sculpture ========================= */

function NeuralSculpture() {
  const rings = Array.from({ length: 23 }, (_, i) => {
    const latitude = (i / 22) * Math.PI;
    const r = 157 * Math.sin(latitude);
    return { cy: 250 + 157 * Math.cos(latitude), r };
  });
  return (
    <div className="neural-sculpture" aria-hidden="true">
      <div className="orb-halo" />
      <div className="sculpture-coordinate mono">FIG. 001 / LATENT SPACE</div>
      <svg className="orbital-art" viewBox="0 0 520 520" fill="none">
        <defs>
          <radialGradient id="sphere-light">
            <stop offset="0" className="orb-glow-stop" stopOpacity="0.12" />
            <stop offset="1" className="orb-glow-stop" stopOpacity="0" />
          </radialGradient>
          <linearGradient
            id="orbit-stroke"
            x1="50"
            y1="70"
            x2="450"
            y2="440"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" className="orb-stroke-stop" stopOpacity="0.85" />
            <stop
              offset="0.48"
              className="orb-stroke-stop"
              stopOpacity="0.18"
            />
            <stop offset="1" className="orb-stroke-stop" stopOpacity="0.7" />
          </linearGradient>
          <style>
            {`.orb-glow-stop{stop-color:var(--accent)}.orb-stroke-stop{stop-color:var(--accent)}.orb-ring{stroke:var(--viz-dim)}.orb-faint{stroke:var(--viz-faint)}.orb-dot{fill:var(--accent)}.orb-cross{stroke:var(--viz-faint)}`}
          </style>
        </defs>
        <path
          d="M260 30V490M30 250H490"
          className="orb-faint"
          strokeOpacity="0.35"
          strokeDasharray="2 7"
        />
        <circle
          cx="260"
          cy="250"
          r="209"
          className="orb-faint"
          strokeOpacity="0.3"
        />
        <circle cx="260" cy="250" r="190" fill="url(#sphere-light)" />
        <g
          className="orb-ring"
          stroke="url(#orbit-stroke)"
          strokeWidth="0.9"
          transform="rotate(-28 260 250)"
        >
          {rings.map((ring, i) => (
            <ellipse
              key={i}
              cx="260"
              cy={ring.cy}
              rx={ring.r}
              ry={ring.r * 0.25}
            />
          ))}
          {Array.from({ length: 11 }, (_, i) => (
            <ellipse
              key={`v${i}`}
              cx="260"
              cy="250"
              rx={16 + i * 14}
              ry="157"
            />
          ))}
        </g>
        <g transform="rotate(-28 260 250)">
          <ellipse
            cx="260"
            cy="250"
            rx="242"
            ry="64"
            stroke="url(#orbit-stroke)"
            strokeWidth="1"
          />
          <ellipse
            cx="260"
            cy="250"
            rx="218"
            ry="79"
            className="orb-ring"
            strokeOpacity="0.5"
          />
          <circle cx="502" cy="250" r="3" className="orb-dot" />
        </g>
        <g className="orbit-traveler">
          <circle cx="260" cy="41" r="3" className="orb-dot" />
          <circle
            cx="260"
            cy="41"
            r="9"
            className="orb-ring"
            strokeOpacity="0.5"
          />
        </g>
        <path
          d="M84 85h8m-4-4v8M422 422h8m-4-4v8"
          className="orb-cross"
          strokeOpacity="0.8"
        />
      </svg>
      <div className="sculpture-caption mono">
        <span>FROM COMPLEXITY</span>
        <span>
          TO INTELLIGENCE <ArrowUpRight size={12} />
        </span>
      </div>
    </div>
  );
}

/* ========================= project visuals ========================= */

function ProjectVisual({ kind }) {
  if (kind === "sanjeevani")
    return (
      <div
        className="project-visual voice-visual"
        aria-label="Conceptual visualization of Sanjeevani's voice-to-triage pipeline"
      >
        <div className="visual-topline mono">
          <span>
            <span className="tiny-cross">+</span> SANJEEVANI / VOICE
            INTELLIGENCE
          </span>
          <span>PIPELINE STUDY</span>
        </div>
        <div className="voice-center">
          <span className="mono">MANY LANGUAGES. ONE POINT OF CARE.</span>
          <div className="waveform" aria-hidden="true">
            {Array.from({ length: 73 }, (_, i) => (
              <i
                key={i}
                style={{
                  "--bar-height": `${12 + Math.abs(Math.sin(i * 1.8) * Math.sin(i * 0.14)) * 105}px`,
                  "--delay": `${i * -0.085}s`,
                }}
              />
            ))}
          </div>
          <div className="voice-label">
            <span className="status-dot pulse" />
            Voice in. Understanding out.
          </div>
        </div>
        <div className="pipeline mono">
          <span>Speech</span>
          <ArrowRight size={13} />
          <span>Translation</span>
          <ArrowRight size={13} />
          <span>Retrieval</span>
          <ArrowRight size={13} />
          <span className="accent">Triage</span>
        </div>
        <div className="visual-sheen" aria-hidden="true" />
      </div>
    );
  if (kind === "codrix")
    return (
      <div
        className="project-visual code-visual"
        aria-label="Conceptual visualization of Codrix's source-to-knowledge-graph architecture"
      >
        <div className="visual-topline mono">
          <span>CODRIX.AI / REPOSITORY INTELLIGENCE</span>
          <span>ARCHITECTURE STUDY</span>
        </div>
        <div className="code-composition">
          <div className="code-snippet">
            <span className="code-file">source / pipeline.py</span>
            <div>
              <b>01</b> <em>def</em> understand(repo):
            </div>
            <div>
              <b>02</b> &nbsp; tree = parse(repo)
            </div>
            <div>
              <b>03</b> &nbsp; graph = map(tree)
            </div>
            <div>
              <b>04</b> &nbsp; <em>return</em> query(graph)
            </div>
            <span className="code-comment">// structure becomes context</span>
          </div>
          <svg
            className="code-graph"
            viewBox="0 0 300 235"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="edge"
              d="M48 118L145 45L254 85M48 118L151 130L254 85M151 130L241 192M48 118L116 202L241 192M145 45L151 130L116 202"
            />
            {[
              [48, 118],
              [145, 45],
              [254, 85],
              [151, 130],
              [241, 192],
              [116, 202],
            ].map(([x, y], i) => (
              <g key={i} className={i === 3 ? "node-pulse" : undefined}>
                <circle
                  cx={x}
                  cy={y}
                  r={i === 3 ? 19 : 10}
                  className={i === 3 ? "node node-core" : "node"}
                  strokeWidth={i === 3 ? 1.5 : 1}
                />
                <circle cx={x} cy={y} r="3" className="dot" />
              </g>
            ))}
            <text x="167" y="40">
              AST
            </text>
            <text x="176" y="132">
              symbol
            </text>
            <text x="125" y="225">
              dependency
            </text>
          </svg>
        </div>
        <div className="visual-bottom mono">
          <span>PARSE. CONNECT. UNDERSTAND.</span>
          <span>Tree-sitter / FAISS / LangChain</span>
        </div>
        <div className="visual-sheen" aria-hidden="true" />
      </div>
    );
  if (kind === "careertrajectory")
    return (
      <div
        className="project-visual talent-visual"
        aria-label="Conceptual multi-agent talent analysis diagram"
      >
        <div className="visual-topline mono">
          <span>MULTI-AGENT ANALYSIS</span>
          <span>03</span>
        </div>
        <div className="talent-diagram">
          <div className="talent-input">
            Candidate
            <br />
            <span className="quiet">beyond the keywords</span>
          </div>
          <div className="agent-lines">
            {["Skills & depth", "Learning trajectory", "Project evidence"].map(
              (label, i) => (
                <div key={label}>
                  <span className="mono">0{i + 1}</span>
                  <span>{label}</span>
                  <ArrowUpRight size={15} />
                </div>
              ),
            )}
          </div>
        </div>
        <div className="visual-bottom mono">
          EVIDENCE IN. EXPLAINABLE INSIGHT OUT.
        </div>
        <div className="visual-sheen" aria-hidden="true" />
      </div>
    );
  if (kind === "cottonfield")
    return (
      <div
        className="project-visual field-visual"
        aria-label="Conceptual orthomosaic patch tiling visualization, not actual field data"
      >
        <div className="visual-topline mono">
          <span>ORTHOMOSAIC / PATCH ANALYSIS</span>
          <span>04</span>
        </div>
        <div className="field-grid" aria-hidden="true">
          {Array.from({ length: 84 }, (_, i) => (
            <i
              key={i}
              style={{ "--tile-opacity": 0.12 + ((i * 17 + 3) % 13) / 24 }}
            />
          ))}
          <div className="field-focus">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="visual-bottom mono">
          <span>RESTORE / CLASSIFY / MAP</span>
          <span>CONCEPT STUDY</span>
        </div>
        <div className="visual-sheen" aria-hidden="true" />
      </div>
    );
  if (kind === "alpaca")
    return (
      <div
        className="project-visual trading-visual"
        aria-label="Conceptual visualization of the agentic paper-trading workflow"
      >
        <div className="visual-topline mono">
          <span>SIGNAL/TERMINAL / PAPER TRADING</span>
          <span>AGENTIC WORKFLOW</span>
        </div>
        <div className="trading-composition">
          <div className="trading-chart" aria-hidden="true">
            <svg viewBox="0 0 260 120" fill="none">
              <path
                className="chart-line"
                d="M8 92 L38 78 L62 84 L92 58 L118 66 L148 38 L176 48 L205 22 L236 30 L252 14"
              />
              <path
                className="chart-area"
                d="M8 92 L38 78 L62 84 L92 58 L118 66 L148 38 L176 48 L205 22 L236 30 L252 14 L252 120 L8 120 Z"
              />
              {[92, 148, 205].map((x, i) => (
                <g key={x}>
                  <circle cx={x} cy={[58, 38, 22][i]} r="4" className="dot" />
                  <circle
                    cx={x}
                    cy={[58, 38, 22][i]}
                    r="9"
                    className="pulse-ring"
                  />
                </g>
              ))}
            </svg>
            <div className="trading-ticker mono">
              <span className="up">PAPER</span>
              <span>ALPACA API</span>
              <span className="risk">RISK-GATED</span>
            </div>
          </div>
          <div className="trading-flow mono">
            <span>Strategy</span>
            <ArrowRight size={12} />
            <span>LLM intent</span>
            <ArrowRight size={12} />
            <span className="accent">Risk engine</span>
            <ArrowRight size={12} />
            <span>Broker</span>
          </div>
          <div className="trading-agents">
            <span className="mono">5 STRATEGY AGENTS</span>
            <span className="mono">DECISION LOG</span>
          </div>
        </div>
        <div className="visual-bottom mono">
          <span>SIGNAL → INTENT → APPROVE / REJECT</span>
          <span>DASHBOARD STUDY</span>
        </div>
        <div className="visual-sheen" aria-hidden="true" />
      </div>
    );
  if (kind === "finance")
    return (
      <div
        className="project-visual finance-visual"
        aria-label="Conceptual visualization of deterministic reconciliation with agentic investigation"
      >
        <div className="visual-topline mono">
          <span>FINANCE CONTROLLER / RECONCILIATION</span>
          <span>PYTHON TRUTH × AI REASONING</span>
        </div>
        <div className="finance-composition">
          <div className="finance-sources mono">
            <span>Ledger</span>
            <span>Bank</span>
            <span>Processor</span>
          </div>
          <div className="finance-engine">
            <span className="mono">DETERMINISTIC PYTHON ENGINE</span>
            <div className="finance-bar" aria-hidden="true">
              <i style={{ "--w": "82%" }} />
            </div>
            <span className="mono quiet">Decimal · tolerance · duplicates</span>
          </div>
          <div className="finance-outcome mono">
            <span>
              <Check size={12} /> matched with evidence
            </span>
            <span>
              <Check size={12} /> exceptions queued
            </span>
            <span>
              <Check size={12} /> audit trail sealed
            </span>
          </div>
        </div>
        <div className="visual-bottom mono">
          <span>PYTHON COMPUTES · AI ROUTES &amp; EXPLAINS</span>
          <span>THREAD-SCOPED</span>
        </div>
        <div className="visual-sheen" aria-hidden="true" />
      </div>
    );
  return (
    <div
      className="project-visual field-visual"
      aria-label="Conceptual project visualization"
    >
      <div className="visual-topline mono">
        <span>PROJECT STUDY</span>
        <span>—</span>
      </div>
      <div className="voice-center">
        <span className="mono">EXPLORE THE CASE FILE</span>
      </div>
      <div className="visual-sheen" aria-hidden="true" />
    </div>
  );
}

/* ============================ stat ============================ */

function Stat({
  prefix = "",
  value,
  decimals = 0,
  suffix = "",
  label,
  started,
}) {
  const display = useCountUp(value, { decimals, started });
  return (
    <div className="stat">
      <div className="stat-value">
        {prefix}
        {display}
        <em>{suffix}</em>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ========================= project cards ========================= */

function FeaturedProject({ project, index, onOpen }) {
  const heading = (
    <>
      <p className="eyebrow">
        <span className="section-index">{project.number} /</span>
        {project.category}
      </p>
      <h3>
        <button onClick={() => onOpen(project)}>
          {project.title}
          <ArrowUpRight />
        </button>
      </h3>
      <p className="project-tagline">{project.tagline}</p>
      <p className="project-description">{project.summary}</p>
    </>
  );
  const chips = (
    <div className="chip-row">
      {project.story.techStack.slice(0, 4).map((tech) => (
        <span className="stack-chip" key={tech}>
          {tech}
        </span>
      ))}
    </div>
  );
  const outcomes = (
    <ul className="result-list">
      {project.story.results.map((result) => (
        <li key={result}>
          <Check size={15} />
          {result}
        </li>
      ))}
    </ul>
  );
  const award =
    project.id === "sanjeevani" ? (
      <div className="project-note">
        <span className="tiny-cross">+</span> 1st Place / AI Durg &amp; Gemma 4
        Hackathon
      </div>
    ) : null;
  const openLink = (
    <div>
      <button className="text-link" onClick={() => onOpen(project)}>
        Inside the project
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
  return (
    <Reveal>
      <TiltCard
        className={`featured-project ${index % 2 === 1 ? "project-reverse" : ""}`}
      >
        <div className="visual-col">
          <button
            className="visual-button"
            onClick={() => onOpen(project)}
            aria-label={`Explore ${project.title} case study`}
          >
            <ProjectVisual kind={project.id} />
            <span className="visual-open">
              View case <ArrowUpRight size={14} />
            </span>
          </button>
        </div>
        <div className="project-copy">
          {heading}
          {chips}
          {outcomes}
          {award}
          {openLink}
        </div>
      </TiltCard>
    </Reveal>
  );
}

function SupportingProject({ project, onOpen }) {
  return (
    <Reveal>
      <TiltCard className="supporting-project" max={3}>
        <div>
          <button
            className="visual-button"
            onClick={() => onOpen(project)}
            aria-label={`Explore ${project.title} case study`}
          >
            <ProjectVisual kind={project.id} />
            <span className="visual-open">
              View case <ArrowUpRight size={14} />
            </span>
          </button>
          <div className="supporting-title">
            <div>
              <p className="eyebrow">
                <span className="section-index">{project.number} /</span>
                {project.category}
              </p>
              <h3>
                <button onClick={() => onOpen(project)}>{project.title}</button>
              </h3>
            </div>
            <button
              className="icon-button"
              onClick={() => onOpen(project)}
              aria-label={`Read ${project.title} case study`}
            >
              <ArrowUpRight size={19} />
            </button>
          </div>
          <p
            className="project-tagline"
            style={{ fontSize: "14.5px", marginTop: "6px" }}
          >
            {project.tagline}
          </p>
          <p className="project-description">{project.summary}</p>
          <p className="supporting-highlight">{project.story.results[0]}</p>
          <div className="chip-row">
            {project.story.techStack.slice(0, 4).map((tech) => (
              <span className="stack-chip" key={tech}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

/* ========================= case study ========================= */

function CaseStudy({ project, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      dialog.scrollTop = 0;
    }
    if (!project && dialog.open) dialog.close();
  }, [project]);
  return (
    <dialog
      ref={ref}
      className="case-dialog"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="case-title"
    >
      {project && (
        <div className="case-content">
          <div className="case-header">
            <span className="eyebrow">CASE STUDY / {project.number}</span>
            <button
              className="icon-button"
              onClick={onClose}
              aria-label="Close case study"
              autoFocus
            >
              <X size={20} />
            </button>
          </div>
          <p className="eyebrow accent">{project.category}</p>
          <h2 id="case-title">{project.title}</h2>
          <p className="case-tagline">{project.tagline}</p>
          <ProjectVisual kind={project.id} />
          <div className="case-story">
            <section>
              <h3>The problem</h3>
              <p>{project.story.problem}</p>
            </section>
            <section>
              <h3>The approach</h3>
              <p>{project.story.solution}</p>
            </section>
          </div>
          <section className="case-architecture">
            <h3>Inside the architecture</h3>
            {project.story.architecture.map((step, i) => (
              <div key={step.stage}>
                <span className="mono quiet">0{i + 1}</span>
                <div>
                  <h4>
                    {step.stage} <span>{step.tech}</span>
                  </h4>
                  <p>{step.detail}</p>
                </div>
              </div>
            ))}
          </section>
          <section className="case-challenge">
            <h3>The engineering challenge</h3>
            <p>{project.story.challenge}</p>
          </section>
          <section className="case-results">
            <h3>Project outcomes</h3>
            <ul>
              {project.story.results.map((result) => (
                <li key={result}>
                  <Check size={16} />
                  {result}
                </li>
              ))}
            </ul>
          </section>
          <div className="chip-row">
            {project.story.techStack.map((tech) => (
              <span className="stack-chip" key={tech}>
                {tech}
              </span>
            ))}
          </div>
          <a
            className="button button-primary"
            href={project.github}
            target="_blank"
            rel="noreferrer"
          >
            {project.id === "sanjeevani"
              ? "Explore the source"
              : project.github !== links.github
                ? "View repository"
                : "Visit GitHub profile"}
            <ArrowUpRight size={17} />
          </a>
        </div>
      )}
    </dialog>
  );
}

/* ========================= contact form ========================= */

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
    controller.current = new AbortController();
    const timeout = setTimeout(() => controller.current.abort(), 15000);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          _subject: "Portfolio inquiry",
          _honey: data.get("_honey"),
        }),
        signal: controller.current.signal,
      });
      const result = await response.json();
      if (
        !response.ok ||
        (result.success !== true && result.success !== "true")
      )
        throw new Error("Submission failed");
      setStatus("success");
      form.reset();
      notify("Message sent — I'll get back to you soon.");
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }
  return (
    <div className="contact-form-card">
      <h3>Send a message</h3>
      <p>Currently open to AI engineering roles and research collaborations.</p>
      <form onSubmit={submit}>
        <div className="form-fields">
          <label>
            Your name
            <input
              name="name"
              autoComplete="name"
              placeholder="Jane Sharma"
              required
              maxLength={120}
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              maxLength={254}
            />
          </label>
        </div>
        <label>
          What&apos;s on your mind?
          <textarea
            name="message"
            rows={4}
            placeholder="A role, a research question, or something worth building."
            required
            maxLength={5000}
          />
        </label>
        <input
          className="honeypot"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div className="form-bottom">
          <button
            className="button button-primary"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send message"}
            <Send size={15} />
          </button>
          <p
            className={`form-status${status === "success" ? " is-success" : status === "error" ? " is-error" : ""}`}
            role="status"
          >
            {status === "success"
              ? "Delivered. Thank you for reaching out."
              : status === "error"
                ? "Unable to send. Please use the email link or try again."
                : "Delivered via FormSubmit."}
          </p>
        </div>
      </form>
    </div>
  );
}

/* ============================== portfolio ============================== */

const heroParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
};
const heroChild = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
};

export default function Portfolio() {
  const prefersReduced = useReducedMotion();
  const [theme, baseToggleTheme] = useTheme();
  function toggleTheme() {
    if (prefersReduced) {
      baseToggleTheme();
      return;
    }
    document.documentElement.classList.add("theming");
    baseToggleTheme();
    setTimeout(() => document.documentElement.classList.remove("theming"), 650);
  }
  const [loading, setLoading] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [selectedProject, setSelectedProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const menuButton = useRef(null);
  const toastTimer = useRef(null);
  const copyTimer = useRef(null);
  const scrolled = useScrolled(16);
  const ready = !loading;

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [0, 700], [0, 90]);
  const ghostY = useTransform(scrollY, [0, 700], [0, 150]);
  const ghostOpacity = useTransform(scrollY, [0, 550], [0.45, 0]);

  /* hero depth parallax — cursor layers the composition (fine pointers) */
  const heroMx = useMotionValue(0);
  const heroMy = useMotionValue(0);
  const heroSx = useSpring(heroMx, { stiffness: 55, damping: 18 });
  const heroSy = useSpring(heroMy, { stiffness: 55, damping: 18 });
  const ghostMouseX = useTransform(heroSx, [-0.5, 0.5], [-22, 22]);
  const ghostMouseY = useTransform(heroSy, [-0.5, 0.5], [-12, 12]);
  const orbMouseX = useTransform(heroSx, [-0.5, 0.5], [12, -12]);
  const orbMouseY = useTransform(heroSy, [-0.5, 0.5], [9, -9]);
  function onHeroPointerMove(event) {
    if (prefersReduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    heroMx.set((event.clientX - rect.left) / rect.width - 0.5);
    heroMy.set((event.clientY - rect.top) / rect.height - 0.5);
  }
  function onHeroPointerLeave() {
    heroMx.set(0);
    heroMy.set(0);
  }

  function notify(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4200);
  }

  useEffect(
    () => () => {
      clearTimeout(toastTimer.current);
      clearTimeout(copyTimer.current);
    },
    [],
  );

  /* lock smooth scroll + body scroll while covered */
  const covered = loading || menuOpen || selectedProject !== null;
  useEffect(() => {
    if (covered) {
      stopSmooth();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      startSmooth();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [covered]);

  /* role rotator */
  useEffect(() => {
    if (!ready || prefersReduced) return;
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % ROLES.length),
      2600,
    );
    return () => clearInterval(id);
  }, [ready, prefersReduced]);

  /* active nav section */
  useEffect(() => {
    const ids = ["work", "upcoming", "about", "recognition"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ready]);

  /* mobile menu escape */
  useEffect(() => {
    if (!menuOpen) return;
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      notify("Email address copied to clipboard.");
    } catch {
      notify("Could not copy — please use the email link.");
    }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 3500);
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AnimatePresence>
        {loading && <Loader key="loader" onDone={() => setLoading(false)} />}
      </AnimatePresence>
      <div className="aurora" aria-hidden="true">
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />
      </div>
      <CursorAura />
      <SideRails />

      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="header-inner">
          <a
            className="wordmark"
            href="#top"
            aria-label="Vishal Agrawal, back to top"
          >
            va<span>.</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {NAVIGATION.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={activeSection === id ? "is-active" : ""}
                aria-current={activeSection === id ? "true" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <a href="#contact" className="nav-cta">
              Let&apos;s talk <ArrowUpRight size={15} />
            </a>
            <button
              ref={menuButton}
              className="mobile-menu-button icon-button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
        <motion.div className="scroll-progress" style={{ scaleX: progress }} />
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-nav"
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {[...NAVIGATION, ["contact", "Contact"]].map(([id, label], i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.06 * i + 0.08,
                    duration: 0.4,
                    ease: EASE,
                  }}
                >
                  <span>
                    <small>0{i + 1} — </small>
                    {label}
                  </span>
                  <ArrowUpRight size={26} />
                </motion.a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main">
        <section
          className="hero section-shell"
          id="top"
          onPointerMove={onHeroPointerMove}
          onPointerLeave={onHeroPointerLeave}
        >
          <div className="hero-bg" aria-hidden="true">
            <HeroField theme={theme} />
            <div className="hero-grid" />
            <div className="hero-glow" />
          </div>
          <motion.span
            className="hero-name-ghost"
            aria-hidden="true"
            style={
              prefersReduced ? undefined : { y: ghostY, opacity: ghostOpacity }
            }
          >
            <motion.span
              className="hero-name-ghost-inner"
              style={
                prefersReduced ? undefined : { x: ghostMouseX, y: ghostMouseY }
              }
            >
              AGRAWAL
            </motion.span>
          </motion.span>
          <div className="hero-main">
            <motion.div
              className="hero-copy"
              variants={heroParent}
              initial="hidden"
              animate={ready ? "show" : "hidden"}
            >
              <motion.div className="eyebrow hero-intro" variants={heroChild}>
                <span className="short-rule" />
                VISHAL AGRAWAL <span className="quiet">/ AI ENGINEER</span>
              </motion.div>
              <motion.h1 className="hero-title" variants={heroChild}>
                <span className="line-mask">Intelligence,</span>
                <span className="line-mask serif">engineered.</span>
              </motion.h1>
              <motion.div className="role-rotator" variants={heroChild}>
                <Terminal size={14} />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    className="role-word"
                    key={ROLES[roleIndex]}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {ROLES[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
              <motion.p className="hero-description" variants={heroChild}>
                I build intelligent systems that bridge
                <br className="desktop-break" /> research and the real world.
              </motion.p>
              <motion.div variants={heroChild}>
                <span className="hero-current">
                  <span className="status-dot pulse" />
                  Looking for an opportunity to explore
                </span>
              </motion.div>
              <motion.div className="hero-actions" variants={heroChild}>
                <Magnetic>
                  <a className="button button-primary" href="#work">
                    Explore my work
                    <ArrowDown size={16} />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    className="button button-ghost"
                    href={links.resume}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View resume
                    <ArrowUpRight size={15} />
                  </a>
                </Magnetic>
              </motion.div>
            </motion.div>
            <motion.div
              className="hero-visual"
              style={prefersReduced ? undefined : { y: orbY }}
              initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
              animate={ready ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <motion.div
                className="hero-visual-inner"
                style={
                  prefersReduced ? undefined : { x: orbMouseX, y: orbMouseY }
                }
              >
                <NeuralSculpture />
                <div
                  className="orbit-system"
                  role="img"
                  aria-label="Core stack: ML, DL, RAG, Agentic AI, LLM, LLMOps"
                >
                  {GLOBE_STACK.map((label, i) => (
                    <span
                      key={label}
                      className="orbit-chip"
                      aria-hidden="true"
                      style={{
                        "--a0": `${i * 60}deg`,
                        "--bob-delay": `${i * -0.9}s`,
                        "--depth-delay": `${i * -6}s`,
                      }}
                    >
                      <i /> {label}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="hero-meta">
            <span className="availability">
              <span className="status-dot pulse" />
              Open to roles &amp; research collaborations
            </span>
            <span className="hero-location">
              IIIT NAYA RAIPUR — <LocalTime /> IST
            </span>
            <a className="scroll-cue" href="#work">
              SCROLL TO EXPLORE
              <ArrowDown size={13} />
            </a>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>

        <section className="work-section section-shell" id="work">
          <span className="section-ghost" aria-hidden="true">
            01
          </span>
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="section-index">01 /</span> SELECTED WORK
              </p>
              <h2 className="section-title">
                Ideas made <span className="serif">tangible.</span>
              </h2>
            </div>
            <p>
              A selection of systems built to understand,
              <br />
              reason, and solve real problems.
            </p>
          </Reveal>
          {projects.map((project, i) => (
            <FeaturedProject
              key={project.id}
              project={project}
              index={i}
              onOpen={setSelectedProject}
            />
          ))}
          <Reveal className="work-meta" delay={0.05}>
            <span>
              {String(projects.length).padStart(2, "0")} — CASE STUDIES
            </span>
            <span>
              {String(upcoming.length).padStart(2, "0")} — IN DEVELOPMENT
            </span>
            <span className="work-meta-cta">
              SELECT A PROJECT TO OPEN ITS CASE FILE
            </span>
          </Reveal>
        </section>

        <section className="upcoming-section section-shell" id="upcoming">
          <span className="section-ghost" aria-hidden="true">
            02
          </span>
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="section-index">02 /</span> ON THE WORKBENCH
              </p>
              <h2 className="section-title">
                What&apos;s <span className="serif">next.</span>
              </h2>
            </div>
            <p>
              Currently exploring and building —
              <br />
              distinct from shipped work above.
            </p>
          </Reveal>
          <div className="upcoming-grid">
            {upcoming.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i * 0.08, 0.24)}>
                <article className="upcoming-card">
                  <div className="upcoming-top">
                    <span className="upcoming-status">
                      <span className="status-dot pulse" />
                      {item.status}
                    </span>
                    <span className="mono quiet">
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(upcoming.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="upcoming-subtitle">{item.subtitle}</p>
                  <p className="upcoming-desc">{item.desc}</p>
                  <div className="chip-row">
                    {item.tech.map((tech) => (
                      <span className="stack-chip" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="upcoming-foot mono">
                    <span>IN PROGRESS</span>
                    <span>NOT YET SHIPPED</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="upcoming-cta" delay={0.1}>
            <span>
              Working on something adjacent — agentic systems, voice AI, or
              applied LLM work?
            </span>
            <a className="text-link" href="#contact">
              Let&apos;s talk <ArrowUpRight size={16} />
            </a>
          </Reveal>
        </section>

        <section className="about-section section-shell" id="about">
          <span className="section-ghost" aria-hidden="true">
            03
          </span>
          <Reveal className="about-intro">
            <div>
              <p className="eyebrow">
                <span className="section-index">03 /</span> THE ENGINEER BEHIND
                THE WORK
              </p>
              <h2>
                Curiosity is the input.
                <br />
                <span className="muted-heading">Engineering is the craft.</span>
              </h2>
            </div>
            <div className="about-copy">
              <p>
                I&apos;m Vishal, an AI and machine learning engineer based at
                IIIT Naya Raipur, India.
              </p>
              <p>
                My work spans production LLM pipelines, multilingual voice
                systems, codebase intelligence, and computer vision. I&apos;m
                interested in the full path from a model&apos;s potential to a
                system that works in the real world.
              </p>
              <a
                className="text-link"
                href={links.resume}
                target="_blank"
                rel="noreferrer"
              >
                A little more about me
                <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>
          <div className="expertise-grid">
            {expertise.map((item, i) => {
              const Icon = EXPERTISE_ICONS[item.category] || Code2;
              return (
                <Reveal key={item.category} delay={Math.min(i * 0.06, 0.3)}>
                  <div className="expertise-item">
                    <div className="expertise-head">
                      <span className="mono quiet">0{i + 1}</span>
                      <Icon size={17} />
                    </div>
                    <h3>{item.category}</h3>
                    <p>{item.skills.join(" / ")}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="recognition-section section-shell" id="recognition">
          <span className="section-ghost" aria-hidden="true">
            04
          </span>
          <Reveal className="recognition-layout">
            <div>
              <p className="eyebrow">
                <span className="section-index">04 /</span> ALONG THE WAY
              </p>
              <h2>
                Small milestones.
                <br />
                <span className="muted-heading">Forward motion.</span>
              </h2>
              <p className="section-description">
                Building, competing, and getting better
                <br />
                with every iteration.
              </p>
            </div>
            <div className="milestones">
              {milestones.map((item, i) => (
                <div className="milestone" key={item.org}>
                  <span className="mono quiet">{item.period}</span>
                  <span className="milestone-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="milestone-role">{item.role}</p>
                    <h3>{item.org}</h3>
                    <p className="milestone-detail">{item.desc}</p>
                  </div>
                  <ArrowUpRight size={18} />
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="contact-section section-shell" id="contact">
          <span className="section-ghost" aria-hidden="true">
            05
          </span>
          <Reveal>
            <div className="contact-top">
              <p className="eyebrow">
                <span className="section-index">05 /</span> WHAT&apos;S NEXT?
              </p>
              <span className="availability">
                <span className="status-dot pulse" />
                Open to meaningful opportunities
              </span>
            </div>
            <div className="contact-heading">
              <h2>
                Let&apos;s build something
                <br />
                <span className="serif">worth building.</span>
              </h2>
              <a
                className="contact-arrow"
                href={links.email}
                aria-label="Email Vishal"
              >
                <ArrowUpRight />
              </a>
            </div>
            <div className="contact-grid">
              <div>
                <p className="contact-blurb">
                  AI engineering roles, research collaborations,
                  <br />
                  or a good conversation about intelligent systems.
                </p>
                <div className="email-line">
                  <a href={links.email}>{EMAIL}</a>
                  <button
                    className="icon-button"
                    onClick={copyEmail}
                    aria-label="Copy email address"
                  >
                    {copied ? <Check size={17} /> : <Copy size={17} />}
                  </button>
                </div>
                <div className="social-links">
                  <a href={links.github} target="_blank" rel="noreferrer">
                    <Github size={15} />
                    GitHub
                    <ArrowUpRight size={13} />
                  </a>
                  <a href={links.linkedin} target="_blank" rel="noreferrer">
                    <Linkedin size={15} />
                    LinkedIn
                    <ArrowUpRight size={13} />
                  </a>
                  <a href={links.twitter} target="_blank" rel="noreferrer">
                    X / Twitter
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
              <ContactForm notify={notify} />
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-top">
          <a className="wordmark" href="#top" aria-label="Back to top">
            va<span>.</span>
          </a>
          <p>&copy; {new Date().getFullYear()} Vishal Agrawal</p>
          <span className="mono footer-tag">
            DESIGNED &amp; BUILT WITH INTENT.
          </span>
          <nav className="footer-links" aria-label="Footer navigation">
            {[...NAVIGATION, ["contact", "Contact"]].map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <a className="back-top mono" href="#top">
            BACK TO TOP
            <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="section-shell">
          <p className="eyebrow footer-fin">
            <span className="section-index">06 /</span> FIN
          </p>
          <div className="footer-giant" aria-hidden="true">
            VISHAL AGRAWAL<span>.</span>
          </div>
        </div>
        <div className="section-shell footer-colophon">
          <span>SET IN SPACE GROTESK &amp; INSTRUMENT SERIF</span>
          <span>BUILT WITH REACT</span>
          <span className="clock">
            NEW RAIPUR, IN — <LocalTime /> IST
          </span>
        </div>
      </footer>

      <CaseStudy
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 24, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 12, x: "-50%" }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <Check size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
