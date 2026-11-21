/**
 * Uji panel CMS /admin lewat CDP.
 *
 *   npm run build && npm run preview   # terminal 1
 *   npm run test:cms                   # terminal 2
 *
 * Uji: gerbang lokal -> ringkasan -> edit paket -> edit soal -> import ->
 * tambah/edit/duplikat produk -> tampilan (banner+logo) -> pembayaran ->
 * promo -> grup -> reload. Setiap langkah dicek, bukan hanya dicetak;
 * exit code 1 kalau gagal.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const url = process.argv[2] || 'http://localhost:3000/admin';
const shotDir = path.resolve(process.argv[3] || 'tools/_shots');
fs.mkdirSync(shotDir, { recursive: true });

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

const port = 9700 + Math.floor(Math.random() * 200);
fs.mkdirSync(os.tmpdir(), { recursive: true });
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'wk-cms-'));
const chrome = spawn(
  findChrome(),
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--no-first-run',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

async function pageTarget() {
  for (let i = 0; i < 100; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch {}
    await sleep(200);
  }
  throw new Error('CDP tidak siap — Chrome gagal start?');
}

const target = await pageTarget();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => ((ws.onopen = res), (ws.onerror = rej)));

let seq = 0;
const pending = new Map();
const consoleErrors = [];
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id);
    pending.delete(m.id);
    m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result);
  } else if (m.method === 'Runtime.exceptionThrown') {
    consoleErrors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
    consoleErrors.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
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

async function shot(name) {
  const r = await send('Page.captureScreenshot', { format: 'png' });
  const file = path.join(shotDir, `${name}.png`);
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
  console.log(`   screenshot: ${file}`);
}

const text = (sel) =>
  evaluate(`(document.querySelector(${JSON.stringify(sel)})||{innerText:''}).innerText.replace(/\\s+/g,' ').slice(0,220)`);

const clickByText = (sel, label) =>
  evaluate(`(() => {
    const el = [...document.querySelectorAll(${JSON.stringify(sel)})].find(e => e.innerText.trim().includes(${JSON.stringify(label)}));
    if (!el) return 'TIDAK KETEMU: ' + ${JSON.stringify(label)};
    el.click();
    return 'klik: ' + ${JSON.stringify(label)};
  })()`);

const setValue = (sel, value) =>
  evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(sel)});
    if (!el) return 'TIDAK ADA: ' + ${JSON.stringify(sel)};
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return 'isi: ' + ${JSON.stringify(sel)};
  })()`);

// Panel Tampilan/Pembayaran sekarang hanya menerima unggahan berkas (tanpa
// kolom URL), jadi PNG kecil dibuat di dalam halaman lalu dimasukkan ke
// input[type=file] lewat DataTransfer.
const uploadPng = (label) =>
  evaluate(`(async () => {
    const field = [...document.querySelectorAll('.cms-field')].find((f) =>
      f.innerText.trim().startsWith(${JSON.stringify(label)}),
    );
    if (!field) return 'FIELD TIDAK KETEMU: ' + ${JSON.stringify(label)};
    const input = field.querySelector('input[type=file]');
    if (!input) return 'INPUT FILE TIDAK KETEMU: ' + ${JSON.stringify(label)};
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#012AAB';
    ctx.fillRect(0, 0, 240, 120);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('UJI', 18, 74);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'cms-test.png', { type: 'image/png' }));
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return 'unggah: ' + ${JSON.stringify(label)};
  })()`);

let failures = 0;
function check(name, ok, detail) {
  if (!ok) failures++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name.padEnd(16)} ${detail ?? ''}`.trimEnd());
}

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

await send('Page.navigate', { url });
await sleep(2500);
// Mulai dari kondisi bersih: profil Chrome bisa membawa state/kunci dari run sebelumnya.
await evaluate('localStorage.clear(); sessionStorage.clear();');
await send('Page.reload', { ignoreCache: true });
await sleep(2500);

const gate = await text('.cms-gate-card');
const gateH1 = await evaluate(`(document.querySelector('.cms-gate-card h1')||{}).innerText || ''`);
if (gateH1.includes('Akses Operator Ditutup')) {
  console.log('SKIP — /admin terblokir di prod tanpa Supabase; jalankan cms-test di modus dev (npm run dev).');
  ws.close();
  chrome.kill();
  process.exit(0);
}
check('gerbang', gate.includes('Masuk panel'), gate.slice(0, 60));

// Akun demo: email sudah terisi otomatis, tinggal kuncinya.
const gateInputs = await evaluate(`(() => {
  const set = (el, v) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const ins = [...document.querySelectorAll('.cms-gate-card input')];
  if (ins.length >= 2) {
    set(ins[0], '1@gmail.com');
    set(ins[1], '123456');
  } else if (ins.length === 1) {
    set(ins[0], '123456');
  }
  return ins.length;
})()`);
console.log('   input gate    :', gateInputs);
await evaluate(`document.querySelector('.cms-gate-card button[type=submit]').click()`);
await sleep(2500);

const shell = await text('.cms-top');
const stats = await text('.cms-stats');
check('shell', shell.includes('Ringkasan') && stats.includes('PAKET'), shell.slice(0, 60));
check('legacy tersembunyi', (await evaluate(`getComputedStyle(document.querySelector('.cms-legacy-hosts')).display`)) === 'none');
const pwPlain = await evaluate(`(() => {
  const S = JSON.parse(localStorage.getItem('kedinasan_v2'));
  return (S.users || []).filter((u) => typeof u.p === 'string' && !String(u.p).startsWith('pbk:')).length;
})()`);
check('kunci lokal bukan plaintext', pwPlain === 0, `${pwPlain} akun pakai kunci plaintext`);
await shot('cms-01-overview');

// tab Akun Admin
await clickByText('.cms-nav button', 'Akun Admin');
await sleep(500);
check('tab akun', (await text('.cms-panel-head')).toLowerCase().includes('akun admin'));

// tab Paket
await clickByText('.cms-nav button', 'Paket');
await sleep(600);
check('tabel paket', (await text('.cms-panel-head')).includes('paket'));
const before = await evaluate(`JSON.parse(localStorage.getItem('kedinasan_v2')).packages[0].name`);
await evaluate(`document.querySelector('.cms-cell-link').click()`);
await sleep(500);
await setValue('.cms-drawer .cms-field input.cms-input', 'Paket Uji CMS');
await sleep(700);
const after = await evaluate(`JSON.parse(localStorage.getItem('kedinasan_v2')).packages[0].name`);
check('edit paket', after === 'Paket Uji CMS', `${before} -> ${after}`);
await shot('cms-02-paket');

// tutup drawer, buka Bank Soal
await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))`);
await sleep(400);
await clickByText('.cms-nav button', 'Bank Soal');
await sleep(800);
check('bank soal', (await text('.cms-bank-list .cms-panel-head')).includes('Pilih paket'));

await evaluate(`document.querySelector('.cms-qlist button').click()`);
await sleep(400);
await setValue('.cms-bank-editor textarea.cms-input', 'Soal uji dari panel CMS.');
await sleep(600);
const q0 = await evaluate(`JSON.parse(localStorage.getItem('kedinasan_v2')).packages[0].qs[0].t`);
check('edit soal', q0 === 'Soal uji dari panel CMS.', q0);
await shot('cms-03-soal');

// import dua soal dengan format resmi (§ pemisah soal, ¦ pemisah bagian) + timpa
await clickByText('.cms-bank-list .cms-panel-actions button', 'Import');
await sleep(400);
const official =
  ['Soal import satu', 'A1', 'B1', 'C1', 'D1', 'E1', 'Karena B yang benar', 'B'].join('\u00a6') +
  '\u00a7' +
  ['Soal import dua', 'A2', 'B2', 'C2', 'D2', 'E2', ''].join('\u00a6');
await setValue('.cms-modal textarea', official);
await sleep(300);
check('terbaca', (await evaluate(`document.querySelector('.cms-modal input[readonly]').value`)) === '2 soal');
await evaluate(`document.querySelector('.cms-check input').click()`);
await sleep(200);
await clickByText('.cms-modal footer button', 'Tempel ke bank soal');
await sleep(900);
const imported = await evaluate(`(() => {
  const p = JSON.parse(localStorage.getItem('kedinasan_v2')).packages[0];
  return { q0: p.qs[0].t, a0: p.qs[0].a, pem0: p.qs[0].pem, q1: p.qs[1].t };
})()`);
check(
  'import',
  imported.q0 === 'Soal import satu' && imported.a0 === 1 && imported.pem0 === 'Karena B yang benar' && imported.q1 === 'Soal import dua',
  JSON.stringify(imported),
);
await evaluate(`(() => { const b=[...document.querySelectorAll('.cms-modal footer button')].find(x=>x.innerText.includes('Tutup')); b&&b.click(); })()`);
await sleep(400);

// Tab Produk: demo CRUD (tambah -> edit -> duplikat) lewat form tersendiri.
await clickByText('.cms-nav button', 'Produk');
await sleep(600);
const prodBefore = await evaluate(`JSON.parse(localStorage.getItem('kedinasan_v2')).packages.length`);
await clickByText('.cms-panel-actions button', 'Produk baru');
await sleep(400);
await setValue('#pf-name', 'Produk Demo CMS');
await setValue('#pf-price', '15000');
await setValue('#pf-promo', '12000');
await setValue('#pf-status', 'pub');
await sleep(300);
// Unggah thumbnail produk: jalur gambar end-to-end (dibuat 480x320 JPEG).
await uploadPng('Thumbnail');
await sleep(1600);
await clickByText('.cms-drawer footer button', 'Simpan');
await sleep(800);
const prodCreated = await evaluate(`(() => {
  const S = JSON.parse(localStorage.getItem('kedinasan_v2'));
  const p = S.packages.find(x => x.name === 'Produk Demo CMS');
  return { count: S.packages.length, price: p && p.price, promo: p && p.promoPrice, pub: p && p.pub, qs: p && p.qs.length, thumb: p ? String(p.thumb || '').slice(0, 22) : '' };
})()`);
check(
  'tambah produk',
  prodCreated.count === prodBefore + 1 &&
    prodCreated.price === 15000 &&
    prodCreated.promo === 12000 &&
    prodCreated.pub === 1 &&
    prodCreated.qs === 30 &&
    prodCreated.thumb === 'data:image/jpeg;base64',
  JSON.stringify(prodCreated),
);
await shot('cms-04-produk');

// edit produk yang baru dibuat
await evaluate(`(() => {
  const b = [...document.querySelectorAll('.cms-table .cms-cell-link')].find(x => x.innerText.includes('Produk Demo CMS'));
  b && b.click();
})()`);
await sleep(400);
await setValue('#pf-name', 'Produk Demo CMS v2');
await setValue('#pf-price', '17500');
await sleep(300);
await clickByText('.cms-drawer footer button', 'Simpan');
await sleep(700);
const prodEdited = await evaluate(`(() => {
  const p = JSON.parse(localStorage.getItem('kedinasan_v2')).packages.find(x => x.name === 'Produk Demo CMS v2');
  return p ? { price: p.price } : null;
})()`);
check('edit produk', Boolean(prodEdited) && prodEdited.price === 17500, JSON.stringify(prodEdited));

// duplikat
await evaluate(`(() => {
  const row = [...document.querySelectorAll('.cms-table tbody tr')].find(r => r.innerText.includes('Produk Demo CMS v2'));
  const b = row && [...row.querySelectorAll('button')].find(x => x.innerText.includes('Duplikat'));
  b && b.click();
})()`);
await sleep(700);
const dupCount = await evaluate(
  `JSON.parse(localStorage.getItem('kedinasan_v2')).packages.filter(p=>p.name==='Produk Demo CMS v2 (salinan)').length`,
);
check('duplikat produk', dupCount === 1, String(dupCount));

// Tab Tampilan: banner berupa foto; teks banner lama ikut dikosongkan.
await clickByText('.cms-nav button', 'Tampilan');
await sleep(800);
await uploadPng('Foto banner');
await sleep(1400);
await evaluate(`(() => {
  const panel = [...document.querySelectorAll('.cms-panel')].find(p => (p.querySelector('h2') || {}).innerText === 'Banner beranda');
  const b = panel && [...panel.querySelectorAll('.cms-panel-actions button')].find(x => x.innerText.includes('Simpan'));
  b && b.click();
})()`);
await sleep(700);
const bannerState = await evaluate(`(() => {
  const S = JSON.parse(localStorage.getItem('kedinasan_v2'));
  return JSON.stringify({ text: S.banner, img: String(S.bannerImg || '').slice(0, 22) });
})()`);
check('banner', bannerState.includes('"text":""') && bannerState.includes('"img":"data:image/'), bannerState);

await uploadPng('Logo halaman login · terang');
await sleep(1400);
await evaluate(`(() => {
  const panel = [...document.querySelectorAll('.cms-panel')].find(p => (p.querySelector('h2') || {}).innerText === 'Logo');
  const b = panel && [...panel.querySelectorAll('.cms-panel-actions button')].find(x => x.innerText.includes('Simpan'));
  b && b.click();
})()`);
await sleep(700);
const loginLogo = await evaluate(
  `String(JSON.parse(localStorage.getItem('kedinasan_v2')).loginLogo || '').slice(0, 22)`,
);
check('logo login', loginLogo.startsWith('data:image/'), loginLogo);
await shot('cms-05-tampilan');

// Tab Pembayaran: unggah logo QRIS + daftar metode tersimpan di S.payList.
await clickByText('.cms-nav button', 'Pembayaran');
await sleep(600);
const defaultLogos = await evaluate(`(() => {
  const S = JSON.parse(localStorage.getItem('kedinasan_v2'));
  return ['BCA', 'BRI', 'MANDIRI'].map((k) => String((S.pay || {})[k] || '')).join(',');
})()`);
check(
  'logo bawaan',
  defaultLogos === '/pay/bca.svg,/pay/bri.svg,/pay/mandiri.svg',
  defaultLogos,
);
await uploadPng('QRIS');
await sleep(1400);
// rev76: nomor rekening bank diisi dari panel dan masuk ke S.payAcc.
await setValue('#pay-no-BCA', '1234 5678 90');
await setValue('#pay-name-BCA', 'Yayasan Hermes');
await sleep(300);
await clickByText('.cms-panel-actions button', 'Simpan');
await sleep(700);
const payState = await evaluate(`(() => {
  const S = JSON.parse(localStorage.getItem('kedinasan_v2'));
  return JSON.stringify({
    qris: String((S.pay || {}).QRIS || '').slice(0, 22),
    list: (S.payList || []).map((m) => m.k).join(','),
    acc: String(((S.payAcc || {}).BCA || {}).no || ''),
    name: String(((S.payAcc || {}).BCA || {}).name || ''),
  });
})()`);
check(
  'pembayaran',
  payState.includes('"qris":"data:image/') && payState.includes('"list":"QRIS,BCA,BRI,MANDIRI"'),
  payState,
);
check(
  'rekening BCA',
  payState.includes('"acc":"1234 5678 90"') && payState.includes('"name":"Yayasan Hermes"'),
  payState,
);
await shot('cms-05b-pembayaran');

// Tab Promo: tambah kreator + kode 6 digit.
await clickByText('.cms-nav button', 'Promo');
await sleep(600);
await clickByText('.cms-panel-actions button', 'Promo');
await sleep(400);
await setValue('#pr-name', 'Kak Rina');
await setValue('#pr-code', '123456');
await setValue('#pr-bank', 'BCA 111222');
await sleep(200);
await clickByText('.cms-drawer footer button', 'Simpan');
await sleep(700);
const promo = await evaluate(`(() => {
  const p = (JSON.parse(localStorage.getItem('kedinasan_v2')).promos||[]).find(x => String(x.code) === '123456');
  return p ? { name: p.name, on: p.on } : null;
})()`);
check('promo', Boolean(promo) && promo.name === 'Kak Rina' && promo.on === 1, JSON.stringify(promo));

// Tab Grup: buat grup lalu tambah anggota.
await clickByText('.cms-nav button', 'Grup');
await sleep(600);
await clickByText('.cms-panel-actions button', 'Grup');
await sleep(400);
await setValue('#grp-name', 'Siswa Beasiswa');
await clickByText('.cms-drawer footer button', 'Simpan');
await sleep(800);
await setValue('#grp-mname', 'Budi');
await setValue('#grp-muser', 'budi@mail.com');
await sleep(200);
await clickByText('.cms-drawer button', 'Tambah anggota');
await sleep(800);
const group = await evaluate(`(() => {
  const g = (JSON.parse(localStorage.getItem('kedinasan_v2')).groups||[]).find(x => x.name === 'Siswa Beasiswa');
  return g ? { members: g.members.length, user: g.members[0] && g.members[0].user } : null;
})()`);
check('grup', Boolean(group) && group.members === 1 && group.user === 'budi@mail.com', JSON.stringify(group));
await shot('cms-06-grup');

// Tab Akun Admin: kartu koneksi Supabase harus ada (tanpa sesi = form login).
await clickByText('.cms-nav button', 'Akun Admin');
await sleep(500);
const koneksi = await evaluate(`(() => {
  const p = [...document.querySelectorAll('.cms-panel')].find(x => x.innerText.includes('Koneksi Supabase'));
  if (!p) return null;
  const badge = p.querySelector('.cms-badge');
  return {
    form: Boolean(p.querySelector('input[type=email]')),
    badge: badge ? badge.innerText.trim() : '',
  };
})()`);
// ConnectionPanel di mode lokal tidak ada form Supabase (lihat ConnectionPanel.jsx).
check('koneksi supabase', Boolean(koneksi) && (koneksi.form || koneksi.badge === 'Mode lokal'), JSON.stringify(koneksi));
if (koneksi?.form) {
  await clickByText('.cms-panel button', 'Sambungkan');
  await sleep(400);
  const koneksiErr = await evaluate(`(() => {
    const p = [...document.querySelectorAll('.cms-panel')].find(x => x.innerText.includes('Koneksi Supabase'));
    const err = p && p.querySelector('.cms-alert.is-danger');
    return err ? err.innerText.trim() : '';
  })()`);
  check('koneksi wajib isi', koneksiErr.includes('Isi email'), koneksiErr);
} else {
  check('koneksi wajib isi', true, `tidak ada form Supabase (mode lokal, badge=${koneksi?.badge})`);
}
await shot('cms-06b-koneksi');

// reload: gerbang tidak muncul lagi (sessionStorage) dan data bertahan
await send('Page.reload', { ignoreCache: false });
await sleep(2800);
const afterReload = await evaluate(`(() => {
  const S = JSON.parse(localStorage.getItem('kedinasan_v2'));
  const paket = S.packages.find(x => x.name === 'Paket Uji CMS');
  const produk = S.packages.find(x => x.name === 'Produk Demo CMS v2');
  const grup = (S.groups || []).find(x => x.name === 'Siswa Beasiswa');
  const img = (v) => String(v || '').startsWith('data:image/');
  return {
    gate: !!document.querySelector('.cms-gate-card'),
    shell: !!document.querySelector('.cms-shell'),
    paket: paket ? paket.qs[0].t.slice(0, 24) : null,
    produk: produk ? produk.price : null,
    banner: !S.banner && img(S.bannerImg),
    loginLogo: img(S.loginLogo),
    qris: img((S.pay || {}).QRIS),
    rekening: String(((S.payAcc || {}).BCA || {}).no || ''),
    promo: (S.promos || []).some(p => String(p.code) === '123456'),
    grup: grup ? grup.members.length : 0,
  };
})()`);
check(
  'setelah reload',
  !afterReload.gate &&
    afterReload.shell &&
    afterReload.paket === 'Soal import satu' &&
    afterReload.produk === 17500 &&
    afterReload.banner &&
    afterReload.loginLogo &&
    afterReload.qris &&
    afterReload.rekening === '1234 5678 90' &&
    afterReload.promo &&
    afterReload.grup === 1,
  JSON.stringify(afterReload),
);
await shot('cms-07-reload');

// Cek responsif: bar atas di ponsel, tab tetap bisa digeser, tidak ada luapan.
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await sleep(500);
const mobile = await evaluate(`JSON.stringify({
  doc: document.documentElement.scrollWidth,
  win: innerWidth,
  navHead: getComputedStyle(document.querySelector('.cms-nav-head')).display,
  navScroll: getComputedStyle(document.querySelector('.cms-nav')).overflowX,
  sideTop: Math.round(document.querySelector('.cms-side').getBoundingClientRect().height)
})`);
check(
  'responsif 390',
  mobile.includes('"doc":390') &&
    mobile.includes('"win":390') &&
    mobile.includes('"navHead":"none"') &&
    mobile.includes('"navScroll":"auto"') &&
    mobile.includes('"sideTop":') &&
    !mobile.includes('"sideTop":0'),
  mobile,
);
await shot('cms-08-mobile');

// Halaman panel harus benar-benar bisa digulir. Dulu mode lanskap legacy
// memasang html{overflow:hidden} sehingga panel terkunci. Simulasi roda mouse
// lewat CDP tidak selalu menggulir di Chrome headless (input sintetis diabaikan),
// jadi yang diuji: overflow halaman terbuka + scroll benar-benar menggerakkan
// dokumen. Regresi "terkunci" tetap tertangkap lewat overflow/maxY.
await evaluate(`window.scrollTo(0, 0)`);
await clickByText('.cms-nav button', 'Paket');
await sleep(600);
const scrollState = await evaluate(`(() => {
  window.scrollTo(0, 0);
  window.scrollBy(0, 600);
  const moved = Math.round(scrollY);
  const html = getComputedStyle(document.documentElement).overflowY;
  const maxY = Math.max(0, document.documentElement.scrollHeight - innerHeight);
  window.scrollTo(0, 0);
  return JSON.stringify({ moved, html, maxY });
})()`);
const scroll = JSON.parse(scrollState);
check('scroll panel', scroll.html === 'auto' && scroll.maxY > 0 && scroll.moved > 0, scrollState);

if (consoleErrors.length) {
  failures++;
  console.log('\nERROR KONSOL:\n' + consoleErrors.join('\n'));
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
