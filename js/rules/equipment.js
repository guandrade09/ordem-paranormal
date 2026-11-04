/**
 * Regras: equipamento (categoria, espaço, bônus de armas e proteções, efeitos de modificações).
 */

// Utilidades de equipamento
const uni = n => n >= 99 ? 11 : Math.floor((n + 5) / 10), CC = {
  Baixo: '#d32f2f',
  'Médio': '#e6b800',
  Alto: '#2e9e4f',
  Ilimitado: '#17c7d6'
};
const FR = c => c.trail == 'Aniquilador' ? (c.nex >= 99    ? 3 :
                                               c.nex >= 40 ? 2 :
                                               c.nex >= 10 ? 1 :
                                                             0) :
                                           0,
      mb = m => m.replace(/ \(.*\)$/, ''),
      msp = i => (i.mods ||
        []).reduce((a, m) => a + ({'Blindada': 1, 'Reforçada': 1, 'Discreta': -1, 'Discreto': -1}[mb(m)] || 0), 0),
      ee = (c, i) => Math.max(0, i.e + msp(i) - (i.mu && !i.w && hasAb(c, 'Mochila de Utilidades') ? 1 : 0)),
      ecat = (c, it) => Math.max(0,
        (/^Componentes Ritualísticos/.test(it.n || '') ? 0 : it.cat) + (it.mods || []).length + cuCat(it) - (it.fav ? FR(c) : 0) -
          (it.mu && !it.w && hasAb(c, 'Mochila de Utilidades') ? 1 : 0) -
          ((c.origem == 'Engenheiro' && it.eng && !it.w) ? 1 : 0) -
          (!it.w && !PR[it.n] && it.q == null && !it.am && hasAb(c, 'Remendão') ? 1 : 0));
const isFire = w => !!w && ['Balas curtas', 'Balas longas', 'Cartuchos'].includes(w.am);

// Efeitos de armas (modificações e poderes)
const weff = (c, it) => {
  let w = it.w;
  if (!w) return w;
  // Predadora: a margem de ameaça duplica (antes de qualquer efeito que a aumente)
  if (cuHas(it, 'Predadora')) w = {...w, c: Math.max(2, 2 * w.c - 21)};
  if (w.m && c.trail == 'Guerreiro' && c.nex >= 10) w = {...w, c: Math.max(2, w.c - 2)};
  if (c.origem == 'Operário' && it.op) {
    let m = w.d.match(/^(\d+d\d+)([+-]\d+)?$/), b = (m && m[2] ? +m[2] : 0) + 1;
    w = {...w, d: m ? m[1] + (b ? (b > 0 ? '+' : '') + b : '') : w.d + '+1', c: Math.max(2, w.c - 1)}
  }
  if (it.n && hasAb(c, 'Balística Avançada') && isFire(w) && wg(it.n) == 't') {
    let m = w.d.match(/^(.*?)([+-]\d+)?$/), b = (m[2] ? +m[2] : 0) + 2;
    w = {...w, d: m[1] + (b > 0 ? '+' : '') + (b ? b : '')}
  }
  if (it.fav && c.trail == 'Aniquilador' && c.nex >= 99) {
    let m = w.d.match(/^(\d+)d(\d+)(.*)$/);
    w = {...w, d: m ? (+m[1] + 1) + 'd' + m[2] + m[3] : w.d, c: Math.max(2, w.c - 2)}
  }
  if (it.n && w.m && hasAb(c, 'Golpe Pesado')) {
    let m = w.d.match(/^(\d+)d(\d+)(.*)$/);
    if (m) w = {...w, d: (+m[1] + 1) + 'd' + m[2] + m[3]}
  }
  if (it.n && w.m && wg(it.n) == 't' && hasAb(c, 'Ninja Urbano')) {
    let m = w.d.match(/^(.*?)([+-]\d+)?$/), b = (m[2] ? +m[2] : 0) + 2;
    w = {...w, d: m[1] + (b > 0 ? '+' : '') + (b ? b : '')}
  }
  if (it.n && it.mods && it.mods.length) {
    let ms = it.mods.map(mb);
    if (ms.includes('Cruel')) {
      let m = w.d.match(/^(.*?)([+-]\d+)?$/), b = (m[2] ? +m[2] : 0) + 2;
      w = {...w, d: m[1] + (b > 0 ? '+' : '') + (b ? b : '')}
    }
    if (ms.includes('Calibre Grosso')) {
      let m = w.d.match(/^(\d+)d(\d+)(.*)$/);
      if (m) w = {...w, d: (+m[1] + 1) + 'd' + m[2] + m[3]}
    }
    let am = (ms.includes('Certeira') ? 2 : 0) + (ms.includes('Alongada') ? 2 : 0),
        cm = (ms.includes('Perigosa') ? 2 : 0) + (ms.includes('Mira Laser') ? 2 : 0);
    w = {...w, ab: am, c: cm ? Math.max(2, w.c - cm) : w.c}
  }
  // dano extra de maldições: [dados, tipo, multiplica no crítico]
  const ex = (it.cur || []).map(mb).flatMap(b => b == 'Lancinante' ? [['1d8', 'Sangue', 1]] :
                                                   b == 'Erosiva'    ? [['1d8', 'Morte', 0]] : []);
  if (ex.length) w = {...w, ex};
  w = w.m ? {...w, st: (it.n && it.e == 1 && hasAb(c, 'Acuidade com Arma')) ? 'AGI' : 'FOR'} :
            (w.am ? {...w, pl: [hasAb(c, 'Tiro Certeiro') ? 'AGI' : '', w.am == 'Balas longas' && hasAb(c, 'Mira de Elite') ? 'INT' : '']
                           .filter(Boolean)} : w);
  return w
};

