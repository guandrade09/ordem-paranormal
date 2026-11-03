/**
 * Ficha do jogador: abas, atributos, perícias, ataques e ações.
 */

// Foto do personagem
function photo(i) {
  let f = i.files[0];
  if (!f) return;
  let r = new FileReader();
  r.onload = () => {
    let im = new Image();
    im.onload = () => {
      let c = document.createElement('canvas');
      c.width = c.height = 160;
      c.getContext('2d').drawImage(im, 0, 0, 160, 160);
      S.d.photo = c.toDataURL('image/jpeg', .7);
      toast('Foto carregada')
    };
    im.src = r.result
  };
  r.readAsDataURL(f)
}
function at(x, s) {
  let d = S.d, v = d.attr[x] + s, rem = 9 - A.reduce((a, y) => a + d.attr[y], 0);
  if (v < 0 || v > 3 || (s > 0 && rem < 1)) return;
  d.attr[x] = v;
  R()
}
function tg(n) {
  let d = S.d, k = K(d), i = d.trained.indexOf(n);
  if (i >= 0) {
    d.trained.splice(i, 1);
    if (cmb(d, K(d)).length)
      d.trained = d.trained.filter(x => ['Luta', 'Pontaria', 'Fortitude', 'Reflexos'].includes(x))
  } else if ((k.cl.per + d.attr.INT + (d.origem == 'Amnésico' ? 2 : 0)) - d.trained.length > 0 &&
    !(cmb(d, k).length && !cmb(d, k).includes(n)))
    d.trained.push(n);
  R()
}
function pick(id) {
  let d = S.d;
  cm();
  if (d.rit.length < 3 && !d.rit.some(x => x.split('|')[0] == id.split('|')[0])) d.rit.push(id);
  rr()
}
function art(k, n) {
  let c = SC[k] || '#888', b = BG[k] || ['#444', '#111'],
      h = `<defs><radialGradient id=g${k}><stop offset=0 stop-color="${b[0]}" /><stop offset=1 stop-color="${
        b[1]}" /></radialGradient></defs><circle cx=50 cy=50 r=48 fill="url(#g${k})" />`;
  for (let i = 0; i < n; i++)
    h += `<circle cx=50 cy=50 r=${46 - i * 3} fill=none stroke="${c}" stroke-width=.8 opacity=.65 stroke-dasharray="${
      3 + i * 2} ${2 + i}" class=rot${i % 2} />`;
  return h + `<g transform="translate(50 50) scale(.6) translate(-50 -50)">${SYM[k] ? SYM[k](c) : ''}</g>`
}
/* ---------- FICHA ---------- */

// Alterar a ficha e salvar
function mut(f) {
  let c = cur();
  c.hist.push(JSON.stringify({...c, hist: []}));
  if (c.hist.length > 30) c.hist.shift();
  f(c);
  R()
}

// Desfazer
function undo() {
  let c = cur(), s = c.hist.pop();
  if (!s) return toast('Nada a desfazer');
  let h = c.hist;
  Object.assign(c, JSON.parse(s), {hist: h});
  R()
}
function setT(x) {
  let n = Math.max(0, Math.floor(+$('#t' + x).value || 0));
  mut(z => {z.t[x] = n})
}
function ad(k, s) {
  let c = cur(), n = +$('#i' + k).value || 1, mx = K(c)[k];
  if (!n) return;
  mut(c => {
    if (s > 0) {
      if (c[k] >= mx) return toast('Já está no máximo.');
      c[k] = Math.min(mx, c[k] + n)
    } else {
      let t = Math.min(c.t[k], n);
      c.t[k] -= t;
      c[k] = Math.max(0, c[k] - (n - t))
    }
  })
}

