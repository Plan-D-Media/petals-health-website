// Build-time registry: every treatment page with its content (pages.js -> titles, descriptions, sitemap, gate).
// The runtime router uses list.js and loads content on demand.
import { TREATMENT_LIST } from './list.js'
import childCare from './child-care.js'
import pain from './pain-management-rejuvenation.js'
import audiology from './audiology.js'
import yoga from './yoga-wellness.js'
import multi from './multispecialty-clinic.js'
import womens from './womens-care.js'
import dentistry from './dentistry.js'
import aesthetics from './aesthetics.js'
import ivf from './petals-ivf.js'
const CONTENT = { 'child-care': childCare, 'pain-management-rejuvenation': pain, 'audiology': audiology, 'yoga-wellness': yoga, 'multispecialty-clinic': multi, 'womens-care': womens, 'dentistry': dentistry, 'aesthetics': aesthetics, 'petals-ivf': ivf }
export const TREATMENT_PAGES = Object.fromEntries(Object.entries(TREATMENT_LIST).filter(([, p]) => !p.redirect).map(([slug, p]) => [slug, { ...p, content: CONTENT[p.alias || slug] }]))
