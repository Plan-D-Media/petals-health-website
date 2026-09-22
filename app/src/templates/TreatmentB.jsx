import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import LeadForm from '../components/LeadForm.jsx'
import Img from '../components/Img.jsx'
import { Arrow } from '../components/Specialists.jsx'
import { Hero, ServiceGrid, Team, Related } from './TreatmentA.jsx'
import { departmentFor } from './treatmentData.js'
import './treatment.css'
import './TreatmentB.css'

// Template B (Women's Care, Dentistry, Aesthetics) and the Petals IVF variant — redesign 2026-09-21
// (design/treatment-redesign.md). Same shared layer as Template A; the mock's section order:
//   hero on a shelf (+ facts, + track pills on multi-track pages) · intro · [IVF: explained · icon grid · featured ·
//   why-choose · journey · conversation] · groups (tracks: each a band with the ranked grid; a sticky track index on
//   desktop) · risks & safety · before your visit (answered FAQs or the package | the form) · team · related · footer.
// Navy: one band per page — Cosmetic's surgical track, Dentistry's Risks band, IVF's featured band. Cards carry no link
// until a service has `href` (the mock's "Learn more" goes nowhere; design/review-2026-09-19.md item 5).
// FAQ: only answered questions render — an open list up to two, an accordion from three; unanswered items stay in the
// content file with no `a` and appear when the client supplies them.

const Pending = ({ title = 'With the client' }) => <span className="pending" title={title}>Copy pending</span>
const trackLabel = (g, i) => g.trackLabel || (g.head?.eyebrow || `Track ${i + 1}`).replace(/^\d+\s*·?\s*/, '').replace(/\s+/g, ' ').trim()
const realHref = (href) => (href && href !== '#' ? href : null)

function TrackIndex({ tracks }) {
  const [active, setActive] = useState(tracks[0]?.id)
  useEffect(() => {
    const els = tracks.map((t) => document.getElementById(t.id)).filter(Boolean)
    let raf = 0
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const line = 140; let cur = els[0]; for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el; setActive(cur?.id) }) }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [tracks])
  return (
    <nav className="tx" aria-label="Sections on this page">
      <div className="inner tx__inner">
        <ol className="tx__list">{tracks.map((t) => <li key={t.id}><a href={`#${t.id}`} className={t.id === active ? 'is-active' : ''} aria-current={t.id === active ? 'location' : undefined}>{t.label}</a></li>)}</ol>
      </div>
    </nav>
  )
}

function Group({ g, i, c, id }) {
  const tone = g.tone === 'navy' ? 'tb--navy' : g.tone === 'cream' ? 'tb--cream' : i % 2 === 0 ? 'tb--tint' : ''
  const gc = { ...c, compactFrom: Infinity, serviceLabel: null, leadNote: '' }
  return (
    <section id={id} className={`ts tg tb ${tone}`.trim()} aria-labelledby={`${id}-title`}>
      <div className="inner">
        {g.head && (
          <div className="tb__head">
            {g.head.eyebrow && <p className="tb__eyebrow">{g.head.eyebrow}</p>}
            <h2 id={`${id}-title`} className="tb__title">{g.head.title}{g.head.titleAccent && <span className="tb__accent">{g.head.titleAccent}</span>}</h2>
            {g.head.sub && <p className="tb__sub">{g.head.sub}</p>}
          </div>
        )}
        {g.cards && <ServiceGrid services={g.cards} c={gc} noLead={i > 0} ask={i === 0} />}
        {g.subgroups && g.subgroups.map((sg, k) => (
          <div key={sg.heading + k} className="tg__sub">
            <h3 className="tg__sub-heading"><span>{sg.heading}{sg.headingPending && <Pending title="This heading is the divider line from between tracks 01 and 02, repeated here in the design; the intended heading is with the client" />}</span></h3>
            <ServiceGrid services={sg.cards} c={gc} noLead ask={false} />
          </div>
        ))}
      </div>
      {g.divider && <div className="tg__divider"><span>{g.divider}</span></div>}
    </section>
  )
}

