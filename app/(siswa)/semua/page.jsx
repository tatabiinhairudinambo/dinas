'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/src/lib/store.js';
import { Back, Empty, PackageCard, Sheet } from '@/src/components/AppShell.jsx';

export default function SemuaPaketPage() {
  const { data: S } = useStore();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [desc, setDesc] = useState(null);

  const list = S.packages.filter(
    (p) => p.pub && !p.hidden && !S.owned[p.id] && p.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <div className="page-head">
        <Back href="/" label="Beranda" />
        <h1>Semua Paket</h1>
      </div>
      <input
        placeholder="Cari semua paket..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <div className="pkg-list">
        {list.map((p) => (
          <PackageCard
            key={p.id}
            pkg={p}
            onDesc={setDesc}
            action={
              <button className="btn yellow" onClick={() => router.push(`/beli/${p.id}`)}>
                Beli
              </button>
            }
          />
        ))}
        {list.length === 0 ? <Empty>Tidak ada paket yang cocok.</Empty> : null}
      </div>

      <Sheet open={Boolean(desc)} onClose={() => setDesc(null)}>
        {desc ? (
          <>
            <b>{desc.name}</b>
            <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{desc.desc || 'Kosong'}</p>
            <button className="btn block" onClick={() => router.push(`/beli/${desc.id}`)}>
              Beli Paket
            </button>
          </>
        ) : null}
      </Sheet>
    </>
  );
}
