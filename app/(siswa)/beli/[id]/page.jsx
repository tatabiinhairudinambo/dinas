'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/src/lib/store.js';
import { fmtRp } from '@/src/lib/model.js';
import { Back, Sheet } from '@/src/components/AppShell.jsx';

export default function BeliPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: S } = useStore();
  const pkg = S.packages.find((p) => String(p.id) === String(id));
  const [code, setCode] = useState('');
  const [promo, setPromo] = useState(null);
  const [msg, setMsg] = useState('');
  const [bayar, setBayar] = useState(false);

  useEffect(() => {
    if (pkg && S.owned[pkg.id]) router.replace('/paket');
  }, [pkg, S.owned, router]);

  if (!pkg) {
    return (
      <>
        <div className="page-head">
          <Back href="/" />
          <h1>Paket tidak ditemukan</h1>
        </div>
      </>
    );
  }

  const base = pkg.promo || pkg.price;
  const final = promo ? Math.round(base * 0.9) : base;

  const cekPromo = () => {
    const c = code.trim();
    const found = S.promos.find((x) => x.code === c && x.on);
    setPromo(found || null);
    setMsg(found ? `✔ Promo ${found.name} aktif (diskon 10%)` : 'Kode promo tidak valid / nonaktif');
  };

  return (
    <>
      <div className="page-head">
        <Back href="/" />
        <h1>Beli Paket</h1>
      </div>

      <div className="card">
        <h2 style={{ margin: 0 }}>{pkg.name}</h2>
        <p className="muted tiny" style={{ marginTop: 6 }}>
          {pkg.type} • {pkg.qs?.length || 0} soal
        </p>
        <p className={pkg.desc ? '' : 'muted'} style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {pkg.desc || 'Kosong'}
        </p>
        <div className="price-line">
          HARGA: {fmtRp(final)}{' '}
          {promo ? (
            <span className="muted" style={{ fontSize: 13, fontWeight: 400 }}>
              (hemat {fmtRp(base - final)})
            </span>
          ) : null}
        </div>
        <div className="promo-row">
          <input
            value={code}
            maxLength={6}
            placeholder="KODE PROMO"
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="btn yellow sm" onClick={cekPromo} style={{ flex: 'none' }}>
            CEK
          </button>
        </div>
        {msg ? (
          <p className={promo ? 'ok tiny' : 'err tiny'} style={{ margin: '8px 2px' }}>
            {msg}
          </p>
        ) : null}
        <button className="btn block" style={{ marginTop: 16 }} onClick={() => setBayar(true)}>
          BELI PAKET
        </button>
      </div>

      <Sheet open={bayar} onClose={() => setBayar(false)}>
        <h3 style={{ marginTop: 0 }}>Pilih Pembayaran</h3>
        <div className="pay-method">
          {['QRIS', 'BCA', 'BRI', 'MANDIRI'].map((b) => (
            <button
              key={b}
              onClick={() =>
                router.push(
                  `/bayar/${pkg.id}?m=${b}${promo ? `&promo=${promo.code}` : ''}`,
                )
              }
            >
              {b}
            </button>
          ))}
        </div>
      </Sheet>
    </>
  );
}
