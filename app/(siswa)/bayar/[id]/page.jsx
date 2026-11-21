'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, update } from '@/src/lib/store.js';
import { fmtRp } from '@/src/lib/model.js';
import { Back } from '@/src/components/AppShell.jsx';
import { kipayActive, kipayCreate, kipayStatus, kipaySimulate, kipayIsSandbox } from '@/src/lib/kipay.js';

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
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');
  const [err, setErr] = useState('');

  // Status transaksi KiPay (mode gateway). null = belum dibuat / fallback manual.
  const [trx, setTrx] = useState(null);
  const [paying, setPaying] = useState(false);
  const pollRef = useRef(null);
  const doneRef = useRef(false);

  const va = useMemo(() => '8800' + Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join(''), []);
  const gateway = kipayActive();

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const bank = q.get('m') || 'QRIS';
    setParams({ bank: BANKS[bank] ? bank : 'QRIS', promo: q.get('promo') || '' });
  }, []);

  // Hitung mundur dari expires_at transaksi; fallback 15 menit untuk mode manual.
  const [left, setLeft] = useState(15 * 60);
  useEffect(() => {
    if (!trx?.expires_at) return;
    const tick = () => {
      const ms = new Date(String(trx.expires_at).replace(' ', 'T') + 'Z').getTime() - Date.now();
      setLeft(Math.max(0, Math.floor(ms / 1000)));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [trx?.expires_at]);

  useEffect(() => {
    if (!toast && !err) return;
    const t = setTimeout(() => { setToast(''); setErr(''); }, 2600);
    return () => clearTimeout(t);
  }, [toast, err]);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

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

  const fulfill = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    update((S2) => {
      S2.owned[pkg.id] = Date.now();
      S2.newPk = Array.from(new Set([...(S2.newPk || []), pkg.id]));
      S2.logs.unshift({
        t: 'beli',
        x: `${S2.me?.n || 'Siswa'} membeli ${pkg.name} via ${trx?.provider || params.bank}${promo ? ` (promo ${promo.code})` : ''}`,
        d: new Date().toLocaleString('id-ID'),
      });
    });
    try {
      sessionStorage.setItem('kedinasan_flash', `Pembayaran diterima! ${pkg.name} sudah masuk Daftar Paket.`);
    } catch {}
    setToast('Pembayaran diterima!');
    router.replace('/paket');
  };

  // Buat transaksi QRIS di KiPay saat halaman dibuka (mode gateway).
  useEffect(() => {
    if (!gateway || !pkg || params.bank !== 'QRIS' || trx) return;
    let dead = false;
    kipayCreate(final, `kedinasan:${pkg.id}:${S.me?.e || 'anon'}`)
      .then((t) => { if (!dead) setTrx(t); })
      .catch(() => { if (!dead) setErr('Gagal membuat transaksi. Coba muat ulang.'); });
    return () => { dead = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateway, pkg?.id, params.bank]);

  const startPolling = () => {
    if (!trx || pollRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const t = await kipayStatus(trx.trx_id);
        if (t.status === 'paid') {
          clearInterval(pollRef.current);
          pollRef.current = null;
          fulfill();
        }
      } catch {}
    }, 3000);
  };

  const simulate = async () => {
    if (!trx || left <= 0) return;
    setPaying(true);
    try {
      const t = await kipaySimulate(trx.trx_id, 'shopeepay');
      if (t.status === 'paid') fulfill();
      else setErr('Simulasi belum berhasil. Coba lagi.');
    } catch {
      setErr('Simulasi gagal. Periksa koneksi.');
    } finally {
      setPaying(false);
    }
  };

  // Tombol bayar manual (tanpa gateway): langsung diterima seperti sebelumnya.
  const paidManual = () => {
    if (left <= 0) return;
    fulfill();
  };

  const qrisImg = gateway && trx?.qr_url ? trx.qr_url : S.pay?.QRIS;

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
        {gateway && trx ? (
          <div className="muted tiny" style={{ marginBottom: 6 }}>
            Trx {trx.trx_id}
            {trx.unique_code ? ` • kode unik ${trx.unique_code}` : ''}
          </div>
        ) : null}
        <div className={`countdown ${left <= 60 ? 'err' : ''}`}>
          Batas waktu {mm}:{ss}
        </div>

        {params.bank === 'QRIS' ? (
          <div className="qr-area">
            {qrisImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrisImg} alt="QRIS" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
              <span>
                Area kode QR QRIS
                <br />
                {gateway ? 'Membuat transaksi…' : '(dipasang lewat Panel Admin)'}
              </span>
            )}
          </div>
        ) : (
          <>
            <div className="bank-logo">
              {S.pay?.[params.bank] ? (
                // eslint-disable-next-line @next/next/no-img-element
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

        {gateway && trx && params.bank === 'QRIS' ? (
          <>
            {kipayIsSandbox(trx) ? (
              <button className="btn block" style={{ marginTop: 20 }} onClick={simulate} disabled={paying || left <= 0}>
                {paying ? 'Memproses…' : left <= 0 ? 'Waktu Habis — Ulangi' : 'Simulasikan Bayar (Sandbox)'}
              </button>
            ) : (
              <button className="btn block" style={{ marginTop: 20 }} onClick={startPolling} disabled={left <= 0}>
                {left <= 0 ? 'Waktu Habis — Ulangi' : 'Saya Sudah Bayar — Cek Status'}
              </button>
            )}
          </>
        ) : (
          <button className="btn block" style={{ marginTop: 20 }} onClick={paidManual} disabled={left <= 0}>
            {left <= 0 ? 'Waktu Habis — Ulangi' : 'Simulasikan Transfer Berhasil'}
          </button>
        )}
        {left <= 0 ? (
          <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => window.location.reload()}>
            Buat Transaksi Baru
          </button>
        ) : null}
      </div>

      {toast ? (
        <div className="notice" style={{ marginTop: 14, textAlign: 'center' }}>
          {toast}
        </div>
      ) : null}
      {err ? (
        <div className="err" style={{ marginTop: 14, textAlign: 'center' }}>
          {err}
        </div>
      ) : null}
    </>
  );
}
