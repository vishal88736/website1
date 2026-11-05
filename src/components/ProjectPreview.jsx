import {
  Activity,
  ArrowUpRight,
  AudioLines,
  Bot,
  Check,
  Code2,
  GitBranch,
  Leaf,
  Search,
  ShieldCheck,
  Trophy,
  Cpu,
  Users,
  Wallet,
  Building2,
  MapPin,
} from "lucide-react";

const codeLines = [
  ["01", "import", " intelligence"],
  ["02", "", ""],
  ["03", "class", " CodebaseGraph:"],
  ["04", "", "  def understand(self, repo):"],
  ["05", "", "    tree = parse_ast(repo)"],
  ["06", "return", "    knowledge.build(tree)"],
];

function WindowChrome({ label, children }) {
  return (
    <div className="preview-window">
      <div className="window-bar">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <span>{label}</span>
        <ArrowUpRight size={11} />
      </div>
      {children}
    </div>
  );
}

export default function ProjectPreview({ kind }) {
  return (
    <div className={`project-preview preview-${kind}`} aria-hidden="true">
      <div className="preview-grid" />
      {kind === "krono" && (
        <WindowChrome label="krono / research & paper">
          <div className="verified-preview-heading">
            <span>
              <Activity size={17} />
              krono
            </span>
            <small>PAPER · VIRTUAL FUNDS</small>
          </div>
          <div className="krono-research-chart">
            <span>SOURCE-LABELED RESEARCH</span>
            <svg viewBox="0 0 400 110" fill="none">
              <path
                className="research-grid"
                d="M0 25H400M0 55H400M0 85H400M80 0V110M200 0V110M320 0V110"
              />
              <path
                className="research-line"
                d="M0 80L30 65L58 72L86 48L112 56L145 30L172 42L203 26L232 44L263 33L292 57L323 38L356 50L380 29L400 35"
              />
            </svg>
          </div>
          <div className="verified-preview-rows">
            {[
              ["Research", "Source + freshness"],
              ["Strategy", "Typed intent"],
              ["Execution", "Risk-gated paper"],
            ].map(([label, detail]) => (
              <div key={label}>
                <span>{label}</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
          <div className="preview-bottom">
            <span>SEPARATE LEDGERS</span>
            <span>
              <ShieldCheck size={11} /> HUMAN CONTROLS
            </span>
          </div>
        </WindowChrome>
      )}
      {kind === "urbansaarthi" && (
        <WindowChrome label="urbansaarthi / civic workspace">
          <div className="verified-preview-heading">
            <span>
              <Building2 size={17} />
              UrbanSaarthi
            </span>
            <small>SYNTHETIC DEMO</small>
          </div>
          <div className="civic-preview-layout">
            <div className="civic-preview-map">
              <svg viewBox="0 0 180 145" fill="none">
                <path
                  className="civic-map-road"
                  d="M0 66L180 102M60 0L83 145M0 25L180 51M145 0L118 145"
                />
                <path d="M14 37L56 44L61 65L18 57Z" />
                <path d="M74 47L124 53L118 78L80 70Z" />
                <path d="M26 76L66 86L73 118L32 107Z" />
                <path d="M91 94L151 107L146 132L94 121Z" />
              </svg>
              <span>
                <MapPin size={12} /> Settlement context
              </span>
            </div>
            <div className="civic-preview-workflows">
              {[
                "Housing needs",
                "Service gaps",
                "Issue follow-up",
                "Redevelopment",
              ].map((label) => (
                <span key={label}>
                  <Building2 size={12} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="civic-preview-report">
            <span>Explore → Assess → Follow up → Report</span>
            <ArrowUpRight size={13} />
          </div>
          <div className="preview-bottom">
            <span>FICTIONAL RECORDS</span>
            <span>NO GOVERNMENT CONNECTION</span>
          </div>
        </WindowChrome>
      )}
      {kind === "grace-rul" && (
        <WindowChrome label="grace-rul / sensor recovery">
          <div className="verified-preview-heading">
            <span>
              <Cpu size={17} />
              Sensor histories → RUL
            </span>
            <small>RESEARCH</small>
          </div>
          <div className="sensor-preview-chart">
            <span>ILLUSTRATIVE SENSOR HISTORY</span>
            <svg viewBox="0 0 400 130" fill="none">
              <path className="sensor-grid" d="M0 25H400M0 65H400M0 105H400" />
              <path
                className="sensor-reference"
                d="M0 48L35 42L69 53L104 46L140 57L176 50L210 62L246 58L282 69L317 64L354 77L400 72"
              />
              <path
                className="sensor-corruption"
                d="M0 48L35 42L69 53L104 46L140 98L176 24L210 109L246 35L282 69L317 64L354 77L400 72"
              />
              <path
                className="sensor-recovery"
                d="M104 46L140 55L176 52L210 60L246 59L282 69"
              />
            </svg>
            <div>
              <span>Reference</span>
              <span>Suspected fault</span>
              <span>Selective repair</span>
            </div>
          </div>
          <div className="sensor-preview-stages">
            <span>Detect</span>
            <span>→</span>
            <span>Recover</span>
            <span>→</span>
            <span>Predict + interval</span>
          </div>
          <div className="preview-bottom">
            <span>NASA C-MAPSS FD001–FD004</span>
            <span>RESEARCH METHODS</span>
          </div>
        </WindowChrome>
      )}
      {kind === "sanjeevani" && (
        <>
          <span className="preview-orb orb-one" />
          <span className="preview-orb orb-two" />
          <WindowChrome label="sanjeevani / voice-first care">
            <div className="health-brand">
              <span>
                <Activity size={18} /> sanjeevani
                <span className="brand-dot">.</span>
              </span>
              <small>CARE IN YOUR LANGUAGE</small>
            </div>
            <div className="voice-orb">
              <AudioLines size={34} />
            </div>
            <h4>A voice. A little reassurance.</h4>
            <p>Tell me how you’re feeling.</p>
            <div className="voice-wave">
              {Array.from({ length: 35 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    "--bar-height": `${8 + Math.sin(i * 1.4) ** 2 * 28}px`,
                    "--delay": `${i * -0.08}s`,
                  }}
                />
              ))}
            </div>
            <div className="preview-bottom">
              <span>
                <span className="tiny-dot" /> 6+ Indic languages
              </span>
              <span>
                <ShieldCheck size={11} /> WHO grounded
              </span>
            </div>
          </WindowChrome>
          <span className="preview-sticker">
            <Trophy size={12} /> Hackathon winner
          </span>
        </>
      )}
      {kind === "codrix" && (
        <WindowChrome label="codrix.ai / codebase intelligence">
          <div className="code-title">
            <Code2 size={16} />
            <span>Understand the bigger picture.</span>
            <GitBranch size={14} />
          </div>
          <div className="code-preview-layout">
            <div className="code-lines">
              {codeLines.map(([n, keyword, text]) => (
                <div key={n}>
                  <span>{n}</span>
                  <code>
                    <b>{keyword}</b>
                    {text}
                  </code>
                </div>
              ))}
            </div>
            <svg className="mini-graph" viewBox="0 0 180 170">
              <g className="graph-edges">
                <path d="M90 35L35 85L65 140M90 35L145 85L115 140M35 85H145M65 140L90 35L115 140" />
              </g>
              {[
                [90, 35],
                [35, 85],
                [145, 85],
                [65, 140],
                [115, 140],
              ].map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r={i === 0 ? 17 : 12} />
                  <circle cx={x} cy={y} r="3" className="graph-center" />
                </g>
              ))}
            </svg>
          </div>
          <div className="code-search">
            <Search size={12} />
            <span>How does this codebase connect?</span>
            <span>↵</span>
          </div>
          <div className="preview-bottom">
            <span>AST → GRAPH → INSIGHT</span>
            <span>
              CONTEXT CONNECTED <span className="tiny-dot" />
            </span>
          </div>
        </WindowChrome>
      )}
      {kind === "careertrajectory" && (
        <WindowChrome label="careertrajectory / talent intelligence">
          <div className="talent-top">
            <Users size={18} />
            <span>Potential, beyond the keywords.</span>
            <GitBranch size={15} />
          </div>
          <div className="talent-body">
            <div className="talent-profile">
              <div className="profile-avatar">CT</div>
              <div className="profile-lines">
                <i />
                <i />
              </div>
              <div className="profile-tags">
                <span>Skills</span>
                <span>Growth</span>
              </div>
            </div>
            <div className="talent-connections">
              <i />
              <i />
              <i />
            </div>
            <div className="talent-agents">
              {["Resume analysis", "Technical depth", "Growth trajectory"].map(
                (t) => (
                  <span key={t}>
                    <Bot size={12} />
                    {t}
                    <Check size={11} />
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="preview-bottom">
            <span>7 SPECIALIZED AGENTS</span>
            <span>EXPLAINABLE BY DESIGN</span>
          </div>
        </WindowChrome>
      )}
      {kind === "cottonfield" && (
        <>
          <div className="field-map">
            {Array.from({ length: 48 }, (_, i) => (
              <span
                key={i}
                style={{ "--tile-tone": `${0.2 + ((i * 17) % 13) / 18}` }}
              >
                <i />
                <i />
                <i />
              </span>
            ))}
            <div className="field-reticle">
              <span />
              <Leaf size={20} />
              <span />
            </div>
          </div>
          <div className="field-caption">
            <span>
              <Leaf size={15} /> Cotton field analysis
            </span>
            <small>FROM PIXELS TO FIELD INSIGHTS</small>
          </div>
          <div className="field-legend">
            <span className="tiny-dot" /> CROP HEALTH MAPPING{" "}
            <span>RESTORMER + PYTORCH</span>
          </div>
        </>
      )}
      {kind === "alpaca" && (
        <WindowChrome label="signal / terminal">
          <div className="terminal-top">
            <span>
              <Activity size={15} /> Market intelligence
            </span>
            <small>
              <span className="tiny-dot" /> PAPER TRADING
            </small>
          </div>
          <svg className="trading-chart" viewBox="0 0 430 130">
            <defs>
              <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b3e5ca" stopOpacity="0.23" />
                <stop offset="100%" stopColor="#b3e5ca" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g className="chart-grid">
              <path d="M0 25H430M0 65H430M0 105H430M60 0V130M150 0V130M240 0V130M330 0V130" />
            </g>
            <path
              className="chart-area"
              d="M0 109L28 99L45 105L69 79L94 87L121 58L145 68L174 50L194 63L219 33L250 43L272 21L298 37L324 14L350 27L378 12L399 19L430 5V130H0Z"
            />
            <path
              className="chart-stroke"
              d="M0 109L28 99L45 105L69 79L94 87L121 58L145 68L174 50L194 63L219 33L250 43L272 21L298 37L324 14L350 27L378 12L399 19L430 5"
            />
          </svg>
          <div className="risk-gate">
            <span>Strategy</span>
            <span>→</span>
            <span>
              <ShieldCheck size={12} /> Risk engine
            </span>
            <span>→</span>
            <span>Alpaca</span>
          </div>
          <div className="preview-bottom">
            <span>5 STRATEGY AGENTS</span>
            <span>EVERY DECISION, AUDITED</span>
          </div>
        </WindowChrome>
      )}
      {kind === "finance" && (
        <WindowChrome label="ledgerpilot / financial control">
          <div className="finance-top">
            <span>
              <Wallet size={17} /> LedgerPilot
            </span>
            <ShieldCheck size={16} />
          </div>
          <div className="finance-ledger">
            {[
              ["Reconciliation", "Deterministic matching"],
              ["Tax matching", "Eligible evidence"],
              ["Cash forecasting", "History-based"],
            ].map(([name, state]) => (
              <div key={name}>
                <span>{name}</span>
                <span>
                  <Check size={12} />
                  {state}
                </span>
              </div>
            ))}
          </div>
          <div className="finance-note">
            <Cpu size={13} />
            <span>Python computes. AI explains.</span>
            <span>↗</span>
          </div>
          <div className="preview-bottom">
            <span>DETERMINISTIC BY DESIGN</span>
            <span>APPEND-ONLY AUDIT TRAIL</span>
          </div>
        </WindowChrome>
      )}
      <span className="preview-concept">INTERFACE CONCEPT</span>
    </div>
  );
}
