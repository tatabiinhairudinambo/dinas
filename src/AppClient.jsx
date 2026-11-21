'use client';

import App from './App.jsx';
import { mountReactView } from './lib/reactHost.jsx';
import NotifView from './views/NotifView.jsx';

// Modul ini hanya dieksekusi di browser (dynamic import ssr:false).
// Jalan masuk untuk migrasi bertahap: layar legacy bisa menitipkan JSX.
window.mountReactView = mountReactView;
window.Views = { NotifView };

export default function AppClient() {
  return <App />;
}
