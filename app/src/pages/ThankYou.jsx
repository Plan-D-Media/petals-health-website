import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import { FORM_PRESETS } from '../components/LeadForm.jsx'
import { LEAD_KEY } from '../forms/submit.js'
import { track } from '../analytics.js'
import { CONTACT } from '../contact.js'
import './ThankYou.css'

// Thank-you page (2026-10-30): every successful form lands on /thank-you/ — its own URL (so an ad platform can count a
// page-based conversion), noindex and out of the sitemap (pages.js). The conversion event fires HERE, once per
// submission: forms/submit.js records the submission in sessionStorage on success; this page fires `generate_lead`
// (GA4's lead event; `careers_enquiry` for the careers form, which is not a patient lead) and marks the record fired,
// so a reload, a back-and-forward or a bookmarked visit never counts again. No record — a direct visit, or a bot the
// honeypot caught — no event.
// Copy: the callback promise is the form's own thank-you line (LeadForm FORM_PRESETS), the sentence the visitor would
// have seen in the dialog; nothing new is promised here.
const readLead = () => { try { return JSON.parse(sessionStorage.getItem(LEAD_KEY) || 'null') } catch { return null } }

export default function ThankYou() {
  const [lead] = useState(readLead)
  const form = lead?.form || new URLSearchParams(window.location.search).get('form') || ''
  const promise = (FORM_PRESETS[form]?.thanks || 'Thank you. Our team will call you back, usually within an hour during clinic hours.').replace(/^Thank you\.\s*/, '')
  const phone = CONTACT.kolkata.phone

  useEffect(() => {
    if (!lead || lead.fired) return
    track(lead.form === 'careers' ? 'careers_enquiry' : 'generate_lead', { form: lead.form, department: lead.department || '', doctor: lead.doctor || '', lead_id: lead.id })
    try { sessionStorage.setItem(LEAD_KEY, JSON.stringify({ ...lead, fired: true })) } catch { /* storage unavailable: the event has fired once for this page view */ }
  }, [lead])

  return (
    <div className="page">
      <Header current="thank-you" />
      <main id="main" tabIndex={-1}>
        <section className="tb ty" aria-labelledby="ty-title" data-hero>
          <div className="inner ty__inner">
            <span className="ty__mark" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <h1 id="ty-title" className="ty__title">Thank you</h1>
            <p className="ty__promise">{promise}</p>
            <p className="ty__sooner">Need us sooner? Call <a href={phone.href}>{phone.label}</a>.</p>
            {lead?.id && <p className="ty__ref">Reference: <span>{lead.id.slice(0, 8).toUpperCase()}</span></p>}
            <div className="ty__actions">
              <a className="ty__primary" href="/">Back to Home</a>
              <a className="ty__secondary" href="/find-a-doctor">Find a Doctor</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
