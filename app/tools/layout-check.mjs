// Layout checker — replaces compare.py (design/flow-first-and-layout-checks.md §3).
// Runs the built page at 390, 768, 1024, 1280, 1366, 1440, 1680 and 1920 and asserts structure, interaction, type and hygiene.
// Usage: node tools/layout-check.mjs [path]   (default "/"); CHECK_BASE=<origin> and CHECK_AUTH=user:pass to check a
// deployment (the staging project is behind Basic auth). Exit 1 on any failure. Captures → design/render/check/.
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { SITE_PAGES } from '../src/pages.js'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = resolve('../design/render/check'); mkdirSync(OUT, { recursive: true })
const path = process.argv[2] || '/'
const noForms = SITE_PAGES.find((p) => p.path === path)?.forms === false   // a page without the lead form (pages.js)
const WIDTHS = [390, 768, 1024, 1280, 1366, 1440, 1680, 1920]
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
let failures = 0
const report = []
const log = (w, ok, name, detail = '') => { report.push(`${ok ? 'PASS' : 'FAIL'} ${String(w).padStart(4)} ${name}${detail ? ' — ' + detail : ''}`); if (!ok) failures += 1 }

for (const width of WIDTHS) {
  const page = await browser.newPage()
  if (process.env.CHECK_AUTH) { const [username, password] = process.env.CHECK_AUTH.split(':'); await page.authenticate({ username, password }) }   // the staging deploy's Basic auth
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
      if (el.closest('[data-bleed], .watermark, .carousel__track, .carousel__viewport, .hero__film, .drawer, dialog, .sxo')) continue
      const b = el.getBoundingClientRect()
      const right = Math.min(b.right, clipRight(el))   // a clipped descendant cannot overflow past its clipping ancestor
      if (right > width + 1 && b.left < width) out.overflow.push(desc(el) + ` right ${Math.round(right)}`)
    }
    // 2 overlaps between leaf-ish elements
    const leaves = all.filter((el) => (/^(P|H1|H2|H3|A|BUTTON|LI|IMG|INPUT|SELECT|TEXTAREA|SPAN)$/.test(el.tagName)) && !el.closest('[data-overlap-ok], .proof, .carousel__controls, .drawer, dialog, .nav__menu, .actionbar, .video-slot, .care__petal, .sxo, .rail') && el.textContent.trim().length > 0 && !el.querySelector('p, h2, h3, ul'))
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

  // 2b action rail clear of content. The rail is position: fixed, so content scrolls under it: one scroll position
  // proves nothing (the old check measured at the top of the page, where only the hero sits beside the rail, and
  // missed the treatment pages' "What we treat" cards at x = 0 further down). Instead: show the rail (on Home it
  // waits for the hero to scroll out), take the circles' band in the viewport, and fail any content anywhere on the
  // page that would pass through that band at some scroll position — text, controls, images (what they paint:
  // clipped by overflow ancestors, and an object-fit: contain image only where the picture is), and card surfaces
  // that do not bleed off the viewport edge (a band's background running under the rail is intended). data-overlap-ok
  // does not apply: it lets a hero photo sit under the hero copy, not under the rail.
  if (width >= 1024) {
    const rc = await page.evaluate(async () => {
      const hero = document.querySelector('.hero, [data-hero]')
      window.scrollTo(0, hero ? hero.getBoundingClientRect().bottom + window.scrollY + 10 : 600)
      await new Promise((r) => setTimeout(r, 500))
      const icons = [...document.querySelectorAll('.rail--on .rail__icon')].map((i) => i.getBoundingClientRect()).filter((b) => b.width)
      if (!icons.length) return { shown: false, hits: [] }
      const L = Math.min(...icons.map((b) => b.left)), R = Math.max(...icons.map((b) => b.right))
      const T = Math.min(...icons.map((b) => b.top)), B = Math.max(...icons.map((b) => b.bottom))
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const desc = (el) => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : '') + ' "' + (el.getAttribute('alt') || el.textContent.trim()).slice(0, 28) + '"'
      const painted = (img, b) => {   // object-fit contain / scale-down leaves the rest of the box transparent
        const cs = getComputedStyle(img)
        if (!/contain|scale-down/.test(cs.objectFit) || !img.naturalWidth) return b
        const s = Math.min(b.width / img.naturalWidth, b.height / img.naturalHeight), w = img.naturalWidth * s
        const px = cs.objectPosition.split(' ')[0]
        const left = b.left + (px.endsWith('%') ? (b.width - w) * parseFloat(px) / 100 : parseFloat(px))
        return { left, right: left + w }
      }
      const clipX = (el, x) => {      // the horizontal span left after every overflow-clipping ancestor
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          if (/hidden|clip/.test(getComputedStyle(p).overflowX)) { const c = p.getBoundingClientRect(); x = { left: Math.max(x.left, c.left), right: Math.min(x.right, c.right) } }
        }
        return x
      }
      const hits = []
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest('.rail, .actionbar, .sxo, dialog, .drawer, .sr-only, .nav__menu, .hero__film, .video-slot, .watermark')) continue
        const cs = getComputedStyle(el)
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0 || cs.position === 'fixed' || cs.position === 'sticky') continue
        const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
        const media = /^(IMG|VIDEO|svg|INPUT|SELECT|TEXTAREA|BUTTON)$/.test(el.tagName)
        const surface = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || cs.boxShadow !== 'none'
        if (!text && !media && !surface) continue
        const b = el.getBoundingClientRect()
        if (!b.width || !b.height) continue
        if (!text && !media && b.left <= 1) continue                     // a band bleeding off the edge: intended
        if (media && b.width >= window.innerWidth - 2) continue          // a full-bleed picture or film
        const x = clipX(el, el.tagName === 'IMG' ? painted(el, b) : b)
        const y = b.top + window.scrollY                                  // document coordinates
        const passes = y + b.height > T && y < B + maxScroll              // some scroll position puts it beside the rail
        if (passes && x.right > L + 2 && x.left < R - 2) hits.push(desc(el) + ` x${Math.round(x.left)}`)
      }
      return { shown: true, hits }
    })
    log(width, rc.shown && rc.hits.length === 0, 'action rail clear of content at every scroll position', rc.shown ? rc.hits.slice(0, 4).join(' | ') : 'rail never shown')
  }

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

  // 8 form usable: open from the first data-form trigger that is visible. A page declared form-less (pages.js forms: false)
  // must instead have no trigger and no dialog — a trigger there would open nothing.
  if (noForms) {
    const stray = await page.evaluate(() => ({ triggers: document.querySelectorAll('[data-form]').length, dialog: !!document.querySelector('dialog.fdialog') }))
    log(width, stray.triggers === 0 && !stray.dialog, 'no lead-form triggers or dialog (page has no form)', JSON.stringify(stray))
  }
  const form = noForms ? null : await page.evaluate(async () => {
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
  if (form) log(width, form.opened && form.fits && form.short === 0 && form.unlabeled === 0 && form.errs > 0, 'form opens, fits, inputs ≥ 44 with labels, validation marks fields', JSON.stringify(form))

  // 12 hygiene
  const imgs = await page.$$eval('img', (els) => els.filter((i) => !i.hasAttribute('alt')).length)
  log(width, imgs === 0, 'every img has alt', `${imgs} without`)
  // 12b content images keep their proportions: a box more than 2.2× off the picture's own ratio crops most of it away
  // (Yoga, 2026-10-30: width: 100% without height: auto let <Img>'s height attribute win over aspect-ratio — 148 × 829)
  // The blend hero (.th__stage--blend, Yoga) is exempt: a wide frame of mostly backdrop, cropped to its subject on purpose.
  const slivers = await page.$$eval('img[alt]:not([alt=""])', (els) => els.filter((i) => {
    if (i.closest('.th__stage--blend') || /contain|scale-down/.test(getComputedStyle(i).objectFit)) return false   // contain shows the whole picture
    const b = i.getBoundingClientRect(); if (b.width < 40 || b.height < 40 || !i.naturalWidth) return false
    const k = (b.width / b.height) / (i.naturalWidth / i.naturalHeight); return k > 2.2 || k < 1 / 2.2
  }).map((i) => `${i.getAttribute('src')} ${Math.round(i.getBoundingClientRect().width)}×${Math.round(i.getBoundingClientRect().height)} of ${i.naturalWidth}×${i.naturalHeight}`))
  log(width, slivers.length === 0, 'content images keep their proportions', slivers.slice(0, 3).join(' | '))
  log(width, errors.length === 0, 'no console errors / failed requests', errors.slice(0, 2).join(' | '))

  await page.evaluate(() => window.scrollTo(0, 0)); await wait(200)
  await page.screenshot({ path: `${OUT}/${path.replace(/\W+/g, '_') || 'home'}_${width}.png`, fullPage: true })
  await page.close()
}
await browser.close()
console.log(report.join('\n'))
console.log(`\n${failures} failure(s)`)
process.exit(failures ? 1 : 0)
