import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import Marquee from '../components/Marquee.jsx'
import { DOCTORS } from '../data/doctors.js'
import './TreatmentA.css'

// Template A — "grid + CTA" treatment page (Child Care, Pain Management, Audiology, Yoga & Wellness, Multispecialty).
// Blocks, top to bottom: hero (masked photo | headline, lead, CTA) · intro paragraph · service grid (numbered cards,
// "Learn more") · closing band (headline | Call · Book Online) · "Meet the team" marquee of doctors in the specialty ·
// footer. Everything comes from the content file; the page adds no copy of its own.
export default function TreatmentA({ content: c }) {
  const team = DOCTORS.filter((d) => d.specialtyId === c.specialtyId)
  return (
    <div className="page">
      <Header current={c.slug} />
      <main>
        <section className="t-hero band" aria-labelledby="t-hero-title">
          <div className="inner t-hero__inner">
            <div className="t-hero__photo" data-overlap-ok>
              <img src={c.hero.photo.src} alt={c.hero.photo.alt} decoding="async" fetchPriority="high" style={{ '--mask': `url(${c.hero.photo.mask})` }} />
            </div>
            <div className="t-hero__copy">
              <p className="t-hero__crumb"><a href="/">Home</a> <span aria-hidden="true">›</span> Treatments <span aria-hidden="true">›</span> {c.title}</p>
              <h1 id="t-hero-title" className="t-hero__title">
                <span className="t-hero__line t-hero__line--primary">{c.hero.headline[0]}</span>
                <span className="t-hero__line t-hero__line--accent">{c.hero.headline[1]}</span>
              </h1>
              <p className="t-hero__lead">{c.hero.lead}</p>
              <a className="t-hero__cta" href="#book" data-form={c.hero.cta.form} data-section="treatment-hero">{c.hero.cta.label}</a>
            </div>
          </div>
        </section>

        <section className="t-intro band"><div className="inner"><p className="t-intro__text">{c.intro}</p></div></section>

        <section className="t-services band" aria-label={`${c.title} services`}>
          <div className="inner">
            <ol className="t-services__grid">
              {c.services.map((s, i) => (
                <li key={s.title} className="t-service" data-reveal data-reveal-order={i % 4}>
                  <span className="t-service__num" aria-hidden="true">{i + 1}</span>
                  <h2 className="t-service__title">{s.title}</h2>
                  <p className="t-service__text">{s.text}</p>
                  <a className="t-service__link" href="#" data-inline-link>{c.serviceLink} <span aria-hidden="true">→</span></a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="t-closing band" aria-label="Book a visit">
          <div className="inner t-closing__inner">
            <h2 className="t-closing__title">{c.closing.headline[0]}<br />{c.closing.headline[1]}</h2>
            <div className="t-closing__actions">
              <a className="t-closing__call" href={c.closing.call.href}>{c.closing.call.label}</a>
              <a className="t-closing__book" href="#book" data-form={c.closing.book.form} data-section="treatment-closing">{c.closing.book.label}</a>
            </div>
          </div>
        </section>

        {/* only doctors in this specialty; the block is omitted when the data file has none (placeholder data has one paediatrician) */}
        {team.length > 0 && (
          <section className="t-team band" aria-labelledby="t-team-title">
            <div className="inner"><h2 id="t-team-title" className="t-team__title">Meet the {c.title.toLowerCase()} team</h2></div>
            <Marquee className="t-team__marquee" label={`${c.title} doctors`} items={team} renderItem={(d) => <DoctorCard doctor={d} />} direction="right" speed={30} />
          </section>
        )}
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
