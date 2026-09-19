import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './styles/states.css'
import './styles/motion.css'
import { initReveals } from './motion.js'
import { pageFor } from './routes.jsx'
import { applyMeta } from './seo.js'
import { initAnalytics } from './analytics.js'


const page = pageFor(window.location.pathname)   // may rewrite the path (static-fallback ?__p=)
applyMeta(window.location.pathname)
initAnalytics()
initReveals()   // reveal layer: below-the-fold rows only; no-op under prefers-reduced-motion (design/decisions.md)
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={null}>{page}</Suspense>
  </React.StrictMode>,
)
