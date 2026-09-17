import DoctorCard from './DoctorCard.jsx'
import Carousel from './Carousel.jsx'
import { DOCTORS } from '../data/doctors.js'
import './Specialists.css'

// Home section 5 — "OUR SPECIALISTS / Meet your care team": the doctor carousel over data/doctors.js.

export function Arrow() {
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
        <Carousel className="specialists__carousel" label="Our doctors" items={DOCTORS} renderItem={(d) => <DoctorCard doctor={d} />} autoplayMs={5000} />
        <div className="specialists__foot">
          <a className="specialists__all btn-soft" href="#doctors">View all 50+ Doctor <Arrow /></a>
        </div>
      </div>
    </section>
  )
}
