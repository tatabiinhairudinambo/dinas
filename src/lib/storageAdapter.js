/**
 * Jembatan penyimpanan untuk mode dual (localStorage + Supabase).
 *
 * Engine legacy menyimpan seluruh state dengan satu panggilan:
 *     localStorage.setItem('kedinasan_v2', JSON.stringify(S))
 * dan membacanya sekali saat script dieksekusi. Karena itu titik potong paling
 * aman ada di Storage.prototype, bukan di 385 handler legacy:
 *
 *   getItem(key) -> mengembalikan salinan yang sudah dihidrasi dari Supabase
 *                   (dipanggil sebelum /legacy/app.js dimuat)
 *   setItem(key) -> memperbarui cache + memberi tahu sync untuk push (debounce)
 *
 * Semua ini hanya aktif kalau env Supabase terisi; tanpa env, objek ini tidak
 * pernah dipasang dan aplikasi berjalan persis seperti sebelumnya.
 */
const KEY = 'kedinasan_v2';
const META_KEY = 'kedinasan_v2_sync';

/** @type {{updatedAt: string|null, userId: string|null}} */
let meta = { updatedAt: null, userId: null };
let cache = null;
let installed = false;
let lastMeEmail = null;
const writeSubs = new Set();
const metaSubs = new Set();
/** @type {{get:(k:string)=>string|null,set:(k:string,v:string)=>void,remove:(k:string)=>void}|null} */
let raw = null;

function storageOf() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function parse(json) {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function readMeta() {
  const parsed = parse(storageOf()?.getItem(META_KEY));
  return {
    updatedAt: parsed?.updatedAt || null,
    userId: parsed?.userId || null,
  };
}

function writeMeta(next) {
  meta = { ...meta, ...next };
  try {
    storageOf()?.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    // storage penuh / mode privat: abaikan, meta hanya untuk resolusi konflik
  }
  metaSubs.forEach((fn) => fn(meta));
}

/** Pasang patch sekali. Aman dipanggil berulang. */
export function installStorageBridge() {
  if (installed) return;
  const storage = storageOf();
  if (!storage) return;
  installed = true;

  const proto = Object.getPrototypeOf(storage);
  raw = {
    get: proto.getItem.bind(storage),
    set: proto.setItem.bind(storage),
    remove: proto.removeItem.bind(storage),
  };

  cache = raw.get(KEY);
  meta = readMeta();
  lastMeEmail = parse(cache)?.me?.e || null;

  const isTarget = (ctx, key) => key === KEY && (ctx === storage || ctx === storageOf());

  proto.getItem = function (key) {
    if (isTarget(this, key)) return cache;
    return raw.get(key);
  };
  proto.setItem = function (key, value) {
    if (!isTarget(this, key)) return raw.set(key, value);
    cache = String(value);
    // write-through: localStorage asli tetap menjadi salinan terakhir, sehingga
    // reload tanpa sesi Supabase tidak kehilangan perubahan terbaru.
    raw.set(KEY, value);
    handleWrite(cache);
  };
  proto.removeItem = function (key) {
    if (!isTarget(this, key)) return raw.remove(key);
    cache = null;
    raw.remove(KEY);
    handleWrite(null);
  };
}

function handleWrite(value) {
  const parsed = parse(value);
  const meEmail = parsed?.me?.e || null;
  const signedOut = Boolean(lastMeEmail) && !meEmail;
  lastMeEmail = meEmail;
  writeMeta({ updatedAt: new Date().toISOString() });
  writeSubs.forEach((fn) => {
    try {
      fn({ value, parsed, signedOut });
    } catch (err) {
      console.error('[sync] listener simpan gagal:', err);
    }
  });
}

export function isBridgeInstalled() {
  return installed;
}

export function getSnapshotString() {
  return cache;
}

export function readLocalSnapshot() {
  return parse(cache);
}

/** Ganti snapshot tanpa memicu push (dipakai saat menarik data dari Supabase). */
export function applySnapshot(obj) {
  const json = JSON.stringify(obj);
  cache = json;
  lastMeEmail = obj?.me?.e || null;
  if (raw) raw.set(KEY, json);
  writeMeta({ updatedAt: meta.updatedAt || new Date().toISOString() });
}

export function getMeta() {
  return { ...meta };
}

export function setMeta(next) {
  writeMeta(next);
}

export function onSnapshotWrite(fn) {
  writeSubs.add(fn);
  return () => writeSubs.delete(fn);
}

export function onMetaChange(fn) {
  metaSubs.add(fn);
  return () => metaSubs.delete(fn);
}

export const SNAPSHOT_KEY = KEY;
