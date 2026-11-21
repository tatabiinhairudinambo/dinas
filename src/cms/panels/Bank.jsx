import { useEffect, useMemo, useState } from 'react';
import { Badge, Empty, Panel, Progress } from '../ui.jsx';
import {
  LETTERS,
  NEED,
  OFFSET,
  packageById,
  questionComplete,
  questionErrors,
  questionNumber,
  questionType,
  useCmsState,
} from '../../lib/cmsData.js';

const EMPTY_QUESTION = () => ({ t: '', o: ['', '', '', '', ''], a: null, w: [null, null, null, null, null], pem: '', oi: [] });
const WEIGHTS = [5, 4, 3, 2, 1];

export default function Bank({ initialPackageId }) {
  const { S, mutate } = useCmsState();
  const packages = S?.packages || [];
  const [pkgId, setPkgId] = useState(null);
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [importing, setImporting] = useState(false);

  const activeId = pkgId ?? (initialPackageId ?? packages[0]?.id ?? null);
  const pkg = packageById(S, activeId);

  useEffect(() => {
    if (initialPackageId != null) {
      setPkgId(initialPackageId);
      setIndex(0);
    }
  }, [initialPackageId]);

  useEffect(() => {
    if (!pkg && packages.length) setPkgId(packages[0].id);
  }, [pkg, packages]);

  const questions = pkg?.qs || [];
  const types = pkg?.type === 'SKD' ? ['TWK', 'TIU', 'TKP'] : pkg ? [pkg.type] : [];

  const counts = useMemo(() => {
    const result = {};
    types.forEach((t) => {
      const idx = questions.map((_, i) => i).filter((i) => questionType(pkg, i) === t);
      result[t] = {
        total: idx.length,
        done: idx.filter((i) => questionComplete(pkg, i)).length,
      };
    });
    return result;
  }, [pkg, questions, types.join(',')]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions
      .map((item, i) => ({ item, i }))
      .filter(({ item, i }) => {
        if (typeFilter !== 'all' && questionType(pkg, i) !== typeFilter) return false;
        if (!q) return true;
        return `${item.t} ${(item.o || []).join(' ')}`.toLowerCase().includes(q);
      });
  }, [questions, query, typeFilter, pkg]);

  if (!S) return <div className="cms-loading">Menunggu data…</div>;
  if (!pkg) return <Empty title="Belum ada paket" hint="Buat paket dulu di tab Paket." />;

  const current = questions[index];
  const errors = questionErrors(pkg);

  return (
    <div className="cms-bank">
      <div className="cms-bank-list">
        <Panel
          title="Pilih paket"
          actions={
            <button type="button" className="cms-btn is-ghost" onClick={() => setImporting(true)}>
              Import
            </button>
          }
        >
          <select className="cms-input" value={activeId ?? ''} onChange={(e) => { setPkgId(Number(e.target.value)); setIndex(0); }}>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.type}
              </option>
            ))}
          </select>

          <div className="cms-chips">
            {types.map((t) => (
              <div key={t} className="cms-chip">
                <div>
                  <strong>{t}</strong>
                  <small>
                    {counts[t]?.done || 0}/{counts[t]?.total || 0}
                  </small>
                </div>
                <Progress value={counts[t]?.done || 0} max={counts[t]?.total || 1} tone={counts[t]?.done === counts[t]?.total ? 'ok' : 'warn'} />
              </div>
            ))}
            <div className="cms-chip">
              <div>
                <strong>Total</strong>
                <small>
                  {questions.length}/{NEED[pkg.type] || questions.length}
                </small>
              </div>
              <Progress value={questions.length - errors.length} max={questions.length || 1} tone={errors.length ? 'warn' : 'ok'} />
            </div>
          </div>

          <div className="cms-filter-row">
            <input className="cms-input cms-search" placeholder="Cari teks soal…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select className="cms-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">Semua</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <ul className="cms-qlist">
            {visible.map(({ item, i }) => (
              <li key={i}>
                <button type="button" className={i === index ? 'is-active' : ''} onClick={() => setIndex(i)}>
                  <span className="cms-qnum">{questionNumber(pkg, i)}</span>
                  <span className={`cms-qdot${questionComplete(pkg, i) ? ' is-ok' : ''}`} />
                  <span className="cms-qtext">{item.t?.trim() ? item.t : 'Kosong'}</span>
                  <em>{questionType(pkg, i)}</em>
                </button>
              </li>
            ))}
            {visible.length === 0 ? <li className="cms-dim cms-qempty">Tidak ada soal yang cocok.</li> : null}
          </ul>
        </Panel>
      </div>

      <div className="cms-bank-editor">
        {current ? (
          <Panel
            title={`Soal ${questionNumber(pkg, index)}`}
            hint={`${questionType(pkg, index)} · ${questionComplete(pkg, index) ? 'lengkap' : 'belum lengkap'}`}
            actions={
              <>
                <button type="button" className="cms-btn is-ghost" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
                  ←
                </button>
                <button
                  type="button"
                  className="cms-btn is-ghost"
                  disabled={index >= questions.length - 1}
                  onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
                >
                  →
                </button>
                <button
                  type="button"
                  className="cms-btn is-ghost"
                  onClick={() =>
                    mutate((state) => {
                      const target = packageById(state, pkg.id);
                      target.qs[index] = EMPTY_QUESTION();
                    })
                  }
                >
                  Kosongkan
                </button>
              </>
            }
          >
            <QuestionEditor pkg={pkg} index={index} mutate={mutate} />

            {errors.length ? (
              <div className="cms-alert is-warn">
                <strong>{errors.length} masalah di paket ini</strong>
                <ul>
                  {errors.slice(0, 4).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
                {errors.length > 4 ? <small>+{errors.length - 4} lainnya</small> : null}
              </div>
            ) : (
              <div className="cms-alert is-ok">Semua soal valid — paket siap dipublikasikan.</div>
            )}
          </Panel>
        ) : (
          <Empty title="Soal tidak ditemukan" />
        )}
      </div>

      {importing ? (
        <ImportDialog
          pkg={pkg}
          index={index}
          mutate={mutate}
          onClose={() => setImporting(false)}
          onJump={setIndex}
        />
      ) : null}
    </div>
  );
}

