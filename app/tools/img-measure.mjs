// Measures the rendered box of every <img> and every CSS mask/background image on every page at 390 / 768 / 1366 /
// 1920 and writes the largest needed pixel size per source (rendered box × 2 for retina, honouring object-fit).
// Output: tools/img-manifest.json  { "/assets/x.png": { natW, natH, needW, needH, fit, pages: [...] } }
import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'
import { SITE_PAGES } from '../src/pages.js'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const need = {}
for (const path of [...SITE_PAGES.map((p) => p.path), '/no-such-page/']) {
  for (const width of [390, 768, 1366, 1920]) {
    const p = await b.newPage(); await p.setViewport({ width, height: width < 1024 ? 844 : 900, deviceScaleFactor: 1, isMobile: width < 768 })
    await p.goto(BASE + path, { waitUntil: 'networkidle0' })
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)) } window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 300)) })
    const rows = await p.evaluate(() => {
      const out = []
      const urlOf = (v) => { const m = /url\(["']?([^"')]+)["']?\)/.exec(v); return m ? m[1] : null }
      for (const img of document.querySelectorAll('img')) {
        const r = img.getBoundingClientRect(); const cs = getComputedStyle(img)
        const src = new URL(img.currentSrc || img.src, location.href).pathname
        out.push({ src, w: r.width, h: r.height, fit: cs.objectFit, natW: img.naturalWidth, natH: img.naturalHeight, kind: 'img' })
        const mask = urlOf(cs.maskImage) || urlOf(cs.webkitMaskImage); if (mask) out.push({ src: new URL(mask, location.href).pathname, w: r.width, h: r.height, fit: 'mask', natW: 0, natH: 0, kind: 'mask' })
      }
      for (const el of document.querySelectorAll('*')) {
        const cs = getComputedStyle(el); const r = el.getBoundingClientRect()
        const bg = urlOf(cs.backgroundImage); if (bg && !bg.startsWith('data:')) out.push({ src: new URL(bg, location.href).pathname, w: r.width, h: r.height, fit: 'bg', natW: 0, natH: 0, kind: 'bg' })
        if (el.tagName !== 'IMG') { const mask = urlOf(cs.maskImage) || urlOf(cs.webkitMaskImage); if (mask && !mask.startsWith('data:')) out.push({ src: new URL(mask, location.href).pathname, w: r.width, h: r.height, fit: 'mask', natW: 0, natH: 0, kind: 'mask' }) }
      }
      const v = document.querySelector('video'); if (v) { const r = v.getBoundingClientRect(); out.push({ src: 'video', w: r.width, h: r.height, fit: 'video', natW: v.videoWidth, natH: v.videoHeight, kind: 'video' }) }
      return out
    })
    for (const r of rows) {
      const n = (need[r.src] = need[r.src] || { natW: 0, natH: 0, needW: 0, needH: 0, fit: r.fit, kind: r.kind, pages: new Set(), maxBox: '' })
      if (r.natW) { n.natW = r.natW; n.natH = r.natH }
      const dpr = 2
      let needW = r.w * dpr, needH = r.h * dpr
      if (r.natW && r.natH && (r.fit === 'cover' || r.fit === 'contain' || r.fit === 'fill' || r.fit === 'none')) {
        const s = r.fit === 'contain' ? Math.min(needW / r.natW, needH / r.natH) : Math.max(needW / r.natW, needH / r.natH)
        needW = r.natW * s; needH = r.natH * s
      } else if (r.natW && r.natH && r.w && !r.h) { needH = needW * r.natH / r.natW }
      if (needW > n.needW) { n.needW = needW; n.needH = needH; n.maxBox = `${Math.round(r.w)}×${Math.round(r.h)}@${width} ${path}` }
      n.pages.add(path)
    }
    await p.close()
  }
  console.log('measured', path)
}
const out = {}
for (const [k, v] of Object.entries(need)) out[k] = { ...v, needW: Math.round(v.needW), needH: Math.round(v.needH), pages: [...v.pages] }
writeFileSync('tools/img-manifest.json', JSON.stringify(out, null, 1))
for (const [k, v] of Object.entries(out)) console.log(k.padEnd(52), `nat ${v.natW}×${v.natH}`.padEnd(16), `need ${v.needW}×${v.needH}`.padEnd(16), v.fit.padEnd(8), v.maxBox)
await b.close()
