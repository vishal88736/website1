# Portfolio redesign — ready for local review

This document describes the portfolio redesign, local preview commands, and verification boundaries.

## Preview

```bash
cd "/home/vishal/D DRIVE/portfolio/website1"
npm ci
npm run dev
```

Open the Local URL printed by Vite. Add `?view=recruiter` to go directly to the recruiter overview. The Explore / Recruiter switch updates this URL and supports browser history.

## What changed

- Replaced decorative star motifs with a VA monogram and geometric details. Explore now defaults to Lavender, with Cocoa and four other palette options. Removed the star glyphs and Sparkles icons from the hero, project previews, about section, lab, and footer.
- Added an interactive system sketch with agent, RAG, and vision diagrams. These are architecture illustrations, not live model executions.
- Updated the hero, typography, featured project layouts, skills, contact section, and responsive navigation.
- Explore has a VA loading intro on fresh page loads, with a drawn monogram, rotating rings, loading bar, and an upward exit. It waits briefly for fonts with a bounded fallback, supports Skip intro and Escape, and releases page interaction after exiting. Entering Explore for the first time from Recruiter also shows the intro; later mode changes do not replay it.
- Explore includes letter-by-letter headline reveals, scroll parallax, pointer-driven card tilt and lighting, staggered skill animations, lifting cards, button sweeps, moving arrows, animated mode indicators, and sequential architecture redraws. Reduced-motion preferences shorten the intro and disable movement.
- Explore's scroll reveals rise gently over 1.2 seconds with a 64px travel distance and a small stagger. Headings remain visible and move a shorter distance; reveals start slightly before elements enter the viewport.
- Explore's latest motion pass adds magnetic action links, non-blocking click ripples, a sliding project-filter highlight, sequenced case-study details, and hover/focus animations inside each project preview.
- Featured Explore projects now tell a scroll-driven story: a sticky project visual and phase indicator sit beside Problem, Approach, and Result chapters. All text stays in document flow and uses the existing project data. Scrolling in either direction updates the phase; no wheel capture or forced scrolling is used. Phone layouts and short windows stack the visual above the text. Subtle and Off also use normal reading behavior without sticky motion.
- Each architecture diagram now has six inspectable nodes. Click, Enter, and Space select a step, highlight its connections, and update a live explanation. These remain illustrative diagrams, not model executions.
- Explore's header has Animation settings with Full, Subtle, and Off. Full retains the complete effects; Subtle uses brief fades/entrances without looping decoration, pointer effects, parallax, sticky stories, or smooth scrolling; Off makes changes immediate. Preferences persist locally, and a device's reduced-motion setting takes precedence and updates live. Recruiter always stays Off and hides this control.
- Recruiter has Print / Save PDF. It opens the native browser print dialog; choose Save as PDF there. The A4 print stylesheet removes navigation, dialogs, decorative content, and action buttons, exposes source URLs, and keeps individual project cards together where space allows. This prints the recruiter overview, not a generated replacement for the linked resume.
- Removed the three hero counters and reduced hero, marquee, and section padding. Section headings stay visible without a viewport callback; their animation no longer starts with a fully clipped mask that can leave a blank block.
- Added a recruiter overview inspired by the supplied reference layouts: profile, resume and professional links, existing highlights, compact project cards, skills sidebar, recognition timeline, and contact details.
- Both views use the existing portfolio dataset and links. No new employers, qualifications, performance measurements, or contribution statistics were invented.
- Explore retains light/dark themes and accent selection. Lavender is the default. Volt has been removed; obsolete selections fall back to Lavender. Cocoa adds warm brown foundations and accents in both light and dark appearances.
- Recruiter is always a simple white page with black text and gray borders. It uses static markup, native scrolling, immediate navigation, and no loader, entrance effects, animated hovering, or color controls. Explore's theme preferences remain saved for returning to Explore. The recruiter case study dialog omits the illustrated preview to keep its presentation plain.

## Verification

```bash
npm test
TEST_REDUCED_MOTION=0 npm test
npm run build
git diff --check
```

The 23 DOM interaction checks cover switching views and URL parameters, recruiter deep links and history events, opening and dismissing case studies, architecture controls, project filters, Explore's theme and palette controls, navigation dismissal with Escape, and the loading intro's completion, skip, keyboard, focus, and timeout behavior. They also check that Recruiter opens without a loader or animated content, that its color controls are absent, and that entering Recruiter destroys Explore's scroller while returning to Explore restores it. The latest checks cover Lavender defaults, migration of obsolete palettes, Cocoa startup backgrounds and persistence, and click-feedback isolation. New checks cover scroll phase updates and observer cleanup, keyboard and mouse diagram inspection, the print action, saved intensity settings, immediate content visibility in Off, smooth-scroller cleanup, startup motion preferences, and live device-preference changes. Run both normal and reduced-motion commands above. Recruiter color tokens were checked to be grayscale. Browser APIs are stubbed in these tests; they do not verify animation appearance, browser rendering, native dialog focus behavior, or responsive geometry.

The browser preview tool was unavailable in this session. Visual inspection on desktop and mobile remains part of review, including sticky geometry, actual animation timing, and native print/PDF pagination. The print test stubs window.print and does not render a PDF. The contact form's third-party delivery service and external resume/social links were retained; no real messages were sent and delivery was not tested.

`npm ci` reported two high-severity dependency advisories before implementation. The existing runtime/build dependency versions were retained; the only added dependency is the development-only DOM test library.

For visual review, refresh Explore to see the loader, try Skip intro or Escape, hover cards and buttons, switch architectures, and scroll to see parallax and section reveals. Check that the selected-work heading is visible and that the former hero counter strip is gone. Check Explore's light/dark themes and the OS reduced-motion setting. Open `?view=recruiter#work` directly to check the immediate, static black-and-white layout. Review both views and project dialogs at phone and desktop widths. The reference images informed the layout; their personal details and metrics were not copied.

For this feature pass, also scroll through the featured stories, select each architecture node with mouse and keyboard, try Full / Subtle / Off from the sliders icon, refresh to confirm persistence, and use Recruiter → Print / Save PDF to inspect the browser's print preview.
