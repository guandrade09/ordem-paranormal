/**
 * Regras: habilidades de classe/trilha, pré-requisitos, técnicas, opções e cards de poderes.
 */

const cap1 = z => z.charAt(0).toUpperCase() + z.slice(1);

// Tabela de poderes por NEX
const TB = {
  Combatente: '5A,10T,15P,20S,25A,30P,35G,40H,45P,50SV,55A,60P,65H,70G,75P,80S,85A,90P,95S,99H',
  Especialista: '5A,10T,15P,20S,25A,30P,35G,40EH,45P,50SV,55A,60P,65H,70G,75EP,80S,85A,90P,95S,99H',
  Ocultista: '5A,10T,15P,20S,25A,30P,35G,40H,45P,50SV,55A,60P,65H,70G,75P,80S,85A,90P,95S,99H'
};
const ICT = {
  'Aniquilador': '🗡️',
  'Comandante de Campo': '📣',
  'Guerreiro': '⚔️',
  'Operações Especiais': '🪖',
  'Tropa de Choque': '🛡️',
  'Atirador de Elite': '🎯',
  'Infiltrador': '🥷',
  'Médico de Campo': '⚕️',
  'Negociador': '🤝',
  'Técnico': '🔧',
  'Conduíte': '🔮',
  'Flagelador': '🩸',
  'Graduado': '📚',
  'Intuitivo': '🧠',
  'Lâmina Paranormal': '🗡️'
};
const IC2 = [
  '🤸', '🐾', '🎨', '💪', '📰', '🔬', '🗝', '🤝', '🎭', '🛡', '🥷', '⏱', '😠', '👁', '🔎', '👊', '⚕', '🔮', '👂', '✈',
  '🎯', '💼', '⚡', '✝', '🏕', '♟', '💻', '🧿'
];
const un2 = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(),
      hasAb = (c, n) => (c.ab || []).some(a => un2(a.n) == un2(n)), gb = (c, n, tr) => tr ? (c.gr && c.gr[n] || 5) : 0,
      rel = x => x.split('|')[1] || (RT.find(r => r.n == x.split('|')[0]) || {}).el;

// Verifica pré-requisitos de poder
function okp(c, p) {
  if (!p) return [1, ''];
  let k = K(c), ms = [];
  for (let t of p.split(/,|;/).map(x => x.trim()).filter(Boolean)) {
    let m;
    if (m = t.match(/^(For|Agi|Int|Pre|Vig)\w*\s*(\d)/i)) {
      if (c.attr[m[1].toUpperCase()] < +m[2]) ms.push(t)
    } else if (m = t.match(/NEX\s*(\d+)/i)) {
      if (c.nex < +m[1]) ms.push(t)
    } else if (m = t.match(/treinad[oa]s? em (.+)/i)) {
      for (let z of m[1].split(/ e |, /))
        if (!z.split(/ ou /).some(w => k.tr.some(x => un2(x) == un2(w.trim())))) ms.push('treinado em ' + z.trim())
    } else if (m = t.match(/(Conhecimento|Energia|Morte|Sangue|Medo)\s*(\d)/)) {
      if (c.rit.filter(x => typeof x == 'string' && rel(x) == m[1]).length +
          (c.ab || []).filter(a => a.el == m[1]).length <
        +m[2])
        ms.push(t + ' (rituais)')
    } else if (!hasAb(c, t))
      ms.push(t)
  }
  return [!ms.length, ms.join(', ')]
}
const PLONG = {
  'Ataque Especial': c => {
    let i = (c.nex >= 25) + (c.nex >= 55) + (c.nex >= 85);
    return `Quando faz um ataque, você pode gastar ${2 + i} PE para receber +${
      5 *
      (i +
        1)} no teste de ataque ou na rolagem de dano. O custo e o bônus aumentam com o NEX: 2 PE (+5), 3 PE (+10) a partir do NEX 25%, 4 PE (+15) a partir do NEX 55% e 5 PE (+20) a partir do NEX 85%.`
  },
  'Perito': c => {
    let i = (c.nex >= 25) + (c.nex >= 55) + (c.nex >= 85);
    return `Escolha duas perícias treinadas (exceto Luta e Pontaria). Ao fazer um teste de uma delas, você pode gastar ${
      2 + i} PE para somar +1d${
        [6, 8, 10,
          12][i]} no resultado do teste. O custo e o dado aumentam com o NEX: 2 PE (1d6), 3 PE (1d8) a partir do NEX 25%, 4 PE (1d10) a partir do NEX 55% e 5 PE (1d12) a partir do NEX 85%.`
  },
  'Eclético': () =>
    'Quando faz um teste de uma perícia, você pode gastar 2 PE para receber os benefícios de ser treinado nesta perícia. Com Engenhosidade, a partir do NEX 40% você pode gastar 2 PE adicionais (4 PE no total) para ser veterano, e a partir do NEX 75% pode gastar 4 PE adicionais (6 PE no total) para ser expert.',
  'Escolhido pelo Outro Lado': () =>
    'Você pode lançar rituais de 1º círculo. Conforme avança de NEX, pode lançar rituais de círculos maiores: 2º círculo no NEX 25%, 3º círculo no NEX 55% e 4º círculo no NEX 85%. Você começa com 3 rituais de 1º círculo e aprende mais um ritual a cada avanço de NEX.',
  'Empenho': () => 'Quando faz um teste de perícia, você pode gastar 1 PE para receber +2 nesse teste.'
};

