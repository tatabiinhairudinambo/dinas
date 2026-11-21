'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, update } from '@/src/lib/store.js';
import { LETTERS, numOf, qType, scoreExam } from '@/src/lib/model.js';
import { Modal, Sheet } from '@/src/components/AppShell.jsx';
import { useHydrated } from '@/src/components/AppShell.jsx';

const SECTION = { TWK: 'Tes Wawasan Kebangsaan', TIU: 'Tes Intelegensia Umum', TKP: 'Tes Karakteristik Pribadi' };

export default function UjianPage() {
  const { id } = useParams();
  const router = useRouter();
  const { ready, data: S } = useStore();
  const hydrated = useHydrated();
  const [now, setNow] = useState(Date.now());
  const [nav, setNav] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [early, setEarly] = useState(false);
  const [info, setInfo] = useState('');
  const doneRef = useRef(false);

  const pkg = S.packages.find((p) => String(p.id) === String(id));
  const exam = S.exam;

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!pkg || !exam || String(exam.id) !== String(id)) router.replace('/paket');
  }, [ready, pkg, exam, id, router]);

  useEffect(() => {
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  const finish = useCallback(
    (force) => {
      if (doneRef.current || !pkg || !exam) return;
      const ans = { ...exam.ans };
      if (exam.sel != null) ans[exam.i] = exam.sel;
      const r = scoreExam(pkg, { ...exam, ans });
      doneRef.current = true;
      update((d) => {
        d.res[pkg.id] = r;
        d.hist[pkg.id] = [...(d.hist[pkg.id] || []), r].slice(-20);
        d.logs.unshift({
          t: 'kerja',
          x: `${d.me?.n || 'Siswa'} menyelesaikan ${pkg.name}: ${r.tot} poin`,
          d: new Date().toLocaleString('id-ID'),
        });
        d.exam = null;
      });
      router.replace(`/hasil/${pkg.id}`);
    },
    [pkg, exam, router],
  );

  const left = exam?.end ? Math.max(0, Math.ceil((exam.end - now) / 1000)) : null;

  useEffect(() => {
    if (left === 0 && exam && !doneRef.current) finish(true);
  }, [left, exam, finish]);

  if (!hydrated || !pkg || !exam) {
    return <div className="screen plain" />;
  }

  const i = Math.min(exam.i, pkg.qs.length - 1);
  const q = pkg.qs[i] || { t: '', o: [], a: null, w: [], pem: '' };
  const type = qType(pkg, i);
  const sel = exam.sel ?? exam.ans[i] ?? null;
  const done = Object.keys(exam.ans || {}).length;
  const skipped = Object.keys(exam.sk || {}).length;
  const isSkd = pkg.type === 'SKD';
  const earlyLeft = exam.st && Date.now() - exam.st < 60000;

  const pick = (j) => {
    update((d) => {
      if (!d.exam) return;
      d.exam.sel = j;
    });
  };

  const next = () => {
    update((d) => {
      if (!d.exam) return;
      if (d.exam.sel != null) {
        d.exam.ans[d.exam.i] = d.exam.sel;
        delete d.exam.sk[d.exam.i];
      }
      if (d.exam.i < pkg.qs.length - 1) d.exam.i += 1;
      d.exam.sel = null;
    });
    setNav(false);
  };

  const skip = () => {
    update((d) => {
      if (!d.exam) return;
      if (d.exam.ans[d.exam.i] == null) d.exam.sk[d.exam.i] = 1;
      if (d.exam.i < pkg.qs.length - 1) d.exam.i += 1;
      d.exam.sel = null;
    });
  };

  const prev = () => {
    update((d) => {
      if (!d.exam) return;
      if (d.exam.i > 0) d.exam.i -= 1;
      d.exam.sel = null;
    });
  };

  const jump = (target) => {
    update((d) => {
      if (!d.exam) return;
      d.exam.i = target;
      d.exam.sel = null;
    });
    setNav(false);
  };

  const mm = left != null ? String(Math.floor(left / 60)).padStart(2, '0') : null;
  const ss = left != null ? String(left % 60).padStart(2, '0') : null;

  return (
    <div className="exam-screen">
      <div className="exam-top">
        <button className="back" onClick={() => router.push('/paket')} aria-label="Kembali">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="title">
          <b>{pkg.name}</b>
          <span>
            Soal {i + 1} dari {pkg.qs.length} • {type}
          </span>
        </div>
        {left != null ? <div className={`timer${left <= 300 ? ' danger' : ''}`}>{mm}:{ss}</div> : null}
        <button className="btn sm ghost" onClick={() => setNav(true)}>
          Daftar Nomor
        </button>
      </div>

      <div className="progress-line">
        <i style={{ width: `${((i + 1) / pkg.qs.length) * 100}%` }} />
      </div>

      <div className="q-num">
        SOAL NOMOR {numOf(pkg, i)} • {type}
      </div>
      <div className="q-text">{q.t}</div>
      {q.img ? <img src={q.img} alt="Ilustrasi soal" className="q-img" /> : null}

      <div>
        {(q.o || []).map((opt, j) => (
          <button key={j} className={`opt${sel === j ? ' on' : ''}`} onClick={() => pick(j)}>
            <span className="letter">{LETTERS[j]}</span>
            <span style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              {q.oi?.[j] ? (
                <img src={q.oi[j]} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
              ) : null}
              <span>{opt}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="exam-actions">
        <button className="btn ghost" onClick={prev} disabled={i === 0}>
          <span className="arr">← </span>Sebelumnya
        </button>
        <button className="btn ghost" onClick={skip}>
          Lewati
        </button>
        <button className="btn" onClick={i === pkg.qs.length - 1 ? () => setConfirm(true) : next}>
          {i === pkg.qs.length - 1 ? 'Selesai' : <span><span className="arr">Berikutnya </span>→</span>}
        </button>
      </div>

      <Sheet open={nav} onClose={() => setNav(false)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ margin: 0 }}>Daftar Nomor</h3>
          <button className="btn sm ghost" onClick={() => setConfirm(true)}>
            Akhiri Ujian
          </button>
        </div>
        <p className="muted tiny">
          Terjawab {done} • Ditandai {skipped} • Sisa {pkg.qs.length - done}
        </p>
        {isSkd ? (
          <div className="answer-grid" style={{ marginBottom: 10 }}>
            {[
              ['TWK', 0],
              ['TIU', 30],
              ['TKP', 65],
            ].map(([label, at]) => (
              <button
                key={label}
                className="btn sm ghost"
                style={{ width: 'auto', padding: '0 12px' }}
                onClick={() => jump(at)}
              >
                Lompat {label}
              </button>
            ))}
          </div>
        ) : null}
        <div className="answer-grid">
          {pkg.qs.map((_, idx) => (
            <button
              key={idx}
              className={idx === i ? 'now' : exam.ans[idx] != null ? 'done' : exam.sk[idx] ? 'skip' : ''}
              onClick={() => jump(idx)}
            >
              {numOf(pkg, idx)}
            </button>
          ))}
        </div>
      </Sheet>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Selesaikan ujian?">
        <p className="muted">
          Terjawab {done} dari {pkg.qs.length} soal
          {skipped ? ` • ${skipped} dilewati` : ''}. Jawaban yang kosong dihitung 0.
        </p>
        {earlyLeft ? (
          <div className="notice" style={{ marginBottom: 12 }}>
            Baru saja dimulai. Pastikan kamu yakin ingin mengakhiri sekarang.
          </div>
        ) : null}
        <button
          className="btn block"
          onClick={() => {
            if (earlyLeft) {
              setConfirm(false);
              setEarly(true);
            } else {
              finish();
            }
          }}
        >
          Akhiri & Lihat Hasil
        </button>
        <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => setConfirm(false)}>
          Lanjut Mengerjakan
        </button>
      </Modal>

      <Modal open={early} onClose={() => setEarly(false)} title="Masih terlalu awal">
        <p className="muted">
          Ujian baru berjalan kurang dari 1 menit. Kerjakan dulu, lalu akhiri dari tombol Daftar Nomor.
        </p>
        <button className="btn block" onClick={() => setEarly(false)}>
          Oke
        </button>
      </Modal>

      {info ? <div className="notice">{info}</div> : null}
    </div>
  );
}
