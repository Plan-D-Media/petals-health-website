// Dentistry — Template B with the Risks & Safety block (design/svg/14.svg). Copy verbatim from the mock.
// "Trusted Care for, Healthier Smiles" is Dentistry's own tagline (PDF and SVG agree; Multispecialty's copy was the
// paste error). Flagged: "Book your appoinment"; "First Dental Visit & Check ups" (Check-ups elsewhere on the page).
// FAQ: only the first answer exists in the design; the other four are tagged pending.
export default {
  slug: 'dentistry',
  template: 'B',
  title: 'Dentistry',
  hero: {
    tagline: 'Trusted Care for, Healthier Smiles',
    headline: [{ text: 'Dental ' }, { text: 'Care', accent: true }],   // one line, "Care" in the accent colour
    subline: 'for the whole family, in one visit.',
    lead: 'From routine check-ups to smile makeovers, our dental team keeps things straightforward — clear treatment plans, no surprises.',
    cta: { label: 'Book your appoinment', form: 'book-appointment' },
    photo: { src: '/assets/treatments/dentistry-hero.png', mask: '/assets/treatments/dentistry-hero-mask.png', alt: 'A young man laughing', position: '45% 25%' },
  },
  intro: "Dentistry at Petals Health is organised into three tracks. General dentistry covers the routine and the restorative. Cosmetic dentistry is for when you're ready to fix something you've been putting off. And pediatric dentistry is built specifically for children, from their first visit through their teenage years.",
  groups: [
    { head: { eyebrow: 'General Dentistry', title: 'Routine & Restorative Care', sub: 'Everyday care to keep teeth healthy and catch problems early.' }, cols: 4, numbered: true, link: { label: 'Learn more' },
      cards: [
        { title: 'Check-ups & Cleaning', text: 'Routine oral exams and professional cleaning to catch problems before they start' },
        { title: 'Fillings', text: 'Tooth-coloured fillings for cavities, done in a single sitting.' },
        { title: 'Root Canal Treatment', text: 'Treatment for infected or badly decayed teeth, aimed at saving the natural tooth.' },
        { title: 'Extractions', text: 'Straightforward and surgical extractions, including wisdom teeth, with clear aftercare guidance.' },
      ] },
    { head: { eyebrow: 'Cosmetic Dentistry', title: 'Smile & Appearance', sub: "Elective treatments for a smile you're happy with." }, cols: 4, numbered: true, link: { label: 'Learn more' },
      cards: [
        { title: 'Teeth Whitening', text: 'In-clinic whitening for a noticeably brighter smile in a single sitting.' },
        { title: 'Veneers', text: 'Custom veneers to correct chips, gaps, or discolouration on front teeth.' },
        { title: 'Smile Makeovers', text: 'A combined plan across whitening, shaping, and alignment for a full smile refresh.' },
        { title: 'Dental Bonding', text: 'Tooth-coloured resin used to repair chips, gaps, and minor shape irregularities.' },
      ] },
    { head: { eyebrow: 'Pediatric Dentistry', title: 'Care for Children', sub: 'Gentle, age-appropriate dental care for young patients.' }, cols: 4, numbered: true, link: { label: 'Learn more' },
      cards: [
        { title: 'First Dental Visit & Check ups', text: "Gentle introductory visits and routine check-ups from a child's first tooth onward." },
        { title: 'Fluoride Treatment & Sealants', text: 'Preventive treatments that protect young teeth from early decay.' },
        { title: 'Cavity Treatment for Baby Teeth', text: 'Child-specific fillings and cavity care, focused on comfort.' },
        { title: 'Habit Counselling', text: 'Guidance on thumb-sucking, pacifier use, and other habits that affect dental development.' },
      ] },
  ],
  risks: {
    title: 'Risks & Safety Measures',
    risks: { heading: 'Risks', photo: { src: '/assets/treatments/dentistry-risks.jpg', alt: 'A dentist examining a patient, with close-ups of dental conditions' }, bullets: [
      'Temporary tooth sensitivity to hot, cold, or sweet foods.',
      'Mild pain or discomfort around the treated areas.',
      'Swelling or tenderness of the gums, especially with procedures like crowns or veneers.',
      'Slight misalignment or uneven bite, requiring adjustment.',
      'Cosmetic restorations like veneers or crowns could chip or wear down if not cared for properly.',
      'In rare cases, there could be an infection at the site of dental work, particularly after invasive treatments.',
    ] },
    safety: { heading: 'Safety Measures', photo: { src: '/assets/treatments/dentistry-safety.jpg', alt: 'A smiling patient in the dental chair with a dentist beside her' }, bullets: [
      'Avoid hard, sticky, or chewy foods to prevent damage to restorations.',
      'Practice good oral hygiene with a soft-bristle toothbrush and non-abrasive toothpaste.',
      'Use fluoride toothpaste to help reduce sensitivity.',
      'Avoid smoking or using tobacco products to promote faster healing.',
      'Wear a mouthguard if needed, especially during sleep, to protect restorations from grinding.',
      'Attend follow-up appointments to ensure proper healing and adjustments if needed.',
      'Be cautious with extreme temperatures (hot or cold) to avoid discomfort.',
      "Follow your dentist's instructions for post-treatment care to ensure the longevity of your cosmetic results.",
    ] },
  },
  faq: {
    eyebrow: 'Common questions',
    title: 'Before your first visit',
    items: [
      { q: 'Can cosmetic dentistry improve the appearance of your gums?', a: 'Yes, cosmetic procedures like gum contouring or gum lifts can reshape your gums, improving the symmetry and appearance of your smile.' },
      { q: 'How do you know which cosmetic dentistry procedure is right for you?' },
      { q: 'Are the results of cosmetic dentistry treatments permanent?' },
      { q: 'Can cosmetic dentistry help with discolouration or stained teeth?' },
      { q: 'Can you get cosmetic dental treatments if you have dental issues like cavities or gum disease?' },
    ],
  },
  form: { title: 'Book a Consultation', preset: 'book-consultation-page' },
  specialtyId: 'dentistry',
}
