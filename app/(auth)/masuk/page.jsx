'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/src/lib/auth.js';
import { useStore } from '@/src/lib/store.js';

export default function MasukPage() {
  const router = useRouter();
  const { data: S } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const flash = sessionStorage.getItem('kedinasan_flash_masuk');
      if (flash) {
        setMsg(flash);
        sessionStorage.removeItem('kedinasan_flash_masuk');
      }
    } catch {}
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    const r = await login(email, password);
    setBusy(false);
    if (r.ok) router.replace('/');
    else setMsg(r.msg);
  };

  return (
    <>
      <div className="auth-hero">
        {S.loginLogo ? (
          <img src={S.loginLogo} alt="Logo" style={{ maxHeight: 44, maxWidth: 140, objectFit: 'contain', marginBottom: 10 }} />
        ) : null}
        <h1>Masuk — Web Kedinasan</h1>
        <p>Try Out SKD 110 soal, TWK, TIU, TKP. Latih dirimu seperti ujian sesungguhnya.</p>
      </div>

      <form className="auth-card" onSubmit={submit}>
        {msg ? <div className={msg.startsWith('✔') ? 'ok' : 'err'}>{msg}</div> : null}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        <input type="password" placeholder="Kunci Akun" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        <button className="btn block" disabled={busy}>
          {busy ? 'Memeriksa…' : 'Masuk'}
        </button>
        <div className="center">
          <Link href="/lupa" className="link tiny">
            Lupa Kunci Akun?
          </Link>
        </div>
        <p className="muted center tiny" style={{ margin: 0 }}>
          Belum punya akun?{' '}
          <Link href="/daftar" className="link">
            Daftar
          </Link>
        </p>
      </form>
    </>
  );
}
