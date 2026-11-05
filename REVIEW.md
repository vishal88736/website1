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

The 18 DOM interaction checks cover switching views and URL parameters, recruiter deep links and history events, opening and dismissing case studies, architecture controls, project filters, Explore's theme and palette controls, navigation dismissal with Escape, and the loading intro's completion, skip, keyboard, focus, and timeout behavior. They also check that Recruiter opens without a loader or animated content, that its color controls are absent, and that entering Recruiter destroys Explore's scroller while returning to Explore restores it. The content checks also cover the new project order, data-derived numbering and filter counts, dedicated previews, case studies and demo links in both views, the Building list, and achievement order with team member names omitted. Run both normal and reduced-motion commands above. Recruiter color tokens were checked to be grayscale. Browser APIs are stubbed in these tests; they do not verify animation appearance, browser rendering, native dialog focus behavior, or responsive geometry.

The browser preview tool was unavailable in this session. Visual inspection on desktop and mobile remains part of review. The contact form's third-party delivery service and external resume/social links were retained; no real messages were sent and delivery was not tested.

`npm ci` reported two high-severity dependency advisories before implementation. The existing runtime/build dependency versions were retained; the only added dependency is the development-only DOM test library.

For visual review, refresh Explore to see the loader, try Skip intro or Escape, hover cards and buttons, switch architectures, and scroll to see parallax and section reveals. Check that the selected-work heading is visible and that the former hero counter strip is gone. Check Explore's light/dark themes and the OS reduced-motion setting. Open `?view=recruiter#work` directly to check the immediate, static black-and-white layout. Review both views and project dialogs at phone and desktop widths. The reference images informed the layout; their personal details and metrics were not copied.


## Project and recognition update — 5 November 2026

Work was performed directly on the existing `main` checkout. The separate motion draft branch was not merged or cherry-picked. The design, theme, motion components, navigation, and existing content remain in place.

- Projects now start with Krono, NagarSeva First / UrbanSaarthi, and CMAPSS Predictive Maintenance / GRACE-RUL. The original six projects retain their relative order; the finance entry now uses the current LedgerPilot branding and expanded case study. Display numbers and filter counts derive from the data; Civic tech has its own filter.
- Canopy leads The Lab / Building list with a Building status. Recruiter now includes the same development entries in a separate static panel; these do not count as completed projects. The numeric career-highlights strip beneath the recruiter profile has been removed.
- Recognition begins with the supplied AssemblyAI Best Solution / 1st Place and IIT Mandi Track B / Rank 8 achievements. WorkerSaathi's supplied voice/legal-workflow description stays in the AssemblyAI entry. No team member names or unsupported achievement date were added. The original three achievements remain.
- New preview visuals are labeled interface concepts; their plots and map shapes are illustrations, not measured project output. Research/simulation/synthetic-data scope is visible on the cards and in their case studies.

### Content sources

Descriptions were checked against current repository documentation and relevant implementation files, rather than the older cached public repository summary.

| Entry | Sources inspected | Scope retained |
| --- | --- | --- |
| Krono | [README](https://github.com/vishal88736/automatic-trading-agent/blob/main/README.md), [architecture](https://github.com/vishal88736/automatic-trading-agent/blob/main/docs/ARCHITECTURE.md), `backend/api.py`, `backend/engine.py`, `agent/aegis/runtime.py`, `agent/aegis/store/db.py`, risk policy and `package.json`; local revision `2dfe390` | Default web automation uses virtual funds; signed execution is separate. No return/profitability or signed-mainnet claim. No undocumented live-demo URL. |
| UrbanSaarthi | [README](https://github.com/vishal88736/nagarseva-seva-first/blob/main/README.md), [AWS guide](https://github.com/vishal88736/nagarseva-seva-first/blob/main/deploy/aws/README.md), civic workspace/map, FastAPI app, SQLite operations, frontend package and Dockerfile; local revision `792e73d` | Synthetic civic demonstration without an authorized government connection. [The documented demo](https://d2nrwxy6sjb9o8.cloudfront.net/) responded HTTP 200 during this update. |
| GRACE-RUL | [README](https://github.com/vishal88736/cmapss-predictive-maintenance/blob/main/README.md), [shared pipeline](https://github.com/vishal88736/cmapss-predictive-maintenance/blob/main/docs/POOLED_V9.md), `grace_rul/data.py`, `corruption.py`, `model.py`, `detection.py`, and `calibration.py`; local revision `c85b7c3` | Describes implemented preprocessing, structured fault detection/recovery, predictor branches and engine-disjoint calibration. No new accuracy figures, improvement claim, or experiment-completion claim. |
| Canopy | [README](https://github.com/vishal88736/context-harness/blob/main/README.md) and `package.json` in the separate local Canopy checkout; local revision `61e3f0b` | Active development of a local context-first coding workspace; no completed-project or public-release claim. |
| LedgerPilot | Owner-supplied project brief and the current [finance-controller README](https://github.com/vishal88736/finance-controller/blob/main/README.md), which now identifies the project as LedgerPilot | Updates the existing finance entry in place. Includes deterministic reconciliation, evidence-grounded investigation, tax matching, forecasting, persistence, and the supplied stack. Status is functional demonstration and continued development. No accuracy figures or undocumented demo link. |
| New achievements | Owner-supplied descriptions in this task | AssemblyAI: 4,100+ registered builders; IIT Mandi: 4,300 participants across the event. These counts are not interchangeable with team/track totals. No team member names were added. |

Existing project entries and source links, achievement text, and development entries are retained. The finance project now uses LedgerPilot branding and the owner-supplied updated description, checked against its current repository README. Browser automation exposed no available browser, so responsive geometry and animation appearance still need visual review. No external form or write operation was used to test the project sites.

LedgerPilot's existing finance preview now carries its name and shows reconciliation, tax matching, and history-based forecasting. The card and case study appear in both Explore and Recruiter. The data/preview/case-study checks include this entry and prevent a duplicate source entry.
