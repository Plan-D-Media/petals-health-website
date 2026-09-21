// Serves a staging build on 4174 and checks: ribbon present, robots meta on every route, a form submission with a
// ?leadEndpoint override is still simulated (never posted), analytics does not load.
import puppeteer from 'puppeteer-core'
import { spawn } from 'node:child_process'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const srv = spawn(process.execPath, ['tools/serve.mjs', '4174'], { stdio: 'ignore', windowsHide: true })
await new Promise((r) => setTimeout(r, 1500))
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: 1366, height: 900 })
const posts = []; p.on('request', (r) => { if (r.method() === 'POST') posts.push(r.url()) })
const logs = []; p.on('console', (m) => logs.push(m.text()))
for (const path of ['/', '/treatments/petals-ivf/', '/doctors/madanki-s/', '/no-such-page/']) {
  await p.goto('http://127.0.0.1:4174' + path + '?leadEndpoint=https://example.com/real-sheet', { waitUntil: 'networkidle0' })
  console.log(path, JSON.stringify(await p.evaluate(() => ({ ribbon: document.querySelector('.staging-ribbon')?.textContent.slice(0, 30), robots: document.querySelector('meta[name=robots]')?.content, gtm: !!document.querySelector('script[src*="googletagmanager"]'), title: document.title.slice(0, 30) }))))
}
await p.goto('http://127.0.0.1:4174/?leadEndpoint=https://example.com/real-sheet', { waitUntil: 'networkidle0' })
await p.click('[data-form="request-callback"]'); await new Promise((r) => setTimeout(r, 500))
await p.type('dialog input[name=name]', 'Staging Test'); await p.type('dialog input[name=mobile]', '9876543210'); await p.click('dialog input[type=checkbox]')
await new Promise((r) => setTimeout(r, 3200)); await p.click('dialog .lead__submit'); await new Promise((r) => setTimeout(r, 1500))
console.log('after submit:', JSON.stringify(await p.evaluate(() => ({ thanks: document.querySelector('dialog .lead__thanks')?.textContent.slice(0, 40), pending: localStorage.getItem('petals.leads.pending') }))))
console.log('POST requests made:', posts.length ? posts.join(', ') : 'none')
console.log('placeholder log:', logs.some((l) => l.includes('placeholder endpoint')) ? 'yes (simulated)' : 'no')
await b.close(); srv.kill()
