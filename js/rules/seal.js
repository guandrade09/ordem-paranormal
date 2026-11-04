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
// Versões do ritual no selo: 0 Normal, 1 Discente, 2 Verdadeiro
const SELV = ['Normal', 'Discente', 'Verdadeiro'],
      // Preço de fabricar o selo = custo de conjurar o ritual na versão escolhida (círculo + versão, com reduções como Ritual Predileto)
      seloCusto = (c, id, j) => {
        const r = RT.find(z => z.n == id.split('|')[0]);
        if (!r) return 0;
        const ex = j == 1 ? (r.d ? r.d[0] : 0) : j == 2 ? (r.v ? r.v[0] : 0) : 0;
        return Math.max(0, BC[r.ci] - RPD(c, id) + ex)
      };
function seloAdd(i, e) {
  let r = RT[i];
  if (r.el == '*' && !e)
    return modal(`<b>${r.n} — escolha o elemento</b><div class=grid2 style="gap:6px;margin-top:8px">${
      ELP.map(x => `<button class=btn style="background:${EC[x]}" onclick="seloAdd(${i},'${x}')">${x}</button>`)
        .join('')}</div>`);
  seloVer(i, r.el == '*' ? e : r.el)
}
// Escolha da versão (Normal / Discente / Verdadeiro): o preço já aparece calculado
function seloVer(i, el) {
  const c = cur(), r = RT[i], id = r.n + (r.el == '*' ? '|' + el : '');
  modal(`<button class=xc onclick="cm()">✕</button><button onclick="seloPick()">← Rituais</button><br><b>Selo de ${r.n}</b> <span class=el style="background:${
    EC[el]}">${el}</span> · ${r.ci}º círculo<br><small>Escolha a versão do ritual guardada no selo. O preço de fabricar é calculado pelo círculo e pela versão.</small>${
    SELV.map((v, j) => {
      const off = j == 1 ? !r.d : j == 2 ? !r.v : false;
      return `<button class="card row" ${off ? 'disabled style="opacity:.5"' : ''} onclick="seloFim(${i},'${el}',${j})"><span style="flex:1"><b>${v}</b><br><small>${
        off ? 'Indisponível para este ritual' : 'Ritual ' + r.ci + 'º círculo' + (j ? ' · ' + v.toLowerCase() : '')}</small></span>${
        off ? '' : `<b class=pec>${seloCusto(c, id, j)} PE</b>`}</button>`
    }).join('')}`)
}
function seloFim(i, el, j) {
  let r = RT[i];
  cm();
  mut(c => c.inv.push({
    n: 'Selo de ' + r.n + (j ? ' (' + SELV[j] + ')' : ''),
    cat: 0,
    e: 1,
    w: null,
    sl: r.n + (r.el == '*' ? '|' + el : ''),
    sv: j,
    el,
    am: 0,
    ds: 'Selo paranormal do ritual ' + r.n + (j ? ', versão ' + SELV[j].toLowerCase() : '') + '.'
  }))
}
// Fabricar o selo: um único botão, preço automático (círculo + versão)
function seloMk(i) {
  const c = cur(), it = c.inv[i];
  if (!it || !it.sl) return;
  const n = seloCusto(c, it.sl, it.sv || 0);
  if (c.pe < n) return toast('PE insuficiente');
  mut(z => {z.pe -= n});
  toast(`Selo fabricado (${it.n}) · −${n} PE`)
}
function addEl(k, i, e) {
  cm();
  let x = CAT[k][i];
  addIt(x, x[0].replace('(Elemento)', e), e, k)
}
