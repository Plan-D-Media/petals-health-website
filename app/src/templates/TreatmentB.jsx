import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import Marquee from '../components/Marquee.jsx'
import LeadForm from '../components/LeadForm.jsx'
import { DOCTORS } from '../data/doctors.js'
import './TreatmentA.css'   /* the shared treatment stylesheet: hero, intro, service cards, team */
import './TreatmentB.css'

// Template B — "grouped grids + FAQ + on-page form" (Women's Care, Dentistry, Cosmetic Gynaecology) and its IVF variant.
// Every block is optional and comes from the content file, rendered in this fixed order:
//   hero · stats strip · intro · explained · groups[] (each: head, cards or subgroups, tone, divider) · icon grid ·
//   featured band · why-choose · journey stepper · risks & safety · conversation band · [faq | package] + form · team
// The page adds no copy of its own.

const Pending = ({ title = 'With the client' }) => <span className="pending" title={title}>Copy pending</span>

function Headline({ lines }) {
  if (typeof lines[0] === 'string') return lines.map((l, i) => <span key={i} className={'t-hero__line ' + (i === 1 ? 't-hero__line--accent' : 't-hero__line--primary')}>{l}</span>)
  return <span className="t-hero__line">{lines.map((p, i) => <span key={i} className={p.accent ? 't-hero__accent' : 't-hero__primary'}>{p.text}</span>)}</span>
}

function Cards({ cards, g, offset = 0 }) {
  return (
    <ol className={`t-services__grid t-services__grid--cards t-services__grid--cols${g.cols || 4}${g.tone ? ' t-services__grid--' + g.tone : ''}`}>
      {cards.map((s, i) => (
        <li key={s.title} className="t-service" data-reveal data-reveal-order={i % (g.cols || 4)}>
          {g.numbered && <span className="t-service__num" aria-hidden="true">{offset + i + 1}</span>}
          {g.labelled && s.label && <span className="t-service__num">{s.label}</span>}
          <h3 className="t-service__title">{s.title}{s.titlePending && <Pending />}</h3>
          <p className="t-service__text">{s.text}</p>
          {g.link && <a className={'t-service__link' + (g.link.accent ? ' t-service__link--accent' : '')} href="#" data-inline-link>{g.link.label} <span aria-hidden="true">→</span></a>}
        </li>
      ))}
    </ol>
  )
}

