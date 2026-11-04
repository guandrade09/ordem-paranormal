/**
 * Melhorias de armas, proteções e acessórios: modificações (+1 categoria cada) e maldições (ver js/data/curses.js).
 */

// Modificações de armas, proteções e acessórios
const
  MW_ALL = ['Certeira', 'Cruel', 'Discreta', 'Perigosa', 'Tática'],
  MW_FIRE =
    [
      'Alongada', 'Calibre Grosso', 'Compensador', 'Ferrolho Automático', 'Mira Laser', 'Mira Telescópica',
      'Silenciador', 'Visão de Calor'
    ],
  AUTOW = ['Submetralhadora', 'Fuzil de assalto', 'Metralhadora'], ACC = ['Kit de perícia', 'Utensílio', 'Vestimenta'],
  MTX = {
    Certeira: '+2 em testes de ataque.',
    Cruel: '+2 em rolagens de dano.',
    Discreta:
      'Reduz em 1 o espaço ocupado, dá +5 em testes de Crime para ocultar o item e permite o teste mesmo sem treinamento.',
    Perigosa: '+2 na margem de ameaça.',
    Tática: 'Pode sacar a arma como ação livre.',
    Alongada: '+2 em testes de ataque.',
    'Calibre Grosso':
      'Aumenta o dano em mais um dado do mesmo tipo (exige munição de calibre grosso, de mesma categoria da normal).',
    Compensador: 'Anula a penalidade em testes de ataque por disparar rajadas (apenas armas automáticas).',
    'Ferrolho Automático': 'A arma se torna automática.',
    'Mira Laser': '+2 na margem de ameaça.',
    'Mira Telescópica':
      'Aumenta o alcance da arma em uma categoria (curto→médio→longo→extremo) e permite usar Ataque Furtivo em qualquer alcance.',
    Silenciador: 'Reduz em –10 a penalidade em Furtividade para se esconder no mesmo turno em que atacou com a arma.',
    'Visão de Calor': 'Ao disparar, ignora camuflagem do alvo.',
    Antibombas: '+5 em testes de resistência contra efeitos de área. Só em proteções pesadas.',
    Blindada: 'Resistência a dano passa a 5 e o espaço ocupado aumenta em +1. Só em proteções pesadas.',
    'Reforçada': 'Aumenta a Defesa em +2 e o espaço ocupado em +1. Não combina com Discreta.',
    Aprimorado: 'O bônus em perícia concedido pelo acessório aumenta para +5.',
    Discreto:
      'Reduz em 1 o espaço ocupado, dá +5 em testes de Crime para ocultar o item e permite o teste mesmo sem treinamento.',
    'Função adicional': 'Concede +2 em uma perícia adicional.',
    Instrumental: 'O acessório funciona como um kit de perícia.'
  },
  MAUTO = [
    'Certeira', 'Alongada', 'Cruel', 'Calibre Grosso', 'Perigosa', 'Mira Laser', 'Reforçada', 'Blindada', 'Discreta',
    'Discreto'
  ];

// Tipo da modificação
const modKind = it => it.w                                                 ? (isFire(it.w) ? 'fogo' : 'arma') :
  it.n == 'Escudo' || it.n == 'Proteção leve' || it.n == 'Proteção pesada' ? 'prot' :
  ACC.includes(it.n)                                                       ? 'acc' :
                                                                             null;
