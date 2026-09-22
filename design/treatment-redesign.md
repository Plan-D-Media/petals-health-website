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

# About Us — audit and direction (2026-09-21)

Walked live at 390, 1366 and 1920 (design/render/live/_about_*.png). Fixed: palette, fonts, type scale, copy, section
order. Open: layout, proportion, hierarchy, imagery, rhythm.

## Where the page loses a reader — top five by improvement against cost

1. **Four prose columns, no way in.** "About Petals / Our Story / The problem / The idea" are four identical
   headings over four identical blocks of 16 px body. At 1366 the eye reads the first heading, drops to "About
   Petals" (two sentences), then faces 1,400 px of two-column prose with nothing to hold it. At 1920 the columns
   stretch to 500 px measures (80–90 characters a line, too long) and the block is 55 % of the page. At 390 it is
   1.6 screens of uninterrupted text before the first thing that isn't a paragraph. There is no scan layer at all:
   a visitor cannot tell in five seconds what Petals is. Cost: low; this is layout and typography on copy that
   already exists.

2. **The problem → The idea is a story told as two unrelated columns.** The mock's most persuasive content is a
   narrative arc: women's health has been reduced to pregnancy and infertility; women suffer in silence; awareness
   is rising but there is nowhere reliable to go; *so we built one place*. On the page "The problem" and "The idea"
   sit side by side as peers, the same size, the same tone, so the payoff line ("This is what gave rise to the Idea
   of Petals Health…") is buried at the bottom of the right-hand column with the same weight as a bullet about
   online resources. Nothing on the page says "and then". Cost: low-medium.

3. **Approach / Offer / Journey: three lists side by side.** Three headings, three columns, 5 + 7 + 7 items, every
   item the same weight, no icons, no numbers, no rhythm. At 1366 the middle column is one long paragraph-list; at
   768 it was already flagged as cramped (now stacked, which is better but still 900 px of list). "Our Approch" is
   the one list that is scannable by nature (five short pairs) and it is styled exactly like the two paragraph
   lists beside it. Cost: low.

4. **The reception photo is a banner, not an argument.** It runs edge to edge at a fixed 460 px height with no
   caption, no copy over it, no connection to the heading beneath. It is the best asset on the page (a real clinic,
   the real logo wall, real staff at the desk) and it is doing nothing but occupying the first screen; at 1920 it is
   letterboxed and the desk is cropped. It should carry the page's opening claim. Cost: low.

5. **The team section promises people and shows three empty cards; the careers line has two dead buttons.** "The
   team at a glance" introduces a carousel of three identical stock illustrations with role titles, then arrows to
   scroll three cards that fit on one row anyway. Then "Want to join our Team?" with two buttons that are placeholder
   links. The section is 900 px tall and contains no information a visitor can use. Cost: low, but it needs a
   content decision (below).

Also: the page has no navy object and no closing action; it ends on the two inert careers buttons and the footer.
The clinic cards are the only object with hierarchy on the page, and they are the shared component, already right.

## Direction

**Hero: the photo carries the opening.** The reception photograph becomes a shelf hero like the treatment pages:
the photo on the left running off the edge (desk and logo wall in frame at every width via object-position), and on
the right the page's h1 "About Petals" with its single paragraph as the lead ("Envisaged as a chain of family
clinics, Petals is your community all-in-one family healthcare destination…") and the three clinic names from the
data file as the facts row (verified: they exist). The visitor gets the answer to "what is this?" in the first
screen, with the real clinic behind it.

**Our Story: a short pull, not a column.** Two sentences, set large on the white band under the hero, centred, the
way Home's intro paragraph reads. "We don't just treat conditions. We help you manage your health better, every
day." is the line the mock wants remembered; it gets the last position and the weight.

**The problem → The idea: one narrative band with a turn.** A tint band. Left column, eyebrow "The problem", the
four paragraphs as they are (the 80 % line stays plain body text, bold as in the mock, not a stat). A visible turn
between the two, a vertical rule on desktop and a marker on mobile, then the eyebrow "The idea" and the three
"but…" paragraphs, and the payoff paragraph ("This is what gave rise to the Idea of Petals Health…") set apart as
the band's conclusion: larger, navy, full width under both columns, so the arc lands. No copy changes; the order is
the mock's.

**Approach / Offer / Journey: three different shapes.** "Our Approch" becomes five numbered pairs in a row of
small white cards (the ranked-grid card, compact); it is a list of principles and reads as one. "What we offer"
becomes a two-column checklist with a check mark per item (seven services; a checklist is what the copy is). "The
journey so far" becomes a vertical timeline down the right: seven milestones with a dot and a rule (the copy is
achievements; a timeline says "so far"). The "Recognized among Kolkata's leading providers" line stays a timeline
entry in body size, not a callout. White band, seam above and below.

