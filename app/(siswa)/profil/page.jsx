'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/src/lib/store.js';
import { logout } from '@/src/lib/auth.js';
import { Modal, Photo } from '@/src/components/AppShell.jsx';

export default function ProfilPage() {
  const { data: S } = useStore();
  const router = useRouter();
  const [keluar, setKeluar] = useState(false);
  const [op, setOp] = useState(false);

  useEffect(() => {
    try {
      setOp(sessionStorage.getItem('kedinasan_op') === '1');
    } catch {}
  }, []);

  const stats = useMemo(() => {
    const res = Object.values(S.res || {});
    return {
      owned: Object.keys(S.owned || {}).length,
      done: res.length,
      best: res.length ? Math.max(...res.map((r) => r.tot)) : '—',
    };
  }, [S.owned, S.res]);

  const joined = S.me?.j
    ? new Date(S.me.j).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const toggleTheme = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme === 'dark' || (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme = dark ? 'light' : 'dark';
    try {
      localStorage.setItem('kd_dark', dark ? '0' : '1');
    } catch {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kd_dark');
      if (saved === '1') document.documentElement.dataset.theme = 'dark';
      if (saved === '0') document.documentElement.dataset.theme = 'light';
    } catch {}
  }, []);

  return (
    <>
      <div className="profile-hero">
        <div className="profile-top">
          <Photo src={S.me?.pic} name={S.me?.n} className="pass-photo" />
          <div>
            <span className="badge-photo">PAS FOTO UJIAN</span>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 10 }}>
              Wajahmu tampil di kartu hasil Try Out. Ganti kapan saja lewat tombol Edit Foto.
            </p>
          </div>
        </div>
        <div className="profile-name">{S.me?.n}</div>
        <div className="profile-sub">{S.me?.e}</div>
        <div className="profile-join">Bergabung sejak {joined}</div>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <b>{stats.owned}</b>
          <span>Paket dimiliki</span>
        </div>
        <div className="stat">
          <b>{stats.done}</b>
          <span>Try Out selesai</span>
        </div>
        <div className="stat">
          <b>{stats.best}</b>
          <span>Nilai tertinggi</span>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 20 }}>
        <button className="btn ghost block" onClick={() => router.push('/profil/foto')}>
          Edit Foto
        </button>
        <button className="btn ghost block" onClick={() => router.push('/notifikasi')}>
          Notifikasi
        </button>
        <button className="btn ghost block" onClick={toggleTheme}>
          Ganti Tema Terang/Gelap
        </button>
        {op ? (
          <button className="btn dark block" onClick={() => router.push('/admin')}>
            Panel Admin
          </button>
        ) : null}
        <button className="btn outline block" style={{ marginTop: 10 }} onClick={() => setKeluar(true)}>
          Keluar
        </button>
      </div>

      <Modal open={keluar} onClose={() => setKeluar(false)} title="Yakin ingin keluar?">
        <p className="muted" style={{ lineHeight: 1.6 }}>
          Kamu akan kembali ke halaman masuk. Semua datamu tetap aman: akun, paket yang sudah dibeli,
          riwayat nilai, dan pas foto akan muncul lagi saat kamu masuk.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn ghost" style={{ flex: 1 }} onClick={() => setKeluar(false)}>
            Batal
          </button>
          <button
            className="btn"
            style={{ flex: 1 }}
            onClick={() => {
              setKeluar(false);
              logout();
              router.replace('/masuk');
            }}
          >
            Ya, Keluar
          </button>
        </div>
      </Modal>
    </>
  );
}
