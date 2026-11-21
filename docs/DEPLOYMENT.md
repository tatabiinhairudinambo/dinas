# Deployment — Vercel

Checklist deploy **Web Kedinasan** (Next.js App Router, tanpa backend).
Lihat `README.md` untuk gambaran umum arsitektur.

## 1. Env

**Tidak ada env yang dibutuhkan saat ini.** Aplikasi berjalan penuh di
browser (localStorage `kedinasan_v2`). Kalau nanti fase Supabase diwire,
env akan didokumentasikan di sini dan di `docs/SUPABASE.md`.

## 2. Deploy

### Via Dashboard

1. Push repo ke GitHub (`main`).
2. Vercel Dashboard → **Add New… → Project** → import repo.
3. Framework preset **Next.js** terdeteksi otomatis; build command
   `npm run build`, install command `npm install` (bawaan — biarkan).
4. Node 20+. Deploy.

### Via CLI

```bash
npx vercel login        # sekali saja
npm run deploy          # build + check:dist + npx vercel --prod
npm run deploy:preview  # URL preview sekali pakai
```

`npm run deploy` otomatis menjalankan preflight (`tools/check-build.mjs`)
dan berhenti kalau build bermasalah.

## 3. CSP (Report-Only)

`vercel.json` memakai `Content-Security-Policy-Report-Only` — pelanggaran
dicatat di console, tidak mengganggu pengguna. Kebijakan saat ini:

- `img-src 'self' data:` — gambar profil/thumbnail/soal berupa data URL.
- `connect-src 'self'` — belum ada API eksternal.
- `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'none'`,
  `form-action 'none'`.

Saat Supabase diwire nanti, tambahkan `https://*.supabase.co` ke
`img-src` dan `connect-src`.

## 4. Checklist rilis

1. `npm run build && npm run check:dist` — lolos.
2. `npm run e2e` dengan dev server hidup — semua langkah lulus
   (daftar → verifikasi → masuk → beli → bayar → ujian → hasil).
3. Setelah live, cek manual:
   - `/` tampil dan scroll mulus.
   - `/masuk` → daftar akun baru → verifikasi → masuk.
   - `/admin` → login demo `1@gmail.com` / `123456` → tab Paket & Soal.
   - `/pay/qris.svg` balas 200.
   - Refresh langsung di `/paket` atau `/profil` tidak 404.
4. Data pengguna ada di localStorage peramban — **tidak ada backup server**.
   Beri tahu pengguna untuk tidak menghapus data situs.

## 5. Catatan teknis

- Routing ditangani App Router; tidak perlu SPA fallback.
- Semua halaman client-side (`'use client'`); layout tetap server component
  untuk metadata.
- `next.config.mjs`: `poweredByHeader: false`, eslint di-skip saat build
  (lint dijalankan terpisah), redirect `/cms` → `/admin`.
- Jangan jalankan `npm run build` selagi dev server hidup (konflik `.next/`).
