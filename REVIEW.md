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

- Replaced the warm palette and decorative star motifs with graphite, lime, a VA monogram, and geometric details. Removed the star glyphs and Sparkles icons from the hero, project previews, about section, lab, and footer.
- Added an interactive system sketch with agent, RAG, and vision diagrams. These are architecture illustrations, not live model executions.
- Updated the hero, typography, featured project layouts, skills, contact section, and responsive navigation.
- Explore has a VA loading intro on fresh page loads, with a drawn monogram, rotating rings, loading bar, and an upward exit. It waits briefly for fonts with a bounded fallback, supports Skip intro and Escape, and releases page interaction after exiting. Entering Explore for the first time from Recruiter also shows the intro; later mode changes do not replay it.
- Explore includes letter-by-letter headline reveals, scroll parallax, pointer-driven card tilt and lighting, staggered skill animations, lifting cards, button sweeps, moving arrows, animated mode indicators, and sequential architecture redraws. Reduced-motion preferences shorten the intro and disable movement.
- Removed the three hero counters and reduced hero, marquee, and section padding. Section headings stay visible without a viewport callback; their animation no longer starts with a fully clipped mask that can leave a blank block.
- Added a recruiter overview inspired by the supplied reference layouts: profile, resume and professional links, existing highlights, compact project cards, skills sidebar, recognition timeline, and contact details.
- Both views use the existing portfolio dataset and links. No new employers, qualifications, performance measurements, or contribution statistics were invented.
- Explore retains light/dark themes and accent selection. The default accent is now Volt; obsolete Ember preferences fall back to it.
- Recruiter is always a simple white page with black text and gray borders. It uses static markup, native scrolling, immediate navigation, and no loader, entrance effects, animated hovering, or color controls. Explore's theme preferences remain saved for returning to Explore. The recruiter case study dialog omits the illustrated preview to keep its presentation plain.

## Verification

```bash
npm test
TEST_REDUCED_MOTION=0 npm test
npm run build
git diff --check
```

The 14 DOM interaction checks cover switching views and URL parameters, recruiter deep links and history events, opening and dismissing case studies, architecture controls, project filters, Explore's theme and palette controls, navigation dismissal with Escape, and the loading intro's completion, skip, keyboard, focus, and timeout behavior. They also check that Recruiter opens without a loader or animated content, that its color controls are absent, and that entering Recruiter destroys Explore's scroller while returning to Explore restores it. Run both normal and reduced-motion commands above. Recruiter color tokens were checked to be grayscale. Browser APIs are stubbed in these tests; they do not verify animation appearance, browser rendering, native dialog focus behavior, or responsive geometry.

The browser preview tool was unavailable in this session. Visual inspection on desktop and mobile remains part of review. The contact form's third-party delivery service and external resume/social links were retained; no real messages were sent and delivery was not tested.

`npm ci` reported two high-severity dependency advisories before implementation. The existing runtime/build dependency versions were retained; the only added dependency is the development-only DOM test library.

For visual review, refresh Explore to see the loader, try Skip intro or Escape, hover cards and buttons, switch architectures, and scroll to see parallax and section reveals. Check that the selected-work heading is visible and that the former hero counter strip is gone. Check Explore's light/dark themes and the OS reduced-motion setting. Open `?view=recruiter#work` directly to check the immediate, static black-and-white layout. Review both views and project dialogs at phone and desktop widths. The reference images informed the layout; their personal details and metrics were not copied.
