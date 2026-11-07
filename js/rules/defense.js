/**
 * Regras: cálculo de Defesa, PV/PE/SAN e deslocamento da ficha (inclui bônus de proteções e poderes).
 */

// Cálculo de Defesa, PV, PE, SAN e deslocamento da ficha
function K(c) {
  const cl = CL[c.classe] || {pv: [0, 0], pe: [0, 0], san: [0, 0], fix: [], per: 0}, v = c.attr, ve = ea(c), cf = cfx(c), n = c.nex,
        lv = n >= 99 ? 20 : n / 5, s = Math.max(0, lv - 1), o = OR.find(x => x[0] == c.origem),
        iv = (c.inv || []).map(x => x.n),
        bs = iv.includes('Proteção pesada') ? 'Proteção pesada' :
    iv.includes('Proteção leve')            ? 'Proteção leve' :
                                              'Nenhuma',
        sh = iv.includes('Escudo') ? 2 : 0, tg = bs == 'Proteção pesada' && hasAb(c, 'Tanque de Guerra'),
        ph = (c.inv || []).find(x => x.n == bs), pm = ((ph && ph.mods) || []).map(mb),
        sd = (c.inv || []).find(x => x.n == 'Escudo'), sm = ((sd && sd.mods) || []).map(mb),
        mdf = (pm.includes('Reforçada') ? 2 : 0) + (sm.includes('Reforçada') ? 2 : 0), pr = {
          d: PR[bs].d + sh + (tg ? 2 : 0) + mdf,
          r: bs == 'Proteção pesada' ?
            'Balístico, Corte, Impacto e Perfuração ' + ((pm.includes('Blindada') ? 5 : 2) + (tg ? 2 : 0)) :
            PR[bs].r,
          n: [bs != 'Nenhuma' ? bs : '', sh ? 'Escudo' : ''].filter(Boolean).join(' + ') || '—'
        };
  // proteção homebrew (it.hp): vale se for melhor que a do livro (só se usa uma proteção)
  const hpb = (c.inv || []).filter(x => x.hp).sort((a, b) => b.hp.d - a.hp.d)[0];
  if (hpb && hpb.hp.d > PR[bs].d) {
    pr.d = hpb.hp.d + sh + mdf;
    pr.r = hpb.hp.r || '';
    pr.n = [hpb.n, sh ? 'Escudo' : ''].filter(Boolean).join(' + ')
  }
  const z = n == 0 ? [8 + v.VIG, 1 + v.PRE, 8] :
                     [
                       cl.pv[0] + v.VIG + s * (cl.pv[1] + v.VIG), cl.pe[0] + v.PRE + s * (cl.pe[1] + v.PRE),
                       cl.san[0] / (c.origem == 'Cultista Arrependido' ? 2 : 1) + s * cl.san[1]
                     ],
        pr_ = Math.max(1, lv), pd = c.origem == 'Policial' ? 2 : 0,
        td = (c.sust || []).reduce((a, x) => a + (x.tdef || 0), 0),
        // Poderes de Morte: Encarar a Morte (+1 PE/rodada; +2 com afinidade) e Potencial Aprimorado (+1 PE por nível; +2 com afinidade)
        afM = c.af == 'Morte', encM = hasAb(c, 'Encarar a Morte') ? (afM ? 2 : 1) : 0,
        potM = hasAb(c, 'Potencial Aprimorado') ? lv * (afM ? 2 : 1) : 0;
  return {
    pv: z[0] + (c.origem == 'Desgarrado' ? lv : 0) + (c.trail == 'Tropa de Choque' && n >= 10 ? lv : 0) +
        (hasAb(c, 'Sangue de Ferro') ? 3 + lv : 0) + cf.pv,
      pe: z[1] + (c.origem == 'Universitário' ? uni(n) : 0) + potM + cf.pe, san: z[2] + (c.origem == 'Vítima' ? lv : 0) - (c.stn || 0),
      rod: pr_ + (c.origem == 'Universitário' ? 1 : 0) + encM,
      // limite de PE por rodada só para rituais (Presença Poderosa soma a Presença)
      rodR: pr_ + (c.origem == 'Universitário' ? 1 : 0) + encM + (hasAb(c, 'Presença Poderosa') ? v.PRE : 0),
      // DT de ritual = 10 + limite de PE por rodada + atributo-base (Presença) (+5 com Rituais Eficientes)
      dt: 10 + pr_ + (c.origem == 'Universitário' ? 1 : 0) + ve.PRE + (hasAb(c, 'Rituais Eficientes') ? 5 : 0) + cf.dt,
      def: 10 + ve.AGI + pr.d + td + pd + (hasAb(c, 'Reflexos Defensivos') ? 2 : 0) + ((c.t && c.t.def) || 0) + cf.def, pdef: pd,
      tdef: td, cf,
      carga: (v.FOR + (hasAb(c, 'Inventário Otimizado') ? v.INT : 0)) ?
      5 * (v.FOR + (hasAb(c, 'Inventário Otimizado') ? v.INT : 0)) :
      2,
      tr: [...(o ? o[1].split(',') : []), ...cl.fix, ...(c.trained || [])],
      auto: [...(o ? o[1].split(',') : []), ...cl.fix], cl, o, pr
  }
}

// Foto do personagem
const ph = c => c.photo ? `<img class=ph src="${c.photo}">` : '<div class=ph>?</div>';

// Itens do menu do Mestre
const MS = [
  'Monstruário (Ameaças)', 'Grimório Paranormal', 'Escudo do Mestre', 'NPCs', 'Inventário de Itens e Armas', 'Homebrew',
  'Criador de Combates', 'Criador de Cenas de Investigação'
];
