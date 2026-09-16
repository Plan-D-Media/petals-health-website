# Petals Health — Design Spec (extracted from Canva SVG export)

Prepared 2026-09-12 from the 22 SVG files in the project root. This document records
only what the files contain or what was measured. Where a value cannot be read from the
files it is marked **unknown, needs measuring**. Nothing here is an assumption unless
labelled as an inference.

Generated artefacts referenced below:

| Folder | Contents |
|---|---|
| `design/svg/` | Lean SVGs (base64 photos removed, `<image>` now points to `../assets/…`) |
| `design/assets/` | 146 extracted photo/graphic files (52 MB) |
| `design/render/` | Full-size PNG render of every lean SVG (1366 px wide, headless Chrome, DPR 1) |
| `design/render/small/` | 600 px-wide previews, split into ≤1800 px chunks, used for identification |

---

## 1. Splitter results

Command: `python split_svg.py . design`

| File | Before | After | Images extracted |
|---|---|---|---|
| 1.svg | 21 K | 21 K | 0 |
| 2.svg | 12,094 K | 6,196 K | 74 |
| 3.svg | 24 K | 24 K | 0 |
| 4.svg | 12,101 K | 8,913 K | 17 |
| 5.svg | 32 K | 32 K | 0 |
| 6.svg | 12,516 K | 3,668 K | 14 |
| 7.svg | 46 K | 46 K | 0 |
| 8.svg | 3,238 K | 950 K | 8 |
| 9.svg | 35 K | 35 K | 0 |
| 10.svg | 10,006 K | 5,336 K | 13 |
| 11.svg | 6,790 K | 4,010 K | 13 |
| 14.svg | 13,576 K | 7,212 K | 18 |
| 15.svg | 11,970 K | 5,561 K | 22 |
| 16.svg | 10,066 K | 3,744 K | 12 |
| 17.svg | 6,223 K | 3,633 K | 11 |
| 18.svg | 6,088 K | 3,144 K | 11 |
| 19.svg | 30 K | 30 K | 0 |
| 21.svg | 34 K | 34 K | 0 |
| Cosmetic Gynaecology & Aesthetics.svg | 16,035 K | 11,301 K | 38 |
| Find a Doctor.svg | 30,691 K | 6,180 K | 31 |
| Petals IVF.svg | 19,105 K | 7,175 K | 27 |
| under Find a Doctor.svg | 10,016 K | 4,918 K | 21 |
| **TOTAL** | **180,747 K** | **82,175 K** | **330 image refs → 146 unique files** |

The lean files are still 1–11 MB each. No base64 remains; the residual weight is
`<path>` outline data (every glyph of every word is a path) plus thousands of
`<clipPath>`/`<mask>` definitions and multi-hundred-stop gradients.

**Splitter text audit:** every one of the 22 files reported `PATHS ONLY, text=0`.
No file contains a single `<text>` element. See §4.

**Splitter bug found and fixed.** For `Cosmetic Gynaecology & Aesthetics.svg` the
script wrote the asset filename into the href with a raw `&`
(`href="../assets/Cosmetic Gynaecology & Aesthetics_….png"`), which is invalid XML.
Chrome refused to render the file ("Unexpected token inside entity"). The original export
had no raw ampersands, so this was introduced by the splitter. Fixes applied:

- The 38 hrefs in `design/svg/Cosmetic Gynaecology & Aesthetics.svg` were rewritten to `&amp;`.
- `split_svg.py` now escapes `&` in the filename it writes into the href (one-line change).
- Nothing else in the lean SVGs was modified.

---

## 2. Page map (from rendered images, not from text)

Because no `<text>` survives, pages were identified by rendering each lean SVG to PNG
and reading the render. Filenames are unchanged. **Rename only after confirming this map.**

### Dividers (title cards, not pages)

Each is a pale-blue radial-gradient card with one line of dark-blue text and an arrow.

