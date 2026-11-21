'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { verifyEmail } from '@/src/lib/auth.js';

export default function VerifikasiPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      setEmail(sessionStorage.getItem('kedinasan_pending_email') || '');
    } catch {}
  }, []);

  const verify = () => {
    if (!email) return;
    verifyEmail(email);
    try {
      sessionStorage.removeItem('kedinasan_pending_email');
      sessionStorage.setItem('kedinasan_flash_masuk', '✔ Verifikasi berhasil! Silakan masuk.');
    } catch {}
    setDone(true);
    setTimeout(() => router.replace('/masuk'), 900);
  };

  return (
    <>
      <div className="auth-hero">
        <h1>Cek Email Kamu</h1>
        <p>
          Link konfirmasi sekali pakai dikirim ke <b>{email || 'email kamu'}</b>.
        </p>
      </div>
      <div className="auth-card">
        {done ? (
          <div className="ok">Verifikasi berhasil. Mengalihkan ke halaman masuk…</div>
        ) : (
          <>
            <p className="muted tiny">
              Mode lokal belum mengirim email sungguhan. Tekan tombol di bawah untuk mensimulasikan
              klik tautan konfirmasi.
            </p>
            <button className="btn block" onClick={verify} disabled={!email}>
              Buka Link Konfirmasi (simulasi)
            </button>
            <p className="muted center tiny" style={{ margin: 0 }}>
              Salah email?{' '}
              <Link href="/daftar" className="link">
                Daftar ulang
              </Link>
            </p>
          </>
        )}
      </div>
    </>
  );
}
