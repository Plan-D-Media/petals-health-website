import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import NavMenu from './NavMenu.jsx'
import ActionRail from './ActionRail.jsx'
import SearchLauncher from './SearchLauncher.jsx'
import './Header.css'
import Img from './Img.jsx'
import { PENDING_TITLE } from './pending.js'
import { contactFor } from '../contact.js'

// Header, flow rewrite 2026-09-17.
//   ≥1024: the desktop bars (utility row + sticky nav row, flex on the content container; design/hero-values.md sizes ×1.2).
//   <1024: one sticky bar (logo, phone, menu) and a drawer holding the utility links and the nav; items with children
//          are accordions. <1024 adds a fixed bottom action bar (Call now / Book Appointment) once the hero has scrolled out
//          (<768 until 2026-09-23; tablets had neither it nor the rail). ≥1024 gets the floating action rail instead.
// `region` (contact.js): the Bangladesh page passes 'bangladesh' — its number everywhere, calls instead of the dialog.
// Dropdown data: Treatments only (design/svg/8.svg); other menus await the client's answer.

const TREATMENTS = [   // the mock's order (spellings corrected: Womans, Cosmetice, Welness, Rejuvination). Fertility Care removed
                       // 2026-09-22 (client): the route /treatments/fertility-care stays (an alias of Petals IVF), only the item goes.
  { label: "Women's Care", href: '/treatments/womens-care' },
  { label: 'Child Care', href: '/treatments/child-care' },
  { label: 'Aesthetics', href: '/treatments/aesthetics' },   // was Cosmetic Gynaecology & Aesthetics (renamed 2026-09-22, client)
  { label: 'Dentistry', href: '/treatments/dentistry' },
  { label: 'Multispecialty Clinic', href: '/treatments/multispecialty-clinic' },
  { label: 'Yoga & Wellness', href: '/treatments/yoga-wellness' },
  { label: 'Pain Management & Rejuvenation', href: '/treatments/pain-management-rejuvenation' },
  { label: 'Audiology', href: '/treatments/audiology' },
]

export const NAV = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About us', href: '/about' },
  { id: 'clinics', label: 'Clinics', href: '/clinics' },   // a plain link since 2026-09-22 (client): no dropdown behind it
  { id: 'treatments', label: 'Treatments', items: TREATMENTS },
  { id: 'diagnostics', label: 'Diagnostic Services', href: null },   // no page yet (design/no-mock-pages.md)
  { id: 'patients', label: 'For Patients', href: null, chevron: true },
  { id: 'bangladesh', label: 'Petals Clinic in Bangladesh', href: '/petals-clinic-in-bangladesh' },   // page since 2026-09-23
]

// Contact chrome follows the page's region (contact.js): the number, and whether Book / Ask open the dialog. Where the
// region has no form (Bangladesh), the dialog actions leave the utility row and the CTAs become calls.
const utilityFor = (c) => [
  { icon: 'phone', label: c.phone.label, href: c.phone.href },
  c.forms && { icon: 'calendar', label: 'Book an Appt', href: '#book', form: 'book-appointment' },
  { icon: 'findDoctor', label: 'Find a Doctor', href: '/find-a-doctor' },
  c.forms && { icon: 'askDoctor', label: 'Ask a Doctor', href: '#ask', form: 'ask-doctor' },
].filter(Boolean)
// the primary CTA (compact bar, sticky nav, action bar): the booking dialog, or a call where there is no form
const ctaFor = (c) => (c.forms
  ? { href: '#book', form: 'book-appointment', label: 'Book Appointment', short: 'Book an Appt' }   // short: the action bar below 375 px (the utility row's label)
  : { href: c.phone.href, label: c.call, aria: `${c.call}: ${c.name}, ${c.phone.label}` })

// the page's first section is its hero (2026-09-23: the old '.hero, .t-hero' list missed the .th heroes, so the
// action bar and nav CTA never appeared on Find a Doctor or any treatment page)
const findHero = () => document.querySelector('.hero, [data-hero]') || document.querySelector('main > section:first-child')

function useHeroScrolledOut() {
  const [out, setOut] = useState(false)
  useEffect(() => {
    const hero = findHero(); if (!hero || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([e]) => setOut(!e.isIntersecting), { threshold: 0 })
    io.observe(hero); return () => io.disconnect()
  }, [])
  return out
}

// The action rail's visibility (2026-09-24): on Home it waits until the hero has scrolled out above the viewport, then
// stays — latched, so scrolling back up never hides it again; on every other page it is there from the first paint.
// Observes the hero itself, so it holds at any viewport height. No IntersectionObserver or no hero: shown.
function useRailOn(delayed) {
  const [on, setOn] = useState(!delayed)
  useEffect(() => {
    if (!delayed) return undefined
    const hero = findHero(); if (!hero || !('IntersectionObserver' in window)) { setOn(true); return undefined }
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting && e.boundingClientRect.top < 0) { setOn(true); io.disconnect() } }, { threshold: 0 })
    io.observe(hero); return () => io.disconnect()
  }, [delayed])
  return on
}

