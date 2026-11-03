/**
 * Criação de personagem (passo a passo) e montagem da ficha.
 */

// Novo personagem
function newC(npc) {
  S.d = {
    npc: npc || null,
    tipo: '',
    id: Date.now(),
    name: '',
    player: '',
    photo: '',
    nex: 5,
    attr: {AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 1},
    origem: '',
    classe: '',
    trained: [],
    rit: [],
    inv: [],
    pp: 0,
    round: 0,
    scene: 1,
    mission: 1,
    hist: [],
    sust: [],
    prot: 'Nenhuma',
    t: {pv: 0, pe: 0, san: 0},
    ok: {}
  };
  S.st = 'Dados';
  S.po = null;
  S.pr = null;
  S.v = 'create';
  R()
}

// Passos da criação
const stepsOf = d => d.npc == 'passivo' ?
  ['Dados', 'Tipo'] :
  [
    'Dados', 'Atributos', 'Origem', ...(d.origem == 'Cultista Arrependido' ? ['Poder'] : []), 'Classe', 'Perícias'
  ].concat(d.classe == 'Especialista' ? ['Perito'] :
      d.classe == 'Ocultista'         ? ['Rituais'] :
                                        []);

// Próximo passo da criação
const nx = () => {
  let l = stepsOf(S.d), i = l.indexOf(S.st);
  S.d.ok[S.st] = 1;
  if (i < l.length - 1)
    S.st = l[i + 1];
  else
    fin();
  R()
};

// Finalizar criação
function fin() {
  let d = S.d;
  if (d.cpow) {
    let p = D.PP[d.cpow[0]][d.cpow[1]];
    d.ab = (d.ab || []).concat([{n: p.n, t: p.t, aff: p.a || '', pw: 1, el: d.cpow[0]}])
  }
  let k = K(d);
  d.pv = k.pv;
  d.pe = k.pe;
  d.san = k.san;
  S.chars.push(d);
  S.cid = d.id;
  S.v = d.npc == 'passivo' ? 'npc' : 'sheet';
  S.tab = 0;
  S.d = null
}

