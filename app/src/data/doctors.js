// Single source of truth for every doctor component (Home carousel, Find a Doctor, profile page).
// Schema: design/doctor-schema.md (the client's spreadsheet template maps 1:1 onto these fields).
// PLACEHOLDER DATA: the eight doctors from the Find a Doctor mock (design/svg/Find a Doctor.svg). Fields the mock does
// not carry (qualifications, bio, quote, education, review count) are empty or marked; photos are null until supplied.
//
// Source errors, logged for the client (not corrected here):
//   1. Dr. Smita Gutgutia is listed twice (Loudon Street and Tollygunge) and the second listing carries a male
//      photograph in the mock. Modelled below as ONE doctor with two clinic sessions; the photo discrepancy is flagged.
//   2. Dr. Sunil Agarwal's Tollygunge timing reads "12 am – 2 pm" in the mock; almost certainly 12 pm. Kept as 12 pm
//      with `sourceNote`.

export const CLINICS = {
  'loudon-street': { id: 'loudon-street', name: 'Loudon Street (CMC)', short: 'Loudon Street', area: 'Central Kolkata' },
  'tollygunge':    { id: 'tollygunge',    name: 'Tollygunge',          short: 'Tollygunge',    area: 'South Kolkata' },
  'kankurgachi':   { id: 'kankurgachi',   name: 'Kankurgachi',         short: 'Kankurgachi',   area: 'East Kolkata' },
}

const ALL_LANGUAGES = ['Bengali', 'Hindi', 'English']

/** @typedef {import('./doctor-schema').Doctor} Doctor */
export const DOCTORS = [
  {
    id: 'smita-gutgutia',
    name: 'Dr. Smita Gutgutia',
    qualifications: [],                       // e.g. ['MBBS', 'MD (Obs & Gyn)'] — not in the mock
    designation: '',                          // e.g. 'Senior Consultant' — not in the mock
    specialty: 'Gynaecology & Obstetrics',
    specialtyId: 'gynaecology',
    sessions: [
      { clinicId: 'loudon-street', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], from: '10:00', to: '16:00' },
      { clinicId: 'tollygunge',    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], from: '10:00', to: '16:00' },
    ],
    languages: ALL_LANGUAGES,
    videoConsult: true,
    rating: 4.8, reviewCount: null,
    bio: '', quote: '',
    treatmentTags: ['Pregnancy Care', 'High-Risk Pregnancy'],
    education: [],
    photo: null,
    sourceNote: 'Listed twice in the Find a Doctor mock; the second listing (Tollygunge) shows a male photograph. Treated as one doctor, two clinics — confirm with the client.',
  },
  {
    id: 'k-n-siddiqui',
    name: 'Dr. K N Siddiqui',
    qualifications: [], designation: '',
    specialty: 'Cardio-Metabolic disorders', specialtyId: 'cardiology',
    sessions: [{ clinicId: 'loudon-street', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], from: '16:00', to: '20:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['Cardiology', 'Preventive cardiology'], education: [], photo: null,
  },
  {
    id: 'sunil-agarwal',
    name: 'Dr. Sunil Agarwal',
    qualifications: [], designation: '',
    specialty: 'Family Physician', specialtyId: 'family-medicine',
    sessions: [{ clinicId: 'tollygunge', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], from: '12:00', to: '14:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['General medicine'], education: [], photo: null,
    sourceNote: 'Mock reads "12 am – 2 pm"; entered as 12 pm – 2 pm. Confirm with the client.',
  },
  {
    id: 'subhra-ghosh-paul',
    name: 'Dr. Subhra Ghosh Paul',
    qualifications: [], designation: '',
    specialty: 'Gynaecology & Obstetrics', specialtyId: 'gynaecology',
    sessions: [{ clinicId: 'kankurgachi', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], from: '10:00', to: '16:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['Pregnancy Care'], education: [], photo: null,
  },
  {
    id: 'bhaskar-mukherjee',
    name: 'Dr. Bhaskar Mukherjee',
    qualifications: [], designation: '',
    specialty: 'Psychiatrist', specialtyId: 'psychiatry',
    sessions: [{ clinicId: 'kankurgachi', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], from: '10:00', to: '16:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['Mental health'], education: [], photo: null,
  },
  {
    id: 'uttara-bhar',
    name: 'Dr. Uttara Bhar',
    qualifications: [], designation: '',
    specialty: 'Consultant Paediatrics', specialtyId: 'paediatrics',
    sessions: [{ clinicId: 'kankurgachi', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], from: '10:00', to: '12:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['Paediatrics', 'Vaccinations'], education: [], photo: null,
  },
  {
    id: 'madanki-s',
    name: 'Dr. Madanki S',
    qualifications: [], designation: '',
    specialty: 'Gynaecologist & IVF', specialtyId: 'fertility',
    sessions: [{ clinicId: 'tollygunge', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], from: '10:00', to: '18:00' }],
    languages: ALL_LANGUAGES, videoConsult: true, rating: 4.8, reviewCount: null,
    bio: '', quote: '', treatmentTags: ['Fertility Treatment', 'IVF'], education: [], photo: null,
  },
]

// Days are unknown in the mock (only timings are given): every session is set Mon–Sat as a placeholder — flagged.

export const SOURCE_FLAGS = DOCTORS.filter((d) => d.sourceNote).map((d) => ({ id: d.id, note: d.sourceNote }))

// ---- helpers shared by the components ----
export const monogram = (name) => { const w = name.replace(/^Dr\.?\s+/i, '').split(/\s+/).filter(Boolean); return ((w[0]?.[0] ?? '') + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase() }   // first + last initials: 'K N Siddiqui' → KS

const fmt = (t) => { const [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'pm' : 'am'; const hh = ((h + 11) % 12) + 1; return m ? `${hh}:${String(m).padStart(2, '0')}${ap}` : `${hh}${ap}` }
export const sessionLabel = (s) => `${CLINICS[s.clinicId].short} · ${fmt(s.from)}–${fmt(s.to)}`
export const clinicsOf = (d) => [...new Set(d.sessions.map((s) => s.clinicId))].map((id) => CLINICS[id])
