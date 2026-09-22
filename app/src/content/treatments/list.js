// Treatment pages: slug -> template letter. No content imports here, so the runtime router stays small; each
// page's content file is loaded on demand (src/pages/Treatment.jsx). index.js adds the content for the build-time
// registry (pages.js: titles, descriptions, sitemap, gate).
export const TREATMENT_LIST = {
  'child-care': { template: 'A' },
  'pain-management-rejuvenation': { template: 'A' },
  'audiology': { template: 'A' },
  'yoga-wellness': { template: 'A' },
  'multispecialty-clinic': { template: 'A' },
  'womens-care': { template: 'B' },
  'dentistry': { template: 'B' },
  'aesthetics': { template: 'B' },
  'cosmetic-gynaecology-aesthetics': { redirect: 'aesthetics' },   // renamed 2026-09-22 (client): 301 in the hosting config, replace() in the router, a meta-refresh page in the build
  'fertility-care': { template: 'B', alias: 'petals-ivf' },   // alias of the Petals IVF page (canonical: /treatments/petals-ivf); out of the nav since 2026-09-22, the URL keeps working
  'petals-ivf': { template: 'B' },
}
export const contentSlug = (slug) => TREATMENT_LIST[slug]?.alias || slug
/** old slug → new slug for routes that moved (a real redirect, not an alias that renders) */
export const REDIRECTS = Object.fromEntries(Object.entries(TREATMENT_LIST).filter(([, p]) => p.redirect).map(([from, p]) => [from, p.redirect]))