// Tela de criação de personagem
function create() {
  const d = S.d, k = K(d), l = stepsOf(d), rem = 9 - A.reduce((a, x) => a + d.attr[x], 0),
        left = (k.cl.per + d.attr.INT + (d.origem == 'Amnésico' ? 2 : 0)) - d.trained.length;
  let b = '';
  if (S.st == 'Dados')
    b = `<div class=card><label>Nome do personagem</label><input value="${
      esc(d.name)}" oninput="S.d.name=this.value"><label>Jogador</label><input value="${
      esc(
        d.player)}" oninput="S.d.player=this.value"><label>Foto</label><input type=file accept="image/*" onchange="photo(this)"><label>NEX inicial</label><div class=grid2><button class="${
      d.nex == 0 ? 'on' : ''}" onclick="S.d.nex=0;S.d.classe='';R()">NEX 0% (Mundano)</button><button class="${
      d.nex == 5 ?
        'on' :
        ''}" onclick="S.d.nex=5;S.d.classe='';R()">NEX 5%</button></div></div><button class=btn onclick="if(!S.d.name)return toast('Dê um nome ao agente');nx()">Confirmar</button>`;
  if (S.st == 'Atributos')
    b = `<div class=bar>Atributos — pontos restantes: ${rem}</div>${
      A.map(x => `<div class="card row"><b style="width:90px">${AN[x]}</b><button onclick="at('${
              x}',-1)">−</button><span class=big>${d.attr[x]}</span><button onclick="at('${
              x}',1)">+</button><small>máx. 3 · total 9</small></div>`)
        .join('')}<button class=btn ${rem ? 'disabled' : ''} onclick="nx()">Confirmar</button>`;
  if (S.st == 'Origem') {
    let ix = S.po != null ? S.po : OR.findIndex(x => x[0] == d.origem), o = OR[ix];
    b = `<div class=bar>Origem: ${d.origem || '—'}</div><div class=grid2>${
      OR.map((x, i) => `<button class="${ix == i ? 'on' : ''}" onclick="S.po=${i};R()">${d.origem == x[0] ? '✔ ' : ''}${
               x[0]}</button>`)
        .join('')}</div>${
      o ? `<div class="card fade"><b>${o[0]}</b><br><small>Perícias: ${o[1] || 'à escolha'}</small><p><b>${o[2]}:</b> ${
            md(o[3])}</p><button class=btn onclick="setOr('${o[0]}')">Confirmar</button></div>` :
          ''}`
  }
  if (S.st == 'Poder') b = cpStep(d);
  if (S.st == 'Classe')
    b = `<div class=g3>${
      Object.keys(CL)
        .filter(n => (d.nex == 0) == (n == 'Mundano'))
        .map(n => {
          let c = CL[n];
          return `<button class="${
            d.classe == n ? 'on' : ''}" style="font-size:11px;text-align:left" onclick="S.d.classe='${
            n}';S.d.trained=[];S.d.rit=[];R()"><b style="font:18px 'Bebas Neue'">${n}</b><br>PV ${
            c.pv[0] + d.attr.VIG} (+${c.pv[1] + d.attr.VIG}/NEX)<br>PE ${c.pe[0] + d.attr.PRE} (+${
            c.pe[1] + d.attr.PRE}/NEX)<br>SAN ${c.san[0]} (+${c.san[1]}/NEX)<br>${
            c.per + d.attr.INT} perícias treinadas<br><i>${c.d}</i></button>`
        })
        .join('')}</div>${
      d.classe ? `<div class="card fade"><b>Proficiências:</b> ${k.cl.prof}<br>${
                   k.cl.pod.map(p => `<b>${p[0]}</b> (${p[1]} PE): ${p[3]}`)
                     .join('<br>')}</div><button class=btn onclick="nx()">Confirmar</button>` :
                 ''}`;
  if (S.st == 'Perícias')
    b = `<div class=bar>Perícias treinadas — restam ${left}</div>${
      cmb(d, k).length ?
        '<div class="card req">⚠ Combatente: escolha primeiro <b>Luta ou Pontaria</b> e <b>Fortitude ou Reflexos</b>. As demais perícias ficam disponíveis depois.</div>' :
        ''}${
      SK.map(s => {
          let a = k.auto.includes(s.n), t = k.tr.includes(s.n), rq = cmb(d, k).includes(s.n),
              lk = cmb(d, k).length && !rq && !t;
          return `<button class="${t ? 'on' : ''} ${rq ? 'req' : ''}" style="width:49%;margin:1px;text-align:left" ${
            a || lk ?
              'disabled' :
              ''} onclick="tg('${s.n}')">${t ? '✔ ' : ''}${s.n} <small>${d.attr[s.a] || 2}d20${s.f}</small></button>`
        })
        .join('')}<button class=btn ${left ? 'disabled' : ''} onclick="nx()">Confirmar</button>`;
  if (S.st == 'Tipo') b = tipoStep(d);
  if (S.st == 'Perito') b = perStep(d, k);
  if (S.st == 'Rituais')
    b = `<div class=bar>Grimório — 1º círculo (${
      d.rit.length}/3)</div><input placeholder="🔎 Pesquisar ritual..." value="${
      esc(S.q || '')}" oninput="S.q=this.value;$('#rl').innerHTML=rlist(1)"><div id=rl class=scr>${
      rlist(1)}</div><button class=btn ${d.rit.length < 3 ? 'disabled' : ''} onclick="nx()">Finalizar agente</button>`;
  return `<div class=fade><button onclick="S.v=S.d.npc?'npc':'home';S.d=null;R()">← Cancelar</button><div class=sum style="${
    d.npc == 'passivo' ? 'display:none' : ''}"><div>PV<b>${k.pv || '—'}</b></div><div>PE<b>${
    k.pe || '—'}</b></div><div>SAN<b>${k.san || '—'}</b></div><div>DT<b>${k.dt}</b></div></div><div class=pills>${
    l.map(x => `<button class="${S.st == x ? 'on' : ''}" ${d.ok[x] || S.st == x ? '' : 'disabled'} onclick="S.st='${
            x}';R()">${x}</button>`)
      .join('')}</div>${b}</div>`
}