function Drawer({ open, onClose, current, utility }) {
  const panel = useRef(null)
  const [expanded, setExpanded] = useState(null)
  useEffect(() => {
    if (!open) return undefined
    document.documentElement.dataset.drawer = 'open'
    const first = panel.current?.querySelector('a[href], button'); first?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab') return
      const f = [...panel.current.querySelectorAll('a[href], button')].filter((el) => el.offsetParent !== null)   // a[href]: placeholder links (no href) are not focusable
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
          {utility.map((u) => (
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
                <a href={n.href || undefined} className={n.href ? undefined : 'is-pending'} aria-disabled={n.href ? undefined : 'true'} title={n.href ? undefined : PENDING_TITLE} aria-current={n.id === current ? 'page' : undefined}>{n.label}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Header({ current = 'home', region } = {}) {
  const contact = contactFor(region)
  const utility = utilityFor(contact)
  const cta = ctaFor(contact)
  const [openId, setOpenId] = useState(null)
  const tops = useRef({})
  const close = useCallback(() => setOpenId(null), [])
  const showCta = useHeroScrolledOut()
  const railOn = useRailOn(current === 'home')
  const [drawer, setDrawer] = useState(false)
  const menuBtn = useRef(null)
  const closeDrawer = useCallback(() => { setDrawer(false); requestAnimationFrame(() => menuBtn.current?.focus()) }, [])   // focus returns to the button that opened it

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
      <a className="skip-link" href="#main">Skip to content</a>
      {/* ---- compact bar (<1024) ---- */}
      <div className="mbar band">
        <a className="mbar__logo" href="/" aria-label="Petals Health — Your Family Clinic"><Img src="/assets/2_09c94b70.png" alt="" width="46" height="59" priority /></a>
        <div className="mbar__util">
          <a href="/find-a-doctor">Find a Doctor</a>{contact.forms && <a href="#ask" data-form="ask-doctor">Ask a Doctor</a>}
          <a className="mbar__cta" href={cta.href} data-form={cta.form} aria-label={cta.aria}>{cta.label}</a>
        </div>
        <div className="mbar__actions">
          <button type="button" className="mbar__btn" data-search="header" aria-label="Search doctors, treatments and clinics"><Icon name="search" /></button>
          <a className="mbar__btn" href={contact.phone.href} aria-label={`Call ${contact.phone.label}`}><Icon name="phone" /></a>
          <button ref={menuBtn} type="button" className="mbar__btn mbar__btn--menu" aria-label="Open menu" aria-expanded={drawer} onClick={() => setDrawer(true)}><span /><span /><span /></button>
        </div>
      </div>
      <Drawer open={drawer} onClose={closeDrawer} current={current} utility={utility} />

      {/* ---- desktop bars (≥1024) ---- */}
      <div className="utility band"><div className="inner utility__inner">
        <a className="utility__logo" href="/" aria-label="Petals Health — Your Family Clinic">
          <Img src="/assets/2_09c94b70.png" alt="" width="65" height="83" priority />
        </a>
        <div className="utility__links">
          {utility.map((u, i) => [
            i > 0 && <span key={'sep' + i} className="utility__sep" aria-hidden="true" />,
            <a key={u.label} className="utility__item" href={u.href} data-form={u.form}>
              <Icon name={u.icon} className={`utility__icon utility__icon--${u.icon}`} />
              <span className="utility__text">{u.label}</span>
            </a>,
          ])}
        </div>
      </div></div>

      <nav className={'nav band' + (openId ? ' nav--menu-open' : '') + (showCta ? ' nav--cta' : '')} aria-label="Primary">
        <a className="nav__cta" href={cta.href} data-form={cta.form} aria-label={cta.aria} tabIndex={showCta ? 0 : -1} aria-hidden={!showCta}>{cta.label}</a>
        <div className="inner nav__inner">
          {NAV.map((n, i) => [
            i > 1 && <span key={'sep' + i} className="nav__sep" aria-hidden="true" />,
            n.items ? (
              <NavMenu key={n.id} id={n.id} label={n.label} items={n.items} open={openId === n.id} activeHref={`/treatments/${current}`} onOpen={setOpenId} onClose={close} onArrow={onArrow} triggerRef={(el) => { tops.current[n.id] = el }} />
            ) : (
              <a key={n.id} ref={(el) => { tops.current[n.id] = el }} className={'nav__item' + (n.id === current ? ' nav__item--active' : '') + (n.href ? '' : ' is-pending')} href={n.href || undefined} aria-disabled={n.href ? undefined : 'true'} title={n.href ? undefined : PENDING_TITLE} tabIndex={n.href ? undefined : -1} aria-current={n.id === current ? 'page' : undefined} onKeyDown={onTopKey(n.id)}>
                {n.label}
                {n.chevron && <Icon name="chevron" className="nav__chevron" />}
              </a>
            ),
          ])}
        </div>
      </nav>

      {/* ---- bottom action bar (<1024): thumb-zone CTA path, after the hero, hidden while a dialog/drawer is open ---- */}
      <div className={'actionbar' + (showCta ? ' actionbar--on' : '')} aria-hidden={!showCta}>
        {contact.forms
          ? <>
              <a className="actionbar__call" href={contact.phone.href} tabIndex={showCta ? 0 : -1}><Icon name="phone" />Call now</a>
              <a className="actionbar__book" href={cta.href} data-form={cta.form} tabIndex={showCta ? 0 : -1}><span className="actionbar__long">{cta.label}</span><span className="actionbar__short">{cta.short}</span></a>
            </>
          : <a className="actionbar__book" href={cta.href} aria-label={cta.aria} tabIndex={showCta ? 0 : -1}><Icon name="phone" /><span>{cta.label}</span></a>}   {/* one action: the call, as the primary button */}
      </div>
      <ActionRail on={railOn} contact={contact} />
      <SearchLauncher />
    </header>
  )
}
