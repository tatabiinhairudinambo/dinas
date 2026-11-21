/**
 * Tab Pembayaran — logo metode bayar + metode tambahan (mis. BNI/BTN).
 *
 * State legacy: S.pay[k] berisi data URL gambar, S.payList daftar metode
 * [{k,n}], dan S.payAcc[k] = { no, name } nomor rekening bank. Tambahan
 * metode masih data admin (halaman siswa memakai empat metode bawaan), tetapi
 * nomor rekening dibaca layar transfer siswa (rev76 di archive/original.html).
 */
import { useState } from 'react';
import { Badge, Field, Panel } from '../ui.jsx';
import { useCmsState } from '../../lib/cmsData.js';
import { uploadDataUrl } from '../../lib/assets.js';
import { makeLogo } from '../thumb.js';

const DEFAULT_METHODS = [
  { k: 'QRIS', n: 'QRIS' },
  { k: 'BCA', n: 'Bank Central Asia (BCA)' },
  { k: 'BRI', n: 'Bank Rakyat Indonesia (BRI)' },
  { k: 'MANDIRI', n: 'Bank Mandiri' },
];

const isDefault = (k) => DEFAULT_METHODS.some((m) => m.k === k);

/**
 * Logo bawaan (public/pay/*.svg). Dipasang sekali oleh bridge-override supaya
 * halaman bayar siswa tidak kosong; di sini hanya dipakai untuk tombol
 * "Logo bawaan" saat operator sudah mengganti/menghapusnya.
 */
const DEFAULT_LOGOS = {
  QRIS: '/pay/qris.svg',
  BCA: '/pay/bca.svg',
  BRI: '/pay/bri.svg',
  MANDIRI: '/pay/mandiri.svg',
};

function methodsFrom(S) {
  const stored = Array.isArray(S?.payList) ? S.payList.filter((m) => m && m.k) : [];
  const base = stored.length
    ? stored.map((m) => ({ k: String(m.k), n: String(m.n || m.k) }))
    : DEFAULT_METHODS;
  return base.map((m) => ({
    k: m.k,
    n: m.n,
    img: S?.pay?.[m.k] || '',
    no: String(S?.payAcc?.[m.k]?.no || ''),
    name: String(S?.payAcc?.[m.k]?.name || ''),
  }));
}

function keyFor(items) {
  const used = new Set(items.map((m) => m.k));
  let i = 1;
  while (used.has(`METODE${i}`)) i += 1;
  return `METODE${i}`;
}

