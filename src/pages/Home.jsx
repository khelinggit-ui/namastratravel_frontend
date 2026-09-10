import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTours, getBlogs, getDestinations, getTestimonials, getSiteSettings } from '../api'
import TourCard from '../components/TourCard'
import Reveal from '../components/Reveal'
import usePageMeta from '../hooks/usePageMeta'
import './Home.css'

const heroSlides = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=70',
  'https://images.unsplash.com/photo-1526481280691-3bf62d55e187?auto=format&fit=crop&w=1600&q=70',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=70',
]

export default function Home() {
  usePageMeta({
    title: 'Tour & Travel Domestik dan Mancanegara',
    description: 'Namastra Travel — paket tour domestik dan mancanegara dengan pelayanan terbaik, harga transparan, dan tim berpengalaman.',
  })
  const [tours, setTours] = useState([])
  const [blogs, setBlogs] = useState([])
  const [destinations, setDestinations] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [settings, setSettings] = useState({})
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    Promise.all([getTours(), getBlogs(), getDestinations(), getTestimonials(), getSiteSettings()]).then(
      ([t, b, d, tm, s]) => {
        setTours(t)
        setBlogs(b)
        setDestinations(d)
        setTestimonials(tm)
        setSettings(s)
      }
    )
  }, [])

  useEffect(() => {
    const id = setInterval(() => setSlide((v) => (v + 1) % heroSlides.length), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          {heroSlides.map((src, i) => (
            <div key={src} className={`hero-slide ${i === slide ? 'is-active' : ''}`} style={{ backgroundImage: `url(${src})` }} />
          ))}
          <div className="hero-overlay" />
        </div>
        <div className="container hero-content">
          <Reveal>
            <span className="eyebrow hero-eyebrow">Tour &amp; Travel Domestik – Mancanegara</span>
            <h1>
              Jelajahi Dunia dengan <span className="hero-gradient-text">Kepercayaan</span> &amp; Kenyamanan
            </h1>
            <p className="hero-sub">
              Paket tour domestik dan mancanegara dengan pelayanan terbaik, harga transparan, dan tim berpengalaman yang siap menemani perjalanan Anda.
            </p>
            <div className="hero-actions">
              <Link to="/tour" className="btn btn-primary">Cari Tour</Link>
              <Link to="/destinasi" className="btn btn-light">Lihat Destinasi</Link>
            </div>
          </Reveal>
        </div>
        <div className="hero-stats">
          <div className="container">
            {[
              { v: '120+', l: 'Destinasi' },
              { v: '8 th', l: 'Pengalaman' },
              { v: '4.900+', l: 'Pelanggan Puas' },
            ].map((s) => (
              <div className="hero-stat" key={s.l}>
                <strong>{s.v}</strong>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Kenapa Namastra</span>
            <h2 className="section-title">Perjalanan Anda dalam Genggaman Kami</h2>
            <p className="section-desc">Kami merancang setiap perjalanan dengan detail, aman, dan menyenangkan.</p>
          </Reveal>
          <div className="grid grid-3">
            {[
              { icon: '🌏', title: 'Tour Domestik & Mancanegara', desc: 'Pilihan lengkap destinasi lokal hingga berbagai negara, disesuaikan dengan budget dan preferensi Anda.' },
              { icon: '🤝', title: 'Dibantu Tim Berpengalaman', desc: 'Tim operation berpengalaman siap memastikan perjalanan Anda berjalan lancar dari awal hingga akhir.' },
              { icon: '💚', title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi. Setiap komponen paket dijelaskan secara terbuka sebelum booking.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="feature-card card">
                  <span className="feature-icon" aria-hidden="true">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Populer */}
      <section className="section section-surface">
        <div className="container">
          <div className="section-head-row">
            <Reveal className="section-head">
              <span className="eyebrow">Tour Populer</span>
              <h2 className="section-title">Paket Favorit Bulan Ini</h2>
              <p className="section-desc mb-0">Pilih destinasi impian dan booking sekarang — tim kami akan membantu mengatur segalanya.</p>
            </Reveal>
            <Reveal delay={100}>
              <Link to="/tour" className="btn btn-outline">Lihat Semua Tour</Link>
            </Reveal>
          </div>
          <div className="grid grid-3">
            {tours.slice(0, 6).map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <TourCard tour={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Destinasi unggulan */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Destinasi</span>
            <h2 className="section-title">Destinasi Unggulan</h2>
          </Reveal>
          <div className="grid grid-4">
            {destinations.slice(0, 4).map((d, i) => (
              <Reveal key={d.id} delay={i * 80}>
                <Link to={`/destinasi/${d.slug}`} className="dest-card">
                  <img src={d.image} alt={d.name} loading="lazy" />
                  <div className="dest-card-overlay">
                    <h3>{d.name}</h3>
                    <span>{d.country}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="section section-surface">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Testimoni</span>
            <h2 className="section-title">Kata Mereka yang Sudah Berpetualang</h2>
          </Reveal>
          <div className="grid grid-4">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <figure className="testimonial card">
                  <div className="testimonial-stars" aria-label={`Rating ${t.rating} dari 5`}>
                    {'★'.repeat(t.rating)}
                  </div>
                  <blockquote>“{t.text}”</blockquote>
                  <figcaption>
                    <strong>{t.name}</strong>
                    <span>{t.location}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <Reveal className="section-head">
              <span className="eyebrow">Blog</span>
              <h2 className="section-title">Tips &amp; Inspirasi Travel</h2>
              <p className="section-desc mb-0">Baca panduan dan cerita perjalanan untuk mempersiapkan liburan berikutnya.</p>
            </Reveal>
            <Reveal delay={100}>
              <Link to="/blog" className="btn btn-outline">Semua Artikel</Link>
            </Reveal>
          </div>
          <div className="grid grid-3">
            {blogs.slice(0, 3).map((b, i) => (
              <Reveal key={b.id} delay={i * 80}>
                <Link to={`/blog/${b.slug}`} className="blog-card card">
                  <div className="blog-card-media">
                    <img src={b.cover} alt={b.title} loading="lazy" />
                    <span className="badge badge-lime">{b.category}</span>
                  </div>
                  <div className="blog-card-body">
                    <time dateTime={b.date}>{new Date(b.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                    <h3>{b.title}</h3>
                    <p>{b.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="cta">
        <div className="cta-accent" aria-hidden="true" />
        <div className="container cta-content">
          <Reveal className="cta-text">
            <h2>Siap Berangkat? Mari Diskusikan Perjalanan Anda.</h2>
            <p>Hubungi kami via WhatsApp untuk konsultasi paket tour dan destinasi impian Anda.</p>
          </Reveal>
          <a
            className="btn btn-whatsapp"
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            Chat WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}