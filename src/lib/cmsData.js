/**
 * Lapisan data panel CMS.
 *
 * Semua baca/tulis tetap lewat mesin legacy:
 *   getState()  -> objek S asli (referensi, bukan salinan)
 *   saveState() -> save() legacy (ikut memicu push Supabase di mode dual)
 *
 * Dengan begitu CMS tidak punya "database kedua" dan aturan normalisasi
 * (promoCut, promoPrice, dll) tetap dijalankan oleh kode yang sama dengan app.
 */
import { useCallback, useState } from 'react';

export const LETTERS = ['A', 'B', 'C', 'D', 'E'];
export const NEED = { SKD: 110, TWK: 30, TIU: 35, TKP: 45 };
export const OFFSET = { SKD: 0, TWK: 0, TIU: 30, TKP: 65 };
export const THRESHOLD = { TWK: 65, TIU: 80, TKP: 166 };

export function legacy() {
  return typeof window === 'undefined' ? null : window.__legacy;
}

export function getState() {
  return legacy()?.getS?.() || null;
}

export const STORE_KEY = 'kedinasan_v2';

/**
 * Simpan lewat mesin legacy. save() legacy menelan error (mis. kuota
 * localStorage penuh), jadi hasilnya diverifikasi dengan membaca ulang.
 * @returns {boolean} true kalau snapshot benar-benar tertulis ke perangkat.
 */
export function saveState() {
  const api = legacy();
  if (!api?.save) return false;
  api.save();
  try {
    return localStorage.getItem(STORE_KEY) === JSON.stringify(getState());
  } catch {
    return false;
  }
}

export function rupiah(value) {
  return `Rp${Number(value || 0).toLocaleString('id-ID')}`;
}

/** Sama dengan qType() legacy: SKD dipecah 30 TWK + 35 TIU + 45 TKP. */
export function questionType(p, index) {
  if (!p) return '';
  if (p.type !== 'SKD') return p.type;
  return index < 30 ? 'TWK' : index < 65 ? 'TIU' : 'TKP';
}

/** Nomor soal yang dilihat siswa (1-110 untuk SKD). */
export function questionNumber(p, index) {
  return (OFFSET[p?.type] || 0) + index + 1;
}

function filled(text, image) {
  return Boolean((text || '').trim() || image);
}

export function questionComplete(p, index) {
  const q = p?.qs?.[index];
  if (!q) return false;
  const type = questionType(p, index);
  const optionsReady = (q.o || []).every((o, j) => filled(o, (q.oi || [])[j]));
  const keyReady = type === 'TKP' ? (q.w || []).every((w) => w != null) : q.a != null;
  return filled(q.t, q.img) && optionsReady && keyReady;
}

/** Pakai validate() legacy kalau ada, supaya aturan validasi tidak bercabang. */
export function questionErrors(p) {
  if (typeof window.validate === 'function') {
    try {
      return window.validate(p) || [];
    } catch {
      /* jatuh ke versi lokal */
    }
  }
  const errors = [];
  (p?.qs || []).forEach((q, i) => {
    const n = questionNumber(p, i);
    const type = questionType(p, i);
    if (!filled(q.t, q.img)) errors.push(`Nomor ${n}: soal belum diisi`);
    (q.o || []).forEach((o, j) => {
      if (!filled(o, (q.oi || [])[j])) errors.push(`Nomor ${n}: opsi ${LETTERS[j]} kosong`);
    });
    if (type !== 'TKP' && q.a == null) errors.push(`Nomor ${n}: kunci jawaban belum dipilih`);
    if (type === 'TKP' && (q.w || []).includes(null)) errors.push(`Nomor ${n}: bobot poin TKP belum lengkap`);
  });
  return errors;
}

export function packageById(S, id) {
  return (S?.packages || []).find((p) => String(p.id) === String(id)) || null;
}

export function salesOf(S, id) {
  return (S?.sales || []).filter((x) => String(x.pid) === String(id));
}

/** Hook dasar: state legacy + fungsi ubah yang otomatis save + render ulang. */
export function useCmsState() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);
  const mutate = useCallback((fn) => {
    const S = getState();
    if (!S) return false;
    fn(S);
    const saved = saveState();
    setTick((t) => t + 1);
    return saved;
  }, []);
  return { S: getState(), tick, mutate, refresh };
}

/* ------------------------------------------------------------- gerbang -- */

const GATE_KEY = 'kedinasan_cms_gate';

/**
 * Akun demo bawaan panel CMS. Bisa diganti lewat Pengaturan → Akun Admin.
 * Disimpan lokal (hash SHA-256 + salt) — bukan pengamanan server.
 */
export const DEMO_ADMIN = { email: '1@gmail.com', password: '123456' };

export function syncRole() {
  try {
    return window.HermesSync?.role?.() || null;
  } catch {
    return null;
  }
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hashPass(text) {
  if (!window.crypto?.subtle) return `plain:${text}`;
  return toHex(await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
}

/**
 * @returns {{email?:string, name:string, salt:string, hash:string, at:number, demo?:boolean}|null}
 */
export function gateRecord() {
  try {
    const rec = JSON.parse(localStorage.getItem(GATE_KEY) || 'null');
    // Record versi lama (kunci saja, tanpa email) dianggap kosong dan diganti
    // akun demo oleh ensureDefaultGate().
    return rec && typeof rec.hash === 'string' && rec.salt && rec.email ? rec : null;
  } catch {
    return null;
  }
}

export function gateEmail() {
  return gateRecord()?.email || DEMO_ADMIN.email;
}

async function buildRecord(email, pass, name, demo) {
  const salt = toHex(window.crypto.getRandomValues(new Uint8Array(12)));
  return {
    email: String(email || '').trim(),
    name: name || 'Operator',
    salt,
    hash: await hashPass(salt + pass),
    at: Date.now(),
    demo: Boolean(demo),
  };
}

function saveRecord(record) {
  localStorage.setItem(GATE_KEY, JSON.stringify(record));
  return record;
}

/**
 * Pastikan selalu ada akun admin. Record lama (tanpa email) diganti akun demo
 * supaya kredensial bawaan 1@gmail.com / 123456 langsung bisa dipakai.
 */
export async function ensureDefaultGate() {
  const rec = gateRecord();
  if (rec && rec.email) return rec;
  return saveRecord(await buildRecord(DEMO_ADMIN.email, DEMO_ADMIN.password, 'Operator', true));
}

/** Simpan email + kunci admin baru (kunci di-hash, bukan plaintext). */
export async function setGateKey(email, pass, name) {
  return saveRecord(await buildRecord(email, pass, name, false));
}

export async function checkGateLogin(email, pass) {
  const rec = gateRecord();
  if (!rec || !rec.email) return false;
  if (String(email || '').trim().toLowerCase() !== String(rec.email).trim().toLowerCase()) return false;
  return (await hashPass(rec.salt + pass)) === rec.hash;
}

/** Verifikasi kunci saja (dipakai saat ganti email tanpa ganti kunci). */
export async function checkGateKey(pass) {
  const rec = gateRecord();
  if (!rec) return false;
  return (await hashPass(rec.salt + pass)) === rec.hash;
}

export async function resetGateToDemo() {
  localStorage.removeItem(GATE_KEY);
  return ensureDefaultGate();
}

export function clearGateKey() {
  localStorage.removeItem(GATE_KEY);
}
