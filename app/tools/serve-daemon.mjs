// Preview server supervisor. `node tools/serve-daemon.mjs start` spawns a detached, self-restarting server on 4173
// (a process outside the Claude session's task manager, which kills its own background tasks under memory pressure);
// `stop` ends it; `status` reports. The supervisor itself is the detached process: it respawns serve.mjs 2 s after
// any exit and writes .serve/log (outside dist, which every build empties). Uses ~40 MB total.
import { spawn } from 'node:child_process'
import { openSync, writeFileSync, readFileSync, existsSync, unlinkSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
const ROOT = resolve(import.meta.dirname, '..')
const PID = resolve(ROOT, '.serve', 'pid')
const LOG = resolve(ROOT, '.serve', 'log')
const cmd = process.argv[2] || 'status'
mkdirSync(resolve(ROOT, '.serve'), { recursive: true })

const alive = (pid) => { try { process.kill(pid, 0); return true } catch { return false } }
const readPid = () => (existsSync(PID) ? Number(readFileSync(PID, 'utf8')) : 0)

if (cmd === 'loop') {                       // the detached supervisor
  writeFileSync(PID, String(process.pid))
  const run = () => {
    const out = openSync(LOG, 'a')
    const child = spawn(process.execPath, [resolve(ROOT, 'tools', 'serve.mjs'), '4173'], { cwd: ROOT, stdio: ['ignore', out, out] })
    child.on('exit', (code) => { writeFileSync(LOG, `[supervisor] server exited ${code} at ${new Date().toISOString()}, restarting\n`, { flag: 'a' }); setTimeout(run, 2000) })
  }
  run()
} else if (cmd === 'start') {
  const pid = readPid()
  if (pid && alive(pid)) { console.log(`already running (supervisor pid ${pid})`); process.exit(0) }
  const child = spawn(process.execPath, [import.meta.filename, 'loop'], { cwd: ROOT, detached: true, stdio: 'ignore', windowsHide: true })
  child.unref()
  console.log(`started supervisor pid ${child.pid}; server on http://127.0.0.1:4173 (log: .serve/log)`)
} else if (cmd === 'stop') {
  const pid = readPid()
  if (pid && alive(pid)) { spawn('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' }); console.log(`stopped supervisor ${pid} and its server`) } else console.log('not running')
  if (existsSync(PID)) unlinkSync(PID)
} else {
  const pid = readPid()
  console.log(pid && alive(pid) ? `running (supervisor pid ${pid})` : 'not running')
}
