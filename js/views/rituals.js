/**
 * Rituais na ficha: lista, cards, conjuração e rolagens.
 */

// Imagem do ritual (PNG pequeno, SEM borda). Rituais do livro: slugs em RART → img/rit/<slug>.png (as imagens chegam aos poucos).
// Homebrew: r.img = data URL enviada pelo Mestre (validada em hbApply).
const RART = new Set([]), rslug = n => nz(n).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      rsrc = r => r.img || (RART.has(rslug(r.n)) ? `img/rit/${rslug(r.n)}.png` : ''),
      rimg = (r, ic) => {
        const s = rsrc(r);
        return s ? `<img class="rimg${ic ? ' ic' : ''}" src="${s}" alt="">` : ''
      };

// Lista de rituais
function rlist(ci) {
  let q = nz(S.q || ''), h = '';
  for (const e of ['*', ...ELO]) {
    let l = RT.filter(r => r.ci == ci && r.el == e && !M4(r) && nz(r.n + r.s).includes(q))
              .sort((a, b) => a.n.localeCompare(b.n, 'pt'));
    if (l.length)
      h += `<div class=bar style="background:${EC[e] || '#000'}">${e == '*' ? 'Elemento à escolha' : e}</div>` +
        l.map(r => `<button class=card onclick="rcard(${RT.indexOf(r)})">${
                S.d && S.d.rit.some(x => x.split('|')[0] == r.n) ? '<span class=chk>✔</span>' :
                                                                   ''}<b>${r.n}</b><br><small>${r.s}</small></button>`)
          .join('')
  }
  return h || '<small>Nenhum ritual encontrado.</small>'
}

// Card de ritual
function rcard(i) {
  let r = RT[i];
  if (S.d.rit.some(x => x.split('|')[0] == r.n)) {
    S.d.rit = S.d.rit.filter(x => x.split('|')[0] != r.n);
    return rr()
  }
  modal(`${rimg(r) || (r.el == '*' ? art4(r.ci) : `<svg viewBox="0 0 100 100" width=90>${art(r.el, r.ci)}</svg>`)}<br><b>${
    r.n}</b> · ${r.ci}º círculo · ${BC[r.ci]} PE${rinfo(r)}<small>${rver(r)}</small>${
    r.el == '*' ? '<small>Escolha o elemento:</small><div class=grid2>' +
        ELO.slice(0, 4)
          .map(
            e => `<button class=btn style="background:${EC[e]}" onclick="pick('Amaldiçoar Arma|${e}')">${e}</button>`)
          .join('') +
        '</div>' :
                  `<button class=btn onclick="pick('${r.n}')">Confirmar</button>`}`)
}

