import { createRoot } from 'react-dom/client';

/**
 * Menempelkan komponen React ke simpul DOM yang dibuat oleh engine legacy.
 * Dipakai saat sebuah layar dikonversi bertahap dari string HTML ke JSX.
 *
 *   // di app.js (atau lewat tools/extract-legacy.mjs)
 *   function notif(){ return back() + '<div id="view-notif"></div>'; }
 *
 *   // setelah #app dirender, panggil dari mana saja:
 *   window.mountReactView(document.getElementById('view-notif'), NotifView, { foo: 1 });
 *
 * `render()` legacy menimpa seluruh isi `#app`, jadi simpul wadah lama ikut
 * lepas dan komponennya harus dipasang ulang. Supaya root lama tidak menumpuk,
 * helper ini menyimpan satu root aktif: begitu container yang dipanggil
 * berbeda, root sebelumnya di-unmount lebih dulu.
 *
 * @returns {() => void} fungsi unmount
 */
let active = null;

export function mountReactView(container, Component, props = {}) {
  if (!container) throw new Error('mountReactView: container tidak ditemukan');

  if (active && active.container !== container) {
    const previous = active;
    active = null;
    try {
      previous.root.unmount();
    } catch {
      /* container lama sudah dibuang legacy; tidak ada yang perlu dibersihkan */
    }
  }

  if (!active) active = { container, root: createRoot(container) };
  active.root.render(<Component {...props} />);

  return () => {
    if (active?.container !== container) return;
    const { root } = active;
    active = null;
    root.unmount();
  };
}
