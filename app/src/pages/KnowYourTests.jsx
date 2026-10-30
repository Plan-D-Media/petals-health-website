import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import LeadForm from '../components/LeadForm.jsx'
import ClinicCards from '../components/ClinicCards.jsx'
import { Related } from '../templates/TreatmentA.jsx'
import '../templates/treatment.css'
import './Diagnostics.css'

// Know your Tests (2026-10-30), For Patients → Know your Tests. The client's page
// (https://www.petalshealth.in/know-your-tests/, fetched 2026-10-30) has no guide and no list of tests: a banner
// reading "Book a Test" over a booking form that submits nowhere. So: the menu's own name as the h1 and a copy-pending
// slot where the guide goes (design/client-requests.md item 23); the client's "Book a Test" as the heading of the
// site's call-back form; and our own clinic cards (src/data/clinics.js). Deliberately NOT reproduced (2026-10-30
// decision): the client form's clinic list ("Rawdon Street" matches none of our clinics) and its test-type options
// ("Home Blood Collection" appears nowhere else on the site) — a form must not offer a service that may not exist.
const Pending = ({ title }) => <span className="pending" title={title}>Copy pending</span>

export default function KnowYourTests() {
  return (
    <div className="page">
      <Header current="know-your-tests" />
      <main id="main" tabIndex={-1}>
        <section className="th tb dg-hero" aria-labelledby="ky-title" data-hero>
          <div className="inner">
            <div className="th__copy dg-hero__copy">
              <p className="th__crumb"><a href="/">Home</a> <span aria-hidden="true">›</span> For Patients <span aria-hidden="true">›</span> Know your Tests</p>
              <h1 id="ky-title" className="th__title"><span className="th__line th__line--primary">Know your Tests</span></h1>
              <p className="th__lead dg-hero__lead"><Pending title="The client’s page has no test guide yet; requested in design/client-requests.md item 23" /></p>
              <a className="th__cta" href="#book-a-test">Book a Test</a>
            </div>
          </div>
        </section>

        <section className="tb ky-book" aria-labelledby="ky-book-title" id="book-a-test">
          <div className="inner ky-book__inner">
            <div className="tv__form ky-book__card">
              <h2 id="ky-book-title" className="tv__form-title">Book a Test</h2>
              <p className="tv__form-sub">Tell us what you need and we will call you back.</p>
              <LeadForm form="request-callback" source={{ section: 'know-your-tests', page: 'know-your-tests' }} autoFocus={false} hideTitle compact />
            </div>
          </div>
        </section>

        <ClinicCards />
        <Related c={{ slug: 'know-your-tests', related: ['womens-care', 'child-care', 'multispecialty-clinic'] }} />
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
