import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getTour, startCashupPayment } from '../api'
import usePageMeta from '../hooks/usePageMeta'
import './BookingCheckout.css'

const currency = (value) => new Intl.NumberFormat('id-ID').format(value || 0)
const participantCount = (value) => Math.max(1, Number.parseInt(value, 10) || 1)

const validate = (values) => {
  const errors = {}
  if (!values.customerName.trim()) errors.customerName = 'Nama lengkap wajib diisi.'
  if (!values.whatsapp) errors.whatsapp = 'Nomor WhatsApp wajib diisi.'
  else if (!/^[0-9+\-\s]{9,15}$/.test(values.whatsapp)) errors.whatsapp = 'Format nomor WhatsApp tidak valid.'
  if (!values.email) errors.email = 'Email wajib diisi.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Format email tidak valid.'
  if (!values.destination.trim()) errors.destination = 'Detail tujuan wajib diisi.'
  if (!values.password || values.password.length < 8) errors.password = 'Password minimal 8 karakter.'
  if (values.password !== values.passwordConfirmation) errors.passwordConfirmation = 'Konfirmasi password tidak sama.'
  return errors
}

export default function BookingCheckout() {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [tour, setTour] = useState(null)
  const [selectedSchedule, setSelectedSchedule] = useState(location.state?.selectedSchedule || null)
  const [values, setValues] = useState({ customerName: '', whatsapp: '', email: '', destination: '', pax: '', date: '', password: '', passwordConfirmation: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  usePageMeta({ title: tour ? `Booking ${tour.title}` : 'Booking Tour' })

  useEffect(() => {
    getTour(slug).then((data) => {
      setTour(data)
      setSelectedSchedule((current) => current || data.departureSchedules?.find((item) => item.status !== 'full') || data.departureSchedules?.[0] || null)
      setValues((current) => ({ ...current, destination: `${data.title} - ` }))
    }).catch(() => setStatus('error'))
  }, [slug])

  if (!tour) {
    return <main className="checkout-page"><div className="container checkout-loading">Memuat detail paket...</div></main>
  }

  const selectedPrice = selectedSchedule?.price ?? tour.priceStart
  const totalParticipants = participantCount(values.pax)
  const totalPrice = selectedPrice * totalParticipants
  const onChange = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const onSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setStatus('submitting')
    try {
      const payment = await startCashupPayment({
        customer_name: values.customerName,
        tour_slug: tour.slug,
        schedule_start_date: selectedSchedule?.startDate,
        whatsapp: values.whatsapp,
        email: values.email,
        destination: values.destination,
        pax: values.pax,
        date: selectedSchedule ? `${selectedSchedule.startDate} - ${selectedSchedule.endDate}` : values.date,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      })
      window.location.assign(payment.paymentUrl)
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="checkout-page">
      <div className="container">
        <div className="checkout-crumbs"><Link to={`/tour/${tour.slug}`}>← Kembali ke detail tour</Link></div>
        <header className="checkout-heading">
          <span className="eyebrow">Booking &amp; pembayaran</span>
          <h1>Lengkapi data perjalanan Anda</h1>
          <p>Isi data dengan benar. Setelah dikirim, Anda akan diarahkan ke halaman pembayaran CashUP.</p>
        </header>

        <div className="checkout-layout">
          <section className="checkout-form-card">
            <div className="checkout-section-heading"><span>01</span><div><h2>Data customer</h2><p>Informasi ini digunakan untuk konfirmasi booking.</p></div></div>
            <form id="booking-form" onSubmit={onSubmit} noValidate>
              <div className="checkout-fields-grid">
                <div className="checkout-field checkout-field-full"><label htmlFor="customerName">Nama lengkap <i>*</i></label><input id="customerName" name="customerName" value={values.customerName} onChange={onChange} placeholder="Nama sesuai identitas" className={errors.customerName ? 'has-error' : ''} />{errors.customerName && <small>{errors.customerName}</small>}</div>
                <div className="checkout-field"><label htmlFor="whatsapp">Nomor WhatsApp <i>*</i></label><input id="whatsapp" name="whatsapp" type="tel" value={values.whatsapp} onChange={onChange} placeholder="0812 3456 7890" className={errors.whatsapp ? 'has-error' : ''} />{errors.whatsapp && <small>{errors.whatsapp}</small>}</div>
                <div className="checkout-field"><label htmlFor="email">Email <i>*</i></label><input id="email" name="email" type="email" value={values.email} onChange={onChange} placeholder="nama@email.com" className={errors.email ? 'has-error' : ''} />{errors.email && <small>{errors.email}</small>}</div>
                <div className="checkout-field"><label htmlFor="password">Password <i>*</i></label><input id="password" name="password" type="password" value={values.password} onChange={onChange} placeholder="Minimal 8 karakter" className={errors.password ? 'has-error' : ''} />{errors.password && <small>{errors.password}</small>}</div>
                <div className="checkout-field"><label htmlFor="passwordConfirmation">Konfirmasi password <i>*</i></label><input id="passwordConfirmation" name="passwordConfirmation" type="password" value={values.passwordConfirmation} onChange={onChange} placeholder="Ulangi password" className={errors.passwordConfirmation ? 'has-error' : ''} />{errors.passwordConfirmation && <small>{errors.passwordConfirmation}</small>}</div>
                <div className="checkout-field"><label htmlFor="pax">Jumlah peserta</label><input id="pax" name="pax" type="number" min="1" value={values.pax} onChange={onChange} placeholder="Contoh: 2" /></div>
                <div className="checkout-field">
                  <label htmlFor="date">Tanggal rencana</label>
                  {selectedSchedule ? (
                    <input id="date" name="date" value={`${selectedSchedule.startDate} - ${selectedSchedule.endDate}`} readOnly />
                  ) : (
                    <input id="date" name="date" type="date" value={values.date} onChange={onChange} />
                  )}
                  {selectedSchedule && <small className="checkout-field-hint">Tanggal mengikuti jadwal tour yang dipilih.</small>}
                </div>
                <div className="checkout-field checkout-field-full"><label htmlFor="destination">Detail perjalanan <i>*</i></label><textarea id="destination" name="destination" rows="5" value={values.destination} onChange={onChange} placeholder="Ceritakan kebutuhan perjalanan, titik keberangkatan, atau catatan lainnya" className={errors.destination ? 'has-error' : ''} />{errors.destination && <small>{errors.destination}</small>}</div>
              </div>
              {status === 'error' && <div className="checkout-error">Payment link belum dapat dibuat. Periksa koneksi Anda lalu coba lagi.</div>}
              <p className="checkout-secure">Data Anda dikirim secara aman ke server Namastra Travel.</p>
            </form>
          </section>

          <aside className="checkout-summary">
            <div className="checkout-summary-image"><img src={tour.image} alt={tour.title} /></div>
            <div className="checkout-summary-body">
              <span className="checkout-summary-label">Ringkasan pesanan</span>
              <h2>{tour.title}</h2>
              <p className="checkout-location">{tour.location} · {tour.duration}</p>
              <div className="checkout-date"><span>Tanggal rencana</span><strong>{selectedSchedule ? `${selectedSchedule.startDate} - ${selectedSchedule.endDate}` : values.date || 'Belum diisi'}</strong></div>
              <div className="checkout-booking-details">
                <div><span>Jumlah peserta</span><strong>{totalParticipants} peserta</strong></div>
                <div><span>Harga per peserta</span><strong>Rp {currency(selectedPrice)}</strong></div>
              </div>
              <div className="checkout-total"><span>Total pemesanan</span><strong>Rp {currency(totalPrice)}</strong><small>Harga dihitung dari jumlah peserta</small></div>
              <div className="checkout-payment-note"><span aria-hidden="true">✓</span><p>Pembayaran diproses melalui CashUP dengan pilihan metode pembayaran yang tersedia.</p></div>
              <button type="submit" form="booking-form" className="btn btn-primary checkout-submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Menyiapkan pembayaran...' : 'Lanjutkan ke pembayaran'}</button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}