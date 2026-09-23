import { useEffect, useMemo, useRef, useState } from 'react'
import { search, browse, tokens, pendingTypes } from '../search/engine.js'
import { monogram, photoSmall } from '../data/doctors.js'
import { Availability } from './DoctorCard.jsx'
import Icon from './Icon.jsx'
import Img from './Img.jsx'
import { track } from '../analytics.js'
import './SearchDialog.css'

// Site search overlay (2026-09-23). Loaded on first open by SearchLauncher; native <dialog> like the lead form, so
// focus is trapped, Escape closes and the backdrop closes. The field is an ARIA combobox: focus stays in it, the arrow
// keys move through every result across the groups, Enter goes (to the top result when none is highlighted).
// Phones: full screen, field at the top, Close in a bottom bar in thumb reach; the keyboard's Go key opens the top hit.
// Doctor rows reuse the doctor card's avatar and <Availability>; the full card is too tall to arrow through.
const optId = (i) => `srch-opt-${i}`

function Row({ r }) {
  if (r.type === 'doctor') return (
    <>
      <span className="srch__avatar">{r.item.photo ? <Img src={photoSmall(r.item)} alt="" width="44" height="44" /> : <span>{monogram(r.item.name)}</span>}</span>
      <span className="srch__text"><span className="srch__title">{r.title}</span><span className="srch__sub">{r.sub}</span><Availability d={r.item} /></span>
    </>
  )
  return (
    <>
      <span className="srch__glyph"><Icon name={r.type === 'clinic' ? 'pin' : 'petalOutline'} /></span>
      <span className="srch__text"><span className="srch__title">{r.title}</span>{r.sub && <span className="srch__sub">{r.sub}</span>}</span>
    </>
  )
}

export default function SearchDialog({ req }) {
  const ref = useRef(null)
  const input = useRef(null)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(-1)
  const res = useMemo(() => (tokens(q).length ? search(q) : null), [q])   // null → the browse view (also for a query of only "dr", "near"…)
  const groups = useMemo(() => (res ? res.groups : [{ type: 'finder', label: 'Doctors', results: [{ type: 'finder', id: 'find-a-doctor', title: 'Find a Doctor', sub: 'Every doctor, with filters by specialty, clinic and availability', href: '/find-a-doctor/' }] }, ...browse()]), [res])
  const flat = useMemo(() => groups.flatMap((g) => g.results), [groups])

  useEffect(() => {
    const d = ref.current; if (!d) return undefined
    setQ(''); setActive(-1)
    if (!d.open) { d.showModal(); document.documentElement.dataset.dialog = 'open'; track('search_open', { source: req.source }) }
    requestAnimationFrame(() => input.current?.focus())
    const onClose = () => {
      if (document.querySelector('dialog[open]')) return   // handed over to the lead dialog (Ask a Doctor below): it owns focus and the flag now
      delete document.documentElement.dataset.dialog
      req.returnTo?.focus?.()
    }
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [req])

  useEffect(() => { setActive(res && res.total ? 0 : -1) }, [res])   // a query highlights its top result, so Enter goes there
  useEffect(() => { if (active >= 0) document.getElementById(optId(active))?.scrollIntoView({ block: 'nearest' }) }, [active])
  useEffect(() => {   // analytics, debounced like the doctor search
    if (!res) return undefined
    const t = setTimeout(() => {
      const n = Object.fromEntries(res.groups.map((g) => [g.type, g.results.length]))
      track(res.total ? 'search_query' : 'search_no_results', { q: q.trim(), results: res.total, doctors: n.doctor || 0, treatments: n.treatment || 0, clinics: n.clinic || 0 })
    }, 800)
    return () => clearTimeout(t)
  }, [res]) // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => ref.current?.close()
  const go = (r, rank) => {
    track('search_select', { type: r.type, id: r.id, rank, q: q.trim() })
    close()
    window.location.assign(r.href)
  }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(flat.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Enter') { const r = flat[active]; if (r) { e.preventDefault(); go(r, active) } }
    else if (e.key === 'Escape') { e.preventDefault(); close() }   // a search field's own Escape only clears the text; here it closes, as everywhere else
  }
  const pending = pendingTypes.join(', ')

  return (
    <dialog ref={ref} className="sdialog" aria-label="Search" onClick={(e) => { if (e.target === ref.current) close() }}>
      <div className="sdialog__panel">
        <div className="sdialog__bar">
          <Icon name="search" className="sdialog__icon" />
          <input
            ref={input} className="sdialog__input" type="search" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
            role="combobox" aria-expanded={flat.length > 0} aria-controls="srch-list" aria-autocomplete="list" aria-activedescendant={active >= 0 ? optId(active) : undefined}
            aria-label="Search doctors, treatments and clinics" placeholder="Search doctors, treatments, clinics" autoComplete="off" spellCheck="false" enterKeyHint="go"
          />
          <button type="button" className="sdialog__x" onClick={close} aria-label="Close search">×</button>
        </div>
        <div className="sdialog__body">
          {res && !res.total ? (
            <div className="srch__none">
              <p className="srch__none-title">No matches for “{q.trim()}”</p>
              <p className="srch__none-hint">Try a doctor’s name, a specialty or a clinic area.</p>
              <div className="srch__none-actions">
                <a className="srch__action srch__action--primary" href="/find-a-doctor/" onClick={() => track('search_fallback', { action: 'find-a-doctor', q: q.trim() })}>Browse all doctors</a>
                <button type="button" className="srch__action" data-form="ask-doctor" data-section="search" onClick={close}>Ask a Doctor</button>
                <a className="srch__action" href="tel:9147405955"><Icon name="phone" className="srch__action-icon" />Call 9147405955</a>
              </div>
            </div>
          ) : (
            <div id="srch-list" role="listbox" aria-label={res ? 'Search results' : 'Browse'}>
              {groups.map((g) => (
                <div key={g.type} role="group" aria-labelledby={`srch-g-${g.type}`} className="srch__group">
                  <p id={`srch-g-${g.type}`} className="srch__label">{g.label}{res && <span className="srch__count">{g.results.length}</span>}</p>
                  {g.results.map((r) => {
                    const i = flat.indexOf(r)
                    return (
                      <a key={r.type + r.id} id={optId(i)} role="option" aria-selected={i === active} tabIndex={-1} href={r.href}
                        className={'srch__opt srch__opt--' + r.type + (i === active ? ' srch__opt--active' : '')}
                        onMouseMove={() => { if (i !== active) setActive(i) }} onClick={(e) => { e.preventDefault(); go(r, i) }}>
                        <Row r={r} />
                      </a>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
          <p className="sr-only" role="status">{res ? (res.total ? `${res.total} result${res.total === 1 ? '' : 's'}` : 'No results') : ''}</p>
        </div>
        <div className="sdialog__foot">
          {pending && <p className="sdialog__note">{pending} are not searchable yet.</p>}
          <button type="button" className="sdialog__done" onClick={close}>Close</button>
        </div>
      </div>
    </dialog>
  )
}
