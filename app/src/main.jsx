import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './styles/states.css'
import './styles/polish2.css'
import App from './App.jsx'

// Polish pass 2 proposals are opt-in until approved: ?polish2=1 (see styles/polish2.css)
if (new URLSearchParams(window.location.search).get('polish2')) document.documentElement.dataset.polish2 = 'on'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
