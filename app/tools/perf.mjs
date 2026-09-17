// Mobile-class performance probe for the built Home page (dist served on 4173).
// Emulates a mid-tier phone: 4× CPU throttle, "Slow 4G" network, 390 × 844 viewport at DPR 3 (the layout itself is
// desktop-only, so this measures script/paint cost, not responsive layout). Reports LCP, CLS, long-task total
// (a TBT proxy), load timings, JS heap, and long tasks during a scripted scroll through the page (the motion layer's
// cost shows up there). Runs N times and prints the median. Usage: node tools/perf.mjs [label] [runs]
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const label = process.argv[2] || 'run'
const runs = Number(process.argv[3] || 3)
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })

async function once() {
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
  const cdp = await page.createCDPSession()
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await page.evaluateOnNewDocument(() => {
    window.__perf = { lcp: 0, cls: 0, longTasks: 0, longTasksScroll: 0, scrolling: false }
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value }).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { const over = Math.max(0, e.duration - 50); if (window.__perf.scrolling) window.__perf.longTasksScroll += over; else window.__perf.longTasks += over } }).observe({ type: 'longtask', buffered: true })
  })
  const t0 = Date.now()
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load' })
  const load = Date.now() - t0
  await new Promise((r) => setTimeout(r, 1500))
  // scripted scroll: 12 steps to the bottom, 250 ms apart (reveals fire here)
  await page.evaluate(async () => {
    window.__perf.scrolling = true
    const h = document.documentElement.scrollHeight
    for (let i = 1; i <= 12; i++) { window.scrollTo(0, (h * i) / 12); await new Promise((r) => setTimeout(r, 250)) }
    await new Promise((r) => setTimeout(r, 400)); window.__perf.scrolling = false
  })
  const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { dcl: n.domContentLoadedEventEnd, loadEvent: n.loadEventEnd, transfer: performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0) } })
  const m = await page.evaluate(() => window.__perf)
  const heap = (await page.metrics()).JSHeapUsedSize / 1048576
  await page.close()
  return { lcpMs: Math.round(m.lcp), cls: +m.cls.toFixed(4), longTaskMs: Math.round(m.longTasks), scrollLongTaskMs: Math.round(m.longTasksScroll), dclMs: Math.round(nav.dcl), loadMs: Math.round(nav.loadEvent), wallLoadMs: load, transferKB: Math.round(nav.transfer / 1024), heapMB: +heap.toFixed(1) }
}
const results = []
for (let i = 0; i < runs; i++) results.push(await once())
await browser.close()
const median = (k) => { const v = results.map((r) => r[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)] }
const keys = Object.keys(results[0])
const out = Object.fromEntries(keys.map((k) => [k, median(k)]))
console.log(JSON.stringify({ label, runs, median: out, all: results }, null, 0))
