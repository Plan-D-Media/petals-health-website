// Shared lead-form handler for every form on the site (the booking dialog, the treatment and diagnostics side forms,
// Request a Call Back, Ask a Doctor, careers, the SXO agent). One endpoint (config.js FORM_ENDPOINT), one payload
// shape, one set of rules.
//
// Destination (decided 2026-09-17): a Google Apps Script web app (../../apps-script/Code.gs) that appends a row to the
// leads sheet and emails the notification addresses. Apps Script does not answer CORS preflight, so the body is posted
// as text/plain JSON (a "simple" request, no preflight); the script parses e.postData.contents.
//
// The payload (2026-10-30) carries one key per approved sheet column, in column order; the script maps keys to its
// header row, so the sheet's columns are defined once, in the script. Column 1, the IST timestamp, is set by the script
// on receipt (the visitor's clock is not trusted); clientTime is sent alongside for the log only.
//
// Success means the script said so: a 2xx response whose JSON body is { ok: true }. Anything else is a failure —
// in particular a 200 HTML page (a script deployed with the wrong access shows Google's sign-in page) must never
// count as a delivered lead.
//
// Never lose a submission silently: a failed POST keeps the data in the form, shows an error with retry and the phone
// number, and queues the payload in localStorage; queued payloads are re-sent on the next page load (flushQueue). Every
// payload carries a submission id made here, and the script skips an id it has already written, so a retry can never
// add a second row. A rejection the script marks permanent (invalid data) is shown, not queued.
import { FORM_ENDPOINT, STAGING } from '../config.js'
import { byId } from '../data/doctors.js'
import { attribution } from './attribution.js'

const QUEUE_KEY = 'petals.leads.pending'
const QUEUE_MAX_AGE = 7 * 24 * 3600 * 1000           // a queued lead older than a week is stale for a callback; dropped
export const LEAD_KEY = 'petals.lead.last'           // the thank-you page's record of the submission it confirms
// test hook: ?leadEndpoint=<url> overrides the endpoint for the session (used by tools/form-demo.mjs to exercise the error path)
const endpointOverride = () => (typeof location !== 'undefined' ? new URLSearchParams(location.search).get('leadEndpoint') : null)
const endpoint = () => (STAGING ? 'https://script.google.com/macros/s/PLACEHOLDER/exec' : (endpointOverride() || FORM_ENDPOINT))   // staging can never post to a real inbox or sheet
export const isPlaceholderEndpoint = () => !endpoint() || /PLACEHOLDER/.test(endpoint())

// ---- validation ----
const MOBILE_RE = /^(?:\+?91[\s-]?|0)?[6-9]\d{9}$/           // Indian mobile: 10 digits starting 6–9, optional +91 / 0
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export function normaliseMobile(v) { return String(v || '').replace(/[\s-]/g, '').replace(/^(?:\+?91|0)(?=[6-9]\d{9}$)/, '') }
export function validate(values, fields) {
  const errors = {}
  const need = (k) => fields.includes(k)
  if (need('name') && String(values.name || '').trim().length < 2) errors.name = 'Please enter your name.'
  if (need('mobile') && !MOBILE_RE.test(String(values.mobile || '').replace(/[\s-]/g, ''))) errors.mobile = 'Please enter a 10-digit Indian mobile number.'
  if (need('email') && values.email && !EMAIL_RE.test(String(values.email).trim())) errors.email = 'That email address does not look right.'
  if (need('gender') && !values.gender) errors.gender = 'Please choose one.'
  if (need('department') && !values.department) errors.department = 'Please choose a department.'
  if (need('age') && (values.age === '' || Number.isNaN(Number(values.age)) || Number(values.age) < 0 || Number(values.age) > 120)) errors.age = 'Please enter an age between 0 and 120.'
  if (need('date') && values.date) {
    const d = new Date(values.date + 'T00:00:00'); const today = new Date(); today.setHours(0, 0, 0, 0)
    if (Number.isNaN(d.getTime()) || d < today) errors.date = 'Please pick today or a later date.'
  }
  if (!values.consent) errors.consent = 'We need your consent to contact you about this request.'
  return errors
}

// ---- spam checks: honeypot field ("website") must stay empty; the form must have been open for ≥ 3 s ----
export function spamCheck(values, openedAt) {
  if (values.website) return 'honeypot'
  if (Date.now() - openedAt < 3000) return 'too-fast'
  return null
}