function QuestionEditor({ pkg, index, mutate }) {
  const q = pkg.qs[index];
  const type = questionType(pkg, index);
  const isTkp = type === 'TKP';

  const set = (fn) =>
    mutate((state) => {
      const target = packageById(state, pkg.id);
      fn(target.qs[index], target);
    });

  return (
    <div className="cms-form">
      <label className="cms-field is-wide">
        <span className="cms-field-label">Teks soal</span>
        <textarea
          className="cms-input"
          rows={4}
          value={q.t || ''}
          placeholder="Tulis pertanyaan…"
          onChange={(e) => set((item) => (item.t = e.target.value))}
        />
      </label>

      <div className="cms-options">
        {LETTERS.map((letter, j) => {
          const isKey = !isTkp && q.a === j;
          return (
            <div key={letter} className={`cms-option${isKey ? ' is-key' : ''}`}>
              <span className="cms-option-letter">{letter}</span>
              <input
                className="cms-input"
                value={q.o?.[j] || ''}
                placeholder={`Opsi ${letter}`}
                onChange={(e) => set((item) => (item.o[j] = e.target.value))}
              />
              {isTkp ? (
                <select
                  className="cms-input is-weight"
                  value={q.w?.[j] == null ? '' : q.w[j]}
                  onChange={(e) => set((item) => (item.w[j] = e.target.value === '' ? null : Number(e.target.value)))}
                  title="Bobot poin TKP"
                >
                  <option value="">–</option>
                  {WEIGHTS.map((w) => (
                    <option key={w} value={w}>
                      {w} poin
                    </option>
                  ))}
                </select>
              ) : (
                <label className="cms-radio" title="Tandai sebagai kunci jawaban">
                  <input type="radio" name={`kunci-${index}`} checked={isKey} onChange={() => set((item) => (item.a = j))} />
                  <span>Kunci</span>
                </label>
              )}
            </div>
          );
        })}
      </div>

      {isTkp ? (
        <p className="cms-dim cms-hint">TKP tidak memakai kunci: tiap opsi diberi bobot 5 (paling tepat) sampai 1.</p>
      ) : (
        <p className="cms-dim cms-hint">
          Kunci terpilih: <b>{q.a != null ? LETTERS[q.a] : 'belum ada'}</b>
        </p>
      )}

      <label className="cms-field is-wide">
        <span className="cms-field-label">Pembahasan</span>
        <textarea
          className="cms-input"
          rows={3}
          value={q.pem || ''}
          placeholder="Tampil setelah siswa menjawab (opsional)"
          onChange={(e) => set((item) => (item.pem = e.target.value))}
        />
      </label>
    </div>
  );
}

