import Icon from './Icon.jsx'
import './Header.css'

// Geometry: design/hero-values.md ("Bars"). Positions are absolute px at the 1366 canvas.
// Nav dropdowns are out of scope: every item is a static link.
// TODO(breakpoints): desktop only; no narrower frames exist in the design.

const NAV = [
  { label: 'About us', left: 337 },
  { label: 'Clinics', left: 420, chevron: 466.8 },
  { label: 'Treatments', left: 511, chevron: 586.5 },
  { label: 'Diagnostic Services', left: 633 },
  { label: 'For Patients', left: 775, chevron: 849.7 },
  { label: 'Petals Clinic in Bangladesh', left: 892 },
]
const NAV_SEPARATORS = [405.9, 496.3, 618.7, 761.2, 878.8]

export default function Header() {
  return (
    <header className="site-header">
      <div className="utility band"><div className="inner utility__inner">
        <a className="utility__logo" href="/" aria-label="Petals Health — Your Family Clinic">
          <img src="/assets/2_09c94b70.png" alt="" />
        </a>

        <a className="utility__item utility__item--phone" href="tel:9147405955">
          <Icon name="phone" className="utility__icon utility__icon--phone" />
          <span className="utility__text">9147405955</span>
        </a>
        <span className="utility__sep utility__sep--1" />
        <a className="utility__item" href="#book">
          <Icon name="calendar" className="utility__icon utility__icon--calendar" />
          <span className="utility__text utility__text--book">Book an Appt</span>
        </a>
        <span className="utility__sep utility__sep--2" />
        <a className="utility__item" href="#find">
          <Icon name="findDoctor" className="utility__icon utility__icon--find" />
          <span className="utility__text utility__text--find">Find a Doctor</span>
        </a>
        <span className="utility__sep utility__sep--3" />
        <a className="utility__item" href="#ask">
          <Icon name="askDoctor" className="utility__icon utility__icon--ask" />
          <span className="utility__text utility__text--ask">Ask a Doctor</span>
        </a>
      </div></div>

      <nav className="nav band" aria-label="Primary"><div className="inner nav__inner">
        <a className="nav__item nav__item--active" href="/" aria-current="page">Home</a>
        {/* flow order (item, chevron, separator) so the polish proposal can lay the row out with flex;
            the baseline keeps the mock's absolute lefts via inline styles */}
        {NAV.map((n, i) => [
          i > 0 && <span key={'sep' + i} className="nav__sep" style={{ left: NAV_SEPARATORS[i - 1] }} />,
          <a key={n.label} className="nav__item" href="#" style={{ left: n.left }}>{n.label}</a>,
          n.chevron && <Icon key={n.label + '-chevron'} name="chevron" className="nav__chevron" style={{ left: n.chevron }} />,
        ])}
      </div></nav>
    </header>
  )
}
