import App from './App.jsx'
import TreatmentA from './templates/TreatmentA.jsx'
import childCare from './content/treatments/child-care.js'

// Path-based routing without a router dependency: one static build, every path served index.html (SPA fallback on
// the host), the page picked from location.pathname. Treatment pages are template + content file.
export const TREATMENTS = { 'child-care': { template: TreatmentA, content: childCare } }

export function pageFor(pathname) {
  // static hosts without SPA rewrites serve public/<path>/index.html, which redirects to /?__p=<path>; honour it
  const forced = new URLSearchParams(window.location.search).get('__p')
  if (forced && forced !== pathname) { window.history.replaceState(null, '', forced); pathname = forced }
  const m = pathname.replace(/\/+$/, '').match(/^\/treatments\/([a-z0-9-]+)$/)
  if (m && TREATMENTS[m[1]]) { const { template: T, content } = TREATMENTS[m[1]]; return <T content={content} /> }
  return <App />
}
