import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTour, getTours } from '../api'
import Reveal from '../components/Reveal'
import TourCard from '../components/TourCard'
import { siteSettings } from '../data/mockData'
import usePageMeta from '../hooks/usePageMeta'
import './Detail.css'

const currency = (n) => new Intl.NumberFormat('id-ID').format(n)

const plainDescriptionSections = (value) => {
  const tokens = String(value || '').split(/(RINGKASAN PERJALANAN|Termasuk dalam Paket|Tidak Termasuk|Catatan:)/gi)
  const sections = []
  let heading = 'intro'
  let content = ''

  tokens.forEach((token) => {
    const normalized = token.trim()
    if (/^(RINGKASAN PERJALANAN|Termasuk dalam Paket|Tidak Termasuk|Catatan:)$/i.test(normalized)) {
      if (content.trim()) sections.push({ heading, content: content.trim() })
      heading = normalized.toLowerCase() === 'ringkasan perjalanan' ? 'Ringkasan perjalanan' : normalized
      content = ''
    } else {
      content += `${token} `
    }
  })
  if (content.trim()) sections.push({ heading, content: content.trim() })
  return sections
}

const renderPlainDescription = (value) => (
  <div className="description-sections">
    {plainDescriptionSections(value).map((section, index) => {
      const paragraphs = section.content
        .replace(/\s+(?=(?:Hari|Day)\s+\d+)/gi, '\n')
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean)

      return (
        <section className={`description-section ${section.heading === 'intro' ? 'description-intro' : ''}`} key={`${section.heading}-${index}`}>
          {section.heading !== 'intro' && <h3>{section.heading}</h3>}
          {paragraphs.map((paragraph, paragraphIndex) => <p key={`${index}-${paragraphIndex}`}>{paragraph}</p>)}
        </section>
      )
    })}
  </div>
)

const groupItineraryDays = (items) => {
  if (!items?.length) return []
  if (typeof items[0] === 'object' && items[0] !== null) {
    return items.map((item, index) => ({
      day: item.day || String(index + 1),
      route: item.route || 'Rencana Perjalanan',
      details: item.details || '',
      rich: true,
    }))
  }
  const days = []
  items.forEach((item) => {
    const text = String(item).replaceAll('\\t', ' | ').trim()
    const match = text.match(/\b(?:HARI|DAY)\s+(\d+)\b/i)
    if (match) {
      const route = text.split(/\s*[—-]\s*/).slice(1).join(' - ').trim() || text
      days.push({ day: match[1], route: route.replace(/^[:\s]+/, ''), details: [] })
    } else if (days.length) {
      days[days.length - 1].details.push(text)
    }
  })
  return days.length ? days : [{ day: '1', route: 'Rencana Perjalanan', details: items.map((item) => String(item)) }]
}

