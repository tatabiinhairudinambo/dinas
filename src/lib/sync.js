/**
 * Sinkronisasi dual-mode.
 *
 * Tanpa env Supabase  -> mode 'local'   : perilaku sama persis seperti versi
 *                                        localStorage-only.
 * Dengan env Supabase -> mode 'supabase': snapshot state (key kedinasan_v2)
 *                                        disimpan per-user di tabel
 *                                        public.app_snapshots dengan RLS.
 *
 * Kenapa snapshot JSON, bukan tabel ternormalisasi: engine legacy memegang satu
 * objek `S` sebagai sumber kebenaran untuk 385 handler. Normalisasi (packages,
 * attempts, payments, ...) dilakukan bertahap setelah layar dipindah ke React â€”
 * lihat docs/MIGRATION.md dan docs/SUPABASE.md.
 *
 * Batasan yang harus diingat: penilaian ujian masih dihitung di browser
 * (`finish()` memakai kunci jawaban `q.a`). Snapshot ini menyelamatkan data dan
 * menyinkronkan perangkat, BUKAN anti-curang.
 */
import { getSupabase, isSupabaseEnabled } from './supabase.js';
import {
  applySnapshot,
  getMeta,
  getSnapshotString,
  installStorageBridge,
  onSnapshotWrite,
  readLocalSnapshot,
  setMeta,
} from './storageAdapter.js';

const TABLE = 'app_snapshots';
const CATALOG_TABLE = 'catalog';
const CATALOG_ID = 1;
const CATALOG_META_KEY = 'kedinasan_v2_catalog_at';
/**
 * Bagian state yang dibagikan ke semua akun lewat baris `catalog`.
 * Fase 3B: 'packages' tidak lagi lewat katalog bersama — paket disajikan dari
 * tabel server (packages/questions), katalog hanya metadata tampilan.
 */
const CATALOG_KEYS = [
  'seq',
  'banner',
  'bannerImg',
  'logo',
  'logoDark',
  'loginLogo',
  'loginLogoDark',
  'pay',
  'payList',
  'payAcc',
  'promos',
  'groups',
  'gseq',
];
const PUSH_DEBOUNCE = 1200;
const NET_TIMEOUT = 6000;
const BOOT_TIMEOUT = 3000;

/** @type {import('@supabase/supabase-js').Session|null} */
let session = null;
let pushTimer = null;
let pushing = false;
let bootPushNeeded = false;
let signingOut = false;
let wired = false;
/**
 * false sampai isi remote benar-benar diketahui. Selama false, push ditahan
 * supaya data lokal yang basi tidak menimpa snapshot remote yang lebih baru.
 */
let pullChecked = false;

/** Katalog bersama: hanya editor (tabel catalog_editors) yang boleh menulis. */
let catalogEditor = false;
let catalogEditorFor = null;
let catalogTimer = null;
let catalogPulling = false;

const statusSubs = new Set();
let status = {
  mode: 'local',
  signedIn: false,
  email: null,
  lastSync: null,
  error: null,
  catalogEditor: false,
  lastCatalog: null,
  catalogError: null,
  dbMissing: false,
};

export function getSyncStatus() {
  return { ...status };
}

/**
 * Peran user dari sesi Supabase (app_metadata/user_metadata), atau null kalau
 * belum ada sesi. CMS memakai ini duluan; kalau belum ada role, gerbang lokal
 * yang dipakai (lihat src/lib/cmsData.js).
 */
export function currentRole() {
  const user = session?.user;
  if (!user) return null;
  return user.app_metadata?.role || user.user_metadata?.role || 'authenticated';
}

export function onSyncStatus(fn) {
  statusSubs.add(fn);
  fn(getSyncStatus());
  return () => statusSubs.delete(fn);
}

function setStatus(patch) {
  status = { ...status, ...patch };
  statusSubs.forEach((fn) => {
    try {
      fn(getSyncStatus());
    } catch (err) {
      console.error('[sync] listener status gagal:', err);
    }
  });
}

function withTimeout(promise, ms, label = 'operasi') {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} melewati ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/* ------------------------------------------------- database belum siap ---- */

/**
 * Project Supabase baru / database di-reset: tabel belum dibuat. Jangan
 * memblokir login — aplikasi tetap jalan dengan data lokal dan menampilkan
 * instruksi yang jelas (bukan pesan mentah PostgREST).
 */
let dbMissing = false;

const DB_MISSING_MESSAGE =
  'Database Supabase belum disiapkan — data disimpan lokal. Jalankan docs/SUPABASE.sql lalu migrations 001–005 di SQL Editor, kemudian muat ulang halaman.';

function isMissingTableError(err) {
  const text = `${err?.message || err || ''} ${err?.code || ''} ${err?.details || ''}`;
  return /PGRST205|Could not find the table|schema cache/i.test(text);
}

function showDbBanner() {
  const id = 'web-kedinasan-db-banner';
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const banner = document.createElement('div');
  banner.id = id;
  banner.textContent =
    'Database Supabase belum disiapkan — data disimpan lokal. Jalankan docs/SUPABASE.sql lalu migrations 001–005 di SQL Editor, kemudian muat ulang.';
  banner.style.cssText =
    'position:fixed;top:0;left:0;right:0;z-index:9998;padding:10px 14px;font:13px system-ui,sans-serif;color:#3b2f00;background:#fbbf24;text-align:center';
  document.body.appendChild(banner);
}

function markDbMissing(err) {
  if (!dbMissing) {
    dbMissing = true;
    console.warn('[sync] tabel database belum ada:', err?.message || err);
    showDbBanner();
  }
  setStatus({ dbMissing: true, error: DB_MISSING_MESSAGE });
}

/* ------------------------------------------------------- bentuk data ---- */

