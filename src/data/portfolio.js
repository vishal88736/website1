export const projects = [
  {
    id: "sanjeevani",
    number: "01",
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
    number: "02",
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
    number: "03",
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
    number: "04",
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
];

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
    org: "AI Durg & Gemma 4 Hackathon",
    role: "Hackathon Winner - Sanjeevani AI",
    period: "2026",
    desc: "Won 1st Place in the hackathon organized by AI Durg & Gemma 4 by engineering 'Sanjeevani' - a multilingual voice-first healthcare triage assistant powered by Gemma LLM.",
  },
  {
    org: "AWS National Level Hackathon",
    role: "Prototype Stage Qualifier",
    period: "2026",
    desc: "Qualified the prototype level in the AWS National Level Hackathon, gaining deep hands-on expertise in AWS Cloud services, scalable infrastructure, and AI deployment.",
  },
  {
    org: "Competitive Programming",
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
