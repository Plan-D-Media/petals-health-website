# Petals Health — Type Scale (approved 2026-09-14)

Layout width **1366 px**. Family **Bricolage Grotesque** for everything except the two
exceptions in §4 and §5. No brand guideline exists; the Canva design is the source of truth.
Sizes come from the Canva measurement pass (points × 4/3, see §1). Weights come from Canva's
inspector, with the five "B-toggle" elements verified against the render (§2).

## 1. Units (decided, do not re-open)

Canva reports type in **points**; CSS px = Canva × 4/3 at the 1366 canvas. Verified on five
Home-page elements by back-computing size from x-height on the 1366-wide render (Bricolage
x-height 0.525 em): H1 39.4 → 52.5 predicted / 53.3 measured; H2 43.3 → 57.7 / 57.1; sub-line
24 → 32.0 / 30.5; body 15.8 → 21.1 / 21.0; nav 9 → 12.0 / 11.4. The SVG viewBox (1024.5 =
1366 × 0.75) confirms the file unit is the point. Geometry maps 1:1; only type needs × 4/3.

## 2. The scale

Key — **Weight (Canva)**: the weight named in Canva's inspector. **B**: Canva's bold toggle was
on. **Build weight**: what to set first. **Verified**: what the render measurement says.

| Token | Element | Canva pt | Weight (Canva) | B | **CSS px** | **Build weight** | Verified against render | Notes |
|---|---|---|---|---|---|---|---|---|
| `display-lg` | Section H2 | 43.3 | Bold | yes | **58** | **700** | Stems 8 px = Bold (8); ExtraBold predicts 10–11. Width 940 px vs Bold 948 / ExtraBold 975. **No step-up.** | |
| `display-md` | Hero H1 | 39.4 | Bold | yes | **53** | **700** | Stems 7 px = Bold (8, minus AA); ExtraBold 9. Width 301 vs Bold 310 / ExtraBold 318. **No step-up.** | |
| `heading-sm` | Card title | 24 | Bold | yes | **32** | **700** | Stems 5 px = Bold (5) = ExtraBold (5); width 208 vs Bold 200 / ExtraBold 203. Measurement cannot separate 700 from 800 at this size. Build 700, **visual check**. | opsz **auto** — width fits opsz 32 (−7) and opsz 96 (+8) equally, so not pinned |
| `button-lg` | Large CTA "Call 9147 405 955" | 20 | Bold | yes | **27** | **700** | Stems 4 px = Bold = ExtraBold. At 26.67 px and opsz 96 the width (214) and height (19) match the render exactly; at opsz 27 they are 13 px and 1 px off. 700 vs 800 differ by 1 px — build 700, **visual check**. | white on `cta` gradient; opsz **96 pinned** |
| `title` | Doctor name | 17.9 | SemiBold | no | **24** | 600 | not B-flagged | |
| `button` | Button "Book your appoinment" | 16.9 | Medium | yes | **22** | **700** (Medium + B = Bold, see rule below) | Label 248 px wide, 20 px tall on render. At 22.5 px the three candidates predict 244 / 241 / 248 (500 / 600 / 700) — a 7 px spread, within noise; stems too small to read. **Cannot verify by measurement.** Build 500; the B toggle means it will very likely look lighter than the mock, so expect 600. Record the outcome. | |
| `footer-phone` | Footer phone number | 16.6 | Regular | no | **22** | 400 | | |
| `body` | Body paragraph | 15.8 | Regular | no | **21** | 400 | | |
| `stat-value` | Stat block numbers "100+", "4.8" | not measured in Canva | — | — | **28** | **Lora 400** | Face identified 2026-09-15 by outline comparison against Bricolage 300/400/500, Lora and Playfair: the design's footed "1", open "4" and moderate-contrast "8" match **Lora** (see `design/render/digits_compare.png`). Size ⚠ ESTIMATED: Lora 400 at 28 px sets "100+" 58 px wide vs 57 in the mock; 29 px gives 61. No opsz axis. | promoted 2026-09-15 |
| `label-lg` | Pill "3 Clinics in Kolkata" | 13.2 (first pass) | — | — | **18** | **500** | ⚠ ESTIMATED weight (hero build; render reads medium) | promoted 2026-09-15 |
| `eyebrow` | "PATIENT STORIES" etc. | 14 | Light | no | **19** | 300 | | uppercase; `letter-spacing: 0.12em` (§3); colour `grey-600 #4d4d4d` (sampled `#4a4a4a`, ΔE 1.3, folded in); **flag: Light at 19 px, review once built** |
| `body-sm-regular` | Step descriptions ("From search to care") | not in Canva pass | — | — | **16** | **400**, line-height 19 | ⚠ ESTIMATED weight (stem 1 px: Light 1.2 / Regular 1.5; render reads regular); line pitch 19 measured | promoted 2026-09-15 |
| `body-sm` | Card body | 12 | Light | no | **16** | 300 | | **flag: Light at 16 px, review once built** |
| `footer-heading` | Footer column heading | 11.7 | Regular | no | **16** | 400 | | |
| `quote` | Testimonial quote | 10 | Italic (Canva Sans) | no | **13** | 400 **upright** | | italic not reproduced — neither family ships an italic face; no synthetic oblique (§4) |
| `link` | "Learn more →" | 10 | Regular | no | **13** | 400 | | colour **`accent-dark #be1234`** (small text) |
| `footer-link` | Footer link | 9.8 | Regular | no | **13** | 400 | | |
| `nav` | Nav links | 9 | Medium | no | **13** | 500 | | **raised from 12** (readability floor) |
| `caption` | Doctor card role | 8 | Regular | no | **13** | 400 | | **raised from 10.7** (readability floor). Line-height **14 px** ⚠ ESTIMATED (hero: keeps two-line stat labels inside a 92 px block) |

