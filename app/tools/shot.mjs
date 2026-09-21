// Full-page screenshot of one live page at one or more widths. Usage: node tools/shot.mjs /treatments/child-care/ 1366,390
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const path = process.argv[2] || '/'
const widths = (process.argv[3] || '1366').split(',').map(Number)
const OUT = resolve('../design/render/live'); mkdirSync(OUT, { recursive: true })
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
for (const w of widths) {
  const p = await b.newPage(); await p.setViewport({ width: w, height: w < 1024 ? 844 : 900, isMobile: w < 768, hasTouch: w < 768 })
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await p.goto(BASE + path, { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready)
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)) } window.scrollTo(0, 0) })
  await new Promise((r) => setTimeout(r, 400))
  const f = resolve(OUT, `${path.replace(/\//g, '_') || '_'}${w}.png`)
  await p.screenshot({ path: f, fullPage: true }); console.log(f, await p.evaluate(() => document.body.scrollHeight))
  await p.close()
}
await b.close()
