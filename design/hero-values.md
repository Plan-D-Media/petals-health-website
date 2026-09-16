# Home hero — every value used in the build and where it came from

Page coordinates are CSS px at the 1366 canvas (SVG points × 4/3, done once here; the code
never re-applies the factor). "SVG" = read from `design/svg/2.svg` geometry. "render" = measured
on `design/render/2.png`, which is 1:1 with CSS px, used where the SVG gives no direct value.
**Estimated rows are marked ⚠ ESTIMATED** and explained.

## Bars

| Element | Value | Source |
|---|---|---|
| Utility bar | white, y 0–108 | SVG (nav starts at 81 pt = 108 px) |
| Logo image | `2_09c94b70.png` at x 201.6, y 24.0, 54.4 × 69.3, luminance mask `2_bfab15d2.png` | SVG (image + mask, same matrix) |
| Phone icon | x 541.1, y 47.7, 15.4 × 20.8, path lifted from SVG | SVG |
| Phone number text | left **563** ⚠ ESTIMATED (icon+digits merge into one ink run 542–635 on the render; text start inferred as icon right edge + ~7 px), baseline 63.8 | render |
| Calendar icon | x 665.1, y 48.8, 18.4 × 18.5 | SVG |
| "Book an Appt" | ink left 697, baseline 63.8 | render (ink 697–781, y 55–64) |
| Find-a-Doctor icon | x 813.5, y 47.2, 19.6 × 21.8 | SVG |
| "Find a Doctor" | ink left 843, baseline 63.8 | render |
| Ask-a-Doctor icon | x 952.6, y 47.2, 25.5 × 20.8 | SVG |
| "Ask a Doctor" | ink left 985, baseline 63.8 | render |
| Utility separators | 1 px lines at x 649.5 (y 39.1–77.0), 801.4 and 937.1 (y 40.7–78.6) | SVG (stroked paths) |
| Utility text style | 13 px / 400 (caption; design 13.33 → 13) | type-scale |
| Utility text colour | `blue-900` (design fill `#17447e`, consolidated) | tokens |
| Nav bar | y 108.2–141.8 (33.5 px) → built as top 108, height 34 | SVG (rounded to whole px) |
| Nav bar colour | `blue-900` (design `#17447e`) | tokens |
| Active tab "Home" | x 261.3–324.0 (62.7 wide), full bar height, `orange-500`; text `blue-900` | SVG |
| "Home" text position | centred in tab ⚠ ESTIMATED (design ink 285–307 sits 3 px right of tab centre) | render |
| Nav items (ink left) | About us 337 · Clinics 420 · Treatments 511 · Diagnostic Services 633 · For Patients 775 · Petals Clinic in Bangladesh 892 | render |
| Nav chevrons | 17.9 × 11 at x 466.8, 586.5, 849.7; y 119.3 | SVG |
| Nav separators | 1 px white at x 405.9, 496.3, 618.7, 761.2, 878.8; y 115.8–134.2 | SVG |
| Nav text baseline | 128 (design cap 8 px = 12 px font) | render |
| Nav text style | 13 px / 500, raised from 12 | type-scale |

## Hero band (top 142, height 738; inner y = page y − 142)

