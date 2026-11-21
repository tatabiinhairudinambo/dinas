/**
 * Tab Promo — daftar kreator + kode promo 6 digit.
 *
 * State legacy: S.promos = [{ name, code, bank, on }]. Dulu dikelola lewat layar
 * “Daftar Promo” di Dapur Operator. Kode dipakai halaman pembelian untuk
 * memotong harga (lihat promoCut/promoPrice di mesin legacy), jadi menambah atau
 * menonaktifkan di sini langsung berpengaruh ke siswa.
 */
import { useState } from 'react';
import { Badge, Drawer, Empty, Field, Panel } from '../ui.jsx';
import { useCmsState } from '../../lib/cmsData.js';

const blank = () => ({ name: '', code: '', bank: '' });

export default function Promo() {
  const { S, mutate } = useCmsState();
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  if (!S) return null;

  const promos = S.promos || [];

  const openCreate = () => {
    setDraft(blank());
    setError('');
    setNotice('');
  };

  const submit = () => {
    const name = draft.name.trim();
    const code = draft.code.trim();
    if (!name) return setError('Nama kreator wajib diisi.');
    if (!/^\d{6}$/.test(code)) return setError('Kode harus 6 digit angka.');
    if (promos.some((p) => String(p.code) === code)) return setError('Kode itu sudah dipakai promo lain.');

    mutate((state) => {
      state.promos = [{ name, code, bank: draft.bank.trim(), on: 1 }, ...(state.promos || [])];
    });
    setDraft(null);
    setError('');
    setNotice(`Promo ${code} ditambahkan.`);
  };

  const toggle = (code) => {
    mutate((state) => {
      const target = (state.promos || []).find((p) => String(p.code) === String(code));
      if (target) target.on = target.on ? 0 : 1;
    });
    setNotice(`Status promo ${code} diubah.`);
  };

  const remove = (promo) => {
    if (!window.confirm(`Hapus promo "${promo.name}" (${promo.code})?`)) return;
    mutate((state) => {
      state.promos = (state.promos || []).filter((p) => String(p.code) !== String(promo.code));
    });
    setNotice(`Promo ${promo.code} dihapus.`);
  };

  return (
    <>
      <Panel
        title={`${promos.length} promo`}
        hint="Kode 6 digit dipakai siswa saat membeli paket yang promo-nya aktif."
        actions={
          <button type="button" className="cms-btn is-primary" onClick={openCreate}>
            + Promo
          </button>
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

        {promos.length === 0 ? (
          <Empty title="Belum ada promo" hint="Klik “+ Promo” untuk menambah kreator dan kodenya." />
        ) : (
          <div className="cms-table-wrap">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Kreator</th>
                  <th>Kode</th>
                  <th>Bank / rekening</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {promos.map((p) => (
                  <tr key={p.code}>
                    <td>
                      <strong>{p.name}</strong>
                    </td>
                    <td>
                      <code className="cms-code">{p.code}</code>
                    </td>
                    <td>
                      <small className="cms-dim">{p.bank || '—'}</small>
                    </td>
                    <td>{p.on ? <Badge tone="ok">Aktif</Badge> : <Badge tone="neutral">Mati</Badge>}</td>
                    <td className="cms-cell-actions">
                      <button type="button" className="cms-btn is-ghost" onClick={() => toggle(p.code)}>
                        {p.on ? 'Matikan' : 'Aktifkan'}
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
        title="Promo baru"
        subtitle="Kode harus unik dan terdiri dari 6 digit angka."
        onClose={() => {
          setDraft(null);
          setError('');
        }}
        footer={
          draft ? (
            <>
              <button type="button" className="cms-btn is-ghost" onClick={() => setDraft(null)}>
                Batal
              </button>
              <button type="button" className="cms-btn is-primary" onClick={submit}>
                Simpan
              </button>
            </>
          ) : null
        }
      >
        {draft ? (
          <div className="cms-form">
            {error ? <div className="cms-alert is-danger">{error}</div> : null}

            <Field label="Nama kreator">
              <input
                id="pr-name"
                className="cms-input"
                value={draft.name}
                placeholder="mis. Kak Rina"
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>

            <div className="cms-form-grid">
              <Field label="Kode promo" hint="6 digit angka.">
                <input
                  id="pr-code"
                  className="cms-input"
                  inputMode="numeric"
                  maxLength={6}
                  value={draft.code}
                  placeholder="123456"
                  onChange={(e) => setDraft({ ...draft, code: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                />
              </Field>
              <Field label="Bank & rekening" hint="Tujuan pembagian komisi kreator (opsional).">
                <input
                  id="pr-bank"
                  className="cms-input"
                  value={draft.bank}
                  placeholder="mis. BCA 1234567890"
                  onChange={(e) => setDraft({ ...draft, bank: e.target.value })}
                />
              </Field>
            </div>

            <p className="cms-field-hint">
              Promo baru otomatis aktif. Ingat: potongan harga diambil dari “Nominal promo” pada paket, bukan dari sini.
            </p>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
