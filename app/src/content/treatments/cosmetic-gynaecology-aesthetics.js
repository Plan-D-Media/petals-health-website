// Cosmetic Gynaecology & Aesthetics — Template B with track bands, sub-groups and the package block
// (design/svg/Cosmetic Gynaecology & Aesthetics.svg). Copy verbatim.
// VERIFIED (design/pdf-vs-svg.md): the "repeated four-card block" is the second Non-Surgical row drawn twice at the same
// coordinates (y 1544–1822) — a stacked duplicate that displays once. Built once (11 cards in track 01, as shown).
// Flagged: "Book your appoinment"; "center" (US spelling, "centre" elsewhere); "3clinics" / "1st consultation" stat
// strip; the sub-group rule "When non-surgical isn't the right fit" appears twice — once as the divider between tracks
// 01 and 02 (plain) and again as the FIRST sub-group heading of track 03 (in accent), where it is plainly a paste error
// (the group holds PRP/GFC/Botox/thread lifts; its siblings are "Resurfacing & Texture", "Tone & Pigmentation",
// "Corrective & Removal") — built with the heading tagged pending; "EMS FR Core Tightening)" has a stray bracket.
// The hero's "Care for the parts of you that deserve equal attention" line is a strapline under the headline.
export default {
  slug: 'cosmetic-gynaecology-aesthetics',
  template: 'B',
  title: 'Cosmetic Gynaecology & Aesthetics',
  hero: {
    tagline: "Kolkata’s first dedicated center for",
    headline: ['Cosmetic Gynaecology', '& Aesthetics'],
    subline: 'Care for the parts of you that deserve equal attention',
    lead: "From non-surgical intimate wellness to surgical procedures and skin & hair aesthetics — three tracks of care, one confidential team, across Petals Health's Kolkata clinics.",
    cta: { label: 'Book your appoinment', form: 'book-appointment' },
    photo: { src: '/assets/treatments/cosmetic-hero.png', alt: 'A woman holding a lotus flower', position: '40% 25%' },
  },
  stats: ['35 procedures across 3 tracks of care', { big: '3 clinics', small: 'Kankurgachi, Loudon Street, Tollygunge' }, '1st consultation is complimentary'],
  groups: [
    { head: { eyebrow: '01 · Non-Surgical', title: 'Intimate wellness, ', titleAccent: 'without surgery', sub: 'Laser and device based treatments for tightening, rejuvenation, infection control and pelvic floor strength most take under an hour, with no downtime.' },
      cols: 4, tone: 'cream', labelled: true, link: { label: 'Learn more' },
      cards: [
        { label: 'Device-based', title: 'Laser Vaginal Rejuvenation', text: 'Fractional laser therapy that renews vaginal tissue for better comfort and everyday function.' },
        { label: 'Device-based', title: 'Laser Vaginal Tightening', text: 'A non-invasive route to restoring tone and elasticity, with results building over a short course of sessions.' },
        { label: 'Device-based', title: 'Laser Infection Control', text: 'Laser-assisted therapy that helps manage recurring infections and supports long-term vaginal hygiene.' },
        { label: 'Non-invasive', title: 'Stress Urinary Incontinence', text: 'Non-surgical protocols that rebuild bladder control and reduce leakage during everyday activity.' },
        { label: 'Regenerative', title: 'PRP Vaginal Rejuvenation', text: 'Your own platelet-rich plasma, used to improve tissue health, sensitivity and natural lubrication.' },
        { label: 'Consultation-led', title: 'Sexual Wellness', text: 'Personalised, judgement-free care plans addressing vitality, comfort and intimate confidence.' },
        { label: 'Device-based', title: 'HIFEM Pelvic Floor Therapy', text: 'Electromagnetic muscle stimulation that strengthens the pelvic floor without a single incision.' },
        { label: 'Minimally invasive', title: 'Microneedling (Intimate)', text: 'Controlled micro-injury that prompts natural collagen renewal and improves tissue texture.' },
        { label: 'Topical', title: 'Genital Peels', text: 'Gentle chemical peels formulated for intimate skin, easing tone, texture and sensitivity concerns.' },
        { label: 'Injectable', title: 'V-Shot', text: 'PRP-based injection that supports lubrication, sensation and overall vaginal function.' },
        { label: 'Injectable', title: 'P-Shot', text: 'PRP therapy for male intimate wellness, aimed at improving sensation and performance.' },
      ],
      divider: "When non-surgical isn't the right fit" },
    { head: { eyebrow: '02· Surgical', title: 'Surgical procedures, handled with precision', sub: 'For structural or lasting change, our surgical team performs these procedures in clinic with full pre and post-operative counselling' },
      cols: 4, tone: 'navy', labelled: true, link: { label: 'Learn more' },
      cards: [
        { label: 'Surgical procedure', title: 'Hymenoplasty', text: 'A safe reconstructive procedure performed with discretion, for personal or cultural reasons.' },
        { label: 'Surgical procedure', title: 'Labiaplasty', text: 'Reshaping surgery for comfort and appearance, planned around your goals and anatomy.' },
        { label: 'Surgical procedure', title: 'Clitoral Hood Reduction', text: 'A refining procedure aimed at improved comfort and sensitivity in the genital area.' },
        { label: 'Surgical procedure', title: 'Precision V Intimoplasty', text: 'A customised vaginal rejuvenation procedure, tailored surgically to your anatomy and goals.' },
        { label: 'Surgical procedure', title: 'Vaginal Tightening Surgery', text: 'A surgical route to lasting tone and elasticity, for cases beyond what devices alone can address.' },
      ] },
    { head: { eyebrow: '03 · Dermatology  & Aesthetic', title: 'Skin, hair & contouring care', sub: 'Our dermatology and aesthetic team treats the everyday concerns pigmentation, scarring, hair thinning, ageing  grouped here by what they actually do.' },
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
  package: {
    title: 'LuxMOM Re-sculpt Package',
    chips: ['Laser Vaginal Rejuvenation', 'PRP Lysate', 'HIFEM Chair', 'Cryolipolysis', 'EMS FR Core Tightening)'],
    phone: { label: '9147405955', href: 'tel:9147405955' },
  },
  form: { title: 'Book a Consultation', preset: 'book-consultation-page' },
  specialtyId: 'cosmetic-gynaecology',
}