| File | Text on card |
|---|---|
| `1.svg` | Home Page → |
| `3.svg` | About Us Page → |
| `5.svg` | Clinic Location Page → |
| `7.svg` | Treatement Page Dropdown Mock → *(sic)* |
| `9.svg` | Treatement Sub Page → *(sic)* |
| `19.svg` | Find a Doctor Page → |
| `21.svg` | View Doctor Profile Page → |

### Pages

| File | Page it represents | viewBox H (pt) | H in CSS px at 1366 | `<text>` | `<path>` | `<image>` |
|---|---|---|---|---|---|---|
| `2.svg` | Home page | 3642 | 4856 | 0 | 4821 | 74 |
| `4.svg` | About Us page | 2955 | 3940 | 0 | 6377 | 17 |
| `6.svg` | Clinic Location page (3 clinic photos, "3 clinics across Kolkata" cards, FAQs, Book a Consultation form) | 1658.25 | 2211 | 0 | 2830 | 14 |
| `8.svg` | Treatments nav-dropdown mock: home hero with the Treatments menu open. Single viewport (877 px), not a full page | 657.75 | 877 | 0 | 611 | 8 |
| `10.svg` | Treatment sub page — Women's Care ("Nine ways we care for Women") | 2398.5 | 3198 | 0 | 3741 | 13 |
| `11.svg` | Treatment sub page — Child Care / Paediatrics | 1722 | 2296 | 0 | 2854 | 13 |
| `14.svg` | Treatment sub page — Dentistry | 4182.75 | 5577 | 0 | 5082 | 18 |
| `15.svg` | Treatment sub page — Multi Speciality Clinic (with "Cardiology, in depth") | 2592 | 3456 | 0 | 4003 | 22 |
| `16.svg` | Treatment sub page — Yoga & Wellness | 2206.5 | 2942 | 0 | 2669 | 12 |
| `17.svg` | Treatment sub page — Pain Management & Rejuvination *(sic)* | 1682.25 | 2243 | 0 | 2630 | 11 |
| `18.svg` | Treatment sub page — Audiology | 1659.75 | 2213 | 0 | 2273 | 11 |
| `Cosmetic Gynaecology & Aesthetics.svg` | Treatment sub page — Cosmetic Gynaecology & Aesthetics (3 tracks, LuxMOM Re-sculpt Package, form) | 5031.75 | 6709 | 0 | 7716 | 38 |
| `Petals IVF.svg` | Treatment sub page — Fertility / Petals IVF | 4656 | 6208 | 0 | 5357 | 27 |
| `Find a Doctor.svg` | Find a Doctor listing (filter sidebar, doctor cards, pagination, "Not sure who to pick?" band) | 2037.75 | 2717 | 0 | 3785 | 31 |
| `under Find a Doctor.svg` | Doctor profile page (example content: Dr. Smita Gutgutia) | 2480.25 | 3307 | 0 | 3774 | 21 |

"viewBox H" is in points (SVG user units). CSS px height = viewBox H × 4/3, which equals the
file's `height` attribute and the layout height at 1366 px (see §3).

### Numbering gaps

Files 12, 13, 20 and 22 do not exist. The Treatments dropdown in `8.svg` lists nine items in
this order: Women's Care, Child Care, Fertility Care, Cosmetic Gynaecology & Aesthetics,
Dentistry, Multispecialty Clinic, Yoga & Welness, Pain Management & Rejuvination, Audiology.
Files 10, 11, 14, 15, 16, 17, 18 match positions 1, 2, 5, 6, 7, 8, 9 of that list exactly, so
the named files `Petals IVF.svg` and `Cosmetic Gynaecology & Aesthetics.svg` very likely
occupied slots 12 and 13, and `Find a Doctor.svg` / `under Find a Doctor.svg` slots 20 and 22.
**This is an inference from ordering, not something the files state.**

### Shared elements seen on every full page

Top bar (logo, phone 9147405955, Book an Appt, Find a Doctor, Ask a Doctor), dark-blue nav
strip (Home, About us, Clinics ▾, Treatments ▾, Diagnostic Services, For Patients ▾, Petals
Clinic in Bangladesh), and a dark-blue footer with six link columns, disclaimer text, ISO
line, copyright and phone. The doctor profile page uses a breadcrumb strip instead of the
full nav. Exact positions and sizes of these: **unknown, needs measuring**.

