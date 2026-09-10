import { Link } from 'react-router-dom'
import './TourCard.css'

const currency = (n) => new Intl.NumberFormat('id-ID').format(n)

export default function TourCard({ tour }) {
  return (
    <article className="tour-card card">
      <Link to={`/tour/${tour.slug}`} className="tour-card-media">
        <img src={tour.image} alt={tour.title} loading="lazy" />
        {tour.tag && <span className="badge badge-lime tour-card-tag">{tour.tag}</span>}
        <span className="badge badge-ink tour-card-cat">{tour.category === 'domestik' ? 'Domestik' : 'Mancanegara'}</span>
      </Link>
      <div className="tour-card-body">
        <div className="tour-card-meta">
          <span>{tour.duration}</span>
          <span>📍 {tour.location}</span>
        </div>
        <h3 className="tour-card-title">
          <Link to={`/tour/${tour.slug}`}>{tour.title}</Link>
        </h3>
        <p className="tour-card-tagline">{tour.tagline}</p>
        <div className="tour-card-foot">
          <div>
            <span className="tour-card-price-label">Mulai dari</span>
            <span className="tour-card-price">Rp {currency(tour.priceStart)}</span>
          </div>
          <Link to={`/tour/${tour.slug}`} className="tour-card-link" aria-label={`Lihat detail ${tour.title}`}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </article>
  )
}