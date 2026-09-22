// Data helpers shared by the treatment templates (2026-09-21 redesign). Everything a page shows beyond its own copy is
// derived here, from the doctor data or the content file, so the rules are in one place:
//   teamFor      doctors whose specialtyId matches the page — no substitutes (design/treatment-redesign.md, condition 2)
//   factsFor     the quick-facts row: only verified facts — explicit `facts` from the content file (each with a
//                `source`), plus two derived from the matching doctors' records (their clinics; video consult when
//                every one offers it). A page with no matching doctor and no explicit facts renders no row.
//   rankServices lead / standard / compact ranks: `lead: true` in content marks the client's priority; default is the
//                first card in the mock's order. Cards past `compactFrom` (default 8) render as compact rows.
//   relatedFor   the "More at Petals Health" row: `related` slugs from content, else the page's neighbours in the
//                Treatments menu order (navigation, not a clinical relation).
import { DOCTORS, clinicsOf } from '../data/doctors.js'
import { TREATMENT_LIST } from '../content/treatments/list.js'

export const teamFor = (c) => DOCTORS.filter((d) => d.specialtyId === c.specialtyId)

export function factsFor(c, team = teamFor(c)) {
  const facts = []
  for (const f of c.facts || []) if (f.label && f.source) facts.push({ label: f.label, source: f.source })
  if (team.length) {
    const clinics = [...new Set(team.flatMap((d) => clinicsOf(d).map((x) => x.name)))]
    if (clinics.length) facts.push({ label: clinics.length === 1 ? `At ${clinics[0]}` : `At ${clinics.slice(0, -1).join(', ')} and ${clinics.at(-1)}`, source: 'doctors.js sessions' })
    if (team.every((d) => d.videoConsult)) facts.push({ label: 'Video consult available', source: 'doctors.js videoConsult' })
  }
  return facts
}

export function rankServices(services, c, { noLead = false } = {}) {
  const leadIndex = noLead ? -1 : Math.max(0, services.findIndex((s) => s.lead || s.flagship))
  // more than eight services: six cards, the rest as compact rows (never a single orphan row)
  const compactFrom = c.compactFrom ?? (services.length > 8 ? 6 : Infinity)
  return services.map((s, i) => ({ ...s, rank: i === leadIndex ? 'lead' : i >= compactFrom ? 'compact' : 'standard', index: i }))
}
/** how many grid cells the "ask" tile must span to complete the last row (4 columns from 1024, 2 from 768) */
export const askSpan = (cards) => { const cells = cards.reduce((a, s) => a + (s.rank === 'lead' ? 2 : 1), 0); return { four: (4 - (cells % 4)) % 4 || 4, two: (2 - (cells % 2)) % 2 || 2 } }

// the Treatments menu order (Header.jsx), by canonical slug
const MENU = ['womens-care', 'child-care', 'petals-ivf', 'aesthetics', 'dentistry', 'multispecialty-clinic', 'yoga-wellness', 'pain-management-rejuvenation', 'audiology']
void TREATMENT_LIST
const TITLES = { 'child-care': 'Child Care', 'pain-management-rejuvenation': 'Pain Management & Rejuvenation', 'audiology': 'Audiology', 'yoga-wellness': 'Yoga & Wellness', 'multispecialty-clinic': 'Multispecialty Clinic', 'womens-care': "Women's Care", 'dentistry': 'Dentistry', 'aesthetics': 'Aesthetics', 'petals-ivf': 'Petals IVF' }
export function relatedFor(c) {
  const slugs = c.related || (() => { const i = MENU.indexOf(c.slug); return [MENU[(i + MENU.length - 1) % MENU.length], MENU[(i + 1) % MENU.length], MENU[(i + 2) % MENU.length]] })()
  return slugs.filter((s) => s !== c.slug && TITLES[s]).map((s) => ({ slug: s, title: TITLES[s], href: `/treatments/${s}` }))
}

// the lead form's department select uses the page title where it matches the department list
export const departmentFor = (c) => c.title
