// Full-site review pass (2026-09-18): every page at 390 / 768 / 1366 / 1920 — links, form entry points, header and
// footer consistency, landmarks, headings, alt text, form labels, keyboard focus order, axe-core, console errors —
// plus the Find a Doctor journey. Writes design/render/audit/walk.json and prints a findings list.
// Usage: node tools/site-walk.mjs [pathFilter]
import puppeteer from 'puppeteer-core'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { SITE_PAGES } from '../src/pages.js'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const OUT = resolve('../design/render/audit'); mkdirSync(OUT, { recursive: true })
const AXE = readFileSync(resolve('node_modules/axe-core/axe.min.js'), 'utf8')
const WIDTHS = [390, 768, 1366, 1920]
const filter = process.argv[2]
const PAGES = [...SITE_PAGES.map((p) => p.path), '/no-such-page/'].filter((p) => !filter || p.includes(filter))
const KNOWN = new Set([...SITE_PAGES.map((p) => p.path.replace(/\/$/, '') || '/'), '/privacy-policy.html', '/treatments/fertility-care'])
const FORM_TITLES = { 'book-appointment': 'Book an appointment', 'request-callback': 'Request a call back', 'book-consultation': 'Book a consultation', 'sxo-agent': 'Tell us how we can help', 'ask-doctor': 'Ask a doctor', 'book-consultation-page': 'Book a Consultation' }

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const findings = []
const F = (page, width, kind, detail) => findings.push({ page, width, kind, detail })
const results = {}
const sigs = {}     // width → { header: {sig: [pages]}, footer: {...} }
const ids = {}      // page → Set of element ids (for cross-page hash links)
const hashLinks = []

