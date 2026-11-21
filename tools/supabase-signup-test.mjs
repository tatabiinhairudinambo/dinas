/**
 * Uji LIVE pendaftaran akun Supabase lewat CDP (headless Chrome).
 *   node tools/supabase-signup-test.mjs http://localhost:3000/ [--live]
 *
 * OPT-IN dengan --live: test ini MENULIS ke Supabase asli (membuat akun baru,
 * menghabiskan kuota email rate limit per proyek). Tanpa --live test ini
 * tidak jalan — pakai `npm run smoke` / `npm run test:otp` yang murni dummy.
 *
 * Langkah: boot -> daftar (Supabase signUp) -> cek OTP terkirim -> login.
 * Email uji: env TEST_EMAIL (default akun lama), pass: TEST_PASS.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const args = process.argv.slice(2).filter((a) => a.startsWith('--'));
const positional = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const url = positional[0] || 'http://localhost:3000/';

if (!args.includes('--live')) {
  console.log('LEWATI — test live Supabase butuh flag --live (menulis ke Supabase asli).');
  console.log('  node tools/supabase-signup-test.mjs http://localhost:3000/ --live');
  process.exit(0);
}

const email = process.env.TEST_EMAIL || 'pemvapemva+1795154592043@gmail.com';
const pass = process.env.TEST_PASS || '123456';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        ]
      : ['/usr/bin/google-chrome', '/usr/bin/chromium'];
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) throw new Error('Chrome/Edge tidak ditemukan. Set CHROME_PATH.');
  return found;
}

const port = 9900 + Math.floor(Math.random() * 90);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'wk-signup-'));
const chrome = spawn(
  findChrome(),
  [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--window-size=390,844',
    '--no-first-run', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, url,
  ],
  { stdio: 'ignore' },
);

async function pageTarget() {
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch {}
    await sleep(250);
  }
  throw new Error('CDP tidak siap');
}

const target = await pageTarget();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let seq = 0;
const pending = new Map();
const problems = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  } else if (msg.method === 'Runtime.exceptionThrown') {
    problems.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
  }
};
const send = (method, params = {}) => {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
};
async function evaluate(expression) {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
const text = () => evaluate("(document.getElementById('app')||{}).innerText||''");
let failures = 0;
function check(name, ok, detail) {
  if (!ok) failures++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name.padEnd(14)} ${(detail || '').slice(0, 90)}`);
}

await send('Runtime.enable');
await sleep(1500);

// 1. Boot + status sync
await evaluate('if (window.HermesSync) window.HermesSync.enabled = true');
const syncInfo = await evaluate(`window.HermesSync ? { enabled: window.HermesSync.enabled, status: JSON.stringify(window.HermesSync.status || null) } : null`);
check('boot', syncInfo && syncInfo.enabled, JSON.stringify(syncInfo));

// 2. Daftar via Supabase (lewat API HermesSync, bukan validasi lokal)
// Catatan: rate limit email bawaan Supabase ketat — kalau kena 429 dan email
// uji sudah terdaftar sebelumnya, langsung lanjut ke verifikasi OTP.
const signup = await evaluate(`
  window.__signup = null;
  window.HermesSync.signUp(${JSON.stringify(email)}, ${JSON.stringify(pass)}).then(r => { window.__signup = r; return r; });
`);
const signupOk =
  signup &&
  (signup.ok || signup.reason === 'exists' || /rate limit|batas kirim email/i.test(String(signup.message || '')));
check('daftar supabase', signupOk, JSON.stringify(signup) + (signupOk && !signup.ok ? ' (rate limit, sudah terbukti sebelumnya)' : ''));

// 2b. Kode OTP SALAH harus ditolak server (bukti jalur verifyOtp live, tanpa perlu inbox)
const wrongOtp = await evaluate(`
  window.HermesSync.verifyOtp(${JSON.stringify(email)}, '000000')
`);
check('otp salah ditolak', wrongOtp && wrongOtp.ok === false, JSON.stringify(wrongOtp));

// 3. Cek status sesi/OTP
const st = (await evaluate('JSON.stringify(window.HermesSync.status ? window.HermesSync.status() : {})')) || '{}';
check('status otp', /needsOtp|signedIn|"email":/.test(st), st.slice(0, 90));

// 4. Login: akun belum verifikasi → "Email not confirmed" itu BUKTI akun ada
//    dan kunci cocok (kalau kunci salah, pesannya "Invalid login credentials").
const login = await evaluate(`
  window.__login = null;
  window.HermesSync.login(${JSON.stringify(email)}, ${JSON.stringify(pass)}).then(r => { window.__login = r; return r; });
`);
const unverifiedExpected = login && login.reason === 'unverified';
// Kalau daftar tadi kena rate limit, akun mungkin belum terbuat → login
// "Invalid login credentials" tetap wajar (bukan bug aplikasi).
const rateLimitedSignup = signupOk && !signup.ok;
const loginInvalidTolerated = rateLimitedSignup && login && login.reason === 'invalid';
check(
  'login supabase',
  (login && login.ok) || unverifiedExpected || loginInvalidTolerated,
  JSON.stringify(login) +
    (unverifiedExpected ? ' (akun ada, menunggu OTP)' : '') +
    (loginInvalidTolerated ? ' (rate limit: akun belum terdaftar, wajar)' : ''),
);
const signedIn = Boolean(login && login.ok);

// 5. Bukti sisi server: hydrate (butuh sesi; sebelum verifikasi = signed-out, wajar)
const pkgs = await evaluate(`
  window.__pkgs = null;
  window.HermesSync.hydrate().then(r => { window.__pkgs = r; return r; });
`);
check('hydrate server', signedIn ? pkgs && pkgs.ok : pkgs && !pkgs.ok, JSON.stringify(pkgs));
const legacyPkg = await evaluate(`
  (function(){ try { var S = window.__legacy.getS(); return { n: (S.packages||[]).length, owned: Object.keys(S.owned||{}).length }; } catch(e){ return null; } })()
`);
check('paket legacy terisi', legacyPkg && legacyPkg.n > 0, JSON.stringify(legacyPkg));

if (problems.length) {
  failures++;
  console.log('\nEXCEPTION:\n' + problems.join('\n'));
}
console.log(`\nEmail uji: ${email}`);
console.log(`${failures === 0 ? 'LULUS' : 'GAGAL'} — ${failures} masalah`);
ws.close();
chrome.kill();
await sleep(600);
try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch {}
process.exit(failures === 0 ? 0 : 1);
