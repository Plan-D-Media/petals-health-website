import { GTM_ID, STAGING } from './config.js'

// Analytics hooks. One `track(event, props)` call site for the whole app; events go to window.dataLayer (Google Tag
// Manager's queue) so GA4 / Meta / any tag can be configured in GTM without a code change. With GTM_ID empty
// (today) nothing loads and events are kept in window.__petalsEvents for inspection — the calls still fire.
// Events (all with `page` = pathname):
//   page_view                     on start-up                      { title }
//   page_not_found                404 route                         { path }
//   cta_click                     any [data-form] trigger or tel: link, delegated   { form, section, doctor, label } / { label: 'call' }
//   form_open                     the lead-form dialog opens        { form, section, doctor }
//   form_submit / form_success / form_error                          { form, section, doctor, page }
//   doctor_search                 Find a Doctor state change (debounced 800 ms)     { q, specialties, clinics, avail, langs, rating, sort, page, results }
//   outbound                      Get Direction / external links    { href }
// Consent: GTM loads only after GTM_ID is set; whether a consent banner is needed depends on the tags the client adds
// (logged in design/client-requests.md item 15).

export function track(event, props = {}) {
  const payload = { event, page: window.location.pathname, ts: Date.now(), ...props }
  ;(window.dataLayer = window.dataLayer || []).push(payload)
  if (!GTM_ID) (window.__petalsEvents = window.__petalsEvents || []).push(payload)
}

let inited = false
export function initAnalytics() {
  if (inited) return; inited = true
  window.dataLayer = window.dataLayer || []
  if (GTM_ID && !STAGING) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    const s = document.createElement('script'); s.async = true; s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`
    document.head.appendChild(s)
  }
  track('page_view', { title: document.title })
  // delegated CTA / call / outbound clicks — no per-component wiring needed
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a, button'); if (!a) return
    const form = a.closest('[data-form]')
    if (form) { track('cta_click', { form: form.dataset.form, section: form.dataset.section || form.closest('section')?.className.split(' ')[0] || '', doctor: form.dataset.doctor || '', label: (form.textContent || '').trim().slice(0, 40) }); return }
    const href = a.getAttribute('href') || ''
    if (href.startsWith('tel:')) track('cta_click', { label: 'call', href })
    else if (/^https?:/.test(href) && !href.includes(window.location.host)) track('outbound', { href })
  }, { capture: true })
}
