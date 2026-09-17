import { Arrow } from './Specialists.jsx'
import './Insights.css'

// Home section 7 — "HEALTH INSIGHTS / Latest from our doctors". Content: design/sections5-8-values.md §7.

const ARTICLES = [
  { topic: 'IVF Treatment', title: 'Is IVF Right for You? Signs, Eligibility & Expert Advice', meta: 'Jun 4, 2026 · 6 min read' },
  { topic: 'Gynaecology', title: 'Your Periods Aren’t Supposed to Be Painful — When Cramping Signals Something More', meta: 'Feb 13, 2026 · 5 min read' },
  { topic: 'Paediatrics', title: 'Child Fever Guide: When Home Care Is Enough and When It’s Not', meta: 'May 14, 2026 · 4 min read' },
]

export default function Insights() {
  return (
    <section className="insights band" aria-labelledby="insights-title">
      <div className="inner insights__inner">
        <p className="insights__eyebrow">Health insights</p>
        <h2 id="insights-title" className="insights__title">Latest from our doctors</h2>
        <p className="insights__subline">Evidence-based health advice written by our specialists {'—'} in plain language.</p>
        <div className="insights__cards">
          {ARTICLES.map((a, i) => (
            <article key={a.topic} className="post" data-reveal data-reveal-order={i}>
              <span className="post__top" aria-hidden="true" />
              <h3 className="post__topic">{a.topic}</h3>
              <p className="post__title">{a.title}</p>
              <p className="post__meta">{a.meta}</p>
            </article>
          ))}
        </div>
        <div className="insights__foot">
          <a className="insights__more btn-soft" href="#articles">Read More Articles <Arrow /></a>
        </div>
      </div>
    </section>
  )
}
