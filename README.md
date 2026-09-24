# Petals Health website

The new website for Petals Health, a chain of family clinics in Kolkata (Kankurgachi, Loudon Street / Calcutta
Medical Centre, Tollygunge), plus a page for the planned clinic in Bangladesh. Built by Plan D Media from the
client's Canva design (the 22 SVG exports in this folder) and several rounds of client feedback since.

It is a static site: Vite + React 18, no backend and no CMS. Content lives in plain JS data files. Every page is
pre-rendered to its own `index.html` with its own title, description, canonical and Open Graph tags. The production
domain is assumed to be `https://www.petalshealth.in` (`app/src/config.js`, `SITE_URL`), which the client has not yet
confirmed.

## Layout

```
petals-web/
├── README.md                 this file
├── DESIGN-SPEC.md            what the Canva export contains, as measured (start here for design questions)
├── *.svg                     the client's original Canva exports, photos embedded (tracked; the only committed copy
│                             of the design photographs — do not delete)
├── split_svg.py              splits those SVGs into design/svg (lean) + design/assets (photos)
├── Bricolage_Grotesque/, Hind/, fonts/   font originals as delivered (OFL licences)
├── design/                   decision documents, mocks, reports (see below)
│   ├── svg/                  lean SVGs from split_svg.py (tracked)
│   ├── assets/               extracted photos (gitignored, but a SOURCE for app/tools/images.py — keep)
│   ├── mocks/                HTML concept mocks from past rounds (tracked)
│   └── render/               screenshots and gate captures (gitignored except render/2.png)
└── app/                      the site
    ├── src/
    │   ├── pages.js          every page: path, title, meta description, LCP image. The gate, sitemap and SEO read it
    │   ├── routes.jsx        path → page component
    │   ├── config.js         site switches: form endpoint, GTM id, hero video, SXO agent, staging flag
    │   ├── pages/            page components (About, Clinics, FindDoctor, DoctorProfile, Treatment, Bangladesh, 404)
    │   ├── templates/        the shared treatment-page template
    │   ├── components/       Header (nav, drawer, action bar, rail), Footer, DoctorCard, LeadForm, FormDialog, …
    │   ├── content/          page copy (treatments/*.js, bangladesh.js, team.js, sxo.js)
    │   ├── data/             doctors.js (the doctor list), clinics.js (the three clinics)
    │   ├── forms/submit.js   the one lead-form handler (validation, spam check, POST, retry queue)
    │   ├── search/           site search: engine.js (index + matcher), synonyms.js
    │   ├── styles/           tokens.css (design tokens), base.css, states.css
    │   └── generated/        written by tools (site-meta.js, search-treatments.js, images.json) — committed
    ├── public/               static files (images, fonts, videos, privacy-policy.html)
    ├── tools/                build, gate, checks and one-off scripts (see "Tools")
    ├── middleware.js         staging-only basic auth (Vercel)
    ├── vercel.json           production Vercel config (redirects)
    └── vercel.staging.json   staging Vercel config (noindex headers)
```

## Running it

Requirements: **Node 22** (`engines` in package.json), **Google Chrome** at
`C:\Program Files\Google\Chrome\Application\chrome.exe` (the checks drive it through puppeteer-core; the path is
hard-coded in the tools), and Python 3 with Pillow and fontTools, needed only to regenerate images or fonts.

```sh
cd app
npm ci                 # once
npm run dev            # Vite dev server with hot reload (http://localhost:5173)
npm run build          # gen-meta → vite build → postbuild: dist/ with one index.html per page, sitemap, robots, 404
```

`npm run build` is what production and the gate use. `dist/` is emptied on every build.

### Preview server (built site on port 4173)

`tools/serve.mjs` serves `dist/` the way a production host does: the page's own file first, then the SPA fallback
with a 404 status, gzip on. The daemon wraps it in a detached supervisor that restarts it if it dies and survives
the terminal closing:

```sh
cd app
npm run build
node tools/serve-daemon.mjs start     # → http://127.0.0.1:4173, log in app/.serve/log
node tools/serve-daemon.mjs status
node tools/serve-daemon.mjs stop
```

The server reads `dist/` on each request, so a rebuild shows up without a restart. For a one-off in the foreground,
use `node tools/serve.mjs [port]`.

## The commit gate

Every commit runs a build and a layout check of every page. **If any check fails, the commit is refused.**

