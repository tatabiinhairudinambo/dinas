/**
 * Smoke test alur utama lewat Chrome DevTools Protocol (tanpa dependency).
 *
 *   npm run build && npm run preview   # terminal 1
 *   node tools/smoke-flow.mjs http://localhost:3000/   # terminal 2
 *
 * Yang diuji: daftar -> verifikasi -> login -> beranda -> kategori -> paket ->
 * halaman beli -> kembali -> mulai ujian -> menjawab. Setiap langkah dicek
 * dari teks #app, jadi regresi pada engine legacy langsung kelihatan.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const url = process.argv[2] || 'http://localhost:3000/';
// Smoke menguji jalur legacy dengan DATA DUMMY — tidak menyentuh Supabase
// (rate limit email per proyek, dan belum produksi). ?sync=off mematikan sync
// sebelum boot sehingga reg()/verify()/login() memakai validasi lokal.
const urlDummy = url + (url.includes('?') ? '&' : '?') + 'sync=off';
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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'wk-smoke-'));
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
    urlDummy,
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

const text = () => evaluate("(document.getElementById('app')||{}).innerText||''");
let failures = 0;

async function step(name, expect, action) {
  if (action) await evaluate(action);
  await sleep(400);
  const body = (await text()).replace(/\s+/g, ' ');
  const ok = expect.test(body);
  if (!ok) failures++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name.padEnd(14)} ${body.slice(0, 80)}`);
}

await send('Runtime.enable');

// Tunggu boot selesai (dev server bisa lambat saat kompilasi pertama) sebelum
// mematikan sync dan mulai langkah pertama.
for (let i = 0; i < 100; i++) {
  const t = (await evaluate("(document.getElementById('app')||{}).innerText||''").catch(() => '')) || '';
  if (/Masuk/i.test(t)) break;
  await sleep(300);
}
// Cadangan: kalau ?sync=off belum sempat disimpan sebelum boot, matikan juga
// setelah boot (reg() membaca HermesSync saat tombol ditekan, bukan saat boot).
await evaluate('if (window.HermesSync) window.HermesSync.enabled = false');
await step('boot', /Masuk/i);
await step('mode daftar', /Nama Lengkap/, "AM='daftar'; render();");
await step('daftar', /Cek Email Kamu/, `(() => {
  const set=(s,v)=>{const e=document.querySelector(s);if(e)e.value=v};
  set('#n','Uji Coba'); set('#e','uji@mail.com'); set('#p','123456'); set('#p2','123456'); reg();
})()`);
await step('verifikasi', /Verifikasi berhasil/, 'verify();');
await step('login', /Selamat|Pilih Try Out/, `(() => {
  const set=(s,v)=>{const e=document.querySelector(s);if(e)e.value=v};
  set('#e','uji@mail.com'); set('#p','123456'); login();
})()`);
// Dapur Operator kini satu pintu: hanya Panel Admin + keluar.
await evaluate('side()');
await sleep(300);
const sideText = ((await evaluate("(document.querySelector('.side')||{}).innerText||''")) || '').replace(/\s+/g, ' ');
const oneDoor = sideText.includes('Panel Admin') && !sideText.includes('Upload Paket') && !sideText.includes('Daftar Promo');
if (!oneDoor) failures++;
console.log(`${oneDoor ? 'OK  ' : 'FAIL'} ${'dapur operator'.padEnd(14)} ${sideText.slice(0, 70)}`);
await evaluate('closeM()');
await sleep(300);
// Notifikasi: layar legacy pertama yang markahnya digambar React
// (window.Views.NotifView). Tab harus pindah dan data tetap dari S.logs/PT.
await step('notif', /Pembelian[\s\S]*Pengerjaan/, "go('notif')");
await evaluate(`(() => {
  const b=[...document.querySelectorAll('#view-notif .tabs button')].find(x=>x.innerText.includes('Pengerjaan'));
  b && b.click();
})()`);
await sleep(400);
const notifTab = ((await evaluate("(document.querySelector('#view-notif .tabs .on')||{}).innerText||''")) || '').trim();
if (notifTab !== 'Pengerjaan') failures++;
console.log(`${notifTab === 'Pengerjaan' ? 'OK  ' : 'FAIL'} ${'notif tab'.padEnd(14)} ${notifTab}`);
await step('kategori', /SOAL|Try Out TWK/i, "TAB='TWK'; go('kat');");
await step('paket', /Daftar Paket|belum membeli/i, "go('paket')");
await step('beli', /Pembelian Paket/i, 'CUR=S.packages[1].id; go("buy")');
await step('kembali', /belum membeli/i, 'goBack("paket")');
// rev76: nomor rekening dari panel CMS tampil di layar transfer siswa.
await evaluate(`S.payAcc={BCA:{no:'1234 5678 90',name:'Yayasan Hermes'}}; save(); payGo('BCA');`);
await sleep(500);
const payText = ((await evaluate("(document.getElementById('app')||{}).innerText||''")) || '').replace(/\s+/g, ' ');
const rekening = /Nomor Rekening/.test(payText) && /1234 5678 90/.test(payText) && /Yayasan Hermes/.test(payText);
if (!rekening) failures++;
console.log(`${rekening ? 'OK  ' : 'FAIL'} ${'rekening'.padEnd(14)} ${payText.slice(0, 80)}`);
await evaluate(`clearInterval(TI)`);
await step('ujian', /SOAL NOMOR/i, 'start(S.packages[1].id, 30)');
await step('jawab', /SOAL NOMOR/i, `
  const o=document.querySelector('#app .opt, #app [onclick^="pick"]'); if(o)o.click();
`);

if (problems.length) {
  failures++;
  console.log('\nEXCEPTION di halaman:\n' + problems.join('\n'));
}

console.log(`\n${failures === 0 ? 'LULUS' : 'GAGAL'} — ${failures} masalah`);
ws.close();
chrome.kill();
await sleep(600);
try {
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
} catch {
  // profil sementara masih dikunci Chrome; biarkan OS yang membersihkan
}
process.exit(failures === 0 ? 0 : 1);
