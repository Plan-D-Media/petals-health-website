// Tab into the Home doctor marquee from the element before it and watch where focus goes; check a focused card link
// keeps focus when the marquee flips to manual mode.
import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: 'new', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: 1366, height: 900 })
await p.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' })
await p.evaluate(() => { document.querySelectorAll('.doctor__book').forEach((a, i) => { a.dataset.n = i }); const btns = document.querySelectorAll('.stories__marquee .marquee__btn'); btns[btns.length - 1].focus(); window.__m = document.querySelector('.specialists .marquee') })
for (let i = 0; i < 4; i++) {
  await p.keyboard.press('Tab'); await new Promise((r) => setTimeout(r, 250))
  console.log(await p.evaluate(() => { const el = document.activeElement; return `tab ${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} n=${el.dataset.n} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)}" manual=${window.__m.classList.contains('marquee--manual')} inMarquee=${!!el.closest('.marquee')}` }))
}
const keep = await p.evaluate(async () => { document.activeElement.blur(); window.__m.classList.remove('x'); const a = document.querySelectorAll('.specialists .marquee__item:not(.marquee__item--dup) .doctor__book')[3]; a.focus(); await new Promise((r) => setTimeout(r, 400)); return { still: document.activeElement === a, active: document.activeElement.tagName + '.' + (document.activeElement.className || '').toString().split(' ')[0], manual: window.__m.classList.contains('marquee--manual'), sameNode: document.querySelectorAll('.specialists .marquee__item:not(.marquee__item--dup) .doctor__book')[3] === a } })
console.log('focus a card link directly:', JSON.stringify(keep))
await b.close()
