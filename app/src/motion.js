// Motion layer (design/round2-report.md §5, decided 2026-09-17): one-time reveals for below-the-fold rows only.
// Elements carry data-reveal (optionally data-reveal-order="n" for a 60 ms stagger). An IntersectionObserver adds
// .is-revealed once at 20 % visibility; the CSS in styles/motion.css fades and rises 12 px over 240 ms, compositor-only.
// - html.js gates the hidden start state, so without JavaScript everything is simply visible.
// - prefers-reduced-motion: the observer is never created and the CSS never hides anything.
// - Nothing in the first viewport uses data-reveal.
export function initReveals() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.documentElement.classList.add('js')
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      e.target.classList.add('is-revealed'); io.unobserve(e.target)
    }
  }, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' })
  const arm = () => document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el) => io.observe(el))
  arm()
  // elements rendered later (carousel slides, route changes) get armed too
  new MutationObserver(arm).observe(document.body, { childList: true, subtree: true })
}
