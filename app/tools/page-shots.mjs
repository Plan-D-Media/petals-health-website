// Full-page captures of the built Home page in real Chrome (video playing) at 1366 and 1920, plus hero crops.
// Usage: node tools/page-shots.mjs [query]   e.g. node tools/page-shots.mjs "?polish2=1"
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const q = process.argv[2] || ''
const tag = q ? q.replace(/[^a-z0-9]/gi, '') : 'current'
const OUT = resolve('../design/render/audit'); mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
for (const width of [1366, 1920]) {
  const page = await browser.newPage()
  await page.setViewport({ width, height: 900 })
  await page.goto('http://127.0.0.1:4173/' + q, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForSelector('.video-slot--playing', { timeout: 15000 }).catch(() => {})
  await wait(1500)
  // scroll through once so any scroll-driven work has run, then back to top
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)) } window.scrollTo(0, 0) })
  await wait(600)
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  await page.screenshot({ path: `${OUT}/${tag}_${width}.png`, fullPage: true })
  await page.screenshot({ path: `${OUT}/${tag}_hero_${width}.png`, clip: { x: 0, y: 0, width, height: 880 } })
  console.log('captured', tag, width, 'page height', h)
  await page.close()
}
await browser.close()
