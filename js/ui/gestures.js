/**
 * Gestos de toque (pressionar e segurar).
 */

// Pressionar e segurar
let LP = 0, lt;
document.addEventListener('pointerdown', e => {
  let x = e.target.closest('.lp');
  LP = 0;
  if (x)
    lt = setTimeout(() => {
      LP = 1;
      modal(x.dataset.t)
    }, 550)
});
['pointerup', 'pointermove', 'pointercancel'].forEach(v => document.addEventListener(v, () => clearTimeout(lt)));
