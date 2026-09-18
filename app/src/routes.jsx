import App from './App.jsx'
import TreatmentA from './templates/TreatmentA.jsx'
import TreatmentB from './templates/TreatmentB.jsx'
import { TREATMENT_PAGES } from './content/treatments/index.js'
import About from './pages/About.jsx'
import Clinics from './pages/Clinics.jsx'
import FindDoctor from './pages/FindDoctor.jsx'
import DoctorProfile from './pages/DoctorProfile.jsx'
import NotFound from './pages/NotFound.jsx'
import { byId } from './data/doctors.js'

// Path-based routing without a router dependency: one static build, every path served index.html (SPA fallback on
// the host), the page picked from location.pathname. Treatment pages are template + content file.
const TEMPLATES = { A: TreatmentA, B: TreatmentB }
export const TREATMENTS = Object.fromEntries(Object.entries(TREATMENT_PAGES).map(([slug, p]) => [slug, { template: TEMPLATES[p.template], content: p.content }]))

export function pageFor(pathname) {
  // static hosts without SPA rewrites serve public/<path>/index.html, which redirects to /?__p=<path>; honour it
  const forced = new URLSearchParams(window.location.search).get('__p')
  if (forced && forced !== pathname) { window.history.replaceState(null, '', forced); pathname = forced }
  const path = pathname.replace(/\/+$/, '') || '/'
  const m = path.match(/^\/treatments\/([a-z0-9-]+)$/)
  if (m && TREATMENTS[m[1]]) { const { template: T, content } = TREATMENTS[m[1]]; return <T content={content} /> }
  if (path === '/') return <App />
  if (path === '/about') return <About />
  if (path === '/clinics') return <Clinics />
  if (path === '/find-a-doctor') return <FindDoctor />
  const doc = path.match(/^\/doctors\/([a-z0-9-]+)$/)
  if (doc && byId(doc[1])) return <DoctorProfile doctor={byId(doc[1])} />
  return <NotFound path={path} />
}
