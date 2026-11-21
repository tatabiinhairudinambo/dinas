export function compressImage(file, maxW = 1400, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', quality));
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gambar tidak terbaca'));
    };
    img.src = url;
  });
}

export function cropPhoto(file, { ratio = 2 / 3, outW = 400, zoom = 1, px = 0.5, py = 0.5 } = {}) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const outH = Math.round(outW / ratio);
        const c = document.createElement('canvas');
        c.width = outW;
        c.height = outH;
        const x = c.getContext('2d');
        x.fillStyle = '#fff';
        x.fillRect(0, 0, outW, outH);
        const base = Math.max(outW / img.width, outH / img.height) * zoom;
        const dw = img.width * base;
        const dh = img.height * base;
        x.drawImage(img, (outW - dw) * px, (outH - dh) * py, dw, dh);
        resolve(c.toDataURL('image/jpeg', 0.88));
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gambar tidak terbaca'));
    };
    img.src = url;
  });
}
