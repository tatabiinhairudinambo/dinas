'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, update } from '@/src/lib/store.js';
import { Empty, Modal, Sheet } from '@/src/components/AppShell.jsx';

export default function PaketPage() {
  const { data: S } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState('paket');
  const [mulai, setMulai] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    try {
      const msg = sessionStorage.getItem('kedinasan_flash');
      if (msg) {
        setFlash(msg);
        sessionStorage.removeItem('kedinasan_flash');
        setTimeout(() => setFlash(''), 5000);
      }
    } catch {}
    update((d) => {
      d.newPk = [];
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = Number(new URLSearchParams(window.location.search).get('mulai'));
    if (id) {
      const pkg = S.packages.find((p) => p.id === id);
      if (pkg && S.owned[id]) setMulai(pkg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const owned = S.packages.filter((p) => S.owned[p.id]);
  const results = useMemo(
    () => Object.values(S.res || {}).filter(Boolean).sort((a, b) => (b.ts || 0) - (a.ts || 0)),
    [S.res],
  );

  const startExam = (pkg, minutes) => {
    const now = Date.now();
    const duration = pkg.type === 'SKD' ? 110 : minutes;
    update((d) => {
      d.exam = {
        id: pkg.id,
        i: 0,
        ans: {},
        sk: {},
        sel: null,
        st: now,
        end: duration ? now + duration * 60000 : 0,
      };
    });
    setMulai(null);
    router.push(`/ujian/${pkg.id}`);
  };

  return (
    <>
      <div className="page-head">
        <h1>Daftar Paket</h1>
      </div>

      {flash ? <div className="notice" style={{ marginBottom: 14 }}>{flash}</div> : null}

      <div className="tabs" style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[
          ['paket', 'Paket Saya'],
          ['riwayat', 'Riwayat'],
        ].map(([k, label]) => (
          <button
            key={k}
            className={`btn sm ${tab === k ? '' : 'ghost'}`}
            style={{ flex: 1 }}
            onClick={() => setTab(k)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'paket' ? (
        <div className="pkg-list">
          {owned.map((p) => {
            const last = S.res[p.id];
            const inProgress = S.exam?.id === p.id;
            return (
              <article className="pkg-card" key={p.id}>
                <div className="pkg-thumb" style={p.thumb ? { backgroundImage: `url(${p.thumb})` } : undefined}>
                  {p.thumb ? null : <span>Kosong<small>120 × 80</small></span>}
                </div>
                <div className="pkg-body">
                  <h3>{p.name}</h3>
                  <p className="pkg-meta">
                    {p.type} • {p.qs?.length || 0} soal
                  </p>
                  {last ? <p className="pkg-score">Nilai terakhir: {last.tot}</p> : null}
                  <div className="pkg-actions">
                    {last ? (
                      <button className="btn ghost" onClick={() => router.push(`/hasil/${p.id}`)}>
                        Hasil
                      </button>
                    ) : null}
                    <button className="btn" onClick={() => (inProgress ? router.push(`/ujian/${p.id}`) : setMulai(p))}>
                      {inProgress ? 'Lanjutkan' : 'Mulai'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
          {owned.length === 0 ? <Empty>Belum ada paket. Beli dulu di Beranda.</Empty> : null}
        </div>
      ) : (
        <div className="card">
          {results.map((r, idx) => {
            const pkg = S.packages.find((p) => p.id === r.pkgId) || S.packages.find((p) => S.res[p.id] === r);
            return (
              <button
                key={idx}
                className="log-item"
                style={{ width: '100%', textAlign: 'left', background: 'none' }}
                onClick={() => pkg && router.push(`/hasil/${pkg.id}`)}
              >
                <b>{pkg?.name || 'Paket'}</b>
                <span>
                  Total {r.tot} poin • {r.ok ? 'Lulus' : 'Belum lulus'}
                  {r.ts ? ` • ${new Date(r.ts).toLocaleString('id-ID')}` : ''}
                </span>
              </button>
            );
          })}
          {results.length === 0 ? <Empty>Belum ada riwayat pengerjaan.</Empty> : null}
        </div>
      )}

      <Sheet open={Boolean(mulai)} onClose={() => setMulai(null)}>
        {mulai ? (
          <>
            <h3 style={{ marginTop: 0 }}>Pilih Mode Waktu</h3>
            <p className="muted tiny">
              {mulai.type === 'SKD'
                ? 'Try Out SKD memakai durasi penuh 110 menit.'
                : 'Hasil lama tetap tersimpan di riwayat.'}
            </p>
            <div className="stack" style={{ marginTop: 12 }}>
              {(mulai.type === 'SKD' ? [110] : [30, 40, 50, 0]).map((m) => (
                <button
                  key={m}
                  className="btn ghost"
                  onClick={() => setConfirm({ pkg: mulai, minutes: m })}
                >
                  {m ? `${m} menit` : 'Belajar tanpa waktu'}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </Sheet>

      <Modal open={Boolean(confirm)} onClose={() => setConfirm(null)} title="Mulai ujian?">
        {confirm ? (
          <>
            <p className="muted">
              {confirm.pkg.name} — {confirm.minutes ? `batas ${confirm.minutes} menit` : 'tanpa batas waktu'}.
              Waktu berjalan begitu kamu masuk.
            </p>
            <div className="stack">
              <button className="btn block" onClick={() => startExam(confirm.pkg, confirm.minutes)}>
                Mulai Sekarang
              </button>
              <button className="btn ghost block" onClick={() => setConfirm(null)}>
                Batal
              </button>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
}
