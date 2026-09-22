import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import Icon from '../components/Icon.jsx'
import { Story } from '../components/Testimonials.jsx'
import { Arrow } from '../components/Specialists.jsx'
import { CLINICS, clinicsOf, daysLabel, timeRange, monogram } from '../data/doctors.js'
import { TESTIMONIALS } from '../data/testimonials.js'
import '../templates/treatment.css'
import './DoctorProfile.css'
import Img from '../components/Img.jsx'

// Doctor profile (design/svg/under Find a Doctor.svg — Dr. Smita Gutgutia) — redesign 2026-09-22
// (design/treatment-redesign.md, "The doctor profile"). Every block reads the doctor's record and renders only when
// the record has it, on alternating white / tint bands:
//   hero (breadcrumb, name, specialty, qualifications + college, clinics, languages, top treatment tags, video pill,
//   Book a visit) · "In her words" quote band · ABOUT Approach to care with the stats as a card · TREATS (grouped
//   `treats` as a plain list, not pills) · BACKGROUND Education & Experience · WHERE SHE PRACTISES Clinics & days ·
//   PATIENT REVIEWS (stories linked by doctorId) · a navy closing panel: Book a visit, Ask a doctor, the doctors at
//   each of the doctor's clinics.
// A record with none of the copy blocks (the six placeholder doctors) gets one honest note in place of the empty
// sections — the hero, the note with its two working actions, the clinics and the close — never another doctor's
// copy. The `pending` tag stays so the client sees the state. Pronouns come from `pronoun` (she/he); unset → they.
// Mock flags (design/client-requests.md item 14): "Loudon Steet", "Post-Partom Recovery", "IN PRACTICE / FROM 1012".

const PRONOUNS = { she: { poss: 'her', subj: 'she' }, he: { poss: 'his', subj: 'he' }, they: { poss: 'their', subj: 'they' } }

function Block({ eyebrow, title, tint = false, wide = false, id, children }) {
  return (
    <section className={'dp tb' + (tint ? ' tb--tint' : '')} aria-labelledby={id}>
      <div className={'inner dp__inner' + (wide ? ' dp__inner--wide' : '')}>
        <p className="dp__eyebrow">{eyebrow}</p>
        <h2 id={id} className="dp__title">{title}</h2>
        {children}
      </div>
    </section>
  )
}

