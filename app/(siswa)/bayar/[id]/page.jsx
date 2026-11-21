'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, update } from '@/src/lib/store.js';
import { fmtRp } from '@/src/lib/model.js';
import { Back } from '@/src/components/AppShell.jsx';

const BANKS = {
  QRIS: 'QRIS',
  BCA: 'Bank BCA',
  BRI: 'Bank BRI',
  MANDIRI: 'Bank Mandiri',
};

export default function BayarPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: S } = useStore();
  const pkg = S.packages.find((p) => String(p.id) === String(id));
  const [params, setParams] = useState({ bank: 'QRIS', promo: '' });
  const [left, setLeft] = useState(15 * 60);
  const [copied, setCopied] = useState(false);
  const va = useMemo(() => '8800' + Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join(''), []);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const bank = q.get('m') || 'QRIS';
    setParams({ bank: BANKS[bank] ? bank : 'QRIS', promo: q.get('promo') || '' });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

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

  const promo = params.promo ? S.promos.find((x) => x.code === params.promo && x.on) : null;
  const base = pkg.promo || pkg.price;
  const final = promo ? Math.round(base * 0.9) : base;
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  const paid = () => {
    if (left <= 0) return;
    update((S2) => {
      S2.owned[pkg.id] = Date.now();
      S2.newPk = Array.from(new Set([...(S2.newPk || []), pkg.id]));
      S2.logs.unshift({
        t: 'beli',
        x: `${S2.me?.n || 'Siswa'} membeli ${pkg.name} via ${params.bank}${promo ? ` (promo ${promo.code})` : ''}`,
        d: new Date().toLocaleString('id-ID'),
      });
    });
    try {
      sessionStorage.setItem('kedinasan_flash', `Pembayaran diterima! ${pkg.name} sudah masuk Daftar Paket.`);
    } catch {}
    setToast('Pembayaran diterima!');
    router.replace('/paket');
  };

  const qrisImg = S.pay?.QRIS;

  return (
    <>
      <div className="page-head">
        <Back href={`/beli/${pkg.id}`} />
        <h1>{params.bank === 'QRIS' ? 'Pembayaran QRIS' : 'Virtual Account'}</h1>
      </div>

      <div className="card center">
        <p className="muted tiny" style={{ margin: 0 }}>
          {pkg.name}
        </p>
        <div className="price-line">{fmtRp(final)}</div>
        <div className={`countdown ${left <= 60 ? 'err' : ''}`}>
          Batas waktu {mm}:{ss}
        </div>

        {params.bank === 'QRIS' ? (
          <div className="qr-area">
            {qrisImg ? (
              <img src={qrisImg} alt="QRIS" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
              <span>
                Area kode QR QRIS
                <br />
                (dipasang lewat Panel Admin)
              </span>
            )}
          </div>
        ) : (
          <>
            <div className="bank-logo">
              {S.pay?.[params.bank] ? (
                <img src={S.pay[params.bank]} alt={BANKS[params.bank]} />
              ) : (
                BANKS[params.bank]
              )}
            </div>
            <p className="muted tiny" style={{ marginTop: 12 }}>
              Nomor Virtual Account
            </p>
            <div className="va-box">
              <span>{va}</span>
              <button
                className="btn sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(va);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch {}
                }}
              >
                {copied ? 'Tersalin' : 'Salin'}
              </button>
            </div>
          </>
        )}

        <button className="btn block" style={{ marginTop: 20 }} onClick={paid} disabled={left <= 0}>
          {left <= 0 ? 'Waktu Habis — Ulangi' : 'Simulasikan Transfer Berhasil'}
        </button>
        {left <= 0 ? (
          <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => router.push(`/beli/${pkg.id}`)}>
            Kembali ke Pembelian
          </button>
        ) : null}
      </div>

      {toast ? (
        <div className="notice" style={{ marginTop: 14, textAlign: 'center' }}>
          {toast}
        </div>
      ) : null}
    </>
  );
}
