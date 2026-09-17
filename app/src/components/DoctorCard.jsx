import Icon from './Icon.jsx'
import { monogram, sessionLabel } from '../data/doctors.js'
import './DoctorCard.css'

// The doctor card (design/round2-report.md §4): 300 × 410, built from the data file's schema. A flex column with the
// rating row and the button anchored at the bottom, so uneven specialty or clinic lines never push them out of line.
// Photo: `doctor.photo` when supplied; a Playfair monogram disc until then.
export default function DoctorCard({ doctor }) {
  const sessions = doctor.sessions.slice(0, 2)
  const more = doctor.sessions.length - sessions.length
  return (
    <article className="doctor" aria-label={doctor.name}>
      <div className="doctor__top">
        <span className="doctor__badge">{doctor.specialty.split(' & ')[0].split(',')[0]}</span>
        {doctor.videoConsult && <span className="doctor__video"><Icon name="askDoctor" className="doctor__video-icon" />Video consult</span>}
        <div className="doctor__avatar">
          {doctor.photo ? <img src={doctor.photo} alt="" /> : <span>{monogram(doctor.name)}</span>}
        </div>
      </div>
      <div className="doctor__body">
        <h3 className="doctor__name">{doctor.name}</h3>
        <p className="doctor__spec">{doctor.specialty}</p>
        <ul className="doctor__sessions">
          {sessions.map((s, i) => <li key={i}><Icon name="pin" className="doctor__pin" />{sessionLabel(s)}</li>)}
          {more > 0 && <li className="doctor__more">+{more} more clinic</li>}
        </ul>
        <p className="doctor__langs">{doctor.languages.join(' · ')}</p>
      </div>
      <div className="doctor__foot">
        <div className="doctor__rating">
          <span className="doctor__stars" aria-label={`${doctor.rating ?? 5} out of 5 stars`}>{[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" className="doctor__star" />)}</span>
          {doctor.rating != null && <span className="doctor__score">{doctor.rating.toFixed(1)}{doctor.reviewCount ? ` · ${doctor.reviewCount} reviews` : ''}</span>}
        </div>
        <a className="doctor__book" href="#book" data-form="book-appointment" data-doctor={doctor.id}>Book Consultation</a>
      </div>
    </article>
  )
}