---

## 3. viewBox, layout width and units (decided 2026-09-12 — do not re-open)

Every one of the 22 files has the same root:

```
width="1366" height="<px>" viewBox="0 0 1024.5 <H>" preserveAspectRatio="xMidYMid meet"
```

| Quantity | Value |
|---|---|
| Declared `width` (Canva canvas) | **1366 px — this is the layout width** |
| viewBox width (all files) | 1024.5 = 1366 × 0.75, i.e. the SVG user unit is the **point** |
| SVG user unit → CSS px | × 4/3 (1.333333) |
| `design/render/*.png` px → CSS px | × 1 (renders are at 1366 wide) |

### Geometry: 1:1

Positions, widths, heights, stroke widths and radii measured on the renders are CSS pixels
as-is. Anything read from raw SVG coordinates is in points and needs × 4/3.

### Type: Canva points × 4/3

Canva displays type sizes in points, not pixels. The type values measured in Canva
(see `design/type-scale.md`) must be multiplied by **4/3** to get CSS px at 1366. This was
verified, not assumed: each element was located on the 1366-wide render of `2.svg`, its
x-height measured in pixels, and the font size back-computed with Bricolage Grotesque's
x-height ratio (0.525 em, read from the TTF).

| Element | Canva value | Canva × 4/3 | Measured on render |
|---|---|---|---|
| Hero H1 | 39.4 | 52.5 | 53.3 px |
| Section H2 | 43.3 | 57.7 | 57.1 px |
| Section sub-line | 24 | 32.0 | 30.5 px |
| Hero body paragraph | 15.8 | 21.1 | 21.0 px |
| Nav links | 9 | 12.0 | 11.4 px |

Five for five within measurement error; the 1:1 reading would have predicted 39.4, 43.3,
24, 15.8 and 9 px, which the render rules out. The earlier 1440 px target and its 1.405564
factor are withdrawn.

---

## 4. Text audit

**All 22 files are flattened.** Zero `<text>` elements anywhere. Every character is a
filled `<path>` inside nested `<g>` groups with `clip-path` references. Consequences:

- Font family, font size, weight, line-height, letter-spacing and text colour cannot be
  read from any file. No `font-family`, `font-size` or `style` attribute exists in any SVG.
- Text *content* is readable only from the rendered PNGs.
- Text colour can be inferred from the `fill` of the glyph paths, but the file does not say
  which paths are glyphs, so a fill count cannot be attributed to text vs. shapes without
  inspecting coordinates.

Pages that will have to be measured against a rendered image for type sizes
(i.e. every page):

`2.svg`, `4.svg`, `6.svg`, `8.svg`, `10.svg`, `11.svg`, `14.svg`, `15.svg`, `16.svg`,
`17.svg`, `18.svg`, `Cosmetic Gynaecology & Aesthetics.svg`, `Find a Doctor.svg`,
`Petals IVF.svg`, `under Find a Doctor.svg` — plus the seven divider cards, which are
irrelevant to the build.

Reference renders for measurement are in `design/render/` at 1366 px wide (1:1 with the
Canva canvas). They were rendered at device-pixel-ratio 1; re-render at 2× if finer
measurement is needed.

---

## 5. Design tokens (exactly as found in the files)

### 5.1 Fill colours (`fill="#…"` across all 22 lean SVGs)

Counts include glyph outlines, shapes, mask/clip contents and the 7 divider cards.
No `rgb()` or named-colour fills exist; only hex and `url(#gradient)`.

