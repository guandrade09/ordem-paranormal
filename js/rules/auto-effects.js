/**
 * Regras: efeitos automáticos de habilidades, poderes e rituais sobre PV, PE, Sanidade e Defesa temporária.
 *
 * - AUT  = habilidades/poderes/origens com botão próprio no card (ver `abc` em abilities.js).
 *          Cada ação: {l: rótulo, pe: custo (número ou função), pv: custo em PV, once: 'sc:chave' (uma vez por cena)
 *          ou 'ss:chave' (por sessão), ok(c,k): texto de bloqueio, run(z,c,k,afinidade): aplica e devolve o aviso,
 *          dmg: pede o dano recebido, q: custo por quantidade}.
 * - RPOST = rituais que, depois de conjurados, abrem uma janela para resolver cura/dano (Hemofagia, Transfusão Vital).
 * - PEND = o que ainda NÃO é automático (regra complexa), mostrado no card como "a ver com mais precisão".
 * Efeitos simples de ritual (Defesa/PV temporários, cura) ficam em EF (effects.js).
 */

// Técnica Medicinal (Agente de Saúde): soma Intelecto aos PV curados
const hbon = c => c.origem == 'Agente de Saúde' ? ea(c).INT : 0,
      machuc = (c, k) => c.pv <= Math.floor(k.pv / 2),
      aflag = (c, key) => !!(((key || '').startsWith('ss:') ? c.ss : c.sc) || {})[(key || '').slice(3)],
      aset = (z, key) => {
        if (!key) return;
        let o = key.startsWith('ss:') ? (z.ss = z.ss || {}) : (z.sc = z.sc || {});
        o[key.slice(3)] = 1
      },
      // dano: PV temporários absorvem primeiro
      takePV = (z, n) => {
        let t = Math.min(z.t.pv || 0, n);
        z.t.pv = (z.t.pv || 0) - t;
        z.pv = Math.max(0, z.pv - (n - t))
      },
      // efeito que fica ativo na ficha (aparece na Defesa e pode ser encerrado tocando nele)
      putSust = (z, id, n, el, o) => {
        z.sust = (z.sust || []).filter(q => q.id != id);
        z.sust.push({id, n, el, tdef: 0, tpv: 0, ...o})
      },
      // Resgate (Médico de Campo): ao curar PV ou remover condição de aliado, você e ele recebem +5 Defesa
      resg = (z, c) => hasAb(c, 'Resgate') ?
        (putSust(z, 'ab|Resgate', 'Resgate', 'Sangue', {tdef: 5, cena: 1}), ' · +5 Defesa (Resgate)') :
        '';