const PARTS = { soal: '\u00a7', field: '\u00a6', line: '\u00b6' };

function decodeLines(text) {
  return (text || '').split(PARTS.line).join('\n').trim();
}

/**
 * Format resmi aplikasi (PROMPT3 di engine legacy): soal dipisah §,
 * bagian dipisah ¦, ganti baris ¶. Urutan: soal, opsi A-E, pembahasan, kunci.
 * Kunci opsional: huruf A-E (non-TKP) atau lima angka 1-5 (bobot TKP).
 */
function parseOfficialFormat(text) {
  const parse = window.parseSoal;
  if (typeof parse !== 'function') return [];
  return parse(text).map((it) => {
    const key = (it.key || '').trim();
    const errs = [];
    if (it.extra) errs.push('ada bagian setelah kunci yang diabaikan');
    const out = {
      t: it.t,
      o: [0, 1, 2, 3, 4].map((i) => (it.o || [])[i] || ''),
      pem: it.pem || '',
      a: null,
      w: [null, null, null, null, null],
      errs,
    };
    const digits = key.replace(/[^1-5]/g, '');
    if (/^[A-Ea-e]$/.test(key)) {
      out.a = 'ABCDE'.indexOf(key.toUpperCase());
    } else if (digits.length === 5 && [1, 2, 3, 4, 5].every((v) => digits.split(String(v)).length === 2)) {
      out.w = digits.split('').map(Number);
    } else if (key) {
      errs.push(`kunci "${key}" tidak valid`);
    }
    return out;
  });
}

/** Format lama berbasis penanda: [[SOAL]] … [[OPSI]] … [[KUNCI]] … [[BAHAS]]. */
function parseBracketFormat(text) {
  return text
    .split('[[SOAL]]')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((block) => {
      const [main, ...rest] = block.split('[[BAHAS]]');
      const chunks = main.split('[[OPSI]]');
      const t = decodeLines(chunks.shift());
      const o = ['', '', '', '', ''];
      const w = [null, null, null, null, null];
      let a = null;
      chunks.slice(0, 5).forEach((chunk, j) => {
        let value = chunk.trim();
        const marker = value.match(/^(\[\[(KUNCI|P[1-5])\]\]\s*)+/);
        if (marker) {
          if (marker[0].includes('[[KUNCI]]')) a = j;
          const weight = marker[0].match(/\[\[P([1-5])\]\]/);
          if (weight) w[j] = Number(weight[1]);
          value = value.slice(marker[0].length);
        }
        o[j] = decodeLines(value);
      });
      const errs = [];
      if (chunks.length > 5) errs.push('opsi lebih dari 5, sisanya diabaikan');
      return { t, o, pem: decodeLines(rest.join('[[BAHAS]]')), a, w, errs };
    });
}

function parseImportText(text) {
  if (!text.trim()) return [];
  if (text.includes(PARTS.soal) || text.includes(PARTS.field)) return parseOfficialFormat(text);
  if (text.includes('[[SOAL]]')) return parseBracketFormat(text);
  return [];
}

