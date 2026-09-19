// Diffs the header and footer markup between pages (aria-current and active classes stripped). Usage: node tools/header-diff.mjs
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const norm = (h) => h.replace(/ aria-current="page"/g, '').replace(/ ?(nav__item--active|drawer__item--current|nav__item--open)/g, '').replace(/ aria-expanded="(true|false)"/g, '').replace(/ id=":r[0-9a-z]+:"/g, '').replace(/aria-controls=":r[0-9a-z]+:"/g, '')
const get = async (path, w) => { const p = await b.newPage(); await p.setViewport({ width: w, height: 900 }); await p.goto('http://127.0.0.1:4173' + path, { waitUntil: 'networkidle0' }); const h = await p.evaluate(() => ({ header: document.querySelector('.site-header').outerHTML, footer: document.querySelector('footer').outerHTML })); await p.close(); return { header: norm(h.header), footer: norm(h.footer) } }
const pages = ['/', '/about/', '/clinics/', '/find-a-doctor/', '/treatments/dentistry/', '/treatments/child-care/', '/doctors/smita-gutgutia/', '/no-such-page/']
for (const w of [390, 1366]) {
  const got = {}; for (const p of pages) got[p] = await get(p, w)
  const base = got['/about/']
  for (const p of pages) {
    for (const part of ['header', 'footer']) {
      const x = base[part], y = got[p][part]; if (x === y) continue
      const xs = x.split('><'), ys = y.split('><'); const out = []
      for (let i = 0; i < Math.max(xs.length, ys.length); i++) if (xs[i] !== ys[i]) { out.push(`   about: ${xs[i]?.slice(0, 140)}\n   ${p}: ${ys[i]?.slice(0, 140)}`); if (out.length > 3) break }
      console.log(`@${w} ${part} differs on ${p}:\n${out.join('\n')}`)
    }
  }
}
await b.close()
