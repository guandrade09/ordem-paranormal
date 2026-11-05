/**
 * Regras: categorias por NEX, efeitos de rituais e correções de dados antigos.
 */

// Categorias por NEX e bônus
const BC = [0, 1, 3, 6, 10],
      acc = n => n >= 85 ? 4 :
  n >= 55                ? 3 :
  n >= 25                ? 2 :
                           1,
      ELO = ['Conhecimento', 'Energia', 'Morte', 'Sangue', 'Medo'],
      nz = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Efeitos de rituais
const EF = {
  'Armadura de Sangue': {tdef: [5, 10, 15]},
  'Embaralhar': {tdef: [6, 10, 16]},
  'Cicatrização': {heal: ['3d8+3', '5d8+5', '7d8+7']},
  'Consumir Manancial': {tpv: ['3d6', '6d6', '']},
  'Tela de Ruído': {tpv: ['30', '60', '']}
};

// Correção de dados antigos (Medo círculo 4)
const M4 = r => r.el == 'Medo' && r.ci == 4, m4fix = c => {
  c.rit = c.rit || [];
  (c.ab || []).forEach(a => {
    if (a.tr && RT.some(r => M4(r) && r.n == a.n) && !c.rit.includes(a.n)) c.rit.push(a.n)
  })
};
