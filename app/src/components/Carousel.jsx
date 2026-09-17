import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import './Carousel.css'

// Shared carousel (testimonials, doctors). Takes an items array and a render function; slide width comes from CSS
// (the caller sets .carousel__slide width per breakpoint) and is measured from the DOM, so the same component works
// at every width.
//   autoplayMs   0 disables; pauses on hover and focus-within; off under prefers-reduced-motion and, by the caller's
//                choice, on small screens (autoplayBelow)
// Behaviour: arrows, pointer drag (40 px threshold, snaps), ArrowLeft/Right, Home/End; every slide is in the Tab order
// and a focused off-screen slide slides into view once; control moves are announced (polite); loops.
export default function Carousel({ items, renderItem, autoplayMs = 5000, autoplayBelow = 768, label, className = '', startAt = 0, edgeArrows = false, dots = true }) {
  const id = useId()
  const viewport = useRef(null)
  const [index, setIndex] = useState(startAt)
  const [visible, setVisible] = useState(1)
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [narrow, setNarrow] = useState(false)
  const drag = useRef(null)
  const [announce, setAnnounce] = useState('')
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const n = items.length
  const maxIndex = Math.max(0, n - visible)

  // measure the slide pitch and the visible count from the DOM
  useEffect(() => {
    const el = viewport.current; if (!el) return undefined
    const measure = () => {
      const slides = el.querySelectorAll('.carousel__slide')
      if (slides.length < 1) return
      const w = slides[0].getBoundingClientRect().width
      const pitch = slides.length > 1 ? slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left + dragX * 0 : w
      const gap = Math.max(0, pitch - w)
      setStep(pitch)
      setVisible(Math.max(1, Math.floor((el.clientWidth + gap + 1) / pitch)))
      setNarrow(window.innerWidth < autoplayBelow)
    }
    measure()
    const ro = new ResizeObserver(measure); ro.observe(el)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [n, autoplayBelow]) // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback((i, { announceIt = true } = {}) => {
    const m = maxIndex + 1
    const clamped = ((i % m) + m) % m
    setIndex(clamped)
    if (announceIt) setAnnounce(`Slide ${clamped + 1} of ${m}`)
  }, [maxIndex])
  const next = useCallback((o) => goTo(index + 1, o), [goTo, index])
  const prev = useCallback((o) => goTo(index - 1, o), [goTo, index])

  useEffect(() => {
    if (!autoplayMs || reduced || paused || narrow || n <= visible) return undefined
    const t = setInterval(() => goTo(index + 1, { announceIt: false }), autoplayMs)
    return () => clearInterval(t)
  }, [autoplayMs, reduced, paused, narrow, n, visible, index, goTo])

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
  const onFocusIn = (e) => {
    setPaused(true)
    const slide = e.target.closest('[data-slide]'); if (!slide) return
    const i = Number(slide.dataset.slide)
    if (i < index) goTo(i, { announceIt: false })
    else if (i >= index + visible) goTo(i - visible + 1, { announceIt: false })
  }
  const onFocusOut = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false) }

  const onPointerDown = (e) => {
    if (e.button !== 0 || e.target.closest('a, button')) return
    drag.current = { x: e.clientX }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => { if (drag.current) setDragX(e.clientX - drag.current.x) }
  const endDrag = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    drag.current = null; setDragX(0)
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1))
  }

  const offset = -index * step + dragX
  const pages = maxIndex + 1
  return (
    <section
      className={`carousel${edgeArrows ? ' carousel--edge' : ''} ${className}`.trim()}
      aria-roledescription="carousel" aria-label={label}
      onKeyDown={onKey}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { if (!viewport.current?.contains(document.activeElement)) setPaused(false) }}
      onFocus={onFocusIn} onBlur={onFocusOut}
    >
      <div ref={viewport} className="carousel__viewport" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <ul className={`carousel__track${drag.current ? ' carousel__track--dragging' : ''}`} style={{ transform: `translate3d(${offset}px, 0, 0)` }} id={`${id}-track`}>
          {items.map((it, i) => (
            <li key={it.id ?? i} className="carousel__slide" data-slide={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`}>
              {renderItem(it, i)}
            </li>
          ))}
        </ul>
      </div>
      <div className="carousel__controls">
        <button type="button" className="carousel__btn carousel__btn--prev" onClick={() => prev()} aria-label="Previous"><Icon name="chevron" /></button>
        {dots && (
          <div className="carousel__dots" aria-hidden="true">
            {Array.from({ length: pages }, (_, i) => <span key={i} className={'carousel__dot' + (i === index ? ' carousel__dot--on' : '')} />)}
          </div>
        )}
        <button type="button" className="carousel__btn carousel__btn--next" onClick={() => next()} aria-label="Next"><Icon name="chevron" /></button>
      </div>
      <div className="carousel__status" aria-live="polite" aria-atomic="true">{announce}</div>
    </section>
  )
}
