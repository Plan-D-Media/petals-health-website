// Keyboard-only walk: fresh load, Tab from the top through the whole page. Reports stops without a visible focus
// ring, focus landing on hidden/zero-size elements, interactive elements never reached, and the Escape/arrow
// behaviour of the Treatments menu, the mobile drawer and the form dialog (real key presses, not synthetic events).
// Usage: node tools/kb-walk.mjs [pathFilter]
import puppeteer from 'puppeteer-core'
import { SITE_PAGES } from '../src/pages.js'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const filter = process.argv[2]
const PAGES = [...SITE_PAGES.map((p) => p.path), '/no-such-page/'].filter((p) => !filter || p.includes(filter))
const launch = () => puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
let b = await launch()
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const findings = []

for (const path of PAGES) {
  for (const width of [390, 1366]) {
    try {
      if (!b.connected) b = await launch()
      const p = await b.newPage(); await p.setViewport({ width, height: width < 1024 ? 844 : 900, isMobile: width < 768, hasTouch: width < 768 })
      await p.goto(BASE + path, { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready); await wait(300)
      await p.evaluate(() => { document.querySelectorAll('*').forEach((el, i) => { el.dataset.kbi = i }) })
      const all = await p.evaluate(() => {
        const vis = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0 }
        const k = (el) => el.tagName.toLowerCase() + '|' + (el.getAttribute('aria-label') || el.textContent || el.placeholder || el.name || '').trim().replace(/\s+/g, ' ').slice(0, 40)
        return [...document.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter((el) => vis(el) && !el.closest('.drawer, dialog') && el.tabIndex >= 0 && !el.closest('details:not([open]) > :not(summary)')).map((el) => ({ kbi: el.dataset.kbi, k: k(el) }))
      })
      const seq = []; let last = -1; let repeats = 0
      for (let i = 0; i < 600; i++) {
        await p.keyboard.press('Tab')
        const f = await p.evaluate(() => {
          const el = document.activeElement; if (!el || el === document.body) return { body: true }
          const cs = getComputedStyle(el); const r = el.getBoundingClientRect()
          const ring = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0
          const k = el.tagName.toLowerCase() + '|' + (el.getAttribute('aria-label') || el.textContent || el.placeholder || el.name || '').trim().replace(/\s+/g, ' ').slice(0, 40)
          return { kbi: el.dataset.kbi, key: k, ring, hidden: r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || Number(cs.opacity) === 0, cls: (el.className || '').toString().split(' ')[0], inView: r.bottom > 0 && r.top < innerHeight }
        })
        if (f.body) { if (seq.length) break; else continue }
        if (f.kbi === last) { repeats++; if (repeats > 2) { findings.push(`${path}@${width}: focus stuck on ${f.key}`); break } } else repeats = 0
        last = f.kbi; seq.push(f)
      }
      const reached = new Set(seq.map((s) => s.kbi))
      const unreached = all.filter((a) => !reached.has(a.kbi)).map((a) => a.k)
      const noRing = [...new Set(seq.filter((s) => !s.ring && !s.hidden).map((s) => s.key + ' [' + s.cls + ']'))]
      const hidden = [...new Set(seq.filter((s) => s.hidden).map((s) => s.key + ' [' + s.cls + ']'))]
      const offscreen = seq.filter((s) => !s.hidden && !s.inView).map((s) => s.key)
      console.log(`${path}@${width}: ${seq.length} stops / ${all.length} interactive; first: ${seq.slice(0, 5).map((s) => s.key).join(' > ')}`)
      if (unreached.length) findings.push(`${path}@${width}: ${unreached.length} interactive elements never reached by Tab: ${[...new Set(unreached)].slice(0, 6).join(' ; ')}`)
      if (noRing.length) findings.push(`${path}@${width}: no visible focus ring on ${noRing.length}: ${noRing.slice(0, 6).join(' ; ')}`)
      if (hidden.length) findings.push(`${path}@${width}: focus lands on hidden/zero-size elements: ${hidden.slice(0, 6).join(' ; ')}`)
      if (offscreen.length) findings.push(`${path}@${width}: ${offscreen.length} focused elements sat outside the viewport: ${[...new Set(offscreen)].slice(0, 4).join(' ; ')}`)

      if (path === '/' || path === '/about/' || path === '/find-a-doctor/') {
        if (width === 1366) {
          await p.evaluate(() => { const t = document.querySelector('[aria-haspopup="true"], button.nav__item, .nav__trigger'); window.__t = t; t?.focus() })
          await p.keyboard.press('ArrowDown'); await wait(250)
          const menu = await p.evaluate(() => ({ noTrigger: !window.__t, open: window.__t?.getAttribute('aria-expanded') === 'true', focusInMenu: !!document.activeElement.closest('.nav__menu, [role=menu]'), focused: document.activeElement.textContent.trim().slice(0, 20) }))
          await p.keyboard.press('ArrowDown'); await wait(100); menu.second = await p.evaluate(() => document.activeElement.textContent.trim().slice(0, 20))
          await p.keyboard.press('Escape'); await wait(250)
          Object.assign(menu, await p.evaluate(() => ({ closedByEscape: window.__t?.getAttribute('aria-expanded') !== 'true', focusBack: document.activeElement === window.__t })))
          console.log(`${path}@${width} treatments menu: ${JSON.stringify(menu)}`)
          if (!menu.open || !menu.closedByEscape || !menu.focusBack) findings.push(`${path}@${width}: Treatments menu keyboard: ${JSON.stringify(menu)}`)
        } else {
          await p.evaluate(() => { document.querySelector('button[aria-label="Open menu"]').focus() })
          await p.keyboard.press('Enter'); await wait(400)
          const dr = await p.evaluate(() => ({ focusIn: !!document.activeElement.closest('.drawer'), first: document.activeElement.textContent.trim().slice(0, 20) || document.activeElement.getAttribute('aria-label'), expanded: document.querySelector('button[aria-label="Open menu"]').getAttribute('aria-expanded'), links: [...document.querySelectorAll('.drawer a, .drawer button')].filter((e) => e.offsetParent !== null).length }))
          for (let i = 0; i < dr.links + 1; i++) await p.keyboard.press('Tab')
          dr.wrapsInside = await p.evaluate(() => !!document.activeElement.closest('.drawer'))
          await p.keyboard.press('Escape'); await wait(400)
          Object.assign(dr, await p.evaluate(() => ({ closed: !document.querySelector('.drawer--open'), focusBack: document.activeElement === document.querySelector('button[aria-label="Open menu"]') })))
          console.log(`${path}@${width} drawer: ${JSON.stringify(dr)}`)
          if (!dr.focusIn || !dr.closed || !dr.focusBack || !dr.wrapsInside) findings.push(`${path}@${width}: drawer keyboard: ${JSON.stringify(dr)}`)
        }
        await p.evaluate(() => { const t = [...document.querySelectorAll('[data-form]')].find((e) => e.getBoundingClientRect().width > 0 && !e.closest('.drawer')); window.__trig = t; t.scrollIntoView(); t.focus() })
        await p.keyboard.press('Enter'); await wait(500)
        const dlg = await p.evaluate(() => { const d = document.querySelector('dialog'); return { opened: !!d?.open, focusIn: !!document.activeElement.closest('dialog'), first: document.activeElement.tagName + ' ' + (document.activeElement.name || document.activeElement.getAttribute('aria-label') || '') } })
        for (let i = 0; i < 12; i++) await p.keyboard.press('Tab')
        dlg.tabStaysInside = await p.evaluate(() => !!document.activeElement.closest('dialog'))
        await p.keyboard.press('Escape'); await wait(300)
        Object.assign(dlg, await p.evaluate(() => ({ closedByEscape: !document.querySelector('dialog')?.open, focusBack: document.activeElement === window.__trig })))
        console.log(`${path}@${width} dialog: ${JSON.stringify(dlg)}`)
        if (!dlg.opened || !dlg.focusIn || !dlg.closedByEscape || !dlg.focusBack || !dlg.tabStaysInside) findings.push(`${path}@${width}: dialog keyboard: ${JSON.stringify(dlg)}`)
      }
      await p.close()
    } catch (e) {
      findings.push(`${path}@${width}: walk crashed: ${String(e).slice(0, 90)}`)
      try { await b.close() } catch { /* gone */ }
      b = await launch()
    }
  }
}
console.log('\nFINDINGS:'); for (const f of findings) console.log('- ' + f); if (!findings.length) console.log('- none')
await b.close()
