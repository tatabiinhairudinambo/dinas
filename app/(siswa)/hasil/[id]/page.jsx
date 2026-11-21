'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/src/lib/store.js';
import { LETTERS, numOf, qType, TH } from '@/src/lib/model.js';
import { Back, Photo } from '@/src/components/AppShell.jsx';

export default function HasilPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: S } = useStore();
  const [detail, setDetail] = useState(false);
  const [open, setOpen] = useState({});

  const pkg = S.packages.find((p) => String(p.id) === String(id));
  const r = pkg ? S.res[pkg.id] : null;

  if (!pkg || !r) {
    return (
      <>
        <div className="page-head">
          <Back href="/paket" label="Daftar Paket" />
          <h1>Hasil belum ada</h1>
        </div>
        <p className="muted">Selesaikan ujian dulu untuk melihat hasil.</p>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <Back href="/paket" label="Daftar Paket" />
        <h1>Hasil Try Out</h1>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 16 }}>{pkg.name}</b>
            <p className="muted tiny" style={{ marginTop: 4 }}>
              {new Date(r.ts || Date.now()).toLocaleString('id-ID')}
            </p>
            <div style={{ marginTop: 10, lineHeight: 2 }}>
              {['TWK', 'TIU', 'TKP'].map((t) => (
                <div key={t} className="tiny">
                  <b>{t}</b>: {r.inc.includes(t) ? `${r.sc[t]} / min ${TH[t]}` : '—'}
                </div>
              ))}
              <div className="tiny">
                Total: <b>{r.tot}</b>
              </div>
            </div>
          </div>
          <Photo src={S.me?.pic} name={S.me?.n} className="pass-photo" />
        </div>

        <div className={`verdict ${r.ok ? 'ok' : 'no'}`}>{r.ok ? 'KAMU LULUS' : 'KAMU TIDAK LULUS'}</div>

        <div className="result-grid">
          <div className="stat">
            <b>{r.b}</b>
            <span>Terjawab</span>
          </div>
          <div className="stat">
            <b>{r.s}</b>
            <span>Salah</span>
          </div>
          <div className="stat">
            <b>{r.k}</b>
            <span>Kosong</span>
          </div>
        </div>

        <p className="notice" style={{ marginTop: 6 }}>
          {r.inc.map((t) => `${t}: ${r.sc[t]} poin`).join(' • ')}
        </p>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="btn yellow" style={{ flex: 1 }} onClick={() => setDetail(true)}>
            LIHAT HASIL
          </button>
          <button className="btn" style={{ flex: 1 }} onClick={() => router.push('/paket')}>
            SELANJUTNYA
          </button>
        </div>
      </div>

      {detail ? (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Rangkuman Jawaban</h2>
            <button className="btn sm ghost" onClick={() => setDetail(false)}>
              Tutup
            </button>
          </div>
          <p className="muted tiny" style={{ marginTop: 8 }}>
            Benar/terjawab: {r.b} • Salah: {r.s} • Kosong: {r.k}
          </p>
          {r.det.map((d) => {
            const q = pkg.qs[d.i];
            const t = qType(pkg, d.i);
            const on = open[d.i];
            return (
              <div className="detail-row" key={d.i}>
                <b>
                  {numOf(pkg, d.i)}. {q?.t}
                </b>
                <span className="muted tiny">
                  Status: {d.st}
                  {d.a != null ? ` • pilihanmu ${LETTERS[d.a]}` : ''}
                  {q?.a != null && t !== 'TKP' ? ` • kunci ${LETTERS[q.a]}` : ''}
                  {' '}
                </span>
                <button className="detail-toggle" onClick={() => setOpen((v) => ({ ...v, [d.i]: !on }))}>
                  {on ? 'Sembunyikan' : 'Lihat pembahasan'}
                </button>
                {on ? <div className="detail-answer">{q?.pem || '(Belum ada pembahasan)'}</div> : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
