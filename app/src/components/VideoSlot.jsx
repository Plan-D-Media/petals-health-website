import { useEffect, useRef, useState } from 'react'
import './VideoSlot.css'
import Img from './Img.jsx'

// A media slot that renders a poster image first and, when a source exists, a muted looping video on top of it.
//   poster / posterAlt  the still (always rendered: it is the first paint, the reduced-motion state and the fallback)
//   src                 optional video URL; null/'' → poster only, no player, no request
//   srcMobile           optional lighter encode for phones (<768)
//   label               accessible name for the play/pause control
// Behaviour
//   - lazy: the <video> gets its src only once the slot is in the viewport (IntersectionObserver)
//   - muted autoplay loop, playsinline; the video fades in over the poster once it is actually playing
//   - prefers-reduced-motion: no autoplay and nothing is preloaded; the poster stays, the control offers a manual play
//   - a source that fails to load unmounts the video and hides the control; the poster stays (no broken player)
//   - visible play/pause control (aria-label reflects the state)
export default function VideoSlot({ poster, posterAlt = '', src, srcMobile, label = 'video', className = '', variant = 'flush' }) {
  const root = useRef(null)
  const video = useRef(null)
  const [armed, setArmed] = useState(false)          // slot has entered the viewport → attach the source
  const [status, setStatus] = useState('poster')     // poster | ready | playing | paused | failed
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Where the video may play (2026-09-24; it was desktop-only since the 2026-09-19 page-weight pass): at every width,
  // except under Save-Data or on a connection the browser rates 3G or slower (Network Information API — Chromium only;
  // elsewhere it is allowed). Reduced motion keeps the poster and offers a manual play (preload none, below). Phones
  // (<768) get `srcMobile` when there is one. The source is attached only after the window load event and once the slot
  // is in view, so the clip never competes with the LCP image, CSS and script. Autoplay refused (iOS Low Power Mode,
  // browser policy) or a failed load leaves the poster in place.
  const [allow] = useState(() => {
    if (typeof window === 'undefined') return false
    const c = navigator.connection
    return !(c && (c.saveData || /^(slow-2g|2g|3g)$/.test(c.effectiveType || '')))
  })
  const [source] = useState(() => (srcMobile && typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches ? srcMobile : src))
  useEffect(() => {
    if (!src || armed || !allow || !root.current) return undefined
    let io; let timer
    const arm = () => { timer = setTimeout(() => setArmed(true), 800) }
    const whenVisible = () => {
      if (!('IntersectionObserver' in window)) { arm(); return }
      io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { arm(); io.disconnect() } }, { rootMargin: '200px' })
      io.observe(root.current)
    }
    if (document.readyState === 'complete') whenVisible(); else window.addEventListener('load', whenVisible, { once: true })
    return () => { io?.disconnect(); clearTimeout(timer); window.removeEventListener('load', whenVisible) }
  }, [src, armed, allow])

  // autoplay once the browser can play, unless the user prefers reduced motion
  const onCanPlay = () => {
    setStatus((s) => (s === 'poster' ? 'ready' : s))
    const saveData = typeof navigator !== 'undefined' && navigator.connection && navigator.connection.saveData
    if (!reduced && !saveData && video.current && video.current.paused) video.current.play().catch(() => {})   // autoplay refusal / data saver → poster + control
  }
  const onError = () => setStatus('failed')
  const toggle = () => {
    const v = video.current; if (!v) return
    if (v.paused) v.play().catch(() => {}); else v.pause()
  }

  const hasVideo = Boolean(src) && armed && status !== 'failed'
  const showsFrame = status === 'playing' || status === 'paused'
  const playing = status === 'playing'

  return (
    <div ref={root} className={`video-slot video-slot--${variant} video-slot--${status} ${className}`.trim()}>
      <Img className="video-slot__poster" src={poster} alt={posterAlt} priority />
      {hasVideo && (
        <video
          ref={video}
          className="video-slot__video"
          src={source}
          muted
          loop
          playsInline
          preload={reduced ? 'none' : 'auto'}
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={onCanPlay}
          onPlaying={() => setStatus('playing')}
          onPause={() => setStatus('paused')}
          onError={onError}
          onStalled={() => { if (!showsFrame) setStatus((s) => (s === 'poster' ? 'ready' : s)) }}
        />
      )}
      {hasVideo && (
        <button
          type="button"
          className="video-slot__control"
          onClick={toggle}
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
          aria-pressed={playing}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.5v11l9-5.5z" fill="currentColor" /></svg>
          )}
        </button>
      )}
    </div>
  )
}
