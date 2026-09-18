import { SITE_URL } from './config.js'
import { metaFor, SITE_NAME } from './pages.js'

// Per-route <title>, description, canonical and Open Graph tags, set once at start-up from pages.js. The static
// fallback pages (public/<path>/index.html) carry the same title so the tab is right before the app boots.
const setMeta = (sel, attrs) => {
  let el = document.head.querySelector(sel)
  if (!el) { el = document.createElement(sel.startsWith('link') ? 'link' : 'meta'); document.head.appendChild(el) }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
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
