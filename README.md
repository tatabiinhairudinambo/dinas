# Web Kedinasan

Aplikasi try out kedinasan (SKD/TWK/TIU/TKP) yang sekarang berjalan di atas
**Next.js + React** dan siap dideploy ke **Vercel**.

Isi aplikasi (auth, beranda, pasar paket, ujian, pembayaran, bank soal, grup/amal)
masih memakai mesin lama yang dipindahkan apa adanya, dibungkus oleh shell React.
Alasannya: mesin itu berisi 385 handler inline dan 13 revisi CSS yang saling
menimpa — menulis ulang sekaligus berarti risiko regresi yang sangat besar.
Shell React-lah yang memegang boot, error boundary, dan jalan masuk untuk
mengonversi layar satu per satu (lihat `docs/MIGRATION.md`).

## Mode data

| Mode | Syarat | Data |
| --- | --- | --- |
| `local` (default) | env Supabase kosong | hanya `localStorage` (`kedinasan_v2`) |
| `supabase` | `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | snapshot per user di `public.app_snapshots` + cache lokal |

Tanpa env, kode Supabase tidak dimuat sama sekali (dynamic import) dan perilaku
aplikasi identik dengan versi localStorage-only. Cara memasang, skema SQL, dan
batasannya ada di **`docs/SUPABASE.md`** dan **`docs/SUPABASE.sql`**.

Status sinkronisasi bisa dilihat dari konsol: `window.HermesSync.status()`.

## Panel operator (`/admin`)

Panel desktop terpisah dari shell siswa, dimuat sebagai chunk sendiri supaya
bundle siswa tidak bertambah. Mesin legacy tetap di-boot (disembunyikan) hanya
untuk memakai `S`, `save()`, `parseSoal()`, dan `validate()` yang sama, jadi CMS
tidak punya database kedua dan perubahan langsung ikut tersinkron.

- Tab **Ringkasan** *(Isi aplikasi)*: paket, soal, penjualan, log, dan paket
  bermasalah.
- Tab **Paket** *(Isi aplikasi)*: harga, promo, thumbnail, status tayang,
  publish dengan cek kelengkapan soal, dan hapus paket.
- Tab **Produk** *(Isi aplikasi, demo CRUD)*: tambah produk, edit lewat form
  dengan tombol Simpan, duplikat, dan hapus. Datanya sama dengan tab Paket
  (`S.packages`), jadi tidak ada database kedua — masih `localStorage` sampai
  Supabase siap.
- Tab **Bank Soal** *(Isi aplikasi)*: editor 110 soal SKD (30 TWK, 35 TIU,
  45 TKP), kunci/bobot, pembahasan, pencarian, dan import format `§`/`¦` atau
  format lama `[[SOAL]]`.
- Tab **Tampilan** *(Pengaturan)*: foto banner beranda (`S.bannerImg`; teks
  `S.banner` dikosongkan saat disimpan) dan logo aplikasi/halaman login
  (`S.logo`, `S.logoDark`, `S.loginLogo`, `S.loginLogoDark`) dengan pratinjau.
- Tab **Pembayaran** *(Pengaturan)*: unggah logo tiap metode (`S.pay`), daftar
  metode di `S.payList`, dan **nomor rekening tiap bank** (`S.payAcc[k] =
  {no, name}`). Empat logo bawaan ada di `public/pay/*.svg` dan dipasang sekali
  saat boot (ditandai `S.payDefault`), jadi halaman bayar siswa tidak kosong;
  tombol **Logo bawaan** mengembalikannya kalau sudah diganti. Nomor rekening
  langsung dipakai layar transfer siswa (rev76: label berubah jadi *Nomor
  Rekening*, ada nama pemilik + tombol **Salin**); tanpa nomor, layar tetap
  memakai placeholder VA lama. Metode tambahan (mis. BNI/BTN) **baru disimpan
  sebagai data admin** — halaman pembayaran siswa masih memakai
  QRIS/BCA/BRI/Mandiri sampai integrasinya dibuka nanti.
- Tab **Promo** *(Pengaturan)*: kreator + kode 6 digit (`S.promos`), aktif/mati,
  hapus.
- Tab **Grup** *(Pengaturan)*: grup peserta untuk paket gratis/amal
  (`S.groups`), tambah anggota, dan pembersihan referensi saat grup dihapus.

Panel ini juga responsif tanpa mengubah tampilan desktop: di bawah 1080px
sidebar pindah jadi bar atas (tab bisa digeser ke samping), di bawah 720px
panel jadi satu kolom, kepala panel menumpuk, tabel digeser mendatar, dan
drawer selebar layar; di bawah 560px jarak dan kontrol dirapatkan.

Warnanya tidak berdiri sendiri: token `.cms` di `src/styles/cms.css` menarik
`--bg`/`--tx`/`--mu`/`--bd`/`--cd`/`--ac`/`--shd` dari `01-base.css`, jadi
panel otomatis ikut tema situs (termasuk dark mode dari
`prefers-color-scheme`/`data-theme`) dan aksen banner memakai `--nv`→`--ac`
seperti `.ban` legacy.

Pintu masuknya ada di menu **Dapur Operator**, yang sekarang hanya berisi
**Panel CMS** dan **Keluar Mode Operator** — layar operator legacy lain sudah
digantikan tab di atas. Atau langsung ke `/admin`. Gerbang panel berupa **email +
kunci admin** yang disimpan sebagai hash SHA-256 di `localStorage`
(`kedinasan_cms_gate`) dan hanya mencegah orang iseng di perangkat itu; kalau
`profiles.role = 'operator'` tersedia, gerbang dilewati. Akun bawaan demo:
`1@gmail.com` / `123456` — ganti lewat tab **Pengaturan → Akun Admin**. Akses
tanpa login tetap memakai data perangkat, jadi jangan anggap panel ini
pengamanan server.

**Koneksi Supabase (sekali saja).** Di tab **Akun Admin > Koneksi Supabase**,
masuk dengan akun Supabase operator. Setelah tersambung: gambar diunggah ke
bucket `assets` (bukan base64), dan produk/paket/tampilan otomatis dikirim ke
tabel `catalog` sehingga terlihat di akun siswa. Sesi tersimpan di perangkat;
tanpa sesi, CMS tetap jalan dalam mode lokal (gambar jadi data URL). Hanya
email di `catalog_editors` yang boleh menerbitkan katalog.

## Struktur

```
next.config.mjs           Konfigurasi Next.js (strict mode off untuk engine legacy)
postcss.config.js         PostCSS minimal (autoprefixer saja — CSS legacy sudah modern)
vercel.json               Header cache/keamanan untuk Vercel (framework nextjs)
app/
  layout.jsx              Kerangka HTML + metadata (server component)
  page.jsx                Halaman utama → src/AppClient.jsx (ssr:false)
  admin/page.jsx            Halaman /admin → src/cms/CmsApp.jsx (ssr:false)
src/
  AppClient.jsx           Titik masuk browser: pasang window.mountReactView/Views
  App.jsx                 Batas aplikasi: ErrorBoundary + LegacyHost
  components/
    LegacyHost.jsx       Memasang #app & #m lalu memuat mesin legacy
    ErrorBoundary.jsx
  cms/
    CmsApp.jsx           Shell panel /admin + gerbang kunci lokal + navigasi tab
    ui.jsx               Panel, Badge, Drawer, Field, Progress
    thumb.js             Perkecil gambar (thumbnail 3:2, banner 113:30, logo PNG)
    panels/Overview.jsx  Ringkasan isi aplikasi
    panels/Packages.jsx  Kelola paket, harga, promo, thumbnail
    panels/Products.jsx  Demo CRUD produk (tambah/edit/duplikat/hapus)
    panels/Bank.jsx      Editor + import bank soal
    panels/Banner.jsx    Teks + gambar spanduk beranda siswa
    panels/Appearance.jsx  Banner + logo aplikasi & halaman login
    panels/Payment.jsx   Logo QRIS/BCA/BRI/Mandiri
    panels/Promo.jsx     Kreator + kode promo 6 digit
    panels/Groups.jsx    Grup peserta untuk paket gratis/amal
    panels/Account.jsx   Email + kunci admin panel (gerbang /admin)
  views/
    NotifView.jsx        Layar notifikasi — layar legacy pertama yang digambar React
  lib/
    legacyBridge.js      Boot classic script, status, refresh()
    reactHost.jsx        mountReactView() untuk layar yang dikonversi
    cmsData.js           Baca/tulis state legacy untuk CMS
    storageAdapter.js    Patch localStorage + cache snapshot (mode dual)
    supabase.js          Client Supabase lazy dari env NEXT_PUBLIC_SUPABASE_*
    sync.js              Tarik/push snapshot, login & daftar lewat Supabase
  styles/
    index.css            @import semua file di bawah, urutan = cascade asli
    cms.css              Gaya panel /admin (scope .cms), diimpor CmsApp
    01-base.css          Token & kerangka
    02-rev04-40.css      Revisi 4-40 (dulu di-inject dari script)
    03-rev41-57.css      Layar horizontal, ujian, kisi-kisi
    04-rev58-garis-gelap.css
    05-rev58-62.css      Arena, ambient, kaca
    06-rev59-outline-gelap.css
    07-rev59-74.css      Amal, grup, tombol gratis
public/
  legacy/app.js          Mesin legacy (21 blok script, urutan asli)
  legacy/bridge-override.js  Jembatan login/daftar ke Supabase (classic script)
archive/original.html    File HTML tunggal sebelum migrasi (cadangan)
.env.example             Contoh env Supabase (salin ke .env.local)
docs/
  MIGRATION.md           Cara mengonversi layar ke React
  SUPABASE.md            Setup + batasan mode dual
  SUPABASE.sql           Tabel app_snapshots + RLS
tools/
  extract-legacy.mjs     Regenerasi app.js + CSS dari archive/original.html
  check-legacy.mjs       Cek sintaks sebagai classic script
  smoke-flow.mjs         Smoke test alur utama via Chrome headless
  cms-test.mjs           Uji panel /admin (gerbang, edit, import, reload)
```

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm install` | Pasang dependency |
| `npm run dev` | Server dev Next.js (http://localhost:3000) |
| `npm run build` | Build produksi ke `.next/` |
| `npm run start` | Menyajikan hasil build di :3000 |
| `npm run check:legacy` | Validasi sintaks `public/legacy/app.js` |
| `npm run check:supabase` | Cek tabel/RPC Supabase sudah dibuat (butuh env) |
| `npm run smoke` | Uji alur daftar → login → ujian (data dummy, tanpa Supabase) |
| `npm run test:cms` | Uji panel `/admin` lewat Chrome headless (butuh dev jalan) |
| `npm run test:otp` | Uji layar kode OTP daftar/login; metode jaringan di-stub, tidak mengirim email |
| `npm run test:supabase` | Uji LIVE daftar akun Supabase (OPT-IN, menulis ke Supabase asli — kena rate limit email) |
| `npm run extract:legacy` | Regenerasi mesin legacy + CSS dari `archive/original.html` |
| `npm run deploy` | Build & rilis ke Vercel (`vercel --prod`) |
| `npm run deploy:preview` | Rilis preview Vercel (URL sekali pakai) |

## Alur boot

```
app/layout.jsx              <html>/<body> + import CSS global
  └─ app/page.jsx           dynamic(ssr:false) → src/AppClient.jsx
      └─ AppClient          pasang window.mountReactView + window.Views, render <App/>
          └─ LegacyHost     render <div id="app"> dan <div id="m"> (kosong)
              └─ useEffect  legacyBridge.bootLegacy()
                  ├─ prepareSync()          (opsional) tarik snapshot Supabase
                  ├─ <script src="/legacy/app.js">   classic script, sekali saja
              │   └─ render() dijadwalkan queueMicrotask → menulis ke #app
              ├─ <script src="/legacy/bridge-override.js">
              │   └─ window.__legacy + login/daftar lewat Supabase
              └─ bootstrapAfterLegacy() push otomatis (debounce 1,2 s)
```

React tidak pernah merender anak dari `#app` dan `#m`, jadi mesin legacy bebas
menimpa `innerHTML`-nya. Semua halaman dirender hanya di browser (`ssr:false`)
karena engine butuh `window` dan DOM asli.

## Mode dummy untuk testing

Test tidak boleh menyentuh Supabase (rate limit email per proyek, dan
belum produksi). Ada dua cara mematikan sync:

- `?sync=off` di URL — dipakai `npm run smoke` otomatis (disimpan ke
  `localStorage['kedinasan_sync_off']`).
- Set `localStorage['kedinasan_sync_off'] = '1'` manual sebelum memuat
  halaman; hapus nilainya untuk kembali ke mode Supabase.

Dalam mode dummy, daftar/login/verifikasi memakai validasi lokal engine —
cocok untuk pengembangan harian. `npm run test:otp` berjalan di semua mode
(metode jaringan di-stub di memori). Uji yang benar-benar menulis ke
Supabase harus sengaja dipanggil: `npm run test:supabase`.

Kalau Supabase aktif, pendaftaran mengirim **kode 6 digit** ke email dan akun
baru baru bisa masuk setelah kode diverifikasi (`verifyOtp`). Menu "Lupa Kunci
Akun?" juga memakai kode email + kunci baru, bukan lagi penggantian lokal.
Template email "Confirm signup" **dan** "Reset password" wajib memuat
`{{ .Token }}` — lihat `docs/SUPABASE.md` bagian 2.

`render()` saat load sengaja ditunda satu microtask. Di file aslinya tiap revisi
adalah `<script>` terpisah, sehingga `render()` di blok awal belum mungkin
memanggil fungsi revisi akhir. Setelah digabung jadi satu file, semua `let/const`
berada di satu scope dan masih TDZ saat script berjalan — tanpa penundaan muncul
`Cannot access 'wpLvl59' before initialization`.

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

`vercel` tidak perlu dipasang global; semua script memakai `npx --yes vercel`.

Next.js menangani routing sendiri (`/` dan `/admin` adalah app router pages),
jadi tidak perlu SPA fallback. `vercel.json` mengatur header keamanan
(`nosniff`, `Referrer-Policy`, CSP report-only) dan cache: `/legacy/*`
selalu revalidasi (berkas diganti tanpa nama hash).

Kalau memakai Supabase, isi environment variables di **Project → Settings →
Environment Variables** (Production, Preview, dan Development):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Pakai **publishable/anon key**,
bukan `service_role` — nilai itu ikut ke browser. `.env.local` tidak ikut
ter-commit, jadi Vercel tidak membacanya; env harus diisi di dashboard.

### Checklist sebelum rilis

1. `npm run build && npm run check:dist` — memastikan `index.html`,
   `legacy/*`, dan `pay/*.svg` ikut ter-build, aset yang dirujuk benar-benar
   ada, dan tidak ada kunci `service_role` yang bocor ke bundle. `npm run
   deploy` menjalankan ini otomatis dan berhenti kalau gagal.
2. Env `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` terisi di dashboard
   (Production **dan** Preview). Vercel hanya membaca env saat build, jadi
   **redeploy** setelah menambah/mengubah env.
3. Template email Supabase sudah memuat `{{ .Token }}` — salin dari
   [`docs/supabase/`](docs/supabase/README.md). Env Supabase, Site URL &
   Redirect URLs, SMTP sendiri, dan batasan rate limit OTP lebih detail di
   [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
4. Setelah live, cek: `/` tampil, `/admin` bisa dibuka langsung (refresh tidak
   404), `/pay/qris.svg` dan `/legacy/app.js` balas 200, dan daftar akun baru
   mengirim kode 6 digit.

`.vercelignore` menjaga unggahan tetap ringan (`archive/`, `docs/`, `tools/`,
dan file `.env*` tidak ikut).

## Aturan penting

1. **Jangan mengedit `public/legacy/app.js` langsung.** File itu hasil generate.
   Perbaikan dilakukan di `archive/original.html` (atau di extractor), lalu
   `npm run extract:legacy` dan `npm run build`.
2. **Jangan mengacak urutan `@import` di `src/styles/index.css`.** 37 selector
   dipakai di lebih dari satu revisi; urutan menentukan tampilan.
3. **`app.js` wajib classic script.** Kalau di-`import` lewat bundler, binding
   global dan semua `onclick="..."` mati.
4. **Jangan bungkus `<App/>` dengan `<StrictMode>`** selama mesin legacy masih
   memasang listener global; double-mount di dev menggandakan listener.
5. Data pengguna tersimpan di `localStorage` dengan kunci `kedinasan_v2`.
   Migrasi ini tidak mengubah kunci, jadi data lama tetap terbaca.
6. **Penilaian ujian masih di browser** (`finish()` memakai kunci jawaban `q.a`).
   Mode Supabase menyelamatkan data dan menyinkronkan perangkat, belum
   anti-curang. Untuk ujian yang dipercaya, nilai harus dihitung server (RPC)
   dan soal dikirim tanpa kunci — lihat `docs/SUPABASE.md` bagian batasan.
7. **Jangan menggeser nomor baris di atas blok CSS terakhir**
   (`archive/original.html`). `extract-legacy.mjs` membagi CSS ke `src/styles/*`
   berdasarkan nomor baris; menyisipkan/menghapus baris bisa memindahkan blok
   antar file dan mengubah cascade. Tambahkan kode di baris yang sama atau di
   akhir file, lalu regenerasi: extractor akan memperingatkan kalau jumlah blok
   per file berubah.
8. **Gambar CMS di Supabase Storage (bucket `assets`), isi katalog dibagikan.**
   Thumbnail, banner, dan logo diperkecil di browser lalu diunggah; state hanya
   menyimpan URL publik. Produk/paket/banner/metode bayar juga dikirim ke tabel
   `catalog` (satu baris) dan dipasang ke semua akun siswa saat login/boot, jadi
   yang dibuat operator langsung terlihat di akun mereka. Hanya email di
   `catalog_editors` yang bisa menulis katalog. Tanpa sesi Supabase, CMS kembali
   ke data URL lokal (`localStorage` ±5 MB) dan panel memverifikasi tulisan
   setelah `save()` supaya kegagalan kuota tidak lagi senyap.
