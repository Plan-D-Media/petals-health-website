// Sticky nav at 1366: viewport captures just after the CTA appears, mid-page, and at the footer.
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = resolve('../design/render/audit'); mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const page = await browser.newPage(); await page.setViewport({ width: 1366, height: 900 })
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' }); await page.evaluate(() => document.fonts.ready)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const H = await page.evaluate(() => document.documentElement.scrollHeight)
const points = [['after_hero', 806 + 60], ['mid_page', Math.round(H / 2)], ['footer', H]]
for (const [name, y] of points) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y); await wait(700)
  const state = await page.evaluate(() => ({ y: window.scrollY, cta: getComputedStyle(document.querySelector('.nav__cta')).opacity, navTop: document.querySelector('.nav').getBoundingClientRect().top }))
  console.log(name, JSON.stringify(state))
  await page.screenshot({ path: `${OUT}/sticky_${name}_1366.png` })
}
await browser.close()
