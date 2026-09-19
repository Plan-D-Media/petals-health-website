// Runs after `vite build`. For every page in src/pages.js it writes dist/<path>/index.html — the built index.html
// with that page's title, description, canonical and Open Graph tags, a preload for its LCP image(s), and
// modulepreload + stylesheet links for the route's lazy chunks (from dist/.vite/manifest.json) so a direct load pays
// no extra round trips. Static hosts serve these files as-is; hosts with SPA rewrites still prefer an existing file.
// Also: dist/404.html (the not-found page, noindex), dist/sitemap.xml, dist/robots.txt.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { SITE_PAGES, SITE_NAME, NOT_FOUND, ALIASES } from '../src/pages.js'
import { SITE_URL } from '../src/config.js'
import IMAGES from '../src/generated/images.json' with { type: 'json' }

const ROOT = resolve(import.meta.dirname, '..')
const DIST = resolve(ROOT, 'dist')
const base = SITE_URL.replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
// the pristine Vite output is kept in .vite/ so postbuild can be re-run without stacking Home's meta into every page
const TEMPLATE = resolve(DIST, '.vite', 'index.template.html')
if (!existsSync(TEMPLATE)) writeFileSync(TEMPLATE, readFileSync(resolve(DIST, 'index.html')))
const index = readFileSync(TEMPLATE, 'utf8')
const manifest = JSON.parse(readFileSync(resolve(DIST, '.vite', 'manifest.json'), 'utf8'))

// every chunk (js + css) a set of source files pulls in, transitively
function chunksFor(sources) {
  const js = new Set(), css = new Set()
  const walk = (key) => { const m = manifest[key]; if (!m || js.has(m.file)) return; js.add(m.file); for (const c of m.css || []) css.add(c); for (const i of m.imports || []) walk(i) }
  for (const s of sources) walk(s)
  return { js: [...js], css: [...css] }
}
const entryJs = new Set(chunksFor(['index.html']).js)   // already in index.html as <script>/<link>
const entryCss = new Set(chunksFor(['index.html']).css)

function pageHtml(p, { notFound = false } = {}) {
  const url = base + (notFound ? '/' : p.path)
  const { js, css } = chunksFor(p.chunks || [])
  const head = [
    `<meta name="description" content="${esc(p.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:type" content="website" />`,
    notFound ? '<meta name="robots" content="noindex" />' : '',
    // LCP preloads mirror <Img>: phones get the 800 px "-m" variant, everything else the full file (media-split so only one is fetched)
    ...(p.lcp || []).flatMap((src) => {
      const key = src.replace(/\.webp$/, '.png'); const meta = IMAGES[key] || IMAGES[src.replace(/\.webp$/, '.jpg')]
      if (!meta?.m) return [`<link rel="preload" as="image" href="${src}" type="image/webp" fetchpriority="high" />`]
      return [`<link rel="preload" as="image" href="${src.replace(/\.webp$/, '-m.webp')}" type="image/webp" media="(max-width: 767px)" fetchpriority="high" />`,
              `<link rel="preload" as="image" href="${src}" type="image/webp" media="(min-width: 768px)" fetchpriority="high" />`]
    }),
    ...css.filter((c) => !entryCss.has(c)).map((c) => `<link rel="stylesheet" href="/${c}" />`),
    ...js.filter((j) => !entryJs.has(j)).map((j) => `<link rel="modulepreload" crossorigin href="/${j}" />`),
  ].filter(Boolean).join('\n    ')
  return index
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/\s*<meta name="description" content="[^"]*" \/>/, '')
    .replace('</head>', `    ${head}\n  </head>`)
}

let n = 0
for (const p of SITE_PAGES) {
  const dir = resolve(DIST, '.' + p.path); mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), pageHtml(p)); n++
}
writeFileSync(resolve(DIST, '404.html'), pageHtml(NOT_FOUND, { notFound: true }))
// alias routes (e.g. /treatments/fertility-care/ → /treatments/petals-ivf/): an instant redirect page with a canonical link
for (const [from, to] of Object.entries(ALIASES)) {
  const dir = resolve(DIST, '.' + from); mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${base}${to}"><title>Redirecting…</title></head><body><a href="${to}">Continue</a></body></html>`)
}

const urls = SITE_PAGES.map((p) => `  <url><loc>${base}${p.path}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority.toFixed(1)}</priority></url>`).join('\n')
writeFileSync(resolve(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
writeFileSync(resolve(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /404.html\nSitemap: ${base}/sitemap.xml\n`)
console.log(`postbuild: ${n} route pages, 404.html, sitemap (${SITE_PAGES.length} urls), robots.txt`)
if (!existsSync(resolve(DIST, 'index.html'))) throw new Error('no index.html')
