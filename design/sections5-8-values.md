# Home sections 5–8 — values used (built 2026-09-15 under the standing regularisation rule)

Page px at 1366. Sources: SVG / render / type-scale / tokens; ⚠ ESTIMATED where no direct source.
Regularisations are logged in each section's "Deviations" list. Crops: `design/render/s5_*` … `s8_*`.

## 5. OUR SPECIALISTS — "Meet your care team" (band 2499.9–3120.9, SVG gradient box)

| Element | Value | Source |
|---|---|---|
| Band background | radial gradient `8a68c77a6d` white → `#e3f2ff` drawn at **opacity 0.64** (mask) → effective edge `#edf7ff`; centre x 682.7, y 310.5 in band, r 750 | SVG |
| Eyebrow "OUR SPECIALISTS" | ink 598.1–774.1 × 2535.8–2547.6; centre 686 → centred; baseline 2547.6 | SVG |
| H2 "Meet your care team" | ink 432.2–938.5 × 2567.6–2621.2; centre 685.4 → centred; ascender top 2567.6 → baseline **2610.7**; `display-lg` 58/700 | SVG |
| Sub-line | ink 364.3–1006.0 × 2628.6–2644.1; x-height 9.6 → 18 px?? asc 12.6 → 17 px → **`label-lg` size 18 / 400** ⚠ ESTIMATED; baseline 2641.5; black | SVG |
| Doctor cards | 258.2 × 281.3 at y 2692.3; x 135.2 / 420.9 / 706.6 / 994.2 (gaps 27.5 / 27.5 / 29.4) → **regularised 28.1** (x 135.2 / 421.5 / 707.8 / 994.2); radius **20** (clip) | SVG |
| Card background | PNG `2_359898de.png`: blue gradient corners `#7badd9`, mid `#9ec3e3`, with a **white body 2764.0–2918.8** (card-relative 71.7–226.5) and blue bands above/below → built as the `card-blue` radial (white → `#7aadd9`, ΔE < 1) with a white body rect | PNG sampled |
| Avatar | white disc 61.9 at (150.5, 2730.5) → inset (15.3, 38.2); navy `#17447e` → `blue-900` disc 51.8 inside (5 px ring); monogram **Playfair 400 / 28 px** white (approved doctor-card size) | SVG |
| Specialty badge | white pill (PNG) 81.9–120 × 16.9 at y 2742.6 (inset 50.3), right edge = card right − 24.2; text black `#1b1c1d` → `black`, glyphs 8.2 → ~11 px → **13 px caption (floor)**, pill grows to ~22 px tall ⚠ deviation | SVG + floor |
| Name | `#17447e` → `blue-900`, asc 17.4 → **`title` 24 / 600**; left inset 20; baseline **2819.4** | SVG |
| Role | black, asc 8.7 → 11.7 px → **13 px caption**, line pitch 10.8 → **14** (floor); baseline 2836.7; 1–2 lines | SVG + floor |
| Stars | 5 × 14.4, pitch 17.4, at y 2897.1 (inset 204.8), left inset 18.6; vector `orange-500` | SVG |
| Location | black right-aligned lines at 2876–2910 (right inset 16.4), ~10 px → **13 px caption**, pitch 12.5 → 14 | SVG + floor |
| "Book Consultation →" | PNG button 206.6 × 34 at (161, 2929.7) → inset (25.8, 237.4), radius 11, white → `#e3f2ff` radial; text black asc 11.9 → **16 px / 500** ⚠ ESTIMATED; arrow: 15 px black 2 pt line + head | SVG |
| "View all 50+ Doctor →" | PNG button 235.1 × 45.8 at (567, 3020.3), centre 684.5 → centred; radius 11; same fill; text 16 px black | SVG |

Deviations: card gaps 27.5/27.5/29.4 → 28.1; badge/role/location raised to 13 px; card gradient reused from `card-bg` tokens; buttons vector instead of raster.

## 6. FAMILY HEALTH CARD (band 3120.9–3880 ⚠ ESTIMATED bottom; card 3150.9–3848.7)

