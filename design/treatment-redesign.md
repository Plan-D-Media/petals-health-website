# Treatment pages — audit and redesign direction (2026-09-21)

Walked all nine pages at 390, 1366 and 1920 from the gate captures (design/render/check/audit/*). Fixed: palette,
fonts, type scale, copy, section order. Open: everything else. The bar is Home's design language — soft seams, alternating
white/tint bands, the doctor card as the best object on the page, a next action always in view.

## Template A audit (Child Care, Pain Management, Audiology, Yoga & Wellness, Multispecialty)

Where it reads flat, ranked by improvement against cost:

1. **The page is three things stacked and then it stops.** Hero → one paragraph → a card grid → a navy strap → (maybe)
   the team → footer. Every band is full-width and edge-to-edge; there is no seam, no tint rhythm, no object that
   changes shape. At 1920 the hero is 60 % empty pale gradient (Child Care: the photo occupies the left 25 %, the copy a
   narrow column at 60 %; the middle third is blank). The eye reads the headline, then has nothing to hold it until the
   grid. Cost: low — it is CSS on one template.
2. **Card grids with no hierarchy.** Six to nine cards, identical size, a small number, a title, two lines. The first card
   (Well-Baby Checks, Hearing Tests, Back & Neck Pain) is the one most visitors came for and it looks exactly like the
   sixth. Multispecialty's flagship tile is the only card on the template that is allowed to be different, and it works.
   At 390 the cards become a column of nine equal boxes with a lot of pale gradient — the longest, least scannable
   stretch of the mobile page. Cost: low-medium.
3. **The doctor is an afterthought.** "Meet the team" appears after the closing strap, as one card alone in the middle
   of a white band (Child Care, Multispecialty). Pain Management, Audiology and Yoga have no matching doctor and the
   section simply vanishes — the visitor who wants a person to trust gets nothing. Cost: medium (data mapping +
   layout).
4. **The closing strap ends the conversation.** Navy band, one line, two buttons, then the footer. It reads as the
   bottom of a form, not as "here is where to go next". No clinic, no phone context, no route to a related page. Cost:
   low.
5. **The hero photo is decoration.** The cut-out photos are good but they float in the gradient with nothing anchoring
   them; the copy column is the same width at every size, so at 1366 the photo has 40 % and at 1920 it has 25 %. The
   photo should sit on something (a tinted shelf, the way Home's video card sits on its panel) and the copy should take
   the width it needs. Cost: low.

Smaller: the intro paragraph is centred body text with nothing around it (a lost opportunity to state the three or four
things the visitor most needs — clinics, first-visit price, video consult); Yoga's feature block is two portrait photos
stacked beside a bullet list with 60 % of the row empty at 1366; the "Copy pending" tag sits inline in a card title.

## Template B audit (Women's Care, Dentistry, Cosmetic Gynaecology, Petals IVF)

1. **Cosmetic Gynaecology is 35 cards and nothing else for four screens.** Three tracks, sub-groups inside track 03, every
   card the same 4-column outlined box with a "Learn more" that goes nowhere. There is no way to jump to a track, no
   sense of where you are, no reason to keep scrolling except that the scrollbar has not stopped. The track headings are
   good; the visitor never sees them together. Cost: medium — a track index in the hero (three anchor pills) and a
   sticky mini-index on desktop change the whole page; the cards themselves can stay simpler.
2. **47 "Learn more" links to nowhere.** Every service card on Women's Care, Dentistry and Cosmetic ends in a boxed link
   with an arrow. They are now non-interactive placeholders (last pass), but they still *look* like the card's action —
   a grey box that does nothing. The card has no action and should not pretend to. Cost: low.
3. **The FAQ opens onto nothing.** Women's Care, Dentistry and IVF show one answered question and four or five closed
   ones whose answers do not exist; opening them shows "Copy pending". Beside it, the form is a bordered box with a
   navy title bar bolted on — it reads as the mock's screenshot of a form, not as the page inviting a question. Cost:
   low-medium.
4. **The card is the only object.** Dentistry: three groups of four identical cards, then Risks (navy band, bullets + a
   photo that is 30 % of the row, the rest navy), then Safety (pale band, the mirror). At 1920 the Risks photo sits alone
   in a navy sea. Women's Care: nine identical cards then FAQ. The IVF variant is the exception — icons, a featured
   band, a stepper, a conversation band — and it is the only Template B page that feels like Home. Cost: medium.
5. **The stats strip and the seams.** Cosmetic's navy stats strip is the right idea (three facts a worried visitor
   wants) but it is a hard band with hard edges; the rest of B has no tint rhythm at all — white → cream → navy →
   white with straight cuts. Home's seams are 80 px fades; B has none. Cost: low.

## Direction

One design language for both templates, built as shared pieces (a `treatment.css` layer under both), so the nine pages
stay consistent and each template keeps its own section order.

**Hero — a shelf, like Home's.** The photo sits on a tinted shelf that runs off the left edge (Template A) or right
edge (Multispecialty's photo-right variant); the copy column is fluid and takes 45–50 % at 1366, 40 % at 1920, with the
headline at the type scale it already has. Under the CTA, a "quick facts" row drawn from data the page already has:
clinics where this service runs (from the doctors' sessions), "video consult", "first consultation complimentary" where
the content says so. Cosmetic's stats strip becomes this row on every page, and its three track pills become anchor
links for long pages. Weight: the hero photo stays the current WebP; the shelf is CSS.

**Services — one grid, three ranks.** The content files already carry order, numbering and (on Cosmetic) a label. The
grid gets: a *lead* card (the first service, or the one marked `lead` in content) spanning two columns with a short
"start here" line; *standard* cards; and, where a group has more than eight, a *compact* row of the remaining
services as a two-line list inside the same band. Cards lose the outline + gradient in favour of Home's white card on a
tint band with the 1 px ring, so the band, not the card border, does the separating. The "Learn more" placeholder is
removed from the card: a card with no destination is a card, not a link. When the client's sub-pages exist, the card
becomes the link (whole card clickable, title underlined on hover) — one content key (`href`) switches it.

**A doctor in every page.** "Meet the team" moves up to sit between the services and the closing, on a tint band with
the seam, and shows the matching specialists as the Home doctor card (the best object we have). Where no doctor matches
(Pain, Audiology, Yoga, Dentistry, Cosmetic today) the band shows the nearest relevant doctors by a `relatedSpecialties`
list in content (Yoga → gynaecology; Pain → family medicine; Audiology → paediatrics + family) under the heading "Doctors
who can start you off", with the Find a Doctor link — never an empty band, never a lie about specialty.

**Long pages — a way through.** Pages with more than one group (Dentistry, Cosmetic) get a track index: three pills in
the hero and a slim sticky index bar on ≥1024 that highlights the current track and jumps between them (same
IntersectionObserver as the reveals; no new motion). Each track head keeps its eyebrow/title/sub. Sub-groups inside a
track (Cosmetic 03) become labelled rows with the rule heading they already have.

**FAQ + form → "Before your first visit".** The FAQ shows only answered questions, as an open list (question in navy,
answer beneath) rather than an accordion — with one answer there is nothing to collapse. The content file keeps the
unanswered questions with `a: null`; the component renders only answered ones and switches to the accordion
automatically at three or more. The form loses its bolted title bar: it sits on the tint band as a white card with the
heading and a one-line reassurance ("We reply within an hour during clinic hours"), the same lead form. On A pages,
which have no FAQ, the same band holds the closing strap's two actions and the form.

**Closing — somewhere to go.** The navy strap becomes Home's closing panel pattern: the page's own closing copy, its
two actions, and a "you might also need" row of two or three related treatment pages (from a `related` list in content;
defaults to the neighbours in the Treatments menu). The footer follows a seam, not a cut.

**Bands and seams.** Alternating white / pale-blue tint (Home's `#edf7ff` radial) with the 80 px fade at each edge;
navy reserved for one band per page (the closing on A; the surgical track or the conversation band on B). Cream stays
for Cosmetic track 01/03 as the mock has it, with the same seam.

**Motion.** The existing reveal layer only (rows fade-up on scroll, reduced-motion off). The sticky index highlights by
class change, no animation.

**Weight.** No new images. Shelf, seams, index and card ranks are CSS. Doctor cards use the 340 px variants already on
disk. Expected: page weight unchanged or lower (the outlined-card gradients and the 47 link boxes go).

## Build plan

1. `src/templates/treatment.css` (shared: shelf hero, quick facts, bands/seams, ranked grid, team band, before-your-
   visit band, closing panel, sticky index) + small additions to the content schema (`lead`, `href`, `related`,
   `relatedSpecialties`, `facts`), all optional with sensible defaults.
2. Template A on the new pieces → gate → show at 390/1366/1920 → commit.
3. Template B (groups, tracks, FAQ/form, risks) on the same pieces → gate → show → commit.

## Template A — built 2026-09-21 (conditions from the approval)

**1. Facts row.** Only verified facts render. Two kinds: explicit `facts: [{ label, source }]` in a content file (a fact
without a `source` is dropped), and two derived from the matching doctors' records in doctors.js. No Template A page
has an explicit fact; "1st consultation is complimentary" exists only in the Cosmetic Gynaecology mock and will render
only there (Template B). What each page shows today:

| Page | Facts shown | Source |
|---|---|---|
| Child Care | At Kankurgachi · Video consult available | Dr Uttara Bhar's sessions and videoConsult in doctors.js |
| Multispecialty Clinic | At Loudon Street (CMC) · Video consult available | Dr K N Siddiqui's record in doctors.js |
| Pain Management | none — row hidden | no matching doctor, no explicit fact |
| Audiology | none — row hidden | same |
| Yoga & Wellness | none — row hidden | same |

The derived facts change automatically when the client's doctor sheet arrives (more clinics, video per doctor).

**2. Related doctors.** Not built. Pages with no matching specialist show the "Find a doctor" band with the search
link only. Proposed map for the client to approve before any substitute doctor appears on a page:

| Treatment page | Proposed substitute specialties | Basis |
|---|---|---|
| Pain Management & Rejuvenation | Family Medicine | the page's own copy: pain consultations start with a family physician's assessment and referral |
| Yoga & Wellness | Gynaecology & Obstetrics — **for the Prenatal & Postnatal Yoga feature block only**, shown beside that block, not in the page's team band | the rest of the page (therapeutic yoga, stress and sleep coaching, wellness coaching) is not gynaecological; a gynaecologist in the team band would imply she oversees all of it |
| Audiology | none proposed | no specialty in the data is defensible; wait for an audiologist in the sheet |
| Dentistry | none proposed | wait for the dental team in the sheet |
| Cosmetic Gynaecology & Aesthetics | Gynaecology & Obstetrics (cosmetic gynaecology track only) | the intimate-wellness tracks are gynaecological; the skin/hair track is not |

**3. Lead card.** `lead: true` on a service in the content file marks it; the default is the first card in the mock's
order (Multispecialty's Cardiology carries the mock's own "Flagship" label). Defaults to put to the client:

| Page | Default lead card | Alternative the client may prefer |
|---|---|---|
| Child Care | Well-Baby Checks | Vaccination (highest-volume visit) |
| Pain Management | Back & Neck Pain | Pregnancy-Related Pain Management (the clinic's differentiator) |
| Audiology | Hearing Tests | — |
| Yoga & Wellness | Therapeutic Yoga | Prenatal & Postnatal (already the feature block) |
| Multispecialty Clinic | Cardiology (mock: Flagship) | — |

The lead card's small line ("Where most families begin") is a UI label, overridable per page with `leadNote`.

**4. Live verification.** The preview server now runs as a detached supervisor (`node tools/serve-daemon.mjs
start|stop|status`): a process outside the Claude session, so the session's memory-pressure task killer cannot reach
it; it restarts the server two seconds after any exit and logs to app/.serve/log. It survived two full gate runs
(headless Chrome at six widths) alongside it. The machine: 16 GB, of which Chrome (23 processes, 3.3 GB), the
rsEngineSvc antivirus engine (1.4 GB) and VS Code (1.1 GB) are the large consumers; the server itself is 40 MB. If
free memory drops below ~800 MB the gate's Chrome runs slow but the server holds. Closing a few Chrome tabs is the
only change needed.

Review: http://127.0.0.1:4173/treatments/child-care/ (and pain-management-rejuvenation, audiology, yoga-wellness,
multispecialty-clinic). Three-width sheets: design/render/live/sheet_<slug>.png.

Other content keys added (all optional): `related` (slugs for the "More at Petals Health" row; default = the page's
neighbours in the Treatments menu), `compactFrom` (services beyond it render as compact rows; default 6 when a page
has more than eight), `href` on a service (turns the whole card into a link once a sub-page exists),
`servicesEyebrow` / `servicesTitle` (the grid heading; default "What we treat" / "<Title> services").

### Navy rule (review of Template A, 2026-09-21)
Multispecialty had two navy objects: the lead card and the mock's "Cardiology, in depth" flagship band. Both options
were built live (design/render/live/navy_compare.png: A left, B right). **A — light lead card (white, navy rule along
the top, accent label), navy flagship band** is the recommendation and the template's rule: a page with a flagship
band gets the light lead automatically (`leadTone` overrides). B — navy lead, flagship on the tint — turned the page's
biggest section into a second services grid with nothing to mark it as the mock's featured track.
The other four pages have no navy band: the lead card is their one navy object in the body. One thing to decide: the
"More at Petals Health" row at the foot of every page is Home's navy closing panel, so strictly every page carries a
second navy object at the very end. It is small, last and the site's closing device; kept, flagged here in case the
rule should be stricter (it becomes a tint panel with one CSS change).

## Template B — built 2026-09-21 (same shared layer; the four conditions)

**Cosmetic Gynaecology (the hard page).** Three track pills under the hero CTA (Non-Surgical · Surgical ·
Dermatology & Aesthetic) jump to the tracks; from 1024 a slim sticky index under the nav highlights the current track
as you scroll (verified: active item follows track-1 → 2 → 3 at scrollY 1264 / 2378 / 3164; bar at top 42 px). Track
01 (cream band): lead card Laser Vaginal Rejuvenation + 10 cards. Track 02 (the page's one navy band): five cards.
Track 03 (cream): four labelled sub-group rows with rule headings. The 35 cards carry no "Learn more" box; the
`href` key makes a card the link when a sub-page exists. The mock's navy stats strip is now the facts row.

**Facts row (condition 1).** Only source-tracked facts render:

| Page | Facts shown | Source |
|---|---|---|
| Women's Care | At Loudon Street (CMC) and Kankurgachi · Video consult available | Dr Smita Gutgutia's and Dr Subhra Ghosh Paul's records |
| Petals IVF | At Tollygunge · Video consult available | Dr Madanki S's record |
| Cosmetic Gynaecology | 35 procedures across 3 tracks of care · 3 clinics — Kankurgachi, Loudon Street, Tollygunge · 1st consultation is complimentary | the mock's stats strip, this page only (`facts` in the content file, each with `source`) |
| Dentistry | none — row hidden | no matching doctor, no stated fact |

**Related doctors (condition 2).** Not built. Dentistry and Cosmetic show the "Find a doctor" band with the search link
only. The proposal table (above) covers them; nothing renders until approved.

**Lead card (condition 3).** One lead per page, the first card of the first group in mock order (`lead: true`
overrides): Women's Care → Gynaecology; Dentistry → Check-ups & Cleaning; Cosmetic → Laser Vaginal Rejuvenation;
Petals IVF → Egg Freezing (the mock's own highlighted tile). Later groups and sub-groups have no lead.

**FAQ (content problem 2).** Only answered questions render: Women's Care 1 of 5, Dentistry 1 of 5, IVF 1 of 6, as
an open question/answer list under "Before your first visit", with a one-line note that the rest are being answered.
At three or more answered the same component switches to an accordion. Unanswered items stay in the content files
with no `a`. Cosmetic has no FAQ: the package (LuxMOM Re-sculpt) sits there as outlined chips with a call button.

**Navy rule.** One navy band per page: Cosmetic — the surgical track; Dentistry — the Risks band; IVF — the featured
"Planning Ahead" band (its conversation band became a tint panel with navy title, since orange-on-tint fails contrast
and two navy bands broke the rule); Women's Care — none in the body (the lead card). Plus the closing "More at Petals
Health" panel on every page, as noted for Template A.

**Live (condition 4).** All four pages verified on the detached server at 390 / 1366 / 1920
(design/render/live/sheet_<slug>.png). The Clinics page kept its old FAQ accordion styles in its own file
(Clinics-faq.css); the pre-redesign template stylesheet is deleted.

## Staging and the SXO agent — 2026-09-21

**Staging.** https://petals-health-staging.vercel.app — a separate Vercel project (`petals-health-staging`, Hobby
plan, the account the CLI on this machine is logged into) built from `vercel.staging.json` with `npm run
build:staging`. What makes it staging: HTTP Basic auth on every request from `middleware.js` (credentials live only
in the project's environment as STAGING_USER / STAGING_PASS; generated into app/.staging.json, gitignored);
`X-Robots-Tag: noindex, nofollow` on every response; `<meta name="robots" content="noindex, nofollow">` in every
page's HTML; robots.txt `Disallow: /`; no sitemap; forms hard-wired to the simulated placeholder endpoint (the
?leadEndpoint= test hook is ignored on staging, verified: zero POST requests on a submission); analytics never loads;
an orange preview ribbon at the top of every page. Production builds (`npm run build`) contain none of this.
Redeploy: `cd app && npm run deploy:staging` (Vercel builds in the cloud; ~2 min; the URL stays the same).
One-time on a new machine: `npx vercel login`, then `node tools/deploy-staging.mjs --setup`.
Verified from outside after deploy: 401 without the sign-in; with it, direct links to /, treatment pages, doctor
profiles, Find a Doctor, Clinics all 200; a non-slash URL 308s to its slash form; unknown paths 404; sitemap 404.

**SXO agent** (src/components/SxoAgent.jsx, copy in src/content/sxo.js, timing in config.js `SXO`). Built against
the placeholder endpoint and mounted on Home only until the interaction is approved. First appearance: 30 s, or 50 %
scroll, or exit intent (pointer leaves through the top edge; desktop only), whichever first; each is one number in
`SXO.firstAppearance`. Card bottom-right on desktop, bottom sheet above the action bar on phones. Steps: prompt
(Start / Not now) → "Who is this for?" (Me / My child / A family member) → "What do you need?" (An appointment / A
call back / A test or check-up) → the sxo-agent lead form (name, mobile, gender, age, preferred doctor, date, with the
consent checkbox and privacy link) → the form's thank-you. The two answers travel in the payload's source.section
as `sxo:<who>:<need>`. Session: "Not now", × or Escape → dismissed for the tab session; a completed form → the same.
Non-modal; focus moves into the card at each step and back on close; Escape closes; no slide under reduced motion.
Test hooks: ?sxo=now, ?sxo=reset, ?sxoDelay=<ms>. Analytics: sxo_shown {trigger}, sxo_step, sxo_dismissed,
sxo_completed, plus the form's own events. Demo frames: design/render/live/sxo/ (sheet_1366.png, sheet_390.png,
sxo_1366.gif, sxo_390.gif). Verified: all three triggers fire; dismissal and completion persist across navigation.
Not built (waits on approval): mounting on every page (one line in main.jsx), `repeatMs`.
