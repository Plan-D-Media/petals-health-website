import { lazy } from 'react'
import { TREATMENT_LIST, REDIRECTS } from './content/treatments/list.js'
import { byId } from './data/doctors.js'

// Path-based routing without a router dependency: one static build; the per-route HTML files (tools/postbuild.mjs)
// carry each page's title, meta and preloads, and a host with SPA rewrites serves index.html for anything else.
// Every page is a lazy chunk so a visitor downloads only the route they landed on (2026-09-19 page-weight pass).
const App = lazy(() => import('./App.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Clinics = lazy(() => import('./pages/Clinics.jsx'))
const FindDoctor = lazy(() => import('./pages/FindDoctor.jsx'))
const DoctorProfile = lazy(() => import('./pages/DoctorProfile.jsx'))
const Treatment = lazy(() => import('./pages/Treatment.jsx'))
const Bangladesh = lazy(() => import('./pages/Bangladesh.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

export function pageFor(pathname) {
  // older links of the form /?__p=<path> (the pre-2026-09-19 static stubs): honour them once
  const forced = new URLSearchParams(window.location.search).get('__p')
  if (forced && forced !== pathname) { window.history.replaceState(null, '', forced + window.location.hash); pathname = forced }
  const path = pathname.replace(/\/+$/, '') || '/'
  const m = path.match(/^\/treatments\/([a-z0-9-]+)$/)
  if (m && REDIRECTS[m[1]]) { window.location.replace(`/treatments/${REDIRECTS[m[1]]}/` + window.location.search + window.location.hash); return null }   // a moved route (the host 301s first; this covers a host without the rule)
  if (m && TREATMENT_LIST[m[1]]) return <Treatment slug={m[1]} />
  if (path === '/') return <App />
  if (path === '/about') return <About />
  if (path === '/clinics') return <Clinics />
  if (path === '/find-a-doctor') return <FindDoctor />
  if (path === '/petals-clinic-in-bangladesh') return <Bangladesh />   // the old site's URL, kept
  const doc = path.match(/^\/doctors\/([a-z0-9-]+)$/)
  if (doc && byId(doc[1])) return <DoctorProfile doctor={byId(doc[1])} />
  return <NotFound path={path} />
}
