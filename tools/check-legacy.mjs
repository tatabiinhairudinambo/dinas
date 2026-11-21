/**
 * Validasi sintaks public/legacy/app.js sebagai CLASSIC SCRIPT.
 *
 * Catatan: `node --check` tidak bisa dipakai di repo ini karena package.json
 * memakai "type": "module", sehingga .js diperiksa sebagai ESM — padahal
 * app.js harus berupa classic script (di ESM deklarasi ganda & binding global
 * ilegal). vm.Script mengompilasi dalam mode script, sama seperti browser.
 */
import fs from 'node:fs';
import vm from 'node:vm';

const file = process.argv[2] || 'public/legacy/app.js';
const code = fs.readFileSync(file, 'utf8');

try {
  new vm.Script(code, { filename: file });
  console.log(`OK  ${file} lolos parse sebagai classic script (${code.length} char)`);
} catch (err) {
  console.error(`GAGAL  ${file}`);
  console.error(err.stack || err.message);
  process.exit(1);
}
