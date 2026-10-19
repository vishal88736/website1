import { useExploreMotion } from "./MotionSettings";
import { useId, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Braces,
  CircleCheck,
  Cpu,
  Database,
  FileText,
  GitBranch,
  Layers,
  ScanLine,
  Workflow,
} from "lucide-react";

const SYSTEMS = [
  {
    id: "agents",
    label: "Agent flow",
    icon: Workflow,
    title: "A little orchestration. A lot of possibility.",
    description:
      "A shared goal, specialized tools, and a clear path from planning to output.",
    input: ["User goal", "intent + context"],
    core: ["Orchestrator", "plan · route · review"],
    tools: [
      ["Research", "retrieve context", Database],
      ["Execute", "call tools", Braces],
      ["Evaluate", "check the result", CircleCheck],
    ],
    output: ["Useful output", "with a traceable path"],
    tag: "MULTI-AGENT SYSTEMS",
    code: "01",
  },
  {
    id: "rag",
    label: "RAG pipeline",
    icon: Database,
    title: "Good answers start with the right context.",
    description:
      "Retrieve relevant sources, build context, and ground the response in evidence.",
    input: ["Question", "natural language"],
    core: ["Retrieval layer", "embed · search · rank"],
    tools: [
      ["Sources", "index documents", FileText],
      ["Context", "select evidence", Layers],
      ["Generate", "ground the answer", Cpu],
    ],
    output: ["Cited response", "connected to its sources"],
    tag: "RETRIEVAL-AUGMENTED GENERATION",
    code: "02",
  },
  {
    id: "vision",
    label: "Vision system",
    icon: ScanLine,
    title: "From pixels to a clearer picture.",
    description:
      "Prepare images, extract useful features, and turn model outputs into insights.",
    input: ["Image input", "pixels + metadata"],
    core: ["Vision pipeline", "prepare · infer · inspect"],
    tools: [
      ["Prepare", "restore & resize", ScanLine],
      ["Model", "extract features", Cpu],
      ["Analyze", "map predictions", GitBranch],
    ],
    output: ["Field insights", "information you can use"],
    tag: "APPLIED COMPUTER VISION",
    code: "03",
  },
];

const EXPLANATIONS = {
  agents: [
    "Start with the user's goal and the context needed to understand it.",
    "Break the goal into a plan, route work to the right tools, and review the outcome.",
    "Retrieve relevant information before deciding what to do next.",
    "Run a scoped tool call to carry out the planned action.",
    "Check the tool result against the original goal before returning an answer.",
    "Return a useful result with a trace of the steps that produced it.",
  ],
  rag: [
    "A natural-language question starts the retrieval process.",
    "Embed the question, search the index, and rank the most relevant matches.",
    "Prepare and index documents so their content can be retrieved.",
    "Select relevant passages and include their source information in the context.",
    "Generate an answer using the selected evidence rather than the question alone.",
    "Connect the response to the sources used so the reader can inspect the evidence.",
  ],
  vision: [
    "An image and its metadata enter the processing pipeline.",
    "Coordinate preprocessing, inference, and inspection of the model output.",
    "Restore image quality and resize inputs for the model.",
    "Extract features and produce predictions from the prepared image.",
    "Map predictions back to the image so their spatial context stays visible.",
    "Present the analysis as interpretable information for the next decision.",
  ],
};

