import './HealthCard.css'

// Home section 6 — FAMILY HEALTH CARD. Flow rewrite 2026-09-17.
//   <768: a rounded panel — rectangular photo crop on top, navy copy below, full-width button.
//   768–1023: photo | copy inside one panel.
//   ≥1024: the design pass composition — navy panel with the masked cut-out photo breaking the panel's top edge.
// Content: design/sections5-8-values.md §6.

const BENEFITS = [
  '20% discount on Diagnostic Tests',
  'Complimentary ECG (Twice in a year)',
  'Free OPD registration',
  'Free Home Blood Collection (single visit, net bill value ₹2000/-)',
]

export default function HealthCard() {
  return (
    <section className="hcard band" aria-labelledby="hcard-title">
      <div className="inner hcard__inner">
        <div className="hcard__panel" data-reveal>
          <span className="hcard__blob hcard__blob--top" aria-hidden="true" />
          <span className="hcard__blob hcard__blob--bottom" aria-hidden="true" />
          <div className="hcard__photo"><img src="/assets/2_d818a07d.png" alt="A doctor holding up the Petals Family Health Card" decoding="async" /></div>
          <div className="hcard__copy">
            <p className="hcard__eyebrow">Family health card</p>
            <h2 id="hcard-title" className="hcard__title">Your family&apos;s health,<br />in your pocket</h2>
            <p className="hcard__lead">Get Your Card To Avail Discounts &amp; Other Benefits</p>
            <ul className="hcard__list">
              {BENEFITS.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <a className="hcard__cta" href="#callback" data-form="request-callback" data-section="health-card">Click here we will call back</a>
          </div>
        </div>
      </div>
    </section>
  )
}
