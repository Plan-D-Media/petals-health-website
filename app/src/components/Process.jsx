import './Process.css'

// Home section 3 — "SIMPLE PROCESS / From search to care in minutes". Values: design/section3-values.md.
// Inner y = page y − 1600. Circle spacing regularised (deviation logged). Dashed connectors are CSS
// (the SVG has no vector dash path). TODO(breakpoints): desktop only.

const STEPS = [
  { n: '1', title: 'Search & choose', lines: ['Find the right doctor or', 'test by specialty, location,', 'or concern.'] },
  // The design fills step 2 on every stepper (Home: purple; Petals IVF: navy). Decided 2026-09-17: all rings — a solid
  // circle reads as a selection state with nothing selected (design/decisions.md; client note).
  { n: '2', title: 'Book a slot', lines: ['Pick a time that works', 'for you — online, by', 'phone, or via our app.'] },
  { n: '3', title: 'Visit or consult', lines: ['In-clinic or video', 'consultation with your', 'chosen specialist.'] },
  { n: '4', title: 'Get your reports', lines: ['Digital prescriptions', 'and lab reports', 'delivered instantly.'] },
]

export default function Process() {
  return (
    <section className="process band" aria-labelledby="process-title">
      <div className="inner process__inner">
      <p className="process__eyebrow">Simple process</p>
      <h2 id="process-title" className="process__title">
        From search to care in<br />minutes
      </h2>

      <ol className="process__steps">
        {STEPS.map((s, i) => (
          <li key={s.n} className={`step${s.filled ? ' step--filled' : ''}`} style={{ left: 190.9 + i * 296.17 }}>
            <div className="step__circle">{s.n}</div>
            {i < STEPS.length - 1 && <span className="step__connector" aria-hidden="true" />}
            <div className="step__title">{s.title}</div>
            <p className="step__desc">
              {s.lines.map((l, k) => (
                <span key={k}>{l}{k < s.lines.length - 1 && <br />}</span>
              ))}
            </p>
          </li>
        ))}
      </ol>
      </div>
    </section>
  )
}
