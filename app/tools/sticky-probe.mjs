// Scrolls Cosmetic at 1366 to each track and reports the sticky index state; screenshots the top 220 px each time.
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: 1366, height: 900 })
await p.goto(BASE + '/treatments/cosmetic-gynaecology-aesthetics/', { waitUntil: 'networkidle0' })
for (const id of ['track-1', 'track-2', 'track-3']) {
  await p.evaluate((id) => { document.getElementById(id).scrollIntoView(); window.scrollBy(0, 300) }, id)
  await new Promise((r) => setTimeout(r, 400))
  const s = await p.evaluate(() => { const tx = document.querySelector('.tx'); const r = tx.getBoundingClientRect(); return { top: Math.round(r.top), active: tx.querySelector('.is-active')?.textContent, scrollY: Math.round(scrollY) } })
  console.log(id, JSON.stringify(s))
  await p.screenshot({ path: `../design/render/live/sticky_${id}.png`, captureBeyondViewport: false })
}
await b.close()
