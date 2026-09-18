import App from './App.jsx'
import TreatmentA from './templates/TreatmentA.jsx'
import TreatmentB from './templates/TreatmentB.jsx'
import womens from './content/treatments/womens-care.js'
import dentistry from './content/treatments/dentistry.js'
import childCare from './content/treatments/child-care.js'
import pain from './content/treatments/pain-management-rejuvenation.js'
import audiology from './content/treatments/audiology.js'
import yoga from './content/treatments/yoga-wellness.js'
import multi from './content/treatments/multispecialty-clinic.js'

// Path-based routing without a router dependency: one static build, every path served index.html (SPA fallback on
// the host), the page picked from location.pathname. Treatment pages are template + content file.
export const TREATMENTS = {
  'child-care': { template: TreatmentA, content: childCare },
  'pain-management-rejuvenation': { template: TreatmentA, content: pain },
  'audiology': { template: TreatmentA, content: audiology },
  'yoga-wellness': { template: TreatmentA, content: yoga },
  'multispecialty-clinic': { template: TreatmentA, content: multi },
  'womens-care': { template: TreatmentB, content: womens },
  'dentistry': { template: TreatmentB, content: dentistry },
}

export function pageFor(pathname) {
  // static hosts without SPA rewrites serve public/<path>/index.html, which redirects to /?__p=<path>; honour it
  const forced = new URLSearchParams(window.location.search).get('__p')
  if (forced && forced !== pathname) { window.history.replaceState(null, '', forced); pathname = forced }
  const m = pathname.replace(/\/+$/, '').match(/^\/treatments\/([a-z0-9-]+)$/)
  if (m && TREATMENTS[m[1]]) { const { template: T, content } = TREATMENTS[m[1]]; return <T content={content} /> }
  return <App />
}
