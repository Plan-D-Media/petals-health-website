// Footer column overlap at desktop widths, hash-link landing, and a few computed contrasts.
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const lum = (hex) => { const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4); return 0.2126 * r + 0.7152 * g + 0.0722 * bl }
const cr = (a, c) => { const [x, y] = [lum(a), lum(c)].sort((p, q) => q - p); return ((x + 0.05) / (y + 0.05)).toFixed(2) }
console.log('contrast nav__cta blue-900 on orange-500:', cr('#00427e', '#ffb43a'), '| green-500 on white:', cr('#00bf63', '#ffffff'), '| grey-500 on white:', cr('#808080', '#ffffff'), '| grey-600 on white:', cr('#4d4d4d', '#ffffff'), '| orange-500 on blue-900:', cr('#ffb43a', '#00427e'), '| accent on white:', cr('#ed1941', '#ffffff'), '| white on blue-800:', cr('#ffffff', '#1c4e8f'), '| purple-500 on white:', cr('#6e5fa1', '#ffffff'))
for (const w of [1366, 1920, 1024]) {
  const p = await b.newPage(); await p.setViewport({ width: w, height: 900 }); await p.goto(BASE + '/about/', { waitUntil: 'networkidle0' })
  const r = await p.evaluate(() => {
    const cols = [...document.querySelectorAll('footer .footer__col, footer details, footer .footer__group')]
    const rects = cols.map((c) => ({ h: c.querySelector('summary, h3, h4, .footer__heading')?.textContent.trim().slice(0, 20), r: c.getBoundingClientRect(), links: [...c.querySelectorAll('a')].map((a) => ({ t: a.textContent.trim().slice(0, 30), r: a.getBoundingClientRect() })) }))
    const out = []
    for (let i = 0; i < rects.length; i++) for (const l of rects[i].links) for (let j = 0; j < rects.length; j++) if (i !== j && l.r.right > rects[j].r.left + 2 && l.r.left < rects[j].r.left && Math.abs(l.r.top - rects[j].r.top) < 400) out.push(`"${l.t}" (col "${rects[i].h}") spills ${Math.round(l.r.right - rects[j].r.left)} px into col "${rects[j].h}"`)
    return { cols: rects.length, out: [...new Set(out)] }
  })
  console.log(`@${w} footer: ${r.cols} groups; ${r.out.length ? r.out.join(' | ') : 'no spill'}`)
  await p.close()
}
// hash landing on a fresh load
for (const w of [1366, 390]) {
  const p = await b.newPage(); await p.setViewport({ width: w, height: w < 1024 ? 844 : 900 })
  await p.goto(BASE + '/clinics#clinic-tollygunge', { waitUntil: 'networkidle0' }); await new Promise((r) => setTimeout(r, 500))
  const y = await p.evaluate(() => ({ scrollY, target: document.getElementById('clinic-tollygunge')?.getBoundingClientRect().top }))
  console.log(`@${w} /clinics#clinic-tollygunge fresh load: scrollY ${y.scrollY}, target top ${Math.round(y.target)}`)
  await p.goto(BASE + '/clinics/?__p=/clinics/#clinic-tollygunge', { waitUntil: 'networkidle0' }); await new Promise((r) => setTimeout(r, 500))
  console.log(`@${w} via stub-style ?__p=: url now ${await p.evaluate(() => location.pathname + location.search + location.hash)}`)
  await p.close()
}
await b.close()
