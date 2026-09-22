// Petals IVF — Template B variant (design/svg/Petals IVF.svg). Copy verbatim.
// Blocks: hero · "explained" (heading + paragraphs | illustration) · services icon grid (7 tiles, one highlighted, CTA
// in the last cell) · featured band · why-choose list · journey stepper · conversation band · FAQ + form.
// Flagged (design/client-requests.md): "Book your appoinment"; "Intraurine Insemination" (Intrauterine); "Why Choose
// Petals Ivf ?" (IVF); US spellings fertilization/specialized/personalized alongside personalised/fertilisation.
// Journey stepper: the mock fills step 2 (navy) — built as four rings per the 2026-09-17 decision (design/decisions.md);
// logged as a deviation. FAQ: only the first answer exists in the design; five questions are tagged pending.
export default {
  slug: 'petals-ivf',
  department: 'Fertility Care',   // the lead form's department for this page (the title is not a department name)
  template: 'B',
  title: 'Petals IVF',
  hero: {
    headline: [{ text: 'Petals ' }, { text: 'IVF', accent: true }],
    subline: 'Your Fertility Journey. Our Commitment.',
    lead: 'Every fertility journey is personal, and so is the support it deserves.',
    leadLarge: true,
    cta: { label: 'Book your appoinment', form: 'book-appointment' },
    photo: { src: '/assets/treatments/ivf-hero.png', alt: 'A couple lifting their baby', position: '45% 30%' },
  },
  explained: {
    heading: ['Fertility, Explained', 'with Honesty'],
    paragraphs: [
      "Choosing fertility treatment is one of life's most personal decisions. That's why every conversation at Petals IVF begins with listening.",
      'We take the time to understand your concerns, explain your options in simple language, and recommend a treatment plan based on your individual needs—not assumptions.',
      'Our goal is to help you feel informed, respected, and confident about every decision you make.',
    ],
    illustration: { src: '/assets/treatments/ivf-egg.png', alt: 'Illustration of an egg surrounded by sperm cells' },
  },
  iconGrid: {
    ruleHeading: 'Our Fertility Services',
    intro: 'Comprehensive fertility solutions designed to support you at every stage of your journey.',
    tiles: [
      { icon: '/assets/treatments/ivf-icon-iui.png', title: ['IUI', '(Intraurine Insemination)'], text: 'A simple procedure that supports natural fertilization with medical assistance.' },
      { icon: '/assets/treatments/ivf-icon-ivf.png', title: ['IVF', '(In Vitro Fertilisation)'], text: 'A controlled process where fertilization takes place outside the body under expert supervision.' },
      { icon: '/assets/treatments/ivf-icon-icsi.png', title: ['ICSI', '(Intracytoplasmic Sperm Injection)'], text: 'A specialized procedure where fertilization takes place outside the body using advanced techniques.' },
      { icon: '/assets/treatments/ivf-icon-egg-freezing.png', title: ['Egg Freezing'], text: 'Egg and sperm freezing options for future planning.', highlight: true },
      { icon: '/assets/treatments/ivf-icon-fertility-assessment.png', title: ['Fertility Assessment'], text: 'Comprehensive evaluation to identify the underlying causes of infertility and guide personalized treatment.' },
      { icon: '/assets/treatments/ivf-icon-male-fertility.png', title: ['Male Fertility Services'], text: 'Expert diagnosis and treatment for male infertility to improve reproductive health.' },
      { icon: '/assets/treatments/ivf-icon-female-fertility.png', title: ['Female Fertility Services'], text: 'Comprehensive care to evaluate and treat female fertility concerns with personalized solutions.' },
    ],
    cta: { label: 'Book your appoinment', form: 'book-appointment' },
  },
  featured: {
    eyebrow: 'Featured Service',
    heading: 'Planning Ahead? So Are We.',
    paragraphs: [
      "Life doesn't always follow a timeline—and that's okay.",
      { text: "Whether you're focused on your career, waiting for the right partner, planning for the future, or considering fertility preservation for medical reasons, ", strong: 'Egg Freezing', after: ' gives you the opportunity to preserve your fertility and keep more options open for tomorrow.' },
      "At Petals IVF, we believe decisions like these should come from understanding—not pressure. Our specialists will help you understand the process, answer your questions, and support you in making the decision that's right for you.",
    ],
    cta: { label: 'Learn More About Egg Freezing', href: '#' },
    illustration: { src: '/assets/treatments/ivf-dish.png', alt: 'Illustration of an egg being retrieved into a dish' },
  },
  whyChoose: {
    heading: 'Why Choose Petals Ivf ?',
    sub: 'Built on Trust. Guided by Empathy.',
    items: [
      { title: 'Affordable IVF', text: 'Quality fertility treatment at a cost that remains accessible.' },
      { title: 'Transparent Communication', text: 'Clear explanations, honest expectations, and upfront pricing.' },
      { title: 'Empathy-Driven Approach', text: 'Every journey begins with listening, understanding, and respecting your choices.' },
      { title: 'Ethical Treatment', text: 'Recommendations based on your individual needs—never unnecessary procedures.' },
      { title: 'Experienced Fertility Specialists', text: 'Expert guidance backed by years of clinical experience.' },
      { title: 'Modern Fertility Centre', text: 'Advanced technology in a comfortable, private, and welcoming environment.' },
    ],
  },
  journey: {
    heading: 'Your Path to Parenthood',
    sub: 'Every fertility journey is unique, and every path deserves personalised guidance.',
    steps: [
      { title: 'Listen', text: 'Every journey begins with understanding your story, concerns, and goals.' },
      { title: 'Assess', text: 'We evaluate your fertility through the appropriate tests and investigations.' },
      { title: 'Plan', text: 'Your fertility specialist creates a personalised treatment plan based on your unique needs.' },
      { title: 'Support', text: "From your first consultation onwards, we're here to guide you with expertise, empathy, and transparent communication." },
    ],
  },
  conversation: {
    heading: ["Let's Start with", 'a Conversation'],
    paragraphs: [
      "Whether you're exploring fertility treatment, considering Egg Freezing, or simply looking for answers, we're here to help you understand your options.",
      "No pressure. No unnecessary recommendations. Just honest guidance, experienced specialists, and a team that's committed to helping you move forward with confidence.",
    ],
    primary: { label: 'Book a Consultation', form: 'book-appointment' },
    secondary: { label: 'Speak With Our Team', form: 'request-callback' },
  },
  groups: [],
  faq: {
    title: 'Frequently Asked Questions',
    items: [
      { q: 'What fertility treatments are available at Petals IVF?', a: 'We offer IVF, ICSI, IUI, Egg Freezing, Fertility Preservation, fertility assessments, and personalised treatment plans tailored to individual needs.' },
      { q: 'When should I consult a fertility specialist?' },
      { q: 'How do I know which fertility treatment is right for me?' },
      { q: 'What is the difference between IVF and IUI?' },
      { q: 'Is fertility treatment only for couples?' },
      { q: 'How much does IVF cost?' },
    ],
  },
  form: { title: 'Book a Consultation', preset: 'book-consultation-page' },
  specialtyId: 'fertility',
}
