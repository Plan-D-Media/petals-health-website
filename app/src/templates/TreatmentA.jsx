import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import Marquee from '../components/Marquee.jsx'
import LeadForm from '../components/LeadForm.jsx'
import Img from '../components/Img.jsx'
import { Arrow } from '../components/Specialists.jsx'
import { teamFor, factsFor, rankServices, askSpan, relatedFor, departmentFor } from './treatmentData.js'
import './treatment.css'
import './TreatmentA.css'

// Template A (Child Care, Pain Management, Audiology, Yoga & Wellness, Multispecialty) — redesign 2026-09-21
// (design/treatment-redesign.md). Section order from the mock, with the team moved up beside the services:
//   hero on a shelf (photo | crumb, tagline?, headline, lead, CTA, verified facts) · intro (optional) · feature block
//   (optional) · ranked service grid on a tint band · flagship band (optional) · team (matching specialists, or the
//   Find a Doctor link) · before your visit (the closing copy + actions | the lead form) · related pages · footer.
// Copy is the content file's; the only page-added strings are UI labels (Start here, Find a doctor, More at Petals Health).

const Pending = ({ title }) => <span className="pending" title={title}>Copy pending</span>

export function ServiceGrid({ services, c, noLead = false, ask = true }) {
  const ranked = rankServices(services, c, { noLead })
  const cards = ranked.filter((s) => s.rank !== 'compact')
  const compact = ranked.filter((s) => s.rank === 'compact')
  const span = askSpan(cards)
  const showAsk = ask && (span.four !== 4 || span.two !== 2)   // only when a row would otherwise be left short
  return (
    <>
      <ol className="ts__grid">
        {cards.map((s, i) => (
          <li key={s.title} className={'tc' + (s.rank === 'lead' ? ' tc--lead' + ((c.leadTone || (c.flagship ? 'light' : 'navy')) === 'light' ? ' tc--light' : '') : '') + (s.href ? ' tc--linked' : '')} data-reveal data-reveal-order={i % 4}>
            <span className="tc__num" aria-hidden="true">{s.rank === 'lead' ? (s.label || 'Start here') : (s.label || c.serviceLabel || String(s.index + 1).padStart(2, '0'))}</span>
            <h3 className="tc__title">{s.title}{s.titlePending && <Pending title="This title is copied from the Pain Management page in the design; the intended title is with the client" />}</h3>
            <p className="tc__text">{s.text}</p>
            {s.rank === 'lead' && !s.href && c.leadNote !== '' && <span className="tc__start" aria-hidden="true">{c.leadNote || 'Where most families begin'}</span>}
            {s.href && <a className="tc__link" href={s.href} aria-label={s.title}></a>}
          </li>
        ))}
        {showAsk && (
          <li className="tc tc--ask" style={{ '--span4': span.four, '--span2': span.two }} aria-label="Not sure where to start?">
            <span className="tc__num" aria-hidden="true">Not sure where to start?</span>
            <p className="tc__text">Tell us what is going on and we will match you to the right doctor and clinic.</p>
            <a className="tc__ask" href="#ask" data-form="ask-doctor" data-section="treatment-grid">Ask a Doctor <Arrow /></a>
          </li>
        )}
      </ol>
      {compact.length > 0 && (
        <ul className="ts__compact" aria-label="More services">
          {compact.map((s) => <li key={s.title} data-reveal><h3>{s.title}</h3><p>{s.text}</p></li>)}
        </ul>
      )}
    </>
  )
}

export function Team({ c }) {
  const team = teamFor(c)
  return (
    <section className="tt tb tb--tint" aria-labelledby="t-team-title">
      <div className="inner">
        <div className="tb__head">
          <p className="tb__eyebrow">Our specialists</p>
          <h2 id="t-team-title" className="tb__title">{team.length ? `Meet the ${c.title.toLowerCase()} team` : 'Find a doctor'}</h2>
        </div>
      </div>
      {team.length > 3 && <Marquee className="tt__marquee" label={`${c.title} doctors`} items={team} renderItem={(d) => <DoctorCard doctor={d} />} direction="right" speed={30} />}
      {team.length > 0 && team.length <= 3 && <div className="inner"><ul className="tt__grid">{team.map((d) => <li key={d.id}><DoctorCard doctor={d} /></li>)}</ul></div>}
      {team.length === 0 && (
        <div className="inner tt__find">
          <p>Search our specialists by name, specialty or clinic, and book directly with the doctor you choose.</p>
          <a className="btn-soft" href="/find-a-doctor">Find a Doctor <Arrow /></a>
        </div>
      )}
      {team.length > 0 && <div className="inner"><div className="tt__more"><a className="btn-soft" href="/find-a-doctor">View all doctors <Arrow /></a></div></div>}
    </section>
  )
}

export function BeforeVisit({ c, headline, call, book }) {
  return (
    <section className="tv tb" aria-labelledby="t-visit-title">
      <div className="inner tv__inner">
        <div className="tv__copy">
          <h2 id="t-visit-title" className="tv__title">{headline[0]}<br />{headline[1]}</h2>
          <div className="tv__actions">
            {call && <a className="tv__call" href={call.href}>{call.label}</a>}
            {book && <a className="tv__book" href="#book" data-form={book.form} data-section="treatment-closing">{book.label}</a>}
          </div>
          <p className="tv__note">Our team confirms by phone or WhatsApp, usually within an hour during clinic hours.</p>
        </div>
        <div className="tv__form" data-reveal>
          <h3 className="tv__form-title">Book a consultation</h3>
          <p className="tv__form-sub">Tell us what you need and we will call you back.</p>
          <LeadForm form="book-consultation-page" source={{ section: 'treatment-form', page: c.slug, department: departmentFor(c) }} autoFocus={false} hideTitle />
        </div>
      </div>
    </section>
  )
}

