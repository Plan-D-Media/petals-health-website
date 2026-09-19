// For a page at 390 px: the height of each hero text element rendered in the fallback face vs the real font, so a
// swap-induced re-wrap can be pinned to an element and weight. Usage: node tools/swap-diff.mjs /find-a-doctor/ ".fd-hero__eyebrow,.fd-hero__title,.fd-hero__lead"
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const path = process.argv[2] || '/find-a-doctor/'
const sels = (process.argv[3] || '.fd-hero__eyebrow,.fd-hero__title,.fd-hero__lead').split(',')
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true })
await p.goto(BASE + path, { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready)
const r = await p.evaluate((sels) => sels.map((sel) => {
  const el = document.querySelector(sel); if (!el) return { sel, missing: true }
  const cs = getComputedStyle(el)
  const real = el.getBoundingClientRect().height; const realW = el.scrollWidth
  el.style.fontFamily = "'Bricolage Fallback', Arial"; const fb = el.getBoundingClientRect().height
  const lines = (h) => Math.round(h / parseFloat(cs.lineHeight))
  el.style.fontFamily = ''
  return { sel, weight: cs.fontWeight, size: cs.fontSize, lineHeight: cs.lineHeight, real: Math.round(real), fallback: Math.round(fb), realLines: lines(real), fallbackLines: lines(fb), text: el.textContent.trim().slice(0, 40) }
}), sels)
for (const x of r) console.log(JSON.stringify(x))
await b.close()
