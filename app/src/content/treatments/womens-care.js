// Women's Care — Template B (design/svg/10.svg). Copy verbatim from the mock.
// Flagged (design/client-requests.md): "Womans Care" in the Treatments menu of the design (this page's own title is
// "Women's Care" per the Find-a-Doctor mock and the H2); "Book your appoinment"; "First Dental Visit & Check ups" is on
// Dentistry. FAQ: only the first answer exists in the design (the other four items are drawn closed and their answers are
// not in the file, PDF included) — built as questions with the answer tagged pending.
export default {
  slug: 'womens-care',
  template: 'B',
  title: "Women's Care",
  hero: {
    headline: ['Care that grows with her', 'from first visit to first steps'],
    lead: 'From adolescence to motherhood and beyond, we provide seamless care in gynaecology, pregnancy, high-risk pregnancy, fertility, cosmetic gynaecology, aesthetics, and wellness—so your doctor, your records, and your care journey stay connected every step of the way.',
    cta: { label: 'Book your appoinment', form: 'book-appointment' },
    photo: { src: '/assets/treatments/womens-care-hero.png', alt: 'Four women of different ages standing together', position: '40% 30%' },
  },
  groups: [
    {
      head: { eyebrow: 'Specialities under this roof', title: 'Nine ways we care for ', titleAccent: 'Women', sub: 'Every pillar below is staffed by dedicated consultants who work from the same clinic, so a referral between them never means starting over' },
      cols: 3,
      link: { label: 'Learn more', accent: true },
      cards: [
        { title: 'Gynaecology', text: 'Routine checkups, cycle and hormonal concerns, and preventive screening for every life stage.' },
        { title: 'Pregnancy Care', text: 'Close monitoring for gestational diabetes, hypertension, prior complications and multiple pregnancies.' },
        { title: 'Fetal Medicine', text: 'Advanced fetal diagnostics and expert monitoring for healthy pregnancies and early intervention when needed.' },
        { title: 'Fertility Treatment', text: 'Personalised fertility solutions helping individuals and couples achieve their dream of parenthood with confidence.' },
        { title: 'Gynae Oncology', text: 'Specialised diagnosis, treatment, and compassionate care for cancers affecting the female reproductive system.' },
        { title: 'Urogynaecology', text: 'Expert care for pelvic floor disorders, urinary incontinence, and improved everyday comfort and confidence.' },
        { title: 'Reproductive Endocrinology', text: 'Comprehensive hormonal care for menstrual disorders, PCOS, menopause, and reproductive endocrine conditions.' },
        { title: 'Cosmetic Gynaecology & Aesthetics', text: 'Enhancing intimate wellness, confidence, and comfort through advanced surgical and non-surgical aesthetic treatments.' },
        { title: 'Yoga & Wellness', text: 'Holistic wellness programs promoting physical strength, emotional balance, and healthier lifestyles for every woman.' },
      ],
    },
  ],
  faq: {
    eyebrow: 'Common questions',
    title: 'Before your first visit',
    items: [
      { q: 'Do I need a referral to see a gynaecologist here?', a: "No referral is needed. You can book a first consultation directly, and we'll route you to the right specialist based on what you tell us." },
      { q: 'Can the same doctor see me through pregnancy and delivery?' },
      { q: 'Is it normal to experience spotting after gynaecology treatment?' },
      { q: 'What if you have irregular periods after treatment?' },
      { q: 'You feel fatigued and have low energy after gynaecology treatment is that normal?' },
    ],
  },
  form: { title: 'Book a Consultation', preset: 'book-consultation-page' },
  specialtyId: 'gynaecology',
}
