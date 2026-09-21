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
import { landOnHash } from './hash.js'
import { STAGING } from './config.js'


const page = pageFor(window.location.pathname)   // may rewrite the path (static-fallback ?__p=)
applyMeta(window.location.pathname)
initAnalytics()
landOnHash()
initReveals()   // reveal layer: below-the-fold rows only; no-op under prefers-reduced-motion (design/decisions.md)
if (STAGING) { const r = document.createElement('div'); r.className = 'staging-ribbon'; r.setAttribute('role', 'note'); r.textContent = 'Preview build — doctors, patient stories and some copy are placeholders'; document.body.prepend(r) }
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={null}>{page}</Suspense>
  </React.StrictMode>,
)
