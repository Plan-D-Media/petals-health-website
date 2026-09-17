import Icon from './Icon.jsx'
import './FamilyCare.css'

// Home section 2 — "How we care for your family". Flow rewrite 2026-09-17: three cards on a grid (3 / orange + 2 / 1),
// chips as one wrapping list (the mock's row grouping was hand placement), the button anchored at the card's foot.
// Content: design/section2-values.md.

const CARDS = [
  { key: 'her-health', variant: 'orange', title: 'For Her Health', subtitle: 'From adolescence to motherhood and beyond',
    chips: ['Gynaecology', 'Pregnancy Care', 'High-Risk Pregnancy', 'Fertility Treatment', 'Cosmetic Gynaecology & Aesthetics', 'Yoga & Wellness'] },
  { key: 'her-children', variant: 'blue', title: 'For Her Children', subtitle: 'Dedicated support for every growing smile and milestone.',
    chips: ['Paediatrics', 'Paediatric Dentistry', 'Vaccinations'] },
  { key: 'whole-family', variant: 'blue', title: 'For Whole Family', subtitle: 'Keeping every generation healthier, together.',
    chips: ['Cardiology', 'Dentistry', 'Diagnostics', 'Physiotherapy & Pain Management', 'Audiology'] },
]

export default function FamilyCare() {
  return (
    <section className="care band" aria-labelledby="care-title">
      <div className="inner care__inner">
        <div className="sec-head">
          <p className="care__eyebrow">How we care for your family</p>
          <h2 id="care-title" className="care__title">For her health, her children, her family</h2>
          <p className="care__subline">Every stage of life, under one roof</p>
        </div>
        <div className="care__cards">
          {CARDS.map((c, i) => (
            <article key={c.key} className={`care-card care-card--${c.variant}`} data-reveal data-reveal-order={i}>
              {c.variant === 'orange' && <Icon name="petalOutline" className="care__petal" />}
              <h3 className="care-card__title">{c.title}</h3>
              <p className="care-card__subtitle">{c.subtitle}</p>
              <ul className="care-card__chips">
                {c.chips.map((label) => <li key={label} className="chip">{label}</li>)}
              </ul>
              <a className="care-card__cta" href="#treatments">Explore Treatment</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
