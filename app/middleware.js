// Vercel Edge Middleware. STAGING ONLY: when the project has STAGING_USER / STAGING_PASS set, every request needs
// HTTP Basic auth (the browser asks once and remembers for the session) and gets an X-Robots-Tag: noindex header.
// With those variables unset (a production project) it does nothing.
export const config = { matcher: '/:path*' }
export default function middleware(request) {
  const user = process.env.STAGING_USER, pass = process.env.STAGING_PASS
  if (!user || !pass) return
  const auth = request.headers.get('authorization') || ''
  if (auth.startsWith('Basic ')) {
    try { const [u, p] = atob(auth.slice(6)).split(':'); if (u === user && p === pass) return } catch { /* malformed header: prompt again */ }
  }
  return new Response('Petals Health staging preview: sign in required.', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Petals Health staging"', 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' } })
}
