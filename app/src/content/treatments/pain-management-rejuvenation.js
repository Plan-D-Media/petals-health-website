// Pain Management & Rejuvenation — Template A (design/svg/17.svg). Copy verbatim from the mock.
// Mock copy errors, kept and flagged (design/client-requests.md): "Rejuvination" in the headline; "Book your appoinment";
// "on it's own" (should be "its own").
export default {
  slug: 'pain-management-rejuvenation',
  template: 'A',
  title: 'Pain Management & Rejuvenation',
  hero: {
    headline: ['Pain Management', '& Rejuvination'],
    tagline: 'Pain relief with a plan, not just a prescription.',
    lead: "For pain that's stuck around too long — back, joints, pregnancy, or recovery after surgery — we look for the cause, not just the symptom.",
    cta: { label: 'Book your appoinment', form: 'book-appointment' },
    photo: { src: '/assets/treatments/pain-hero.png', mask: '/assets/treatments/pain-hero-mask.png', alt: 'A woman holding her lower back and neck', position: '50% 20%' },
  },
  intro: 'Chronic and persistent pain deserves more than a repeat prescription. Our pain management consultations start with understanding what\'s driving the pain, then build a plan that may combine medication, physiotherapy referral, and targeted intervention — including care built specifically around pregnancy.',
  gridStyle: 'tiles',   // the mock's flush 3-column tiles (no card outline), vs Child Care's outlined cards
  services: [
    { title: 'Back & Neck Pain', text: 'Assessment and treatment for chronic back, neck, and postural pain.' },
    { title: 'Joint Pain', text: 'Management of knee, shoulder, and other joint pain, including arthritis-related pain.' },
    { title: 'Pregnancy-Related Pain Management', text: 'Relief for back, pelvic, and joint pain that develops during pregnancy, coordinated with your obstetric care.' },
    { title: 'Post-Surgical Pain Care', text: 'Structured pain management following surgery, coordinated with your surgical team.' },
    { title: 'Physiotherapy Referral', text: 'Coordinated referrals to physiotherapy for pain that needs hands-on rehabilitation.' },
    { title: 'Interventional Pain Relief', text: "Referral for injection-based and other interventional options when conservative care isn't enough." },
  ],
  closing: {
    headline: ['Get a plan for pain that', "hasn’t gone away on it’s own"],
    call: { label: 'Call  9147 405 955', href: 'tel:9147405955' },
    book: { label: 'Book Online', form: 'book-appointment' },
  },
  specialtyId: 'pain-management',
}
