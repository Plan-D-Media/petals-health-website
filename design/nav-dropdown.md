# Primary-nav dropdown — behaviour and values (demo stage, 2026-09-16)

Wired to **Treatments only** until the behaviour is approved. Component: `app/src/components/NavMenu.jsx` + `.css`;
state (which menu is open) lives in `Header.jsx`. Captures: `design/render/menu/` — `menu_states_sheet.png` (18 states
plus the mock), `menu_behaviour.gif`, `menu_kbd_tail.png`. Driver: `node app/tools/menu-demo.mjs` (puppeteer-core on the
installed Chrome, dist served on 4173).

## Values from the mock (`design/svg/8.svg`, px at 1366)

| Element | Mock | Built |
|---|---|---|
| Open tab | orange-500 rect 494.8–620.1 × 107.1–140.6 (full bar height), label + chevron navy | `.nav__item--open`: orange-500 fill, blue-900 text, chevron flips 180° (220 ms) |
| Current-page tab while a menu is open | "Home" loses its orange (navy text on navy in the mock) | `.nav--menu-open .nav__item--active`: white on navy, the plain item state — one orange at a time |
| Panel | 188.8 × 323 raster at (494.2, 140.6): hangs from the bar, left edge = tab left; white → #f3efe7 → #e7dfcf | white → cream-100 gradient (no new colours), `--shadow-menu` (blue-900 18 %), no gap, no radius |
| Rows | 32 one-line / 48 two-line; text left inset 18.5 | padding 8 / 12 / 8 / 18.5, line 16, min-height 32 |
| Row text | navy #00427e, cap 9.9 → 14 px, semi-bold | 14 / 600 blue-900 |
| Separators | 1 px light-blue gradient strokes, fading at both ends, inset 3–7 | 1 px blue-200 at 45 % alpha, fading over the outer 4 % |
| Highlighted row | full-width orange-500 (row 1 in the mock) | hover: orange-500 row; keyboard focus: orange-500 row + 2 px inset blue-900 ring |
| Items | 9: Womans Care, Child Care, Fertility Care, Cosmetice Gynaecology & Aesthetics, Dentistry, Multispecialty Clinic, Yoga & Welness, Pain Management & Rejuvination, Audiology | same order; spellings corrected (Women's, Cosmetic, Wellness, Rejuvenation) — flagged |

## Behaviour

| Input | Result |
|---|---|
| Pointer enters the tab | opens immediately; tab goes orange, Home tab drops to plain |
| Pointer leaves tab + panel | closes after a 200 ms grace (diagonal move into the panel survives) |
| Click / tap on the tab | toggles (touch and click users); focus stays on the tab |
| Click / tap outside | closes |
| Enter, Space, ArrowDown on the tab | opens and focuses row 1 |
| ArrowUp on the tab | opens and focuses the last row |
| ArrowDown / ArrowUp in the panel | next / previous row, wrapping |
| Home / End | first / last row |
| ArrowLeft / ArrowRight | moves focus to the neighbouring top-level item; if the menu was open and the neighbour has one, that one opens instead |
| Escape | closes; focus returns to the tab |
| Tab | closes; focus continues in document order |
| Focus leaves the entry by any route | closes |
| `prefers-reduced-motion` | no fade/slide, no chevron rotation |

ARIA: the trigger is a `<button aria-haspopup="true" aria-expanded aria-controls>`; the panel is a `<ul aria-label="Treatments">`
of plain links (tabindex −1 while closed, so they are not in the Tab order when hidden). Panel opacity/visibility
transition 150 ms; `visibility: hidden` while closed keeps the links unfocusable.

## Open questions before wiring the rest

1. The brief says six of the eight items have menus and Treatments has ten children. The mock shows chevrons on
   Clinics, Treatments and For Patients only, and nine Treatments children. Which items get menus, and what is the
   tenth Treatments child (Petals IVF as a separate entry from Fertility Care?)
2. Menu contents for the other items (Clinics, For Patients, and whichever of About us / Diagnostic Services /
   Petals Clinic in Bangladesh are meant to have one) — no mock exists for these.
