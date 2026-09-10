# Integrasi Cash Link CashUP

Dokumen ini menjelaskan integrasi hosted payment link Cash Link Direct Channel v1.2 pada Namastra Travel.

## Arsitektur

```text
React -> Laravel /api/payments/cashup/create -> CashUP Login
                                             -> CashUP Generate Link
React <- payment_url <- Laravel
Customer -> payment_url CashUP
CashUP -> Laravel callback
Laravel -> CashUP Check Status
React -> Laravel status-by-order
```

Credential CashUP hanya berada di Laravel. React tidak pernah menerima password, `device_id`, atau JWT CashUP.

## Endpoint CashUP yang digunakan

| Fungsi | Method | Path |
|---|---|---|
| Login | POST | `/MmCorePsgsHost/v1/login` |
| Generate payment link | POST | `/MmCoreCzLinkHost/api/v1/generate` |
| Check payment status | GET | `/MmCoreCzLinkHost/internal/payment/status/{order_id}` |

Base URL production dari dokumen CashUP adalah `https://api-link.cashup.id`. Dokumen menyatakan environment development `N/A`, sehingga jangan menganggap credential yang diberikan adalah credential sandbox.

## Setup localhost

### 1. Backend

```powershell
Set-Location backend
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate --seed
```

Isi `.env` Laravel:

```env
CASHUP_BASE_URL=https://api-link.cashup.id
CASHUP_USERNAME=USERNAME_CASHUP
CASHUP_PASSWORD=PASSWORD_CASHUP
CASHUP_DEVICE_ID=DEVICE_ID_CASHUP
CASHUP_AUTH_SCHEME=
CASHUP_CALLBACK_URL=https://PUBLIC-TUNNEL/api/payments/cashup/callback
CASHUP_REDIRECT_URL=http://localhost:5173/payment/result
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Mailtrap untuk testing email

Gunakan konfigurasi SMTP berikut di `backend/.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=USERNAME_MAILTRAP
MAIL_PASSWORD=PASSWORD_MAILTRAP
MAIL_SCHEME=null
MAIL_FROM_ADDRESS=booking@namastratravel.com
MAIL_FROM_NAME="Namastra Travel"
```

Email customer dikirim ketika payment link CashUP berhasil dibuat dan ketika status berubah menjadi `paid`. Kegagalan SMTP dicatat di log dan tidak membatalkan transaksi CashUP.

`CASHUP_AUTH_SCHEME` sengaja kosong karena dokumentasi hanya menyebut `Authorization: JWT Token`. Jika CashUP mengharuskan Bearer token, isi:

```env
CASHUP_AUTH_SCHEME=Bearer
```

Setelah mengubah `.env`:

```powershell
php artisan config:clear
php artisan cache:clear
php artisan serve --port=8000
```

### 2. Frontend

Frontend sudah diarahkan ke Laravel lokal melalui `src/api/config.js`:

```js
export const API_BASE_URL = 'http://localhost:8000/api'
export const USE_MOCK = false
```

Frontend berjalan di `http://localhost:5173` setelah menjalankan:

```powershell
Set-Location ..
npm install
npm run dev
```

### 3. Callback dari CashUP

`localhost` tidak bisa diakses server CashUP. Gunakan tunnel publik, misalnya:

```powershell
ngrok http 8000
```

Jika URL tunnel adalah `https://contoh.ngrok-free.app`, isi:

```env
CASHUP_CALLBACK_URL=https://contoh.ngrok-free.app/api/payments/cashup/callback
```

URL tunnel harus aktif selama pengujian. `CASHUP_REDIRECT_URL` boleh tetap mengarah ke `http://localhost:5173/payment/result` karena redirect tersebut dibuka oleh browser customer.

## Alur aplikasi

1. Customer membuka detail tour.
2. React mengirim `customer_name`, kontak, `tour_slug`, dan jadwal ke Laravel.
3. Laravel mencari tour published berdasarkan `tour_slug`.
4. Laravel mengambil harga dari database, termasuk harga jadwal jika tersedia.
5. Laravel membuat booking dengan `payment_status=pending`.
6. Laravel login ke CashUP menggunakan `MD5(password)` dan `SHA-256(device_timestamp + MD5(password))`.
7. Laravel memanggil Generate Link.
8. React mengarahkan customer ke `payment_url` CashUP.
9. CashUP mengirim callback ke Laravel dan/atau redirect customer ke frontend.
10. Laravel memanggil Check Status. Query parameter redirect tidak dianggap sebagai bukti pembayaran.
11. Booking hanya menjadi `paid` jika CashUP mengembalikan `payment_link_status=PAID`.