**Find us: unchanged.** The shared clinic cards, tint band, as on the Clinics page.

**The team: honest until people arrive.** The three placeholder cards go. Until the client sends names and
photographs, the section is the heading and the paragraph the mock gives it ("We are Building The Perfect Team…"),
and under it one row of three *role tiles*: a small monogram disc with the role's initials (CEO, MA, HR; the same
monogram device the doctor card uses when a photo is missing), the role title, and the single line "Name and
photograph to follow". No carousel, no arrows, no stock illustration pretending to be a person. When the sheet
arrives, each tile becomes a person card (photo, name, role, one line) through the same content array; the
component handles both shapes. The `Placeholder` tag stays so the client sees the state.

**Careers: a real destination or nothing clickable.** "Want to join our Team?" stays as the section's closing
line inside one navy closing panel (the page's one navy object, matching every other page's close): the line, then
two actions that work today. "Email your CV" is a mailto once the client gives the address (until then an inert
placeholder link, tagged), and "Contact us" opens the call-back form, which exists. One content key switches the
mailto on.

**Bands and seams.** white hero → white story → tint narrative → white three-shapes → tint clinics → white team →
navy careers panel → footer. Seams on every tint band.

**Weight.** The reception photo is already the pipeline's output (1600 × 1200 WebP, 165 kB, an 800 px phone
variant); the shelf hero shows it larger than today's banner but inside that box. The team-card stock illustration
(7 kB) is dropped; the map thumbs stay. Nothing added.

**Motion.** The existing reveals on the cards and timeline rows; nothing else.

**Logged for the client (item 17):** the two unsourced claims, "80% of a Gynaecologist's consultations are
Pregnancy and Infertility related" and "Recognized among Kolkata's leading providers of women's health and
gynecological care", kept as body text, source or removal requested; "Our Approch", "Cantre", "Oppsite",
"infertility specialist you go to", "docuflencers" as already listed under item 13; the careers address.

### About Us — built 2026-09-21 (with the three changes from the approval)
1. **Careers routing.** Chose tagging: "View job openings" opens the shared lead form with the `careers` preset
   (name, mobile, email, message; own thank-you), so the payload carries `source.form: 'careers'` and lead reporting
   filters it on one field. "Submit your resume" is an inert, tagged placeholder until `careersEmail` in
   src/content/team.js is set, when it becomes a mailto. No careers enquiry can land untagged in the patient sheet.
2. **Team tiles in production.** src/content/team.js holds the array; `hasRealPeople` is true once any entry has a
   name. The section renders when a real person exists, or on staging/dev builds; a production build with no real
   people omits it entirely (build-time: VITE_STAGING / import.meta.env.DEV). Verified: the production capture has
   no team section; the staging capture shows the three monogram tiles with the Placeholder tag.
