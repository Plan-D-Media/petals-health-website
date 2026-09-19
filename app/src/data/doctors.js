// Single source of truth for every doctor component (Home carousel, Find a Doctor, profile page).
// Schema: design/doctor-schema.md (the client's spreadsheet template maps 1:1 onto these fields).
// PLACEHOLDER DATA: the eight listings from the Find a Doctor mock (design/svg/Find a Doctor.svg) as seven doctors,
// plus Dr. Smita Gutgutia's profile fields from the profile mock (under Find a Doctor.svg). Fields neither mock
// carries (bio, quote, education, review count for the other six) are empty and render as "pending" on the profile.
// Photos are the mock's cut-outs (app/public/assets/doctors/<id>.png) until the client's photographs arrive.
//
// Source errors, logged for the client (design/client-requests.md items 3 and 14) — not corrected here:
//   1. Dr. Smita Gutgutia is listed twice in the Find a Doctor mock (Loudon Street and Tollygunge; the second row has a
//      male photograph). The profile mock gives her Loudon Street Mon–Sat and Kankurgachi Sat, 11 am – 5 pm, which
//      disagrees with the list's "10 am – 4 pm". Modelled as ONE doctor with the profile mock's two sessions (it is
//      the only source that names days); the list row's photograph is kept aside as unassigned-male.png.
//   2. Dr. Sunil Agarwal's Tollygunge timing reads "12 am – 2 pm" in the mock; almost certainly 12 pm. Kept as 12 pm.
//   3. Days are unknown for everyone but Dr. Smita: every other session is Mon–Sat as a placeholder.
//   4. Profile mock: "Loudon Steet", "Post-Partom Recovery", "IN PRACTICE / FROM 1012" (2012? or 1,012 reviews?) —
//      the stat is rendered from `experienceYears` only; the "FROM" line is left out until the client confirms.

export const CLINICS = {
  'loudon-street': { id: 'loudon-street', name: 'Loudon Street (CMC)', short: 'Loudon Street', area: 'Central Kolkata' },
  'tollygunge':    { id: 'tollygunge',    name: 'Tollygunge',          short: 'Tollygunge',    area: 'South Kolkata' },
  'kankurgachi':   { id: 'kankurgachi',   name: 'Kankurgachi',         short: 'Kankurgachi',   area: 'North Kolkata' },   // the About/Clinics mocks label Kankurgachi North Kolkata
}

// The Find a Doctor mock's specialty filter, in its order, with the specialtyIds each group collects. Counts are
// computed from DOCTORS at render time; a specialtyId that belongs to no group becomes its own filter entry.
export const SPECIALTY_GROUPS = [
  { id: 'woman-child',   label: 'Woman & Child',            members: ['gynaecology', 'paediatrics'] },
  { id: 'fertility-ivf', label: 'Fertility & IVF',          members: ['fertility'] },
  { id: 'family',        label: 'Family Medicine',          members: ['family-medicine'] },
  { id: 'cardiology',    label: 'Cardiology',               members: ['cardiology'] },
  { id: 'dentistry',     label: 'Dentistry',                members: ['dentistry'] },
  { id: 'cosmetic',      label: 'Cosmetic Gynaecology',     members: ['cosmetic-gynaecology'] },
  { id: 'dermatology',   label: 'Dermatology & Aesthetics', members: ['dermatology'] },
  { id: 'audiology',     label: 'Audiology',                members: ['audiology'] },
  { id: 'wellness',      label: 'Wellness',                 members: ['wellness'] },
  { id: 'pain',          label: 'Pain Management',          members: ['pain-management'] },
]
export const SPECIALTY_LABELS = { psychiatry: 'Psychiatry' }   // ids outside the groups above

