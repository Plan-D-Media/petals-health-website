import Icon from './Icon.jsx'
import Marquee from './Marquee.jsx'
import { TESTIMONIALS } from '../data/testimonials.js'
import './Testimonials.css'

// Home section 4 — "PATIENT STORIES". Carousel over data/testimonials.js (PLACEHOLDER content, tagged on each card).
// Round 3: a continuous right-to-left marquee (Marquee.jsx) — pause on hover/focus, manual scroll mode for keyboard and
// reduced motion; every card reachable.

export function Story({ s }) {
  return (
    <article className="story" data-reveal>
      {s.placeholder && <span className="story__placeholder" title="Dummy testimonial until real patient stories are supplied">Placeholder</span>}
      <div className="story__stars" aria-label={`${s.rating} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" className={`story__star${k < s.rating ? '' : ' story__star--off'}`} />)}
      </div>
      <Icon name="quoteMark" className="story__mark" />
      <p className="story__quote">{s.quote}</p>
      <div className="story__who">
        <div className="story__avatar" aria-hidden="true">{s.initials}</div>
        <div>
          <div className="story__name">{s.name}</div>
          <div className="story__role">{s.role}</div>
        </div>
      </div>
    </article>
  )
}

export default function Testimonials() {
  return (
    <section className="stories band" aria-labelledby="stories-title">
      <div className="inner stories__inner">
        <p className="stories__eyebrow">Patient stories</p>
        <h2 id="stories-title" className="stories__title">Trusted by thousands of Kolkata families</h2>
      </div>
      <Marquee className="stories__marquee" label="Patient stories" items={TESTIMONIALS} renderItem={(s) => <Story s={s} />} direction="left" speed={40} />
      <div className="inner">
      </div>
    </section>
  )
}
