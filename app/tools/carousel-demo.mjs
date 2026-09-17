// Verifies the two carousels in real Chrome: autoplay advances, hover pauses, focus pauses, arrows, keyboard, drag,
// every slide reachable by Tab, and no autoplay under prefers-reduced-motion. Captures to design/render/carousel/.
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = resolve('../design/render/carousel'); mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const tx = (page, sel) => page.$eval(sel + ' .carousel__track', (t) => new DOMMatrix(getComputedStyle(t).transform).m41)
const log = []

async function run(reduced) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 900 })
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  const sel = '.stories__carousel'
  await page.$eval(sel, (el) => el.scrollIntoView({ block: 'center' }))
  await wait(600)
  const t0 = await tx(page, sel)
  await wait(6800)
  const t1 = await tx(page, sel)
  log.push(`${reduced ? 'reduced-motion' : 'default'}: autoplay moved ${t0} → ${t1} (${reduced ? 'must be equal' : 'must differ'})`)
  if (reduced) { await page.close(); return }
  await page.screenshot({ path: `${OUT}/stories_after_autoplay.png`, clip: { x: 0, y: 0, width: 1366, height: 900 } })

  // hover pauses
  const box = await (await page.$(sel + ' .carousel__viewport')).boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  const h0 = await tx(page, sel); await wait(6800); const h1 = await tx(page, sel)
  log.push(`hover pause: ${h0} → ${h1} (must be equal)`)
  await page.mouse.move(5, 5)

  // arrows
  await page.click(sel + ' .carousel__btn--next'); await wait(500); const a1 = await tx(page, sel)
  await page.click(sel + ' .carousel__btn--prev'); await wait(500); const a2 = await tx(page, sel)
  log.push(`arrows: next → ${a1}, prev → ${a2}`)
  await page.screenshot({ path: `${OUT}/stories_arrow_next.png`, clip: { x: 0, y: 0, width: 1366, height: 900 } })

  // keyboard: focus the prev button, ArrowRight moves; Tab through slides — focus pauses autoplay
  await page.focus(sel + ' .carousel__btn--prev'); await page.keyboard.press('ArrowRight'); await wait(500)
  log.push(`keyboard ArrowRight: ${await tx(page, sel)}`)
  const k0 = await tx(page, sel); await wait(6800); const k1 = await tx(page, sel)
  log.push(`focus pause: ${k0} → ${k1} (must be equal)`)
  // Tab from the first slide's link (if any) — stories have no links; verify slides are in the tab order via tabindex
  const reachable = await page.$$eval(sel + ' [data-slide]', (els) => els.map((e) => e.querySelector('a, button, [tabindex="0"]') ? 1 : 0))
  log.push(`stories slides with focusable content: ${reachable.join('')} (none expected; cards are static text)`)

  // drag on the doctor carousel
  const dsel = '.specialists__carousel'
  await page.$eval(dsel, (el) => el.scrollIntoView({ block: 'center' })); await wait(600)
  const dbox = await (await page.$(dsel + ' .carousel__viewport')).boundingBox()
  const d0 = await tx(page, dsel)
  await page.mouse.move(dbox.x + 600, dbox.y + 200); await page.mouse.down()
  for (let i = 1; i <= 8; i++) { await page.mouse.move(dbox.x + 600 - i * 25, dbox.y + 200); await wait(16) }
  await page.mouse.up(); await wait(500)
  const d1 = await tx(page, dsel)
  log.push(`doctor drag left 200 px: ${d0} → ${d1} (must advance one slide: −324)`)
  await page.screenshot({ path: `${OUT}/doctors_after_drag.png`, clip: { x: 0, y: 0, width: 1366, height: 900 } })
  // Tab to a doctor card off-screen: focus should bring it into view once
  await page.focus(dsel + ' [data-slide="5"] .doctor__book'); await wait(500)
  const d2 = await tx(page, dsel)
  log.push(`focus on slide 6's button slides it into view: ${d2}`)
  await page.screenshot({ path: `${OUT}/doctors_focus_slide6.png`, clip: { x: 0, y: 0, width: 1366, height: 900 } })
  const a11y = await page.$eval(dsel, (el) => ({ role: el.getAttribute('aria-roledescription'), label: el.getAttribute('aria-label'), slides: el.querySelectorAll('[aria-roledescription="slide"]').length }))
  log.push(`a11y: ${JSON.stringify(a11y)}`)
  await page.close()
}
await run(false)
await run(true)
await browser.close()
console.log(log.join('\n'))
