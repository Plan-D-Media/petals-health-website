// Find a Doctor journey at 1366 and 390: filter, search, sort, paginate, share the URL, open a profile, come back.
import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.CHECK_BASE || 'http://127.0.0.1:4173'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const issues = []
for (const width of [1366, 390]) {
  const page = await browser.newPage()
  await page.setViewport({ width, height: width < 1024 ? 844 : 900, isMobile: width < 768, hasTouch: width < 768 })
  page.on('pageerror', (e) => issues.push(`${width}: pageerror ${e.message}`))
  const state = () => page.evaluate(() => ({ url: location.search, count: document.querySelector('.fd__count')?.textContent, names: [...document.querySelectorAll('.drow__name')].map((n) => n.textContent.trim()), counts: Object.fromEntries([...document.querySelectorAll('.facet__opt')].map((o) => [o.querySelector('.facet__label').textContent, o.querySelector('.facet__count').textContent])), page: document.querySelector('.pager__num--on')?.textContent, pages: document.querySelectorAll('.pager__num').length, active: document.querySelector('.fd__badge')?.textContent || '0' }))
  await page.goto(BASE + '/find-a-doctor/', { waitUntil: 'networkidle0' })
  const s0 = await state(); console.log(width, 'initial', s0.count, 'pages', s0.pages, s0.names.join(' | '))
  if (s0.names.length !== 6 || s0.pages !== 2) issues.push(`${width}: initial list expected 6 rows / 2 pages, got ${s0.names.length}/${s0.pages}`)
  if (s0.names.join() !== [...s0.names].sort((a, b) => a.localeCompare(b)).join()) issues.push(`${width}: default sort not A–Z`)
  // paginate
  await page.click('.pager__arrow:last-of-type'); await wait(200)
  const s1 = await state(); console.log(width, 'page 2', s1.url, s1.names.join(' | '))
  if (s1.page !== '2' || s1.names.length !== 1 || !s1.url.includes('page=2')) issues.push(`${width}: page 2 wrong (${s1.page}, ${s1.names.length} rows, url ${s1.url})`)
  if (!(await page.evaluate(() => document.querySelector('.pager__arrow:last-of-type').disabled))) issues.push(`${width}: Next not disabled on the last page`)
  // filter: clinic Kankurgachi → resets to page 1
  await page.evaluate(() => [...document.querySelectorAll('.facet__opt')].find((o) => o.textContent.includes('Kankurgachi')).querySelector('input').click()); await wait(200)
  const s2 = await state(); console.log(width, 'Kankurgachi', s2.url, s2.count, s2.names.join(' | '), 'counts', JSON.stringify(s2.counts).slice(0, 160))
  if (s2.names.length !== 4 || s2.url !== '?c=kankurgachi') issues.push(`${width}: clinic filter gave ${s2.names.length} rows, url ${s2.url}`)
  if (s2.counts['Loudon Street (CMC)'] !== '2') issues.push(`${width}: other clinic counts should ignore the clinic selection (Loudon ${s2.counts['Loudon Street (CMC)']})`)
  if (s2.counts['Woman & Child'] !== '3') issues.push(`${width}: specialty count under clinic filter expected 3, got ${s2.counts['Woman & Child']}`)
  // + specialty Woman & Child
  await page.evaluate(() => [...document.querySelectorAll('.facet__opt')].find((o) => o.textContent.includes('Woman & Child')).querySelector('input').click()); await wait(200)
  const s3 = await state(); console.log(width, '+Woman&Child', s3.url, s3.names.join(' | '))
  if (s3.names.length !== 3) issues.push(`${width}: clinic+specialty expected 3 rows, got ${s3.names.length}`)
  // search
  await page.type('.fd__search input', 'subh'); await wait(300)
  const s4 = await state(); console.log(width, 'search subh', s4.url, s4.names.join(' | '))
  if (s4.names.length !== 1 || !s4.names[0].includes('Subhra')) issues.push(`${width}: search "subh" gave ${s4.names.join(',')}`)
  // sort
  await page.evaluate(() => { const i = document.querySelector('.fd__search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ''); i.dispatchEvent(new Event('input', { bubbles: true })) }); await wait(200)
  await page.select('.fd__sort select', 'name-desc'); await wait(200)
  const s5 = await state(); console.log(width, 'sort Z-A', s5.url, s5.names.join(' | '))
  if (s5.names.join() !== [...s5.names].sort((a, b) => b.localeCompare(a)).join() || !s5.url.includes('sort=name-desc')) issues.push(`${width}: sort Z–A wrong (${s5.names.join(',')}; ${s5.url})`)
  // share URL: open fresh
  const shared = BASE + '/find-a-doctor/' + s5.url
  const p2 = await browser.newPage(); await p2.setViewport({ width, height: 900 }); await p2.goto(shared, { waitUntil: 'networkidle0' })
  const s6 = await p2.evaluate(() => ({ names: [...document.querySelectorAll('.drow__name')].map((n) => n.textContent.trim()), checked: [...document.querySelectorAll('.facet__opt input:checked')].length, sort: document.querySelector('.fd__sort select').value, badge: document.querySelector('.fd__badge')?.textContent }))
  console.log(width, 'shared url reopened', JSON.stringify(s6))
  if (s6.names.join() !== s5.names.join() || s6.checked !== 2 || s6.sort !== 'name-desc') issues.push(`${width}: shared URL did not restore the state (${JSON.stringify(s6)})`)
  await p2.close()
  // rating filter and clear
  await page.evaluate(() => document.querySelectorAll('.facet__star-opt input')[1].click()); await wait(200)   // 4.5 & up
  const s7 = await state(); console.log(width, 'rating 4.5+', s7.url, s7.names.join(' | '))
  if (s7.names.length !== 3 || !s7.url.includes('r=4.5')) issues.push(`${width}: rating filter 4.5+ gave ${s7.names.length} rows (${s7.url})`)
  await page.evaluate(() => document.querySelectorAll('.facet__star-opt input')[1].click()); await wait(200)   // click again → off
  const s7b = await state(); if (s7b.url.includes('r=')) issues.push(`${width}: clicking the selected rating again did not clear it`)
  await page.click('.fd__clear'); await wait(200)
  const s8 = await state(); console.log(width, 'cleared', s8.url, s8.count, 'active', s8.active)
  if (s8.url !== '?sort=name-desc' || s8.names.length !== 6) issues.push(`${width}: Clear filters left ${s8.url}, ${s8.names.length} rows`)
  // empty state
  await page.type('.fd__search input', 'zzzz'); await wait(300)
  const empty = await page.evaluate(() => ({ empty: !!document.querySelector('.fd__empty'), cta: document.querySelector('.fd__empty a')?.dataset.form, count: document.querySelector('.fd__count')?.textContent }))
  console.log(width, 'empty', JSON.stringify(empty)); if (!empty.empty) issues.push(`${width}: no empty state for a zero-result search`)
  await page.evaluate(() => { const i = document.querySelector('.fd__search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ''); i.dispatchEvent(new Event('input', { bubbles: true })) }); await wait(200)
  // availability filter today
  await page.evaluate(() => [...document.querySelectorAll('.facet__opt')].find((o) => o.textContent.includes('Available Today')).querySelector('input').click()); await wait(200)
  const s9 = await state(); console.log(width, 'today', s9.url, s9.count)
  // open a profile and come back
  const beforeUrl = await page.evaluate(() => location.href)
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('.drow__profile')])
  const prof = await page.evaluate(() => ({ url: location.pathname, h1: document.querySelector('h1')?.textContent, crumb: document.querySelector('.dp-hero__crumb')?.textContent, bookDoctor: document.querySelector('.dp-hero__cta')?.dataset.doctor }))
  console.log(width, 'profile', JSON.stringify(prof))
  if (!prof.url.startsWith('/doctors/')) issues.push(`${width}: View Profile went to ${prof.url}`)
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.goBack()])
  const back = await page.evaluate(() => ({ href: location.href, rows: document.querySelectorAll('.drow').length, checked: document.querySelectorAll('.facet__opt input:checked').length, scrollY }))
  console.log(width, 'back', JSON.stringify(back))
  if (back.href !== beforeUrl) issues.push(`${width}: back from the profile lost the URL state (${back.href} vs ${beforeUrl})`)
  if (back.checked !== 2) issues.push(`${width}: back from the profile lost the filters (${back.checked} checked)`)
  // breadcrumb link from the profile → list keeps nothing (expected) but works
  await page.goto(BASE + '/doctors/smita-gutgutia/', { waitUntil: 'networkidle0' })
  const crumbOk = await page.evaluate(() => document.querySelector('.dp-hero__crumb a[href="/find-a-doctor"]') !== null)
  if (!crumbOk) issues.push(`${width}: profile breadcrumb has no Find a Doctor link`)
  // View clinic → /clinics#clinic-… lands on the card
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('.dp__clinic a')])
  const clinicLand = await page.evaluate(() => ({ url: location.pathname + location.hash, target: !!document.querySelector(location.hash || 'x'), y: scrollY }))
  console.log(width, 'view clinic', JSON.stringify(clinicLand))
  if (!clinicLand.target || clinicLand.y < 100) issues.push(`${width}: View clinic did not land on the clinic card (${JSON.stringify(clinicLand)})`)
  await page.close()
}
console.log('\nISSUES:'); for (const i of issues) console.log('- ' + i); if (!issues.length) console.log('- none')
await browser.close()
