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

// Quanto PE/PV/Defesa temporário adicionar ao usar (só mostra o valor; quem aplica é o jogador nos campos "temp")
const TMPI = {
  'Sentido Tático': c => `+${ea(c).INT} de Defesa temporária (até o fim da cena)`,
  'Equipe de Trauma': c => hasAb(c, 'Resgate') ? '+5 de Defesa temporária (Resgate)' : '',
  'Resgate': () => '+5 de Defesa temporária para você e o aliado ao curar',
  'Absorver Agonia': () => 'PE temporários = círculo do ritual (1º = +1 … 4º = +4)',
  'Gladiador Paranormal': (c, k) => `+2 PE temporários por acerto (máx. ${k.rod} na cena)`,
  'Potencial Reaproveitado': (c, k, j, aff) => `+${aff ? 2 : 1} PE temporário${aff ? 's' : ''} (até o fim da cena)`,
  'Vislumbres do Passado': () => `+${rl('1d4')} PE temporários (1d4)`,
  'Forma Monstruosa': (c, k, j) => j == 2 ? '+10 de Defesa e 50 PV temporários' : '+5 de Defesa e 30 PV temporários',
  'Fortalecimento Sensorial': (c, k, j) => j == 2 ? '+10 de Defesa' : '',
  'Salto Fantasma': (c, k, j) => j == 1 ? '+10 de Defesa contra um ataque' : ''
};
const tmpInfo = (c, n, j, aff) => TMPI[n] ? TMPI[n](c, K(c), j || 0, aff) : '';
function tmpShow(i) {
  let c = cur(), k = K(c), p = abl(c, k)[i];
  cm();
  toast(`${p[0]}: ${tmpInfo(c, p[0], 0, !!(p[5] && c.af == p[5][1]))}`)
}