| Hex | Count | Notes from the renders (observation, not from the file) |
|---|---|---|
| `#ffffff` | 25077 | white — backgrounds, white text on blue |
| `#000000` | 22429 | black — dominant on About (4811) and Cosmetic (4281); much of this is body-copy glyphs and mask content |
| `#00427e` | 5286 | dark navy — nav strip, footer, dark cards, divider-card text |
| `#ffd591` | 3547 | pale orange — appears exactly 254× on almost every full page and 252× on About; suggests one shared repeated element (unverified) |
| `#17447e` | 2824 | navy — headings, buttons, strokes |
| `#1c4e8f` | 2388 | mid blue |
| `#f12200` | 134 | red-orange — "Call" buttons, section titles on Yoga/Pain/Cosmetic |
| `#d13a32` | 119 | red — Women's Care and About only |
| `#ed1941` | 116 | pink-red — accent word in hero headlines |
| `#ffb43a` | 74 | orange — 1× on nearly every page, 59× on Petals IVF |
| `#00bf63` | 74 | green — Home only |
| `#6e5fa1` | 57 | purple — Find a Doctor, step circles on Home |
| `#9ebff5` | 16 | light blue |
| `#366db3` | 12 | blue |
| `#4d4d4d` | 8 | grey — Find a Doctor only |
| `#808080` | 8 | grey — Find a Doctor only |
| `#1a1a1a` | 8 | near-black — Find a Doctor only |
| `#9e1600` | 8 | dark red — Find a Doctor only |
| `#ffd6cf` | 8 | pale pink — Find a Doctor only |
| `#ff8e7a` | 6 | salmon — Home only |
| `#d9d9d9` | 5 | light grey — 1× on each page that has a form |
| `#1c3aa9` | 5 | blue — 1× on each page that has a form |
| `#4285f4` | 5 | Google blue — 1× on each page that has a form (reCAPTCHA badge) |
| `#ababab` | 5 | grey — 1× on each page that has a form |
| `#faa51c` | 5 | amber — Petals IVF only |

Per-page breakdown (fills, descending):

| File | Fills |
|---|---|
| 2.svg (Home) | #000000(2202) #ffffff(1793) #17447e(337) #ffd591(254) #1c4e8f(104) #00bf63(74) #00427e(51) #ed1941(15) #6e5fa1(7) #9ebff5(6) #ff8e7a(6) #366db3(2) #ffb43a(1) |
| 4.svg (About) | #000000(4811) #ffffff(1603) #17447e(372) #ffd591(252) #d13a32(11) #ffb43a(1) #1c4e8f(1) |
| 6.svg (Clinics) | #ffffff(1835) #000000(633) #ffd591(254) #17447e(236) #1c4e8f(2) #d9d9d9(1) #1c3aa9(1) #4285f4(1) #ababab(1) #00427e(1) #ffb43a(1) |
| 8.svg (dropdown mock) | #00427e(184) #000000(161) #ffffff(112) #17447e(94) #1c4e8f(35) #ed1941(15) #ffb43a(2) |
| 10.svg (Women) | #ffffff(1632) #000000(1623) #17447e(338) #ffd591(254) #d13a32(108) #ed1941(36) #1c4e8f(2) #d9d9d9(1) #1c3aa9(1) #4285f4(1) #ababab(1) #00427e(1) #ffb43a(1) |
| 11.svg (Child) | #ffffff(1382) #000000(1136) #ffd591(254) #1c4e8f(156) #17447e(98) #ed1941(15) #00427e(2) #ffb43a(1) |
| 14.svg (Dentistry) | #ffffff(2121) #000000(1960) #00427e(763) #ffd591(254) #1c4e8f(218) #17447e(133) #ed1941(4) #d9d9d9(1) #1c3aa9(1) #4285f4(1) #ababab(1) #ffb43a(1) |
| 15.svg (Multi Speciality) | #00427e(1888) #ffffff(1620) #000000(499) #ffd591(254) #17447e(95) #1c4e8f(1) #ffb43a(1) |
| 16.svg (Yoga) | #ffffff(1388) #00427e(737) #000000(434) #ffd591(247) #17447e(83) #f12200(15) #1c4e8f(1) #ffb43a(1) |
| 17.svg (Pain) | #ffffff(1380) #00427e(667) #000000(486) #ffd591(254) #17447e(83) #f12200(14) #1c4e8f(1) #ffb43a(1) |
| 18.svg (Audiology) | #ffffff(1378) #00427e(430) #000000(344) #ffd591(254) #17447e(83) #1c4e8f(1) #ffb43a(1) |
| Cosmetic Gynaecology & Aesthetics.svg | #000000(4281) #ffffff(2572) #1c4e8f(599) #ffd591(254) #17447e(196) #f12200(97) #ed1941(28) #00427e(25) #366db3(10) #d9d9d9(1) #1c3aa9(1) #4285f4(1) #ababab(1) #ffb43a(1) |
| Find a Doctor.svg | #ffffff(1468) #000000(1128) #1c4e8f(326) #17447e(279) #ffd591(254) #00427e(51) #6e5fa1(41) #4d4d4d(8) #808080(8) #1a1a1a(8) #f12200(8) #9e1600(8) #ffd6cf(8) #ffb43a(1) |
| Petals IVF.svg | #ffffff(2546) #000000(2197) #00427e(334) #ffd591(254) #1c4e8f(184) #17447e(155) #ffb43a(59) #6e5fa1(6) #faa51c(5) #ed1941(3) #d9d9d9(1) #1c3aa9(1) #4285f4(1) #ababab(1) |
| under Find a Doctor.svg (profile) | #ffffff(2233) #1c4e8f(757) #000000(534) #ffd591(254) #17447e(235) #00427e(12) #9ebff5(10) #6e5fa1(3) #ffb43a(1) |
| Divider cards (1,3,5,7,9,19,21) | #00427e(10–30) #ffffff(2) #17447e(1) each |

