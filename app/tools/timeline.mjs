// Throttled-load timeline for one page (390 × 844 DPR 3, 4× CPU, Slow 4G, cold cache): every request with start / end
// relative to navigation start, plus FCP and LCP. Usage: node tools/timeline.mjs /treatments/womens-care/
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const path = process.argv[2] || '/'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
const cdp = await p.createCDPSession()
await cdp.send('Network.enable'); await cdp.send('Network.clearBrowserCache'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 })
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
await p.evaluateOnNewDocument(() => {
  window.__m = { lcp: 0, lcpEl: '', fcp: 0, tasks: [] }
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.tasks.push([Math.round(e.startTime), Math.round(e.duration)]) }).observe({ type: 'longtask', buffered: true })
  new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__m.lcp = e.startTime; const el = e.element; window.__m.lcpEl = el ? el.tagName + '.' + String(el.className).split(' ')[0] + ' ' + (el.currentSrc || '').split('/').pop() : '' } }).observe({ type: 'largest-contentful-paint', buffered: true })
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime }).observe({ type: 'paint', buffered: true })
})
await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 })
await new Promise((r) => setTimeout(r, 2500))
const r = await p.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0]
  const rows = [{ n: 'HTML', s: 0, e: Math.round(nav.responseEnd), b: nav.transferSize, t: 'doc' }]
  for (const x of performance.getEntriesByType('resource')) rows.push({ n: x.name.split('/').pop().slice(0, 40), s: Math.round(x.startTime), e: Math.round(x.responseEnd), b: x.transferSize, t: x.initiatorType })
  return { rows: rows.sort((a, c) => a.s - c.s), m: window.__m, dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd) }
})
console.log('long tasks (start, ms):', r.m.tasks.map(([s, d]) => `${s}+${d}`).join(' '))
console.log(`${path}  FCP ${Math.round(r.m.fcp)}  LCP ${Math.round(r.m.lcp)} (${r.m.lcpEl})  DCL ${r.dcl}  load ${r.load}`)
for (const x of r.rows) console.log(`${String(x.s).padStart(5)} → ${String(x.e).padStart(5)}  ${String(Math.round(x.b / 1024)).padStart(4)} kB  ${x.t.padEnd(7)} ${x.n}`)
await b.close()
