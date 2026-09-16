import Icon from './Icon.jsx'
import './FamilyCare.css'

// Home section 2 — "How we care for your family". Values: design/section2-values.md.
// Geometry is 1:1 page px; inner y = page y − 880. Card gaps, baselines and pill pitch are
// regularised (logged as deliberate deviations in the values table).
// The pill rows are written explicitly to preserve the mock's grouping regardless of font width.
// TODO(breakpoints): desktop only — no narrower frames exist in the design.

const CARDS = [
  {
    key: 'her-health',
    variant: 'orange',
    title: 'For Her Health',
    subtitle: 'From adolescence to motherhood and beyond',
    subtitleWidth: 360, // ESTIMATED: one line in the mock (ink 325); build text runs ~5% wider, 340 still broke
    rows: [
      ['Gynaecology', 'Pregnancy Care'],
      ['High-Risk Pregnancy', 'Fertility Treatment'],
      ['Cosmetic Gynaecology & Aesthetics'],
      ['Yoga & Wellness'],
    ],
  },
  {
    key: 'her-children',
    variant: 'blue',
    title: 'For Her Children',
    subtitle: 'Dedicated support for every growing smile and milestone.',
    subtitleWidth: 320, // ESTIMATED: reproduces the mock's break after "smile"
    rows: [['Paediatrics', 'Paediatric Dentistry'], ['Vaccinations']],
  },
  {
    key: 'whole-family',
    variant: 'blue',
    title: 'For Whole Family',
    subtitle: 'Keeping every generation healthier, together.',
    subtitleWidth: 340, // ESTIMATED: one line in the mock (ink 310)
    rows: [['Cardiology', 'Dentistry', 'Diagnostics'], ['Physiotherapy & Pain Management'], ['Audiology']],
  },
]

export default function FamilyCare() {
  return (
    <section className="care band" aria-labelledby="care-title">
      <div className="inner care__inner">
      <p className="care__eyebrow">How we care for your family</p>
      <h2 id="care-title" className="care__title">For her health, her children, her family</h2>
      <p className="care__subline">Every stage of life, under one roof</p>

      {/* petal outlines are NOT clipped by the cards in the design: each one runs across the gap into the
          next card (white at 19%, invisible on the white page). Page positions (352, 1062.8) and (793, 1062). */}
      <Icon name="petalOutline" className="care__petal care__petal--1" />
      <Icon name="petalOutline" className="care__petal care__petal--2" />
      <div className="care__cards">
        {CARDS.map((c) => (
          <article key={c.key} className={`care-card care-card--${c.variant}`}>
            <h3 className="care-card__title">{c.title}</h3>
            <p className="care-card__subtitle" style={{ width: c.subtitleWidth }}>{c.subtitle}</p>
            <div className="care-card__chips">
              {c.rows.map((row, i) => (
                <div key={i} className="care-card__row">
                  {row.map((label) => (
                    <span key={label} className="chip">{label}</span>
                  ))}
                </div>
              ))}
            </div>
            <a className="care-card__cta" href="#treatments">Explore Treatment</a>
          </article>
        ))}
      </div>
      </div>
    </section>
  )
}