const AUT = {
  'Sentido Tático': [{
    l: 'Analisar o ambiente', pe: 2, run: (z, c) => {
      let n = ea(c).INT;
      putSust(z, 'ab|Sentido Tático', 'Sentido Tático', 'Conhecimento', {tdef: n, cena: 1});
      return `+${n} Defesa (e em resistência) até o fim da cena`
    }
  }],
  'Equipe de Trauma': [{
    l: 'Remover condição de aliado', pe: 2, run: (z, c) => 'condição removida do aliado (aplique no alvo)' + resg(z, c)
  }],
  'Absorver Agonia': [1, 2, 3, 4].map(n => ({
    l: `Ritual de ${n}º círculo reduziu inimigo a 0 PV`,
    run: z => {
      z.t.pe = (z.t.pe || 0) + n;
      return `+${n} PE temporários`
    }
  })),
  'Gladiador Paranormal': [{
    l: 'Acertei ataque corpo a corpo (+2 PE temporários)',
    ok: (c, k) => ((c.sc || {}).gp || 0) >= k.rod ? `Limite da cena atingido: ${k.rod} PE temporários (limite de PE por rodada).` : '',
    run: (z, c, k) => {
      z.sc = z.sc || {};
      let g = Math.min(2, k.rod - (z.sc.gp || 0));
      z.sc.gp = (z.sc.gp || 0) + g;
      z.t.pe = (z.t.pe || 0) + g;
      return `+${g} PE temporários (${z.sc.gp}/${k.rod} nesta cena)`
    }
  }],
  'Potencial Reaproveitado': [{
    l: 'Venci um teste de resistência', run: (z, c, k, aff) => {
      let n = aff ? 2 : 1;
      z.t.pe = (z.t.pe || 0) + n;
      return `+${n} PE temporário${n > 1 ? 's' : ''} (expira no fim da cena)`
    }
  }],
  'Escapar da Morte': [{
    l: 'Escapar da queda a 0 PV', once: 'sc:escapar', run: (z, c, k, aff) => {
      z.pv = Math.max(1, z.pv);
      return aff ? 'o dano é evitado: use ↶ Desfazer no último dano (contra dano massivo, fica com 1 PV)' :
                   'fica com 1 PV (não vale contra dano massivo)'
    }
  }],
  'Arma de Sangue': [
    {l: 'Criar arma de sangue', pv: 2, run: () => 'arma corporal leve criada até o fim da cena'},
    {l: 'Ataque adicional com a arma', pe: 1, run: () => 'ataque corpo a corpo adicional'}
  ],
  'Sangue Vivo': [{
    l: 'Cura Acelerada (início do turno)',
    ok: (c, k) => {
      let h = Math.floor(k.pv / 2);
      return c.pv > h ? 'Só vale enquanto estiver Machucado (metade dos PV ou menos).' :
             c.pv >= h ? `A regeneração não passa de metade dos PV máximos (${h}).` : ''
    },
    run: (z, c, k, aff) => {
      let n = aff ? 5 : 2, g = Math.min(n, Math.floor(k.pv / 2) - z.pv);
      z.pv += g;
      return `+${g} PV (Cura Acelerada ${n})`
    }
  }],
  'Duro de Matar': [{l: 'Reduzir o dano à metade', pe: 2, dmg: 1, par: c => c.nex >= 85}],
  'Abraçar a Dor': [{l: 'Reduzir o dano não paranormal à metade', pe: 2, dmg: 1}],
  'Acalentar': [{
    l: 'Acalmar pessoa (1d6 + Presença)', run: (z, c) => `a pessoa recupera ${rl('1d6') + ea(c).PRE} de Sanidade (aplique no alvo)`
  }],
  'Vislumbres do Passado': [{
    l: 'Passei no teste (1d4 PE temporários)', once: 'ss:vislumbres', run: z => {
      let n = rl('1d4');
      z.t.pe = (z.t.pe || 0) + n;
      return `+${n} PE temporários`
    }
  }],
  // custo em PE por quantidade
  'Estrategista': [{
    l: 'Escolher aliados', q: {u: 'aliados', per: 1, base: 0, min: 1, max: (c) => Math.max(1, ea(c).INT)},
    run: () => 'cada aliado ganha uma ação de movimento no próximo turno dele'
  }],
  'Eloquência': [{
    l: 'Escolher alvos', q: {u: 'alvos', per: 1, base: 0, min: 1, max: () => 10},
    run: () => 'faça o teste contra a Vontade dos alvos'
  }],
  'Improvisar': [{
    l: 'Criar equipamento', q: {u: 'categoria do item', per: 2, base: 2, min: 0, max: () => 4},
    run: () => 'equipamento improvisado até o fim da cena'
  }],
  'Preparado para Tudo': [{
    l: 'Declarar item guardado', q: {u: 'categoria do item', per: 3, base: 0, min: 1, max: () => 4},
    run: () => 'o item estava na bolsa'
  }]
};

