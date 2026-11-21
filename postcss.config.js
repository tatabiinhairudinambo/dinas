/**
 * PostCSS minimal: hanya autoprefixer. Engine CSS legacy sudah modern
 * (:has(), container query units) dan valid — preset-env bawaan Next justru
 * menimpanya dan memunculkan "Unknown node type". Jangan tambah plugin lain.
 */
const plugins = ['autoprefixer'];

module.exports = { plugins };
