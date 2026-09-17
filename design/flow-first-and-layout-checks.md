# Flow-first for the remaining pages, and what replaces compare.py (2026-09-17)

## 4 · Should the other 14 pages be built flow-first?

Yes — and not only because converting later costs twice. The absolute-positioning phase did a specific job: it
turned a Canva artboard into measured facts (a type scale, a spacing scale, colour and radius tokens, the geometry of
every atom, the two page templates and the block library). That job is finished. Building fourteen more pages the same
way would keep producing artboard replicas that then need the rewrite Home is about to get, and every one of them
would carry the same laptop gap (sideways scroll at 1280) and the same mobile dead end. The mock is now a content and
intent source, not a coordinate source.

What changes in how we work from the mock:

| Before (reproduction) | Now (flow-first) |
|---|---|
| svgdump every element, values table per section, baseline→top maths | measure only what is not yet a token or component (a new block's size or a new atom); everything else is composed from the library |
| Values tables with sources and estimates | a **page plan**: section order from the mock, which block from the library each section uses, the content pulled into a data file, and the one or two new blocks the page needs |
| Absolute px inside a 1366 box | flow layout (grid/flex on the spacing scale), mobile-first, five breakpoints, the 1366 view reproducing the mock's composition, not its pixels |
| compare.py drift ≤ 12 px against 2.png | a side-by-side review sheet at 1366 (mock | build) for judgement, plus the automated layout checks below for correctness |
| Deviations logged per element | deviations logged per section, in words: what the mock did, what we did, why |
| Nine treatment pages = Template A / Template B / IVF variant | build the two templates once as page components fed by content files; the nine pages become nine content files plus any page-specific block |

The one thing to keep from the old discipline: the values that were measured stay canonical (type scale, spacing scale,
card sizes, header sizes). New pages do not re-measure them and do not invent new ones without a note.

Two consequences to accept: desktop pixel fidelity to the mock is no longer a target (it stopped being one when the
hero, process, specialists and insights were rebuilt), and the treatment pages will look more consistent with each
other than the mock's nine hand-made artboards do — that is the point.

## 3 · compare.py replacement — `tools/layout-check.mjs`

Runs the built site in Chrome at 390, 768, 1024, 1366 and 1920 (plus 1280 as the most common laptop), per page.
Every check names the offending element (selector + text) and the breakpoint; the run fails on any failure; a
captures folder gets the full page at each width for the review sheet. Proposed assertions:

**Structure**
1. No horizontal overflow: `scrollWidth ≤ innerWidth`, and no visible element's box extends past the viewport (a
   `data-bleed` attribute marks the deliberate exceptions: the hero film card at desktop).
2. No overlapping elements: pairwise boxes of leaf elements (text, buttons, inputs, images, cards) must not intersect
   unless one is inside the other or the pair is marked `data-overlap-ok` (proof strip on the film card, pill on a card
   corner, avatar over the card's top band, sticky bars over content).
3. No clipped text: any element with text where `scrollWidth > clientWidth` or `scrollHeight > clientHeight` (with
   overflow hidden or nowrap) fails; line-clamped elements must declare `data-clamp`.
4. Sticky elements do not cover controls: the sticky nav CTA does not intersect nav items; the mobile bottom bar does
   not intersect any focusable element at the bottom of the page (footer padding must clear it).
5. Sections keep their order and none collapses to zero height; the page has exactly one `h1` (**it has none today —
   the hero's headline was the h1 and went with it; the reflow adds a visually hidden h1 "Petals Health — your family
   clinic in Kolkata" unless you prefer visible copy**).

**Interaction**
6. Carousels reachable: for each carousel, the next button reaches the last slide; ArrowRight does the same from the
   region; every focusable control inside every slide is reached by Tab; under reduced motion the track does not move
   without input.
7. Touch targets at 390 and 768: every `a`, `button`, `input`, `select`, `summary` is at least 44 × 44 CSS px, or has
   at least 44 px of clear space around a smaller hit area; adjacent targets are ≥ 8 px apart. Inline links inside
   running text are exempt only if marked `data-inline-link`.
8. Forms usable at every width: each `data-form` trigger opens the dialog; the dialog fits the viewport; every input
   is ≥ 44 px tall and has an associated label; the submit button is reachable by Tab without leaving the dialog;
   submitting empty produces errors with `aria-invalid` and `aria-describedby`; Escape closes and focus returns.
9. Menus: the desktop dropdown opens on hover, click and keyboard; the mobile drawer opens, traps focus, Escape
   closes; the Treatments accordion lists nine links.

**Type and colour**
10. No visible text below 13 px computed size at any width (the floor holds on mobile).
11. Contrast: for text on solid backgrounds, computed text/background pairs meet 4.5:1 (3:1 for ≥ 24 px); text on
    gradients and photos is listed for manual review rather than asserted.

**Hygiene**
12. No console errors or failed requests; every `img` has `alt`; the video has a poster; `prefers-reduced-motion`
    disables autoplay and reveals.

Not asserted, but produced: full-page captures at each width, and a 1366 mock-vs-build sheet for pages that have a
mock. Performance stays in `perf.mjs`.

What I would check by hand before writing it, on the current build: whether any desktop element legitimately touches
the viewport edge (film card, watermark), which pairs legitimately overlap (proof strip, pills, avatars, sticky bars),
and which text is meant to clamp (doctor names) — those become the allow-list attributes so the checker starts green
on a correct page and every later failure means something.
