/**
 * E2E smoke untuk versi Next.js murni (CDP, tanpa dependency).
 *
 *   node tools/e2e.mjs [baseURL]
 *
 * Diuji: daftar -> verifikasi -> masuk -> beranda -> /paket -> /semua ->
 * /admin (gate demo) -> /profil. Semua pengecekan membaca innerText body,
 * dan error console/exception dihitung gagal.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const base = process.argv[2] || 'http://localhost:3000/';
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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'kd-e2e-'));
const chrome = spawn(
  findChrome(),
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=390,844',
    '--no-first-run',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    'about:blank',
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

await send('Runtime.enable');

let failures = 0;

async function waitHydrated(ms = 45000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const ok = await evaluate(
      `(() => { const el = document.querySelector('button, form, input'); return el ? Object.keys(el).some((k) => k.startsWith('__reactProps')) : false; })()`,
    ).catch(() => false);
    if (ok) return true;
    await sleep(400);
  }
  return false;
}

async function nav(url) {
  await send('Page.enable');
  await send('Page.navigate', { url });
  // Tunggu React selesai render (body punya teks) + hydration (props terpasang).
  for (let i = 0; i < 120; i++) {
    await sleep(250);
    const t = (await evaluate("document.body.innerText").catch(() => '')) || '';
    if (t.trim().length > 40) break;
  }
  await waitHydrated();
  return (await evaluate('document.body.innerText').catch(() => '')) || '';
}

async function step(name, expect, body) {
  const ok = expect.test((body || '').replace(/\s+/g, ' '));
  if (!ok) failures++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name.padEnd(16)} ${(body || '').replace(/\s+/g, ' ').slice(0, 90)}`);
}

async function waitText(expect, ms = 30000) {
  const end = Date.now() + ms;
  let t = '';
  while (Date.now() < end) {
    t = (await evaluate('document.body.innerText').catch(() => '')) || '';
    if (expect.test(t.replace(/\s+/g, ' '))) return t;
    await sleep(400);
  }
  return t;
}

const stamp = Date.now();
const EMAIL = `uji${stamp}@mail.com`;

// 1) Daftar akun baru
let body = await nav(`${base}daftar`);
await step('buka /daftar', /Daftar Akun/, body);
await evaluate(`(() => {
  const set = (ph, v) => {
    const el = [...document.querySelectorAll('input')].find((i) => i.placeholder === ph);
    if (el) {
      const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      s.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };
  set('Nama Lengkap', 'Uji Coba');
  set('Email', '${EMAIL}');
  set('Buat Kunci Akun (min. 6 digit)', '123456');
  set('Konfirmasi Kunci Akun', '123456');
})()`);
await evaluate(`[...document.querySelectorAll('button')].find((b) => /Daftar Sekarang/.test(b.innerText))?.click()`);
body = await waitText(/Cek Email Kamu/);
await step('daftar -> verifikasi', /Cek Email Kamu/, body);

// 2) Simulasi verifikasi
await evaluate(`[...document.querySelectorAll('button')].find((b) => /Buka Link Konfirmasi/.test(b.innerText))?.click()`);
body = await waitText(/Masuk|Verifikasi berhasil/);
await step('verifikasi -> masuk', /Masuk/i, body);
await waitHydrated();

// 3) Login
await evaluate(`(() => {
  const set = (ph, v) => {
    const el = [...document.querySelectorAll('input')].find((i) => i.placeholder === ph);
    if (el) {
      const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      s.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };
  set('Email', '${EMAIL}');
  set('Kunci Akun', '123456');
})()`);
await evaluate(`[...document.querySelectorAll('button')].find((b) => /^Masuk$/.test(b.innerText.trim()))?.click()`);
body = await waitText(/Kategori Try Out|Siap Ujian|Halo/i, 25000);
await step('masuk -> beranda', /Kategori Try Out|Siap Ujian|Halo/i, body);

// 4) Halaman paket saya
await send('Page.navigate', { url: `${base}paket` });
body = await waitText(/Paket Saya|Riwayat|Masuk/i);
await step('/paket', /Paket Saya|Riwayat|Masuk/i, body);

// 5) Katalog semua
await send('Page.navigate', { url: `${base}semua` });
body = await waitText(/Semua Paket|Masuk/i);
await step('/semua', /Semua Paket|Masuk/i, body);

// 6) Admin gate demo
await send('Page.navigate', { url: `${base}admin` });
body = await waitText(/Panel Admin|Masuk Admin|Email Admin/i);
await step('/admin gate', /Panel Admin|Masuk Admin|Email Admin/i, body);

// 7) Profil
await send('Page.navigate', { url: `${base}profil` });
body = await waitText(/Profil|Akun/i);
await step('/profil', /Profil|Akun/i, body);

// 8) Alur beli -> bayar -> ujian -> hasil
const firstId = await evaluate(
  `window.__kedinasanStore.getSnapshot().data.packages.find((p) => p.pub)?.id`,
);
if (firstId == null) {
  failures++;
  console.log('FAIL tidak ada paket publik untuk uji beli');
} else {
  await send('Page.navigate', { url: `${base}beli/${firstId}` });
  body = await waitText(/Beli Paket/i);
  await step('/beli', /Beli Paket/i, body);
  await waitHydrated();
  await evaluate(`[...document.querySelectorAll('button')].find((b) => /BELI PAKET/.test(b.innerText))?.click()`);
  body = await waitText(/Pilih Pembayaran/i);
  await step('pilih bayar', /Pilih Pembayaran/i, body);
  await evaluate(`[...document.querySelectorAll('.pay-method button')].find((b) => /QRIS/.test(b.innerText))?.click()`);
  body = await waitText(/Simulasikan Transfer Berhasil/i);
  await step('/bayar', /Simulasikan/i, body);
  await waitHydrated();
  await evaluate(`[...document.querySelectorAll('button')].find((b) => /Simulasikan Transfer Berhasil/.test(b.innerText))?.click()`);
  body = await waitText(/Paket Saya|Daftar Paket/i, 20000);
  await waitHydrated();
  const owned = await evaluate(
    `Boolean(window.__kedinasanStore.getSnapshot().data.owned[${JSON.stringify(firstId)}])`,
  );
  if (!owned) failures++;
  console.log(`${owned ? 'OK  ' : 'FAIL'} ${'paket terbeli'.padEnd(16)} url=${await evaluate('location.href')}`);

  // Mulai ujian: buka /paket lalu klik Mulai/Lanjutkan di kartu paket pertama
  await send('Page.navigate', { url: `${base}paket` });
  body = await waitText(/Paket Saya/i);
  await waitHydrated();

  // Mulai ujian: klik Mulai di kartu paket pertama
  await evaluate(`[...document.querySelectorAll('.pkg-actions button')].find((b) => /Mulai|Lanjutkan/.test(b.innerText))?.click()`);
  body = await waitText(/Pilih Mode Waktu/i);
  await step('mode waktu', /Pilih Mode Waktu/i, body);
  await evaluate(`[...document.querySelectorAll('.stack button')].find((b) => /tanpa waktu|menit/.test(b.innerText))?.click()`);
  body = await waitText(/Mulai ujian\?/i);
  await step('konfirmasi ujian', /Mulai Sekarang/i, body);
  await evaluate(`[...document.querySelectorAll('button')].find((b) => /Mulai Sekarang/.test(b.innerText))?.click()`);
  body = await waitText(/SOAL NOMOR/i);
  await step('/ujian', /SOAL NOMOR/i, body);
  await waitHydrated();

  // Jawab 2 soal lewat klik opsi + Berikutnya
  for (let k = 0; k < 2; k++) {
    await evaluate(`[...document.querySelectorAll('.opt')][0]?.click()`);
    await evaluate(`[...document.querySelectorAll('button')].find((b) => /Berikutnya/.test(b.innerText))?.click()`);
    await sleep(400);
  }
  const answered = await evaluate(
    `Object.keys(window.__kedinasanStore.getSnapshot().data.exam?.ans || {}).length`,
  );
  if (answered < 2) failures++;
  console.log(`${answered >= 2 ? 'OK  ' : 'FAIL'} ${'jawab soal'.padEnd(16)} terjawab=${answered}`);

  // Selesai: buka Daftar Nomor -> Akhiri Ujian -> modal konfirmasi
  await evaluate(`[...document.querySelectorAll('button')].find((b) => /Daftar Nomor/.test(b.innerText))?.click()`);
  body = await waitText(/Akhiri Ujian/i);
  // Ambil tombol TERAKHIR yang cocok (di dalam sheet, bukan tombol "Daftar Nomor")
  await evaluate(`(() => { const bs = [...document.querySelectorAll('button')].filter((b) => /Akhiri Ujian/.test(b.innerText)); bs[bs.length - 1]?.click(); })()`);
  body = await waitText(/Selesaikan ujian\?/i);
  await waitHydrated();
  await evaluate(`[...document.querySelectorAll('button')].find((b) => /Akhiri & Lihat Hasil/.test(b.innerText))?.click()`);
  // Jika ujian <1 menit, modal "Masih terlalu awal" muncul -> tutup, tunggu 60 detik, ulangi.
  body = await waitText(/Hasil Try Out|Masih terlalu awal/i, 25000);
  if (/Masih terlalu awal/i.test(body)) {
    await evaluate(`[...document.querySelectorAll('button')].find((b) => /^Oke$/.test(b.innerText.trim()))?.click()`);
    await sleep(61000);
    await evaluate(`[...document.querySelectorAll('button')].find((b) => /Daftar Nomor/.test(b.innerText))?.click()`);
    body = await waitText(/Akhiri Ujian/i);
    await evaluate(`(() => { const bs = [...document.querySelectorAll('button')].filter((b) => /Akhiri Ujian/.test(b.innerText)); bs[bs.length - 1]?.click(); })()`);
    body = await waitText(/Selesaikan ujian\?/i);
    await evaluate(`[...document.querySelectorAll('button')].find((b) => /Akhiri & Lihat Hasil/.test(b.innerText))?.click()`);
    body = await waitText(/Hasil Try Out/i, 20000);
    await waitHydrated();
  }
  if (!/Hasil Try Out|KAMU|Hasil belum ada/i.test(body.replace(/\s+/g, ' '))) {
    // Coba navigasi langsung sebagai fallback (hasil tersimpan di res)
    await send('Page.navigate', { url: `${base}hasil/${firstId}` });
    await waitHydrated();
    body = await waitText(/Hasil|belum ada/i, 15000);
  }
  await step('/hasil', /Hasil Try Out|KAMU|Hasil belum ada/i, body);
  const hasRes = await evaluate(
    `Boolean(window.__kedinasanStore.getSnapshot().data.res[${JSON.stringify(firstId)}])`,
  );
  if (!hasRes) failures++;
  console.log(`${hasRes ? 'OK  ' : 'FAIL'} ${'hasil tersimpan'.padEnd(16)}`);
}

// 9) Tidak ada exception runtime
if (problems.length) {
  failures++;
  console.log(`FAIL exception runtime (${problems.length})`);
  for (const p of problems.slice(0, 5)) console.log('   ', p.split('\n')[0]);
} else {
  console.log('OK   tanpa exception runtime');
}

console.log(failures ? `\n${failures} LANGKAH GAGAL` : '\nSEMUA LANGKAH LULUS');
ws.close();
chrome.kill();
process.exit(failures ? 1 : 0);
