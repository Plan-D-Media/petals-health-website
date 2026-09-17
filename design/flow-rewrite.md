# Home page reflow — what was built (2026-09-17)

Flow layout replaces absolute positioning in every Home section. Mobile-first CSS with four bands:
`<768` mobile (designed at 390) · `768–1023` tablet · `1024–1365` laptop · `≥1366` desktop (the mock's canvas). The content
box is 1176 px at ≥1366 (the mock's own 95 px margins) and fluid below; gutters 16 / 32 / 40 / 95.
Type: the approved mobile/tablet scale in `tokens.css` (same fonts and weights; sizes only; 13 px floor kept).

## The seven items that needed a different idea (design/mobile-approach.md)
| Desktop | Small screens |
|---|---|
| Hero film bleeding to the viewport edge, proof strip on its corner | contained 16:9 card under the copy; proof strip as a row (pill + two 72 px tiles); play control bottom-left |
| Dropdown panels | drawer from the right (utility links, then nav; Treatments as an accordion with its nine links); focus trapped, Escape closes |
| Health-card cut-out breaking the panel | rectangular 4:3 area on the pale ground with the same luminance mask (mask and image both cover the box, so they stay aligned); copy below; tablet: photo | copy |
| Sticky nav CTA | bottom action bar (Call now / Book Appointment) after the hero; hidden while a dialog or the drawer is open; the footer clears it |
| Carousel autoplay | off below 768 (manual: drag, arrows, dots); controls sit below the track at every width now — side arrows overlapped the first card |
| Six footer columns | accordions (Information open); three columns on tablet; six fixed-width columns on desktop |
| Watermark petal | hidden below 1024 |

Also: process as a list → 2 × 2 → one row; family cards 1 → orange + 2 → 3; articles 1 → 3; the doctor card fills its slide
(358 wide at 390, 300 at ≥1024) with the rating row and button anchored; a visually hidden h1 restores the document outline.

## layout-check.mjs (replaces compare.py)
`node tools/layout-check.mjs` — at 390, 768, 1024, 1280, 1366, 1920 under reduced motion (deterministic): no horizontal
overflow (clipping-aware), no overlapping leaf elements, no clipped text, type ≥ 13 px, touch targets ≥ 44 px below
1024, exactly one h1, both carousels' last slide reachable by the next control, the form opens/fits/inputs ≥ 44 with
labels/validation marks fields, every img has alt, no console errors. **Green at all six widths.** Full-page captures →
`design/render/check/`. `tools/mobile-demo.mjs` captures the drawer (accordion open, 9 links, Escape closes), the
action bar after the hero, the form as a bottom sheet with the bar hidden, and the footer accordions.

What the checker found on the first run and what changed: touch targets (logo, video control, footer links), the
placeholder tag at 11 px, health-card blobs overflowing at laptop widths, closed footer accordions on tablet, reveal
fragility (content stayed hidden after a fast scroll — the observer threshold is now 5 % with a 2.5 s safety net that
reveals anything still pending), the family-card button not anchored (a later margin rule overrode `margin-top: auto`),
desktop carousel arrows over the first card, the proof pill clipping and colliding with the play control, a cramped
laptop hero crop, squeezed desktop footer columns, and the sticky CTA overlapping the last nav item at 1024–1279.

## Mobile-class performance (390 wide, 4× CPU throttle, slow 4G; medians of 3)
| | design pass + motion (desktop layout scaled) | flow rewrite (real mobile layout) |
|---|---|---|
| LCP | 1452 ms | 1872 ms (runs 1788 / 1872 / 3388 — the machine is under memory pressure; treat as indicative) |
| CLS | 0 | 0 in two runs, 0.17 in one — to be attributed (suspects: font swap, carousel measure) |
| long tasks (load) | 97 ms | 182 ms |
| long tasks (scroll) | 0 | 9 ms |
| transfer | 665 KB | 634 KB |

The rewrite renders a real 390 px layout for the first time, so the numbers are not like-for-like with the scaled
desktop; the hero poster now carries `fetchpriority="high"`. A lazy-loaded health-card photo was tried and reverted (it
moved decode work into the scroll and produced a shift). Next perf step: attribute the one-run CLS and preload the two
fonts.

## Retired
compare.py and its mock-drift checks (kept in the repo for history; no longer run).
