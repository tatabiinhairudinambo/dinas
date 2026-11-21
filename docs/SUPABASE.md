# Supabase (mode dual)

Aplikasi bisa jalan dua mode:

| Mode | Kapan | Data disimpan di |
| --- | --- | --- |
| `local` | env Supabase kosong | `localStorage` (`kedinasan_v2`) |
| `supabase` | env terisi | snapshot per user di `public.app_snapshots` + cache lokal |

Tanpa env, tidak ada kode Supabase yang dimuat (dynamic import) dan perilaku
aplikasi identik dengan versi sebelumnya.

## 1. Siapkan project

1. Buat project di [supabase.com](https://supabase.com) (free tier cukup).
2. Salin **Project URL** dan **anon public key** dari Settings â†’ API.
3. Jalankan `docs/SUPABASE.sql` di SQL Editor (tabel + RLS + grant).

## 2. Aktifkan provider email + verifikasi

**Alur yang dipakai aplikasi (rev F3C):**

1. **Daftar tanpa OTP** — pengguna langsung masuk aplikasi.
   Syarat: Authentication → Sign In / Providers → Email → **Confirm email = OFF**
   (`mailer_autoconfirm = true`). Tidak ada email dikirim saat daftar, jadi
   batas kirim email Supabase tidak pernah menghalangi pendaftaran.
2. **Verifikasi saat mau order** — sebelum membeli paket, aplikasi menampilkan
   layar verifikasi di dalamnya (kode 6 digit ke email akun). Setelah kode benar,
   akun ditandai terverifikasi di snapshot dan order dilanjutkan.
   Kode dikirim lewat OTP email Supabase (`signInWithOtp`) → template
   **Magic Link** harus memuat `{{ .Token }}`.
3. Lupa kunci memakai template **Reset password** (juga `{{ .Token }}`).

Jadi dua template yang WAJIB memuat `{{ .Token }}`: **Magic Link** dan
**Reset password**. (Template **Confirm signup** hanya dipakai kalau Confirm
email dinyalakan lagi — opsional.)

```html
<h2>Kode verifikasi Web Kedinasan</h2>
<p>Masukkan kode ini di aplikasi:</p>
<p style="font-size:28px;letter-spacing:6px"><b>{{ .Token }}</b></p>
<p>Kode berlaku 1 jam. Abaikan email ini kalau bukan kamu yang meminta.</p>
```

> Versi siap tempel (HTML penuh + teks subjek + daftar prasyarat): lihat
> [`docs/supabase/`](supabase/README.md).

> **Batas kirim email Supabase berlaku PER PROYEK**, bukan per alamat —
> mengganti email tidak menolong. Bawaan hanya beberapa email per jam. Untuk
> pemakaian nyata, pasang SMTP sendiri di Authentication → Emails → SMTP
> Settings (Resend, Brevo, dst.), lalu naikkan rate limit OTP.

## 3. Isi env

`.env.local` (lokal, jangan di-commit):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Vercel â†’ Project â†’ Settings â†’ Environment Variables: isi dua variabel yang sama
untuk Production, Preview, dan Development, lalu redeploy (env hanya dibaca
saat build).

> Gunakan **anon key**, bukan `service_role`. Anon key memang terlihat di
> browser; proteksi sebenarnya ada di RLS.

## 4. Storage aset (gambar CMS)

Thumbnail produk, banner, logo aplikasi, dan logo metode pembayaran diunggah ke
bucket `assets`; state hanya menyimpan URL publiknya (bukan base64 lagi).

- Buat bucket + policy: jalankan bagian **6. Storage aset** di
  [`docs/SUPABASE.sql`](SUPABASE.sql). Aman diulang.
- Publik **baca** (URL `.../storage/v1/object/public/assets/...` bisa dipakai
  langsung di `<img>`), tulis hanya untuk **user yang login**, maksimal 2 MB,
  hanya PNG/JPEG/WebP.
- CMS mengunggah hasil crop `thumb.js` lalu menyimpan URL-nya. Kalau Supabase
  belum dikonfigurasi atau user belum login, CMS kembali ke perilaku lama
  (data URL lokal) dan menampilkan catatan "disimpan lokal".
- Folder: `produk/`, `banner/`, `logo/`, `pembayaran/`.
- Menghapus gambar di CMS tidak menghapus objek di Storage (riwayat aman,
  pembersihan manual lewat dashboard).

## 5. Katalog bersama (produk untuk semua siswa)

Supabase menyimpan dua lapis data:

| Lapis | Tabel | Isi |
|---|---|---|
| Per akun | `app_snapshots` | users, me, owned, exam, sales, logs (data pribadi) |
| Bersama | `catalog` (id = 1) | `packages` (produk + soal), banner, logo, `pay`/`payList`/`payAcc`, promos, groups |

- Operator mengubah panel CMS â†’ setiap `save()` mengirim snapshot **dan**
  (kalau akunnya terdaftar) potongan katalog ke `catalog` dengan debounce.
- Siswa membuka aplikasi / masuk â†’ `pullRemote()` mengambil snapshot pribadi,
  lalu `pullCatalog()` menimpa bagian bersama (produk, gambar, metode bayar).
  Jadi produk yang dibuat operator langsung terlihat di akun siswa, termasuk
  gambar dari Supabase Storage.
- Hanya akun di `catalog_editors` (by `user_id`) yang lolos RLS tulis.
  Tambah/edit (ambil UUID akun di Auth > Users):
  ```sql
  insert into public.catalog_editors (user_id, note)
  values ('<uuid akun editor>', 'operator CMS');
  ```
- `updated_at` diisi trigger `touch_catalog()` (waktu server). Perangkat
  menyimpan penanda `kedinasan_v2_catalog_at`, jadi katalog hanya dipasang
  kalau versi server lebih baru â€” editan lokal yang belum terkirim tidak
  tertimpa saat reload.
- Kalau siswa sedang di layar ujian, penerapan katalog ditunda (tidak
  mengganggu timer/jawaban). Katalog baru dipasang saat aplikasi dibuka,
  login, atau tab kembali aktif.
- Isi katalog masih memuat kunci jawaban (`q.a`), sama seperti batasan
  anti-curang yang sudah ada â€” lihat bagian batasan.

## 6. Cara kerja

```
boot
 â””â”€ prepareSync()
     â”œâ”€ patch Storage.prototype untuk key kedinasan_v2
     â”œâ”€ auth.getSession()
     â””â”€ kalau ada sesi: tarik app_snapshots
          â”œâ”€ remote lebih baru  -> pasang sebagai cache (sebelum app.js dimuat)
          â””â”€ lokal lebih baru   -> tandai perlu push
 â””â”€ /legacy/app.js          engine membaca localStorage (dari cache)
 â””â”€ bridge-override.js      window.__legacy + login/daftar lewat Supabase
 â””â”€ bootstrapAfterLegacy()  push otomatis saat setiap save()
```

- Setiap `save()` legacy memicu push (debounce 1,2 detik) + saat tab disembunyikan.
  Snapshot pribadi selalu dikirim; potongan katalog hanya kalau akun terdaftar
  di `catalog_editors` (RLS menolak selain itu).
- Daftar: `signUp()` Supabase â†’ layar **Verifikasi Email** minta kode 6 digit â†’
  `verifyOtp({ type: 'signup' })` â†’ akun lokal ditandai `v:1` dan langsung masuk.
- Wajib verifikasi: akun lokal `v:0` tetap ditolak oleh `login()` legacy, dan
  Supabase sendiri tidak memberi sesi sebelum email dikonfirmasi. Login dengan
  email belum terverifikasi otomatis diarahkan ke layar kode.
- Lupa kunci: layar "Lupa Kunci Akun" mengirim kode reset
  (`resetPasswordForEmail`) â†’ `verifyOtp({ type:'recovery' })` â†’
  `updateUser({ password })` â†’ sesi recovery ditutup dan user masuk lagi dengan
  kunci baru. Kunci lokal (`users[].p`) ikut diperbarui agar login offline tetap
  memakai kunci terbaru.
- Login: Supabase dulu; kalau gagal (offline/tidak ada akun) jatuh ke validasi
  lokal lama, sehingga data lama di perangkat tetap bisa dibuka.
- Kunci akun (`users[].p`) **dibuang** sebelum dikirim ke server; saat menarik
  data, kunci milik perangkat dikembalikan ke record yang sama.
- Keluar (tombol Profil menulis `S.me=null`) terdeteksi otomatis dan
  menjalankan `auth.signOut()`.

## 7. Batasan yang harus disadari

1. **Snapshot JSON, bukan tabel ternormalisasi.** Satu baris per user; seluruh
   state (paket, soal, hasil, pembayaran) ada di dalam `data`.
2. **Konflik = last-write-wins** berdasarkan `updated_at` (dengan toleransi 1
   detik). Tulis bersamaan dari dua perangkat bisa saling menimpa.
3. **Belum anti-curang.** `finish()` masih menilai di browser memakai kunci
   jawaban `q.a`. Untuk ujian yang dipercaya, nilai harus dihitung server
   (RPC) dan soal dikirim tanpa kunci.
4. **Operator masih lokal.** Peran operator (12 klik logo) belum jadi role
   Supabase, jadi belum ada pemisahan hak akses di server.

## 8. Uji

```bash
npm run dev            # dengan .env.local terisi
```

1. Daftar akun baru â†’ cek baris muncul di Table Editor `app_snapshots`.
2. Kerjakan satu paket â†’ nilai bertambah â†’ push berikutnya memperbarui `data`.
3. Buka di browser lain (atau mode incognito), masuk dengan akun yang sama â†’
   daftar paket & riwayat nilai ikut muncul.
4. Matikan jaringan â†’ aplikasi tetap jalan (data lokal), push akan gagal dan
   dicatat di `window.HermesSync.status().error`.

## 9. Langkah lanjutan (normalisasi)

Saat layar mulai dikonversi ke React (lihat `MIGRATION.md`), pecah `data` jadi
tabel nyata: `profiles`, `packages`, `questions`, `entitlements`, `attempts`,
`payments`, `promos`, `groups`, `claims`, `app_settings`. Setelah itu:

- soal dikirim lewat view `exam_questions` tanpa `a`/`w`/`pem`;
- mulai & submit ujian lewat RPC `security definer`;
- pembayaran diubah hanya oleh webhook/Edge Function;
- operator memakai klaim `role` di JWT.
