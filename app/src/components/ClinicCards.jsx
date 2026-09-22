import { SITES, MAP_THUMB, directionsUrl } from '../data/clinics.js'
import { DOCTORS } from '../data/doctors.js'
import Icon from './Icon.jsx'
import './ClinicCards.css'
import Img from './Img.jsx'

// "FIND US / 3 clinics across Kolkata": the three clinic cards shared by About Us and Clinic Location (the same block
// in both mocks). `as` picks the heading level; `head={false}` drops the block head where the page's hero already
// carries it (Clinic Location, 2026-09-22). Each card (redesign 2026-09-22) adds two things a visitor asks a clinic
// page — the phone number, and how many doctors practise there with a link into Find a Doctor filtered to that
// clinic (the count is live from data/doctors.js). Hours stay out until the client sends per-clinic hours.
// The About mock leaves the third card's first button blank; the Clinics mock shows "Get Direction" on all three, so
// all three get it (logged, design/client-requests.md item 13).
const PHONE = { label: '9147405955', href: 'tel:9147405955' }   // the site's one number (header, footer, forms)
const doctorsAt = (id) => DOCTORS.filter((d) => d.sessions.some((s) => s.clinicId === id)).length

export default function ClinicCards({ as: H = 'h2', id = 'find-us', head = true }) {
  const Sub = !head || H === 'h1' ? 'h2' : 'h3'   // card names sit one level under the block title (or the page's h1)
  return (
    <section className="clinics band" aria-labelledby={head ? id : undefined} aria-label={head ? undefined : 'Our three clinics'}>
      <div className="inner">
        {head && (
          <div className="sec-head clinics__head">
            <p className="sec-head__eyebrow">Find us</p>
            <H id={id} className="sec-head__title">3 clinics across Kolkata</H>
            <p className="sec-head__sub">Conveniently located with ample parking, all equipped with the same standard of care.</p>
          </div>
        )}
        <ul className={'clinics__grid' + (head ? '' : ' clinics__grid--bare')}>
          {SITES.map((s, i) => {
            const n = doctorsAt(s.id)
            return (
              <li key={s.id} className="clinic" id={`clinic-${s.id}`} data-reveal data-reveal-order={i}>
                <div className="clinic__map">
                  <Img src={MAP_THUMB} alt="" />
                  <span className="clinic__region">{s.region}</span>
                </div>
                <div className="clinic__body">
                  <Sub className="clinic__name">{s.name}</Sub>
                  <p className="clinic__address">{s.address.map((l, k) => <span key={k}>{l}{k < s.address.length - 1 && <br />}</span>)}</p>
                  <ul className="clinic__meta">
                    <li><Icon name="phone" className="clinic__icon" /><a href={PHONE.href}>{PHONE.label}</a></li>
                    {n > 0 && <li><Icon name="findDoctor" className="clinic__icon" /><a href={`/find-a-doctor?c=${s.id}`}>{n} doctor{n === 1 ? '' : 's'} here <span aria-hidden="true">→</span></a></li>}
                  </ul>
                </div>
                <div className="clinic__actions">
                  <a className="clinic__btn" href={directionsUrl(s)} target="_blank" rel="noopener">Get Direction</a>
                  <a className="clinic__btn" href="#book" data-form="book-appointment" data-clinic={s.id} data-section="clinic-card">Book Here</a>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
