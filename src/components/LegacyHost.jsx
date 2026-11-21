import { useEffect, useState } from 'react';
import { bootLegacy, getLegacyStatus, onLegacyStatus } from '../lib/legacyBridge.js';

/**
 * Pemilik dua simpul DOM milik engine legacy:
 *   #app -> seluruh layar (auth, home, paket, exam, pembayaran, ...)
 *   #m   -> lapisan modal/sheet
 *
 * React tidak pernah merender anak dari kedua simpul ini, jadi aman kalau
 * legacy menimpa innerHTML-nya. Saat layar dipindah ke komponen React,
 * komponen itu dirender ke dalam #app (lihat docs/MIGRATION.md).
 */
export default function LegacyHost() {
  const [status, setStatus] = useState(getLegacyStatus);

  useEffect(() => onLegacyStatus(setStatus), []);

  useEffect(() => {
    bootLegacy().catch((err) => console.error('[WebKedinasan]', err));
  }, []);

  return (
    <>
      <div id="app" data-owner="legacy" />
      <div id="m" data-owner="legacy" />
      {status === 'error' && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 16,
            transform: 'translateX(-50%)',
            width: 'min(92vw, 420px)',
            padding: 12,
            borderRadius: 8,
            background: '#e11d48',
            color: '#fff',
            font: '13px system-ui, sans-serif',
            textAlign: 'center',
            zIndex: 99,
          }}
        >
          Mesin aplikasi gagal dimuat. Muat ulang halaman.
        </div>
      )}
    </>
  );
}