// Poderes disponíveis
function pods(c, k) {
  let o = pods0(c, k);
  o.forEach(p => {
    let f = PLONG[p[0]];
    if (f) p[3] = f(c)
  });
  return o
}

// Técnicas
const TEC = {
  'Técnica Secreta': [
    ['Amplo', 'O ataque atinge um alvo adicional adjacente ao original, em seu alcance (mesmo teste de ataque).'],
    ['Destruidor', 'Aumenta o multiplicador de crítico da arma em +1.']
  ],
  'Técnica Sublime': [
    ['Letal', 'Aumenta a margem de ameaça em +2 (duas vezes: +5).'],
    ['Perfurante', 'Ignora até 5 pontos de resistência a dano do alvo.']
  ]
};

// Busca de poder da classe
const POWF = (c, n) => (D[c.classe] ? D[c.classe].pow : []).find(z => z.n == n) ||
  ['Combatente', 'Especialista', 'Ocultista'].map(k => D[k].pow.find(z => z.n == n)).find(Boolean),
      POWT = (c, n) => {
        let p = POWF(c, n);
        return p ? p.t : null
      }, POWS = (c, n) => {
        let p = POWF(c, n);
        return p && p.s || null
      };
const TRS = (c, n) => {
  let a = (D[c.classe] ? D[c.classe].tr : []).flatMap(t => t.ab).find(z => z.n == n);
  return a ? a.s : null
};
const TRA = (c, n) => {
  let a = (D[c.classe] ? D[c.classe].tr : []).flatMap(t => t.ab).find(z => z.n == n);
  return a ? a.t : null
};
const abl = (c, k) => [...pods(c, k), ...(k.o ? [[k.o[2], k.o[4], 'Energia', k.o[3]]] : []), ...(c.ab || []).map(a => {
  let t = (a.tr && TRA(c, a.n)) || (a.pw && !a.el && POWT(c, a.n)) || a.t, bs = t, ff = '', sh = null, af5 = null;
  if (a.el) {
    let pp = (D.PP[a.el] || []).find(z => z.n == a.n), q = a.t.split(' AFINIDADE: ');
    bs = pp ? pp.t : q[0];
    ff = pp ? pp.a : (a.aff || q[1] || '');
    t = bs;
    if (pp) sh = pp.s;
    af5 = [ff, a.el]
  }
  if (a.n == 'Grimório Ritualístico')
    t += ' **Capacidade do grimório:** ' + gcap(c) + ' rituais (Intelecto ' + c.attr.INT +
      '); no grimório agora: ' + (c.grm || []).length + '.';
  if (a.ee) t += ' **Elemento escolhido:** ' + a.ee + '.';
  if (a.me) t += ' **Elemento escolhido:** ' + a.me + '.';
  if (a.rp) {
    let q = RT.find(z => z.n == a.rp.split('|')[0]);
    if (q) t += ' **Ritual escolhido:** ' + q.n + '.'
  }
  return [
    a.n,
    TEC[a.n] ? 2 :
               (OPT[a.n] && a.n == 'Paramédico' ? 2 :
                                                  (a.rp                          ? 0 :
                                                      a.n == 'Segurar o Gatilho' ? (c.sg || 0) + 1 :
                                                                                   costOf(bs))),
    'Energia', t, a.tr ? TRS(c, a.n) : (sh || (a.pw && !a.el ? POWS(c, a.n) : null)), af5
  ]
})];
const OPT = {
  'Eclético': {o: [['Treinado', 2, 5], ['Veterano', 4, 40], ['Expert', 6, 75]]},
  'Discurso Motivador': {o: [['+1d20', 4, 40], ['+2d20', 8, 65]]},
  'Paramédico': {o: [['2d10', 2, 10], ['3d10', 3, 40], ['4d10', 4, 65], ['5d10', 5, 99]], heal: 1}
};
function optCard(i, keep) {
  let c = cur(), k = K(c), p = abl(c, k)[i], O = OPT[p[0]];
  if (!keep || !S.opt || S.opt.i != i) {
    let f = O.o.findIndex(o => c.nex >= o[2]);
    S.opt = { i, s: f < 0 ? 0 : f }
  }
  let sel = O.o[S.opt.s];
  modal(`<button class=xc onclick="S.opt=null;cm()">✕</button><div class=ahd><b style="font:26px 'Bebas Neue'">${
    p[0]}</b><b class=pec>${sel[1]} PE</b></div><p>${
    md(p[3])}</p><div style="display:grid;grid-template-columns:repeat(${O.o.length},1fr);gap:6px">${
    O.o
      .map((o, j) => `<button class="optb ${j == S.opt.s ? 'on' : ''}" ${
             c.nex < o[2] ? 'disabled style="opacity:.45;filter:grayscale(1)"' : ''} onclick="S.opt.s=${j};optCard(${
             i},1)"><b>${o[0]}</b><br><small>${o[1]} PE</small><br><small>NEX ${o[2]}%</small></button>`)
      .join('')}</div><button class=btn style="width:100%;font-size:24px;margin-top:8px" onclick="optUse(${
    i})">Usar</button>`)
}
function optUse(i) {
  let c = cur(), k = K(c), p = abl(c, k)[i], O = OPT[p[0]], o = O.o[S.opt.s];
  if (c.nex < o[2]) return;
  if (o[1] > k.rod) return toast(`⚠ Custo de ${o[1]} PE acima do limite de ${k.rod} PE por rodada (NEX ${c.nex}%).`);
  if (c.pe < o[1]) return toast('PE insuficiente');
  cm();
  S.opt = null;
  fx('ico', ICO[p[0]] || '✨');
  mut(z => {z.pe -= o[1]});
  toast(O.heal ? `${p[0]}: cura ${rl(o[0])} PV (${o[0]}) · −${o[1]} PE` : `${p[0]} (${o[0]}) · −${o[1]} PE`)
}

