// Verifies both marquees in Chrome: moving in opposite directions, pause on hover, manual mode on keyboard focus
// (scrollable, focused card in view), manual under reduced motion; captures at 1366 and 390 → design/render/check/.
import puppeteer from 'puppeteer-core'
import { resolve } from 'node:path'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = resolve('../design/render/check')
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const tx = (page, sel) => page.$eval(sel + ' .marquee__track', (t) => new DOMMatrix(getComputedStyle(t).transform).m41)

const page = await browser.newPage(); await page.setViewport({ width: 1366, height: 900 })
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' }); await page.evaluate(() => document.fonts.ready)
for (const [sel, name] of [['.stories__marquee', 'stories'], ['.specialists__marquee', 'doctors']]) {
  await page.$eval(sel, (el) => el.scrollIntoView({ block: 'center' })); await wait(800)
  const a = await tx(page, sel); await wait(1000); const b = await tx(page, sel)
  console.log(`${name}: moved ${(b - a).toFixed(1)} px in 1 s (${b < a ? 'leftwards' : 'rightwards'})`)
  await page.screenshot({ path: `${OUT}/marquee_${name}_1366.png`, clip: { x: 0, y: 0, width: 1366, height: 900 } })
  const box = await (await page.$(sel + ' .marquee__viewport')).boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await wait(300)
  const h0 = await tx(page, sel); await wait(800); const h1 = await tx(page, sel)
  console.log(`${name}: hover pause ${h0.toFixed(1)} → ${h1.toFixed(1)} (${Math.abs(h1 - h0) < 0.5 ? 'paused' : 'MOVING'})`)
  await page.mouse.move(5, 5)
}
// keyboard: focus the third doctor card's button → manual mode, card in view, duplicates gone
await page.focus('.specialists__marquee .marquee__item:nth-child(3) .doctor__book'); await wait(600)
const man = await page.evaluate(() => { const m = document.querySelector('.specialists__marquee'); const it = m.querySelector('.marquee__item:nth-child(3)').getBoundingClientRect(); const vp = m.querySelector('.marquee__viewport').getBoundingClientRect(); return { manual: m.classList.contains('marquee--manual'), overflow: getComputedStyle(m.querySelector('.marquee__viewport')).overflowX, inView: it.left >= vp.left - 1 && it.right <= vp.right + 1, dups: m.querySelectorAll('.marquee__item--dup').length } })
console.log('keyboard focus on doctor 3: ' + JSON.stringify(man))
await page.keyboard.press('ArrowRight'); await wait(500)
console.log('ArrowRight scrolls: scrollLeft=' + (await page.$eval('.specialists__marquee .marquee__viewport', (v) => v.scrollLeft)))
await page.screenshot({ path: `${OUT}/marquee_manual_focus_1366.png`, clip: { x: 0, y: 0, width: 1366, height: 900 } })
await page.close()

const rm = await browser.newPage(); await rm.setViewport({ width: 1366, height: 900 })
await rm.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await rm.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' })
console.log('reduced motion: ' + JSON.stringify(await rm.$$eval('.marquee', (ms) => ms.map((m) => ({ manual: m.classList.contains('marquee--manual'), anim: getComputedStyle(m.querySelector('.marquee__track')).animationName })))))
await rm.close()

const mob = await browser.newPage(); await mob.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
await mob.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' }); await mob.evaluate(() => document.fonts.ready)
await mob.$eval('.stories__marquee', (el) => el.scrollIntoView({ block: 'center' })); await wait(800)
await mob.screenshot({ path: `${OUT}/marquee_stories_390.png` })
await mob.close()
await browser.close()
