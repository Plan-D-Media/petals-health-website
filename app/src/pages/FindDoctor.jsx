import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import Icon from '../components/Icon.jsx'
import Img from '../components/Img.jsx'
import { track } from '../analytics.js'
import { DOCTORS, CLINICS, SPECIALTY_GROUPS, SPECIALTY_LABELS, specialtyGroupOf, availableToday, LANGUAGES_CONFIRMED } from '../data/doctors.js'
import '../templates/treatment.css'
import './FindDoctor.css'

// Find a Doctor (design/svg/Find a Doctor.svg) — redesign 2026-09-22 (design/treatment-redesign.md, "Find a Doctor").
// Shelf hero with the four-doctor cut-out and the facts the data can prove · the search on a tint band: a filter panel
// (sticky beside the results from 1024; closed by default below it) and the shared DoctorCard in a grid · the navy
// "Not sure who to pick?" panel · footer. Everything below the hero is computed from data/doctors.js:
//   filters  — specialty groups (SPECIALTY_GROUPS + any ungrouped specialtyId), clinics, availability (today's weekday
//              against each doctor's session days; video consult), languages — each with a live count given the other
//              active filters. An option nothing matches is not offered (unless it is already selected, so it can be
//              undone); a facet with nothing to offer is not drawn. Applied filters repeat as removable chips above
//              the results.
//   rating   — RATING_FACET: off while every listed doctor is rated 4.8–4.9 (it cannot separate them); flip it on
//              when the doctor sheet brings a spread worth filtering. A ?r= in the URL still applies and shows.
//   search   — name / specialty / treatment tags, case-insensitive
//   sort     — name A–Z (the mock's default), name Z–A, rating high–low, available today first
//   paging   — PAGE_SIZE per page with Previous / numbers / Next; one page until the list passes it
// The state is mirrored to the query string (?q=&s=&c=&a=&l=&r=&sort=&page=) so a filtered view can be shared —
// the clinic cards link here with ?c=<clinic>. Copy verbatim from the mock; the "100+ doctors…" lead is the mock's
// and the facts row beside it states the live count. The list header shows the live result count.

