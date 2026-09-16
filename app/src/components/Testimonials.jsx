import Icon from './Icon.jsx'
import './Testimonials.css'

// Home section 4 — "PATIENT STORIES / Trusted by thousands of Kolkata families".
// Values: design/section4-values.md. Inner y = page y − 2040. Cards regularised to one width
// and one top (deviation logged). Quote upright (no italic face exists), monograms Playfair 400 / 24,
// stars vector in orange-500. TODO(breakpoints): desktop only.

const STORIES = [
  { initials: 'IA', name: 'Isha Agarwal', role: 'Pregnancy Care · Kankurgachi',
    quote: 'My entire pregnancy was a smooth ride with the team here. The doctors made me feel very comfortable every single visit.' },
  { initials: 'HA', name: 'Harshita Nahata', role: 'Antenatal Care · Kankurgachi',
    quote: 'The clinic has sonography, tests, and everything under one roof. Dr. Smita is very patient and reassuring — wonderful for expecting mothers.' },
  { initials: 'SM', name: 'Sushmita Mitra', role: 'Medical Care · CMC',
    quote: 'The clinic is very well organised, clean and efficient. The staff is courteous, knowledgeable and helpful. Highly recommend.' },
]

export default function Testimonials() {
  return (
    <section className="stories band" aria-labelledby="stories-title">
      <div className="inner stories__inner">
      <p className="stories__eyebrow">Patient stories</p>
      <h2 id="stories-title" className="stories__title">
        Trusted by thousands<br />of Kolkata families
      </h2>

      <div className="stories__cards">
        {STORIES.map((s, i) => (
          <article key={s.initials} className="story" style={{ left: i * 396.25 }}>
            <div className="story__stars" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" className="story__star" />)}
            </div>
            <Icon name="quoteMark" className="story__mark" />
            <p className="story__quote">{s.quote}</p>
            <div className="story__avatar" aria-hidden="true">{s.initials}</div>
            <div className="story__name">{s.name}</div>
            <div className="story__role">{s.role}</div>
          </article>
        ))}
      </div>
      </div>
    </section>
  )
}
