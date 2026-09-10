import { useSiteSettings } from '../context/SiteSettingsContext'
import './WhatsAppFloat.css'

export default function WhatsAppFloat() {
  const settings = useSiteSettings()
  const message = encodeURIComponent('Halo Namastra Travel, saya ingin bertanya tentang paket tour.')
  return (
    <a
      className="wa-float"
      href={`https://wa.me/${settings.whatsapp}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Hubungi kami via WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.1.2-.2.3-.4.5l-.5.6c-.2.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1s.8-.9 1-1.3c.2-.3.4-.3.7-.2l1.9.9c.3.2.5.3.5.4.1.2.1.8-.1 1.5Z" />
      </svg>
    </a>
  )
}