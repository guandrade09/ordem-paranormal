/**
 * Dados do livro: cores de elementos, proteções, patentes, catálogo de armas/itens e munições.
 */

// Cores por elemento
const EC = {
  Sangue: '#b0121d',
  Morte: '#4a4a4a',
  Conhecimento: '#d9a900',
  Energia: '#a63cff',
  Medo: '#f4f4f4'
};

// Efeitos visuais por elemento
const FX = {
  ...Object.fromEntries(Object.entries(EC).map(
    ([k, c]) => [k, [c, {Sangue: '♥', Morte: '☠', Conhecimento: '👁', Energia: '⚡', Medo: '◉'}[k]]])),
  balístico: ['#777', '●'],
  corte: ['#c33', '╱'],
  impacto: ['#a60', '✸'],
  perfuração: ['#468', '↟'],
  fogo: ['#e5560c', '🔥'],
  gelo: ['#4cc3e8', '❄'],
  químico: ['#6c2', '☣']
};

// Proteções (defesa e resistência)
const PR = {
  Nenhuma: {d: 0, r: ''},
  'Proteção leve': {d: 5, r: ''},
  'Proteção pesada': {d: 10, r: 'Balístico, Corte, Impacto e Perfuração 2'},
  Escudo: {d: 2, r: ''}
};

// Patentes (PP, crédito, limites de itens)
const PT = [
  ['Recruta', 0, 'Baixo', [2, 0, 0, 0]], ['Operador', 20, 'Médio', [3, 1, 0, 0]],
  ['Agente especial', 50, 'Médio', [3, 2, 1, 0]], ['Oficial de operações', 100, 'Alto', [3, 3, 2, 1]],
  ['Agente de elite', 200, 'Ilimitado', [3, 3, 3, 2]]
];

// Construtor de arma
const w = (n, c, e, d, cr, x, t, m, mx) => [n, c, e, {m: m ? 1 : 0, d, c: cr, x, t, ...(mx ? {mag: mx, mx} : {})}],
      u = z => z.split(',').map(a => {
        let [n, c, e] = a.split(':');
        return [n, +c, +e, {}]
      });

