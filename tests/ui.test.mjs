import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, afterEach, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

// These are DOM interaction checks, not browser rendering or layout tests.
const dom = new JSDOM(
  '<!doctype html><html data-theme="dark" data-palette="lavender"><head><meta name="theme-color"></head><body><div id="root"></div></body></html>',
  { url: "http://localhost:3000/", pretendToBeVisual: true },
);
for (const name of [
  "window",
  "Window",
  "Document",
  "document",
  "HTMLElement",
  "Element",
  "EventTarget",
  "AbortController",
  "AbortSignal",
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
let systemReducedMotion = reducedMotion;
const mediaQueries = new Map();
dom.window.matchMedia = (query) => {
  if (!mediaQueries.has(query)) {
    const listeners = new Set();
    mediaQueries.set(query, {
      get matches() {
        return systemReducedMotion && query.includes("prefers-reduced-motion");
      },
      media: query,
      addListener(listener) {
        listeners.add(listener);
      },
      removeListener(listener) {
        listeners.delete(listener);
      },
      addEventListener(type, listener) {
        if (type === "change") listeners.add(listener);
      },
      removeEventListener(type, listener) {
        if (type === "change") listeners.delete(listener);
      },
      listeners,
    });
  }
  return mediaQueries.get(query);
};
function changeSystemMotion(value) {
  systemReducedMotion = value;
  for (const media of mediaQueries.values()) {
    if (media.media.includes("prefers-reduced-motion"))
      media.listeners.forEach((listener) =>
        listener({ matches: media.matches, media: media.media }),
      );
  }
}
dom.window.scrollTo = () => {};
const intersectionObservers = new Set();
globalThis.IntersectionObserver = class {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.targets = new Set();
    intersectionObservers.add(this);
  }
  observe(target) {
    this.targets.add(target);
  }
  unobserve(target) {
    this.targets.delete(target);
  }
  disconnect() {
    this.targets.clear();
    intersectionObservers.delete(this);
  }
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
let server, Portfolio, App, MotionSettingsProvider, root;
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
  MotionSettingsProvider = (
    await server.ssrLoadModule("/src/components/MotionSettings.jsx")
  ).MotionSettingsProvider;
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
  { completeIntro = true, withScroll = false, motion = "full" } = {},
) {
  dom.window.history.replaceState({}, "", path);
  document.documentElement.dataset.theme = "dark";
  document.documentElement.dataset.palette = "lavender";
  document.body.style.overflow = "";
  if (motion !== null) localStorage.setItem("va-motion", motion);
  root = createRoot(document.getElementById("root"));
  await act(async () =>
    root.render(
      withScroll
        ? createElement(App)
        : createElement(MotionSettingsProvider, null, createElement(Portfolio)),
    ),
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
  assert.equal(document.querySelector(".case-animated"), null);
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

test("palette picker defaults to Lavender, offers Cocoa, and removes Volt", async () => {
  await mount();
  assert.equal(document.documentElement.dataset.palette, "lavender");
  await click(document.querySelector('[aria-label="Choose a color palette"]'));
  assert.equal(button("Lavender").getAttribute("aria-pressed"), "true");
  assert.equal(document.querySelectorAll(".palette-option").length, 6);
  assert.equal(
    [...document.querySelectorAll(".palette-option")].some((option) =>
      option.textContent.includes("Volt"),
    ),
    false,
  );
  await click(button("Cocoa"));
  assert.equal(document.documentElement.dataset.palette, "cocoa");
  assert.equal(localStorage.getItem("va-palette"), "cocoa");
  await click(document.querySelector('[aria-label="Switch to light theme"]'));
  assert.equal(document.documentElement.dataset.palette, "cocoa");
  await click(button("Recruiter"));
  assert.equal(
    document.querySelector('[aria-label="Choose a color palette"]'),
    null,
  );
  await click(button("Explore"));
  assert.equal(document.documentElement.dataset.palette, "cocoa");
});

test("startup migrates obsolete palettes to Lavender and uses matching Cocoa backgrounds", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [saved, theme, query, palette, background] of [
    [null, "dark", "", "lavender", "#101316"],
    ["volt", "dark", "", "lavender", "#101316"],
    ["cocoa", "dark", "", "cocoa", "#1b1714"],
    ["cocoa", "light", "", "cocoa", "#f6f1e9"],
    ["ocean", "light", "", "ocean", "#f4f5f0"],
    ["cocoa", "dark", "?view=recruiter", "cocoa", "#fafafa"],
  ]) {
    const page = new JSDOM(
      '<html><head><meta name="theme-color"></head><body></body></html>',
      { url: `http://localhost:3000/${query}`, runScripts: "outside-only" },
    );
    try {
      page.window.localStorage.setItem("va-theme", theme);
      if (saved) page.window.localStorage.setItem("va-palette", saved);
      page.window.eval(script);
      assert.equal(
        page.window.document.documentElement.dataset.palette,
        palette,
      );
      assert.equal(
        page.window.document.documentElement.style.getPropertyValue(
          "--boot-bg",
        ),
        background,
      );
    } finally {
      page.window.close();
    }
  }
});

test("click feedback honors reduced motion, keeps filters working, and disappears in Recruiter", async () => {
  await mount();
  const filter = button("Computer vision");
  await act(async () =>
    filter.dispatchEvent(
      new MouseEvent("pointerdown", {
        bubbles: true,
        button: 0,
        clientX: 100,
        clientY: 200,
      }),
    ),
  );
  assert.equal(
    document.querySelectorAll(".click-feedback-ring").length,
    reducedMotion ? 0 : 1,
  );
  await click(filter);
  await waitForCount(".project-card", 1);
  assert.equal(filter.getAttribute("aria-pressed"), "true");
  await click(button("Recruiter"));
  assert.equal(document.querySelector(".click-feedback"), null);
  assert.equal(document.querySelector(".magnetic-link"), null);
  assert.equal(document.querySelector(".case-animated"), null);
});

test("featured project stories follow scroll intersections and keep all chapters readable", async () => {
  await mount();
  const story = document.querySelector(".project-story");
  const chapters = [...story.querySelectorAll(".story-chapter")];
  assert.equal(chapters.length, 3);
  assert.match(chapters[0].textContent, /The problem/);
  assert.match(chapters[1].textContent, /The approach/);
  assert.match(chapters[2].textContent, /The result/);
  assert.ok(
    chapters.every(
      (chapter) => !chapter.hidden && !chapter.hasAttribute("aria-hidden"),
    ),
  );
  const observer = [...intersectionObservers].find((item) =>
    item.targets.has(chapters[0]),
  );
  assert.ok(observer, "Story observes its real text sections");
  for (const phase of [1, 2, 0]) {
    await act(async () =>
      observer.callback([{ target: chapters[phase], isIntersecting: true }]),
    );
    assert.equal(
      story.querySelector(".story-visual").dataset.phase,
      String(phase),
    );
    assert.equal(story.querySelectorAll(".story-chapter.is-current").length, 1);
    assert.ok(chapters[phase].classList.contains("is-current"));
  }
  checkAnchorTargets();
  await click(button("Recruiter"));
  assert.equal(document.querySelector(".story-visual"), null);
  assert.equal(document.querySelector(".story-chapters"), null);
  assert.equal(
    observer.targets.size,
    0,
    "Unmounting releases scroll observers",
  );
});

test("architecture nodes support mouse, Enter and Space and explain the selected connections", async () => {
  await mount();
  await click(button("RAG pipeline"));
  const node = document.querySelector('[aria-label="Inspect Sources"]');
  assert.equal(node.getAttribute("role"), "button");
  assert.equal(node.getAttribute("tabindex"), "0");
  assert.equal(node.closest('[aria-hidden="true"]'), null);
  await click(node);
  const detail = document.getElementById(node.getAttribute("aria-controls"));
  assert.match(detail.textContent, /Prepare and index documents/);
  assert.equal(node.getAttribute("aria-pressed"), "true");
  assert.equal(
    document.querySelectorAll('.system-connections path[data-active="true"]')
      .length,
    2,
  );
  for (const [label, key, expected] of [
    ["Cited response", "Enter", /sources used/],
    ["Context", " ", /Select relevant passages/],
  ]) {
    const target = document.querySelector(`[aria-label="Inspect ${label}"]`);
    await act(async () =>
      target.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
      ),
    );
    assert.equal(target.getAttribute("aria-pressed"), "true");
    assert.match(detail.textContent, expected);
  }
  await click(button("Vision system"));
  assert.match(detail.textContent, /Coordinate preprocessing/);
  assert.equal(
    document.querySelectorAll('.diagram-node[aria-pressed="true"]').length,
    1,
  );
});

