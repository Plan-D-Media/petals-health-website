// Diagnostic Services — copy VERBATIM from the client's page https://www.petalshealth.in/diagnostic-clinic-kolkata/
// (fetched 2026-10-30): the h1, the twenty services in the client's order (no grouping — the client wrote no group
// labels; asked in design/client-requests.md item 22) and the FAQ. Nothing is written by us, inferred from the Kolkata
// clinics or borrowed from the treatment pages. Spelling, capitals and "kolkata" in lower case are the client's.
// Held, not published (2026-10-30 decision: hold the sentence, not the paragraph) — each renders as a copy-pending
// marker in its place and is listed in item 22:
//   superlatives — "the leading pregnancy test centre in kolkata", "a renowned thyroid USG test centre",
//     "a thorough and finest soft tissue USG scan", "with great accuracy";
//   staffing claims — "Our female specialists" (breast), "our vascular specialists", "Our expert doctors in the
//     sonohysterography test centre";
//   FAQ facts that conflict with the rest of the site or cannot be checked — the hours, "emergency services available
//     24/7", the phone number 1800 1205 1600 (every other page gives 9147405955), confirmation "within 2 hours" (the
//     site says within an hour), "most diagnostic reports are available on the same day". Three answers are held whole.
// Not used: the page's meta description ("a reputed Diagnostic Clinic", "State-of-the-art facilities", and a third
// number, 9147405960) and the old site's shared popups (consultation form, consent text, Razorpay terms).
// Missing on the client's page, so copy-pending: an introduction under the h1, prices, turnaround times, preparation
// notes, and which clinic offers which test.

const held = (text, why) => ({ held: text, why })
const SUPERLATIVE = 'Held: an unverifiable superlative (design/client-requests.md item 22)'
const STAFFING = 'Held: a staffing claim we cannot verify (design/client-requests.md item 22)'

