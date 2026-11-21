# Web Kedinasan

Aplikasi try out kedinasan (SKD — TWK/TIU/TKP) yang dibangun ulang sebagai
**Next.js murni** (App Router) dan siap dideploy ke **Vercel**. Tidak ada
kode lama tersisa: semua layar, panel admin, dan gaya ditulis sebagai
komponen React dengan CSS terpusat di `src/styles/app.css`.

## Fitur

- **Auth siswa**: daftar, verifikasi (tautan konfirmasi), masuk, lupa kunci,
  ubah profil & foto. Kunci disimpan sebagai hash PBKDF2-SHA-256
  (`pbk:<salt32hex><hash64hex>`, 100.000 iterasi).
- **Beranda & katalog**: banner, paket try out, halaman `/semua` dan
  `/kategori/[type]` (TWK/TIU/TKP).
- **Ujian**: timer per sesi, navigasi Daftar Nomor, penilaian di browser,
  hasil tersimpan (`res`) + riwayat (`hist`). Ujian < 60 detik tidak bisa
  diakhiri (modal "Masih terlalu awal").
- **Pembelian**: halaman `/beli/[id]` → `/bayar/[id]`. Pembayaran hanya
  **QRIS via gateway KiPay** (`src/lib/kipay.js`): transaksi dibuat via API,
  QR diambil dari `qr_url`, status di-polling tiap 3 detik; transaksi sandbox
  (trx_id `SBX-`) mendapat tombol **Simulasikan Bayar**. Tanpa
  `NEXT_PUBLIC_KIPAY_API_KEY`, halaman jatuh ke mode simulasi manual seperti
  sebelumnya. Paket terbeli muncul di `/paket`.
- **Panel operator `/admin`**: ringkasan, kelola paket + bank soal (editor
  soal, bulk paste `///`/`|||`, publish dengan validasi), pemasaran
  (banner/logo/promo/metode bayar), dan akun. Akun demo bawaan:
  `1@gmail.com` / `123456`.
- **Mode Operator**: dari halaman profil, ketuk logo aplikasi 12×.

## Mode data

Saat ini **localStorage murni** dengan kunci `kedinasan_v2` (kompatibel dengan
data versi lama — shape state tidak berubah). Sinkronisasi Supabase sengaja
belum diwire dan menjadi fase berikutnya; skema SQL-nya sudah disiapkan di
`docs/SUPABASE.sql` dan rencananya diringkas di `docs/SUPABASE.md`.

## Pembayaran (KiPay)

