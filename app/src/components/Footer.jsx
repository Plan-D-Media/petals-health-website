import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import './Footer.css'
import { linkOr } from './pending.js'
import { SITES, directionsUrl } from '../data/clinics.js'
import { contactFor } from '../contact.js'

// Shared site footer. Redesign 2026-09-23 (direction A, "stacked tiers"): what a patient needs at the foot of a page
// comes first — call, book, ask (tier 1), then the three clinics with directions (tier 2), then the trust signals —
// the ISO line and the medical disclaimer, set as their own block rather than legal filler (tier 3), then the brand
// statement and two link groups (tier 4), with the policies as a small row beside the copyright (tier 5).
// Content is unchanged from the mock (design/sections5-8-values.md §8): the same 19 links, regrouped — the six mock
// columns held three single-link groups. Links with no page yet render as muted text (pending.js: no href, not
// focusable, no underline) and only live links are underlined, so a dead link never looks clickable.
// Mobile: tiers stack; the two link groups are accordions (closed); the policies stay open as a compact row.

const FOOTER_HREFS = { 'Privacy Policy': '/privacy-policy.html', 'About Us': '/about', 'Our Story': '/about', 'Clinic Guide': '/clinics' }
const GROUPS = [
  { heading: 'About Petals', links: ['About Us', 'Our Story', 'Petal’s App & Community', 'Career', 'Vlogs', 'Contact Us', 'Petals Inner Circle'] },
  { heading: 'Patient Services', links: ['Clinic Guide', 'Know your Tests', 'Health Packages', 'Upload Prescription', 'Polyclinic/Multispecialty OPD'] },
]
const POLICIES = ['Terms of Service', 'Social Media Policy', 'Privacy Policy', 'Grievance Redressal', 'Code of Ethics', 'Mobile Application Privacy Policy', 'Mobile Application Terms of Service']

const FooterLink = ({ label }) => <a {...linkOr(FOOTER_HREFS[label], { className: 'footer__link' })}>{label}</a>

// `region` (contact.js): on the Bangladesh page tier 1 is that clinic's number, named, with no Book / Ask buttons (the
// dialog is Kolkata-only); the three Kolkata clinics stay below as the group's clinics.
export default function Footer({ region } = {}) {
  const contact = contactFor(region)
  const call = <a className="footer__call" href={contact.phone.href}><Icon name="phone" className="footer__call-icon" /><span>{contact.phone.label}</span></a>
  // accordions only on phones: from 768 up both groups are open (a closed <details> hides its content)
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches)
  useEffect(() => { const mq = window.matchMedia('(min-width: 768px)'); const on = (e) => setWide(e.matches); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on) }, [])
  return (
    <footer className="footer band">
      <div className="inner footer__inner">
        {/* tier 1: reach us */}
        <section className="footer__act" aria-labelledby="footer-act">
          <h2 id="footer-act" className="sr-only">{contact.forms ? 'Call or book' : `Call ${contact.name}`}</h2>
          {contact.forms ? (
            <>
              {call}
              <div className="footer__btns">
                <a className="footer__btn footer__btn--book" href="#book" data-form="book-appointment" data-section="footer">Book Appointment</a>
                <a className="footer__btn footer__btn--ask" href="#ask" data-form="ask-doctor" data-section="footer">Ask a Doctor</a>
              </div>
            </>
          ) : (
            <div><p className="footer__region" aria-hidden="true">{contact.name}</p>{call}</div>
          )}
        </section>

        {/* tier 2: where we are */}
        <section className="footer__clinics" aria-labelledby="footer-clinics">
          <h2 id="footer-clinics" className="footer__label"><a href="/clinics">Our clinics</a></h2>
          <ul>
            {SITES.map((s) => (
              <li key={s.id} className="footer__clinic">
                <p className="footer__region">{s.region}</p>
                <h3 className="footer__clinic-name"><a href={`/clinics/#clinic-${s.id}`}>{s.name}</a></h3>
                <p className="footer__addr">{s.address.join(' ')}</p>
                <a className="footer__dir" href={directionsUrl(s)} target="_blank" rel="noopener">Get directions<Icon name="pin" className="footer__dir-icon" /></a>
              </li>
            ))}
          </ul>
        </section>

        {/* tier 3: trust */}
        <div className="footer__trust">
          <div className="footer__iso">
            <p className="footer__iso-head">We are ISO Certified</p>
            <p className="footer__iso-line">ISO Certification - Tollygunge | ISO Certification - Kankurgachi</p>
          </div>
          <p className="footer__disclaimer">*Disclaimer: The information provided on this website is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a healthcare provider for medical concerns.</p>
        </div>

        {/* tier 4: who we are + the link groups */}
        <div className="footer__more">
          <div className="footer__about">
            <p className="footer__about--highlight">Building a Personalised Primary healthcare Platform around Women and their Family&apos;s Because Care for Women is incomplete unless it encompasses care for their Family&apos;s.</p>
            <p>Petals Health is committed to not only providing consistently superior quality Women&apos;s healthcare services but also addressing the day-to-day health care needs of their family&apos;s. To maximise convenience and comfort, Petals Health is an integrated digital model that offers facilities for Specialist Consultations, Diagnostics, Preventive Health Checks , at home Services and e-Pharmacy, all under-one-roof.</p>
          </div>
          <div className="footer__cols">
            {GROUPS.map((g) => (
              <details key={g.heading} className="footer__col" open={wide}>
                <summary className="footer__heading">{g.heading}</summary>
                <ul>{g.links.map((l) => <li key={l}><FooterLink label={l} /></li>)}</ul>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* tier 5: policies and copyright, receding */}
      <div className="footer__bottom band">
        <div className="inner footer__bottom-inner">
          <ul className="footer__policies" aria-label="Policies">{POLICIES.map((l) => <li key={l}><FooterLink label={l} /></li>)}</ul>
          <p className="footer__copy">Copyright 2026 www.petalshealth.in - All Rights Reserved | 1st Floor, VIP Complex, P 30/1, Kankurgachi Rd, Kadapara, Phool Bagan, Kankurgachi, Kolkata, West Bengal 700054</p>
        </div>
      </div>
    </footer>
  )
}
