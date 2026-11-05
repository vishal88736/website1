import assert from "node:assert/strict";
import { after, afterEach, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";
import {
  projects,
  upcoming,
  milestones,
  projectFilters,
  getProjectsByFilter,
} from "../src/data/portfolio.js";

// These are DOM interaction checks, not browser rendering or layout tests.
const dom = new JSDOM(
  '<!doctype html><html data-theme="dark" data-palette="volt"><head><meta name="theme-color"></head><body><div id="root"></div></body></html>',
  { url: "http://localhost:3000/", pretendToBeVisual: true },
);
for (const name of [
  "window",
  "Window",
  "Document",
  "document",
  "HTMLElement",
  "Element",
  "SVGElement",
  "HTMLDialogElement",
  "Node",
  "MutationObserver",
  "MouseEvent",
  "KeyboardEvent",
])
  globalThis[name] = dom.window[name];
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(
  dom.window,
);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(
  dom.window,
);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
Object.defineProperty(globalThis, "localStorage", {
  value: dom.window.localStorage,
  configurable: true,
});
const reducedMotion = process.env.TEST_REDUCED_MOTION !== "0";
dom.window.matchMedia = (query) => ({
  matches: reducedMotion && query.includes("prefers-reduced-motion"),
  media: query,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
});
dom.window.scrollTo = () => {};
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
dom.window.HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
dom.window.HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};

const { createElement, act } = await import("react");
const { createRoot } = await import("react-dom/client");
let server, Portfolio, App, root;
before(async () => {
  server = await createServer({
    root: fileURLToPath(new URL("..", import.meta.url)),
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true },
    appType: "custom",
  });
  Portfolio = (await server.ssrLoadModule("/portfolio.jsx")).default;
  App = (await server.ssrLoadModule("/src/App.jsx")).default;
});
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  root = null;
});
after(async () => {
  await server?.close();
  dom.window.close();
});

async function mount(
  path = "/",
  { completeIntro = true, withScroll = false } = {},
) {
  dom.window.history.replaceState({}, "", path);
  document.documentElement.dataset.theme = "dark";
  document.documentElement.dataset.palette = "volt";
  document.body.style.overflow = "";
  root = createRoot(document.getElementById("root"));
  await act(async () =>
    root.render(createElement(withScroll ? App : Portfolio)),
  );
  if (completeIntro) await waitForCount(".loading-screen", 0);
}
function button(text, within = document) {
  const found = [...within.querySelectorAll("button")].find((node) =>
    node.textContent.trim().startsWith(text),
  );
  assert.ok(found, `Button '${text}' exists`);
  return found;
}
async function click(node) {
  await act(async () =>
    node.dispatchEvent(new MouseEvent("click", { bubbles: true })),
  );
}
async function waitForCount(selector, count, timeout = 3500) {
  for (let attempt = 0; attempt < timeout / 20; attempt++) {
    if (document.querySelectorAll(selector).length === count) return;
    await act(async () => new Promise((resolve) => setTimeout(resolve, 20)));
  }
  assert.equal(document.querySelectorAll(selector).length, count);
}
function checkAnchorTargets() {
  for (const anchor of document.querySelectorAll('a[href^="#"]'))
    assert.ok(
      document.getElementById(anchor.hash.slice(1)),
      `Target exists for ${anchor.hash}`,
    );
  const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
  assert.equal(new Set(ids).size, ids.length, "No duplicate element IDs");
}

test("switches to a complete recruiter overview and maintains a shareable URL", async () => {
  await mount("/?ref=review#work");
  assert.ok(document.querySelector(".system-canvas"));
  await click(button("Recruiter"));
  assert.equal(window.location.search, "?ref=review&view=recruiter");
  assert.equal(window.location.hash, "");
  assert.equal(button("Recruiter").getAttribute("aria-pressed"), "true");
  assert.equal(
    document.querySelectorAll(".recruiter-project").length,
    projects.length,
  );
  assert.equal(document.querySelectorAll(".recruiter-skill-group").length, 6);
  assert.ok(
    document.querySelector(
      '.recruiter-quick-links a[href*="drive.google.com"]',
    ),
  );
  assert.equal(document.querySelector(".system-canvas"), null);
  checkAnchorTargets();
  await click(button("Explore"));
  assert.equal(window.location.search, "?ref=review");
  assert.ok(document.querySelector(".system-canvas"));
  checkAnchorTargets();
});

