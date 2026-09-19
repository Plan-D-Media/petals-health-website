// Mobile-throttled performance on every page: 390 × 844 at DPR 3, 4× CPU, Slow 4G (1.6 Mbps / 150 ms), cold cache.
// Reports LCP, CLS, load event, total transfer, image bytes, largest image, and the LCP element.
// Usage: node tools/perf-all.mjs [runs=1] [pathFilter]
import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SITE_PAGES } from '../src/pages.js'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const runs = Number(process.argv[2] || 1)
const filter = process.argv[3]
const PAGES = SITE_PAGES.map((p) => p.path).filter((p) => !filter || p.includes(filter))
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const kb = (n) => Math.round(n / 1024)
const rows = []
for (const path of PAGES) {
  const samples = []
  for (let i = 0; i < runs; i++) {
    const page = await browser.newPage()
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
    const cdp = await page.createCDPSession()
    const bytes = {}; let seq = 0
    page.on('response', async (r) => { const id = seq++; const t = r.request().resourceType(); try { const buf = await r.buffer(); bytes[id] = { url: r.url(), type: t === 'image' ? 'Image' : t, len: buf.length, at: Date.now() } } catch { /* body gone */ } })
    await cdp.send('Network.enable'); await cdp.send('Network.clearBrowserCache'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await page.evaluateOnNewDocument(() => {
      window.__perf = { lcp: 0, lcpEl: '', lcpSize: 0, cls: 0, shifts: [] }
      new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__perf.lcp = e.startTime; window.__perf.lcpSize = e.size; const el = e.element; window.__perf.lcpEl = el ? el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') + (el.src ? ' ' + el.src.split('/').pop() : '') : '' } }).observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__perf.cls += e.value; if (e.value > 0.01) window.__perf.shifts.push({ v: +e.value.toFixed(3), t: Math.round(e.startTime), src: (e.sources || []).map((s) => s.node ? s.node.tagName?.toLowerCase() + (s.node.className ? '.' + String(s.node.className).split(' ')[0] : '') : '?').slice(0, 3) }) } }).observe({ type: 'layout-shift', buffered: true })
    })
    const t0 = Date.now()
    await page.goto(BASE + path, { waitUntil: 'load', timeout: 120000 })
    const load = Date.now() - t0
    await new Promise((r) => setTimeout(r, 2500))
    const loadAt = Date.now()
    const atLoad = Object.values(bytes).filter((b) => b.len && b.at <= loadAt).reduce((a, b) => a + b.len, 0)
    await page.waitForNetworkIdle({ idleTime: 1000, timeout: 90000 }).catch(() => {})
    const all = Object.values(bytes).filter((b) => b.len)
    const net = { atLoad, full: all.reduce((a, b) => a + b.len, 0), byType: {}, imgs: all.filter((b) => b.type === 'Image').map((b) => [b.url.split('/').pop(), b.len]).sort((a, b) => b[1] - a[1]).slice(0, 5) }
    for (const b of all) net.byType[b.type] = (net.byType[b.type] || 0) + b.len
    const m = await page.evaluate(() => {
      const res = performance.getEntriesByType('resource'); const nav = performance.getEntriesByType('navigation')[0]
      const byType = {}; let biggest = { n: '', b: 0 }
      for (const r of res) { const t = r.initiatorType === 'img' || /\.(png|jpe?g|webp|svg|gif)(\?|$)/.test(r.name) ? 'img' : /\.mp4/.test(r.name) ? 'video' : /\.js/.test(r.name) ? 'js' : /\.css/.test(r.name) ? 'css' : /\.woff2?/.test(r.name) ? 'font' : 'other'; byType[t] = (byType[t] || 0) + (r.transferSize || 0); if ((r.transferSize || 0) > biggest.b) biggest = { n: r.name.split('/').pop(), b: r.transferSize } }
      const total = res.reduce((a, r) => a + (r.transferSize || 0), 0) + (nav.transferSize || 0)
      return { ...window.__perf, total, byType, biggest, imgs: res.filter((r) => /\.(png|jpe?g|webp)(\?|$)/.test(r.name)).map((r) => [r.name.split('/').pop(), r.transferSize]).sort((a, b) => b[1] - a[1]).slice(0, 4), fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0 }
    })
    samples.push({ ...m, load, net })
    await page.close()
  }
  samples.sort((a, b) => a.lcp - b.lcp); const s = samples[Math.floor(samples.length / 2)]
  rows.push({ path, ...s })
  console.log(`${path.padEnd(46)} LCP ${String(Math.round(s.lcp)).padStart(5)}  CLS ${s.cls.toFixed(3)}  load ${String(s.load).padStart(5)}  atLoad ${String(kb(s.net.atLoad)).padStart(4)} kB  full ${String(kb(s.net.full)).padStart(5)} kB  img ${String(kb(s.net.byType.Image || 0)).padStart(5)} kB  top: ${s.net.imgs.slice(0, 3).map(([n, b]) => n + ' ' + kb(b)).join(', ')}  LCP=${s.lcpEl}${s.shifts.length ? '  shifts=' + JSON.stringify(s.shifts.slice(0, 3)) : ''}`)
}
writeFileSync(resolve('../design/render/audit/perf-all.json'), JSON.stringify(rows, null, 1))
await browser.close()
