# Mobile and tablet — proposed approach for Home (2026-09-17, before build)

No mobile frames exist in the Canva file; this is our interpretation. Static mocks with real copy and tokens:
`design/mocks/mobile/mobile_tablet_sheet.png` (390 and 768 full page, side by side), `mobile_390_first_viewport.png`.

## Breakpoints

| Range | Name | Layout |
|---|---|---|
| ≥ 1366 | desktop | as built: the 1366 composition, centred, full-bleed bands |
| 1024–1365 | laptop | the desktop composition **scaled**, not reflowed: `zoom: calc(100vw / 1366)` on the page (1280 → 94 %, 1024 → 75 %). Today the site scrolls sideways on every 1280/1440-wide laptop because of `min-width: 1366`; this closes that gap for the cost of one rule and keeps every desktop decision intact |
| 768–1023 | tablet | reflow to two columns; sticky top bar with the utility links inline; carousels show two cards |
| < 768 | mobile | single column, designed at 390; sticky top bar + bottom action bar; carousels show one card with a peek |

Why 768 and 1024: the tablet band is where two 300 px doctor cards, two family cards and the two-column hero first
fit with 32 px margins; below it nothing sits side by side. 1024 is where the desktop artboard scaled to 75 % stops
being readable (body 21 → 15.75 px), so reflow begins there.

## Element by element (mobile / tablet)

**Header.** The utility row and the nav bar collapse into one 56 px sticky bar (64 on tablet): logo left; phone
(tel: link) and menu buttons right, 44 px targets. The menu opens a full-height drawer from the right: the utility
links (Book an Appt, Find a Doctor, Ask a Doctor) as the first group, then the nav items; items with children are
accordions (Treatments' nine links inline), with the same orange open-state and arrow/Escape behaviour as the desktop
dropdowns. On tablet the phone number, Find a Doctor and Ask a Doctor sit inline in the bar; Book Appointment is the
orange pill there.

**Hero.** Text column first at full width: paragraph, then the two buttons stacked and full width (56 px tall).
The 16:9 film card follows as a contained, full-width card — the right-edge bleed has no meaning at 390 and is
replaced, not reflowed. The proof strip stops overlapping the card (it would eat the film and collide with the play
control) and becomes a row under it: pill stretched, two 72 px tiles. On tablet: text and the two buttons in a row, then the film card full width (704 × 396), then the proof row —
two columns made the film too small to carry the page. Video: poster first, autoplay muted only when the slot is in view and `navigator.connection.saveData`
is false; the play control stays.

**Family cards.** Stacked, full width, chips wrapping; the fixed subtitle widths and no-wrap chip rows go. On
tablet: the orange card full width on top, the two pale cards side by side below (three across at 426 each does not
fit 768).

**Process.** A vertical list: 48 px ring left, title and description right; the dashed connectors go. Tablet: 2 × 2.

**Carousels (both).** One card wide with a 24 px peek of the next on mobile, two cards on tablet; arrows move below
the track into the thumb zone with dots between them; drag stays the primary gesture; autoplay off on mobile
(battery, and the card is the whole viewport width so movement is disorienting) — manual only, which also matches
reduced-motion. Testimonial card: the quote mark and stars stack above the quote.

**Doctor card.** It is not a fixed 300 × 410: at 390 the slide is 358 wide (16 px margins + peek) and the card fills
it; the top band drops to 120, the avatar to 76, and the rating row and the Book button share one line, so the card
is 330 tall. Same data, same order. Nothing is lost; the two-clinic case still shows both sessions.

**Health-card panel.** Photo first as a rectangular 4:3 crop (the hand and card), the navy panel with the copy and a
full-width button below. The luminance-masked cut-out and the decorative blobs assume a wide frame and go. Tablet:
photo | copy in two columns inside one rounded panel.

**Articles.** Stacked cards; tablet three across (they are 330 wide). **Closing band:** paragraph, stacked buttons.
**Footer:** the about text, then the six link groups as accordions (Information open by default); tablet: three
columns, no accordions. Copyright line and phone at the bottom, with 88 px of padding so the bottom bar never
covers it.

**Sticky Book Appointment.** On mobile the orange pill leaves the top bar and becomes a **bottom action bar** (64 px,
two buttons: Call now and Book Appointment), appearing after the hero, hidden while a form or the menu is open, and
sitting above the SXO bubble when that ships. Thumb zone, always visible, does not compete with content. On tablet
the pill stays in the sticky top bar as on desktop.

**Watermark petal, section seams.** The petal spans two sections in desktop geometry and is hidden below 1024. Soft
band edges stay (they are just gradients).

## Type on small screens
The desktop scale cannot survive: 64/58/53 px headings do not fit 358 px. Proposed mobile sizes, same fonts and
weights, applied below 768 (tablet takes the midpoint):

| Token | Desktop | Tablet | Mobile |
|---|---|---|---|
| display-xl | 64 | 48 | 36 |
| display-lg | 58 | 44 | 34 |
| display-md | 53 | 40 | 30 |
| heading-line / heading-sm | 32 | 28 | 26 |
| title | 24 | 24 | 22 |
| body | 21 | 20 | 19 |
| eyebrow | 19 | 16 | 14 |

This is a type-scale change and needs your sign-off. Everything else uses the existing tokens.

## What genuinely needs a different idea, not a reflow
1. Hero film bleed and the corner-overlapping proof strip → contained card + proof row.
2. Desktop dropdown panels → drawer accordions.
3. Health-card photo cut-out → rectangular crop above the panel.
4. Sticky nav CTA → bottom action bar.
5. Carousel autoplay → manual on mobile.
6. Footer's six columns → accordions.
7. The watermark petal → hidden.

## Build approach (the honest cost)
Every Home section is laid out with absolute positions inside a 1366 box. Reflow cannot be added on top of that; each
section's CSS becomes flow layout (grid/flex with the spacing scale) at all sizes, with the desktop geometry
reproduced from the same flow. That is a rewrite of the section stylesheets — about two days for Home — and it
retires compare.py's remaining mock checks (care, stories, health card, footer), since the desktop geometry will
shift by a few pixels. The laptop band (`zoom`) can ship first in an hour; tablet and mobile follow section by
section, in the same order as the desktop build, with captures at 390 and 768 for each.

## Open before building
- Type-scale sign-off (table above).
- Mobile menu contents: do Clinics and For Patients get children (same question as desktop)?
- Autoplay on mobile: proposed off; say if the client wants it on.
- Bottom bar labels: "Call now" is new copy (the hero has none for the phone). Alternative: the phone number itself.
