import { lazy, Suspense, useEffect, useState } from 'react'

// Opens the site search from any element with data-search="<source>" (the rail's Search, the compact header's
// search button). The overlay and its index load on first open — warmed when a trigger is hovered or focused —
// so a page that never opens search downloads none of it.
const load = () => import('./SearchDialog.jsx')
const SearchDialog = lazy(load)

export default function SearchLauncher() {
  const [req, setReq] = useState(null)   // { source, key, returnTo }
  useEffect(() => {
    const onClick = (e) => { const el = e.target.closest?.('[data-search]'); if (!el) return; e.preventDefault(); setReq({ source: el.dataset.search, key: Date.now(), returnTo: el }) }
    const warm = (e) => { if (e.target.closest?.('[data-search]')) load() }
    document.addEventListener('click', onClick)
    document.addEventListener('pointerover', warm)
    document.addEventListener('focusin', warm)
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('pointerover', warm); document.removeEventListener('focusin', warm) }
  }, [])
  return req ? <Suspense fallback={null}><SearchDialog req={req} /></Suspense> : null
}
