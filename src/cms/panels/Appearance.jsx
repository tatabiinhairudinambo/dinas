/**
 * Tab Tampilan — banner beranda (lihat Banner.jsx) + logo aplikasi & halaman
 * login. Semua nilai adalah field state legacy:
 *   S.logo / S.logoDark            logo navbar (tema terang / gelap)
 *   S.loginLogo / S.loginLogoDark   logo di atas formulir masuk & daftar
 * Dulu hanya bisa diubah dengan mengetuk logo saat mode operator atau lewat
 * menu “Halaman Login” di Dapur Operator.
 */
import { useState } from 'react';
import { Badge, Field, Panel } from '../ui.jsx';
import { useCmsState } from '../../lib/cmsData.js';
import { uploadDataUrl } from '../../lib/assets.js';
import { makeLogo } from '../thumb.js';
import Banner from './Banner.jsx';

const SLOTS = [
  ['logo', 'Logo aplikasi · terang', 'Tampil di navbar beranda siswa (tema terang).'],
  ['logoDark', 'Logo aplikasi · gelap', 'Dipakai otomatis saat tema gelap aktif.'],
  ['loginLogo', 'Logo halaman login · terang', 'Tampil di atas formulir Masuk dan Daftar.'],
  ['loginLogoDark', 'Logo halaman login · gelap', 'Versi tema gelap untuk halaman login.'],
];

export default function Appearance() {
  return (
    <div className="cms-stack">
      <Banner />
      <LogoPanel />
    </div>
  );
}

function LogoPanel() {
  const { S, mutate } = useCmsState();
  const [draft, setDraft] = useState(() => draftFrom(S));
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  if (!S) return null;

  const dirty = SLOTS.some(([key]) => (draft[key] || '') !== (S[key] || ''));

  const save = () => {
    mutate((state) => {
      SLOTS.forEach(([key]) => {
        state[key] = draft[key] || '';
      });
    });
    setError('');
    setNotice('Logo disimpan.');
  };

  const upload = async (key, file) => {
    if (!file) return;
    setBusy(key);
    setError('');
    try {
      const data = await makeLogo(file);
      const { url, mode } = await uploadDataUrl(data, 'logo');
      setDraft((current) => ({ ...current, [key]: url }));
      if (mode === 'local') setNotice('Logo disimpan lokal — login Supabase agar masuk Storage.');
    } catch (err) {
      setError(`Gambar gagal diunggah. ${String(err?.message || err).slice(0, 120)}`);
    } finally {
      setBusy('');
    }
  };

  return (
    <Panel
      title="Logo"
      hint="Rasio 3,3:1 (mis. 660×200). Unggahan disimpan sebagai PNG agar transparansi tetap."
      actions={
        <>
          {dirty ? <Badge tone="warn">Belum disimpan</Badge> : <Badge tone="ok">Tersimpan</Badge>}
          <button
            type="button"
            className="cms-btn is-ghost"
            disabled={!dirty}
            onClick={() => {
              setDraft(draftFrom(S));
              setNotice('');
              setError('');
            }}
          >
            Batalkan
          </button>
          <button type="button" className="cms-btn is-primary" onClick={save} disabled={Boolean(busy)}>
            Simpan
          </button>
        </>
      }
    >
      {notice ? (
        <div className="cms-alert is-ok">
          {notice}{' '}
          <button type="button" className="cms-linklike" onClick={() => setNotice('')}>
            tutup
          </button>
        </div>
      ) : null}
      {error ? <div className="cms-alert is-danger">{error}</div> : null}

      <div className="cms-form">
        {SLOTS.map(([key, label, hint]) => {
          const value = draft[key] || '';
          const dark = key.endsWith('Dark');
          return (
            <Field key={key} label={label} hint={hint}>
              <div className="cms-logo-row">
                <div className={`cms-logo-preview${dark ? ' is-dark' : ''}`}>
                  {value ? <img src={value} alt="" /> : <span>Belum ada</span>}
                </div>
                <div className="cms-thumb-actions">
                  <label className="cms-btn is-ghost">
                    {busy === key ? 'Memproses…' : value ? 'Ganti logo' : 'Unggah logo'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        upload(key, e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {value ? (
                    <button
                      type="button"
                      className="cms-btn is-ghost"
                      onClick={() => {
                        setDraft({ ...draft, [key]: '' });
                        setNotice('');
                      }}
                    >
                      Hapus
                    </button>
                  ) : null}
                </div>
              </div>
            </Field>
          );
        })}
      </div>
    </Panel>
  );
}

function draftFrom(S) {
  const draft = {};
  SLOTS.forEach(([key]) => {
    draft[key] = S?.[key] || '';
  });
  return draft;
}
