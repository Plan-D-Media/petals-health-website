# Petals Health — Design Tokens

Status: **colour and size decisions approved 2026-09-12 to 14; CTA start colour darkened for contrast; weights, eyebrow and quote
pending Canva measurement.** Layout width **1366 px**.

**There is no brand guideline document.** The project folder, its font folders (OFL
licences only), the earlier `petal_v2` site and the shared Drive folder were all searched.
The client has been asked and, until told otherwise, we assume none exists. **The Canva
design is the source of truth for colour, and the consolidation below is our decision,
not a client-supplied palette.**

## Fonts

| Family | Files | Role |
|---|---|---|
| Bricolage Grotesque | variable TTF (wght 200–800, opsz 12–96, wdth 75–100) + 112 statics; **no italic** | Every text style in the design except the two below. Weights needed: 300, 400, 500, 600, 700 (800 only if a synthetic-bold step-up is confirmed) — see `type-scale.md` §6 |
| Hind | Light 300 – Bold 700, TTF | **Unused.** Nothing in the design references it. Kept in the repo, not loaded. |
| Canva Sans (Italic) | not in project — Canva-only licence | Testimonial quote in the design. **Cannot be served.** Quote set upright in Bricolage Regular, `font-synthesis: none`; neither family ships an italic |
| The Seasons (probable) | not in project — commercial (Latinotype), Canva-only licence | Monogram initials in avatar circles (Home testimonials, Home doctor cards, profile testimonials). **Cannot be served.** Replaced by an OFL serif: DM Serif Display or Playfair Display, side-by-side in `design/render/monogram-compare.png`, choice pending |
| Lora | `fonts/Lora-Variable.woff2` (wght 400–700) — SIL OFL | **Stat block numbers** ("100+", "4.8") — identified by outline comparison 2026-09-15. Token `stat-value`: Lora 400 / 28 px |

**Optical size (unified 2026-09-15).** Canva rendered the headings at three different `opsz` values
(drift). All display and heading tokens now use automatic optical sizing; no pins. Cost table and
reasoning in `type-scale.md` §2.

Web files generated in `fonts/` (WOFF2):

| File | Weight | Status |
|---|---|---|
| `BricolageGrotesque-Variable.woff2` | 200–800 + opsz | **the file to serve** — covers every weight the scale needs |
| `BricolageGrotesque-Bold.woff2` | 700, opsz-12 static | fallback only; will not match the headings' width (opsz finding) |
| `BricolageGrotesque-Regular.woff2` | 400, opsz-12 static | fallback only |

Not converted: the other 110 static cuts, and Hind. No further conversions until the optical-size
decision.

## Colour

### Consolidated palette (our decision)

Rule applied: within each cluster of near-identical shades, the variant with the highest
usage count in the SVGs becomes the token; the others map onto it. Two exceptions, orange
and red, were decided by role (below). Counts are `fill`
occurrences across all 22 lean SVGs (from DESIGN-SPEC.md §5.1).

| Token | Hex | Count | Role in the design |
|---|---|---|---|
| `blue-900` | `#00427e` | 5286 | nav strip, footer, dark cards, headings, buttons |
| `accent` | `#ed1941` | 116 | the accent half of split headlines (53–61 px Bold) — **decided by role** (see note). Contrast on white 4.36:1, on card `#e8f0ff` 3.81:1: passes the 3:1 large-text threshold, fails 4.5:1 |
| `accent-dark` | `#be1234` | — (ours) | the nine "Learn more →" links on Women's Care (13 px) and the four Cosmetic sub-headings (19–21 px). Contrast on white 6.31:1, on card `#e8f0ff` 5.51:1, on the deeper card tint `#d0e0f6` 4.71:1 — clears 4.5:1 everywhere measured. Same hue as `accent`, darkened only |
| `cta-start` | `#f86800` | — (ours) | left end of the Call-button gradient. Sampled original was `#ff8229` (white text 2.48:1); darkened at the same 25° hue to `#f86800` so white clears 3:1 (3.01:1). See CTA note |
| `cta-end` | `#ff4b1d` | — (raster) | right/dominant end of the Call-button gradient, **sampled unchanged** from the pasted image (white text 3.35:1) |
| `orange-500` | `#ffb43a` | 74 | logo orange and the amber CTA buttons on the IVF page — **chosen by role, not count** (see note under mappings) |
| `blue-800` | `#1c4e8f` | (footer main band only) | reinstated 2026-09-15 so the footer keeps its tone step; everywhere else `#1c4e8f` still maps to `blue-900` |
| `blue-500` | `#366db3` | 12 | small accents (Home, Cosmetic) — kept, not in a cluster |
| `blue-200` | `#9ebff5` | 16 | light accents (Home, profile) — kept |
| `pink-200` | `#ffd6cf` | 8 | Find a Doctor tint — kept |
| `salmon-300` | `#ff8e7a` | 6 | Home tint — kept |
| `green-500` | `#00bf63` | 74 | Home only (map pin / tick marks) — kept |
| `purple-500` | `#6e5fa1` | 57 | step circles, Find a Doctor — kept |
| `grey-800` | `#1a1a1a` | 8 | Find a Doctor — kept |
| `grey-600` | `#4d4d4d` | 8 | Find a Doctor; **also the eyebrow labels** (render samples `#4a4a4a`, ΔE 1.3 — folded in rather than adding a token) |
| `grey-500` | `#808080` | 8 | Find a Doctor — kept |
| `cream-100` | `#f6f5e6` | 11 (stroke) | Cosmetic page card borders — kept |
| `black` | `#000000` | 22429 | body copy |
| `white` | `#ffffff` | 25077 | backgrounds, reversed text |

