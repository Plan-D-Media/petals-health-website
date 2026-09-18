import { useEffect, useId, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import './Marquee.css'

// Continuous marquee (round 3, items 4–5). The track is rendered twice and translated by −50 % (direction 'left') or
// from −50 % to 0 ('right') with one CSS keyframe; the duration comes from the measured track width and `speed` (px/s),
// so no script runs per frame.
//   Pause: hover and focus-within set animation-play-state: paused.
//   Keyboard / reduced motion: "manual" mode — the animation is removed, the viewport becomes a scrollable row, the
//   arrows scroll one card, and a focused card scrolls into view. Manual is on permanently under
//   prefers-reduced-motion and switches on while focus is inside the region, so every card is reachable in every mode.
//   The duplicate set is aria-hidden and out of the Tab order.
export default function Marquee({ items, renderItem, direction = 'left', speed = 40, label, className = '' }) {
  const id = useId()
  const viewport = useRef(null)
  const track = useRef(null)
  const [duration, setDuration] = useState(60)
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [manual, setManual] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = (e) => setReduced(e.matches); mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => {
    const el = track.current; if (!el) return undefined
    const measure = () => { const half = el.scrollWidth / 2; if (half > 0) setDuration(half / speed) }
    measure()
    const ro = new ResizeObserver(measure); ro.observe(el)
    return () => ro.disconnect()
  }, [speed, items.length])

  const isStatic = items.length < 3
  const isManual = manual || reduced || isStatic
  const step = (dir) => {
    const vp = viewport.current; if (!vp) return
    const slide = vp.querySelector('.marquee__item'); const w = slide ? slide.getBoundingClientRect().width + 24 : 320
    vp.scrollBy({ left: dir * w, behavior: reduced ? 'auto' : 'smooth' })
  }
  const onFocusIn = (e) => {
    setManual(true)
    const item = e.target.closest('.marquee__item')
    if (item) requestAnimationFrame(() => item.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduced ? 'auto' : 'smooth' }))
  }
  const onFocusOut = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setManual(false) }
  const onKey = (e) => {
    if (e.target.closest('input, textarea, select')) return
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
  }

  return (
    <section
      className={`marquee marquee--${direction}${isManual ? ' marquee--manual' : ''}${isStatic ? ' marquee--static' : ''} ${className}`.trim()}
      aria-roledescription="marquee" aria-label={label}
      style={{ '--marquee-duration': `${duration}s` }}
      onFocus={onFocusIn} onBlur={onFocusOut} onKeyDown={onKey}
    >
      <div className="marquee__viewport" ref={viewport} id={`${id}-vp`}>
        <ul className="marquee__track" ref={track}>
          {items.map((it, i) => <li key={it.id ?? i} className="marquee__item">{renderItem(it, i)}</li>)}
          {!isManual && items.map((it, i) => <li key={'dup-' + (it.id ?? i)} className="marquee__item marquee__item--dup" aria-hidden="true" inert="">{renderItem(it, i)}</li>)}
        </ul>
      </div>
      <div className="marquee__controls">
        <button type="button" className="marquee__btn" onClick={() => step(-1)} aria-label="Scroll back" aria-controls={`${id}-vp`}><Icon name="chevron" /></button>
        <span className="marquee__hint" aria-hidden="true">{isManual ? 'Scroll' : 'Hover to pause'}</span>
        <button type="button" className="marquee__btn marquee__btn--next" onClick={() => step(1)} aria-label="Scroll forward" aria-controls={`${id}-vp`}><Icon name="chevron" /></button>
      </div>
    </section>
  )
}
