# Home section 3 — "SIMPLE PROCESS / From search to care in minutes" — values table (built 2026-09-15)

Page px at 1366 (SVG points × 4/3 applied once here). Sources: **SVG** · **render** (`design/render/2.png`,
1:1) · **type-scale** / **tokens** · **⚠ ESTIMATED**. Reference crop: `design/render/section34_crop.png`
(page y 1560–2560). Baseline → top uses top = baseline − ((L − 1.2S)/2 + 0.93S) for Bricolage.

## Section band

| Element | Value | Source |
|---|---|---|
| Section top | **1600** (end of section 2; ⚠ ESTIMATED boundary) | — |
| Section bottom | **2040** ⚠ ESTIMATED — step descriptions end at 1999, the next eyebrow's cap top is 2086; split 41 / 46 | render |
| Background | page white; the petal watermark (page-level part) passes behind the top-right down to y 1982.7 | SVG |

## Heading block (centred on the page)

| Element | Value | Source |
|---|---|---|
| Eyebrow "SIMPLE PROCESS" | ink 605.8–790.5 × 1615.8–1627.6 (184.7 wide, cap 11.8); baseline **1627.6** | SVG (union) |
| Eyebrow style | `eyebrow` 19 px / 300, uppercase, letter-spacing 0.12em, `grey-600` | type-scale (decided) |
| H2 line 1 "From search to care in" | ink 387.9–1018.1 × 1641.6–1688.2; baseline **1688.2** (no descenders); `#17447e` → `blue-900` | SVG (union) |
| H2 line 2 "minutes" | ink 587.7–819.5 × 1691.5–1738.2; baseline **1738.2**; **line pitch 50** | SVG (union) |
| H2 style | `display-lg` 58 / 700, opsz 96; **line-height 50** (same pitch as the hero H1) | type-scale; render |
| Line break | explicit after "in" (the mock breaks a 630 px line; a 1366 container would not) | render |

## Steps (four columns)

| Element | Value | Source |
|---|---|---|
| Circles | diameter **108**, y **1789.3**; x **190.9 / 481.5 / 778.5 / 1079.4** (spacings 290.6 / 297.0 / 300.9 — uneven) | SVG (clip boxes) |
| Circle x, regularised | **190.9 / 487.1 / 783.2 / 1079.4** (equal 296.17 pitch, outer circles kept) ⚠ deviation | derived |
| Circle stroke | `#6e5fa1` (`purple-500`), SVG stroke-width 8 pt centred on a clipped edge; **visible ring 3 px** on the render | SVG + render |
| Circle fill | steps 1, 3, 4 white; **step 2 filled `purple-500`, no ring** (the mock's "current step" emphasis; persistent, same as the orange card) | SVG |
| Connectors | dashed line between circles: **dash 5, gap 3, 2 px thick**, `purple-500`, at the circle centre line y ≈ 1843; starts ~7 px after a circle's edge and ends ~7 px before the next | render (no vector dash path in the SVG — the dashes are separate small paths) |
| Step numbers "1"–"4" | cap height 38–39.5 → **60 px** ⚠ ESTIMATED (39.5 ÷ 0.66); weight **400** — the "1" stem is 5 px, Regular predicts 5.5, Light 4.4; `blue-900` on white circles, **white on the purple circle**; centred in the circle (digit centre 1843.35 = circle centre 1843.3) | SVG (union) + render |
| Step titles | "Search & choose" 172.3–319.8 × 1918.7–1932.0; "Book a slot" 494.0–589.1; "Visit or consult" 762.7–892.7; "Get your reports" 1057.5–1200.9; baseline **1932.1**; centred under each circle (centre 246 vs circle 244.9) | SVG (union) |
| Step title style | ascender 13.1 → **18 px** ⚠ ESTIMATED; weight **400** (stem 2 px; Regular 1.6, Medium 1.9) ⚠ ESTIMATED; `black` | render |
| Step descriptions | 3 lines each, centred; line 1 ink 159.5–329.4 × 1947.3–1961.3 etc.; baselines **1958.8 / 1977.8 / 1996.8** → **line pitch 19**; widest line 190 px | SVG (union) |
| Description style | x-height 8.7 → **16 px**; weight ⚠ ESTIMATED **400** (stem 1 px: Light 1.2 / Regular 1.5, render reads regular — note `body-sm` is 300; this is a different style); `black`; **line-height 19**; column width **200** ⚠ ESTIMATED to reproduce the three-line breaks | render |
| Description copy | "Find the right doctor or / test by specialty, location, / or concern." · "Pick a time that works / for you — online, by / phone, or via our app." · "In-clinic or video / consultation with your / chosen specialist." · "Digital prescriptions / and lab reports / delivered instantly." | render |

## Proposed tokens (⚠ ESTIMATED unless noted)

| Token | Value |
|---|---|
| `step-number` | 60 px / 400, `blue-900` (white on the filled step) |
| `step-title` | 18 px / 400 |
| `body-sm-regular` | 16 px / 400, line-height 19 (a Regular sibling of `body-sm` 16/300) |
| `ring-step` | 3 px `purple-500` (render-measured) |
| `dash-step` | 5 on 3, 2 px, `purple-500` (render-measured) |

## Deliberate deviations proposed

| Mock | Build | Why |
|---|---|---|
| Circle spacing 290.6 / 297.0 / 300.9 | 296.17 × 3 | drift |
| Circle 2 "current" fill | kept as a persistent style, not a state | no interaction encoded; same reasoning as the orange card |

## Build notes and deviations logged (2026-09-15)

| Item | Mock | Built | Kind |
|---|---|---|---|
| Eyebrow position | centre 698 (15 px right of the page centre) | centred at 683 | deviation (drift) |
| H2 optical size | width 630 = Bricolage at **opsz 12** (the hero and section-2 headings match opsz 96) | pinned `opsz 12` to match; **mock inconsistency flagged**, not unified | matched |
| Step 2 filled | filled on the Home stepper and on the Petals IVF stepper (navy there) — every instance | permanent | intent |
| Circle spacing | 290.6 / 297.0 / 300.9 | 296.17 × 3 | deviation |
| Connectors | small separate dash paths | CSS repeating gradient, 5 on 3, 2 px | construction |