// Aba de rituais
function rsheet(c, k) {
  let l = c.rit.filter(x => typeof x == 'string').map(x => {
    let [n, e] = x.split('|'), r = RT.find(z => z.n == n);
    return {
      r, e: e || r.el, id: x
    }
  });
  if (!l.length && c.classe != 'Ocultista') return '';
  let h = `<div class=rb><div class=bar>Rituais</div><div class=dtp><small>DT</small><b>${k.dt}</b></div></div>`;
  for (let ci = 1; ci <= 4; ci++)
    for (const e of ELO) {
      let g = l.filter(x => x.r.ci == ci && x.e == e).sort((a, b) => a.r.n.localeCompare(b.r.n, 'pt'));
      if (g.length)
        h += `<div class=bar style="background:${EC[e]}">${ci}º círculo · ${e}</div>` +
          g.map(
             x => `<div class="card lp row" data-t="${esc(x.r.n + ': ' + x.r.s)}" onclick="if(!LP)rv('${
               x.id}')">${rimg(x.r, 1) || `<svg viewBox="0 0 100 100" width=80 height=80 style="flex:none">${
               art(x.e, ci)}</svg>`}<div style="flex:1;min-width:0"><b>${x.r.n}</b> <span class=el style="background:${
               EC[x.e]}">${x.e}</span>${(c.grm || []).includes(x.id) ? ' <small>📖</small>' : ''}<br><small class=cl2>${
               x.r.s}</small>${c.rl && c.rl[x.id] ? `<br><small>Usado ${c.rl[x.id]}×</small>` : ''}${
               (c.sust || []).some(q => q.id == x.id) ?
                 `<br><button onclick="event.stopPropagation();dis('${x.id}')">Dissipar</button>` :
                 ''}</div><b class=pec>${Math.max(0, BC[ci] - RPD(c, x.id))} PE</b></div>`)
            .join('')
    }
  return h
}
function flaCard(i) {
  let c = cur(), k = K(c), p = abl(c, k)[i],
      l = c.rit.filter(x => typeof x == 'string')
            .map(x => {
              let r = RT.find(z => z.n == x.split('|')[0]);
              return r && {
                r, id: x, e: x.split('|')[1] || r.el
              }
            })
            .filter(Boolean)
            .sort((a, b) => a.r.ci - b.r.ci || a.r.n.localeCompare(b.r.n, 'pt'));
  modal(`<button class=xc onclick="cm()">✕</button><div class=ahd><b style="font:26px 'Bebas Neue'">${
    p[0]}</b><b class=pec style="color:#e53935">PV</b></div><p>${
    md(p[3])}</p><small>Escolha o ritual (custo em PV = 2 × custo em PE):</small>${
    l.map(x => `<button class="card row" onclick="flaRv('${x.id}')"><span style="flex:1"><b>${
            x.r.n}</b> <span class=el style="background:${EC[x.e] || '#000'}">${x.e}</span><br><small>${
            x.r.ci}º círculo</small></span><b class=pec style="color:#e53935">${
            2 * Math.max(0, BC[x.r.ci] - RPD(c, x.id))} PV</b></button>`)
      .join('') ||
    '<small>Você não conhece nenhum ritual.</small>'}`)
}
function flaRv(id) {
  let c = cur(), r = RT.find(z => z.n == id.split('|')[0]), e = id.split('|')[1] || r.el, b = BC[r.ci] - RPD(c, id),
      a = acc(c.nex), o = [
        ['Normal', Math.max(0, b), 1, 0], ['Discente', r.d && Math.max(0, b + r.d[0]), r.d && r.d[1], r.d && r.d[2]],
        ['Verdadeiro', r.v && Math.max(0, b + r.v[0]), r.v && r.v[1], r.v && r.v[2]]
      ];
  modal(`<button class=xc onclick="cm()">✕</button>${rimg(r)}<b>${r.n}</b> <span class=el style="background:${EC[e] || '#000'}">${
    e}</span> · ${r.ci}º círculo<br>${rinfo(r)}${
    o.map((x, j) => {
       let off = x[1] == null || a < x[2];
       return `<button class="card row" ${off ? 'disabled style="opacity:.5"' : ''} onclick="cast('${id}',${
         j},1)"><span style="flex:1"><b>${x[0]}</b><br><small>${
         x[1] == null ? 'Indisponível para este ritual' :
           x[2] > 1   ? 'Requer ' + x[2] + 'º círculo' + (x[3] ? ' e afinidade' : '') :
           x[3]       ? 'Requer afinidade' :
                        'Sem requisito'}</small>${
         x[1] != null && RPT(c, r.n, j) ? `<br><small style="color:#ff9f1a">⚡ Ritual Potente: +${c.attr.INT} ${
                                            RPT(c, r.n, j) == 'cura' ? 'na cura' : 'no dano'}</small>` :
                                          ''}</span>${
         x[1] != null ? `<b class=pec style="color:${off ? '#888' : '#e53935'}">${Math.max(0, x[1]) * 2} PV</b>` :
                        ''}</button>`
     })
      .join('')}`)
}
function rv(id) {
  let c = cur(), r = RT.find(z => z.n == id.split('|')[0]), e = id.split('|')[1] || r.el, b = BC[r.ci] - RPD(c, id),
      a = acc(c.nex), o = [
        ['Normal', Math.max(0, b), 1, 0], ['Discente', r.d && Math.max(0, b + r.d[0]), r.d && r.d[1], r.d && r.d[2]],
        ['Verdadeiro', r.v && Math.max(0, b + r.v[0]), r.v && r.v[1], r.v && r.v[2]]
      ];
  modal(`<button class=xc onclick="cm()">✕</button>${rimg(r)}<b>${r.n}</b> <span class=el style="background:${EC[e]}">${
    e}</span> · ${r.ci}º círculo<br>${rinfo(r)}${
    o.map((x, j) => {
       let off = x[1] == null || a < x[2];
       return `<button class="card row" ${off ? 'disabled style="opacity:.5"' : ''} onclick="cast('${id}',${
         j})"><span style="flex:1"><b>${x[0]}</b><br><small>${
         x[1] == null ? 'Indisponível para este ritual' :
           x[2] > 1   ? 'Requer ' + x[2] + 'º círculo' + (x[3] ? ' e afinidade' : '') :
           x[3]       ? 'Requer afinidade' :
                        'Sem requisito'}</small>${
         x[1] != null && RPT(c, r.n, j) ?
           `<br><small style="color:#ff9f1a">⚡ Ritual Potente: +${c.attr.INT} ${
             RPT(c, r.n, j) == 'cura' ? 'na cura' : 'no dano'}</small>` :
           ''}</span>${x[1] != null ? `<b class=pec ${off ? 'style="color:#888"' : ''}>${x[1]} PE</b>` : ''}</button>`
     })
      .join('')}`)
}