Readability floor 13 px: only nav (12.0 → 13) and doctor role (10.67 → 13) are corrections
in this table. (Footer text and stat label from the first pass were also raised; they are
not in the Canva pass and are listed in §7.)

### Synthetic-bold verification summary

| Element | Needed a step-up? |
|---|---|
| Section H2 | No — Bold 700 matches |
| Hero H1 | No — Bold 700 matches |
| Card title | Not by measurement; 700 vs 800 indistinguishable at 32 px — check in build |
| Large CTA | Not by measurement; 700 vs 800 indistinguishable at 27 px — check in build |
| Button | **Yes → 700.** Built at Medium 500 the label measured 233 px wide vs 247 px in the mock; at 600 it was still 9 px short; Bold 700 predicts 248 px, an exact match. **Rule (2026-09-15): a Canva reading of "Medium + B" means Bold 700** — the toggle switched to the family's Bold face, it did not synthesise. No other element was stepped to 600 on that basis (doctor name is SemiBold 600 from Canva's inspector with no B toggle, so it stands). |

### Optical size (unified 2026-09-15 — automatic)

Bricolage Grotesque has an `opsz` axis (12–96). Canva rendered the Home headings at three different
optical sizes — hero and family-care H2 at 96, process / testimonial / insights H2 at 12, the
specialists H2 at automatic — which is rendering drift, not intent. Widths of each heading set at
each candidate, against the design:

| Heading | Design width | opsz 12 | opsz 96 | automatic (opsz = px) |
|---|---|---|---|---|
| Hero H1 "Caring for All," (53) | 301 | +15.9 % | **+3.0 %** | +10.0 % |
| Family-care H2 (58) | 940.8 | +13.9 % | **+0.8 %** | +7.1 % |
| Process H2 (58) | 630.2 | **−0.8 %** | −10.7 % | −5.3 % |
| Testimonials H2 (58) | 624.8 | **−1.1 %** | −10.9 % | −5.9 % |
| Specialists H2 (64) | 623 | +2.7 % | −5.8 % | **−2.2 %** |
| Health-card H2 (53) | 459.7 | +14.6 % | **+1.6 %** | +9.4 % |
| Insights H2 (58) | 669.5 | **−1.0 %** | −10.1 % | −5.2 % |
| Card title (32) | 208 | +5.3 % | −3.8 % | **+3.4 %** |
| Doctor name (24/600) | 189.3 | +11.5 % | **+4.6 %** | +8.8 % |
| Article topic (24/600) | 168.7 | **−1.6 %** | −11.7 % | −4.0 % |
| **Closest-match count** | | 4 | 4 | 2 |
| **Sum of absolute error** | | 68.5 % | 62.8 % | **61.2 %** |
| **Worst single heading** | | 15.9 % | 11.7 % | **10.0 %** |

opsz 12 and 96 tie on matches; automatic has the lowest total error and is the only setting that
keeps every heading within 10 % of the mock, whereas either pin leaves three headings 11–16 % off.
**Decision: all display and heading tokens use automatic optical sizing** (`font-optical-sizing:
auto`, no `font-variation-settings`); the two pin variables are reset to `normal`. Width cost per
heading is the "automatic" column; each is encoded as an intended deviation in `tools/compare.py`.
No heading is far enough off to warrant a separate setting. The health-card lead and bullets are
body copy, not heading tokens, and stay at opsz 96 where their measures were matched.

Serve `fonts/BricolageGrotesque-Variable.woff2`; the static opsz-12 WOFF2 files remain fallback only.

## 3. Eyebrow letter-spacing (measured from the render, not read from source)

Ink widths on the Home render, versus the natural width of the same string set in Bricolage
Light at 19 px, divided over the character gaps:

| Label | Render ink width | Tracking if opsz auto (19) | Tracking if opsz 96 |
|---|---|---|---|
| SIMPLE PROCESS | 185 px | 2.31 px = 0.121 em | 3.62 px = 0.190 em |
| PATIENT STORIES | 188 px | 2.57 px = 0.135 em | 3.79 px = 0.199 em |
| OUR SPECIALISTS | 176 px | 1.43 px = 0.075 em | 2.79 px = 0.147 em |