for (const path of PAGES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage()
    const errors = []
    page.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push(m.text().slice(0, 160)) })
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.slice(0, 160)))
    page.on('requestfailed', (r) => { if (!/\.mp4/.test(r.url())) errors.push('requestfailed: ' + r.url()) })
    page.on('response', (r) => { if (r.status() >= 400 && !/\.mp4/.test(r.url()) && !r.url().endsWith(path.replace(/\/$/, '')) && !r.url().endsWith(path)) errors.push(`HTTP ${r.status()} ${r.url()}`) })
    await page.setViewport({ width, height: width < 1024 ? 844 : 900, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 })
    await page.goto(BASE + path, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 20)) } window.scrollTo(0, 0) })
    await wait(400)

    const r = await page.evaluate((KNOWN_ARR, width) => {
      const KNOWN = new Set(KNOWN_ARR)
      const vis = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 }
      const desc = (el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ' "' + (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 36) + '"'
      const out = { links: [], dead: [], broken: [], external: [], forms: [], noAlt: [], unlabeled: [], landmarks: {}, headings: [], ids: [...document.querySelectorAll('[id]')].map((e) => e.id), hashTargets: [] }
      for (const a of document.querySelectorAll('a[href]')) {
        const href = a.getAttribute('href'); const inDrawer = !!a.closest('.drawer'); const v = vis(a) || inDrawer
        const item = { href, text: desc(a), visible: v, inDrawer, form: a.dataset.form || '' }
        out.links.push(item)
        if (!v) continue
        if (href === '#' || href === '') { if (!a.dataset.form) out.dead.push(desc(a)); continue }
        if (href.startsWith('#')) { if (a.dataset.form) continue; if (!document.getElementById(href.slice(1))) out.dead.push(desc(a) + ' → ' + href); continue }
        if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) { out.external.push(desc(a) + ' → ' + href); continue }
        const [p, hash] = href.split('#'); const clean = (p.split('?')[0].replace(/\/$/, '') || '/')
        if (!KNOWN.has(clean)) out.broken.push(desc(a) + ' → ' + href)
        else if (hash) out.hashTargets.push({ target: clean, hash, from: desc(a) })
      }
      for (const el of document.querySelectorAll('[data-form]')) if (vis(el) || el.closest('.drawer')) out.forms.push({ form: el.dataset.form, text: desc(el), section: el.dataset.section || '', drawer: !!el.closest('.drawer'), actionbar: !!el.closest('.actionbar') })
      for (const img of document.querySelectorAll('img')) if (!img.hasAttribute('alt')) out.noAlt.push(img.getAttribute('src'))
      for (const inp of document.querySelectorAll('input:not([type=hidden]), select, textarea')) { const id = inp.id; const lab = (id && document.querySelector(`label[for="${id}"]`)) || inp.closest('label') || inp.getAttribute('aria-label') || inp.getAttribute('aria-labelledby'); if (!lab) out.unlabeled.push(desc(inp) + ' name=' + inp.name) }
      for (const l of ['header', 'nav', 'main', 'footer', '[role=dialog]', 'aside']) out.landmarks[l] = [...document.querySelectorAll(l)].filter((e) => !e.closest('.drawer') || width < 1024).map((e) => e.getAttribute('aria-label') || '').length
      out.headings = [...document.querySelectorAll('h1, h2, h3, h4')].filter(vis).map((h) => h.tagName + ' ' + h.textContent.trim().replace(/\s+/g, ' ').slice(0, 40))
      out.h1 = document.querySelectorAll('h1').length
      out.skipLink = !!document.querySelector('a[href="#main"], a.skip, .skip-link')
      out.mainId = !!document.getElementById('main')
      out.lang = document.documentElement.lang
      out.title = document.title
      // header / footer signature: strip current-page markers
      const norm = (html) => html.replace(/ aria-current="page"/g, '').replace(/nav__item--active|drawer__item--current/g, '').replace(/ tabindex="-?\d"/g, '').replace(/ aria-hidden="(true|false)"/g, '').replace(/nav--cta/g, '').replace(/\s+/g, ' ')
      out.headerSig = norm(document.querySelector('.site-header')?.outerHTML || document.querySelector('header')?.outerHTML || '')
      out.footerSig = norm(document.querySelector('footer')?.outerHTML || '')
      return out
    }, [...KNOWN], width)
    if (r.h1 !== 1) F(path, width, 'h1', `found ${r.h1}`)
    for (const d of r.dead) F(path, width, 'dead-link', d)
    for (const d of r.broken) F(path, width, 'broken-link', d)
    for (const d of r.noAlt) F(path, width, 'img-no-alt', d)
    for (const d of r.unlabeled) F(path, width, 'unlabeled-input', d)
    for (const t of r.hashTargets) hashLinks.push({ ...t, page: path, width })
    ids[path] = new Set(r.ids)
    if (!r.landmarks.main) F(path, width, 'landmark', 'no <main>')
    if (!r.skipLink) F(path, width, 'a11y', 'no skip link')
    if (!r.lang) F(path, width, 'a11y', 'no html lang')
    sigs[width] = sigs[width] || { header: {}, footer: {} }
    ;(sigs[width].header[r.headerSig] = sigs[width].header[r.headerSig] || []).push(path)
    ;(sigs[width].footer[r.footerSig] = sigs[width].footer[r.footerSig] || []).push(path)

    // forms from every visible entry point (390 and 1366 only, to bound time); on <768 the action bar needs the hero scrolled out
    if (width === 390 || width === 1366) {
      const n = await page.evaluate(() => document.querySelectorAll('[data-form]').length)
      for (let i = 0; i < n; i++) {
        const res = await page.evaluate(async (i) => {
          const el = document.querySelectorAll('[data-form]')[i]; if (!el) return null
          const desc = el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0] + ' "' + (el.textContent || '').trim().slice(0, 30) + '"'
          const inDrawer = !!el.closest('.drawer'); const inBar = !!el.closest('.actionbar'); const inNavCta = el.classList.contains('nav__cta')
          if (inDrawer) { document.querySelector('.mbar__menu, button[aria-label="Open menu"], .mbar__btn--menu')?.click(); await new Promise((r) => setTimeout(r, 300)) }
          if (inBar || inNavCta) { window.scrollTo(0, 1600); await new Promise((r) => setTimeout(r, 500)) }
          el.scrollIntoView({ block: 'center' }); await new Promise((r) => setTimeout(r, 100))
          const cs = getComputedStyle(el); const b = el.getBoundingClientRect()
          const clickable = b.width > 0 && cs.visibility !== 'hidden' && Number(cs.opacity) > 0 && cs.pointerEvents !== 'none'
          if (!clickable) return { desc, form: el.dataset.form, skipped: 'not clickable here', inDrawer, inBar, inNavCta }
          el.click(); await new Promise((r) => setTimeout(r, 350))
          const d = document.querySelector('dialog'); const open = d?.open; const title = d?.querySelector('.lead__title')?.textContent.trim() || ''
          const doctorSel = d?.querySelector('select[name=doctor]')?.value || ''
          const fits = d ? d.querySelector('.fdialog__panel').getBoundingClientRect().bottom <= innerHeight + 1 : false
          document.activeElement?.blur(); d?.close(); document.querySelector('.drawer__close')?.click()
          await new Promise((r) => setTimeout(r, 200)); window.scrollTo(0, 0)
          return { desc, form: el.dataset.form, open, title, doctorSel, expectedDoctor: el.dataset.doctor || '', fits, inDrawer, inBar, inNavCta }
        }, i)
        if (!res) continue
        if (res.skipped) continue
        if (!res.open) F(path, width, 'form-entry', `${res.desc} did not open the dialog`)
        else if (FORM_TITLES[res.form] && res.title !== FORM_TITLES[res.form]) F(path, width, 'form-entry', `${res.desc} opened "${res.title}" (expected "${FORM_TITLES[res.form]}")`)
        if (res.open && res.expectedDoctor && res.doctorSel !== res.expectedDoctor) F(path, width, 'form-entry', `${res.desc} did not preselect doctor ${res.expectedDoctor}`)
        if (res.open && !res.fits) F(path, width, 'form-entry', `${res.desc}: dialog taller than the viewport`)
      }
    }

    // keyboard walk (390 and 1366)
    let kb = null
    if (width === 390 || width === 1366) {
      await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur() })
      const seq = []; const seen = new Map()
      for (let i = 0; i < 350; i++) {
        await page.keyboard.press('Tab')
        const f = await page.evaluate(() => {
          const el = document.activeElement; if (!el || el === document.body) return { body: true }
          const cs = getComputedStyle(el)
          const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none' || el.matches(':focus-visible') && (cs.outlineStyle !== 'none')
          const b = el.getBoundingClientRect()
          return { d: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : '') + ' "' + (el.getAttribute('aria-label') || el.textContent || el.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 30) + '"', ring, offscreen: b.bottom < 0 || b.top > innerHeight, hidden: b.width === 0 || cs.visibility === 'hidden' || Number(cs.opacity) === 0, inDrawer: !!el.closest('.drawer'), inDialog: !!el.closest('dialog') }
        })
        if (f.body) { if (seq.length > 5) break; continue }
        seq.push(f)
        const k = f.d; seen.set(k, (seen.get(k) || 0) + 1)
        if (seen.get(k) > 3) { F(path, width, 'focus-trap', `focus cycles on ${k}`); break }
      }
      const noRing = seq.filter((s) => !s.ring && !s.hidden).map((s) => s.d)
      const hiddenFocus = seq.filter((s) => s.hidden).map((s) => s.d)
      if (noRing.length) F(path, width, 'focus-ring', `${noRing.length} focused elements without a visible ring: ${[...new Set(noRing)].slice(0, 6).join(' | ')}`)
      if (hiddenFocus.length) F(path, width, 'focus-hidden', `${hiddenFocus.length} hidden/zero-size elements receive focus: ${[...new Set(hiddenFocus)].slice(0, 6).join(' | ')}`)
      kb = { stops: seq.length, first: seq.slice(0, 6).map((s) => s.d), noRing: [...new Set(noRing)], hiddenFocus: [...new Set(hiddenFocus)] }
    }

    // axe-core (390 and 1366)
    let axe = null
    if (width === 390 || width === 1366) {
      await page.evaluate(AXE)
      axe = await page.evaluate(async () => { const r = await window.axe.run(document, { resultTypes: ['violations'], rules: { 'color-contrast': { enabled: true } } }); return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 4).map((n) => (n.target.join(' ') + ' — ' + (n.failureSummary || '').split('\n')[1]).slice(0, 200)), count: v.nodes.length })) })
      for (const v of axe) F(path, width, `axe:${v.impact}:${v.id}`, `${v.help} (${v.count}) e.g. ${v.nodes[0]}`)
    }
    for (const e of errors) F(path, width, 'console', e)
    results[`${path}@${width}`] = { title: r.title, headings: r.headings, landmarks: r.landmarks, forms: r.forms.length, external: r.external, kb, axe, errors }
    await page.close()
  }
  console.log(`walked ${path}`)
}

