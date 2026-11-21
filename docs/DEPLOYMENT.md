# Deployment & Env — Vercel + Supabase

Checklist spesifik untuk deploy **Web Kedinasan** (Next.js shell + engine legacy
classic + Supabase mode-dual). Lihat `README.md` untuk gambaran umum.

## 1. Env di Vercel (Harus diisi)

Dashboard → **Project → Settings → Environment Variables**:

| Variabel | Untuk | Catatan |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production + Preview | URL proyek Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production + Preview | **Publishable/anon key** — jangan service_role, nilai ini ikut ke browser |

Tanpa keduanya aplikasi jalan mode lokal (konsol: peringatan eksplisit
`[WebKedinasan] Env Supabase belum diisi …` — tidak diam-diam fallback).

- Redeploy selesai sebelumnya mengubah env (Vercel hanya baca env saat build).

## 1B. CSP — Mode Report-Only (belum enforce)

`vercel.json` saat ini memakai **`Content-Security-Policy-Report-Only`** —
pelanggaran dicatat di console (report), tidak mengganggu penggunaan.

Kebijakan saat ini (lihat `vercel.json`):

- `img-src 'self' data: https://*.supabase.co` — data URL lokal
  (thumbnail, logo, profil) + gambar dari storage Supabase (URL publik
  sama domain `*.supabase.co`).
- `connect-src https://*.supabase.co` — REST Supabase (signup, OTP,
  snapshot per user, catalog).
- `script-src 'self' 'unsafe-inline'` — engine legacy memakai ~100
  atribut `onclick` inline; pertimbangkan event delegation lebih dulu.

**Langkah validasi lalu switch ke enforce:**

1. Deploy ke **Vercel → Preview** (tetap Report-Only). Catat URL preview.
2. Buka preview: daftar baru (kode OTP), login, ujian, buka `/admin`,
   unggah gambar produk/thumbnail/banner.
3. Buka DevTools → console: cari peringatan CSP
   ("Report-Only CSP Violation" / lihat tab Network → CSP Reports).
   Catat semua sumber yang tersebutak (mis. domain tambahan, tipe
   sumber baru di `img-src`/`connect-src`).
4. Perbaiki dokumen: tambahkan URL valid ke `vercel.json`
   (`img-src`, `connect-src`, dll), satu-satu setelah terlihat di console.
5. Ganti header di `vercel.json` jadi `Content-Security-Policy`
   (enforce).
6. Redeploy; ulangi 2–3 sebentar; pastikan **zero violation baru**
   muncul sebelum dianggap selesai.

Catat sementara: server lokal (`next dev`/`next start`) tidak membaca
`vercel.json` (header CSP hanya aktif di Vercel) — validasi dilakukan lewat Preview.

## 2. Supabase Site URL & Redirect URLs

Di dashboard Supabase → Authentication → Sign In Settings:

- **Site URL**: domain utama aplikasi — gunakan pola Vercel:
  `https://[branch--project].vercel.app` untuk preview/staging,
  `https://[project].vercel.app` (atau domain kustom) untuk prod.
  Jika pakai domain kustom, pasang di **Project → Settings → Domains** di Vercel
  dan di **Custom Domains** di Supabase.
- **Redirect URLs**: tambah semua pola yang akan dikunjungi:
  - `https://[project].vercel.app`
  - `https://[branch--project].vercel.app` (contoh: `main--kedinasan.vercel.app`)
  - domain kustom kalau ada.

## 2.2. Katalog_editors → user_id + migrasi aset editor-only

Sudah dilakukan (lihat `docs/supabase/migrations/001-catalog_editors-user_id.sql`):

- `catalog_editors` sekarang berbasis `user_id` (uuid, FK `auth.users` on delete
  cascade) — kolom `email` dihapus, seed placeholder `operator@contoh.id`
  di-delete (jika akun tidak ditemukan). **Jangan meng-insert editor di
  migrasi.**
- `is_catalog_editor()` memakai `auth.uid()`; policy editor sendiri
  (`user_id = auth.uid()`).
- `assets` bucket: policy unggah sekarang `is_catalog_editor()` — tidak ada
  upload dari siswa ke bucket ini (foto profil dari siswa = data URL lokal).

**Daftar editor baru (manual — jalankan lewat SQL Editor lewat layanan
Supabase, ambil UUID akun di Auth > Users):**

```sql
insert into public.catalog_editors (user_id, note)
values ('<uuid akun editor>', 'operator CMS');
-- atau update baris lama:
update public.catalog_editors
set note = 'operator CMS (by user_id)'
where user_id = '<uuid akun editor>';
```

