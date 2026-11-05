export const projectFilters = [
  { id: "all", label: "All projects" },
  { id: "ai", label: "AI & agents" },
  { id: "civic", label: "Civic tech" },
  { id: "vision", label: "Computer vision" },
];

export const projects = [
  {
    id: "krono",
    filter: "ai",
    title: "Krono",
    tagline: "Crypto research and risk-gated HSKSwap paper trading",
    category: "Agentic Trading",
    summary:
      "A crypto research workspace combining source-labeled market and news feeds, conversational strategy controls, and an HSKSwap paper-trading agent. Positions, P&L, and decision history stay traceable through separate persistent ledgers.",
    scope:
      "Website automation uses virtual funds. Signed execution tooling is separate; no profitability or signed mainnet deployment is claimed.",
    story: {
      problem:
        "Market research, conversational strategy changes, and execution need a traceable connection without allowing model output to bypass risk checks or human controls.",
      solution:
        "Connect a React research terminal to a typed FastAPI boundary, a LangGraph research workflow, and a single-writer AEGIS paper runtime. Source freshness, executable quotes, deterministic risk checks, and reviewed changes govern the path to a virtual fill.",
      architecture: [
        {
          stage: "Research workspace",
          tech: "React / TypeScript",
          detail:
            "Shows source-labeled reference markets, news, strategy research, positions, and recorded decision reports.",
        },
        {
          stage: "Session and conversation API",
          tech: "FastAPI / LangGraph",
          detail:
            "Validates typed requests and session/CSRF boundaries. Conversational tools expose bounded research and strategy controls rather than wallet keys or raw transaction construction.",
        },
        {
          stage: "Market and strategy orchestration",
          tech: "Python / HSKSwap V3",
          detail:
            "Combines verified pool observations and quotes with supported research signals in a single-writer paper runtime; stale or unsupported inputs remain explicit.",
        },
        {
          stage: "Risk-gated paper execution",
          tech: "Pydantic / Deterministic checks",
          detail:
            "Checks quotes, exposure, execution costs, stop conditions, and human-review requirements before a virtual fill. Signed execution runs through a separate gateway.",
        },
        {
          stage: "Persistent audit and accounting",
          tech: "SQLite",
          detail:
            "Records atomic, idempotent paper fills, positions, settings, and decision history. Research and AEGIS accounts remain separate, and paper entries restart paused.",
        },
      ],
      challenge:
        "Keep research, paper funds, and separately authorized signing distinct while preserving source freshness, deterministic financial calculations, bounded conversational controls, and auditable accounting.",
      results: [
        "Source-labeled research and recorded decision reports",
        "Risk-gated paper execution using virtual funds",
        "Separate research and AEGIS accounting ledgers",
      ],
      techStack: [
        "React",
        "TypeScript",
        "Python",
        "FastAPI",
        "SQLite",
        "LangGraph",
        "HSKSwap V3",
      ],
    },
    github: "https://github.com/vishal88736/automatic-trading-agent",
  },
  {
    id: "urbansaarthi",
    filter: "civic",
    title: "NagarSeva First / UrbanSaarthi",
    tagline: "People, places, and connected civic follow-up",
    category: "Civic Tech",
    summary:
      "A civic-tech prototype for settlement exploration, affordable-housing assessment, basic-service gap tracking, citizen issue reporting, redevelopment monitoring, maps, and reports. Its demonstration workspace uses synthetic records, not official government integrations.",
    scope:
      "Settlements, map geometry, service indicators, issues, and redevelopment records are fictional demonstration data. No authorized external government service is connected.",
    story: {
      problem:
        "Housing assessments, basic-service needs, citizen complaints, and redevelopment progress need to remain connected to the same settlement context as teams record and review follow-up.",
      solution:
        "Use a shared server-backed demonstration workspace to explore settlements, assess housing needs, inspect service gaps, report issues, track redevelopment milestones, and export reports. The interface supports English, Hindi, and Marathi, with persistent synthetic-data labeling.",
      architecture: [
        {
          stage: "Civic workspace",
          tech: "React / TypeScript / Vite",
          detail:
            "Typed civic services and an adapter connect the dashboard, settlement explorer, housing assessments, issues, services, redevelopment, and reports to the same workspace.",
        },
        {
          stage: "Mapping and exploration",
          tech: "Leaflet / react-leaflet",
          detail:
            "Displays synthetic settlement polygons with synchronized selection, layer controls, and pan/zoom. Optional OpenStreetMap tiles provide context; a fallback handles an unavailable basemap.",
        },
        {
          stage: "Validated civic operations",
          tech: "FastAPI / Pydantic",
          detail:
            "Validates issue submissions, housing assessments, service findings, project milestones, and report requests. Operational changes retain follow-up notes and history.",
        },
        {
          stage: "Shared persistence",
          tech: "SQLite",
          detail:
            "Stores the demonstration workspace transactionally with revision checks and idempotent operations. File-onboarding batches are isolated from the active synthetic city.",
        },
        {
          stage: "Hosted demonstration",
          tech: "Docker / EC2 / CloudFront",
          detail:
            "Runs the containerized application on EC2 behind a CloudFront public origin serving both the website and API.",
        },
      ],
      challenge:
        "Maintain consistent settlement context and confirmed state across maps, assessments, issues, and project updates while keeping synthetic examples clearly separate from official records and proposed public-service outcomes.",
      results: [
        "Connected settlement, housing, service, and issue workflows",
        "Redevelopment follow-up with report and CSV export",
        "Documented public demonstration using synthetic data",
      ],
      techStack: [
        "React",
        "TypeScript",
        "FastAPI",
        "SQLite",
        "Leaflet",
        "Docker",
        "EC2",
        "CloudFront",
      ],
    },
    github: "https://github.com/vishal88736/nagarseva-seva-first",
    demo: "https://d2nrwxy6sjb9o8.cloudfront.net/",
  },
  {
    id: "grace-rul",
    filter: "ai",
    title: "CMAPSS Predictive Maintenance / GRACE-RUL",
    tagline: "From damaged sensor histories to remaining useful life",
    category: "Predictive Maintenance",
    summary:
      "A research pipeline on NASA C-MAPSS FD001–FD004 combining operating-condition preprocessing, detection of synthetically corrupted sensor readings, selective sensor recovery, remaining useful life prediction, and calibrated uncertainty estimates.",
    scope:
      "NASA simulation benchmarks with additional synthetic sensor faults. This describes the implemented research methods; no unverified accuracy, improvement, or completed experiment is claimed.",
    story: {
      problem:
        "Missing, drifting, stuck, or jointly noisy sensor readings can distort degradation histories. Remaining useful life estimates need to account for both operating conditions and input quality without using future engine observations.",
      solution:
        "Share a PyTorch implementation between the training workflow and application. Fit preprocessing on fitting engines, simulate structured correlated faults, estimate damaged readings, selectively recover signals, and combine local and longer-history predictors with separately calibrated intervals.",
      architecture: [
        {
          stage: "Engine histories and preprocessing",
          tech: "NASA C-MAPSS / pandas / scikit-learn",
          detail:
            "Uses FD001–FD004 engine trajectories, sensor channels, and operating settings. Engine-disjoint fitting and operating-regime normalization keep preprocessing statistics separate from held-out engines.",
        },
        {
          stage: "Structured faults and detection",
          tech: "Synthetic corruption / CNN–GRU detector",
          detail:
            "The simulator creates domain-related dropouts, correlated temporal noise, bias, drift, and stuck readings. A convolutional/GRU detector estimates per-reading fault scores using observations, availability, and settings.",
        },
        {
          stage: "Selective sensor recovery",
          tech: "BiLSTM / WGAN-GP training",
          detail:
            "A bidirectional LSTM generator proposes sensor corrections. Availability masks, estimated faults, validation-selected gates, and fitted-support bounds control selective repair; a temporal critic supplies adversarial training feedback.",
        },
        {
          stage: "Remaining useful life prediction",
          tech: "CNN–GRU / Transformer / PyTorch",
          detail:
            "Quality-aware fusion combines a local convolutional/GRU branch and a longer-history Transformer branch. A bounded residual corrector uses observable features and engine-disjoint out-of-fold training predictions.",
        },
        {
          stage: "Uncertainty calibration",
          tech: "Engine-disjoint split conformal",
          detail:
            "Independent calibration engines determine prediction-interval bounds after model selection. The documented interval contracts distinguish capped and raw RUL targets and depend on their stated exchangeability assumptions.",
        },
      ],
      challenge:
        "Separate fitting, model selection, calibration, and evaluation by engine while protecting intact measurements during recovery and keeping synthetic-fault behavior distinct from measured predictive accuracy.",
      results: [
        "Operating-condition-aware preprocessing across FD001–FD004",
        "Implemented fault detection and selective recovery pipeline",
        "RUL prediction with independently calibrated intervals",
      ],
      techStack: [
        "Python",
        "PyTorch",
        "pandas",
        "NumPy",
        "scikit-learn",
        "CNN–GRU",
        "BiLSTM",
        "Transformer",
      ],
    },
    github: "https://github.com/vishal88736/cmapss-predictive-maintenance",
  },
  {
    id: "sanjeevani",
    filter: "ai",
    title: "Sanjeevani",
    tagline: "Multilingual Voice-First Healthcare AI Triage",
    category: "Healthcare AI",
    summary:
      "A multilingual voice-first healthcare assistant that transcribes, translates, and triages patient symptoms using retrieval from WHO medical guidelines and automated safety checks.",
    story: {
      problem:
        "Healthcare advice in rural regions is bottlenecked by dialect barriers, high diagnostic costs, and critical time delays.",
      solution:
        "A voice-first assistant supporting 6+ Indic languages that transcribes, translates, and triages patient symptoms grounded in official WHO medical guidance.",
      architecture: [
        {
          stage: "Speech Input",
          tech: "IndicConformer",
          detail: "Transcribes raw audio into Indic text tokens in real time.",
        },
        {
          stage: "Translation",
          tech: "IndicTrans2",
          detail:
            "Translates regional Indic languages into English for core LLM processing.",
        },
        {
          stage: "Retrieval",
          tech: "FAISS Vector RAG",
          detail:
            "Performs dense semantic vector search against WHO medical guidelines.",
        },
        {
          stage: "Reasoning",
          tech: "Gemma LLM",
          detail:
            "Drafts grounded clinical triage advice with source citation bounds.",
        },
        {
          stage: "Verification",
          tech: "WHO Medical Rules",
          detail:
            "Runs automated deterministic safety checks before back-translating audio.",
        },
      ],
      challenge:
        "Pipeline Latency & Reliability: Chaining 5 separate AI models (speech, translation, vector retrieval, LLM generation, and back-translation) while guaranteeing end-to-end response times under 1.2s.",
      results: [
        "6+ Indic Dialects Supported",
        "Sub-1.2s End-to-End Latency",
        "100% Grounded in WHO Guidelines",
      ],
      techStack: [
        "PyTorch",
        "Gemma",
        "IndicTrans2",
        "IndicConformer",
        "FAISS",
        "AWS Bedrock",
        "RAG",
      ],
    },
    github: "https://github.com/vishal88736/sanjeevani",
  },
  {
    id: "codrix",
    filter: "ai",
    title: "Codrix.AI",
    tagline: "Codebase Intelligence & AST Knowledge Graph",
    category: "Code Intelligence",
    summary:
      "Transforms source repositories into AST-based dependency graphs with vector search. LangChain agents query architectural context and analyze the impact of code changes.",
    story: {
      problem:
        "Onboarding onto complex multi-repository codebases requires days of manual code tracing and opaque architectural context.",
      solution:
        "Normalizes raw source repositories into Abstract Syntax Trees (AST) mapped into a vector queryable dependency graph for real-time architectural interrogation.",
      architecture: [
        {
          stage: "Source Code",
          tech: "Git / Local Repo",
          detail: "Indexes repository file trees and tracks git delta commits.",
        },
        {
          stage: "AST Parsing",
          tech: "Tree-sitter Engine",
          detail: "Parses source code into structured Abstract Syntax Trees.",
        },
        {
          stage: "Graph Extraction",
          tech: "Symbol Dependency Tree",
          detail:
            "Maps caller-callee bindings, class hierarchies, and import graphs.",
        },
        {
          stage: "Vector Index",
          tech: "FAISS / Embeddings",
          detail:
            "Embeds code snippets and docstrings for semantic symbol query.",
        },
        {
          stage: "Multi-Agent Query",
          tech: "LangChain Agents",
          detail:
            "Runs blast-radius analysis to evaluate code modification impacts.",
        },
      ],
      challenge:
        "Semantic Precision: Preserving scope boundaries, caller-callee relationships, and multi-language syntax definitions across thousands of source files simultaneously.",
      results: [
        "Instant Blast-Radius Analysis",
        "Multi-Language AST Normalization",
        "10x Faster Codebase Onboarding",
      ],
      techStack: [
        "Python",
        "Tree-sitter",
        "LangChain",
        "FAISS",
        "Multi-Agent Systems",
        "Vector Search",
      ],
    },
    github: "https://github.com/vishal88736",
  },
  {
    id: "careertrajectory",
    filter: "ai",
    title: "CareerTrajectory AI",
    tagline: "Redefining Talent Intelligence Beyond Traditional ATS",
    category: "Talent Intelligence",
    summary:
      "A multi-agent platform combining LLM analysis, Neo4j knowledge graphs, and vector search to evaluate candidates beyond keyword matching and produce explainable rankings and growth predictions.",
    story: {
      problem:
        "Traditional ATS keyword matching fails to evaluate engineering capability, project sophistication, learning trajectory, or actual candidate problem-solving maturity.",
      solution:
        "A multi-agent talent intelligence platform using specialized LLM agents, Neo4j knowledge graphs, and vector search to evaluate candidates, predict growth trajectory, and produce explainable ranking reports.",
      architecture: [
        {
          stage: "Resume Parsing",
          tech: "Multi-Modal Parsing",
          detail:
            "Deep semantic extraction of projects, research, technical depth, and competitive programming.",
        },
        {
          stage: "Embedding Generation",
          tech: "Vector Embeddings",
          detail:
            "Generates dense semantic vector embeddings for job-candidate context matching.",
        },
        {
          stage: "Knowledge Graph",
          tech: "Neo4j Graph Database",
          detail:
            "Maps caller skills, class hierarchies, project dependencies, and domain bindings.",
        },
        {
          stage: "Multi-Agent Analysis",
          tech: "LangGraph Agents",
          detail:
            "Orchestrates Resume, Job, Skill, Momentum, and Behavioral Evidence agents.",
        },
        {
          stage: "Explainable Output",
          tech: "Explainability Engine",
          detail:
            "Produces recruiter-friendly summaries, interview topic prompts, and future potential scores.",
        },
      ],
      challenge:
        "Explainable Multi-Agent Latency: Coordinating 7 specialized LLM agents while delivering transparent candidate rankings without black-box opacity or high latency.",
      results: [
        "Multi-Agent Candidate Evaluation",
        "Explainable Transparent Scoring",
        "10x Deeper Technical Capability Ranking",
      ],
      techStack: [
        "React",
        "TypeScript",
        "FastAPI",
        "Python",
        "LangGraph",
        "LangChain",
        "AWS Bedrock",
        "Neo4j",
        "PostgreSQL",
        "RAG",
      ],
    },
    github: "https://github.com/vishal88736",
  },
  {
    id: "cottonfield",
    filter: "vision",
    title: "Cotton Field Analysis",
    tagline:
      "AI-Powered Crop Intelligence from High-Resolution Orthomosaic Imagery",
    category: "Computer Vision",
    summary:
      "A crop intelligence pipeline that tiles high-resolution drone orthomosaics, restores image quality with Restormer/FFTFormer, and classifies crop patches to generate field-level health reports.",
    story: {
      problem:
        "Manual inspection of thousands of plants across large-scale field survey orthomosaics is slow, costly, and inconsistent under variable lighting, shadows, and aerial blur.",
      solution:
        "A computer vision pipeline combining Restormer/FFTFormer image enhancement with deep learning crop classification on high-resolution orthomosaic patch tiles.",
      architecture: [
        {
          stage: "Drone Survey",
          tech: "1080p Aerial Imagery",
          detail:
            "Collects high-resolution drone orthomosaic imagery across large field acreage.",
        },
        {
          stage: "Orthomosaic Tiling",
          tech: "Patch Extraction",
          detail:
            "Divides multi-gigabyte orthomosaic images into manageable spatial patch tiles.",
        },
        {
          stage: "Image Enhancement",
          tech: "Restormer / FFTFormer",
          detail:
            "Restores image quality, denoises low-quality regions, and enhances contrast before model inference.",
        },
        {
          stage: "Deep Learning",
          tech: "PyTorch Classification",
          detail:
            "Runs deep neural network classification on enhanced crop patch tiles.",
        },
        {
          stage: "Field Insights",
          tech: "Health Map Generation",
          detail:
            "Generates field-level crop health condition reports across entire farms.",
        },
      ],
      challenge:
        "High-Resolution Memory & Restoration: Processing multi-gigabyte orthomosaic maps without memory exhaustion while boosting classification accuracy via restoration preprocessing.",
      results: [
        "Field-Scale Orthomosaic Intelligence",
        "Restormer Image Restoration Pipeline",
        "Robust Crop Health Classification",
      ],
      techStack: [
        "PyTorch",
        "OpenCV",
        "Computer Vision",
        "Restormer",
        "FFTFormer",
        "Python",
        "Image Processing",
        "Deep Learning",
      ],
    },
    github: "https://github.com/vishal88736",
  },
  {
    id: "alpaca",
    filter: "ai",
    title: "Alpaca Trading Agentic AI",
    tagline: "Signal/Terminal — Autonomous AI Trading on Alpaca Paper Trading",
    category: "Agentic Trading",
    summary:
      "An autonomous paper-trading platform where strategy agents propose structured trade intents, a deterministic risk engine approves or rejects them, and a React terminal surfaces positions, decisions, and automation state.",
    story: {
      problem:
        "Autonomous trading ideas need a safe path from model output to broker execution without bypassing risk controls or leaking credentials.",
      solution:
        "A layered platform where strategy agents and an LLM orchestrator only produce structured TradeSignal and TradeIntent objects, while a deterministic FastAPI risk engine is the sole gate before any Alpaca paper order.",
      architecture: [
        {
          stage: "Strategy Agents",
          tech: "BaseStrategy / Pydantic",
          detail:
            "Five typed strategy stubs implement initialize, analyze, and generate_signal to emit structured TradeSignal objects.",
        },
        {
          stage: "News Context",
          tech: "News Service",
          detail:
            "Fuses market headlines into a NewsSignal so strategy output is read alongside current conditions.",
        },
        {
          stage: "LLM Orchestrator",
          tech: "Signal Fusion",
          detail:
            "Combines strategy signal, news signal, and portfolio context into a single TradeIntent for review.",
        },
        {
          stage: "Risk Engine",
          tech: "Deterministic Checks",
          detail:
            "Evaluates kill switch, asset allowlist, exposure limits, buying power, and daily guards before any order.",
        },
        {
          stage: "Terminal & Log",
          tech: "React / WebSocket",
          detail:
            "Dashboard shows positions and P&L while every approval, rejection, and automation transition is logged.",
        },
      ],
      challenge:
        "Safe Autonomy: Keeping LLM reasoning strictly upstream of execution so no trade reaches Alpaca without passing deterministic risk checks and session-scoped paper credentials.",
      results: [
        "Deterministic Risk Gate on Every Order",
        "Paper-Trading Only with Audited Decisions",
        "Live Dashboard with Automation Controls",
      ],
      techStack: [
        "Python",
        "FastAPI",
        "React",
        "Alpaca API",
        "Pydantic",
        "WebSocket",
      ],
    },
    github: "https://github.com/vishal88736/alpaca-ai-trading-agent",
  },
  {
    id: "finance",
    filter: "ai",
    title: "LedgerPilot",
    tagline: "AI-assisted. Auditor-ready.",
    category: "Agentic AI / Financial Technology",
    summary:
      "An AI-assisted financial operations platform for reconciliation, discrepancy investigation, tax-related transaction analysis, cash-flow forecasting, and evidence-grounded insights. Deterministic Python handles financial calculations and matching; LangGraph workflows route investigations and explain structured results.",
    scope: "Functional demonstration and continued development.",
    story: {
      problem:
        "Finance teams work with fragmented bank, payment-processor, and internal-ledger records. Manual reconciliation is time-consuming and difficult to audit, while assigning financial calculations or matching decisions directly to language models risks fabricated figures, inconsistent results, and irreproducible decisions.",
      solution:
        "Combine deterministic financial processing with agentic investigation in one workspace. Multi-pass reconciliation uses identifiers, references, amounts, dates, and entity information. Duplicate, unmatched, ambiguous, and fee-related exceptions retain their evidence. LangGraph routes queries and explains verified results; historical-data-based forecasts explicitly handle insufficient information, and tax matching evaluates eligible evidence with rules.",
      architecture: [
        {
          stage: "Financial document intake",
          tech: "FastAPI / Schema detection",
          detail:
            "Register documents within an analysis thread, detect their schemas, and map source columns into the financial processing workflow while retaining provenance.",
        },
        {
          stage: "Deterministic reconciliation",
          tech: "Python / Pandas / NumPy",
          detail:
            "Normalize and validate records, then apply multi-pass matching using identifiers, references, amounts, dates, and entity information. Tolerance checks and duplicate detection remain outside the language model.",
        },
        {
          stage: "Structured results and exceptions",
          tech: "Deterministic financial services",
          detail:
            "Produce reproducible matches and structured discrepancy reports for unmatched transactions, ambiguous candidates, fees, and inconsistent records, with related source-record evidence.",
        },
        {
          stage: "Financial investigation",
          tech: "LangGraph",
          detail:
            "Route queries, investigate exceptions, and provide evidence-grounded financial Q&A using structured results. Language models explain financial evidence; they do not calculate authoritative totals or decide transaction matches.",
        },
        {
          stage: "Forecasting and tax matching",
          tech: "Python / Rule-based analysis",
          detail:
            "Build cash-flow projections from historical information with explicit insufficient-data handling. Evaluate tax-related records only when the required eligible evidence is available.",
        },
        {
          stage: "Persistent audit and analysis history",
          tech: "SQLAlchemy / SQLite",
          detail:
            "Preserve documents, reconciliation results, exceptions, and analysis history by thread. Append-only processing events and provenance support later review.",
        },
        {
          stage: "Financial control dashboard",
          tech: "Next.js / React / TypeScript",
          detail:
            "Provide access to analyses, documents, reconciliation results, forecasts, tax matching, exceptions, and audit history from a unified dashboard.",
        },
      ],
      challenge:
        "Separate AI reasoning from financial truth so language models never own authoritative calculations or transaction matches. Make reconciliation reliable through multiple matching passes, tolerance checks, duplicate detection, and explicit ambiguity handling. Preserve thread-based documents, results, exceptions, and processing history so investigations remain traceable.",
      results: [
        "Reproducible, deterministic financial reconciliation",
        "Evidence-grounded financial Q&A",
        "Structured discrepancy and exception reporting",
        "Persistent, auditable analysis workflows",
        "Integrated reconciliation, forecasting, and tax analysis",
      ],
      techStack: [
        "Python",
        "FastAPI",
        "LangGraph",
        "Pandas",
        "NumPy",
        "SQLAlchemy",
        "SQLite",
        "Next.js",
        "React",
        "TypeScript",
      ],
    },
    github: "https://github.com/vishal88736/finance-controller",
  },
].map((project, index) => ({
  ...project,
  number: String(index + 1).padStart(2, "0"),
}));

