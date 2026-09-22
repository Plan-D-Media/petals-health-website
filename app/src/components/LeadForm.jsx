import { useEffect, useId, useRef, useState } from 'react'
import { DOCTORS } from '../data/doctors.js'
const DEPARTMENTS = ["Women's Care", 'Child Care', 'Fertility Care', 'Aesthetics', 'Dentistry', 'Multispecialty Clinic', 'Yoga & Wellness', 'Pain Management & Rejuvenation', 'Audiology']
import { PRIVACY_URL } from '../config.js'
import { submitLead, CONSENT_TEXT } from '../forms/submit.js'
import { track } from '../analytics.js'
import './LeadForm.css'

// The one lead form. `fields` picks which inputs appear; `source` says which form/page/section/doctor it came from.
//   fields: any of name, mobile, email, gender, age, doctor, date, message (name + mobile + consent are always required)
// States: idle → submitting → success | error (data intact, retry). Honeypot + timing check in forms/submit.js.
export const FORM_PRESETS = {
  'book-appointment': { title: 'Book an appointment', fields: ['name', 'mobile', 'email', 'doctor', 'date', 'message'], submit: 'Book Appointment', thanks: 'Thank you. Our team will confirm your appointment by phone or WhatsApp, usually within an hour during clinic hours.' },
  'request-callback': { title: 'Request a call back', fields: ['name', 'mobile', 'message'], submit: 'Request a Call Back', thanks: 'Thank you. We will call you back on this number, usually within an hour during clinic hours.' },
  'book-consultation': { title: 'Book a consultation', fields: ['name', 'mobile', 'email', 'doctor', 'date'], submit: 'Book Consultation', thanks: 'Thank you. Our team will confirm your consultation by phone or WhatsApp.' },
  'sxo-agent': { title: 'Tell us how we can help', fields: ['name', 'mobile', 'gender', 'age', 'doctor', 'date'], submit: 'Send', thanks: 'Thank you. A member of our team will be in touch shortly.' },
  'ask-doctor': { title: 'Ask a doctor', fields: ['name', 'mobile', 'message'], submit: 'Ask Doctor', thanks: 'Thank you. A doctor from the right department will get back to you, usually within a working day.' },   // header "Ask a Doctor" and the Find a Doctor "Not sure who to pick?" band
  'careers': { title: 'Ask about job openings', fields: ['name', 'mobile', 'email', 'message'], submit: 'Send enquiry', thanks: 'Thank you. Our team will reply about current openings.' },   // About Us careers block; form: 'careers' in the payload so lead reporting can exclude it
  'book-consultation-page': { title: 'Book a Consultation', fields: ['name', 'mobile', 'email', 'department', 'message'], submit: 'Submit', thanks: 'Thank you. Our team will confirm your consultation by phone or WhatsApp.' },   // the treatment pages' on-page form (mock: Full Name, Email ID, Phone, Select Department, Message)
}

