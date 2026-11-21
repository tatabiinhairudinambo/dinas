/**
 * PostCSS minimal: hanya autoprefixer. CSS aplikasi sudah modern
 * (:has(), container query units) — preset-env bawaan Next justru menimpanya
 * dan memunculkan "Unknown node type". Jangan tambah plugin lain.
 */
const plugins = ['autoprefixer'];

module.exports = { plugins };