- Install it once per clone: `sh app/tools/install-hooks.sh`, which writes `.git/hooks/pre-commit`. Hooks are not
  cloned with the repo, so a fresh clone has no gate until you run this.
- The hook runs `node app/tools/gate.mjs`. It runs `npm run build`, serves `dist/` on a private port (4199), then runs
  `tools/layout-check.mjs` on every page in `src/pages.js` plus the 404 route, at **390, 768, 1024, 1280, 1366 and
  1920** px. It checks structure, overlap, horizontal overflow, interaction, type sizes, console errors and failed
  requests. The output ends in `GATE: green` or `GATE: FAILED`.
- Captures are written to `design/render/check/` (gitignored, rewritten on every run).
- To check one page without committing: `node tools/gate.mjs /about/`. **From Git Bash, prefix the command with
  `MSYS_NO_PATHCONV=1`**, and do the same for `git commit`. Otherwise MSYS rewrites `/about/` into a Windows path and
  the check fails with "Cannot navigate to invalid URL". Any tools script that takes a site path needs the same prefix.
- Do not bypass the gate with `--no-verify`. If it is red, fix the page.
- Generated files are committed (`src/generated/*`). If you change `src/pages.js` or a treatment's content, run
  `npm run build` before staging, so the regenerated `site-meta.js` / `search-treatments.js` go into the same commit.
  The gate rebuilds them but does not stage them.

## Staging

A private copy of the site for the client to review, hosted as the Vercel project `petals-health-staging`:

- URL: https://petals-health-staging.vercel.app
- Sign-in: HTTP basic auth. The user and password are in `app/.staging.json` (gitignored) and in the Vercel project's
  environment (`STAGING_USER` / `STAGING_PASS`). They are never committed.
- Built with `npm run build:staging` (`STAGING=1`, `VITE_STAGING=1`). Every page is `noindex, nofollow` (meta tag and
  `X-Robots-Tag` header), `robots.txt` disallows everything, there is no sitemap, analytics never loads, a preview
  ribbon shows, and **forms are always simulated**: the endpoint is hard-wired to the placeholder and the
  `?leadEndpoint=` test hook is compiled out, so nothing reaches a real inbox or sheet.
- Redeploy: `cd app && npm run deploy:staging` (requires `npx vercel login` to the account that owns the project).
  First-time setup on a new machine: `node tools/deploy-staging.mjs --setup`.
- Check a staging build locally: `node tools/staging-check.mjs`.
- `middleware.js` does nothing when `STAGING_USER` / `STAGING_PASS` are unset, so the same code is safe in production.

Staging does not update itself when you push. Redeploy after each round you want the client to see.

## Design decision documents

Read these before changing anything visual. Settled decisions are not reopened. A revision gets a new dated entry.

| Document | What it holds |
|---|---|
| `DESIGN-SPEC.md` | The measured contents of the Canva export: page inventory, what `split_svg.py` extracted, sizes, positions, colours and fonts as read from the files. Anything unmeasurable is marked unknown. The factual base for everything else. |
| `design/tokens.md` | The colour palette and design tokens (approved 2026-09-12 to 14). There is no client brand guideline; the Canva design is the source of truth for colour and this consolidation is our decision. Mirrored in `app/src/styles/tokens.css`. |
| `design/type-scale.md` | The type scale (approved 2026-09-14): Bricolage Grotesque throughout, with Lora for the Home stat numbers and Playfair Display for monogram initials (standing in for Canva-only fonts); the testimonial quote set upright because no italic exists; Canva points × 4/3 = CSS px at the 1366 canvas; weights and line heights; the 13 px readability floor. |
| `design/treatment-redesign.md` | The running record from 2026-09-21 on: the treatment-page audit and redesign (Templates A and B), staging and the SXO agent, About Us, Find a Doctor / doctor profile / Clinic Location, the client round of 2026-09-22 and round 4. For each: what was wrong, the direction, what was approved and what was built. |
| `design/client-requests.md` | What we need from the client, numbered 1–21 and written to be sent to them. The single list of open client items. |
| `design/decisions.md` | The settled site-wide decisions table (layout width, spacing, motion, one doctor card, container ladder, measure…). Check it before proposing anything site-wide. |