export function getProjectsByFilter(filter = "all") {
  return projects.filter(
    (project) => filter === "all" || project.filter === filter,
  );
}

export const expertise = [
  {
    category: "Artificial Intelligence",
    skills: [
      "LLMs",
      "Retrieval-Augmented Generation (RAG)",
      "Model Context Protocol (MCP)",
      "LangChain",
      "LangGraph",
      "Prompt Engineering",
    ],
  },
  {
    category: "Machine Learning",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Feature Engineering",
      "Model Evaluation",
      "Mathematics",
      "Statistics",
    ],
  },
  {
    category: "Computer Vision",
    skills: ["YOLOv8", "OCR", "OpenCV", "Image Processing", "Edge AI"],
  },
  {
    category: "Backend & Cloud",
    skills: ["FastAPI", "REST APIs", "AWS", "Docker", "MongoDB", "PostgreSQL"],
  },
  {
    category: "Languages",
    skills: ["Python", "C++", "SQL", "TypeScript", "JavaScript"],
  },
  {
    category: "Tools & Ecosystem",
    skills: ["Git", "GitHub", "Linux", "VS Code", "Jupyter", "Kaggle"],
  },
];

export const upcoming = [
  {
    id: "canopy",
    title: "Canopy",
    subtitle: "Context-first AI coding workspace",
    status: "BUILDING",
    desc: "A local AI coding workspace in active development. Each conversation has its own selectable context, request previews make model inputs inspectable, and proposed file changes can be reviewed before saving.",
    tech: ["React", "TypeScript", "Express", "SQLite"],
  },
  {
    id: "cryptrix",
    title: "Cryptrix",
    subtitle: "AI Trading Intelligence Platform",
    status: "IN DEVELOPMENT",
    desc: "Building an AI-powered platform for crypto market intelligence, sentiment analysis, and trading insights with intelligent monitoring and automated signal analysis.",
    tech: ["LangGraph", "FastAPI", "WebSockets", "Crypto Intelligence"],
  },
  {
    id: "novatune",
    title: "NovaTune",
    subtitle: "Next-Generation AI Workflows",
    status: "RESEARCH & DEVELOPMENT",
    desc: "Exploring and designing a new AI system focused on advanced intelligent workflows, automated agent execution, and scalable AI user experiences.",
    tech: ["Multi-Agent Systems", "Agentic AI", "Autonomous Workflows"],
  },
];

