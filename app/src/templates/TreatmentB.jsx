import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import Marquee from '../components/Marquee.jsx'
import LeadForm from '../components/LeadForm.jsx'
import { DOCTORS } from '../data/doctors.js'
import './TreatmentA.css'   /* the shared treatment stylesheet: hero, intro, service cards, team */
import './TreatmentB.css'

// Template B — "grouped grids + FAQ + on-page form" (Women's Care, Dentistry, Cosmetic Gynaecology; IVF variant).
// Blocks: hero (tagline?, headline with optional inline accent, subline?, lead, CTA) · intro? · groups[] (head:
// eyebrow/H2/sub + numbered or plain outlined cards, 3 or 4 across, optional link) · risks & safety? (navy + light
// bands with photo and bullets) · FAQ accordion | Book a Consultation form · team marquee · footer.
// Everything comes from the content file.

const Pending = ({ title = 'With the client' }) => <span className="pending" title={title}>Copy pending</span>

function Headline({ lines }) {
  // string[] → one block per line (line 2 accent); {text, accent}[] → inline spans on one line
  if (typeof lines[0] === 'string') return lines.map((l, i) => <span key={i} className={'t-hero__line ' + (i === 1 ? 't-hero__line--accent' : 't-hero__line--primary')}>{l}</span>)
  return <span className="t-hero__line">{lines.map((p, i) => <span key={i} className={p.accent ? 't-hero__accent' : 't-hero__primary'}>{p.text}</span>)}</span>
}

export default function TreatmentB({ content: c }) {
  const team = DOCTORS.filter((d) => d.specialtyId === c.specialtyId)
  const h = c.hero
  return (
    <div className="page">
      <Header current={c.slug} />
      <main>
        <section className="t-hero band" aria-labelledby="t-hero-title">
          <div className="inner t-hero__inner">
            <div className="t-hero__photo" data-overlap-ok>
              <img src={h.photo.src} alt={h.photo.alt} decoding="async" fetchPriority="high" style={{ '--mask': h.photo.mask ? `url(${h.photo.mask})` : 'none', '--pos': h.photo.position || '50% 30%' }} />
            </div>
            <div className="t-hero__copy">
              <p className="t-hero__crumb"><a href="/">Home</a> <span aria-hidden="true">›</span> Treatments <span aria-hidden="true">›</span> {c.title}</p>
              {h.tagline && <p className="t-hero__tagline">{h.tagline}</p>}
              <h1 id="t-hero-title" className="t-hero__title"><Headline lines={h.headline} /></h1>
              {h.subline && <p className="t-hero__subline t-hero__subline--strong">{h.subline}</p>}
              <p className="t-hero__lead">{h.lead}</p>
              <a className="t-hero__cta" href="#book" data-form={h.cta.form} data-section="treatment-hero">{h.cta.label}</a>
            </div>
          </div>
        </section>

        {c.intro && <section className="t-intro band"><div className="inner"><p className="t-intro__text">{c.intro}</p></div></section>}

        {c.groups.map((g, gi) => (
          <section key={gi} className="t-group band" aria-labelledby={`t-group-${gi}`}>
            <div className="inner">
              {g.head && (
                <div className="t-group__head">
                  {g.head.eyebrow && <p className="t-group__eyebrow">{g.head.eyebrow}</p>}
                  <h2 id={`t-group-${gi}`} className="t-group__title">{g.head.title}{g.head.titleAccent && <span className="t-group__accent">{g.head.titleAccent}</span>}</h2>
                  {g.head.sub && <p className="t-group__sub">{g.head.sub}</p>}
                </div>
              )}
              <ol className={`t-services__grid t-services__grid--cards t-services__grid--cols${g.cols || 4}`}>
                {g.cards.map((s, i) => (
                  <li key={s.title} className="t-service" data-reveal data-reveal-order={i % (g.cols || 4)}>
                    {g.numbered && <span className="t-service__num" aria-hidden="true">{i + 1}</span>}
                    <h3 className="t-service__title">{s.title}{s.titlePending && <Pending />}</h3>
                    <p className="t-service__text">{s.text}</p>
                    {g.link && <a className={'t-service__link' + (g.link.accent ? ' t-service__link--accent' : '')} href="#" data-inline-link>{g.link.label} <span aria-hidden="true">→</span></a>}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}

        {c.risks && (
          <section className="t-risks" aria-labelledby="t-risks-title">
            <div className="inner"><h2 id="t-risks-title" className="t-risks__title">{c.risks.title}</h2></div>
            <div className="t-risks__band t-risks__band--navy band"><div className="inner t-risks__inner">
              <div className="t-risks__copy"><h3 className="t-risks__heading">{c.risks.risks.heading}</h3><ul className="t-risks__list">{c.risks.risks.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div>
              <img className="t-risks__photo" src={c.risks.risks.photo.src} alt={c.risks.risks.photo.alt} loading="lazy" decoding="async" />
            </div></div>
            <div className="t-risks__band t-risks__band--light band"><div className="inner t-risks__inner t-risks__inner--photo-first">
              <img className="t-risks__photo" src={c.risks.safety.photo.src} alt={c.risks.safety.photo.alt} loading="lazy" decoding="async" />
              <div className="t-risks__copy"><h3 className="t-risks__heading">{c.risks.safety.heading}</h3><ul className="t-risks__list">{c.risks.safety.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div>
            </div></div>
          </section>
        )}

        {(c.faq || c.form) && (
          <section className="t-faq band" aria-labelledby="t-faq-title">
            <div className="inner t-faq__inner">
              {c.faq && (
                <div className="t-faq__col">
                  <p className="t-faq__eyebrow">{c.faq.eyebrow}</p>
                  <h2 id="t-faq-title" className="t-faq__title">{c.faq.title}</h2>
                  <div className="t-faq__list">
                    {c.faq.items.map((it, i) => (
                      <details key={it.q} className="t-faq__item" open={i === 0}>
                        <summary className="t-faq__q">{it.q}</summary>
                        <div className="t-faq__a">{it.a ? <p>{it.a}</p> : <p className="t-faq__pending"><Pending title="The design shows this question closed and carries no answer for it" /> The answer to this question is with the client.</p>}</div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
              {c.form && (
                <aside className="t-form" aria-label={c.form.title}>
                  <div className="t-form__head">{c.form.title}</div>
                  <div className="t-form__body"><LeadForm form={c.form.preset} source={{ section: 'treatment-form', page: c.slug }} autoFocus={false} hideTitle /></div>
                </aside>
              )}
            </div>
          </section>
        )}

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