export default function Payment() {
  const { S, mutate } = useCmsState();
  const [items, setItems] = useState(() => methodsFrom(S));
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  if (!S) return null;

  const stored = methodsFrom(S);
  const dirty =
    items.length !== stored.length ||
    items.some(
      (m, i) =>
        m.k !== stored[i].k ||
        m.n !== stored[i].n ||
        m.img !== stored[i].img ||
        m.no !== stored[i].no ||
        m.name !== stored[i].name,
    );

  const patch = (k, next) => {
    setItems((current) => current.map((m) => (m.k === k ? { ...m, ...next } : m)));
    setNotice('');
  };

  const add = () => {
    setItems((current) => [...current, { k: keyFor(current), n: '', img: '', no: '', name: '' }]);
    setNotice('');
    setError('');
  };

  const remove = (k) => {
    if (items.length <= 1) return;
    setItems((current) => current.filter((m) => m.k !== k));
    setNotice('');
  };

  const save = () => {
    const names = items.map((m) => m.n.trim());
    if (names.some((n) => !n)) {
      setError('Nama setiap metode pembayaran wajib diisi.');
      return;
    }
    if (new Set(names.map((n) => n.toLowerCase())).size !== names.length) {
      setError('Nama metode pembayaran tidak boleh sama.');
      return;
    }
    const lone = items.find((m) => m.k !== 'QRIS' && m.name.trim() && !m.no.trim());
    if (lone) {
      setError(`Nomor rekening ${lone.n || lone.k} masih kosong.`);
      return;
    }
    const short = items.find((m) => m.no.trim() && m.no.replace(/\D/g, '').length < 5);
    if (short) {
      setError(`Nomor rekening ${short.n || short.k} minimal 5 digit.`);
      return;
    }
    const nums = items.map((m) => m.no.replace(/\D/g, '')).filter(Boolean);
    if (new Set(nums).size !== nums.length) {
      setError('Ada nomor rekening yang dipakai dua metode.');
      return;
    }
    const cleaned = items.map((m, i) => ({
      ...m,
      n: names[i],
      no: m.no.trim(),
      name: m.name.trim(),
    }));
    mutate((state) => {
      state.pay = {};
      cleaned.forEach((m) => {
        if (m.img) state.pay[m.k] = m.img;
      });
      state.payList = cleaned.map((m) => ({ k: m.k, n: m.n }));
      const acc = {};
      cleaned.forEach((m) => {
        if (m.no) acc[m.k] = { no: m.no, name: m.name };
      });
      state.payAcc = acc;
    });
    setItems(cleaned);
    setError('');
    setNotice('Metode pembayaran dan nomor rekening disimpan.');
  };

  const upload = async (bank, file) => {
    if (!file) return;
    setBusy(bank);
    setError('');
    try {
      const data = await makeLogo(file, 2, 480);
      const { url, mode } = await uploadDataUrl(data, 'pembayaran');
      patch(bank, { img: url });
      if (mode === 'local') setNotice('Logo disimpan lokal — login Supabase agar masuk Storage.');
    } catch (err) {
      setError(`Gambar gagal diunggah. ${String(err?.message || err).slice(0, 120)}`);
    } finally {
      setBusy('');
    }
  };

  return (
    <Panel
      title="Metode pembayaran"
      hint="Rasio 2:1 (mis. 240×120). Nomor rekening tiap bank tampil di layar transfer siswa (menggantikan placeholder VA); metode tambahan masih tersimpan sebagai data admin."
      actions={
        <>
          {dirty ? <Badge tone="warn">Belum disimpan</Badge> : <Badge tone="ok">Tersimpan</Badge>}
          <button
            type="button"
            className="cms-btn is-ghost"
            disabled={!dirty}
            onClick={() => {
              setItems(methodsFrom(S));
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
        {items.map((m) => {
          const custom = !isDefault(m.k);
          return (
            <Field
              key={m.k}
              label={custom ? 'Metode tambahan' : m.n}
              hint="Kosongkan gambar untuk memakai teks nama metode saja."
            >
              <div className="cms-logo-row">
                <div className="cms-logo-preview is-pay">
                  {m.img ? <img src={m.img} alt="" /> : <span>{m.n || 'Belum ada'}</span>}
                </div>
                <div className="cms-thumb-actions">
                  {custom ? (
                    <input
                      className="cms-input"
                      placeholder="Nama metode (mis. BNI)"
                      value={m.n}
                      onChange={(e) => patch(m.k, { n: e.target.value })}
                    />
                  ) : null}
                  <label className="cms-btn is-ghost">
                    {busy === m.k ? 'Memproses…' : m.img ? 'Ganti logo' : 'Unggah logo'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        upload(m.k, e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {m.img ? (
                    <button type="button" className="cms-btn is-ghost" onClick={() => patch(m.k, { img: '' })}>
                      Hapus logo
                    </button>
                  ) : null}
                  {isDefault(m.k) && m.img !== DEFAULT_LOGOS[m.k] ? (
                    <button
                      type="button"
                      className="cms-btn is-ghost"
                      onClick={() => patch(m.k, { img: DEFAULT_LOGOS[m.k] })}
                    >
                      Logo bawaan
                    </button>
                  ) : null}
                  {custom ? (
                    <button
                      type="button"
                      className="cms-btn is-ghost"
                      disabled={items.length <= 1}
                      onClick={() => remove(m.k)}
                    >
                      Hapus metode
                    </button>
                  ) : null}
                </div>
              </div>
              {m.k !== 'QRIS' ? (
                <div className="cms-form-grid">
                  <div className="cms-field">
                    <span className="cms-field-label">Nomor rekening</span>
                    <input
                      id={`pay-no-${m.k}`}
                      className="cms-input"
                      inputMode="numeric"
                      value={m.no}
                      placeholder="mis. 1234567890"
                      onChange={(e) => patch(m.k, { no: e.target.value })}
                    />
                  </div>
                  <div className="cms-field">
                    <span className="cms-field-label">Atas nama</span>
                    <input
                      id={`pay-name-${m.k}`}
                      className="cms-input"
                      value={m.name}
                      placeholder="Nama pemilik rekening"
                      onChange={(e) => patch(m.k, { name: e.target.value })}
                    />
                  </div>
                </div>
              ) : null}
            </Field>
          );
        })}

        <div>
          <button type="button" className="cms-btn is-ghost" onClick={add}>
            + Tambah metode pembayaran
          </button>
        </div>
      </div>
    </Panel>
  );
}
