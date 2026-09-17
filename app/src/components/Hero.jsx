import Watermark from './Watermark.jsx'
import VideoSlot from './VideoSlot.jsx'
import Proof from './Proof.jsx'
import { HERO_VIDEO_SRC, HERO_POSTER, HERO_VIDEO_STYLE } from '../config.js'
import { HEADER_HEIGHT } from '../layout.js'
import './Hero.css'   /* after VideoSlot.css so .hero__film's box wins */

// Hero concept B (design/round2-report.md §2), flow rewrite 2026-09-17.
//   ≥1024: text column on the container's left; the 16:9 film card is absolutely placed from the column's right edge to
//          the viewport edge (a deliberate bleed); the proof strip overlaps the card's bottom-left corner.
//   <1024: paragraph, buttons (row on tablet, stacked on mobile), film card full width, proof row.
// The headline went with the client's brief; a visually hidden h1 keeps the page's document outline and SEO title.

const qs = () => new URLSearchParams(window.location.search)
const videoStyle = () => qs().get('videoStyle') || HERO_VIDEO_STYLE
const videoSrc = () => qs().get('video') || HERO_VIDEO_SRC

export default function Hero() {
  return (
    <section className="hero band" aria-label="Petals Health">
      <h1 className="sr-only">Petals Health — your family clinic in Kolkata</h1>
      <Watermark part="hero" offsetTop={HEADER_HEIGHT} />
      <div className="inner hero__inner">
        <div className="hero__copy">
          <p className="hero__body">
            From fertility and pregnancy to paediatric care, diagnostics and specialist services for
            the whole family, everything you need is available under one trusted roof.
          </p>
          <div className="hero__actions">
            <a className="hero__cta" href="#book" data-form="book-appointment">Book Appointment</a>
            <a className="hero__cta hero__cta--secondary" href="#callback" data-form="request-callback">Request a Call Back</a>
          </div>
        </div>
        <VideoSlot className="hero__film" poster={HERO_POSTER} posterAlt="A parent holding a baby at a Petals clinic" src={videoSrc()} label="hero video" variant={videoStyle()} />
        <Proof className="hero__proof" />
      </div>
    </section>
  )
}
