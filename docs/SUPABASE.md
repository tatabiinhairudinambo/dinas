# Supabase — status & rencana

**Status: BELUM TERHUBUNG.** Aplikasi saat ini 100% localStorage
(`kedinasan_v2`). Sinkronisasi server sengaja ditunda agar rewrite Next.js
selesai dulu dan stabil; kode sync lama (`sync.js`, `supabase.js`,
`storageAdapter.js`) sudah dihapus bersama rewrite.

Yang tersisa dari fase sebelumnya:

- `docs/SUPABASE.sql` — skema tabel + RLS yang sudah disiapkan
  (`app_snapshots`, dst.). Jalankan di SQL Editor kalau fase ini dimulai.
- Pengalaman dari mode dual lama: verifikasi email memakai tautan konfirmasi
  (bukan OTP), kunci akun selalu PBKDF2 di client, dan snapshot per user
  adalah pola yang sudah terbukti.

Rencana penyambungan (fase berikutnya):

1. Jalankan `docs/SUPABASE.sql`, buat project Supabase, ambil URL + anon key.
2. Tambah `src/lib/supabase.js` (client lazy) + `src/lib/sync.js`
   (tarik/push snapshot per user) — pola lama bisa diambil dari riwayat git
   (`8b32ee0` sebelum rewrite).
3. Wire ke `src/lib/auth.js`: `register`/`verifyEmail`/`login`/`resetPassword`
   memanggil Supabase Auth, fallback lokal tetap untuk dev.
4. Perbarui CSP di `vercel.json` (`img-src`, `connect-src` += `*.supabase.co`)
   dan dokumentasikan env di `README.md` + `docs/DEPLOYMENT.md`.
5. Pertimbangkan penilaian ujian server-side (RPC) agar anti-curang.
