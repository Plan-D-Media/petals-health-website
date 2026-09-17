import DoctorCard from './DoctorCard.jsx'
import Carousel from './Carousel.jsx'
import { DOCTORS } from '../data/doctors.js'
import './Specialists.css'

// Home section 5 — "OUR SPECIALISTS / Meet your care team". Rebuilt 2026-09-17 (design pass, round2-report §4):
// a 740 px soft tint band with the new 300 × 410 doctor cards from the data file, in the shared Carousel.

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
      </div>
      <Carousel
        className="specialists__carousel"
        label="Our doctors"
        items={DOCTORS}
        renderItem={(d) => <DoctorCard doctor={d} />}
        slideWidth={300}
        gap={24}
        autoplayMs={5000}
        edgeArrows
      />
      <div className="inner specialists__foot">
        <a className="specialists__all btn-soft" href="#doctors">View all 50+ Doctor <Arrow /></a>
      </div>
    </section>
  )
}
