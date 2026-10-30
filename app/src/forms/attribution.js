// Attribution for the lead sheet (2026-10-30, approved columns 16–24): where this visit came from, captured on the
// landing page and kept for the browser-tab session (sessionStorage), so a form filled three pages later still
// carries the ad click that brought the visitor.
//   landing page   the first page of the session (path + query)
//   referrer       the outside site that sent the visitor — never our own pages (an in-site referrer says nothing)
//   utm_* · gclid · fbclid   from the landing URL
// A later page in the same session that arrives with its own UTMs or click ids (a second ad click) replaces the set:
// the newest campaign is the one that produced the lead. Storage unavailable (private mode, blocked): the values are
// read from the current URL alone, so a lead still carries whatever the page it was sent from knows.
const KEY = 'petals.attribution'
export const ATTR_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']

function fromLocation() {
  const q = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(ATTR_PARAMS.map((k) => [k, (q.get(k) || '').slice(0, 300)]))
  let referrer = ''
  try { if (document.referrer && new URL(document.referrer).host !== window.location.host) referrer = document.referrer.slice(0, 500) } catch { /* malformed referrer */ }
  return { landingPage: window.location.pathname + window.location.search, referrer, ...params }
}
const read = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || 'null') } catch { return null } }
const write = (v) => { try { sessionStorage.setItem(KEY, JSON.stringify(v)) } catch { /* storage unavailable */ } }

/** call once per page load (main.jsx): keeps the landing set, or replaces it when this URL carries a new campaign */
export function captureAttribution() {
  const now = fromLocation()
  const stored = read()
  const campaign = ATTR_PARAMS.some((k) => now[k])
  if (!stored || campaign) write(now)
}

/** the set to send with a lead */
export function attribution() {
  return read() || fromLocation()
}
