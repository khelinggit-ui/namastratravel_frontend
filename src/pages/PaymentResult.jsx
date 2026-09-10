import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCashupPaymentStatusByOrder } from '../api'
import PageHero from '../components/PageHero'
import './PaymentResult.css'

const statusContent = {
  pending: { label: 'Menunggu konfirmasi', title: 'Pembayaran sedang diproses', detail: 'Kami sedang memverifikasi pembayaran Anda. Halaman ini akan diperbarui otomatis.' },
  paid: { label: 'Pembayaran berhasil', title: 'Terima kasih, pembayaran Anda berhasil', detail: 'Pesanan Anda sudah tercatat. Simpan invoice ini sebagai bukti pembayaran.' },
  failed: { label: 'Pembayaran gagal', title: 'Pembayaran belum berhasil', detail: 'Silakan ulangi pembayaran atau hubungi tim Namastra Travel untuk bantuan.' },
  expired: { label: 'Payment link kedaluwarsa', title: 'Payment link sudah kedaluwarsa', detail: 'Buat pesanan baru atau hubungi tim kami untuk mendapatkan bantuan.' },
  cancelled: { label: 'Pembayaran dibatalkan', title: 'Pembayaran dibatalkan', detail: 'Tidak ada dana yang tercatat untuk transaksi ini.' },
}

const currency = (value) => `Rp ${new Intl.NumberFormat('id-ID').format(value || 0)}`
const formatDate = (value, withTime = false) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('id-ID', withTime ? { dateStyle: 'long', timeStyle: 'short' } : { dateStyle: 'long' }).format(date)
}

export default function PaymentResult() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId') || params.get('order_id')
  const [payment, setPayment] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) return undefined
    let active = true
    let attempts = 0

    const poll = async () => {
      try {
        const result = await getCashupPaymentStatusByOrder(orderId)
        if (!active) return
        setPayment(result)
        attempts += 1
        if (result.paymentStatus === 'pending' && attempts < 12) {
          window.setTimeout(poll, 5000)
        }
      } catch {
        if (active) setError('Status pembayaran belum dapat dimuat.')
      }
    }

    poll()
    return () => {
      active = false
    }
  }, [orderId])

  const status = payment?.paymentStatus || (orderId ? 'pending' : 'failed')
  const content = statusContent[status] || statusContent.pending
  const invoiceNumber = payment?.invoiceNumber
    || payment?.cashup?.data?.invoiceNum
    || payment?.cashup?.data?.invoiceNumber
    || payment?.cashup?.invoiceNum
    || payment?.cashup?.invoiceNumber
    || '-'
  const paymentMethod = payment?.paymentMethod
    || payment?.cashup?.data?.trxType
    || payment?.cashup?.data?.rxType
    || '-'
  const paymentIssuer = payment?.paymentIssuer || payment?.cashup?.data?.issuer || '-'

  return (
    <>
      <PageHero eyebrow="Pembayaran" title="Status Pembayaran" subtitle="Status transaksi Anda diperbarui langsung dari CashUP." />
      <section className="payment-result section">
        <div className="container">
          <div className={`payment-status payment-status-${status}`}>
            <span className="payment-status-icon" aria-hidden="true">{status === 'paid' ? '✓' : status === 'pending' ? '…' : '!'}</span>
            <div>
              <span className="payment-status-label">{content.label}</span>
              <h2>{content.title}</h2>
              <p>{content.detail}</p>
            </div>
          </div>

          {error && <p className="payment-result-error">{error}</p>}

          <article className="invoice" aria-label="Invoice pembayaran">
            <header className="invoice-header">
              <div>
                <span className="eyebrow">Namastra Travel</span>
                <h1>Invoice Pembayaran</h1>
                <p>Dokumen resmi rincian transaksi perjalanan Anda.</p>
              </div>
              <div className="invoice-status-mark"><span className={`invoice-status-dot invoice-status-dot-${status}`} />{content.label}</div>
            </header>

            <div className="invoice-meta">
              <div><span>Nomor invoice</span><strong>{invoiceNumber}</strong></div>
              <div><span>Order ID</span><strong>{payment?.orderId || orderId || '-'}</strong></div>
              <div><span>Tanggal transaksi</span><strong>{formatDate(payment?.paidAt, true)}</strong></div>
              <div><span>Metode pembayaran</span><strong>{paymentMethod}</strong></div>
              <div><span>Transfer melalui</span><strong>{paymentIssuer}</strong></div>
            </div>

            <div className="invoice-columns">
              <section className="invoice-block">
                <span className="invoice-block-label">Data customer</span>
                <h3>{payment?.customerName || 'Data customer belum tersedia'}</h3>
                <p>{payment?.email || '-'}</p>
                <p>{payment?.whatsapp || '-'}</p>
              </section>
              <section className="invoice-block">
                <span className="invoice-block-label">Detail perjalanan</span>
                <h3>{payment?.tourName || 'Pesanan perjalanan'}</h3>
                <p>{payment?.destination || 'Detail perjalanan akan dikonfirmasi oleh tim kami.'}</p>
                <p>{payment?.pax ? `${payment.pax} peserta` : 'Jumlah peserta mengikuti data booking'}</p>
                {payment?.plannedDate && <p>{payment.plannedDate}</p>}
              </section>
            </div>

            <div className="invoice-total"><span>Total pembayaran</span><strong>{currency(payment?.amount)}</strong></div>
            <footer className="invoice-footer">Status pembayaran diverifikasi langsung dari server Namastra Travel dan CashUP.</footer>
          </article>

          <div className="payment-actions">
            <button type="button" className="btn btn-primary" onClick={() => window.print()} aria-label="Cetak invoice">Cetak invoice</button>
            <Link to="/" className="btn btn-outline">Kembali ke Home</Link>
          </div>
        </div>
      </section>
    </>
  )
}