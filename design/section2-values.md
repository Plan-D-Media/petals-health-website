# Home section 2 — "How we care for your family" — values table (decisions 1 & 4 applied 2026-09-15; contrast option pending)

Page coordinates in CSS px at 1366 (SVG points × 4/3 applied once here). Sources: **SVG** =
`design/svg/2.svg` geometry · **render** = `design/render/2.png` (1:1 px) · **type-scale** /
**tokens** = the approved documents · **⚠ ESTIMATED** = no direct source, explained.
Render crop for reference: `design/render/section2_crop.png` (page y 880–1560).

## Section band

| Element | Value | Source |
|---|---|---|
| Section top | 880 (hero band ends 879.9) | SVG |
| Section bottom | **1600** ⚠ ESTIMATED — cards end at 1542.7 and the next eyebrow ("SIMPLE PROCESS") starts at 1621; the 78 px gap has no owner in the SVG, split 57 / 21 | render |
| Background | page white; the petal watermark passes behind the top-right (already built, page-level part) | SVG |

## Heading block (all centred on the page; centres measured 680–686 vs page centre 683)

| Element | Value | Source |
|---|---|---|
| Eyebrow line "How we care for your family" | ink 482.1–877.2 × 939.3–967.5; baseline **961**; colour `black` (SVG fill `#000000`) | SVG (union), render |
| Eyebrow line style | **32 px / 400** — size from the first-pass Canva value 24 pt; weight ⚠ ESTIMATED: stem 3 px on the render, Regular predicts 2.9, Medium 3.4, Light 2.4. The first-pass label "Light line above heading" is contradicted by the stem | type-scale §7 / render |
| Section H2 "For her health, her children, her family" | ink 215.5–1156.3 × 980.9–1034.0; baseline **1022.4**; SVG fill `#1c4e8f` → `blue-900` | SVG (union) |
| Section H2 style | 58 px / 700, opsz 96 (`display-lg`) | type-scale |
| Sub-line "Every stage of life, under one roof" | ink 449.7–920.8 × 1053.7–1081.9; baseline **1075.5**; colour `black` | SVG (union) |
| Sub-line style | **32 px / 400** ⚠ ESTIMATED weight (stem 3 px, same reading as the eyebrow line) | type-scale §7 / render |

## Cards

