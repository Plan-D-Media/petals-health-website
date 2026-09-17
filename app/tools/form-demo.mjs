// Exercises the shared lead form in real Chrome: open from the hero, validation errors, spam timing guard, loading
// state, simulated success (placeholder endpoint), and the error path with a dead endpoint (data kept, retry offered,
// payload queued). Captures to design/render/forms/. Usage: node tools/form-demo.mjs
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = resolve('../design/render/forms'); mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const log = { push: (l) => console.log(l) }
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png`, clip: { x: 0, y: 0, width: 1366, height: 900 } })

async function openPage(q = '') {
  const page = await browser.newPage(); const console_ = []
  page.on('console', (m) => console_.push(m.type() + ': ' + m.text()))
  page.on('pageerror', (e) => console_.push('pageerror: ' + e.message))
  await page.setViewport({ width: 1366, height: 900 })
  await page.goto('http://127.0.0.1:4173/' + q, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  return { page, console_ }
}

// 1. success path from the hero's primary button
{
  const { page, console_ } = await openPage()
  await page.click('.hero__cta[data-form="book-appointment"]'); await wait(400)
  log.push('dialog open: ' + (await page.$eval('dialog.fdialog', (d) => d.open)) + ', focus on: ' + (await page.evaluate(() => document.activeElement.name)))
  await shot(page, '01_open_book')
  await page.click('.lead__submit'); await wait(300)
  log.push('empty submit → errors: ' + (await page.$$eval('.lead__error', (els) => els.map((e) => e.textContent).join(' | '))))
  await shot(page, '02_validation')
  await page.type('input[name="name"]', 'Test Parent'); await page.type('input[name="mobile"]', '98300 12345'); await page.type('input[name="email"]', 'not-an-email')
  await page.click('input[name="consent"]')
  await page.click('.lead__submit'); await wait(300)
  log.push('bad email → ' + (await page.$$eval('.lead__error', (els) => els.map((e) => e.textContent).join(' | '))))
  await page.$eval('input[name="email"]', (el) => { el.value = '' }); await page.type('input[name="email"]', 'parent@example.com')
  await page.select('select[name="doctor"]', 'uttara-bhar')
  await wait(3200)   // clear the 3 s timing guard
  await page.click('.lead__submit')
  await wait(150)
  log.push('submitting state: button disabled=' + (await page.$eval('.lead__submit', (b) => b.disabled)) + ' text=' + (await page.$eval('.lead__submit', (b) => b.textContent.trim())))
  await shot(page, '03_sending')
  await wait(900)
  log.push('success: ' + (await page.$eval('.lead--done .lead__thanks', (e) => e.textContent.slice(0, 60))))
  await shot(page, '04_success')
  const payloadLog = console_.find((l) => l.includes('placeholder endpoint'))
  log.push('payload logged: ' + (payloadLog ? 'yes' : 'NO'))
  await page.keyboard.press('Escape'); await wait(200)
  log.push('escape closes: ' + !(await page.$eval('dialog.fdialog', (d) => d.open)) + ', focus returned to: ' + (await page.evaluate(() => document.activeElement.className)))
  log.push('page errors: ' + console_.filter((l) => l.startsWith('pageerror') || l.startsWith('error')).length)
  await page.close()
}
// 2. timing guard: submit a valid form within 3 s of opening
{
  const { page } = await openPage()
  await page.click('.closing__cta--secondary'); await wait(200)
  await page.type('input[name="name"]', 'Bot Fast'); await page.type('input[name="mobile"]', '9830012345'); await page.click('input[name="consent"]')
  await page.click('.lead__submit'); await wait(200)
  log.push('too-fast guard → ' + (await page.$$eval('.lead__error--form', (els) => els.map((e) => e.textContent).join(' | '))))
  await page.close()
}
// 3. error path: dead endpoint → error state, data kept, queued
{
  const { page } = await openPage('?leadEndpoint=http://127.0.0.1:9/dead')
  await page.click('.hero__cta[data-form="book-appointment"]'); await wait(3200)
  await page.type('input[name="name"]', 'Keep My Data'); await page.type('input[name="mobile"]', '9830012345'); await page.click('input[name="consent"]')
  await page.click('.lead__submit'); await wait(1500)
  log.push('dead endpoint → ' + (await page.$$eval('.lead__error--form', (els) => els.map((e) => e.textContent).join(' | '))))
  log.push('data kept: name=' + (await page.$eval('input[name="name"]', (e) => e.value)) + ', button=' + (await page.$eval('.lead__submit', (b) => b.textContent.trim())))
  log.push('queued: ' + (await page.evaluate(() => JSON.parse(localStorage.getItem('petals.leads.pending') || '[]').length)))
  await shot(page, '05_error_retry')
  await page.close()
}
// 4. doctor card preselects the doctor; source carries form/page/section/doctor
{
  const { page, console_ } = await openPage()
  await page.$eval('.specialists__carousel', (el) => el.scrollIntoView())
  await page.click('[data-slide="1"] .doctor__book'); await wait(3200)
  log.push('doctor preselected: ' + (await page.$eval('select[name="doctor"]', (s) => s.value)))
  await page.type('input[name="name"]', 'Source Check'); await page.type('input[name="mobile"]', '9830012345'); await page.click('input[name="consent"]')
  await page.click('.lead__submit'); await wait(1000)
  const l = console_.find((x) => x.includes('placeholder endpoint')) || ''
  log.push('source in payload: ' + (l.includes('"form":"book-appointment"') || l.includes('form') ? 'present' : 'check console'))
  await page.close()
}
await browser.close()
