import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { getAbout } from '../api'
import usePageMeta from '../hooks/usePageMeta'
import './Tentang.css'

export default function Tentang() {
  usePageMeta({
    title: 'Tentang Kami',
    description: 'Kenali lebih dekat Namastra Travel — tour & travel terpercaya untuk perjalanan domestik dan mancanegara.',
  })
  const [about, setAbout] = useState(null)

  useEffect(() => {
    getAbout().then(setAbout)
  }, [])

  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Partner Terpercaya untuk Setiap Perjalanan Anda"
        subtitle="Namastra Travel — tour & travel domestik dan mancanegara dengan pelayanan yang personal dan transparan."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Tentang Kami' }]}
      />

      <section className="section">
        <div className="container">
          <div className="about-intro grid grid-2">
            <Reveal>
              <div className="about-media">
                <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=70" alt="Tim Namastra Travel saat merencanakan perjalanan" loading="lazy" />
                <div className="about-media-badge">
                  <strong>8+</strong>
                  <span>Tahun Pengalaman</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="about-text">
                <span className="eyebrow">Cerita Kami</span>
                <h2 className="section-title">Melayani dengan Sepenuh Hati</h2>
                {about ? (
                  about.story.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p>Memuat...</p>
                )}
                <div className="about-cta">
                  <a href="#visi-misi" className="btn btn-primary">Visi &amp; Misi Kami</a>
                  <Link to="/kontak" className="btn btn-outline">Hubungi Kami</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-surface" id="visi-misi">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Visi &amp; Misi</span>
            <h2 className="section-title">Arah dan Tujuan Kami</h2>
          </Reveal>
          <div className="grid grid-2 about-vm">
            <Reveal className="vm-card card">
              <span className="vm-icon" aria-hidden="true">🎯</span>
              <h3>Visi</h3>
              <p>{about?.vision || 'Memuat...'}</p>
            </Reveal>
            <Reveal delay={100} className="vm-card card">
              <span className="vm-icon" aria-hidden="true">🚀</span>
              <h3>Misi</h3>
              <ul>
                {about?.missions.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Keunggulan</span>
            <h2 className="section-title">Kenapa Memilih Namastra Travel</h2>
          </Reveal>
          <div className="grid grid-2">
            {about?.values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="value-item">
                  <span className="value-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{v.title}</h3>
                    <p>{v.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-surface">
        <div className="container">
          <div className="stats-band">
            {about?.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="stat-item">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="legal card">
            <div>
              <span className="eyebrow">Legalitas</span>
              <h2 className="section-title">Terpercaya &amp; Berizin Resmi</h2>
            </div>
            <p className="legal-text">
              Namastra Travel adalah penyedia jasa perjalanan berizin resmi. Nomor izin usaha dan dokumen
              legalitas akan ditampilkan di sini. <em>(Konten ini dikelola melalui CMS admin.)</em>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}