export function Related({ c }) {
  const rel = relatedFor(c)
  return (
    <section className="tr tb" aria-labelledby="t-related-title">
      <div className="inner"><div className="tr__inner" data-reveal>
        <h2 id="t-related-title" className="tr__title">More at Petals Health</h2>
        <ul className="tr__list">
          {rel.map((r) => <li key={r.slug}><a href={r.href}>{r.title} <Arrow /></a></li>)}
          <li><a className="tr__doctors" href="/find-a-doctor">Find a Doctor <Arrow /></a></li>
        </ul>
      </div></div>
    </section>
  )
}

export function Hero({ c, children }) {
  const h = c.hero
  const tagline = Array.isArray(h.tagline) ? h.tagline : h.tagline ? [h.tagline] : []
  const facts = factsFor(c)
  return (
    <section className={'th tb' + (h.photoSide === 'right' ? ' th--right' : '')} aria-labelledby="t-hero-title">
      <div className="inner th__inner">
        <div className="th__stage" data-overlap-ok>
          <Img src={h.photo.src} alt={h.photo.alt} priority style={{ '--pos': h.photo.position || '50% 30%' }} />
        </div>
        <div className="th__copy">
          <p className="th__crumb"><a href="/">Home</a> <span aria-hidden="true">›</span> Treatments <span aria-hidden="true">›</span> {c.title}</p>
          {tagline.length > 0 && <p className="th__tagline">{tagline.map((l, i) => <span key={i}>{l}{i < tagline.length - 1 && <br />}</span>)}</p>}
          <h1 id="t-hero-title" className="th__title">
            {children || (typeof h.headline[0] === 'string'
              ? h.headline.map((line, i) => <span key={i} className={'th__line ' + ((i === 1 || h.headlineAccent) ? 'th__line--accent' : 'th__line--primary')}>{line}</span>)
              : <span className="th__line">{h.headline.map((part, i) => <span key={i} className={part.accent ? 'th__line--accent' : 'th__line--primary'}>{part.text}</span>)}</span>)}
            {h.headlinePending && <Pending title={h.headlinePending} />}
          </h1>
          {h.subline && <p className={'th__subline' + (h.sublineStrong || c.template === 'B' ? ' th__subline--strong' : '')}>{h.subline}</p>}
          <p className={'th__lead' + (h.leadLarge ? ' th__lead--large' : '')}>{h.lead}{h.leadPending && <Pending title={h.leadPending} />}</p>
          <a className="th__cta" href="#book" data-form={h.cta.form} data-section="treatment-hero">{h.cta.label}</a>
          {facts.length > 0 && <ul className="th__facts" aria-label="Quick facts">{facts.map((f) => <li key={f.label} title={`Source: ${f.source}`}>{f.label}</li>)}</ul>}
          {c.tracks && <ul className="th__tracks" aria-label="Jump to">{c.tracks.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.label}</a></li>)}</ul>}
        </div>
      </div>
    </section>
  )
}

export default function TreatmentA({ content: c }) {
  return (
    <div className="page">
      <Header current={c.slug} />
      <main id="main" tabIndex={-1}>
        <Hero c={c} />

        {c.intro && <section className="ti tb"><div className="inner"><p className="ti__text">{c.intro}</p></div></section>}

        {c.feature && (
          <section className="tf tb" aria-labelledby="t-feature-title">
            <div className="inner tf__inner">
              <div className="tf__photos">{c.feature.photos.map((p) => <Img key={p.src} src={p.src} alt={p.alt} />)}</div>
              <div className="tf__copy">
                <h2 id="t-feature-title" className="tf__title">{c.feature.heading}</h2>
                <ul className="tf__list">{c.feature.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            </div>
          </section>
        )}

        <section className="ts tb tb--tint" aria-labelledby="t-services-title">
          <div className="inner">
            <div className="tb__head">
              <p className="tb__eyebrow">{c.servicesEyebrow || 'What we treat'}</p>
              <h2 id="t-services-title" className="tb__title">{c.servicesTitle || `${c.title} services`}</h2>
            </div>
            <ServiceGrid services={c.services} c={c} />
          </div>
        </section>

        {c.flagship && (
          <section className={'ts ts--flagship tb ' + (c.flagshipTone === 'tint' ? 'tb--tint' : 'tb--navy')} aria-labelledby="t-flagship-title">   {/* the page's one navy band; the lead card above goes light */}
            <div className="inner">
              <div className="tb__head">
                <p className="tb__eyebrow">{c.flagship.eyebrow}</p>
                <h2 id="t-flagship-title" className="tb__title">{c.flagship.heading}</h2>
                <p className="tb__sub">{c.flagship.lead}</p>
              </div>
              <ServiceGrid services={c.flagship.services} c={{ ...c, serviceLabel: null, compactFrom: Infinity }} noLead ask={false} />
            </div>
          </section>
        )}

        <Team c={c} />
        <BeforeVisit c={c} headline={c.closing.headline} call={c.closing.call} book={c.closing.book} />
        <Related c={c} />
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
