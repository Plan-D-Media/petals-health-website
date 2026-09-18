// Commit gate: builds, serves dist on a private port, runs layout-check on every page listed in PAGES, and exits
// non-zero on any failure. Installed as .git/hooks/pre-commit (tools/install-hooks.sh) so a red run refuses the commit.
// Usage: node tools/gate.mjs            (all pages)
//        node tools/gate.mjs /path      (one page)
import { spawn, spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'

const ROOT = resolve(import.meta.dirname, '..')
const PORT = 4199
import { SITE_PAGES } from '../src/pages.js'
export const PAGES = [...SITE_PAGES.map((p) => p.path), '/no-such-page/']   // every listed page plus the 404 route

const build = spawnSync('npm', ['run', 'build'], { cwd: ROOT, shell: true, stdio: 'pipe', encoding: 'utf8' })
if (build.status !== 0) { console.error(build.stdout, build.stderr); console.error('GATE: build failed'); process.exit(1) }

// tiny static server for dist (no external process to kill)
const DIST = resolve(ROOT, 'dist')
const types = { html: 'text/html', js: 'text/javascript', css: 'text/css', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', woff2: 'font/woff2', mp4: 'video/mp4', json: 'application/json', ico: 'image/x-icon' }
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  let f = resolve(DIST, '.' + p)
  if (existsSync(f) && statSync(f).isDirectory()) f = resolve(f, 'index.html')
  if (!existsSync(f)) f = resolve(DIST, 'index.html')   // SPA fallback
  const ext = f.split('.').pop()
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' })
  res.end(readFileSync(f))
})
await new Promise((r) => server.listen(PORT, '127.0.0.1', r))

const pages = process.argv[2] ? [process.argv[2]] : PAGES
let failed = false
for (const page of pages) {
  console.log(`\n=== layout-check ${page} ===`)
  const r = await new Promise((res) => {
    const c = spawn('node', ['tools/layout-check.mjs', page], { cwd: ROOT, env: { ...process.env, CHECK_BASE: `http://127.0.0.1:${PORT}` }, stdio: 'inherit' })
    c.on('exit', (code) => res(code))
  })
  if (r !== 0) failed = true
}
server.close()
console.log(failed ? '\nGATE: FAILED — commit refused' : '\nGATE: green')
process.exit(failed ? 1 : 0)
