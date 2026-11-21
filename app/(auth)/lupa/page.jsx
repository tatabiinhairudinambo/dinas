'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/src/lib/auth.js';

export default function LupaPage() {
  const [form, setForm] = useState({ e: '', p: '', p2: '' });
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const r = resetPassword(form.e, form.p, form.p2);
    if (!r.ok) {
      setOk(false);
      setMsg(r.msg);
      return;
    }
    setOk(true);
    setMsg('✔ Kunci akun berhasil diganti. Silakan masuk.');
  };

  return (
    <>
      <div className="auth-hero">
        <h1>Pulihkan Akun</h1>
        <p>Ganti kunci akun dengan email yang terdaftar.</p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        {msg ? <div className={ok ? 'ok' : 'err'}>{msg}</div> : null}
        <input type="email" placeholder="Email" value={form.e} onChange={set('e')} autoComplete="email" />
        <input type="password" placeholder="Kunci Baru" value={form.p} onChange={set('p')} autoComplete="new-password" />
        <input type="password" placeholder="Konfirmasi Kunci Baru" value={form.p2} onChange={set('p2')} autoComplete="new-password" />
        <button className="btn block">Pulihkan Akun</button>
        <p className="muted center tiny" style={{ margin: 0 }}>
          Ingat kuncinya?{' '}
          <Link href="/masuk" className="link">
            Masuk
          </Link>
        </p>
      </form>
    </>
  );
}
