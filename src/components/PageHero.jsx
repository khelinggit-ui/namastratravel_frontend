import { Link } from 'react-router-dom'
import './PageHero.css'

export default function PageHero({ eyebrow, title, subtitle, crumbs = [] }) {
  return (
    <section className="page-hero">
      <div className="page-hero-accent" aria-hidden="true" />
      <div className="container page-hero-content">
        <nav className="page-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.to || c.label}>
              <span className="crumb-sep">/</span>
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </span>
          ))}
        </nav>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {subtitle && <p className="page-hero-sub">{subtitle}</p>}
      </div>
    </section>
  )
}