### Every mapping made

| Design hex | Count | Maps to | Cluster |
|---|---|---|---|
| `#17447e` | 2824 | `#00427e` | dark blue |
| `#1c4e8f` | 2388 | `#00427e` — **except the footer main band**, where it is kept as `blue-800` (2026-09-15: the two footer bands need their tone step; a hairline divider read as a seam) | dark blue |
| `#f12200` | 134 | `#ed1941` (headlines) / `#be1234` (Cosmetic sub-headings) | red (accent) |
| `#d13a32` | 119 | `#ed1941` ("our Team?", arrows) / `#be1234` ("Learn more" links) | red (accent) |
| `#ffd591` | 3547 | `#ffb43a` | orange |
| `#faa51c` | 5 | `#ffb43a` | orange |

**Orange was decided by role, not frequency.** The count rule would have picked `#ffd591`,
but its 3547 count comes almost entirely from one element repeated 254× on every page. The
strong amber `#ffb43a` is what carries the brand on the CTA buttons and in the logo, so it
is the token and the pale tint maps onto it.

**Red was decided by role, not hue.** Every use of all three reds is a headline accent or a
link: `#ed1941` on seven hero split-headlines, `#f12200` on the Yoga and Pain titles and the
Cosmetic sub-headings, `#d13a32` on the Women's Care "Learn more" links, the About carousel
arrows and "our Team?". That is one job, so one token. Hue distance argued the other way for
`#f12200` — it is closer to the CTA orange-red (`#ff4b1d`, distance 52) than to crimson
(`#ed1941`, distance 66) — but it never plays the CTA role, so role wins. Full usage report
with crops: `design/render/red/`.

**CTA has no vector colour in the design.** The solid "Call 9147 405 955" buttons on Child
Care, Multi Speciality, Yoga, Pain and Audiology are a pasted 858×254 raster PNG with a
left-to-right gradient, not a filled shape. `cta-start` and `cta-end` were sampled from that
image (left edge `#ff8229`, dominant/right `#ff4b1d`, image mean `#ff5b21`). Build as
`linear-gradient(90deg, #f86800, #ff4b1d)`.

**CTA contrast (decided 2026-09-14).** The label is vector white text over the raster, not part of
the image. Measured on the render: ~27 px, stems 4 px → **Bold 700** (Bold predicts 3.8 px,
SemiBold 3.3). At 27 px Bold it is WCAG large text, so the bar is 3:1. White on the sampled start
`#ff8229` was 2.48:1 — a failure on the primary button — so the start moves to `#f86800`
(3.01:1, same hue, ΔE76 12.2 from the original). The end `#ff4b1d` already passes (3.35:1) and is
kept. Minimum white contrast along the whole ramp: 3.00:1. Not applied: darkening both ends to
4.5:1 (`#c75300` → `#e32e00`) or a dark label on the untouched gradient; both remain in the
conversation record if the label ever drops below large-text size.

<!-- Contrast guarantee assumes the gradient is interpolated in sRGB (CSS default for
     linear-gradient). Relative luminance is convex in sRGB channel values, so no intermediate
     colour can be lighter than the lighter endpoint. If this gradient is ever rewritten with
     `in oklch`, `in oklab`, `in lab` or any non-sRGB interpolation space, the midpoints can be
     lighter than both endpoints and the ratio must be re-checked along the whole ramp. -->

Note for the type scale: this Call button label (~27 px Bold) is larger than the `button` token
(22 px, from the Home "Book your appoinment" button). It is a second button size and should be
confirmed in Canva alongside the pending weight measurements.

**Why two accent tokens (decided 2026-09-14).** `#ed1941` measures 4.36:1 on white and 3.81:1 on
the pale card gradient. That passes WCAG for large bold headlines (3:1) but fails for normal-size
text (4.5:1). The design's own link colour `#d13a32` also failed on the cards (4.20:1), so the
mock never met the standard there. Small-text uses therefore get `accent-dark` `#be1234`, chosen
over `#c81437` (5.08:1 on the card but only 4.34:1 on the deeper tint) because it clears 4.5:1 on
every background measured. Rule for components: text below 24 px regular / 18.66 px bold in the
accent hue uses `accent-dark`; headlines keep `accent`.

