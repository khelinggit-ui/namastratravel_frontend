import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { getBlogs } from '../api'
import usePageMeta from '../hooks/usePageMeta'
import '../pages/Home.css'

export default function Blog() {
  usePageMeta({
    title: 'Blog & Artikel Travel',
    description: 'Tips, itinerary, dan inspirasi perjalanan dari tim Namastra Travel.',
  })
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    getBlogs({ category, q: query }).then(setPosts)
  }, [category, query])

  const categories = ['all', ...new Set(posts.map((p) => p.category))]
  const filtered = posts.filter((p) => {
    const catOk = category === 'all' || p.category === category
    const qOk = !query || (p.title + p.excerpt).toLowerCase().includes(query.toLowerCase())
    return catOk && qOk
  })

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Tips, Itinerary & Inspirasi"
        subtitle="Kumpulan artikel travel untuk membantu Anda mempersiapkan perjalanan berikutnya."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Blog' }]}
      />

      <section className="section">
        <div className="container">
          <div className="tour-toolbar">
            <div className="tour-filters" role="group" aria-label="Filter kategori artikel">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`chip ${category === c ? 'is-active' : ''}`}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                >
                  {c === 'all' ? 'Semua' : c}
                </button>
              ))}
            </div>
            <div className="tour-search">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
              </svg>
              <input type="search" placeholder="Cari artikel..." value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Cari artikel" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="tour-state">Tidak ada artikel yang cocok.</p>
          ) : (
            <div className="grid grid-3">
              {filtered.map((b, i) => (
                <Reveal key={b.id} delay={i * 70}>
                  <Link to={`/blog/${b.slug}`} className="blog-card card">
                    <div className="blog-card-media">
                      <img src={b.cover} alt={b.title} loading="lazy" />
                      <span className="badge badge-lime">{b.category}</span>
                    </div>
                    <div className="blog-card-body">
                      <time dateTime={b.date}>{new Date(b.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                      <h3>{b.title}</h3>
                      <p>{b.excerpt}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}