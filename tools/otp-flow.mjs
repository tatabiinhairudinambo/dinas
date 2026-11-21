/**
 * Uji UI alur OTP lewat CDP: daftar -> layar kode -> kode salah/benar,
 * plus login akun yang belum diverifikasi.
 *
 * Metode window.HermesSync di-stub di halaman, jadi TIDAK ada email terkirim
 * dan tidak ada baris baru di Supabase. Cocok dijalankan kapan saja.
 *
 *   npm run dev                         # terminal 1
 *   npm run test:otp                   # terminal 2
 *
 * Berjalan di semua mode — stub bekerja bahkan saat env Supabase kosong.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const url = process.argv[2] || 'http://localhost:3000/';
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
      : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) throw new Error('Chrome/Edge tidak ditemukan. Set CHROME_PATH.');
  return found;
}

const port = 9500 + Math.floor(Math.random() * 400);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'wk-otp-'));
const chrome = spawn(
  findChrome(),
  ['--headless=new', '--disable-gpu', '--no-sandbox', '--window-size=390,844', '--no-first-run',
   `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, url],
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
  throw new Error('CDP tidak siap — Chrome gagal start?');
}

const target = await pageTarget();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

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

async function step(name, check, action) {
  try {
    if (action) await evaluate(action);
    await sleep(600);
    const body = (await text()).replace(/\s+/g, ' ');
    const ok = check(body);
    if (!ok) failures++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${name.padEnd(18)} ${body.slice(0, 90)}`);
  } catch (err) {
    failures++;
    console.log(`FAIL ${name.padEnd(18)} ${err.message}`);
  }
}

await send('Runtime.enable');
await sleep(1500);

// Mode dummy: metode jaringan di-stub di halaman — TIDAK ada email terkirim
// dan tidak ada baris baru di Supabase. HermesSync.enabled dipaksa true agar
// bridge memakai stub (bukan validasi lokal); stub murni di memori.
const syncOn = await evaluate("!!window.HermesSync");
if (!syncOn) {
  console.log('LEWATI — window.HermesSync tidak ada (mode lokal murni).');
  ws.close();
  chrome.kill();
  process.exit(0);
}
console.log('OK   mode dummy, metode jaringan di-stub');

await evaluate(`(() => {
  const s = window.HermesSync;
  s.enabled = true;
  window.__calls = { signUp: 0, resend: 0, verify: 0, login: 0 };
  s.signUp = function () { window.__calls.signUp++; return Promise.resolve({ ok: true, needsOtp: true }); };
  s.resendOtp = function () { window.__calls.resend++; return Promise.resolve({ ok: true }); };
  s.verifyOtp = function (email, code) {
    window.__calls.verify++;
    return Promise.resolve(String(code) === '123456' ? { ok: true } : { ok: false, message: 'Kode salah uji' });
  };
  s.login = function () { window.__calls.login++; return Promise.resolve({ ok: false, reason: 'unverified', message: 'Email not confirmed' }); };
  s.sendReset = function () { return Promise.resolve({ ok: true }); };
})()`);

await step('layar daftar', (t) => /Nama Lengkap/.test(t), "AM='daftar'; MSG=''; render();");

await step(
  'kirim daftar',
  (t) => /Verifikasi Email/.test(t) && /Kode 6 digit dikirim/.test(t),
  `(() => {
    const set=(s,v)=>{const e=document.querySelector(s);if(e)e.value=v};
    set('#n','Uji OTP'); set('#e','otp-uji@mail.com'); set('#p','123456'); set('#p2','123456'); reg();
  })()`,
);

const otpInput = await evaluate("!!document.querySelector('#otp-code')");
console.log(`${otpInput ? 'OK  ' : 'FAIL'} ${'input kode 6 digit'.padEnd(18)} ${otpInput ? 'ada' : 'tidak ada'}`);
if (!otpInput) failures++;

await step(
  'kode salah',
  (t) => /Kode salah uji/.test(t),
  `(() => { const e=document.querySelector('#otp-code'); if(e)e.value='111111'; otpSubmit(); })()`,
);

const stillThere = await evaluate("!!document.querySelector('#otp-code')");
console.log(`${stillThere ? 'OK  ' : 'FAIL'} ${'tetap di layar OTP'.padEnd(18)} ${stillThere ? 'ya' : 'tidak'}`);
if (!stillThere) failures++;

await step(
  'kode benar',
  (t) => /Masuk/.test(t) && !/Verifikasi Email/.test(t),
  `(() => { const e=document.querySelector('#otp-code'); if(e)e.value='123456'; otpSubmit(); })()`,
);

const after = await evaluate("!!document.querySelector('#otp-code')");
console.log(`${!after ? 'OK  ' : 'FAIL'} ${'layar OTP ditutup'.padEnd(18)} ${after ? 'masih terbuka' : 'ya'}`);
if (after) failures++;

await step(
  'login belum verif',
  (t) => /Verifikasi Email/.test(t) && /otp-uji@mail\.com/.test(t),
  `(() => {
    AM='login'; MSG=''; render();
    const set=(s,v)=>{const e=document.querySelector(s);if(e)e.value=v};
    set('#e','otp-uji@mail.com'); set('#p','123456'); login();
  })()`,
);

const calls = await evaluate('JSON.stringify(window.__calls)');
console.log(`INFO panggilan tersimulasi: ${calls}`);
// Sejak F3C login akun belum verifikasi TIDAK mengirim ulang email otomatis
// (hemat kuota proyek Supabase); user memakai tombol "Kirim ulang" manual.
const noAutoResend = JSON.parse(calls).resend === 0;
console.log(`${noAutoResend ? 'OK  ' : 'FAIL'} ${'tanpa resend otomatis'.padEnd(18)} ${JSON.parse(calls).resend}`);

if (problems.length) {
  failures++;
  console.log('FAIL error runtime:');
  for (const p of problems.slice(0, 5)) console.log('  ' + String(p).split('\n')[0]);
}

console.log(failures ? `\nGAGAL — ${failures} masalah` : '\nLULUS — alur OTP berjalan');
ws.close();
chrome.kill();
process.exit(failures ? 1 : 0);
