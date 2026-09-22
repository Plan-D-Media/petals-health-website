import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import ClinicCards from '../components/ClinicCards.jsx'
import Img from '../components/Img.jsx'
import { Arrow } from '../components/Specialists.jsx'
import { Related } from '../templates/TreatmentA.jsx'
import { TEAM, hasRealPeople, careersEmail } from '../content/team.js'
import { SITES } from '../data/clinics.js'
import { STAGING } from '../config.js'
import '../templates/treatment.css'
import './About.css'

// About Us (design/svg/4.svg) — redesign 2026-09-21 (design/treatment-redesign.md, "About Us"). The mock's sections in
// the mock's order, on the site's shared language:
//   hero: the whole reception photograph framed beside the copy on the hero tint (option C, 2026-09-22) · Our Story as a
//   centred pull · The problem → The idea as one tint band with a turn and the payoff set apart · Our Approch as
//   numbered cards, What we offer as a checklist, The journey so far as a timeline · Find us (shared clinic cards) ·
//   the team (monogram role tiles until real people; hidden in production while none exist) · Want to join our Team?
//   as a light block · the "More at Petals Health" navy closing panel · footer.
// Copy verbatim. Logged (client-requests.md items 13 and 17): "Our Approch"; "infertility specialist you go to";
// "docuflencers" as written; the unsourced "80%…" and "Recognized among Kolkata's leading providers…" lines, kept as
// plain body text; the careers address. Careers enquiries use the lead form tagged form: 'careers'.

const ABOUT = 'Envisaged as a chain of family clinics, Petals is your community all-in-one family healthcare destination. We not only treat our patients, but we also continually engage with them to promote good practices to build healthy communities.'
const STORY = [
  'Petals Health was built with one clear idea to make healthcare simpler for families. Not just a clinic, but a place where everything connects consultations, diagnostics, treatments, aesthetic care and dentistry.',
  'We don’t just treat conditions. We help you manage your health better, every day.',
]
const PROBLEM = [
  'For decades in India, people’s perception has been that you see a gynaecologist and obstetrician when you are planning to start a family or have conceived naturally. If you fail to conceive there are infertility specialist you go to. But Pregnancy, or infertility, is not the only issue faced by women.',
  'Indian women are not comfortable about discussing “women’s issues” openly due to cultural conditioning. Women choose to suffer in silence and due to lack of awareness, Social taboos and the fear of being judged.',
  { before: 'In the last few years, thanks to social media and a new breed of ', strong: '“docuflencers”', after: ' there has been a burgeoning awareness among the millennials and Gen Z around issues of sexual health, Menstrual Health, Menopause and Chronic Gynaecological issues like PCOS, PID, Endometriosis.' },
  'Today’s Indian Women want to be proactive about their health, rather than suffer in silence, they want to help in managing chronic issues like PCOS, endometriosis etc',
]
const IDEA = [
  'But in spite of the explosion of online information and there are still very few reliable health care platforms that addressed all women’s health issues in one place',
  'Certain women’s issues may require consulting multi-disciplinary experts. Most Women have less time and resources on their hands. Fear of Multiple Visits, extensive and sometimes repetitive and unwanted tests discourage them from seeking help at the right time',
  'They turn to online resources but there is lack of valid medically backed and relevant information online',
  'This is what gave rise to the Idea of Petals Health. We decided to build a single platform where Indian women of all ages can receive consistent and continuous life-long care, and access to primary and secondary health services all in one place.',
]
const APPROACH = [
  ['Proactive, not reactive', 'Focused on early diagnosis and prevention'],
  ['Expert-led care', 'Experienced doctors across specialties'],
  ['Simple & seamless', 'All services under one roof'],
  ['Transparent & reliable', 'Clear guidance at every step'],
  ['Family-first approach', 'Care for every age group'],
]
const OFFER = [
  'A dedicated women-centric healthcare platform providing preventive, primary, secondary, and supportive care for women of all ages.',
  'Access to experienced and certified doctors across multiple specialties under one roof.',
  'Comprehensive healthcare services including doctor consultations, diagnostic tests, report reviews, vaccinations, and family healthcare solutions.',
  'Reliable, accurate, and trustworthy women\'s health information to support informed healthcare decisions.',
  'High-quality diagnostic services through NABL-certified laboratories.',
  'Advanced women’s imaging services led by experienced radiologists and fetal medicine specialists with over 10 years of expertise.',
  'Family healthcare support that empowers women to manage the health needs of their loved ones through family medicine, vaccinations, diagnostics, and year-round healthcare services.',
]
const JOURNEY = [
  'Equipped with advanced imaging technology for excellence in women’s health and fetal medicine.',
  'Trusted antenatal and postnatal care programs delivering exceptional patient satisfaction.',
  'Recognized among Kolkata’s leading providers of women’s health and gynecological care.',
  'Helping women achieve better health outcomes and improved quality of life through expert medical support.',
  'Focused on early detection and screening for women’s health conditions, including breast and cervical cancer.',
  'Building a strong community of women’s health advocates driving awareness and positive change.',
  'Continuously expanding our medical knowledge resources to support women at every stage of life.',
]
const TEAM_INTRO = 'Our passionate and committed team is dedicated to uplift our brand values and create a Modern Primary Care Digital Health Platform for families. With a shared vision, we bring together purpose-driven seasoned professionals and diverse expertise from various healthcare niches. We believe a dynamic team builds a stronger brand.'

const Para = ({ p, className = 'about__p' }) => typeof p === 'string' ? <p className={className}>{p}</p> : <p className={className}>{p.before}<strong>{p.strong}</strong>{p.after}</p>

