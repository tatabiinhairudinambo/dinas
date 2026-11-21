'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/src/lib/store.js';
import { updateMe } from '@/src/lib/auth.js';
import { Back } from '@/src/components/AppShell.jsx';

export default function FotoPage() {
  const router = useRouter();
  const { data: S } = useStore();
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [px, setPx] = useState(0.5);
  const [py, setPy] = useState(0.5);
  const [loaded, setLoaded] = useState(false);

  const draw = (target, w, h) => {
    const img = imgRef.current;
    if (!img || !img.width) return;
    const c = target || canvasRef.current;
    if (!c) return;
    const x = c.getContext('2d');
    x.clearRect(0, 0, w, h);
    const base = Math.max(w / img.width, h / img.height) * zoom;
    const dw = img.width * base;
    const dh = img.height * base;
    x.drawImage(img, (w - dw) * px, (h - dh) * py, dw, dh);
  };

  useEffect(() => {
    const src = S.me?.pic;
    if (!src || loaded) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
    };
    img.src = src;
  }, [S.me?.pic, loaded]);

  useEffect(() => {
    draw(null, 240, 360);
  }, [zoom, px, py, loaded]);

  const pick = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setZoom(1);
      setPx(0.5);
      setPy(0.5);
      setLoaded(true);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const simpan = () => {
    const c = document.createElement('canvas');
    c.width = 400;
    c.height = 600;
    draw(c, 400, 600);
    updateMe({ pic: c.toDataURL('image/jpeg', 0.88) });
    router.push('/profil');
  };

  return (
    <>
      <div className="page-head">
        <Back href="/profil" label="Profil" />
        <h1>Edit Foto</h1>
      </div>
      <div className="card">
        <p className="muted tiny">Pas foto 4x6 (vertikal). Foto ini muncul di halaman hasil ujian.</p>
        <canvas
          ref={canvasRef}
          width={240}
          height={360}
          style={{ display: 'block', margin: '12px auto', background: 'var(--cd)', borderRadius: 10 }}
        />
        <div className="form-grid">
          <label>
            Zoom
            <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          </label>
          <label>
            Geser kiri-kanan
            <input type="range" min="0" max="1" step="0.01" value={px} onChange={(e) => setPx(Number(e.target.value))} />
          </label>
          <label>
            Geser atas-bawah
            <input type="range" min="0" max="1" step="0.01" value={py} onChange={(e) => setPy(Number(e.target.value))} />
          </label>
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          <label className="btn ghost block" style={{ cursor: 'pointer' }}>
            Pilih Foto
            <input type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
          </label>
          <button className="btn block" onClick={simpan} disabled={!loaded}>
            Simpan
          </button>
        </div>
      </div>
    </>
  );
}
