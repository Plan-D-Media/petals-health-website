import { lazy, useEffect, useState } from 'react'
import { TREATMENT_LIST, contentSlug } from '../content/treatments/list.js'

// A treatment page = template + content file, both loaded on demand so the Home route never carries them. The
// per-route HTML (tools/postbuild.mjs) preloads this page's chunks, so on a direct load nothing waits.
const loaders = import.meta.glob('../content/treatments/*.js')
const TEMPLATES = { A: lazy(() => import('../templates/TreatmentA.jsx')), B: lazy(() => import('../templates/TreatmentB.jsx')) }

export default function Treatment({ slug }) {
  const entry = TREATMENT_LIST[slug]
  const [content, setContent] = useState(null)
  useEffect(() => { let on = true; loaders[`../content/treatments/${contentSlug(slug)}.js`]().then((m) => { if (on) setContent(m.default) }); return () => { on = false } }, [slug])
  if (!entry || !content) return null
  const T = TEMPLATES[entry.template]
  return <T content={content} />
}