function TeamTile({ m }) {
  return (
    <li className="tm" data-reveal>
      {m.photo ? <Img className="tm__photo" src={m.photo} alt="" /> : <span className="tm__mono" aria-hidden="true">{m.initials}</span>}
      {m.name && <h3 className="tm__name">{m.name}</h3>}
      <p className="tm__role">{m.role}</p>
      {m.line && <p className="tm__line">{m.line}</p>}
      {!m.name && <p className="tm__pending"><span className="pending" title="With the client">Placeholder</span> Name and photograph to follow</p>}
    </li>
  )
}

export default function About() {
  const showTeam = hasRealPeople || STAGING || import.meta.env.DEV   // production hides the section until a real person exists
  return (
    <div className="page">
      <Header current="about" />
      <main id="main" tabIndex={-1}>
        {/* Hero — option C, approved 2026-09-22 (client item 2 of the third round; the options were ?hero=a|b|c, see
            design/treatment-redesign.md). The whole photograph, uncropped, framed beside the copy on the site's hero
            tint: nothing of the reception desk, the Petals wall or the patients is cut, there is no white void, the
            text never sits on the photo, and the first screen still answers "what is Petals" — h1, lead, Book button
            and the three clinic areas. A real photograph, so it keeps its own frame rather than the treatment pages'
            cut-out-on-the-gradient treatment. */}
        <section className="th tb ah" aria-labelledby="about-title" data-hero>
          <div className="inner th__inner">
            <div className="th__stage ah__stage" data-overlap-ok>
              <Img src="/assets/about/reception.jpg" alt="The reception desk at a Petals Health clinic" priority />
            </div>
            <div className="th__copy">
              <p className="th__crumb"><a href="/">Home</a> <span aria-hidden="true">›</span> About us</p>
              <h1 id="about-title" className="th__title"><span className="th__line th__line--primary">About Petals</span></h1>
              <p className="th__lead ah__lead">{ABOUT}</p>
              <a className="th__cta" href="#book" data-form="book-appointment" data-section="about-hero">Book an appointment</a>
              <ul className="th__facts" aria-label="Our clinics">{SITES.map((s) => <li key={s.id} title="Source: clinics.js">{s.region}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="as tb" aria-labelledby="story-title">
          <div className="inner as__inner">
            <h2 id="story-title" className="tb__eyebrow">Our Story</h2>
            <p className="as__p">{STORY[0]}</p>
            <p className="as__p as__p--pull">{STORY[1]}</p>
          </div>
        </section>

        <section className="an tb tb--tint" aria-label="The problem and the idea">
          <div className="inner an__inner">
            <div className="an__col an__col--problem">
              <h2 className="tb__eyebrow an__eyebrow">The problem</h2>
              <p className="about__p about__p--strong">80% of a Gynaecologist’s consultations are Pregnancy and Infertility related.</p>
              {PROBLEM.map((p, i) => <Para key={i} p={p} />)}
            </div>
            <div className="an__turn" aria-hidden="true"><span /></div>
            <div className="an__col an__col--idea">
              <h2 className="tb__eyebrow an__eyebrow">The idea</h2>
              {IDEA.slice(0, -1).map((p) => <Para key={p} p={p} />)}
            </div>
            <p className="an__payoff" data-reveal>{IDEA[IDEA.length - 1]}</p>
          </div>
        </section>

        <section className="a3 tb" aria-label="Our approach, what we offer and the journey so far">
          <div className="inner">
            <h2 className="tb__eyebrow a3__eyebrow">Our Approch</h2>
            <ol className="a3__approach">
              {APPROACH.map(([t, d], i) => <li key={t} className="a3__card" data-reveal data-reveal-order={i}><span className="a3__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><strong>{t}</strong><span>{d}</span></li>)}
            </ol>
            <div className="a3__pair">
              <div className="a3__offer">
                <h2 className="tb__eyebrow a3__eyebrow">What we offer</h2>
                <ul className="a3__check">{OFFER.map((p) => <li key={p} data-reveal><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{p}</span></li>)}</ul>
              </div>
              <div className="a3__journey">
                <h2 className="tb__eyebrow a3__eyebrow">The journey so far</h2>
                <ol className="a3__timeline">{JOURNEY.map((p) => <li key={p} data-reveal><span>{p}</span></li>)}</ol>
              </div>
            </div>
          </div>
        </section>

        <ClinicCards />

        {showTeam && (
          <section className="at tb" aria-labelledby="team-title">
            <div className="inner">
              <div className="tb__head">
                <h2 id="team-title" className="tb__title">We are Building The Perfect Team</h2>
                <p className="tb__sub">{TEAM_INTRO}</p>
              </div>
              <h3 className="at__sub">The team at a glance</h3>
              <ul className="at__grid">{TEAM.map((m) => <TeamTile key={m.id} m={m} />)}</ul>
            </div>
          </section>
        )}

        <section className="aj tb" aria-labelledby="join-title">
          <div className="inner aj__inner">
            <h2 id="join-title" className="aj__title">Want to join <span className="aj__accent">our Team?</span></h2>
            <div className="aj__actions">
              {careersEmail
                ? <a className="aj__btn" href={`mailto:${careersEmail}?subject=Application%20via%20petalshealth.in`}>Submit your resume <Arrow /></a>
                : <a className="aj__btn is-pending" aria-disabled="true" title="This page is not available yet">Submit your resume <Arrow /></a>}
              <a className="aj__btn" href="#careers" data-form="careers" data-section="about-careers">View job openings <Arrow /></a>
            </div>
          </div>
        </section>

        <Related c={{ slug: 'about', related: ['womens-care', 'child-care', 'multispecialty-clinic'] }} />
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
