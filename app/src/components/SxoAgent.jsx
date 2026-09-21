import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { SXO } from '../config.js'
import COPY from '../content/sxo.js'
import { track } from '../analytics.js'
import Img from './Img.jsx'
import './SxoAgent.css'
const LeadForm = lazy(() => import('./LeadForm.jsx'))

// SXO lead-capture agent (design/round2-report.md §6; built 2026-09-21 against the placeholder endpoint).
// First appearance: after SXO.firstAppearance.delayMs, OR at scrollPct of the page, OR on exit intent (pointer leaves
// through the top edge; desktop only) — whichever comes first. Then a prompt card with two qualifying questions
// (who is it for, what do you need), the sxo-agent lead form (name, mobile, gender, age, preferred doctor, date; the
// consent line and privacy link are the form's own), and the form's thank-you.
// Session state (sessionStorage 'petals.sxo'): dismissed → nothing again this tab session; completed → same.
// Test hooks: ?sxo=now (show at once), ?sxo=reset (clear the session flags), ?sxoDelay=<ms>.
// Non-modal: it never takes the page away; Escape or "Not now" dismisses; focus goes to the card on open and back
// to where it was on close. Reduced motion: no slide, just appears.

const KEY = 'petals.sxo'
const readState = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || '{}') } catch { return {} } }
const writeState = (patch) => { try { sessionStorage.setItem(KEY, JSON.stringify({ ...readState(), ...patch })) } catch { /* storage unavailable */ } }
const param = (k) => (typeof location !== 'undefined' ? new URLSearchParams(location.search).get(k) : null)

export default function SxoAgent() {
  const [phase, setPhase] = useState('hidden')        // hidden | prompt | who | need | form
  const [trigger, setTrigger] = useState('')
  const [answers, setAnswers] = useState({ who: '', need: '' })
  const card = useRef(null)
  const returnTo = useRef(null)

  // ---- first appearance ----
  useEffect(() => {
    if (!SXO.enabled) return undefined
    if (param('sxo') === 'reset') sessionStorage.removeItem(KEY)
    const st = readState()
    if (st.dismissed || st.completed) return undefined
    const cfg = SXO.firstAppearance
    let fired = false
    const timers = []
    const show = (why) => { if (fired) return; fired = true; cleanup(); setTrigger(why); setPhase('prompt'); writeState({ shownAt: Date.now(), trigger: why }); track('sxo_shown', { trigger: why }) }
    const onScroll = () => { const max = document.documentElement.scrollHeight - innerHeight; if (max > 0 && (scrollY / max) * 100 >= cfg.scrollPct) show('scroll') }
    const onLeave = (e) => { if (e.clientY <= 0 && matchMedia('(pointer: fine)').matches) show('exit') }
    const cleanup = () => { timers.forEach(clearTimeout); removeEventListener('scroll', onScroll); document.removeEventListener('mouseleave', onLeave) }
    if (param('sxo') === 'now') { timers.push(setTimeout(() => show('forced'), 300)); return cleanup }
    const delay = Number(param('sxoDelay')) || cfg.delayMs
    if (delay > 0) timers.push(setTimeout(() => show('timer'), delay))
    if (cfg.scrollPct > 0) addEventListener('scroll', onScroll, { passive: true })
    if (cfg.exitIntent) document.addEventListener('mouseleave', onLeave)
    return cleanup
  }, [])

  const dismiss = useCallback(() => { writeState({ dismissed: true }); track('sxo_dismissed', { phase }); setPhase('hidden'); returnTo.current?.focus?.() }, [phase])

  // focus: into the card on open and on every step (a clicked chip unmounts, so focus would fall to <body>); back
  // to where it was on close. Escape dismisses.
  const open = phase !== 'hidden'
  useEffect(() => { if (open) returnTo.current = document.activeElement }, [open])
  useEffect(() => { if (open) requestAnimationFrame(() => (card.current?.querySelector('.sxo__primary, .sxo__chip, input') || card.current)?.focus()) }, [phase, open])
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') dismiss() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, dismiss])

  const complete = () => { writeState({ completed: true }); track('sxo_completed', answers) }
  const pick = (k, v, next) => { setAnswers((a) => ({ ...a, [k]: v })); track('sxo_step', { step: k, value: v }); setPhase(next) }

  if (phase === 'hidden') return null
  const section = `sxo:${answers.who || '-'}:${answers.need || '-'}`
  return (
    <div className="sxo" data-phase={phase} data-overlap-ok>
      <section className="sxo__card" ref={card} tabIndex={-1} role="dialog" aria-label={COPY.prompt} aria-live="polite">
        <header className="sxo__head">
          <span className="sxo__avatar"><Img src="/assets/2_09c94b70.png" alt="" width="34" height="43" /></span>
          <span className="sxo__name">{COPY.name}</span>
          <button type="button" className="sxo__x" onClick={dismiss} aria-label={COPY.close}>×</button>
        </header>

        {phase === 'prompt' && (
          <div className="sxo__body">
            <p className="sxo__title">{COPY.prompt}</p>
            <p className="sxo__sub">{COPY.promptSub}</p>
            <div className="sxo__actions">
              <button type="button" className="sxo__primary" onClick={() => { track('sxo_step', { step: 'start', trigger }); setPhase('who') }}>Start</button>
              <button type="button" className="sxo__secondary" onClick={dismiss}>{COPY.dismiss}</button>
            </div>
          </div>
        )}

        {(phase === 'who' || phase === 'need') && (
          <div className="sxo__body">
            <p className="sxo__step">{phase === 'who' ? '1 of 2' : '2 of 2'}</p>
            <p className="sxo__title">{COPY[phase].question}</p>
            <div className="sxo__chips" role="group" aria-label={COPY[phase].question}>
              {COPY[phase].options.map((o) => <button key={o.id} type="button" className="sxo__chip" onClick={() => pick(phase, o.id, phase === 'who' ? 'need' : 'form')}>{o.label}</button>)}
            </div>
            <div className="sxo__actions sxo__actions--minor">
              {phase === 'need' && <button type="button" className="sxo__secondary" onClick={() => setPhase('who')}>{COPY.back}</button>}
              <button type="button" className="sxo__secondary" onClick={dismiss}>{COPY.dismiss}</button>
            </div>
          </div>
        )}

        {phase === 'form' && (
          <div className="sxo__body sxo__body--form">
            <p className="sxo__sub">{COPY.formIntro}</p>
            <Suspense fallback={<p className="sxo__sub">Loading…</p>}>
              <LeadForm form="sxo-agent" source={{ section }} autoFocus={false} hideTitle onSuccess={complete} />
            </Suspense>
            <p className="sxo__call"><a href="tel:9147405955">{COPY.callInstead}</a></p>
          </div>
        )}
      </section>
    </div>
  )
}
