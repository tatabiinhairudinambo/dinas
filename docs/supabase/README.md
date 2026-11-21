# Template email Supabase (siap tempel)

Aplikasi memakai **kode 6 digit**. Template yang wajib memuat `{{ .Token }}`:

| Template | Kapan dipakai | Subjek |
| --- | --- | --- |
| **Magic Link** | verifikasi email sebelum order (`signInWithOtp`) | `Kode verifikasi Web Kedinasan` |
| **Reset password** | menu "Lupa Kunci Akun?" | `Kode reset kunci akun` |
| Confirm signup | hanya jika *Confirm email* dinyalakan (opsional) | `Kode verifikasi Web Kedinasan` |

Tanpa `{{ .Token }}`, email hanya berisi tautan dan layar kode di aplikasi tidak
akan pernah bisa diisi.

> **Alur default:** *Confirm email* = OFF (daftar tanpa OTP). Verifikasi email
> diminta saat pengguna mau order. Isi body template **Magic Link** dengan
> [`confirm-signup.html`](./confirm-signup.html) (sama isinya).

## Cara pasang

1. Buka dashboard project → **Authentication → Email Templates**.
2. Pilih **Magic Link**.
   - Isi **Subject**: `Kode verifikasi Web Kedinasan`
   - **Message body**: salin isi `confirm-signup.html` **mulai baris `<table>`**
     sampai akhir (komentar `<!-- ... -->` di atas tabel tidak perlu ikut).
3. Ulangi untuk **Reset password** dengan `reset-password.html` dan subjek
   `Kode reset kunci akun`.
4. Klik **Save** pada masing-masing template.

## Prasyarat yang mudah terlewat

- **Confirm email OFF**: Authentication → Sign In / Providers → Email →
  *Confirm email* OFF (`mailer_autoconfirm = true`). Pendaftaran tidak mengirim
  email; verifikasi dilakukan saat order lewat OTP email.
  (Kalau ON, pendaftaran memakai kode 6 digit dan aplikasi tetap mendukungnya,
  tetapi batas kirim email bisa menghalangi pendaftaran.)
- **Tabel database**: jalankan SQL berurutan di SQL Editor —
  `docs/SUPABASE.sql`, lalu `docs/supabase/migrations/001`–`005`. Cek cepat:
  `npm run check:supabase`.
- **Site URL** (Authentication → URL Configuration) harus domain produksi,
  mis. `https://nama-app.vercel.app`.
- **Redirect URLs**: tambahkan `https://nama-app.vercel.app/**` (dan
  `http://localhost:3000/**` untuk uji lokal).
- **Masa berlaku kode**: Authentication → Providers → Email → *Email OTP
  Expiration* (default 3600 detik = 1 jam).

## Batas pengiriman email

**Batas berlaku per proyek, bukan per alamat** — ganti email tidak menolong.
SMTP bawaan Supabase ketat (beberapa email per jam). Untuk pemakaian nyata:

1. Authentication → Emails → **SMTP Settings** → isi kredensial Resend/Brevo/dll.
2. Naikkan **Rate Limits** untuk OTP setelah SMTP sendiri aktif.

## Uji cepat setelah dipasang

1. Daftar akun baru → langsung masuk tanpa email.
2. Pilih paket → tekan beli → layar verifikasi muncul → kode masuk ke email.
3. Masukkan kode → langsung lanjut ke halaman pembayaran.
4. Keluar, klik **Lupa Kunci Akun?** → email reset juga memuat 6 digit.

Kalau email tidak masuk: cek **Authentication → Logs**, lalu pastikan template
tersimpan dan SMTP/limit tidak sedang tercapai.
