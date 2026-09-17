# Round 2 — report before build (2026-09-17)

Nothing is built. Files: hero concept mocks `design/mocks/hero/` (`concepts_1366.png`, `concepts_1920.png`, one HTML per
concept), Neotia hero capture `design/render/reference/`. Apollo could not be inspected: the site returns 403 to
fetches and the session browser is not allowed to open the domain, so the Apollo comparison below is from memory of
the site and is marked as such.

---

## 1 · Neotia hero — what it does well and badly

Captured at 1536 wide: full-bleed video of a doctor with a child and father, a white centred headline, a search box
("Search For Doctor & Specialties…"), an orange "Book Appointment" and a blue "Request a Callback" side by side, and
in the header two emergency numbers plus "Appointment / Specialised Services / Find Doctor / Experience / Contact".

**Well**
- One job per element: the film sets the tone, the headline names the promise, the search box is the fastest route
  to a doctor, the two buttons are the two ways to convert. Nothing else competes.
- Primary and secondary buttons are told apart by colour, not size: orange for the commitment, blue for the softer
  ask. A visitor reads the difference in a glance.
- The film is warm content (a consultation, not a building) and the subject sits centre-right so the copy has room.
- Emergency numbers live in the header, not the hero, so the hero stays about the visit.

**Badly**
- The whole frame is washed dark so white text can sit anywhere. Faces go grey; the warmth the footage brings is
  taken straight back out. This is the "corporate and cold" you named.
- Everything is centred on the film's busiest area, so text crosses faces and hands.
- The search box promises a fast path but the field has no visible affordance for what it searches; the placeholder
  is the only help, and it is small.
- No proof in view: no clinic count, no rating, no "who this is for". The claim ("Eastern India's Trusted Name")
  is asserted, not shown.
- At 1920 the video is simply larger; nothing in the composition uses the extra width.

*Apollo (from memory, not verified this session):* a full-width slider with a booking widget, more elements than
Neotia, and the same dark-wash habit. Its strength is that a booking form is in the first viewport; its weakness is
that the first viewport is a control panel.

**Takeaway for Petals:** keep the film warm (no wash over faces), keep two clearly different buttons, put the proof
(clinics, doctors, rating) in view, and use the width at 1920 instead of scaling the same picture up.

---

## 2 · Three hero concepts (mocks at 1366 and 1920)

Constants across all three: no headline; the existing paragraph carries the message at 24 px (body size, unchanged
family and weight); "Book Appointment" is a navy pill (primary), "Request a Call Back" a white pill with navy text
(the approved secondary treatment) — colour tells them apart, size is equal; the play/pause control stays; the
portrait assets are kept on disk and in the repo, unused.

| | A · full-bleed film | B · film card bleeding right (**recommended**) | C · petal-masked film |
|---|---|---|---|
| Message with no headline | paragraph in white on a navy gradient over the left third only; faces on the right stay unwashed | paragraph in black on the pale ground; the film is a separate object, never under text | paragraph left; the petal shape says "Petals" without a word |
| Buttons | side by side under the paragraph, over the film | stacked, equal width, in the text column | side by side in the text column |
| Location pill and stats | a white "proof shelf" straddling the band's bottom edge — also the transition into section 2 | a proof strip overlapping the card's bottom-left corner (the badge idea from the current hero, extended) | inline row under the buttons |
| Video framing | full-bleed, 560 tall | contained 16:9 card, left edge on the text column, right edge on the viewport — grows with the screen | masked by the petal, bleeding off the right |
| At 1920 | same picture, larger; gradient covers more film | the card gains 554 px of film; the column stays put | the petal grows, the crop changes |
| Risks | Neotia's shape; text over film needs the wash it is trying to avoid; footage must be shot with a quiet left third | none structural; the card's left edge must sit clear of the buttons at 1366 (it does, 80 px) | crops faces unpredictably; wastes a third of every frame; a brand gesture the client must love |

