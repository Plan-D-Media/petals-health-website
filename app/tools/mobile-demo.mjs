// Mobile/tablet behaviour captures: drawer open (with the Treatments accordion), bottom action bar after the hero,
// the form as a bottom sheet, and the tablet bar. → design/render/check/mobile_*.png
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = resolve('../design/render/check'); mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const log = []

const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' }); await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: `${OUT}/mobile_first_viewport.png` })
// drawer
await page.click('.mbar__btn--menu'); await wait(400)
log.push('drawer focus on: ' + (await page.evaluate(() => document.activeElement.textContent.trim().slice(0, 30))))
await page.click('.drawer__acc'); await wait(300)
log.push('treatments links in drawer: ' + (await page.$$eval('.drawer__sub:not([hidden]) a', (a) => a.length)))
await page.screenshot({ path: `${OUT}/mobile_drawer_open.png` })
await page.keyboard.press('Escape'); await wait(300)
log.push('escape closes drawer: ' + !(await page.$eval('.drawer', (d) => d.classList.contains('drawer--open'))))
// action bar after the hero
await page.evaluate(() => window.scrollTo(0, 900)); await wait(600)
const bar = await page.$eval('.actionbar', (b) => ({ on: b.classList.contains('actionbar--on'), top: Math.round(b.getBoundingClientRect().top) }))
log.push('action bar after hero: ' + JSON.stringify(bar))
await page.screenshot({ path: `${OUT}/mobile_actionbar.png` })
// form as bottom sheet, action bar hidden meanwhile
await page.click('.actionbar__book'); await wait(500)
const sheet = await page.evaluate(() => { const p = document.querySelector('.fdialog__panel').getBoundingClientRect(); const b = document.querySelector('.actionbar').getBoundingClientRect(); return { panelBottom: Math.round(p.bottom), vh: window.innerHeight, barTop: Math.round(b.top) } })
log.push('form sheet: ' + JSON.stringify(sheet) + ' (bar top ≥ vh means hidden)')
await page.screenshot({ path: `${OUT}/mobile_form_sheet.png` })
await page.keyboard.press('Escape'); await wait(300)
// footer accordion
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await wait(600)
await page.screenshot({ path: `${OUT}/mobile_footer.png` })
await page.close()

const tab = await browser.newPage()
await tab.setViewport({ width: 768, height: 1024 })
await tab.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' }); await tab.evaluate(() => document.fonts.ready)
await tab.screenshot({ path: `${OUT}/tablet_first_viewport.png` })
await tab.close()
await browser.close()
console.log(log.join('\n'))
