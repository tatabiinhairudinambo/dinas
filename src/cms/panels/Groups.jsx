/**
 * Tab Grup — daftar grup peserta untuk fitur amal (paket gratis).
 *
 * State legacy: S.groups = [{ id, name, members: [{ name, user }] }] dan S.gseq
 * sebagai penghitung id. Dulu dikelola lewat layar “Daftar Grup” di Dapur
 * Operator. Saat grup dihapus, referensi grup di paket amal ikut dibersihkan
 * (sama seperti gDel63()).
 */
import { useState } from 'react';
import { Badge, Drawer, Empty, Field, Panel } from '../ui.jsx';
import { useCmsState } from '../../lib/cmsData.js';

const norm = (x) => String(x || '').trim().toLowerCase();

export default function Groups() {
  const { S, mutate } = useCmsState();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [openId, setOpenId] = useState(null);
  const [member, setMember] = useState({ name: '', user: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  if (!S) return null;

  const groups = S.groups || [];
  const selected = groups.find((g) => String(g.id) === String(openId)) || null;

  const addGroup = () => {
    const value = name.trim();
    if (!value) return setError('Nama grup wajib diisi.');
    if (groups.some((g) => norm(g.name) === norm(value))) return setError('Nama grup itu sudah ada.');

    let createdId = null;
    mutate((state) => {
      state.groups = state.groups || [];
      const id = Number(state.gseq) || Math.max(0, ...state.groups.map((g) => Number(g.id) || 0)) + 1;
      state.gseq = id + 1;
      state.groups.push({ id, name: value, members: [] });
      createdId = id;
    });
    setCreating(false);
    setName('');
    setError('');
    setOpenId(createdId);
    setNotice(`Grup ${value} dibuat.`);
  };

  const addMember = () => {
    if (!selected) return;
    const user = member.user.trim();
    if (!user) return setError('Username/email anggota wajib diisi.');
    if (selected.members.some((m) => norm(m.user) === norm(user))) {
      return setError('Username itu sudah ada di grup ini.');
    }

    mutate((state) => {
      const g = (state.groups || []).find((x) => String(x.id) === String(selected.id));
      if (g) g.members.push({ name: member.name.trim() || '-', user });
    });
    setMember({ name: '', user: '' });
    setError('');
  };

  const removeMember = (index) => {
    mutate((state) => {
      const g = (state.groups || []).find((x) => String(x.id) === String(selected.id));
      if (g) g.members.splice(index, 1);
    });
  };

  const removeGroup = (group) => {
    const used = (S.packages || []).filter((p) => (p.amal?.groups || []).includes(group.id));
    const warning = [
      `Hapus grup "${group.name}"?`,
      '',
      'Daftar anggotanya ikut hilang.',
      used.length ? `Grup ini dipakai di ${used.length} paket amal; referensinya dibersihkan.` : '',
    ]
      .filter(Boolean)
      .join('\n');
    if (!window.confirm(warning)) return;

    mutate((state) => {
      state.groups = (state.groups || []).filter((g) => String(g.id) !== String(group.id));
      (state.packages || []).forEach((p) => {
        if (p.amal?.groups) p.amal.groups = p.amal.groups.filter((id) => String(id) !== String(group.id));
      });
    });
    setOpenId(null);
    setNotice(`Grup ${group.name} dihapus.`);
  };

  return (
    <>
      <Panel
        title={`${groups.length} grup`}
        hint="Grup dipakai fitur amal: seluruh anggotanya bisa mendapat paket gratis."
        actions={
          <button
            type="button"
            className="cms-btn is-primary"
            onClick={() => {
              setCreating(true);
              setName('');
              setError('');
            }}
          >
            + Grup
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

        {groups.length === 0 ? (
          <Empty title="Belum ada grup" hint="Klik “+ Grup”, beri nama, lalu tambahkan anggotanya." />
        ) : (
          <div className="cms-table-wrap">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Grup</th>
                  <th>Anggota</th>
                  <th>Dipakai di</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => {
                  const used = (S.packages || []).filter((p) => (p.amal?.groups || []).includes(g.id)).length;
                  return (
                    <tr key={g.id}>
                      <td>
                        <button type="button" className="cms-cell-link" onClick={() => setOpenId(g.id)}>
                          {g.name}
                        </button>
                        <small className="cms-dim">#{g.id}</small>
                      </td>
                      <td>
                        <Badge tone="neutral">{g.members.length} orang</Badge>
                      </td>
                      <td>{used ? `${used} paket amal` : <span className="cms-dim">—</span>}</td>
                      <td className="cms-cell-actions">
                        <button type="button" className="cms-btn is-ghost" onClick={() => setOpenId(g.id)}>
                          Kelola
                        </button>
                        <button type="button" className="cms-btn is-ghost" onClick={() => removeGroup(g)}>
                          Hapus
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

      <Drawer
        open={creating}
        title="Grup baru"
        subtitle="Setelah grup dibuat, tambahkan anggotanya dari layar kelola."
        onClose={() => {
          setCreating(false);
          setError('');
        }}
        footer={
          <>
            <button type="button" className="cms-btn is-ghost" onClick={() => setCreating(false)}>
              Batal
            </button>
            <button type="button" className="cms-btn is-primary" onClick={addGroup}>
              Simpan
            </button>
          </>
        }
      >
        <div className="cms-form">
          {error ? <div className="cms-alert is-danger">{error}</div> : null}
          <Field label="Nama grup">
            <input
              id="grp-name"
              className="cms-input"
              value={name}
              placeholder="mis. Siswa Beasiswa"
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        </div>
      </Drawer>

      <Drawer
        open={Boolean(selected)}
        title={selected ? selected.name : ''}
        subtitle={selected ? `${selected.members.length} anggota` : ''}
        onClose={() => {
          setOpenId(null);
          setError('');
        }}
        footer={
          selected ? (
            <>
              <button type="button" className="cms-btn is-ghost" onClick={() => removeGroup(selected)}>
                Hapus grup
              </button>
              <button type="button" className="cms-btn" onClick={() => setOpenId(null)}>
                Tutup
              </button>
            </>
          ) : null
        }
      >
        {selected ? (
          <div className="cms-form">
            {error ? <div className="cms-alert is-danger">{error}</div> : null}

            {selected.members.length === 0 ? (
              <p className="cms-field-hint">Belum ada anggota. Tambahkan lewat form di bawah.</p>
            ) : (
              <ol className="cms-list">
                {selected.members.map((m, i) => (
                  <li key={`${m.user}-${i}`}>
                    <div>
                      <strong>{m.name || '-'}</strong>
                      <small>{m.user}</small>
                    </div>
                    <button type="button" className="cms-btn is-ghost" onClick={() => removeMember(i)}>
                      Hapus
                    </button>
                  </li>
                ))}
              </ol>
            )}

            <div className="cms-form-grid">
              <Field label="Nama anggota">
                <input
                  id="grp-mname"
                  className="cms-input"
                  value={member.name}
                  placeholder="Nama tampilan"
                  onChange={(e) => setMember({ ...member, name: e.target.value })}
                />
              </Field>
              <Field label="Username / email akun">
                <input
                  id="grp-muser"
                  className="cms-input"
                  value={member.user}
                  placeholder="mis. siswa@mail.com"
                  onChange={(e) => setMember({ ...member, user: e.target.value })}
                />
              </Field>
            </div>

            <button type="button" className="cms-btn is-primary" onClick={addMember}>
              + Tambah anggota
            </button>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
