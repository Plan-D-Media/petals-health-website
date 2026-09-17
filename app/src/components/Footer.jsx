import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import './Footer.css'

// Shared site footer. Flow rewrite 2026-09-17: about text + six link groups — accordions on mobile (Information open),
// three columns on tablet, six on desktop; copyright band below with bottom padding that clears the mobile action bar.
// Content: design/sections5-8-values.md §8.

const COLUMNS = [
  { heading: 'Information', links: ['About Us', 'Our Story', 'Petal’s App & Community', 'Career', 'Vlogs', 'Contact Us'] },
  { heading: 'At Home Services', links: ['Upload Prescription'] },
  { heading: 'In Clinic', links: ['Polyclinic/Multispecialty OPD'] },
  { heading: 'Patient Connect', links: ['Clinic Guide', 'Know your Tests', 'Health Packages'] },
  { heading: 'Our Partners', links: ['Petals Inner Circle'] },
  { heading: 'Policies', links: ['Terms of Service', 'Social Media Policy', 'Privacy Policy', 'Grievance Redressal', 'Code of Ethics', 'Mobile Application Privacy Policy', 'Mobile Application Terms of Service'] },
]

export default function Footer() {
  // accordions only on mobile: from 768 up every group is open (a closed <details> hides its content)
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches)
  useEffect(() => { const mq = window.matchMedia('(min-width: 768px)'); const on = (e) => setWide(e.matches); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on) }, [])
  return (
    <footer className="footer band">
      <div className="inner footer__inner">
        <div className="footer__about">
          <p>*Disclaimer: The information provided on this website is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a healthcare provider for medical concerns.</p>
          <p className="footer__about--highlight">Building a Personalised Primary healthcare Platform around Women and their Family&apos;s Because Care for Women is incomplete unless it encompasses care for their Family&apos;s.</p>
          <p>Petals Health is committed to not only providing consistently superior quality Women&apos;s healthcare services but also addressing the day-to-day health care needs of their family&apos;s. To maximise convenience and comfort, Petals Health is an integrated digital model that offers facilities for Specialist Consultations, Diagnostics, Preventive Health Checks , at home Services and e-Pharmacy, all under-one-roof.</p>
          <p className="footer__iso">We are ISO Certified</p>
          <p className="footer__iso-line">ISO Certification - Tollygunge | ISO Certification - Kankurgachi</p>
        </div>
        <div className="footer__cols">
          {COLUMNS.map((c, i) => (
            <details key={c.heading} className="footer__col" open={wide || i === 0}>
              <summary className="footer__heading">{c.heading}</summary>
              <ul>
                {c.links.map((l) => <li key={l}><a href={l === 'Privacy Policy' ? '/privacy-policy.html' : '#'}>{l}</a></li>)}
              </ul>
            </details>
          ))}
        </div>
      </div>
      <div className="footer__bottom band">
        <div className="inner footer__bottom-inner">
          <p className="footer__copy">Copyright 2026 www.petalshealth.in - All Rights Reserved | 1st Floor, VIP Complex, P 30/1, Kankurgachi Rd, Kadapara, Phool Bagan, Kankurgachi, Kolkata, West Bengal 700054</p>
          <a className="footer__phone" href="tel:9147405955"><Icon name="phone" className="footer__phone-icon" />9147405955</a>
        </div>
      </div>
    </footer>
  )
}
