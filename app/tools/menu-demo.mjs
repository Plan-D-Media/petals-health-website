// Drives the built site in real Chrome and captures the primary-nav dropdown in every state it supports.
// Usage: node tools/menu-demo.mjs   (dist served on 127.0.0.1:4173). Frames → design/render/menu/*.png
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = resolve('../design/render/menu'); mkdirSync(OUT, { recursive: true })
const clip = { x: 0, y: 0, width: 1366, height: 520 }
const frames = []
let n = 0
async function shot(page, name) {
  n += 1
  const file = `${OUT}/${String(n).padStart(2, '0')}_${name}.png`
  await page.screenshot({ path: file, clip })
  frames.push(name); console.log('captured', name)
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1366, height: 877 })
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)

const trigger = await page.$('.nav__item--trigger')
const box = await trigger.boundingBox()
const tx = box.x + box.width / 2, ty = box.y + box.height / 2

await shot(page, 'rest')

// mouse: hover opens, first row highlights under the pointer, leaving closes after the 200 ms grace
await page.mouse.move(tx, ty); await wait(350); await shot(page, 'hover_open')
await page.mouse.move(box.x + 60, box.y + 34 + 16); await wait(250); await shot(page, 'hover_row1')
await page.mouse.move(box.x + 60, box.y + 34 + 16 + 32 * 3 + 8); await wait(250); await shot(page, 'hover_row4_twoline')
await page.mouse.move(box.x + 60, box.y + 34 + 160); await wait(100)
await page.mouse.move(900, 700); await wait(80); await shot(page, 'leave_grace_still_open')
await wait(350); await shot(page, 'leave_closed')

// click toggles (touch / mouse users who click); click outside closes
await page.mouse.click(tx, ty); await wait(300); await shot(page, 'click_open')
await page.mouse.click(900, 700); await wait(300); await shot(page, 'click_outside_closed')

// keyboard: About us → ArrowRight ×2 lands on Treatments; ArrowDown opens and focuses row 1; arrows cycle;
// End; Escape closes and returns focus; ArrowRight from an open menu carries focus to the next item and closes
await page.focus('a.nav__item:not(.nav__item--active)'); await wait(150); await shot(page, 'kbd_focus_about')
await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await wait(200); await shot(page, 'kbd_focus_treatments')
await page.keyboard.press('ArrowDown'); await wait(300); await shot(page, 'kbd_open_row1')
await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown'); await wait(200); await shot(page, 'kbd_row3')
await page.keyboard.press('End'); await wait(200); await shot(page, 'kbd_end_row9')
await page.keyboard.press('ArrowDown'); await wait(200); await shot(page, 'kbd_wraps_to_row1')
await page.keyboard.press('Escape'); await wait(300); await shot(page, 'kbd_escape_focus_back')
await page.keyboard.press('Enter'); await wait(300); await shot(page, 'kbd_enter_open')
await page.keyboard.press('ArrowRight'); await wait(300); await shot(page, 'kbd_arrowright_next_item')
await page.keyboard.press('ArrowLeft'); await page.keyboard.press('Space'); await wait(300)
await page.keyboard.press('Tab'); await wait(300); await shot(page, 'kbd_tab_out_closed')

// a11y snapshot of the trigger + menu
const a11y = await page.evaluate(() => {
  const b = document.querySelector('.nav__item--trigger')
  return { role: b.tagName, expanded: b.getAttribute('aria-expanded'), haspopup: b.getAttribute('aria-haspopup'), controls: !!document.getElementById(b.getAttribute('aria-controls')) }
})
console.log('a11y', JSON.stringify(a11y))
await browser.close()
console.log('frames', frames.length)
