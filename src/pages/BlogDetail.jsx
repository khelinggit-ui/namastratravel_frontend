import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBlog, getBlogs } from '../api'
import Reveal from '../components/Reveal'
import usePageMeta from '../hooks/usePageMeta'
import './BlogDetail.css'

const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

export default function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])

  usePageMeta({ title: post?.title, description: post?.excerpt })

  useEffect(() => {
    getBlog(slug).then(setPost)
    getBlogs().then((all) => setRelated(all.filter((p) => p.slug !== slug).slice(0, 2)))
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!post) return <p className="detail-loading">Memuat...</p>

  const shareLinks = [
    { label: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}` },
    { label: 'X / Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}` },
  ]

  return (
    <>
      <article className="blog-detail">
        <header className="blog-detail-header">
          <div className="container">
            <nav className="page-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="crumb-sep">/</span>
              <Link to="/blog">Blog</Link>
              <span className="crumb-sep">/</span>
              <span aria-current="page">{post.title}</span>
            </nav>
            <span className="badge badge-lime">{post.category}</span>
            <h1>{post.title}</h1>
            <div className="blog-detail-meta">
              <span>Oleh {post.author}</span>
              <span>•</span>
              <time>{new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
            </div>
          </div>
        </header>

        <div className="blog-detail-cover container">
          <img src={post.cover} alt={post.title} />
        </div>

        <div className="container blog-detail-body">
          <div className="blog-share">
            <span>Bagikan</span>
            <div className="blog-share-links">
              {shareLinks.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="share-btn" aria-label={`Bagikan di ${s.label}`}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div className="blog-content">
            {post.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="blog-cta">
              <h3>Tertarik menjelajah bersama kami?</h3>
              <p>Hubungi kami untuk merencanakan perjalanan impian Anda.</p>
              <Link to="/kontak" className="btn btn-primary">Hubungi Kami</Link>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section section-surface">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">Baca Juga</span>
              <h2 className="section-title">Artikel Terkait</h2>
            </Reveal>
            <div className="grid grid-2">
              {related.map((b) => (
                <Reveal key={b.id}>
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
          </div>
        </section>
      )}
    </>
  )
}