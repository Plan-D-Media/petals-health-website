# Design decisions log

Settled choices that apply to every page. Do not reopen on later pages; add a dated entry if one is revised.

| Date | Decision | Reasoning | Where |
|---|---|---|---|
| 2026-09-15 | Layout width 1366; Canva pt × 4/3 = CSS px; 13 px readability floor | measured against the export; four sub-13 labels raised | DESIGN-SPEC.md §3, type-scale.md |
| 2026-09-15 | Mock is hand-placed: uneven gaps and tops are drift — regularise by default, log as deviations; ask only when meaning changes | consistency over fidelity to placement noise | polish-proposals.md |
| 2026-09-16 | Spacing scale 8-based (4 … 128); eyebrow→H2 16, H2→sub 24, →content 48, →next section 80 | derived from the mock's own gap clusters | polish-proposals.md §3 |
| 2026-09-16 | Interaction states: 150/220 ms, one ease, blue-900-alpha shadows, blue-900 / orange-500 focus rings; family cards lift 2 px, other cards 4 px | 4 px read as floating on 426 px cards at 1:1 | tokens.css, states.css |
| 2026-09-16 | Secondary button = option B (soft ring + shadow, warm foot on cream) | sits on both the pale and the orange card | polish-proposals.md §2 |
| 2026-09-16 | Header bars are flex rows on the 1366 container (95 px margins); nav 15 px, utility and footer links 14, captions 13 | hand-placed lefts could not hold larger text | Header.css |
| 2026-09-17 | Hero footage = card treatment (rounded 21, card shadow), panel inset 24 px, poster keeps the full cut-out; pill stays on the corner | works with any footage; flush needed a controlled backdrop | video-options.md |
| 2026-09-17 | **No entrance / scroll animation, on any page.** Hover and focus states, the hero video and small state transitions only | healthcare lead-gen with mostly mobile traffic: scroll reveals delay content, misfire on mobile, add script to the scroll path and need reduced-motion handling, for no lead-gen gain; the page should feel steady and load-and-read | design-audit.md §4 |
| 2026-09-17 | **Process steppers: all rings**, no filled step (Home purple, Petals IVF navy) | a solid circle reads as a selection state with nothing selected — the same arbitrariness regularised elsewhere | client-note-conflicts.md |
