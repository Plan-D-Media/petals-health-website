// Layout checker — replaces compare.py (design/flow-first-and-layout-checks.md §3).
// Runs the built page at 390, 768, 1024, 1280, 1366 and 1920 and asserts structure, interaction, type and hygiene.
// Usage: node tools/layout-check.mjs [path]   (default "/"). Exit 1 on any failure. Captures → design/render/check/.
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = resolve('../design/render/check'); mkdirSync(OUT, { recursive: true })
const path = process.argv[2] || '/'
const WIDTHS = [390, 768, 1024, 1280, 1366, 1920]
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
let failures = 0
const report = []
const log = (w, ok, name, detail = '') => { report.push(`${ok ? 'PASS' : 'FAIL'} ${String(w).padStart(4)} ${name}${detail ? ' — ' + detail : ''}`); if (!ok) failures += 1 }

for (const width of WIDTHS) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('requestfailed', (r) => { if (!/\.mp4/.test(r.url())) errors.push('requestfailed: ' + r.url()) })
  const mobile = width < 1024
  await page.setViewport({ width, height: mobile ? 844 : 900, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])   // reveals off, autoplay off: deterministic layout
  await page.goto((process.env.CHECK_BASE || 'http://127.0.0.1:4173') + path, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  // reveal everything (scroll through) so measurements see the final layout
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)) } window.scrollTo(0, 0) })
  await wait(600)

  const r = await page.evaluate((width) => {
    const out = { overflow: [], overlaps: [], clipped: [], small: [], targets: [], h1: document.querySelectorAll('h1').length, stickyOverlap: [] }
    const vis = (el) => { if (el.closest('details:not([open]) > :not(summary), details:not([open]) > :not(summary) *')) return false; const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false; const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 }
    const desc = (el) => (el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ' "' + (el.textContent || '').trim().slice(0, 30) + '"')
    // 1 horizontal overflow
    if (document.documentElement.scrollWidth > width + 1) out.overflow.push(`scrollWidth ${document.documentElement.scrollWidth} > ${width}`)
    const all = [...document.querySelectorAll('body *')].filter(vis)
    const clipRight = (el) => { let p = el.parentElement, r = Infinity; while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'clip') r = Math.min(r, p.getBoundingClientRect().right); p = p.parentElement } return r }
    for (const el of all) {
      if (el.closest('[data-bleed], .watermark, .carousel__track, .carousel__viewport, .hero__film, .drawer, dialog')) continue
      const b = el.getBoundingClientRect()
      const right = Math.min(b.right, clipRight(el))   // a clipped descendant cannot overflow past its clipping ancestor
      if (right > width + 1 && b.left < width) out.overflow.push(desc(el) + ` right ${Math.round(right)}`)
    }
    // 2 overlaps between leaf-ish elements
    const leaves = all.filter((el) => (/^(P|H1|H2|H3|A|BUTTON|LI|IMG|INPUT|SELECT|TEXTAREA|SPAN)$/.test(el.tagName)) && !el.closest('[data-overlap-ok], .proof, .carousel__controls, .drawer, dialog, .nav__menu, .actionbar, .video-slot, .care__petal') && el.textContent.trim().length > 0 && !el.querySelector('p, h2, h3, ul'))
    const rects = leaves.map((el) => ({ el, b: el.getBoundingClientRect() }))
    for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i], c = rects[j]
      if (a.el.contains(c.el) || c.el.contains(a.el)) continue
      const ix = Math.min(a.b.right, c.b.right) - Math.max(a.b.left, c.b.left), iy = Math.min(a.b.bottom, c.b.bottom) - Math.max(a.b.top, c.b.top)
      if (ix > 4 && iy > 4) { out.overlaps.push(desc(a.el) + ' × ' + desc(c.el)); if (out.overlaps.length > 12) break }
    }
    // 3 clipped text
    for (const el of all) {
      if (!el.textContent.trim() || el.children.length) continue
      if (el.closest('[data-clamp], .sr-only, .carousel__status, .lead__hp, .doctor__name')) continue
      const cs = getComputedStyle(el)
      if ((cs.overflow === 'hidden' || cs.whiteSpace === 'nowrap' || cs.textOverflow === 'ellipsis') && (el.scrollWidth > el.clientWidth + 1)) out.clipped.push(desc(el) + ` ${el.scrollWidth}>${el.clientWidth}`)
    }
    // 10 type floor
    for (const el of all) { if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) { const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 13 && !el.closest('.sr-only')) out.small.push(desc(el) + ` ${fs}px`) } }
    // 7 touch targets (mobile/tablet)
    if (width < 1024) {
      for (const el of document.querySelectorAll('a, button, input, select, textarea, summary')) {
        if (!vis(el) || getComputedStyle(el).pointerEvents === 'none' || el.closest('[data-inline-link], .drawer:not(.drawer--open), .actionbar:not(.actionbar--on), .nav, .utility, dialog')) continue
        // a checkbox or radio inside its <label> is activated by the whole label: measure the label
        const target = (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio') && el.closest('label')) ? el.closest('label') : el
        const b = target.getBoundingClientRect()
        if (b.width < 44 || b.height < 44) { const cs = getComputedStyle(el); if (el.tagName === 'A' && cs.display === 'inline') continue; out.targets.push(desc(el) + ` ${Math.round(b.width)}×${Math.round(b.height)}`) }
      }
    }
    return out
  }, width)

  log(width, r.overflow.length === 0, 'no horizontal overflow', r.overflow.slice(0, 3).join(' | '))
  log(width, r.overlaps.length === 0, 'no overlapping elements', r.overlaps.slice(0, 4).join(' | '))
  log(width, r.clipped.length === 0, 'no clipped text', r.clipped.slice(0, 4).join(' | '))
  log(width, r.small.length === 0, 'type ≥ 13 px', r.small.slice(0, 4).join(' | '))
  if (width < 1024) log(width, r.targets.length === 0, 'touch targets ≥ 44', r.targets.slice(0, 5).join(' | '))
  log(width, r.h1 === 1, 'exactly one h1', `found ${r.h1}`)

  // 6 marquees reachable: under reduced motion the marquee is a scrollable row; the forward button must reach the last item
  const car = await page.evaluate(async () => {
    const res = []
    for (const m of document.querySelectorAll('.marquee:not(.marquee--static)')) {
      const next = m.querySelector('.marquee__btn--next'); const vp = m.querySelector('.marquee__viewport'); const items = m.querySelectorAll('.marquee__item:not(.marquee__item--dup)')
      const lastVisible = () => { const l = items[items.length - 1].getBoundingClientRect(); const v = vp.getBoundingClientRect(); return l.left >= v.left - 2 && l.right <= v.right + 2 }
      let clicks = 0; let seen = lastVisible()
      while (!seen && clicks < items.length + 2) { next.click(); clicks++; await new Promise((r) => setTimeout(r, 350)); seen = lastVisible() }
      const dupsHidden = [...m.querySelectorAll('.marquee__item--dup')].every((d) => d.getAttribute('aria-hidden') === 'true')
      res.push({ label: m.getAttribute('aria-label'), lastVisible: seen, clicks, manual: m.classList.contains('marquee--manual'), dupsHidden })
    }
    return res
  })
  for (const c of car) log(width, c.lastVisible && c.manual && c.dupsHidden, `marquee "${c.label}" manual under reduced motion, last item reachable`, `${c.clicks} clicks`)

  // 8 form usable: open from the first data-form trigger that is visible
  const form = await page.evaluate(async () => {
    const trig = [...document.querySelectorAll('[data-form]')].find((el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return b.width > 0 && cs.visibility !== 'hidden' && Number(cs.opacity) > 0 && !el.closest('.drawer') })
    if (!trig) return { opened: false }
    trig.click(); await new Promise((r) => setTimeout(r, 400))
    const d = document.querySelector('dialog.fdialog'); if (!d || !d.open) return { opened: false }
    const p = d.querySelector('.fdialog__panel').getBoundingClientRect()
    const fits = p.left >= 0 && p.right <= window.innerWidth + 1 && p.top >= 0 && p.bottom <= window.innerHeight + 1
    const inputs = [...d.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([name=website]), select, textarea')]
    const short = inputs.filter((i) => i.getBoundingClientRect().height < 44).length
    const unlabeled = inputs.filter((i) => !i.closest('label') && !document.querySelector(`label[for="${i.id}"]`)).length
    d.querySelector('.lead__submit').click(); await new Promise((r) => setTimeout(r, 200))
    const errs = d.querySelectorAll('[aria-invalid="true"]').length
    d.close()
    return { opened: true, fits, short, unlabeled, errs }
  })
  log(width, form.opened && form.fits && form.short === 0 && form.unlabeled === 0 && form.errs > 0, 'form opens, fits, inputs ≥ 44 with labels, validation marks fields', JSON.stringify(form))

  // 12 hygiene
  const imgs = await page.$$eval('img', (els) => els.filter((i) => !i.hasAttribute('alt')).length)
  log(width, imgs === 0, 'every img has alt', `${imgs} without`)
  log(width, errors.length === 0, 'no console errors / failed requests', errors.slice(0, 2).join(' | '))

  await page.evaluate(() => window.scrollTo(0, 0)); await wait(200)
  await page.screenshot({ path: `${OUT}/${path.replace(/\W+/g, '_') || 'home'}_${width}.png`, fullPage: true })
  await page.close()
}
await browser.close()
console.log(report.join('\n'))
console.log(`\n${failures} failure(s)`)
process.exit(failures ? 1 : 0)
