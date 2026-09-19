// Measures, in the DOM with the site's own CSS (font-optical-sizing: auto), how wide Bricolage Grotesque renders
// against plain Arial at each weight and size the site uses. The ratio is the size-adjust the fallback face needs
// so a font swap re-wraps nothing. Usage: node tools/font-ratio.mjs
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: 1366, height: 900 })
await p.goto(BASE + '/about/', { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready)
const r = await p.evaluate(() => {
  const samples = ['Search our specialists by name, specialty, or clinic', 'From adolescence to motherhood and beyond, everything you need is available under one trusted roof.', 'Envisaged as a chain of family clinics, Petals is your community all-in-one family healthcare destination.', 'DGO, DNB — BJ Medical College, Pune · Loudon Street (CMC) | Kankurgachi · Bengali, Hindi, English', 'We are Building The Perfect Team']
  const host = document.createElement('div'); host.style.cssText = 'position:absolute;left:-9999px;top:0;white-space:nowrap;font-optical-sizing:auto'; document.body.appendChild(host)
  const measure = (family, weight, size, text) => { const s = document.createElement('span'); s.style.cssText = `font-family:${family};font-weight:${weight};font-size:${size}px;white-space:nowrap`; s.textContent = text; host.appendChild(s); const w = s.getBoundingClientRect().width; s.remove(); return w }
  const out = []
  for (const weight of [300, 400, 500, 600, 700]) for (const size of [13, 14, 16, 18, 20, 22, 26, 30, 36, 44, 58, 64]) {
    let sum = 0; for (const t of samples) sum += measure("'Bricolage Grotesque'", weight, size, t) / measure('Arial', weight, size, t)
    out.push({ weight, size, ratio: +(sum / samples.length).toFixed(4) })
  }
  return out
})
let last = -1
for (const x of r) { if (x.weight !== last) { console.log(`\nweight ${x.weight}`); last = x.weight } process.stdout.write(`  ${x.size}px: ${(x.ratio * 100).toFixed(1)}%`) }
console.log()
await b.close()
