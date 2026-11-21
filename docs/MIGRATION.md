# Migrasi layar legacy → React

Mesin legacy sekarang berjalan di dalam shell React. Layar-layarnya masih berupa
fungsi yang mengembalikan string HTML, lalu ditulis ke `#app` lewat `render()`.
Dokumen ini menjelaskan cara memindahkan satu layar ke komponen React tanpa
mengganggu layar lain.

## Prasyarat

- `npm run dev` jalan tanpa error konsol
- `npm run smoke` lulus

Jalankan smoke test sebelum dan sesudah setiap konversi layar.

## Peta layar

| `V` | Fungsi | Isi |
| --- | --- | --- |
| `auth` | `auth()` | masuk, daftar, verifikasi, lupa kunci |
| `home` | `home()` | beranda siswa/operator |
| `paket` | `paket()` | daftar paket yang sudah dibeli |
| `semua`, `kat` | `semua()`, `kat()` | katalog & kategori |
| `buy` | `buy()` | detail pembelian |
| `qris`, `va` | `qris()`, `va()` | pembayaran |
| `exam` | `exam()` | ujian + timer + navigasi soal |
| `result` | `result()` | hasil & akumulatif |
| `edit`, `profil` | `edit()`, `profil()` | akun |
| `proj`, `pay` | `proj()`, `payv()` | projek & riwayat bayar |
| `promo`, `notif`, `bank` | `promo()`, `notif()`, `bank()` | operator |
| `review` | `review()` | koreksi |

State global: `S` (persisten di `localStorage` kunci `kedinasan_v2`), `V` (layar
aktif), `CUR` (paket aktif), `E` (sesi ujian), plus helper `go()`, `goBack()`,
`render()`, `save()`, `$()`.

## Status konversi

| Layar | Berkas React | Status |
| --- | --- | --- |
| `notif` | `src/views/NotifView.jsx` | selesai — dipakai sebagai acuan pola |
| `promo`, `bank`, `profil`, `edit`, `paket`, `semua`, `kat`, `buy`, `qris`, `va`, `exam`, `result` | — | masih legacy |

Layar `notif` adalah contoh lengkap: wadah `#view-notif` dibuat `notif()`, lalu
`mountNotif74()` (di akhir `archive/original.html`, dipanggil dari pembungkus
`post58`) memasang komponennya **setiap kali** `render()` mengganti isi `#app`.
Tab aktif tetap di variabel legacy `PT`, isi dari `S.logs`, jadi tidak ada
state kedua. `mountReactView()` di `src/lib/reactHost.jsx` menyimpan satu root
aktif dan meng-unmount root lama saat container berganti, sehingga komponen
tidak menumpuk.

## Pola konversi: layar dititipkan ke React

Paling aman karena `go()`, `render()`, navigasi, dan tombol kembali tetap
dikerjakan mesin lama.

1. Buat komponen di `src/views/` (lihat `NotifView.jsx`):

```jsx
// src/views/NotifView.jsx
export default function NotifView({ state, onRead }) {
  return (
    <div className="notif-react">
      <h2>Notifikasi</h2>
      {state.map((n) => (
        <button key={n.id} type="button" className="opt" onClick={() => onRead(n.id)}>
          {n.text}
        </button>
      ))}
    </div>
  );
}
```

2. Ganti isi fungsi layar di `archive/original.html` menjadi wadah kosong, lalu
   regenerasi mesin legacy. **Jaga jumlah baris** — extractor membagi CSS
   berdasarkan nomor baris, jadi sisipan bertingkat di atas blok CSS terakhir
   bisa memindahkan blok antar file:

```js
function notif(){return back()+'<div id="view-notif"></div>'}
```

3. Setelah `#app` terisi, tempelkan komponen. Pasang hook-nya di pembungkus
   `post58` (dipanggil setiap `render()`), seperti `mountNotif74()` di akhir
   `archive/original.html`:

```js
function mountNotif74(){
  try{
    const el=document.getElementById('view-notif');
    if(!el||el.dataset.react==='1')return;
    if(!window.mountReactView||!window.Views||!window.Views.NotifView)return;
    el.dataset.react='1';
    window.mountReactView(el,window.Views.NotifView,{
      tab:PT,
      logs:S.logs||[],
      onTab:t=>{PT=t;setTimeout(render,0)},  // ditunda: hindari unmount saat event React
    });
  }catch(e){console.error('[WebKedinasan] mount notif gagal:',e)}
}
```