// Ficha do jogador (abas)
function sheet() {
  const c = cur(), k = K(c);
  const t = ['Ficha', 'Ações', 'Inventário'][S.tab];
  const IC = [
    '🤸', '🐾', '🎨', '💪', '📰', '🔬', '🗝', '🤝', '🎭', '🛡', '🥷', '⏱', '😠', '👁', '🔎', '👊', '⚕', '🔮', '👂', '✈',
    '🎯', '💼', '⚡', '✝', '🏕', '♟', '💻', '🧿'
  ];
  const nn = c.nex >= 95 ? 99 : c.nex + 5,
        head = `<div class=row style="margin:12px 0 22px;gap:14px">${
          ph(c)}<div style="flex:1"><b style="font:42px 'Bebas Neue';line-height:1.05">${
          c.name}</b><br><small style="font-size:17px">JOGADOR: ${
          c.player}</small></div><button class=up onclick="up()" ${c.nex >= 99 ? 'disabled' : ''}>▲<br>NEX ${
          nn}%</button></div>`;
  let b = '';
  if (S.tab == 0) {
    const
      ic = {pv: '🩸', pe: '⚡', san: '🧠'},
      VC = {pv: '#d32f2f', pe: '#ff9f1a', san: '#4dd0e1'}, TC = {pv: '#43a047', pe: '#b39ddb', san: '#2457c5'},
      vit = (x, l) => `<div class=vw><div class=vb>${(() => {
        let t = c.t[x] || 0, cu = Math.max(0, c[x]), dn = Math.max(k[x], cu + t) || 1;
        return `<i style="width:${cu / dn * 100}%;background:${VC[x]}"></i><i style="width:${
          t / dn * 100}%;background:${TC[x]}"></i>`
      })()}</div><div class=vit><div class=bar>${ic[x]} ${l}</div><div class=big>${c[x]}<small> / ${
        k[x]}</small></div><div class=row style="justify-content:center;gap:6px;margin:8px 0"><button onclick="ad('${
        x}',-1)">−</button><input id=i${x} type=number min=0 placeholder="nº"><button onclick="ad('${
        x}',1)">+</button></div><div class=row style="justify-content:center;gap:6px;margin:6px 6px 2px"><input id=t${
        x} type=number min=0 class=tin style="color:${TC[x]}" placeholder="temp" value="${
        c.t[x] || ''}" onchange="setT('${x}')"><button onclick="mut(z=>z.t['${
        x}']=0)" title="Remover temporários">✕</button></div></div></div>`,
      hx = (x, p) => `<div class=hx style="left:${p[0]}px;top:${p[1]}px"><i><small>${AN[x]}</small><b>${
        c.attr[x]}</b><span>${x}</span></i></div>`,
      fl = (l, v) => `<div class=fl><span class=bar>${l}</span><div class=box>${v}</div></div>`;
    b = `<div class=sheet><div class=hexbox>${hx('AGI', [102, 0])}${hx('FOR', [8, 62])}${hx('INT', [196,
      62])}${hx('PRE', [40, 168])}${hx('VIG', [164, 168])}<div class=core>ATRIBUTOS</div></div>${
      fl('ORIGEM', c.origem)}${fl('CLASSE', c.classe + (c.trail ? ' — ' + c.trail : ''))}${
      c.af && AFC[c.af] ?
        afBox(c.af) :
        ''}<div class=g3 style="gap:10px">${fl('NEX', c.nex + '%')}${fl('PE/RODADA', k.rod)}${fl('DESL', '9m')}</div>
<div class=grid2 style="gap:14px">${vit('pv', 'PONTOS DE VIDA')}${vit('pe', 'PONTOS DE ESFORÇO')}</div>
<div class=grid2 style="gap:14px"><div class=vw><div class=vb>${(() => {
      let t = Math.min(k.def, (c.t && c.t.def) || 0), dn = k.def || 1;
      return `<i style="width:${(k.def - t) / dn * 100}%;background:#78909c"></i><i style="width:${
        t / dn * 100}%;background:#fff"></i>`
    })()}</div><div class=vit><div class=bar>🛡 DEFESA</div><div class=big>${k.def}</div><small>= 10 + ${
      c.attr.AGI} (AGI) + ${k.pr.d} (equip.) + ${k.def - 10 - c.attr.AGI - k.pr.d} (outros)</small>${
      (k.tdef || (c.t && c.t.def)) ?
        '<br><span class=tmp>inclui bônus temporário</span>' :
        ''}<div class=row style="justify-content:center;gap:6px;margin:6px 6px 2px"><input id=tdef type=number min=0 class=tin style="color:#fff" placeholder="temp" value="${
      (c.t && c.t.def) ||
      ''}" onchange="setT('def')"><button onclick="mut(z=>z.t['def']=0)" title="Remover temporários">✕</button></div></div></div>${
      vit('san', 'SANIDADE')}</div>
${
      (c.sust || []).length ?
        `<div>${
          c.sust
            .map((x, i) =>
                   `<span class=el style="background:${EC[x.el]}" onclick="dis('${x.id || ''}',${i})">${x.n} ✕</span> `)
            .join('')}<small>(toque para encerrar)</small></div>` :
        ''}
${fl('PROTEÇÃO', k.pr.n + (c.inv.some(x => PR[x.n] && lack(c, x)) ? ' ⚠️' : ''))}${
      fl('RESISTÊNCIAS',
        [
          k.pr.r, ...(c.res || []).map(x => x + ' ' + (c.af == x ? 20 : 10)),
          ...(c.origem == 'Teórico da Conspiração' ? ['Mental ' + c.attr.INT] : [])
        ].filter(Boolean)
            .join(' · ') ||
          '—')}${fl('PROFICIÊNCIAS', k.cl.prof + profX(c))}${lackList(c)}
