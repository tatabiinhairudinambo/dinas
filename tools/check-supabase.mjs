/**
 * Diagnosa kesiapan database Supabase.
 *
 *   npm run check:supabase
 *
 * Menembak REST anon key ke setiap tabel/RPC yang dipakai aplikasi, lalu
 * melaporkan file SQL mana yang harus dijalankan di SQL Editor. Cepat, aman
 * (tanpa service_role), dan tidak menulis apa pun.
 *
 * Env yang dibaca (dari proses atau .env.local/.env):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY (atau NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
 *   VITE_* didukung sebagai fallback.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function loadEnvFile(name) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[m[1]] = value;
  }
  return out;
}

const fileEnv = { ...loadEnvFile('.env'), ...loadEnvFile('.env.local') };
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || fileEnv.NEXT_PUBLIC_SUPABASE_URL || fileEnv.VITE_SUPABASE_URL;
const KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  fileEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  fileEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  fileEnv.VITE_SUPABASE_ANON_KEY ||
  fileEnv.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!URL_ || !KEY) {
  console.error('GAGAL  Env Supabase belum diisi (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).');
  process.exit(1);
}

const base = URL_.replace(/\/+$/, '');
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

const TABLE_SQL = {
  app_snapshots: 'docs/SUPABASE.sql',
  catalog: 'docs/SUPABASE.sql',
  cms_roles: 'docs/SUPABASE.sql',
  packages: 'docs/supabase/migrations/003-server-authoritative-tables.sql',
  questions: 'docs/supabase/migrations/003-server-authoritative-tables.sql',
  question_keys: 'docs/supabase/migrations/003-server-authoritative-tables.sql',
  entitlements: 'docs/supabase/migrations/003-server-authoritative-tables.sql',
  attempts: 'docs/supabase/migrations/003-server-authoritative-tables.sql',
  payments: 'docs/supabase/migrations/003-server-authoritative-tables.sql',
};

async function probeTable(table) {
  const res = await fetch(`${base}/rest/v1/${table}?select=*&limit=0`, { headers });
  if (res.status === 404) {
    let code = '';
    try {
      code = (await res.json())?.code || '';
    } catch {
      /* body bukan JSON */
    }
    return { ok: false, status: res.status, code };
  }
  // 200/206 = ada & boleh dibaca; 401/403 = ada tapi RLS menolak (tetap siap).
  return { ok: res.status < 500, status: res.status };
}

async function probeRpc(name) {
  const res = await fetch(`${base}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: '{}',
  });
  if (res.status === 404) {
    let code = '';
    try {
      code = (await res.json())?.code || '';
    } catch {
      /* body bukan JSON */
    }
    return { ok: false, status: res.status, code };
  }
  return { ok: res.status < 500, status: res.status };
}

const rows = [];
let missing = 0;

for (const [table, sql] of Object.entries(TABLE_SQL)) {
  const r = await probeTable(table);
  rows.push({ name: table, ...r, sql });
  if (!r.ok) missing++;
}

const rpc = await probeRpc('get_catalog');
rows.push({
  name: 'rpc get_catalog',
  ...rpc,
  sql: 'docs/supabase/migrations/004-server-authoritative-rpc.sql',
});
if (!rpc.ok) missing++;

for (const row of rows) {
  const state = row.ok ? 'OK    ' : 'HILANG';
  const detail = row.code ? ` (${row.code})` : ` (HTTP ${row.status})`;
  console.log(`${state}  ${row.name}${row.ok ? '' : detail}`);
}

console.log('');
if (missing) {
  console.log(`${missing} objek database belum ada. Jalankan berurutan di Supabase → SQL Editor:`);
  for (const sql of [...new Set(rows.filter((r) => !r.ok).map((r) => r.sql))]) {
    console.log(`  - ${sql}`);
  }
  console.log('  (lalu muat ulang halaman aplikasi)');
  process.exit(1);
}

console.log('LULUS — semua tabel & RPC yang dipakai aplikasi sudah ada.');