```jsx
// src/AppClient.jsx
import NotifView from './views/NotifView.jsx';
import { mountReactView } from './lib/reactHost.jsx';

window.Views = { NotifView };
window.mountReactView = mountReactView;
```

4. Pindahkan gaya khusus layar itu ke `src/views/NotifView.css` dan impor dari
   komponennya. **Jangan** menambah file baru ke rantai `src/styles/index.css`
   kecuali memang mengubah urutan cascade lama.

## Aturan saat menulis ulang

- Jangan mengubah kontrak data: `S`, `localStorage` `kedinasan_v2`, dan format
  objek paket/soal harus tetap sama. Data pengguna yang sudah ada wajib terbaca.
- Jangan memindahkan logika ke React untuk layar yang belum dikonversi — mesin
  legacy memanggil fungsi secara global.
- Setelah mengubah state dari komponen React, panggil `window.__legacy.save()`
  supaya perubahan ikut tersimpan **dan** tersinkron ke Supabase (mode dual
  memakai `save()` sebagai pemicu push).
- `refreshLegacy()` dari `src/lib/legacyBridge.js` (atau `window.HermesApp.refresh()`)
  memaksa layar legacy digambar ulang setelah state diubah komponen React.
- Tombol kembali memakai `goBack()`; layar React tidak boleh mendorong
  `history` sendiri sebelum seluruh navigasi pindah.
- Uji di dua ukuran: potret (≤480px) dan lanskap (`body.lapw`, `body.lapx`),
  karena CSS legacy punya jalur terpisah untuk keduanya.

## Layar baru di luar engine: pola `/admin`

Panel operator bukan konversi layar legacy, tapi contoh cara menambah UI baru
tanpa menyentuh mesin:

- Rutenya dipisah lewat halaman Next.js `app/admin/page.jsx` + `import()` dinamis
  (`next/dynamic`), jadi bundel siswa tidak ikut membesar (kode `CmsApp` hanya
  diunduh saat `/admin` dibuka).
- `bootLegacy()` tetap dijalankan, tetapi host `#app`/`#m` disembunyikan oleh
  `.cms-legacy-hosts`. Tujuannya bukan menampilkan layar lama, melainkan memakai
  `S`, `save()`, `parseSoal()`, dan `validate()` yang sama.
- Semua baca/tulis lewat `src/lib/cmsData.js` → `window.__legacy`. Tidak ada
  salinan state kedua; `save()` yang memicu render legacy **dan** push Supabase.
- Komponen tidak boleh memanggil `localStorage.setItem` langsung; itu memotong
  jalur sinkron (lihat `storageAdapter.js`).
- Jangan menambah tabel/kolom Supabase dari sisi klien: protokol dan HTTP API
  Hermes adalah kontrak eksternal. Kalau butuh data baru, tambahkan di snapshot
  (`data`) atau di skema `docs/SUPABASE.sql` setelah disepakati.

Gerbang panel saat ini lokal (hash SHA-256 di `localStorage`
`kedinasan_cms_gate`) sebagai penjaga iseng, bukan keamanan. Saat
`profiles`/klaim role tersedia, `window.HermesSync.role()` sudah mengembalikan
`operator` dan `CmsApp` melewati gerbang; RLS tetap harus menolak tulisan dari
akun non-operator.

## Urutan yang disarankan

1. Layar statis tanpa state rumit: `promo`, `notif`, `bank`.
2. `profil`, `edit` (form terkontrol React paling terasa manfaatnya).
3. `paket`, `semua`, `kat` (daftar + pencarian).
4. `buy`, `qris`, `va` (alur uang: konversi terakhir, setelah pola stabil).
5. `exam`, `result` (timer, autosave `S.exam`, `S.res`) — terakhir, paling rawan.

## Definisi selesai

- `npm run build` bersih
- `npm run check:legacy` OK
- `npm run smoke` lulus dan layar terkait tampil identik (potret + lanskap)
- Data `localStorage` lama tetap terbaca
