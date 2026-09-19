// Page weight from the files actually requested (no throttling): loads each page at 390 and 1366, records every
// request URL, sizes them from dist on disk, and reports totals by type plus the three largest images.
import puppeteer from 'puppeteer-core'
import { statSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { SITE_PAGES } from '../src/pages.js'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const DIST = resolve(import.meta.dirname, '..', 'dist')
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const kb = (n) => Math.round(n / 1024)
const size = (u) => { const p = resolve(DIST, '.' + decodeURIComponent(new URL(u).pathname)); return existsSync(p) && statSync(p).isFile() ? statSync(p).size : 0 }
for (const width of [390, 1366]) {
  console.log(`\n== ${width}`)
  for (const path of SITE_PAGES.map((p) => p.path)) {
    const p = await b.newPage(); await p.setViewport({ width, height: width < 1024 ? 844 : 900, deviceScaleFactor: width < 1024 ? 3 : 1, isMobile: width < 768 })
    const urls = new Set(); p.on('request', (r) => urls.add(r.url()))
    await p.goto(BASE + path, { waitUntil: 'networkidle0' })
    // scroll to the bottom so lazy images load too, then wait
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)) } })
    await p.waitForNetworkIdle({ idleTime: 500 }).catch(() => {})
    const by = { img: 0, js: 0, css: 0, font: 0, video: 0, other: 0 }; const imgs = []
    for (const u of urls) { const s = size(u); const t = /\.(png|jpe?g|webp|svg|gif)$/i.test(u) ? 'img' : /\.js$/.test(u) ? 'js' : /\.css$/.test(u) ? 'css' : /\.woff2?$/.test(u) ? 'font' : /\.mp4$/.test(u) ? 'video' : 'other'; by[t] += s; if (t === 'img') imgs.push([u.split('/').pop(), s]) }
    imgs.sort((a, c) => c[1] - a[1])
    const total = Object.values(by).reduce((a, c) => a + c, 0)
    console.log(`${path.padEnd(46)} total ${String(kb(total)).padStart(5)} kB  img ${String(kb(by.img)).padStart(5)} kB (${imgs.length})  js ${kb(by.js)}  css ${kb(by.css)}  font ${kb(by.font)}  video ${kb(by.video)}  top: ${imgs.slice(0, 3).map(([n, s]) => `${n} ${kb(s)}`).join(', ')}`)
    await p.close()
  }
}
await b.close()
