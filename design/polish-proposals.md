# Polish proposals — 2026-09-15 (nothing applied to production)

Every proposal lives in `app/src/styles/polish.css`, scoped to `html[data-polish]`, and is switched on with `?polish=1`.
The production render is pixel-identical to the last compare run (baseline diff bbox: none after the nav markup reorder).
Constraints held: no new colours (every shadow/ring/tint is an existing token at an alpha), no new fonts, display and heading
sizes untouched. Renders: `design/render/polish/` — `sheet_hero.png`, `sheet_nav.png`, `sheet_cards.png`,
`sheet_states_buttons.png`, `sheet_1920_hero.png`; full pages `base_1366.png`, `polish_1366.png`, `polish_1920.png`.

## 1 · Interaction states (tokens)

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 150 ms | colour, opacity, underline |
| `--dur` | 220 ms | transform, shadow |
| `--ease` | cubic-bezier(.2,.7,.2,1) | all |
| `--shadow-card-rest` | 0 1px 0 blue-900 @ 6 % | cards at rest (hairline foot) |
| `--shadow-card` | 0 12px 28px blue-900 @ 14 % | card hover: lift −4 px |
| `--shadow-button` | 0 4px 12px blue-900 @ 22 % | primary/secondary hover: lift −1 px |
| `--shadow-pressed` | inset 0 2px 4px black @ 18 % | pressed: +1 px, 60 ms |
| `--focus-ring` | blue-900, 2 px, offset 3 px | light bands (8.9:1 on white) |
| `--focus-ring-on-dark` | orange-500, 2 px, offset 3 px | nav, footer, health-card panel, hero CTA (6.7:1 on navy) |

Behaviour: nav items grow a 2 px orange underline (the active tab's colour) on hover/focus, text colour unchanged; utility
and footer links reveal a 1.5 px underline in their own colour; chips lift 1 px; `prefers-reduced-motion` collapses all
durations. Shadows are blue-900 alpha so depth reads brand-tinted on the pale-blue bands rather than grey.

## 2 · Secondary button ("Explore Treatment", "Book Consultation", "View all", "Read more")

Current: white → cream vertical gradient, no edge. On the pale-blue cards it dissolves into the card.

| Option | Treatment | Reads as |
|---|---|---|
| A | 1.5 px blue-900 at 30 % | outlined; crisp but cool against the cream fill |
| **B (recommended)** | 1 px blue-900 at 12 % ring + 2 px/6 px blue-900 16 % shadow + gradient foot warmed to orange-500 at 18 % | a soft physical tab; sits on both the pale and the orange card |
| C | 1.5 px orange-500 ring + soft shadow | strongest; competes with the orange card and the active nav tab |

B is what the on-page proposal uses (family cards, both card colours: `sheet_cards.png`).

## 3 · Spacing scale (derived from the ink gaps measured in the baseline render)

Measured vertical gaps, ink to ink, page px at 1366:

| Gap | Hero | Care | Process | Stories | Specialists | Insights |
|---|---|---|---|---|---|---|
| eyebrow → H2 | – | 14 | 16 | 24 | 19 | 22 |
| H2 → sub-line | – | 22 | – | – | 9 | 32 |
| sub-line (or H2) → content | – | 52 | 52 | 55 | 47 | 38 |
| content → section button | – | – | – | – | 46 | 37 |
| content/button → next section's first element | – | 72 | 86 | 57 | 85 | 46 (footer) |
| paragraph → button / button → stats | 78 / 95 | | | | | |

Values cluster at ~16, ~24, ~48 and ~80 with hand-placement noise of ±8. Proposed scale (8-based, every value already in use
or the midpoint of a cluster): **4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128**.

Roles: eyebrow → H2 **16**; H2 → sub-line **24**; sub-line/H2 → content **48**; content → section button **48**;
content or button → next section **80**; hero paragraph → button **48**, button → stats **48**; inside cards title → text
**8**, text → chips **24**, chip rows **12**.

Per-section shifts if applied (px, + moves later content down):

| Section | eyebrow→H2 | H2→sub | sub→content | content→button | →next section | net |
|---|---|---|---|---|---|---|
| Hero | – | – | 78→48 (−30) | – | 95→48 (−47) | stats rise 77 (shown in `sheet_hero.png`) |
| Care | 14→16 (+2) | 22→24 (+2) | 52→48 (−4) | – | 72→80 (+8) | +8 |
| Process | 16 | – | 52→48 (−4) | – | 86→80 (−6) | −10 |
| Stories | 24→16 (−8) | – | 55→48 (−7) | – | 57→80 (+23) | +8 |
| Specialists | 19→16 (−3) | 9→24 (+15) | 47→48 (+1) | 46→48 (+2) | 85→80 (−5) | +10 |
| Health card | – | – | – | – | 70→80 (+10) | +10 |
| Insights | 22→16 (−6) | 32→24 (−8) | 38→48 (+10) | 37→48 (+11) | 46→80 (+34) | +41 |

Page grows ≈ 67 px. The two visible fixes are the specialists sub-line (9 px under its heading today) and the
insights → footer gap (46, half of every other section break). Horizontal card gaps stay as regularised per section
(they are width-constrained). Not rendered yet: applying it means moving every absolute top in seven components, so it is
table-only until approved.

## 4 · Hero composition (`sheet_hero.png`, `sheet_1920_hero.png`)

Current: the CTA floats 78 px under the paragraph and the stat tiles sit at the bottom-right corner of the band, 95 px
under the button and outside the text column. Proposed: button 48 under the paragraph, stat tiles 48 under the button
with their left edge on the button's left edge, 16 px between tiles. The text column becomes one stack (headline,
paragraph, action, proof) and the photo/watermark corner stays clear. Holds at 1920: the column stays inside the centred
1366 container.

## 5 · Nav aligned to the content container (`sheet_nav.png`)

Current: logo at 201.6, Home tab at 261.3, nav labels at hand-placed lefts (13–18 px gaps), utility group ending at 1066.
Proposed: logo and Home tab on the 95 px container edge (the health-card panel, testimonial and article edges); utility
group shifted so "Ask a Doctor" ends at 1271; the nav is a flex row with 15 px either side of each separator and the
chevron 6 px after its label. This required a markup reorder in `Header.jsx` (items, chevrons, separators in flow order);
production geometry is unchanged, the flex layout only applies under the flag.

## 6 · Family-card alignment (`sheet_cards.png`)

Subtitles are one or two lines, so the chip blocks started at three different y's. Proposed: subtitle reserves two lines
(min-height 36), chips start at card y 162 on all three, buttons stay on one baseline (329.9). Combined with option B the
three buttons now read as one row.

## 7 · Small-text hierarchy (`sheet_states_buttons.png`, bottom)

| Level | Size / weight | Where |
|---|---|---|
| nav | 15 / 500 | primary nav |
| utility & footer links | 14 / 400 | utility bar, footer columns |
| meta | 14 / 400 | article dates, doctor roles |
| caption | 13 / 400 | badges, labels, copyright, footer about |

Nothing below 13. Nav at 15 is what forced the flex row in §5: the 13 px absolute slots no longer fit.

## Decisions needed

1. Interaction tokens as listed — yes / adjust durations or shadow strength.
2. Secondary button: A, B or C.
3. Spacing scale and role table — approve to render (then compare.py re-run at 1366 and 1920).
4. Hero: proposed stack, or keep the stats bottom-right with only the 48/48 rhythm.
5. Nav: approve container alignment + flex row.
6. Family cards: approve.
7. Small-text levels: approve.
