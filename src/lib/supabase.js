/**
 * Client Supabase dibuat malas (dynamic import) supaya bundle utama tetap
 * ringan dan aplikasi tetap berjalan penuh tanpa Supabase.
 *
 * Env yang dibaca (Next.js hanya mengekspos prefiks NEXT_PUBLIC_):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY (atau NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
 *
 * JANGAN pernah menaruh service_role key di sini — nilainya ikut terkirim ke
 * browser. Semua proteksi data harus lewat RLS (lihat docs/SUPABASE.sql).
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';
const IS_PROD = process.env.NODE_ENV === 'production';

export function supabaseConfig() {
  const url = SUPABASE_URL;
  const key = SUPABASE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

let warnedEnvMissing = false;
function showEnvBanner() {
  const id = 'web-kedinasan-env-banner';
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const banner = document.createElement('div');
  banner.id = id;
  banner.textContent =
    'Env Supabase belum diisi (NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY kosong) — memakai mode lokal. Atur env di Vercel (Production + Preview).';
  banner.style.cssText =
    'position:fixed;top:0;left:0;right:0;z-index:9999;padding:10px 14px;font:13px system-ui,sans-serif;color:#fff;background:#e11d48;text-align:center';
  document.body.appendChild(banner);
}
function warnEnvMissing() {
  if (warnedEnvMissing) return;
  warnedEnvMissing = true;
  console.warn('[WebKedinasan] Env Supabase belum diisi (NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY kosong) — memakai mode lokal. Atur env di dashboard Vercel (Production + Preview).');
  if (IS_PROD) showEnvBanner();
}

/**
 * Saklar mode dummy (tanpa Supabase) untuk testing.
 * Set localStorage['kedinasan_sync_off'] = '1' SEBELUM halaman dimuat
 * (atau lewat query ?sync=off) supaya semua alur auth/sync memakai
 * validasi lokal — tidak menyentuh server Supabase sama sekali.
 */
export function syncDisabledForTesting() {
  if (typeof window === 'undefined') return false;
  try {
    if (window.localStorage.getItem('kedinasan_sync_off') === '1') return true;
    if (new URLSearchParams(window.location.search).get('sync') === 'off') {
      window.localStorage.setItem('kedinasan_sync_off', '1');
      return true;
    }
  } catch {
    /* localStorage bisa diblokir — abaikan */
  }
  return false;
}

export function isSupabaseEnabled() {
  if (syncDisabledForTesting()) return false;
  if (!supabaseConfig()) warnEnvMissing();
  return Boolean(supabaseConfig());
}

/** @returns {Promise<import('@supabase/supabase-js').SupabaseClient>} */
let clientPromise = null;

export function getSupabase() {
  if (clientPromise) return clientPromise;
  const cfg = supabaseConfig();
  if (!cfg) {
    warnEnvMissing();
    return Promise.reject(new Error('Supabase belum dikonfigurasi'));
  }
  clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(cfg.url, cfg.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }),
  );
  return clientPromise;
}