| Element | Value | Source |
|---|---|---|
| Band extent | y 140.6–879.9 in SVG; built 142–880 so it starts under the nav | SVG (1.4 px trimmed at top) |
| Background | radial gradient, centre (682.2, 510.2 page → 368.2 inner), radius 786.5 px, `#ffffff` → `#e3f2ff` | SVG (`aed0135220`: cx, cy, r, first/last stop; 41-stop ramp verified linear, reduced to 2 stops) |
| Watermark petal `2_a79aaebf.png` | **built** (2026-09-15): raster petal + luminance mask `2_3bcc21fb.png`, rotated −90°, placed 659.5/446.0 at 1079.4 × 1619.2, clipped x 660–1365.3, y 608.4–1982.7, opacity 0.07 (mask rect fill-opacity). Rendered in two clipped parts, hero and page | SVG (image matrix, masks, clip) |
| Photo clip box | x 120.5, y 201.6 (inner 59.6), 497.7 × 678.7 | SVG (clipPath) |
| Photo image | `2_04c0f486.png` at x 64.3, y 165.5 (offset −56.2, −36.1 inside the clip), 614.7 × 749.6 | SVG (image matrix) |
| Photo cut-out | luminance mask `2_6a954d96.png`, same matrix as the image | SVG (mask) |
| Headline line 1 | "Caring for All," `blue-900` (design fill `#00427e`), ink left 681, baseline 384 | SVG fill; render baseline |
| Headline line 2 | "You Care About" `accent`, baseline 434 | SVG fill; render |
| Headline box left | **679** ⚠ ESTIMATED = ink 681 − ~2 px left side bearing of "C" at 53 px | derived |
| Headline style | 53 px / 700, opsz 96 pinned | type-scale |
| Headline line-height | **50 px** (baseline pitch 434 − 384) | render |
| Paragraph | ink box 682.9–1298.8 × 463.3–530.3; 3 lines; baseline 1 at 478.5; line pitch 26 | SVG (union) + render |
| Paragraph box | left 681.5, width **620** ⚠ ESTIMATED (ink 616 + bearings; must reproduce the 3-line wrap "…diagnostics and / …you need is / …trusted roof.") | derived |
| Paragraph style | 21 px / 400, line-height 26 px, `black`, **justified** (the mock's word spaces are stretched on lines 1–2) | type-scale; render |
| Button label weight | built at 500 first (Canva: Medium + B); label measured 14 px narrower than the mock → stepped to **600**. Bold 700 would match the mock width exactly | type-scale rule; render |
| Button | x 687.5, y 609.4 (inner 467.4), 304.3 × 64.8, `blue-900` (design `#00427e`) | SVG |
| Button radius | **pill (32.4)** — the SVG clip is a plain rectangle; the render's corner profile (edge inset 27 px on the first row, reaching the box edge after 23 rows) fits r ≈ 32 | render |
| Button label | "Book your appoinment" (sic, as designed), white, ink 712.7–961.5, centred; baseline 648.2 | SVG (union) |
| Button label style | 22 px / 500 (B-toggle; step to 600 if lighter) | type-scale |
| Pill | `2_7fe42449.png` box x 66.5, y 828.2 (inner 686.2), 220.4 × 32.8 | SVG |
| Pill fill | radial, circle farthest-side, `#ffffff` → `#e3f2ff`, no border | sampled from the PNG (centre, edge, top-mid); render confirms no border |
| Pill radius | **16.4 (half height)** ⚠ ESTIMATED — fully rounded ends read from the render | render |
| Pin icon | x 87.3, y 835.1, 13.4 × 19.0, `blue-900` (design `#17447e`) | SVG |
| Pill text | "3 Clinics in Kolkata", ink left 109.6, baseline 849.3, `blue-900` | SVG (union) |
| Pill text style | 18 px (label-lg); weight **500** ⚠ ESTIMATED (scale has no weight; render reads medium) | type-scale / estimate |
| Stat blocks | 92 × 92 at x 1107.5 and 1207.2, y 769 (inner 627) | SVG (image boxes) |
| Stat block fill | radial, circle farthest-corner, `#ffffff` → `#7aadd9` | sampled from `2_2cc82350.png` (centre, quarter, mid-edge, corner: linear ramp) |
| Stat block radius | **10 px** ⚠ ESTIMATED — the corner-profile scan suggested 5, but the zoomed visual comparison against the render reads closer to 10 | render |
| "100+" / "4.8" | ink 1127.3–1185.4 and 1220.2–1256.3, cap top 787.6, baseline 808.2, `blue-900` (design `#1c4e8f`) | SVG (union) |
| Stat number style | **Lora 400 / 28 px** — face identified by outline comparison (2026-09-15); size ⚠ ESTIMATED from "100+" width (58 vs 57) | render / derived |
| Star | path lifted from SVG, 25.4 × 24.2 at x 1261.3, y 786.3, `blue-900` (design `#17447e`) | SVG |
| Stat labels | "Specialist Doctor", "Google Rating"; two lines, ink top 824, 2 lines ending 846; design 11.2 px | SVG (union) |
| Stat label style | 13 px / 400 (caption, raised from 11.2), line-height **14 px** ⚠ ESTIMATED to keep two lines inside the block | type-scale / estimate |

## Vertical placement method

Chrome uses Bricolage's typo metrics (ascender 0.93 em, descender 0.27 em; USE_TYPO_METRICS set).
For a line-height L and font size S, baseline = top + (L − 1.2 S) / 2 + 0.93 S. Every text `top`
in the CSS is derived from the design baseline with this formula; the baselines are the
measured values above.
