'use client';

import dynamic from 'next/dynamic';

// Panel operator hanya untuk browser (butuh window/localStorage + engine legacy).
const CmsApp = dynamic(() => import('../../src/cms/CmsApp.jsx'), { ssr: false });

export default function AdminPage() {
  return <CmsApp />;
}
