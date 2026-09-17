# Forms — shared handler, destination, and what the client must supply (2026-09-17)

## Decision
Every form on the site (Book an Appointment, Request a Call Back, Book a Consultation on clinic/treatment pages, the
SXO agent) posts to **one Google Apps Script web app**, which appends a row to a Google Sheet and sends an email
notification. Same pattern as our other landing-page builds.

## Build
- `app/src/config.js` — `FORM_ENDPOINT` (one place; currently `…/PLACEHOLDER/exec`, so submissions are simulated and
  logged to the console) and `PRIVACY_URL` (consent link; page not yet written).
- `app/src/forms/submit.js` — validation (name ≥ 2 chars; Indian mobile 10 digits starting 6–9 with optional +91/0;
  email format if given; age 0–120; date not in the past; consent required), spam guard (hidden honeypot field and a
  3-second minimum open time; bots get a quiet "success"), payload with a `source` block (form, page, section, doctor,
  URL) and `submittedAt`, POST as text/plain JSON (Apps Script answers no CORS preflight, so the request must stay
  "simple"), 12 s timeout, and a retry queue: a failed send keeps the data on screen with a retry button and stores the
  payload in localStorage; queued payloads are re-sent on the next page load.
- `app/src/components/LeadForm.jsx` — the one form; presets pick the fields (book-appointment, request-callback,
  book-consultation, sxo-agent); states idle → sending (button disabled, spinner, no double send) → thank-you | error.
  Consent checkbox with the privacy link on every preset.
- `app/src/components/FormDialog.jsx` — one modal mounted once in App; any element with `data-form="<preset>"` opens
  it (hero buttons, sticky nav CTA, utility "Book an Appt", doctor cards with `data-doctor`, health-card button, closing
  band). Native dialog: focus trapped, Escape closes, focus returns to the opener.
- Verified in Chrome (`app/tools/form-demo.mjs`, captures in `design/render/forms/`): validation messages, bad email,
  too-fast guard, sending state, simulated success with the payload logged, Escape/return focus, dead-endpoint error
  with data kept and the payload queued, doctor preselected from a card, source block present. No page errors.

## Apps Script contract (for whoever deploys it)
`doPost(e)`: `JSON.parse(e.postData.contents)` → append a row with the fields below → `MailApp.sendEmail(...)` →
return `ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(JSON)`. Deploy as a web app,
"Execute as: me", "Who has access: Anyone". Columns: submittedAt, source.form, source.page, source.section,
source.doctor, name, mobile, email, gender, age, doctor, date, message, consent, consentText, source.url, site.

## Still needed from the client
1. The deployed Apps Script web-app URL.
2. The recipient email address(es) for the notification.
3. Privacy policy text (the consent line links to `/privacy-policy`, which does not exist yet).