// Regras complexas que ainda não são automáticas (a ver com mais precisão)
const PEND = {
  'Reanimação': 'O app desconta os 10 PE; a volta do alvo (PV, condições) fica com o Mestre.',
  'Truque de Mestre': 'O custo é o da habilidade copiada, que varia: o app desconta só os 5 PE.',
  'Anular Ritual': 'O custo em PE é igual ao que o conjurador gastou: ajuste o PE manualmente.',
  'Ampliar Ritual': 'O custo extra (+2 PE) não é somado ao ritual automaticamente: ajuste o PE manualmente.',
  'Acelerar Ritual': 'O custo extra (+4 PE) não é somado ao ritual automaticamente: ajuste o PE manualmente.',
  'Contato Paranormal': 'A perda de Sanidade a cada 6 (2 PS) / 8 (3 PS) / 12 (5 PS) nos dados de auxílio ainda não é automática: desconte manualmente.',
  'Consumir Manancial': 'Na versão Verdadeira os PV temporários são iguais ao dano total causado: some manualmente.',
  'Canalizar o Medo': 'A penalidade de PE (custo do ritual transferido) até o alvo conjurar não é automática.',
  'Medo Tangível': 'O piso de 1 PV contra dano físico não é automático.',
  'Cinerária': 'A mudança de custo (PE) dos rituais dentro da névoa não é automática.',
  'Rejeitar Névoa': 'A mudança de custo (PE) dos rituais dentro da névoa não é automática.',
  'Tela de Ruído': 'Os PV temporários valem só contra balístico, corte, impacto e perfuração; a reação (resistência 15/30) não é automática.',
  'Armadura de Sangue': 'A resistência a dano (5/10) das versões maiores não é controlada pelo app.',
  'Salto Fantasma': 'O +10 em Defesa da versão Discente vale só contra um ataque: aplique manualmente.',
  'Hemofagia': 'Na versão Verdadeira, repita o toque a cada rodada pelo botão da janela de resultado.'
};
const pendBox = n => PEND[n] ?
  `<div class=card style="margin:8px 0;border:1px dashed #ff9f1a"><small>📝 <b>Cálculo automático pendente:</b> ${PEND[n]}</small></div>` :
  '';

// ----- botões do card da habilidade -----
const apeOf = (A, c, k) => typeof A.pe == 'function' ? A.pe(c, k) : (A.pe || 0),
      autoBtns = (c, k, n, i) => (AUT[n] || [])
        .map((A, j) => {
          let pe = apeOf(A, c, k), used = A.once && aflag(c, A.once);
          return `<button class=btn style="width:100%;font-size:20px;margin-top:6px${used ? ';opacity:.5' : ''}" onclick="autoGo(${
            i},${j})">${A.l}${A.q ? ' · PE variável' : pe ? ' · ' + pe + ' PE' : ''}${A.pv ? ' · ' + A.pv + ' PV' : ''}${
            used ? ' (já usado)' : ''}</button>`
        })
        .join('');

function autoGo(i, j, qt) {
  let c = cur(), k = K(c), p = abl(c, k)[i], A = AUT[p[0]][j], aff = !!(p[5] && c.af == p[5][1]), pe = apeOf(A, c, k);
  if (A.q && qt == null) return qtyAsk(i, j);
  if (A.q) pe = A.q.base + A.q.per * qt;
  let m = A.ok && A.ok(c, k);
  if (m) return toast(m);
  if (A.once && aflag(c, A.once)) return toast('Já usado: libere em "Fim da cena / nova sessão".');
  if (pe > k.rod) return toast(`⚠ Custo de ${pe} PE acima do limite de ${k.rod} PE por rodada (NEX ${c.nex}%).`);
  if (c.pe < pe) return toast('PE insuficiente');
  if (A.pv && c.pv <= A.pv) return toast('PV insuficiente');
  if (A.dmg) return dmgAsk(i, j);
  cm();
  fx('ico', ICO[p[0]] || '✨');
  let r = '';
  mut(z => {
    z.pe -= pe;
    if (A.pv) z.pv -= A.pv;
    aset(z, A.once);
    r = A.run(z, c, k, aff) || ''
  });
  toast(p[0] + (pe ? ` · −${pe} PE` : '') + (A.pv ? ` · −${A.pv} PV` : '') + (r ? ' · ' + r : ''))
}

