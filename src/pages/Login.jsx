import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { customerLogin } from '../api'
import usePageMeta from '../hooks/usePageMeta'
import './CustomerAccount.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  usePageMeta({ title: 'Login Customer' })

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await customerLogin(values)
      navigate(location.state?.from || '/riwayat-booking', { replace: true })
    } catch {
      setError('Email atau password salah. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="account-page">
      <div className="container account-shell">
        <section className="account-card">
          <span className="eyebrow">Customer area</span>
          <h1>Masuk ke akun Anda</h1>
          <p className="account-intro">Lihat status dan riwayat booking perjalanan Anda.</p>
          <form onSubmit={onSubmit} className="account-form">
            <label>Email<input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required autoComplete="email" /></label>
            <label>Password<input type="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} required autoComplete="current-password" /></label>
            {error && <p className="account-error">{error}</p>}
            <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Memproses...' : 'Masuk'}</button>
          </form>
          <p className="account-note">Belum punya akun? Buat akun saat melakukan booking tour.</p>
          <Link to="/tour" className="account-back-link">Lihat pilihan tour</Link>
        </section>
      </div>
    </main>
  )
}
