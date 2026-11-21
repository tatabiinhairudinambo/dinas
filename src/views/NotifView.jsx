/**
 * Layar Notifikasi — layar legacy `notif()` yang dipindah ke React.
 *
 * Contoh pertama pola di docs/MIGRATION.md: mesin legacy tetap pemilik data.
 * Tab aktif disimpan di variabel global `PT` (bukan state React) dan daftar
 * log dibaca dari `S.logs`, jadi tidak ada salinan state kedua. Komponen ini
 * hanya menggambar; klik tab memanggil onTab(), yang mengubah PT lalu meminta
 * `render()` legacy menggambar ulang layar.
 *
 * Kelas `.tabs` dan `.mu` dipakai apa adanya supaya tampilan identik di potret
 * maupun lanskap; karena itu layar ini tidak menambah CSS baru.
 */
const ROW = { fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--bd)' };

export default function NotifView({ tab, logs, onTab }) {
  const rows = (logs || []).filter((l) => l.t === tab);

  return (
    <>
      <div className="tabs">
        <button type="button" className={tab === 'beli' ? 'on' : ''} onClick={() => onTab('beli')}>
          Pembelian
        </button>
        <button type="button" className={tab === 'kerja' ? 'on' : ''} onClick={() => onTab('kerja')}>
          Pengerjaan
        </button>
      </div>

      {rows.length ? (
        rows.map((l, i) => (
          // Log legacy tidak punya id; urutannya stabil dalam satu render.
          <div key={i} style={ROW}>
            {l.d} — {l.x}
          </div>
        ))
      ) : (
        <p className="mu">Belum ada log. (Jurnal permanen, tidak dapat dihapus.)</p>
      )}
    </>
  );
}