**Decision (2026-09-14): `letter-spacing: 0.12em` on all three, with automatic optical sizing.**
The third label is measurably tighter in the mock (0.075 em, 12 px narrower for the same
character count). This is a **deliberate deviation**: the mock is internally inconsistent and
we are making the labels consistent rather than reproducing the inconsistency. Cap height
measured 12–13 px on all three, confirming 19 px. Colour sampled `#4a4a4a`, which is 1.3 ΔE
from the existing `grey-600 #4d4d4d` (below the ~2.3 just-noticeable threshold), so the eyebrow
uses `grey-600`; no new token.

## 4. Testimonial quote: Canva Sans Italic cannot be used

Canva Sans is licensed for use inside Canva only. The substitution target, Bricolage
Grotesque Italic, **does not exist**: none of the 113 Bricolage files or 5 Hind files has an
italic or oblique face, and the variable font has no `ital` or `slnt` axis (axes: opsz, wght,
wdth). **Decision (2026-09-14): the quote is set upright in Bricolage Regular 13 px, `font-style: normal`,
with `font-synthesis: none` so no browser fakes a slant.** The design's italic could not be
reproduced because neither Bricolage Grotesque nor Hind ships an italic face. The large blue
quotation glyph carries the "quote" signal. Options that were considered:

1. **Set the quote upright** in Bricolage Regular 13 px — **chosen**.
2. Declare the synthetic oblique explicitly (`font-style: italic; font-synthesis: style`) and
   accept a mechanically slanted Bricolage.
3. Add a third, OFL-licensed family with a true italic for quotes only (e.g. an italic from
   Google Fonts). Adds a font load for one 13 px style.

## 5. Other document fonts: Lora and The Seasons

All 15 page renders were reviewed for non-Bricolage text.

**Lora** (SIL OFL, Google Fonts) — **used**: the stat-block numbers "100+" and "4.8" on the Home
hero. Identified 2026-09-15 by rendering the design crop beside Bricolage 300/400/500, Lora 400
and Playfair 400 (`design/render/digits_compare.png`): the footed "1", the open "4" and the
moderate-contrast "8" match Lora and nothing else. The earlier "Lora unused" finding was wrong.
Served as `fonts/Lora-Variable.woff2` (wght 400–700, 82 KB); token `stat-value` = Lora 400 / 28 px.

**The Seasons** (commercial, Latinotype; Canva-licence only) — the monogram initials in the avatar
circles. Cannot be served. **Replaced by Playfair Display 400** (approved 2026-09-14; 24 px on
testimonial discs, 28 px on doctor cards), `fonts/PlayfairDisplay-Variable.woff2`.

**Audit closure (2026-09-15).** After the Lora find, every glyph outline on all 15 page SVGs was
rasterised the same way as the font glyphs and scored by intersection-over-union against
Bricolage Light/Regular/Bold, Lora 400/700 and Playfair 400. Calibration separates cleanly: the
known Lora digits score 0.92–0.97 against Lora and 0.48–0.62 against Bricolage; known Bricolage
lines score 0.86–0.96 against Bricolage and 0.67–0.73 against Lora. Of 3,028 text lines scanned,
**four** classify as Lora: "100+" and "4.8" on the Home hero, and the same two on the Treatments
dropdown mock (`8.svg`), which repeats the hero. Nothing else on any page is Lora. The monogram
initials scored equally against all three references (The Seasons is none of them), as expected.
Script kept at `design/render/` outputs only; no other non-Bricolage text exists.

## 6. Font files the scale needs

| Weight | Used by |
|---|---|
| 300 Light | eyebrow, card body |
| 400 Regular | body, footer phone/heading/link, quote, link, doctor role |
| 500 Medium | button (first build), nav |
| 600 SemiBold | doctor name; button if stepped up |
| 700 Bold | H2, H1, card title, large CTA |
| 800 ExtraBold | only if the card title or CTA is stepped up after visual check |

All are in `fonts/BricolageGrotesque-Variable.woff2` already. No italic exists (§4).

## 7. First-pass measurements not in the Canva pass

These Home-page values were measured in the first pass without weight data and are kept for
reference; they are not tokens until confirmed:

| Element | Canva | CSS px |
|---|---|---|
| Testimonial section heading | 45.8 | 61 |
| Light line above heading | 24 | 32 |
| Section sub-line | 24 | 32 |
| Pill "3 Clinics in Kolkata" | 13.2 | 18 — **promoted to `label-lg` 18 px / 500** (weight ⚠ ESTIMATED in the hero build; render reads medium) |
| Utility links (top bar) | 10 | 13 |
| Footer text | 8.9 | 13 (raised from 11.9) |
| Stat label | 8.4 | 13 (raised from 11.2) |

## 8. Not covered

Line-height and paragraph spacing: unknown, needs measuring. Sizes on pages other than Home
beyond the large CTA: unknown.
