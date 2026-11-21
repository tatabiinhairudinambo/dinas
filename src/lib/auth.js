'use client';

import { defaultState } from './model.js';
import { getSnapshot, update } from './store.js';

function randomHex(len) {
  const b = new Uint8Array(len);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  return Uint8Array.from(String(hex).match(/.{2}/g).map((b) => parseInt(b, 16)));
}

export async function hashPassword(password, saltHex) {
  const salt = saltHex || randomHex(16);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(String(password)),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: hexToBytes(salt), iterations: 100000 },
    key,
    256,
  );
  const out = [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return 'pbk:' + salt + out;
}

export async function checkPassword(user, password) {
  const stored = user && user.p;
  if (typeof stored === 'string' && stored.startsWith('pbk:')) {
    const h = await hashPassword(password, stored.slice(4, 36));
    return h.slice(36) === stored.slice(36);
  }
  if (stored === password && password) return true;
  return false;
}

export function currentState() {
  return getSnapshot().data || defaultState();
}

export function login(email, password) {
  return (async () => {
    const e = String(email || '').trim();
    const u = currentState().users.find((x) => x.e === e);
    if (!u || !(await checkPassword(u, password))) return { ok: false, msg: 'Email atau kunci salah' };
    if (!u.v) return { ok: false, msg: 'Email belum diverifikasi' };
    update((S) => {
      S.me = {
        n: u.n,
        e: u.e,
        v: u.v,
        pic: u.pic || '',
        j: u.j || '',
        p: u.p,
      };
    });
    return { ok: true };
  })();
}

export async function register({ name, email, password, confirm }) {
  const n = String(name || '').trim();
  const e = String(email || '').trim().toLowerCase();
  if (!n || !e) return { ok: false, msg: 'Lengkapi semua kolom' };
  if (String(password || '').length < 6) return { ok: false, msg: 'Kunci minimal 6 digit' };
  if (password !== confirm) return { ok: false, msg: 'Konfirmasi kunci tidak cocok' };
  if (currentState().users.some((u) => u.e === e)) return { ok: false, msg: 'Email sudah terdaftar' };
  let p;
  try {
    p = await hashPassword(password);
  } catch {
    p = String(password);
  }
  update((S) => {
    S.users.push({ n, e, v: 0, pic: '', p, j: new Date().toISOString() });
  });
  return { ok: true, email: e };
}

export function verifyEmail(email) {
  update((S) => {
    const u = S.users.find((x) => x.e === email);
    if (u) u.v = 1;
  });
}

export function resetPassword(email, password, confirm) {
  const e = String(email || '').trim().toLowerCase();
  const u = currentState().users.find((x) => x.e === e);
  if (!u || String(password || '').length < 6 || password !== confirm) {
    return { ok: false, msg: 'Data pemulihan tidak valid' };
  }
  hashPassword(password).then((p) => {
    update((S) => {
      const t = S.users.find((x) => x.e === e);
      if (t) t.p = p;
    });
  });
  return { ok: true };
}

export function logout() {
  update((S) => {
    const u = S.users.find((x) => x.e === S.me?.e);
    if (u && S.me) Object.assign(u, S.me);
    S.me = null;
    S.exam = null;
  });
}

export function updateMe(patch) {
  update((S) => {
    if (!S.me) return;
    Object.assign(S.me, patch);
    const u = S.users.find((x) => x.e === S.me.e);
    if (u) Object.assign(u, patch);
  });
}

export function setPhoto(dataUrl) {
  updateMe({ pic: dataUrl });
}
