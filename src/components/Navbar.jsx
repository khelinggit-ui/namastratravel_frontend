import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useSiteSettings } from '../context/SiteSettingsContext'
import './Navbar.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/tentang', label: 'Tentang Kami' },
  { to: '/tour', label: 'Tour' },
  { to: '/destinasi', label: 'Destinasi' },
  { to: '/blog', label: 'Blog' },
  { to: '/kontak', label: 'Kontak' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [customer, setCustomer] = useState(null)
  const location = useLocation()
  const settings = useSiteSettings()

  const syncCustomer = () => {
    try {
      setCustomer(JSON.parse(localStorage.getItem('customer_user') || 'null'))
    } catch {
      setCustomer(null)
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    syncCustomer()
  }, [location.pathname])

  useEffect(() => {
    window.addEventListener('storage', syncCustomer)
    return () => window.removeEventListener('storage', syncCustomer)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" aria-label="Namastra Travel — Home">
          <Logo />
        </Link>

        <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Navigasi utama">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/tour" className="btn btn-primary nav-cta">
            Cari Tour
          </Link>
          <Link to={customer ? '/riwayat-booking' : '/login'} className="nav-account-link">
            {customer ? `Selamat datang, ${customer.name}` : 'Login'}
          </Link>
        </nav>

        <button
          className="nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu navigasi"
          aria-expanded={open}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <a
          className="navbar-wa"
          href={`https://wa.me/${settings.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.1.2-.2.3-.4.5l-.5.6c-.2.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1s.8-.9 1-1.3c.2-.3.4-.3.7-.2l1.9.9c.3.2.5.3.5.4.1.2.1.8-.1 1.5Z" />
          </svg>
        </a>
      </div>
    </header>
  )
}