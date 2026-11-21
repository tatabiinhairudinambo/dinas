/**
 * Tab Akun Admin — kredensial gerbang panel CMS (/admin).
 *
 * Berbeda dari akun siswa, ini murni lokal: hash SHA-256 + salt di
 * localStorage['kedinasan_cms_gate'], tidak ikut snapshot Supabase.
 * Dipakai hanya untuk membuka panel di perangkat ini.
 *
 * Default demo: 1@gmail.com / 123456 (lihat DEMO_ADMIN di lib/cmsData.js).
 */
import { useEffect, useState } from 'react';
import { Badge, Field, Panel } from '../ui.jsx';
import {
  DEMO_ADMIN,
  checkGateLogin,
  ensureDefaultGate,
  gateRecord,
  resetGateToDemo,
  setGateKey,
} from '../../lib/cmsData.js';

const IS_PROD = process.env.NODE_ENV === 'production';

export default function Account() {
  const isProd = Boolean(IS_PROD);
  const [record, setRecord] = useState(() => gateRecord());
  const [email, setEmail] = useState(() => gateRecord()?.email || '');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  // Kalau localStorage dibersihkan tapi tab ini masih "terbuka", pasang demo lagi.
  useEffect(() => {
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
  }, [record]);

  const applyRecord = (rec, message) => {
    setRecord(rec);
    setEmail(rec.email);
    setCurrent('');
    setNext('');
    setRepeat('');
    setError('');
    setNotice(message);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    const mail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setError('Email admin tidak valid.');
      return;
    }
    if (!current) {
      setError('Masukkan kunci saat ini untuk konfirmasi.');
      return;
    }
    if (next && next.length < 6) {
      setError('Kunci baru minimal 6 digit.');
      return;
    }
    if (next && next !== repeat) {
      setError('Ulangi kunci baru belum sama.');
      return;
    }

    setBusy(true);
    try {
      const ok = await checkGateLogin(record?.email, current);
      if (!ok) {
        setError('Kunci saat ini salah.');
        return;
      }
      const rec = await setGateKey(mail, next || current, record?.name);
      applyRecord(rec, next ? 'Email dan kunci admin diperbarui.' : 'Email admin diperbarui.');
    } catch (err) {
      setError(String(err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  const resetDemo = async () => {
    if (!window.confirm(`Kembalikan akun admin ke bawaan demo (${DEMO_ADMIN.email} / ${DEMO_ADMIN.password})?`)) return;
    const rec = await resetGateToDemo();
    applyRecord(rec, 'Akun admin dikembalikan ke akun demo.');
  };

  const updated = record?.at ? new Date(record.at).toLocaleString('id-ID') : null;

  return (
    <>
      <Panel
        title="Akun admin panel"
        hint="Dipakai di layar masuk /admin. Disimpan lokal di perangkat ini sebagai hash, tidak ikut sinkron Supabase."
        actions={isProd ? null : record?.demo ? <Badge tone="warn">Akun demo</Badge> : <Badge tone="ok">Kustom</Badge>}
      >
        <form className="cms-form" onSubmit={submit}>
          {notice ? (
            <div className="cms-alert is-ok">
              {notice}{' '}
              <button type="button" className="cms-linklike" onClick={() => setNotice('')}>
                tutup
              </button>
            </div>
          ) : null}
          {error ? <div className="cms-alert is-danger">{error}</div> : null}

          <Field label="Email admin" hint="Dipakai bersama kunci saat membuka panel." wide>
            <input
              className="cms-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@contoh.com"
              autoComplete="username"
            />
          </Field>

          <Field label="Kunci saat ini" hint="Wajib diisi sebagai konfirmasi perubahan." wide>
            <input
              className="cms-input"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Kunci yang dipakai sekarang"
              autoComplete="current-password"
            />
          </Field>

          <div className="cms-form-grid">
            <Field label="Kunci baru" hint="Kosongkan kalau hanya ingin mengganti email.">
              <input
                className="cms-input"
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="Minimal 6 digit"
                autoComplete="new-password"
              />
            </Field>
            <Field label="Ulangi kunci baru">
              <input
                className="cms-input"
                type="password"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                placeholder="Ulangi kunci baru"
                autoComplete="new-password"
              />
            </Field>
          </div>

          <div className="cms-btn-row">
            <button type="submit" className="cms-btn is-primary" disabled={busy}>
              {busy ? 'Menyimpan…' : 'Simpan perubahan'}
            </button>
            {!isProd && (
              <button type="button" className="cms-btn is-ghost" onClick={resetDemo} disabled={busy}>
                Kembalikan akun demo
              </button>
            )}
          </div>

          <p className="cms-field-hint">
            {updated ? `Terakhir diubah ${updated}. ` : ''}
            Lupa kunci? Klik "Lupa kunci?" di layar masuk panel untuk kembali ke akun demo.
          </p>
        </form>
      </Panel>

      <Panel title="Batas keamanan (demo)" hint="Penting dipahami sebelum panel dipakai orang lain.">
        <div className="cms-form">
          <p className="cms-field-hint">
            Kredensial ini hanya mencegah orang iseng membuka /admin di perangkat yang sama. Nilainya tersimpan di
            localStorage dan bisa dibaca/diubah lewat DevTools. Untuk pengamanan nyata, gunakan role Supabase
            (<code>profiles.role = 'operator'</code>) dan aturan RLS di server.
          </p>
          {isProd ? (
            <Field
              label="Catatan produksi"
              hint="Panel /admin hanya terbuka untuk akun Supabase yang terdaftar di catalog_editors."
            />
          ) : (
            <Field label="Akun demo bawaan">
              <input className="cms-input" value={`${DEMO_ADMIN.email} / ${DEMO_ADMIN.password}`} readOnly />
            </Field>
          )}
        </div>
      </Panel>

      <ConnectionPanel />
    </>
  );
}

function readSync() {
  try {
    return window.HermesSync?.status?.() || { mode: 'local', signedIn: false };
  } catch {
    return { mode: 'local', signedIn: false };
  }
}

/**
 * Koneksi Supabase untuk unggah gambar + katalog bersama.
 *
 * Cukup diisi di sini sekali; sesi disimpan supabase-js di perangkat, jadi
 * operator tidak perlu login lewat aplikasi siswa. Kalau belum tersambung,
 * CMS tetap jalan tetapi gambar disimpan lokal (data URL) dan katalog tidak
 * dibagikan ke siswa.
 */
function ConnectionPanel() {
  const [sync, setSync] = useState(readSync);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setSync(readSync()), 2000);
    return () => clearInterval(timer);
  }, []);

  const connect = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    const mail = email.trim();
    if (!mail || !pass) {
      setError('Isi email dan kunci akun Supabase.');
      return;
    }
    setBusy(true);
    try {
      const res = await window.HermesSync?.connectForCms?.(mail, pass);
      if (!res?.ok) {
        setError(
          res?.reason === 'disabled'
            ? 'Supabase belum dikonfigurasi (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
            : `Gagal masuk Supabase: ${res?.message || 'kredensial ditolak'}`,
        );
        return;
      }
      setNotice('Tersambung. Memuat ulang panel…');
      setTimeout(() => window.location.reload(), 700);
    } catch (err) {
      setError(String(err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    setError('');
    setNotice('');
    setBusy(true);
    try {
      const res = await window.HermesSync?.catalog?.publish?.();
      if (res?.ok) setNotice('Katalog terkirim — siswa melihatnya saat membuka aplikasi.');
      else if (res?.reason === 'not-editor') setError('Akun ini belum terdaftar di catalog_editors.');
      else if (res?.reason === 'signed-out') setError('Hubungkan akun Supabase dulu.');
      else setError(`Gagal mengirim katalog: ${res?.message || 'coba lagi'}`);
    } finally {
      setBusy(false);
    }
  };

  const pull = async () => {
    setError('');
    setNotice('');
    setBusy(true);
    try {
      const res = await window.HermesSync?.catalog?.refresh?.();
      if (res?.applied) setNotice('Katalog terbaru dipasang.');
      else if (res?.found) setNotice('Katalog sudah yang terbaru.');
      else setNotice('Belum ada katalog di server.');
    } catch (err) {
      setError(String(err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async () => {
    if (!window.confirm('Putuskan sesi Supabase di perangkat ini?')) return;
    await window.HermesSync?.signOut?.();
    window.location.reload();
  };

  const local = sync.mode !== 'supabase';
  const signedIn = Boolean(sync.signedIn);
  const editor = Boolean(sync.catalogEditor);

  return (
    <Panel
      title="Koneksi Supabase (unggah gambar + katalog siswa)"
      hint="Cukup dari panel ini — tidak perlu login lewat aplikasi siswa. Sesi disimpan di perangkat."
      actions={
        local ? (
          <Badge tone="warn">Mode lokal</Badge>
        ) : signedIn ? (
          <Badge tone="ok">Tersambung</Badge>
        ) : (
          <Badge tone="warn">Belum tersambung</Badge>
        )
      }
    >
      <div className="cms-form">
        {notice ? (
          <div className="cms-alert is-ok">
            {notice}{' '}
            <button type="button" className="cms-linklike" onClick={() => setNotice('')}>
              tutup
            </button>
          </div>
        ) : null}
        {error ? <div className="cms-alert is-danger">{error}</div> : null}

        {local ? (
          <p className="cms-field-hint">
            Build ini tanpa <code>VITE_SUPABASE_URL</code> / <code>VITE_SUPABASE_ANON_KEY</code>, jadi gambar
            disimpan sebagai data URL lokal dan katalog tidak dibagikan. Isi env lalu build ulang.
          </p>
        ) : signedIn ? (
          <>
            <Field label="Akun Supabase" hint="Sesi aktif di perangkat ini.">
              <input className="cms-input" value={sync.email || '-'} readOnly />
            </Field>
            <p className="cms-field-hint">
              {editor
                ? 'Akun ini terdaftar sebagai editor: perubahan panel otomatis dikirim ke katalog bersama.'
                : 'Akun ini hanya bisa membaca katalog. Tambahkan emailnya ke catalog_editors agar bisa menerbitkan.'}
            </p>
            <div className="cms-btn-row">
              <button type="button" className="cms-btn is-primary" onClick={publish} disabled={busy || !editor}>
                Kirim katalog sekarang
              </button>
              <button type="button" className="cms-btn is-ghost" onClick={pull} disabled={busy}>
                Tarik katalog
              </button>
              <button type="button" className="cms-btn is-ghost" onClick={disconnect} disabled={busy}>
                Putuskan
              </button>
            </div>
            {sync.lastCatalog ? (
              <p className="cms-field-hint">
                Terakhir kirim katalog {new Date(sync.lastCatalog).toLocaleString('id-ID')}.
              </p>
            ) : null}
          </>
        ) : (
          <form className="cms-form" onSubmit={connect}>
            <p className="cms-field-hint">
              Masuk dengan akun Supabase operator. Setelah tersambung, gambar diunggah ke Storage dan produk
              otomatis dibagikan ke akun siswa.
            </p>
            <Field label="Email akun Supabase">
              <input
                className="cms-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@contoh.com"
                autoComplete="username"
              />
            </Field>
            <Field label="Kunci akun">
              <input
                className="cms-input"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Kunci akun Supabase"
                autoComplete="current-password"
              />
            </Field>
            <div className="cms-btn-row">
              <button type="submit" className="cms-btn is-primary" disabled={busy}>
                {busy ? 'Menyambungkan…' : 'Sambungkan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Panel>
  );
}
