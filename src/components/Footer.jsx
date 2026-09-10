import { Link } from 'react-router-dom'
import Logo from './Logo'
import WingDivider from './WingDivider'
import { useSiteSettings } from '../context/SiteSettingsContext'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const siteSettings = useSiteSettings()
  return (
    <footer className="footer">
      <WingDivider />
      <div className="container footer-main">
        <div className="footer-col footer-brand">
          <Logo />
          <p className="footer-about">
            Company profile tour & travel domestik dan mancanegara. Kami membantu Anda menikmati
            perjalanan dengan aman, nyaman, dan berkesan.
          </p>
          <div className="footer-social">
            <a href={siteSettings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
            <a href={siteSettings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">FB</a>
            <a href={siteSettings.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">TT</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Menu</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/tentang">Tentang Kami</Link></li>
            <li><Link to="/tour">Tour</Link></li>
            <li><Link to="/destinasi">Destinasi</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/kontak">Kontak</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Layanan</h4>
          <ul>
            <li><Link to="/tour">Tour Domestik</Link></li>
            <li><Link to="/tour">Tour Mancanegara</Link></li>
            <li><Link to="/destinasi">Paket Destinasi</Link></li>
            <li><Link to="/blog">Tips Travel</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Kontak</h4>
          <ul className="footer-contact">
            <li>{siteSettings.address}</li>
            <li><a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}>{siteSettings.phone}</a></li>
            <li><a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a></li>
            <li>{siteSettings.hours}</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {year} {siteSettings.name}. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}