// Atributos somados ao dano da arma (corpo a corpo: FOR/AGI; disparo: Tiro Certeiro = AGI, Mira de Elite = INT).
// Retorna [total, "+ 3 (AGI) + 2 (INT)"]; o bônus fixo não é multiplicado por crítico.
const wAt = (c, w) => {
  const a = ea(c), l = w.m ? [w.st || 'FOR'] : (w.pl || []);
  return [l.reduce((s, x) => s + a[x], 0), l.map(x => ` + ${a[x]} (${x})`).join('')]
};

// Dado de ataque desarmado
const UNA = c => hasAb(c, 'Artista Marcial') ? (c.nex >= 70 ? '1d10' : c.nex >= 35 ? '1d8' : '1d6') : '1d3';

// Caixa de marcação em itens
const flagBox = (it, i) => {
  let c = cur(), o = c.origem, h = '';
  if (o == 'Criminoso')
    h = `<label class=flag><input type=checkbox ${it.crim ? 'checked' : ''} onchange="flg(${
      i},'crim')">Item da habilidade (não conta no limite de categoria)</label>`;
  else if (o == 'Engenheiro' && !it.w)
    h = `<label class=flag><input type=checkbox ${it.eng ? 'checked' : ''} onchange="flg(${
      i},'eng')">Ferramentas Favoritas (conta 1 categoria abaixo)${
      it.eng ? ` — Cat. ${RM[it.cat]} → ${RM[ecat(c, it)]}` : ''}</label>`;
  else if (o == 'Operário' && it.w && wg(it.n) != 'h')
    h = `<label class=flag><input type=checkbox ${it.op ? 'checked' : ''} onchange="flg(${i},'op')">${
      md('Ferramenta de Trabalho (+1 dano, +1 na margem de ameaça)')}</label>`;
  if (c.trail == 'Aniquilador' && c.nex >= 10 && it.w)
    h += `<label class=flag><input type=checkbox ${it.fav ? 'checked' : ''} onchange="flg(${
      i},'fav')">★ Arma favorita (Aniquilador)${
      it.fav ? `<br><small>Categoria ${RM[it.cat]} → <b>${RM[ecat(c, it)]}</b> (reduzida em ${FR(c)})${
                 c.nex >= 99 ? ' · +2 na margem de ameaça · +1 dado de dano' : ''}</small>` :
               ''}</label>`;
  if (hasAb(c, 'Mochila de Utilidades') && !it.w)
    h += `<label class=flag><input type=checkbox ${it.mu ? 'checked' : ''} onchange="flg(${
      i},'mu')">🎒 Mochila de Utilidades (categoria –1 e –1 espaço)${
      it.mu ?
        `<br><small>Cat. ${RM[it.cat]} → <b>${RM[ecat(c, it)]}</b> · Espaços ${it.e} → <b>${ee(c, it)}</b></small>` :
        ''}</label>`;
  return h
};
function flg(i, t) {
  mut(c => {
    let v = !c.inv[i][t];
    if (t != 'crim') c.inv.forEach(x => {x[t] = false});
    c.inv[i][t] = v
  })
}
function setOr(n) {
  let d = S.d;
  if (d.origem != n) d.cpow = null;
  d.origem = n;
  nx()
}