function modOpts(it) {
  let k = modKind(it), h = (it.mods || []).map(mb), l = [];
  if (k == 'arma')
    l = MW_ALL;
  else if (k == 'fogo')
    l = [...MW_ALL, ...MW_FIRE];
  else if (k == 'prot')
    l = ['Antibombas', 'Blindada', 'Discreta', 'Reforçada'].filter(m => (m == 'Antibombas' || m == 'Blindada') ?
        it.n == 'Proteção pesada' :
        m == 'Discreta' ? it.n == 'Proteção leve' && !h.includes('Reforçada') :
                          !h.includes('Discreta'));
  else if (k == 'acc')
    l = ['Aprimorado', 'Discreto', 'Função adicional', 'Instrumental'];
  return l.filter(
    m => !h.includes(m) && (m != 'Compensador' || AUTOW.includes(it.n) || h.includes('Ferrolho Automático')))
}
const modTxt = m => {
  let b = mb(m), x = (m.match(/\((.*)\)$/) || [])[1];
  return (b == 'Função adicional' && x ? 'Concede +2 em ' + x + '.' :
      b == 'Instrumental' && x         ? 'Funciona como kit de perícia de ' + x + '.' :
                                         MTX[b] || '')
};
// Card simplificado de maldição (como os de habilidades): nome, resumo e custo de PE à direita
const curRow = (it, i, j) => {
  const m = it.cur[j], b = mb(m), x = CUX[b] || {}, el = cuEl(m);
  return `<div class="card ab" style="margin-top:6px" onclick="curCard(${i},${j})"><div class=abt><b>${
    CUEMO[el] || ''} ${m}</b> <span class=el style="background:${EC[el] || '#777'}">${el || ''}</span><br><small>${
    md(x.s || '')}</small></div>${x.pe ? `<b class=pec>${x.pe} PE</b>` : x.v ? '<small class=pec>PE var.</small>' : ''}</div>`
};
// Maldições na aba Ações (itens em uso: proteções só a vestida e o escudo)
const curCards = c => {
  const iv = c.inv.map(x => x.n), bs = iv.includes('Proteção pesada') ? 'Proteção pesada' :
                                       iv.includes('Proteção leve')   ? 'Proteção leve' : '',
        l = [];
  c.inv.forEach((it, i) => {
    if (cuKind(it) == 'prot' && it.n != bs && it.n != 'Escudo') return;
    (it.cur || []).forEach((m, j) => l.push(curRow(it, i, j).replace('<b>', `<b>${it.n} · `)))
  });
  return l.length ? `<div class=bar>Maldições</div>${l.join('')}` : ''
};
// Detalhe da maldição: texto completo, botão Usar (desconta o PE) e remover
function curCard(i, j) {
  const c = cur(), it = c.inv[i], m = it.cur[j], b = mb(m), x = CUX[b] || {}, el = cuEl(m);
  modal(`<button class=xc onclick="cm()">✕</button><div class=ahd><b style="font:26px 'Bebas Neue'">${CUEMO[el] || ''} ${
    m}</b>${x.pe ? `<b class=pec>${x.pe} PE</b>` : ''}</div><small>${it.n} · <span class=el style="background:${
    EC[el] || '#777'}">${el || ''}</span></small><p>${md(curTxt(it, m))}</p>${
    x.pe ? `<button class=btn style="width:100%;font-size:24px;margin-top:6px" onclick="curUse(${i},${j})">Usar</button>` :
    x.v  ? '<small>Custo de PE variável: é o custo do ritual (desconte-o no grimório ou à mão).</small>' :
           '<small>Maldição passiva: os bônus já entram na ficha.</small>'}
<button class=x style="margin-top:10px" onclick="cm();curDel(${i},${j})">✕ Remover maldição</button>`)
}
// Usar: desconta o PE (respeitando o limite por rodada), rola os dados e aplica cura em PV
function curUse(i, j) {
  const c = cur(), k = K(c), it = c.inv[i], m = it.cur[j], b = mb(m), x = CUX[b] || {}, n = x.pe || 0;
  if (!n) return;
  if (n > k.rod) return toast(`⚠ Custo de ${n} PE acima do limite de ${k.rod} PE por rodada (NEX ${c.nex}%).`);
  if (c.pe < n) return toast('PE insuficiente');
  cm();
  fx('ico', CUEMO[cuEl(m)] || '✨');
  const r = x.dx ? `${x.dx[1]}: ${rl(x.dx[0])} (${x.dx[0]})` : '', h = x.hp ? rl(x.hp) : 0;
  mut(z => {
    z.pe -= n;
    if (h) z.pv = Math.min(K(z).pv, z.pv + h)
  });
  toast(`${b}${r ? ' · ' + r : ''}${h ? ` · +${h} PV` : ''} · −${n} PE`)
}

