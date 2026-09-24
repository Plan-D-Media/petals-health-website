import { DOCTORS, CLINICS, SPECIALTY_GROUPS, SPECIALTY_LABELS, clinicsOf, specialtyGroupOf, LANGUAGES_CONFIRMED } from '../data/doctors.js'
import { SITES } from '../data/clinics.js'
import TREATMENTS from '../generated/search-treatments.js'
import { SYNONYMS } from './synonyms.js'
import { BANGLADESH } from '../content/bangladesh.js'

// Site search (2026-09-23), client-side over the data files. Loads with the overlay on first open, never with a page.
// Each source turns its data into records: { type, id, title, sub, href, item, fields: [[text, weight], …] }.
// A new content type (the blog) is one more entry in SOURCES — the matcher, grouping and overlay need no change.
// Weights: the record's own name 10 · what it is (specialty, department) 6 · where (clinic, area) 4 · language 3 ·
// services and treatment tags 2.
const groupLabel = (d) => SPECIALTY_GROUPS.find((g) => g.id === specialtyGroupOf(d))?.label || SPECIALTY_LABELS[d.specialtyId] || ''

export const SOURCES = [
  {
    type: 'doctor', label: 'Doctors',
    records: () => DOCTORS.map((d) => ({
      type: 'doctor', id: d.id, title: d.name, href: `/doctors/${d.id}/`, item: d,
      sub: [d.specialty, clinicsOf(d).map((c) => c.short).join(', ')].filter(Boolean).join(' · '),
      fields: [
        [d.name.replace(/^Dr\.?\s+/i, ''), 10],
        [[d.specialty, d.designation, groupLabel(d)].join(' '), 6],
        [clinicsOf(d).map((c) => [c.name, c.short, c.area]).flat().join(' '), 4],
        ...(LANGUAGES_CONFIRMED ? [[d.languages.join(' '), 3]] : []),   // placeholder languages match everyone (doctors.js)
        [[...(d.treatmentTags || []), ...(d.treats || []).flatMap((t) => [t.heading, ...t.tags])].join(' '), 2],
      ],
    })),
  },
  {
    type: 'treatment', label: 'Treatments',
    records: () => TREATMENTS.map((t) => ({
      type: 'treatment', id: t.id, title: t.title, href: t.href, item: t,
      sub: t.services.slice(0, 3).join(' · '),
      fields: [[t.title, 10], [t.department, 6], [t.services.join(' '), 2]],
    })),
  },
  {
    type: 'clinic', label: 'Clinics',
    records: () => SITES.map((s) => ({
      type: 'clinic', id: s.id, title: s.name, href: `/clinics/#clinic-${s.id}`, item: s,
      sub: s.address.join(' '),
      fields: [[[s.name, ...s.tile, ...(s.searchAlso || [])].join(' '), 10], [[CLINICS[s.id]?.name, s.region].join(' '), 4], [s.address.join(' '), 2]],
    })).concat({   // Bangladesh: not open yet, no address — found by its name only, so it never crowds a Kolkata specialty search
      type: 'clinic', id: 'bangladesh', title: BANGLADESH.title, href: '/petals-clinic-in-bangladesh/', item: null, sub: BANGLADESH.headline,
      fields: [[BANGLADESH.title, 10]],
    }),
  },
  { type: 'article', label: 'Articles', pending: true, records: () => [] },   // the blog does not exist yet; its posts plug in here
]

const STOP = new Set(['dr', 'doctor', 'the', 'a', 'an', 'in', 'at', 'near', 'for', 'and', 'of', 'me', 'my'])
export const normalize = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
export const tokens = (q) => normalize(q).split(' ').filter((t) => t && !STOP.has(t))

const prefixLen = (a, b) => { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i }
// 1 when a word starts with the token; 0.8 for a shared stem ("gynaecologist" → gynaecology, "cardiologist" → cardiology)
function quality(tok, words) {
  let best = 0
  for (const w of words) {
    if (w.startsWith(tok)) return 1
    if (tok.length >= 5 && w.length >= 5 && prefixLen(tok, w) >= Math.max(5, Math.ceil(0.75 * Math.max(tok.length, w.length)))) best = 0.8   // the stem covers ¾ of the longer word, so "childzzq" does not match "child"
  }
  return best
}

let INDEX = null
const index = () => INDEX || (INDEX = SOURCES.flatMap((s) => s.records().map((r) => ({ ...r, words: r.fields.map(([text, w]) => [normalize(text).split(' '), w]) }))))

/** → { total, groups: [{ type, label, results: [record…] }] } for a query; groups keep SOURCES order, empty ones dropped */
export function search(q) {
  const toks = tokens(q)
  if (!toks.length) return { total: 0, groups: [] }
  const nq = normalize(q)
  const scored = []
  for (const r of index()) {
    let score = 0
    for (const t of toks) {
      const alts = [t, ...(SYNONYMS[t] || [])]
      let best = 0
      for (const [words, weight] of r.words) for (const a of alts) best = Math.max(best, weight * quality(a, words) * (a === t ? 1 : 0.9))
      if (!best) { score = 0; break }   // every word of the query must match somewhere
      score += best
    }
    if (score) scored.push({ r, score: score + (normalize(r.title).replace(/^dr /, '').startsWith(nq) ? 5 : 0) })
  }
  scored.sort((a, b) => b.score - a.score || a.r.title.localeCompare(b.r.title))
  const groups = SOURCES.filter((s) => !s.pending).map((s) => ({ type: s.type, label: s.label, results: scored.filter((x) => x.r.type === s.type).map((x) => x.r) })).filter((g) => g.results.length)
  return { total: scored.length, groups }
}

/** the empty state: what there is to browse, from the same records (treatments and clinics; doctors via Find a Doctor) */
export const browse = () => {
  const all = index()
  return [
    { type: 'treatment', label: 'Treatments', results: all.filter((r) => r.type === 'treatment') },
    { type: 'clinic', label: 'Clinics', results: all.filter((r) => r.type === 'clinic') },
  ]
}
export const pendingTypes = SOURCES.filter((s) => s.pending).map((s) => s.label)
