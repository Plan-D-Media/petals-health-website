// Attributes layout shifts: same mobile profile as perf.mjs (390 wide, 4× CPU, slow 4G), N runs, and for every
// layout-shift entry prints its value, time, and the shifted nodes with their previous → current rects.
// Usage: node tools/cls-attrib.mjs [runs]
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const runs = Number(process.argv[2] || 5)
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
for (let i = 0; i < runs; i++) {
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
  const cdp = await page.createCDPSession()
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await page.evaluateOnNewDocument(() => {
    window.__shifts = []
    window.__heights = []
    setInterval(() => { const h = {}; for (const el of document.querySelectorAll('.page > *')) { const n = (el.className || el.tagName).toString().split(' ')[0]; h[n] = Math.round(el.getBoundingClientRect().height) } window.__heights.push({ t: Math.round(performance.now()), h }) }, 100)
    const d = (n) => n ? (n.nodeType === 1 ? n.tagName.toLowerCase() + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ' "' + (n.textContent || '').trim().slice(0, 25) + '"' : '#text') : 'null'
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { if (e.hadRecentInput) continue; window.__shifts.push({ value: +e.value.toFixed(4), t: Math.round(e.startTime), sources: (e.sources || []).map((s) => ({ node: d(s.node), prev: [Math.round(s.previousRect.x), Math.round(s.previousRect.y), Math.round(s.previousRect.width), Math.round(s.previousRect.height)], cur: [Math.round(s.currentRect.x), Math.round(s.currentRect.y), Math.round(s.currentRect.width), Math.round(s.currentRect.height)] })) }) } }).observe({ type: 'layout-shift', buffered: true })
  })
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load' })
  await new Promise((r) => setTimeout(r, 1500))
  await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let i = 1; i <= 12; i++) { window.scrollTo(0, (h * i) / 12); await new Promise((r) => setTimeout(r, 250)) } await new Promise((r) => setTimeout(r, 400)) })
  const shifts = await page.evaluate(() => window.__shifts)
  const heights = await page.evaluate(() => window.__heights)
  for (const sh of shifts) { const before = [...heights].reverse().find((x) => x.t < sh.t - 50); const after = heights.find((x) => x.t > sh.t + 50); if (before && after) { const diff = Object.keys(after.h).filter((k) => after.h[k] !== before.h[k]).map((k) => `${k} ${before.h[k]}→${after.h[k]}`); console.log(`  section height changes around t=${sh.t}: ${diff.join(', ') || 'none'}`) } }
  const total = shifts.reduce((a, s) => a + s.value, 0)
  console.log(`run ${i + 1}: CLS ${total.toFixed(4)} in ${shifts.length} shift(s)`)
  for (const s of shifts) { console.log(`  t=${s.t}ms value=${s.value}`); for (const src of s.sources) console.log(`     ${src.node}  ${src.prev.join(',')} → ${src.cur.join(',')}`) }
  await page.close()
}
await browser.close()
