import { SITES, MAP_THUMB, directionsUrl } from '../data/clinics.js'
import './ClinicCards.css'
import Img from './Img.jsx'

// "FIND US / 3 clinics across Kolkata": the three clinic cards shared by About Us and Clinic Location (the same block
// in both mocks). `as` picks the heading level — h1 on the Clinics page, where it is the page's title.
// The About mock leaves the third card's first button blank; the Clinics mock shows "Get Direction" on all three, so
// all three get it (logged, design/client-requests.md item 13).
export default function ClinicCards({ as: H = 'h2', id = 'find-us' }) {
  return (
    <section className="clinics band" aria-labelledby={id}>
      <div className="inner">
        <div className="sec-head clinics__head">
          <p className="sec-head__eyebrow">Find us</p>
          <H id={id} className="sec-head__title">3 clinics across Kolkata</H>
          <p className="sec-head__sub">Conveniently located with ample parking, all equipped with the same standard of care.</p>
        </div>
        <ul className="clinics__grid">
          {SITES.map((s, i) => (
            <li key={s.id} className="clinic" id={`clinic-${s.id}`} data-reveal data-reveal-order={i}>
              <div className="clinic__map">
                <Img src={MAP_THUMB} alt="" />
                <span className="clinic__region">{s.region}</span>
              </div>
              <div className="clinic__body">
                <h3 className="clinic__name">{s.name}</h3>
                <p className="clinic__address">{s.address.map((l, k) => <span key={k}>{l}{k < s.address.length - 1 && <br />}</span>)}</p>
              </div>
              <div className="clinic__actions">
                <a className="clinic__btn" href={directionsUrl(s)} target="_blank" rel="noopener">Get Direction</a>
                <a className="clinic__btn" href="#book" data-form="book-appointment" data-clinic={s.id} data-section="clinic-card">Book Here</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