### Kept as an asset, not tokenised

The Find a Doctor location pin uses `#f12200` (body) and `#9e1600` (shadow). Both are
`<path>` elements in `Find a Doctor.svg` (8 of each, one per doctor card), so the pin will be
**lifted as vector** straight from the source SVG, not extracted as a PNG. Its two colours stay
baked into that asset and are not palette tokens.

### Dropped entirely

These four occur exactly once on each page that contains a Book a Consultation form and are
the pasted Google reCAPTCHA badge, not design colours: `#4285f4`, `#1c3aa9`, `#ababab`,
`#d9d9d9`.

### Card gradients (Home "How we care" cards; from the card PNGs, reduced to 2 stops)

| Token | Value | Note |
|---|---|---|
| `card-orange` | `linear-gradient(135deg, #e77500 0%, #ff4b1d 50%)` | **Darkened for contrast (2026-09-15).** Title white (3.02:1 min), subtitle and chip text `grey-800` (5.2:1 / 7.79:1). The PNG starts at `#ff982e` (white text 2.15:1); the start was lowered at the same 30° hue to `#e77500` so the white 32 px Bold title clears 3:1 along the whole ramp (min 3.02:1). ΔE 13.2 at the light corner, end unchanged. |
| `card-blue` | `linear-gradient(135deg, #d4e3ff 0%, #ffffff 100%)` | as sampled |
| `chip-salmon` | `#ff8e7a` with **`grey-800` text** (7.79:1) | white text on it was 2.23:1; navy (4.52:1) was a visibly different dark tone from the grey-800 subtitle (ΔE 43.7), so both use grey-800 |
| `chip-cream` | `#fffbf4` with `black` text | as sampled |

### Gradients (from DESIGN-SPEC.md §5.4)

| Use | From | To |
|---|---|---|
| Page / hero background | near-white `rgb(99.8%, 99.9%, 100%)` | pale blue `rgb(89.0%, 94.9%, 100%)` |
| Card background (76 uses) | near-white | blue `rgb(47.8%, 67.8%, 85.1%)` |
| Find a Doctor cards (50 uses) | near-white | rose `rgb(85.1%, 47.8%, 63.5%)` |

## Type

Full table with weights, verification and corrections in `design/type-scale.md`. Summary:

| Token | px | Weight | Colour note |
|---|---|---|---|
| display-lg | 58 | 700 (verified) | opsz 96 pinned |
| display-md | 53 | 700 (verified) | opsz 96 pinned |
| heading-sm | 32 | 700 (check vs 800 in build) | |
| button-lg | 27 | 700 (check vs 800 in build) | white on `cta` gradient, 3.01:1 min; opsz 96 pinned |
| title | 24 | 600 | |
| button | 22 | 500, step to 600 if lighter than mock | |
| footer-phone | 22 | 400 | |
| body | 21 | 400 | |
| eyebrow | 19 | 300, uppercase, letter-spacing 0.12em (standardised; one label in the mock was 0.075em) | `grey-600 #4d4d4d`; **flag: Light at 19 px** |
| body-sm | 16 | 300 | **flag: Light at 16 px** |
| body-sm-regular | 16 | 400, line-height 19 ⚠ estimated weight (section 3 descriptions) | |
| footer-heading | 16 | 400 | |
| quote | 13 | 400 upright, `font-synthesis: none` | |
| link | 13 | 400 | **`accent-dark #be1234`** |
| footer-link | 13 | 400 | |
| nav | 13 | 500 (raised from 12) | |
| caption | 13 | 400 (raised from 10.7); line-height 14 px ⚠ estimated (hero build) | |
| stat-value | 28 | Lora 400 (face identified; size ⚠ estimated) | |

Line-height: not specified. Letter-spacing: eyebrow 0.12em measured from render; others not specified.

## Spacing

Not specified. The SVGs carry no spacing system; values will be measured per component.

## Radius

Not specified by any guideline. The SVGs contain no `rx`/`ry`; every rounded corner is a path arc
or a rounded clip, measured per component. Tokens so far (all ⚠ estimated from the render):

| Token | Value | First used |
|---|---|---|
| `radius-pill` | 9999px (fully rounded: hero button 32.4 on 64.8, pill 16.4 on 32.8) | hero button, hero pill |
| `radius-card-sm` | 10px | hero stat blocks (corner-profile scan said 5, visual comparison ~10) |

## Logo rules, minimum sizes, accessibility

Not specified. The only accessibility rule in force is our own 13 px minimum text size.
