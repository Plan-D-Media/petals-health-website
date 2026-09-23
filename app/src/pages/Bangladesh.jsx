import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import Img from '../components/Img.jsx'
import Icon from '../components/Icon.jsx'
import { BANGLADESH as B } from '../content/bangladesh.js'
import '../templates/treatment.css'
import './Bangladesh.css'

// Petals Clinic in Bangladesh (2026-09-23). No mock exists: this is our layout in the site's language, carrying only
// the client's own words (src/content/bangladesh.js says what was used, what was held and why).
//   shelf hero (the About hero's framed photograph, on the tint) · white band: the chapter heading and the two service
//   bullets · tint band: the eight services as the site's service cards, with the client's photographs · the page's one
//   navy band: the phone (the only Bangladesh contact the client gives) and a copy-pending row for every missing fact.
// The next action is the call: the site's lead form is Kolkata-specific (see the content file).
const Pending = ({ title }) => <span className="pending" title={title}>Copy pending</span>

export default function Bangladesh() {
  return (
    <div className="page">
      <Header current="bangladesh" />
      <main id="main" tabIndex={-1}>
        <section className="th tb bd-hero" aria-labelledby="bd-title" data-hero>
          <div className="inner th__inner">
            <div className="th__stage bd-hero__stage" data-overlap-ok>
              <Img src={B.hero.src} alt={B.hero.alt} priority />
            </div>
            <div className="th__copy">
              <p className="th__crumb"><a href="/">Home</a> <span aria-hidden="true">›</span> {B.title}</p>
              <h1 id="bd-title" className="th__title"><span className="th__line th__line--primary">{B.title}</span></h1>
              <h2 className="bd-hero__headline">{B.headline}</h2>
              <a className="th__cta bd-hero__call" href={B.phone.href}><Icon name="phone" className="bd-hero__call-icon" />Call {B.phone.label}</a>
            </div>
          </div>
        </section>

        <section className="tb bd-intro" aria-labelledby="bd-chapter">
          <div className="inner bd-intro__inner">
            <h2 id="bd-chapter" className="tb__title bd-intro__title">{B.chapter}</h2>
            <p className="bd-intro__held"><Pending title="The client’s introduction is held: it calls the clinic “trusted” before it has opened. Sent back for rewording (design/client-requests.md item 21)." /></p>
            <ul className="bd-check">
              {B.services.map((s) => <li key={s}><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{s}</span></li>)}
            </ul>
          </div>
        </section>

        <section className="ts tb tb--tint bd-services" aria-labelledby="bd-services-title">
          <div className="inner">
            <h2 id="bd-services-title" className="tb__title bd-services__title">{B.offerTitle}</h2>
            <ul className="ts__grid bd-services__grid">
              {B.offer.map((s, i) => (
                <li key={s.id} className="tc bd-svc" data-reveal data-reveal-order={i % 4}>
                  <div className="bd-svc__photo"><Img src={`/assets/bangladesh/${s.id}.jpg`} alt="" /></div>
                  <h3 className="tc__title">{s.title}</h3>
                  <p className="tc__text">{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="tb tb--navy bd-contact" aria-labelledby="bd-contact-title" id="contact">
          <div className="inner bd-contact__inner">
            <div className="bd-contact__call">
              <h2 id="bd-contact-title" className="tb__eyebrow">{B.title}</h2>
              <a className="bd-contact__phone" href={B.phone.href}><Icon name="phone" className="bd-contact__phone-icon" />{B.phone.label}</a>
            </div>
            <dl className="bd-contact__facts">
              {B.pending.map((p) => <div key={p.label} className="bd-contact__row"><dt>{p.label}</dt><dd><Pending title={p.why} /></dd></div>)}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
