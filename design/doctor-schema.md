# Doctor data — schema and spreadsheet template (2026-09-17)

Every doctor component (Home carousel, Find a Doctor, profile page) reads `app/src/data/doctors.js`. The client's
spreadsheet is converted to that file by a script once it arrives; nothing in the components changes.

## Spreadsheet template — one row per doctor

| Column | Required | Format / example | Notes |
|---|---|---|---|
| Full name | yes | Dr. Smita Gutgutia | with "Dr." |
| Qualifications | yes | MBBS; MD (Obstetrics & Gynaecology); FRCOG | semicolon-separated, in the order to display |
| Designation | yes | Senior Consultant | one line |
| Specialty | yes | Gynaecology & Obstetrics | the department shown on the card; one value |
| Clinic 1 · Days · Timings | yes | Loudon Street (CMC) · Mon, Wed, Fri · 10 am – 4 pm | one clinic per column group; up to three groups (Clinic 2, Clinic 3) |
| Languages | yes | Bengali; Hindi; English | semicolon-separated |
| Video consult | yes | Yes / No | |
| Rating | optional | 4.8 | one decimal; leave blank if none |
| Review count | optional | 132 | whole number |
| Bio | yes | 2–4 sentences | plain text, no bullet points |
| Personal quote | optional | one sentence in the doctor's words | shown on the profile page |
| Treatment tags | yes | Pregnancy Care; High-Risk Pregnancy; IVF | semicolon-separated; these become the search filters — use the same wording across doctors |
| Education history | optional | MBBS, Calcutta Medical College, 2004; MD, IPGMER, 2009 | semicolon-separated entries, each "degree, institution, year" |
| Photograph | yes | file name, e.g. smita-gutgutia.jpg | see photo spec below |
| Experience (years) | optional | 18 | not requested but every reference site shows it; include if available |
| Registration number | optional | WBMC 12345 | shown on the profile page if supplied |

## Photo spec
Head-and-shoulders, facing camera, same plain pale backdrop for every doctor, colour, 1000 × 1250 px minimum
(4:5 portrait), JPEG, subject centred with the head in the top third. Named as the Photograph column.

## What the mock gives us today (placeholder)
Eight listings from the Find a Doctor mock with name, specialty, clinic and timings only. Two source errors are
logged for the client: Dr. Smita Gutgutia appears twice (Loudon Street and Tollygunge) with a male photograph on
the second listing — modelled as one doctor with two clinics; and Dr. Sunil Agarwal's "12 am – 2 pm" is entered as
12 pm. Days are not given in the mock, so every session is Mon–Sat until the sheet arrives.

## Field map (spreadsheet → data file)
name, qualifications[], designation, specialty, specialtyId (derived), sessions[{clinicId, days[], from, to}],
languages[], videoConsult, rating, reviewCount, bio, quote, treatmentTags[], education[{degree, institution, year}],
photo, experienceYears, registrationNo.
