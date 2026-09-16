import Icon from './Icon.jsx'
import './Footer.css'

// Shared site footer (every page). Values: design/sections5-8-values.md §8.
// Local y = page y − 4440.4 on the Home page. TODO(breakpoints): desktop only.

const COLUMNS = [
  { heading: 'Information', left: 523.1, links: ['About Us', 'Our Story', ['Petal’s App', '& Community'], 'Career', 'Vlogs', 'Contact Us'] },
  { heading: ['At Home', 'Services'], left: 645.3, links: [['Upload', 'Prescription']] },
  { heading: 'In Clinic', left: 761.7, links: [['Polyclinic/', 'Multispecialty', 'OPD']] },
  { heading: ['Patient', 'Connect'], left: 893.3, links: ['Clinic Guide', 'Know your Tests', 'Health Packages'] },
  { heading: 'Our Partners', left: 1035.7, links: ['Petals Inner Circle'] },
  { heading: 'Policies', left: 1190.4, links: ['Terms of Service', 'Social Media Policy', 'Privacy Policy', 'Grievance Redressal', 'Code of Ethics', ['Mobile Application', 'Privacy Policy'], ['Mobile Application', 'Terms of Service']] },
]
const lines = (v) => (Array.isArray(v) ? v.map((l, k) => <span key={k}>{l}{k < v.length - 1 && <br />}</span>) : v)

export default function Footer() {
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

        {COLUMNS.map((c) => (
          <nav key={c.left} className="footer__col" style={{ left: c.left }} aria-label={Array.isArray(c.heading) ? c.heading.join(' ') : c.heading}>
            <h3 className="footer__heading">{lines(c.heading)}</h3>
            <ul>
              {c.links.map((l, k) => <li key={k}><a href="#">{lines(l)}</a></li>)}
            </ul>
          </nav>
        ))}
      </div>

      <div className="footer__bottom band">
        <div className="inner footer__bottom-inner">
          <p className="footer__copy">Copyright 2026 www.petalshealth.in -All Rights Reserved |<br />1st Floor, VIP Complex, P 30/1, Kankurgachi Rd, Kadapara,<br />Phool Bagan, Kankurgachi, Kolkata, West Bengal 700054</p>
          <a className="footer__phone" href="tel:9147405955"><Icon name="phone" className="footer__phone-icon" />9147405955</a>
        </div>
      </div>
    </footer>
  )
}