export default function LeadForm({ form = 'book-appointment', source = {}, preset, onSuccess, autoFocus = true, hideTitle = false }) {
  const p = preset || FORM_PRESETS[form]
  const id = useId()
  const [values, setValues] = useState({ name: '', mobile: '', email: '', gender: '', age: '', doctor: source.doctor || '', department: source.department || '', date: '', message: '', consent: false, website: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')   // idle | submitting | success | error
  const [message, setMessage] = useState('')
  const openedAt = useRef(Date.now())
  const firstRef = useRef(null)
  useEffect(() => { if (autoFocus) firstRef.current?.focus() }, [autoFocus])

  const set = (k) => (e) => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setValues((s) => ({ ...s, [k]: v })); if (errors[k]) setErrors((s) => ({ ...s, [k]: undefined })) }
  const has = (k) => p.fields.includes(k)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return                     // no double-send
    setStatus('submitting'); setMessage('')
    const ev = { form, section: source.section || '', doctor: source.doctor || '' }
    track('form_submit', ev)
    const r = await submitLead(values, p.fields, { form, ...source }, openedAt.current)
    if (r.status === 'invalid') { setErrors(r.errors); setStatus('idle'); return }
    if (r.status === 'error') { track('form_error', ev); setStatus('error'); setMessage(r.message); return }
    track('form_success', { ...ev, queued: r.status === 'queued' }); setStatus('success'); onSuccess?.(r)
  }

  if (status === 'success') {
    return (
      <div className="lead lead--done" role="status">
        <h3 className="lead__title">Thank you</h3>
        <p className="lead__thanks">{p.thanks}</p>
        <p className="lead__meta">Need us sooner? Call <a href="tel:9147405955">9147405955</a>.</p>
      </div>
    )
  }

  const err = (k) => errors[k] ? <span className="lead__error" id={`${id}-${k}-err`}>{errors[k]}</span> : null
  const aria = (k) => ({ 'aria-invalid': errors[k] ? true : undefined, 'aria-describedby': errors[k] ? `${id}-${k}-err` : undefined })
  return (
    <form className="lead" onSubmit={onSubmit} noValidate aria-busy={status === 'submitting'}>
      {!hideTitle && <h3 className="lead__title">{p.title}</h3>}
      {has('name') && <label className="lead__field"><span>Full name</span><input ref={firstRef} name="name" autoComplete="name" value={values.name} onChange={set('name')} {...aria('name')} />{err('name')}</label>}
      {has('mobile') && <label className="lead__field"><span>Mobile number</span><input name="mobile" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile" value={values.mobile} onChange={set('mobile')} {...aria('mobile')} />{err('mobile')}</label>}
      {has('email') && <label className="lead__field"><span>Email <em>(optional)</em></span><input name="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} {...aria('email')} />{err('email')}</label>}
      {has('gender') && (
        <fieldset className="lead__field lead__fieldset"><legend>Gender</legend>
          {['Female', 'Male', 'Other'].map((g) => <label key={g} className="lead__radio"><input type="radio" name="gender" value={g} checked={values.gender === g} onChange={set('gender')} />{g}</label>)}
          {err('gender')}
        </fieldset>
      )}
      {has('age') && <label className="lead__field lead__field--short"><span>Age</span><input name="age" type="number" min="0" max="120" inputMode="numeric" value={values.age} onChange={set('age')} {...aria('age')} />{err('age')}</label>}
      {has('doctor') && (
        <label className="lead__field"><span>Preferred doctor <em>(optional)</em></span>
          <select name="doctor" value={values.doctor} onChange={set('doctor')}>
            <option value="">Any available doctor</option>
            {DOCTORS.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
          </select>
        </label>
      )}
      {has('department') && (
        <label className="lead__field"><span>Select Department</span>
          <select name="department" value={values.department} onChange={set('department')} {...aria('department')}>
            <option value="">-please choose an option-</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>{err('department')}
        </label>
      )}
      {has('date') && <label className="lead__field lead__field--short"><span>Preferred date <em>(optional)</em></span><input name="date" type="date" value={values.date} onChange={set('date')} {...aria('date')} />{err('date')}</label>}
      {has('message') && <label className="lead__field"><span>Anything we should know? <em>(optional)</em></span><textarea name="message" rows="3" value={values.message} onChange={set('message')} /></label>}

      {/* honeypot: hidden from people, filled by bots */}
      <label className="lead__hp" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} /></label>

      <label className="lead__consent">
        <input type="checkbox" name="consent" checked={values.consent} onChange={set('consent')} {...aria('consent')} />
        <span>{CONSENT_TEXT} <a href={PRIVACY_URL} target="_blank" rel="noopener">Privacy policy</a></span>
      </label>
      {err('consent')}
      {errors.form && <p className="lead__error lead__error--form" role="alert">{errors.form}</p>}
      {status === 'error' && <p className="lead__error lead__error--form" role="alert">{message}</p>}

      <button type="submit" className="lead__submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? <><span className="lead__spinner" aria-hidden="true" />Sending…</> : (status === 'error' ? 'Try again' : p.submit)}
      </button>
    </form>
  )
}
