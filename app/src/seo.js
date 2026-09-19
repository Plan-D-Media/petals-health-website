import { SITE_URL } from './config.js'
import { SITE_META, SITE_NAME, ALIASES, NOT_FOUND } from './generated/site-meta.js'

// Per-route <title>, description, canonical and Open Graph tags. The per-route HTML (tools/postbuild.mjs) already
// carries them for a direct load; this keeps them right when a host serves index.html for every path.
// SITE_META is generated from pages.js by tools/gen-meta.mjs (a small list, so the runtime never imports content).
const setMeta = (sel, attrs) => {
  let el = document.head.querySelector(sel)
  if (!el) { el = document.createElement(sel.startsWith('link') ? 'link' : 'meta'); document.head.appendChild(el) }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
}
export function metaFor(pathname) {
  const path = (pathname.replace(/\/+$/, '') || '') + '/'
  const canon = ALIASES[path] || path
  return SITE_META.find((p) => p.path === canon) || { ...NOT_FOUND, path }
}
export function applyMeta(pathname) {
  const m = metaFor(pathname)
  document.title = m.title
  setMeta('meta[name="description"]', { name: 'description', content: m.description })
  const url = SITE_URL.replace(/\/$/, '') + (m.notFound ? pathname : m.path)
  setMeta('link[rel="canonical"]', { rel: 'canonical', href: url })
  setMeta('meta[property="og:title"]', { property: 'og:title', content: m.title })
  setMeta('meta[property="og:description"]', { property: 'og:description', content: m.description })
  setMeta('meta[property="og:url"]', { property: 'og:url', content: url })
  setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
  setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
  if (m.notFound) setMeta('meta[name="robots"]', { name: 'robots', content: 'noindex' })
  return m
}
