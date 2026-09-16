# Home section 4 — "PATIENT STORIES / Trusted by thousands of Kolkata families" — values table (built 2026-09-15)

Page px at 1366. Sources: **SVG** · **render** · **type-scale** / **tokens** · **⚠ ESTIMATED**.
Reference crop: `design/render/section34_crop.png` (page y 1560–2560).

## Section band

| Element | Value | Source |
|---|---|---|
| Section top | **2040** ⚠ ESTIMATED (see section 3) | — |
| Section bottom | **2499.9** — the next band's gradient (`8a68c77a6d`, "OUR SPECIALISTS") starts here | SVG |
| Background | page white | SVG |

## Heading block (centred)

| Element | Value | Source |
|---|---|---|
| Eyebrow "PATIENT STORIES" | ink 582.4–769.5 × 2086.2–2099.0 (187.1 wide); baseline **2099.0** | SVG (union) |
| Eyebrow style | `eyebrow` 19 / 300, uppercase, 0.12em, `grey-600` | type-scale |
| H2 line 1 "Trusted by thousands" | ink 364.6–989.4 × 2122.9–2177.8; ascender top 2122.9 → baseline **2166.0** | SVG (union) |
| H2 line 2 "of Kolkata families" | ink 413.8–941.1 × 2181.8–2228.5; ascender top 2181.8 → baseline **2224.9** | SVG (union) |
| H2 line pitch | **58.9** in the mock — section 3's H2 uses 50 and the hero H1 50. **Proposed: 50** ⚠ deviation (regularise to the pitch used everywhere else); flag if you prefer the mock's looser 59 here | render |
| H2 style | `display-lg` 58 / 700, opsz 96, `blue-900` | type-scale |

## Testimonial cards (three)

| Element | Value | Source |
|---|---|---|
| Card boxes | heights **208.2**; y **2271.7 / 2269.7 / 2268.7** (drift); x/width **97.7–475.9 (378.1) / 493.6–885.6 (392.0) / 905.6–1267.5 (361.9)** — three different widths, gaps 17.7 and 20.0 | SVG (clip boxes) |
| Cards, regularised | y **2270**; widths **377.4** each; x **97.7 / 493.95 / 890.2**; gaps **18.85** (outer edges 97.7 and 1267.6 kept) ⚠ deviation | derived |
| Card radius | **21** (rounded clip inset) | SVG |
| Card fill / border | white; SVG stroke `#17447e` 2 pt centred on the clipped edge → **visible ~1.3 px**; build **1.5 px `blue-900`** ⚠ ESTIMATED rendering of a half-clipped stroke | SVG + render |
| Stars | 5 per card, raster `2_c8bddf36.png` 14.4 × 13.7, pitch 17.4, y **2291.4** (card top + 19.7); right edge = card right − 29.7 (446.2 / 868.5 / 1242.6). Sampled `#ffaa23` | SVG (image boxes) |
| Stars, proposal | use the vector star already lifted for the hero, 14.4 px, colour **`orange-500 #ffb43a`** (sampled `#ffaa23`, ΔE ≈ 4) ⚠ deviation (vector instead of raster; nearest token colour) | derived |
| Quote mark | glyph pair `“` in `#9ebff5` (`blue-200`), 31.9 × 23.2, at (117.5, 2313.8) / (514.6, 2313.8) / (928.2, 2316.2) → card inset **(19.8, 42.1)** | SVG (union) |
| Quote text | 3 lines; line 1 starts after the quote mark (x 162.4 = mark right + 13), lines 2–3 at x 120.1; baselines **2334.8 / 2354.8 / 2374.8** → **line-height 20**; width ≈ 330 (card inner) | SVG (union) + render |
| Quote style | `quote` 13 px / 400 **upright** (decided; design is Canva Sans italic), `black`, line-height 20; first-line indent 42 px to clear the mark | type-scale |
| Quote copy | card 1 "My entire pregnancy was a smooth ride with the team here. The doctors made me feel very comfortable every single visit." · card 2 "The clinic has sonography, tests, and everything under one roof. Dr. Smita is very patient and reassuring — wonderful for expecting mothers." · card 3 "The clinic is very well organised, clean and efficient. The staff is courteous, knowledgeable and helpful. Highly recommend." | render |
| Avatar disc | **44.1** diameter, `purple-500`, at (123.3, 2412.3) / (520.1, 2411.9) / (932.2, 2409.5) → card inset **(25.6, 140.6)** | SVG |
| Monogram | **Playfair Display 400, 24 px**, white, centred in the disc (decided) | type-scale |
| Reviewer name | "Isha Agarwal" 179.7–275.4 × 2418.2–2432.2 → **16 px**, weight ⚠ ESTIMATED **700** (stem 2 px: SemiBold 2.0 / Bold 2.3; render reads bold); baseline **2430.1**; x = disc right + 12.3 | SVG (union) + render |
| Reviewer role | "Pregnancy Care · Kankurgachi" 180.0–387.0 × 2436.6–2450.0 → **14 px / 400** ⚠ ESTIMATED (ascender 10.7 → 14.4); baseline **2447** (name→role pitch 17); `black` | SVG (union) |
| Names / roles | Isha Agarwal — Pregnancy Care · Kankurgachi · Harshita Nahata — Antenatal Care · Kankurgachi · Sushmita Mitra — Medical Care · CMC | render |
| Card 3 vertical drift | its stars, quote and avatar sit 2–3 px higher than cards 1–2 (card top 2268.7 vs 2271.7) — regularised with the card | SVG |