3. **Closing action.** Careers is a white block in the mock's position; the navy "More at Petals Health" panel
   (Women's Care · Child Care · Multispecialty · Find a Doctor) closes the page. The hero CTA is Book an appointment.
Bands: white hero · white story · tint narrative · white three-shapes · tint clinics · [white team] · white careers ·
navy close. Weight: the stock team illustration is gone; nothing added.

# Find a Doctor, the doctor profile and Clinic Location — audit and direction (2026-09-22)

The last three pages that have not had the redesign pass. Walked live at 390, 1366 and 1920
(design/render/live/_find-a-doctor_*, _doctors_smita-gutgutia_*, _doctors_uttara-bhar_1366, _clinics_*); geometry
measured in the page, not read off the captures. Find a Doctor → profile is the site's core journey and the one the
header points at from every page, so it gets the most attention here.

## Find a Doctor — where it loses a reader

1. **The filter column is taller than the thing it filters.** Filters 400 × 1414; results 736 × 1088 at 1366, and
   1000 × 992 at 1920 — the sidebar runs 326 px past the results at 1366 and 422 px at 1920, so the page ends on a
   column of unused checkboxes beside white space. Eight of the eleven specialty rows show a count of 0 (Dentistry,
   Cosmetic Gynaecology, Dermatology & Aesthetics, Audiology, Wellness, Pain Management and two more): two thirds of
   the tallest facet can never change the result. The rating facet is five star rows with no counts at all, the
   tallest block after Specialty, filtering seven doctors who are all rated 4.8–4.9. Cost: low — this is which
   options render.

2. **At 390 the first doctor is 2,136 px down.** The filter panel opens expanded (358 × 1450) and the results start
   at y2136 — two and a half screens of checkboxes before a single doctor, on the page a phone visitor arrives at
   from "Find a Doctor" in the header. The sticky action bar sits over the panel while they scroll it. Cost: low.

3. **The doctor here is not the doctor everywhere else.** Home and Template A use the shared 300 × 410 DoctorCard —
   the object the round-2 brief made the best thing on the page. This page has its own `.drow`: 356 × 296 at 1366,
   488 × 264 at 1920, a small square photo beside four stacked lines, then a chip row, then two buttons — nine
   elements in a squat box, and at 1920 the name has 300 px of empty card to its right. The same seven people are
   presented two different ways on two pages that link to each other. Cost: medium.

4. **Seven doctors, paginated into two pages.** PAGE_SIZE is 6, so page 2 holds one doctor and the pager is drawn
   under a six-card grid for a list that would fit on one screen. Cost: none — one number.

5. **The hero is a 733 px band with a 420 px copy column.** The copy is pinned at 420 px at every width, so at 1920
   (819 px tall) it is 22 % of the band and the rest is pale gradient above four floating cut-out doctors whose feet
   are cropped mid-thigh. No facts row, no shelf under the photo — the two things the treatment heroes got. Cost: low.

6. **No band rhythm and no seams**: pale hero → white results → navy strap → footer, all hard cuts.

## The doctor profile — where it loses a reader

1. **Six of the seven profiles are five headings over five apologies.** On Dr. Uttara Bhar the whole page below the
   hero is 975 px containing four "Copy pending …" lines of 22 px each; the quote band does not render without a
   bio, so there is no navy object; the page ends on "Copy pending Patient reviews for Dr. Uttara Bhar will appear
   here" and then the footer. The hero's facts row reads "Qualifications pending". A visitor who followed the site's
   main journey — header → Find a Doctor → View Profile — lands on an empty page six times out of seven. The page
   is honest, which is right, but honest and empty is still empty: there is nothing here they can act on, and no
   action offered. Cost: low-medium, and it is the highest-value fix on the three pages.

2. **No closing action on any profile.** The only "Book a visit" is in the hero. Dr. Smita's page is 3,446 px; a
   visitor who reads the quote, the approach, 19 treatment pills, the education list, the clinics and the reviews
   arrives at the footer with nothing to do and must scroll back to the top. Every other page on the site closes on
   a panel. Cost: low.

3. **19 navy pills that look like buttons and are not.** The treats list renders 16 solid navy 163 × 32 pills on Dr.
   Smita's page in two groups, plus three in the hero. They are the loudest thing on the page — louder than her
   name — and nothing happens when you click one. This is the same defect as Template B's 47 "Learn more" links,
   fixed there and still here. Cost: low.

4. **One tint band 1,784 px tall.** Approach, Treats, Background, Clinics and Reviews are five blocks inside a
   single pale band with no seam, no alternation and no change of shape between them. Cost: low.

5. **A literal double dash where a date should be.** Two of Dr. Smita's four education rows print `--` in the period
   column because the record has no year. The stat pair (16+ years / 4.9 / 5) floats mid-paragraph with no container.
   Cost: none.

## Clinic Location — where it loses a reader

1. **The page has no opening.** It starts on a three-photo strip (1366 × 392, 1920 × 552) with navy name pills
   placed left / centre / right, and the h1 — "3 clinics across Kolkata" — does not appear until y558. There is no
   lead, no facts, nothing that says what the page is before the photos. At 390 the h1 is below the fold. Cost: low.

2. **The clinic card answers the wrong question.** It gives a region pill, a name, an address and two buttons. A
   visitor on a clinic page wants to know whether they can be seen there, for what, and when: the card carries no
   phone, no hours, no specialties, no doctor count — and no link to the doctors at that clinic, although Find a
   Doctor has a clinic filter and the profile's "View clinic →" already points the other way. The map picture is the
   same stock crop three times (logged with the client, item 13). At 1920 the card is 553 px wide with the address
   using a third of it. Cost: low-medium; everything needed is in the data files.

3. **Five navy bars are the loudest object on the page.** The FAQ accordion is full-width solid navy rows 145 px
   tall — Template B's FAQ was rebuilt in the last pass and Clinics deliberately kept the old styles in its own
   file. Four of the five questions have no answer, so four of the five bars open onto "Copy pending". The one
   answer that exists names Tollygunge only, on a page about three clinics. Cost: low.

4. **The form is still the mock's screenshot of a form.** A bordered box with a navy title bar bolted on top,
   416 × 670 beside a 704 × 516 FAQ column at 1366 and a 968 × 516 one at 1920 — the two columns are 154 px out of
   register and the left column ends in white space. Same criticism as Template B, fixed there, not here. Cost: low.

5. **Two bands, no seams, no close.** Photo strip → tint → white → footer, hard cuts, and the page ends on the form.

## Direction

**One shared doctor card.** Find a Doctor drops `.drow` and renders the shared DoctorCard in a responsive grid
(three up at 1920, two at 1366, one at 390), with the two things the list needs and the card lacks added to the
card itself behind a prop: today's availability line and a "View profile" link beside Book. The same object then
appears on Home, the treatment pages and the search — one doctor, one card, everywhere.

**Filters that only offer what can be chosen.** Zero-count options are not rendered (an option the visitor has
selected always is, so a filter can be undone); a facet with nothing left to offer does not render at all. The
rating facet goes: it cannot separate seven doctors rated 4.8–4.9, and it returns when the doctor sheet brings a
spread worth filtering — one flag in the file. Applied filters appear as removable chips above the results, so the
state is visible next to what it changed rather than only as ticks in a column. On desktop the panel becomes sticky
so it stays with the results instead of running past them; at 390 it is closed by default with the count on the
toggle — the visitor lands on doctors, and opens filters if they want them.

**Page size 12.** Seven doctors on one page, and the pager appears when the sheet takes the list past twelve.

**Shelf hero, as everywhere else.** The four-doctor cut-out sits on a shelf like the treatment heroes; the copy
column takes the width it needs; the facts row carries what the data can prove — the live doctor count, the three
clinics, how many offer a video consult. The "100+ doctors" line in the lead is the mock's and is not true of the
seven on the sheet: it stays in the lead as written but the facts row states the real number beside it, the same
rule used for the Cosmetic stats strip.

**The profile earns its scroll, or says plainly what is missing.** The five blocks stop being five equal headings:
- A profile with no copy renders only what it has — the hero, the clinics and days, and the closing action —
  followed by one honest line, once, in place of four: the full profile is being prepared, and here are two things
  you can do now. Four "Copy pending" notes become one note and two working actions. The `Pending` tag stays so the
  client sees the state on staging.
- Treats becomes plain text chips at rest (no navy fill, no button shape) — a list reading as a list.
- The blocks alternate white / tint with seams instead of one 1,784 px tint, and the stat pair becomes a small
  card beside the approach paragraph.
- Every profile closes on a panel: Book a visit, Ask a doctor, and a link to the other doctors at that clinic.
- The education period falls back to nothing, not `--`.

**Clinic Location gets an opening, a card that answers, and a close.** A shelf hero using the Kankurgachi reception
photo, the h1 the page already has, its one-line lead and a facts row (three clinics, the areas, the doctor count).
The three-photo strip stays — it is the mock's and it is real photography — but under the hero as a band, with the
pills regularised to one position. The clinic card gains, from data already in the repo, the doctors who practise
there (count and a link into Find a Doctor filtered to that clinic) and the phone number; hours stay out until the
client sends per-clinic hours. The FAQ becomes the answered-only list Template B now uses — one question, answered,
and the four unanswered ones stay with the client rather than being drawn as doors that open onto nothing. The form
loses its title bar and sits as the shared lead form in a light panel. The page closes on the navy "More at Petals
Health" panel.

**Bands.** Find a Doctor: white shelf hero · white results · navy strap · footer, with seams.
Profile: hero · navy quote (when there is one) · white approach · tint treats · white background · tint clinics ·
white reviews · navy close. Clinics: white shelf hero · white photo strip · tint clinic cards · white FAQ + form ·
navy close.

**Weight.** Nothing added: the four-doctor hero cut-out, the reception photo and the three clinic photos are already
in the pipeline. Dropping `.drow` and the Clinics FAQ stylesheet removes CSS. The rating facet's star icons go.

**Motion.** The existing reveals on card rows only; nothing new.

## Open — needs a decision before building

1. **The rating filter.** Recommended: remove it while every doctor is rated 4.8–4.9 (it cannot separate them), and
   bring it back with the doctor sheet. Alternative: keep it as designed because it is in the mock.
2. **The "100+ doctors" line.** Recommended: keep the mock's sentence in the lead and state the true count in the
   facts row beside it. Alternative: drop the claim until the sheet arrives, or ask the client first — it is not
   currently in client-requests.md.
3. **Empty profiles.** Recommended: render only the blocks that have content, with one honest line and two working
   actions. Alternative: keep all five headings so the client can see every slot the sheet will fill — which is
   what staging is for, so this can be made staging-only if preferred.
4. **Clinic card — doctors per clinic.** Adding "4 doctors here →" links into Find a Doctor filtered to that clinic.
   Counts are live from the data file, so they will read 2, 2 and 4 until the sheet arrives. Worth showing, or hold?

### Find a Doctor, the profile and Clinic Location — built 2026-09-22 (all four open items on the recommended option)
Verified live at 390, 1366 and 1920 (design/render/live/_find-a-doctor_*, _doctors_*, _clinics_*); gate green on every
page; site-walk clean on the four changed routes (axe, links, forms, keyboard, console).

**Find a Doctor.** Shelf hero (`.th th--right`) with the cut-out standing on the shelf's floor; the shelf takes the
cut-out's own height (540 px at 1366) instead of the 700 px photo shelf, so the results start inside the first
viewport. Facts row from the data: 7 doctors listed · 3 clinics · 7 offer video consults. The list is the shared
DoctorCard with `list` (availability line, Book | View profile, the name as the link, both buttons named for screen
readers); `.drow` is gone. Filters: options with a zero count are not offered unless selected (13 rows now, 22
before; the eight empty specialties are gone until a doctor arrives), a facet with nothing to offer is not drawn,
applied filters repeat as removable chips with Clear all, the panel is sticky beside the results from 1024
(top 58 = the sticky nav + 16) and closed by default below it with the active count on the toggle. Rating facet off
behind `RATING_FACET`; a `?r=` in the URL still applies and draws it. PAGE_SIZE 12. The search band is a tint band;
the match panel is the page's one navy object. Measured: at 390 the first doctor is at y991 (was 2136); at 1366 the
panel is 460 px beside a 1,050 px grid (was 1414 beside 1088).

**Profile.** Blocks render only with content, alternating white / tint (`band()` in the page), each with the 100 px
hero indent from 1024. Stats as a card beside the approach paragraph. Treats as a text list with an orange marker
(no fill). Education periods fall back to nothing. Every profile closes on the `.tr` panel: Book a visit (orange),
Ask a doctor, "Doctors at <clinic>" → Find a Doctor filtered to that clinic. A record without a bio gets one "About"
block: the pending tag, one sentence listing exactly what the sheet still owes it (`missing`), the two actions and
the rating card — Dr. Uttara Bhar's page is hero · about note · clinics · close (2,012 px; was 2,252 with four
empty headings). Hero focus tags are white ring pills with the orange dot (the video pill stays filled) — labels, not
buttons. Ask-a-doctor links carry the doctor in `data-section` (`doctor-profile:<id>`), not `data-doctor`, because
that form has no doctor field.

