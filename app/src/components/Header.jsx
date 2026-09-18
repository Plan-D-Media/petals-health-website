import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import NavMenu from './NavMenu.jsx'
import './Header.css'

// Header, flow rewrite 2026-09-17.
//   ≥1024: the desktop bars (utility row + sticky nav row, flex on the content container; design/hero-values.md sizes ×1.2).
//   <1024: one sticky bar (logo, phone, menu) and a drawer holding the utility links and the nav; items with children
//          are accordions. <768 adds a fixed bottom action bar (Call now / Book Appointment) once the hero has scrolled out.
// Dropdown data: Treatments only (design/svg/8.svg); other menus await the client's answer.

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

export const NAV = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About us', href: '/about' },
  { id: 'clinics', label: 'Clinics', href: '/clinics', chevron: true },
  { id: 'treatments', label: 'Treatments', items: TREATMENTS },
  { id: 'diagnostics', label: 'Diagnostic Services', href: '#' },
  { id: 'patients', label: 'For Patients', href: '#', chevron: true },
  { id: 'bangladesh', label: 'Petals Clinic in Bangladesh', href: '#' },
]

const UTILITY = [
  { icon: 'phone', label: '9147405955', href: 'tel:9147405955' },
  { icon: 'calendar', label: 'Book an Appt', href: '#book', form: 'book-appointment' },
  { icon: 'findDoctor', label: 'Find a Doctor', href: '/find-a-doctor' },
  { icon: 'askDoctor', label: 'Ask a Doctor', href: '#ask', form: 'ask-doctor' },
]

function useHeroScrolledOut() {
  const [out, setOut] = useState(false)
  useEffect(() => {
    const hero = document.querySelector('.hero, .t-hero, [data-hero]'); if (!hero || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([e]) => setOut(!e.isIntersecting), { threshold: 0 })
    io.observe(hero); return () => io.disconnect()
  }, [])
  return out
}

function Drawer({ open, onClose, current }) {
  const panel = useRef(null)
  const [expanded, setExpanded] = useState(null)
  useEffect(() => {
    if (!open) return undefined
    document.documentElement.dataset.drawer = 'open'
    const first = panel.current?.querySelector('a, button'); first?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab') return
      const f = [...panel.current.querySelectorAll('a, button')].filter((el) => el.offsetParent !== null)
      if (!f.length) return
      const i = f.indexOf(document.activeElement)
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus() }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); delete document.documentElement.dataset.drawer }
  }, [open, onClose])
  return (
    <div className={'drawer' + (open ? ' drawer--open' : '')} aria-hidden={!open}>
      <div className="drawer__scrim" onClick={onClose} />
      <div className="drawer__panel" ref={panel} role="dialog" aria-modal="true" aria-label="Menu">
        <button type="button" className="drawer__close" onClick={onClose} aria-label="Close menu">×</button>
        <ul className="drawer__utility">
          {UTILITY.map((u) => (
            <li key={u.label}><a href={u.href} data-form={u.form} onClick={u.form ? onClose : undefined}><Icon name={u.icon} className="drawer__icon" />{u.label}</a></li>
          ))}
        </ul>
        <ul className="drawer__nav">
          {NAV.map((n) => (
            <li key={n.id} className={n.id === current ? 'drawer__item--current' : ''}>
              {n.items ? (
                <>
                  <button type="button" className="drawer__acc" aria-expanded={expanded === n.id} aria-controls={`drawer-${n.id}`} onClick={() => setExpanded(expanded === n.id ? null : n.id)}>
                    {n.label}<Icon name="chevron" className="drawer__chev" />
                  </button>
                  <ul id={`drawer-${n.id}`} className="drawer__sub" hidden={expanded !== n.id}>
                    {n.items.map((it) => <li key={it.label}><a href={it.href}>{it.label}</a></li>)}
                  </ul>
                </>
              ) : (
                <a href={n.href} aria-current={n.id === current ? 'page' : undefined}>{n.label}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Header({ current = 'home' } = {}) {
  const [openId, setOpenId] = useState(null)
  const tops = useRef({})
  const close = useCallback(() => setOpenId(null), [])
  const showCta = useHeroScrolledOut()
  const [drawer, setDrawer] = useState(false)
  const closeDrawer = useCallback(() => setDrawer(false), [])

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
      {/* ---- compact bar (<1024) ---- */}
      <div className="mbar band">
        <a className="mbar__logo" href="/" aria-label="Petals Health — Your Family Clinic"><img src="/assets/2_09c94b70.png" alt="" width="46" height="59" /></a>
        <div className="mbar__util">
          <a href="/find-a-doctor">Find a Doctor</a><a href="#ask" data-form="ask-doctor">Ask a Doctor</a>
          <a className="mbar__cta" href="#book" data-form="book-appointment">Book Appointment</a>
        </div>
        <div className="mbar__actions">
          <a className="mbar__btn" href="tel:9147405955" aria-label="Call 9147405955"><Icon name="phone" /></a>
          <button type="button" className="mbar__btn mbar__btn--menu" aria-label="Open menu" aria-expanded={drawer} onClick={() => setDrawer(true)}><span /><span /><span /></button>
        </div>
      </div>
      <Drawer open={drawer} onClose={closeDrawer} current={current} />

      {/* ---- desktop bars (≥1024) ---- */}
      <div className="utility band"><div className="inner utility__inner">
        <a className="utility__logo" href="/" aria-label="Petals Health — Your Family Clinic">
          <img src="/assets/2_09c94b70.png" alt="" width="65" height="83" />
        </a>
        <div className="utility__links">
          {UTILITY.map((u, i) => [
            i > 0 && <span key={'sep' + i} className="utility__sep" aria-hidden="true" />,
            <a key={u.label} className="utility__item" href={u.href} data-form={u.form}>
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
              <NavMenu key={n.id} id={n.id} label={n.label} items={n.items} open={openId === n.id} activeHref={`/treatments/${current}`} onOpen={setOpenId} onClose={close} onArrow={onArrow} triggerRef={(el) => { tops.current[n.id] = el }} />
            ) : (
              <a key={n.id} ref={(el) => { tops.current[n.id] = el }} className={'nav__item' + (n.id === current ? ' nav__item--active' : '')} href={n.href} aria-current={n.id === current ? 'page' : undefined} onKeyDown={onTopKey(n.id)}>
                {n.label}
                {n.chevron && <Icon name="chevron" className="nav__chevron" />}
              </a>
            ),
          ])}
        </div>
      </nav>

      {/* ---- bottom action bar (<768): thumb-zone CTA path, after the hero, hidden while a dialog/drawer is open ---- */}
      <div className={'actionbar' + (showCta ? ' actionbar--on' : '')} aria-hidden={!showCta}>
        <a className="actionbar__call" href="tel:9147405955" tabIndex={showCta ? 0 : -1}><Icon name="phone" />Call now</a>
        <a className="actionbar__book" href="#book" data-form="book-appointment" tabIndex={showCta ? 0 : -1}>Book Appointment</a>
      </div>
    </header>
  )
}
