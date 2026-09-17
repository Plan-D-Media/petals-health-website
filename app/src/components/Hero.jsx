import Icon from './Icon.jsx'
import Watermark from './Watermark.jsx'
import VideoSlot from './VideoSlot.jsx'
import { HERO_VIDEO_SRC, HERO_POSTER, HERO_VIDEO_STYLE } from '../config.js'
import './Hero.css'   /* after VideoSlot.css so .hero__photo's absolute box wins */

// Geometry and provenance: design/hero-values.md ("Hero band").
// TODO(breakpoints): desktop only — no narrower frames exist in the design.
// The petal watermark spans this band and the next section; see Watermark.jsx for why it is
// rendered in two clipped parts. Inside the hero it sits above the gradient, below content.
// Layout: the band spans the viewport and carries the gradient; .hero__inner is the 1366 content box.

// mock-up switch: ?videoStyle=card|flush and ?video=<url> override config (design/video-options.md)
const qs = () => new URLSearchParams(window.location.search)
const videoStyle = () => qs().get('videoStyle') || HERO_VIDEO_STYLE
const videoSrc = () => qs().get('video') || HERO_VIDEO_SRC

export default function Hero() {
  return (
    <section className="hero band" aria-labelledby="hero-title">
      <Watermark part="hero" offsetTop={142} />
      <div className="inner hero__inner">
      {/* photo travels with the 1366 content box (the design's clip starts 120.5 px in; there is no bleed) */}
      <VideoSlot className="hero__photo" poster={HERO_POSTER} posterAlt="A mother holding her smiling baby" src={videoSrc()} label="hero video" variant={videoStyle()} />

      <h1 id="hero-title" className="hero__title">
        <span className="hero__title-line hero__title-line--primary">Caring for All,</span>
        <span className="hero__title-line hero__title-line--accent">You Care About</span>
      </h1>

      <p className="hero__body">
        From fertility and pregnancy to paediatric care, diagnostics and specialist services for
        the whole family, everything you need is available under one trusted roof.
      </p>

      <a className="hero__cta" href="#book">Book your appoinment</a>

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
          <div className="stat__value">
            4.8<Icon name="star" className="stat__star" />
          </div>
          <div className="stat__label">Google<br />Rating</div>
        </div>
      </div>
      </div>
    </section>
  )
}
