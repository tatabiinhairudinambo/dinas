import ErrorBoundary from './components/ErrorBoundary.jsx';
import LegacyHost from './components/LegacyHost.jsx';

/**
 * Kerangka aplikasi.
 *
 * Untuk sekarang engine legacy (public/legacy/app.js) yang menggambar seluruh
 * layar ke dalam #app. React memegang batas aplikasi: error boundary, urutan
 * boot, dan nanti layar-layar baru yang ditulis sebagai komponen.
 *
 * Menambah layar React baru? Lihat docs/MIGRATION.md.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <LegacyHost />
    </ErrorBoundary>
  );
}
