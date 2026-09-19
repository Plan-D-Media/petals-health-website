// Hash links into a route (e.g. /clinics#clinic-tollygunge from a profile's "View clinic"): the browser tries to
// scroll before React has rendered the target, so nothing happens. This waits for the element (up to 3 s, the route
// chunk arriving) and scrolls to it; [id] elements carry scroll-margin-top for the sticky bars (base.css).
export function landOnHash() {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (!id) return
  let tries = 0
  const go = () => {
    const el = document.getElementById(id)
    if (el) { el.scrollIntoView({ block: 'start' }); return }
    if (++tries < 60) setTimeout(go, 50)
  }
  requestAnimationFrame(go)
}