const PAGE_SIZE = 12
const RATING_FACET = false
const SORTS = [
  { id: 'name-asc', label: 'Sort : name (A-Z)', fn: (a, b) => a.name.localeCompare(b.name) },
  { id: 'name-desc', label: 'Sort : name (Z-A)', fn: (a, b) => b.name.localeCompare(a.name) },
  { id: 'rating', label: 'Sort : rating (high to low)', fn: (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.name.localeCompare(b.name) },
  { id: 'today', label: 'Sort : available today first', fn: (a, b) => Number(availableToday(b)) - Number(availableToday(a)) || a.name.localeCompare(b.name) },
]
const RATINGS = [5, 4.5, 4, 3.5, 3]
const DESKTOP = '(min-width: 1024px)'

const readState = () => {
  const q = new URLSearchParams(window.location.search)
  const list = (k) => (q.get(k) || '').split(',').filter(Boolean)
  return { q: q.get('q') || '', specialties: list('s'), clinics: list('c'), avail: list('a'), langs: LANGUAGES_CONFIRMED ? list('l') : [], rating: Number(q.get('r')) || 0, sort: SORTS.some((s) => s.id === q.get('sort')) ? q.get('sort') : 'name-asc', page: Math.max(1, Number(q.get('page')) || 1) }
}
const writeState = (st) => {
  const q = new URLSearchParams()
  if (st.q) q.set('q', st.q)
  if (st.specialties.length) q.set('s', st.specialties.join(','))
  if (st.clinics.length) q.set('c', st.clinics.join(','))
  if (st.avail.length) q.set('a', st.avail.join(','))
  if (st.langs.length) q.set('l', st.langs.join(','))
  if (st.rating) q.set('r', String(st.rating))
  if (st.sort !== 'name-asc') q.set('sort', st.sort)
  if (st.page > 1) q.set('page', String(st.page))
  const s = q.toString()
  window.history.replaceState(null, '', window.location.pathname + (s ? '?' + s : ''))
}

// one predicate per facet, so each facet's counts can ignore its own selection (standard faceted-search behaviour)
const facetTests = {
  specialties: (d, sel) => !sel.length || sel.includes(specialtyGroupOf(d)),
  clinics: (d, sel) => !sel.length || d.sessions.some((s) => sel.includes(s.clinicId)),
  avail: (d, sel) => (!sel.includes('today') || availableToday(d)) && (!sel.includes('video') || d.videoConsult),
  langs: (d, sel) => !sel.length || sel.every((l) => d.languages.includes(l)),
  rating: (d, min) => !min || (d.rating ?? 0) >= min,
  q: (d, q) => { const t = q.trim().toLowerCase(); return !t || [d.name, d.specialty, ...(d.treatmentTags || [])].some((x) => x.toLowerCase().includes(t)) },
}
const matches = (d, st, except) => Object.entries(facetTests).every(([k, test]) => k === except || test(d, st[k]))

export default function FindDoctor() {
  const [st, setSt] = useState(readState)
  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP).matches)
  useEffect(() => { writeState(st) }, [st])
  useEffect(() => { const mq = window.matchMedia(DESKTOP); const on = (e) => setDesktop(e.matches); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on) }, [])
  const update = (patch) => setSt((s) => ({ ...s, ...patch, page: patch.page ?? 1 }))
  const toggle = (k, v) => update({ [k]: st[k].includes(v) ? st[k].filter((x) => x !== v) : [...st[k], v] })

  // facet options with counts that respect every *other* active filter; options nothing matches are dropped unless selected
  const count = (facet, test) => DOCTORS.filter((d) => matches(d, st, facet) && test(d)).length
  const offer = (k, opts) => opts.filter((o) => o.n > 0 || st[k].includes(o.id))
  const specialtyOptions = useMemo(() => {
    const groups = SPECIALTY_GROUPS.map((g) => ({ id: g.id, label: g.label, n: count('specialties', (d) => g.members.includes(d.specialtyId)) }))
    const grouped = new Set(SPECIALTY_GROUPS.flatMap((g) => g.members))
    const extra = [...new Set(DOCTORS.map((d) => d.specialtyId))].filter((id) => !grouped.has(id)).map((id) => ({ id, label: SPECIALTY_LABELS[id] || id, n: count('specialties', (d) => d.specialtyId === id) }))
    return offer('specialties', [...groups, ...extra])
  }, [st]) // eslint-disable-line react-hooks/exhaustive-deps
  const clinicOptions = offer('clinics', Object.values(CLINICS).map((c) => ({ id: c.id, label: c.name, n: count('clinics', (d) => d.sessions.some((s) => s.clinicId === c.id)) })))
  const availOptions = offer('avail', [{ id: 'today', label: 'Available Today', n: count('avail', availableToday) }, { id: 'video', label: 'Offers Video Consult', n: count('avail', (d) => d.videoConsult) }])
  const langOptions = offer('langs', [...new Set(DOCTORS.flatMap((d) => d.languages))].map((l) => ({ id: l, label: l, n: count('langs', (d) => d.languages.includes(l)) })))
  const facets = [
    { title: 'Specialty', k: 'specialties', options: specialtyOptions },
    { title: 'Clinic', k: 'clinics', options: clinicOptions },
    { title: 'Availability', k: 'avail', options: availOptions },
    ...(LANGUAGES_CONFIRMED ? [{ title: 'Speaks', k: 'langs', options: langOptions }] : []),   // hidden while every doctor carries the placeholder language list (doctors.js)
  ]

  const results = useMemo(() => DOCTORS.filter((d) => matches(d, st)).sort(SORTS.find((s) => s.id === st.sort).fn), [st])
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const page = Math.min(st.page, pages)
  const slice = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  useEffect(() => { const t = setTimeout(() => track('doctor_search', { ...st, results: results.length }), 800); return () => clearTimeout(t) }, [st]) // eslint-disable-line react-hooks/exhaustive-deps
  const applied = [
    ...facets.flatMap((f) => st[f.k].map((id) => ({ k: f.k, id, label: f.options.find((o) => o.id === id)?.label || id }))),
    ...(st.rating ? [{ k: 'rating', id: st.rating, label: `${st.rating} & up` }] : []),
  ]
  const active = applied.length
  const remove = (a) => (a.k === 'rating' ? update({ rating: 0 }) : toggle(a.k, a.id))
  const clear = () => setSt((s) => ({ ...s, specialties: [], clinics: [], avail: [], langs: [], rating: 0, page: 1 }))
  const goPage = (p) => { setSt((s) => ({ ...s, page: p })); document.getElementById('results')?.scrollIntoView({ block: 'start', behavior: 'auto' }) }
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`
  const countLine = results.length === 0 ? 'No doctors match these filters.' : results.length <= PAGE_SIZE ? plural(results.length, 'doctor') : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, results.length)} of ${results.length} doctors`

  const facts = [
    { label: plural(DOCTORS.length, 'doctor') + ' listed', source: 'the doctor list, src/data/doctors.js' },
    { label: `${Object.keys(CLINICS).length} clinics across Kolkata`, source: 'src/data/clinics.js' },
    { label: `${DOCTORS.filter((d) => d.videoConsult).length} offer video consults`, source: 'videoConsult in the doctor list' },
  ]

  const Facet = ({ title, k, options }) => options.length === 0 ? null : (
    <fieldset className="facet">
      <legend className="facet__title">{title}</legend>
      {options.map((o) => (
        <label key={o.id} className="facet__opt">
          <input type="checkbox" checked={st[k].includes(o.id)} onChange={() => toggle(k, o.id)} />
          <span className="facet__label">{o.label}</span><span className="facet__count">{o.n}</span>
        </label>
      ))}
    </fieldset>
  )

  return (
    <div className="page">
      <Header current="find" />
      <main id="main" tabIndex={-1}>
        <section className="th tb th--right fd-hero" aria-labelledby="fd-title">
          <div className="inner th__inner">
            <div className="th__stage fd-hero__stage" data-overlap-ok>
              <Img src="/assets/doctors/find-hero.png" alt="Four Petals Health doctors" priority />
            </div>
            <div className="th__copy">
              <p className="tb__eyebrow fd-hero__eyebrow">Find your doctor</p>
              <h1 id="fd-title" className="th__title"><span className="th__line th__line--primary">Search our specialists by name, specialty, or clinic</span></h1>
              <p className="th__lead">100+ doctors across three clinics in Kolkata. Filter by what you need, or search for a name if someone's already been recommended to you.</p>
              <a className="th__cta" href="#results">Browse doctors</a>
              <ul className="th__facts" aria-label="Quick facts">{facts.map((f) => <li key={f.label} title={`Source: ${f.source}`}>{f.label}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="fd tb tb--tint" aria-label="Doctor search">
          <div className="inner fd__inner">
            <details className="fd__filters" open={desktop}>
              <summary className="fd__filters-toggle">Filters{active > 0 && <span className="fd__badge">{active}</span>}</summary>
              <div className="fd__panel">
                <label className="fd__search">
                  <span className="sr-only">Search by doctor name</span>
                  <svg className="fd__search-icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M13 13l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  <input type="search" placeholder="Search by doctor name.." value={st.q} onChange={(e) => update({ q: e.target.value })} autoComplete="off" />
                </label>
                {facets.map((f) => <Facet key={f.k} {...f} />)}
                {(RATING_FACET || st.rating > 0) && (
                  <fieldset className="facet">
                    <legend className="facet__title">Patient's Rating</legend>
                    <div className="facet__stars" role="radiogroup" aria-label="Minimum rating">
                      <label className={'facet__star-opt facet__star-opt--any' + (st.rating === 0 ? ' facet__star-opt--on' : '')}>
                        <input type="radio" name="rating" checked={st.rating === 0} onChange={() => update({ rating: 0 })} />
                        <span className="facet__star-text">Any rating</span>
                      </label>
                      {RATINGS.map((r) => (
                        <label key={r} className={'facet__star-opt' + (st.rating === r ? ' facet__star-opt--on' : '')}>
                          <input type="radio" name="rating" checked={st.rating === r} onChange={() => update({ rating: st.rating === r ? 0 : r })} onClick={() => { if (st.rating === r) update({ rating: 0 }) }} />
                          <span className="facet__star-row" aria-hidden="true">{[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" className={'facet__star' + (k + 1 <= r ? '' : k + 0.5 === r ? ' facet__star--half' : ' facet__star--off')} />)}</span>
                          <span className="facet__star-text">{r} & up</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
                {active > 0 && <button type="button" className="fd__clear" onClick={clear}>Clear filters</button>}
              </div>
            </details>

            <div className="fd__results" id="results">
              <div className="fd__bar">
                <p className="fd__count" aria-live="polite">{countLine}</p>
                <label className="fd__sort">
                  <span className="sr-only">Sort</span>
                  <select value={st.sort} onChange={(e) => update({ sort: e.target.value })}>{SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
                </label>
              </div>
              {active > 0 && (
                <ul className="fd__applied" aria-label="Applied filters">
                  {applied.map((a) => <li key={a.k + a.id}><button type="button" className="fd__chip" onClick={() => remove(a)}>{a.label}<span className="fd__chip-x" aria-hidden="true">×</span><span className="sr-only">, remove</span></button></li>)}
                  <li><button type="button" className="fd__chip fd__chip--clear" onClick={clear}>Clear all</button></li>
                </ul>
              )}
              {results.length > 0 ? (
                <ul className="fd__list">{slice.map((d) => <li key={d.id}><DoctorCard doctor={d} list section="find-doctor" heading="h2" /></li>)}</ul>
              ) : (
                <div className="fd__empty"><p>Try a different spelling, or clear a filter. You can also tell us what you need and we will match you to a specialist.</p><a className="fd__empty-cta" href="#ask" data-form="ask-doctor" data-section="find-doctor-empty">Ask Doctor</a></div>
              )}
              {pages > 1 && (
                <nav className="pager" aria-label="Pages">
                  <button type="button" className="pager__arrow" onClick={() => goPage(page - 1)} disabled={page === 1}><Icon name="chevron" className="pager__chev pager__chev--prev" />Previous</button>
                  <ol className="pager__nums">{Array.from({ length: pages }, (_, i) => i + 1).map((p) => <li key={p}><button type="button" className={'pager__num' + (p === page ? ' pager__num--on' : '')} aria-current={p === page ? 'page' : undefined} onClick={() => goPage(p)}>{p}</button></li>)}</ol>
                  <button type="button" className="pager__arrow" onClick={() => goPage(page + 1)} disabled={page === pages}>Next<Icon name="chevron" className="pager__chev pager__chev--next" /></button>
                </nav>
              )}
            </div>
          </div>
        </section>

        <section className="fd-match tb" aria-labelledby="fd-match-title">
          <div className="inner"><div className="fd-match__panel" data-reveal>
            <div>
              <h2 id="fd-match-title" className="fd-match__title">Not sure who to pick ?</h2>
              <p className="fd-match__text">Tell us your symptoms or concern and we'll match you to the right specialist and clinic.</p>
            </div>
            <a className="fd-match__cta" href="#ask" data-form="ask-doctor" data-section="find-doctor-match">Ask Doctor</a>
          </div></div>
        </section>
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