export default function DoctorProfile({ doctor: d }) {
  const pr = PRONOUNS[d.pronoun] || PRONOUNS.they
  const clinics = clinicsOf(d)
  const stories = TESTIMONIALS.filter((t) => t.doctorId === d.id)
  const quals = [d.qualifications.join(', '), d.college].filter(Boolean).join(' — ')
  const hasTreats = d.treats?.length > 0
  const hasEdu = d.education.length > 0
  // what the sheet still owes this record; the note lists it once, in place of one empty section per item
  const missing = [!d.bio && 'approach to care', !hasTreats && 'conditions treated', !hasEdu && 'education and experience', !stories.length && 'patient reviews'].filter(Boolean)
  const missingLine = missing.length > 1 ? missing.slice(0, -1).join(', ') + ' and ' + missing[missing.length - 1] : missing[0]
  const stats = [d.experienceYears != null && { dt: 'In practice', dd: `${d.experienceYears}+ years` }, d.rating != null && { dt: `Google reviews${d.reviewCount ? ` (${d.reviewCount})` : ''}`, dd: `${d.rating.toFixed(1)} / 5` }].filter(Boolean)
  const book = <a className="dp__book" href="#book" data-form="book-appointment" data-doctor={d.id} data-section="doctor-profile">Book a visit</a>
  const ask = <a className="dp__ask" href="#ask" data-form="ask-doctor" data-section={`doctor-profile:${d.id}`}>Ask a doctor <Arrow /></a>
  let tint = false
  const band = () => { const t = tint; tint = !tint; return t }   // alternate bands: the first content band is white

  return (
    <div className="page">
      <Header current="find" />
      <main id="main" tabIndex={-1}>
        <section className="dp-hero band" aria-labelledby="dp-title" data-hero>
          <div className="dp-hero__bg" aria-hidden="true"><Img src="/assets/doctors/profile-hero-bg.jpg" alt="" priority /></div>
          <div className="inner dp-hero__inner">
            <div className="dp-hero__copy">
              <p className="dp-hero__crumb"><a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/find-a-doctor">Find a Doctor</a> <span aria-hidden="true">/</span> {d.name}</p>
              <h1 id="dp-title" className="dp-hero__name">{d.name}</h1>
              <p className="dp-hero__spec">{d.specialty}</p>
              <ul className="dp-hero__facts">
                {quals && <li><svg className="dp-hero__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4 2 9l10 5 10-5-10-5Zm-6 8.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3-6-3Z" fill="currentColor"/><path d="M21 9.5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>{quals}</li>}
                <li><Icon name="pin" className="dp-hero__pin" />{clinics.map((c) => c.name).join(' | ')}</li>
                <li><svg className="dp-hero__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.4 3.3A.8.8 0 0 1 4.3 18.7V16A2.5 2.5 0 0 1 4 13.5v-8Z" fill="currentColor"/></svg>{d.languages.join(', ')}</li>
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

        {!d.bio && (
          <Block eyebrow="About" title={`${d.name}'s profile`} id="dp-about-title" tint={band()}>
            <div className="dp__about">
              <div>
                <p className="dp__note"><span className="pending" title="With the client: the doctor sheet (design/client-requests.md item 3)">Copy pending</span> {d.name}'s {missing.length === 4 ? 'full profile' : missingLine} {missing.length === 4 ? 'is' : missing.length === 1 ? 'is' : 'are'} being prepared. You can book a visit or ask us a question now.</p>
                <div className="dp__actions">{book}{ask}</div>
              </div>
              {stats.length > 0 && <dl className="dp__stats">{stats.map((s) => <div key={s.dt}><dt>{s.dt}</dt><dd>{s.dd}</dd></div>)}</dl>}
            </div>
          </Block>
        )}

        {d.bio && (
          <Block eyebrow="About" title="Approach to care" id="dp-about-title" tint={band()}>
            <div className="dp__about">
              <p className="dp__bio">{d.bio}</p>
              {stats.length > 0 && <dl className="dp__stats">{stats.map((s) => <div key={s.dt}><dt>{s.dt}</dt><dd>{s.dd}</dd></div>)}</dl>}
            </div>
          </Block>
        )}

        {hasTreats && (
          <section className={'dp tb' + (band() ? ' tb--tint' : '')} aria-labelledby="dp-treats-title">
            <div className="inner dp__inner">
              <p className="dp__eyebrow" id="dp-treats-title">Treats</p>
              <div className="dp__groups">
                {d.treats.map((g) => (
                  <div key={g.heading} className="dp__group">
                    <h2 className="dp__title">{g.heading}</h2>
                    <ul className="dp__tags">{g.tags.map((t, i) => <li key={t + i}>{t}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {hasEdu && (
          <Block eyebrow="Background" title="Education & Experience" id="dp-edu-title" tint={band()}>
            <ol className="dp__edu">
              {d.education.map((e, i) => <li key={i}><span className="dp__edu-period">{e.period || ''}</span><span className="dp__edu-body"><strong>{e.title}</strong><span>{e.place}</span></span></li>)}
            </ol>
          </Block>
        )}

        <Block eyebrow={`Where ${pr.subj} practise${pr.subj === 'they' ? '' : 's'}`} title="Clinics & days" id="dp-clinics-title" tint={band()}>
          <ul className="dp__clinics">
            {d.sessions.map((s, i) => (
              <li key={i} className="dp__clinic">
                <div><strong>{CLINICS[s.clinicId].name}</strong><span>{daysLabel(s.days)} — {timeRange(s)}</span></div>
                <a href={`/clinics#clinic-${s.clinicId}`} data-inline-link>View clinic <span aria-hidden="true">→</span></a>
              </li>
            ))}
          </ul>
        </Block>

        {stories.length > 0 && (
          <Block eyebrow="Patient reviews" title="What patients say" id="dp-reviews-title" tint={band()} wide>
            <ul className="dp__stories">{stories.map((s) => <li key={s.id}><Story s={s} /></li>)}</ul>
          </Block>
        )}

        <section className="tr tb dp-close" aria-labelledby="dp-close-title">
          <div className="inner"><div className="tr__inner" data-reveal>
            <h2 id="dp-close-title" className="tr__title">Next step with {d.name}</h2>
            <ul className="tr__list">
              <li><a className="tr__doctors" href="#book" data-form="book-appointment" data-doctor={d.id} data-section="doctor-profile-close">Book a visit <Arrow /></a></li>
              <li><a href="#ask" data-form="ask-doctor" data-section={`doctor-profile-close:${d.id}`}>Ask a doctor <Arrow /></a></li>
              {clinics.map((c) => <li key={c.id}><a href={`/find-a-doctor?c=${c.id}`}>Doctors at {c.short} <Arrow /></a></li>)}
            </ul>
          </div></div>
        </section>
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