**Clinic Location.** Shelf hero with the Kankurgachi reception photo (`--pos` 50% 60% keeps the desk and logo wall),
the h1, the lead, Book a consultation (to the page's own form) and facts: 3 clinics · North · Central · South
Kolkata · 7 doctors across the clinics. The three tiles are cards in the container with one pill position
(bottom-left), each linking to its clinic card; the cards band follows as a tint band with a seam and no repeated
head (`ClinicCards head={false}`, names as h2). FAQ on the shared `.tq` (moved from TreatmentB.css to
treatment.css): the one answered question as a list, "4 more questions are being answered by the clinic"; the form
in the shared `.tv__form` light panel; Clinics-faq.css deleted. Closes on the "More at Petals Health" panel.

**Clinic card (shared with About).** A meta row under the address: the phone (tel:) and "N doctors here →" into
`/find-a-doctor?c=<clinic>` — live counts (4 · 2 · 2), 44 px targets.

**Also fixed on the way.** `.pending` (the orange COPY PENDING tag) lived in Hero.css, which loads with Home's chunk
only, so on a direct load of any other page it rendered as plain text glued to the sentence. Moved to
styles/states.css (global). tools/slice.mjs added: viewport-height slices of a live page, what the visitor actually
sees screen by screen, where shot.mjs gives the whole scroll.

**Weight.** Nothing added; FindDoctor.css and DoctorProfile.css are shorter, Clinics-faq.css is gone.

# Client round of 2026-09-22 — seven items

Order as briefed: report (hero-image audit, fertility-care finding, Clinics and About directions), then 3 · 5 · 4 · 1 · 2,
each committed on a green gate; 6 and 7 wait for the directions to be approved. Evidence for the checklist is in
design/render/live/verification-2026-09-22.txt (the probe's output) and the captures named below.

## Hero image audit (item 1)
Alpha measured per file (tools: PIL over public/assets/treatments). Eight of nine are true cut-outs with the figure on
the bottom edge: Women's Care 43 % transparent, Child Care 67 % (touches the left edge), Petals IVF 47 %, Dentistry
67 %, Aesthetics 64 % (two figures in one file, as in the mock), Pain 79 %, Multispecialty 40 % (the sofa is the
ground; the whole bottom edge is opaque), Audiology 65 % (both figures cut hard at the file's left edge — flush left
or nothing). Yoga is a 1919 × 820 rectangle with its own pale-blue backdrop. Contact sheet:
design/render/live/hero-cutouts-audit.png. Yoga proposals: yoga_proposals.png — Y1 soft blend (chosen), Y2 framed card.

## Fertility Care (item 3)
/treatments/fertility-care is an alias of Petals IVF (content/treatments/list.js): the router renders the IVF content,
postbuild writes a meta-refresh page there pointing at /treatments/petals-ivf/ with a canonical to it. Not in the
sitemap (aliases are excluded; the canonical is) — left so. The only link to it was the dropdown item; Home's
"Fertility Treatment" is a text chip and every related row uses petals-ivf.

## Built

**3. Dropdown.** Header.jsx TREATMENTS without the item; list.js keeps the alias. Verified: GET the alias → lands on
/treatments/petals-ivf/, h1 Petals IVF; no header link names Fertility; dropdown = Women's Care · Child Care ·
Aesthetics · Dentistry · Multispecialty Clinic · Yoga & Wellness · Pain Management & Rejuvenation · Audiology.

**5. Clinics.** NAV entry without `chevron`; the drawer already rendered items without children as plain links.
Verified: desktop `<a href=/clinics>` with no svg, no aria-haspopup/expanded; ArrowDown / Space / ArrowRight on it
open nothing and stay on the page; Enter navigates; drawer `<a href="/clinics">Clinics</a>`, 0 buttons, 0 chevrons.

**4. Aesthetics.** content/treatments/aesthetics.js (renamed file): one group (the dermatology track, four sub-groups,
19 cards); the intimate-wellness (11) and surgical (5) tracks and the LuxMOM package gone; hero headline "Aesthetics"
+ pending tag, tagline dropped, lead = the track's own sub-line + pending tag; facts: the clinics line shown,
"35 procedures across 3 tracks" and "1st consultation is complimentary" moved to `factsHidden`; specialtyId
dermatology. Route: list.js `'aesthetics'` plus `'cosmetic-gynaecology-aesthetics': { redirect: 'aesthetics' }`;
REDIRECTS exported (list.js, pages.js); routes.jsx `location.replace()` for a moved slug (query and hash kept);
postbuild writes the meta-refresh page for the old path; hosting: `redirects` (permanent) in vercel.staging.json and
in a new production vercel.json (buildCommand, outputDirectory, trailingSlash, the redirect — nothing else yet).
References: Header label/href, treatmentData MENU + TITLES, LeadForm DEPARTMENTS ('Aesthetics'), TreatmentB comment,
tools/sticky-probe.mjs; site-meta regenerated (title "Aesthetics — Petals Health", description = the lead, canonical
/treatments/aesthetics/), sitemap lists /treatments/aesthetics/ only. Pills and sticky index: Template B derives
both from `groups.length > 1`, so with one track neither renders — decided: they go. Client item 18; item 16's
related-doctor proposal withdrawn. Verified: the old URL's static page lands on /treatments/aesthetics/; a host
serving index.html for the old path (SPA fallback) lands on /treatments/aesthetics/?x=1#top via the router; no
built HTML, sitemap or robots contains "Cosmetic Gynaecology" or the old slug; the rendered DOM of all 20 pages
contains it only as text in the two places the client said to leave — Home's For Her Health chip and the Women's
Care pillar — plus the Women's Care hero lead ("…fertility, cosmetic gynaecology, aesthetics…"), also text, also
copy, listed for the client. The real 301 is verified on the next staging deploy (the preview server cannot 301).

**1. Open hero.** treatment.css `.th--open`: the section is the gradient (radial 1100 px at 62 % 72 %, white →
#e3f2ff, fading to white over the last 90 px), the stage has no background or radius, `object-fit: contain` with
`object-position: var(--x) 100%` (x from the content file's photo.position; y always the bottom edge), the stage
runs to the viewport's edge on its side (`min(-gutter, (content-width − 100vw) / 2)`, `overflow-x: clip` on the
section for the scrollbar), copy centred, band height from the cut-out (520 / 560 / 620 px). Yoga: `blend: true` →
cover + a wide feathered radial mask. Audiology position '0% 100%'. The shelf (`.th` default) stays on About,
Clinics and Find a Doctor. Verified on all nine at 390 / 768 / 1366 / 1920: gradient hero, 0 px radius, contain
(cover for Yoga), image bottom = hero bottom at 768+ and = stage bottom at 390 with the copy below it, no horizontal
overflow. Sheets: open-hero-sheet.png (nine at 1366), open-hero-widths.png (1920 / 768 / 390).

**2. Sticky form.** `.tsplit` (grid: content column | 380 / 400 px aside) inside the page container after the hero;
`.tsplit__form` is `position: sticky; top: 58px` inside the aside, which stretches to the row, so it releases where
the content column ends; no JavaScript. Team band and the closing panel follow outside the split, full width. Form:
LeadForm `compact` (10 px gaps, 44 px inputs, 64 px textarea, 48 px Submit) = 616 px, Submit bottom at y652 at
1366 × 768; department = `c.department || c.title` (petals-ivf.js gets `department: 'Fertility Care'`); source
section treatment-sidebar. Removed: Template A's BeforeVisit band (now `Closing`: headline + Call + note at the end
of the column, no Book) and Template B's FAQ-and-form block (FAQ or package as `.tv--column` in the column). In-column
"book" links (IVF icon-grid CTA, the conversation panel's primary) point at #consult and focus the form (`focusForm`
click handler on the column). Bands inside the column become rounded, inset panels; grids 2 across (3 from 1440,
askSpan gained `three`); risks / feature / explained / featured / journey / why-choose / conversation reflowed.
Below 1024 the aside stacks after the column, before the team band. Verified: nine pages × 1366 and 1920 pinned at
58; nine × 390 and 768 inline after content, before team; shortest (Audiology, 3,270 px) and longest (Petals IVF,
7,930 px): form bottom = wrapper bottom = team top at the release point, Submit at 652 mid-scroll. Site-walk clean on
Women's Care, Petals IVF, Aesthetics, Audiology.

## Waiting for approval
**6. Clinics** — three directions in the report (one band per clinic, recommended; place cards; map first). Sticky
form: not recommended for this page. **7. About hero** — A / B / C built behind `?hero=a|b|c` (About.jsx, About.css,
default unchanged), captured with the 768 fold marked: design/render/live/about_hero_options.png. Recommended C.

# Round 4 — item 1: the treatment split uses the full width (2026-09-22)

**The gaps were the site's own container.** At 1920 `.inner` was 1440 wide (75 %), so 240 px sat dead either side; the
split then lost another 56 px to the grid gap and the content band's own rounded inset. Fixed at the site level, not
on this band: `--content-width` gains a step — 1176 at 1366, 1440 at 1440, **1600 at 1680+** — and every page reads it
through `.inner`, so the header, hero, body bands and footer moved together. Measured at 1920: header, main and footer
all span x160–1760 on all 20 pages, 0 with overflow or a mismatch.

**Running text does not follow the container.** `--measure: 52ch` (≈ 70 real characters — `ch` is the width of "0",
and Bricolage's digits run ~1.35× its average lowercase). Applied in the stylesheet that owns each rule, because the
component sheets load after base.css and were winning. tools/measure-check.mjs counts characters per *rendered line
box* on every page at 1366 / 1440 / 1680 / 1920: widest running-text block **70**, 0 over the 75 limit. One exemption,
reported rather than hidden: `.footer__copy`, the footer's one-line legal and address strip (13 px, the mock's own
single line) — capping it would wrap the footer bar to three lines.

**The split is now one composed block.** `.tsplit` bleeds to both viewport edges with `--bleed`
(`max(gutter, (100vw − content-width) / 2)`); the content column pads back onto the container grid, its bands keep
their tint but run edge to edge with no radius and no inset (no box inside a box); the form sits in a tinted rail that
carries to the right edge, separated by a hairline, **gap 0**. The rail is sized as
`form-w + rail-pad + bleed`, so the form card's right edge lands exactly on the container's right grid line — level
with "Ask a Doctor" above it. Measured: 1366 gap 0, band x0–787, rail x787–1366, card 440 px ending at 1271 =
container line 1271; 1440 card 460 ending at 1376 = 1376; 1920 card 480 ending at 1760 = 1760.

**The form carries weight.** Wider (440 / 460 / 480 px), heading 30–34 px, 16 px fields. Heights scale with viewport
height and keep a 44 px floor: `clamp(44px, 5.6vh, 58px)` inputs, `clamp(48px, 6.2vh, 62px)` Submit,
`clamp(62px, 9vh, 104px)` textarea, `clamp(10px, 1.45vh, 18px)` gaps. Pinned, measured on Women's Care and Petals IVF:
1366×768 form 656 px, Submit y638–686, 82 px clear; 1366×900 form 700 px, Submit y674–730, 170 px clear;
1920×1080 form 773 px, Submit y735–797, 283 px clear. Sticky release unchanged at 1366 / 1440 / 1920 on the shortest
(Audiology) and longest (Petals IVF) page: form bottom = wrapper bottom = team top.

Evidence: design/render/live/verify-item1.txt · womens-care_1920_before_after.png · wide-1920-sweep.png.

# Round 4 — item 2: About hero, option C built (2026-09-22)

Approved from the three mocked options (A the client's, B the overlapping card, C framed). The whole photograph on
the site's hero tint, framed (rounded, card shadow) beside the copy, both vertically centred; the shelf's 640–700 px
floor and bottom alignment are gone, so the band is as tall as the picture needs and no taller — which is what
removes the white void. The frame is the picture's own 4:3, so nothing is cropped. The A/B/C `?hero=` switch is gone.
Rules are written `.ah .th__stage.ah__stage` because the shared `.th__stage` rules in treatment.css load after
About.css in the built bundle and were otherwise winning (the photo kept the shelf's negative margin).

Verified at 390 / 768 / 1024 / 1366 / 1440 / 1920 — photo inside the container grid at every width, never bleeding;
rendered ratio 1.333–1.334 against a source ratio of 1.333, so the desk, the Petals wall and the patients are all in
frame uncropped; and the h1, lead, Book button and three clinic areas all end inside the first screen at every one
(at 1366×768 the last of them at y614 of 768; at 1920×1080 at y699 of 1080).