| Element | Value | Source |
|---|---|---|
| Card boxes | 426 × 410 each; y 1132.8; x **32.3 / 470.5 / 911.5** (gaps 12.2 and 15.0 — the mock is uneven; card 3 is also 0.9 px higher) | SVG (clip boxes) |
| Card radius | **12** (rounded clip: first point 9 pt in from the corner) | SVG |
| Card 1 background | `2_6334260c.png` — a plain diagonal gradient; reduced to `linear-gradient(135deg, #ff982e 0%, #ff4b1d 50%)` (PNG corner `#ff982e`, centre `#ff4b1d`, opposite corner `#ff4e20` on the render) | sampled from the PNG |
| Card 2 & 3 background | `2_0e6de14e.png` (same file both cards) — `linear-gradient(135deg, #d4e3ff 0%, #ffffff 100%)` (corner `#d4e3ff`, centre `#eaf1ff`, far corner `#fefeff`) | sampled from the PNG |
| Petal outline decoration | **vector** — one 7,242-point white path, 212 × 220.3, drawn at **opacity 0.19**, positioned at (352.0, 1062.8) on card 1 and (793.0, 1062.0) on card 2, i.e. ~(320, −70) from each card's top-left, clipped by the card. Exported to `app/src/icons/petal-outline.svg`. **Only two exist in the SVG** — card 3 has none (checked every path on the page) | SVG |
| Inner left padding | card 1: title at 35.4, pills at 28.7 · cards 2/3: title at 49.7, pills at 47.5 — **inconsistent** in the mock | SVG |
| Card title | card 1 "For Her Health" white, ink top 1209.2; card 2 "For Her Children" `#00427e`, top 1208.3; card 3 "For Whole Family" top 1207.5. Baselines ≈ **1232 / 1232.4 / 1230.4** — card 3 sits 2 px higher | SVG (union) |
| Card title style | 32 px / 700 (`heading-sm`; Canva "Card title 24 Bold + B" → 700 by the Medium/Bold+B rule) | type-scale |
| Card subtitle | 16 px / 300 (`body-sm`, Canva "Card body 12 Light"); card 1 white, cards 2/3 `black`; ink tops 1241.2 / 1241.1 / 1240.3 → baseline **1253.1**; card 2 wraps to two lines, second baseline 1271.1 → **line-height 18** | SVG (union) |
| Subtitle wrap width | **300** ⚠ ESTIMATED to reproduce card 2's break ("…growing smile / and milestone.") — the card's inner width at 48 px padding is 330 and would not break there | render |
| Pills (card 1) | vector rounded rects, height **27.2**, fully rounded, fill `#ff8e7a` (`salmon-300`), white text. Rows at y 1289.4 / 1326.5 / 1366.6 / 1404.8 (pitch 37.1 / 40.1 / 38.2); x from 61.0; gaps 11.2 and 6.9 | SVG |
| Pills (cards 2 & 3) | **raster** PNGs (same cream: centre `#fffbf4`, edges white), height 27.2, black text. Card 2 rows 1289.4 / 1326.5; card 3 rows 1288.6 / 1325.6 / 1366.4; gaps 10.0, 12.9 | SVG (image boxes) + PNG samples |
| Pill text | ink height 14.5 (asc+desc) → **≈15.5 px** — no scale entry; ⚠ ESTIMATED **16 px / 400** (nearest token size; weight unreadable at this size, render looks regular) | SVG (union) |
| Pill padding | text inset 10.7 left / 11.3 right → **11 px**; text vertically centred | SVG |
| Pill spacing proposal | row pitch **38.5**, gap **10** ⚠ ESTIMATED means of the mock's 37–40 and 7–13 (deviation: the mock is uneven) | derived |
| "Explore Treatment" buttons | raster `2_45756cf1.png` 242.4 × 32.6 (cream `#fffcf5`, white edges), fully rounded; y **1462.7** (card bottom margin 47.4); x 120.7 / 571.0 / 1012.0 → centres 241.9 / 692.2 / 1133.2 vs card centres 245.3 / 683.5 / 1124.5 — **off-centre by −3.4 / +8.7 / +8.7** | SVG (image boxes) |
| Button text | "Explore Treatment", `#17447e` → `blue-900`, ink 124.4 wide × 13.5 (asc+desc) → **≈14.5 px**; ⚠ ESTIMATED **14 px / 400** (no scale entry; between `caption` 13 and `body-sm` 16) | SVG (union) |

## Contrast check (not decided — for your call)

| Text | On | Ratio | Needs |
|---|---|---|---|
| Card 1 title, white 32 px Bold | orange under the title ≈ `#ff7a28` | **2.5:1** | 3:1 (large) — **fails** |
| Card 1 subtitle, white 16 px Light | ≈ `#ff7a28` | **2.5:1** | 4.5:1 — **fails** |
| Card 1 pill text, white 16 px | `#ff8e7a` | **2.2:1** | 4.5:1 — **fails** |
| Card 2/3 titles, `#00427e` | `#dfeaff` | 8.9:1 | passes |
| Button text `#00427e` on `#fffcf5` | | 10.3:1 | passes |

## The orange card: persistent style or selected state? Evidence only

