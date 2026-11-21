/**
 * Panel CMS (desktop) di /admin.
 *
 * Sengaja terpisah dari shell siswa: mesin legacy tetap di-boot (disembunyikan)
 * hanya untuk memberi akses ke objek S, save(), dan helper seperti parseSoal().
 * CMS tidak menyimpan data sendiri — semua perubahan lewat save() legacy supaya
 * ikut tersinkron pada mode Supabase.
 */
import { Fragment, useCallback, useEffect, useState } from 'react';
import { bootLegacy } from '../lib/legacyBridge.js';
import { checkGateLogin, DEMO_ADMIN, ensureDefaultGate, gateRecord, resetGateToDemo, syncRole } from '../lib/cmsData.js';
import { Badge, Field } from './ui.jsx';
import Overview from './panels/Overview.jsx';
import Packages from './panels/Packages.jsx';
import Products from './panels/Products.jsx';
import Appearance from './panels/Appearance.jsx';
import Payment from './panels/Payment.jsx';
import Promo from './panels/Promo.jsx';
import Groups from './panels/Groups.jsx';
import Bank from './panels/Bank.jsx';
import Account from './panels/Account.jsx';
import '../styles/cms.css';

const IS_PROD = process.env.NODE_ENV === 'production';

const TABS = [
  { id: 'overview', label: 'Ringkasan', glyph: '▤', group: 'Isi aplikasi' },
  { id: 'packages', label: 'Paket', glyph: '▦', group: 'Isi aplikasi' },
  { id: 'products', label: 'Produk', glyph: '▩', group: 'Isi aplikasi' },
  { id: 'bank', label: 'Bank Soal', glyph: '✎', group: 'Isi aplikasi' },
  { id: 'appearance', label: 'Tampilan', glyph: '▣', group: 'Pengaturan' },
  { id: 'payment', label: 'Pembayaran', glyph: '◐', group: 'Pengaturan' },
  { id: 'promo', label: 'Promo', glyph: '◆', group: 'Pengaturan' },
  { id: 'groups', label: 'Grup', glyph: '☰', group: 'Pengaturan' },
  { id: 'account', label: 'Akun Admin', glyph: '⚙', group: 'Pengaturan' },
];

