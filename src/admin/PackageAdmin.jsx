'use client';

import { useMemo, useRef, useState } from 'react';
import { useStore, update } from '../lib/store.js';
import { LETTERS, NEED, fmtRp, numOf, qType, todayID, validatePackage } from '../lib/model.js';
import { compressImage } from '../lib/image.js';
import { Modal } from '../components/AppShell.jsx';

const emptyQ = () => ({ t: '', o: ['', '', '', '', ''], a: null, w: [null, null, null, null, null], pem: '', oi: [] });

export default function PackageAdmin({ onToast }) {
  const { data: S } = useStore();
  const [editing, setEditing] = useState(null);
  const [sel, setSel] = useState(0);
  const [create, setCreate] = useState(false);
  const [draft, setDraft] = useState({ name: '', type: 'SKD', price: 0 });
  const [errors, setErrors] = useState(null);
  const [del, setDel] = useState(null);
  const [agree, setAgree] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const pkg = S.packages.find((p) => p.id === editing) || null;

  const setPkg = (patch) =>
    update((d) => {
      const p = d.packages.find((x) => x.id === editing);
      if (p) Object.assign(p, patch);
    });

  const setQ = (patch) =>
    update((d) => {
      const p = d.packages.find((x) => x.id === editing);
      if (p?.qs?.[sel]) Object.assign(p.qs[sel], patch);
    });

  const setOpt = (j, value) =>
    update((d) => {
      const p = d.packages.find((x) => x.id === editing);
      if (p?.qs?.[sel]) p.qs[sel].o[j] = value;
    });

  const setWeight = (j, value) =>
    update((d) => {
      const p = d.packages.find((x) => x.id === editing);
      if (p?.qs?.[sel]) p.qs[sel].w[j] = value === '' ? null : Number(value);
    });

  const filled = (q, p, i) => {
    const t = qType(p, i);
    const optsOk = (q.o || []).every((o) => String(o).trim());
    if (t === 'TKP') return optsOk && !(q.w || []).some((w) => w == null);
    return optsOk && q.a != null;
  };

  const publish = () => {
    if (!pkg) return;
    const errs = validatePackage(pkg);
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setPkg({ pub: 1, rel: pkg.rel || todayID() });
    onToast('Paket diterbitkan');
  };

  const remove = () =>
    update((d) => {
      const id = del;
      d.packages = d.packages.filter((p) => p.id !== id);
      delete d.owned[id];
      delete d.res[id];
      delete d.hist[id];
      d.newPk = (d.newPk || []).filter((x) => x !== id);
    });

  const parseBulk = () => {
    if (!pkg) return;
    const n = pkg.qs.length;
    const errs = [];
    const nq = pkg.qs.map((q) => ({ ...q }));
    bulkText
      .split('///')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((blk, i) => {
        if (i >= n) {
          errs.push(`Soal ke-${i + 1}: melebihi kapasitas paket (${n} soal)`);
          return;
        }
        const num = numOf(pkg, i);
        const t = qType(pkg, i);
        const [main, pem] = blk.split('|||');
        const parts = main.split('||').map((s) => s.trim());
        if (parts.length < 6) errs.push(`Nomor ${num}: butuh 1 pertanyaan + 5 opsi, ditemukan ${parts.length} bagian`);
        const a = parts.slice(1, 6).findIndex((s) => s.startsWith('*'));
        if (t !== 'TKP' && a < 0 && parts.length >= 6) errs.push(`Nomor ${num}: kunci jawaban belum ditandai dengan *`);
        nq[i] = {
          ...nq[i],
          t: parts[0],
          o: Array.from({ length: 5 }, (_, j) => (parts[j + 1] || '').replace(/^\*/, '')),
          a: t === 'TKP' ? null : a < 0 ? null : a,
          w: t === 'TKP' ? [5, 4, 3, 2, 1] : [null, null, null, null, null],
          pem: pem ? pem.trim() : '',
        };
      });
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setPkg({ qs: nq });
    setBulk(false);
    setBulkText('');
    onToast('Tempel massal berhasil');
  };

  if (pkg) {
    const q = pkg.qs[sel] || emptyQ();
    const t = qType(pkg, sel);
    return (
      <>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 16 }}>
          <button className="btn sm ghost" onClick={() => setEditing(null)}>
            ← Daftar Paket
          </button>
          <h2 style={{ margin: 0, flex: 1 }}>{pkg.name}</h2>
          <span className="muted tiny">
            {pkg.type} • {pkg.qs.length} soal • {pkg.pub ? (pkg.hidden ? 'disembunyikan' : 'tayang') : 'draf'}
          </span>
        </div>

        <div className="editor-layout">
          <div className="stack">
            <section className="admin-card">
              <h2>Info Paket</h2>
              <div className="form-grid">
                <label>
                  Nama
                  <input value={pkg.name} onChange={(e) => setPkg({ name: e.target.value })} />
                </label>
                <label>
                  Jenis
                  <select value={pkg.type} onChange={(e) => setPkg({ type: e.target.value })}>
                    {['SKD', 'TWK', 'TIU', 'TKP'].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <label>
                    Harga normal
                    <input type="number" value={pkg.price || 0} onChange={(e) => setPkg({ price: Number(e.target.value) })} />
                  </label>
                  <label>
                    Harga promo
                    <input type="number" value={pkg.promo || 0} onChange={(e) => setPkg({ promo: Number(e.target.value) })} />
                  </label>
                </div>
                <label>
                  Deskripsi
                  <textarea rows={3} value={pkg.desc || ''} onChange={(e) => setPkg({ desc: e.target.value })} />
                </label>
                <label>
                  Tanggal rilis
                  <input type="date" value={pkg.rel ? isoDate(pkg.rel) : ''} onChange={(e) => setPkg({ rel: e.target.value ? formatDateID(e.target.value) : '' })} />
                </label>
              </div>
              <div className="row-actions" style={{ marginTop: 12 }}>
                <label className="btn ghost sm" style={{ cursor: 'pointer' }}>
                  Thumbnail
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        setPkg({ thumb: await compressImage(f, 480, 0.85) });
                        onToast('Thumbnail diperbarui');
                      } catch {
                        onToast('Gagal membaca gambar');
                      }
                    }}
                  />
                </label>
                {pkg.thumb ? (
                  <button className="btn danger sm" onClick={() => setPkg({ thumb: '' })}>
                    Hapus Thumbnail
                  </button>
                ) : null}
                <button className="btn sm" onClick={publish}>
                  {pkg.pub ? 'Simpan & Terbitkan' : 'Publikasikan'}
                </button>
                {pkg.pub ? (
                  <button className="btn ghost sm" onClick={() => setPkg({ hidden: pkg.hidden ? 0 : 1 })}>
                    {pkg.hidden ? 'Tayangkan' : 'Sembunyikan'}
                  </button>
                ) : null}
                <button className="btn danger sm" onClick={() => { setAgree(false); setDel(pkg.id); }}>
                  Hapus
                </button>
              </div>
            </section>

            <section className="admin-card">
              <h2>Bank Soal</h2>
              <div className="row-actions" style={{ marginBottom: 10 }}>
                <button className="btn sm ghost" onClick={() => setBulk(true)}>
                  Tempel Massal
                </button>
                <span className="muted tiny" style={{ alignSelf: 'center' }}>
                  Wajib lengkap sebelum publikasi
                </span>
              </div>
              <div className="q-grid">
                {pkg.qs.map((x, i) => (
                  <button
                    key={i}
                    className={`${filled(x, pkg, i) ? 'full' : ''}${i === sel ? ' sel' : ''}`}
                    onClick={() => setSel(i)}
                  >
                    {numOf(pkg, i)}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <section className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0 }}>
                Soal {numOf(pkg, sel)} <span className="muted tiny">• {t}</span>
              </h2>
              {q.img ? (
                <button className="btn danger sm" onClick={() => setQ({ img: '' })}>
                  Hapus Gambar
                </button>
              ) : (
                <label className="btn ghost sm" style={{ cursor: 'pointer' }}>
                  Gambar Soal
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        setQ({ img: await compressImage(f, 900, 0.85) });
                      } catch {
                        onToast('Gagal membaca gambar');
                      }
                    }}
                  />
                </label>
              )}
            </div>

            <div className="form-grid" style={{ marginTop: 12 }}>
              <label>
                Teks soal
                <textarea rows={3} value={q.t} onChange={(e) => setQ({ t: e.target.value })} />
              </label>
              {q.img ? <img src={q.img} alt="" style={{ maxWidth: '100%', borderRadius: 10 }} /> : null}
            </div>

            <div style={{ marginTop: 14 }}>
              {q.o.map((o, j) => (
                <div className="opt-editor" key={j}>
                  <button
                    className={`key${t !== 'TKP' && q.a === j ? ' on' : ''}`}
                    title={t === 'TKP' ? 'Bobot' : 'Kunci jawaban'}
                    onClick={() => {
                      if (t !== 'TKP') setQ({ a: j });
                    }}
                  >
                    {LETTERS[j]}
                  </button>
                  <input value={o} onChange={(e) => setOpt(j, e.target.value)} placeholder={`Opsi ${LETTERS[j]}`} />
                  {t === 'TKP' ? (
                    <select
                      value={q.w[j] ?? ''}
                      onChange={(e) => setWeight(j, e.target.value)}
                      className={`weight${q.w[j] ? ` weight-${q.w[j]}` : ''}`}
                      style={{ padding: 4, borderRadius: 8, color: q.w[j] ? '#fff' : 'inherit' }}
                    >
                      <option value="">·</option>
                      {[5, 4, 3, 2, 1].map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{t !== 'TKP' && q.a === j ? '✔' : ''}</span>
                  )}
                </div>
              ))}
              {t === 'TKP' ? (
                <button className="btn ghost sm" onClick={() => setQ({ w: [null, null, null, null, null] })}>
                  Reset Bobot
                </button>
              ) : null}
            </div>

            <div className="form-grid" style={{ marginTop: 14 }}>
              <label>
                Pembahasan
                <textarea rows={3} value={q.pem || ''} onChange={(e) => setQ({ pem: e.target.value })} />
              </label>
            </div>
          </section>
        </div>

        <Modal open={Boolean(errors)} onClose={() => setErrors(null)} title="Belum bisa dipublikasikan">
          <div style={{ maxHeight: 280, overflow: 'auto', fontSize: 13, lineHeight: 1.7 }}>
            {errors?.slice(0, 50).map((e, i) => (
              <div key={i}>⚠ {e}</div>
            ))}
          </div>
          <button className="btn block" style={{ marginTop: 12 }} onClick={() => setErrors(null)}>
            Tutup
          </button>
        </Modal>

        <Modal open={Boolean(del)} onClose={() => setDel(null)} title="Hapus paket?">
          <p className="muted" style={{ lineHeight: 1.6 }}>
            Paket akan dihapus permanen beserta nilai dan riwayat pengerjaan siswa yang membelinya.
          </p>
          <label className="tiny" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 18 }} />
            Saya mengerti dan yakin menghapus paket ini.
          </label>
          <button
            className="btn danger block"
            disabled={!agree}
            onClick={() => {
              remove();
              setDel(null);
              setEditing(null);
              onToast('Paket dihapus');
            }}
          >
            Hapus Permanen
          </button>
        </Modal>

        <Modal open={bulk} onClose={() => setBulk(false)} title="Tempel Massal Soal">
          <p className="muted tiny" style={{ lineHeight: 1.6 }}>
            Format: <code>Pertanyaan?|| A|| *B|| C|| D|| E ||| pembahasan /// soal berikut…</code>{' '}
            (tanda * = kunci; untuk TKP urutan opsi = bobot 5,4,3,2,1)
          </p>
          <textarea rows={8} value={bulkText} onChange={(e) => setBulkText(e.target.value)} />
          <button className="btn block" style={{ marginTop: 10 }} onClick={parseBulk}>
            Proses
          </button>
        </Modal>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ margin: 0 }}>Paket & Soal</h2>
        <button className="btn sm" onClick={() => setCreate(true)}>
          + Paket Baru
        </button>
      </div>

      <div className="admin-card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jenis</th>
              <th>Soal</th>
              <th>Harga</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {S.packages.map((p) => (
              <tr key={p.id}>
                <td style={{ minWidth: 200 }}>
                  <b>{p.name}</b>
                  <div className="muted tiny">{p.rel ? `Rilis ${p.rel}` : 'Belum rilis'}</div>
                </td>
                <td>{p.type}</td>
                <td>{p.qs?.length || 0}</td>
                <td>{fmtRp(p.promo || p.price)}</td>
                <td>
                  {p.pub ? (p.hidden ? 'Disembunyikan' : 'Tayang') : 'Draf'}
                </td>

                <td>
                  <div className="row-actions">
                    <button
                      className="btn sm ghost"
                      onClick={() => {
                        setEditing(p.id);
                        setSel(0);
                      }}
                    >
                      Edit
                    </button>
                    {!p.pub ? (
                      <button
                        className="btn sm"
                        onClick={() => {
                          const errs = validatePackage(p);
                          if (errs.length) setErrors(errs);
                          else {
                            update((d) => {
                              const x = d.packages.find((y) => y.id === p.id);
                              x.pub = 1;
                              x.rel = x.rel || todayID();
                            });
                            onToast('Paket diterbitkan');
                          }
                        }}
                      >
                        Terbitkan
                      </button>
                    ) : (
                      <button
                        className="btn sm ghost"
                        onClick={() =>
                          update((d) => {
                            const x = d.packages.find((y) => y.id === p.id);
                            x.hidden = x.hidden ? 0 : 1;
                          })
                        }
                      >
                        {p.hidden ? 'Tayangkan' : 'Sembunyikan'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={create} onClose={() => setCreate(false)} title="Paket Baru">
        <div className="form-grid">
          <input placeholder="Nama paket" value={draft.name} onChange={(e) => setDraft((v) => ({ ...v, name: e.target.value }))} />
          <select value={draft.type} onChange={(e) => setDraft((v) => ({ ...v, type: e.target.value }))}>
            {['SKD', 'TWK', 'TIU', 'TKP'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input type="number" placeholder="Harga (Rp)" value={draft.price || ''} onChange={(e) => setDraft((v) => ({ ...v, price: Number(e.target.value) }))} />
          <button
            className="btn block"
            onClick={() => {
              const type = draft.type;
              const id = Math.max(0, ...S.packages.map((p) => p.id)) + 1;
              update((d) => {
                d.seq = Math.max(d.seq || 0, id + 1);
                d.packages.unshift({
                  id,
                  name: draft.name || 'Paket Baru',
                  type,
                  price: draft.price || 0,
                  promo: 0,
                  desc: '',
                  pub: 0,
                  hidden: 0,
                  rel: '',
                  qs: Array.from({ length: NEED[type] }, emptyQ),
                });
              });
              setCreate(false);
              setDraft({ name: '', type: 'SKD', price: 0 });
              setEditing(id);
              setSel(0);
              onToast('Draf paket dibuat');
            }}
          >
            Buat Draf
          </button>
        </div>
      </Modal>

      <Modal open={Boolean(errors)} onClose={() => setErrors(null)} title="Belum bisa dipublikasikan">
        <div style={{ maxHeight: 280, overflow: 'auto', fontSize: 13, lineHeight: 1.7 }}>
          {errors?.slice(0, 50).map((e, i) => (
            <div key={i}>⚠ {e}</div>
          ))}
        </div>
        <button className="btn block" style={{ marginTop: 12 }} onClick={() => setErrors(null)}>
          Tutup
        </button>
      </Modal>
    </>
  );
}

function isoDate(id) {
  const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', Mei: '05', Jun: '06', Jul: '07', Agu: '08', Sep: '09', Okt: '10', Nov: '11', Des: '12' };
  const m = String(id).match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/);
  if (!m) return '';
  return `${m[3]}-${months[m[2]] || '01'}-${m[1].padStart(2, '0')}`;
}

function formatDateID(value) {
  const d = new Date(value + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
