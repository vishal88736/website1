import assert from "node:assert/strict";
import { after, afterEach, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

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
  assert.equal(document.querySelectorAll(".recruiter-project").length, 6);
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
  await click(button("Case study"));
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
  await waitForCount(".project-card", 5);
  await click(button("All projects"));
  assert.equal(document.querySelectorAll(".project-card").length, 6);
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
