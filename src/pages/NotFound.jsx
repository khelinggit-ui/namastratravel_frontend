import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="404" title="Halaman Tidak Ditemukan" subtitle="Halaman yang Anda cari mungkin telah dipindah atau dihapus." />
      <section className="section">
        <div className="container text-center">
          <p style={{ fontSize: '1.2rem', marginBottom: 24 }}>Sepertinya Anda tersesat. Mari kembali berjelajah.</p>
          <Link to="/" className="btn btn-primary">Kembali ke Home</Link>
        </div>
      </section>
    </>
  )
}