/**
 * tools/extract-legacy.mjs
 * ---------------------------------------------------------------------------
 * Memecah file tunggal hasil patch (part74) menjadi struktur proyek Vite+React.
 *
 * Sumber : archive/original.html
 * Keluaran:
 *   public/legacy/app.js     -> 21 blok <script> digabung apa adanya (classic script)
 *   src/styles/*.css         -> seluruh CSS, urutan dokumen dipertahankan
 *   tools/extract-report.txt -> ringkasan hasil (untuk audit)
 *
 * Kenapa classic script: kode legacy memakai binding global (let/const) yang
 * dipakai bersama antar blok dan dipanggil dari atribut inline (onclick=).
 * Di ESM semua itu hilang. Jadi app.js TIDAK boleh di-bundle Vite.
 *
 * Kenapa CSS diekstrak berurutan: 37 selector dipakai di CSS statis DAN di CSS
 * yang di-inject JS. Urutan cascade menentukan tampilan, jadi injeksi runtime
 * diubah menjadi file CSS pada posisi yang sama persis.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'archive', 'original.html');
const html = fs.readFileSync(SRC, 'utf8');
const lineOf = (idx) => html.slice(0, idx).split('\n').length;

/* ------------------------------------------------------------------ util */
function decodeJsString(raw) {
  return raw.replace(
    /\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|\r\n|[\s\S])/g,
    (_m, esc) => {
      if (esc[0] === 'u' && esc[1] === '{') return String.fromCodePoint(parseInt(esc.slice(2, -1), 16));
      if (esc[0] === 'u') return String.fromCharCode(parseInt(esc.slice(1), 16));
      if (esc[0] === 'x') return String.fromCharCode(parseInt(esc.slice(1), 16));
      switch (esc) {
        case 'n': return '\n';
        case 'r': return '\r';
        case 't': return '\t';
        case 'b': return '\b';
        case 'f': return '\f';
        case 'v': return '\v';
        case '0': return '\0';
        case '\n': return '';
        case '\r\n': return '';
        default: return esc;
      }
    },
  );
}

const INJECT = /^[ \t]*document\.head\.insertAdjacentHTML\('beforeend','<style>([\s\S]*?)<\/style>'\);?[ \t]*\r?\n?/gm;
const GENERATED_MARK = "document.head.insertAdjacentHTML('beforeend','<style>'+css+'</style>');";

/* ------------------------------------------------------- pindai dokumen */
const units = [];
const tagRe = /<script\b[^>]*>([\s\S]*?)<\/script>|<style\b[^>]*>([\s\S]*?)<\/style>/gi;
let m;
while ((m = tagRe.exec(html))) {
  const isScript = m[1] !== undefined;
  units.push({
    kind: isScript ? 'script' : 'style',
    body: isScript ? m[1] : m[2],
    line: lineOf(m.index + m[0].indexOf('>') + 1),
  });
}

/* --------------------------------------------------------- olah tiap blok */
const chain = []; // { line, kind:'static'|'inject', css }
const jsBlocks = [];
const report = [];

