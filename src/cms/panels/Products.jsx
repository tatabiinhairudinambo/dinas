/**
 * Tab Produk — demo CRUD produk (paket try out) untuk panel CMS.
 *
 * Sengaja memakai data yang sama dengan tab Paket (`S.packages` lewat
 * cmsData.js), bukan tabel baru: belum ada database, jadi "produk" di sini
 * adalah paket yang dibaca aplikasi siswa dari localStorage `kedinasan_v2`.
 * Semua tulisan lewat mutate() → save() legacy, sehingga nanti otomatis ikut
 * tersinkron saat mode Supabase aktif.
 *
 * Bedanya dengan tab Paket: form di sini memakai tombol Simpan (draft lokal),
 * punya aksi Duplikat, dan bisa mengubah kategori produk — lebih enak dipakai
 * untuk mencoba alur tambah/edit tanpa langsung menulis tiap ketikan.
 */
import { useMemo, useState } from 'react';
import { Badge, Drawer, Empty, Field, Panel } from '../ui.jsx';
import { NEED, packageById, rupiah, salesOf, useCmsState } from '../../lib/cmsData.js';
import { uploadDataUrl } from '../../lib/assets.js';
import { makeThumb } from '../thumb.js';

const TYPES = [
  ['SKD', 'SKD · 110 soal'],
  ['TWK', 'TWK · 30 soal'],
  ['TIU', 'TIU · 35 soal'],
  ['TKP', 'TKP · 45 soal'],
];

const EMPTY_QUESTION = () => ({
  t: '',
  o: ['', '', '', '', ''],
  a: null,
  w: [null, null, null, null, null],
  pem: '',
  oi: [],
});

const blank = () => ({
  id: null,
  name: '',
  type: 'TWK',
  desc: '',
  price: 0,
  promoPrice: 0,
  promoOn: 0,
  exp: '',
  thumb: '',
  pub: 0,
  hidden: 0,
});

const draftOf = (p) => ({
  ...blank(),
  id: p.id,
  name: p.name || '',
  type: p.type || 'TWK',
  desc: p.desc || '',
  price: Number(p.price) || 0,
  promoPrice: Number(p.promoPrice) || 0,
  promoOn: p.promoOn ? 1 : 0,
  exp: p.exp || '',
  thumb: p.thumb || '',
  pub: p.pub ? 1 : 0,
  hidden: p.hidden ? 1 : 0,
});

const statusOf = (p) => (!p.pub ? 'draft' : p.hidden ? 'hidden' : 'pub');

function nextId(state) {
  return Number(state.seq) || Math.max(0, ...state.packages.map((x) => Number(x.id) || 0)) + 1;
}

