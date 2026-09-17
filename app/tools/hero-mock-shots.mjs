// Screenshots the three hero concept mocks at 1366 and 1920 from file:// (no server needed).
// Usage (from design/mocks/hero): node ../../../app/tools/../../design/mocks/hero/shots.mjs  — or: node shots.mjs
import puppeteer from 'puppeteer-core'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'

const dir = process.argv[2] || 'hero'
const names = (process.argv[3] || 'a,b,c').split(',')
const here = resolve('../design/mocks/' + dir)
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const header = readFileSync(resolve(here, 'header.html'), 'utf8')
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files'] })
for (const name of names) {
  // inline the shared header into each mock at capture time
  const src = readFileSync(resolve(here, `${name}.src.html`), 'utf8').replace('<!--HEADER-->', header)
  const file = resolve(here, `${name}.html`); writeFileSync(file, src)
  const widths = process.env.WIDTHS ? process.env.WIDTHS.split(',').map(Number) : [1366, 1920]
  for (const width of widths) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 900 })
    const tall = process.argv[4] ? Number(process.argv[4]) : 900
    await page.goto(pathToFileURL(file).href, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.fonts.ready)
    await new Promise((r) => setTimeout(r, 300))
    await page.screenshot({ path: resolve(here, `concept_${name}_${width}.png`), fullPage: !process.argv[4] })
    console.log('captured', name, width)
    await page.close()
  }
}
await browser.close()
