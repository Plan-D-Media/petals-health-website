// Captures the hero video slot: placeholder playing, paused via the control, poster-only (reduced motion), and the
// failed-source path — at 1366 and 1920. Usage: node tools/video-demo.mjs (dist served on 127.0.0.1:4173).
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = resolve('../design/render/video'); mkdirSync(OUT, { recursive: true })
const URL = 'http://127.0.0.1:4173/'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function open(width, opts = {}) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  await page.setViewport({ width, height: 880 })
  if (opts.reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  if (opts.abortVideo) {
    await page.setRequestInterception(true)
    page.on('request', (r) => (r.url().endsWith('.mp4') ? r.abort('failed') : r.continue()))
  }
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  return { page, errors }
}
const state = (page) => page.evaluate(() => {
  const s = document.querySelector('.video-slot')
  const v = s.querySelector('video'); const b = s.querySelector('.video-slot__control')
  return { cls: s.className, video: !!v, paused: v ? v.paused : null, currentTime: v ? +v.currentTime.toFixed(2) : null, control: b ? b.getAttribute('aria-label') : null, preload: v ? v.preload : null }
})
const shot = (page, name, width) => page.screenshot({ path: `${OUT}/${name}_${width}.png`, clip: { x: 0, y: 0, width, height: 880 } })

for (const width of [1366, 1920]) {
  // playing
  let { page, errors } = await open(width)
  await page.waitForSelector('.video-slot--playing', { timeout: 15000 }).catch(() => {})
  await wait(2500)
  console.log(width, 'playing', JSON.stringify(await state(page)), 'errors', errors.length)
  await shot(page, 'playing', width)
  // pause via the control
  await page.click('.video-slot__control'); await wait(400)
  console.log(width, 'paused', JSON.stringify(await state(page)))
  await shot(page, 'paused', width)
  await page.click('.video-slot__control'); await wait(400)
  console.log(width, 'resumed', JSON.stringify(await state(page)))
  await page.close()

  // reduced motion: poster only, nothing preloaded, control offers Play
  ;({ page, errors } = await open(width, { reducedMotion: true }))
  await wait(1500)
  console.log(width, 'reduced-motion', JSON.stringify(await state(page)), 'errors', errors.length)
  await shot(page, 'poster_reduced_motion', width)
  await page.close()
}

// failed source (request aborted): poster stays, no player, no control, no page errors
{
  const { page, errors } = await open(1366, { abortVideo: true })
  await wait(1500)
  console.log(1366, 'failed-source', JSON.stringify(await state(page)), 'errors', JSON.stringify(errors))
  await shot(page, 'failed_source', 1366)
  await page.close()
}
await browser.close()
