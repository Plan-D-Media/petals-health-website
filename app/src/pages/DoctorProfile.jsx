import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import Icon from '../components/Icon.jsx'
import { Story } from '../components/Testimonials.jsx'
import { CLINICS, clinicsOf, daysLabel, timeRange, monogram } from '../data/doctors.js'
import { TESTIMONIALS } from '../data/testimonials.js'
import './DoctorProfile.css'
import Img from '../components/Img.jsx'

// Doctor profile (design/svg/under Find a Doctor.svg — Dr. Smita Gutgutia). Every block reads the doctor's record:
//   hero (breadcrumb, name, specialty, qualifications + college, clinics, languages, top treatment tags, video pill,
//   Book a visit) · "In her words" quote band · ABOUT Approach to care + stats · TREATS (grouped `treats`, else the
//   flat tags) · BACKGROUND Education & Experience · WHERE SHE PRACTISES Clinics & days · PATIENT REVIEWS (stories
//   linked by doctorId). A field the record lacks renders a "pending" note (the six placeholder doctors) so the page
//   never shows another doctor's copy. Pronouns come from `pronoun` (she/he); unset → they.
// Mock flags (design/client-requests.md item 14): "Loudon Steet", "Post-Partom Recovery", "IN PRACTICE / FROM 1012".

const Pending = ({ what }) => <p className="dp__pending"><span className="pending" title="With the client">Copy pending</span> {what} will appear here once the client's doctor sheet arrives.</p>
const PRONOUNS = { she: { poss: 'her', subj: 'she' }, he: { poss: 'his', subj: 'he' }, they: { poss: 'their', subj: 'they' } }

export default function DoctorProfile({ doctor: d }) {
  const pr = PRONOUNS[d.pronoun] || PRONOUNS.they
  const clinics = clinicsOf(d)
  const stories = TESTIMONIALS.filter((t) => t.doctorId === d.id)
  const quals = [d.qualifications.join(', '), d.college].filter(Boolean).join(' — ')
  return (
    <div className="page">
      <Header current="find" />
      <main>
        <section className="dp-hero band" aria-labelledby="dp-title" data-hero>
          <div className="dp-hero__bg" aria-hidden="true"><Img src="/assets/doctors/profile-hero-bg.jpg" alt="" priority /></div>
          <div className="inner dp-hero__inner">
            <div className="dp-hero__copy">
              <p className="dp-hero__crumb"><a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/find-a-doctor">Find a Doctor</a> <span aria-hidden="true">/</span> {d.name}</p>
              <h1 id="dp-title" className="dp-hero__name">{d.name}</h1>
              <p className="dp-hero__spec">{d.specialty}</p>
              <ul className="dp-hero__facts">
                {quals ? <li><span className="dp-hero__glyph" aria-hidden="true">🎓</span>{quals}</li> : <li className="dp-hero__fact--pending"><span className="dp-hero__glyph" aria-hidden="true">🎓</span>Qualifications <span className="pending" title="With the client">pending</span></li>}
                <li><Icon name="pin" className="dp-hero__pin" />{clinics.map((c) => c.name).join(' | ')}</li>
                <li><span className="dp-hero__glyph" aria-hidden="true">🗣</span>{d.languages.join(', ')}</li>
              </ul>
              <ul className="dp-hero__tags" aria-label="Areas of focus">
                {d.treatmentTags.slice(0, 3).map((t) => <li key={t}>{t}</li>)}
                {d.videoConsult && <li className="dp-hero__tag--video">Video consult available</li>}
              </ul>
              <a className="dp-hero__cta" href="#book" data-form="book-appointment" data-doctor={d.id} data-section="doctor-profile">Book a visit</a>
            </div>
            <div className="dp-hero__photo" data-overlap-ok>
              {d.portrait || d.photo ? <Img src={d.portrait || d.photo} alt={`${d.name}, portrait`} priority /> : <span className="dp-hero__monogram" aria-hidden="true">{monogram(d.name)}</span>}
            </div>
          </div>
        </section>

        {d.quote && (
          <section className="dp-quote band" aria-labelledby="dp-quote-title">
            <div className="inner">
              <h2 id="dp-quote-title" className="dp-quote__title">In {pr.poss} words</h2>
              <blockquote className="dp-quote__text"><p>"{d.quote}"</p></blockquote>
            </div>
          </section>
        )}

        <section className="dp band" aria-label="Profile details">
          <div className="inner dp__inner">
            <div className="dp__block">
              <p className="dp__eyebrow">About</p>
              <h2 className="dp__title">Approach to care</h2>
              {d.bio ? <p className="dp__bio">{d.bio}</p> : <Pending what={`${d.name}'s approach to care`} />}
              <dl className="dp__stats">
                {d.experienceYears != null && <div><dt>In practice</dt><dd>{d.experienceYears}+ years</dd></div>}
                {d.rating != null && <div><dt>Google reviews{d.reviewCount ? ` (${d.reviewCount})` : ''}</dt><dd>{d.rating.toFixed(1)} / 5</dd></div>}
              </dl>
            </div>

            <div className="dp__block">
              <p className="dp__eyebrow">Treats</p>
              {d.treats?.length ? d.treats.map((g) => (
                <div key={g.heading} className="dp__group">
                  <h2 className="dp__title">{g.heading}</h2>
                  <ul className="dp__tags">{g.tags.map((t, i) => <li key={t + i}>{t}</li>)}</ul>
                </div>
              )) : (
                <div className="dp__group">
                  <h2 className="dp__title">Areas of focus</h2>
                  <ul className="dp__tags">{d.treatmentTags.map((t) => <li key={t}>{t}</li>)}</ul>
                  <Pending what="The full list of conditions and treatments" />
                </div>
              )}
            </div>

            <div className="dp__block">
              <p className="dp__eyebrow">Background</p>
              <h2 className="dp__title">Education & Experience</h2>
              {d.education.length ? (
                <ol className="dp__edu">
                  {d.education.map((e, i) => <li key={i}><span className="dp__edu-period">{e.period || '--'}</span><span className="dp__edu-body"><strong>{e.title}</strong><span>{e.place}</span></span></li>)}
                </ol>
              ) : <Pending what="Education and experience" />}
            </div>

            <div className="dp__block">
              <p className="dp__eyebrow">Where {pr.subj} practise{pr.subj === 'they' ? '' : 's'}</p>
              <h2 className="dp__title">Clinics & days</h2>
              <ul className="dp__clinics">
                {d.sessions.map((s, i) => (
                  <li key={i} className="dp__clinic">
                    <div><strong>{CLINICS[s.clinicId].name}</strong><span>{daysLabel(s.days)} — {timeRange(s)}</span></div>
                    <a href={`/clinics#clinic-${s.clinicId}`} data-inline-link>View clinic <span aria-hidden="true">→</span></a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dp__block dp__block--wide">
              <p className="dp__eyebrow">Patient reviews</p>
              <h2 className="dp__title">What patients say</h2>
              {stories.length ? <ul className="dp__stories">{stories.map((s) => <li key={s.id}><Story s={s} /></li>)}</ul> : <Pending what={`Patient reviews for ${d.name}`} />}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
