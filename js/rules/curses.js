/**
 * Regras: maldições de itens (quais cabem em cada item, categoria, ícones e efeitos automáticos na ficha).
 * Cada item guarda as maldições em `it.cur` (nomes; "Proteção Elemental" leva o elemento: "Proteção Elemental (Sangue)").
 */

const cuDef = m => CURSES.find(x => x.n == mb(m)),
      // Elemento da maldição (em "Proteção Elemental" é o escolhido)
      cuEl = m => {
        const d = cuDef(m);
        return !d ? null : d.el == 'Varia' ? (m.match(/\((.*)\)$/) || [])[1] || null : d.el
      },
      // Onde o item aceita maldições: 'arma' | 'corpo' (arma corpo a corpo) | 'prot' | 'acc' | null (não aceita)
      cuKind = it => {
        const k = modKind(it);
        return k == 'fogo' || k == 'arma' ? 'arma' :
               k == 'prot'                ? 'prot' :
               k == 'acc' && (it.n == 'Utensílio' || it.n == 'Vestimenta') ? 'acc' :
                                            null
      },
      // Elementos opressores entre si não combinam no mesmo item
      cuClash = (a, b) => CUOPR[a] == b || CUOPR[b] == a,
      cuElOk = (it, el) => (it.cur || []).every(m => !cuClash(cuEl(m), el)),
      // Maldições disponíveis para o item (sem repetir e sem elementos opressores)
      cuOpts = it => {
        const k = cuKind(it), h = (it.cur || []).map(mb);
        return !k ? [] : CURSES.filter(d => (d.k == k || (k == 'arma' && d.k == 'corpo' && it.w && it.w.m)) &&
                                         !h.includes(d.n) && (d.el == 'Varia' ? CUEL.some(e => cuElOk(it, e)) : cuElOk(it, d.el)))
      },
      // Ajuste de categoria: a 1ª maldição soma +II, cada uma das seguintes +I
      cuCat = it => (it.cur || []).length ? (it.cur || []).length + 1 : 0,
      cuHas = (it, n) => (it.cur || []).some(m => mb(m) == n),
      // Ícone na frente do nome: ➕ se tem modificação e o emoji do elemento de cada maldição
      cuIcon = it => ((it.mods || []).length ? '➕' : '') +
                     [...new Set((it.cur || []).map(cuEl).filter(e => CUEMO[e]))].map(e => CUEMO[e]).join(''),
      cuNm = it => (cuIcon(it) ? cuIcon(it) + ' ' : '') + it.n;

// Efeitos passivos das maldições do personagem. Bônus de itens amaldiçoados não se acumulam: valem o maior
// de cada tipo (Defesa, resistência, atributo, perícia) e maldições iguais em itens diferentes contam uma vez.
function cfx(c) {
  const r = {def: 0, pv: 0, pe: 0, dt: 0, rd: 0, attr: {}, res: {}, sk: {}}, seen = {},
        up = (o, k, v) => {o[k] = Math.max(o[k] || 0, v)}, inv = c.inv || [], iv = inv.map(x => x.n),
        bs = iv.includes('Proteção pesada') ? 'Proteção pesada' : iv.includes('Proteção leve') ? 'Proteção leve' : '';
  inv.forEach(it => {
    if (!(it.cur || []).length) return;
    // proteções só valem quando são a que está vestida (ou o escudo)
    if (cuKind(it) == 'prot' && it.n != bs && it.n != 'Escudo') return;
    it.cur.forEach(m => {
      const b = mb(m), el = cuEl(m), key = b + '|' + el;
      if (seen[key]) return;
      seen[key] = 1;
      if (b == 'Repulsora' || b == 'Letárgica') up(r, 'def', 2);
      else if (b == 'Cinética') { up(r, 'def', 2); up(r, 'rd', it.n == 'Proteção pesada' ? 5 : 2) }
      else if (b == 'Defesa') up(r, 'def', 5);
      else if (b == 'Profética') up(r.res, 'Conhecimento', 10);
      else if (b == 'Voltaica') up(r.res, 'Energia', 10);
      else if (b == 'Repulsiva') up(r.res, 'Morte', 10);
      else if (b == 'Regenerativa') up(r.res, 'Sangue', 10);
      else if (b == 'Proteção Elemental' && el) up(r.res, el, 10);
      else if (b == 'Escudo Mental') up(r.res, 'Mental', 10);
      else if (b == 'Sombria') up(r.sk, 'Furtividade', 5);
      else if (b == 'Lépida') up(r.sk, 'Atletismo', 10);
      else if (b == 'Carisma') up(r.attr, 'PRE', 1);
      else if (b == 'Sagacidade') up(r.attr, 'INT', 1);
      else if (b == 'Destreza') up(r.attr, 'AGI', 1);
      else if (b == 'Disposição') up(r.attr, 'VIG', 1);
      else if (b == 'Pujança') up(r.attr, 'FOR', 1);
      else if (b == 'Potência') r.dt += 1;
      else if (b == 'Esforço Adicional') r.pe += 5;
      else if (b == 'Vitalidade') r.pv += 15
    })
  });
  // as Defesas de Repulsora/Cinética/Letárgica/Defesa também não se acumulam entre si (já tratado por up)
  return r
}

// Atributos com os bônus das maldições (só para testes, Defesa e DT: não geram PV/PE/perícias extras)
const ea = c => {
  const b = cfx(c).attr;
  return Object.keys(b).length ? Object.fromEntries(Object.entries(c.attr).map(([k, v]) => [k, v + (b[k] || 0)])) : c.attr
};

// Texto do dano extra de maldições (" + 1d8 Sangue")
const wEx = w => ((w && w.ex) || []).map(([d, t]) => ` + ${d} ${t}`).join('');