test("loads recruiter deep links and responds to history navigation", async () => {
  await mount("/?view=recruiter#work");
  assert.ok(document.querySelector("#recruiter-name"));
  assert.equal(window.location.hash, "#work");
  await act(async () => {
    window.history.replaceState({}, "", "/");
    window.dispatchEvent(new window.PopStateEvent("popstate"));
  });
  assert.ok(document.querySelector("#hero-title"));
  assert.equal(button("Explore").getAttribute("aria-pressed"), "true");
});

test("opens and dismisses case studies in both views without retaining scroll lock", async () => {
  await mount("/?view=recruiter");
  const existingProject = [
    ...document.querySelectorAll(".recruiter-project"),
  ].find((card) => card.querySelector("h3").textContent === "Sanjeevani");
  await click(button("Case study", existingProject));
  assert.equal(document.querySelector("dialog").open, true);
  assert.equal(
    document.querySelector("#case-title").textContent,
    "Sanjeevani.",
  );
  assert.equal(document.body.style.overflow, "hidden");
  await act(async () =>
    document
      .querySelector("dialog")
      .dispatchEvent(new window.Event("cancel", { cancelable: true })),
  );
  assert.equal(document.querySelector("dialog").open, false);
  assert.equal(document.body.style.overflow, "");
  await click(button("Explore"));
  await waitForCount(".loading-screen", 0);
  await click(
    document.querySelector('[aria-label="Open Sanjeevani case study"]'),
  );
  assert.equal(document.querySelector("dialog").open, true);
  await click(document.querySelector('[aria-label="Close case study"]'));
  assert.equal(document.querySelector("dialog").open, false);
  assert.equal(document.body.style.overflow, "");
});

test("architecture controls update the sketch and its accessible explanation", async () => {
  await mount();
  await click(button("RAG pipeline"));
  assert.equal(button("RAG pipeline").getAttribute("aria-pressed"), "true");
  assert.match(
    document.querySelector(".canvas-caption").textContent,
    /right context/,
  );
  assert.match(
    document.querySelector(".canvas-diagram").textContent,
    /Cited response/,
  );
  await click(button("Vision system"));
  assert.equal(button("RAG pipeline").getAttribute("aria-pressed"), "false");
  assert.match(
    document.querySelector(".canvas-diagram").textContent,
    /Field insights/,
  );
});

test("project filters show the intended projects and restore the complete gallery", async () => {
  await mount();
  const heading = document.querySelector("#work .section-heading");
  assert.notEqual(
    getComputedStyle(heading).opacity,
    "0",
    "The work heading is visible before any viewport callback",
  );
  assert.doesNotMatch(
    heading.style.clipPath,
    /100%/,
    "The heading is never fully clipped",
  );
  assert.equal(document.querySelector(".hero-mini-stats"), null);
  await click(button("Computer vision"));
  await waitForCount(".project-card", 1);
  assert.match(document.querySelector(".project-card").textContent, /Cotton/i);
  await click(button("AI & agents"));
  await waitForCount(".project-card", getProjectsByFilter("ai").length);
  await click(button("All projects"));
  assert.equal(
    document.querySelectorAll(".project-card").length,
    projects.length,
  );
});

test("theme and palette selection remain usable when changing views", async () => {
  await mount();
  await click(document.querySelector('[aria-label="Switch to light theme"]'));
  assert.equal(document.documentElement.dataset.theme, "light");
  await click(document.querySelector('[aria-label="Choose a color palette"]'));
  await click(button("Ocean"));
  assert.equal(document.documentElement.dataset.palette, "ocean");
  await click(button("Recruiter"));
  assert.equal(document.documentElement.dataset.theme, "light");
  assert.equal(document.documentElement.dataset.palette, "ocean");
  assert.equal(
    document.querySelector('[aria-label="Choose a color palette"]'),
    null,
  );
  assert.equal(
    document.querySelector('[aria-label="Switch to dark theme"]'),
    null,
  );
  await click(button("Explore"));
  assert.ok(document.querySelector('[aria-label="Switch to dark theme"]'));
});