// pergunta a quantidade (aliados, alvos, categoria) e calcula o custo
function qtyAsk(i, j) {
  let c = cur(), k = K(c), p = abl(c, k)[i], Q = AUT[p[0]][j].q, mx = Q.max(c, k);
  modal(`<button class=xc onclick="cm()">✕</button><div class=ahd><b style="font:26px 'Bebas Neue'">${p[0]}</b><b class=pec>${
    Q.base ? Q.base + ' + ' : ''}${Q.per} PE por ${Q.u}</b></div><p>${md(p[3])}</p><small>Quantidade (${Q.u}, ${Q.min} a ${
    mx}):</small><input id=aqt type=number min=${Q.min} max=${mx} value=${Q.min}><button class=btn style="width:100%;font-size:24px;margin-top:8px" onclick="qtyGo(${
    i},${j})">Usar</button>`)
}
function qtyGo(i, j) {
  let c = cur(), k = K(c), p = abl(c, k)[i], Q = AUT[p[0]][j].q, mx = Q.max(c, k),
      n = Math.floor(+$('#aqt').value);
  if (!(n >= Q.min && n <= mx)) return toast(`Digite de ${Q.min} a ${mx}.`);
  autoGo(i, j, n)
}

// pergunta o dano recebido (Duro de Matar, Abraçar a Dor)
function dmgAsk(i, j) {
  let c = cur(), k = K(c), p = abl(c, k)[i], A = AUT[p[0]][j];
  modal(`<button class=xc onclick="cm()">✕</button><div class=ahd><b style="font:26px 'Bebas Neue'">${p[0]}</b><b class=pec>${
    apeOf(A, c, k)} PE</b></div><p>${md(p[3])}</p><small>Dano recebido (antes da redução):</small><input id=adm type=number min=0 placeholder="dano"><button class=btn style="width:100%;font-size:20px;margin-top:8px" onclick="dmgGo(${
    i},${j},0)">${A.par ? 'Dano não paranormal' : 'Reduzir à metade'}</button>${
    A.par && A.par(c) ? `<button class=btn style="width:100%;font-size:20px;margin-top:6px" onclick="dmgGo(${
                          i},${j},1)">Dano paranormal</button>` :
                        ''}`)
}
function dmgGo(i, j, par) {
  let c = cur(), k = K(c), p = abl(c, k)[i], A = AUT[p[0]][j], d = Math.max(0, Math.floor(+$('#adm').value || 0)),
      pe = apeOf(A, c, k), h = Math.floor(d / 2);
  if (!d) return toast('Digite o dano recebido.');
  if (par && !(A.par && A.par(c))) return;
  cm();
  fx('ico', ICO[p[0]] || '✨');
  mut(z => {
    z.pe -= pe;
    takePV(z, h)
  });
  toast(`${p[0]}: dano ${d} → ${h} · −${pe} PE · −${h} PV`)
}

// ----- fim da cena / nova sessão -----
function sceneModal() {
  modal(`<button class=xc onclick="cm()">✕</button><b>Fim da cena / nova sessão</b><p><small><b>Fim da cena:</b> zera os PV e PE temporários, encerra os efeitos de duração “cena” (Defesa temporária de rituais e habilidades) e libera os usos “uma vez por cena”.<br><b>Nova sessão:</b> faz o mesmo e libera também os usos “uma vez por sessão”.</small></p><button class=btn style="width:100%;font-size:22px" onclick="fimCena(0)">🎬 Fim da cena</button><button style="width:100%;margin-top:6px" onclick="fimCena(1)">📅 Nova sessão</button>`)
}
function fimCena(ss) {
  cm();
  mut(z => {
    z.t.pv = 0;
    z.t.pe = 0;
    z.sust = (z.sust || []).filter(q => !(q.cena || (INFO[(q.id || '').split('|')[0]] || [])[3] == 'cena'));
    z.sc = {};
    if (ss) z.ss = {}
  });
  toast(ss ? 'Nova sessão: usos liberados.' : 'Fim da cena: temporários zerados e usos liberados.')
}

// Embaralhar: cada ataque que erra apaga uma cópia e reduz o bônus
function sdec(i) {
  mut(z => {
    let q = (z.sust || [])[i];
    if (!q) return;
    q.tdef = Math.max(0, (q.tdef || 0) - (q.dec || 0));
    if (!q.tdef) z.sust.splice(i, 1)
  })
}

// ----- rituais: resolução depois de conjurar -----
const healMe = h => {
  cm();
  mut(z => {z.pv = Math.min(K(z).pv, z.pv + h)});
  toast(`+${h} PV`)
};
function healAsk(nm, h) {
  modal(`<button class=xc onclick="cm()">✕</button><b>${nm}</b><p>O alvo recupera <b class=nm>${h} PV</b>.</p><button class=btn style="width:100%;font-size:22px" onclick="healMe(${
    h})">Aplicar em mim (+${h} PV)</button><button style="width:100%;margin-top:6px" onclick="cm()">Foi em outra pessoa</button>`)
}