### 5.2 Stroke colours (`stroke="#…"`)

| Hex | Count |
|---|---|
| `#17447e` | 86 |
| `#ffffff` | 86 |
| `#000000` | 25 |
| `#6e5fa1` | 14 |
| `#f6f5e6` | 11 (Cosmetic page only — card borders) |
| `#1c4e8f` | 6 |
| `#faa51c` | 4 (Petals IVF only) |

Stroke widths found (`stroke-width`, SVG units = points; multiply by 4/3 for CSS px):
`2` (181), `1` (145), `4` (25), `2.042574` (7), `8` (6), `2.019059` (2),
`2.042825` (1), `2.032362` (1), `3` (1).

### 5.3 Fill opacity

`fill-opacity` is `1` almost everywhere. Non-1 values, exactly as found:
`0.07`, `0.19`, `0.41`, `0.64` (Home); `0.64` (About, Clinics); `0.19` (Cosmetic);
`0.5`, `0.85` ×42 (Find a Doctor); `0.52` (Petals IVF); `0.14`, `0.28`, `0.64` (profile).

### 5.4 Gradients

Canva exports gradients as long stop ramps in percentage `rgb()`; there are no hex stops.
Distinct gradients, identified by first and last stop:

| Kind | First stop | Last stop | Stops | Occurrences | Where |
|---|---|---|---|---|---|
| radial | `rgb(99.898%, 99.936%, 99.969%)` | `rgb(47.839%, 67.839%, 85.100%)` | 257 | 76 | card backgrounds (white → blue) |
| radial | `rgb(99.969%, 99.898%, 99.928%)` | `rgb(85.100%, 47.839%, 63.530%)` | 257 | 50 | Find a Doctor (white → rose) |
| radial | `rgb(99.828%, 99.919%, 100%)` | `rgb(89.020%, 94.899%, 100%)` | 41 | 33 | page/hero background (white → pale blue); 1 per file |
| linear | `rgb(100%, 100%, 100%)` | `rgb(47.839%, 67.839%, 85.100%)` | 257 | 4 | |
| linear | `rgb(99.998%, 99.998%, 99.998%)` | `rgb(47.839%, 67.839%, 85.100%)` | 257 | 3 | |
| linear | `rgb(83.139%, 89.020%, 100%)` | `rgb(99.867%, 99.913%, 100%)` | 67 | 2 | |
| linear | `rgb(83.327%, 89.142%, 100%)` | `rgb(99.834%, 99.890%, 100%)` | 67 | 1 | |

