import Icon from './Icon.jsx'
import './Specialists.css'

// Home section 5 — "OUR SPECIALISTS / Meet your care team". Values: design/sections5-8-values.md §5.
// Inner y = page y − 2499.9. TODO(breakpoints): desktop only.

const DOCTORS = [
  { initials: 'SG', name: 'Dr. Smita Gutgutia', role: ['Gynaecologist & Obstetrician'], badge: 'Gynaecology', where: ['Lawdon street', 'Kankurgachi'] },
  { initials: 'KS', name: 'Dr. K N Siddiqui', role: ['Consultant, Cardio-Metabolic disorders', '(Special interest in preventive cardiology)'], badge: 'Cardiology', where: ['Lawdon street'] },
  { initials: 'SM', name: 'Dr. Souvik Kr. Mondal', role: ['Cosmetic Gynaecologist | Aesthetician |', 'Endoscopic Surgeon.'], badge: 'Cosmetic Gynaecology', where: ['Tollygunge', 'Kankurgachi'] },
  { initials: 'AM', name: 'Dr. Anirudda Mondal', role: ['Cosmetic Gynaecologist | Aesthetician |', 'Endoscopic Surgeon.'], badge: 'Cosmetic Gynaecology', where: ['Tollygunge', 'Kankurgachi', 'Lawdon street'] },
]

export function Arrow() {
  // 15 px arrow: 2 pt line + head, as drawn in the design (stroke path + small filled head)
  return (
    <svg className="arrow" width="15" height="8" viewBox="0 0 15 8" aria-hidden="true">
      <path d="M0 4 H13" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M10 0.5 L14.2 4 L10 7.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Specialists() {
  return (
    <section className="specialists band" aria-labelledby="specialists-title">
      <div className="inner specialists__inner">
        <p className="specialists__eyebrow">Our specialists</p>
        <h2 id="specialists-title" className="specialists__title">Meet your care team</h2>
        <p className="specialists__subline">Experienced, empathetic doctors who take time to truly understand your health.</p>

        <div className="specialists__cards">
          {DOCTORS.map((d, i) => (
            <article key={d.initials} className="doc" style={{ left: i * 286.3 }}>
              <div className="doc__body" />
              <div className="doc__avatar"><span>{d.initials}</span></div>
              <span className="doc__badge">{d.badge}</span>
              <h3 className="doc__name">{d.name}</h3>
              <p className="doc__role">{d.role.map((l, k) => <span key={k}>{l}{k < d.role.length - 1 && <br />}</span>)}</p>
              <div className="doc__stars" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" className="doc__star" />)}</div>
              <p className="doc__where">{d.where.map((l, k) => <span key={k}>{l}{k < d.where.length - 1 && <br />}</span>)}</p>
              <a className="doc__cta btn-soft" href="#book">Book Consultation <Arrow /></a>
            </article>
          ))}
        </div>

        <a className="specialists__all btn-soft" href="#doctors">View all 50+ Doctor <Arrow /></a>
      </div>
    </section>
  )
}