export default function Products() {
  const { S, mutate } = useCmsState();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [thumbBusy, setThumbBusy] = useState(false);

  const products = S?.packages || [];
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !`${p.name} ${p.type} ${p.desc || ''}`.toLowerCase().includes(q)) return false;
      if (filter === 'pub' && (!p.pub || p.hidden)) return false;
      if (filter === 'draft' && p.pub) return false;
      if (filter === 'hidden' && !p.hidden) return false;
      return true;
    });
  }, [products, query, filter]);

  const openCreate = () => {
    setDraft(blank());
    setError('');
    setNotice('');
  };

  const openEdit = (p) => {
    setDraft(draftOf(p));
    setError('');
    setNotice('');
  };

  const submit = () => {
    if (!draft) return;
    const name = draft.name.trim();
    if (!name) return setError('Nama produk wajib diisi.');
    if (draft.price < 0 || draft.promoPrice < 0) return setError('Harga tidak boleh negatif.');
    if (draft.promoPrice > 0 && draft.promoPrice >= draft.price) {
      return setError('Harga promo harus lebih kecil dari harga normal.');
    }

    const saved = mutate((state) => {
      if (draft.id == null) {
        const id = nextId(state);
        state.seq = id + 1;
        state.packages = [
          { ...draft, id, name, qs: Array.from({ length: NEED[draft.type] }, EMPTY_QUESTION) },
          ...state.packages,
        ];
        return;
      }

      const target = packageById(state, draft.id);
      if (!target) return;

      // Ganti kategori = sesuaikan jumlah soal, isi lama dipertahankan.
      if (target.type !== draft.type) {
        const need = NEED[draft.type];
        const qs = (target.qs || []).slice(0, need).map((q) => ({ ...q }));
        while (qs.length < need) qs.push(EMPTY_QUESTION());
        target.type = draft.type;
        target.qs = qs;
      }

      Object.assign(target, {
        name,
        desc: draft.desc,
        price: draft.price,
        promoPrice: draft.promoPrice,
        promoOn: draft.promoOn,
        exp: draft.exp,
        thumb: draft.thumb,
        pub: draft.pub,
        hidden: draft.hidden,
      });
    });

    setError('');
    if (!saved) {
      setNotice('');
      setError(
        'Gambar/produk gagal ditulis ke perangkat — penyimpanan kemungkinan penuh. Hapus gambar lain atau perkecil berkas, lalu simpan lagi.',
      );
      return;
    }
    setDraft(null);
    setNotice(`${name} tersimpan.`);
  };

  const duplicate = (p) => {
    mutate((state) => {
      const id = nextId(state);
      state.seq = id + 1;
      state.packages = [
        {
          ...p,
          id,
          name: `${p.name} (salinan)`,
          pub: 0,
          hidden: 0,
          qs: (p.qs || []).map((q) => ({
            ...q,
            o: [...(q.o || [])],
            w: [...(q.w || [])],
            oi: [...(q.oi || [])],
          })),
        },
        ...state.packages,
      ];
    });
    setNotice(`${p.name} diduplikasi.`);
  };

  const remove = (p) => {
    const sold = salesOf(S, p.id).length;
    const warning = [
      `Hapus produk "${p.name}"?`,
      '',
      'Soal, riwayat nilai, dan kepemilikan produk ini ikut terhapus.',
      sold ? `Produk ini punya ${sold} penjualan tercatat.` : '',
    ]
      .filter(Boolean)
      .join('\n');
    if (!window.confirm(warning)) return;

    mutate((state) => {
      state.packages = state.packages.filter((x) => String(x.id) !== String(p.id));
      if (state.owned) delete state.owned[p.id];
      if (state.res) delete state.res[p.id];
      if (state.hist) delete state.hist[p.id];
      if (state.sales) state.sales = state.sales.filter((s) => String(s.pid) !== String(p.id));
    });
    setNotice(`${p.name} dihapus.`);
  };

  if (!S) return <div className="cms-loading">Menunggu data…</div>;

  return (
    <>
      <Panel
        title={`${rows.length} produk`}
        hint="Demo CRUD: data disimpan di localStorage aplikasi (kedinasan_v2), belum ada database terpisah."
        actions={
          <>
            <input
              className="cms-input cms-search"
              placeholder="Cari produk…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="cms-input" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Semua status</option>
              <option value="pub">Tayang</option>
              <option value="draft">Draf</option>
              <option value="hidden">Disembunyikan</option>
            </select>
            <button type="button" className="cms-btn is-primary" onClick={openCreate}>
              + Produk baru
            </button>
          </>
        }
        flush
      >
        {notice ? (
          <div className="cms-product-flash">
            <div className="cms-alert is-ok">
              {notice}{' '}
              <button type="button" className="cms-linklike" onClick={() => setNotice('')}>
                tutup
              </button>
            </div>
          </div>
        ) : null}

        {rows.length === 0 ? (
          <Empty title="Belum ada produk" hint="Klik “+ Produk baru” untuk membuat produk demo pertama." />
        ) : (
          <div className="cms-table-wrap">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Soal</th>
                  <th>Status</th>
                  <th>Terjual</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className={draft && String(draft.id) === String(p.id) ? 'is-selected' : ''}>
                    <td>
                      <div className="cms-product">
                        <div
                          className="cms-product-thumb"
                          style={p.thumb ? { backgroundImage: `url(${p.thumb})` } : undefined}
                        >
                          {p.thumb ? null : <span>{p.type}</span>}
                        </div>
                        <div className="cms-product-meta">
                          <button type="button" className="cms-cell-link" onClick={() => openEdit(p)}>
                            {p.name}
                          </button>
                          <small className="cms-dim">
                            #{p.id}
                            {p.desc ? ` · ${p.desc}` : ''}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge tone="neutral">{p.type}</Badge>
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
                      <small className="cms-dim">
                        {(p.qs || []).length}/{NEED[p.type] || (p.qs || []).length}
                      </small>
                    </td>
                    <td>
                      {!p.pub ? (
                        <Badge tone="warn">Draf</Badge>
                      ) : p.hidden ? (
                        <Badge tone="neutral">Disembunyikan</Badge>
                      ) : (
                        <Badge tone="ok">Tayang</Badge>
                      )}
                    </td>
                    <td>{salesOf(S, p.id).length}</td>
                    <td className="cms-cell-actions">
                      <button type="button" className="cms-btn is-ghost" onClick={() => openEdit(p)}>
                        Edit
                      </button>
                      <button type="button" className="cms-btn is-ghost" onClick={() => duplicate(p)}>
                        Duplikat
                      </button>
                      <button type="button" className="cms-btn is-ghost" onClick={() => remove(p)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Drawer
        open={Boolean(draft)}
        title={draft?.id == null ? 'Produk baru' : `Edit produk #${draft?.id}`}
        subtitle="Perubahan baru tersimpan setelah tombol Simpan ditekan."
        onClose={() => {
          setDraft(null);
          setError('');
        }}
        footer={
          draft ? (
            <>
              {draft.id != null ? (
                <button
                  type="button"
                  className="cms-btn is-ghost"
                  onClick={() => {
                    const p = packageById(S, draft.id);
                    setDraft(null);
                    if (p) remove(p);
                  }}
                >
                  Hapus
                </button>
              ) : null}
              <button type="button" className="cms-btn is-ghost" onClick={() => setDraft(null)}>
                Batal
              </button>
              <button type="button" className="cms-btn is-primary" onClick={submit} disabled={thumbBusy}>
                {thumbBusy ? 'Memproses…' : 'Simpan'}
              </button>
            </>
          ) : null
        }
      >
        {draft ? (
          <div className="cms-form">
            {error ? <div className="cms-alert is-danger">{error}</div> : null}

            <Field label="Nama produk">
              <input
                id="pf-name"
                className="cms-input"
                value={draft.name}
                placeholder="mis. Try Out SKD Perdana"
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>

            <Field label="Deskripsi">
              <textarea
                id="pf-desc"
                className="cms-input"
                rows={3}
                value={draft.desc}
                placeholder="Tampil di kartu produk siswa"
                onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
              />
            </Field>

            <div className="cms-form-grid">
              <Field label="Kategori" hint={`Bank soal mengikuti kategori: ${NEED[draft.type]} soal.`}>
                <select
                  id="pf-type"
                  className="cms-input"
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                >
                  {TYPES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status" hint="Tayang = muncul di katalog siswa.">
                <select
                  id="pf-status"
                  className="cms-input"
                  value={statusOf(draft)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDraft({ ...draft, pub: value === 'draft' ? 0 : 1, hidden: value === 'hidden' ? 1 : 0 });
                  }}
                >
                  <option value="draft">Draf</option>
                  <option value="pub">Tayang</option>
                  <option value="hidden">Disembunyikan</option>
                </select>
              </Field>
            </div>

            <div className="cms-form-grid">
              <Field label="Harga (Rp)">
                <input
                  id="pf-price"
                  className="cms-input"
                  type="number"
                  min={0}
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) || 0 })}
                />
              </Field>
              <Field label="Harga promo (Rp)" hint="0 = tanpa promo.">
                <input
                  id="pf-promo"
                  className="cms-input"
                  type="number"
                  min={0}
                  value={draft.promoPrice}
                  onChange={(e) => setDraft({ ...draft, promoPrice: Number(e.target.value) || 0 })}
                />
              </Field>
            </div>

            <div className="cms-form-grid">
              <Field label="Promo" hint={draft.promoOn ? 'Aktif untuk semua kode promo.' : 'Nonaktif.'}>
                <label className="cms-switch">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.promoOn)}
                    onChange={(e) => setDraft({ ...draft, promoOn: e.target.checked ? 1 : 0 })}
                  />
                  <span />
                  {draft.promoOn ? 'Aktif' : 'Mati'}
                </label>
              </Field>
              <Field label="Kadaluarsa" hint="Lewat tanggal ini produk masuk draf.">
                <input
                  id="pf-exp"
                  className="cms-input"
                  type="date"
                  value={draft.exp}
                  onChange={(e) => setDraft({ ...draft, exp: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Thumbnail" hint="Rasio 3:2 (mis. 360×240). Diperkecil otomatis saat diunggah.">
              <div className="cms-thumb-row">
                <div
                  className="cms-thumb"
                  style={draft.thumb ? { backgroundImage: `url(${draft.thumb})` } : undefined}
                >
                  {draft.thumb ? null : <span>Belum ada</span>}
                </div>
                <div className="cms-thumb-actions">
                  <input
                    className="cms-input"
                    placeholder="Tempel URL gambar…"
                    value={draft.thumb && !draft.thumb.startsWith('data:') ? draft.thumb : ''}
                    onChange={(e) => setDraft({ ...draft, thumb: e.target.value })}
                  />
                  <label className="cms-btn is-ghost">
                    {thumbBusy ? 'Memproses…' : 'Unggah'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (!file) return;
                        setThumbBusy(true);
                        setError('');
                        try {
                          const thumb = await makeThumb(file);
                          // crop() mengembalikan berkas asli kalau gambar gagal
                          // didekode (mis. HEIC); jangan simpan data raksasa.
                          if (!String(thumb).startsWith('data:image/') || thumb.length > 800000) {
                            setError('Gambar tidak bisa diperkecil. Pakai JPG/PNG di bawah 5 MB.');
                            return;
                          }
                          const { url, mode } = await uploadDataUrl(thumb, 'produk');
                          setDraft((current) => (current ? { ...current, thumb: url } : current));
                          if (mode === 'local') {
                            setNotice('Gambar disimpan lokal — login Supabase agar masuk Storage.');
                          }
                        } catch {
                          setError('Gambar gagal dibaca. Coba JPG/PNG lain.');
                        } finally {
                          setThumbBusy(false);
                        }
                      }}
                    />
                  </label>
                  {draft.thumb ? (
                    <button
                      type="button"
                      className="cms-btn is-ghost"
                      onClick={() => setDraft({ ...draft, thumb: '' })}
                    >
                      Hapus gambar
                    </button>
                  ) : null}
                </div>
              </div>
            </Field>

            <div className="cms-legend">
              <span>
                <Badge tone="neutral">{draft.id == null ? 'baru' : `#${draft.id}`}</Badge> id produk
              </span>
              <span>
                <Badge tone={draft.pub ? 'ok' : 'warn'}>{draft.pub ? 'Tayang' : 'Draf'}</Badge>
              </span>
              <span className="cms-dim">
                Soal {NEED[draft.type]} · diisi lewat tab Bank Soal setelah tersimpan.
              </span>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
