/**
 * Unggah aset CMS ke Supabase Storage (bucket `assets`).
 *
 * Tujuan: gambar tidak lagi menumpuk sebagai base64 di snapshot
 * (`localStorage` ±5 MB + `app_snapshots.data`). Yang disimpan di state cukup
 * URL publiknya, sehingga gambar yang sama bisa dipakai lintas perangkat dan
 * kuota perangkat lega.
 *
 * Perilaku:
 * - Supabase aktif + sesi login  -> unggah ke Storage, kembalikan URL publik.
 * - Supabase mati / belum login  -> kembalikan data URL (mode `local`) supaya
 *   CMS tetap bisa dipakai offline dan uji CLI tidak butuh akun.
 *
 * Bucket + policy dibuat lewat docs/SUPABASE.sql (bagian storage): publik untuk
 * dibaca, tulis hanya untuk user yang login, limit 2 MB, hanya PNG/JPEG/WebP.
 */
import { getSupabase, isSupabaseEnabled } from './supabase.js';

export const ASSET_BUCKET = 'assets';
export const ASSET_MAX_BYTES = 2 * 1024 * 1024;
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

function assetName(mime) {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const rand = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${Date.now().toString(36)}-${rand}.${EXT[mime] || 'png'}`;
}

/** True kalau ada sesi Supabase aktif, jadi unggahan bisa masuk Storage. */
export async function canUploadAssets() {
  if (!isSupabaseEnabled()) return false;
  try {
    const sb = await getSupabase();
    const { data } = await sb.auth.getSession();
    return Boolean(data?.session);
  } catch {
    return false;
  }
}

/**
 * @param {Blob} blob
 * @param {string} folder  mis. 'produk', 'banner', 'logo', 'pembayaran'
 * @param {string} fallback  dipakai kalau belum login Supabase
 * @returns {Promise<{url:string, mode:'storage'|'local', path?:string}>}
 */
export async function uploadAsset(blob, folder, fallback = '') {
  if (!blob) throw new Error('Berkas kosong.');
  if (!(await canUploadAssets())) return { url: fallback, mode: 'local' };
  if (blob.size > ASSET_MAX_BYTES) {
    throw new Error(`Berkas ${(blob.size / 1024 / 1024).toFixed(1)} MB melebihi batas 2 MB.`);
  }

  const mime = blob.type || 'image/jpeg';
  const path = `${folder}/${assetName(mime)}`;
  const sb = await getSupabase();
  const { error } = await sb.storage.from(ASSET_BUCKET).upload(path, blob, {
    contentType: mime,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw error;

  const { data } = sb.storage.from(ASSET_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, mode: 'storage', path };
}

/** Unggah hasil crop (data URL) dari thumb.js; fallback ke data URL itu sendiri. */
export async function uploadDataUrl(dataUrl, folder) {
  const blob = await (await fetch(dataUrl)).blob();
  return uploadAsset(blob, folder, dataUrl);
}
