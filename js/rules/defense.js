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
  const z = n == 0 ? [8 + v.VIG, 1 + v.PRE, 8] :
                     [
                       cl.pv[0] + v.VIG + s * (cl.pv[1] + v.VIG), cl.pe[0] + v.PRE + s * (cl.pe[1] + v.PRE),
                       cl.san[0] / (c.origem == 'Cultista Arrependido' ? 2 : 1) + s * cl.san[1]
                     ],
        pr_ = Math.max(1, lv), pd = c.origem == 'Policial' ? 2 : 0,
        sus = c.sust || [], td = sus.reduce((a, x) => a + (x.tdef || 0), 0),
        // Armadura de Sangue é cumulativa com outros rituais, mas não com o bônus de equipamento (vale o maior)
        ads = sus.filter(x => x.n == 'Armadura de Sangue').reduce((a, x) => a + (x.tdef || 0), 0),
        eqd = ads ? Math.max(pr.d, ads) - ads : pr.d,
        // Poderes de Morte: Encarar a Morte (+1 PE/rodada; +2 com afinidade) e Potencial Aprimorado (+1 PE por nível; +2 com afinidade)
        afM = c.af == 'Morte', encM = hasAb(c, 'Encarar a Morte') ? (afM ? 2 : 1) : 0,
        potM = hasAb(c, 'Potencial Aprimorado') ? lv * (afM ? 2 : 1) : 0,
        pvM = z[0] + (c.origem == 'Desgarrado' ? lv : 0) + (c.trail == 'Tropa de Choque' && n >= 10 ? lv : 0) +
          (hasAb(c, 'Sangue de Ferro') ? 3 + lv : 0) + cf.pv,
        // Inquebrável (Tropa de Choque): Machucado (metade dos PV ou menos) → +5 Defesa e RD 5
        inq = c.trail == 'Tropa de Choque' && hasAb(c, 'Inquebrável') && c.pv <= Math.floor(pvM / 2) ? 1 : 0;
  return {
    pv: pvM,
      pe: z[1] + (c.origem == 'Universitário' ? uni(n) : 0) + potM + cf.pe,
      san: z[2] + (c.origem == 'Vítima' ? lv : 0) - (c.stn || 0),
      rod: pr_ + (c.origem == 'Universitário' ? 1 : 0) + encM,
      // limite de PE por rodada só para rituais (Presença Poderosa soma a Presença)
      rodR: pr_ + (c.origem == 'Universitário' ? 1 : 0) + encM + (hasAb(c, 'Presença Poderosa') ? v.PRE : 0),
      // DT de ritual = 10 + limite de PE por rodada + atributo-base (Presença) (+5 com Rituais Eficientes)
      dt: 10 + pr_ + (c.origem == 'Universitário' ? 1 : 0) + ve.PRE + (hasAb(c, 'Rituais Eficientes') ? 5 : 0) + cf.dt,
      def: 10 + ve.AGI + eqd + td + pd + (hasAb(c, 'Reflexos Defensivos') ? 2 : 0) + ((c.t && c.t.def) || 0) + cf.def +
        (inq ? 5 : 0),
      pdef: pd, tdef: td, cf, inq, rdx: (cf.rd || 0) + (inq ? 5 : 0), eqd,
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
  'Monstruário (Ameaças)', 'Grimório Paranormal', 'Escudo do Mestre', 'NPCs', 'Inventário de Itens e Armas',
  'Criador de Combates', 'Criador de Cenas de Investigação'
];