| Element | Value | Source |
|---|---|---|
| Card | navy `#17447e` → `blue-900` rect 1164 × 697.8 at (94.1, 3150.9), radius **21**; 2 pt stroke same colour (invisible) | SVG |
| Decorative shapes | two `#366db3` (`blue-500`) shapes at **opacity 0.41**: (711.1, 3150.9) 537.1 × 300.8 (rounded rect clip, r 0) and a circle-clipped shape (771.1, 3688.6) 402.2 × 160.1 — read as light-blue arcs top-right and bottom-right; built as a 0.41 blue-500 rounded block and a circle segment ⚠ approximated | SVG |
| Photo | `2_d818a07d.png` 1250.4 × 824.6 at (5.6, 3082.0), **clip (579.9, 3150.9)–(1256.5, 3848.7)** (card's right part), luminance mask `2_6ecce174.png` | SVG |
| Eyebrow "FAMILY HEALTH CARD" | white, cap 17 → **26 px** ⚠ ESTIMATED (a larger eyebrow), tracking ≈ 0.12em, left 187.5, baseline 3211.6 | SVG |
| H2 | white "Your family's health, / in your pocket"; 'Y' cap 35 → **53 px `display-md`**, pitch 48.6 → **50** (regularised); baseline 3271 / 3321; left 185.4 | SVG |
| Paragraph | white 21 px body, 2 lines pitch 27 → **26**; baseline 3404.1; left 186.6; width ~362 | SVG |
| Bullets | white 21 px, item pitch 30, wrapped-line pitch 23.3 → **line-height 24**, item gap 6; bullet dot at x 195; text left 212 | SVG |
| Button | white pill 265.1 × 32.2 at (193.2, 3688.6), radius pill; text `#1c4e8f` → `blue-900`, asc 13.4 → **18 px / 700** ⚠ ESTIMATED (reads bold) | SVG |

Deviations: H2 pitch 48.6 → 50; paragraph pitch 27 → 26; decorative shapes approximated.

## 7. HEALTH INSIGHTS — "Latest from our doctors" (band 3880–4440.4)

| Element | Value | Source |
|---|---|---|
| Eyebrow | ink 585.8–775.8, baseline 3931.6, centre 680.8 → centred | SVG |
| H2 | ink 345.7–1015.2 × 3952.1–3996.9, centre 680.5 → centred; baseline **3995.2**; 58/700 | SVG |
| Sub-line | black 21 px body, ink 325.1–1037.2, baseline **4043.6**, centred | SVG |
| Cards | white 330.4 × 225.5 at y 4085.5; x 142.1 / 518.6 / 888.4 (gaps 46.1 / 39.4) → **regularised 42.75** (x 142.1 / 515.25 / 888.4); radius 21; border 1.5 px `blue-900` | SVG |
| Card title | black, asc 17.9 → **24 px `title` 600**; inset (19.8, 60.7 top); baseline 4164.5 | SVG |
| Excerpt | black, asc 14.1 → **19 px / 400** (`body-md`, new ⚠), pitch 22; baseline 4194.5; width ~290 | SVG |
| Meta | `#00bf63` `green-500`, asc 10.3 → **14 px / 400** `meta`; baseline 4288; inset 21.9 | SVG |
| "Read More Articles →" | PNG button 235.2 × 46 at (567.5, 4347.9), centred; radius 11; same button fill; 16 px black | SVG |

Deviations: card gaps → 42.75.

## 8. FOOTER (shared component; band 4440.4–4854.5)

| Element | Value | Source |
|---|---|---|
| Main band | `#1c4e8f` 4440.4–4759.9 → `blue-900` | SVG |
| Copyright band | `#17447e` 4738.3–4854.5 → `blue-900`. **Consolidation removes the mock's tone step between the two bands** (ΔE ≈ 3); a 1 px `rgba(255,255,255,.12)` rule marks the boundary ⚠ deviation | SVG |
| Disclaimer | white, 3 justified paragraphs, left 67, width 376, glyph asc 8.3 → 11.2 px → **13 px footer-link (floor)**, pitch 12.7 → **14** | SVG + floor |
| Highlighted paragraph | `#ffd591` → `orange-500` (consolidated) | SVG |
| "We are ISO Certified" | `#ffd591` → `orange-500`, asc 11.6 → **16 px / 700** ⚠ ESTIMATED | SVG |
| ISO line | white 13 px, baseline 4725.5 | SVG |
| Column headings | `#ffd591` → `orange-500`, **`footer-heading` 16 / 400**; x 523.1 / 645.3 / 761.7 / 893.3 / 1035.7 / 1190.4; baseline 4479.4 | SVG |
| Links | white **13 px `footer-link`**, first baseline 4507.2, pitch 27 (two-line items 14.6 → 14) | SVG |
| Copyright | white 13 px, 3 lines pitch 13.7 → 14, baselines from 4779.4; phone `footer-phone` 22 / 400 with the utility phone icon, baseline 4838.3 | SVG |

Deviations: all sub-13 px footer text raised to 13 (pitch 14); the two navy tones merge into `blue-900`.

## Build notes (2026-09-15) — findings and deviations beyond the tables

| Item | Finding | Built as |
|---|---|---|
| "Meet your care team" | not 58 px: the SVG text line missed the wide "M"/"m" glyphs. Render: ink 622 × 53, "M" cap 42 px → **64 px**; "M" legs 9 px → Bold (ExtraBold 10.1). Width fits automatic optical size. The first-pass Canva value 45.8 pt (61 px, labelled "testimonial head") was this heading | `display-xl` **64 / 700, auto opsz** (606 wide, 17 px under the mock — logged) |
| "Latest from our doctors" | width 669.5 = Bricolage 58 at **opsz 12** (663); opsz 96 gave 602 | `display-lg` pinned opsz 12 (like the process and testimonial H2s) |
| Optical sizes on one page | hero/care H2s at 96, process/stories/insights at 12, specialists at auto: three behaviours | matched per heading; **mock inconsistency, not unified** |
| Article topics | "IVF Treatment" 168.7 wide = 24/600 at opsz 12 (166) | `title` pinned opsz 12 |
| Health-card lead & bullets | stems 1 px → **Light 300**; widths match at opsz 96 | 21 / 300, opsz 96; measures 400 / 345 to keep the mock's line breaks |
| Health-card eyebrow | 26 px at 0.12em rendered 307 vs 323 | letter-spacing **0.155em** |
| Footer about column | 13 px text (floor) needs ~16 % more room than the mock's 11.2 px | width **430** (mock 376); ISO heading and line anchored to the design's y; column headings +4 px |
| Footer bands | `#1c4e8f` and `#17447e` both consolidate to `blue-900` | one navy; 1 px 12 % white rule at the copyright band |
| Copyright line | 13 px renders 30 px longer than the 11.9 px mock line | deviation (floor) |
