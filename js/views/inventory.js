/**
 * Inventário: lista de itens e exclusão de ficha.
 */

// Lista do inventário
function invList(c) {
  const G = [
    ['Armas', x => x.w], ['Proteções', x => (PR[x.n] || x.hp) && !x.w], ['Munições', x => x.q != null],
    ['Utilidades', x => !x.w && !PR[x.n] && !x.hp && x.q == null && !x.am], ['Itens Amaldiçoados', x => x.am]
  ];
  return G
    .map(g => {
      let l = c.inv.map((it, i) => [it, i]).filter(p => g[1](p[0]));
      return `<div class=bar>${g[0]}</div>` +
        (l.map(([it, i]) => `<div class="card row"><div><b>${it.n}</b> <small>Cat. ${RM[it.cat]} · ${it.e} esp.${
                 it.w && it.w.mx ? ` · pente ${it.w.mag}/${it.w.mx}` :
                                   ''}${it.q != null ? ` · ${it.q} balas` : ''}</small>${
                 it.w && it.w.mx ? ` <button onclick="rc(${i})">Recarregar</button>` : ''}${
                 dsOf(it) ? `<br><small>${md(dsOf(it))}</small>` :
                            ''}</div><button class=x onclick="mut(z=>z.inv.splice(${i},1))">✕</button></div>`)
            .join('') ||
          '<small>vazio</small>')
    })
    .join('')
}

// Excluir ficha
function delC(id) {
  let c = S.chars.find(z => z.id == id);
  modal(`<b>Excluir ${
    esc(
      c.name)}?</b><p><small>Ela vai para a Lixeira (Configurações) e pode ser restaurada.</small></p><div class=grid2><button class=btn onclick="cm()">Cancelar</button><button class=btn style="background:var(--red)" onclick="cm();chDel(${
    id});R()">Excluir</button></div>`)
}
