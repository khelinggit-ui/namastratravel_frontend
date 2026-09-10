import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import TourCard from '../components/TourCard'
import Reveal from '../components/Reveal'
import { getTours } from '../api'
import usePageMeta from '../hooks/usePageMeta'
import './Tour.css'

export default function Tour() {
  usePageMeta({
    title: 'Cari Tour',
    description: 'Temukan paket tour domestik dan mancanegara dengan filter kategori dan pencarian.',
  })
  const [tours, setTours] = useState([])
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getTours({ category, q: query }).then((list) => {
      setTours(list)
      setLoading(false)
    })
  }, [category, query])

  const filters = [
    { value: 'all', label: 'Semua' },
    { value: 'domestik', label: 'Domestik' },
    { value: 'mancanegara', label: 'Mancanegara' },
  ]

  return (
    <>
      <PageHero
        eyebrow="Tour"
        title="Cari Paket Tour Favorit Anda"
        subtitle="Domestik maupun mancanegara — temukan perjalanan yang paling sesuai dengan gaya dan budget Anda."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Tour' }]}
      />

      <section className="section">
        <div className="container">
          <div className="tour-toolbar">
            <div className="tour-filters" role="group" aria-label="Filter kategori tour">
              {filters.map((f) => (
                <button
                  key={f.value}
                  className={`chip ${category === f.value ? 'is-active' : ''}`}
                  onClick={() => setCategory(f.value)}
                  aria-pressed={category === f.value}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="tour-search">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="search"
                placeholder="Cari tour..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Cari tour"
              />
            </div>
          </div>

          {loading ? (
            <p className="tour-state">Memuat data...</p>
          ) : tours.length === 0 ? (
            <p className="tour-state">Tidak ada tour yang cocok dengan pencarian Anda.</p>
          ) : (
            <div className="grid grid-3">
              {tours.map((t, i) => (
                <Reveal key={t.id} delay={i * 60}>
                  <TourCard tour={t} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}