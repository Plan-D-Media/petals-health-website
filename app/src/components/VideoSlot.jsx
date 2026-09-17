import { useEffect, useRef, useState } from 'react'
import './VideoSlot.css'

// A media slot that renders a poster image first and, when a source exists, a muted looping video on top of it.
//   poster / posterAlt  the still (always rendered: it is the first paint, the reduced-motion state and the fallback)
//   src                 optional video URL; null/'' → poster only, no player, no request
//   label               accessible name for the play/pause control
// Behaviour
//   - lazy: the <video> gets its src only once the slot is in the viewport (IntersectionObserver)
//   - muted autoplay loop, playsinline; the video fades in over the poster once it is actually playing
//   - prefers-reduced-motion: no autoplay and nothing is preloaded; the poster stays, the control offers a manual play
//   - a source that fails to load unmounts the video and hides the control; the poster stays (no broken player)
//   - visible play/pause control (aria-label reflects the state)
export default function VideoSlot({ poster, posterAlt = '', src, label = 'video', className = '' }) {
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

  useEffect(() => {
    if (!src || armed || !root.current) return undefined
    if (!('IntersectionObserver' in window)) { setArmed(true); return undefined }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setArmed(true); io.disconnect() }
    }, { rootMargin: '200px' })
    io.observe(root.current)
    return () => io.disconnect()
  }, [src, armed])

  // autoplay once the browser can play, unless the user prefers reduced motion
  const onCanPlay = () => {
    setStatus((s) => (s === 'poster' ? 'ready' : s))
    if (!reduced && video.current && video.current.paused) video.current.play().catch(() => {})   // autoplay refusal → poster + control
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
    <div ref={root} className={`video-slot video-slot--${status} ${className}`.trim()}>
      <img className="video-slot__poster" src={poster} alt={posterAlt} />
      {hasVideo && (
        <video
          ref={video}
          className="video-slot__video"
          src={src}
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