export default function SystemCanvas() {
  const { reduced } = useExploreMotion();
  const [selected, setSelected] = useState("agents");
  const [step, setStep] = useState("core");
  const system = SYSTEMS.find((item) => item.id === selected);
  const uid = useId();
  const stepIds = ["input", "core", "tool-0", "tool-1", "tool-2", "output"];
  const labels = [
    system.input[0],
    system.core[0],
    ...system.tools.map(([label]) => label),
    system.output[0],
  ];
  const stepIndex = stepIds.indexOf(step);
  const nodeProps = (id, label) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": `Inspect ${label}`,
    "aria-pressed": step === id,
    "aria-controls": `${uid}-detail`,
    "data-active": step === id,
    onClick: () => setStep(id),
    onKeyDown: (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setStep(id);
      }
    },
  });
  const branch = step.startsWith("tool-") ? Number(step.slice(-1)) : 0;
  const x = [80, 220, 360][branch];
  const signal =
    step === "input"
      ? "M220 53V86"
      : step === "output"
        ? "M80 241V265H220V286M220 241V286M360 241V265H220V286"
        : `M220 53V86M220 144V161H${x}V185M${x} 241V265H220V286`;

  return (
    <div className="system-canvas">
      <div className="canvas-chrome">
        <span>
          <span className="canvas-file-dot" />
          system_sketch.canvas
        </span>
        <span>INTERACTIVE / {system.code}</span>
      </div>
      <div
        className="canvas-controls"
        role="group"
        aria-label="Explore system architectures"
      >
        {SYSTEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={selected === id}
            onClick={() => {
              setSelected(id);
              setStep("core");
            }}
          >
            {selected === id && (
              <motion.span
                className="canvas-control-highlight"
                layoutId={reduced ? undefined : "canvas-control-highlight"}
                transition={{
                  duration: reduced ? 0 : 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            )}
            <Icon size={13} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="canvas-diagram">
        <span className="canvas-axis axis-top" aria-hidden="true">
          INPUT → REASONING → OUTCOME
        </span>
        <svg
          key={system.id}
          viewBox="0 0 440 332"
          fill="none"
          role="group"
          aria-label={`${system.label}: select a step to inspect`}
        >
          <defs>
            <marker
              id={`${uid}-arrow`}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path
                d="M1 1L7 4L1 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </marker>
          </defs>
          <g
            className="system-connections"
            aria-hidden="true"
            markerEnd={`url(#${uid}-arrow)`}
          >
            <path
              pathLength="1"
              data-active={step === "input" || step === "core"}
              d="M220 53V86"
            />
            <path
              pathLength="1"
              data-active={step === "core" || step === "tool-0"}
              d="M220 144V161H80V185"
            />
            <path
              pathLength="1"
              data-active={step === "core" || step === "tool-1"}
              d="M220 144V185"
            />
            <path
              pathLength="1"
              data-active={step === "core" || step === "tool-2"}
              d="M220 144V161H360V185"
            />
            <path
              pathLength="1"
              data-active={step === "output" || step === "tool-0"}
              d="M80 241V265H220V286"
            />
            <path
              pathLength="1"
              data-active={step === "output" || step === "tool-1"}
              d="M220 241V286"
            />
            <path
              pathLength="1"
              data-active={step === "output" || step === "tool-2"}
              d="M360 241V265H220V286"
            />
          </g>
          <path className="system-signal" aria-hidden="true" d={signal} />
          <g
            className="diagram-input diagram-node"
            {...nodeProps("input", system.input[0])}
          >
            <rect x="148" y="9" width="144" height="44" rx="6" />
            <text x="220" y="28" textAnchor="middle">
              {system.input[0]}
            </text>
            <text className="node-detail" x="220" y="42" textAnchor="middle">
              {system.input[1]}
            </text>
          </g>
          <g
            className="diagram-core diagram-node"
            {...nodeProps("core", system.core[0])}
          >
            <rect x="114" y="86" width="212" height="58" rx="8" />
            <rect x="122" y="94" width="42" height="42" rx="5" />
            <Workflow x="133" y="105" size={20} />
            <text x="175" y="111">
              {system.core[0]}
            </text>
            <text className="node-detail" x="175" y="127">
              {system.core[1]}
            </text>
            <circle cx="310" cy="99" r="3" />
          </g>
          {system.tools.map(([title, detail, Icon], i) => (
            <g
              className="diagram-tool diagram-node"
              key={`${system.id}-${title}`}
              {...nodeProps(`tool-${i}`, title)}
            >
              <rect x={19 + i * 140} y="185" width="122" height="56" rx="6" />
              <Icon x={29 + i * 140} y="196" size={14} />
              <text x={50 + i * 140} y="207">
                {title}
              </text>
              <text className="node-detail" x={29 + i * 140} y="225">
                {detail}
              </text>
              <circle cx={80 + i * 140} cy="185" r="3" />
            </g>
          ))}
          <g
            className="diagram-output diagram-node"
            {...nodeProps("output", system.output[0])}
          >
            <rect x="135" y="286" width="170" height="44" rx="6" />
            <CircleCheck x="146" y="296" size={15} />
            <text x="171" y="303">
              {system.output[0]}
            </text>
            <text className="node-detail" x="171" y="317">
              {system.output[1]}
            </text>
          </g>
        </svg>
        <span className="canvas-coordinate">
          FIG. {system.code} / ARCHITECTURE CONCEPT
        </span>
        <span className="canvas-scale" aria-hidden="true">
          1:1
        </span>
      </div>
      <div className="canvas-caption">
        <span>{system.tag}</span>
        <h2>{system.title}</h2>
        <p>{system.description}</p>
        <div
          className="canvas-step-detail"
          id={`${uid}-detail`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>
            STEP {String(stepIndex + 1).padStart(2, "0")} / SELECT A NODE ABOVE
          </span>
          <h3>{labels[stepIndex]}</h3>
          <p>{EXPLANATIONS[system.id][stepIndex]}</p>
        </div>
      </div>
      <a className="canvas-link" href="#work">
        <span>From sketches to working systems</span>
        <ArrowUpRight size={16} />
      </a>
    </div>
  );
}
