// Controlled reproduction of the Find a Doctor layout shift: load the page under the throttled mobile profile twice —
// as built, and with the width/height attributes stripped from the hero <img> as they were before 2026-09-19 — and
// report CLS and the shift sources for each. Usage: node tools/cls-repro.mjs [/path/] [img selector]
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const path = process.argv[2] || '/find-a-doctor/'
const sel = process.argv[3] || '.fd-hero__photo img'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
async function run(strip, delayImg) {
  const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
  const cdp = await p.createCDPSession()
  await cdp.send('Network.enable'); await cdp.send('Network.clearBrowserCache'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  if (delayImg) {   // hold the hero image back until 1.5 s after the page has painted — the pre-fix condition (no preload, 1.7 MB PNG)
    await p.setRequestInterception(true)
    p.on('request', (req) => { if (/find-hero|-hero(-m)?\.webp/.test(req.url())) setTimeout(() => req.continue(), 3500); else req.continue() })
  }
  await p.evaluateOnNewDocument((strip, sel) => {
    window.__shifts = []
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(3), src: (e.sources || []).slice(0, 3).map((s) => { const n = s.node; return (n?.tagName || '?').toLowerCase() + (n?.className && typeof n.className === 'string' ? '.' + n.className.split(' ')[0] : '') + ` ${Math.round(s.previousRect.y)}→${Math.round(s.currentRect.y)} h${Math.round(s.previousRect.height)}→${Math.round(s.currentRect.height)}` }) }) }).observe({ type: 'layout-shift', buffered: true })
    if (strip) new MutationObserver(() => { for (const img of document.querySelectorAll(sel)) { if (img.hasAttribute('width')) { img.removeAttribute('width'); img.removeAttribute('height') } } }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['width', 'height'] })
  }, strip, sel)
  await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 })
  await new Promise((r) => setTimeout(r, 4000))
  const r = await p.evaluate(() => window.__shifts)
  await p.close()
  return r
}
for (const [strip, delay] of [[false, false], [false, true], [true, true]]) {
  const shifts = await run(strip, delay)
  console.log(`
${strip ? 'NO width/height' : 'width/height reserved'} + ${delay ? 'hero image arriving 3.5 s late (the pre-fix condition: no preload, 1.7 MB PNG)' : 'image preloaded'}: CLS ${shifts.reduce((a, s) => a + s.v, 0).toFixed(3)}`)
  for (const s of shifts) console.log(`  @${s.t} ms  ${s.v}  ${s.src.join(' | ')}`)
}
await b.close()
