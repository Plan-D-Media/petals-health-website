import Proof from './Proof.jsx'
import './ClosingBand.css'

// Closing band before the footer (design/round2-report.md §4, CTA path): the hero's paragraph, its two buttons and the
// proof strip, reused verbatim — no new copy. A visitor who reads to the end has the next action in view.
export default function ClosingBand() {
  return (
    <section className="closing band" aria-label="Book an appointment or request a call back">
      <div className="inner closing__inner">
        <p className="closing__body">
          From fertility and pregnancy to paediatric care, diagnostics and specialist services for
          the whole family, everything you need is available under one trusted roof.
        </p>
        <div className="closing__actions">
          <a className="closing__cta" href="#book" data-form="book-appointment">Book Appointment</a>
          <a className="closing__cta closing__cta--secondary" href="#callback" data-form="request-callback">Request a Call Back</a>
        </div>
        <Proof card={false} className="closing__proof" />
      </div>
    </section>
  )
}
