/**
 * Jembatan antara React dan mesin legacy (public/legacy/app.js).
 *
 * Urutan boot (penting):
 *   1. prepareSync()  -> pasang patch localStorage + tarik snapshot remote.
 *                        Harus selesai sebelum app.js membaca localStorage.
 *   2. /legacy/app.js -> engine merender layar pertama (render ditunda 1 microtask).
 *   3. bridge-override.js -> membuka window.__legacy dan membelokkan auth ke Supabase.
 *   4. bootstrapAfterLegacy() -> mulai push otomatis (debounce).
 *
 * Kenapa classic script (bukan import ESM):
 * seluruh kode legacy memakai binding global bersama (let/const tingkat atas)
 * dan dipanggil dari atribut inline seperti onclick="go('home')". Kalau
 * di-bundle, semua binding itu pindah ke scope modul dan UI mati total.
 */
import { bootstrapAfterLegacy, exposeSyncGlobal, prepareSync } from './sync.js';

const LEGACY_SRC = '/legacy/app.js';
const OVERRIDE_SRC = '/legacy/bridge-override.js';

/** @typedef {'idle'|'loading'|'ready'|'error'} LegacyStatus */

/** @type {LegacyStatus} */
let status = 'idle';
/** @type {Promise<void>|null} */
let booting = null;
/** @type {Set<(s: LegacyStatus) => void>} */
const listeners = new Set();

function setStatus(next) {
  status = next;
  listeners.forEach((fn) => {
    try {
      fn(next);
    } catch (err) {
      console.error('[WebKedinasan] listener status gagal:', err);
    }
  });
}

export function getLegacyStatus() {
  return status;
}

/** @param {(s: LegacyStatus) => void} fn */
export function onLegacyStatus(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Panggil render() milik engine legacy (mis. setelah data React berubah). */
export function refreshLegacy() {
  if (typeof window.__legacy?.render === 'function') return window.__legacy.render();
  if (typeof window.render === 'function') return window.render();
  return undefined;
}

function injectScript(src, marker) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-legacy="${marker}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.legacy = marker;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Gagal memuat ${src}`));
    document.body.appendChild(script);
  });
}

/** Muat engine legacy sekali saja. Aman dipanggil berulang. */
export function bootLegacy() {
  if (booting) return booting;

  booting = (async () => {
    setStatus('loading');
    try {
      await prepareSync();
    } catch (err) {
      // Sync opsional: kegagalan di sini tidak boleh menghalangi aplikasi.
      console.warn('[WebKedinasan] sinkronisasi dilewati:', err);
    }
    exposeSyncGlobal();

    await injectScript(LEGACY_SRC, 'app');
    await injectScript(OVERRIDE_SRC, 'bridge');
    setStatus('ready');

    try {
      bootstrapAfterLegacy();
    } catch (err) {
      console.warn('[WebKedinasan] bootstrap sync gagal:', err);
    }
  })().catch((err) => {
    setStatus('error');
    throw err;
  });

  return booting;
}

// Titik integrasi untuk kode legacy / konsol: window.HermesApp.refresh()
window.HermesApp = {
  ...(window.HermesApp || {}),
  refresh: refreshLegacy,
  get status() {
    return getLegacyStatus();
  },
};
