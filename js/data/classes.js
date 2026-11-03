/**
 * Dados do livro: perícias e classes (PV/PE/SAN por NEX, proficiências, poderes base).
 */

// Perícias (nome, atributo-base, flags)
const SK =
  'Acrobacia:AGI:+,Adestramento:PRE:*,Artes:PRE:*,Atletismo:FOR,Atualidades:INT,Ciências:INT:*,Crime:AGI:*+,Diplomacia:PRE,Enganação:PRE,Fortitude:VIG,Furtividade:AGI:+,Iniciativa:AGI,Intimidação:PRE,Intuição:PRE,Investigação:INT,Luta:FOR,Medicina:INT,Ocultismo:INT:*,Percepção:PRE,Pilotagem:AGI:*,Pontaria:AGI,Profissão:INT:*,Reflexos:AGI,Religião:PRE:*,Sobrevivência:INT,Tática:INT:*,Tecnologia:INT:*,Vontade:PRE'
    .split(',')
    .map(s => {
      let [n, a, f = ''] = s.split(':');
      return {
        n, a, f
      }
    });

// Classes
const CL = {
  Combatente: {
    pv: [20, 4],
    pe: [2, 2],
    san: [12, 3],
    per: 3,
    fix: [],
    prof: 'Armas simples e táticas; proteções leves',
    d: 'Treinado para lutar e sobreviver. Mais PV, ataques letais.',
    pod: [['Ataque Especial', 2, 'impacto', 'Gasta 2 PE: +5 no teste de ataque ou na rolagem de dano.']]
  },
  Especialista: {
    pv: [16, 3],
    pe: [3, 3],
    san: [16, 4],
    per: 7,
    fix: [],
    prof: 'Armas simples; proteções leves',
    d: 'Perito em perícias e investigação. Muitas perícias treinadas.',
    pod: [
      ['Eclético', 2, 'Conhecimento', 'Gasta 2 PE: recebe os benefícios de ser treinado em uma perícia no teste.'],
      ['Perito', 2, 'Conhecimento', 'Gasta 2 PE em perícia treinada escolhida: +1d6 no teste.']
    ]
  },
  Ocultista: {
    pv: [12, 2],
    pe: [4, 4],
    san: [20, 5],
    per: 3,
    fix: ['Ocultismo', 'Vontade'],
    prof: 'Armas simples',
    d: 'Conjura rituais e domina o Outro Lado. Mais PE e Sanidade.',
    pod: [['Escolhido pelo Outro Lado', 0, 'Medo', 'Passivo: começa com 3 rituais de 1º círculo.']]
  }
};
