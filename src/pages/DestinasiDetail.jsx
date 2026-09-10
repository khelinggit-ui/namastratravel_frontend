import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDestination } from '../api'
import BookingForm from '../components/BookingForm'
import Reveal from '../components/Reveal'
import TourCard from '../components/TourCard'
import { siteSettings } from '../data/mockData'
import usePageMeta from '../hooks/usePageMeta'

export default function DestinasiDetail() {
  const { slug } = useParams()
  const [dest, setDest] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [bookingOpen, setBookingOpen] = useState(false)

  usePageMeta({ title: dest?.name, description: dest?.description })

  useEffect(() => {
    setBookingOpen(false)
    setActiveImg(0)
    getDestination(slug).then(setDest)
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!dest) return <p className="detail-loading">Memuat...</p>

  const gallery = [dest.image, ...(dest.gallery || [])]
  const waMessage = encodeURIComponent(`Halo, saya tertarik dengan destinasi ${dest.name}. Bisa info lebih lanjut?`)

  return (
    <>
      <section className="detail-hero">
        <div className="container detail-hero-inner">
          <div className="detail-gallery">
            <div className="detail-main-img">
              <img src={gallery[activeImg]} alt={dest.name} />
              <span className="badge badge-lime detail-tag">{dest.type}</span>
            </div>
            {gallery.length > 1 && (
              <div className="detail-thumbs">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    className={`detail-thumb ${i === activeImg ? 'is-active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Lihat gambar ${i + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-info">
            <nav className="page-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="crumb-sep">/</span>
              <Link to="/destinasi">Destinasi</Link>
              <span className="crumb-sep">/</span>
              <span aria-current="page">{dest.name}</span>
            </nav>
            <span className="badge badge-green">{dest.type}</span>
            <h1>{dest.name}</h1>
            <p className="detail-tagline">{dest.country}</p>
            <p>{dest.description}</p>

            <div className="detail-price-box">
              <span className="detail-price-note">Tersedia paket tour ke {dest.name} — cek daftar di bawah atau booking sekarang.</span>
            </div>

            <div className="detail-actions">
              <button className="btn btn-primary" onClick={() => setBookingOpen(true)}>
                Booking Sekarang
              </button>
              <a className="btn btn-whatsapp" href={`https://wa.me/${siteSettings.whatsapp}?text=${waMessage}`} target="_blank" rel="noreferrer">
                Tanya via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Tour Terkait</span>
            <h2 className="section-title">Paket Tour ke {dest.name}</h2>
          </Reveal>
          {dest.tours && dest.tours.length > 0 ? (
            <div className="grid grid-3">
              {dest.tours.map((t, i) => (
                <Reveal key={t.id} delay={i * 80}>
                  <TourCard tour={t} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p>Tidak ada paket tour terkait saat ini.</p>
          )}
        </div>
      </section>

      <BookingForm open={bookingOpen} onClose={() => setBookingOpen(false)} context={{ name: `Destinasi ${dest.name}` }} />
    </>
  )
}