Other files in `design/` are the records behind earlier rounds: `round2-report.md`, `round3-report.md`,
`review-2026-09-19.md`, `polish-proposals.md`, `forms.md`, `mobile-approach.md`, `nav-dropdown.md`,
`doctor-schema.md`, `video-options.md`, `pdf-vs-svg.md`, the section value sheets and others. Most are cited from the
five documents above.

## Working conventions

- **Copy is verbatim from the client.** We do not invent facts: hours, addresses, doctor details, claims. Where
  something is missing the page shows a "Copy pending" tag and the gap goes into `design/client-requests.md`.
  Client typos are kept as designed until the client confirms a correction (item 10 onward).
- **Unverifiable claims are held**, not published ("most trusted", "renowned"…), and sent back to the client.
- One lead-form handler (`src/forms/submit.js`) and one endpoint (`config.js` → `FORM_ENDPOINT`). While it says
  `PLACEHOLDER`, submissions are simulated and logged to the console.
- Doctors come from one list (`src/data/doctors.js`) and render through one component (`DoctorCard`).
- The site's phone number is 9147405955.

## Still pending from the client

The full list, with the detail to send, is `design/client-requests.md`. In short:

| # | Item | What it blocks |
|---|---|---|
| 1 | Apps Script URL + recipient emails for the forms | every form: submissions are simulated until then |
| 2 | Hero video (16:9, 10–15 s loop) | Home hero shows a placeholder clip |
| 3 | The doctor sheet + one photograph per doctor | Find a Doctor, profiles, treatment teams (7 placeholder doctors, languages placeholder so the language filter is hidden) |
| 4 | Clinic exterior/reception and lifestyle photographs | image quality across the site |
| 5 | Real patient stories with permission | Home testimonials are labelled placeholders |
| 6 | Privacy policy text | the consent link points at an interim page |
| 7 | Tenth treatment? Other dropdowns? WhatsApp number? | nav |
| 8 | Home H1 wording; "Caring for All" block text; what "IWC" means | Home |
| 9–13 | Spelling and content-mix-up confirmations (treatments, About, clinics) | kept as designed until confirmed |
| 14 | Doctor details, the "100+ doctors" figure, "FROM 1012" | Find a Doctor, profiles |
| 15 | Page titles/descriptions review; GTM / GA4 id; final domain | SEO, analytics (events are recorded but not sent) |
| 16 | Stand-in doctors on treatment pages without a specialist; "start here" cards | treatment pages |
| 17 | Sources for two About Us claims; careers email | About Us |
| 18 | Aesthetics headline, lead and package; cosmetic-gynaecology mentions elsewhere | Aesthetics |
| 19 | Clinic opening hours; clinic FAQ answers 2–5 | Clinic Location |
| 20 | Permission to host the ISO certificates; which of six old-site pages to port | footer (15 of 19 links have no page yet) |
| 21 | Bangladesh: address, opening date, hours, doctors, how bookings work, reworded claims, original photos | Bangladesh page |

Also waiting on us or on an internal decision:
- search synonyms (`src/search/synonyms.js` is empty until the approved list is added)
- how the Kolkata contact chrome should behave on the Bangladesh page

## Tools

In `app/tools/`. The ones you will use:

| Script | Purpose |
|---|---|
| `gate.mjs` | the commit gate (build + layout-check on every page) |
| `layout-check.mjs` | the per-page check at six widths; `node tools/layout-check.mjs /path` against `CHECK_BASE` |
| `install-hooks.sh` | installs the gate as the pre-commit hook |
| `serve.mjs`, `serve-daemon.mjs` | preview server and its supervisor |
| `gen-meta.mjs`, `postbuild.mjs` | build steps (part of `npm run build`) |
| `staging-build.mjs`, `deploy-staging.mjs`, `staging-check.mjs` | staging |
| `images.py` (+ `img-manifest.json`, `img-measure.mjs`) | regenerates `public/` images (WebP + fallback) from `design/assets` originals: `python tools/images.py` |
| `fonts.py` | subsets the fonts in `public/fonts` (the unsubset originals are kept in `public/fonts/src/`) |
| `site-walk.mjs`, `kb-walk.mjs`, `measure-check.mjs`, `meta-check.mjs`, `perf-all.mjs`, `shot.mjs`, `slice.mjs` | ad-hoc checks and screenshots (captures go to `design/render/`) |

The rest are one-off demos and diagnostics from earlier rounds. Several are cited as evidence in the design documents.
