import { useEffect, useState } from 'react'
import { getSiteSettings, submitContact } from '../api'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import usePageMeta from '../hooks/usePageMeta'
import './Kontak.css'

const validate = (values) => {
  const errors = {}
  if (!values.name) errors.name = 'Nama wajib diisi.'
  if (!values.email) errors.email = 'Email wajib diisi.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Format email tidak valid.'
  if (!values.message.trim()) errors.message = 'Pesan wajib diisi.'
  return errors
}

export default function Kontak() {
  usePageMeta({
    title: 'Kontak',
    description: 'Hubungi Namastra Travel — alamat, telepon, WhatsApp, email, dan jam operasional.',
  })
  const [settings, setSettings] = useState({})
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    getSiteSettings().then(setSettings)
  }, [])

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSending(true)
    await submitContact(values)
    setSending(false)
    setSent(true)
    setValues({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 6000)
  }

  const items = [
    { icon: '📍', title: 'Alamat', value: settings.address },
    { icon: '📞', title: 'Telepon', value: settings.phone, href: `tel:${settings.phone}` },
    { icon: '💬', title: 'WhatsApp', value: settings.phone, href: `https://wa.me/${settings.whatsapp}` },
    { icon: '✉️', title: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    { icon: '🕘', title: 'Jam Operasional', value: settings.hours },
  ]

  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Mari Terhubung dengan Kami"
        subtitle="Konsultasikan kebutuhan tour Anda — tim Namastra siap membantu."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Kontak' }]}
      />

      <section className="section">
        <div className="container">
          <div className="kontak-grid">
            <div>
              <Reveal className="section-head">
                <span className="eyebrow">Info Kontak</span>
                <h2 className="section-title">Hubungi Namastra Travel</h2>
              </Reveal>
              <div className="kontak-list">
                {items.map((it, i) => (
                  <Reveal key={it.title} delay={i * 70}>
                    <div className="kontak-item">
                      <span className="kontak-icon" aria-hidden="true">{it.icon}</span>
                      <div>
                        <span className="kontak-label">{it.title}</span>
                        {it.href ? (
                          <a href={it.href} target={it.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{it.value}</a>
                        ) : (
                          <p className="kontak-value">{it.value}</p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="kontak-social">
                {[
                  { label: 'Instagram', href: settings.instagram },
                  { label: 'Facebook', href: settings.facebook },
                  { label: 'TikTok', href: settings.tiktok },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="chip">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <Reveal delay={120}>
              <div className="kontak-form card">
                {sent ? (
                  <div className="booking-success">
                    <span className="booking-success-icon" aria-hidden="true">✓</span>
                    <h3>Pesan Terkirim!</h3>
                    <p>Terima kasih, pesan Anda sudah kami terima dan akan segera kami balas.</p>
                  </div>
                ) : (
                  <>
                    <h3>Kirim Pesan</h3>
                    <p className="kontak-form-note">Form ini untuk pertanyaan umum. Untuk booking tour, gunakan tombol "Booking Sekarang" di halaman detail.</p>
                    <form onSubmit={onSubmit} noValidate>
                      <div className="field">
                        <label htmlFor="c-name">Nama <span className="req">*</span></label>
                        <input id="c-name" name="name" type="text" placeholder="Nama lengkap" value={values.name} onChange={onChange} className={errors.name ? 'error' : ''} />
                        {errors.name && <div className="error-msg">{errors.name}</div>}
                      </div>
                      <div className="field">
                        <label htmlFor="c-email">Email <span className="req">*</span></label>
                        <input id="c-email" name="email" type="email" placeholder="nama@email.com" value={values.email} onChange={onChange} className={errors.email ? 'error' : ''} />
                        {errors.email && <div className="error-msg">{errors.email}</div>}
                      </div>
                      <div className="field">
                        <label htmlFor="c-message">Pesan <span className="req">*</span></label>
                        <textarea id="c-message" name="message" rows="5" placeholder="Tulis pesan Anda..." value={values.message} onChange={onChange} className={errors.message ? 'error' : ''} />
                        {errors.message && <div className="error-msg">{errors.message}</div>}
                      </div>
                      <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
                        {sending ? 'Mengirim...' : 'Kirim Pesan'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="kontak-map">
        <iframe
          title="Peta lokasi Namastra Travel"
          src={settings.mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  )
}