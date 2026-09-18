import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import Icon from '../components/Icon.jsx'
import { DOCTORS, CLINICS, SPECIALTY_GROUPS, SPECIALTY_LABELS, specialtyGroupOf, availableToday, sessionsToday, nextSession, timeRange, monogram } from '../data/doctors.js'
import './FindDoctor.css'

// Find a Doctor (design/svg/Find a Doctor.svg). Everything below the hero is computed from data/doctors.js:
//   filters  — specialty groups (SPECIALTY_GROUPS + any ungrouped specialtyId), clinics, availability (today's weekday
//              against each doctor's session days; video consult), languages, and a minimum rating — each with a live
//              count of doctors that match it given the other active filters
//   search   — name / specialty / treatment tags, case-insensitive
//   sort     — name A–Z (the mock's default), name Z–A, rating high–low, available today first
//   paging   — PAGE_SIZE rows per page with Previous / numbers / Next
// The state is mirrored to the query string (?q=&s=&c=&a=&l=&r=&sort=&page=) so a filtered view can be shared.
// Copy verbatim from the mock; the list header's "100+ doctors…" line is replaced by the live result count because
// it must describe what is actually listed. The mock's eight rows include Dr. Smita Gutgutia twice — see doctors.js.

const PAGE_SIZE = 6
const SORTS = [
  { id: 'name-asc', label: 'Sort : name (A-Z)', fn: (a, b) => a.name.localeCompare(b.name) },
  { id: 'name-desc', label: 'Sort : name (Z-A)', fn: (a, b) => b.name.localeCompare(a.name) },
  { id: 'rating', label: 'Sort : rating (high to low)', fn: (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.name.localeCompare(b.name) },
  { id: 'today', label: 'Sort : available today first', fn: (a, b) => Number(availableToday(b)) - Number(availableToday(a)) || a.name.localeCompare(b.name) },
]
const RATINGS = [5, 4.5, 4, 3.5, 3]

const readState = () => {
  const q = new URLSearchParams(window.location.search)
  const list = (k) => (q.get(k) || '').split(',').filter(Boolean)
  return { q: q.get('q') || '', specialties: list('s'), clinics: list('c'), avail: list('a'), langs: list('l'), rating: Number(q.get('r')) || 0, sort: SORTS.some((s) => s.id === q.get('sort')) ? q.get('sort') : 'name-asc', page: Math.max(1, Number(q.get('page')) || 1) }
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

function Availability({ d }) {
  const today = sessionsToday(d)
  if (today.length) return <p className="drow__avail"><span className="drow__avail-dot" aria-hidden="true" />Available Today, {timeRange(today[0])}</p>
  const n = nextSession(d)
  if (!n) return <p className="drow__avail drow__avail--none">No sessions listed</p>
  return <p className="drow__avail drow__avail--next">Next: {n.dayName}, {timeRange(n.session)}</p>
}

function Row({ d }) {
  const clinics = [...new Set(d.sessions.map((s) => s.clinicId))]
  return (
    <li className="drow" data-reveal>
      <a className="drow__photo" href={`/doctors/${d.id}`} tabIndex={-1} aria-hidden="true">
        {d.photo ? <img src={d.photo} alt="" loading="lazy" decoding="async" /> : <span className="drow__monogram">{monogram(d.name)}</span>}
      </a>
      <div className="drow__body">
        <h3 className="drow__name"><a href={`/doctors/${d.id}`}>{d.name}</a></h3>
        <p className="drow__spec">{d.specialty}</p>
        <p className="drow__clinic"><Icon name="pin" className="drow__pin" />{clinics.map((c) => CLINICS[c].name).join(' · ')}</p>
        <Availability d={d} />
      </div>
      <ul className="drow__chips" aria-label="Languages and consultation options">
        {d.languages.map((l) => <li key={l} className="drow__chip">{l}</li>)}
        {d.videoConsult && <li className="drow__chip drow__chip--video">Video Consult</li>}
      </ul>
      <div className="drow__actions">
        <a className="drow__book" href="#book" data-form="book-appointment" data-doctor={d.id} data-section="find-doctor">Book</a>
        <a className="drow__profile" href={`/doctors/${d.id}`}>View Profile</a>
      </div>
    </li>
  )
}

export default function FindDoctor() {
  const [st, setSt] = useState(readState)
  useEffect(() => { writeState(st) }, [st])
  const update = (patch) => setSt((s) => ({ ...s, ...patch, page: patch.page ?? 1 }))
  const toggle = (k, v) => update({ [k]: st[k].includes(v) ? st[k].filter((x) => x !== v) : [...st[k], v] })

  // facet options with counts that respect every *other* active filter
  const count = (facet, test) => DOCTORS.filter((d) => matches(d, st, facet) && test(d)).length
  const specialtyOptions = useMemo(() => {
    const groups = SPECIALTY_GROUPS.map((g) => ({ id: g.id, label: g.label, n: count('specialties', (d) => g.members.includes(d.specialtyId)) }))
    const grouped = new Set(SPECIALTY_GROUPS.flatMap((g) => g.members))
    const extra = [...new Set(DOCTORS.map((d) => d.specialtyId))].filter((id) => !grouped.has(id)).map((id) => ({ id, label: SPECIALTY_LABELS[id] || id, n: count('specialties', (d) => d.specialtyId === id) }))
    return [...groups, ...extra]
  }, [st]) // eslint-disable-line react-hooks/exhaustive-deps
  const clinicOptions = Object.values(CLINICS).map((c) => ({ id: c.id, label: c.name, n: count('clinics', (d) => d.sessions.some((s) => s.clinicId === c.id)) }))
  const availOptions = [{ id: 'today', label: 'Available Today', n: count('avail', availableToday) }, { id: 'video', label: 'Offers Video Consult', n: count('avail', (d) => d.videoConsult) }]
  const langOptions = [...new Set(DOCTORS.flatMap((d) => d.languages))].map((l) => ({ id: l, label: l, n: count('langs', (d) => d.languages.includes(l)) }))

  const results = useMemo(() => DOCTORS.filter((d) => matches(d, st)).sort(SORTS.find((s) => s.id === st.sort).fn), [st])
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const page = Math.min(st.page, pages)
  const slice = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const active = st.specialties.length + st.clinics.length + st.avail.length + st.langs.length + (st.rating ? 1 : 0)
  const clear = () => setSt((s) => ({ ...s, specialties: [], clinics: [], avail: [], langs: [], rating: 0, page: 1 }))
  const goPage = (p) => { setSt((s) => ({ ...s, page: p })); document.getElementById('results')?.scrollIntoView({ block: 'start', behavior: 'auto' }) }

  const Facet = ({ title, k, options }) => (
    <fieldset className="facet">
      <legend className="facet__title">{title}</legend>
      {options.map((o) => (
        <label key={o.id} className={'facet__opt' + (o.n === 0 && !st[k].includes(o.id) ? ' facet__opt--empty' : '')}>
          <input type="checkbox" checked={st[k].includes(o.id)} onChange={() => toggle(k, o.id)} />
          <span className="facet__label">{o.label}</span><span className="facet__count">{o.n}</span>
        </label>
      ))}
    </fieldset>
  )

  return (
    <div className="page">
      <Header current="find" />
      <main>
        <section className="fd-hero band" aria-labelledby="fd-title" data-hero>
          <div className="inner fd-hero__inner">
            <div className="fd-hero__copy">
              <p className="fd-hero__eyebrow">Find your doctor</p>
              <h1 id="fd-title" className="fd-hero__title">Search our specialists by name, specialty, or clinic</h1>
              <p className="fd-hero__lead">100+ doctors across three clinics in Kolkata. Filter by what you need, or search for a name if someone's already been recommended to you.</p>
            </div>
            <div className="fd-hero__photo" data-overlap-ok><img src="/assets/doctors/find-hero.png" alt="Four Petals Health doctors" decoding="async" fetchPriority="high" /></div>
          </div>
        </section>

        <section className="fd band" aria-label="Doctor search">
          <div className="inner fd__inner">
            <details className="fd__filters" open>
              <summary className="fd__filters-toggle">Filters{active > 0 && <span className="fd__badge">{active}</span>}</summary>
              <div className="fd__panel">
                <label className="fd__search">
                  <span className="sr-only">Search by doctor name</span>
                  <svg className="fd__search-icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M13 13l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  <input type="search" placeholder="Search by doctor name.." value={st.q} onChange={(e) => update({ q: e.target.value })} autoComplete="off" />
                </label>
                <Facet title="Specialty" k="specialties" options={specialtyOptions} />
                <Facet title="Clinic" k="clinics" options={clinicOptions} />
                <Facet title="Availability" k="avail" options={availOptions} />
                <Facet title="Speaks" k="langs" options={langOptions} />
                <fieldset className="facet">
                  <legend className="facet__title">Patient's Rating</legend>
                  <div className="facet__stars" role="radiogroup" aria-label="Minimum rating">
                    {RATINGS.map((r) => (
                      <label key={r} className={'facet__star-opt' + (st.rating === r ? ' facet__star-opt--on' : '')}>
                        <input type="radio" name="rating" checked={st.rating === r} onChange={() => update({ rating: st.rating === r ? 0 : r })} onClick={() => { if (st.rating === r) update({ rating: 0 }) }} />
                        <span className="facet__star-row" aria-hidden="true">{[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" className={'facet__star' + (k + 1 <= r ? '' : k + 0.5 === r ? ' facet__star--half' : ' facet__star--off')} />)}</span>
                        <span className="facet__star-text">{r} & up</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {active > 0 && <button type="button" className="fd__clear" onClick={clear}>Clear filters</button>}
              </div>
            </details>

            <div className="fd__results" id="results">
              <div className="fd__bar">
                <p className="fd__count" aria-live="polite">{results.length === 0 ? 'No doctors match these filters.' : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, results.length)} of ${results.length} doctor${results.length === 1 ? '' : 's'}`}</p>
                <label className="fd__sort">
                  <span className="sr-only">Sort</span>
                  <select value={st.sort} onChange={(e) => update({ sort: e.target.value })}>{SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
                </label>
              </div>
              {results.length > 0 ? (
                <ul className="fd__list">{slice.map((d) => <Row key={d.id} d={d} />)}</ul>
              ) : (
                <div className="fd__empty"><p>Try a different spelling, or clear a filter. You can also tell us what you need and we will match you to a specialist.</p><a className="drow__book" href="#ask" data-form="ask-doctor" data-section="find-doctor-empty">Ask Doctor</a></div>
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

        <section className="fd-match band" aria-labelledby="fd-match-title">
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