// Conjurar ritual
function cast(id, j, pv) {
  cm();
  let c = cur(), n = id.split('|')[0], r = RT.find(z => z.n == n), e = id.split('|')[1] || r.el, x = EF[n] || {},
      co = Math.max(0,
        BC[r.ci] - RPD(c, id) +
          (j == 1    ? r.d[0] :
              j == 2 ? r.v[0] :
                       0));
  if (co > K(c).rodR) return toast(`⚠ Custo de ${co} PE acima do limite de ${K(c).rodR} PE por rodada (NEX ${c.nex}%).`);
  if (pv ? c.pv <= co * 2 : c.pe < co) return toast(pv ? 'PV insuficiente' : 'PE insuficiente');
  fx(e);
  mut(z => {
    if (pv)
      z.pv -= co * 2;
    else
      z.pe -= co;
    z.rl = z.rl || {};
    z.rl[id] = (+z.rl[id] || 0) + 1;
    let m = [], tp = 0;
    if (x.heal && x.heal[j]) {
      let h = rl(x.heal[j]) + (RPT(c, n, j) ? c.attr.INT : 0);
      m.push('cura **' + h + ' PV**' + (RPT(c, n, j) ? ' (inclui +' + c.attr.INT + ' de Ritual Potente)' : '') +
        ' (aplique manualmente no alvo)')
    } else if (RPT(c, n, j) == 'dano')
      m.push('**Ritual Potente:** some **+' + c.attr.INT + '** ao dano');
    if (!x.tdef && !x.tpv && tmpInfo(c, n, j)) m.push(tmpInfo(c, n, j));
    if (x.tpv && x.tpv[j]) {
      let t = /d/.test(x.tpv[j]) ? rl(x.tpv[j]) : +x.tpv[j];
      z.t.pv += t;
      tp = t;
      m.push('+' + t + ' PV temporários')
    }
    if (!INST.includes(n)) {
      z.sust = z.sust.filter(q => q.id != id);
      z.sust.push({id, n: r.n, el: e, tdef: x.tdef && x.tdef[j] || 0, tpv: tp})
    }
    toast(`${r.n}: −${pv ? co * 2 + ' PV' : co + ' PE'} ${m.join(' · ')}`)
  })
}