Percentages above are truncated to 3 decimals for readability; the files carry 6.
Gradient direction/centre attributes were not extracted: **unknown, needs reading per element**.

### 5.5 Font families

**None found.** No `font-family` attribute or CSS exists in any file (text is outlined).
From the renders, the display face is visibly a wide grotesque consistent with Bricolage
Grotesque and the body face is a humanist sans consistent with Hind, but the files do not
state this. Family assignment per text style: **unknown, needs visual confirmation**.

### 5.6 Font sizes

**None found.** No `font-size` anywhere. Every size: **unknown, needs measuring** against
`design/render/*.png` (measure cap-height or x-height in px; renders are already at 1366 = CSS px).
Superseded: Home-page sizes have since been measured in Canva; see `design/type-scale.md`.

### 5.7 Corner radii

**None found as `rx`/`ry`.** There are 1,109 `<rect>` elements across the files and not one
carries `rx` or `ry`. All visibly rounded shapes (buttons, cards, pills, form fields) are
`<path>` elements with arc/curve commands. Every radius: **unknown, needs measuring**
(either from the render or by reading the arc radius out of the specific path's `d`).

---

## 6. Font inventory

### Bricolage_Grotesque/

- `BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf` — variable font, axes:
  `opsz` 12–96 (default 96), `wght` 200–800 (default 800), `wdth` 75–100 (default 100).
- `static/` — 112 static TTFs = 7 weights × 3 widths × 6 optical-size cuts (unlabelled,
  24pt, 36pt, 48pt, 72pt, plus the width-only cuts). Widths: normal, SemiCondensed, Condensed.
- Weights present (OS/2 usWeightClass): ExtraLight 250, Light 300, Regular 400, Medium 500,
  SemiBold 600, Bold 700, ExtraBold 800.
- No italics. Format: TTF only. Licence: OFL.txt.

### Hind/

| File | Weight |
|---|---|
| Hind-Light.ttf | 300 |
| Hind-Regular.ttf | 400 |
| Hind-Medium.ttf | 500 |
| Hind-SemiBold.ttf | 600 |
| Hind-Bold.ttf | 700 |

No italics, no ExtraBold/Black. Format: TTF only. Licence: OFL.txt.

### Weights the SVGs reference but we lack

**Cannot be determined.** The SVGs reference no font at all, so no weight can be flagged as
missing from the files. Weights actually used in the design are **unknown, needs measuring**
(compare rendered glyph stem widths against the static fonts). Two facts worth noting:

- Only TTF is present for both families. Web delivery normally wants WOFF2; none exists yet.
- Hind has no weight above 700. If the design uses heavier Hind, it does not exist.

---

## 7. What the SVGs can and cannot tell us

**Can:**
- Page structure and order, all copy (via renders), which photos belong to which page
  (`design/assets/<file>_<hash>.<ext>` is named after its source SVG).
- Exact flat colours used (§5.1, §5.2) and where each is used.
- Gradient endpoints and stop counts (§5.4).
- Element positions and sizes in SVG units, once a given path/rect/image is located
  (SVG units are points; × 4/3 for CSS px).
- Stroke widths used.

**Cannot:**
- Any typography: family, size, weight, line-height, letter-spacing, alignment rules.
- Corner radii (no `rx`/`ry`; radii are baked into path arcs).
- Which `fill` counts belong to text vs. shapes vs. mask contents.
- Spacing system, grid, breakpoints, hover/focus states, dropdown behaviour, or any
  responsive intent. The design is a single 1366 px desktop canvas per page.
- Anything about the missing files 12, 13, 20, 22 beyond the ordering inference in §2.

**Decisions taken 2026-09-12 (see `design/type-scale.md`, `design/tokens.md`):**
1. Layout width 1366 px; geometry 1:1; Canva type values × 4/3.
2. No brand guideline document exists; the Canva design is the colour source of truth and
   near-duplicate shades are consolidated by usage count.
3. Hind is unused. Readability floor 13 px, four labels raised.
4. Still open: remaining weights, eyebrow style with letter-spacing, testimonial quote size
   (being measured in Canva); the page-map rename in §2.
