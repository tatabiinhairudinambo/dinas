'use client';

import dynamic from 'next/dynamic';

// Engine legacy butuh DOM (#app/#m); jangan dirender di server.
const AppClient = dynamic(() => import('../src/AppClient.jsx'), { ssr: false });

export default function Page() {
  return <AppClient />;
}
