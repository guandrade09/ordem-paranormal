/**
 * Catálogo de itens: busca, cards, mochila, Perito em Explosivos.
 */

const wgName = n => SIM.includes(n) ? 'Arma simples' :
  PES.includes(n)                   ? 'Arma pesada' :
                                      'Arma tática',
      profX = c => {
        let l = [
          hasAb(c, 'Mira de Elite') ? 'armas de fogo de balas longas' : '',
          hasAb(c, 'Armamento Pesado') ? 'armas pesadas' : '',
          hasAb(c, 'Balística Avançada') ? 'armas táticas de fogo' : '',
          hasAb(c, 'Proteção Pesada') ? 'proteções pesadas' : ''
        ].filter(Boolean);
        return l.length ? '; ' + l.join('; ') : ''
      };
function cat(k) {
  const T =
          [
            ['arm', 'Armas'], ['pro', 'Proteções'], ['mun', 'Munições'], ['uti', 'Utilidades'], ['par', 'Paranormais'],
            ['amd', 'Amaldiçoados']
          ],
        row = (x, i) =>
          `<button class=card onclick="add('${k}',${i})"><b>${x[0]}</b> <small>Cat. ${RM[x[1]]} · ${x[2]} esp.${
            x[3].d ? ` · Dano ${x[3].d} · Crít. ${x[3].c}/x${x[3].x} · ${x[3].t}` :
                     ''}</small>${BR[x[0]] ? `<br><small>${md(BR[x[0]])}</small>` : ''}</button>`;
  modal(`<div class=pills>${
    T.map(x => `<button class="${k == x[0] ? 'on' : ''}" onclick="cat('${x[0]}')">${x[1]}</button>`)
      .join('')}</div><div class=scr>${
    k == 'arm' ?
      GT.map(g => `<div class=bar>${g[0]}</div>` + CAT.arm.map((x, i) => g[1](x) ? row(x, i) : '').join('')).join('') :
      CAT[k].map(row).join('')}</div>`)
}
function mcard(x) {
  let w = x[3], d = IDESC[x[0]] || x[4] || 'Item do livro (descrição em breve).', p = PR[x[0]];
  return `<div class=card><div class=row><div style="flex:1"><b style="font:22px 'Bebas Neue'">${x[0]}</b>${
    w.d ? `<br><small>${wgName(x[0])}</small>` : ''}</div><div class=ib><div><small>Cat.</small><b>${
    RM[x[1]]}</b></div><div><small>Espaços</small><b>${x[2]}</b></div>${
    w.d ? `<div><small>Dano</small><b>${w.d}</b></div><div><small>Crítico</small><b>${w.c}/x${w.x}</b></div>` :
          ''}${w.q ? `<div><small>Ataques</small><b>${w.q}</b></div>` : ''}</div></div>${
    w.d ? `<small>Tipo: <b>${w.t}</b>${w.am ? ' · Munição: <b>' + w.am + '</b>' : ''}${
            w.mx ? ' · Capacidade: <b>' + w.mx + '</b>' : ''}</small><br>` :
          ''}${
    p && p.d ? `<small>Defesa <b>+${p.d}</b>${p.r ? ' · Resistência: <b>' + p.r + '</b>' : ''}</small><br>` :
               ''}<p>${md(d)}</p></div>`
}
function mlist() {
  let k = S.mk || 'arm', q = nz(S.mq || '');
  return CAT[k].filter(x => nz(x[0] + (IDESC[x[0]] || x[4] || '')).includes(q)).map(mcard).join('') ||
    '<small>Nenhum item.</small>'
}
function minv() {
  let k = S.mk || 'arm', T = [
    ['arm', 'Armas'], ['pro', 'Proteções'], ['mun', 'Munições'], ['uti', 'Utilidades'], ['par', 'Paranormais'],
    ['amd', 'Amaldiçoados']
  ];
  return `<div class=fade><button onclick="S.v='mestre';R()">← Voltar</button><div class=bar>Inventário de Itens e Armas</div><div class=pills>${
    T.map(x => `<button class="${k == x[0] ? 'on' : ''}" onclick="S.mk='${x[0]}';R()">${x[1]}</button>`)
      .join('')}</div><input placeholder="🔎 Pesquisar item..." value="${
    esc(S.mq || '')}" oninput="S.mq=this.value;$('#ml').innerHTML=mlist()"><div id=ml>${mlist()}</div></div>`
}
function perStep(d, k) {
  let c = k.tr.filter(n => !['Luta', 'Pontaria'].includes(n)),
      p = d.perito = (d.perito || []).filter(n => c.includes(n));
  return `<div class=bar>Perito — escolha 2 perícias (${
    p.length}/2)</div><small>Perícias treinadas, exceto Luta e Pontaria. Ao usar Perito você soma o dado extra nelas.</small>${
    c.map(n => {
       let z = SK.find(q => q.n == n);
       return `<button class="${
         p.includes(n) ? 'on' : ''}" style="width:100%;margin:3px 0;text-align:left" onclick="perT('${n}')">${
         n} <small>${d.attr[z.a] || 2}d20 +5</small></button>`
     })
      .join('')}<button class=btn ${p.length == 2 ? '' : 'disabled'} onclick="nx()">Confirmar</button>`
}
function perT(n) {
  let p = S.d.perito = S.d.perito || [], i = p.indexOf(n);
  if (i >= 0)
    p.splice(i, 1);
  else if (p.length < 2)
    p.push(n);
  R()
}
function peritoMenu(co) {
  let c = cur(), i = (c.nex >= 25) + (c.nex >= 55) + (c.nex >= 85), dd = [6, 8, 10, 12][i];
  if (!(c.perito || []).length) return toast('Perito: nenhuma perícia escolhida.');
  modal(`<button class=xc onclick="cm()">✕</button><div class=ahd><b>Perito · ${co} PE · +1d${
    dd}</b></div><small> — escolha a perícia</small>${
    c.perito
      .map(n => {
        let z = SK.find(q => q.n == n), v = ea(c)[z.a];
        return `<button class=card onclick="usePerito('${n}',${co},${dd})"><b>${n}</b><br><small>${v || 2}d20 +${
          gb(c, n, 1)} (+1d${dd})</small></button>`
      })
      .join('')}`)
}
function usePerito(n, co, dd) {
  cm();
  let c = cur(), k = K(c);
  if (co > k.rod) return toast(`⚠ Custo de ${co} PE acima do limite de ${k.rod} PE por rodada (NEX ${c.nex}%).`);
  if (c.pe < co) return toast('PE insuficiente');
  let z = SK.find(q => q.n == n), v = ea(c)[z.a], d = rd(v || 2, 20), r = v ? Math.max(...d) : Math.min(...d),
      b = gb(c, n, 1), x = rd(1, dd)[0];
  fx('ico', '🎯');
  mut(q => {q.pe -= co});
  toast(`${n}: [${d}] ${r}+${b}+${x} (1d${dd}) = ${r + b + x} · −${co} PE`)
}
