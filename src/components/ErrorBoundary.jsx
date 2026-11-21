import { Component } from 'react';

/** Menahan crash supaya layar putih tidak total saat engine legacy error. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[WebKedinasan] render gagal:', error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div
        id="app"
        style={{
          maxWidth: 480,
          margin: '0 auto',
          padding: '32px 18px',
          font: '14px system-ui, sans-serif',
          lineHeight: 1.6,
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Aplikasi gagal dimuat</h2>
        <p style={{ margin: '0 0 16px', color: '#666' }}>
          Coba muat ulang halaman. Data akun dan riwayat tetap tersimpan di perangkat ini.
        </p>
        <pre
          style={{
            margin: 0,
            padding: 12,
            overflow: 'auto',
            fontSize: 12,
            background: '#f3f6fd',
            borderRadius: 8,
          }}
        >
          {String(error?.message || error)}
        </pre>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            marginTop: 16,
            width: '100%',
            height: 44,
            border: 0,
            borderRadius: 8,
            background: '#346ef3',
            color: '#fff',
            font: 'inherit',
            fontWeight: 700,
          }}
        >
          Muat ulang
        </button>
      </div>
    );
  }
}
