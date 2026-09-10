// Konfigurasi API
// Saat backend Laravel di folder `backend/` sudah berjalan:
//   API_BASE_URL = 'http://localhost:8000/api'
//   USE_MOCK     = false
 export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const USE_MOCK = false; // false → baca dari backend Laravel