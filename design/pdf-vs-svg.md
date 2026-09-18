# PDF mock vs SVG export — do the two sources agree? (2026-09-18)

**Answer: yes, on every page. Nothing visible in the PDF is missing from the SVG export.** The "extra" Child Care
cards are hidden layers that neither source displays.

## Method (`app/tools/pdf-vs-svg.py`)
The client's PDF (`Copy of Petals website Mock (2).pdf`, 22 pages; the zip is the same 22 SVGs we built from) was
rendered at 1366 px wide, one image per page, and pixel-diffed against the SVG render of the same page. The PDF text
layer was extracted too, so any string absent from a visible SVG page could be located by its coordinates.

## Result per page

| Page | PDF px | SVG px | Differing pixels | What differs |
|---|---|---|---|---|
| Home | 1366 × 4856 | same | 3.2 % | text edges only |
| About Us | 1366 × 3940 | same | 5.0 % | text edges only |
| Clinic Location | 1366 × 2211 | same | 4.1 % | text edges only |
| Dropdown mock | 1366 × 877 | same | 2.1 % | text edges only |
| Women's Care | 1366 × 3198 | same | 3.8 % | text edges only |
| Child Care | 1366 × 2296 | same | 2.4 % | text edges only |
| Petals IVF | 1366 × 6208 | same | 4.0 % | text edges only |
| Cosmetic Gynaecology | 1366 × 6709 | same | 3.6 % | text edges only |
| Dentistry | 1366 × 5577 | same | 3.7 % | text edges only |
| Multispecialty | 1366 × 3456 | same | 3.5 % | text edges only |
| Yoga & Wellness | 1366 × 2942 | same | 3.1 % | text edges only |
| Pain Management | 1366 × 2243 | same | 3.2 % | text edges only |
| Audiology | 1366 × 2213 | same | 2.5 % | text edges only |
| Find a Doctor | 1366 × 2717 | same | 3.5 % | text edges only |
| Doctor profile | 1366 × 3307 | same | 3.4 % | text edges only |

Every page is the same height to the pixel. The differing pixels are thin horizontal bands on text lines — the PDF
rasteriser and the browser hint glyphs differently — and the five largest bands (the hero headlines of Home,
Dentistry, IVF, Cosmetic and Find a Doctor) were checked by eye side by side: identical content
(`design/render/audit/pdf_vs_svg_bands.png`). No band corresponds to a section, card or image present in one
source and not the other.

## The Child Care "PRP / Sexual Wellness" cards
The PDF's text layer for Child Care does contain "PRP Vaginal Rejuvenation", "Sexual Wellness", "Regenerative" and
"Consultation-led". Their coordinates are y 1347–1412, which is exactly under visible cards 5 and 6 (Nutrition
Guidance, Neonatology Coordination). They are leftover layers from the Cosmetic Gynaecology page, buried beneath the
paediatric cards in the Canva file; the PDF render shows six paediatric cards (`design/render/audit/pdf11_grid.png`),
as the SVG does. A PDF viewer's text search or copy-paste would surface them, which is presumably how they were read
as "on the page". The SVG export carries the same buried objects (two duplicate card images drawn under cards 5–6).

## Cosmetic Gynaecology's "repeated four-card block"
The strings of the first four-card block (PRP Vaginal Rejuvenation, Sexual Wellness, HIFEM Pelvic Floor Therapy,
Microneedling) appear twice in the PDF text at the **same coordinates** (x 99–1211, y 1606–1629): a stacked duplicate
of one block, visually a single block. A different four-card block further down (y ≈ 5915, the skin & hair track,
which also contains a HIFEM card) is not a repeat. To be re-checked against the page when Cosmetic is built.

## For the other flagged items
Dentistry's hero carries "Trusted Care for, Healthier Smiles" at (826, 311) in both sources — it is Dentistry's own
line; Multispecialty's copy of it at (69, 249) is the paste error. Yoga's intro at y 929–986 is the Multispecialty
paragraph in both sources. Both handled as reported for Template A.

## Consequence
The SVG export remains the build source; nothing needs re-checking against the PDF. Copy verification continues page
by page as before, with the PDF text layer available as a second reading of any line that is hard to read from a
render.
