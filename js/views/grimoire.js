/**
 * Grimório Paranormal.
 */

// Grimório
function grim() {
  return `<div class=fade><button onclick="S.v='mestre';R()">← Voltar</button><div class=bar>Grimório Paranormal</div><input placeholder="🔎 Pesquisar ritual..." value="${
    esc(S.gq || '')}" oninput="S.gq=this.value;$('#gl').innerHTML=glist()"><div id=gl>${glist()}</div></div>`
}
function glist() {
  let q = nz(S.gq || ''), h = '';
  for (let ci = 1; ci <= 4; ci++)
    for (const e of ['*', ...ELO]) {
      let l = RT.filter(r => r.ci == ci && r.el == e && nz(r.n + r.s).includes(q))
                .sort((a, b) => a.n.localeCompare(b.n, 'pt'));
      if (l.length)
        h += `<div class=bar style="background:${EC[e] || '#000'}">${ci}º círculo · ${
               e == '*' ? 'Qualquer elemento' : e}</div>` +
          l.map(r => `<button class=card onclick="gcard(${RT.indexOf(r)})"><b>${r.n}</b> <small>${
                  BC[ci]} PE</small><br><small>${r.s}</small></button>`)
            .join('')
    }
  return h || '<small>Nenhum ritual encontrado.</small>'
}
function gcard(i) {
  let r = RT[i],
      v = x => x ?
    `${BC[r.ci] + x[0]} PE${x[1] > 1 ? ' · requer ' + x[1] + 'º círculo' : ''}${x[2] ? ' · afinidade' : ''}` :
    'indisponível';
  modal(`${r.el == '*' ? art4(r.ci) : `<svg viewBox="0 0 100 100" width=90>${art(r.el, r.ci)}</svg>`}<br><b>${
    r.n}</b><br><small>${r.ci}º círculo · ${r.el == '*' ? 'Conhecimento, Energia, Morte ou Sangue' : r.el}</small>${
    rinfo(r)}<small>Normal: ${BC[r.ci]} PE<br>Discente: ${v(r.d)}<br>Verdadeiro: ${
    v(r.v)}</small><button class=btn onclick="cm()">Fechar</button>`)
}