## Endpoint Namastra

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/payments/cashup/create` | Membuat booking pending dan payment link |
| GET | `/api/payments/cashup/callback` | Callback server dari CashUP |
| GET | `/api/payments/cashup/status/{booking}` | Sinkronisasi berdasarkan ID booking |
| GET | `/api/payments/cashup/status-by-order/{orderId}` | Sinkronisasi berdasarkan order CashUP |

Contoh request ke endpoint create:

```json
{
  "customer_name": "Nama Customer",
  "tour_slug": "bali-5-hari",
  "schedule_start_date": "24 Dec 2026",
  "whatsapp": "08123456789",
  "email": "customer@example.com",
  "destination": "Tour Bali 5 hari 4 malam",
  "pax": "2 orang",
  "date": "24 Dec 2026 - 28 Dec 2026"
}
```

Response berhasil:

```json
{
  "booking_id": 12,
  "payment_url": "https://link.cashup.id/payment/...",
  "order_id": "cashup-order-id",
  "amount": 4500000
}
```

## Database

Migration payment menambahkan kolom berikut ke `bookings`:

- `customer_name`
- `payment_status`
- `payment_provider`
- `payment_order_id`
- `payment_invoice_number`
- `payment_amount`
- `payment_url`
- `paid_at`

Status payment yang digunakan aplikasi: `pending`, `paid`, `failed`, `expired`, dan `cancelled`.

## Pengujian manual

1. Jalankan Laravel di port 8000.
2. Jalankan tunnel ke port 8000.
3. Pastikan migration sudah dijalankan.
4. Buka frontend lokal.
5. Buka detail tour yang mempunyai `price_start` lebih dari Rp1.000.
6. Klik `Booking Sekarang`.
7. Isi nama, WhatsApp, email, dan detail tujuan.
8. Klik `Lanjut ke Pembayaran`.
9. Pastikan browser diarahkan ke CashUP.
10. Setelah kembali, halaman `/payment/result` membaca `orderId` dan meminta status ke Laravel.
11. Periksa record booking melalui admin atau database.

Jangan menggunakan nominal besar sebelum CashUP mengonfirmasi bahwa credential dapat digunakan untuk pengujian. Karena dokumentasi tidak menyediakan sandbox, transaksi mungkin tercatat sebagai transaksi production.

## Keamanan

- Jangan commit `backend/.env`.
- Jangan menaruh credential di React atau `VITE_*` variable.
- Jangan mencatat password, JWT, card number, expiry, atau CVV ke log.
- Jangan menjadikan `status` dari URL redirect sebagai bukti pembayaran.
- Selalu panggil Check Status dari Laravel.
- Batasi callback dan create endpoint dengan rate limit.
- Rotasi password CashUP karena credential pernah dibagikan di percakapan.
- Untuk production, gunakan callback `https://admin.namastratravel.my.id/api/payments/cashup/callback`, redirect `https://namastratravel.my.id/payment/result`, dan CORS hanya untuk domain frontend production.

## Card, VA, dan QRIS

Implementasi ini memakai hosted payment link sehingga CashUP menangani pilihan pembayaran. API VA, QRIS, dan Card Not Present tidak dipanggil oleh React.

Jika nantinya diperlukan UI pembayaran custom:

- VA: `GET /internal/payment/va/list/{order_id}` lalu `GET /internal/payment/va/{order_id}/{app_list_id}`.
- QRIS: `GET /internal/payment/qris/list/{order_id}` lalu `GET /internal/payment/qris/{order_id}/{app_list_id}`.
- CNP: app list, initiate, authenticate, lalu submit `creq` ke ACS URL untuk 3DS.

Card number dan CVV tidak boleh disimpan atau dicatat oleh Namastra. Hosted payment link tetap menjadi pilihan yang lebih sederhana untuk tahap awal.