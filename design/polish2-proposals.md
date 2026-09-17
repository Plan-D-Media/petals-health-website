# Polish pass 2 — audit items 1–3, built for review (2026-09-17)

Scoped to `html[data-polish2]` in `app/src/styles/polish2.css`; toggle with `?polish2=1`. CSS only: no images, no
script, nothing on the scroll path. No new colours (blue-900 / white at alpha), no new fonts, no type-scale change.
Sheets: `design/render/audit/polish2_sheet_1366.png`, `polish2_sheet_1920.png` (current left, polish 2 right, full
page), `polish2_details_1366.png` (the four changed areas at 1:1, current above polish 2).

## 1 · Soft band seams
| Band | Current | Polish 2 |
|---|---|---|
| Hero | pale radial ground ends on a straight line at the band bottom | the same ground, plus a white fade over its last 120 px, layered into the element background so the watermark and content cross the seam untouched |
| Specialists | pale rectangle with hard top and bottom | same tint, 80 px soft top and bottom |

## 2 · Rhythm and the article cards
- Process band becomes a soft tint band (the specialists band's own gradient) so the page alternates white / tint /
  white / tint / white down to the health card. First cut painted the tint on the band itself, which cut the care
  section's watermark petal with a straight edge at 1920 (`design/render/audit/petal_process_1920.png`) — worse than
  the seam it replaced. Fixed: the tint is a `::before` layer at z-index −1 (beneath every positioned sibling, so the
  petal paints over it) with the body background made transparent under the flag (the html canvas stays white; body's
  own white would otherwise cover a negative layer). Verified at 1:1: `petal_process_1920_fixed.png`.
- Article card, same box and copy: topic as the existing cream chip (chip token 16/300), title (body-md) in the
  middle, date and read time anchored to the bottom above a 1 px blue-900 10 % hairline; outline softened from
  1.5 px solid navy to 1 px at 30 %, rest shadow added. The headline becomes the dominant line; the topic reads as a
  category, which is what it is.

## 3 · One rest edge for cards on white
Pale family cards and hero stat tiles: rest hairline shadow + 1 px blue-900 8 % ring (`--ring-card`). Article cards
take the same ring on their chip. Hover states unchanged.

## Deviations (logged, not regressions)
| Element | Change vs mock | Reason |
|---|---|---|
| Article meta line | moves from card y 188 to the card bottom (≈ y 191–195 depending on line count); chip replaces the 24/600 topic | audit item 2 — hollow cards; logged in compare.py when applied |
| Article outline | 1.5 px blue-900 → 1 px blue-900 30 % | item 3 — one card language |
| Process band ground | white → soft tint | item 2 — rhythm |
| Hero / specialists band edges | hard → soft | item 1 |
| Process step 2 | filled purple → ring (production, not behind the flag) | decision 2026-09-17: a solid circle reads as a selection with nothing selected (design/decisions.md; client note) |

Drift after the step change (production build): unchanged — hero 5, care 5, process 5, stories 7, specialists 8,
health card 3, insights 7, footer 12 px max.

## Not built
- Entrance / scroll motion: decided against (design/decisions.md).
- Health-card photo breaking the panel edge: not in the top five.

## If approved
Fold `polish2.css` into the component styles and tokens (`--ring-card`, `--rule-card`, `--outline-card`,
`--band-soft`, `--band-fade`), add the article-meta and outline deviations to compare.py, re-run, commit.
