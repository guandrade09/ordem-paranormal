/**
 * Regras: Selo Paranormal e elementos adicionais.
 */

// Selo Paranormal
function seloPick() {
  const l = RT.map((r, i) => [r, i])
              .filter(([r]) => !M4(r))
              .sort((a, b) => a[0].ci - b[0].ci || a[0].n.localeCompare(b[0].n, 'pt'));
  modal(`<button class=xc onclick="cm()">✕</button><b>Selo Paranormal — escolha o ritual</b><div class=scr>${
    l.map(([r, i]) => `<button class=card onclick="seloAdd(${i})"><b>${r.n}</b> ${
            r.el == '*' ? '' : `<span class=el style="background:${EC[r.el]}">${r.el}</span>`} <small>${
            r.ci}º círculo</small><br><small class=cl2>${r.s}</small></button>`)
      .join('')}</div>`)
}
function seloAdd(i, e) {
  let r = RT[i];
  if (r.el == '*' && !e)
    return modal(`<b>${r.n} — escolha o elemento</b><div class=grid2 style="gap:6px;margin-top:8px">${
      ELP.map(x => `<button class=btn style="background:${EC[x]}" onclick="seloAdd(${i},'${x}')">${x}</button>`)
        .join('')}</div>`);
  cm();
  let el = r.el == '*' ? e : r.el;
  mut(c => c.inv.push({
    n: 'Selo de ' + r.n,
    cat: 0,
    e: 1,
    w: null,
    sl: r.n + (r.el == '*' ? '|' + el : ''),
    el,
    am: 0,
    ds: 'Selo paranormal do ritual ' + r.n + '.'
  }))
}
function seloMk(ci) {
  let c = cur();
  if (c.pe < BC[ci]) return toast('PE insuficiente');
  mut(z => {z.pe -= BC[ci]});
  toast('Selo fabricado (' + ci + 'º círculo) · −' + BC[ci] + ' PE')
}
function addEl(k, i, e) {
  cm();
  let x = CAT[k][i];
  addIt(x, x[0].replace('(Elemento)', e), e, k)
}
