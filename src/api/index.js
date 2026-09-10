import { tours, destinations, blogs, testimonials, about, siteSettings } from '../data/mockData'
import { API_BASE_URL, USE_MOCK } from './config'

const json = async (res) => {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json()
}

const request = (path, options = {}) => {
  const token = localStorage.getItem('customer_token')
  return fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  }).then(json)
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const clone = (arr) => arr.map((x) => ({ ...x }))
const bySlug = (arr, slug) => arr.find((x) => x.slug === slug)

// Konversi key API dari snake_case (Laravel) ke camelCase (frontend)
const toCamel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
const deepCamel = (o) => {
  if (Array.isArray(o)) return o.map(deepCamel)
  if (o && typeof o === 'object') {
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [toCamel(k), deepCamel(v)]))
  }
  return o
}

// ---- Config public ----
export const getSiteSettings = async () => {
  if (USE_MOCK) {
    await delay(120)
    return { ...siteSettings }
  }
  return deepCamel(await request('/settings'))
}

// ---- Tours ----
export const getTours = async (filters = {}) => {
  if (USE_MOCK) {
    await delay(150)
    let list = clone(tours)
    if (filters.category && filters.category !== 'all') {
      list = list.filter((t) => t.category === filters.category)
    }
    if (filters.q) {
      const q = filters.q.toLowerCase()
      list = list.filter((t) => (t.title + ' ' + t.location + ' ' + t.tagline).toLowerCase().includes(q))
    }
    return list
  }
  const params = new URLSearchParams(filters).toString()
  return deepCamel(await request(`/tours${params ? `?${params}` : ''}`))
}

export const getTour = async (slug) => {
  if (USE_MOCK) {
    await delay(120)
    const tour = bySlug(tours, slug)
    if (!tour) throw new Error('Tour not found')
    return { ...tour }
  }
  return deepCamel(await request(`/tours/${slug}`))
}

// ---- Destinations ----
export const getDestinations = async () => {
  if (USE_MOCK) {
    await delay(150)
    return clone(destinations)
  }
  return deepCamel(await request('/destinations'))
}

export const getDestination = async (slug) => {
  if (USE_MOCK) {
    await delay(120)
    const d = bySlug(destinations, slug)
    if (!d) throw new Error('Destination not found')
    return { ...d, tours: tours.filter((t) => d.tourIds?.includes(t.id)) }
  }
  return deepCamel(await request(`/destinations/${slug}`))
}

// ---- Blog ----
export const getBlogs = async (filters = {}) => {
  if (USE_MOCK) {
    await delay(150)
    let list = clone(blogs)
    if (filters.category && filters.category !== 'all') {
      list = list.filter((b) => b.category === filters.category)
    }
    if (filters.q) {
      const q = filters.q.toLowerCase()
      list = list.filter((b) => (b.title + ' ' + b.excerpt).toLowerCase().includes(q))
    }
    return list
  }
  return deepCamel(await request('/posts'))
}

export const getBlog = async (slug) => {
  if (USE_MOCK) {
    await delay(120)
    const post = bySlug(blogs, slug)
    if (!post) throw new Error('Post not found')
    return { ...post }
  }
  return deepCamel(await request(`/posts/${slug}`))
}

// ---- Testimonials / About ----
export const getTestimonials = async () => {
  if (USE_MOCK) {
    await delay(120)
    return clone(testimonials)
  }
  return deepCamel(await request('/testimonials'))
}

export const getAbout = async () => {
  if (USE_MOCK) {
    await delay(120)
    return { ...about }
  }
  return deepCamel(await request('/about'))
}

// ---- Submissions ----
export const submitBooking = async (payload) => {
  if (USE_MOCK) {
    await delay(600)
    console.info('[mock] booking saved', payload)
    return { success: true, message: 'Terima kasih! Tim kami akan menghubungi Anda segera.' }
  }
  return request('/bookings', { method: 'POST', body: JSON.stringify(payload) })
}

export const startCashupPayment = async (payload) => {
  return deepCamel(await request('/payments/cashup/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  }))
}

export const getCashupPaymentStatusByOrder = async (orderId) => {
  return deepCamel(await request(`/payments/cashup/status-by-order/${encodeURIComponent(orderId)}`))
}

export const customerLogin = async (payload) => {
  const result = await request('/customer/login', { method: 'POST', body: JSON.stringify(payload) })
  localStorage.setItem('customer_token', result.token)
  localStorage.setItem('customer_user', JSON.stringify(result.user))
  return deepCamel(result)
}

export const getCustomerBookings = async () => deepCamel(await request('/customer/bookings'))

export const customerLogout = async () => {
  try {
    await request('/customer/auth/logout', { method: 'POST' })
  } finally {
    localStorage.removeItem('customer_token')
    localStorage.removeItem('customer_user')
  }
}

export const submitContact = async (payload) => {
  if (USE_MOCK) {
    await delay(500)
    console.info('[mock] contact saved', payload)
    return { success: true, message: 'Pesan Anda telah terkirim.' }
  }
  return request('/contacts', { method: 'POST', body: JSON.stringify(payload) })
}