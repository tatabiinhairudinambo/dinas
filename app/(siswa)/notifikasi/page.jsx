'use client';

import { useStore } from '@/src/lib/store.js';
import { Back, Empty } from '@/src/components/AppShell.jsx';

export default function NotifikasiPage() {
  const { data: S } = useStore();
  const logs = S.logs || [];

  return (
    <>
      <div className="page-head">
        <Back href="/profil" label="Profil" />
        <h1>Notifikasi</h1>
      </div>
      <div className="card">
        {logs.map((l, i) => (
          <div className="log-item" key={i}>
            <b>{l.t}</b>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>{l.x}</div>
            <span>{l.d}</span>
          </div>
        ))}
        {logs.length === 0 ? <Empty>Belum ada log.</Empty> : null}
      </div>
    </>
  );
}
