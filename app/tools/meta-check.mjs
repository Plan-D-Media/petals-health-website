// Prints title / description / canonical per page and the analytics events a click sequence produces.
// Usage: node tools/meta-check.mjs   (against http://127.0.0.1:4173 or CHECK_BASE)
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1366, height: 900 })
for (const path of ['/', '/about/', '/clinics/', '/find-a-doctor/', '/treatments/fertility-care/', '/doctors/smita-gutgutia/', '/no-such-page/']) {
  await page.goto(BASE + path, { waitUntil: 'networkidle0' })
  const r = await page.evaluate(() => ({ url: location.pathname + location.search, title: document.title, desc: document.querySelector('meta[name=description]')?.content.slice(0, 70), canonical: document.querySelector('link[rel=canonical]')?.href, robots: document.querySelector('meta[name=robots]')?.content, h1: document.querySelector('h1')?.textContent.trim().slice(0, 50) }))
  console.log(JSON.stringify(r))
}
await page.goto(BASE + '/find-a-doctor/', { waitUntil: 'networkidle0' })
await page.click('.facet__opt input')                      // first specialty checkbox
await page.type('.fd__search input', 'sid')
await new Promise((r) => setTimeout(r, 1200))
await page.click('.drow__book')                            // opens the dialog
await new Promise((r) => setTimeout(r, 300))
await page.click('dialog .lead__submit')                   // invalid submit → validation, no event
await new Promise((r) => setTimeout(r, 300))
const ev = await page.evaluate(() => ({ url: location.search, events: (window.__petalsEvents || []).map((e) => e.event + ' ' + JSON.stringify(Object.fromEntries(Object.entries(e).filter(([k]) => !['ts', 'page', 'event'].includes(k)))).slice(0, 110)) }))
console.log(ev.url); for (const e of ev.events) console.log('  ' + e)
await browser.close()
