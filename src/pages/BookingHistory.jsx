import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { customerLogout, getCustomerBookings } from '../api'
import usePageMeta from '../hooks/usePageMeta'
import './CustomerAccount.css'

const currency = (value) => `Rp ${new Intl.NumberFormat('id-ID').format(value || 0)}`
const escapeHtml = (value) => String(value ?? '-').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])

export default function BookingHistory() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const user = JSON.parse(localStorage.getItem('customer_user') || 'null')

  usePageMeta({ title: 'Riwayat Booking' })

  useEffect(() => {
    if (!localStorage.getItem('customer_token')) {
      navigate('/login', { replace: true, state: { from: '/riwayat-booking' } })
      return
    }
    getCustomerBookings().then(setBookings).catch(() => setError('Riwayat booking belum dapat dimuat.'))
  }, [navigate])

  const logout = async () => {
    await customerLogout()
    navigate('/login', { replace: true })
  }

  const downloadInvoice = (booking) => {
    const invoiceNumber = booking.paymentInvoiceNumber || booking.paymentOrderId || `BOOKING-${booking.id}`
    const invoiceHtml = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><title>Invoice ${escapeHtml(invoiceNumber)}</title>
<style>body{font-family:Arial,sans-serif;color:#17221b;max-width:760px;margin:40px auto;padding:0 24px}header{border-bottom:2px solid #1fae64;padding-bottom:20px}h1{margin:6px 0;font-size:28px}p{color:#536158}.meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;background:#f4f7f4;padding:20px;margin:24px 0}.label{display:block;color:#68746d;font-size:12px;margin-bottom:5px}.value{font-weight:600}.total{display:flex;justify-content:space-between;border-top:1px solid #17221b;padding-top:18px;font-size:20px;font-weight:700}</style></head>
<body><header><strong>NAMASTRA TRAVEL</strong><h1>Invoice Pembayaran</h1><p>Rincian transaksi perjalanan Anda.</p></header>
<div class="meta"><div><span class="label">Nomor invoice</span><span class="value">${escapeHtml(invoiceNumber)}</span></div><div><span class="label">Order ID</span><span class="value">${escapeHtml(booking.paymentOrderId)}</span></div><div><span class="label">Status pembayaran</span><span class="value">${escapeHtml(booking.paymentStatus || 'Menunggu konfirmasi')}</span></div><div><span class="label">Nama customer</span><span class="value">${escapeHtml(user?.name)}</span></div><div><span class="label">Tour</span><span class="value">${escapeHtml(booking.tourName)}</span></div><div><span class="label">Jumlah peserta</span><span class="value">${escapeHtml(booking.pax)}</span></div><div><span class="label">Tanggal rencana</span><span class="value">${escapeHtml(booking.plannedDate)}</span></div></div>
<div class="total"><span>Total pembayaran</span><span>${escapeHtml(currency(booking.paymentAmount))}</span></div></body></html>`
    const url = URL.createObjectURL(new Blob([invoiceHtml], { type: 'text/html;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${invoiceNumber}.html`
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <main className="account-page">
      <div className="container account-shell account-history-shell">
        <div className="account-heading-row">
          <div><span className="eyebrow">Customer area</span><h1>Riwayat booking</h1><p>Halo, {user?.name || 'Customer'}. Berikut perjalanan yang pernah Anda pesan.</p></div>
          <button type="button" className="btn btn-outline" onClick={logout}>Keluar</button>
        </div>
        {error && <p className="account-error">{error}</p>}
        {!error && !bookings.length && <div className="account-empty"><p>Belum ada booking pada akun ini.</p><Link to="/tour" className="btn btn-primary">Cari tour</Link></div>}
        <div className="booking-history-list">
          {bookings.map((booking) => (
            <article className="booking-history-item" key={booking.id}>
              <div><span className="booking-history-label">{booking.paymentStatus || booking.status || 'Booking'}</span><h2>{booking.tourName || 'Pesanan perjalanan'}</h2><p>{booking.destination || '-'}</p></div>
              <div className="booking-history-details"><dl><div><dt>Jumlah peserta</dt><dd>{booking.pax || '-'}</dd></div><div><dt>Tanggal rencana</dt><dd>{booking.plannedDate || '-'}</dd></div><div><dt>Total</dt><dd>{booking.paymentAmount ? currency(booking.paymentAmount) : 'Menunggu konfirmasi'}</dd></div></dl><button type="button" className="btn btn-outline booking-invoice-button" onClick={() => downloadInvoice(booking)} disabled={!booking.paymentAmount} title={booking.paymentAmount ? 'Download invoice pembayaran' : 'Invoice tersedia setelah pembayaran dibuat'}>Download invoice</button></div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
