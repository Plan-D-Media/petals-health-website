// Viewport-height slices of one live page — what the visitor actually sees, screen by screen, where shot.mjs gives
// the whole scroll at once. Usage: node tools/slice.mjs /find-a-doctor/ 390 0,1,2
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const path = process.argv[2] || '/'
const w = Number(process.argv[3] || 1366)
const slices = (process.argv[4] || '0,1,2').split(',').map(Number)
const OUT = resolve('../design/render/live'); mkdirSync(OUT, { recursive: true })
const h = w < 1024 ? 844 : 900
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: w, height: h, isMobile: w < 768, hasTouch: w < 768 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await p.goto(BASE + path, { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready)
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)) } window.scrollTo(0, 0) })
const name = (path.replace(/[?=&]/g, '-').replace(/\//g, '_') || '_')
for (const s of slices) {
  await p.evaluate((y) => window.scrollTo(0, y), s * h)
  await new Promise((r) => setTimeout(r, 350))
  const f = resolve(OUT, `${name}${w}_v${s}.png`)
  await p.screenshot({ path: f }); console.log(f)
}
await b.close()
