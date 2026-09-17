# Round 3 — before build (2026-09-17)

## 1 · CLS 0.17 — found and fixed
`tools/cls-attrib.mjs` records every layout-shift entry with its shifted nodes and, every 100 ms, the height of each
section. Six throttled runs at 390: every shift (0.026, 0.036, 0.28) happened at the moment four sections changed
height together — hero +27, family care +116, closing +27, footer +67 — between 1.8 and 5.8 s after navigation. That
is the Bricolage web font arriving over slow 4G and re-wrapping every text block set in the fallback face. The value
depends only on which section was in the viewport when it landed: 0.03 with the hero on screen, 0.28 with the footer
(a large area). Not memory noise.

Fix: preload the variable font from the HTML (it starts downloading with the page, not after the stylesheet parses);
`font-display: swap` was already set; and a metric-matched fallback — `'Bricolage Fallback'` is Arial with
`size-adjust: 101.5%` (measured 100.7–103.6 % across 14–21 px against Bricolage's advance widths), ascent 93 %,
descent 27 %, line gap 0 (the font's own metrics) — placed second in the font stack, so text renders at once and the
swap moves nothing. Result: six further runs, CLS 0.0000 in every one. layout-check stays green. Committed.

## 2 · The hidden h1
What I would make visible: **"Petals Health — Your Family Clinic in Kolkata"**, as the first line of the hero's shelf
card (direction H2 below) above the paragraph, at display-md. It is assembled from copy that already exists on the
page — the logo's tagline "Your Family Clinic" and the pill's "Kolkata" — and it is the query a worried parent types.
It needs the client's yes because the assembled line is not verbatim in the mock. If they decline, the fallback that
needs no sign-off is promoting the first visible heading, "For her health, her children, her family", to the h1; it
names the offer but carries no place, so it ranks less well. Either way the hidden h1 is removed.

## 3 · Gutter audit (tools/gutter-audit.mjs: used width per section, as % of the viewport)

| section | 390 | 768 | 1024 | 1280 | 1366 | 1920 |
|---|---|---|---|---|---|---|
| hero | 92 | 92 | 96 | 96 | 93 | 81 |
| family care | 92 | 92 | 92 | 92 | 96 | **68** |
| process | 92 | 92 | 92 | 92 | 86 | **61** |
| stories | 96 | 96 | 96 | 96 | 93 | 81 |
| specialists | 96 | 96 | 96 | 96 | 97 | 83 |
| health card | 92 | 88 | 100 | 92 | 92 | **65** |
| insights | 92 | 92 | 92 | 92 | 86 | **61** |
| closing | 92 | 92 | 92 | 92 | 86 | **61** |
| footer | 92 | 92 | 96 | 94 | 88 | **63** |

Finding: below 1366 every section uses 86–100 % of the width; the squeeze the client sees is at 1920, where the
content box is capped at 1176 px (the mock's canvas minus its 95 px margins) and 372 px of dead space sits either side.
Affected: family care, process, health card, insights, closing band, footer (61–68 %); hero, stories and specialists
are at 81–83 % only because they bleed.

Fix (part of the build): the content box grows to 1440 px from 1440 up (gutters 64 → at 1920, 75 % used instead of
61 %), 1176 stays at 1366 so the design composition is untouched; the hero becomes full-width video (item 1) and the
two marquees run edge to edge (items 4–5), so those three are at 100 %; the family cards, articles and closing band
fill 1440 with proportionally larger cards. At 1366 the process/insights/closing 86 % is the mock's own margins and
is not a defect.

## 4 · Hero — full-width video, buttons centred beneath (mocks: `design/mocks/round3/hero_sheet.png`)

| | H1 · Stack | H2 · Shelf (**recommended, desktop**) | H3 · Band |
|---|---|---|---|
| Video | full width, 16:9 capped at 560 tall | same | full width, 21:9 capped at 520 |
| Paragraph | centred under the video, 760 max | on a white card overlapping the video's bottom edge, with the proof beside it | on a navy band under the video |
| Buttons | centred under the paragraph | centred under the shelf | centred on the band, orange primary |
| Pill + tiles | a centred row under the buttons | on the shelf, right of the paragraph | on the band, right of the paragraph |
| Height at 1366 | ~830 (video 560 + 270) — the family cards drop well below the fold | ~740 | ~760 |
| Reads as | clean, tallest | one object with the video; the shelf gives the h1 and paragraph a home without a dark wash | heaviest; closest to Apollo's weight, coldest |

Recommendation: **H2 on desktop and tablet, H1's stack on mobile** (the shelf overlap does not survive 390 — the mock's
390 H2 frame shows it). One thing the client must know: a full-width 16:9 video at 1366 is 768 px tall, so the video
is cropped to 560 (about 2.4:1) under cover-fit; footage must keep faces in the vertical middle. The shooting spec
stays landscape 16:9.

## 5 · Family cards — three directions (mocks: `design/mocks/round3/cards_sheet.png`)

| | C1 · Editorial | C2 · Ribbons (**recommended**) | C3 · Tiles |
|---|---|---|---|
| Container | tall card, tonal top band, generous body | three full-width rows: title block · chips · CTA | equal tiles, big numeral, generous padding |
| Treatments | a linked list with arrows and hairlines | pills, wrapping in the middle column | pills as a compact cluster |
| CTA | text link at the foot | pill at the row's right | full-width pill at the foot |
| Strength | most "designed"; the list reads as navigation | uses the whole width (the 1920 squeeze disappears); scans like a directory; stacks cleanly on mobile | closest to today; the numeral gives hierarchy |
| Risk | tallest; three tall columns at 1366 | the orange row dominates less | least change |

Recommendation: **C2**. It answers the gutter complaint in the same move, the hierarchy inside each row is clear at a
glance (what · which · act), and on mobile each row folds into the card we have now.

## 6 · The rest, as I will build them once approved
- **Marquees (items 4–5)**: a CSS-driven track duplicated once and translated with a keyframe (no per-frame script);
  stories right-to-left, doctors left-to-right; `animation-play-state: paused` on hover and on focus-within; under
  `prefers-reduced-motion` the track does not animate and the arrows/drag from the current carousel remain, so every
  card is reachable; Tab moves through the cards in order and pauses the motion while focus is inside. Speed on the
  spacing scale: ~40 px/s.
- **Item 6**: the navy panel goes; a photo-and-text block with the original mother-and-baby cut-out, "Caring for All,
  You Care About" and the original paragraph, flagged **copy pending ("Complete IWC integrated concept" — meaning
  unknown)**.
- **Item 7**: article cards gain a stronger top band and a bolder title; the closing band becomes a two-tone panel
  (navy card on the pale ground) so it reads as the page's close rather than a repeat of the hero.
- **Item 2**: the 1440 container described above.

Commits before and after each item; layout-check must be green at all six widths after each.
