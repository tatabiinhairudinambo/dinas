'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/src/lib/store.js';
import { Empty, PackageCard, Sheet } from '@/src/components/AppShell.jsx';

const LABEL = {
  SKD: 'Try Out SKD 110 Soal',
  TWK: 'Try Out TWK',
  TIU: 'Try Out TIU',
  TKP: 'Try Out TKP',
};
const RANGE = {
  SKD: 'Simulasi penuh nomor 1-110 (TWK 1-30, TIU 31-65, TKP 66-110)',
  TWK: '30 soal, nomor 1-30',
  TIU: '35 soal, nomor 31-65',
  TKP: '45 soal, nomor 66-110',
};

export default function KategoriPage() {
  const { type } = useParams();
  const router = useRouter();
  const { data: S } = useStore();
  const [desc, setDesc] = useState(null);
  const t = String(type || 'SKD').toUpperCase();

  const list = useMemo(
    () => S.packages.filter((p) => p.pub && !p.hidden && p.type === t),
    [S.packages, t],
  );

  return (
    <>
      <div className="page-head">
        <button className="back" onClick={() => router.push('/')} aria-label="Beranda">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1>{LABEL[t] || `Try Out ${t}`}</h1>
      </div>
      <p className="muted tiny" style={{ marginTop: -8, marginBottom: 16 }}>
        {RANGE[t] || ''}
      </p>
      <div className="pkg-list">
        {list.map((p) => (
          <PackageCard
            key={p.id}
            pkg={p}
            owned={Boolean(S.owned[p.id])}
            lastScore={S.res[p.id]?.tot}
            onDesc={setDesc}
            action={
              S.owned[p.id] ? (
                <button className="btn" onClick={() => router.push(`/paket?mulai=${p.id}`)}>
                  Mulai
                </button>
              ) : (
                <button className="btn yellow" onClick={() => router.push(`/beli/${p.id}`)}>
                  Beli
                </button>
              )
            }
          />
        ))}
        {list.length === 0 ? <Empty>Belum ada paket untuk kategori ini.</Empty> : null}
      </div>

      <Sheet open={Boolean(desc)} onClose={() => setDesc(null)}>
        {desc ? (
          <>
            <b>{desc.name}</b>
            <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{desc.desc || 'Kosong'}</p>
            {S.owned[desc.id] ? (
              <button className="btn block" onClick={() => router.push('/paket')}>
                Buka Daftar Paket
              </button>
            ) : (
              <button className="btn block" onClick={() => router.push(`/beli/${desc.id}`)}>
                Beli Paket
              </button>
            )}
          </>
        ) : null}
      </Sheet>
    </>
  );
}
