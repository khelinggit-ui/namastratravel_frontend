import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { getDestinations } from '../api'
import usePageMeta from '../hooks/usePageMeta'
import './Destinasi.css'

export default function Destinasi() {
  usePageMeta({
    title: 'Destinasi',
    description: 'Jelajahi destinasi impian — dari keindahan alam lokal hingga pesona kota-kota dunia.',
  })
  const [destinations, setDestinations] = useState([])
  const [group, setGroup] = useState('all')

  useEffect(() => {
    getDestinations().then(setDestinations)
  }, [])

  const groups = [
    { value: 'all', label: 'Semua' },
    { value: 'Indonesia', label: 'Domestik' },
    { value: 'Destinasi', label: 'Mancanegara' },
  ]

  const visible = destinations.filter((d) => {
    if (group === 'all') return true
    return d.type === (group === 'Indonesia' ? 'Domestik' : 'Destinasi')
  })

  return (
    <>
      <PageHero
        eyebrow="Destinasi"
        title="Jelajahi Destinasi Impian"
        subtitle="Dari keindahan alam lokal hingga pesona kota-kota dunia — semua bisa dijelajahi bersama Namastra Travel."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Destinasi' }]}
      />

      <section className="section">
        <div className="container">
          <div className="tour-toolbar">
            <div className="tour-filters" role="group" aria-label="Filter destinasi">
              {groups.map((g) => (
                <button
                  key={g.value}
                  className={`chip ${group === g.value ? 'is-active' : ''}`}
                  onClick={() => setGroup(g.value)}
                  aria-pressed={group === g.value}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-3">
            {visible.map((d, i) => (
              <Reveal key={d.id} delay={i * 70}>
                <Link to={`/destinasi/${d.slug}`} className="dest-card dest-card-lg">
                  <img src={d.image} alt={d.name} loading="lazy" />
                  <div className="dest-card-overlay">
                    <span className="badge badge-lime">{d.type}</span>
                    <h3>{d.name}</h3>
                    <span>{d.country}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}