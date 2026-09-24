import VideoSlot from './VideoSlot.jsx'
import Proof from './Proof.jsx'
import { HERO_VIDEO_SRC, HERO_VIDEO_SRC_MOBILE, HERO_POSTER, HERO_VIDEO_STYLE } from '../config.js'
import './Hero.css'   /* after VideoSlot.css */

// Hero, round 3 (design/round3-report.md §4, approved): full-width video; on tablet and desktop a white "shelf" card
// overlaps the video's bottom edge carrying the h1, the paragraph and the proof strip, with the two buttons centred
// beneath; on mobile the same parts stack under the video.
// COPY PENDING: the visible h1 "Petals Health — Your Family Clinic in Kolkata" is assembled from the logo's tagline and
// the location pill; it is with the client for approval (design/round3-report.md §2).

const qs = () => new URLSearchParams(window.location.search)
const videoStyle = () => qs().get('videoStyle') || HERO_VIDEO_STYLE
const videoSrc = () => qs().get('video') || HERO_VIDEO_SRC

export default function Hero() {
  return (
    <section className="hero band" aria-labelledby="hero-title">
      <VideoSlot className="hero__film" poster={HERO_POSTER} posterAlt="A parent holding a baby at a Petals clinic" src={videoSrc()} srcMobile={qs().get('video') ? null : HERO_VIDEO_SRC_MOBILE} label="hero video" variant={videoStyle()} />
      <div className="inner hero__inner">
        <div className="hero__shelf" data-overlap-ok>
          <div className="hero__copy">
            <h1 id="hero-title" className="hero__title">
              Petals Health <span className="hero__title-dash" aria-hidden="true">—</span> Your Family Clinic in Kolkata
              <span className="pending" title="Wording with the client for approval">Copy pending</span>
            </h1>
            <p className="hero__body">
              From fertility and pregnancy to paediatric care, diagnostics and specialist services for
              the whole family, everything you need is available under one trusted roof.
            </p>
          </div>
          <Proof card={false} className="hero__proof" />
        </div>
        <div className="hero__actions">
          <a className="hero__cta" href="#book" data-form="book-appointment">Book Appointment</a>
          <a className="hero__cta hero__cta--secondary" href="#callback" data-form="request-callback">Request a Call Back</a>
        </div>
      </div>
    </section>
  )
}
