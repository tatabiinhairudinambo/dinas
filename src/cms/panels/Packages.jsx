import { useMemo, useState } from 'react';
import { Badge, Drawer, Empty, Field, Panel, Progress } from '../ui.jsx';
import {
  NEED,
  packageById,
  questionErrors,
  questionType,
  rupiah,
  salesOf,
  useCmsState,
} from '../../lib/cmsData.js';
import { makeThumb } from '../thumb.js';

const EMPTY_QUESTION = () => ({ t: '', o: ['', '', '', '', ''], a: null, w: [null, null, null, null, null], pem: '', oi: [] });

export default function Packages({ onOpenBank }) {
  const { S, mutate } = useCmsState();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [publishErrors, setPublishErrors] = useState([]);

  const packages = S?.packages || [];
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return packages.filter((p) => {
      if (q && !`${p.name} ${p.type}`.toLowerCase().includes(q)) return false;
      if (status === 'pub' && (!p.pub || p.hidden)) return false;
      if (status === 'draft' && p.pub) return false;
      if (status === 'hidden' && !p.hidden) return false;
      return true;
    });
  }, [packages, query, status]);

  const selected = packageById(S, openId);

  const createPackage = (type) => {
    mutate((state) => {
      const seq = Number(state.seq) || Math.max(0, ...state.packages.map((x) => Number(x.id) || 0)) + 1;
      const pkg = {
        id: seq,
        name: `Paket ${type} Baru`,
        type,
        price: 0,
        promo: 0,
        desc: '',
        pub: 0,
        hidden: 0,
        promoOn: 0,
        promoPrice: 0,
        exp: '',
        qs: Array.from({ length: NEED[type] }, EMPTY_QUESTION),
      };
      state.seq = seq + 1;
      state.packages = [pkg, ...state.packages];
      setOpenId(pkg.id);
    });
    setCreating(false);
    setPublishErrors([]);
  };

  const publish = (id) => {
    const pkg = packageById(S, id);
    const errors = questionErrors(pkg);
    if (errors.length) {
      setPublishErrors(errors);
      return;
    }
    setPublishErrors([]);
    mutate((state) => {
      const target = packageById(state, id);
      target.pub = 1;
      state.packages = [target, ...state.packages.filter((x) => String(x.id) !== String(id))];
    });
  };

  const removePackage = (pkg) => {
    const sold = salesOf(S, pkg.id).length;
    const warning = [
      `Hapus paket "${pkg.name}"?`,
      '',
      'Soal, riwayat nilai, dan kepemilikan paket ini ikut terhapus.',
      sold ? `Paket ini punya ${sold} penjualan tercatat.` : '',
    ]
      .filter(Boolean)
      .join('\n');
    if (!window.confirm(warning)) return;

    mutate((state) => {
      state.packages = state.packages.filter((x) => String(x.id) !== String(pkg.id));
      if (state.owned) delete state.owned[pkg.id];
      if (state.res) delete state.res[pkg.id];
      if (state.hist) delete state.hist[pkg.id];
      if (state.sales) state.sales = state.sales.filter((s) => String(s.pid) !== String(pkg.id));
    });
    setOpenId(null);
    setPublishErrors([]);
  };

  if (!S) return <div className="cms-loading">Menunggu data…</div>;

  return (
    <>
      <Panel
        title={`${packages.length} paket`}
        hint="Publish memeriksa kelengkapan soal lebih dulu; menyimpan draf tidak."
        actions={
          <>
            <input
              className="cms-input cms-search"
              placeholder="Cari paket…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="cms-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Semua status</option>
              <option value="pub">Tayang</option>
              <option value="draft">Draf</option>
              <option value="hidden">Disembunyikan</option>
            </select>
            <button type="button" className="cms-btn is-primary" onClick={() => setCreating(true)}>
              + Paket baru
            </button>
          </>
        }
        flush
      >
        {rows.length === 0 ? (
          <Empty title="Tidak ada paket" hint="Ubah filter atau buat paket baru." />
        ) : (
          <div className="cms-table-wrap">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Paket</th>
                  <th>Tipe</th>
                  <th>Harga</th>
                  <th>Soal</th>
                  <th>Status</th>
                  <th>Terjual</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const errors = questionErrors(p).length;
                  const total = NEED[p.type] || p.qs?.length || 0;
                  const filledCount = (p.qs || []).length - countIncomplete(p);
                  return (
                    <tr key={p.id} className={String(p.id) === String(openId) ? 'is-selected' : ''}>
                      <td>
                        <button type="button" className="cms-cell-link" onClick={() => setOpenId(p.id)}>
                          {p.name}
                        </button>
                        <small className="cms-dim">#{p.id}{p.desc ? ` · ${p.desc}` : ''}</small>
                      </td>
                      <td>
                        <Badge tone="neutral">{p.type}</Badge>
                        {p.sim ? <Badge tone="warn">SIM</Badge> : null}
                      </td>
                      <td>
                        {p.promoPrice > 0 && p.promoPrice < p.price ? (
                          <span>
                            <s className="cms-dim">{rupiah(p.price)}</s> {rupiah(p.promoPrice)}
                          </span>
                        ) : (
                          rupiah(p.price)
                        )}
                      </td>
                      <td>
                        <div className="cms-cell-progress">
                          <Progress value={filledCount} max={total} tone={errors ? 'warn' : 'ok'} />
                          <small className="cms-dim">
                            {filledCount}/{total}
                            {errors ? ` · ${errors} masalah` : ''}
                          </small>
                        </div>
                      </td>
                      <td>
                        {!p.pub ? <Badge tone="warn">Draf</Badge> : p.hidden ? <Badge tone="neutral">Disembunyikan</Badge> : <Badge tone="ok">Tayang</Badge>}
                      </td>
                      <td>{salesOf(S, p.id).length}</td>
                      <td className="cms-cell-actions">
                        <button type="button" className="cms-btn is-ghost" onClick={() => setOpenId(p.id)}>
                          Edit
                        </button>
                        <button type="button" className="cms-btn is-ghost" onClick={() => onOpenBank(p.id)}>
                          Soal
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {creating ? (
        <Drawer open title="Paket baru" subtitle="Kategori menentukan jumlah soal otomatis." onClose={() => setCreating(false)}>
          <div className="cms-choice">
            {[
              ['SKD', 'SKD · 110 soal (30 TWK, 35 TIU, 45 TKP)'],
              ['TWK', 'TWK · 30 soal'],
              ['TIU', 'TIU · 35 soal'],
              ['TKP', 'TKP · 45 soal'],
            ].map(([type, label]) => (
              <button key={type} type="button" className="cms-choice-item" onClick={() => createPackage(type)}>
                <strong>{type}</strong>
                <small>{label}</small>
              </button>
            ))}
          </div>
        </Drawer>
      ) : null}

      <Drawer
        open={Boolean(selected)}
        title={selected ? selected.name : ''}
        subtitle={selected ? `${selected.type} · ${questionErrors(selected).length} masalah soal` : ''}
        onClose={() => {
          setOpenId(null);
          setPublishErrors([]);
        }}
        footer={
          selected ? (
            <>
              {!selected.pub || selected.sim ? (
                <button type="button" className="cms-btn is-ghost" onClick={() => removePackage(selected)}>
                  Hapus
                </button>
              ) : null}
              <button
                type="button"
                className="cms-btn is-ghost"
                onClick={() =>
                  mutate((state) => {
                    const target = packageById(state, selected.id);
                    target.hidden = target.hidden ? 0 : 1;
                  })
                }
              >
                {selected.hidden ? 'Tayangkan' : 'Sembunyikan'}
              </button>
              <button
                type="button"
                className="cms-btn is-ghost"
                onClick={() =>
                  mutate((state) => {
                    packageById(state, selected.id).pub = 0;
                  })
                }
              >
                Simpan draf
              </button>
              <button type="button" className="cms-btn is-primary" onClick={() => publish(selected.id)}>
                Publikasikan
              </button>
            </>
          ) : null
        }
      >
        {selected ? <PackageForm pkg={selected} mutate={mutate} onOpenBank={onOpenBank} errors={publishErrors} /> : null}
      </Drawer>
    </>
  );
}

function PackageForm({ pkg, mutate, onOpenBank, errors }) {
  const set = (fn) =>
    mutate((state) => {
      fn(packageById(state, pkg.id));
    });

  const upload = async (file) => {
    if (!file) return;
    const thumb = await makeThumb(file);
    set((p) => {
      p.thumb = thumb;
    });
  };

  const total = NEED[pkg.type] || pkg.qs?.length || 0;

  return (
    <div className="cms-form">
      <Field label="Nama paket">
        <input className="cms-input" value={pkg.name} onChange={(e) => set((p) => (p.name = e.target.value))} />
      </Field>

      <Field label="Deskripsi">
        <textarea
          className="cms-input"
          rows={3}
          value={pkg.desc || ''}
          placeholder="Tampil di kartu paket siswa"
          onChange={(e) => set((p) => (p.desc = e.target.value))}
        />
      </Field>

      <div className="cms-form-grid">
        <Field label="Harga (Rp)">
          <input
            className="cms-input"
            type="number"
            min={0}
            value={pkg.price || 0}
            onChange={(e) => set((p) => (p.price = Number(e.target.value) || 0))}
          />
        </Field>
        <Field label="Nominal promo (Rp)" hint="Harga saat kode promo dipakai.">
          <input
            className="cms-input"
            type="number"
            min={0}
            value={pkg.promoPrice || 0}
            onChange={(e) => set((p) => (p.promoPrice = Number(e.target.value) || 0))}
          />
        </Field>
      </div>

      <div className="cms-form-grid">
        <Field label="Promo" hint={pkg.promoOn ? 'Aktif untuk semua kode promo.' : 'Nonaktif.'}>
          <label className="cms-switch">
            <input
              type="checkbox"
              checked={Boolean(pkg.promoOn)}
              onChange={(e) => set((p) => (p.promoOn = e.target.checked ? 1 : 0))}
            />
            <span />
            {pkg.promoOn ? 'Aktif' : 'Mati'}
          </label>
        </Field>
        <Field label="Kadaluarsa" hint="Lewat tanggal ini paket masuk draf.">
          <input
            className="cms-input"
            type="date"
            value={pkg.exp || ''}
            onChange={(e) => set((p) => (p.exp = e.target.value))}
          />
        </Field>
      </div>

      <Field label="Thumbnail" hint="Rasio 3:2 (mis. 360×240). Diperkecil otomatis saat diunggah.">
        <div className="cms-thumb-row">
          <div className="cms-thumb" style={pkg.thumb ? { backgroundImage: `url(${pkg.thumb})` } : undefined}>
            {pkg.thumb ? null : <span>Belum ada</span>}
          </div>
          <div className="cms-thumb-actions">
            <input
              className="cms-input"
              placeholder="Tempel URL gambar…"
              value={pkg.thumb && !pkg.thumb.startsWith('data:') ? pkg.thumb : ''}
              onChange={(e) => set((p) => (p.thumb = e.target.value))}
            />
            <label className="cms-btn is-ghost">
              Unggah
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => upload(e.target.files?.[0])}
              />
            </label>
            {pkg.thumb ? (
              <button type="button" className="cms-btn is-ghost" onClick={() => set((p) => (p.thumb = ''))}>
                Hapus
              </button>
            ) : null}
          </div>
        </div>
      </Field>

      <div className="cms-inline-note">
        <div>
          <strong>Bank soal</strong>
          <small>
            {(pkg.qs || []).length} soal tersimpan · butuh {total} untuk tipe {pkg.type}.
          </small>
        </div>
        <button type="button" className="cms-btn" onClick={() => onOpenBank(pkg.id)}>
          Buka editor soal
        </button>
      </div>

      {errors.length ? (
        <div className="cms-alert is-warn">
          <strong>{errors.length} masalah sebelum bisa tayang</strong>
          <ul>
            {errors.slice(0, 6).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
          {errors.length > 6 ? <small>+{errors.length - 6} lainnya</small> : null}
        </div>
      ) : null}

      <div className="cms-legend">
        <span>
          <Badge tone="neutral">#{pkg.id}</Badge> id paket
        </span>
        <span>
          <Badge tone={pkg.pub ? 'ok' : 'warn'}>{pkg.pub ? 'Tayang' : 'Draf'}</Badge>
        </span>
        <span className="cms-dim">Perubahan tersimpan otomatis.</span>
      </div>
    </div>
  );
}

function countIncomplete(pkg) {
  return (pkg.qs || []).filter((_, i) => {
    const type = questionType(pkg, i);
    const q = pkg.qs[i];
    const has = (t, img) => Boolean((t || '').trim() || img);
    const options = (q.o || []).every((o, j) => has(o, (q.oi || [])[j]));
    const key = type === 'TKP' ? (q.w || []).every((w) => w != null) : q.a != null;
    return !(has(q.t, q.img) && options && key);
  }).length;
}
