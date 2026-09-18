# The three nav pages without a mock — what each needs before it can be built (2026-09-18)

Diagnostic Services, For Patients and Petals Clinic in Bangladesh sit in the main navigation but have no page in the
Canva export or the PDF. They stay as dead links until the client answers the questions below. Each can be built in
under a day once the inputs arrive; the template choice is a recommendation, not a decision.

## 1. Diagnostic Services
Purpose (assumed): the lab and imaging offer — what tests, where, home collection, how to book, how reports arrive.
Needs from the client:
- The list of services grouped as they sell them (pathology, imaging/ultrasound, cardiac tests, health packages),
  with 1–2 lines each and any prices they want shown. The About page mentions NABL-certified laboratories and
  women's imaging led by radiologists and fetal-medicine specialists — confirm those claims for this page.
- Which clinics offer which service; home blood collection area and hours; how to upload a prescription (the
  footer has "Upload Prescription" — is that a form, WhatsApp, or an app?).
- Turnaround and report delivery (app / email / WhatsApp / collect).
- Photos of the lab or imaging suite, or say "use the treatment-page style".
Build recommendation: Template A (hero with photo, intro, service tiles grid, closing band) plus a "Book a test /
Upload prescription" form using the existing lead form with a "test" field. If health packages have prices, a
Template B card group with a price line per card.

## 2. For Patients
Purpose (assumed): the practical pages a patient looks for before and after a visit. The footer already names most
of them: Clinic Guide, Know your Tests, Health Packages, Upload Prescription, Petal's App & Community, Vlogs.
Needs from the client:
- Which items belong under For Patients (it has a dropdown chevron in the design — the list is the open question
  from item 7 of the request list).
- For each item, whether it is a page, an external link (the app store, YouTube) or a form; and its copy.
- The Family Health Card text ("Your family's health, in your pocket" and the four benefits) is in the About/Clinics
  PDF but on no mock page — confirm it belongs here.
- Insurance / payment / cancellation policies if they want them stated.
Build recommendation: a hub page (Template A intro + tiles, each tile a link to the sub-page) with the sub-pages as
simple text pages on the About page's column style; the Health Card as a Template B card group.

## 3. Petals Clinic in Bangladesh
Purpose (assumed): a location/partner page for a clinic outside Kolkata.
Needs from the client:
- Whether it is a Petals-run clinic, a franchise or a partner; its name, address, phone, WhatsApp, hours, map link.
- Services offered there (same list as Kolkata, or a subset) and the doctors (same sheet format as item 3, with a
  clinic id we add to the data file — the Find a Doctor filters pick it up automatically).
- Whether visitors book through the same form and phone number or a Bangladesh contact; currency if prices appear.
- Two or three photographs of the clinic.
Build recommendation: the Clinic Location page's pattern (photo tiles, clinic card with Get Direction / Book Here,
FAQ + consultation form) with a doctors row from the data file filtered to that clinic. Adding the clinic to
`CLINICS` and `SITES` is the only data change.

## Until then
Each of the three nav items links to "#" and is listed as pending in design/client-requests.md item 7. If the
client prefers, any of them can be built from the template with "copy pending" tags now and filled later.
