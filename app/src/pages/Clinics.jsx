import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import ClinicCards from '../components/ClinicCards.jsx'
import LeadForm from '../components/LeadForm.jsx'
import Img from '../components/Img.jsx'
import { Related } from '../templates/TreatmentA.jsx'
import { SITES } from '../data/clinics.js'
import { DOCTORS } from '../data/doctors.js'
import '../templates/treatment.css'
import './Clinics.css'

// Clinic Location (design/svg/6.svg) — redesign 2026-09-22 (design/treatment-redesign.md, "Clinic Location"). The
// mock's sections in the mock's order, on the site's shared language:
//   shelf hero (the Kankurgachi reception photo | eyebrow Find us, the h1 "3 clinics across Kolkata", its one-line
//   lead, Book a consultation, facts from the data files) · the three clinic photo tiles with their name pills, one
//   position for all three · the shared clinic cards (tint band; the head is the hero's) · the FAQ, answered only,
//   beside the consultation form in a light panel · the "More at Petals Health" navy closing panel · footer.
// Copy verbatim. Logged for the client (design/client-requests.md item 13): the FAQ answers for questions 2–5 (the
// design answers only the first, so only the first is drawn; a note counts the rest); "Cantre"; "Oppsite"; the first
// answer names Tollygunge only although the page covers three clinics.
const FAQ = [
  { q: 'Where is the clinic ?', a: 'Our primary health care centre is located in the heart of Tollygunge, which is easily accessible by road and public transport.' },
  { q: 'How far is the clinic from the metro station ?' },
  { q: 'What are your visiting hours ?' },
  { q: 'How can I book an appointment ?' },
  { q: 'Do you accept health insurance ?' },
]

export default function Clinics() {
  const hero = SITES[0]
  const answered = FAQ.filter((it) => it.a)
  const pending = FAQ.length - answered.length
  const facts = [
    { label: `${SITES.length} clinics`, source: 'src/data/clinics.js' },
    { label: SITES.map((s) => s.region.replace(' Kolkata', '')).join(' · ') + ' Kolkata', source: 'the region of each clinic, src/data/clinics.js' },
    { label: `${DOCTORS.length} doctors across the clinics`, source: 'the doctor list, src/data/doctors.js' },
  ]
  return (
    <div className="page">
      <Header current="clinics" />
      <main id="main" tabIndex={-1}>
        <section className="th tb cl-hero" aria-labelledby="clinics-title">
          <div className="inner th__inner">
            <div className="th__stage cl-hero__stage" data-overlap-ok>
              <Img src={hero.photo.src} alt={hero.photo.alt} priority style={{ '--pos': '50% 60%' }} />
            </div>
            <div className="th__copy">
              <p className="tb__eyebrow cl-hero__eyebrow">Find us</p>
              <h1 id="clinics-title" className="th__title"><span className="th__line th__line--primary">3 clinics across Kolkata</span></h1>
              <p className="th__lead th__lead--large">Conveniently located with ample parking, all equipped with the same standard of care.</p>
              <a className="th__cta" href="#consult">Book a consultation</a>
              <ul className="th__facts" aria-label="Quick facts">{facts.map((f) => <li key={f.label} title={`Source: ${f.source}`}>{f.label}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="sites tb" aria-label="The three clinics">
          <div className="inner">
            <ul className="sites__grid">
              {SITES.map((s, i) => (
                <li key={s.id} className="site" data-reveal data-reveal-order={i}>
                  <a className="site__link" href={`#clinic-${s.id}`} aria-label={s.name}>
                    <Img src={s.photo.src} alt={s.photo.alt} style={{ objectPosition: s.photo.position }} />
                    <span className="site__pill" aria-hidden="true">
                      {s.tile.map((l, k) => <span key={k} className={'site__pill-line' + (s.tile.length === 3 && k === 1 ? ' site__pill-line--small' : '')}>{l}</span>)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ClinicCards head={false} />

        <section className="tv tb" aria-labelledby="clinics-faq-title" id="consult">
          <div className="inner tv__inner">
            <div className="tv__copy">
              <div className="tq">
                <h2 id="clinics-faq-title" className="tv__title">FAQs</h2>
                {answered.length < 3 ? (
                  <dl className="tq__list">{answered.map((it) => <div key={it.q} className="tq__item"><dt>{it.q}</dt><dd>{it.a}</dd></div>)}</dl>
                ) : (
                  <div className="tq__acc">{answered.map((it, i) => <details key={it.q} className="tq__acc-item" open={i === 0}><summary>{it.q}</summary><p>{it.a}</p></details>)}</div>
                )}
                {pending > 0 && <p className="tq__note">{pending} more {pending === 1 ? 'question is' : 'questions are'} being answered by the clinic and will appear here.</p>}
              </div>
            </div>
            <div className="tv__form" data-reveal>
              <h3 className="tv__form-title">Book a Consultation</h3>
              <p className="tv__form-sub">Tell us what you need and we will call you back.</p>
              <LeadForm form="book-consultation-page" source={{ section: 'clinics-form', page: 'clinics' }} autoFocus={false} hideTitle />
            </div>
          </div>
        </section>

        <Related c={{ slug: 'clinics', related: ['womens-care', 'child-care', 'multispecialty-clinic'] }} />
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
