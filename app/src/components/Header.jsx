import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import NavMenu from './NavMenu.jsx'
import './Header.css'

// Geometry: design/hero-values.md ("Bars") for sizes; layout re-cut 2026-09-16 (design/polish-proposals.md §5):
// both bars are flex rows aligned to the 1366 content container (95 px margins), with a regular rhythm instead of the
// mock's hand-placed lefts.
// Dropdowns: NavMenu.jsx. DEMO STAGE — only Treatments is wired (design/svg/8.svg); the other items stay static links
// until the behaviour is approved.
// TODO(breakpoints): desktop only; no narrower frames exist in the design.

const TREATMENTS = [   // nine items, in the mock's order (spellings corrected: Womans, Cosmetice, Welness, Rejuvination)
  { label: "Women's Care", href: '/treatments/womens-care' },
  { label: 'Child Care', href: '/treatments/child-care' },
  { label: 'Fertility Care', href: '/treatments/fertility-care' },
  { label: 'Cosmetic Gynaecology & Aesthetics', href: '/treatments/cosmetic-gynaecology-aesthetics' },
  { label: 'Dentistry', href: '/treatments/dentistry' },
  { label: 'Multispecialty Clinic', href: '/treatments/multispecialty-clinic' },
  { label: 'Yoga & Wellness', href: '/treatments/yoga-wellness' },
  { label: 'Pain Management & Rejuvenation', href: '/treatments/pain-management-rejuvenation' },
  { label: 'Audiology', href: '/treatments/audiology' },
]

const NAV = [
  { id: 'home', label: 'Home', href: '/', current: true },
  { id: 'about', label: 'About us', href: '#' },
  { id: 'clinics', label: 'Clinics', href: '#', chevron: true },
  { id: 'treatments', label: 'Treatments', items: TREATMENTS },
  { id: 'diagnostics', label: 'Diagnostic Services', href: '#' },
  { id: 'patients', label: 'For Patients', href: '#', chevron: true },
  { id: 'bangladesh', label: 'Petals Clinic in Bangladesh', href: '#' },
]

const UTILITY = [
  { icon: 'phone', label: '9147405955', href: 'tel:9147405955' },
  { icon: 'calendar', label: 'Book an Appt', href: '#book' },
  { icon: 'findDoctor', label: 'Find a Doctor', href: '#find' },
  { icon: 'askDoctor', label: 'Ask a Doctor', href: '#ask' },
]

export default function Header() {
  const [openId, setOpenId] = useState(null)
  const tops = useRef({})   // id → top-level focusable (link or menu trigger)
  const close = useCallback(() => setOpenId(null), [])
  // CTA path: the nav is sticky; its orange "Book Appointment" appears once the hero has scrolled out of view
  const [showCta, setShowCta] = useState(false)
  useEffect(() => {
    const hero = document.querySelector('.hero'); if (!hero || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([e]) => setShowCta(!e.isIntersecting), { threshold: 0 })
    io.observe(hero); return () => io.disconnect()
  }, [])

  // ArrowLeft / ArrowRight between top-level items; carries an open menu across to the neighbour if it has one
  const onArrow = (fromId, dir, wasOpen) => {
    const i = NAV.findIndex((n) => n.id === fromId)
    const next = NAV[(i + dir + NAV.length) % NAV.length]
    tops.current[next.id]?.focus()
    setOpenId(wasOpen && next.items ? next.id : null)
  }
  const onTopKey = (id) => (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); onArrow(id, e.key === 'ArrowRight' ? 1 : -1, false) }
  }

  return (
    <header className="site-header">
      <div className="utility band"><div className="inner utility__inner">
        <a className="utility__logo" href="/" aria-label="Petals Health — Your Family Clinic">
          <img src="/assets/2_09c94b70.png" alt="" width="54" height="69" />
        </a>
        <div className="utility__links">
          {UTILITY.map((u, i) => [
            i > 0 && <span key={'sep' + i} className="utility__sep" aria-hidden="true" />,
            <a key={u.label} className="utility__item" href={u.href}>
              <Icon name={u.icon} className={`utility__icon utility__icon--${u.icon}`} />
              <span className="utility__text">{u.label}</span>
            </a>,
          ])}
        </div>
      </div></div>

      <nav className={'nav band' + (openId ? ' nav--menu-open' : '') + (showCta ? ' nav--cta' : '')} aria-label="Primary">
        <a className="nav__cta" href="#book" data-form="book-appointment" tabIndex={showCta ? 0 : -1} aria-hidden={!showCta}>Book Appointment</a>
        <div className="inner nav__inner">
        {NAV.map((n, i) => [
          i > 1 && <span key={'sep' + i} className="nav__sep" aria-hidden="true" />,
          n.items ? (
            <NavMenu
              key={n.id}
              id={n.id}
              label={n.label}
              items={n.items}
              open={openId === n.id}
              onOpen={setOpenId}
              onClose={close}
              onArrow={onArrow}
              triggerRef={(el) => { tops.current[n.id] = el }}
            />
          ) : (
            <a
              key={n.id}
              ref={(el) => { tops.current[n.id] = el }}
              className={'nav__item' + (n.current ? ' nav__item--active' : '')}
              href={n.href}
              aria-current={n.current ? 'page' : undefined}
              onKeyDown={onTopKey(n.id)}
            >
              {n.label}
              {n.chevron && <Icon name="chevron" className="nav__chevron" />}
            </a>
          ),
        ])}
      </div></nav>
    </header>
  )
}
