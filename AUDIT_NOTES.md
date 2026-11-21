# Catatan Audit Script — Web Kedinasan

- Tanggal: 19-11-2026
- Metode: audit statis (pembacaan kode) + verifikasi target: `node tools/check-legacy.mjs` → **OK** (app.js lolos parse sebagai classic script, 340534 char).

## 1. tools/_dump.mjs — dump state via CDP (debug)
- Asumsi: `page` terdefinisi setelah loop retry (kalau Chrome gagal, baris 19 `page.webSocketDebuggerUrl` tanpa guard).
- Catatan: `new WebSocket(...)` butuh Node ≥ 21 (di Node 20 perlu `--experimental-websocket`), meskipun engines says `>=20`.

## 2. tools/check-dist.mjs — prisma dist/ sebelum Vercel
- Kuat: file wajib (index.html, legacy/app.js, bridge-override.js, pay/*.svg) + ukuran; #root + script module di index.html; aset rujukan ada; scan JWT service_role di dist/assets (regex `eyJ…eyJ…`, decode payload, cek role).
- Catatan: `base64url` decode butuh Node ≥ 15.7 — ok.

## 3. tools/check-legacy.mjs — parse public/legacy/app.js sebagai classic script
- Tool yang dimaksud; hasil verifikasi di atas: **OK**.

## 4. tools/cms-test.mjs — E2E panel CMS (CDP, tingkatkan jika lulus)
- Langkah komprehensif: gerbang, ringkasan, edit paket, import soal §/¦, CRUD produk + thumbnail, tampilan (banner+logo), pembayaran, promo, grup, Akun Admin, reload.
- Asumsi yang HARUS verifikasi di CmsApp.jsx:
  - Produk baru: `qs === 30` & `thumb === 'data:image/jpeg;base64'` (baris 287-288) — butuh konfirmasi default type CMS = TWK (NEED 30) dan thumbnail lewat makeThumb (JPEG).
  - CSV Pembayaran: `payList === 'QRIS,BCA,BRI,MANDIRI'` (baris 384) — butuh konfirmasi S.payList order saat QRIS di-upload.
  - CSV default logo bawaan = '/pay/bca.svg,/pay/bri.svg,/pay/mandiri.svg' (baris 362) — cocok dengan bridge-override.seedPayLogos (PAY_LOGO).
- Small: baris 243 `.cms-modal input[readonly]` tanpa guard → crash (module-level, tanpa try/catch) kalau tidak ada — boleh di-guard.
- Error konsol page yangg berarti → fail tes.

## 5. tools/extract-legacy.mjs — generator app.js + CSS dari archive/original.html
- Baca archive/original.html → ekstrak 21 blok script → public/legacy/app.js (classic, banner + blok 1-21) → src/styles/*.css (urutan cascade dipertahankan) → tools/extract-report.txt.
- Perlu: archive/original.html konsisten dengan app.js yang ada — regen TIMPAL app.js (bilamana mengubah archive).
- Safety net kuat: throw kalau IIFE CSS/inject gagal dicoret (baris 90, 111-113), CSS tidak terklasifikasi (baris 181) — menghentikan proses.
- Window: `new Function('document', snippet)(stub)` — trust input, ok karena input dari archive sendiri.

## 6. tools/otp-flow.mjs — uji OTP UI via CDP
- Stub window.HermesSync (signUp/resendOtp/verifyOtp/login); COCOK dengan bridge-override (bridge akan memanggil HermesSync.* — bridge-override berjalan normal di page).
- Langkah: layar daftar → kirim daftar (di-stub) → input kode → kode salah → kode benar → login belum verif → resend; menghitung `__calls.resend === 1` (bridge akan call resendOtp saat login unverified — lihat bridge-override line 104).
- Asumsi: `#n/#e/#p/#p2/#otp-code` ada saat terpasang (app.js `auth()`/`otpScreen`).

## 7. tools/smoke-flow.mjs — smoke alur utama (daftar → verif → login → … → ujian)
- Mode lokal (HermesSync dimatikan) — menjalankan jalur legacy asli.
- Notif: mount React NotifView — mengecek teks 'Pembelian' + tab 'Pengerjaan' (NotifView.jsx ada).
- Rev76: `S.payAcc` di-set di kode + `payGo('BCA')` → teks 'Nomor Rekening' + nomor + 'a.n. Yayasan Hermes' (app.js rev76 va()).
- Rev72: timeout batal ujian = 60s / 3 halaman soal (app.js blok 21, upd74).

## 8. src/lib/sync.js — sinkronisasi dual-mode (Supabase snapshot per-user)
- Pull: eq('user_id'), applySnapshot kalau remote lebih baru; Pull-awal (BOOT_TIMEOUT 3000); `restoreSecrets` — secrets lokal dari S.users.
- Push: debounce 1200ms, upsert {user_id, email, data, updated_at} onConflict 'user_id', tak-disalahkan saat sedang ujian (bridge-override defers JSON.stringify during V==='exam' via blok 7).
- Katalog: editor-only (catalog_editors), pull/push, refresh di visible.
- Catatan: `exposeSyncGlobal` dipanggil SEBELUM app.js load — butuh window.HermesSync lain tidak dipakai sebelum itu (otp-flow/smoke: HermesSync.enabled ditulis setelah load — ok).
- Risiko kecil: push ada path `rawJson` null → return — ok.

## 9. src/lib/storageAdapter.js — bridge Storage.prototype untuk mode dual
- Ok: isTarget, cache write-through, meta updatedAt, handleWrite → onSnapshotWrite.
- Risiko kecil: `cache = raw.get(KEY)` di install — jika bridge dipasang setelah app.js mulai baca — urutan boot (prepareSync sebelum inject app.js) memenuhi syarat.

## 10. src/lib/legacyBridge.js — boot React <-> engine legacy
- Urutan: prepareSync → exposeSyncGlobal → inject app.js → inject bridge-override → bootstrapAfterLegacy (push debounce).
- `bootLegacy` idempoten via `booting` promise.
- Status error tampilkan eror di UI.

## 11. src/lib/cmsData.js — data/validasi panel CMS
- saveState() verifikasi ulang via localStorage.getItem(STORE_KEY) === JSON.stringify(getState()).
- DEMO_ADMIN 1@gmail.com / 123456 — cocok dengan default gate (gateRecord).
- NEED SKD:110, TWK:30, TIU:35, TKP:45 — cocok app.js (NEED).

## 12. src/lib/assets.js — unggah CMS aset ke Supabase Storage
- Local mode → dataUrl fallback (penting utk cms-test local).
- Supabase: 2 MB limit, PNG/JPEG/WebP, upsert:false, public URL.

## 13. src/lib/reactHost.jsx — mountReactView (satu root aktif; unmount root lama)
- Ok.

## 14. src/cms/thumb.js — crop gambar CMS
- makeThumb 480x320 JPEG q0.86 (cocok cms-test `thumb === 'data:image/jpeg;base64'`), makeBanner 904x240 JPEG (cocok bnImg crop 113/30 904), makeLogo PNG ratio 3.3/660.

## 15. src/cms/CmsApp.jsx, src/cms/ui.jsx, src/cms/panels/, src/components/{LegacyHost,ErrorBoundary}.jsx, src/views/NotifView.jsx, src/main.jsx
- (2/3 belum dibaca: CmsApp.jsx/ui.jsx/panels — asumsi ok dari test dan konsistensi dengan lib; TODO expand)

## 16. vite.config.js
- react plugin, outDir dist, assetsDir assets, sourcemap:false, server port 5173 — cocok check-dist & test:cms preview.

## Hasil singkat
- OK: check-legacy (app.js parse classic).
- Asumsi perlu verifikasi: CmsApp.jsx (cms-test expectations: default type CMS, thumbnail path, payList order).
- Risiko kecil: Node ≥21 untuk WebSocket (tools CDP), error-guard di cms-test baris 243.