// Hemofagia: dano de Sangue e você recupera metade do dano causado
function hemoRoll(j) {
  let c = cur(), d = rl(j == 2 ? '4d6' : '6d6') + (RPT(c, 'Hemofagia', j) == 'dano' ? c.attr.INT : 0);
  S.hem = {j, d};
  hemoModal()
}
function hemoModal() {
  let c = cur(), {j, d} = S.hem, pv = f => `<b class=nm>${f} PV</b>`;
  modal(`<button class=xc onclick="cm()">✕</button><b>Hemofagia</b> <small>${['Normal', 'Discente', 'Verdadeiro'][j]}</small><p>Dano de Sangue rolado: <b class=nm>${
    d}</b></p>${
    j == 0 ? `<button class=btn style="width:100%;margin-top:6px" onclick="hemoGo(${d})">Alvo falhou na resistência: dano ${
               d}, recupera ${pv(Math.floor(d / 2))}</button><button class=btn style="width:100%;margin-top:6px" onclick="hemoGo(${
               Math.floor(d / 2)})">Alvo passou (metade): dano ${Math.floor(d / 2)}, recupera ${
               pv(Math.floor(d / 4))}</button>` :
    j == 1 ? `<small>Some o dano do ataque corpo a corpo (se acertou):</small><input id=hat type=number min=0 value=0><button class=btn style="width:100%;margin-top:6px" onclick="hemoGo(${
               d} + (Math.max(0, Math.floor(+$('#hat').value || 0))))">Recuperar metade do dano total</button>` :
             `<button class=btn style="width:100%;margin-top:6px" onclick="hemoGo(${d})">Tocar 1 ser: recupera ${
               pv(Math.floor(d / 2))}</button><button style="width:100%;margin-top:6px" onclick="hemoRoll(2)">Outra rodada (rolar 4d6 de novo)</button>`}`)
}
function hemoGo(dano) {
  let h = Math.floor(dano / 2);
  if (S.hem && S.hem.j == 2) {
    mut(z => {z.pv = Math.min(K(z).pv, z.pv + h)});
    toast(`Hemofagia: dano ${dano} · +${h} PV`);
    return hemoModal()
  }
  cm();
  mut(z => {z.pv = Math.min(K(z).pv, z.pv + h)});
  toast(`Hemofagia: dano ${dano} · +${h} PV`)
}

// Transfusão Vital: você sofre dano de Sangue e o alvo recupera a mesma quantidade
function tvAsk(j) {
  let c = cur(), mx = [30, 50, 100][j], lim = Math.max(0, Math.min(mx, c.pv + (c.t.pv || 0) - 1));
  modal(`<button class=xc onclick="cm()">✕</button><b>Transfusão Vital</b><p><small>Você sofre dano de Sangue e o alvo recupera a mesma quantidade em PV (até ${
    mx}). Você não pode ficar com menos de 1 PV: máximo agora <b>${lim}</b>.</small></p><input id=tvn type=number min=1 max=${
    lim} placeholder="PV a transferir"><button class=btn style="width:100%;margin-top:8px" onclick="tvGo(${lim})">Transferir</button>`)
}
function tvGo(lim) {
  let n = Math.floor(+$('#tvn').value || 0), c = cur();
  if (!(n >= 1 && n <= lim)) return toast(`Digite de 1 a ${lim}.`);
  cm();
  mut(z => {takePV(z, n)});
  toast(`Transfusão Vital: −${n} PV · o alvo recupera ${n + hbon(c)} PV${hbon(c) ? ` (${n} + ${hbon(c)} Técnica Medicinal)` : ''}`)
}

const RPOST = {
  'Hemofagia': (id, j) => hemoRoll(j),
  'Transfusão Vital': (id, j) => tvAsk(j)
};
