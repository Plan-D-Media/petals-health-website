import { useEffect, useRef, useState } from 'react'
import LeadForm from './LeadForm.jsx'
import { flushQueue } from '../forms/submit.js'
import './FormDialog.css'

// One modal for every lead form on the page. Any element with data-form="<preset>" (and optional data-doctor,
// data-section) opens it — hero buttons, nav CTA, doctor cards, health-card button, closing band — so no component
// needs its own form state. Native <dialog>: focus is trapped, Escape closes, the backdrop click closes.
// On mount, queued submissions from a previous failed attempt are retried (forms/submit.js flushQueue).
export default function FormDialog() {
  const ref = useRef(null)
  const [req, setReq] = useState(null)   // { form, doctor, section, key }
  const returnFocus = useRef(null)

  useEffect(() => { flushQueue().then((n) => { if (n) console.info(`[petals forms] re-sent ${n} queued submission(s)`) }) }, [])

  useEffect(() => {
    const onClick = (e) => {
      const el = e.target.closest('[data-form]'); if (!el) return
      e.preventDefault()
      returnFocus.current = el
      setReq({ form: el.dataset.form, doctor: el.dataset.doctor || '', section: el.dataset.section || el.closest('section')?.className.split(' ')[0] || '', key: Date.now() })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    const d = ref.current; if (!d) return undefined
    if (req && !d.open) { d.showModal(); requestAnimationFrame(() => d.querySelector('input, select, textarea')?.focus()) }   // showModal focuses the close button; move to the first field
    const onClose = () => { setReq(null); returnFocus.current?.focus?.() }
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [req])

  const close = () => ref.current?.close()
  return (
    <dialog ref={ref} className="fdialog" aria-label="Contact form" onClick={(e) => { if (e.target === ref.current) close() }}>
      {req && (
        <div className="fdialog__panel">
          <button type="button" className="fdialog__close" onClick={close} aria-label="Close">×</button>
          <LeadForm key={req.key} form={req.form} source={{ doctor: req.doctor, section: req.section }} />
        </div>
      )}
    </dialog>
  )
}