**Recommendation: B.** It is the only one that keeps the film warm (no wash), keeps text off faces, uses the width
at 1920, and carries the proof strip forward as a deliberate object. A is what every hospital does and needs the
dark wash to work; C is memorable but footage-hostile. The shooting spec changes with B: landscape 16:9, subject
centre-left in frame (the card's left third is visible at both widths), 1920 × 1080 minimum, 10–15 s loop, muted.

---

## 3 · Header — proposed sizes (nothing applied)

Scale the header as one unit at ×1.2, then round to the type scale.

| Element | Now | Proposed |
|---|---|---|
| Logo | 54.4 × 69.3 | 65 × 83 |
| Utility bar height | 108 | 124 |
| Utility text | 14 | 16 (label-md; existing 16 token) |
| Utility icons | 15–25 | ×1.2 (18–31) |
| Utility item padding | 15 / gap 9 | 18 / gap 10 |
| Nav bar height | 34 | 42 |
| Nav text | 15 / 500 | 18 / 500 |
| Nav item padding | 15 | 17 |
| Chevron | 17.9 × 11 | 21.5 × 13.2 |
| Dropdown rows | 14 / 600, rows 32 | 16 / 600, rows 36 (panel 220 wide) |

Overflow check at 1366, measured with the actual font: the nav row at 18 px with 17 px padding is 1,055 px against
the 1,176 px container (slack 121). "Diagnostic Services" cannot run into "For Patients" because the row is flex, not
absolute; the worst case is the row growing, and it fits up to 20 px (1,167). The utility group at 16 px is 601 px
wide and starts at x 670, well clear of the logo at 160. Total header 166 px tall (was 142); the hero mocks use these
sizes so you can judge them in context.

---

## 4 · Design direction for "worth scrolling"

Polish 2 was seams and edges. This goes to composition. Same rules: no new colours, fonts, copy or order.

**Transitions — from soft edges to objects that cross them.** Keep polish 2's soft bands, then let one object
straddle each seam: the hero proof strip into section 2; the doctor carousel's cards overhanging the specialists
band's bottom edge into the health-card section; the health-card panel's photo breaking the panel's top edge. Seams
stop being lines because something always crosses them.

**Cards — make the doctor card the best object on the page.** Today it is a 258 × 281 tile with a monogram. Proposed
card, 300 × 400, built from the Find-a-Doctor data: portrait area (monogram disc until portraits exist) on the pale
gradient; name (title 24/600); specialty as a chip; a row for clinic and hours with the pin icon (new copy? no —
these are data fields from the mock, not copy); a row of small icons for languages and video consult; "Book
Consultation" as the primary pill and the name as the profile link. One card language for the whole site: the article
card takes the same top band, chip, hairline and anchored meta from polish 2. Both get rest ring + hover lift.

**Photography — treat the three photos we have as objects, and ask for more.** Hero film card (B). The health-card
photo breaks its frame. The care cards' petal outlines become a device: a petal-masked photo frame for clinic and
doctor images when they arrive. What is needed from the client: eight doctor portraits (same backdrop, same crop),
three clinic exteriors/interiors, four lifestyle frames (mother and child, consultation, diagnostics, home
collection). Without them, the page cannot look like the reference sites; that is a content gap, not a design one.

**Whitespace and scale — three sections dominate, the rest step back.** Dominant: hero (640), the doctor carousel
band (grow to 760 with the larger cards), the health-card panel. Compact: process becomes a single-row strip (rings
and titles, descriptions under) at 320; insights stays at three cards but loses its top padding; stories becomes the
carousel at its current height. Weight then reads hero → who we are → who you will see → what you get → proof →
reading, instead of six equal blocks.

**CTA path — one obvious next action always in view.** (1) The nav gets a compact orange "Book Appointment" at its
right end that appears once the hero's buttons scroll out (a state change, not an animation). (2) Every doctor card
carries "Book Consultation". (3) A closing band before the footer reuses the hero's two buttons and the proof strip:
no new copy, the same two labels. (4) The SXO agent (item 6) is the fourth path, once wired.

I will show this as a static direction board (three mocked sections: doctor card row, process strip, closing band)
before building, if approved.

---

## 5 · Motion — revised view

The earlier "no" was against entrance choreography as a default. The client's verdict is "boring to scroll", which
is a composition problem first (item 4), but a restrained motion layer does add life and can be defended on
performance:

- **One-time reveals on below-the-fold rows only**: card rows and the health-card panel fade in and rise 12 px over
  240 ms, once, triggered by IntersectionObserver at 20 % visibility. Opacity and transform are compositor-only, the
  observer is passive (no scroll listener), the script is under 1 KB, and elements are laid out in place so there is
  no layout shift. Nothing in the first viewport animates on load. `prefers-reduced-motion` turns it off entirely and
  the content is visible without JavaScript.
- **Carousel autoplay** (the client's own request, item 4–5): slow, paused on hover/focus, off under reduced motion.
- **The hero film** and the existing hover/focus states.
- **The sticky nav CTA** appearing is a state transition, 220 ms.

Still no: parallax, number counters, scroll-jacking, staggered text, anything on the hero on load. Mobile cost of
the reveal layer is one observer and a class toggle; I will measure it (Lighthouse, mid-tier Android throttling)
before and after and report. The decisions log gets this revision.

---

## 6 · SXO agent — scope and the form-destination gap

**Where the existing forms go today.** The new build has no forms: "Book your appointment", "Find a Doctor", "Ask a
Doctor" and "Click here we will call back" are anchors to `#book`, `#find`, `#ask` and the like — placeholders. The
Canva pages draw forms but a design file has no destination. The client's live site (petalshealth.in, WordPress)
does have working forms, and this is the only evidence of "where the other forms go":

| Live form | Fields | Goes to |
|---|---|---|
| Contact (Contact Form 7, id 969) | name, email, phone, department, message, page URL, reCAPTCHA | email recipient set in WP admin — not visible from outside |
| Careers (CF7 id 1693) | name, phone, CV upload, message | same |
| Location enquiry (CF7 id 1498) | name, email, phone, location | same |
| Membership | name, email, phone, location | `membership-sendmail.php` on the same server (PHP mail) |
| WhatsApp | — | wa.me/9147405955 and wa.me/9147405960 |

So "wherever the other appointment forms go" means: email, to an address configured inside their WordPress, plus
WhatsApp. Nobody has stated the address, and the new site has no server to send from.

**Needed from the client to wire either of the two options:**
1. The recipient email address(es) per form, or WordPress admin access to read the CF7 settings.
2. A decision on the endpoint: (a) keep the WordPress site alive as the form backend and POST to its CF7 REST endpoint
   from the new site (needs CORS allowed on their WP and the site kept up), or (b) a new endpoint — a transactional
   email/API service, or a CRM if they have one (none is visible on the live site). Option (b) needs an account and
   billing owner.
3. reCAPTCHA keys (they use v2 today) or a decision to drop it.
4. Privacy policy text and consent wording (the live site links "Privacy Policy" and "Mobile Application Privacy
   Policy"; we need the current text).
5. Which WhatsApp number receives call-back requests, and whether a WhatsApp deep link is an acceptable fallback.
6. The doctor list for "preferred doctor" (the eight from Find a Doctor, or all 50+).
7. Whether submitters get a confirmation (SMS/email) and from which sender.

**Scope (not built):**
- *Component:* a page-level agent mounted once in the app shell (React context), not per page, so state is shared
  across routes; avatar bubble bottom-right (doctor avatar, monogram until portraits exist), two qualifying
  questions (who is it for: me / my child / a family member; what do you need: appointment / call back / test), then
  the form (name, mobile, gender, age, preferred doctor, appointment date), then a thank-you step. All strings in a
  content file so copy is editable.
- *Consent and privacy:* an unchecked consent checkbox at the form step ("I agree to Petals Health storing these
  details to contact me about this request") with a link to the privacy notice; the notice states purpose,
  retention, who receives it and how to withdraw. Nothing stored client-side beyond the session flags below; no
  analytics event carries personal data.
- *Session state:* `sessionStorage` keys for shown-at, dismissed, completed; dismissed means dismissed for the tab
  session; completed suppresses for the session; a query flag to force it for testing.
- *Timing as configuration:* `{ firstAppearance: { delayMs: 30000, scrollPct: 50, exitIntent: true }, repeatMs: null,
  dismissal: 'session' }` — defaults as you specified; the client's every-20-seconds request is `repeatMs: 20000` and
  nothing else changes, so it stays a one-line decision for you and them.
- *Mobile:* no floating overlay competing with content — the avatar collapses to a 56 px bubble above the thumb
  zone, opens as a bottom sheet, never overlaps the sticky booking CTA, and exit intent is replaced by a
  back-navigation prompt only if the client insists (I recommend not).
- *Accessibility:* dialog semantics, focus trap while open, Escape closes, reduced motion respected.

---

## Order of build, once approved
header → hero (B) → design pass (item 4, direction board first) → carousels (testimonials, doctors — shared component
taking a data array; the two Find-a-Doctor source errors logged for the client: Dr. Smita Gutgutia listed twice with a
male photograph on the second, and "12 am – 2 pm" that is almost certainly 12 pm). Commit before and after each block.
