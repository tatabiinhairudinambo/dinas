import { Empty, Panel, Stat } from '../ui.jsx';
import { questionErrors, rupiah, salesOf, useCmsState } from '../../lib/cmsData.js';

export default function Overview({ onOpenBank }) {
  const { S } = useCmsState();
  if (!S) return <div className="cms-loading">Menunggu data…</div>;

  const packages = S.packages || [];
  const sales = S.sales || [];
  const logs = S.logs || [];
  const totalQuestions = packages.reduce((sum, p) => sum + (p.qs?.length || 0), 0);
  const incomplete = packages
    .map((p) => ({ p, errors: questionErrors(p) }))
    .filter((x) => x.errors.length > 0);
  const today = new Date().toISOString().slice(0, 10);
  const expired = packages.filter((p) => p.exp && p.exp < today && p.pub);
  const revenue = sales.reduce((sum, sale) => {
    const p = packages.find((x) => String(x.id) === String(sale.pid));
    return sum + Number(p?.price || 0);
  }, 0);

  const ranked = packages
    .map((p) => ({ p, count: salesOf(S, p.id).length }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="cms-stack">
      <div className="cms-stats">
        <Stat
          label="Paket"
          value={packages.length}
          note={`${packages.filter((p) => p.pub).length} tayang · ${packages.filter((p) => !p.pub).length} draf · ${packages.filter((p) => p.sim).length} simulasi`}
        />
        <Stat label="Soal tersimpan" value={totalQuestions} note={`${incomplete.length} paket belum lengkap`} tone={incomplete.length ? 'warn' : 'ok'} />
        <Stat label="Penjualan" value={sales.length} note={rupiah(revenue)} />
        <Stat label="Pengguna" value={(S.users || []).length} note={`${(S.owned ? Object.keys(S.owned).length : 0)} kepemilikan paket`} />
      </div>

      <Panel title="Perlu perhatian" hint="Paket yang belum bisa dipublikasikan atau sudah lewat masa berlaku.">
        {incomplete.length === 0 && expired.length === 0 ? (
          <Empty title="Semua rapi" hint="Tidak ada paket dengan soal belum lengkap atau kadaluarsa." />
        ) : (
          <ul className="cms-list">
            {incomplete.slice(0, 6).map(({ p, errors }) => (
              <li key={`i-${p.id}`}>
                <div>
                  <strong>{p.name}</strong>
                  <small>
                    {errors.length} masalah: {errors[0]}
                  </small>
                </div>
                <button type="button" className="cms-btn is-ghost" onClick={() => onOpenBank(p.id)}>
                  Buka soal
                </button>
              </li>
            ))}
            {expired.map((p) => (
              <li key={`e-${p.id}`}>
                <div>
                  <strong>{p.name}</strong>
                  <small>Kadaluarsa {p.exp} — otomatis masuk draf saat aplikasi dibuka.</small>
                </div>
                <span className="cms-badge is-warn">Kadaluarsa</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="cms-split">
        <Panel title="Paket paling laku" hint="Dihitung dari riwayat pembayaran (S.sales).">
          {ranked.length === 0 ? (
            <Empty title="Belum ada penjualan" />
          ) : (
            <ol className="cms-rank">
              {ranked.map(({ p, count }) => (
                <li key={p.id}>
                  <span>{p.name}</span>
                  <b>{count}×</b>
                </li>
              ))}
            </ol>
          )}
        </Panel>

        <Panel title="Log terakhir" hint="Jurnal dari mesin legacy — pembelian & pengerjaan.">
          {logs.length === 0 ? (
            <Empty title="Belum ada log" />
          ) : (
            <ul className="cms-log">
              {logs.slice(0, 8).map((l, i) => (
                <li key={`${l.d}-${i}`}>
                  <span className={`cms-log-tag is-${l.t}`}>{l.t}</span>
                  <div>
                    <p>{l.x}</p>
                    <small>{l.d}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
