'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '../lib/store.js';
import { fmtRp } from '../lib/model.js';

export function useHydrated() {
  const store = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && store.ready;
}

export function Splash() {
  return (
    <div className="boot">
      <div className="boot-dot" />
      <p>Memuat Web Kedinasan…</p>
    </div>
  );
}

export function RequireUser({ children }) {
  const { ready, data } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (ready && !data.me) router.replace('/masuk');
  }, [ready, data.me, router]);
  if (!ready || !data.me) return <Splash />;
  return children;
}

export function RequireGuest({ children }) {
  const { ready, data } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (ready && data.me) router.replace('/');
  }, [ready, data.me, router]);
  if (ready && data.me) return <Splash />;
  return children;
}

export function Photo({ src, name, className = 'avatar' }) {
  return src ? (
    <span className={className} style={{ backgroundImage: `url(${src})` }} aria-label={name} />
  ) : (
    <span className={className} aria-hidden="true">
      {name ? name.trim().charAt(0).toUpperCase() : '👤'}
    </span>
  );
}

export function Nav() {
  const path = usePathname();
  const { data } = useStore();
  const badge = (data.newPk || []).filter((id) => data.owned[id]).length;
  const items = [
    { href: '/', label: 'Beranda', icon: IconHome },
    { href: '/paket', label: 'Daftar Paket', icon: IconBook, badge },
    { href: '/profil', label: 'Profil', icon: IconUser },
  ];
  return (
    <nav className="nav">
      {items.map(({ href, label, icon: Ico, badge: n }) => {
        const on = href === '/' ? path === '/' || path.startsWith('/kategori') || path === '/semua' : path === href;
        return (
          <Link key={href} href={href} className={on ? 'on' : ''}>
            <Ico active={on} />
            <span>{label}</span>
            {n ? <i className="dot-badge">{n}</i> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function Back({ href = '/', label = 'Kembali' }) {
  return (
    <Link href={href} className="back" aria-label={label}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}

export function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="modal-wrap" role="dialog" aria-modal="true">
      <div className="overlay" onClick={onClose} />
      <div className="modal">
        {title ? <h3 className="modal-title">{title}</h3> : null}
        {children}
      </div>
    </div>
  );
}

export function Sheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true">
      <div className="overlay" onClick={onClose} />
      <div className="sheet">{children}</div>
    </div>
  );
}

export function PackageCard({ pkg, owned, lastScore, onDesc, action, hidden }) {
  const price = pkg.promo || 0;
  return (
    <article className={`pkg-card${hidden ? ' pkg-hidden' : ''}`}>
      <div className="pkg-thumb" style={pkg.thumb ? { backgroundImage: `url(${pkg.thumb})` } : undefined}>
        {pkg.thumb ? null : <span>Kosong<small>120 × 80</small></span>}
      </div>
      <div className="pkg-body">
        <h3>{pkg.name}</h3>
        <p className="pkg-meta">
          {pkg.type} • {pkg.qs?.length || 0} soal{pkg.rel ? ` • Rilis ${pkg.rel}` : ''}
        </p>
        <p className="pkg-price">
          {price ? (
            <>
              <s>{fmtRp(pkg.price)}</s> <b>{fmtRp(price)}</b>
            </>
          ) : (
            <b>{fmtRp(pkg.price)}</b>
          )}
        </p>
        {owned && lastScore != null ? <p className="pkg-score">Nilai terakhir: {lastScore}</p> : null}
        <div className="pkg-actions">
          <button type="button" className="btn ghost" onClick={() => onDesc?.(pkg)}>
            Deskripsi
          </button>
          {action}
        </div>
      </div>
    </article>
  );
}

export function Empty({ children }) {
  return <div className="empty">{children}</div>;
}

export function IconHome({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}
export function IconBook({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h7a4 4 0 0 1 4 4v13H8a4 4 0 0 0-4 4z" transform="translate(0 -1)" />
      <path d="M20 4h-5a4 4 0 0 0-4 4v13h5a4 4 0 0 1 4 4z" transform="translate(0 -1)" />
    </svg>
  );
}
export function IconUser({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  );
}