/** Buang kunci akun plaintext sebelum data meninggalkan perangkat. */
function sanitize(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return snapshot;
  const clone = JSON.parse(JSON.stringify(snapshot));
  if (Array.isArray(clone.users)) {
    clone.users = clone.users.map((u) => {
      if (u && typeof u === 'object' && 'p' in u) {
        const { p, ...rest } = u;
        return rest;
      }
      return u;
    });
  }
  if (clone.me && typeof clone.me === 'object' && 'p' in clone.me) {
    const { p, ...rest } = clone.me;
    clone.me = rest;
  }
  return clone;
}

/** Kunci akun tidak pernah ikut ke server; saat menarik data, pakai milik lokal. */
function restoreSecrets(remote, local) {
  if (!remote || !Array.isArray(remote.users) || !Array.isArray(local?.users)) return remote;
  const secrets = new Map(
    local.users.filter((u) => u && u.e && typeof u.p === 'string').map((u) => [u.e, u.p]),
  );
  remote.users.forEach((u) => {
    if (u && u.e && secrets.has(u.e)) u.p = secrets.get(u.e);
  });
  if (remote.me && remote.me.e && secrets.has(remote.me.e)) remote.me.p = secrets.get(remote.me.e);
  return remote;
}

/* ------------------------------------------------------------- pull/push */

async function pullRemote(user, timeout = NET_TIMEOUT) {
  const sb = await getSupabase();
  const { data, error } = await withTimeout(
    sb.from(TABLE).select('data,updated_at').eq('user_id', user.id).maybeSingle(),
    timeout,
    'tarik snapshot',
  );
  if (error) {
    if (isMissingTableError(error)) {
      markDbMissing(error);
      pullChecked = true;
      return { found: false, missing: true, remoteAt: 0 };
    }
    throw error;
  }
  if (!data) {
    pullChecked = true;
    return { found: false, remoteAt: 0 };
  }

  const remoteAt = Date.parse(data.updated_at || '') || 0;
  const localAt = Date.parse(getMeta().updatedAt || '') || 0;
  const remoteNewer = remoteAt > localAt + 1000;
  const localEmpty = !readLocalSnapshot();

  if (remoteNewer || localEmpty) {
    const merged = restoreSecrets(data.data, readLocalSnapshot());
    applySnapshot(merged);
    setMeta({ updatedAt: new Date(remoteAt).toISOString(), userId: user.id });
    pullChecked = true;
    return { found: true, remoteAt, applied: true };
  }

  bootPushNeeded = true;
  pullChecked = true;
  return { found: true, remoteAt, applied: false };
}

async function pushRemote() {
  if (pushing || !isSupabaseEnabled() || dbMissing) return;
  const sb = await getSupabase();
  const { data } = await sb.auth.getSession();
  const user = data?.session?.user;
  if (!user) return;

  // Kalau isi remote belum diketahui (boot offline / lambat), cek dulu.
  // Tanpa ini, data lokal yang basi bisa menimpa snapshot remote terbaru.
  if (!pullChecked) {
    try {
      const result = await pullRemote(user);
      if (result.missing) return;
      if (result.applied) {
        if (typeof window.__legacy?.replaceState === 'function') {
          window.__legacy.replaceState(readLocalSnapshot());
        }
        return;
      }
    } catch (err) {
      console.warn('[sync] push ditahan, tarik snapshot gagal:', err?.message || err);
      return;
    }
  }

  const rawJson = getSnapshotString();
  if (!rawJson) return;

  pushing = true;
  try {
    const payload = sanitize(JSON.parse(rawJson));
    const updatedAt = new Date().toISOString();
    const { error } = await withTimeout(
      sb.from(TABLE).upsert(
        { user_id: user.id, email: user.email, data: payload, updated_at: updatedAt },
        { onConflict: 'user_id' },
      ),
      NET_TIMEOUT,
      'kirim snapshot',
    );
    if (error) throw error;
    setMeta({ updatedAt, userId: user.id });
    setStatus({ lastSync: updatedAt, error: null });
  } catch (err) {
    if (isMissingTableError(err)) {
      markDbMissing(err);
    } else {
      setStatus({ error: String(err?.message || err) });
    }
    console.warn('[sync] push gagal:', err);
  } finally {
    pushing = false;
  }
}

function schedulePush(delay = PUSH_DEBOUNCE) {
  if (!isSupabaseEnabled() || dbMissing) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => void pushRemote(), delay);
}

/* ------------------------------------------------------------- katalog ---- */