// cross-page hash targets
for (const h of hashLinks) { const target = h.target === '/' ? '/' : h.target + '/'; if (ids[target] && !ids[target].has(h.hash)) F(h.page, h.width, 'broken-anchor', `${h.from} → ${h.target}#${h.hash} (no such id on the target page)`) }
// header / footer consistency
for (const w of WIDTHS) for (const part of ['header', 'footer']) { const groups = Object.values(sigs[w][part]); if (groups.length > 1) F('(site)', w, `${part}-inconsistent`, groups.map((g) => g.length + ' page(s): ' + g.slice(0, 3).join(', ')).join(' || ')) }

writeFileSync(resolve(OUT, 'walk.json'), JSON.stringify({ findings, results }, null, 1))
const byKind = {}
for (const f of findings) (byKind[f.kind] = byKind[f.kind] || []).push(f)
for (const [k, list] of Object.entries(byKind)) { console.log(`\n## ${k} (${list.length})`); const shown = new Map(); for (const f of list) { const key = f.detail; if (!shown.has(key)) shown.set(key, []); shown.get(key).push(`${f.page}@${f.width}`) } for (const [d, where] of shown) console.log(`- ${d}\n    ${where.length > 6 ? where.length + ' page/width combos incl. ' + where.slice(0, 4).join(', ') : where.join(', ')}`) }
await browser.close()