function ImportDialog({ pkg, index, mutate, onClose, onJump }) {
  const first = questionNumber(pkg, 0);
  const [text, setText] = useState('');
  const [start, setStart] = useState(first + index);
  const [overwrite, setOverwrite] = useState(false);
  const [message, setMessage] = useState(null);

  const run = () => {
    const parsed = parseImportText(text);
    if (!parsed.length) {
      setMessage({
        type: 'danger',
        text: 'Tidak ada soal terbaca. Format resmi memakai § sebagai pemisah soal dan ¦ antar bagian.',
      });
      return;
    }

    const len = pkg.qs.length;
    const startIndex = Math.max(0, Math.min(len - 1, Number(start) - 1 - (OFFSET[pkg.type] || 0)));
    const notes = [];
    let placed = 0;
    let skipped = 0;

    mutate((state) => {
      const target = packageById(state, pkg.id);
      parsed.forEach((it, k) => {
        const idx = startIndex + k;
        if (idx >= len) {
          notes.push(`${parsed.length - k} soal melebihi jumlah paket (${len})`);
          return;
        }
        const existing = target.qs[idx] || {};
        const filled = Boolean((existing.t || '').trim() || (existing.o || []).some((x) => (x || '').trim()) || existing.img);
        if (k > 0 && filled && !overwrite) {
          skipped++;
          return;
        }

        const type = questionType(target, idx);
        const next = { ...existing, t: it.t, o: it.o, pem: it.pem, img: '', oi: ['', '', '', '', ''] };
        if (type === 'TKP') {
          next.a = null;
          next.w = it.w;
          if (!(it.w || []).every((x) => x != null)) notes.push(`nomor ${questionNumber(target, idx)}: bobot TKP belum lengkap`);
        } else {
          next.a = it.a;
          next.w = [null, null, null, null, null];
          if (next.a == null) notes.push(`nomor ${questionNumber(target, idx)}: kunci belum ditandai`);
        }
        it.errs.forEach((e) => notes.push(`nomor ${questionNumber(target, idx)}: ${e}`));
        target.qs[idx] = next;
        placed++;
      });
    });

    setMessage({
      type: notes.length ? 'warn' : 'ok',
      text: `${placed} soal ditempel mulai nomor ${start}${skipped ? `, ${skipped} dilewati karena sudah terisi` : ''}.${
        notes.length ? ` ${notes.slice(0, 3).join('; ')}${notes.length > 3 ? ` (+${notes.length - 3} catatan lain)` : ''}` : ''
      }`,
    });
    if (placed) onJump(startIndex);
  };

  return (
    <div className="cms-modal-wrap">
      <div className="cms-drawer-scrim" onClick={onClose} />
      <div className="cms-modal" role="dialog" aria-modal="true" aria-label="Import soal">
        <header>
          <h3>Import soal</h3>
          <button type="button" className="cms-icon-btn" onClick={onClose} aria-label="Tutup">
            ✕
          </button>
        </header>
        <div className="cms-modal-body">
          <p className="cms-dim">
            Format resmi: pisahkan soal dengan <code>§</code>, pisahkan soal/opsi A-E/pembahasan dengan <code>¦</code>,
            ganti baris dengan <code>¶</code>. Kunci opsional di bagian terakhir (huruf A-E untuk non-TKP, atau lima
            angka bobot untuk TKP). Format lama <code>[[SOAL]]</code> juga masih diterima.
          </p>
          <textarea
            className="cms-input cms-mono"
            rows={12}
            value={text}
            placeholder={'Ibu kota Indonesia adalah¦Bandung¦Jakarta¦Surabaya¦Medan¦Makassar¦Jakarta adalah ibu kota negara saat ini§Soal berikutnya¦opsi A¦opsi B¦opsi C¦opsi D¦opsi E'}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="cms-form-grid">
            <label className="cms-field">
              <span className="cms-field-label">Mulai nomor</span>
              <input className="cms-input" type="number" value={start} onChange={(e) => setStart(Number(e.target.value) || first)} />
            </label>
            <label className="cms-field">
              <span className="cms-field-label">Terbaca</span>
              <input className="cms-input" readOnly value={`${parseImportText(text).length} soal`} />
            </label>
          </div>
          <label className="cms-check">
            <input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} />
            Timpa soal yang sudah terisi (bawaan: lewati)
          </label>
          {message ? <div className={`cms-alert is-${message.type}`}>{message.text}</div> : null}
        </div>
        <footer>
          <button type="button" className="cms-btn is-ghost" onClick={onClose}>
            Tutup
          </button>
          <button type="button" className="cms-btn is-primary" onClick={run}>
            Tempel ke bank soal
          </button>
        </footer>
      </div>
    </div>
  );
}
