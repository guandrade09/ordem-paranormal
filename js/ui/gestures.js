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

// Arrastar para o lado: dedo para a direita abre a sidebar (conta, tema, backup…); para a esquerda fecha
let SW = null;
document.addEventListener('touchstart', e => {
  const t = e.touches[0];
  SW = e.touches.length == 1 && t ? {x: t.clientX, y: t.clientY, t: Date.now(), tg: e.target} : null
}, {passive: true});
document.addEventListener('touchend', e => {
  const s = SW, t = e.changedTouches[0];
  SW = null;
  if (!s || !t || document.querySelector('.ldr.full')) return;
  if (typeof authGate == 'function' && authGate()) return;  // tela de login: sem sidebar
  const dx = t.clientX - s.x, dy = t.clientY - s.y, open = $('#cfg').classList.contains('open');
  if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * .6 || Date.now() - s.t > 800) return;
  if ($('#m').className) return;  // janela aberta
  // não atrapalha campos, sliders nem listas que rolam para o lado
  for (let n = s.tg; n && n.nodeType == 1; n = n.parentElement) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName)) return;
    if (n.scrollWidth > n.clientWidth + 4 && /auto|scroll/.test(getComputedStyle(n).overflowX)) return
  }
  if (dx > 0 && !open) cfgT();
  else if (dx < 0 && open) cfgT()
}, {passive: true});
