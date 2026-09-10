import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tentang from './pages/Tentang'
import Tour from './pages/Tour'
import TourDetail from './pages/TourDetail'
import Destinasi from './pages/Destinasi'
import DestinasiDetail from './pages/DestinasiDetail'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Kontak from './pages/Kontak'
import NotFound from './pages/NotFound'
import PaymentResult from './pages/PaymentResult'
import BookingCheckout from './pages/BookingCheckout'
import Login from './pages/Login'
import BookingHistory from './pages/BookingHistory'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/tour/:slug" element={<TourDetail />} />
        <Route path="/destinasi" element={<Destinasi />} />
        <Route path="/destinasi/:slug" element={<DestinasiDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/payment/result" element={<PaymentResult />} />
        <Route path="/booking/:slug" element={<BookingCheckout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/riwayat-booking" element={<BookingHistory />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}