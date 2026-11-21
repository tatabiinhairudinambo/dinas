'use client';

import { Nav, RequireUser } from '@/src/components/AppShell.jsx';

export default function SiswaLayout({ children }) {
  return (
    <RequireUser>
      <div className="screen">{children}</div>
      <Nav />
    </RequireUser>
  );
}