export const milestones = [
  {
    org: "AssemblyAI Voice Agent Hackathon",
    role: "1st Place — Best Solution",
    period: "Global event",
    icon: "trophy",
    desc: "Won 1st Place (Best Solution) at the global AssemblyAI Voice Agent Hackathon organized by lablab.ai / AssemblyAI, with 4,100+ registered builders. WorkerSaathi is a bilingual, voice-first AI assistant designed to make labor-related legal guidance more accessible to India’s informal and daily-wage workers. It combines AssemblyAI real-time speech integration with Hindi and English voice interaction, contextual AI-based legal reasoning, structured grievance summaries, and action-oriented resolution workflows.",
  },
  {
    org: "Multimodal AI Hackathon 2026 · IIT Mandi",
    role: "Rank 8 — Track B",
    period: "2026",
    icon: "award",
    desc: "Secured Rank 8 in Track B at the Multimodal AI Hackathon 2026 organized by KamandPrompt, IIT Mandi. The event involved 4,300 participants across the competition, building and experimenting with multimodal AI solutions under hackathon constraints.",
  },
  {
    org: "AI Durg & Gemma 4 Hackathon",
    icon: "trophy",
    role: "Hackathon Winner - Sanjeevani AI",
    period: "2026",
    desc: "Won 1st Place in the hackathon organized by AI Durg & Gemma 4 by engineering 'Sanjeevani' - a multilingual voice-first healthcare triage assistant powered by Gemma LLM.",
  },
  {
    org: "AWS National Level Hackathon",
    icon: "award",
    role: "Prototype Stage Qualifier",
    period: "2026",
    desc: "Qualified the prototype level in the AWS National Level Hackathon, gaining deep hands-on expertise in AWS Cloud services, scalable infrastructure, and AI deployment.",
  },
  {
    org: "Competitive Programming",
    icon: "code",
    role: "CodeChef 2-star - 200+ Problems Solved Across Platforms",
    period: "Ongoing",
    desc: "Achieved CodeChef 2-star rating and solved 200+ algorithmic problems across all competitive coding platforms, mastering graph theory, dynamic programming, and core data structures.",
  },
];

export const links = {
  github: "https://github.com/vishal88736",
  linkedin: "https://www.linkedin.com/in/vishal-agrawal-1ba44532b/",
  twitter: "https://x.com/vishal__0604",
  email: "mailto:agrawalvishal804@gmail.com",
  resume:
    "https://drive.google.com/file/d/1cRQsrwSxCf0lg_XXxF1i7ahrhkEpK7yd/view?usp=drive_link",
};
