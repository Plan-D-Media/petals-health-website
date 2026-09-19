// Layout-shift attribution for one page under the throttled mobile profile: every shift with its time, score, the
// shifted elements and their before → after rects, plus which resource finished within 120 ms before it and
// whether the web font had arrived. Usage: node tools/cls-find.mjs /find-a-doctor/
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const path = process.argv[2] || '/find-a-doctor/'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
const cdp = await p.createCDPSession()
await cdp.send('Network.enable'); await cdp.send('Network.clearBrowserCache'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 })
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
await p.evaluateOnNewDocument(() => {
  window.__shifts = []; window.__fontAt = 0; window.__fcp = 0
  document.fonts.ready.then(() => { window.__fontAt = performance.now() })
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__fcp = e.startTime }).observe({ type: 'paint', buffered: true })
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), src: (e.sources || []).map((s) => { const n = s.node; const d = n ? (n.tagName || '').toLowerCase() + (n.className && typeof n.className === 'string' ? '.' + n.className.split(' ')[0] : '') + ' "' + ((n.textContent || '').trim().slice(0, 24)) + '"' : '?'; const r = (x) => `${Math.round(x.x)},${Math.round(x.y)} ${Math.round(x.width)}×${Math.round(x.height)}`; return `${d}: ${r(s.previousRect)} → ${r(s.currentRect)}` }) }) }).observe({ type: 'layout-shift', buffered: true })
})
await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 })
await new Promise((r) => setTimeout(r, 4000))
const r = await p.evaluate(() => ({ shifts: window.__shifts, fontAt: Math.round(window.__fontAt), fcp: Math.round(window.__fcp), res: performance.getEntriesByType('resource').map((x) => [x.name.split('/').pop(), Math.round(x.responseEnd)]) }))
console.log(`${path}: FCP ${r.fcp} ms, web font ready at ${r.fontAt} ms, total CLS ${r.shifts.reduce((a, s) => a + s.v, 0).toFixed(3)}`)
for (const s of r.shifts) {
  const near = r.res.filter(([, e]) => e <= s.t && e >= s.t - 120).map(([n]) => n)
  console.log(`\n@${s.t} ms  score ${s.v}  ${s.t >= r.fontAt && r.fontAt ? '(after font)' : '(before font)'}  resources finished just before: ${near.join(', ') || 'none'}`)
  for (const x of s.src) console.log('   ' + x)
}
await b.close()
