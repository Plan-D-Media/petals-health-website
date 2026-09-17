import Icon from './Icon.jsx'
import Watermark from './Watermark.jsx'
import VideoSlot from './VideoSlot.jsx'
import { HERO_VIDEO_SRC, HERO_POSTER, HERO_VIDEO_STYLE } from '../config.js'
import { HEADER_HEIGHT } from '../layout.js'
import './Hero.css'   /* after VideoSlot.css so .hero__film's box wins */

// Hero concept B (design/round2-report.md §2, approved 2026-09-17): no headline; the paragraph carries the message;
// a 16:9 film card starts at the text column's right and bleeds to the viewport edge; two equal buttons; the proof
// strip (location pill + stats) overlaps the card's bottom-left corner. Values: design/hero-values.md ("Hero band")
// for the atoms that survive (band gradient, button size, pill, stat tiles, watermark).
// The design's portrait photo and its mask stay in /assets, unused.

// mock-up switch: ?videoStyle=film|card|flush and ?video=<url> override config
const qs = () => new URLSearchParams(window.location.search)
const videoStyle = () => qs().get('videoStyle') || HERO_VIDEO_STYLE
const videoSrc = () => qs().get('video') || HERO_VIDEO_SRC

export default function Hero() {
  return (
    <section className="hero band" aria-label="Petals Health">
      <Watermark part="hero" offsetTop={HEADER_HEIGHT} />

      {/* film card: left edge at inner x 646, right edge = viewport edge */}
      <VideoSlot className="hero__film" poster={HERO_POSTER} posterAlt="A parent holding a baby at a Petals clinic" src={videoSrc()} label="hero video" variant={videoStyle()} />

      {/* proof strip on the card's bottom-left corner */}
      <div className="hero__proof">
        <div className="hero__pill">
          <Icon name="pin" className="hero__pill-icon" />
          <span className="hero__pill-text">3 Clinics in Kolkata</span>
        </div>
        <div className="hero__stats">
          <div className="stat stat--doctors">
            <div className="stat__value">100+</div>
            <div className="stat__label">Specialist<br />Doctor</div>
          </div>
          <div className="stat stat--rating">
            <div className="stat__value">4.8<Icon name="star" className="stat__star" /></div>
            <div className="stat__label">Google<br />Rating</div>
          </div>
        </div>
      </div>

      <div className="inner hero__inner">
        <div className="hero__copy">
          <p className="hero__body">
            From fertility and pregnancy to paediatric care, diagnostics and specialist services for
            the whole family, everything you need is available under one trusted roof.
          </p>
          <div className="hero__actions">
            <a className="hero__cta btn-primary" href="#book" data-form="book-appointment">Book Appointment</a>
            <a className="hero__cta hero__cta--secondary btn-secondary" href="#callback" data-form="request-callback">Request a Call Back</a>
          </div>
        </div>
      </div>
    </section>
  )
}