// Seção "Melhorias" do Inventário: itens com modificações e/ou maldições
const modSec = c => {
  let l = c.inv.map((it, i) => [it, i]).filter(([it]) => (it.mods || []).length || (it.cur || []).length);
  return `<div class=bar>Melhorias</div>${
    l.map(([it, i]) => {
        const els = [...new Set((it.cur || []).map(cuEl).filter(e => CUPRECO[e]))];
        return `<div class=card><b>${cuNm(it)}</b> <small>Cat. ${RM[it.cat]} → <b>${RM[ecat(c, it)]}</b> · Espaços ${
          it.e} → <b>${ee(c, it)}</b></small>${
          (it.mods || [])
            .map(
              (m, j) => `<div class=row style="margin-top:6px;align-items:flex-start"><div style="flex:1"><b>➕ ${
                m}</b><br><small>${modTxt(m)}</small></div><button class=x onclick="modDel(${i},${j})">✕</button></div>`)
            .join('')}${
          (it.cur || []).map((m, j) => curRow(it, i, j)).join('')}${
          els.length ?
            `<small style="display:block;margin-top:8px;opacity:.8"><b>Preço da maldição:</b> ${
              els.map(e => `${e}: perde 2 de Sanidade ao falhar em teste de ${CUPRECO[e]}`).join('; ')}.</small>` :
            ''}</div>`
      })
      .join('') ||
    '<small>Nenhuma melhoria aplicada.</small>'}<div style="text-align:center"><button class=btn style="width:72px;font-size:34px;line-height:1;padding:0 0 4px" onclick="modPick()">+</button></div>`
};

// Texto da maldição no item (alguns valores dependem do tipo de proteção)
const curTxt = (it, m) => {
  const d = cuDef(m), b = mb(m), el = cuEl(m);
  if (!d) return '';
  if (b == 'Cinética') return `+2 em Defesa e resistência a dano ${it.n == 'Proteção pesada' ? 5 : 2}.`;
  if (b == 'Letárgica') return `+2 em Defesa; ${it.n == 'Proteção pesada' ? 50 : 25}% de chance de ignorar o dano extra de acertos críticos e ataques furtivos.`;
  if (b == 'Proteção Elemental' && el) return `Resistência 10 contra ${el}. Conta como um item de ${el}.`;
  return d.t
};

// Passo 1: escolher o item
function modPick() {
  let c = cur(), l = c.inv.map((it, i) => [it, i]).filter(([it]) => modKind(it));
  modal(
    `<button class=xc onclick="cm()">✕</button><b>Adicionar melhoria — escolha o item</b><small> (armas, proteções e acessórios do Inventário)</small>${
      l.map(([it, i]) => `<button class=card onclick="modItem(${i})"><b>${cuNm(it)}</b> <small>Cat. ${RM[ecat(c, it)]}${
              (it.mods || []).length ? ' · ' + it.mods.length + ' modificação(ões)' : ''}${
              (it.cur || []).length ? ' · ' + it.cur.length + ' maldição(ões)' : ''}</small></button>`)
        .join('') ||
      '<p><small>Nenhuma arma, proteção ou acessório no Inventário.</small></p>'}`)
}

// Passo 2: modificações ou maldições
function modItem(i) {
  let c = cur(), it = c.inv[i], nm = modOpts(it).length, nc = cuOpts(it).length;
  modal(`<button class=xc onclick="cm()">✕</button><button onclick="modPick()">← Itens</button><br><b>${
    cuNm(it)}</b><small> — o que deseja aplicar?</small>
<button class=card ${nm ? '' : 'disabled style="opacity:.5"'} onclick="modMods(${i})"><b>Modificações ➕</b><br><small>${
    nm ? 'Cada modificação aumenta a categoria em +1.' : 'Nenhuma modificação disponível para este item.'}</small></button>
<button class=card ${nc ? '' : 'disabled style="opacity:.5"'} onclick="curList(${i})"><b>Maldições 🩸💀⭐👾</b><br><small>${
    nc ? 'A 1ª maldição aumenta a categoria em +II; cada uma das seguintes, em +I.' :
         cuKind(it) ? 'Nenhuma maldição disponível para este item.' : 'Este item não aceita maldições.'}</small></button>`)
}

