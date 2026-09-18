import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import Marquee from '../components/Marquee.jsx'
import { DOCTORS } from '../data/doctors.js'
import './TreatmentA.css'

// Template A — "grid + CTA" treatment page (Child Care, Pain Management, Audiology, Yoga & Wellness, Multispecialty).
// Blocks, top to bottom: hero (masked photo | tagline?, headline, lead, CTA) · intro paragraph (optional) · feature
// block (optional: photo pair + heading + bullets) · service grid (outlined cards or flush tiles; optional flagship
// tile) · flagship block (optional: navy band with its own grid) · closing band (navy or light) · "Meet the team"
// marquee of doctors in the specialty · footer. Everything comes from the content file; the page adds no copy.

const Pending = ({ title }) => <span className="pending" title={title}>Copy pending</span>

function ServiceGrid({ services, style, label, className = '' }) {
  return (
    <ol className={`t-services__grid t-services__grid--${style} ${className}`.trim()}>
      {services.map((s, i) => (
        <li key={s.title} className={'t-service' + (s.flagship ? ' t-service--flagship' : '')} data-reveal data-reveal-order={i % 3}>
          <span className="t-service__num" aria-hidden="true">{s.label || label || i + 1}</span>
          <h3 className="t-service__title">{s.title}{s.titlePending && <Pending title="This title is copied from the Pain Management page in the design; the intended title is with the client" />}</h3>
          <p className="t-service__text">{s.text}</p>
        </li>
      ))}
    </ol>
  )
}

export default function TreatmentA({ content: c }) {
  const team = DOCTORS.filter((d) => d.specialtyId === c.specialtyId)
  const h = c.hero
  const tagline = Array.isArray(h.tagline) ? h.tagline : h.tagline ? [h.tagline] : []
  return (
    <div className="page">
      <Header current={c.slug} />
      <main>
        <section className={'t-hero band' + (h.photoSide === 'right' ? ' t-hero--photo-right' : '')} aria-labelledby="t-hero-title">
          <div className="inner t-hero__inner">
            <div className="t-hero__photo" data-overlap-ok>
              <img src={h.photo.src} alt={h.photo.alt} decoding="async" fetchPriority="high" style={{ '--mask': h.photo.mask ? `url(${h.photo.mask})` : 'none', '--pos': h.photo.position || '50% 30%' }} />
            </div>
            <div className="t-hero__copy">
              <p className="t-hero__crumb"><a href="/">Home</a> <span aria-hidden="true">›</span> Treatments <span aria-hidden="true">›</span> {c.title}</p>
              {tagline.length > 0 && <p className="t-hero__tagline">{tagline.map((l, i) => <span key={i}>{l}{i < tagline.length - 1 && <br />}</span>)}</p>}
              <h1 id="t-hero-title" className="t-hero__title">
                {h.headline.map((line, i) => <span key={i} className={'t-hero__line ' + ((i === 1 || h.headlineAccent) ? 't-hero__line--accent' : 't-hero__line--primary')}>{line}</span>)}
              </h1>
              {h.subline && <p className="t-hero__subline">{h.subline}</p>}
              <p className="t-hero__lead">{h.lead}</p>
              <a className="t-hero__cta" href="#book" data-form={h.cta.form} data-section="treatment-hero">{h.cta.label}</a>
            </div>
          </div>
        </section>

        {c.intro && <section className="t-intro band"><div className="inner"><p className="t-intro__text">{c.intro}</p></div></section>}

        {c.feature && (
          <section className="t-feature band" aria-labelledby="t-feature-title">
            <div className="inner t-feature__inner">
              <div className="t-feature__photos">
                {c.feature.photos.map((p) => <img key={p.src} src={p.src} alt={p.alt} loading="lazy" decoding="async" />)}
              </div>
              <div className="t-feature__copy">
                <h2 id="t-feature-title" className="t-feature__title">{c.feature.heading}</h2>
                <ul className="t-feature__list">{c.feature.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            </div>
          </section>
        )}

        <section className="t-services band" aria-label={`${c.title} services`}>
          <div className="inner"><ServiceGrid services={c.services} style={c.gridStyle || 'cards'} label={c.serviceLabel} /></div>
        </section>

        {c.flagship && (
          <section className="t-flagship band" aria-labelledby="t-flagship-title">
            <div className="inner">
              <p className="t-flagship__eyebrow">{c.flagship.eyebrow}</p>
              <h2 id="t-flagship-title" className="t-flagship__title">{c.flagship.heading}</h2>
              <p className="t-flagship__lead">{c.flagship.lead}</p>
              <ServiceGrid services={c.flagship.services} style="tiles" className="t-flagship__grid" />
            </div>
          </section>
        )}

        <section className={'t-closing band' + (c.closing.style === 'light' ? ' t-closing--light' : '')} aria-label="Book a visit">
          <div className="inner t-closing__inner">
            <h2 className="t-closing__title">{c.closing.headline[0]}<br />{c.closing.headline[1]}</h2>
            <div className="t-closing__actions">
              <a className="t-closing__call" href={c.closing.call.href}>{c.closing.call.label}</a>
              <a className="t-closing__book" href="#book" data-form={c.closing.book.form} data-section="treatment-closing">{c.closing.book.label}</a>
            </div>
          </div>
        </section>

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