export default function TreatmentB({ content: c }) {
  const team = DOCTORS.filter((d) => d.specialtyId === c.specialtyId)
  const h = c.hero
  const leftColumn = c.faq || c.package
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
              <p className={'t-hero__lead' + (h.leadLarge ? ' t-hero__lead--large' : '')}>{h.lead}</p>
              <a className="t-hero__cta" href="#book" data-form={h.cta.form} data-section="treatment-hero">{h.cta.label}</a>
            </div>
          </div>
        </section>

        {c.stats && (
          <div className="t-stats band"><div className="inner t-stats__inner">
            {c.stats.map((s, i) => typeof s === 'string' ? <p key={i} className="t-stats__item">{s}</p> : <p key={i} className="t-stats__item"><span className="t-stats__big">{s.big}</span><span className="t-stats__small">{s.small}</span></p>)}
          </div></div>
        )}

        {c.intro && <section className="t-intro band"><div className="inner"><p className="t-intro__text">{c.intro}</p></div></section>}

        {c.explained && (
          <section className="t-explained band" aria-labelledby="t-explained-title">
            <div className="inner t-explained__inner">
              <div>
                <h2 id="t-explained-title" className="t-explained__title">{c.explained.heading[0]}<br />{c.explained.heading[1]}</h2>
                {c.explained.paragraphs.map((p) => <p key={p} className="t-explained__p">{p}</p>)}
              </div>
              <div className="t-explained__art"><img src={c.explained.illustration.src} alt={c.explained.illustration.alt} loading="lazy" decoding="async" style={{ '--mask': c.explained.illustration.mask ? `url(${c.explained.illustration.mask})` : 'none' }} /></div>
            </div>
          </section>
        )}

        {c.groups.map((g, gi) => (
          <section key={gi} className={'t-group band' + (g.tone === 'navy' ? ' t-group--navy' : '')} aria-labelledby={`t-group-${gi}`}>
            <div className="inner">
              {g.head && (
                <div className="t-group__head">
                  {g.head.eyebrow && <p className="t-group__eyebrow">{g.head.eyebrow}</p>}
                  <h2 id={`t-group-${gi}`} className="t-group__title">{g.head.title}{g.head.titleAccent && <span className="t-group__accent">{g.head.titleAccent}</span>}</h2>
                  {g.head.sub && <p className="t-group__sub">{g.head.sub}</p>}
                </div>
              )}
              {g.cards && <Cards cards={g.cards} g={g} />}
              {g.subgroups && g.subgroups.map((sg) => (
                <div key={sg.heading} className="t-subgroup">
                  <h3 className="t-subgroup__heading"><span>{sg.heading}{sg.headingPending && <Pending title="This heading is the divider line from between tracks 01 and 02, repeated here in the design; the intended heading is with the client" />}</span></h3>
                  <Cards cards={sg.cards} g={g} />
                </div>
              ))}
            </div>
            {g.divider && <div className="t-divider"><span>{g.divider}</span></div>}
          </section>
        ))}

        {c.iconGrid && (
          <section className="t-icons band" aria-labelledby="t-icons-title">
            <div className="inner">
              <h2 id="t-icons-title" className="t-rule-heading"><span>{c.iconGrid.ruleHeading}</span></h2>
              <p className="t-icons__intro">{c.iconGrid.intro}</p>
              <ol className="t-icons__grid">
                {c.iconGrid.tiles.map((t, i) => (
                  <li key={t.title[0]} className={'t-tile' + (t.highlight ? ' t-tile--highlight' : '')} data-reveal data-reveal-order={i % 3}>
                    <img className="t-tile__icon" src={t.icon} alt="" loading="lazy" decoding="async" />
                    <h3 className="t-tile__title">{t.title.map((l, k) => <span key={k}>{l}{k < t.title.length - 1 && <br />}</span>)}</h3>
                    <p className="t-tile__text">{t.text}</p>
                  </li>
                ))}
                <li className="t-tile t-tile--cta" aria-label="Book your appointment"><a className="t-tile__cta" href="#book" data-form={c.iconGrid.cta.form} data-section="treatment-services">{c.iconGrid.cta.label}</a></li>
              </ol>
            </div>
          </section>
        )}

        {c.featured && (
          <section className="t-featured band" aria-labelledby="t-featured-title">
            <div className="inner">
              <h2 className="t-rule-heading t-rule-heading--left t-rule-heading--onnavy"><span>{c.featured.eyebrow}</span></h2>
              <div className="t-featured__inner">
                <div>
                  <h3 id="t-featured-title" className="t-featured__title">{c.featured.heading}</h3>
                  {c.featured.paragraphs.map((p, i) => typeof p === 'string' ? <p key={i} className="t-featured__p">{p}</p> : <p key={i} className="t-featured__p">{p.text}<strong>{p.strong}</strong>{p.after}</p>)}
                  <a className="t-featured__cta" href={c.featured.cta.href} data-inline-link>{c.featured.cta.label}</a>
                </div>
                <img className="t-featured__art" src={c.featured.illustration.src} alt={c.featured.illustration.alt} loading="lazy" decoding="async" />
              </div>
            </div>
          </section>
        )}

        {c.whyChoose && (
          <section className="t-why band" aria-labelledby="t-why-title">
            <div className="inner">
              <h2 id="t-why-title" className="t-rule-heading t-rule-heading--left"><span>{c.whyChoose.heading}</span></h2>
              <p className="t-why__sub">{c.whyChoose.sub}</p>
              <ul className="t-why__list">{c.whyChoose.items.map((it) => <li key={it.title}><strong>{it.title}</strong><span>{it.text}</span></li>)}</ul>
            </div>
          </section>
        )}

        {c.journey && (
          <section className="t-journey band" aria-labelledby="t-journey-title">
            <div className="inner">
              <h2 id="t-journey-title" className="t-journey__title">{c.journey.heading}</h2>
              <p className="t-journey__sub">{c.journey.sub}</p>
              <ol className="t-journey__steps">
                {c.journey.steps.map((s, i) => (
                  <li key={s.title} className="t-step" data-reveal data-reveal-order={i}>
                    <span className="t-step__ring" aria-hidden="true">{i + 1}</span>
                    <strong className="t-step__title">{s.title}</strong>
                    <p className="t-step__text">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

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

        {c.conversation && (
          <section className="t-convo band" aria-labelledby="t-convo-title">
            <div className="inner t-convo__inner">
              <div>
                <h2 id="t-convo-title" className="t-convo__title">{c.conversation.heading[0]}<br />{c.conversation.heading[1]}</h2>
                {c.conversation.paragraphs.map((p) => <p key={p} className="t-convo__p">{p}</p>)}
              </div>
              <div className="t-convo__actions">
                <a className="t-convo__primary" href="#book" data-form={c.conversation.primary.form} data-section="treatment-conversation">{c.conversation.primary.label}</a>
                <a className="t-convo__secondary" href="#callback" data-form={c.conversation.secondary.form} data-section="treatment-conversation">{c.conversation.secondary.label}</a>
              </div>
            </div>
          </section>
        )}

        {(leftColumn || c.form) && (
          <section className="t-faq band" aria-labelledby={c.faq ? 't-faq-title' : 't-package-title'}>
            <div className="inner t-faq__inner">
              {c.faq && (
                <div className="t-faq__col">
                  {c.faq.eyebrow && <p className="t-faq__eyebrow">{c.faq.eyebrow}</p>}
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
              {!c.faq && c.package && (
                <div className="t-package" data-reveal>
                  <h2 id="t-package-title" className="t-package__title">{c.package.title}</h2>
                  <ul className="t-package__chips">{c.package.chips.map((ch) => <li key={ch}>{ch}</li>)}</ul>
                  <a className="t-package__phone" href={c.package.phone.href}>{c.package.phone.label}</a>
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
