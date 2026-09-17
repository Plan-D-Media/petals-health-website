import './CaringBlock.css'

// Round 3, item 6 — replaces the Family Health Card panel: the original hero photo (the mother-and-baby cut-out with its
// luminance mask, design/hero-values.md) beside the original hero headline and paragraph.
// COPY PENDING: the client calls this the "Complete IWC integrated concept"; the meaning of IWC and the final copy are
// with the client. The heading and paragraph below are the original hero's, unchanged.
export default function CaringBlock() {
  return (
    <section className="caring band" aria-labelledby="caring-title">
      <div className="inner caring__inner">
        <div className="caring__photo" data-overlap-ok>
          <img src="/assets/2_04c0f486.png" alt="A mother holding her smiling baby" decoding="async" />
        </div>
        <div className="caring__copy">
          <h2 id="caring-title" className="caring__title">
            <span className="caring__line caring__line--primary">Caring for All,</span>
            <span className="caring__line caring__line--accent">You Care About</span>
          </h2>
          <p className="caring__body">
            From fertility and pregnancy to paediatric care, diagnostics and specialist services for
            the whole family, everything you need is available under one trusted roof.
          </p>
          <span className="pending" title="Final copy pending the client (the 'Complete IWC integrated concept')">Copy pending</span>
        </div>
      </div>
    </section>
  )
}
