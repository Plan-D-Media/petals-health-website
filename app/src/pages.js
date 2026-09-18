// Every public page with its title and description — the one list behind document <title>/<meta> (seo.js), the
// sitemap and 404 copy (tools/postbuild.mjs) and the commit gate's page set (tools/gate.mjs). Plain ESM so Node can
// import it at build time. Descriptions are drawn from each page's own copy (no new claims); the client can revise
// them — see design/client-requests.md item 15.
import { TREATMENT_PAGES } from './content/treatments/index.js'
import { DOCTORS, clinicsOf } from './data/doctors.js'

export const SITE_NAME = 'Petals Health'
const t = (s) => `${s} — ${SITE_NAME}`

const STATIC = [
  { path: '/', title: 'Petals Health — Your Family Clinic in Kolkata', description: 'Women\'s health, child care, fertility, dentistry, diagnostics and family medicine under one roof at three Petals Health clinics across Kolkata.', priority: 1.0, changefreq: 'weekly' },
  { path: '/about/', title: t('About Us'), description: 'Envisaged as a chain of family clinics, Petals is your community all-in-one family healthcare destination — our story, our approach and the team building it.', priority: 0.7, changefreq: 'monthly' },
  { path: '/clinics/', title: t('Clinic Location'), description: '3 clinics across Kolkata — Kankurgachi, Loudon Street (CMC) and Tollygunge — conveniently located with ample parking, all equipped with the same standard of care.', priority: 0.8, changefreq: 'monthly' },
  { path: '/find-a-doctor/', title: t('Find a Doctor'), description: 'Search our specialists by name, specialty, or clinic. 100+ doctors across three clinics in Kolkata — filter by availability, video consult, language and rating.', priority: 0.9, changefreq: 'weekly' },
]

const treatmentPages = Object.entries(TREATMENT_PAGES).filter(([, p]) => !p.alias).map(([slug, p]) => ({
  path: `/treatments/${slug}/`, title: t(p.content.title),
  description: (p.content.intro || p.content.hero?.lead || p.content.hero?.subline || `${p.content.title} at Petals Health, Kolkata.`).replace(/\s+/g, ' ').slice(0, 160),
  priority: 0.8, changefreq: 'monthly',
}))

const doctorPages = DOCTORS.map((d) => ({
  path: `/doctors/${d.id}/`, title: t(`${d.name}, ${d.specialty}`),
  description: (d.bio || `${d.name} — ${d.specialty} at Petals Health ${clinicsOf(d).map((c) => c.name).join(' and ')}. ${d.videoConsult ? 'Video consult available. ' : ''}Book a visit online.`).slice(0, 160),
  priority: 0.6, changefreq: 'monthly',
}))

export const SITE_PAGES = [...STATIC, ...treatmentPages, ...doctorPages]

/** Meta for a pathname (trailing slash optional); aliases resolve to their canonical page; unknown → the 404 entry. */
export function metaFor(pathname) {
  const path = (pathname.replace(/\/+$/, '') || '') + '/'
  const alias = path.match(/^\/treatments\/([a-z0-9-]+)\/$/)
  const canon = alias && TREATMENT_PAGES[alias[1]]?.alias ? `/treatments/${TREATMENT_PAGES[alias[1]].alias}/` : path
  return SITE_PAGES.find((p) => p.path === canon) || { path, title: t('Page not found'), description: 'The page you were looking for is not here. Find a doctor, our clinics or our treatments from the links on this page.', notFound: true }
}
