// Staging build: the normal build with STAGING=1 (postbuild: noindex pages, disallow-all robots, no sitemap) and
// VITE_STAGING=1 (app: noindex meta, simulated forms only, no analytics, preview ribbon). Used by Vercel for the
// staging project (vercel.staging.json) and by `npm run build:staging` locally.
import { spawnSync } from 'node:child_process'
const env = { ...process.env, STAGING: '1', VITE_STAGING: '1' }
for (const cmd of ['node tools/gen-meta.mjs', 'npx vite build', 'node tools/postbuild.mjs']) {
  const r = spawnSync(cmd, { shell: true, stdio: 'inherit', env })
  if (r.status !== 0) process.exit(r.status || 1)
}
