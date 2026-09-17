// Gutter audit: for every Home section at each width, the section's visible content extent (union of its leaf
// element boxes) against the viewport, and the resulting dead space either side as a share of the width.
// Usage: node tools/gutter-audit.mjs
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const WIDTHS = [390, 768, 1024, 1280, 1366, 1920]
const rows = []
for (const width of WIDTHS) {
  const page = await browser.newPage()
  await page.setViewport({ width, height: 900 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  const data = await page.evaluate((width) => {
    const out = []
    for (const sec of document.querySelectorAll('.page > section, .page > footer, .page > .band')) {
      const name = (sec.className || '').split(' ')[0] || sec.tagName.toLowerCase()
      if (!name || name === 'utility' || name === 'nav' || name === 'mbar') continue
      let l = Infinity, r = -Infinity
      for (const el of sec.querySelectorAll('h1, h2, h3, p, a, li, img, video, button, .stat, .chip, .doctor, .story, .post, .care-card')) {
        if (el.closest('.watermark, .carousel__controls, .sr-only')) continue
        const b = el.getBoundingClientRect(); if (b.width === 0 || b.height === 0) continue
        l = Math.min(l, Math.max(0, b.left)); r = Math.max(r, Math.min(width, b.right))
      }
      if (!isFinite(l)) continue
      out.push({ name, left: Math.round(l), right: Math.round(r), used: Math.round((r - l) / width * 100) })
    }
    return out
  }, width)
  for (const d of data) rows.push({ width, ...d })
  await page.close()
}
await browser.close()
const names = [...new Set(rows.map((r) => r.name))]
console.log('section'.padEnd(14) + WIDTHS.map((w) => String(w).padStart(11)).join(''))
for (const n of names) console.log(n.padEnd(14) + WIDTHS.map((w) => { const r = rows.find((x) => x.name === n && x.width === w); return r ? `${String(r.left).padStart(4)}-${String(r.right).padEnd(4)}${String(r.used).padStart(3)}%`.padStart(11) : ''.padStart(11) }).join(''))
