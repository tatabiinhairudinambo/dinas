'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/src/lib/auth.js';

export default function DaftarPage() {
  const router = useRouter();
  const [form, setForm] = useState({ n: '', e: '', p: '', p2: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    const r = await register({ name: form.n, email: form.e, password: form.p, confirm: form.p2 });
    setBusy(false);
    if (!r.ok) {
      setMsg(r.msg);
      return;
    }
    try {
      sessionStorage.setItem('kedinasan_pending_email', r.email);
    } catch {}
    router.push('/verifikasi');
  };

  return (
    <>
      <div className="auth-hero">
        <h1>Daftar Akun</h1>
        <p>Gratis. Paket yang kamu beli tersimpan di akun ini.</p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <h2>Buat akun baru</h2>
        {msg ? <div className="err">{msg}</div> : null}
        <input placeholder="Nama Lengkap" value={form.n} onChange={set('n')} autoComplete="name" />
        <input type="email" placeholder="Email" value={form.e} onChange={set('e')} autoComplete="email" />
        <input type="password" placeholder="Buat Kunci Akun (min. 6 digit)" value={form.p} onChange={set('p')} autoComplete="new-password" />
        <input type="password" placeholder="Konfirmasi Kunci Akun" value={form.p2} onChange={set('p2')} autoComplete="new-password" />
        <button className="btn block" disabled={busy}>
          {busy ? 'Mendaftarkan…' : 'Daftar Sekarang'}
        </button>
        <p className="muted center tiny" style={{ margin: 0 }}>
          Sudah punya akun?{' '}
          <Link href="/masuk" className="link">
            Masuk
          </Link>
        </p>
      </form>
    </>
  );
}
