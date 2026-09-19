import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import ClinicCards from '../components/ClinicCards.jsx'
import LeadForm from '../components/LeadForm.jsx'
import { SITES } from '../data/clinics.js'
import '../templates/TreatmentB.css'   /* the FAQ accordion and the on-page form frame */
import './Clinics.css'
import Img from '../components/Img.jsx'

// Clinic Location (design/svg/6.svg): three clinic photo tiles with name pills · Find us (shared clinic cards, the
// page's h1) · FAQs (five questions; the design answers only the first) | Book a Consultation form.
// Logged for the client (design/client-requests.md item 13): the FAQ answers for questions 2–5; "Cantre"; "Oppsite";
// the first answer names Tollygunge only although the page covers three clinics.
const FAQ = [
  { q: 'Where is the clinic ?', a: 'Our primary health care centre is located in the heart of Tollygunge, which is easily accessible by road and public transport.' },
  { q: 'How far is the clinic from the metro station ?' },
  { q: 'What are your visiting hours ?' },
  { q: 'How can I book an appointment ?' },
  { q: 'Do you accept health insurance ?' },
]
const Pending = ({ title = 'With the client' }) => <span className="pending" title={title}>Copy pending</span>

export default function Clinics() {
  return (
    <div className="page">
      <Header current="clinics" />
      <main id="main" tabIndex={-1}>
        <section className="sites band" aria-label="Our three clinics" data-hero>
          <ul className="sites__grid">
            {SITES.map((s, i) => (
              <li key={s.id} className="site">
                <a className="site__link" href={`#clinic-${s.id}`} aria-label={s.name}>
                  <Img src={s.photo.src} alt={s.photo.alt} style={{ objectPosition: s.photo.position }} priority={i === 0} />
                  <span className="site__pill" aria-hidden="true">
                    {s.tile.map((l, i) => <span key={i} className={'site__pill-line' + (s.tile.length === 3 && i === 1 ? ' site__pill-line--small' : '')}>{l}</span>)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <ClinicCards as="h1" id="clinics-title" />

        <section className="t-faq band" aria-labelledby="clinics-faq-title">
          <div className="inner t-faq__inner">
            <div className="t-faq__col">
              <h2 id="clinics-faq-title" className="t-faq__title">FAQs</h2>
              <div className="t-faq__list">
                {FAQ.map((it, i) => (
                  <details key={it.q} className="t-faq__item" open={i === 0}>
                    <summary className="t-faq__q">{it.q}</summary>
                    <div className="t-faq__a">{it.a ? <p>{it.a}</p> : <p className="t-faq__pending"><Pending title="The design shows this question closed and carries no answer for it" /> The answer to this question is with the client.</p>}</div>
                  </details>
                ))}
              </div>
            </div>
            <aside className="t-form" aria-label="Book a Consultation">
              <div className="t-form__head">Book a Consultation</div>
              <div className="t-form__body"><LeadForm form="book-consultation-page" source={{ section: 'clinics-form', page: 'clinics' }} autoFocus={false} hideTitle /></div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