export default function CmsApp() {
  const [ready, setReady] = useState(Boolean(window.__legacy));
  const [bootError, setBootError] = useState(null);
  const [opened, setOpened] = useState(() => {
    const byRole = syncRole() === 'operator' || Boolean(window.HermesSync?.catalog?.isEditor?.());
    const byFlag = !IS_PROD && sessionStorage.getItem('cms_open') === '1';
    return byRole || byFlag;
  });
  const [tab, setTab] = useState('overview');
  const [bankTarget, setBankTarget] = useState(null);
  const [sync, setSync] = useState(() => readSync());

  useEffect(() => {
    document.body.classList.add('cms-active');
    return () => document.body.classList.remove('cms-active');
  }, []);

  useEffect(() => {
    if (ready) return undefined;
    let alive = true;
    bootLegacy()
      .then(() => alive && setReady(true))
      .catch((err) => alive && setBootError(String(err?.message || err)));
    return () => {
      alive = false;
    };
  }, [ready]);

  useEffect(() => {
    // Peran Supabase bisa datang belakangan, dan sessionStorage di sebagian
    // browser baru terisi beberapa ratus milidetik setelah dokumen mulai
    // (reload). Cek cepat di awal supaya gerbang tidak berkedip lalu tertahan.
    const unlocked = () => {
      if (syncRole() === 'operator' || Boolean(window.HermesSync?.catalog?.isEditor?.())) {
        if (!IS_PROD) sessionStorage.setItem('cms_open', '1');
        setOpened(true);
        return true;
      }
      if (!IS_PROD && sessionStorage.getItem('cms_open') === '1') {
        setOpened(true);
        return true;
      }
      return false;
    };

    unlocked();
    let quick = setInterval(() => {
      if (unlocked()) {
        clearInterval(quick);
        quick = null;
      }
    }, 250);
    const stopQuick = setTimeout(() => {
      if (quick) {
        clearInterval(quick);
        quick = null;
      }
    }, 5000);

    const timer = setInterval(() => {
      setSync(readSync());
      unlocked();
    }, 2000);
    return () => {
      clearInterval(timer);
      clearTimeout(stopQuick);
      if (quick) clearInterval(quick);
    };
  }, []);

  const openBank = useCallback((id) => {
    setBankTarget(id);
    setTab('bank');
  }, []);

  const active = TABS.find((t) => t.id === tab) || TABS[0];

  return (
    <div className="cms">
      {/* Engine legacy menimpa className #app/#m, jadi sembunyikan lewat pembungkus. */}
      <div className="cms-legacy-hosts" aria-hidden="true">
        <div id="app" />
        <div id="m" />
      </div>

      {!opened ? (
        <Gate onOpen={() => setOpened(true)} />
      ) : (
        <div className="cms-shell">
          <aside className="cms-side">
            <div className="cms-brand">
              <span className="cms-brand-mark">K</span>
              <div>
                <strong>Kedinasan</strong>
                <small>Panel Operator</small>
              </div>
            </div>

            <nav className="cms-nav">
              {TABS.map((t, i) => (
                <Fragment key={t.id}>
                  {t.group !== TABS[i - 1]?.group ? <div className="cms-nav-head">{t.group}</div> : null}
                  <button
                    type="button"
                    className={t.id === tab ? 'is-active' : ''}
                    onClick={() => setTab(t.id)}
                  >
                    <span className="cms-nav-glyph" aria-hidden="true">
                      {t.glyph}
                    </span>
                    {t.label}
                  </button>
                </Fragment>
              ))}
            </nav>

            <div className="cms-side-foot">
              <div className="cms-side-sync">
                <span className={`cms-dot${sync.signedIn ? ' is-on' : ''}`} />
                {sync.mode === 'supabase' ? (sync.signedIn ? 'Tersambung Supabase' : 'Supabase: belum masuk') : 'Mode lokal'}
              </div>
              {sync.lastSync ? <small>Terakhir kirim {new Date(sync.lastSync).toLocaleTimeString('id-ID')}</small> : null}
              {sync.signedIn ? (
                <small>Katalog: {sync.catalogEditor ? 'editor (otomatis dibagikan)' : 'hanya baca'}</small>
              ) : null}
              {sync.error ? (
                <small className="cms-side-err" title={String(sync.error)}>
                  Kirim gagal: {String(sync.error).slice(0, 60)}
                </small>
              ) : null}
              <a href="/" className="cms-link">
                ← Buka aplikasi siswa
              </a>
            </div>
          </aside>

          <main className="cms-main">
            <header className="cms-top">
              <div>
                <h1>{active.label}</h1>
                <p>{TAB_HINT[active.id]}</p>
              </div>
              <div className="cms-top-meta">
                {sync.enabled ? <Badge tone={sync.signedIn ? 'ok' : 'warn'}>{sync.signedIn ? 'Tersinkron' : 'Belum masuk'}</Badge> : <Badge>Lokal</Badge>}
              </div>
            </header>

            <div className="cms-body">
              {bootError ? (
                <div className="cms-alert is-danger">
                  Mesin legacy gagal dimuat: {bootError}. Muat ulang halaman setelah memperbaiki berkasnya.
                </div>
              ) : !ready ? (
                <div className="cms-loading">Menyiapkan data…</div>
              ) : tab === 'overview' ? (
                <Overview onOpenBank={openBank} />
              ) : tab === 'packages' ? (
                <Packages onOpenBank={openBank} />
              ) : tab === 'products' ? (
                <Products />
              ) : tab === 'appearance' ? (
                <Appearance />
              ) : tab === 'payment' ? (
                <Payment />
              ) : tab === 'promo' ? (
                <Promo />
              ) : tab === 'groups' ? (
                <Groups />
              ) : tab === 'account' ? (
                <Account />
              ) : (
                <Bank initialPackageId={bankTarget} />
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

const TAB_HINT = {
  overview: 'Kondisi isi aplikasi: paket, soal, penjualan, dan log terakhir.',
  packages: 'Kelola paket, harga, promo, dan status tayang. Semua perubahan langsung disimpan.',
  products: 'Kelola produk, harga, dan gambar. Gambar masuk Supabase Storage; isinya dibagikan ke akun siswa lewat katalog.',
  bank: 'Editor 110 soal SKD (30 TWK, 35 TIU, 45 TKP) beserta kunci dan bobotnya.',
  appearance: 'Banner beranda serta logo aplikasi dan halaman login.',
  payment: 'Logo metode bayar, nomor rekening tiap bank (tampil di layar transfer siswa), dan metode tambahan sebagai data admin.',
  promo: 'Kode promo 6 digit dari kreator; potongan mengikuti nominal promo pada paket.',
  groups: 'Grup peserta untuk pembagian paket gratis (amal).',
  account: 'Kredensial panel (lokal) + koneksi Supabase untuk unggah gambar dan katalog bersama.',
};

function readSync() {
  try {
    return window.HermesSync?.status?.() || { mode: 'local', signedIn: false, enabled: false, lastSync: null };
  } catch {
    return { mode: 'local', signedIn: false, enabled: false, lastSync: null };
  }
}

/* ------------------------------------------------------------------ gate -- */

function Gate({ onOpen }) {
  const isProd = Boolean(IS_PROD);
  const [record, setRecord] = useState(() => (isProd ? null : gateRecord()));
  const [prodState, setProdState] = useState(isProd ? 'checking' : null);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Perangkat baru / localStorage dibersihkan: pasang akun demo otomatis.
  useEffect(() => {
    if (isProd) {
      sessionStorage.removeItem('cms_open');
      return undefined;
    }
    if (record) return undefined;
    let alive = true;
    ensureDefaultGate().then((rec) => {
      if (!alive) return;
      setRecord(rec);
      setEmail(rec.email);
    });
    return () => {
      alive = false;
    };
  }, [isProd, record]);

  // Produksi: /admin hanya untuk user Supabase yang lolos pengecekan editor
  // (cek ke server via catalog_editors). Tidak ada fallback demo.
  useEffect(() => {
    if (!isProd) return undefined;
    const check = async () => {
      const bridge = window.HermesSync;
      if (!bridge?.enabled) {
        setProdState('blocked-no-supabase');
        return;
      }
      // Editor dicentang oleh checkCatalogEditor() di prepareSync; poll sampai
      // editor diketahui (lihat is_catalog_editor), lalu buka panel.
      for (let i = 0; i < 40; i++) {
        const editor = bridge.catalog?.isEditor?.();
        if (typeof editor === 'boolean') {
          setProdState(editor ? 'ok' : 'blocked-not-editor');
          return;
        }
        await new Promise((r) => setTimeout(r, 300));
      }
      setProdState('blocked-not-editor');
    };
    void check();
  }, [isProd]);

  useEffect(() => {
    if (isProd && prodState === 'ok') onOpen();
  }, [isProd, prodState, onOpen]);

  if (isProd) {
    if (prodState === 'ok') return null; // sedang terbuka
    if (prodState === 'blocked-no-supabase')
      return (
        <div className="cms-gate">
          <form className="cms-gate-card">
            <h1>Akses Operator Ditutup</h1>
            <p className="cms-gate-note">
              Panel <code>/admin</code> hanya tersedia saat Supabase dikonfigurasi{' '}
              (<code>VITE_SUPABASE_URL</code> / <code>VITE_SUPABASE_ANON_KEY</code> di Vercel) dan
              akun yang dipakai terdaftar sebagai editor di{' '}
              <code>public.catalog_editors</code>.
            </p>
            <div className="cms-btn-row">
              <a className="cms-btn is-primary is-block" href="/">
                Buka aplikasi siswa
              </a>
            </div>
          </form>
        </div>
      );
    if (prodState === 'blocked-not-editor')
      return (
        <div className="cms-gate">
          <form className="cms-gate-card">
            <h1>Akses Operator Ditutup</h1>
            <p className="cms-gate-note">
              Akun Supabase ini belum terdaftar sebagai editor di{' '}
              <code>public.catalog_editors</code>. Hanya akun editor yang boleh membuka panel{' '}
              <code>/admin</code>. Tambahkan <code>user_id</code> akun (dari{' '}
              <code>auth.users</code>) via SQL lewat layanan Supabase.
            </p>
            <div className="cms-btn-row">
              <a className="cms-btn is-primary is-block" href="/">
                Buka aplikasi siswa
              </a>
            </div>
          </form>
        </div>
      );
    return null; // 'checking' — tunggu hasil pengecekan
  }

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Email admin belum diisi.');
      return;
    }
    if (!pass) {
      setError('Kunci panel belum diisi.');
      return;
    }
    setBusy(true);
    try {
      const ok = await checkGateLogin(email, pass);
      if (!ok) {
        setError('Email atau kunci salah.');
        return;
      }
      sessionStorage.setItem('cms_open', '1');
      onOpen();
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    if (!window.confirm(`Kembalikan akun admin ke bawaan demo (${DEMO_ADMIN.email} / ${DEMO_ADMIN.password})?`)) return;
    const rec = await resetGateToDemo();
    setRecord(rec);
    setEmail(rec.email);
    setPass('');
    setError('');
  };

  return (
    <div className="cms-gate">
      <form className="cms-gate-card" onSubmit={submit}>
        <div className="cms-brand">
          <span className="cms-brand-mark">K</span>
          <div>
            <strong>Kedinasan</strong>
            <small>Panel Operator</small>
          </div>
        </div>

        <h1>Masuk panel</h1>
        <p className="cms-gate-note">
          Kredensial admin disimpan di perangkat ini (bukan akun siswa dan tidak ikut sinkron Supabase).
        </p>

        <Field label="Email admin">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@contoh.com"
            autoComplete="username"
            autoFocus
          />
        </Field>

        <Field label="Kunci panel">
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Kunci admin"
            autoComplete="current-password"
          />
        </Field>

        {error ? <div className="cms-alert is-danger">{error}</div> : null}

        <button type="submit" className="cms-btn is-primary is-block" disabled={busy}>
          {busy ? 'Memeriksa…' : 'Masuk panel'}
        </button>

        <p className="cms-gate-foot">
          Saat role Supabase aktif (<code>profiles.role = 'operator'</code>), gate ini dilewati otomatis.{' '}
          <button type="button" className="cms-linklike" onClick={forgot}>
            Lupa kunci?
          </button>
        </p>
      </form>
    </div>
  );
}
