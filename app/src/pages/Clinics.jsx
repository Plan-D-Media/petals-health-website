import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import LeadForm from '../components/LeadForm.jsx'
import Img from '../components/Img.jsx'
import Icon from '../components/Icon.jsx'
import { Arrow } from '../components/Specialists.jsx'
import { Related } from '../templates/TreatmentA.jsx'
import { SITES, directionsUrl } from '../data/clinics.js'
import { DOCTORS, CLINICS, monogram, photoSmall } from '../data/doctors.js'
import '../templates/treatment.css'
import './Clinics.css'

// Clinic Location (design/svg/6.svg) — redesign 2026-09-22 (round 4, item 3: "one band per clinic"). The three
// clinics are the product, so each gets a band of its own rather than a tile and a card in two separate rows:
//   compact hero (eyebrow, h1, lead, facts, three jump pills) · one band per clinic, white / tint alternating with
//   seams — the clinic photograph one side, and on the other the name, region, address, Get directions (Google Maps),
//   the phone, an opening-hours slot marked copy pending, the doctors who practise there as their own cards, and
//   what the clinic offers as chips derived from those doctors' specialties · the FAQ as its own band, laid out to
//   look deliberate with one answer and to grow as answers arrive · the consultation form, full width · the navy
//   "More at Petals Health" panel · footer.
// No sticky form here (recommended and approved): the content column is three photo bands, and the real action on
// this page is "Book here" on the clinic you chose, which already preselects that clinic.
// Directions link out to Google Maps; there is no map image or iframe on the page (a static map would need a Maps
// Static key or a designed asset the client has not sent — the stock map crop that used to sit on the cards is gone).
// Copy verbatim. Logged (design/client-requests.md item 13): the FAQ answers for questions 2–5, "Cantre", "Oppsite",
// and the first answer naming Tollygunge only although the page covers three clinics. Opening hours: item 19.
const FAQ = [
  { q: 'Where is the clinic ?', a: 'Our primary health care centre is located in the heart of Tollygunge, which is easily accessible by road and public transport.' },
  { q: 'How far is the clinic from the metro station ?' },
  { q: 'What are your visiting hours ?' },
  { q: 'How can I book an appointment ?' },
  { q: 'Do you accept health insurance ?' },
]
const PHONE = { label: '9147405955', href: 'tel:9147405955' }   // the site's one number (header, footer, forms)
const doctorsAt = (id) => DOCTORS.filter((d) => d.sessions.some((s) => s.clinicId === id))
const offersAt = (docs) => [...new Set(docs.map((d) => d.specialty.split(/\s*[&,]\s*/)[0].trim()))]

function ClinicBand({ s, i }) {
  const docs = doctorsAt(s.id)
  const offers = offersAt(docs)
  const tint = i % 2 === 1
  return (
    <section id={`clinic-${s.id}`} className={'cb tb' + (tint ? ' tb--tint' : '')} aria-labelledby={`cb-${s.id}`}>
      <div className={'inner cb__inner' + (i % 2 === 1 ? ' cb__inner--flip' : '')}>
        <div className="cb__photo" data-reveal>
          <Img src={s.photo.src} alt={s.photo.alt} style={{ objectPosition: s.photo.position }} />
          <span className="cb__region">{s.region}</span>
        </div>
        <div className="cb__body">
          <h2 id={`cb-${s.id}`} className="cb__name">{s.name}</h2>
          <p className="cb__address">{s.address.map((l, k) => <span key={k}>{l}{k < s.address.length - 1 && <br />}</span>)}</p>
          <ul className="cb__meta">
            <li><Icon name="phone" className="cb__icon" /><a href={PHONE.href}>{PHONE.label}</a></li>
            <li className="cb__meta--pending"><Icon name="calendar" className="cb__icon" /><span>Opening hours <span className="pending" title="With the client (design/client-requests.md item 19): per-clinic opening hours have not been sent, so none are shown">Copy pending</span></span></li>
          </ul>
          {offers.length > 0 && (
            <ul className="cb__offers" aria-label={`What ${s.name} offers`}>
              {offers.map((o) => <li key={o}>{o}</li>)}
            </ul>
          )}
          <div className="cb__actions">
            <a className="cb__book" href="#book" data-form="book-appointment" data-clinic={s.id} data-section="clinic-band">Book here</a>
            <a className="cb__dir" href={directionsUrl(s)} target="_blank" rel="noopener">Get directions <Arrow /></a>
          </div>
          {docs.length > 0 && (
            <div className="cb__docs">
              <p className="cb__docs-head">{docs.length} doctor{docs.length === 1 ? '' : 's'} practise{docs.length === 1 ? 's' : ''} here</p>
              <ul className="cb__docs-list">
                {docs.map((d) => (
                  <li key={d.id}>
                    <a href={`/doctors/${d.id}`}>
                      <span className="cb__avatar">{d.photo ? <Img src={photoSmall(d)} alt="" /> : <span>{monogram(d.name)}</span>}</span>
                      <span className="cb__doc-name">{d.name}<span className="cb__doc-spec">{d.specialty}</span></span>
                    </a>
                  </li>
                ))}
              </ul>
              <a className="cb__all" href={`/find-a-doctor?c=${s.id}`}>All doctors at {CLINICS[s.id].short} <Arrow /></a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Clinics() {
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
        <section className="cl-hero tb" aria-labelledby="clinics-title" data-hero>
          <div className="inner cl-hero__inner">
            <p className="tb__eyebrow cl-hero__eyebrow">Find us</p>
            <h1 id="clinics-title" className="cl-hero__title">3 clinics across Kolkata</h1>
            <p className="cl-hero__lead">Conveniently located with ample parking, all equipped with the same standard of care.</p>
            <ul className="th__facts cl-hero__facts" aria-label="Quick facts">{facts.map((f) => <li key={f.label} title={`Source: ${f.source}`}>{f.label}</li>)}</ul>
            <ul className="cl-hero__jump" aria-label="Jump to a clinic">
              {SITES.map((s) => <li key={s.id}><a href={`#clinic-${s.id}`}>{CLINICS[s.id].short}</a></li>)}
            </ul>
          </div>
        </section>

        {SITES.map((s, i) => <ClinicBand key={s.id} s={s} i={i} />)}

        <section className="cq tb" aria-labelledby="clinics-faq-title">
          <div className="inner cq__inner">
            <div className="cq__head">
              <p className="tb__eyebrow">Good to know</p>
              <h2 id="clinics-faq-title" className="cq__title">Before you visit</h2>
              {pending > 0 && <p className="cq__note">{pending} more {pending === 1 ? 'question is' : 'questions are'} being answered by the clinic and will appear here.</p>}
            </div>
            <dl className="cq__list">
              {answered.map((it) => <div key={it.q} className="cq__item"><dt>{it.q}</dt><dd>{it.a}</dd></div>)}
            </dl>
          </div>
        </section>

        <section className="tv tb" aria-labelledby="clinics-form-title" id="consult">
          <div className="inner cf__inner">
            <div className="cf__copy">
              <h2 id="clinics-form-title" className="tv__title">Book a<br />Consultation</h2>
              <p className="tv__note">Tell us which clinic suits you and we will call you back to confirm. Our team answers by phone or WhatsApp, usually within an hour during clinic hours.</p>
              <a className="tv__call" href={PHONE.href}>Call {PHONE.label}</a>
            </div>
            <div className="tv__form" data-reveal>
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
