import { useEffect, useId, useRef } from 'react'
import Icon from './Icon.jsx'
import './NavMenu.css'

// Primary-nav dropdown (disclosure pattern with menu-style arrow keys). Geometry: design/svg/8.svg — the open tab
// takes the orange active fill, the panel hangs from the bar's bottom edge, left-aligned to the tab.
//
// Open:   hover (immediate), click/tap on the trigger (toggle), Enter / Space / ArrowDown (focus first item),
//         ArrowUp (focus last item).
// Move:   ArrowDown / ArrowUp cycle through items, Home / End jump; ArrowLeft / ArrowRight move to the neighbouring
//         top-level item (and open its menu if this one was open).
// Close:  Escape (focus returns to the trigger), pointer leaves the entry (200 ms grace for the diagonal move into
//         the panel), click / tap outside, Tab out, focus leaving the entry, the trigger being clicked again.
export default function NavMenu({ id, label, items, open, onOpen, onClose, onArrow, triggerRef }) {
  const menuId = useId()
  const root = useRef(null)
  const list = useRef(null)
  const btn = useRef(null)   // the trigger; triggerRef (a callback from Header) also receives it for ArrowLeft/Right
  const closeTimer = useRef(null)

  const links = () => Array.from(list.current?.querySelectorAll('a') ?? [])
  const focusItem = (i) => {
    const els = links(); if (!els.length) return
    els[((i % els.length) + els.length) % els.length].focus()
  }
  const openAndFocus = (i) => { onOpen(id); requestAnimationFrame(() => focusItem(i)) }

  // click / tap outside closes
  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => { if (root.current && !root.current.contains(e.target)) onClose() }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [open, onClose])
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const onTriggerKey = (e) => {
    switch (e.key) {
      case 'Enter': case ' ': case 'ArrowDown': e.preventDefault(); openAndFocus(0); break
      case 'ArrowUp': e.preventDefault(); openAndFocus(-1); break
      case 'Escape': if (open) { e.preventDefault(); onClose() } break
      case 'ArrowLeft': case 'ArrowRight': e.preventDefault(); onArrow(id, e.key === 'ArrowRight' ? 1 : -1, open); break
      default:
    }
  }
  const onMenuKey = (e) => {
    const els = links(); const i = els.indexOf(document.activeElement)
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusItem(i + 1); break
      case 'ArrowUp': e.preventDefault(); focusItem(i - 1); break
      case 'Home': e.preventDefault(); focusItem(0); break
      case 'End': e.preventDefault(); focusItem(-1); break
      case 'Escape': e.preventDefault(); onClose(); btn.current?.focus(); break
      case 'ArrowLeft': case 'ArrowRight': e.preventDefault(); onArrow(id, e.key === 'ArrowRight' ? 1 : -1, true); break
      case 'Tab': onClose(); break   // focus moves on naturally; the panel just closes
      default:
    }
  }

  const onPointerEnter = () => { clearTimeout(closeTimer.current); onOpen(id) }
  const onPointerLeave = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(onClose, 200) }
  const onFocusOut = (e) => { if (root.current && !root.current.contains(e.relatedTarget)) onClose() }

  return (
    <div
      className={'nav__entry' + (open ? ' nav__entry--open' : '')}
      ref={root}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={onFocusOut}
    >
      <button
        type="button"
        ref={(el) => { btn.current = el; triggerRef?.(el) }}
        className={'nav__item nav__item--trigger' + (open ? ' nav__item--open' : '')}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? onClose() : onOpen(id))}
        onKeyDown={onTriggerKey}
      >
        {label}
        <Icon name="chevron" className="nav__chevron" />
      </button>
      <ul
        id={menuId}
        ref={list}
        className={'nav__menu' + (open ? ' nav__menu--open' : '')}
        aria-label={label}
        onKeyDown={onMenuKey}
      >
        {items.map((it) => (
          <li key={it.label}>
            <a className="nav__menu-item" href={it.href} tabIndex={open ? 0 : -1}>{it.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
