/**
 * Tab Banner — unggah foto spanduk pengumuman di beranda siswa.
 *
 * Mesin legacy menyimpan dua field di state yang sama:
 *   S.banner    teks spanduk
 *   S.bannerImg gambar (data URL/base64) sebagai latar .ban di home()
 * Panel ini sengaja hanya mengurus foto: teks tidak lagi diedit, dan saat
 * disimpan S.banner dikosongkan sekali supaya beranda murni menampilkan foto.
 * Tetap memakai save() legacy supaya ikut tersinkron.
 */
import { useState } from 'react';
import { Badge, Field, Panel } from '../ui.jsx';
import { useCmsState } from '../../lib/cmsData.js';
import { uploadDataUrl } from '../../lib/assets.js';
import { makeBanner } from '../thumb.js';

export default function Banner() {
  const { S, mutate } = useCmsState();
  const [img, setImg] = useState(() => S?.bannerImg || '');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!S) return <div className="cms-loading">Menunggu data…</div>;

  const storedImg = S.bannerImg || '';
  const storedText = S.banner || '';
  const dirty = img !== storedImg || storedText !== '';

  const save = () => {
    mutate((state) => {
      state.bannerImg = img;
      state.banner = '';
    });
    setError('');
    setNotice('Foto banner disimpan.');
  };

  const clear = () => {
    if (!window.confirm('Kosongkan foto banner beranda?')) return;
    setImg('');
    mutate((state) => {
      state.bannerImg = '';
      state.banner = '';
    });
    setError('');
    setNotice('Banner dikosongkan.');
  };

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const data = await makeBanner(file);
      const { url, mode } = await uploadDataUrl(data, 'banner');
      setImg(url);
      if (mode === 'local') setNotice('Foto disimpan lokal — login Supabase agar masuk Storage.');
    } catch (err) {
      setError(`Gambar gagal diunggah. ${String(err?.message || err).slice(0, 120)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel
      title="Banner beranda"
      hint="Spanduk di bawah sapaan siswa, berupa satu foto. Teks banner lama ikut dikosongkan saat Simpan."
      actions={
        <>
          {dirty ? <Badge tone="warn">Belum disimpan</Badge> : <Badge tone="ok">Tersimpan</Badge>}
          <button
            type="button"
            className="cms-btn is-ghost"
            disabled={!dirty}
            onClick={() => {
              setImg(storedImg);
              setError('');
              setNotice('');
            }}
          >
            Batalkan
          </button>
          <button type="button" className="cms-btn is-ghost" onClick={clear} disabled={busy}>
            Kosongkan
          </button>
          <button type="button" className="cms-btn is-primary" onClick={save} disabled={busy}>
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
        <div className="cms-banner-preview" style={img ? { backgroundImage: `url(${img})` } : undefined}>
          {img ? null : <span className="cms-banner-empty">Belum ada foto banner</span>}
        </div>

        <Field label="Foto banner" hint="Rasio 113:30 (mis. 904×240), JPG/PNG. Diperkecil otomatis saat diunggah.">
          <div className="cms-thumb-actions">
            <label className="cms-btn is-ghost">
              {busy ? 'Memproses…' : img ? 'Ganti foto' : 'Unggah foto'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  upload(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </label>
            {img ? (
              <button
                type="button"
                className="cms-btn is-ghost"
                onClick={() => {
                  setImg('');
                  setNotice('');
                }}
              >
                Hapus foto
              </button>
            ) : null}
          </div>
        </Field>

        <div className="cms-inline-note">
          <div>
            <strong>Tampil di beranda siswa</strong>
            <small>Foto menutupi seluruh banner. Teks banner tidak dipakai lagi.</small>
          </div>
          <a className="cms-btn is-ghost" href="/" target="_blank" rel="noreferrer">
            Lihat beranda
          </a>
        </div>
      </div>
    </Panel>
  );
}
