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
  'cosmetic-gynaecology-aesthetics': { template: 'B' },
  'fertility-care': { template: 'B', alias: 'petals-ivf' },   // the nav's Fertility Care item -> the Petals IVF page (canonical: /treatments/petals-ivf)
  'petals-ivf': { template: 'B' },
}
export const contentSlug = (slug) => TREATMENT_LIST[slug]?.alias || slug
