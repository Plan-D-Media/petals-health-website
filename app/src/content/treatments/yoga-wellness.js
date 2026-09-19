// Yoga & Wellness — Template A + a "feature" block (photo pair + heading + bullets), design/svg/16.svg.
// CONTENT ERRORS in the mock, verified against the export (design/client-requests.md):
//   1. The intro paragraph is the Multispecialty Clinic's ("Family medicine at Petals Health … cardiology track …") pasted
//      verbatim — nothing on this page is about cardiology. Built as: NO intro paragraph (the hero lead carries the
//      page); the pasted text is kept below as `introFromMock` for the record and is not rendered.
//   2. Card 4 is titled "Post-Surgical Pain Care" (copied from the Pain Management page) over nutrition text. Built with
//      the text it carries and the title marked pending — the plainly intended title is something like "Prenatal
//      Nutrition Guidance", which is not ours to write.
// Spelling flagged: "Yoga & Welness" (nav label in the dropdown mock; this page's headline spells it correctly),
// "Book your appoinment". The lead's "real schedules not a studio ideal" reads as if a dash is missing — flagged.
export default {
  slug: 'yoga-wellness',
  template: 'A',
  title: 'Yoga & Wellness',
  hero: {
    tagline: ['Movement and calm,', 'built into your care.'],    // navy, above the accent headline (the mock's order)
    headline: ['Yoga & Wellness'],
    headlineAccent: true,
    lead: 'Guided yoga and wellness sessions designed around real bodies and real schedules not a studio ideal.',
    cta: { label: 'Book your appoinment', form: 'book-appointment' },
    photo: { src: '/assets/treatments/yoga-hero.jpg', alt: 'A woman seated in a meditation pose', position: '78% 60%' }   /* the source is a wide 1919 × 820 frame with the subject right of centre */,
  },
  intro: null,
  introFromMock: 'Family medicine at Petals Health covers the everyday and the ongoing: general consultations, chronic condition management, and preventive screening, all coordinated by doctors who know your history. Heart health is where we go deepest — our cardiology track is built for early detection and long-term management, not just one-off checks.',
  feature: {
    photos: [
      { src: '/assets/treatments/yoga-feature-1.jpg', alt: 'A mother stretching on a mat beside her baby' },
      { src: '/assets/treatments/yoga-feature-2.jpg', alt: 'A pregnant woman stretching on a mat' },
    ],
    heading: 'Prenatal & Postnatal Yoga',
    bullets: [
      'Trimester-appropriate sequences to ease common pregnancy discomforts',
      'Breathing and relaxation techniques for labour preparation',
      'Paced postnatal sessions to rebuild strength and mobility after childbirth',
      'Small-group or one-on-one sessions, based on your comfort',
    ],
  },
  gridStyle: 'tiles',
  services: [
    { title: 'Therapeutic Yoga', text: 'Guided sequences for back pain, joint stiffness, and post-injury mobility.' },
    { title: 'Stress & Sleep Coaching', text: 'Breathing and relaxation techniques for anxiety, poor sleep, and burnout.' },
    { title: 'Wellness Coaching', text: 'One-on-one conversations on habits, routine, and sustainable lifestyle change.' },
    { title: 'Post-Surgical Pain Care', titlePending: true, text: 'Personalised nutrition guidance through pregnancy and the postpartum months, coordinated with your obstetric care.' },
  ],
  closing: {
    headline: ['Ask about yoga and wellness', 'sessions that fit your treatment plan'],
    call: { label: 'Call  9147 405 955', href: 'tel:9147405955' },
    book: { label: 'Book Online', form: 'book-appointment' },
  },
  specialtyId: 'yoga-wellness',
}
