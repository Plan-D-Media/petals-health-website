// Readable-measure check (2026-09-22, client item 1): the site container widens on big screens, running text must not.
// For every page at the given widths, finds every paragraph-like block and counts characters per rendered line box
// (Range rects per line, so it measures what the browser actually laid out, not a guess from the CSS). Reports any
// block over the limit. Usage: node tools/measure-check.mjs [limit] [widths]   e.g. node tools/measure-check.mjs 75 1366,1920
import puppeteer from 'puppeteer-core'
import { SITE_PAGES } from '../src/pages.js'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const LIMIT = Number(process.argv[2] || 75)
const WIDTHS = (process.argv[3] || '1366,1440,1680,1920').split(',').map(Number)
// Exempt: not running text. .footer__copy is the footer's one-line legal and address strip (13 px, the mock's own
// single line, unchanged since round 1) — capping it would wrap the footer bar to three lines, which is a design
// change nobody asked for. It is reported separately rather than hidden.
const EXEMPT = ['footer__copy']

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
let worst = 0, over = 0; const exempt = new Set()
for (const width of WIDTHS) {
  for (const pg of SITE_PAGES) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 900 })
    await page.goto(BASE + pg.path, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.fonts.ready)
    const rows = await page.evaluate((EXEMPT) => {
      const out = []
      const blocks = document.querySelectorAll('p, li, dd, blockquote')
      for (const el of blocks) {
        const text = el.textContent.replace(/\s+/g, ' ').trim()
        if (text.length < 90) continue                       // a short block cannot exceed the measure
        if (el.querySelector('p, li, dd')) continue          // containers, not leaves
        const cs = getComputedStyle(el)
        if (cs.display === 'none' || cs.visibility === 'hidden') continue
        const r = document.createRange(); r.selectNodeContents(el)
        const lines = [...r.getClientRects()].filter((x) => x.height > 4 && x.width > 4)
        if (!lines.length) continue
        // line boxes can be split per inline child: group by rounded top
        const tops = new Set(lines.map((x) => Math.round(x.top / 2)))
        const perLine = text.length / tops.size
        if (EXEMPT.some((c) => el.classList.contains(c))) { out.push({ exempt: true, sel: el.tagName.toLowerCase() + '.' + [...el.classList][0], chars: 0 }); continue }
        out.push({ sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''), chars: Math.round(perLine), lines: tops.size, sample: text.slice(0, 44) })
      }
      return out
    }, EXEMPT)
    for (const r of rows) {
      if (r.exempt) { exempt.add(r.sel); continue }
      worst = Math.max(worst, r.chars)
      if (r.chars > LIMIT) { over++; console.log(`OVER ${String(width).padStart(4)} ${pg.path} ${r.sel} — ${r.chars} chars/line over ${r.lines} lines: "${r.sample}…"`) }
    }
    await page.close()
  }
}
await browser.close()
console.log(`\nmeasure-check: limit ${LIMIT} chars/line · widest running-text block ${worst} · ${over} over the limit · widths ${WIDTHS.join(', ')}`)
if (exempt.size) console.log(`exempt (not running text, reported not hidden): ${[...exempt].join(', ')} — see EXEMPT in this file`)
process.exit(over ? 1 : 0)
