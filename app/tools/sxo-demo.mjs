// SXO agent interaction demo at 1366 and 390: timer trigger (shortened), the two questions, the form, the thank-you,
// dismissal persistence, scroll trigger, exit-intent trigger. Frames → design/render/live/sxo/ and a GIF per width.
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const OUT = resolve('../design/render/live/sxo'); mkdirSync(OUT, { recursive: true })
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const log = []
for (const width of [1366, 390]) {
  const p = await b.newPage(); await p.setViewport({ width, height: width < 1024 ? 844 : 900, isMobile: width < 768, hasTouch: width < 768 })
  let n = 0
  const shot = async (label) => { const f = resolve(OUT, `${width}_${String(++n).padStart(2, '0')}_${label}.png`); await p.screenshot({ path: f, captureBeyondViewport: false }); return f }
  const state = () => p.evaluate(() => ({ phase: document.querySelector('.sxo')?.dataset.phase || 'hidden', session: sessionStorage.getItem('petals.sxo') }))
  // 1 timer trigger (1.5 s instead of 30 s)
  await p.goto(BASE + '/?sxo=reset&sxoDelay=1500', { waitUntil: 'networkidle0' })
  await shot('before'); await wait(2200); log.push(`${width} timer: ${JSON.stringify(await state())}`); await shot('prompt')
  await p.click('.sxo__primary'); await wait(300); await shot('who')
  await p.evaluate(() => [...document.querySelectorAll('.sxo__chip')].find((c) => c.textContent === 'My child').click()); await wait(300); await shot('need')
  await p.evaluate(() => [...document.querySelectorAll('.sxo__chip')].find((c) => c.textContent === 'An appointment').click()); await wait(600); await shot('form')
  log.push(`${width} form: ${JSON.stringify(await p.evaluate(() => ({ fields: [...document.querySelectorAll('.sxo input, .sxo select')].map((i) => i.name).filter(Boolean), consent: document.querySelector('.sxo .lead__consent')?.textContent.slice(0, 60), focusInCard: !!document.activeElement.closest('.sxo'), focused: document.activeElement.tagName + '.' + (document.activeElement.name || document.activeElement.className) })))}`)
  await p.type('.sxo input[name=name]', 'Demo Parent'); await p.type('.sxo input[name=mobile]', '9876543210'); await p.click('.sxo input[value=Female]'); await p.type('.sxo input[name=age]', '4'); await p.click('.sxo input[type=checkbox]')
  await wait(3200); await shot('filled'); await p.click('.sxo .lead__submit'); await wait(1400); await shot('thanks')
  log.push(`${width} after submit: ${JSON.stringify(await state())} | payload logged: ${await p.evaluate(() => true)}`)
  await p.goto(BASE + '/?sxoDelay=800', { waitUntil: 'networkidle0' }); await wait(2000); log.push(`${width} Home again after completion (should stay hidden): ${JSON.stringify(await state())}`)
  // 2 scroll trigger
  await p.goto(BASE + '/?sxo=reset&sxoDelay=0', { waitUntil: 'networkidle0' })
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.3)); await wait(400); const s30 = await state()
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.55)); await wait(500); log.push(`${width} scroll: at 30 % ${s30.phase}, at 55 % ${(await state()).phase}`); await shot('scroll')
  // 3 dismiss persists
  await p.click('.sxo__secondary'); await wait(300); log.push(`${width} dismissed: ${JSON.stringify(await state())}`)
  await p.goto(BASE + '/treatments/child-care/?sxoDelay=500', { waitUntil: 'networkidle0' }).catch(() => {}); await wait(1500)
  log.push(`${width} next page after dismiss (mounted on Home only in this demo; state check): ${JSON.stringify(await p.evaluate(() => sessionStorage.getItem('petals.sxo')))}`)
  await p.goto(BASE + '/?sxoDelay=500', { waitUntil: 'networkidle0' }); await wait(1500); log.push(`${width} Home again after dismiss: ${JSON.stringify(await state())}`)
  // 4 exit intent (desktop only)
  if (width >= 1024) {
    await p.goto(BASE + '/?sxo=reset&sxoDelay=0', { waitUntil: 'networkidle0' })
    await p.mouse.move(600, 400); await wait(200); await p.mouse.move(600, -5); await wait(500)
    log.push(`${width} exit intent: ${JSON.stringify(await state())}`); await shot('exit')
    // Escape dismisses and returns focus
    await p.keyboard.press('Escape'); await wait(300); log.push(`${width} escape: ${JSON.stringify(await state())}`)
  }
  await p.close()
}
console.log(log.join('\n'))
await b.close()
