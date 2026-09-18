// Shared lead-form handler for every form on the site (Book a Consultation on clinic/treatment pages, Request a Call
// Back, the SXO agent). One endpoint (config.js FORM_ENDPOINT), one payload shape, one set of rules.
//
// Destination (decided 2026-09-17): a Google Apps Script web app that appends a row to a Google Sheet and sends an
// email notification. Apps Script does not answer CORS preflight, so the body is posted as text/plain JSON (a "simple"
// request, no preflight); the script parses e.postData.contents. Until the client's URL arrives the endpoint is a
// placeholder and submissions are simulated (resolved after 600 ms and logged), so every state can be exercised.
//
// Never lose a submission silently: a failed POST keeps the data in the form, shows an error with retry, and queues
// the payload in localStorage; queued payloads are retried on the next page load (flushQueue).
import { FORM_ENDPOINT } from '../config.js'

const QUEUE_KEY = 'petals.leads.pending'
// test hook: ?leadEndpoint=<url> overrides the endpoint for the session (used by tools/form-demo.mjs to exercise the error path)
const endpointOverride = () => (typeof location !== 'undefined' ? new URLSearchParams(location.search).get('leadEndpoint') : null)
const endpoint = () => endpointOverride() || FORM_ENDPOINT
export const isPlaceholderEndpoint = () => !endpoint() || /PLACEHOLDER/.test(endpoint())

// ---- validation ----
const MOBILE_RE = /^(?:\+?91[\s-]?|0)?[6-9]\d{9}$/           // Indian mobile: 10 digits starting 6–9, optional +91 / 0
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export function normaliseMobile(v) { return String(v || '').replace(/[\s-]/g, '') }
export function validate(values, fields) {
  const errors = {}
  const need = (k) => fields.includes(k)
  if (need('name') && String(values.name || '').trim().length < 2) errors.name = 'Please enter your name.'
  if (need('mobile') && !MOBILE_RE.test(normaliseMobile(values.mobile))) errors.mobile = 'Please enter a 10-digit Indian mobile number.'
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

// ---- payload ----
export function buildPayload(values, source) {
  const { website, consent, ...fields } = values
  return {
    ...fields,
    mobile: normaliseMobile(fields.mobile),
    consent: Boolean(consent),
    consentText: CONSENT_TEXT,
    source: {                                   // which form, on which page, from which section/doctor
      form: source.form,                        // 'book-appointment' | 'request-callback' | 'sxo-agent' | 'book-consultation'
      page: typeof location !== 'undefined' ? location.pathname : '',
      section: source.section || '',
      doctor: source.doctor || '',
      url: typeof location !== 'undefined' ? location.href : '',
    },
    submittedAt: new Date().toISOString(),
    site: 'petalshealth.in (new build)',
  }
}
export const CONSENT_TEXT = 'I agree to Petals Health storing these details to contact me about this request.'

// ---- transport ----
export async function postLead(payload, { timeoutMs = 12000 } = {}) {
  const url = endpoint()
  if (isPlaceholderEndpoint()) {
    await new Promise((r) => setTimeout(r, 600))
    console.info('[petals forms] placeholder endpoint — payload that would be sent:', payload)
    return { ok: true, simulated: true }
  }
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), signal: ctrl.signal, redirect: 'follow' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    let data = {}; try { data = await res.json() } catch { /* Apps Script may return text; treat 2xx as success */ }
    if (data && data.ok === false) throw new Error(data.error || 'Rejected')
    return { ok: true }
  } finally { clearTimeout(t) }
}

// ---- retry queue ----
function readQueue() { try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') } catch { return [] } }
function writeQueue(q) { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)) } catch { /* storage unavailable */ } }
export function enqueue(payload) { writeQueue([...readQueue(), { ...payload, queuedAt: new Date().toISOString() }]) }
export async function flushQueue() {
  const q = readQueue(); if (!q.length || isPlaceholderEndpoint()) return 0
  const left = []
  for (const p of q) { try { await postLead(p) } catch { left.push(p) } }
  writeQueue(left); return q.length - left.length
}

// submit = validate → spam check → post; the caller owns the UI state
export async function submitLead(values, fields, source, openedAt) {
  const errors = validate(values, fields)
  if (Object.keys(errors).length) return { status: 'invalid', errors }
  const spam = spamCheck(values, openedAt)
  if (spam === 'honeypot') return { status: 'success', silent: true }       // bots get a quiet "success"
  if (spam === 'too-fast') return { status: 'invalid', errors: { form: 'Please take a moment and try again.' } }
  const payload = buildPayload(values, source)
  try {
    const r = await postLead(payload)
    return { status: 'success', simulated: r.simulated }
  } catch (e) {
    enqueue(payload)
    return { status: 'error', message: 'We could not send this just now. Your details are kept here — please try again, or call 9147405955.', error: String(e) }
  }
}
