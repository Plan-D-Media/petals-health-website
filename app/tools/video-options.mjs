// Mock-up captures for the footage treatment decision (design/video-options.md): flush vs card, with a pale-backdrop
// clip and a studio-backdrop clip, at 1366 and 1920, plus the poster state. Usage: node tools/video-options.mjs
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = resolve('../design/render/video/options'); mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const CASES = [
  ['poster', ''],
  ['A_flush_pale', '?videoStyle=flush&video=/media/standin-pale.mp4'],
  ['A_flush_studio', '?videoStyle=flush&video=/media/standin-studio.mp4'],
  ['B_card_pale', '?videoStyle=card&video=/media/standin-pale.mp4'],
  ['B_card_studio', '?videoStyle=card&video=/media/standin-studio.mp4'],
]
for (const width of [1366, 1920]) {
  for (const [name, q] of CASES) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 880 })
    if (name === 'poster') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.goto('http://127.0.0.1:4173/' + q, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.fonts.ready)
    if (name !== 'poster') await page.waitForSelector('.video-slot--playing', { timeout: 15000 }).catch(() => console.log('not playing:', name))
    await wait(2200)
    await page.screenshot({ path: `${OUT}/${name}_${width}.png`, clip: { x: 0, y: 0, width, height: 880 } })
    console.log('captured', name, width)
    await page.close()
  }
}
await browser.close()