**For "persistent, hand-authored emphasis":**
1. Card 1 uses a **different background asset** (`2_6334260c.png`) from cards 2 and 3, which share one file (`2_0e6de14e.png`). It is not the blue card recoloured.
2. Card 1's **text colours differ** (white title and subtitle) and its **pills are built differently** — vector salmon rectangles with white text, versus raster cream pills with black text on the other two.
3. Card 1's **inner padding differs** (title 35 px in vs 50 px; pills 29 vs 47.5). Someone laid this card out separately.
4. The **buttons are identical** on all three cards (same cream raster, same navy text), so the orange treatment was not applied to the interactive element.
5. There is **no second version** of any card anywhere in the file: no hidden duplicate, no hover/selected layer, no alternative orange variant of cards 2 or 3. Canva SVGs carry no state or layer names, so no naming evidence exists either way.
6. Nowhere else in the 15 pages is a card highlighted orange; the treatment-page grids (Women's Care, Dentistry, etc.) use uniform blue cards.

**For "active/selected state":**
1. The three cards are otherwise the same component (same size, same radius, same button, same slot layout), and card 1 is the first item — the classic "first tab active" pattern.
2. The orange gradient is the same family as the Call-to-action raster (`#ff8229 → #ff4b1d`), i.e. the design's "active/action" colour, not a section colour.
3. Card 1 is Women's Care, the brand's lead service (first item in the Treatments dropdown, largest specialty count on Find a Doctor). Highlighting it could equally be brand emphasis or a default selection — this cut both ways.

**What the SVG cannot tell us:** whether hovering or selecting another card would turn it orange. Nothing in the export encodes interaction.

## Proposed tokens if approved (all ⚠ ESTIMATED)

| Token | Value |
|---|---|
| `heading-line` (eyebrow line & sub-line above/below section H2) | 32 px / 400 |
| `chip` | 16 px / 400, height 27.2, padding-x 11, radius-pill, gap 10, row pitch 38.5 |
| `button-sm` | 14 px / 400 on 242.4 × 32.6 pill |
| `radius-card` | 12 px |
| `card-orange` gradient | `#ff982e → #ff4b1d` (135deg, end at 50%) |
| `card-blue` gradient | `#d4e3ff → #ffffff` (135deg) |
| `chip-cream` | `#fffbf4` |

## Decisions (2026-09-15)

1. **Orange card = persistent style**, not a selected state (different background file, differently
   built pills, different padding: hand-authored). Client asked to confirm in the client note.

## Deliberate deviations from the mock (Canva drift, regularised rather than reproduced)

| Mock | Built as | Why |
|---|---|---|
| Card x 32.3 / 470.5 / 911.5 (gaps 12.2 and 15.0) | x **32.3 / 471.9 / 911.5**, equal gaps of **13.6** (outer edges kept at 32.3 and 1337.5) | uneven gaps are drift |
| Card 3 top at 1131.9, cards 1–2 at 1132.8 | all three at **1132.8** | 0.9 px drift |
| Card titles at baselines 1232 / 1232.4 / 1230.4 | all at **1232** | 2 px drift on card 3 |
| Card subtitles at ink tops 1241.2 / 1241.1 / 1240.3 | one baseline, **1253.1** | drift |
| Pill rows at 1289.4 / 1326.5 / 1366.6 / 1404.8 (pitch 37–40) | pitch **38.5** from 1289.4 | uneven pitch is drift |
| Pill gaps 6.9–12.9 | **10** | uneven |
| Card 1 inner padding 29–35 vs cards 2/3 at 47.5–50 | **48** on all three (pills and titles share one left edge) | the orange card was laid out by hand; one padding for one component |
| Buttons off-centre by −3.4 / +8.7 / +8.7 | **centred** in each card at y 1462.7 | drift |

## Estimates added during the build (beyond the table)

| Item | Value | Why |
|---|---|---|
| Subtitle wrap widths | 360 / 320 / 340 | the build's 16 px text is ~3 % wider than the mock (auto opsz vs Canva's 96); 300 broke card 1 into two lines and card 2 in the wrong place |
| Chip text weight | **300**, revised from 400 | in the render the chip text is visibly the same weight as the Light subtitle; 400 looked heavier than the mock |
| Petal outlines | **not clipped** by the cards | in the design each outline continues across the gap into the next card (card 1 → 2, card 2 → 3); they are drawn at section level at their page positions |
