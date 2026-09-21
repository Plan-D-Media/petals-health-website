// Quick live probe: prints the doctor-card avatar state and the Yoga photo-pair grid geometry.
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: 1366, height: 900 })
const errs = []; p.on('response', (r) => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url().split('/').pop()) })
await p.goto(BASE + '/treatments/multispecialty-clinic/', { waitUntil: 'networkidle0' })
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)) } })
await new Promise((r) => setTimeout(r, 600))
console.log(await p.evaluate(() => { const img = document.querySelector('.doctor__avatar img'); if (!img) return 'no avatar img'; const cs = getComputedStyle(img); return `avatar src=${img.currentSrc.split('/').pop()} natural=${img.naturalWidth}x${img.naturalHeight} complete=${img.complete} box=${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)} position=${cs.position} inset=${cs.inset} attrW=${img.getAttribute('width')}` }))
console.log('http errors:', errs.join(', ') || 'none')
await p.goto(BASE + '/treatments/yoga-wellness/', { waitUntil: 'networkidle0' })
console.log(await p.evaluate(() => { const g = document.querySelector('.tf__photos'); const cs = getComputedStyle(g); const kids = [...g.children].map((k) => k.tagName + ' ' + getComputedStyle(k).display + ' ' + Math.round(k.getBoundingClientRect().width) + 'x' + Math.round(k.getBoundingClientRect().height)); const imgs = [...g.querySelectorAll('img')].map((i) => Math.round(i.getBoundingClientRect().left) + ',' + Math.round(i.getBoundingClientRect().top) + ' ' + Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height) + ' attrW=' + i.getAttribute('width')); return `photos display=${cs.display} cols=${cs.gridTemplateColumns} width=${Math.round(g.getBoundingClientRect().width)} | children: ${kids.join(' ; ')} | imgs: ${imgs.join(' ; ')}` }))
await b.close()