test("mobile navigation closes with Escape and clears page inertness in each view", async () => {
  await mount();
  for (const view of ["Explore", "Recruiter"]) {
    await click(button(view));
    await click(document.querySelector('[aria-label="Open navigation"]'));
    assert.equal(document.querySelector("main").hasAttribute("inert"), true);
    assert.equal(document.body.style.overflow, "hidden");
    await act(async () =>
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      ),
    );
    assert.equal(document.querySelector("main").hasAttribute("inert"), false);
    assert.equal(document.body.style.overflow, "");
    assert.equal(
      document.activeElement,
      document.querySelector('[aria-label="Open navigation"]'),
    );
  }
});

test("loading intro appears on a fresh load and automatically releases the page", async () => {
  await mount("/", { completeIntro: false });
  assert.ok(document.querySelector(".loading-screen"));
  assert.equal(document.querySelector("header").hasAttribute("inert"), true);
  assert.equal(document.querySelector("main").hasAttribute("inert"), true);
  assert.equal(document.body.style.overflow, "hidden");
  await waitForCount(".loading-screen", 0);
  assert.equal(document.documentElement.dataset.ready, "true");
  assert.equal(document.querySelector("header").hasAttribute("inert"), false);
  assert.equal(document.querySelector("main").hasAttribute("inert"), false);
  assert.equal(document.body.style.overflow, "");
});

test("Skip intro restores focus and the loading screen does not replay on view changes", async () => {
  await mount("/", { completeIntro: false });
  const skip = button("Skip intro");
  skip.focus();
  await click(skip);
  await waitForCount(".loading-screen", 0);
  assert.equal(document.activeElement, document.querySelector("main"));
  assert.equal(document.body.style.overflow, "");
  await click(button("Recruiter"));
  await click(button("Explore"));
  assert.equal(document.querySelector(".loading-screen"), null);
  assert.equal(document.querySelector("main").hasAttribute("inert"), false);
});

test("Escape dismisses the Explore intro without leaving the page locked", async () => {
  await mount("/", { completeIntro: false });
  await act(async () =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  await waitForCount(".loading-screen", 0);
  assert.ok(document.querySelector("#hero-title"));
  assert.equal(document.querySelector("main").hasAttribute("inert"), false);
  assert.equal(document.body.style.overflow, "");
});

test("a stalled font request cannot trap visitors in the loading intro", async () => {
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready: new Promise(() => {}) },
  });
  try {
    await mount("/", { completeIntro: false });
    assert.ok(document.querySelector(".loading-screen"));
    await waitForCount(".loading-screen", 0, 3500);
    assert.equal(document.body.style.overflow, "");
    assert.equal(document.querySelector("main").hasAttribute("inert"), false);
  } finally {
    delete document.fonts;
  }
});

test("view and theme transitions honor motion preferences and recover from interrupted effects", async () => {
  await mount();
  let transitions = 0;
  document.startViewTransition = (update) => {
    transitions++;
    update();
    return { finished: Promise.reject(new Error("Transition interrupted")) };
  };
  try {
    await click(button("Recruiter"));
    assert.ok(document.querySelector("#recruiter-name"));
    assert.equal(window.location.search, "?view=recruiter");
    assert.equal(
      transitions,
      0,
      "Entering Recruiter never starts a visual transition",
    );
    assert.equal(document.documentElement.dataset.transition, undefined);
    await click(button("Explore"));
    await click(document.querySelector('[aria-label="Switch to light theme"]'));
    assert.equal(document.documentElement.dataset.theme, "light");
    assert.equal(document.documentElement.dataset.transition, undefined);
    assert.equal(transitions, reducedMotion ? 0 : 2);
  } finally {
    delete document.startViewTransition;
  }
});

test("Recruiter loads immediately with static content and no Explore motion controls", async () => {
  await mount("/?view=recruiter", { completeIntro: false });
  assert.ok(document.querySelector("#recruiter-name"));
  assert.equal(document.documentElement.dataset.view, "recruiter");
  assert.equal(document.querySelector(".loading-screen"), null);
  assert.equal(document.querySelector(".kinetic-line"), null);
  assert.equal(document.querySelector(".pointer-surface"), null);
  assert.equal(document.querySelector(".count-up"), null);
  assert.equal(document.querySelectorAll(".recruiter-page [style]").length, 0);
  assert.equal(
    document.querySelector('[aria-label="Choose a color palette"]'),
    null,
  );
  assert.equal(document.querySelector("main").hasAttribute("inert"), false);
  assert.equal(document.body.style.overflow, "");
  await click(button("Explore"));
  assert.ok(
    document.querySelector(".loading-screen"),
    "First entry to Explore shows its intro",
  );
  await click(button("Skip intro"));
  await waitForCount(".loading-screen", 0);
  assert.ok(document.querySelector(".kinetic-line"));
  assert.equal(document.querySelector(".hero-mini-stats"), null);
  await click(button("Recruiter"));
  assert.equal(document.querySelector(".count-up"), null);
  assert.equal(document.querySelector(".loading-screen"), null);
});

