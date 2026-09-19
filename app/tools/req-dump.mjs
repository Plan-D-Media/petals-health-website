// Lists every response a page loads (mobile viewport) with its byte size. Usage: node tools/req-dump.mjs /about/
import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true })
const seen = []
p.on('response', async (r) => { try { const buf = await r.buffer(); seen.push([r.url().split('/').slice(-2).join('/'), r.status(), buf.length]) } catch { seen.push([r.url().split('/').pop(), r.status(), -1]) } })
await p.goto((process.env.CHECK_BASE || 'http://127.0.0.1:4173') + (process.argv[2] || '/'), { waitUntil: 'networkidle0' })
for (const s of seen.sort((a, c) => c[2] - a[2]).slice(0, 14)) console.log(s.join('  '))
console.log('total', seen.reduce((a, s) => a + Math.max(0, s[2]), 0), 'responses', seen.length)
await b.close()