## Proposed tokens (⚠ ESTIMATED unless noted)

| Token | Value |
|---|---|
| `radius-card-lg` | 21 px (SVG clip, measured) |
| `border-card` | 1.5 px `blue-900` |
| `name` | 16 px / 700 |
| `meta` | 14 px / 400 (same size as `button-sm`; a general 14 px Regular) |
| `avatar` | 44.1 px `purple-500`, Playfair 400 / 24 px white |

## Deliberate deviations proposed

| Mock | Build | Why |
|---|---|---|
| Card widths 378.1 / 392.0 / 361.9, gaps 17.7 / 20.0 | 377.4 × 3, gaps 18.85 | drift |
| Card tops 2271.7 / 2269.7 / 2268.7 | 2270 | drift |
| H2 pitch 58.9 | 50 | consistency with the other display headings (flagged) |
| Canva Sans italic quote | Bricolage Regular upright | licence (decided) |
| The Seasons monograms | Playfair Display 400 | licence (decided) |
| Raster stars `#ffaa23` | vector star, `orange-500` | nearest token; sharper |

## Build notes and deviations logged (2026-09-15)

| Item | Mock | Built | Kind |
|---|---|---|---|
| Eyebrow position | centre 676 (7 px left of the page centre) | centred | deviation (drift) |
| H2 optical size | width 625 = Bricolage at **opsz 12** | pinned `opsz 12` to match; mock inconsistency flagged with section 3 | matched |
| H2 line pitch | 58.9 | 50 | deviation (approved) |
| Cards | widths 378.1 / 392.0 / 361.9, tops 2271.7 / 2269.7 / 2268.7, gaps 17.7 / 20.0 | 377.4 × 3 at y 2270, gaps 18.85 | deviation |
| Border | 2 pt stroke half-clipped (~1.3 px visible) | 1.5 px | approved |
| Stars | raster `#ffaa23` | vector star, `orange-500` | approved |
| Quote mark | glyph pair in the SVG | lifted as `quote-mark.svg` (31.9 × 23.2) | construction |
| Quote | Canva Sans italic 13 px | Bricolage Regular 13 px upright, line-height 20, 42 px first-line indent | decided |
| Monograms | The Seasons | Playfair Display 400 / 24 px | decided |
| Card radius | 21 (SVG clip) | `radius-card-lg` 21 | measured (token added) |