export const DIAGNOSTICS = {
  slug: 'diagnostic-services',
  title: 'Diagnostic Services',   // h1
  // each service: the client's h2 and its paragraph, as parts — a string is published, held() is not
  services: [
    { id: 'pregnancy-scans', title: 'Pregnancy Scans', parts: [held('Ensure your baby’s well-being with accurate pregnancy scans at Petals Health, the leading pregnancy test centre in kolkata.', SUPERLATIVE), 'We use advanced ultrasound technology to monitor foetal growth, development and health and identify potential complications. Book precise pregnancy scans in Kolkata online today.'] },
    { id: 'fetal-diagnosis', title: 'Fetal Diagnosis', parts: ['Our comprehensive fetal diagnosis in Kolkata helps detect abnormalities in fetal growth and help doctors take timely interventions for a better pregnancy journey. Call us to schedule your scan in our fetal diagnosis test centre in kolkata.'] },
    { id: 'abdominal-usg', title: 'Abdominal USG', parts: ['Diagnose abdominal conditions of your liver, gallbladder, pancreas and other abdominal organs timely with non-invasive, advanced abdominal USG scan in Kolkata. It is safe, fast and accurate in detecting liver, kidney, or digestive health issues.'] },
    { id: 'transvaginal-usg', title: 'Transvaginal USG', parts: ['A transvaginal USG in our transvaginal USG test centre in Kolkata provides clear and detailed images of gynaecological health by using advanced imaging techniques. Internal ultrasound examinations are vital for the early detection of reproductive conditions for accurate and timely treatments. Consult our experts for professional and accurate transvaginal USG scan in kolkata.'] },
    { id: 'kidney-usg', title: 'Kidney USG', parts: [held('Kidney ultrasound scans detect stones, cysts, infections, abnormalities and other renal conditions with great accuracy.', SUPERLATIVE), 'The test is non-invasive and safe. Book an appointment for a quick kidney USG scan in Kolkata and treatment recommendations from our specialist consultants.'] },
    { id: 'soft-tissue-usg', title: 'Soft tissue USG', parts: ['Our trained medical experts in our soft tissue test centre in Kolkata examine muscles, tendons, and ligaments using soft tissue USG to diagnose injuries and conditions that affect mobility and hamper comfort.', held('Contact us for a thorough and finest soft tissue USG scan and expert care in kolkata.', SUPERLATIVE)] },
    { id: '3d-4d-usg', title: '3D/4D USG', parts: ['Get detailed imaging of your baby in real time with our advanced 3D/4D ultrasound scanning technology. These scans offer a unique bonding experience while assessing fetal health. Create precious memories with our accurate 3d/4d USG scan in kolkata whilst ensuring your baby’s healthy development.'] },
    { id: 'breast-usg', title: 'Breast USG', parts: ['Routine breast ultrasounds help in the early detection of abnormalities and in maintaining breast health using non-invasive techniques.', held('Our female specialists perform thorough breast USG scans in a comfortable, private setting in Kolkata.', STAFFING), 'Breast USG is ideal for regular screening or diagnosing specific concerns.'] },
    { id: 'pelvic-usg', title: 'Pelvic USG', parts: ['Our comprehensive pelvic USG scan in Kolkata examines reproductive organs and surrounding structures for accurate diagnosis. It helps doctors monitor reproductive health, fibroids or cysts with a safe pelvic ultrasound.'] },
    { id: 'thyroid-usg', title: 'Thyroid USG', parts: [held('Advanced thyroid ultrasound at Petals Health, a renowned thyroid USG test centre in Kolkata, helps evaluate gland size, structure and potential abnormalities precisely.', SUPERLATIVE), 'This painless scan also detects nodules or irregularities in the thyroid gland.'] },
    { id: 'doppler-usg', title: 'Doppler USG', parts: ['A specialised blood flow assessment that helps evaluate blood flow and vascular health. This also diagnoses circulation issues and monitors treatment progress using Doppler ultrasound. Our doppler USG scan in Kolkata is crucial for diagnosing circulatory issues or monitoring pregnancies.'] },
    { id: 'vascular-usg', title: 'Vascular USG', parts: ['Identify blood vessel abnormalities like blockages or clots with a vascular ultrasound. This safe and reliable test helps in timely treatment.', held('Schedule your vascular USG scan in Kolkata with our vascular specialists for a comprehensive circulatory health assessment.', STAFFING)] },
    { id: 'gynaecological-test', title: 'Gynaecological Test', parts: ['Our experts perform comprehensive women’s health assessments in our gynaecological test centre in Kolkata using advanced diagnostic tools for accurate results. Book your appointment for thorough examinations in a comfortable, private setting.'] },
    { id: 'follicular-scan', title: 'Follicular Scan', parts: ['Track ovulation and monitor ovarian follicles with a follicular scan. Our follicular scan in Kolkata supports fertility planning or treatment, helping you with your family-building journey.'] },
    { id: 'fertility-test-men', title: 'Fertility Test (Men)', parts: ['We provide a complete fertility test for men in Kolkata, including detailed semen analysis and hormone testing. Fertility test helps in understanding male reproductive health and getting proper treatments.'] },
    { id: 'fertility-test-women', title: 'Fertility Test (Women)', parts: ['Get comprehensive female fertility testing done under one roof in our fertility test centre for women in Kolkata, including hormone analysis and ovarian reserve assessment. Schedule your consultation for detailed evaluation and tailored treatment recommendations.'] },
    { id: 'tubal-patency-test', title: 'Tubal Patency Test', parts: ['We provide quality tubal patency tests in Kolkata to assess fallopian tube health and checks for blockages in the fallopian tubes, which is crucial for successful conception.'] },
    { id: 'sonohysterography', title: 'Sonohysterography', parts: ['We scan a detailed view of uterine health with sonohysterography, a specialised ultrasound for detecting polyps, fibroids or uterine cavities.', held('Our expert doctors in the sonohysterography test centre in Kolkata use ultrasound and saline solutions to diagnose precisely during this examination.', STAFFING)] },
    { id: 'anomaly-scan', title: 'Anomaly Scan', parts: ['Our anomaly scan in kolkata test provides a detailed examination of your baby’s development between 18-23 weeks for comprehensive health screening.'] },
    { id: 'msk-usg', title: 'MSK USG', parts: ['Musculoskeletal ultrasound diagnoses joint, muscle and tendon conditions with accuracy. Book your MSK USG scan in Kolkata ultrasound today.'] },
  ],
  // the FAQ in the client's order; a = null holds the whole answer (the shared Faq component counts it as pending)
  faq: {
    title: 'FAQs',
    items: [
      { q: 'What are your diagnostic service hours?', a: null },          // HELD: 8 AM–8 PM Mon–Sat, Sundays by appointment, "emergency services available 24/7"
      { q: 'How do I book an appointment?', a: null },                    // HELD: phone 1800 1205 1600; "confirms appointments within 2 hours"
      { q: 'Are same-day reports available?', a: null },                  // HELD: "most diagnostic reports are available on the same day"
      { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, cash and UPI payments for diagnostic services. Our easy billing ensures a smooth experience during your visit.' },
      { q: 'Are your services available for children?', a: 'Yes. We offer diagnostic services for all age groups, including paediatric ultrasounds. Let our team know if a child-specific scan is needed.' },
    ],
  },
  related: ['womens-care', 'petals-ivf', 'child-care'],
}
