import './Process.css'

// Home section 3 — "SIMPLE PROCESS / From search to care in minutes". Design pass 2026-09-17: a single-row strip
// (ring + title + description side by side) on a soft tint band, 320 tall — the section steps back so the doctor band
// and the health-card panel dominate. All four steps are rings (design/decisions.md). Copy unchanged.

const STEPS = [
  { n: '1', title: 'Search & choose', desc: 'Find the right doctor or test by specialty, location, or concern.' },
  { n: '2', title: 'Book a slot', desc: 'Pick a time that works for you — online, by phone, or via our app.' },
  { n: '3', title: 'Visit or consult', desc: 'In-clinic or video consultation with your chosen specialist.' },
  { n: '4', title: 'Get your reports', desc: 'Digital prescriptions and lab reports delivered instantly.' },
]

export default function Process() {
  return (
    <section className="process band" aria-labelledby="process-title">
      <div className="inner process__inner">
        <p className="process__eyebrow">Simple process</p>
        <h2 id="process-title" className="process__title">From search to care in minutes</h2>
        <ol className="process__steps">
          {STEPS.map((s) => (
            <li key={s.n} className="step" data-reveal data-reveal-order={Number(s.n) - 1}>
              <div className="step__circle">{s.n}</div>
              <div className="step__text">
                <div className="step__title">{s.title}</div>
                <p className="step__desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
