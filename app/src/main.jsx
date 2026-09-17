import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './styles/states.css'
import './styles/motion.css'
import { initReveals } from './motion.js'
import App from './App.jsx'


initReveals()   // reveal layer: below-the-fold rows only; no-op under prefers-reduced-motion (design/decisions.md)
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