const ALL_LANGUAGES = ['Bengali', 'Hindi', 'English']
const MON_SAT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** @typedef {import('./doctor-schema').Doctor} Doctor */
export const DOCTORS = [
  {
    id: 'smita-gutgutia',
    name: 'Dr. Smita Gutgutia',
    pronoun: 'she',
    qualifications: ['DGO', 'DNB'],
    college: 'BJ Medical College, Pune',
    designation: 'Senior Gynaecologist',
    specialty: 'Gynaecology & Obstetrics',
    specialtyId: 'gynaecology',
    sessions: [
      { clinicId: 'loudon-street', days: MON_SAT, from: '11:00', to: '17:00' },
      { clinicId: 'kankurgachi',   days: ['Sat'], from: '11:00', to: '17:00' },
    ],
    languages: ALL_LANGUAGES,
    videoConsult: true,
    rating: 4.9, reviewCount: null,
    experienceYears: 16,
    bio: 'Dr. Smita has over 16 years of experience, with a keen interest in high-risk obstetrics and gynaecological and fetal imaging. She is a graduate of BJ Medical College, Pune, followed by DGO and DNB.',
    quote: "I firmly believe that only hard work and passion can make you what you are, but the most important part of the system is your family. I have an extremely hard-working and intelligent partner whose vision pushes me to reach our goals, and very encouraging and supportive parents who have helped me care for my children all through. With Petals Woman's Clinic, I have tried to create a similar family — and I wish to see Petals Health reach such heights where we as women feel empowered, confident, and in charge of our own and our family's health.",
    treatmentTags: ['High-risk obstetrics', 'Total pregnancy care', 'Total Gynecological Care'],
    treats: [
      { heading: 'Pregnancy Management', tags: ['Pre-conception care', 'Total Pregnancy Care', 'Breastfeeding & Lactation Guidance', 'Post-Partom Recovery', 'Vaccinations', 'Important Health Screenings', 'Routine Check-up', 'Menopause Care'] },
      { heading: 'Total gynaecological care', tags: ['Routine Checkup', 'Menstrual health and wellness', 'Menopause Care', 'PCOS, endometriosis, Obesity, Hypertension', 'Important Health Screenings', 'Cancer Screenings', 'All Gynecological Surgeries', 'Adult Vaccinations'] },
    ],
    education: [
      { period: '', title: 'MBBS, DGO', place: 'B J Medical College, Pune' },
      { period: '', title: 'DNB (Obstetrics & Gynaecology)', place: 'National Board of Examinations' },
      { period: '16+ yrs', title: 'Practising Obstetrician & Gynaecologist', place: 'Focus on high-risk obstetrics' },
      { period: 'Present', title: 'Senior Gynaecologist', place: 'Petals Health Kankurgachi, Loudon Street (CMC)' },
    ],
    photo: '/assets/doctors/smita-gutgutia.png',
    portrait: '/assets/doctors/smita-gutgutia-portrait.png',
    sourceNote: 'Listed twice in the Find a Doctor mock (Loudon Street and Tollygunge, the second row with a male photograph, both "10 am – 4 pm"); the profile mock gives Loudon Street Mon–Sat and Kankurgachi Sat, 11 am – 5 pm. Built from the profile mock — confirm clinics, days and hours with the client.',
  },
  {
    id: 'k-n-siddiqui',
    name: 'Dr. K N Siddiqui',
    qualifications: [], designation: 'Consultant, Cardio-Metabolic disorders',
    specialty: 'Cardio-Metabolic disorders', specialtyId: 'cardiology',
    sessions: [{ clinicId: 'loudon-street', days: MON_SAT, from: '16:00', to: '20:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['Cardiology', 'Preventive cardiology'], education: [], photo: '/assets/doctors/k-n-siddiqui.png',
    sourceNote: 'Mock designation: "Consultant, Cardio-Metabolic disorders (Special interest in preventive cardiology)".',
  },
  {
    id: 'sunil-agarwal',
    name: 'Dr. Sunil Agarwal',
    qualifications: [], designation: '',
    specialty: 'Family Physician', specialtyId: 'family-medicine',
    sessions: [{ clinicId: 'tollygunge', days: MON_SAT, from: '12:00', to: '14:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['General medicine'], education: [], photo: '/assets/doctors/sunil-agarwal.png',
    sourceNote: 'Mock reads "12 am – 2 pm"; entered as 12 pm – 2 pm. Confirm with the client.',
  },
  {
    id: 'subhra-ghosh-paul',
    name: 'Dr. Subhra Ghosh Paul',
    qualifications: [], designation: '',
    specialty: 'Gynaecology & Obstetrics', specialtyId: 'gynaecology',
    sessions: [{ clinicId: 'kankurgachi', days: MON_SAT, from: '10:00', to: '16:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['Pregnancy Care'], education: [], photo: '/assets/doctors/subhra-ghosh-paul.png',
  },
  {
    id: 'bhaskar-mukherjee',
    name: 'Dr. Bhaskar Mukherjee',
    qualifications: [], designation: '',
    specialty: 'Psychiatrist', specialtyId: 'psychiatry',
    sessions: [{ clinicId: 'kankurgachi', days: MON_SAT, from: '10:00', to: '16:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['Mental health'], education: [], photo: '/assets/doctors/bhaskar-mukherjee.png',
  },
  {
    id: 'uttara-bhar',
    name: 'Dr. Uttara Bhar',
    qualifications: [], designation: '',
    specialty: 'Consultant Paediatrics', specialtyId: 'paediatrics',
    sessions: [{ clinicId: 'kankurgachi', days: MON_SAT, from: '10:00', to: '12:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['Paediatrics', 'Vaccinations'], education: [], photo: '/assets/doctors/uttara-bhar.png',
  },
  {
    id: 'madanki-s',
    name: 'Dr. Madanki S',
    qualifications: [], designation: '',
    specialty: 'Gynaecologist & IVF', specialtyId: 'fertility',
    sessions: [{ clinicId: 'tollygunge', days: MON_SAT, from: '10:00', to: '18:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['Fertility Treatment', 'IVF'], education: [], photo: '/assets/doctors/madanki-s.png',
    sourceNote: 'Mock name "Dr. Madanki . S" and specialty "Consultant Gynaecologist & IVF Specialists" (plural).',
  },
]

export const SOURCE_FLAGS = DOCTORS.filter((d) => d.sourceNote).map((d) => ({ id: d.id, note: d.sourceNote }))

// ---- helpers shared by the components ----
export const monogram = (name) => { const w = name.replace(/^Dr\.?\s+/i, '').split(/\s+/).filter(Boolean); return ((w[0]?.[0] ?? '') + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase() }   // first + last initials: 'K N Siddiqui' → KS

const fmt = (t) => { const [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'pm' : 'am'; const hh = ((h + 11) % 12) + 1; return m ? `${hh}:${String(m).padStart(2, '0')} ${ap}` : `${hh} ${ap}` }
export const timeRange = (s) => `${fmt(s.from)} – ${fmt(s.to)}`
export const sessionLabel = (s) => `${CLINICS[s.clinicId].short} · ${timeRange(s)}`
export const clinicsOf = (d) => [...new Set(d.sessions.map((s) => s.clinicId))].map((id) => CLINICS[id])
export const specialtyGroupOf = (d) => SPECIALTY_GROUPS.find((g) => g.members.includes(d.specialtyId))?.id || d.specialtyId
export const byId = (id) => DOCTORS.find((d) => d.id === id)
/** the 340 px-tall variant tools/images.py writes next to every doctor photo (cards, list rows) */
export const photoSmall = (d) => (d.photo ? d.photo.replace(/\.(png|jpe?g)$/i, '-sm.$1') : null)

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const todayName = (date = new Date()) => DAYS[date.getDay()]
/** Sessions running today, in data order. */
export const sessionsToday = (d, date) => d.sessions.filter((s) => s.days.includes(todayName(date)))
export const availableToday = (d, date) => sessionsToday(d, date).length > 0
/** The next session from today onwards: { session, dayName, inDays } */
export const nextSession = (d, date = new Date()) => {
  const start = date.getDay()
  for (let k = 0; k < 7; k++) {
    const day = DAYS[(start + k) % 7]
    const s = d.sessions.find((x) => x.days.includes(day))
    if (s) return { session: s, dayName: day, inDays: k }
  }
  return null
}
/** Days list as the profile shows it: "Mon – Sat" for a run, else "Mon, Wed, Fri". */
export const daysLabel = (days) => {
  const idx = days.map((x) => DAYS.indexOf(x)).sort((a, b) => a - b)
  const run = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1)
  return idx.length > 2 && run ? `${DAYS[idx[0]]} – ${DAYS[idx[idx.length - 1]]}` : idx.map((i) => DAYS[i]).join(', ')
}