QRIS di `/bayar/[id]` memakai [KiPay](https://kipay.biz.id/docs):

1. Set `NEXT_PUBLIC_KIPAY_API_KEY` (`.env.local`, atau env Vercel) dengan API
   key project dari dashboard KiPay.
2. Saat halaman dibuka, aplikasi membuat transaksi
   `POST /api/pay/{apiKey}/transactions` dan menampilkan `qr_url`.
3. Production: tombol **Cek Status** mem-polling
   `GET /transactions/{trxId}` tiap 3 detik sampai `paid`.
   Sandbox: tombol **Simulasikan Bayar** memanggil endpoint `/simulate`.
4. Fulfillment (paket masuk `owned`) terjadi setelah status `paid` terbaca
   dari API — bukan dari tombol lokal.

Catatan: API key KiPay tampil di URL QR sesuai desain API-nya (key di path);
ini memang kunci publik project, bukan secret server. Tanpa key, halaman
kembali ke mode simulasi manual (QR dari Panel Admin + tombol simulasi).

## Struktur

```
next.config.mjs           poweredByHeader off, eslint skip, redirect /cms → /admin
jsconfig.json             alias @/* → root (wajib untuk import lintas route group)
vercel.json               header keamanan (nosniff, CSP report-only, dst.)
app/
  layout.jsx              Kerangka HTML + metadata + CSS global (server component)
  (siswa)/page.jsx        Beranda (route group siswa)
  (siswa)/                Rute wajib login: paket, semua, kategori, ujian/[id],
                          hasil/[id], bayar/[id], beli/[id], profil, notifikasi
  (auth)/                 Rute tamu: masuk, daftar, verifikasi, lupa
  admin/page.jsx          Halaman /admin → src/admin/AdminApp.jsx
src/
  admin/
    AdminApp.jsx          Gate login operator + tab panel (ringkasan, dst.)
    PackageAdmin.jsx      Kelola paket: editor info, bank soal, bulk paste,
                          publish/validasi, hide/show, hapus
  components/
    AppShell.jsx          RequireUser/RequireGuest, Modal, Sheet, PackageCard,
                          Photo, nav bawah
  lib/
    model.js              State awal + normalisasi + DEFAULT (localStorage kedinasan_v2)
    store.js              useStore/update (window.__kedinasanStore, dipakai e2e)
    auth.js               login/register/verifyEmail/resetPassword/logout/
                          updateMe/setPhoto/checkPassword/hashPassword (PBKDF2)
    kipay.js              Client gateway KiPay (buat transaksi, status, simulasi)
    image.js              compressImage() untuk unggahan (thumbnail/banner/soal)
  styles/app.css          Satu-satunya stylesheet (menggantikan 7 file revisi lama)
public/
  pay/*.svg               Logo QRIS/BCA/BRI/Mandiri untuk halaman bayar
docs/
  DEPLOYMENT.md           Langkah deploy Vercel + checklist rilis
  SUPABASE.md             Status integrasi (belum terhubung) + rencana
  SUPABASE.sql            Skema tabel + RLS untuk fase sinkronisasi
tools/
  e2e.mjs                 E2E CDP Chrome headless: daftar → verifikasi → masuk →
                          beli → bayar → ujian → hasil (tanpa dependency)
  check-build.mjs         Preflight hasil build (.next/BUILD_ID, chunk, aset pay/)
```

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm install` | Pasang dependency |
| `npm run dev` | Server dev Next.js (http://localhost:3000) |
| `npm run build` | Build produksi ke `.next/` |
| `npm run start` | Menyajikan hasil build di :3000 |
| `npm run e2e` | Uji alur penuh via Chrome headless (butuh dev server jalan) |
| `npm run check:dist` | Preflight hasil build sebelum deploy |
| `npm run deploy` | Build + check:dist + rilis Vercel (`vercel --prod`) |
| `npm run deploy:preview` | Rilis preview Vercel (URL sekali pakai) |

## Catatan pengembangan

- **Jangan jalankan `npm run build` selagi dev server hidup** — keduanya
  menulis `.next/`.
- Dev server React bisa lambat menghidrasi (~10 detik di Chrome headless).
  Skrip e2e menunggu `__reactProps` terpasang sebelum mengklik (`waitHydrated()`).
- Impor lintas route group memakai alias `@/src/...` (bukan `../` yang rawan
  salah hitung).
- State aplikasi bisa diintip/diubah dari konsol: `window.__kedinasanStore`.
- Sesi admin disimpan di `sessionStorage['kedinasan_admin']`; mode operator di
  `sessionStorage['kedinasan_op']`.

## Deploy ke Vercel

Dashboard → **Add New… → Project** → import repo:

- Framework preset: **Next.js** (terdeteksi otomatis)
- Build command: `npm run build` (bawaan)
- Install command: `npm install` (memakai `package-lock.json`)
- Node version: 20 atau lebih baru

Atau lewat CLI (sekali saja perlu `npx vercel login`):

```bash
npm run deploy          # build + check:dist + npx vercel --prod
npm run deploy:preview  # build + check:dist + npx vercel (URL preview)
```

`vercel.json` mengatur header keamanan (`nosniff`, `Referrer-Policy`,
CSP report-only, `X-Frame-Options`). Tidak ada env yang dibutuhkan saat ini.

### Checklist sebelum rilis

1. `npm run build && npm run check:dist` — memastikan build lengkap dan aset
   `pay/*.svg` ikut. `npm run deploy` menjalankan ini otomatis.
2. Setelah live, cek: `/` tampil, `/masuk` bisa daftar/masuk, `/admin` bisa
   dibuka (refresh tidak 404), `/pay/qris.svg` balas 200.
3. Data pengguna ada di localStorage peramban — tidak ada backup server.
   Sinkronisasi Supabase adalah fase berikutnya (lihat `docs/SUPABASE.md`).

## Aturan penting

1. **Penilaian ujian masih di browser** (kunci jawaban `q.a`). Untuk ujian yang
   dipercaya, nilai harus dihitung server dan soal dikirim tanpa kunci —
   bagian dari fase Supabase.
2. Kunci akun disimpan sebagai hash PBKDF2 — jangan pernah menyimpan plaintext.
3. Panel admin hanya gerbang perangkat (`sessionStorage`), bukan pengamanan
   server; jangan anggap data terlindungi sebelum ada backend.
