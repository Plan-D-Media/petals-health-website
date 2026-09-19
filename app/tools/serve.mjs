// Preview server for dist, behaving like a production host: serves an existing file first (dist/<route>/index.html),
// otherwise index.html for extension-less paths (SPA rewrite) with a 404 status, and gzips text responses when the
// client accepts it (every CDN does). Usage: node tools/serve.mjs [port]   (default 4173)
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
const DIST = resolve(import.meta.dirname, '..', 'dist')
const PORT = Number(process.argv[2]) || 4173
const types = { html: 'text/html; charset=utf-8', js: 'text/javascript', css: 'text/css', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', svg: 'image/svg+xml', woff2: 'font/woff2', mp4: 'video/mp4', json: 'application/json', ico: 'image/x-icon', xml: 'application/xml', txt: 'text/plain' }
const compressible = new Set(['html', 'js', 'css', 'svg', 'json', 'xml', 'txt'])
createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  let f = resolve(DIST, '.' + p); let status = 200
  if (existsSync(f) && statSync(f).isDirectory()) f = resolve(f, 'index.html')
  if (!existsSync(f)) { f = resolve(DIST, /\.[a-z0-9]+$/i.test(p) ? '__none__' : '404.html'); if (!existsSync(f)) { res.writeHead(404); res.end('not found'); return } status = 404 }
  const ext = f.split('.').pop()
  let body = readFileSync(f)
  const headers = { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' }
  if (compressible.has(ext) && /gzip/.test(req.headers['accept-encoding'] || '')) { body = gzipSync(body); headers['Content-Encoding'] = 'gzip' }
  res.writeHead(status, headers); res.end(body)
}).listen(PORT, '127.0.0.1', () => console.log(`serving ${DIST} on http://127.0.0.1:${PORT}`))
