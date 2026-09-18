// Child Care — Template A content (design/svg/11.svg). Copy verbatim from the mock; layout comes from the template.
export default {
  slug: 'child-care',
  template: 'A',
  title: 'Child Care',                                   // page title / breadcrumb / nav
  hero: {
    headline: ['Care that grows', 'with your child'],    // line 1 navy, line 2 accent (as the Home hero was)
    lead: 'From newborn checks to school-age concerns, our pediatric team gives you a steady point of contact through every stage.',
    cta: { label: 'Book your appoinment', form: 'book-appointment' },   // sic: the mock's spelling; flagged in the client note
    photo: { src: '/assets/treatments/child-care-hero.png', mask: '/assets/treatments/child-care-hero-mask.png', alt: 'A mother holding her sleeping newborn' },
  },
  intro: "Children's health moves fast,  a growth spurt, a new vaccine due, a fever that won't settle. Our pediatricians work alongside your family medicine and gynaecology team so your child's records, history, and care plan stay in one place.",
  services: [
    { title: 'Well-Baby Checks', text: 'Scheduled check-ups to track growth, feeding, and early development milestones.' },
    { title: 'Vaccination', text: 'Age-appropriate immunisation on the national and recommended schedules, with reminders.' },
    { title: 'Growth & Development Tracking', text: 'Ongoing monitoring of height, weight, and developmental milestones through childhood.' },
    { title: 'Common Illness Care', text: 'Same-visit care for fevers, infections, allergies, and other everyday childhood illnesses.' },
    { title: 'Nutrition Guidance', text: 'Practical feeding and nutrition advice from infancy through the toddler years.' },
    { title: 'Neonatology Coordination', text: 'Coordinated care with our neonatology team for newborns needing extra attention.' },
  ],
  serviceLink: 'Learn more',
  closing: {
    headline: ['Bring your child in for a', 'Check-up or Vaccination'],
    call: { label: 'Call  9147 405 955', href: 'tel:9147405955' },
    book: { label: 'Book Online', form: 'book-appointment' },
  },
  specialtyId: 'paediatrics',   // doctors shown in "Meet the team" are filtered on this
}
