// Watches the Find a Doctor hero image under the throttled profile while its response is held back 3.5 s and its
// width/height attributes are stripped: prints the image's attributes, natural size, rendered box, the position of
// the section below it, and every layout shift, at five moments. Usage: node tools/cls-diag.mjs [/path/] [selector]
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const path = process.argv[2] || '/find-a-doctor/'
const sel = process.argv[3] || '.fd-hero__photo img'
const strip = process.argv[4] !== 'keep'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
await p.setRequestInterception(true)
p.on('request', (req) => { if (/-hero(-m)?\.webp|find-hero/.test(req.url())) { console.log('holding', req.url().split('/').pop()); setTimeout(() => req.continue(), 3500) } else req.continue() })
await p.evaluateOnNewDocument((strip, sel) => {
  if (strip) new MutationObserver(() => { for (const img of document.querySelectorAll(sel)) if (img.hasAttribute('width')) { img.removeAttribute('width'); img.removeAttribute('height'); window.__stripped = (window.__stripped || 0) + 1 } }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['width', 'height'] })
  window.__shifts = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__shifts.push([Math.round(e.startTime), +e.value.toFixed(3)]) }).observe({ type: 'layout-shift', buffered: true })
}, strip, sel)
p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 }).catch(() => {})
for (let i = 0; i < 6; i++) {
  await new Promise((r) => setTimeout(r, 1200))
  console.log(await p.evaluate((sel) => { const img = document.querySelector(sel); if (!img) return `t~${Math.round(performance.now())} no img yet`; const r = img.getBoundingClientRect(); const box = img.parentElement.closest('div, a').getBoundingClientRect(); return `t~${Math.round(performance.now())} stripped=${window.__stripped || 0} attrs w=${img.getAttribute('width')} h=${img.getAttribute('height')} complete=${img.complete} natural=${img.naturalWidth}x${img.naturalHeight} rendered=${Math.round(r.width)}x${Math.round(r.height)} wrapper=${Math.round(box.height)} nextSectionTop=${Math.round((document.querySelector('.fd, .t-intro, .t-stats, .about') || document.body).getBoundingClientRect().top)} shifts=${JSON.stringify(window.__shifts)}` }, sel))
}
await b.close()
