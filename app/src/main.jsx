import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './styles/polish.css'

// Polish proposals are opt-in until approved: ?polish=1 (see styles/polish.css)
if (new URLSearchParams(window.location.search).get('polish')) document.documentElement.dataset.polish = 'on'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
