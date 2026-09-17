import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import './Carousel.css'

// Shared carousel (testimonials, doctors). Takes an items array and a render function.
//   slideWidth / gap   px at the 1366 layout; the visible count is derived from the viewport width
//   autoplayMs         0 disables; autoplay pauses on hover and on focus-within, and is off under prefers-reduced-motion
//   label              accessible name (aria-roledescription="carousel")
// Behaviour
//   - arrows (buttons), pointer drag (pointer events, 40 px threshold, snaps to the nearest slide), ArrowLeft/Right,
//     Home/End on the region
//   - every slide is in the Tab order; focusing a slide that is not fully visible slides it into view once, and
//     autoplay stays paused while focus is inside — the carousel never moves under a keyboard user
//   - moves via controls are announced ("Slide n of N", polite); autoplay moves are not
//   - loops: after the last slide autoplay and the next arrow return to the first
export default function Carousel({ items, renderItem, slideWidth, gap = 24, autoplayMs = 5000, label, className = '', startAt = 0, edgeArrows = false }) {
  const id = useId()
  const viewport = useRef(null)
  const track = useRef(null)
  const [index, setIndex] = useState(startAt)
  const [visible, setVisible] = useState(1)
  const [paused, setPaused] = useState(false)
  const [dragX, setDragX] = useState(0)          // live drag offset in px
  const drag = useRef(null)
  const [announce, setAnnounce] = useState('')
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const n = items.length
  const step = slideWidth + gap
  const maxIndex = Math.max(0, n - visible)

  // visible count from the viewport width
  useEffect(() => {
    const el = viewport.current; if (!el) return undefined
    const measure = () => setVisible(Math.max(1, Math.floor((el.clientWidth + gap) / step)))
    measure()
    const ro = new ResizeObserver(measure); ro.observe(el)
    return () => ro.disconnect()
  }, [gap, step])

  const goTo = useCallback((i, { announceIt = true } = {}) => {
    const clamped = ((i % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1)
    setIndex(clamped)
    if (announceIt) setAnnounce(`Slide ${clamped + 1} of ${maxIndex + 1}`)
  }, [maxIndex])
  const next = useCallback((opts) => goTo(index + 1, opts), [goTo, index])
  const prev = useCallback((opts) => goTo(index - 1, opts), [goTo, index])

  // autoplay
  useEffect(() => {
    if (!autoplayMs || reduced || paused || n <= visible) return undefined
    const t = setInterval(() => goTo(index + 1, { announceIt: false }), autoplayMs)
    return () => clearInterval(t)
  }, [autoplayMs, reduced, paused, n, visible, index, goTo])

  // keyboard on the region
  const onKey = (e) => {
    if (e.target.closest('input, textarea, select')) return
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); next(); break
      case 'ArrowLeft': e.preventDefault(); prev(); break
      case 'Home': e.preventDefault(); goTo(0); break
      case 'End': e.preventDefault(); goTo(maxIndex); break
      default:
    }
  }
  // a focused slide that is off-screen slides into view (once), and focus inside pauses autoplay
  const onFocusIn = (e) => {
    setPaused(true)
    const slide = e.target.closest('[data-slide]'); if (!slide) return
    const i = Number(slide.dataset.slide)
    if (i < index) goTo(i, { announceIt: false })
    else if (i >= index + visible) goTo(i - visible + 1, { announceIt: false })
  }
  const onFocusOut = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false) }

  // pointer drag
  const onPointerDown = (e) => {
    if (e.button !== 0 || e.target.closest('a, button')) return
    drag.current = { x: e.clientX, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 4) drag.current.moved = true
    setDragX(dx)
  }
  const endDrag = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    drag.current = null; setDragX(0)
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1))
  }

  const offset = -index * step + dragX
  return (
    <section
      className={`carousel${edgeArrows ? ' carousel--edge' : ''} ${className}`.trim()}
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKey}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { if (!viewport.current?.contains(document.activeElement)) setPaused(false) }}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
    >
      <div
        ref={viewport}
        className="carousel__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ul
          ref={track}
          className={`carousel__track${drag.current ? ' carousel__track--dragging' : ''}`}
          style={{ gap, transform: `translate3d(${offset}px, 0, 0)` }}
          id={`${id}-track`}
        >
          {items.map((it, i) => (
            <li key={it.id ?? i} className="carousel__slide" style={{ width: slideWidth }} data-slide={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`}>
              {renderItem(it, i)}
            </li>
          ))}
        </ul>
      </div>
      <button type="button" className="carousel__btn carousel__btn--prev" onClick={() => prev()} aria-label="Previous"><Icon name="chevron" /></button>
      <button type="button" className="carousel__btn carousel__btn--next" onClick={() => next()} aria-label="Next"><Icon name="chevron" /></button>
      <div className="carousel__status" aria-live="polite" aria-atomic="true">{announce}</div>
    </section>
  )
}
