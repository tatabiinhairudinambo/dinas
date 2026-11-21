'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStore, update } from '../lib/store.js';
import { DEFAULT_BANNER, fmtRp } from '../lib/model.js';
import { checkPassword, hashPassword } from '../lib/auth.js';
import { compressImage } from '../lib/image.js';
import { Modal } from '../components/AppShell.jsx';
import PackageAdmin from './PackageAdmin.jsx';

const DEMO = { e: '1@gmail.com', p: '123456', n: 'Operator' };
const SESSION_KEY = 'kedinasan_admin';

export default function AdminApp() {
  const store = useStore();
  const { ready, data: S } = store;
  const [signed, setSigned] = useState(false);
  const [tab, setTab] = useState('ringkasan');
  const [login, setLogin] = useState({ e: DEMO.e, p: DEMO.p, msg: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      setSigned(sessionStorage.getItem(SESSION_KEY) === '1');
    } catch {}
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (S.users.some((u) => u.e === DEMO.e)) return;
    hashPassword(DEMO.p).then((p) => {
      update((d) => {
        if (!d.users.some((u) => u.e === DEMO.e)) {
          d.users.push({ n: DEMO.n, e: DEMO.e, v: 1, pic: '', p, j: new Date().toISOString() });
        }
      });
    });
  }, [ready, S.users]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const submit = async (e) => {
    e.preventDefault();
    const email = login.e.trim().toLowerCase();
    const u = S.users.find((x) => x.e === email);
    if (!u || !(await checkPassword(u, login.p))) {
      setLogin((v) => ({ ...v, msg: 'Email atau kunci salah' }));
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {}
    setSigned(true);
  };

  if (!ready) return <div className="boot"><div className="boot-dot" /></div>;

  if (!signed) {
    return (
      <div className="admin">
        <div className="admin-login">
          <form className="admin-card stack" onSubmit={submit}>
            <div className="admin-brand">
              <i />
              <span>Panel Admin — Web Kedinasan</span>
            </div>
            <p className="muted tiny" style={{ margin: 0 }}>
              Demo lokal: <b>{DEMO.e}</b> / <b>{DEMO.p}</b>
            </p>
            {login.msg ? <div className="err tiny">{login.msg}</div> : null}
            <input value={login.e} onChange={(e) => setLogin((v) => ({ ...v, e: e.target.value }))} placeholder="Email operator" />
            <input type="password" value={login.p} onChange={(e) => setLogin((v) => ({ ...v, p: e.target.value }))} placeholder="Kunci" />
            <button className="btn block">Masuk Panel</button>
          </form>
        </div>
      </div>
    );
  }

  const owned = Object.keys(S.owned || {}).length;
  const results = Object.values(S.res || {}).length;
  const questions = S.packages.reduce((a, p) => a + (p.qs?.length || 0), 0);
  const published = S.packages.filter((p) => p.pub).length;

  const tabs = [
    ['ringkasan', 'Ringkasan'],
    ['paket', 'Paket & Soal'],
    ['pemasaran', 'Pemasaran'],
    ['akun', 'Akun'],
  ];

  return (
    <div className="admin">
      <header className="admin-top">
        <div className="admin-brand">
          <i />
          <span>Panel Admin</span>
        </div>
        <div className="admin-tabs">
          {tabs.map(([k, label]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
              {label}
            </button>
          ))}
        </div>
        <button
          className="btn sm ghost"
          onClick={() => {
            try {
              sessionStorage.removeItem(SESSION_KEY);
            } catch {}
            setSigned(false);
          }}
        >
          Keluar
        </button>
      </header>

      <main className="admin-body">
        {tab === 'ringkasan' ? (
          <Ringkasan S={S} owned={owned} results={results} questions={questions} published={published} />
        ) : null}
        {tab === 'paket' ? <PackageAdmin onToast={setToast} /> : null}
        {tab === 'pemasaran' ? <Pemasaran S={S} onToast={setToast} /> : null}
        {tab === 'akun' ? <Akun S={S} onToast={setToast} /> : null}
      </main>

      {toast ? (
        <div className="modal" style={{ position: 'fixed', zIndex: 80, bottom: 24, left: '50%', transform: 'translateX(-50%)', padding: '10px 16px', width: 'auto', maxWidth: '90vw' }}>
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function Ringkasan({ S, owned, results, questions, published }) {
  return (
    <>
      <h2>Ringkasan</h2>
      <div className="admin-grid" style={{ marginBottom: 16 }}>
        <div className="kpi">
          <b>{published}</b>
          <span>Paket tayang dari {S.packages.length}</span>
        </div>
        <div className="kpi">
          <b>{questions}</b>
          <span>Total soal di bank</span>
        </div>
        <div className="kpi">
          <b>{S.users.length}</b>
          <span>Akun terdaftar</span>
        </div>
        <div className="kpi">
          <b>{owned}</b>
          <span>Paket terjual</span>
        </div>
        <div className="kpi">
          <b>{results}</b>
          <span>Try out diselesaikan</span>
        </div>
      </div>
      <div className="admin-card">
        <h2>Log Terbaru</h2>
        {S.logs.slice(0, 12).map((l, i) => (
          <div className="log-item" key={i}>
            <b>{l.t}</b>
            <div style={{ fontSize: 13 }}>{l.x}</div>
            <span>{l.d}</span>
          </div>
        ))}
        {S.logs.length === 0 ? <p className="muted tiny">Belum ada aktivitas.</p> : null}
      </div>
    </>
  );
}

function Pemasaran({ S, onToast }) {
  const [promo, setPromo] = useState({ name: '', code: '', bank: '' });
  const [banner, setBanner] = useState('');
  const file = (key, maxW = 1200) => async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const data = await compressImage(f, maxW, 0.85);
      update((d) => {
        d[key] = data;
      });
      onToast('Gambar diperbarui');
    } catch {
      onToast('Gagal membaca gambar');
    }
  };

  return (
    <>
      <h2>Pemasaran</h2>
      <div className="admin-grid">
        <section className="admin-card">
          <h2>Banner Beranda</h2>
          <div className="form-grid">
            <label>
              Teks banner
              <input
                value={banner === '' ? (S.banner === DEFAULT_BANNER ? '' : S.banner || '') : banner}
                onChange={(e) => setBanner(e.target.value)}
                placeholder="Kosongkan untuk tanpa teks"
              />
            </label>
            <button
              className="btn sm"
              onClick={() => {
                update((d) => {
                  d.banner = banner.trim();
                });
                setBanner('');
                onToast('Banner teks disimpan');
              }}
            >
              Simpan Teks
            </button>
            <label className="btn ghost sm" style={{ cursor: 'pointer' }}>
              Unggah Gambar Banner
              <input type="file" accept="image/*" hidden onChange={file('bannerImg', 1400)} />
            </label>
            {S.bannerImg ? (
              <>
                <img src={S.bannerImg} alt="Banner" style={{ width: '100%', borderRadius: 10 }} />
                <button
                  className="btn danger sm"
                  onClick={() =>
                    update((d) => {
                      d.bannerImg = '';
                    })
                  }
                >
                  Hapus Gambar
                </button>
              </>
            ) : null}
          </div>
        </section>

        <section className="admin-card">
          <h2>Logo</h2>
          <div className="form-grid">
            {[
              ['logo', 'Logo Beranda'],
              ['logoDark', 'Logo Tema Gelap'],
              ['loginLogo', 'Logo Halaman Masuk'],
              ['loginLogoDark', 'Logo Masuk Tema Gelap'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="tiny muted">{label}</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 92, height: 46, borderRadius: 8, background: 'var(--cd)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                    {S[key] ? <img src={S[key]} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <span className="tiny muted">kosong</span>}
                  </div>
                  <label className="btn ghost sm" style={{ cursor: 'pointer' }}>
                    Unggah
                    <input type="file" accept="image/*" hidden onChange={file(key, 660)} />
                  </label>
                  {S[key] ? (
                    <button
                      className="btn danger sm"
                      onClick={() =>
                        update((d) => {
                          d[key] = '';
                        })
                      }
                    >
                      Hapus
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <h2>Logo Pembayaran</h2>
          <div className="form-grid">
            {['QRIS', 'BCA', 'BRI', 'MANDIRI'].map((b) => (
              <div key={b} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 92, height: 46, borderRadius: 8, border: '1px solid var(--bd)', display: 'grid', placeItems: 'center', overflow: 'hidden', fontWeight: 700 }}>
                  {S.pay?.[b] ? <img src={S.pay[b]} alt={b} style={{ maxWidth: '100%', maxHeight: '100%' }} /> : b}
                </div>
                <label className="btn ghost sm" style={{ cursor: 'pointer' }}>
                  Unggah
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        const data = await compressImage(f, 480, 0.85);
                        update((d) => {
                          d.pay = { ...(d.pay || {}), [b]: data };
                        });
                        onToast('Logo pembayaran diperbarui');
                      } catch {
                        onToast('Gagal membaca gambar');
                      }
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <h2>Promo Kreator</h2>
          <div className="form-grid" style={{ marginBottom: 12 }}>
            <input value={promo.name} onChange={(e) => setPromo((v) => ({ ...v, name: e.target.value }))} placeholder="Nama kreator" />
            <input value={promo.code} maxLength={6} onChange={(e) => setPromo((v) => ({ ...v, code: e.target.value.replace(/\D/g, '') }))} placeholder="Kode 6 digit" />
            <input value={promo.bank} onChange={(e) => setPromo((v) => ({ ...v, bank: e.target.value }))} placeholder="Bank & rekening kreator" />
            <button
              className="btn sm"
              onClick={() => {
                if (!promo.name || !/^\d{6}$/.test(promo.code)) {
                  onToast('Nama wajib & kode 6 digit angka');
                  return;
                }
                update((d) => {
                  d.promos.unshift({ ...promo, on: 1 });
                });
                setPromo({ name: '', code: '', bank: '' });
                onToast('Promo ditambahkan');
              }}
            >
              Tambah Promo
            </button>
          </div>
          {S.promos.map((x, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--bd)' }}>
              <div style={{ flex: 1 }}>
                <b>{x.name}</b> <code>{x.code}</code>
                <div className="muted tiny">{x.bank}</div>
              </div>
              <input
                type="checkbox"
                checked={Boolean(x.on)}
                style={{ width: 20 }}
                onChange={(e) =>
                  update((d) => {
                    d.promos[i].on = e.target.checked ? 1 : 0;
                  })
                }
              />
              <button
                className="btn danger sm"
                onClick={() =>
                  update((d) => {
                    d.promos.splice(i, 1);
                  })
                }
              >
                Hapus
              </button>
            </div>
          ))}
          {S.promos.length === 0 ? <p className="muted tiny">Belum ada promo.</p> : null}
        </section>
      </div>
    </>
  );
}

function Akun({ S, onToast }) {
  const [form, setForm] = useState({ e: DEMO.e, p: '', p2: '' });
  const bytes = useMemo(() => {
    try {
      return localStorage.getItem('kedinasan_v2')?.length || 0;
    } catch {
      return 0;
    }
  }, [S]);

  return (
    <div className="admin-grid">
      <section className="admin-card">
        <h2>Akun Operator</h2>
        <div className="form-grid">
          <label>
            Email
            <input value={form.e} onChange={(e) => setForm((v) => ({ ...v, e: e.target.value }))} />
          </label>
          <label>
            Kunci baru
            <input type="password" value={form.p} onChange={(e) => setForm((v) => ({ ...v, p: e.target.value }))} />
          </label>
          <label>
            Konfirmasi kunci baru
            <input type="password" value={form.p2} onChange={(e) => setForm((v) => ({ ...v, p2: e.target.value }))} />
          </label>
          <button
            className="btn sm"
            onClick={async () => {
              if (form.p.length < 6 || form.p !== form.p2) {
                onToast('Kunci minimal 6 digit dan harus sama');
                return;
              }
              const hashed = await hashPassword(form.p);
              update((d) => {
                const u = d.users.find((x) => x.e === DEMO.e);
                if (u) {
                  u.e = form.e.trim().toLowerCase();
                  u.p = hashed;
                } else {
                  d.users.push({ n: DEMO.n, e: form.e.trim().toLowerCase(), v: 1, pic: '', p: hashed, j: new Date().toISOString() });
                }
              });
              setForm((v) => ({ ...v, p: '', p2: '' }));
              onToast('Akun operator diperbarui');
            }}
          >
            Simpan Akun
          </button>
        </div>
      </section>

      <section className="admin-card">
        <h2>Info Penyimpanan</h2>
        <p className="muted tiny" style={{ lineHeight: 1.7 }}>
          Semua data tersimpan di localStorage browser ini (key <code>kedinasan_v2</code>) sekitar{' '}
          {(bytes / 1024).toFixed(0)} KB. Supabase belum terhubung pada versi Next.js baru — sinkronisasi
          server bisa ditambahkan berikutnya.
        </p>
        <p className="muted tiny">
          Akun demo tetap: <b>{DEMO.e}</b> / <b>{DEMO.p}</b> (selama belum diubah).
        </p>
      </section>
    </div>
  );
}
