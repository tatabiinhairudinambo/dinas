/**
 * Perkecil gambar unggahan panel CMS supaya tidak membengkak di localStorage
 * (mode demo) dan saat ikut snapshot Supabase.
 *
 * - makeThumb()  : JPEG 3:2 (480×320) untuk thumbnail produk/paket
 * - makeBanner() : JPEG 113:30 (904×240) mengikuti crop banner legacy
 * - makeLogo()   : PNG dengan transparansi (default rasio 3,3:1 seperti crop
 *                  logo legacy; rasio 2:1 untuk logo metode pembayaran)
 */

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function crop(file, width, height, mime, quality) {
  const dataUrl = await readAsDataUrl(file);
  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  }).catch(() => null);
  if (!img) return dataUrl;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const scale = Math.max(width / img.width, height / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
  return canvas.toDataURL(mime, quality);
}

export function makeThumb(file) {
  return crop(file, 480, Math.round((480 * 2) / 3), 'image/jpeg', 0.86);
}

/** Banner beranda: rasio 113:30 sama seperti crop() legacy (904 px). */
export function makeBanner(file) {
  const width = 904;
  return crop(file, width, Math.round((width * 30) / 113), 'image/jpeg', 0.88);
}

/** Logo (PNG, transparansi dipertahankan). Default 660×200 seperti crop 3,3:1. */
export function makeLogo(file, ratio = 3.3, width = 660) {
  return crop(file, width, Math.round(width / ratio), 'image/png');
}