units.forEach((u, i) => {
  const n = i + 1;
  if (u.kind === 'style') {
    chain.push({ line: u.line, kind: 'static', css: u.body.trim() });
    report.push(`style  #${n} line ${u.line}  ${u.body.length}b  -> static`);
    return;
  }

  let code = u.body;
  const before = code.length;

  // 1. IIFE yang membangun CSS dari array (rev58 & rev59) -> diekstrak utuh.
  for (;;) {
    const at = code.indexOf(GENERATED_MARK);
    if (at < 0) break;
    const open = code.lastIndexOf('(function(){', at);
    const close = code.indexOf('})();', at);
    if (open < 0 || close < 0) throw new Error(`IIFE CSS rev gagal dipotong di line ${u.line}`);
    const snippet = code.slice(open, close + '})();'.length);
    const captured = [];
    // snippet murni: hanya memakai `document` sebagai stub.
    new Function('document', snippet)({
      head: { insertAdjacentHTML: (_pos, markup) => captured.push(markup) },
    });
    const css = captured.map((s) => s.replace(/^<style>/, '').replace(/<\/style>$/, '')).join('\n');
    chain.push({ line: u.line, kind: 'inject', css, generated: true });
    code = code.slice(0, open) + code.slice(close + '})();'.length);
  }

  // 2. Injeksi CSS literal satu baris -> jadi entri CSS, barisnya dibuang.
  let injected = 0;
  code = code.replace(INJECT, (_full, rawCss) => {
    chain.push({ line: u.line, kind: 'inject', css: decodeJsString(rawCss).trim() });
    injected += 1;
    return '';
  });
  code = code.replace(/^\s*\n/, '');

  if (/insertAdjacentHTML\('beforeend','<style>/.test(code)) {
    throw new Error(`masih ada injeksi CSS yang belum tertangani di line ${u.line}`);
  }

  // 3. render() saat load ditunda ke microtask.
  //
  // Aslinya tiap blok adalah <script> terpisah, jadi render() di akhir blok 1
  // belum bisa memanggil fungsi blok rev58/rev59 (belum ada). Setelah blok
  // digabung menjadi satu script, semua let/const tingkat atas berada di scope
  // yang sama dan masih TDZ selama script dieksekusi -> "Cannot access
  // 'wpLvl59' before initialization". Menunda render sampai script selesai
  // mengembalikan perilaku asli (semua deklarasi sudah siap) dan membuat render
  // pertama langsung memakai versi final.
  const deferred = code
    .replace(/^[ \t]*render\(\);?[ \t]*$/gm, 'queueMicrotask(__legacyRender);')
    .replace(/applyScale\(\);render\(\);/g, 'applyScale();queueMicrotask(__legacyRender);');

  jsBlocks.push({ line: u.line, code: deferred.replace(/^\r?\n/, '') });
  report.push(
    `script #${n} line ${u.line}  ${before}b -> ${code.length}b  (css dilepas: ${injected})`,
  );
});

/* --------------------------------------------------------------- tulis CSS */
const groups = [
  { file: '01-base.css', title: 'Token & kerangka dasar (style #1-#2 di <head>)', pick: (c) => c.kind === 'static' && c.line < 900 },
  { file: '02-rev04-40.css', title: 'Revisi 4-40: CSS yang dulu di-inject dari blok script pertama', pick: (c) => c.kind === 'inject' && c.line < 900 },
  { file: '03-rev41-57.css', title: 'Revisi 41-57: layar horizontal, ujian, kisi-kisi', pick: (c) => c.kind === 'static' && c.line >= 900 && c.line < 1980 },
  { file: '04-rev58-garis-gelap.css', title: 'Revisi 58: garis mode gelap (dibangun dari array di script)', pick: (c) => c.generated && c.line < 2000 },
  { file: '05-rev58-62.css', title: 'Revisi 58-62: arena, ambient, kaca', pick: (c) => c.kind === 'static' && c.line >= 1980 && c.line < 2100 },
  { file: '06-rev59-outline-gelap.css', title: 'Revisi 59: outline tombol gelap (dibangun dari array di script)', pick: (c) => c.generated && c.line >= 2000 },
  { file: '07-rev59-74.css', title: 'Revisi 61-74: amal, grup, tombol gratis', pick: (c) => c.kind === 'static' && c.line >= 2100 },
];

const stylesDir = path.join(ROOT, 'src', 'styles');
fs.mkdirSync(stylesDir, { recursive: true });

// Pengaman: pembagian file CSS memakai nomor baris, jadi menyisipkan/menghapus
// baris di atas blok CSS terakhir bisa memindahkan blok antar file dan
// mengubah cascade. Kalau jumlah blok per file berubah, beri peringatan.
const MARK = /\/\* ---- (?:style|inject) @baris /g;
const countBlocks = (file) => {
  try {
    return (fs.readFileSync(file, 'utf8').match(MARK) || []).length;
  } catch {
    return null;
  }
};

const used = new Set();
groups.forEach((g) => {
  const items = chain.filter((c) => !used.has(c) && g.pick(c));
  items.forEach((c) => used.add(c));
  const head = `/* ${g.title}\n   Sumber: archive/original.html — jangan ubah urutan antar file. */\n`;
  const body = items
    .map((c) => `\n/* ---- ${c.kind === 'static' ? 'style' : 'inject'} @baris ${c.line} ---- */\n${c.css}\n`)
    .join('');
  const target = path.join(stylesDir, g.file);
  const prev = countBlocks(target);
  if (prev != null && prev !== items.length) {
    console.warn(
      `PERINGATAN ${g.file}: jumlah blok ${prev} -> ${items.length}. ` +
        'Nomor baris di archive/original.html bergeser; periksa apakah ada blok CSS yang pindah file.',
    );
  }
  fs.writeFileSync(target, head + body);
  report.push(`css    ${g.file.padEnd(26)} ${String(items.length).padStart(2)} blok`);
});

const leftover = chain.filter((c) => !used.has(c));
if (leftover.length) throw new Error(`CSS tidak terklasifikasi: ${leftover.map((c) => c.line).join(', ')}`);

const indexCss = `/* Urutan @import = urutan cascade asli. JANGAN diacak. */\n${groups
  .map((g) => `@import './${g.file}';`)
  .join('\n')}\n\n/* Pembungkus React (\`#root\`) tidak boleh ikut layout. */\n#root {\n  display: contents;\n}\n`;
fs.writeFileSync(path.join(stylesDir, 'index.css'), indexCss);

/* ---------------------------------------------------------------- tulis JS */
const legacyDir = path.join(ROOT, 'public', 'legacy');
fs.mkdirSync(legacyDir, { recursive: true });

const banner = `/* eslint-disable */
/* ===========================================================================
   MESIN LEGACY "WEB KEDINASAN" (rev4-rev74, part74)
   ---------------------------------------------------------------------------
   File ini hasil gabungan utuh 21 blok <script> dari archive/original.html.
   Dimuat sebagai CLASSIC SCRIPT (bukan ES module) oleh src/lib/legacyBridge.js,
   setelah React memasang <div id="app"> dan <div id="m">.
   - Jangan di-import lewat \`import\`/bundler: binding global & onclick inline
     akan hilang dan seluruh layar mati.
   - CSS-nya sudah dipindah ke src/styles/*.css (urutan cascade dipertahankan).
   - render() saat load ditunda satu microtask supaya deklarasi let/const dari
     blok-blok akhir (rev58+) sudah siap; lihat catatan di tools/extract-legacy.mjs
   - Regenerasi file ini: node tools/extract-legacy.mjs
   =========================================================================== */

function __legacyRender() {
  try {
    render();
  } catch (err) {
    console.error('[WebKedinasan] render gagal:', err);
  }
}
`;

const js = banner + jsBlocks
  .map((b, i) => `\n/* ================= blok ${i + 1} / ${jsBlocks.length} (baris ${b.line}) ================= */\n${b.code.trim()}\n`)
  .join('');
fs.writeFileSync(path.join(legacyDir, 'app.js'), js);

/* -------------------------------------------------------------- laporan */
fs.writeFileSync(
  path.join(ROOT, 'tools', 'extract-report.txt'),
  [
    `Sumber: ${path.relative(ROOT, SRC)} (${html.length} char)`,
    `Blok <script>: ${jsBlocks.length}, blok <style> statis: ${chain.filter((c) => c.kind === 'static').length}, injeksi: ${chain.filter((c) => c.kind === 'inject').length}`,
    '',
    ...report,
    '',
    `app.js: ${js.length} char`,
  ].join('\n'),
);

console.log(report.join('\n'));
console.log(`\napp.js ${js.length} char, ${jsBlocks.length} blok. CSS: ${chain.length} entri.`);
