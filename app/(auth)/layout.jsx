'use client';

import { RequireGuest } from '@/src/components/AppShell.jsx';

export default function AuthLayout({ children }) {
  return (
    <RequireGuest>
      <div className="auth-screen">{children}</div>
    </RequireGuest>
  );
}