test("Recruiter's Print / Save PDF opens the native print dialog without altering the view", async () => {
  await mount("/?view=recruiter");
  const originalPrint = window.print;
  let printed = 0;
  window.print = () => {
    printed++;
  };
  try {
    await click(button("Print / Save PDF"));
    assert.equal(printed, 1);
    assert.equal(document.documentElement.dataset.view, "recruiter");
    assert.equal(document.documentElement.dataset.motion, "off");
    assert.equal(document.querySelectorAll(".recruiter-project").length, 6);
    assert.equal(
      document.querySelector('[aria-label="Animation settings"]'),
      null,
    );
    await click(button("Explore"));
    assert.equal(document.querySelector(".recruiter-print"), null);
  } finally {
    window.print = originalPrint;
  }
});

test("motion intensity updates immediately, releases smoothing and persists between visits", async () => {
  await mount("/", { withScroll: true });
  await click(document.querySelector('[aria-label="Animation settings"]'));
  const options = document.querySelector('[aria-label="Animation intensity"]');
  for (const [label, value] of [
    ["Subtle", "subtle"],
    ["Off", "off"],
    ["Full", "full"],
  ]) {
    await click(button(label, options));
    assert.equal(localStorage.getItem("va-motion"), value);
    assert.equal(button(label, options).getAttribute("aria-pressed"), "true");
    assert.equal(
      document.documentElement.dataset.motion,
      reducedMotion ? "off" : value,
    );
    if (value !== "full" || reducedMotion) {
      assert.equal(window.__lenis, undefined);
      assert.equal(document.querySelector(".click-feedback"), null);
      assert.equal(
        document.documentElement.classList.contains("lenis-stopped"),
        false,
      );
    } else assert.ok(window.__lenis);
  }
  await click(button("Off", options));
  await act(async () => new Promise((resolve) => setTimeout(resolve, 50)));
  assert.equal(
    document.querySelector(".work-toolbar").style.opacity,
    "1",
    "Turning motion off reveals content immediately",
  );
  await act(async () =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  assert.equal(document.querySelector(".motion-popover"), null);
  assert.equal(
    document.activeElement,
    document.querySelector('[aria-label="Animation settings"]'),
  );
  await click(button("Recruiter"));
  assert.equal(document.documentElement.dataset.motion, "off");
  await click(button("Explore"));
  assert.equal(document.documentElement.dataset.motion, "off");
  await act(async () => root.unmount());
  root = null;
  await mount("/", { motion: null });
  assert.equal(document.documentElement.dataset.motion, "off");
  await click(document.querySelector('[aria-label="Animation settings"]'));
  assert.equal(
    button("Off", document.querySelector(".motion-options")).getAttribute(
      "aria-pressed",
    ),
    "true",
  );
  const headline = document.querySelector(".kinetic-line");
  const headlineObserver = [...intersectionObservers].find((item) =>
    item.targets.has(headline),
  );
  assert.ok(
    headlineObserver,
    "The static headline remains observed so Full can be restored safely",
  );
  await act(async () =>
    headlineObserver.callback([{ target: headline, isIntersecting: true }]),
  );
  await click(button("Full", document.querySelector(".motion-options")));
  if (!reducedMotion) {
    await act(async () => new Promise((resolve) => setTimeout(resolve, 150)));
    assert.ok(
      Number(headline.querySelector(".kinetic-character").style.opacity) > 0,
      "Restoring Full animates a visible headline instead of stranding hidden letters",
    );
  }
});

test("changing the device's reduced-motion preference updates Explore live", async () => {
  await mount("/", { withScroll: true });
  try {
    await act(async () => changeSystemMotion(true));
    assert.equal(document.documentElement.dataset.motion, "off");
    assert.equal(window.__lenis, undefined);
    assert.equal(document.querySelector(".click-feedback"), null);
    await click(document.querySelector('[aria-label="Animation settings"]'));
    assert.match(
      document.querySelector(".motion-popover [role=status]").textContent,
      /device requests reduced motion/,
    );
    await click(button("Full", document.querySelector(".motion-options")));
    assert.equal(
      document.documentElement.dataset.motion,
      "off",
      "Full cannot override the device preference",
    );
    await act(async () => changeSystemMotion(false));
    assert.equal(document.documentElement.dataset.motion, "full");
    assert.ok(window.__lenis);
    await click(button("Recruiter"));
    assert.equal(document.documentElement.dataset.motion, "off");
    await act(async () => changeSystemMotion(true));
    await act(async () => changeSystemMotion(false));
    assert.equal(
      document.documentElement.dataset.motion,
      "off",
      "Recruiter stays static across OS changes",
    );
  } finally {
    await act(async () => changeSystemMotion(reducedMotion));
  }
});

test("startup applies saved motion settings before the app mounts and respects the device preference", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [saved, reduced, query, expected] of [
    [null, false, "", "full"],
    ["subtle", false, "", "subtle"],
    ["off", false, "", "off"],
    ["invalid", false, "", "full"],
    ["full", true, "", "off"],
    ["full", false, "?view=recruiter", "off"],
  ]) {
    const page = new JSDOM(
      '<html><head><meta name="theme-color"></head><body></body></html>',
      { url: `http://localhost:3000/${query}`, runScripts: "outside-only" },
    );
    try {
      page.window.matchMedia = (query) => ({
        matches: query.includes("prefers-reduced-motion") && reduced,
      });
      page.window.localStorage.setItem("va-theme", "dark");
      if (saved) page.window.localStorage.setItem("va-motion", saved);
      page.window.eval(script);
      assert.equal(
        page.window.document.documentElement.dataset.motion,
        expected,
      );
    } finally {
      page.window.close();
    }
  }
});