// Blocos extras nos cards de poder
const xtra = (c, n, i) => {
  if (n == 'Segurar o Gatilho')
    return `<div class=card style="margin:8px 0"><b>Ataques extras neste turno: ${
      c.sg || 0}</b><br><small>Próximo ataque extra custa <b>${
      (c.sg || 0) + 1} PE</b>. Cada uso soma +1 ao custo.</small><br><button onclick="mut(z=>z.sg=0);abc(${
      i})" style="margin-top:6px">↺ Reiniciar contador</button></div>`;
  if (n == 'Combater com Duas Armas')
    return `<div class=card style="margin:8px 0"><b>Estado: ${
      c.dw ?
        'ATIVA' :
        'desativada'}</b><br><small>Quando ativa, as armas ganham o botão ⚔⚔ (dois ataques, –1 dado).</small><br><button class=btn onclick="mut(z=>z.dw=!z.dw);cm()" style="margin-top:6px">${
      c.dw ? 'Desativar' : 'Ativar'}</button></div>`;
  if (n == 'Perito em Explosivos') {
    let b = 10 + 5 * c.attr.AGI;
    return `<div class=card style="margin:8px 0;text-align:center;border:2px solid #ff9f1a"><small>DT PARA EXPLOSIVOS</small><div style="font:44px 'Bebas Neue';color:#ff9f1a">${
      b + c.attr.INT}</div><small>10 + 5 × AGI (${c.attr.AGI}) = <b>${b}</b> · + Intelecto (${
      c.attr.INT}) do poder = <b>${b + c.attr.INT}</b></small></div>`
  }
  if (n == 'Mochila de Utilidades') {
    let it = c.inv.find(x => x.mu && !x.w);
    return `<p><small>${
      it ? 'Item escolhido: <b>' + it.n + '</b>' :
           'Marque o item no <b>Inventário</b> (caixa “Mochila de Utilidades”).'}</small></p>`
  }
  return ''
};
function abc(i) {
  let c = cur(), k = K(c), p = abl(c, k)[i], n = p[0];
  S.tec = null;
  if (n == 'Poder do Flagelo') return flaCard(i);
  if (OPT[n]) return optCard(i);
  if (TEC[n]) return tecCard(i);
  let fv = c.inv.find(x => x.fav),
      nt = ['A Favorita', 'Máquina de Matar'].includes(n) ?
    (fv ? `<p><small>Arma favorita: <b>${fv.n}</b> · Cat. ${RM[fv.cat]} → <b>${RM[ecat(c, fv)]}</b></small></p>` :
          '<p class=red><small>⚠ Nenhuma arma favorita marcada no Inventário.</small></p>') :
    '';
  nt += xtra(c, n, i);
  modal(`<button class=xc onclick="cm()">✕</button><div class=ahd><b style="font:26px 'Bebas Neue'">${n}</b>${
    p[1] ? `<b class=pec>${p[1]} PE</b>` : ''}</div><p>${md(p[3])}</p>${p[5] ? afNote(p[5][0], p[5][1], c) : ''}${nt}${
    p[1] ? `<button class=btn style="width:100%;font-size:24px;margin-top:6px" onclick="cm();ab(${i})">Usar</button>` :
           (tmpInfo(c, n, 0, !!(p[5] && c.af == p[5][1])) ?
              `<button class=btn style="width:100%;font-size:22px;margin-top:6px" onclick="tmpShow(${i})">Ver quanto adicionar</button>` :
              '<small>Habilidade passiva.</small>')}`)
}
function tecCard(i) {
  let c = cur(), k = K(c), p = abl(c, k)[i], T = (S.tec && S.tec.i == i) ? S.tec : (S.tec = {i, sp: 0, ef: {}}),
      fv = c.inv.find(x => x.fav);
  modal(`<button class=xc onclick="S.tec=null;cm()">✕</button><div class=ahd><b style="font:26px 'Bebas Neue'">${
    p[0]}</b><b class=pec>2 PE por efeito</b></div><p>${md(p[3])}</p>${
    fv ? `<p><small>Arma favorita: <b>${fv.n}</b></small></p>` :
         '<p class=red><small>⚠ Nenhuma arma favorita marcada no Inventário.</small></p>'}${
    TEC[p[0]]
      .map((e, j) => `<button class="card tec" onclick="tecUse(${i},${j})"><b>${e[0]}</b>${
             T.ef[e[0]] ? ` <span class=nm>×${T.ef[e[0]]}</span>` : ''}<br><small>${md(e[1])}</small></button>`)
      .join('')}${T.sp ? `<small>Gasto nesta técnica: <b class=nm>${T.sp} PE</b></small>` : ''}`)
}
function tecUse(i, j) {
  let c = cur(), k = K(c), p = abl(c, k)[i], T = S.tec, e = TEC[p[0]][j];
  if (T.sp + 2 > k.rod)
    return toast(`⚠ Custo total de ${T.sp + 2} PE acima do limite de ${k.rod} PE por rodada (NEX ${c.nex}%).`);
  if (c.pe < 2) return toast('PE insuficiente');
  mut(z => {z.pe -= 2});
  T.sp += 2;
  T.ef[e[0]] = (T.ef[e[0]] || 0) + 1;
  fx('ico', '🎯');
  toast(`${p[0]}: ${e[0]}${e[0] == 'Letal' && T.ef.Letal == 2 ? ' (margem +5 no total)' : ''} · −2 PE`);
  tecCard(i)
}
const engTxt = n => n >= 75 ?
  '**Engenhosidade (expert).** Em NEX 75%, quando usa Eclético, você pode gastar 4 PE adicionais para receber os benefícios de ser expert na perícia.' :
  '**Engenhosidade (veterano).** Em NEX 40%, quando usa Eclético, você pode gastar 2 PE adicionais para receber os benefícios de ser veterano na perícia.';
const infoTxt = (c, n) => {
  let i = (n >= 25) + (n >= 55) + (n >= 85);
  return c.classe == 'Combatente' ?
    `**Ataque Especial** evoluiu: **${2 + i} PE**, bônus de **+${5 * (i + 1)}** no ataque ou dano.` :
    c.classe == 'Especialista' ?
    `**Perito** evoluiu: **${2 + i} PE**, bônus de **+1d${[6, 8, 10, 12][i]}**.` :
    `**Escolhido pelo Outro Lado**: agora você tem acesso a rituais de até **${i + 1}º círculo**.`
};
function pods0(c, k) {
  let i = (c.nex >= 25) + (c.nex >= 55) + (c.nex >= 85), o = k.cl.pod.map(p => p.slice());
  if (c.classe == 'Combatente') {
    o[0][1] = 2 + i;
    o[0][3] = `Gasta ${2 + i} PE: +${5 * (i + 1)} no ataque ou dano.`
  }
  if (c.classe == 'Especialista') {
    o[1][1] = 2 + i;
    o[1][3] = `Gasta ${2 + i} PE em perícia treinada: +1d${[6, 8, 10, 12][i]} no teste.`
  }
  return o
}
