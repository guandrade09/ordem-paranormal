/**
 * NPCs e classe Mundano: dano, escolha de classe e telas de NPC.
 */

CL.Mundano = {
  pv: [8, 0],
  pe: [1, 0],
  san: [8, 0],
  per: 1,
  fix: [],
  prof: 'Armas simples',
  d: 'Pessoa comum envolvida com o paranormal. Habilidade: Empenho.',
  pod: [['Empenho', 1, 'Energia', 'Gasta 1 PE: +2 em um teste de perícia.']]
};
PRF.Mundano = ['s'];
const AMX = {
  'Balas curtas': 30,
  'Balas longas': 30,
  Cartuchos: 20,
  Flechas: 20,
  Foguete: 1,
  'Combustível': 20
},
      DMG = {
        'Punhos Enraivecidos': {d: '1d8', t: 'Sangue', fx: 'Sangue', pe: 2},
        'Pistola sinalizadora': {d: '2d6', t: 'fogo', fx: 'fogo'},
        'Taser': {d: '1d6', t: 'eletricidade', fx: 'Energia'}
      };
function useDmg(i) {
  let c = cur(), it = c.inv[i], d = DMG[it.n];
  if (d.pe && d.pe > K(c).rod) return toast(`⚠ Custo de ${d.pe} PE acima do limite por rodada.`);
  if (d.pe && c.pe < d.pe) return toast('PE insuficiente');
  let r = rl(d.d);
  fx(d.fx);
  if (d.pe) mut(z => {z.pe -= d.pe});
  toast(`${it.n}: dano ${r} (${d.t})${d.pe ? ' · −' + d.pe + ' PE' : ''}`)
}
function vCls() {
  const I = {
    Combatente:
      '+12 PV, +1 PE, +4 SAN · Fortitude ou Reflexos e Luta ou Pontaria · armas táticas e proteções leves · Ataque Especial',
    Especialista: '+8 PV, +2 PE, +8 SAN · 6 perícias à escolha · proteções leves · Eclético e Perito',
    Ocultista: '+4 PV, +3 PE, +12 SAN · Ocultismo e Vontade + 2 à escolha · Escolhido pelo Outro Lado'
  };
  return `<small>Ao atingir NEX 5%, escolha uma classe (exige treinamento com um agente experiente)</small>${
    Object.keys(I)
      .map(n => `<button class=card onclick="lvCl('${n}')"><b>${n}</b><br><small>${I[n]}</small></button>`)
      .join('')}`
}
function lvCl(n) {
  let c = cur(), a = K(c);
  c.classe = n;
  c.nex = 5;
  c.trained = [];
  let b = K(c);
  c.pv += b.pv - a.pv;
  c.pe += b.pe - a.pe;
  c.san += b.san - a.san;
  lvNext()
}
const ALI = {
  'Acólito': [
    'Pessoa envolvida com o paranormal, com conhecimento para auxiliar em rituais.',
    '**Bônus:** +2 em Ocultismo e não precisa manipular componentes ritualísticos. **Conjuração Conjunta:** ao conjurar um ritual, gasta **1 PE** para aumentar a DT contra ele em **+2**.'
  ],
  'Faz-Tudo': [
    'Pessoa treinada em uma ou mais perícias, com bastante prática.',
    '**Bônus:** escolha duas perícias (exceto Luta e Pontaria); você é treinado nelas. **Dica Valiosa:** gasta **1 PE** para receber **+1d6** em um teste de uma delas.'
  ],
  'Guerrilheiro': [
    'Soldado, policial ou outro indivíduo treinado para o combate armado.',
    '**Bônus:** +2 em testes de ataque. **Ataque Conjunto:** ao atacar, gasta **1 PE**; se acertar, causa **+1d8** de dano.'
  ],
  'Socorrista': [
    'Médico, enfermeiro ou outro indivíduo treinado em primeiros socorros.',
    '**Bônus:** treinado em Medicina. **Bolsa de Remédios:** gasta **1 PE** para recuperar **1d8+1 PV** de si ou de um aliado adjacente.'
  ]
};
function tipoStep(d) {
  return `<div class=bar>Tipo de aliado</div>${
    Object.keys(ALI)
      .map(n => `<button class="card ${d.tipo == n ? 'req' : ''}" onclick="S.d.tipo='${n}';R()">${
             d.tipo == n ?
               '<span class=chk>✔</span>' :
               ''}<b>${n}</b><br><small>${ALI[n][0]}</small>${d.tipo == n ? `<p>${md(ALI[n][1])}</p>` : ''}</button>`)
      .join('')}<button class=btn ${d.tipo ? '' : 'disabled'} onclick="nx()">Confirmar</button>`
}

// Tela de NPC
function npcv() {
  return `<div class=fade><button onclick="S.v='mestre';R()">← Voltar</button><div class=bar>NPCs</div><div class=grid2 style="gap:8px"><button class=btn onclick="newC('ativo')">+ NPC ativo</button><button class=btn onclick="newC('passivo')">+ NPC passivo</button></div><small>Ativos têm ficha completa; passivos são aliados de um personagem.</small>${
    S.chars.filter(c => c.npc)
      .map(
        c => `<div class="card row" onclick="openN(${c.id})">${ph(c)}<div style="flex:1"><b>${c.name}</b><br><small>${
          c.npc == 'ativo' ? 'NPC ativo · ' + c.classe + ' · ' + c.origem + ' · NEX ' + c.nex + '%' :
                             'NPC passivo · ' +
              c.tipo}</small></div><button class=x onclick="event.stopPropagation();delC(${c.id})">✕</button></div>`)
      .join('') ||
    '<p><small>Nenhum NPC criado.</small></p>'}</div>`
}
function openN(id) {
  let c = S.chars.find(z => z.id == id);
  if (c.npc == 'ativo') {
    S.bk = null;
    S.cid = id;
    S.v = 'sheet';
    S.tab = 0;
    return R()
  }
  modal(`<div class=row>${ph(c)}<div><b style="font:24px 'Bebas Neue'">${c.name}</b><br><small>NPC passivo · Aliado ${
    c.tipo}</small></div></div><p>${ALI[c.tipo][0]}</p><p>${
    md(ALI
        [c.tipo]
        [1])}</p><small>Aliados não têm PV, PE nem turno próprio: ajudam um dos personagens.</small><button class=btn onclick="cm()">Fechar</button>`)
}