// Catálogo de itens por categoria
const CAT = {
  arm: [
    w('Faca', 0, 1, '1d4', 19, 2, 'corte', 1), w('Martelo', 0, 1, '1d6', 20, 2, 'impacto', 1),
    w('Punhal', 0, 1, '1d4', 20, 3, 'perfuração', 1), w('Bastão', 0, 1, '1d6', 20, 2, 'impacto', 1),
    w('Machete', 0, 1, '1d6', 19, 2, 'corte', 1), w('Lança', 0, 1, '1d6', 20, 2, 'perfuração', 1),
    w('Cajado', 0, 2, '1d6', 20, 2, 'impacto', 1), w('Arco', 0, 2, '1d6', 20, 3, 'perfuração'),
    w('Besta', 0, 2, '1d8', 19, 2, 'perfuração'), w('Pistola', 1, 1, '1d12', 18, 2, 'balístico', 0, 15),
    w('Revólver', 1, 1, '2d6', 19, 3, 'balístico', 0, 6), w('Fuzil de caça', 1, 2, '2d8', 19, 3, 'balístico', 0, 5),
    w('Machadinha', 1, 1, '1d6', 20, 3, 'corte', 1), w('Nunchaku', 1, 1, '1d8', 20, 2, 'impacto', 1),
    w('Corrente', 0, 1, '1d8', 20, 2, 'impacto', 1), w('Espada', 1, 1, '1d8', 19, 2, 'corte', 1),
    w('Florete', 1, 1, '1d6', 18, 2, 'perfuração', 1), w('Machado', 1, 1, '1d8', 20, 3, 'corte', 1),
    w('Maça', 1, 1, '2d4', 20, 2, 'impacto', 1), w('Acha', 1, 2, '1d12', 20, 3, 'corte', 1),
    w('Gadanho', 1, 2, '2d4', 20, 4, 'corte', 1), w('Katana', 1, 2, '1d10', 19, 2, 'corte', 1),
    w('Marreta', 1, 2, '3d4', 20, 2, 'impacto', 1), w('Montante', 1, 2, '2d6', 19, 2, 'corte', 1),
    w('Motoserra', 1, 2, '3d6', 20, 2, 'corte', 1), w('Arco composto', 1, 2, '1d10', 20, 3, 'perfuração'),
    w('Balestra', 1, 2, '1d12', 19, 2, 'perfuração'), w('Submetralhadora', 1, 1, '2d6', 19, 3, 'balístico', 0, 30),
    w('Espingarda', 1, 2, '4d6', 20, 3, 'balístico', 0, 2),
    w('Fuzil de precisão', 3, 2, '2d10', 19, 3, 'balístico', 0, 5), w('Bazuca', 3, 2, '10d8', 20, 2, 'impacto', 0, 1),
    w('Lança-chamas', 3, 2, '6d6', 20, 2, 'fogo', 0, 10), ['Balas curtas', 0, 1, {q: 30}],
    ['Balas longas', 1, 1, {q: 30}], ['Cartuchos', 1, 1, {q: 20}], ['Flechas', 0, 1, {q: 20}],
    ['Foguete', 1, 1, {q: 1}], ['Combustível', 1, 1, {q: 20}], ['Proteção leve', 1, 2, {}],
    ['Proteção pesada', 2, 5, {}], ['Escudo', 1, 2, {}]
  ],
  uti: u(
    'Kit de perícia:0:1,Utensílio:1:1,Vestimenta:1:1,Granada de atordoamento:0:1,Granada de fragmentação:1:1,Granada de fumaça:0:1,Granada incendiária:1:1,Mina antipessoal:1:1,Algemas:0:1,Arpéu:0:1,Bandoleira:1:1,Binóculos:0:1,Bloqueador de sinal:1:1,Cicatrizante:1:1,Corda:0:1,Equipamento de sobrevivência:0:2,Lanterna tática:0:1,Máscara de gás:0:1,Mochila militar:1:1,Óculos de visão térmica:1:1,Pistola de dardos:1:1,Pistola sinalizadora:0:1,Soqueira:0:1,Spray de pimenta:0:1,Taser:1:1,Traje hazmat:1:2'),
  amd: []
};
CAT.arm.push(w('Fuzil de assalto', 2, 2, '2d10', 19, 3, 'balístico', 0, 30),
  w('Metralhadora', 2, 2, '2d12', 19, 3, 'balístico', 0, 50));

// Munições por tipo de arma
const AMM = {
  Pistola: ['Balas curtas', 12],
  Revólver: ['Balas curtas', 6],
  'Fuzil de caça': ['Balas longas', 4],
  Submetralhadora: ['Balas curtas', 20],
  Espingarda: ['Cartuchos', 6],
  'Fuzil de assalto': ['Balas longas', 30],
  'Fuzil de precisão': ['Balas longas', 1],
  Metralhadora: ['Balas longas', 50],
  Bazuca: ['Foguete', 1],
  'Lança-chamas': ['Combustível', 0],
  Arco: ['Flechas', 0],
  Besta: ['Flechas', 0],
  'Arco composto': ['Flechas', 0],
  Balestra: ['Flechas', 0]
};
CAT.arm.forEach(a => {
  let m = AMM[a[0]];
  if (m) {
    a[3].am = m[0];
    if (m[1]) {
      a[3].mx = m[1];
      a[3].mag = 0
    } else {
      delete a[3].mx;
      delete a[3].mag
    }
  }
});
CAT.mun = CAT.arm.filter(x => x[3].q);
CAT.pro = CAT.arm.filter(x => PR[x[0]]);
CAT.arm = CAT.arm.filter(x => x[3].d);