// Passo 3a: modificações disponíveis
function modMods(i) {
  let c = cur(), it = c.inv[i], o = modOpts(it);
  modal(`<button class=xc onclick="cm()">✕</button><button onclick="modItem(${i})">← Voltar</button><br><b>➕ ${
    cuNm(it)}</b><small> — cada modificação aumenta a categoria em +1</small>${
    o.map(m => `<button class=card onclick="${
            m == 'Função adicional' || m == 'Instrumental' ?
              `modSk(${i},'${m}')` :
              `modAdd(${i},'${m}')`}"><b>${m}</b><br><small>${modTxt(m)}</small></button>`)
      .join('') ||
    '<p><small>Nenhuma modificação disponível para este item.</small></p>'}`)
}
function modSk(i, m) {
  modal(`<button class=xc onclick="cm()">✕</button><button onclick="modMods(${i})">← Voltar</button><br><b>${
    m} — escolha a perícia</b><div class=scr>${
    SK.filter(z => !['Luta', 'Pontaria'].includes(z.n))
      .map(z => `<button class=card onclick="modAdd(${i},'${m} (${z.n})')"><b>${z.n}</b></button>`)
      .join('')}</div>`)
}

// Passo 3b: maldições disponíveis (agrupadas por elemento)
function curList(i) {
  let c = cur(), it = c.inv[i], o = cuOpts(it);
  modal(`<button class=xc onclick="cm()">✕</button><button onclick="modItem(${i})">← Voltar</button><br><b>${
    cuNm(it)}</b><small> — a 1ª maldição aumenta a categoria em +II; as seguintes, em +I. Elementos opressores não combinam no mesmo item: só Sangue + Energia ou Conhecimento + Morte.</small>${
    [...CUEL, 'Varia']
      .map(e => {
        const l = o.filter(d => d.el == e);
        return l.length ?
          `<div class=bar style="background:${EC[e] || '#555'};color:#fff;font-size:18px">${CUEMO[e] || '🌀'} ${
            e == 'Varia' ? 'VARIA' : e.toUpperCase()}</div>${
            l.map(d => `<button class=card onclick="${d.el == 'Varia' ? `curEl(${i})` : `curAdd(${i},'${d.n}')`}"><b>${
                    d.n}</b><br><small>${md(curTxt(it, d.n))}</small></button>`)
              .join('')}` :
          ''
      })
      .join('')}`)
}
// Proteção Elemental: escolher o elemento
function curEl(i) {
  let it = cur().inv[i];
  modal(`<button class=xc onclick="cm()">✕</button><button onclick="curList(${i})">← Voltar</button><br><b>Proteção Elemental — escolha o elemento</b>${
    CUEL.filter(e => cuElOk(it, e))
      .map(e => `<button class=card onclick="curAdd(${i},'Proteção Elemental (${e})')"><b>${CUEMO[e]} ${e}</b><br><small>Resistência 10 contra ${
             e}.</small></button>`)
      .join('')}`)
}

// Adicionar / remover
function modAdd(i, m) {
  cm();
  mut(c => {
    let it = c.inv[i];
    it.mods = it.mods || [];
    if (!it.mods.some(x => mb(x) == mb(m))) it.mods.push(m)
  })
}
function modDel(i, j) {
  mut(c => {c.inv[i].mods.splice(j, 1)})
}
function curAdd(i, m) {
  cm();
  mut(c => {
    let it = c.inv[i];
    it.cur = it.cur || [];
    if (!it.cur.some(x => mb(x) == mb(m))) it.cur.push(m)
  })
}
function curDel(i, j) {
  mut(c => {c.inv[i].cur.splice(j, 1)})
}
