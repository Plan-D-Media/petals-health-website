import { Fragment } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import { SideForm, focusForm, Related } from '../templates/TreatmentA.jsx'
import { Faq } from '../templates/TreatmentB.jsx'
import { DIAGNOSTICS as D } from '../content/diagnostics.js'
import '../templates/treatment.css'
import './Diagnostics.css'

// Diagnostic Services (2026-10-30). No mock: our layout in the site's language, carrying only the client's own words
// (src/content/diagnostics.js says what was used, what was held and why).
//   shelf hero on the tint, type only (the client's page has no photograph; one is on the client list) · the split:
//   the content column — a jump index of the twenty services, then the services as rows in the client's order, then
//   the FAQ on a tint band — beside the sticky form · the navy closing panel · footer.
// The form is the site's call-back form (name, mobile, message): the consultation form's department list has no
// diagnostics entry and requires one, and a wrong department is worse than none. Submissions are tagged with this page.
const Pending = ({ title }) => <span className="pending" title={title}>Copy pending</span>
const FORM = { slug: D.slug, title: D.title, form: { title: 'Book a Test', preset: 'request-callback' } }   // "Book a Test": the client's own label for this action

export default function Diagnostics() {
  return (
    <div className="page">
      <Header current="diagnostics" />
      <main id="main" tabIndex={-1} data-department={D.title}>
        <section className="th tb dg-hero" aria-labelledby="dg-title" data-hero>
          <div className="inner">
            <div className="th__copy dg-hero__copy">
              <p className="th__crumb"><a href="/">Home</a> <span aria-hidden="true">›</span> {D.title}</p>
              <h1 id="dg-title" className="th__title"><span className="th__line th__line--primary">{D.title}</span></h1>
              <p className="th__lead dg-hero__lead"><Pending title="The client’s page has no introduction under its heading; requested in design/client-requests.md item 22" /></p>
              <a className="th__cta" href="#book" data-form="book-appointment" data-section="diagnostics-hero">Book an appointment</a>
            </div>
          </div>
        </section>

        <div className="inner"><div className="tsplit">
          <div className="tsplit__main" onClick={focusForm}>
            <nav className="tb dg-index" aria-label="Diagnostic services on this page">
              <div className="inner">
                <ul className="dg-index__list">{D.services.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ul>
              </div>
            </nav>

            <section className="tb dg-list" aria-label={D.title}>
              <div className="inner">
                <ul className="dg-rows">
                  {D.services.map((s) => (
                    <li key={s.id} id={s.id} className="dg-row">
                      <h2 className="dg-row__title">{s.title}</h2>
                      <p className="dg-row__text">
                        {s.parts.map((p, i) => <Fragment key={i}>{i > 0 && ' '}{typeof p === 'string' ? p : <Pending title={p.why} />}</Fragment>)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="tv tb tb--tint tv--column dg-faq" aria-labelledby="t-visit-title">
              <div className="inner"><Faq faq={D.faq} /></div>
            </section>
          </div>
          <SideForm c={FORM} />
        </div></div>

        <Related c={{ slug: D.slug, related: D.related }} />
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
