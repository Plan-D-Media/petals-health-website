// Audiology — Template A (design/svg/18.svg). Copy verbatim. Flagged: "Book your appoinment".
export default {
  slug: 'audiology',
  template: 'A',
  title: 'Audiology',
  hero: {
    headline: ['Audiology'],                              // one line, navy (the mock has no accent line)
    lead: 'From a routine hearing test to fitting a hearing aid, our audiology team makes sure nothing gets missed.',
    cta: { label: 'Book your appoinment', form: 'book-appointment' },
    photo: { src: '/assets/treatments/audiology-hero.png', alt: 'An audiologist examining a patient’s ear with an otoscope', position: '20% 30%' },
  },
  intro: "Hearing changes are easy to dismiss until they affect daily life. Whether it's a child's school screening, ringing in the ears, or a parent who's been asking you to repeat yourself, our audiology services start with a proper test, not a guess.",
  gridStyle: 'tiles',
  services: [
    { title: 'Hearing Tests', text: 'Comprehensive audiometric testing for adults and children.' },
    { title: 'Hearing Aid Fitting', text: 'Assessment, fitting, and follow-up adjustment for hearing aids.' },
    { title: 'Tinnitus Management', text: 'Assessment and management strategies for ringing or buzzing in the ears.' },
    { title: 'Pediatric Hearing Screening', text: 'Early hearing screening for infants and school-age children.' },
    { title: 'Ear Health Check-ups', text: 'Routine ear examinations, including wax removal and infection checks.' },
  ],
  closing: {
    headline: ['Book a hearing test for yourself', 'or a family member'],
    call: { label: 'Call  9147 405 955', href: 'tel:9147405955' },
    book: { label: 'Book Online', form: 'book-appointment' },
  },
  specialtyId: 'audiology',
}
