// Runs after `vite build`: writes dist/sitemap.xml and dist/robots.txt from src/pages.js, copies dist/index.html to
// dist/404.html (static hosts serve it for unknown paths; the router renders the 404 page), and refreshes the
// static fallback pages public/<path>/index.html so every listed page has one (hosts without SPA rewrites).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { SITE_PAGES } from '../src/pages.js'
import { SITE_URL } from '../src/config.js'

const ROOT = resolve(import.meta.dirname, '..')
const DIST = resolve(ROOT, 'dist')
const base = SITE_URL.replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)

const urls = SITE_PAGES.map((p) => `  <url><loc>${base}${p.path}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority.toFixed(1)}</priority></url>`).join('\n')
writeFileSync(resolve(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
writeFileSync(resolve(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /404.html\nSitemap: ${base}/sitemap.xml\n`)
writeFileSync(resolve(DIST, '404.html'), readFileSync(resolve(DIST, 'index.html')))

let made = 0
for (const p of SITE_PAGES) {
  if (p.path === '/') continue
  const dir = resolve(ROOT, 'public', '.' + p.path)
  const html = `<!doctype html><meta http-equiv="refresh" content="0; url=/?__p=${p.path}"><title>${p.title.replace(/&/g, '&amp;')}</title>`
  const file = resolve(dir, 'index.html')
  if (!existsSync(file) || readFileSync(file, 'utf8') !== html) { mkdirSync(dir, { recursive: true }); writeFileSync(file, html); made++ }
  const distFile = resolve(DIST, '.' + p.path, 'index.html'); mkdirSync(resolve(DIST, '.' + p.path), { recursive: true }); writeFileSync(distFile, html)
}
console.log(`postbuild: sitemap ${SITE_PAGES.length} urls, robots.txt, 404.html, ${made} fallback page(s) written`)