**Client (sync.js / CmsApp):** `checkCatalogEditor()` memakai
`user_id = user.id`; `CmsApp` unlocked juga via
`HermesSync.catalog.isEditor()` (server).

## 2.3. Policy storage bucket "assets"

- Hanya **editor** (`is_catalog_editor()`) yang boleh insert/update/delete
  (lihat migrasi 2.2). Baca tetap publik (`bucket_id = 'assets'`).
- **Cek sudah dilakukan**: tidak ada upload dari siswa ke bucket ini (grep:
  foto profil = data URL lokal; `uploadDataUrl` hanya dipakai oleh panel
  CMS: Products/Banner/Appearance/Payment). Tidak ditambahkan folder per
  `auth.uid()` karena belum ada path siswa ke bucket.

## 2.4. Password plaintext — dihapus

- `sync.js`: `attachLocalIdentity()` / `updateLocalPassword()` **tidak lagi
  menyimpan** `user.p` (plaintext) saat Supabase aktif — login offline =
  sesi Supabase yang di-cache.
- `public/legacy/app.js`: `login()` memakai `pwCheck()` — PBKDF2
  (`crypto.subtle`, SHA-256, 100rb iterasi, salt per user, format
  `'pbk:' + saltHex + hashHex`).
- **Migrasi akun lama**: saat login lokal, `pwCheck` konversi plaintext
  lama → hash PBKDF2 dan ganti `user.p`.
- `public/legacy/bridge-override.js`: fallback login lokal **dihapus** saat
  Supabase aktif (gagal login hanya nampilkan pesan `Email atau kunci
  salah`); **gate OP** — `opLoginForm` hanya nyala untuk user editor
  Supabase.
- Terverifikasi: tidak ada tempat lain yang membaca `u.p` sebagai password
  (grep: app.js login/reset/reg + sync.js sudah diubah).

## 2.5. Catatan implementasi Fase 2

- `src/cms/CmsApp.jsx`: Gate prod — buka hanya editor; tidak ada
  `sessionStorage` bypass (di-remove); CmsApp `opened` initial juga via
  `HermesSync.catalog.isEditor()`.
- `src/cms/panels/Account.jsx`: demo badge/reset button/field hidden di PROD.
- `public/legacy/app.js`: `login/reset/reg` → PBKDF2; `legacyLogin` async via `pwCheck`.
- `public/legacy/bridge-override.js`: login fallback dihapus (Supabase mode);
  OP gate via `opLoginForm` wrapper.
- `tools/cms-test.mjs`: skip PROD-blocked gate; check kunci lokal bukan plaintext.
- SQL baru: `docs/supabase/migrations/001-catalog_editors-user_id.sql`,
  `docs/supabase/migrations/002-assets-editor-only.sql` (idempotent).

## 3. SMTP sendiri (Direkomendasikan)

Vercel+Supabase native SMTP cukup untuk testing, tapi production dengan volume
OTP tinggi akan naik rate limit / mandek. Konfigurasi SMTP sendiri (contoh
SendGrid, Brevo, atau SMTP server sendiri):

Dashboard Supabase → **Project → Settings → Authentication → Emails → Configure SMTP**:

- Host / Port / User / Password — kredensial SMTP provider Anda
- From Email — alamat dari yang verifikasi (domain yang sudah di-SPF/DKIM/DMARC)
- Templates: **Confirm signup** harus memuat `{{ .Token }}`; gunakan template
  OTP 6 digit lama sebagai baseline, upgrade ke OTP tipe "email/magic link"
  menggunakan `verifyOtp({ token, type: 'email' })` jika spesifikasi tim akan
  menerapkan Fase 2 (server-authoritative).

Batasi sender domain ke SATU rekening sender (jangan alamat volume / Mailgun
default batched sender) sebelum melanjutkan testing anti-spam.

## 4. Rate limit OTP (Disarankan, harus dari tim)

Batas praktis yang bisa langsung dipasang di dashboard sekarang:

- Input kode: maks **1 input per 10 detik** (app.js: `#otp-code` terkunci
  `disabled`), `maxlength=6` saat ini; rencana Fase 2: 7 digit (per KH: "rata-rata 6 kode").
- Kirim ulang: minimal **15 menit** seperti `OTP.resendAt` di bridge-override.
- Per email per 10 menit: maks **3 permintaan** (signup-email + resend + magic-link).
- Garis bawah per IP: tambahkan rate limit API/proxy (cepat: Cloudflare, atau
  serverless proxy — lihat Fase 2c: masuk/daftar via `api/` di tahap 2).
