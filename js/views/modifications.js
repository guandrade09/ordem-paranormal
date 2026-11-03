/**
 * Modificações de armas, proteções e acessórios.
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
const modSec = c => {
  let l = c.inv.map((it, i) => [it, i]).filter(([it]) => (it.mods || []).length);
  return `<div class=bar>Modificações</div>${
    l.map(
       ([it, i]) => `<div class=card><b>${it.n}</b> <small>Cat. ${RM[it.cat]} → <b>${RM[ecat(c, it)]}</b> · Espaços ${
         it.e} → <b>${ee(c, it)}</b></small>${
         it.mods
           .map(
             (m, j) => `<div class=row style="margin-top:6px;align-items:flex-start"><div style="flex:1"><b>${
               m}</b><br><small>${modTxt(m)}</small></div><button class=x onclick="modDel(${i},${j})">✕</button></div>`)
           .join('')}</div>`)
      .join('') ||
    '<small>Nenhuma modificação aplicada.</small>'}<div style="text-align:center"><button class=btn style="width:72px;font-size:34px;line-height:1;padding:0 0 4px" onclick="modPick()">+</button></div>`
};
function modPick() {
  let c = cur(), l = c.inv.map((it, i) => [it, i]).filter(([it]) => modKind(it));
  modal(
    `<button class=xc onclick="cm()">✕</button><b>Adicionar modificação — escolha o item</b><small> (armas, proteções e acessórios do Inventário)</small>${
      l.map(([it, i]) => `<button class=card onclick="modItem(${i})"><b>${it.n}</b> <small>Cat. ${RM[ecat(c, it)]}${
              (it.mods || []).length ? ' · ' + it.mods.length + ' modificação(ões)' : ''}</small></button>`)
        .join('') ||
      '<p><small>Nenhuma arma, proteção ou acessório no Inventário.</small></p>'}`)
}
function modItem(i) {
  let c = cur(), it = c.inv[i], o = modOpts(it);
  modal(`<button class=xc onclick="cm()">✕</button><button onclick="modPick()">← Itens</button><br><b>${
    it.n}</b><small> — cada modificação aumenta a categoria em +1</small>${
    o.map(m => `<button class=card onclick="${
            m == 'Função adicional' || m == 'Instrumental' ?
              `modSk(${i},'${m}')` :
              `modAdd(${i},'${m}')`}"><b>${m}</b><br><small>${modTxt(m)}</small></button>`)
      .join('') ||
    '<p><small>Nenhuma modificação disponível para este item.</small></p>'}`)
}
function modSk(i, m) {
  modal(`<button class=xc onclick="cm()">✕</button><button onclick="modItem(${i})">← Voltar</button><br><b>${
    m} — escolha a perícia</b><div class=scr>${
    SK.filter(z => !['Luta', 'Pontaria'].includes(z.n))
      .map(z => `<button class=card onclick="modAdd(${i},'${m} (${z.n})')"><b>${z.n}</b></button>`)
      .join('')}</div>`)
}

// Adicionar modificação
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
