import Icon from './Icon.jsx'
import './Header.css'

// Geometry: design/hero-values.md ("Bars") for sizes; layout re-cut 2026-09-16 (design/polish-proposals.md §5):
// both bars are flex rows aligned to the 1366 content container (95 px margins), with a regular rhythm instead of the
// mock's hand-placed lefts. Nav dropdowns are out of scope here: every item is a static link.
// TODO(breakpoints): desktop only; no narrower frames exist in the design.

const NAV = [
  { label: 'About us' },
  { label: 'Clinics', chevron: true },
  { label: 'Treatments', chevron: true },
  { label: 'Diagnostic Services' },
  { label: 'For Patients', chevron: true },
  { label: 'Petals Clinic in Bangladesh' },
]

const UTILITY = [
  { icon: 'phone', label: '9147405955', href: 'tel:9147405955' },
  { icon: 'calendar', label: 'Book an Appt', href: '#book' },
  { icon: 'findDoctor', label: 'Find a Doctor', href: '#find' },
  { icon: 'askDoctor', label: 'Ask a Doctor', href: '#ask' },
]

export default function Header() {
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

      <nav className="nav band" aria-label="Primary"><div className="inner nav__inner">
        <a className="nav__item nav__item--active" href="/" aria-current="page">Home</a>
        {NAV.map((n, i) => [
          i > 0 && <span key={'sep' + i} className="nav__sep" aria-hidden="true" />,
          <a key={n.label} className="nav__item" href="#">
            {n.label}
            {n.chevron && <Icon name="chevron" className="nav__chevron" />}
          </a>,
        ])}
      </div></nav>
    </header>
  )
}
