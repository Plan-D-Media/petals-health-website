# Home page design audit — 2026-09-17

Walked the built page at 1366 and 1920 (`design/render/audit/current_1366.png`, `current_1920.png`; halves in
`walk_*.png`). Brand fixed: palette, fonts, copy, order. Constraint on every proposal: CSS only, no images, no JS on
the scroll path (healthcare lead-gen, mostly mobile).

## What already works — leave alone

- **Hero.** The polish pass fixed it: one stack (headline, copy, action, proof), the video card on the left, the pill as
  a badge. It holds at 1920 because the watermark fills the right margin.
- **The orange card** carries the family-care row. Colour does the hierarchy; it does not need elevation.
- **The health-card panel** is the page's one true elevated object, and it is the conversion element. Its masked
  photo already bleeds into the navy. It sits 60 % down, which is where the second ask should be.
- **Specialists band.** The pale gradient band and the tonal doctor cards already read as a designed section.
- **Footer.** Dense by nature; the two navies and the orange headings are enough.
- **Depth in general.** Process, stories and specialists should stay on one plane. Shadow under the step circles, the
  quote cards or the doctor cards would be noise; the page's depth budget is the hero card and the navy panel.

## Where it reads as an artboard

### 1. Hard band seams (transitions)
The hero's pale gradient stops on a straight line at 880 and white begins; the specialists band is a pale rectangle
with straight top and bottom edges; everything else is white on white. The page is stacked sheets. At 1920 the seams
run the full width, so they are the first thing the eye reads.
*Kind of transition:* not dividers, not curves — soft edges. Fade the hero ground into white over its last ~120 px and
give the specialists band a soft top and bottom (a vertical gradient into white) so the band exists as a tint, not a box.
The watermark petal already crosses the hero/care seam; softening the seam lets it do that job.

### 2. Density: the process band is a void, the insights cards are hollow (density, eye's path)
At 1920 the process section is four small circles on a white field with more white above and below; the eye drops
through it. The article cards are outlined rectangles with a title, two lines and a date, and their lower third is
empty; the page ends on its weakest section, then the footer. Family-care's two pale cards are half-empty next to a
full orange one, but that is content, not layout — leave it.
*Fix:* give the process band the same soft tint as the specialists band, so white/tint alternate down the page
(care white, process tint, stories white, specialists tint, health card white) and the void becomes rhythm. Recompose
the article card: topic as a chip at the top (the cream chip that already exists), title in the middle, date and read
time anchored to the bottom above a hairline, equal heights — the same content, but the card is full.

### 3. Card edges dissolve at 1920 (depth, the one place elevation helps)
The two pale family cards and the three article cards are the only cards on white. The family cards are a pale-blue
gradient on white: at 1920 their edges nearly vanish and they float. The article cards use a 1.5 px navy outline,
which is the mock's, but it is the only outlined object on the page apart from the quote cards, so two adjacent card
languages compete. The hero stat tiles are flat gradient boxes beside an elevated card and a shadowed button.
*Fix:* one rest treatment for cards on white — the existing hairline rest shadow plus a 1 px blue-900 ring at 8 %
alpha — on the pale family cards and the stat tiles; the article card keeps its outline but softens it to the same
ring so the two card families agree. No new colours: alpha of blue-900.

### 4. Motion — my view: no entrance animation
The hero already moves. A medical lead-gen page needs to feel steady and load-and-read; scroll reveals delay content,
misfire on mobile, need reduced-motion handling and add JS to the scroll path. What would earn its place is far
smaller: the hover states already built, and a 300 ms fade on the article-card chip. Do not build entrance
choreography. If the client insists later, limit it to the three card rows, once, 12 px rise, 240 ms, reduced-motion off.

### 5. Eye's path: step 2 is filled and nothing else is
The process diagram's second circle is solid purple. It is the mock's "current step" styling, but on a static page it
reads as a selection with no meaning, and it is the only accent between the orange card and the quote cards, so the
eye stalls on it and asks why. Either every step is a ring (diagram) or step 1 is filled (start here). This is a
content decision, so I am flagging it rather than changing it. Same family: the identical centred eyebrow/H2/sub-line
stack heads five sections in a row; it is correct to the mock and changing alignment is out of bounds, so the
rhythm has to come from the bands (item 1–2), not the headings.

## Imagery
The page has less photography than it looks: the hero (now a card), the health-card photo (already masked into the
navy), and monogram discs on the doctor cards. Nothing sits in a plain rectangle any more. Better treatment inside
the brand would be letting the health-card photo break the panel's top edge, but the source has 69 px above the clip
and it is unknown what is in it; medium cost, uncertain gain — not in the top five.

## Ranking (improvement ÷ cost)

| # | Item | Cost | Improvement | Build now? |
|---|---|---|---|---|
| 1 | Soft band seams: hero ground fades out, specialists (and process) as soft tint bands | CSS, ~20 lines, no JS | High — removes the stacked-sheet read at both widths | Yes |
| 2 | Article card recomposition + tint rhythm for the process void | CSS in one component, ~30 lines | High at 1920, medium at 1366 | Yes |
| 3 | One rest edge for cards on white (pale family cards, stat tiles, article ring) | CSS, ~10 lines | Medium, quiet | Yes |
| 4 | Entrance motion | JS + a11y + mobile risk | Low, possibly negative | No |
| 5 | Step-2 fill | Content decision | Medium once decided | Decide |

Items 1–3 go behind `?polish2=1`, side by side with current, at 1366 and 1920. Drift: items 1–2 move nothing; item 2
moves the article date to the card bottom (logged as a deviation); item 3 changes nothing measurable.
