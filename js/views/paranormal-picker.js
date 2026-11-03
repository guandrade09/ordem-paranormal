/**
 * Escolha de poder paranormal na criação e ajustes do catálogo.
 */

// Lista de poderes paranormais
function cpList() {
  let d = S.d, q = nz(d.cq || '');
  return ELP
           .map(e => {
             let l = (D.PP[e] || []).map((p, i) => [p, i]).filter(([p]) => nz(p.n + p.t).includes(q));
             return l.length ? `<div class=bar style="background:${EC[e]}">${e}</div>` +
                 l.map(([p, i]) => {
                    let [ok, ms] = okp(d, p.p);
                    return `<button class="card ${ok ? '' : 'gy'}" ${
                      ok ? `onclick="S.d.cpp=['${e}',${i}];R()"` :
                           ''}><b>${p.n}</b><br><small>${p.s ? md(p.s) : p.t.slice(0, 95) + '…'}</small>${
                      p.p ? `<br><small class=pre>Pré-requisito: ${p.p}${!ok ? ' — falta: ' + ms : ''}</small>` :
                            ''}</button>`
                  })
                   .join('') :
                               ''
           })
           .join('') ||
    '<small>Nenhum poder.</small>'
}
function cpStep(d) {
  let x = d.cpp;
  if (x) {
    let p = D.PP[x[0]][x[1]];
    return `<b>${p.n}</b> <span class=el style="background:${EC[x[0]]}">${x[0]}</span><p>${md(p.t)}</p>${
      p.p ? `<small>Pré-requisito: ${p.p}</small>` : ''}${
      afNote(p.a, x[0],
        d)}<div class=grid2><button class=btn onclick="S.d.cpp=null;R()">Voltar</button><button class=btn onclick="cpOk()">Confirmar</button></div>`
  }
  return `<button onclick="cpBack()">← Voltar à origem</button><div class=bar>Traços do Outro Lado — 1 poder paranormal</div><small>Esta origem reduz a Sanidade da classe à metade.</small><input placeholder="🔎 Pesquisar poder paranormal..." value="${
    esc(d.cq || '')}" oninput="S.d.cq=this.value;$('#cpq').innerHTML=cpList()"><div id=cpq class=scr>${cpList()}</div>`
}
function cpOk() {
  let d = S.d;
  d.cpow = d.cpp;
  d.cpp = null;
  nx()
}
function cpBack() {
  let d = S.d;
  d.cpp = null;
  d.cpow = null;
  d.origem = '';
  d.ok.Origem = 0;
  S.st = 'Origem';
  R()
}
CAT.amd.push(['Grimório Ritualístico', 0, 1, {}, BR['Grimório Ritualístico']]);
CAT.amd.sort((a, b) => a[0].localeCompare(b[0], 'pt'));
