import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { track } from '../analytics.js'
import './ActionRail.css'

// Floating action rail (2026-09-23): circular buttons at the viewport's middle-left, ≥1024 only (below that the bottom
// action bar and the header carry the same actions). Mounted once by Header, so every page gets it in the same place
// and order. Appears once the hero has scrolled out (same trigger as the action bar); hidden while a dialog is open.
//   Hover or keyboard focus reveals the label; neither acts. Click / Enter / Space acts. Escape collapses.
//   Touch at ≥1024 (no hover): the first tap expands, a second tap on the expanded pill acts, a tap elsewhere collapses.
// The label is a clipped pill inside the button — it paints over the page and takes no layout, so nothing shifts.
// Book and Expert Opinion open the lead dialog through its data-form delegation (FormDialog); data-section="rail".
const ITEMS = [
  { id: 'book', label: 'Book an Appointment', icon: 'calendar', form: 'book-appointment' },
  { id: 'opinion', label: 'Get Expert Opinion', icon: 'askDoctor', form: 'ask-doctor' },
  { id: 'clinic', label: 'Find a Clinic', icon: 'pin', href: '/clinics' },
]

export default function ActionRail({ on }) {
  const [open, setOpen] = useState(null)        // expanded by tap (touch) — hover and focus expand through CSS
  const [hushed, setHushed] = useState(false)   // Escape: collapse the hovered/focused label until the pointer or focus moves on
  const touch = useRef(false)
  const root = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const away = (e) => { if (!root.current?.contains(e.target)) setOpen(null) }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])
  useEffect(() => {   // Escape also collapses a label revealed by hover alone (focus elsewhere, so the button's own handler never sees it)
    const esc = (e) => { if (e.key === 'Escape' && root.current?.matches(':hover')) { setOpen(null); setHushed(true) } }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [])

  const act = (e, it) => {
    if (touch.current && open !== it.id) { e.preventDefault(); e.stopPropagation(); setOpen(it.id); return }   // first tap: expand only (stopPropagation keeps the dialog and analytics listeners out of it)
    track('rail_click', { action: it.id, source: 'rail' })
    setOpen(null)
  }
  const onKey = (e) => {
    if (e.key === 'Escape') { setOpen(null); setHushed(true) }
    else if (e.key === ' ' && e.currentTarget.tagName === 'A') { e.preventDefault(); e.currentTarget.click() }   // Space activates the link too, like the buttons
  }
  const common = (it) => ({
    className: 'rail__btn' + (open === it.id ? ' rail__btn--open' : ''),
    onPointerDown: (e) => { touch.current = e.pointerType === 'touch' },
    onClick: (e) => act(e, it),
    onKeyDown: onKey,
    onBlur: () => setHushed(false),
  })
  const body = (it) => [
    <span key="c" className="rail__icon"><Icon name={it.icon} /></span>,
    <span key="l" className="rail__label">{it.label}</span>,
  ]

  return (
    <nav ref={root} className={'rail' + (on ? ' rail--on' : '') + (hushed ? ' rail--hushed' : '')} aria-label="Quick actions" onPointerLeave={() => setHushed(false)}>
      <ul className="rail__list">
        {ITEMS.map((it) => (
          <li key={it.id} className="rail__item">
            {it.href
              ? <a href={it.href} {...common(it)}>{body(it)}</a>
              : <button type="button" data-form={it.form} data-section="rail" {...common(it)}>{body(it)}</button>}
          </li>
        ))}
      </ul>
    </nav>
  )
}
