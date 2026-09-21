// Deploys the staging build to the Vercel staging project (private, noindex).
//   npx vercel login                          once per machine (opens the browser)
//   node tools/deploy-staging.mjs --setup     once: links the project and stores the sign-in in its environment
//   npm run deploy:staging                    every redeploy: Vercel builds from vercel.staging.json, prints the URL
// The sign-in (STAGING_USER / STAGING_PASS, read by middleware.js) is generated into .staging.json (gitignored) and
// lives in the Vercel project's environment; nothing secret is committed.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { randomBytes } from 'node:crypto'
const ROOT = resolve(import.meta.dirname, '..')
const PROJECT = 'petals-health-staging'
const CREDS = resolve(ROOT, '.staging.json')
const run = (cmd, opts = {}) => { console.log('> ' + cmd); const r = spawnSync(cmd, { shell: true, stdio: opts.input ? ['pipe', 'inherit', 'inherit'] : 'inherit', cwd: ROOT, input: opts.input }); if (r.status !== 0 && !opts.soft) process.exit(r.status || 1); return r }
if (!existsSync(CREDS)) {
  const words = ['lotus', 'petal', 'marigold', 'jasmine', 'saffron', 'monsoon', 'kolkata', 'ganges']
  const pw = `${words[randomBytes(1)[0] % words.length]}-${words[randomBytes(1)[0] % words.length]}-${randomBytes(2).toString('hex')}`
  writeFileSync(CREDS, JSON.stringify({ user: 'petals', pass: pw }, null, 2)); console.log('wrote .staging.json with a new password')
}
const creds = JSON.parse(readFileSync(CREDS, 'utf8'))
if (process.argv.includes('--setup')) {
  run(`npx vercel project add ${PROJECT}`, { soft: true })   // no-op if it already exists
  run(`npx vercel link --yes --project ${PROJECT}`)
  for (const [k, v] of [['STAGING_USER', creds.user], ['STAGING_PASS', creds.pass], ['STAGING', '1'], ['VITE_STAGING', '1']]) {
    run(`npx vercel env rm ${k} production --yes`, { soft: true })
    run(`npx vercel env add ${k} production`, { input: v + '\n' })
  }
}
run('npx vercel deploy --prod --yes --local-config vercel.staging.json')
console.log(`\nStaging sign-in: user "${creds.user}", password "${creds.pass}"`)
