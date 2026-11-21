/**
 * Preflight rilis (Next.js): periksa `.next/` sebelum diunggah ke Vercel.
 *
 *   npm run build && npm run check:dist
 *
 * Yang diperiksa:
 * - hasil build ada (.next/BUILD_ID, chunk statis)
 * - aset publik wajib ada (legacy/*, pay/*.svg)
 * - tidak ada JWT ber-role service_role yang ikut ke bundle browser
 *
 * Exit code 1 kalau ada yang gagal, supaya `npm run deploy` berhenti.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const nextDir = path.join(root, '.next');
const publicDir = path.join(root, 'public');
const FAIL = 'GAGAL';
const problems = [];
const notes = [];

function ok(msg) {
  console.log(`OK  ${msg}`);
}

function fail(msg) {
  problems.push(msg);
  console.log(`${FAIL}  ${msg}`);
}

/* ------------------------------------------------------------ hasil build */
if (!fs.existsSync(nextDir)) {
  console.error(`${FAIL}  .next/ belum ada — jalankan "npm run build" dulu.`);
  process.exit(1);
}

const buildIdPath = path.join(nextDir, 'BUILD_ID');
if (fs.existsSync(buildIdPath) && fs.statSync(buildIdPath).size > 0) {
  ok(`.next/BUILD_ID (${fs.readFileSync(buildIdPath, 'utf8').trim()})`);
} else {
  fail('.next/BUILD_ID tidak ada/kosong — build tidak lengkap');
}

function walkJs(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJs(abs, out);
    else if (/\.(m?js)$/.test(entry.name)) out.push(abs);
  }
  return out;
}

const staticDir = path.join(nextDir, 'static');
const chunks = walkJs(staticDir);
if (chunks.length) ok(`${chunks.length} chunk JS di .next/static`);
else fail('.next/static tidak berisi chunk JS');

/* ------------------------------------------------------------ aset publik */
const required = [
  'legacy/app.js',
  'legacy/bridge-override.js',
  'pay/qris.svg',
  'pay/bca.svg',
  'pay/bri.svg',
  'pay/mandiri.svg',
];

for (const rel of required) {
  const abs = path.join(publicDir, rel);
  if (!fs.existsSync(abs)) {
    fail(`${rel} tidak ada di public/`);
    continue;
  }
  const size = fs.statSync(abs).size;
  if (size < 40) {
    fail(`${rel} terlalu kecil (${size} byte) — kemungkinan rusak`);
    continue;
  }
  ok(`${rel} (${size} byte)`);
}

/* --------------------------------------------- kunci rahasia di bundle JS */
let roleChecked = 0;
let leaked = 0;

for (const file of chunks) {
  const code = fs.readFileSync(file, 'utf8');
  // Kunci Supabase adalah JWT; payload-nya memuat "role".
  for (const match of code.matchAll(/eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g)) {
    const payload = match[0].split('.')[1];
    try {
      const json = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
      if (!json || typeof json !== 'object') continue;
      roleChecked++;
      if (json.role === 'service_role') {
        leaked++;
        fail(`${path.relative(root, file)} memuat kunci service_role (${json.ref || 'tanpa ref'})`);
      }
    } catch {
      // bukan JWT valid — abaikan
    }
  }
}

if (leaked === 0) {
  ok(roleChecked ? `${roleChecked} kunci JWT diperiksa, tidak ada service_role` : 'tidak ada kunci JWT di bundle');
}

/* ------------------------------------------------------------- info mode */
const bundleText = chunks.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
if (/supabase\.co/.test(bundleText)) notes.push('build memuat SDK Supabase (mode dual siap dipakai)');
else notes.push('build tidak memuat SDK Supabase — akan jalan mode lokal saja');

for (const note of notes) console.log(`INFO  ${note}`);

if (problems.length) {
  console.error(`\n${FAIL} — ${problems.length} masalah pada hasil build`);
  process.exit(1);
}

console.log('\nLULUS — hasil build siap diunggah');