test("Recruiter releases Explore's scroller and returning to Explore restores it", async () => {
  await mount("/", { completeIntro: false, withScroll: true });
  if (!reducedMotion)
    assert.ok(window.__lenis, "Explore initializes smooth scrolling");
  await click(button("Skip intro"));
  await waitForCount(".loading-screen", 0);
  await click(button("Recruiter"));
  assert.equal(
    window.__lenis,
    undefined,
    "Recruiter destroys the smooth scroller",
  );
  assert.equal(
    document.documentElement.classList.contains("lenis-stopped"),
    false,
  );
  assert.equal(document.body.style.overflow, "");
  await click(button("Explore"));
  if (!reducedMotion)
    assert.ok(window.__lenis, "Explore restores smooth scrolling");
  assert.equal(
    document.documentElement.classList.contains("lenis-stopped"),
    false,
  );
});

test("project and development data preserve the requested order and derive numbering and filters", () => {
  assert.deepEqual(
    projects.map((project) => project.id),
    [
      "krono",
      "urbansaarthi",
      "grace-rul",
      "sanjeevani",
      "codrix",
      "careertrajectory",
      "cottonfield",
      "alpaca",
      "finance",
    ],
  );
  assert.deepEqual(
    upcoming.map((project) => project.id),
    ["canopy", "cryptrix", "novatune"],
  );
  assert.equal(
    new Set(projects.map((project) => project.id)).size,
    projects.length,
  );
  for (const [index, project] of projects.entries()) {
    assert.equal(project.number, String(index + 1).padStart(2, "0"));
    assert.ok(projectFilters.some((filter) => filter.id === project.filter));
    assert.ok(project.story.architecture.length > 0);
    assert.ok(project.story.techStack.length > 0);
  }
  const ledgerPilot = projects.find((project) => project.id === "finance");
  assert.equal(ledgerPilot.title, "LedgerPilot");
  assert.equal(ledgerPilot.tagline, "AI-assisted. Auditor-ready.");
  assert.equal(
    ledgerPilot.scope,
    "Functional demonstration and continued development.",
  );
  assert.equal(
    projects.filter((project) => project.github === ledgerPilot.github).length,
    1,
    "LedgerPilot keeps the existing source entry without duplication",
  );
  assert.ok(ledgerPilot.story.techStack.includes("SQLAlchemy"));
  assert.ok(ledgerPilot.story.techStack.includes("NumPy"));
  assert.equal(getProjectsByFilter("all").length, projects.length);
  assert.deepEqual(
    getProjectsByFilter("civic").map((project) => project.id),
    ["urbansaarthi"],
  );
  assert.deepEqual(
    getProjectsByFilter("vision").map((project) => project.id),
    ["cottonfield"],
  );
  assert.match(projects[1].summary, /synthetic.*not official government/i);
  assert.match(projects[2].scope, /no unverified accuracy/i);
  assert.equal(
    projects.some((project) => /canopy|workersaathi/i.test(project.title)),
    false,
  );
});

test("Explore renders the new previews and keeps every filter count in sync with its results", async () => {
  await mount();
  assert.deepEqual(
    [...document.querySelectorAll(".project-card h3")].map(
      (node) => node.textContent,
    ),
    projects.map((project) => project.title),
  );
  for (const project of [
    ...projects.slice(0, 3),
    projects.find((project) => project.id === "finance"),
  ]) {
    const preview = document.querySelector(`.preview-${project.id}`);
    assert.ok(
      preview.querySelector(".preview-window"),
      `${project.title} has a dedicated preview`,
    );
    assert.match(preview.textContent, /INTERFACE CONCEPT/);
  }
  assert.ok(
    document.querySelector(
      '.project-card a[href="https://d2nrwxy6sjb9o8.cloudfront.net/"]',
    ),
  );
  for (const filter of projectFilters) {
    const control = button(
      filter.label,
      document.querySelector(".project-filters"),
    );
    const expected = getProjectsByFilter(filter.id);
    assert.equal(
      control.querySelector("span").textContent,
      String(expected.length).padStart(2, "0"),
    );
    await click(control);
    await waitForCount(".project-card", expected.length);
    assert.deepEqual(
      [...document.querySelectorAll(".project-card h3")].map(
        (node) => node.textContent,
      ),
      expected.map((project) => project.title),
    );
    assert.match(
      document.querySelector(".work-count").textContent,
      new RegExp(`${String(expected.length).padStart(2, "0")} PROJECTS`),
    );
  }
});

