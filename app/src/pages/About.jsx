import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import ClinicCards from '../components/ClinicCards.jsx'
import Carousel from '../components/Carousel.jsx'
import './About.css'
import Img from '../components/Img.jsx'
import { linkOr } from '../components/pending.js'

// About Us (design/svg/4.svg). Sections in the mock's order: reception photo band · About Petals | Our Story ·
// The problem | The idea · Our Approch | What we offer | The journey so far · Find us (shared clinic cards) ·
// We are Building The Perfect Team + The team at a glance (three placeholder cards) · Want to join our Team?
// Copy verbatim. Logged for the client (design/client-requests.md item 13): "Our Approch"; "infertility specialist
// you go to" (specialists); "docuflencers" as written; the team cards are unnamed placeholders in the design; the
// job-openings and resume links have no destination in the design.
// The mock has no page title; "About Petals" — the first heading — is the page's h1.

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
// PLACEHOLDER team: the design shows three unnamed role cards with a stock illustration. Names and photos are with the client.
const TEAM = [
  { id: 'ceo', role: 'Chief Executive Officer' },
  { id: 'med-admin', role: 'Medical Administrator' },
  { id: 'hr', role: 'Human Resources' },
]

const Para = ({ p }) => typeof p === 'string' ? <p className="about__p">{p}</p> : <p className="about__p">{p.before}<strong>{p.strong}</strong>{p.after}</p>

function TeamCard({ m }) {
  return (
    <article className="team-card" aria-label={m.role}>
      <div className="team-card__photo"><Img src="/assets/about/team-card.jpg" alt="" /><span className="team-card__placeholder" title="Name and photograph are with the client">Placeholder</span></div>
      <h4 className="team-card__role">{m.role}</h4>
    </article>
  )
}

export default function About() {
  return (
    <div className="page">
      <Header current="about" />
      <main id="main" tabIndex={-1}>
        <div className="about-hero band" data-hero>
          <Img src="/assets/about/reception.jpg" alt="The reception desk at a Petals Health clinic" priority />
        </div>

        <section className="about band" aria-labelledby="about-title">
          <div className="inner about__cols">
            <div className="about__col">
              <h1 id="about-title" className="about__h">About Petals</h1>
              <p className="about__p">{ABOUT}</p>
            </div>
            <div className="about__col">
              <h2 className="about__h">Our Story</h2>
              {STORY.map((p) => <Para key={p} p={p} />)}
            </div>
            <div className="about__col">
              <h2 className="about__h">The problem</h2>
              <p className="about__p about__p--strong">80% of a Gynaecologist’s consultations are Pregnancy and Infertility related.</p>
              {PROBLEM.map((p, i) => <Para key={i} p={p} />)}
            </div>
            <div className="about__col">
              <h2 className="about__h">The idea</h2>
              {IDEA.map((p) => <Para key={p} p={p} />)}
            </div>
          </div>
        </section>

        <section className="about about--three band" aria-label="Our approach, what we offer and the journey so far">
          <div className="inner about__cols about__cols--three">
            <div className="about__col">
              <h2 className="about__h">Our Approch</h2>
              <ul className="about__pairs">{APPROACH.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}</ul>
            </div>
            <div className="about__col">
              <h2 className="about__h">What we offer</h2>
              {OFFER.map((p) => <Para key={p} p={p} />)}
            </div>
            <div className="about__col">
              <h2 className="about__h">The journey so far</h2>
              {JOURNEY.map((p) => <Para key={p} p={p} />)}
            </div>
          </div>
        </section>

        <ClinicCards />

        <section className="team band" aria-labelledby="team-title">
          <div className="inner">
            <div className="sec-head">
              <h2 id="team-title" className="sec-head__title">We are Building The Perfect Team</h2>
              <p className="sec-head__sub team__intro">{TEAM_INTRO}</p>
              <h3 className="team__sub">The team at a glance</h3>
            </div>
          </div>
          <div className="inner team__carousel-wrap">
            <Carousel items={TEAM} renderItem={(m) => <TeamCard m={m} />} label="The team at a glance" autoplayMs={0} dots={false} className="team__carousel" />
          </div>
          <div className="inner team__join">
            <h3 className="team__join-title">Want to join <span className="team__join-accent">our Team?</span></h3>
            <div className="team__actions">
              <a {...linkOr(null, { className: 'team__btn' })}>View job openings <span aria-hidden="true">→</span></a>
              <a {...linkOr(null, { className: 'team__btn' })}>Submit your resume <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
