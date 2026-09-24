// Every public page with its title and description — the one list behind document <title>/<meta> (seo.js), the
// sitemap and 404 copy (tools/postbuild.mjs) and the commit gate's page set (tools/gate.mjs). Plain ESM so Node can
// import it at build time. Descriptions are drawn from each page's own copy (no new claims); the client can revise
// them — see design/client-requests.md item 15.
import { TREATMENT_PAGES } from './content/treatments/index.js'
import { REDIRECTS as TREATMENT_REDIRECTS } from './content/treatments/list.js'
import { DOCTORS, clinicsOf } from './data/doctors.js'

export const SITE_NAME = 'Petals Health'
const t = (s) => `${s} — ${SITE_NAME}`
const webp = (src) => src.replace(/\.(png|jpe?g)$/i, '.webp')

const STATIC = [
  { path: '/', title: 'Petals Health — Your Family Clinic in Kolkata', description: 'Women\'s health, child care, fertility, dentistry, diagnostics and family medicine under one roof at three Petals Health clinics across Kolkata.', priority: 1.0, changefreq: 'weekly', lcp: ['/media/hero-poster-landscape.webp'], chunks: ['src/App.jsx'] },
  { path: '/about/', title: t('About Us'), description: 'Envisaged as a chain of family clinics, Petals is your community all-in-one family healthcare destination — our story, our approach and the team building it.', priority: 0.7, changefreq: 'monthly', lcp: ['/assets/about/reception.webp'], chunks: ['src/pages/About.jsx'] },
  { path: '/clinics/', title: t('Clinic Location'), description: '3 clinics across Kolkata — Kankurgachi, Loudon Street (CMC) and Tollygunge — conveniently located with ample parking, all equipped with the same standard of care.', priority: 0.8, changefreq: 'monthly', lcp: ['/assets/clinics/kankurgachi.webp'], chunks: ['src/pages/Clinics.jsx'] },
  { path: '/find-a-doctor/', title: t('Find a Doctor'), description: 'Search our specialists by name, specialty, or clinic. 100+ doctors across three clinics in Kolkata — filter by specialty, clinic, availability and video consult.', priority: 0.9, changefreq: 'weekly', lcp: ['/assets/doctors/find-hero.webp'], chunks: ['src/pages/FindDoctor.jsx'] },
  { path: '/petals-clinic-in-bangladesh/', title: t('Petals Clinic in Bangladesh'), description: 'Petals Healthcare, Soon in Bangladesh. A New Chapter in Compassionate Care Begins.', priority: 0.5, changefreq: 'monthly', lcp: ['/assets/bangladesh/hero.webp'], chunks: ['src/pages/Bangladesh.jsx'] },   // copy from the client's page (src/content/bangladesh.js)
]

const treatmentPages = Object.entries(TREATMENT_PAGES).filter(([, p]) => !p.alias).map(([slug, p]) => ({
  path: `/treatments/${slug}/`, title: t(p.content.title),
  description: (p.content.intro || p.content.hero?.lead || p.content.hero?.subline || `${p.content.title} at Petals Health, Kolkata.`).replace(/\s+/g, ' ').slice(0, 160),
  priority: 0.8, changefreq: 'monthly',
  lcp: [webp(p.content.hero.photo.src)], chunks: ['src/pages/Treatment.jsx', `src/templates/Treatment${p.template}.jsx`, `src/content/treatments/${slug}.js`],
}))

const doctorPages = DOCTORS.map((d) => ({
  path: `/doctors/${d.id}/`, title: t(`${d.name}, ${d.specialty}`),
  description: (d.bio || `${d.name} — ${d.specialty} at Petals Health ${clinicsOf(d).map((c) => c.name).join(' and ')}. ${d.videoConsult ? 'Video consult available. ' : ''}Book a visit online.`).slice(0, 160),
  priority: 0.6, changefreq: 'monthly',
  lcp: [webp(d.portrait || d.photo), '/assets/doctors/profile-hero-bg.webp'].filter(Boolean), chunks: ['src/pages/DoctorProfile.jsx'],
}))

export const SITE_PAGES = [...STATIC, ...treatmentPages, ...doctorPages]

export const ALIASES = Object.fromEntries(Object.entries(TREATMENT_PAGES).filter(([, p]) => p.alias).map(([slug, p]) => [`/treatments/${slug}/`, `/treatments/${p.alias}/`]))
// moved routes: the old URL 301s at the host (vercel.json redirects) and, for any host without that rule, the build's
// meta-refresh page and the router's replace() both land the visitor on the new URL
export const REDIRECTS = Object.fromEntries(Object.entries(TREATMENT_REDIRECTS).map(([from, to]) => [`/treatments/${from}/`, `/treatments/${to}/`]))
export const NOT_FOUND = { path: '/404.html', title: t('Page not found'), description: 'The page you were looking for is not here. Find a doctor, our clinics or our treatments from the links on this page.', notFound: true, chunks: ['src/pages/NotFound.jsx'] }