<div class=bar style="text-align:center;font-size:26px">PERÍCIAS</div><div class="sk hd"><span>PERÍCIA</span><span>DADOS</span><span>BÔNUS</span><span>TREINO</span><span>OUTROS</span></div>${
      SK.map((s, i) => {
          let tr = k.tr.includes(s.n), v = c.attr[s.a];
          return `<div class="sk ${tr ? 't' : ''}" onclick="sk(${i})"><span>${IC[i]} ${s.n}${
            s.f}</span><span class=bx>${v || 2}d20</span><span class=bx>+${gb(c, s.n, tr)}</span><span>${
            tr ? gb(c, s.n, tr) : ''}</span><span>${ob(c, s.n) ? '+' + ob(c, s.n) : ''}</span></div>`
        })
        .join('')}<button onclick="undo()" style="margin-top:14px">↶ Desfazer última ação</button></div>`
  }
  if (S.tab == 1) {
    const ws = [
      {n: 'Desarmado', w: weff(c, {w: {m: 1, d: UNA(c), c: 20, x: 2, t: 'impacto'}}), u: -1},
      ...c.inv.map((it, i) => it.w ? {n: it.n, w: weff(c, it), u: i} : null).filter(Boolean),
      ...c.inv.map((it, i) => DMG[it.n] ? {n: it.n, w: {d: DMG[it.n].d, t: DMG[it.n].t}, u: i, dm: 1} : null)
        .filter(Boolean)
    ];
    b = `<div class=bar>Ataques</div>${
      ws.map(a => `<div class="card row"><div style="flex:1"><b class=an>${a.n}</b>${
               a.u >= 0 && !a.dm && lack(c, {n: a.n, w: a.w}) ? ' ⚠️' : ''}<div class=ib3><div><small>Dano</small><b>${
               a.w.d}${a.w.m ? ` + ${c.attr[a.w.st || 'FOR']}` : (a.w.pl ? ` + ${c.attr.AGI}` : '')}</b></div>${
               a.dm ? '' : `<div><small>Crítico</small><b>${a.w.c}/x${a.w.x}</b></div>`}<div><small>Tipo</small><b>${
               a.w.t}</b></div></div>${
               a.w.mx ? '<div style="margin-top:6px">' + bulRow(a.w.am, a.w.mag, a.w.mx) + '</div>' :
                        ''}</div><div class=bt>${a.w.mx ? `<button class=rcb onclick="rc(${a.u})">⟳</button>` : ''}${
               c.dw && hasAb(c, 'Combater com Duas Armas') && a.u >= 0 && !a.dm ?
                 `<button class=atkb onclick="atk2(${a.u})" title="Ataque com duas armas">⚔⚔</button>` :
                 ''}<button class=atkb onclick="${a.dm ? `useDmg(${a.u})` : `atk(${a.u})`}">⚔</button></div></div>`)
        .join('')}
<div class=bar>Habilidades</div>${
      abl(c, k)
        .map((p, i) => `<div class="card ab" onclick="abc(${i})"><div class=abt><b>${p[0]}</b>${
               p[0] == 'Combater com Duas Armas' && c.dw ? ' <small style="color:#43a047">● ativa</small>' : ''}${
               p[0] == 'Segurar o Gatilho' && c.sg ? ` <small style="color:#ff9f1a">● ${c.sg} extra(s)</small>` :
                                                     ''}<br><small>${
               md(p[4] || (p[3].replace(/\*\*/g, '').slice(0, 70) + (p[3].length > 70 ? '…' : '')))}</small></div>${
               p[1] ? `<b class=pec>${p[1]} PE</b>` : ''}</div>`)
        .join('')}
