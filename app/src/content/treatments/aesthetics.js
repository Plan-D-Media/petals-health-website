// Aesthetics — Template B, one track with sub-groups (design/svg/Cosmetic Gynaecology & Aesthetics.svg, the dermatology
// and aesthetics track only). 2026-09-22 (client): everything cosmetic-gynaecology left this page — the non-surgical
// intimate-wellness track (11 cards), the surgical track (5 cards), the LuxMOM Re-sculpt package (it mixed both: laser
// vaginal rejuvenation and HIFEM beside cryolipolysis and EMS — removed, logged, not rewritten), the hero's
// "Kolkata's first dedicated center for Cosmetic Gynaecology & Aesthetics" (a neutral placeholder, tagged copy
// pending, until the client writes the new line), the lead that named the three tracks (the track's own sub-line
// stands in, tagged), and two stats-strip facts now false or unconfirmed for aesthetics ("35 procedures across 3
// tracks", "1st consultation is complimentary") kept in `factsHidden` until the client confirms. Route renamed from
// /treatments/cosmetic-gynaecology-aesthetics (301 in the hosting config, redirect in the router). With one track
// there are no track pills and no sticky index (Template B draws those from `groups.length > 1`).
// Copy verbatim otherwise. Flagged (design/client-requests.md item 12): the first sub-group is headed "When
// non-surgical isn't the right fit" — in the mock it is the divider between the cosmetic tracks pasted as a heading
// (its siblings are "Resurfacing & Texture", "Tone & Pigmentation", "Corrective & Removal") — tagged pending;
// "Book your appoinment".
const PENDING = 'With the client (design/client-requests.md item 18): the page no longer covers cosmetic gynaecology, so the design’s line does not apply and no new line has been written'
export default {
  slug: 'aesthetics',
  template: 'B',
  title: 'Aesthetics',
  hero: {
    headline: ['Aesthetics'],
    headlinePending: PENDING,
    subline: 'Care for the parts of you that deserve equal attention',
    lead: 'Our dermatology and aesthetic team treats the everyday concerns pigmentation, scarring, hair thinning, ageing  grouped here by what they actually do.',
    leadPending: PENDING,
    cta: { label: 'Book your appoinment', form: 'book-appointment' },
    photo: { src: '/assets/treatments/cosmetic-hero.png', alt: 'A woman holding a lotus flower', position: '40% 25%' },
  },
  // the mock's navy stats strip. Shown: the clinics line. Hidden until the client confirms they hold for aesthetics
  // (design/client-requests.md item 18): "35 procedures across 3 tracks of care" (now false — one track) and
  // "1st consultation is complimentary" (stated for the cosmetic gynaecology centre).
  facts: [
    { label: '3 clinics — Kankurgachi, Loudon Street, Tollygunge', source: 'mock stats strip' },
  ],
  factsHidden: [
    { label: '35 procedures across 3 tracks of care', source: 'mock stats strip (design/svg/Cosmetic Gynaecology & Aesthetics.svg)' },
    { label: '1st consultation is complimentary', source: 'mock stats strip — this page only' },
  ],
  groups: [
    { head: { eyebrow: 'Dermatology  & Aesthetic', title: 'Skin, hair & contouring care', sub: 'Our dermatology and aesthetic team treats the everyday concerns pigmentation, scarring, hair thinning, ageing  grouped here by what they actually do.' },
      cols: 4, tone: 'cream', labelled: true, link: { label: 'Learn more' },
      subgroups: [
        { heading: "When non-surgical isn't the right fit", headingPending: true, cards: [
          { label: 'Regenerative', title: 'PRP Therapy (Face)', text: 'Your own platelets, used to soften fine lines and refresh skin from within.' },
          { label: 'Regenerative', title: 'PRP Therapy (Hair)', text: 'Platelet-rich plasma applied to the scalp to encourage thicker, healthier regrowth.' },
          { label: 'Regenerative', title: 'GFC Therapy', text: 'A growth-factor concentrate treatment that supports skin healing and renewal.' },
          { label: 'Injectable', title: 'Botox & Fillers', text: "Minimally invasive injections that soften lines and restore volume where it's lost." },
          { label: 'Minimally invasive', title: 'Thread Lifts', text: 'A non-surgical lift for sagging skin, using dissolvable threads instead of a scalpel.' },
          { label: 'Non-invasive', title: 'Facial Contouring', text: 'Definition and shape for facial features, achieved without going under the knife.' },
          { label: 'IV / Oral', title: 'Glutathione Therapy', text: 'An antioxidant led treatment that supports brighter, more even-toned skin over time.' },
        ] },
        { heading: 'Resurfacing & Texture', cards: [
          { label: 'Minimally invasive', title: 'Microneedling (Face/Body)', text: "Micro-injury that triggers your skin's own collagen response to smooth texture and scarring." },
          { label: 'Topical', title: 'Chemical Peels', text: 'Controlled exfoliation that clears dead skin to reveal a smoother, more even surface.' },
          { label: 'Topical', title: 'Hydrafacial', text: 'A cleansing, exfoliating and hydrating facial that leaves skin visibly refreshed.' },
          { label: 'Topical', title: 'Carbon Facial', text: 'A deep-clean facial using carbon and laser to tighten pores and brighten skin.' },
          { label: 'Device-based', title: 'LED Therapy', text: 'Targeted light wavelengths that calm acne, redness and early signs of ageing.' },
          { label: 'Device-based', title: 'Photofacial', text: 'Light-based therapy that evens out tone, texture and residual pigmentation.' },
        ] },
        { heading: 'Tone & Pigmentation', cards: [
          { label: 'Targeted', title: 'Anti Pigmentation', text: 'Focused treatment for dark spots and uneven tone, for a clearer complexion.' },
          { label: 'Targeted', title: 'Melasma', text: 'A dedicated protocol for managing stubborn melasma patches and restoring even tone.' },
        ] },
        { heading: 'Corrective & Removal', cards: [
          { label: 'Device-based', title: 'Tattoo Removal', text: 'Non-invasive laser sessions that gradually fade unwanted tattoos.' },
          { label: 'Device-based', title: 'Scars/Stretch Marks Removal', text: 'Treatment protocols that visibly soften the appearance of scars and stretch marks.' },
          { label: 'Minor procedure', title: 'Moles/Warts Removal', text: 'Quick, precise removal for smoother, clearer skin.' },
          { label: 'Minor procedure', title: 'Skin Tag Removal', text: 'A fast, low-discomfort procedure to remove skin tags cleanly.' },
        ] },
      ] },
  ],
  form: { title: 'Book a Consultation', preset: 'book-consultation-page' },
  specialtyId: 'dermatology',
}