export default function TourDetail() {
  const { slug } = useParams()
  const [tour, setTour] = useState(null)
  const [related, setRelated] = useState([])
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [openItineraryDay, setOpenItineraryDay] = useState(0)

  usePageMeta({ title: tour?.title, description: tour?.tagline })

  useEffect(() => {
    setActiveImg(0)
    setActiveTab('description')
    setSelectedSchedule(null)
    setOpenItineraryDay(0)
    getTour(slug).then((t) => {
      setTour(t)
      setSelectedSchedule(t.departureSchedules?.find((schedule) => schedule.status !== 'full') || t.departureSchedules?.[0] || null)
      return t
    })
    getTours().then((all) => setRelated(all.filter((t) => t.slug !== slug).slice(0, 3)))
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!tour) return <p className="detail-loading">Memuat...</p>

  const gallery = [tour.image, ...(tour.gallery || [])]
  const waMessage = encodeURIComponent(`Halo, saya tertarik dengan paket tour ${tour.title}. Bisa info lebih lanjut.`)
  const schedules = tour.departureSchedules || []
  const selectedPrice = selectedSchedule?.price ?? tour.priceStart
  const descriptionIsRich = typeof tour.description === 'string' && /<\/?(p|strong|em|ul|ol|h[1-3]|br)\b/i.test(tour.description)
  const itineraryItems = Array.isArray(tour.itinerary)
    ? tour.itinerary
    : typeof tour.itinerary === 'string' && tour.itinerary.trim().startsWith('[')
      ? (() => {
          try {
            const parsed = JSON.parse(tour.itinerary)
            return Array.isArray(parsed) ? parsed : null
          } catch {
            return null
          }
        })()
      : null
  const itineraryDays = groupItineraryDays(itineraryItems)

  return (
    <>
      <section className="detail-hero">
        <div className="container detail-hero-inner">
          <div className="detail-gallery">
            <div className="detail-main-img">
              <img src={gallery[activeImg]} alt={tour.title} />
              {tour.tag && <span className="badge badge-lime detail-tag">{tour.tag}</span>}
            </div>
            {gallery.length > 1 && (
              <div className="detail-thumbs">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    className={`detail-thumb ${i === activeImg ? 'is-active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Lihat gambar ${i + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-info">
            <nav className="page-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="crumb-sep">/</span>
              <Link to="/tour">Tour</Link>
              <span className="crumb-sep">/</span>
              <span aria-current="page">{tour.title}</span>
            </nav>
            <span className="badge badge-green">{tour.category === 'domestik' ? 'Domestik' : 'Mancanegara'}</span>
            <h1>{tour.title}</h1>
            <p className="detail-tagline">{tour.tagline}</p>

            <div className="detail-facts">
              <div className="detail-fact">
                <span className="detail-fact-icon" aria-hidden="true">⏱</span>
                <span>Durasi</span>
                <strong>{tour.duration}</strong>
              </div>
              <div className="detail-fact">
                <span className="detail-fact-icon" aria-hidden="true">📍</span>
                <span>Lokasi</span>
                <strong>{tour.location}</strong>
              </div>
              <div className="detail-fact">
                <span className="detail-fact-icon" aria-hidden="true">👥</span>
                <span>Min. Peserta</span>
                <strong>2 orang</strong>
              </div>
            </div>

            <div className="detail-price-box">
              <span className="tour-card-price-label">Harga mulai dari</span>
              <span className="detail-price">Rp {currency(tour.priceStart)}</span>
              <span className="detail-price-note">/ orang, fleksibel sesuai jumlah peserta</span>
            </div>

          </div>
        </div>
      </section>

      <section className="section">
        <div className="container detail-body">
          <div className="detail-main">
            <div className="detail-tabs" role="tablist" aria-label="Informasi paket tour">
              {[
                { id: 'description', label: 'Deskripsi Paket' },
                { id: 'highlights', label: 'Fasilitas & Highlight' },
                { id: 'itinerary', label: 'Itinerary' },
                { id: 'schedules', label: 'Jadwal Keberangkatan' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`detail-tab ${activeTab === tab.id ? 'is-active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="detail-tab-panel" role="tabpanel">
              {activeTab === 'description' && (
                <>
                  <h2 className="detail-h2">Deskripsi Paket</h2>
                  {descriptionIsRich ? (
                    <div className="detail-rich-text" dangerouslySetInnerHTML={{ __html: tour.description }} />
                  ) : (
                    renderPlainDescription(tour.description)
                  )}
                </>
              )}

              {activeTab === 'highlights' && (
                <>
                  <h2 className="detail-h2">Fasilitas &amp; Highlight</h2>
                  {tour.highlights?.length ? (
                    <ul className="detail-checklist">
                      {tour.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="detail-empty">Informasi fasilitas belum tersedia.</p>
                  )}

                  <div className="detail-includes">
                    <h2 className="detail-h2">Sudah Termasuk</h2>
                    <ul>
                      <li>Akomodasi sesuai paket</li>
                      <li>Transportasi &amp; driver</li>
                      <li>Tour guide berpengalaman</li>
                      <li>Makan sesuai itinerary</li>
                    </ul>
                    <h2 className="detail-h2">Belum Termasuk</h2>
                    <ul>
                      <li>Tiket pesawat (kecuali disebutkan)</li>
                      <li>Pengeluaran pribadi &amp; insurance</li>
                      <li>Tips guide</li>
                    </ul>
                  </div>
                </>
              )}

              {activeTab === 'itinerary' && (
                <>
                  <h2 className="detail-h2">Rencana Perjalanan</h2>
                  {itineraryDays.length ? (
                    <div className="itinerary-accordion">
                      {itineraryDays.map((day, i) => {
                        const isOpen = openItineraryDay === i
                        return (
                          <section className={`itinerary-day ${isOpen ? 'is-open' : ''}`} key={`${day.day}-${i}`}>
                            <button
                              className="itinerary-day-toggle"
                              type="button"
                              aria-expanded={isOpen}
                              onClick={() => setOpenItineraryDay(isOpen ? -1 : i)}
                            >
                              <span>{day.route}</span>
                              <span className="itinerary-chevron" aria-hidden="true">⌄</span>
                            </button>
                            {isOpen && (
                              <div className="itinerary-day-content">
                                <div className="itinerary-day-number">
                                  <span>Day</span>
                                  <strong>{day.day}</strong>
                                </div>
                                <div className="itinerary-day-details">
                                  <p><strong>Route :</strong> {day.route}</p>
                                  <p><strong>Details :</strong> {day.rich ? <span className="detail-rich-text" dangerouslySetInnerHTML={{ __html: day.details }} /> : day.details.join(' ') || 'Detail perjalanan akan diinformasikan oleh tim kami.'}</p>
                                </div>
                              </div>
                            )}
                          </section>
                        )
                      })}
                    </div>
                  ) : typeof tour.itinerary === 'string' && tour.itinerary.trim() ? (
                    <div className="itinerary-day-content itinerary-rich-content">
                      <div className="itinerary-day-number"><span>Day</span><strong>1</strong></div>
                      <div className="itinerary-day-details detail-rich-text" dangerouslySetInnerHTML={{ __html: tour.itinerary }} />
                    </div>
                  ) : (
                    <p className="detail-empty">Itinerary lengkap akan diinformasikan oleh tim kami.</p>
                  )}
                </>
              )}

              {activeTab === 'schedules' && (
                <>
                  <h2 className="detail-h2">Jadwal Keberangkatan</h2>
                  {schedules.length ? (
                    <div className="departure-table-wrap">
                      <table className="departure-table">
                        <thead>
                          <tr>
                            <th>Pilih</th>
                            <th>Dari</th>
                            <th>Ke</th>
                            <th>Tersedianya</th>
                            <th>Dari Harga</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedules.map((schedule, i) => {
                            const isFull = schedule.status === 'full'
                            return (
                              <tr key={`${schedule.startDate}-${i}`} className={isFull ? 'is-full' : ''}>
                                <td>
                                  <input
                                    type="radio"
                                    name="departure-schedule"
                                    checked={selectedSchedule === schedule}
                                    disabled={isFull}
                                    onChange={() => setSelectedSchedule(schedule)}
                                    aria-label={`Pilih jadwal ${schedule.startDate}`}
                                  />
                                </td>
                                <td>{schedule.startDate}</td>
                                <td>{schedule.endDate}</td>
                                <td>{isFull ? 'Trip Full' : 'Trip Available'}</td>
                                <td>Rp {currency(schedule.price ?? tour.priceStart)}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="detail-empty">Jadwal keberangkatan belum tersedia.</p>
                  )}
                </>
              )}
            </div>
          </div>

          <aside className="detail-side">
            <div className="purchase-card card">
              <h3>{tour.title}</h3>
              {selectedSchedule && (
                <>
                  <p><strong>Dari:</strong> {selectedSchedule.startDate}</p>
                  <p><strong>Ke:</strong> {selectedSchedule.endDate}</p>
                </>
              )}
              <div className="purchase-price">
                <span>Harga mulai dari</span>
                <strong>Rp {currency(selectedPrice)}</strong>
              </div>
              <Link className="btn btn-primary btn-block" to={`/booking/${tour.slug}`} state={{ selectedSchedule }}>
                Beli Sekarang
              </Link>
              <button className="btn btn-outline btn-block" onClick={() => setActiveTab('schedules')}>
                Pilih Jadwal Lain
              </button>
              <a
                className="btn btn-whatsapp btn-block"
                href={`https://wa.me/${siteSettings.whatsapp}?text=${waMessage}`}
                target="_blank"
                rel="noreferrer"
              >
                Tanya via WhatsApp
              </a>
            </div>
          </aside>

        </div>
      </section>

      {related.length > 0 && (
        <section className="section section-surface">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">Lainnya</span>
              <h2 className="section-title">Paket Tour Lainnya</h2>
            </Reveal>
            <div className="grid grid-3">
              {related.map((t, i) => (
                <Reveal key={t.id} delay={i * 80}>
                  <TourCard tour={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

    </>
  )
}