// ---- payload: one key per sheet column (apps-script/Code.gs COLUMNS), in column order ----
export const CONSENT_TEXT = 'I agree to Petals Health storing these details to contact me about this request.'
const newId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`)
export function deviceType() {
  const w = window.innerWidth; const coarse = window.matchMedia?.('(pointer: coarse)').matches
  return w < 768 ? 'mobile' : (w < 1024 || (coarse && w <= 1366)) ? 'tablet' : 'desktop'
}
const pageDepartment = () => document.querySelector('main[data-department]')?.dataset.department || ''   // treatment and diagnostics pages
const doctorLabel = (id) => { const d = id && byId(id); return d ? `${d.name} — ${d.specialty}` : (id || '') }
const clean = (v, max = 2000) => String(v ?? '').trim().slice(0, max)

export function buildPayload(values, source, id = newId()) {
  const a = attribution()
  return {
    // 1 timestamp — set by the script
    name: clean(values.name, 200),                                                   // 2
    mobile: normaliseMobile(values.mobile),                                         // 3
    email: clean(values.email, 200),                                                // 4
    department: clean(values.department || source.department || pageDepartment(), 100),   // 5
    doctor: doctorLabel(values.doctor || source.doctor),                            // 6
    date: clean(values.date, 20),                                                   // 7 preferred date (yyyy-mm-dd)
    gender: clean(values.gender, 20),                                               // 8
    age: clean(values.age, 5),                                                      // 9
    message: clean(values.message),                                                 // 10
    consent: values.consent ? 'Yes' : 'No', consentText: CONSENT_TEXT,             // 11
    form: source.form || '',                                                        // 12
    section: source.section || '',                                                  // 13
    pageUrl: window.location.href.slice(0, 1000),                                   // 14
    pageTitle: document.title.slice(0, 300),                                        // 15
    landingPage: a.landingPage || '',                                               // 16
    referrer: a.referrer || '',                                                     // 17
    utm_source: a.utm_source || '', utm_medium: a.utm_medium || '', utm_campaign: a.utm_campaign || '', utm_term: a.utm_term || '', utm_content: a.utm_content || '',   // 18–22
    gclid: a.gclid || '',                                                           // 23
    fbclid: a.fbclid || '',                                                         // 24
    deviceType: deviceType(),                                                       // 25
    viewport: `${window.innerWidth}×${window.innerHeight}`,                         // 26
    id,                                                                             // 27 submission id
    clientTime: new Date().toISOString(),                                           // log only, not a column
  }
}

// ---- transport ----
class LeadError extends Error { constructor(message, retry = true) { super(message); this.retry = retry } }
export async function postLead(payload, { timeoutMs = 15000 } = {}) {
  const url = endpoint()
  if (isPlaceholderEndpoint()) {
    await new Promise((r) => setTimeout(r, 600))
    console.info('[petals forms] placeholder endpoint — payload that would be sent:', payload)
    return { ok: true, simulated: true }
  }
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), signal: ctrl.signal, redirect: 'follow' })
    if (!res.ok) throw new LeadError(`HTTP ${res.status}`)
    let data
    try { data = await res.json() } catch { throw new LeadError('The form service did not answer as expected') }   // e.g. a sign-in page: not delivered
    if (data?.ok === true) return { ok: true, duplicate: Boolean(data.duplicate) }
    throw new LeadError(data?.error || 'Rejected', data?.retry !== false)
  } catch (e) {
    if (e instanceof LeadError) throw e
    throw new LeadError(e?.name === 'AbortError' ? 'Timed out' : String(e?.message || e))   // network failure or timeout: retry later
  } finally { clearTimeout(t) }
}

// ---- retry queue ----
function readQueue() { try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') } catch { return [] } }
function writeQueue(q) { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)) } catch { /* storage unavailable */ } }
export function dequeue(id) { writeQueue(readQueue().filter((p) => p.id !== id)) }
export function enqueue(payload) { writeQueue([...readQueue().filter((p) => p.id !== payload.id), { ...payload, queuedAt: new Date().toISOString() }]) }
export async function flushQueue() {
  const q = readQueue().filter((p) => Date.now() - Date.parse(p.queuedAt || 0) < QUEUE_MAX_AGE); if (!q.length || isPlaceholderEndpoint()) { writeQueue(q); return 0 }
  const left = []
  for (const p of q) { try { await postLead(p) } catch (e) { if (e.retry !== false) left.push(p) } }   // same id: the script never writes it twice
  writeQueue(left); return q.length - left.length
}

// ---- the thank-you page's record: what was sent, so it can confirm it and fire the conversion exactly once ----
function remember(payload) {
  try { sessionStorage.setItem(LEAD_KEY, JSON.stringify({ id: payload.id, form: payload.form, department: payload.department, doctor: payload.doctor, at: Date.now(), fired: false })) } catch { /* storage unavailable: the page still says thank you, without the event */ }
}

// submit = validate → spam check → post; the caller owns the UI state. Success leaves for /thank-you/.
// retryId: the id of this form's failed attempt — "Try again" re-sends the SAME submission (the queued copy and the
// retry share an id, so at most one row is written), and a success takes it out of the queue.
export async function submitLead(values, fields, source, openedAt, retryId) {
  const errors = validate(values, fields)
  if (Object.keys(errors).length) return { status: 'invalid', errors }
  const spam = spamCheck(values, openedAt)
  if (spam === 'honeypot') return { status: 'success', silent: true }       // bots get a quiet "success" and no conversion
  if (spam === 'too-fast') return { status: 'invalid', errors: { form: 'Please take a moment and try again.' } }
  const payload = buildPayload(values, source, retryId || undefined)
  try {
    const r = await postLead(payload)
    dequeue(payload.id)
    remember(payload)
    return { status: 'success', simulated: r.simulated, id: payload.id }
  } catch (e) {
    if (e.retry === false) { dequeue(payload.id); return { status: 'error', message: 'We could not accept this request. Please check your details, or call 9147405955.', error: String(e.message) } }
    enqueue(payload)
    return { status: 'error', id: payload.id, message: 'We could not send this just now. Your details are kept here — please try again, or call 9147405955.', error: String(e.message) }
  }
}
