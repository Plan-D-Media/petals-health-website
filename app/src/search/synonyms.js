// Search synonyms: a query word → other words it should also match (engine.js; a synonym hit scores 0.9 of a direct one).
// Keys are single normalised words; an alternative may be a phrase ("mental health"), which matches when all its words do.
// Approved 2026-09-24 from the 2026-09-23 proposal, with three removals:
//   - no "bp → blood pressure", no "sugar → diabetes": they map a symptom to a diagnosis, which is not a search alias;
//   - no "centre → cantre": the clinic is indexed under both spellings instead (data/clinics.js `searchAlso`), so the
//     index is never taught the typo.
const to = (alts, ...keys) => Object.fromEntries(keys.map((k) => [k, alts]))

export const SYNONYMS = {
  ...to(['gynaecology'], 'gyno', 'gynae', 'gyne', 'gynecology', 'gynecologist', 'obgyn', 'obstetrician'),
  ...to(['paediatric', 'child'], 'pediatric', 'pediatrician', 'kids', 'children', 'baby'),
  ...to(['dentistry'], 'dental', 'tooth'),
  heart: ['cardiology'],
  urologist: ['urology'],
  infertility: ['fertility'],
  ...to(['pregnancy'], 'pregnant', 'maternity', 'antenatal'),
  ...to(['psychiatry', 'mental health'], 'depression', 'anxiety'),
  ...to(['women'], 'woman', 'ladies'),
  tollyganj: ['tollygunge'],
  ...to(['kankurgachi'], 'kakurgachi', 'kankurgachhi'),
}
