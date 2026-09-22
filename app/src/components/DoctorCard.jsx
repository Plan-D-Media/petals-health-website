import Icon from './Icon.jsx'
import { monogram, sessionLabel, photoSmall, sessionsToday, nextSession, timeRange } from '../data/doctors.js'
import './DoctorCard.css'
import Img from './Img.jsx'

// The doctor card (design/round2-report.md §4): 300 × 410, built from the data file's schema. A flex column with the
// rating row and the button anchored at the bottom, so uneven specialty or clinic lines never push them out of line.
// Photo: `doctor.photo` when supplied; a Playfair monogram disc until then.
// `list` (Find a Doctor, 2026-09-22): the same card with today's availability under the sessions and a "View profile"
// link beside Book, and `heading` sets the name's level (h2 in the search, where no h2 sits above the grid) — one
// doctor object on every page, the search included. The two buttons carry the doctor's name for screen readers.
export function Availability({ d, className = 'doctor__avail' }) {
  const today = sessionsToday(d)
  if (today.length) return <p className={className}><span className={`${className}-dot`} aria-hidden="true" />Available today, {timeRange(today[0])}</p>
  const n = nextSession(d)
  if (!n) return <p className={`${className} ${className}--none`}>No sessions listed</p>
  return <p className={`${className} ${className}--next`}>Next: {n.dayName}, {timeRange(n.session)}</p>
}

export default function DoctorCard({ doctor, list = false, section, heading: H = 'h3' }) {
  const sessions = doctor.sessions.slice(0, 2)
  const more = doctor.sessions.length - sessions.length
  return (
    <article className={'doctor' + (list ? ' doctor--list' : '')} aria-label={doctor.name} data-reveal>
      <div className="doctor__top">
        <span className="doctor__badge">{doctor.specialty.split(' & ')[0].split(',')[0]}</span>
        {doctor.videoConsult && <span className="doctor__video"><Icon name="askDoctor" className="doctor__video-icon" />Video consult</span>}
        <div className="doctor__avatar">
          {doctor.photo ? <Img src={photoSmall(doctor)} alt="" /> : <span>{monogram(doctor.name)}</span>}
        </div>
      </div>
      <div className="doctor__body">
        <H className="doctor__name">{list ? <a href={`/doctors/${doctor.id}`}>{doctor.name}</a> : doctor.name}</H>
        <p className="doctor__spec">{doctor.specialty}</p>
        <ul className="doctor__sessions">
          {sessions.map((s, i) => <li key={i}><Icon name="pin" className="doctor__pin" />{sessionLabel(s)}</li>)}
          {more > 0 && <li className="doctor__more">+{more} more clinic</li>}
        </ul>
        {list && <Availability d={doctor} />}
        <p className="doctor__langs">{doctor.languages.join(' · ')}</p>
      </div>
      <div className="doctor__foot">
        <div className="doctor__rating">
          <span className="doctor__stars" role="img" aria-label={`${doctor.rating ?? 5} out of 5 stars`}>{[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" className="doctor__star" />)}</span>
          {doctor.rating != null && <span className="doctor__score">{doctor.rating.toFixed(1)}{doctor.reviewCount ? ` · ${doctor.reviewCount} reviews` : ''}</span>}
        </div>
        {list ? (
          <div className="doctor__actions">
            <a className="doctor__book" href="#book" data-form="book-appointment" data-doctor={doctor.id} data-section={section} aria-label={`Book ${doctor.name}`}>Book</a>
            <a className="doctor__profile" href={`/doctors/${doctor.id}`} aria-label={`View profile: ${doctor.name}`}>View profile</a>
          </div>
        ) : (
          <a className="doctor__book" href="#book" data-form="book-appointment" data-doctor={doctor.id} data-section={section}>Book Consultation</a>
        )}
      </div>
    </article>
  )
}
