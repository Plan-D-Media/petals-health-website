import { useEffect } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FormDialog from '../components/FormDialog.jsx'
import { NAV } from '../components/Header.jsx'
import { track } from '../analytics.js'
import './NotFound.css'

// 404 — no mock. Same header/footer, a short message, the main routes as a way back, and the phone number.
// Static hosts serve public/404.html (a copy of index.html the router renders as this page); SPA hosts land here for
// any unknown path. Sets a data attribute so analytics can count it.
export default function NotFound({ path }) {
  useEffect(() => { track('page_not_found', { path }); document.documentElement.dataset.notFound = '1'; return () => { delete document.documentElement.dataset.notFound } }, [])
  const links = [{ label: 'Home', href: '/' }, { label: 'Find a Doctor', href: '/find-a-doctor' }, { label: 'Our clinics', href: '/clinics' }, { label: 'About us', href: '/about' }, ...NAV.find((n) => n.id === 'treatments').items]
  return (
    <div className="page">
      <Header current="none" />
      <main id="main" tabIndex={-1}>
        <section className="nf band" aria-labelledby="nf-title" data-hero>
          <div className="inner nf__inner">
            <p className="nf__eyebrow">Page not found</p>
            <h1 id="nf-title" className="nf__title">We couldn't find that page</h1>
            <p className="nf__text">The link may be out of date{path ? <> (<code>{path}</code>)</> : null}. Try one of these, or call us on <a href="tel:9147405955">9147405955</a>.</p>
            <ul className="nf__links">{links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul>
            <a className="nf__cta" href="#book" data-form="book-appointment" data-section="not-found">Book Appointment</a>
          </div>
        </section>
      </main>
      <Footer />
      <FormDialog />
    </div>
  )
}
