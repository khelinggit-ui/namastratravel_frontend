import { useEffect, useRef, useState } from 'react'
import { startCashupPayment, submitBooking } from '../api'
import './BookingForm.css'

const validate = (values, isPayment) => {
  const errors = {}
  if (!values.whatsapp) errors.whatsapp = 'Nomor WhatsApp wajib diisi.'
  else if (!/^[0-9+\-\s]{9,15}$/.test(values.whatsapp)) errors.whatsapp = 'Format nomor WhatsApp tidak valid.'

  if (!values.email) errors.email = 'Email wajib diisi.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Format email tidak valid.'

  if (!values.destination.trim() || values.destination.trim() === (contextName ? `${contextName} - ` : '')) {
    errors.destination = 'Detail tujuan wajib diisi.'
  }
  if (isPayment && (!values.password || values.password.length < 8)) errors.password = 'Password minimal 8 karakter.'
  if (isPayment && values.password !== values.passwordConfirmation) errors.passwordConfirmation = 'Konfirmasi password tidak sama.'
  return errors
}

let contextName = ''

export default function BookingForm({ open, onClose, context }) {
  const [values, setValues] = useState({ customerName: '', whatsapp: '', email: '', destination: '', pax: '', date: '', password: '', passwordConfirmation: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (open) {
      contextName = context?.title || context?.name || ''
      setErrors({})
      setStatus('idle')
      setValues((v) => ({
        ...v,
        destination: context?.title ? `${context.title} - ` : context?.name ? `${context.name} - ` : '',
        date: context?.selectedSchedule?.startDate || '',
      }))
      document.body.style.overflow = 'hidden'
      const t = setTimeout(() => closeBtnRef.current?.focus(), 60)
      return () => {
        document.body.style.overflow = ''
        clearTimeout(t)
        contextName = ''
      }
    }
  }, [open, context])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) onClose()
    }
    const el = dialogRef.current
    if (!open || !el) return undefined
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values, isPayment)
    if (isPayment && !values.customerName.trim()) errs.customerName = 'Nama lengkap wajib diisi.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('submitting')
    try {
      const payload = {
        customerName: values.customerName,
        whatsapp: values.whatsapp,
        email: values.email,
        destination: values.destination,
        pax: values.pax,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
        date: context?.selectedSchedule
          ? `${context.selectedSchedule.startDate} - ${context.selectedSchedule.endDate}`
          : values.date,
      }

      if (isPayment) {
        const payment = await startCashupPayment({
          customer_name: payload.customerName,
          tour_slug: context.slug,
          schedule_start_date: context.selectedSchedule?.startDate,
          whatsapp: payload.whatsapp,
          email: payload.email,
          destination: payload.destination,
          pax: payload.pax,
          date: payload.date,
        })
        window.location.assign(payment.paymentUrl)
        return
      }

      const res = await submitBooking({ ...payload, tour: context?.title || context?.name || '' })
      setStatus('success')
      console.info(res.message)
    } catch (err) {
      setStatus('error')
    }
  }

  const isPayment = Boolean(context?.paymentAmount && context?.slug)

  return (
    <div className="booking-modal" role="dialog" aria-modal="true" aria-label="Form booking">
      <div className="booking-backdrop" onClick={() => onClose()} />
      <div className="booking-panel" ref={dialogRef}>
        {status === 'success' ? (
          <div className="booking-success">
            <span className="booking-success-icon" aria-hidden="true">✓</span>
            <h3>Terima kasih!</h3>
            <p>Permintaan booking Anda telah kami terima. Tim Namastra akan segera menghubungi Anda melalui WhatsApp atau email.</p>
            <button className="btn btn-primary" onClick={() => onClose()}>Tutup</button>
          </div>
        ) : (
          <>
            <button className="booking-close" ref={closeBtnRef} onClick={() => onClose()} aria-label="Tutup form">
              ✕
            </button>
            <div className="booking-head">
              <span className="eyebrow">Booking Sekarang</span>
              <h3>{context?.title || context?.name || 'Form Booking'}</h3>
              <p>Isi data Anda dan tim kami akan segera menghubungi Anda.</p>
            </div>

            <form onSubmit={onSubmit} noValidate>
              {isPayment && (
                <div className="field">
                  <label htmlFor="b-name">Nama Lengkap <span className="req">*</span></label>
                  <input
                    id="b-name"
                    name="customerName"
                    type="text"
                    placeholder="Nama sesuai identitas"
                    value={values.customerName}
                    onChange={onChange}
                    required
                  />
                  {errors.customerName && <div className="error-msg">{errors.customerName}</div>}
                </div>
              )}

              <div className="field">
                <label htmlFor="b-wa">Nomor WhatsApp <span className="req">*</span></label>
                <input
                  id="b-wa"
                  name="whatsapp"
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  value={values.whatsapp}
                  onChange={onChange}
                  className={errors.whatsapp ? 'error' : ''}
                />
                {errors.whatsapp && <div className="error-msg">{errors.whatsapp}</div>}
              </div>

              <div className="field">
                <label htmlFor="b-email">Email <span className="req">*</span></label>
                <input
                  id="b-email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={values.email}
                  onChange={onChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <div className="error-msg">{errors.email}</div>}
              </div>

              <div className="field"><label htmlFor="b-password">Password <span className="req">*</span></label><input id="b-password" name="password" type="password" placeholder="Minimal 8 karakter" value={values.password} onChange={onChange} />{errors.password && <div className="error-msg">{errors.password}</div>}</div>
              <div className="field"><label htmlFor="b-password-confirmation">Konfirmasi Password <span className="req">*</span></label><input id="b-password-confirmation" name="passwordConfirmation" type="password" placeholder="Ulangi password" value={values.passwordConfirmation} onChange={onChange} />{errors.passwordConfirmation && <div className="error-msg">{errors.passwordConfirmation}</div>}</div>

              <div className="field">
                <label htmlFor="b-dest">Detail Tujuan <span className="req">*</span></label>
                <textarea
                  id="b-dest"
                  name="destination"
                  rows="4"
                  placeholder="Contoh: Tour Bali 5 hari 4 malam, berangkat 12 Desember, 2 peserta"
                  value={values.destination}
                  onChange={onChange}
                  className={errors.destination ? 'error' : ''}
                />
                {errors.destination && <div className="error-msg">{errors.destination}</div>}
              </div>

              <div className="booking-row">
                <div className="field">
                  <label htmlFor="b-pax">Jumlah Peserta</label>
                  <input id="b-pax" name="pax" type="text" placeholder="cth. 2 orang" value={values.pax} onChange={onChange} />
                </div>
                <div className="field">
                  <label htmlFor="b-date">Tanggal Rencana</label>
                  <input id="b-date" name="date" type="text" placeholder="cth. 12 Des 2026" value={values.date} onChange={onChange} />
                </div>
              </div>

              {isPayment && (
                <div className="booking-payment-summary">
                  <span>Total pembayaran</span>
                  <strong>Rp {new Intl.NumberFormat('id-ID').format(context.paymentAmount)}</strong>
                </div>
              )}

              {status === 'error' && (
                <div className="booking-error">Terjadi kesalahan. Silakan coba lagi.</div>
              )}

              <button type="submit" className="btn btn-primary booking-submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Memproses...' : isPayment ? 'Lanjut ke Pembayaran' : 'Kirim Permintaan'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}