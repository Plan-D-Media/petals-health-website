// The treatment pages: slug → template letter + content file. routes.jsx turns the letter into a component; pages.js
// (sitemap, meta, gate) reads the same list, so a new treatment page is one line here plus its content file.
import childCare from './child-care.js'
import pain from './pain-management-rejuvenation.js'
import audiology from './audiology.js'
import yoga from './yoga-wellness.js'
import multi from './multispecialty-clinic.js'
import womens from './womens-care.js'
import dentistry from './dentistry.js'
import cosmetic from './cosmetic-gynaecology-aesthetics.js'
import ivf from './petals-ivf.js'

export const TREATMENT_PAGES = {
  'child-care': { template: 'A', content: childCare },
  'pain-management-rejuvenation': { template: 'A', content: pain },
  'audiology': { template: 'A', content: audiology },
  'yoga-wellness': { template: 'A', content: yoga },
  'multispecialty-clinic': { template: 'A', content: multi },
  'womens-care': { template: 'B', content: womens },
  'dentistry': { template: 'B', content: dentistry },
  'cosmetic-gynaecology-aesthetics': { template: 'B', content: cosmetic },
  'fertility-care': { template: 'B', content: ivf, alias: 'petals-ivf' },   // the nav's Fertility Care item → the Petals IVF page (canonical: /treatments/petals-ivf)
  'petals-ivf': { template: 'B', content: ivf },
}