test("new case studies and verified source/demo links work in Explore and Recruiter", async () => {
  await mount();
  for (const view of ["Explore", "Recruiter"]) {
    await click(button(view));
    for (const project of [
      ...projects.slice(0, 3),
      projects.find((project) => project.id === "finance"),
    ]) {
      if (view === "Explore")
        await click(
          document.querySelector(
            `[aria-label="Open ${project.title} case study"]`,
          ),
        );
      else {
        const card = [...document.querySelectorAll(".recruiter-project")].find(
          (node) => node.querySelector("h3").textContent === project.title,
        );
        assert.match(
          card.textContent,
          new RegExp(project.scope.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
        );
        await click(button("Case study", card));
      }
      const dialog = document.querySelector("dialog");
      assert.equal(dialog.open, true);
      assert.equal(
        dialog.querySelector("#case-title").textContent,
        `${project.title}.`,
      );
      assert.equal(
        dialog.querySelectorAll(".architecture-step").length,
        project.story.architecture.length,
      );
      assert.equal(
        dialog.querySelector(".case-scope").textContent,
        project.scope,
      );
      assert.ok(
        [...dialog.querySelectorAll("a")].some(
          (link) => link.href === project.github,
        ),
      );
      const demo = [...dialog.querySelectorAll("a")].find((link) =>
        link.textContent.includes("Live demo"),
      );
      assert.equal(demo?.href, project.demo);
      await click(dialog.querySelector('[aria-label="Close case study"]'));
      assert.equal(dialog.open, false);
    }
    if (view === "Recruiter") {
      assert.deepEqual(
        [...document.querySelectorAll(".recruiter-project h3")].map(
          (node) => node.textContent,
        ),
        projects.map((project) => project.title),
      );
      assert.equal(
        document.querySelectorAll(".recruiter-page [style]").length,
        0,
      );
    }
  }
});

test("both views show the new achievements first and Canopy only in the building list", async () => {
  await mount();
  for (const view of ["Explore", "Recruiter"]) {
    await click(button(view));
    const recognition =
      view === "Explore"
        ? [...document.querySelectorAll(".milestone")]
        : [...document.querySelectorAll(".recruiter-timeline article")];
    assert.deepEqual(
      recognition.map((node) => node.querySelector("h3").textContent),
      milestones.map((item) => item.org),
    );
    assert.match(recognition[0].textContent, /1st Place.*Best Solution/);
    assert.match(recognition[0].textContent, /4,100\+ registered builders/);
    assert.match(
      recognition[0].textContent,
      /WorkerSaathi.*AssemblyAI real-time speech.*Hindi and English.*legal reasoning.*grievance summaries.*resolution workflows/s,
    );
    assert.match(recognition[1].textContent, /Rank 8.*Track B/);
    assert.match(recognition[1].textContent, /KamandPrompt.*IIT Mandi/);
    assert.match(recognition[1].textContent, /4,300 participants across/);
    assert.doesNotMatch(
      recognition
        .slice(0, 2)
        .map((node) => node.textContent)
        .join(" "),
      /Gireesh|Aaditya|Meghrajani|Mishra/,
    );
    const building =
      view === "Explore"
        ? [...document.querySelectorAll(".lab-card")]
        : [...document.querySelectorAll(".recruiter-building-item")];
    assert.deepEqual(
      building.map((node) => node.querySelector("h3").textContent.trim()),
      upcoming.map((item) => item.title),
    );
    assert.match(building[0].textContent, /BUILDING/);
    const completed = [
      ...document.querySelectorAll(
        view === "Explore" ? ".project-card h3" : ".recruiter-project h3",
      ),
    ]
      .map((node) => node.textContent)
      .join(" ");
    assert.doesNotMatch(completed, /Canopy|WorkerSaathi/);
    checkAnchorTargets();
  }
});