${rsheet(c, k)}`
  }
  if (S.tab == 2) {
    const pt = PT.map((p, i) => c.pp >= p[1] ? i : 0).reduce((a, b) => Math.max(a, b)), P = PT[pt], N = PT[pt + 1],
          used = c.inv.reduce((a, i) => a + ee(c, i), 0), cn = [0, 0, 0, 0, 0],
          cr = CR[Math.min(3, CR.indexOf(P[2]) + (c.origem == 'Magnata' ? 1 : 0))];
    c.inv.forEach(i => {
      if (!i.crim) cn[Math.min(4, ecat(c, i))]++
    });
    b = `<div class=bar>Patente: ${P[0]}</div><div class="card pat"><div style="margin-bottom:18px">Prestígio <b>${
      c.pp}</b>${N ? ` / ${N[1]} (${N[0]})` : ' (máx.)'}</div><div class=prog><i style="width:${
      N ?
        Math.min(100, (c.pp - P[1]) / (N[1] - P[1]) * 100) :
        100}%"></i></div><div class=row style="margin-top:6px;gap:6px"><input id=ipp type=number min=0 placeholder="nº"><button onclick="pp(1)">+</button><button onclick="pp(-1)">−</button></div><div style="margin-top:22px">Crédito: <b style="color:${
      CC[cr]}">${cr}</b>${
      c.origem == 'Magnata' ? ' <small>(+1 Magnata)</small>' : ''}</div><div class=catb style="margin-top:14px">${
        [1, 2, 3, 4]
          .map(n => `<div class="cb ${cn[n] > P[3][n - 1] ? 'over' : ''}"><small>Categoria ${RM[n]}</small><b>${
                 cn[n]}/${P[3][n - 1]}</b></div>`)
          .join('')}</div>${
        [1, 2, 3, 4].some(n => cn[n] > P[3][n - 1]) ?
        '<div class=red style="margin-top:10px">⚠ Limite de itens por categoria excedido!</div>' :
        ''}</div>
<div class=bar>Inventário</div><div class=card>Carga: <b class="${used > k.carga ? 'red' : ''}">${used}</b> / ${
      k.carga}</div>${
      c.inv.map((it, i) => itemCard(it, i))
        .join(
          '')}<div class=grid2><button onclick="cat('arm')">📦 Itens</button><button onclick="cust()">Outro</button></div>${
      modSec(c)}`
  }
  return `<div class=fade><button onclick="S.v=cur().npc?'npc':'home';R()">← ${c.npc ? 'NPCs' : 'Agentes'}</button>${
    head}${b}<div style="height:90px"></div></div><div class=tabs>${
      ['Ficha', 'Ações', 'Inventário']
        .map((n, i) => `<button class="${S.tab == i ? 'on' : ''}" onclick="S.tab=${i};R()">${n}</button>`)
        .join('')}</div>`
}

const ob = (c, n) => (n == 'Iniciativa' && c.trail == 'Operações Especiais' && c.nex >= 10) ||
    ((n == 'Atletismo' || n == 'Crime') && c.trail == 'Infiltrador' && c.nex >= 40) ?
  5 :
  0;

// Linha de perícia
function sk(i) {
  let c = cur(), s = SK[i], k = K(c), v = c.attr[s.a], d = rd(v || 2, 20), r = v ? Math.max(...d) : Math.min(...d),
      b = gb(c, s.n, k.tr.includes(s.n)) + ob(c, s.n);
  toast(`${s.n}: [${d}] → ${r}+${b} = ${r + b}`)
}



// Pagamento/uso de recursos
function pay(c, n) {
  if (c.pe < n) {
    toast('PE insuficiente');
    return 0
  }
  c.pe -= n;
  return 1
}

// Habilidades
function ab(i) {
  let c = cur(), k = K(c), p = abl(c, k)[i];
  if (!p[1]) return;
  if (p[0] == 'Perito') return peritoMenu(p[1]);
  if (p[1] > k.rod) return toast(`⚠ Custo de ${p[1]} PE acima do limite de ${k.rod} PE por rodada (NEX ${c.nex}%).`);
  if (c.pe < p[1]) return toast('PE insuficiente');
  fx('ico', ICO[p[0]] || '✨');
  mut(z => {
    z.pe -= p[1];
    if (p[0] == 'Segurar o Gatilho') z.sg = (z.sg || 0) + 1
  });
  toast(p[0] + (p[1] ? ` · −${p[1]} PE` : ' (passivo)'))
}



// Pontos de prestígio
function pp(s) {
  let n = +$('#ipp').value || 0;
  if (n) mut(c => c.pp = Math.max(0, c.pp + s * n))
}



// Itens personalizados
function cust() {
  modal(`<b>Outro item</b><input id=cn placeholder="Nome"><textarea id=cd placeholder="Descrição"></textarea><input id=ce type=number value=1 min=0 placeholder="Espaços"><select id=cc>${
    RM.map((r, i) => `<option value=${i}>Categoria ${r}</option>`)
      .join(
        '')}</select><button class=btn onclick="cm();mut(c=>c.inv.push({n:$('#cn').value||'Item',ds:$('#cd').value,e:+$('#ce').value||0,cat:+$('#cc').value}))">Adicionar</button>`)
}