- Anti-spam: aktifkan **SMTP OpenAI? no — SMTP provider punyamu**, dan di
  Supabase aktifkan captcha di dashboard.

Keluhan OTP dari pelapis real (isi di Fase 2c): respon OTP untuk
daftar/masuk perlu **echo email asal kalau valid** ("kode kirim ke alamat
terdaftar") supaya tidak fitnah; cadangan email **harus** berisi
`{{ .Token }}`.

## 5. Checklist sebelum rilis (cakupan Fase 1)

1. `npm run check:legacy` — app.js parses sebagai classic script.
2. `npm run build && npm run check:dist` — bundle bersih (tanpa service_role,
   file wajib lengkap).
3. `npm run start` lokal (atau `npm run dev`) + `npm run smoke` — alur
   daftar → login → ujian lulus (mode lokal murni).
4. `npm run check:supabase` — verifikasi tabel/RPC Supabase sudah dibuat
   (lihat daftar SQL di bawah); tanpa ini aplikasi tetap jalan mode lokal
   dengan banner peringatan.
5. Di Vercel: env diatur (Productions + Preview), lalu trigger deploy
   (`npm run deploy` / `deploy:preview`).
6. Di vercel.json: security header seluruh situs aktif (X-Frame-Options DENY,
   Permissions-Policy, CSP). CSP dirancang untuk app asli —
   rencana evaluasi dengan QA: `script-src 'unsafe-inline'` sengaja ditetapkan
   karena engine legacy memakai ~100 atribut `onclick` inline; jika rendah
   setelah evaluasi, refactor dulu ke event delegation.
7. Konfirmasi visual + percobaan daftar baru: email diterima, kode 6 digit,
   login masuk. Catat rate limit nyata sebelum transaksi massal.

### Daftar SQL yang harus dijalankan (urut)

1. `docs/supabase/migrations/001-catalog_editors-user_id.sql` — migrasi
   `catalog_editors` ke `user_id` (idempotent).
2. `docs/supabase/migrations/002-assets-editor-only.sql` — policy assets
   editor-only (idempotent).
3. (Fase 3A) `docs/supabase/migrations/003-server-authoritative-tables.sql` —
   tabel packages/questions/question_keys/entitlements/attempts/payments + RLS
   (idempotent). Tabel baru; belum dipakai klien sampai Fase 3B.
4. (Fase 3A) `docs/supabase/migrations/004-server-authoritative-rpc.sql` —
   RPC start_attempt/submit_attempt/create_payment/mark_payment_paid/
   confirm_payment/reject_payment/grant_free_claim/upsert_*/set_catalog/
   get_catalog (idempotent).
5. (Fase 3A) `docs/supabase/migrations/005-catalog-migrate.sql` — backfill
   catalog.data.packages → packages/questions/question_keys (idempotent,
   jalankan SETELAH 003+004).
6. (Fase 3A) Uji keamanan: `docs/supabase/tests/server-auth-checks.sql`
   (bukti RLS + penilaian server).
7. (Manual, lepas) insert editor baru: `docs/DEPLOYMENT.md` §2.2.

### Daftar editor baru — perintah SQL (jalankan lepas SQL Editor)

```sql
insert into public.catalog_editors (user_id, note)
values ('<uuid akun editor>', 'operator CMS');
```

### Checklist Fase 2 (dijalankan setelah deployment)

1. `npm run check:legacy`, `npm run build`, `npm run check:dist`,
   `npm run smoke` (mode lokal) — harus lulus.
2. `node tools/cms-test.mjs http://localhost:3000/admin` di **Next dev**
   (`npm run dev`) — harus lulus (di build produksi, /admin tergerbang — lihat 2.1).
3. Di Supabase: jalankan migration 001 → 002 → insert editor (§2.2).
4. Di Vercel: deploy, buka `/admin` sebagai user non-editor → harus tampil
   layar "Akses Operator Ditutup"; sebagai editor → panel terbuka.
5. Catat bug & temuan (lihat LAPORAN Fase 2 di akhir).

## 6. Keterbatasan catatan dari Fase 1

- CSP kebijakan batasan: tidak tes penuh (harus di staging bila ditemukan
  regresi tampilan/functions).
- `X-Frame-Options DENY` tidak dipasang di vercel.json sebelumnya — baru
  ditambahkan Fase 1. Bagi operator yang diseksi perlu frame di mobile CMS,
  prep scrolling **tanpa break** itu — cukup evaluasi lagi.
