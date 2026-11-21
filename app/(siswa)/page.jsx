'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, update } from '@/src/lib/store.js';
import { DEFAULT_BANNER, fmtRp } from '@/src/lib/model.js';
import { Empty, Modal, PackageCard, Sheet } from '@/src/components/AppShell.jsx';
import { compressImage } from '@/src/lib/image.js';

const OP_KEY = 'kedinasan_op';

export default function HomePage() {
  const { data: S } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [op, setOp] = useState(false);
  const [desc, setDesc] = useState(null);
  const [banner, setBanner] = useState(false);
  const [side, setSide] = useState(false);
  const taps = useRef({ n: 0, t: 0 });
  const logoFile = useRef(null);
  const bannerFile = useRef(null);
  const [bannerText, setBannerText] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      setOp(sessionStorage.getItem(OP_KEY) === '1');
    } catch {}
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const list = S.packages.filter(
    (p) => p.pub && !p.hidden && !S.owned[p.id] && p.name.toLowerCase().includes(query.toLowerCase()),
  );
  const shown = query ? list : list.slice(0, 7);

  const onLogo = () => {
    if (op) {
      logoFile.current?.click();
      return;
    }
    const now = Date.now();
    const t = taps.current;
    t.n = now - t.t < 1200 ? t.n + 1 : 1;
    t.t = now;
    if (t.n >= 12) {
      taps.current = { n: 0, t: 0 };
      setOp(true);
      try {
        sessionStorage.setItem(OP_KEY, '1');
      } catch {}
      setToast('Mode Operator aktif');
    }
  };

  const setOpMode = (value) => {
    setOp(value);
    try {
      sessionStorage.setItem(OP_KEY, value ? '1' : '0');
    } catch {}
  };

  const upload = async (file, key, maxW = 1400) => {
    if (!file) return;
    try {
      const data = await compressImage(file, maxW, 0.85);
      update((d) => {
        d[key] = data;
      });
    } catch {
      setToast('Gagal membaca gambar');
    }
  };

  const openBanner = () => {
    setBannerText(S.banner === DEFAULT_BANNER ? '' : S.banner || '');
    setBanner(true);
  };

  const hasBanner = Boolean(S.bannerImg || (S.banner && S.banner !== DEFAULT_BANNER));

  return (
    <>
      <header className="home-head">
        <div>
          <div className="hello">Halo,</div>
          <div className="uname">{S.me?.n}</div>
          <button className="btn sm ghost" onClick={() => router.push('/profil/foto')}>
            Edit Foto
          </button>
        </div>
        <div className="brand">
          <div className="logo-btn" onClick={onLogo} role="button" tabIndex={0}>
            {S.logo ? <img src={S.logo} alt="Logo" /> : null}
          </div>
          {op ? (
            <button className="hamb" aria-label="Menu operator" onClick={() => setSide(true)}>
              ☰
            </button>
          ) : null}
        </div>
      </header>

      {op ? (
        <p className="op-note">MODE OPERATOR: ketuk banner atau logo untuk mengubah</p>
      ) : null}

      <div
        className={`banner${op ? ' editable' : ''}`}
        onClick={op ? openBanner : undefined}
        style={S.bannerImg ? { backgroundImage: `url(${S.bannerImg})` } : undefined}
      >
        {hasBanner ? (
          <span style={S.bannerImg ? { textShadow: '0 2px 10px #0008' } : undefined}>
            {S.banner === DEFAULT_BANNER ? '' : S.banner}
          </span>
        ) : (
          <span style={{ opacity: 0.8 }}>
            {op ? 'Ketuk untuk mengisi banner' : 'Belum ada pengumuman'}
          </span>
        )}
      </div>

      <button className="cta" onClick={() => router.push('/kategori/SKD')}>
        TRY OUT SKD 110 SOAL
      </button>
      <div className="cats">
        {['TWK', 'TIU', 'TKP'].map((t) => (
          <button key={t} onClick={() => router.push(`/kategori/${t}`)}>
            TO {t}
          </button>
        ))}
      </div>

      <div className="section-title">
        <b>Terbaru</b>
        <input
          className="search"
          placeholder="Cari judul paket..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="pkg-list">
        {shown.map((p) => (
          <PackageCard
            key={p.id}
            pkg={p}
            onDesc={setDesc}
            action={
              <button className="btn yellow" onClick={() => router.push(`/beli/${p.id}`)}>
                Beli
              </button>
            }
          />
        ))}
        {shown.length === 0 ? <Empty>Belum ada paket.</Empty> : null}
      </div>

      {!query && list.length > 7 ? (
        <button className="btn ghost block" style={{ marginTop: 18 }} onClick={() => router.push('/semua')}>
          Lihat Lainnya
        </button>
      ) : null}

      <Sheet open={Boolean(desc)} onClose={() => setDesc(null)}>
        {desc ? (
          <>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="pkg-thumb" style={{ width: 96, ...(desc.thumb ? { backgroundImage: `url(${desc.thumb})` } : {}) }} />
              <b>{desc.name}</b>
            </div>
            <p style={{ marginTop: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {desc.desc || 'Kosong'}
            </p>
            <p className="muted tiny">
              {desc.type} • {desc.qs?.length || 0} soal • {fmtRp(desc.promo || desc.price)}
            </p>
            <button className="btn block" onClick={() => router.push(`/beli/${desc.id}`)}>
              Beli Paket
            </button>
          </>
        ) : null}
      </Sheet>

      <Modal open={banner} onClose={() => setBanner(false)} title="Edit Banner">
        <div className="stack">
          <label className="tiny muted">Teks banner</label>
          <input value={bannerText} onChange={(e) => setBannerText(e.target.value)} placeholder="Teks pengumuman" />
          <button
            className="btn"
            onClick={() => {
              update((d) => {
                d.banner = bannerText.trim();
              });
              setBanner(false);
              setToast('Banner diperbarui');
            }}
          >
            Simpan Teks
          </button>
          <button className="btn ghost" onClick={() => bannerFile.current?.click()}>
            Unggah Gambar Banner
          </button>
          {S.bannerImg ? (
            <button
              className="btn danger"
              onClick={() => {
                update((d) => {
                  d.bannerImg = '';
                });
                setBanner(false);
              }}
            >
              Hapus Gambar
            </button>
          ) : null}
        </div>
      </Modal>

      <Modal open={side} onClose={() => setSide(false)} title="Dapur Operator">
        <div className="stack">
          <button className="btn" onClick={() => router.push('/admin')}>
            Panel Admin
          </button>
          <button
            className="btn ghost"
            onClick={() => {
              setOpMode(false);
              setSide(false);
            }}
          >
            Keluar Mode Operator
          </button>
        </div>
      </Modal>

      <input
        ref={logoFile}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => upload(e.target.files?.[0], 'logo', 660)}
      />
      <input
        ref={bannerFile}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          await upload(e.target.files?.[0], 'bannerImg');
          setBanner(false);
        }}
      />

      {toast ? (
        <div className="sheet" style={{ position: 'fixed', bottom: 90, left: 16, right: 16, maxWidth: 448, margin: 'auto', padding: 12, textAlign: 'center' }}>
          {toast}
        </div>
      ) : null}
    </>
  );
}
