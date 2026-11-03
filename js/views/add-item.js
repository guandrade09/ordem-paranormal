/**
 * Adicionar itens ao inventário (custo, descrição, categorias).
 */

// Custo em PE de uma habilidade
const costOf = t => {
  let m = t.match(
    /(gast\w+|pag\w+|custo de|custa|usar uma a\S+ \S+ e|com uma a\S+ \S+ e)\D{0,45}?(\d+)\s*(?:PE\b|pontos? de esforço)/i);
  return m ? +m[2] : 0
}, dsOf = it => BR[it.n] || BR[it.n.replace(/ de (Conhecimento|Energia|Morte|Sangue|Medo)$/, ' de (Elemento)')] || it.ds || '';

// Adiciona item ao inventário
function addIt(x, name, el, k) {
  mut(c => c.inv.push({
    n: name,
    cat: x[1],
    e: x[2],
    w: x[3].d ? {...x[3]} : null,
    q: x[3].q,
    am: k == 'amd' ? 1 : 0,
    el: el || (k == 'amd' ? ((x[4] || '').match(/^\*\*(\w+)\./) || [])[1] : null),
    ds: ''
  }))
}

// Tela de adicionar item
function add(k, i) {
  let x = CAT[k][i];
  if (x[0] == 'Selo Paranormal') return seloPick();
  if (/\(Elemento\)/.test(x[0])) {
    let E = /Componentes/.test(x[0]) ? ELP : [...ELP, 'Medo'];
    return modal(
      `<b>${x[0].replace(' (Elemento)', '')} — escolha o elemento</b><div class=grid2 style="gap:6px;margin-top:8px">${
        E.map(e => `<button class=btn style="background:${EC[e]}" onclick="addEl('${k}',${i},'${e}')">${e}</button>`)
          .join('')}</div>`)
  }
  cm();
  addIt(x, x[0], null, k)
}