function Faq({ faq }) {
  const answered = faq.items.filter((it) => it.a)
  const pending = faq.items.length - answered.length
  if (!answered.length) return null
  return (
    <div className="tq">
      {faq.eyebrow && <p className="tb__eyebrow tq__eyebrow">{faq.eyebrow}</p>}
      <h2 id="t-visit-title" className="tv__title">{faq.title}</h2>
      {answered.length < 3 ? (
        <dl className="tq__list">{answered.map((it) => <div key={it.q} className="tq__item"><dt>{it.q}</dt><dd>{it.a}</dd></div>)}</dl>
      ) : (
        <div className="tq__acc">{answered.map((it, i) => <details key={it.q} className="tq__acc-item" open={i === 0}><summary>{it.q}</summary><p>{it.a}</p></details>)}</div>
      )}
      {pending > 0 && <p className="tq__note">{pending} more {pending === 1 ? 'question is' : 'questions are'} being answered by the clinic and will appear here.</p>}
    </div>
  )
}

export default function TreatmentB({ content: c }) {
  const groups = c.groups || []
  const tracks = groups.length > 1 ? groups.map((g, i) => ({ id: `track-${i + 1}`, label: trackLabel(g, i) })) : null
  const featHref = c.featured && realHref(c.featured.cta.href)
  return (
    <div className="page">
      <Header current={c.slug} />
      <main id="main" tabIndex={-1}>
        <Hero c={{ ...c, tracks }} />

        {c.intro && <section className="ti tb"><div className="inner"><p className="ti__text">{c.intro}</p></div></section>}

        {c.explained && (
          <section className="tx-explained tb" aria-labelledby="t-explained-title">
            <div className="inner tx-explained__inner">
              <div>
                <h2 id="t-explained-title" className="tx-explained__title">{c.explained.heading[0]}<br />{c.explained.heading[1]}</h2>
                {c.explained.paragraphs.map((p) => <p key={p} className="tx-explained__p">{p}</p>)}
              </div>
              <div className="tx-explained__art"><Img src={c.explained.illustration.src} alt={c.explained.illustration.alt} /></div>
            </div>
          </section>
        )}

        {c.iconGrid && (
          <section className="ts tb tb--tint" aria-labelledby="t-icons-title">
            <div className="inner">
              <div className="tb__head">
                <p className="tb__eyebrow">What we offer</p>
                <h2 id="t-icons-title" className="tb__title">{c.iconGrid.ruleHeading}</h2>
                <p className="tb__sub">{c.iconGrid.intro}</p>
              </div>
              <ol className="ts__grid tk__grid">
                {c.iconGrid.tiles.map((t, i) => (
                  <li key={t.title[0]} className={'tc tk' + (t.highlight ? ' tc--lead tk--lead' : '')} data-reveal data-reveal-order={i % 4}>
                    <Img className="tk__icon" src={t.icon} alt="" />
                    {t.highlight && <span className="tc__num" aria-hidden="true">Start here</span>}
                    <h3 className="tc__title">{t.title.map((l, k) => <span key={k}>{l}{k < t.title.length - 1 && <br />}</span>)}</h3>
                    <p className="tc__text">{t.text}</p>
                  </li>
                ))}
                <li className="tc tc--ask tk__cta" aria-label={c.iconGrid.cta.label}>
                  <span className="tc__num" aria-hidden="true">Ready when you are</span>
                  <a className="tc__ask" href="#book" data-form={c.iconGrid.cta.form} data-section="treatment-services">{c.iconGrid.cta.label} <Arrow /></a>
                </li>
              </ol>
            </div>
          </section>
        )}

        {c.featured && (
          <section className="tf-band tb tb--navy" aria-labelledby="t-featured-title">
            <div className="inner">
              <p className="tb__eyebrow tf-band__eyebrow">{c.featured.eyebrow}</p>
              <div className="tf-band__inner">
                <div>
                  <h2 id="t-featured-title" className="tf-band__title">{c.featured.heading}</h2>
                  {c.featured.paragraphs.map((p, i) => typeof p === 'string' ? <p key={i} className="tf-band__p">{p}</p> : <p key={i} className="tf-band__p">{p.text}<strong>{p.strong}</strong>{p.after}</p>)}
                  {featHref
                    ? <a className="tf-band__cta" href={featHref}>{c.featured.cta.label}</a>
                    : <a className="tf-band__cta is-pending" aria-disabled="true" title="This page is not available yet">{c.featured.cta.label}</a>}
                </div>
                <Img className="tf-band__art" src={c.featured.illustration.src} alt={c.featured.illustration.alt} />
              </div>
            </div>
          </section>
        )}

        {c.whyChoose && (
          <section className="tw tb" aria-labelledby="t-why-title">
            <div className="inner">
              <div className="tb__head"><h2 id="t-why-title" className="tb__title">{c.whyChoose.heading}</h2><p className="tb__sub">{c.whyChoose.sub}</p></div>
              <ul className="tw__list">{c.whyChoose.items.map((it, i) => <li key={it.title} data-reveal data-reveal-order={i % 3}><strong>{it.title}</strong><span>{it.text}</span></li>)}</ul>
            </div>
          </section>
        )}

        {c.journey && (
          <section className="tj tb tb--tint" aria-labelledby="t-journey-title">
            <div className="inner">
              <div className="tb__head"><h2 id="t-journey-title" className="tb__title">{c.journey.heading}</h2><p className="tb__sub">{c.journey.sub}</p></div>
              <ol className="tj__steps">
                {c.journey.steps.map((s, i) => (
                  <li key={s.title} className="tj__step" data-reveal data-reveal-order={i}>
                    <span className="tj__ring" aria-hidden="true">{i + 1}</span>
                    <strong className="tj__title">{s.title}</strong>
                    <p className="tj__text">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {c.conversation && (
          <section className="tn tb" aria-labelledby="t-convo-title">
            <div className="inner tn__inner">
              <div>
                <h2 id="t-convo-title" className="tn__title">{c.conversation.heading[0]}<br />{c.conversation.heading[1]}</h2>
                {c.conversation.paragraphs.map((p) => <p key={p} className="tn__p">{p}</p>)}
              </div>
              <div className="tn__actions">
                <a className="tn__primary" href="#book" data-form={c.conversation.primary.form} data-section="treatment-conversation">{c.conversation.primary.label}</a>
                <a className="tn__secondary" href="#callback" data-form={c.conversation.secondary.form} data-section="treatment-conversation">{c.conversation.secondary.label}</a>
              </div>
            </div>
          </section>
        )}

        {groups.length > 0 && (
          <div className="tracks">
            {tracks && <TrackIndex tracks={tracks} />}
            {groups.map((g, i) => <Group key={i} g={g} i={i} c={c} id={`track-${i + 1}`} />)}
          </div>
        )}

        {c.risks && (
          <section className="tr2" aria-labelledby="t-risks-title">
            <div className="inner tb__head"><h2 id="t-risks-title" className="tb__title">{c.risks.title}</h2></div>
            <div className="tr2__band tb tb--navy"><div className="inner tr2__inner">
              <div className="tr2__copy"><h3 className="tr2__heading">{c.risks.risks.heading}</h3><ul className="tr2__list">{c.risks.risks.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div>
              <div className="tr2__photo"><Img src={c.risks.risks.photo.src} alt={c.risks.risks.photo.alt} /></div>
            </div></div>
            <div className="tr2__band tb tb--tint"><div className="inner tr2__inner tr2__inner--photo-first">
              <div className="tr2__photo"><Img src={c.risks.safety.photo.src} alt={c.risks.safety.photo.alt} /></div>
              <div className="tr2__copy"><h3 className="tr2__heading">{c.risks.safety.heading}</h3><ul className="tr2__list">{c.risks.safety.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div>
            </div></div>
          </section>
        )}

        <section className="tv tb" aria-labelledby="t-visit-title">
          <div className="inner tv__inner">
            <div className="tv__copy">
              {c.faq && <Faq faq={c.faq} />}
              {!c.faq && c.package && (
                <div className="tp" data-reveal>
                  <p className="tb__eyebrow tq__eyebrow">Package</p>
                  <h2 id="t-visit-title" className="tv__title">{c.package.title}</h2>
                  <ul className="tp__chips">{c.package.chips.map((ch) => <li key={ch}>{ch}</li>)}</ul>
                  <a className="tp__phone" href={c.package.phone.href}>Call {c.package.phone.label}</a>
                </div>
              )}
              {(!c.faq || !c.faq.items.some((it) => it.a)) && !c.package && <h2 id="t-visit-title" className="tv__title">Book a consultation</h2>}
            </div>
            <div className="tv__form" data-reveal>
              <h3 className="tv__form-title">{c.form?.title || 'Book a consultation'}</h3>
              <p className="tv__form-sub">Tell us what you need and we will call you back.</p>
              <LeadForm form={c.form?.preset || 'book-consultation-page'} source={{ section: 'treatment-form', page: c.slug, department: departmentFor(c) }} autoFocus={false} hideTitle />
            </div>
          </div>
        </section>

        <Team c={c} />
        <Related c={c} />
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
