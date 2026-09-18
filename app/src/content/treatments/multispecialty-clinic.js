// Multispecialty Clinic — Template A + a "flagship" block ("Cardiology, in depth"), design/svg/15.svg.
// CONTENT ERRORS in the mock, verified (design/client-requests.md):
//   1. The hero's tagline "Trusted Care for, Healthier Smiles" is the Dentistry page's. Built WITHOUT a tagline (the
//      plainly intended page has none; the Dentistry line is kept as `taglineFromMock`, not rendered).
// Spelling flagged: "Multi Specality Clinic" (headline; the nav says "Multispecialty Clinic"), "Book your appoinment".
export default {
  slug: 'multispecialty-clinic',
  template: 'A',
  title: 'Multispecialty Clinic',
  hero: {
    headline: ['Multi Specality Clinic'],
    lead: "From a child's fever to a parent's heart health, our family medicine team gives you a consistent point of contact — with cardiology at the centre of what we do.",
    cta: { label: 'Book your appoinment', form: 'book-appointment' },
    photo: { src: '/assets/treatments/multi-hero.png', mask: '/assets/treatments/multi-hero-mask.png', alt: 'A doctor talking with a three-generation family on a sofa', position: '60% 40%' },
    photoSide: 'right',   // the mock puts the copy left and the photo right on this page
  },
  taglineFromMock: 'Trusted Care for, Healthier Smiles',
  intro: 'Family medicine at Petals Health covers the everyday and the ongoing: general consultations, chronic condition management, and preventive screening, all coordinated by doctors who know your history. Heart health is where we go deepest — our cardiology track is built for early detection and long-term management, not just one-off checks.',
  gridStyle: 'tiles',
  serviceLabel: 'Vertical',   // the mock labels each tile "Vertical" and the first "Flagship"
  services: [
    { title: 'Cardiology', text: 'Heart health screening, hypertension management, and ongoing cardiac care.', flagship: true, label: 'Flagship' },
    { title: 'General Physician Consultations', text: 'A consistent doctor for everyday illness, referrals, and health concerns.' },
    { title: 'Diabetes & Metabolic Health', text: 'Blood sugar management, metabolic screening, and lifestyle planning.' },
    { title: 'Gastroenterology', text: 'Expert care for digestive health, including treatment for conditions like acid reflux, IBS, and liver disease.' },
    { title: 'Urology', text: 'Specialised care for urinary and reproductive health, from kidney stones to prostate concerns.' },
    { title: 'Internal Medicine', text: 'Comprehensive treatment for a wide range of chronic and acute conditions affecting adults.' },
    { title: 'Mental Health', text: 'Support for emotional and psychological well-being, including counselling and treatment for mental health disorders.' },
    { title: 'Geriatrics', text: 'Healthcare for elderly individuals, focusing on ageing-related issues and maintaining quality of life.' },
    { title: 'General Surgery', text: 'Skilled surgical interventions for a variety of conditions, from minor procedures to major surgeries.' },
  ],
  flagship: {
    eyebrow: 'Flagship',
    heading: 'Cardiology, in depth',
    lead: 'Heart disease develops quietly, so our cardiology consultations are built around early detection and a plan you can stick to from a first blood-pressure check through years of follow-up care.',
    services: [
      { title: 'ECG & Cardiac Risk Screening', text: 'Resting ECG and structured risk assessment as part of routine or preventive check-ups.' },
      { title: 'Echocardiography Referral', text: 'Coordinated referrals for echo and further cardiac imaging when needed.' },
      { title: 'Family Risk Assessment', text: 'Screening that accounts for family history, especially with a parent or sibling with heart disease.' },
      { title: 'Blood Pressure Management', text: 'Ongoing monitoring and treatment plans for hypertension, tailored to your history.' },
      { title: 'Cholesterol & Lipid Review', text: 'Lab-guided review of cholesterol levels with practical, sustainable lifestyle guidance.' },
      { title: 'Cardiac Diet & Lifestyle Counselling', text: 'Practical guidance on diet, activity, and habits that affect heart health.' },
      { title: 'Post-Event Follow-up', text: 'Structured follow-up care after a cardiac diagnosis, procedure, or hospitalisation.' },
      { title: 'Arrhythmia Evaluation', text: 'Referral pathways for irregular heartbeat and further specialist evaluation.' },
    ],
  },
  closing: {
    headline: ['Talk to a family medicine doctor,', 'starting with your heart health'],
    call: { label: 'Call  9147 405 955', href: 'tel:9147405955' },
    book: { label: 'Book Online', form: 'book-appointment' },
    style: 'light',   // the mock's closing band on this page is white with navy text and an outlined navy button
  },
  specialtyId: 'cardiology',
}