function readCatalogAt() {
  try {
    return Number(localStorage.getItem(CATALOG_META_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeCatalogAt(at) {
  try {
    localStorage.setItem(CATALOG_META_KEY, String(at || 0));
  } catch {
    /* kuota / mode privat: penanda versi katalog boleh hilang */
  }
}

function catalogSubset(snapshot) {
  const out = {};
  CATALOG_KEYS.forEach((key) => {
    if (snapshot && snapshot[key] !== undefined) out[key] = snapshot[key];
  });
  return out;
}

/** true kalau user terdaftar sebagai editor di public.catalog_editors (by user_id). */
async function checkCatalogEditor(sb, user) {
  if (!user?.id) return false;
  if (catalogEditorFor === user.id) return catalogEditor;
  try {
    const { data, error } = await withTimeout(
      sb.from('catalog_editors').select('user_id').eq('user_id', user.id).maybeSingle(),
      NET_TIMEOUT,
      'cek editor katalog',
    );
    catalogEditorFor = user.id;
    catalogEditor = !error && Boolean(data);
    if (error && isMissingTableError(error)) markDbMissing(error);
  } catch {
    catalogEditor = false;
  }
  setStatus({ catalogEditor });
  return catalogEditor;
}

/** Terapkan isi katalog ke snapshot lokal (tanpa memicu push). */
async function pullCatalog(timeout = NET_TIMEOUT) {
  if (!isSupabaseEnabled() || !session?.user) return { applied: false };
  if (catalogPulling) return { applied: false };
  catalogPulling = true;
  try {
    const sb = await getSupabase();
    const { data, error } = await withTimeout(
      sb.from(CATALOG_TABLE).select('data,updated_at').eq('id', CATALOG_ID).maybeSingle(),
      timeout,
      'tarik katalog',
    );
    if (error) throw error;
    if (!data?.data) return { found: false, applied: false };

    const remoteAt = Date.parse(data.updated_at || '') || 0;
    if (remoteAt && remoteAt <= readCatalogAt()) return { found: true, applied: false };

    const local = readLocalSnapshot();
    // Belum ada state lokal: biarkan legacy membuat state awal, katalog
    // diterapkan setelah engine siap lewat refreshCatalog().
    if (!local) return { found: true, applied: false };

    const next = { ...local };
    let changed = false;
    CATALOG_KEYS.forEach((key) => {
      if (data.data[key] === undefined) return;
      if (JSON.stringify(next[key]) === JSON.stringify(data.data[key])) return;
      next[key] = data.data[key];
      changed = true;
    });
    if (!changed) {
      if (remoteAt) writeCatalogAt(remoteAt);
      return { found: true, applied: false };
    }
    applySnapshot(next);
    if (remoteAt) writeCatalogAt(remoteAt);
    setStatus({ catalogError: null });
    return { found: true, applied: true };
  } catch (err) {
    if (isMissingTableError(err)) {
      markDbMissing(err);
      setStatus({ catalogError: DB_MISSING_MESSAGE });
    } else {
      setStatus({ catalogError: String(err?.message || err) });
    }
    console.warn('[sync] tarik katalog gagal:', err);
    return { applied: false };
  } finally {
    catalogPulling = false;
  }
}

/** Kirim katalog dari state lokal. Hanya email di catalog_editors yang lolos RLS. */
export async function pushCatalog() {
  if (!isSupabaseEnabled() || !session?.user) return { ok: false, reason: 'signed-out' };
  try {
    const sb = await getSupabase();
    if (!(await checkCatalogEditor(sb, session.user))) return { ok: false, reason: 'not-editor' };
    const raw = getSnapshotString();
    if (!raw) return { ok: false, reason: 'empty' };

    const data = catalogSubset(JSON.parse(raw));
    const { data: saved, error } = await withTimeout(
      sb
        .from(CATALOG_TABLE)
        .upsert(
          { id: CATALOG_ID, data, updated_by: session.user.email },
          { onConflict: 'id' },
        )
        .select('updated_at')
        .maybeSingle(),
      NET_TIMEOUT,
      'kirim katalog',
    );
    if (error) throw error;

    const at = Date.parse(saved?.updated_at || '') || 0;
    if (at) writeCatalogAt(at);
    setStatus({ lastCatalog: saved?.updated_at || new Date().toISOString(), catalogError: null });
    return { ok: true, updatedAt: saved?.updated_at || null };
  } catch (err) {
    if (isMissingTableError(err)) {
      markDbMissing(err);
      setStatus({ catalogError: DB_MISSING_MESSAGE });
      return { ok: false, reason: 'db-missing', message: DB_MISSING_MESSAGE };
    }
    setStatus({ catalogError: String(err?.message || err) });
    console.warn('[sync] push katalog gagal:', err);
    return { ok: false, reason: 'error', message: String(err?.message || err) };
  }
}

function scheduleCatalogPush(delay = PUSH_DEBOUNCE) {
  if (!isSupabaseEnabled() || !session?.user || !catalogEditor) return;
  clearTimeout(catalogTimer);
  catalogTimer = setTimeout(() => void pushCatalog(), delay);
}

/** Tarik katalog lalu tampilkan ulang layar legacy kalau isinya berubah. */
export async function refreshCatalog() {
  const res = await pullCatalog();
  if (res.applied && typeof window.__legacy?.replaceState === 'function') {
    window.__legacy.replaceState(readLocalSnapshot());
  }
  return res;
}

export function isCatalogEditor() {
  return catalogEditor;
}

/* ------------------------------------------- server-authoritative (F3B) ---- */

/**
 * Bentuk paket legacy (S.packages[i]): {id,name,type,price,promo,desc,pub,
 * hidden,promoOn,promoPrice,promoCut,exp,thumb,rel,sim,qs:[...]}.
 * Tabel server: packages + questions (tanpa kunci) + question_keys.
 * qType engine (app.js:27): SKD → idx<30 TWK, idx<65 TIU, else TKP.
 */
function questionTypeOf(pkgType, idx) {
  if (pkgType === 'SKD') return idx < 30 ? 'TWK' : idx < 65 ? 'TIU' : 'TKP';
  return pkgType;
}

/** Susun S.packages[i].qs dari questions + question_keys server. */
function mergeQuestionRows(qRows, kRows) {
  const keys = new Map((kRows || []).map((r) => [Number(r.idx), r]));
  return (qRows || [])
    .slice()
    .sort((a, b) => Number(a.idx) - Number(b.idx))
    .map((r) => {
      const k = keys.get(Number(r.idx)) || {};
      return {
        t: r.text || '',
        o: Array.isArray(r.options) ? r.options : [],
        oi: Array.isArray(r.oi) ? r.oi : [],
        a: k.key === null || k.key === undefined ? null : Number(k.key),
        w: Array.isArray(k.weights) ? k.weights : [null, null, null, null, null],
        pem: k.pem || '',
        img: r.img || '',
      };
    });
}

/** Ambil paket + soal + kunci dari server (editor boleh semuanya). */
export async function fetchServerPackages() {
  if (!isSupabaseEnabled() || !session?.user) return null;
  try {
    const sb = await getSupabase();
    const [pkgs, qs, ks] = await Promise.all([
      withTimeout(
        sb.from('packages').select('*').order('id'),
        NET_TIMEOUT,
        'tarik paket',
      ),
      withTimeout(
        sb.from('questions').select('package_id,idx,text,img,oi,type,options').order('idx'),
        NET_TIMEOUT,
        'tarik soal',
      ),
      sb.from('question_keys').select('package_id,idx,key,weights,pem'),
    ]);
    if (pkgs.error) throw pkgs.error;
    // Siswa bukan editor: tabel question_keys tertutup RLS → error wajar.
    const keyRows = ks.error ? [] : ks.data || [];
    const byPkgQ = new Map();
    (qs.error ? [] : qs.data || []).forEach((r) => {
      const pid = Number(r.package_id);
      if (!byPkgQ.has(pid)) byPkgQ.set(pid, []);
      byPkgQ.get(pid).push(r);
    });
    const byPkgK = new Map();
    keyRows.forEach((r) => {
      const pid = Number(r.package_id);
      if (!byPkgK.has(pid)) byPkgK.set(pid, []);
      byPkgK.get(pid).push(r);
    });
    return (pkgs.data || []).map((row) => {
      const type = row.type || 'SKD';
      const legacy = {
        id: Number(row.id),
        name: row.name || '',
        type,
        price: Number(row.price) || 0,
        promo: Number(row.promo) || 0,
        desc: row.desc || '',
        pub: row.pub ? 1 : 0,
        hidden: row.hidden ? 1 : 0,
        promoOn: row.promo_on ? 1 : 0,
        promoPrice: Number(row.promo_price) || 0,
        promoCut: Number(row.promo_cut) || 0,
        exp: row.exp || '',
        thumb: row.thumb || '',
        rel: row.rel || '',
        sim: row.sim ? 1 : 0,
        amal: row.amal || undefined,
      };
      if (legacy.amal === undefined) delete legacy.amal;
      legacy.qs = mergeQuestionRows(byPkgQ.get(legacy.id) || [], byPkgK.get(legacy.id) || []);
      return legacy;
    });
  } catch (err) {
    console.warn('[sync] tarik paket server gagal:', err?.message || err);
    return null;
  }
}

/** Entitlements + skor attempt (done) milik user aktif → {owned, res}. */
export async function fetchServerOwnership() {
  if (!isSupabaseEnabled() || !session?.user) return null;
  try {
    const sb = await getSupabase();
    const [ent, att] = await Promise.all([
      withTimeout(
        sb.from('entitlements').select('package_id,source,created_at').eq('user_id', session.user.id),
        NET_TIMEOUT,
        'tarik kepemilikan',
      ),
      withTimeout(
        sb.from('attempts')
          .select('package_id,score,ended_at')
          .eq('user_id', session.user.id)
          .eq('status', 'done')
          .order('ended_at', { ascending: true }),
        NET_TIMEOUT,
        'tarik hasil ujian',
      ),
    ]);
    if (ent.error) throw ent.error;
    const owned = {};
    const claimed = {};
    const sourceBy = {};
    (ent.data || []).forEach((r) => {
      owned[Number(r.package_id)] = Date.parse(r.created_at || '') || Date.now();
      sourceBy[Number(r.package_id)] = r.source;
      if (r.source === 'claim' || r.source === 'free') {
        const email = (session.user.email || '').toLowerCase();
        claimed[email] = claimed[email] || {};
        claimed[email][Number(r.package_id)] = 1;
      }
    });
    const res = {};
    (att.error ? [] : att.data || []).forEach((r) => {
      if (!r.score) return;
      const pid = Number(r.package_id);
      const prev = res[pid];
      // Skor terakhir (ended_at terkecil → terbesar; selalu timpa = terakhir).
      res[pid] = { ...r.score, ...(prev && prev.n ? { n: prev.n } : {}) };
    });
    return { owned, claimed, res, sourceBy };
  } catch (err) {
    console.warn('[sync] tarik kepemilikan gagal:', err?.message || err);
    return null;
  }
}

/**
 * Hydrate state legacy dari server: paket (metadata+soal+kunci utk editor),
 * owned/res/claimed dari entitlements/attempts. Aman dipanggil berulang.
 * Dipanggil setelah login & setelah engine siap; mode lokal: no-op.
 */
export async function hydrateServerState() {
  if (!isSupabaseEnabled() || !session?.user) return { ok: false, reason: 'signed-out' };
  const legacy = window.__legacy;
  if (!legacy) return { ok: false, reason: 'legacy-not-ready' };
  const [pkgs, own] = await Promise.all([fetchServerPackages(), fetchServerOwnership()]);
  if (!pkgs && !own) return { ok: false, reason: 'error' };
  const S = legacy.getS();
  if (pkgs && pkgs.length) S.packages = pkgs;
  if (own) {
    S.owned = own.owned;
    S.res = own.res;
    if (own.claimed && Object.keys(own.claimed).length) S.claimed = own.claimed;
  }
  legacy.save();
  if (typeof window.__legacy?.replaceState === 'function') {
    window.__legacy.replaceState(S);
  }
  return { ok: true };
}

/* ------------------------------------------------- RPC alur siswa (F3B) ---- */

/** Mulai ujian via server. Returns {ok, attemptId, questions|message}. */
export async function startAttempt(packageId) {
  if (!isSupabaseEnabled() || !session?.user) return { ok: false, reason: 'signed-out' };
  try {
    const sb = await getSupabase();
    const { data, error } = await withTimeout(
      sb.rpc('start_attempt', { p_package_id: Number(packageId) }),
      NET_TIMEOUT,
      'mulai ujian',
    );
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.attempt_id) return { ok: false, reason: 'error', message: 'Server tidak mengembalikan attempt.' };
    return { ok: true, attemptId: row.attempt_id, questions: row.questions || [] };
  } catch (err) {
    return { ok: false, reason: 'error', message: String(err?.message || err) };
  }
}

/** Kirim jawaban ke server; score dihitung server. Returns {ok, score|message}. */
export async function submitAttempt(attemptId, answers) {
  if (!isSupabaseEnabled() || !session?.user) return { ok: false, reason: 'signed-out' };
  try {
    const sb = await getSupabase();
    const payload = {};
    Object.keys(answers || {}).forEach((k) => {
      if (answers[k] !== null && answers[k] !== undefined) payload[k] = answers[k];
    });
    const { data, error } = await withTimeout(
      sb.rpc('submit_attempt', { p_attempt_id: attemptId, p_answers: payload }),
      NET_TIMEOUT,
      'kirim jawaban',
    );
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return { ok: false, reason: 'error', message: 'Server tidak mengembalikan nilai.' };
    return { ok: Boolean(row.ok), score: row.score || null };
  } catch (err) {
    return { ok: false, reason: 'error', message: String(err?.message || err) };
  }
}

/** Buat invoice pembayaran di server. Returns {ok, paymentId, amount|message}. */
export async function createPayment(packageId, method, promoCode) {
  if (!isSupabaseEnabled() || !session?.user) return { ok: false, reason: 'signed-out' };
  try {
    const sb = await getSupabase();
    const { data, error } = await withTimeout(
      sb.rpc('create_payment', {
        p_package_id: Number(packageId),
        p_method: String(method || 'QRIS'),
        p_promo_code: promoCode || null,
      }),
      NET_TIMEOUT,
      'buat pembayaran',
    );
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.payment_id) return { ok: false, reason: 'error', message: 'Server tidak membuat invoice.' };
    return { ok: true, paymentId: row.payment_id, amount: Number(row.amount) || 0 };
  } catch (err) {
    return { ok: false, reason: 'error', message: String(err?.message || err) };
  }
}

/** Simulasi transfer berhasil (siswa). Returns {ok|message}. */
export async function markPaymentPaid(paymentId) {
  if (!isSupabaseEnabled() || !session?.user) return { ok: false, reason: 'signed-out' };
  try {
    const sb = await getSupabase();
    const { error } = await withTimeout(
      sb.rpc('mark_payment_paid', { p_payment_id: paymentId }),
      NET_TIMEOUT,
      'konfirmasi pembayaran',
    );
    if (error) throw error;
    const own = await fetchServerOwnership();
    if (own) {
      const S = window.__legacy?.getS?.();
      if (S) {
        S.owned = own.owned;
        S.res = own.res;
        window.__legacy?.save?.();
      }
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: 'error', message: String(err?.message || err) };
  }
}

/* --------------------------------------------- push paket (editor, F3B) ---- */

/** Pecah paket legacy → baris packages/questions/question_keys lalu upsert. */
export async function pushPackagesToServer(packageList) {
  if (!isSupabaseEnabled() || !session?.user) return { ok: false, reason: 'signed-out' };
  try {
    const sb = await getSupabase();
    if (!(await checkCatalogEditor(sb, session.user))) return { ok: false, reason: 'not-editor' };
    const pkgs = [];
    const qs = [];
    const ks = [];
    (packageList || []).forEach((p) => {
      if (!p || p.id == null) return;
      pkgs.push({
        id: Number(p.id),
        name: p.name || '',
        type: p.type || 'SKD',
        price: Number(p.price) || 0,
        promo: Number(p.promo) || 0,
        desc: p.desc || '',
        pub: Boolean(p.pub),
        hidden: Boolean(p.hidden),
        promo_on: Boolean(p.promoOn),
        promo_price: Number(p.promoPrice) || 0,
        promo_cut: Number(p.promoCut) || 0,
        exp: p.exp || null,
        thumb: p.thumb || null,
        rel: p.rel || null,
        sim: Boolean(p.sim),
      });
      (p.qs || []).forEach((q, idx) => {
        const isTkp = questionTypeOf(p.type, idx) === 'TKP';
        qs.push({
          package_id: Number(p.id),
          idx,
          text: q.t || '',
          img: q.img || null,
          oi: Array.isArray(q.oi) && q.oi.length ? q.oi : null,
          type: questionTypeOf(p.type, idx),
          options: Array.isArray(q.o) ? q.o : [],
        });
        ks.push({
          package_id: Number(p.id),
          idx,
          key: isTkp ? null : q.a == null ? null : Number(q.a),
          weights: isTkp && Array.isArray(q.w) ? q.w.map((w) => (w == null ? 0 : Number(w))) : null,
          pem: q.pem || null,
        });
      });
    });
    const chunk = (arr, n) => {
      const out = [];
      for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
      return out;
    };
    for (const part of chunk(pkgs, 50)) {
      const { error } = await withTimeout(sb.rpc('upsert_packages', { p_rows: part }), NET_TIMEOUT, 'kirim paket');
      if (error) throw error;
    }
    for (const part of chunk(qs, 200)) {
      const { error } = await withTimeout(sb.rpc('upsert_questions', { p_rows: part }), NET_TIMEOUT, 'kirim soal');
      if (error) throw error;
    }
    for (const part of chunk(ks, 200)) {
      const { error } = await withTimeout(sb.rpc('upsert_question_keys', { p_rows: part }), NET_TIMEOUT, 'kirim kunci');
      if (error) throw error;
    }
    return { ok: true };
  } catch (err) {
    setStatus({ catalogError: String(err?.message || err) });
    return { ok: false, reason: 'error', message: String(err?.message || err) };
  }
}

/* ------------------------------------------------------------------ auth */

async function applyRemoteAndRefresh(user) {
  const result = await pullRemote(user);
  if (result.applied && typeof window.__legacy?.replaceState === 'function') {
    window.__legacy.replaceState(readLocalSnapshot());
  }
  return result;
}

/** @returns {Promise<{ok:boolean, reason?:string, message?:string}>} */
export async function loginWithPassword(email, password) {
  if (!isSupabaseEnabled()) return { ok: false, reason: 'disabled' };
  try {
    const sb = await getSupabase();
    const { data, error } = await withTimeout(
      sb.auth.signInWithPassword({ email, password }),
      NET_TIMEOUT,
      'masuk Supabase',
    );
    if (error || !data?.user) {
      const message = error?.message || 'kredensial ditolak';
      setStatus({ error: message });
      const unverified = /email not confirmed|email.*not.*verified/i.test(message);
      return { ok: false, reason: unverified ? 'unverified' : 'invalid', message };
    }
    session = data.session;
    setStatus({ signedIn: true, error: null, email: data.user.email });

    await applyRemoteAndRefresh(data.user);
    await checkCatalogEditor(sb, data.user);
    const catalog = await pullCatalog();
    if (catalog.applied && typeof window.__legacy?.replaceState === 'function') {
      window.__legacy.replaceState(readLocalSnapshot());
    }
    await hydrateServerState();
    attachLocalIdentity(email, password);
    schedulePush(0);
    return { ok: true };
  } catch (err) {
    const message = String(err?.message || err);
    setStatus({ error: message });
    console.warn('[sync] login gagal:', err);
    return { ok: false, reason: 'error', message };
  }
}

/**
 * Login dari panel CMS. Beda dengan login siswa: kalau kredensial Supabase
 * ditolak, status error global tidak diubah â€” gate CMS tetap boleh terbuka
 * dalam mode lokal (unggahan jatuh ke data URL).
 */
export async function connectForCms(email, password) {
  if (!isSupabaseEnabled()) return { ok: false, reason: 'disabled' };
  try {
    const sb = await getSupabase();
    const { data, error } = await withTimeout(
      sb.auth.signInWithPassword({ email, password }),
      NET_TIMEOUT,
      'masuk Supabase',
    );
    if (error || !data?.user) {
      return { ok: false, reason: 'invalid', message: error?.message || 'kredensial ditolak' };
    }
    session = data.session;
    catalogEditorFor = null;
    setStatus({ signedIn: true, error: null, email: data.user.email });
    await applyRemoteAndRefresh(data.user);
    await checkCatalogEditor(sb, data.user);
    await refreshCatalog();
    schedulePush(0);
    return { ok: true, email: data.user.email, editor: catalogEditor };
  } catch (err) {
    return { ok: false, reason: 'error', message: String(err?.message || err) };
  }
}

/** @returns {Promise<{ok:boolean, needsOtp?:boolean, reason?:string, message?:string}>} */
export async function signUpWithPassword(email, password) {
  if (!isSupabaseEnabled()) return { ok: false, reason: 'disabled' };
  try {
    const sb = await getSupabase();
    const { data, error } = await withTimeout(
      sb.auth.signUp({ email, password }),
      NET_TIMEOUT,
      'daftar Supabase',
    );
    if (error) {
      const message = humanizeAuthEmailError(error.message);
      setStatus({ error: message });
      console.warn('[sync] daftar gagal:', error.message);
      return { ok: false, reason: 'error', message };
    }
    if (!data.session) {
      // Supabase menyamarkan email terdaftar: user tanpa identities = duplikat.
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setStatus({ error: 'Email sudah terdaftar' });
        return { ok: false, reason: 'exists', message: 'Email sudah terdaftar. Silakan masuk.' };
      }
      // mailer_autoconfirm = false: email konfirmasi/kode sudah dikirim.
      setStatus({ error: null });
      return { ok: true, needsOtp: true };
    }
    session = data.session;
    setStatus({ signedIn: true, error: null, email: data.user.email });
    schedulePush(0);
    return { ok: true };
  } catch (err) {
    const message = String(err?.message || err);
    setStatus({ error: message });
    console.warn('[sync] daftar gagal:', err);
    return { ok: false, reason: 'error', message };
  }
}

/** Verifikasi kode 6 digit dari email konfirmasi Supabase. */
export async function verifyEmailOtp(email, token) {
  if (!isSupabaseEnabled()) return { ok: false, reason: 'disabled' };
  const code = String(token || '').replace(/\D/g, '');
  if (code.length !== 6) return { ok: false, reason: 'invalid', message: 'Kode harus 6 digit.' };
  try {
    const sb = await getSupabase();
    let { data, error } = await withTimeout(
      sb.auth.verifyOtp({ email, token: code, type: 'signup' }),
      NET_TIMEOUT,
      'verifikasi email',
    );
    // Sebagian email memakai token tipe "email" (magic link). Coba sekali lagi.
    if (error && !data?.session) {
      const retry = await withTimeout(
        sb.auth.verifyOtp({ email, token: code, type: 'email' }),
        NET_TIMEOUT,
        'verifikasi email',
      ).catch(() => ({ data: null, error }));
      if (retry.data?.session) {
        data = retry.data;
        error = null;
      }
    }
    if (error || !data?.session) {
      const message = error?.message || 'Kode tidak valid atau sudah kedaluwarsa.';
      setStatus({ error: message });
      return { ok: false, reason: 'invalid', message };
    }
    session = data.session;
    setStatus({ signedIn: true, error: null, email: data.user.email });
    await applyRemoteAndRefresh(data.user);
    await checkCatalogEditor(sb, data.user);
    const catalog = await pullCatalog();
    if (catalog.applied && typeof window.__legacy?.replaceState === 'function') {
      window.__legacy.replaceState(readLocalSnapshot());
    }
    if (!markLocalVerified(email, true)) attachVerifiedIdentity(email);
    markEmailVerified(email);
    schedulePush(0);
    return { ok: true };
  } catch (err) {
    const message = String(err?.message || err);
    setStatus({ error: message });
    console.warn('[sync] verifikasi email gagal:', err);
    return { ok: false, reason: 'error', message };
  }
}

/**
 * Terjemahkan error email GoTrue: batas kirim berlaku PER PROYEK (bukan per
 * alamat), jadi ganti email tidak menolong. Solusi: tunggu, pasang SMTP
 * sendiri, atau matikan "Confirm email" untuk uji.
 */
function humanizeAuthEmailError(message) {
  const m = String(message || '');
  if (/rate limit/i.test(m)) {
    return 'Batas kirim email Supabase tercapai (batas per proyek — berlaku untuk semua alamat). Tunggu ±1 jam, pasang SMTP sendiri di Authentication → Emails, atau matikan sementara "Confirm email" untuk uji.';
  }
  if (/email_address_invalid/i.test(m) || /invalid email/i.test(m)) {
    return 'Alamat email ditolak server. Pakai alamat yang benar-benar aktif (mis. Gmail).';
  }
  return m;
}

/** Catat verifikasi email di snapshot akun (dipakai gerbang order). */
function markEmailVerified(email) {
  const legacy = window.__legacy;
  if (!legacy || !email) return;
  const S = legacy.getS();
  S.emailVerified = String(email).toLowerCase();
  S.emailVerifiedAt = Date.now();
  legacy.save();
}

/** Apakah email akun aktif sudah diverifikasi (mode lokal: selalu true). */
export function isEmailVerified() {
  if (!isSupabaseEnabled()) return true;
  const S = window.__legacy?.getS?.();
  if (!S) return true;
  const email = String(session?.user?.email || S.me?.e || '').toLowerCase();
  return Boolean(email) && String(S.emailVerified || '').toLowerCase() === email;
}

/**
 * Kirim kode verifikasi email untuk gerbang order (setelah user masuk).
 * Memakai OTP email Supabase (shouldCreateUser:false — akun sudah ada).
 * Template "Magic Link" di dashboard harus memuat {{ .Token }}.
 */
export async function sendVerifyCode(email) {
  if (!isSupabaseEnabled()) return { ok: false, reason: 'disabled' };
  const target = String(email || session?.user?.email || '').toLowerCase();
  if (!target) return { ok: false, reason: 'invalid', message: 'Email belum diketahui.' };
  try {
    const sb = await getSupabase();
    const { error } = await withTimeout(
      sb.auth.signInWithOtp({ email: target, options: { shouldCreateUser: false } }),
      NET_TIMEOUT,
      'kirim kode verifikasi',
    );
    if (error) {
      const message = humanizeAuthEmailError(error.message);
      setStatus({ error: message });
      return { ok: false, reason: 'error', message };
    }
    return { ok: true };
  } catch (err) {
    const message = String(err?.message || err);
    setStatus({ error: message });
    return { ok: false, reason: 'error', message };
  }
}

/** Kirim ulang kode konfirmasi pendaftaran. */
export async function resendSignupOtp(email) {
  if (!isSupabaseEnabled()) return { ok: false, reason: 'disabled' };
  try {
    const sb = await getSupabase();
    const { error } = await withTimeout(
      sb.auth.resend({ type: 'signup', email }),
      NET_TIMEOUT,
      'kirim ulang kode',
    );
    if (error) {
      const message = humanizeAuthEmailError(error.message) || 'Gagal mengirim ulang kode.';
      setStatus({ error: message });
      return { ok: false, reason: 'error', message };
    }
    return { ok: true };
  } catch (err) {
    const message = String(err?.message || err);
    setStatus({ error: message });
    return { ok: false, reason: 'error', message };
  }
}

/** Kirim kode reset kunci akun (template "Reset password" harus memuat {{ .Token }}). */
export async function sendResetCode(email) {
  if (!isSupabaseEnabled()) return { ok: false, reason: 'disabled' };
  if (!email) return { ok: false, reason: 'invalid', message: 'Email belum diisi.' };
  try {
    const sb = await getSupabase();
    const { error } = await withTimeout(
      sb.auth.resetPasswordForEmail(email),
      NET_TIMEOUT,
      'kirim kode reset',
    );
    if (error) {
      const message = humanizeAuthEmailError(error.message) || 'Gagal mengirim kode reset.';
      setStatus({ error: message });
      return { ok: false, reason: 'error', message };
    }
    return { ok: true };
  } catch (err) {
    const message = String(err?.message || err);
    setStatus({ error: message });
    return { ok: false, reason: 'error', message };
  }
}

/** Verifikasi kode reset + simpan kunci baru. Sesi recovery dibersihkan lagi. */
export async function resetPasswordWithCode(email, token, newPassword) {
  if (!isSupabaseEnabled()) return { ok: false, reason: 'disabled' };
  const code = String(token || '').replace(/\D/g, '');
  if (code.length !== 6) return { ok: false, reason: 'invalid', message: 'Kode harus 6 digit.' };
  if (String(newPassword || '').length < 6) {
    return { ok: false, reason: 'invalid', message: 'Kunci baru minimal 6 digit.' };
  }
  try {
    const sb = await getSupabase();
    let { data, error } = await withTimeout(
      sb.auth.verifyOtp({ email, token: code, type: 'recovery' }),
      NET_TIMEOUT,
      'verifikasi kode reset',
    );
    if (error && !data?.session) {
      const retry = await withTimeout(
        sb.auth.verifyOtp({ email, token: code, type: 'email' }),
        NET_TIMEOUT,
        'verifikasi kode reset',
      ).catch(() => ({ data: null, error }));
      if (retry.data?.session) {
        data = retry.data;
        error = null;
      }
    }
    if (error || !data?.session) {
      const message = error?.message || 'Kode tidak valid atau sudah kedaluwarsa.';
      setStatus({ error: message });
      return { ok: false, reason: 'invalid', message };
    }

    session = data.session;
    setStatus({ signedIn: true, error: null, email: data.user.email });
    const updated = await withTimeout(
      sb.auth.updateUser({ password: newPassword }),
      NET_TIMEOUT,
      'simpan kunci baru',
    );
    if (updated.error) {
      const message = updated.error.message || 'Gagal menyimpan kunci baru.';
      setStatus({ error: message });
      return { ok: false, reason: 'error', message };
    }

    updateLocalPassword(email, newPassword);
    await applyRemoteAndRefresh(data.user);
    await signOut(); // sesi recovery tidak dipakai; user masuk lagi dengan kunci baru
    return { ok: true };
  } catch (err) {
    const message = String(err?.message || err);
    setStatus({ error: message });
    console.warn('[sync] reset kunci gagal:', err);
    return { ok: false, reason: 'error', message };
  }
}

/** Saat Supabase aktif kunci lokal tidak disimpan sama sekali
 * (login offline memakai sesi Supabase yang di-cache). */
function updateLocalPassword(email, password) {
  const legacy = window.__legacy;
  if (!legacy || !email) return;
  const S = legacy.getS();
  if (!Array.isArray(S.users)) S.users = [];
  let user = S.users.find((u) => u && u.e === email);
  if (!user) {
    user = { n: email.split('@')[0], e: email, v: 1, pic: '' };
    S.users.push(user);
  }
  delete user.p;
  legacy.save();
}

/** Tandai akun lokal (S.users) sudah terverifikasi; opsional langsung masuk. */
function markLocalVerified(email, navigate) {
  const legacy = window.__legacy;
  if (!legacy || !email) return false;
  const S = legacy.getS();
  const user = (S.users || []).find((u) => u && u.e === email);
  if (!user) return false;
  user.v = 1;
  if (navigate) {
    S.me = user;
    legacy.save();
    legacy.go('home');
  } else {
    legacy.save();
  }
  return Boolean(navigate);
}

/** Kasus konfirmasi lewat link: sesi ada, tapi record lokal belum dibuat. */
function attachVerifiedIdentity(email) {
  const legacy = window.__legacy;
  if (!legacy || !email) return;
  const S = legacy.getS();
  if (!Array.isArray(S.users)) S.users = [];
  let user = S.users.find((u) => u && u.e === email);
  if (!user) {
    user = { n: email.split('@')[0], e: email, v: 1, pic: '' };
    S.users.push(user);
  }
  user.v = 1;
  S.me = user;
  legacy.save();
  legacy.go('home');
}

export async function signOut() {
  if (!isSupabaseEnabled() || signingOut) return;
  signingOut = true;
  try {
    const sb = await getSupabase();
    await sb.auth.signOut();
    session = null;
    catalogEditor = false;
    catalogEditorFor = null;
    setStatus({ signedIn: false, catalogEditor: false, email: null });
  } catch (err) {
    console.warn('[sync] keluar gagal:', err);
  } finally {
    signingOut = false;
  }
}

/**
 * Setelah login Supabase, engine legacy tetap butuh entri di S.users (dipakai
 * layar profil, riwayat, dan login offline). Kunci akun hanya disimpan lokal.
 */
function attachLocalIdentity(email, password) {
  const legacy = window.__legacy;
  if (!legacy) return;
  const S = legacy.getS();
  if (!Array.isArray(S.users)) S.users = [];
  let user = S.users.find((u) => u && u.e === email);
  if (!user) {
    user = { n: email.split('@')[0], e: email, v: 1, pic: '' };
    S.users.push(user);
  }
  // Saat Supabase aktif kunci lokal tidak disimpan sama sekali
  // (login offline memakai sesi Supabase yang di-cache).
  delete user.p;
  user.v = 1;
  S.me = user;
  legacy.save();
  legacy.go('home');
}

/* ---------------------------------------------------------------- boot */

/**
 * Dipanggil SEBELUM /legacy/app.js dimuat. Kalau ada sesi Supabase dan snapshot
 * remote lebih baru, data remote sudah terpasang saat engine membaca localStorage.
 */
export async function prepareSync() {
  if (!isSupabaseEnabled()) {
    setStatus({ mode: 'local' });
    return getSyncStatus();
  }
  installStorageBridge();
  setStatus({ mode: 'supabase' });

  try {
    const sb = await withTimeout(getSupabase(), BOOT_TIMEOUT, 'inisialisasi Supabase');
    const { data } = await withTimeout(sb.auth.getSession(), BOOT_TIMEOUT, 'cek sesi');
    session = data?.session || null;
    setStatus({ signedIn: Boolean(session), email: session?.user?.email || null });

    sb.auth.onAuthStateChange((_event, next) => {
      session = next;
      setStatus({ signedIn: Boolean(next), email: next?.user?.email || null });
      if (next) schedulePush(400);
    });

    if (session?.user) {
      await pullRemote(session.user, BOOT_TIMEOUT);
      await checkCatalogEditor(sb, session.user);
      await pullCatalog(BOOT_TIMEOUT);
      await hydrateServerState();
    }
  } catch (err) {
    // Offline / env salah: aplikasi tetap jalan dengan data lokal.
    setStatus({ error: String(err?.message || err) });
    console.warn('[sync] mode lokal karena:', err?.message || err);
  }

  return getSyncStatus();
}

/** Dipanggil setelah engine legacy siap (window.__legacy tersedia). */
export function bootstrapAfterLegacy() {
  if (!isSupabaseEnabled() || wired) return;
  wired = true;
  // Konfirmasi lewat link email: sesi sudah ada saat boot, tandai akun lokal.
  if (session?.user?.email) markLocalVerified(session.user.email, false);
  onSnapshotWrite(({ signedOut: meCleared }) => {
    if (signingOut) return;
    if (meCleared) {
      void signOut();
      return;
    }
    schedulePush();
    scheduleCatalogPush();
  });
  if (bootPushNeeded) schedulePush(300);
  // State awal legacy baru ada sekarang; terapkan katalog bersama kalau ada.
  if (session?.user) void refreshCatalog();
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      void pushRemote();
      if (catalogEditor) void pushCatalog();
      return;
    }
    // Jangan ganti state saat siswa sedang ujian.
    if (document.visibilityState === 'visible' && session?.user) {
      if (window.__legacy?.getV?.() !== 'exam') void refreshCatalog();
    }
  });
}

/** Titik masuk untuk script jembatan legacy (public/legacy/bridge-override.js). */
export function exposeSyncGlobal() {
  window.HermesSync = {
    enabled: isSupabaseEnabled(),
    login: loginWithPassword,
    signUp: signUpWithPassword,
    verifyOtp: verifyEmailOtp,
    resendOtp: resendSignupOtp,
    sendVerify: sendVerifyCode,
    isVerified: isEmailVerified,
    sendReset: sendResetCode,
    resetPassword: resetPasswordWithCode,
    signOut,
    status: getSyncStatus,
    role: currentRole,
    onStatus: onSyncStatus,
    connectForCms,
    catalog: {
      refresh: refreshCatalog,
      publish: pushCatalog,
      isEditor: isCatalogEditor,
    },
    // Fase 3B: server-authoritative
    hydrate: hydrateServerState,
    startAttempt,
    submitAttempt,
    createPayment,
    markPaymentPaid,
    pushPackages: pushPackagesToServer,
  };
}

export { isSupabaseEnabled };
