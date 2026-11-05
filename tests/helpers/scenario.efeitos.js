// Roda DENTRO do app. Efeitos automáticos de habilidades, poderes e rituais sobre PV, PE, Sanidade e Defesa temporária.
// Retorna uma lista de {g: grupo, n: nome do teste, ok, d: detalhe}.
(function () {
  const R_ = [];
  const J = (x) => JSON.stringify(x);
  const T = (g, n, got, want) => { const ok = J(got) === J(want); R_.push({ g, n, ok, d: ok ? J(got) : 'obtido ' + J(got) + ' ≠ esperado ' + J(want) }); };
  const B = (g, n, ok, d) => R_.push({ g, n, ok: !!ok, d: d || '' });
  const safe = (g, n, fn) => { try { fn(); } catch (e) { R_.push({ g, n, ok: false, d: 'ERRO: ' + e.message }); } };
  const AT = (a) => Object.assign({ AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 1 }, a || {});
  let uid = 0;
  const mk = (cl, nex, attr, o) => {
    o = o || {};
    newC(); const d = S.d;
    d.id = 3e6 + ++uid; d.name = 'Efeitos ' + uid; d.classe = cl; d.origem = 2; d.nex = nex; d.attr = AT(attr);
    fin(); const c = cur(); S.cid = c.id; c.inv = []; c.ab = c.ab || []; c.sust = []; c.rit = c.rit || [];
    if (o.origem) c.origem = o.origem;
    if (o.trail) c.trail = o.trail;
    if (o.af) c.af = o.af;
    (o.ab || []).forEach((n) => c.ab.push(typeof n == 'string' ? { n, t: 'x', pw: 1 } : n));
    c.pv = K(c).pv; c.pe = K(c).pe; c.t = { pv: 0, pe: 0, san: 0, def: 0 };
    return c;
  };
  const tst = () => document.querySelector('#t').textContent;
  const clr = () => { document.querySelector('#t').textContent = ''; };
  const modalHtml = () => document.querySelector('#m').innerHTML;
  const idx = (c, n) => abl(c, K(c)).findIndex((p) => p[0] == n);
  const bad = (h) => /undefined|NaN|\[object/.test(h);
  const go = (c, n, j) => { clr(); autoGo(idx(c, n), j || 0); return tst(); };
  const setIn = (sel, v) => { document.querySelector(sel).value = String(v); };

  // ===== A. Passivos que mexem em PE / PV / Defesa =====
  const GA = 'A. Passivos (PE, PV e Defesa)';
  safe(GA, 'Potencial Aprimorado e Encarar a Morte', () => {
    const base = mk('Ocultista', 30, {}); const pe0 = K(base).pe, r0 = K(base).rod, rr0 = K(base).rodR;
    const c = mk('Ocultista', 30, {}, { ab: [{ n: 'Potencial Aprimorado', t: 'x', pw: 1, el: 'Morte' }, { n: 'Encarar a Morte', t: 'x', pw: 1, el: 'Morte' }] });
    T(GA, 'Potencial Aprimorado: NEX 30% (nível 6) = +6 PE (exemplo do livro)', K(c).pe - pe0, 6);
    T(GA, 'Encarar a Morte: +1 no limite de PE por rodada (ações e rituais)', [K(c).rod - r0, K(c).rodR - rr0], [1, 1]);
    c.af = 'Morte';
    T(GA, 'com afinidade com Morte: +2 PE por nível (+12) e +2 no limite por rodada', [K(c).pe - pe0, K(c).rod - r0], [12, 2]);
    c.af = 'Sangue';
    T(GA, 'afinidade de outro elemento não conta', K(c).pe - pe0, 6);
    const c99 = mk('Ocultista', 99, {}, { ab: [{ n: 'Potencial Aprimorado', t: 'x', pw: 1, el: 'Morte' }] });
    const b99 = mk('Ocultista', 99, {});
    T(GA, 'NEX 99% = nível 20 = +20 PE', K(c99).pe - K(b99).pe, 20);
  });
  safe(GA, 'Inquebrável (Tropa de Choque): Machucado = +5 Defesa e RD 5', () => {
    const c = mk('Combatente', 65, { VIG: 3 }, { trail: 'Tropa de Choque', ab: ['Inquebrável'] });
    const k = K(c); c.pv = k.pv; const d0 = K(c).def;
    T(GA, 'com PV cheios não ativa', [K(c).inq, K(c).rdx], [0, 0]);
    c.pv = Math.floor(k.pv / 2);
    T(GA, 'com metade dos PV (Machucado) ativa: +5 Defesa e RD 5', [K(c).def - d0, K(c).inq, K(c).rdx], [5, 1, 5]);
    c.pv = Math.floor(k.pv / 2) + 1;
    T(GA, 'um PV acima da metade já não ativa', K(c).inq, 0);
    c.pv = Math.floor(k.pv / 2);
    S.cid = c.id; S.tab = 0; const h = sheet();
    B(GA, 'a ficha mostra o aviso e “Dano 5” nas resistências, sem undefined/NaN', /Inquebrável: \+5 Defesa e RD 5/.test(h) && /Dano 5/.test(h) && !bad(h));
  });
  safe(GA, 'Armadura de Sangue não soma com bônus de equipamento (vale o maior)', () => {
    const c = mk('Combatente', 30, {}); c.inv.push({ n: 'Proteção pesada', cat: 2, e: 5, w: null, am: 0, ds: '' });
    const eq = K(c).pr.d, d0 = K(c).def;
    c.sust = [{ id: 'Armadura de Sangue', n: 'Armadura de Sangue', el: 'Sangue', tdef: 5, tpv: 0 }];
    T(GA, 'equip. ' + eq + ' e ritual +5: soma só o maior (Defesa não passa de ' + d0 + ')', K(c).def, d0 + Math.max(0, 5 - eq));
    c.sust[0].tdef = 15;
    T(GA, 'ritual +15 > equipamento: Defesa = base + 15', K(c).def, d0 - eq + 15);
    c.sust.push({ id: 'Embaralhar', n: 'Embaralhar', el: 'Energia', tdef: 6, tpv: 0 });
    T(GA, 'outros rituais continuam somando (+6 de Embaralhar)', K(c).def, d0 - eq + 15 + 6);
  });

  // ===== B. Habilidades e poderes (botões automáticos) =====
  const GB = 'B. Habilidades e poderes';
  safe(GB, 'Sentido Tático', () => {
    const c = mk('Combatente', 30, { INT: 3 }, { ab: ['Sentido Tático'] }); const d0 = K(c).def, pe0 = c.pe;
    const m = go(c, 'Sentido Tático');
    T(GB, 'Sentido Tático: −2 PE e +INT (3) em Defesa até o fim da cena', [pe0 - c.pe, K(c).def - d0, c.sust.length, c.sust[0].cena], [2, 3, 1, 1]);
    B(GB, 'aviso na tela', /Sentido Tático/.test(m) && /\+3 Defesa/.test(m), m);
  });
  safe(GB, 'Absorver Agonia', () => {
    const c = mk('Ocultista', 30, {}, { trail: 'Flagelador', ab: ['Absorver Agonia'] });
    [0, 1, 2, 3].forEach((j) => go(c, 'Absorver Agonia', j));
    T(GB, 'PE temporários = círculo do ritual (1+2+3+4 = 10), sem gastar PE', [c.t.pe, c.pe === K(c).pe], [10, true]);
  });
  safe(GB, 'Gladiador Paranormal', () => {
    const c = mk('Ocultista', 5, {}, { trail: 'Lâmina Paranormal', ab: ['Gladiador Paranormal'] }); const rod = K(c).rod;
    const seq = []; for (let i = 0; i < 4; i++) { go(c, 'Gladiador Paranormal'); seq.push(c.t.pe); }
    T(GB, 'ganha +2 PE temporários por acerto, parando no limite de PE por rodada (' + rod + ')', seq, [Math.min(2, rod), Math.min(4, rod), Math.min(6, rod), Math.min(8, rod)]);
    const m = go(c, 'Gladiador Paranormal');
    B(GB, 'depois do limite avisa e não ganha mais', c.t.pe === rod && /Limite da cena/.test(m), m);
    fimCena(0);
    T(GB, 'Fim da cena zera os temporários e libera o contador', [c.t.pe, (c.sc || {}).gp || 0], [0, 0]);
  });
  safe(GB, 'Potencial Reaproveitado', () => {
    const c = mk('Ocultista', 30, {}, { ab: [{ n: 'Potencial Reaproveitado', t: 'x', pw: 1, el: 'Morte' }] });
    go(c, 'Potencial Reaproveitado'); T(GB, '+1 PE temporário', c.t.pe, 1);
    c.af = 'Morte'; go(c, 'Potencial Reaproveitado'); T(GB, 'com afinidade +2 PE temporários (total 3)', c.t.pe, 3);
  });
  safe(GB, 'Escapar da Morte', () => {
    const c = mk('Combatente', 30, {}, { ab: [{ n: 'Escapar da Morte', t: 'x', pw: 1, el: 'Morte' }] });
    c.pv = 0; go(c, 'Escapar da Morte');
    T(GB, 'a 0 PV fica com 1 PV', c.pv, 1);
    c.pv = 0; const m = go(c, 'Escapar da Morte');
    B(GB, 'só uma vez por cena', c.pv === 0 && /Já usado/.test(m), m);
    fimCena(0); c.pv = 0; go(c, 'Escapar da Morte'); T(GB, 'Fim da cena libera de novo', c.pv, 1);
  });
  safe(GB, 'Arma de Sangue', () => {
    const c = mk('Combatente', 30, {}, { ab: [{ n: 'Arma de Sangue', t: 'x', pw: 1, el: 'Sangue' }] }); const pv0 = c.pv, pe0 = c.pe;
    go(c, 'Arma de Sangue', 0); T(GB, 'criar a arma custa 2 PV (e nenhum PE)', [pv0 - c.pv, pe0 - c.pe], [2, 0]);
    go(c, 'Arma de Sangue', 1); T(GB, 'ataque adicional custa 1 PE', pe0 - c.pe, 1);
    c.pv = 2; const m = go(c, 'Arma de Sangue', 0); B(GB, 'PV insuficiente é recusado', c.pv === 2 && /PV insuficiente/.test(m), m);
  });
  safe(GB, 'Sangue Vivo (Cura Acelerada)', () => {
    const c = mk('Combatente', 30, { VIG: 3 }, { ab: [{ n: 'Sangue Vivo', t: 'x', pw: 1, el: 'Sangue' }] }); const max = K(c).pv, half = Math.floor(max / 2);
    c.pv = max; let m = go(c, 'Sangue Vivo'); B(GB, 'com PV cheios (não Machucado) não funciona', c.pv === max && /Machucado/.test(m), m);
    c.pv = 5; go(c, 'Sangue Vivo'); T(GB, 'Machucado: +2 PV', c.pv, 7);
    c.af = 'Sangue'; go(c, 'Sangue Vivo'); T(GB, 'com afinidade: +5 PV', c.pv, 12);
    c.pv = half - 1; go(c, 'Sangue Vivo'); T(GB, 'a regeneração para na metade dos PV máximos (' + half + ')', c.pv, half);
    m = go(c, 'Sangue Vivo'); B(GB, 'na metade avisa que chegou ao limite', c.pv === half && /não passa de metade/.test(m), m);
  });
  safe(GB, 'Duro de Matar e Abraçar a Dor (reduzir dano à metade)', () => {
    const c = mk('Combatente', 65, { VIG: 3 }, { trail: 'Tropa de Choque', ab: ['Duro de Matar'] }); const pv0 = c.pv, pe0 = c.pe;
    go(c, 'Duro de Matar'); setIn('#adm', 25); dmgGo(idx(c, 'Duro de Matar'), 0, 0);
    T(GB, 'Duro de Matar: dano 25 vira 12 (−2 PE, −12 PV)', [pe0 - c.pe, pv0 - c.pv], [2, 12]);
    c.t.pv = 5; c.pv = pv0; setIn('#adm', 30); dmgGo(idx(c, 'Duro de Matar'), 0, 0);
    T(GB, 'PV temporários absorvem primeiro (dano 30 → 15; 5 temp + 10 PV)', [c.t.pv, pv0 - c.pv], [0, 10]);
    setIn('#adm', 10); const antes = c.pe; dmgGo(idx(c, 'Duro de Matar'), 0, 1);
    B(GB, 'dano paranormal só com NEX 85% (aqui 65%: recusado)', c.pe === antes);
    const c85 = mk('Combatente', 85, { VIG: 3 }, { trail: 'Tropa de Choque', ab: ['Duro de Matar'] }); const p85 = c85.pv;
    go(c85, 'Duro de Matar'); B(GB, 'em NEX 85% a janela oferece “Dano paranormal”', /Dano paranormal/.test(modalHtml()));
    setIn('#adm', 20); dmgGo(idx(c85, 'Duro de Matar'), 0, 1); T(GB, 'dano paranormal 20 → 10', p85 - c85.pv, 10);
    const o = mk('Ocultista', 30, { VIG: 2 }, { trail: 'Flagelador', ab: ['Abraçar a Dor'] }); const po = o.pv, eo = o.pe;
    go(o, 'Abraçar a Dor'); setIn('#adm', 9); dmgGo(idx(o, 'Abraçar a Dor'), 0, 0);
    T(GB, 'Abraçar a Dor: dano 9 → 4 (arredonda para baixo), −2 PE', [eo - o.pe, po - o.pv], [2, 4]);
    setIn('#adm', 0); const e1 = o.pe; dmgGo(idx(o, 'Abraçar a Dor'), 0, 0); B(GB, 'sem dano digitado não gasta PE', o.pe === e1);
  });
  safe(GB, 'Equipe de Trauma, Resgate e Paramédico (Técnica Medicinal)', () => {
    const c = mk('Especialista', 40, { INT: 3 }, { trail: 'Médico de Campo', ab: ['Equipe de Trauma', 'Resgate', 'Paramédico'] }); const pe0 = c.pe, d0 = K(c).def;
    go(c, 'Equipe de Trauma'); T(GB, 'Equipe de Trauma: −2 PE e, com Resgate, +5 Defesa', [pe0 - c.pe, K(c).def - d0], [2, 5]);
    fimCena(0); T(GB, 'Fim da cena encerra o +5 de Resgate', K(c).def, d0);
    const sem = mk('Especialista', 40, { INT: 3 }, { trail: 'Médico de Campo', ab: ['Equipe de Trauma'] }); const ds = K(sem).def;
    go(sem, 'Equipe de Trauma'); T(GB, 'sem Resgate não ganha Defesa', K(sem).def, ds);
    const ag = mk('Especialista', 40, { INT: 3 }, { origem: 'Agente de Saúde', trail: 'Médico de Campo', ab: ['Paramédico'] });
    S.opt = { i: idx(ag, 'Paramédico'), s: 0 }; clr(); optUse(idx(ag, 'Paramédico'));
    const mm = /recupera (\d+) PV/.exec(tst()); const h = mm ? +mm[1] : -1;
    B(GB, 'Paramédico 2d10 + INT (Técnica Medicinal): resultado entre 5 e 23', h >= 2 + 3 && h <= 20 + 3, tst());
    B(GB, 'o aviso cita a Técnica Medicinal e gasta 2 PE', /Técnica Medicinal/.test(tst()) && ag.pe === K(ag).pe - 2, tst());
  });
  safe(GB, 'Acalentar (Religioso) e Vislumbres do Passado (Amnésico)', () => {
    const r = mk('Combatente', 5, { PRE: 3 }, { origem: 'Religioso' });
    const m = go(r, 'Acalentar'); const v = +(/recupera (\d+) de Sanidade/.exec(m) || [])[1];
    B(GB, 'Acalentar: 1d6 + Presença (3) = 4 a 9 de Sanidade para a pessoa', v >= 4 && v <= 9, m);
    const a = mk('Combatente', 5, {}, { origem: 'Amnésico' });
    go(a, 'Vislumbres do Passado'); const t1 = a.t.pe; B(GB, 'Vislumbres: 1d4 PE temporários', t1 >= 1 && t1 <= 4, t1);
    const m2 = go(a, 'Vislumbres do Passado'); B(GB, 'só uma vez por sessão', a.t.pe === t1 && /Já usado/.test(m2), m2);
    fimCena(0);
    B(GB, 'Fim da cena zerou os temporários e o uso por sessão continua bloqueado', (a.ss || {}).vislumbres === 1);
    fimCena(1); T(GB, 'Nova sessão libera', (a.ss || {}).vislumbres || 0, 0);
  });
  safe(GB, 'Custo de PE por quantidade (Estrategista, Eloquência, Improvisar, Preparado para Tudo)', () => {
    const c = mk('Especialista', 99, { INT: 3 }, { ab: ['Estrategista', 'Eloquência', 'Improvisar', 'Preparado para Tudo'] });
    const q = (n, j, v) => { const pe0 = c.pe; clr(); autoGo(idx(c, n), j, v); return pe0 - c.pe; };
    T(GB, 'Estrategista: 1 PE por aliado (3 aliados = 3 PE)', q('Estrategista', 0, 3), 3);
    T(GB, 'Eloquência: 1 PE por alvo (2 = 2 PE)', q('Eloquência', 0, 2), 2);
    T(GB, 'Improvisar: 2 PE + 2 por categoria (cat. 2 = 6 PE)', q('Improvisar', 0, 2), 6);
    T(GB, 'Preparado para Tudo: 3 PE por categoria (cat. 3 = 9 PE)', q('Preparado para Tudo', 0, 3), 9);
    const lim = K(c).rod; clr(); const pe0 = c.pe; autoGo(idx(c, 'Preparado para Tudo'), 0, 4);
    B(GB, 'respeita o limite de PE por rodada (' + lim + ')', (12 > lim) ? c.pe === pe0 && /limite/.test(tst()) : c.pe === pe0 - 12, tst());
    qtyAsk(idx(c, 'Estrategista'), 0); B(GB, 'a janela de quantidade desenha sem undefined', !bad(modalHtml()) && /aliados/.test(modalHtml()));
  });
  safe(GB, 'regras gerais dos botões', () => {
    const c = mk('Combatente', 30, { INT: 2 }, { ab: ['Sentido Tático'] }); c.pe = 1;
    const m = go(c, 'Sentido Tático'); B(GB, 'PE insuficiente é recusado e nada muda', c.pe === 1 && c.sust.length === 0 && /PE insuficiente/.test(m), m);
    const c5 = mk('Combatente', 5, { INT: 2 }, { ab: [{ n: 'Improvisar', t: 'x' }] }); const m2 = (clr(), autoGo(idx(c5, 'Improvisar'), 0, 4), tst());
    B(GB, 'custo acima do limite por rodada é recusado', /limite/.test(m2), m2);
  });

  // ===== C. Rituais =====
  const GC = 'C. Rituais';
  const learn = (c, ...ids) => ids.forEach((id) => { if (!c.rit.includes(id)) c.rit.push(id); });
  safe(GC, 'Defesa e PV temporários dos rituais', () => {
    const c = mk('Ocultista', 99, { PRE: 5 }); learn(c, 'Forma Monstruosa', 'Fortalecimento Sensorial', 'Embaralhar'); const d0 = K(c).def;
    cast('Forma Monstruosa', 0); T(GC, 'Forma Monstruosa: +5 Defesa e 30 PV temporários', [K(c).def - d0, c.t.pv], [5, 30]);
    cast('Forma Monstruosa', 2); T(GC, 'Forma Monstruosa Verdadeiro: +10 Defesa e 50 PV temporários (substitui)', [K(c).def - d0 >= 10, c.t.pv >= 50], [true, true]);
    const base = K(c).def;
    cast('Fortalecimento Sensorial', 0); T(GC, 'Fortalecimento Sensorial normal: sem Defesa', K(c).def, base);
    cast('Fortalecimento Sensorial', 2); T(GC, 'Fortalecimento Sensorial Verdadeiro: +10 Defesa', K(c).def - base, 10);
    cast('Embaralhar', 0); const e = K(c).def; const i = c.sust.findIndex((q) => q.n == 'Embaralhar');
    sdec(i); T(GC, 'Embaralhar: ataque errou tira 2 da Defesa', e - K(c).def, 2);
    sdec(c.sust.findIndex((q) => q.n == 'Embaralhar')); sdec(c.sust.findIndex((q) => q.n == 'Embaralhar'));
    T(GC, 'depois de 3 erros (6) o efeito some', c.sust.some((q) => q.n == 'Embaralhar'), false);
    sheet(); B(GC, 'a ficha desenha com os efeitos ativos', !bad(sheet()));
  });
  safe(GC, 'Cicatrização cura em si mesmo e soma Técnica Medicinal', () => {
    const c = mk('Ocultista', 30, { VIG: 3, INT: 3 }, { origem: 'Agente de Saúde' }); learn(c, 'Cicatrização'); c.pv = 1;
    cast('Cicatrização', 0);
    const h = /class=nm>(\d+) PV/.exec(modalHtml()); const n = h ? +h[1] : -1;
    B(GC, 'cura 3d8+3 (+ INT 3 de Técnica Medicinal) = 9 a 30', n >= 9 && n <= 30, modalHtml().slice(0, 120));
    healMe(n); T(GC, '“Aplicar em mim” cura os PV sem passar do máximo', c.pv, Math.min(K(c).pv, 1 + n));
    c.pv = K(c).pv - 1; healMe(99); T(GC, 'não passa do máximo', c.pv, K(c).pv);
  });
  safe(GC, 'Hemofagia', () => {
    const c = mk('Ocultista', 99, { VIG: 5, INT: 4 }); learn(c, 'Hemofagia'); c.pv = 10; const pe0 = c.pe;
    cast('Hemofagia', 0);
    B(GC, 'normal: paga o PE e abre a janela com o dano de Sangue rolado', pe0 - c.pe === Math.max(0, BC[2] - RPD(c, 'Hemofagia')) && /Dano de Sangue rolado/.test(modalHtml()) && !bad(modalHtml()), modalHtml().slice(0, 100));
    const d = S.hem.d; B(GC, 'dano 6d6 (6 a 36)', d >= 6 && d <= 36, d);
    hemoGo(40); T(GC, 'falhou na resistência: dano 40 → +20 PV', c.pv, 30);
    c.pv = 10; hemoGo(Math.floor(40 / 2)); T(GC, 'alvo passou: dano 20 → +10 PV', c.pv, 20);
    cast('Hemofagia', 1); B(GC, 'Discente pede o dano do ataque', /type=number/.test(modalHtml()));
    cast('Hemofagia', 2); c.pv = 5; hemoGo(10); B(GC, 'Verdadeiro: cada toque recupera metade e a janela continua aberta', c.pv === 10 && /Outra rodada/.test(modalHtml()));
  });
  safe(GC, 'Transfusão Vital', () => {
    const c = mk('Ocultista', 99, { VIG: 5 }); learn(c, 'Transfusão Vital'); c.pv = 20;
    cast('Transfusão Vital', 0); B(GC, 'abre a janela com o máximo = PV−1 (19)', /máximo agora <b>19<\/b>/.test(modalHtml()), modalHtml().slice(0, 140));
    setIn('#tvn', 50); clr(); tvGo(19); T(GC, 'mais que o máximo é recusado', c.pv, 20);
    setIn('#tvn', 12); tvGo(19); T(GC, 'transferir 12: você perde 12 PV', c.pv, 8);
    B(GC, 'avisa que o alvo recupera 12', /recupera 12 PV/.test(tst()), tst());
    c.pv = 1; cast('Transfusão Vital', 0); B(GC, 'com 1 PV o máximo é 0', /máximo agora <b>0<\/b>/.test(modalHtml()));
  });
  safe(GC, 'Resgate soma +5 Defesa ao curar com ritual', () => {
    const c = mk('Especialista', 40, { INT: 2 }, { trail: 'Médico de Campo', ab: ['Resgate'] }); learn(c, 'Cicatrização'); const d0 = K(c).def;
    cast('Cicatrização', 0); T(GC, 'Cicatrização + Resgate: +5 Defesa', K(c).def - d0, 5);
  });

  // ===== D. Varredura: tudo que está registrado existe de verdade =====
  const GD = 'D. Varredura';
  safe(GD, 'nomes registrados existem no livro/app', () => {
    const nomes = new Set();
    ['Combatente', 'Especialista', 'Ocultista'].forEach((cl) => { D[cl].pow.forEach((p) => nomes.add(p.n)); D[cl].tr.forEach((t) => t.ab.forEach((a) => nomes.add(a.n))); });
    Object.values(D.PP).forEach((l) => l.forEach((p) => nomes.add(p.n)));
    OR.forEach((o) => nomes.add(o[2]));
    const falta = Object.keys(AUT).filter((n) => !nomes.has(n));
    T(GD, 'toda habilidade com botão automático (AUT) existe nos dados', falta, []);
    const rits = new Set(RT.map((r) => r.n));
    const f2 = Object.keys(PEND).filter((n) => !nomes.has(n) && !rits.has(n));
    T(GD, 'toda pendência (PEND) aponta para habilidade ou ritual existente', f2, []);
    const f3 = Object.keys(EF).filter((n) => !rits.has(n));
    T(GD, 'todo ritual com efeito automático (EF) existe', f3, []);
    const f4 = Object.keys(RPOST).filter((n) => !rits.has(n));
    T(GD, 'todo ritual com janela de resolução (RPOST) existe', f4, []);
    B(GD, 'cada ação tem rótulo e função de efeito', Object.values(AUT).every((l) => l.length && l.every((A) => A.l && (typeof A.run == 'function' || A.dmg))));
  });
  safe(GD, 'rodar todas as ações de todas as habilidades sem erro, com PE de sobra', () => {
    let n = 0, erro = [];
    Object.keys(AUT).forEach((nome) => {
      const c = mk('Especialista', 99, { INT: 4, PRE: 4, VIG: 4 }, { origem: nome == 'Acalentar' ? 'Religioso' : nome == 'Vislumbres do Passado' ? 'Amnésico' : null, ab: [{ n: nome, t: 'x', pw: 1, el: 'Morte' }] });
      c.af = 'Morte'; c.pe = K(c).pe; c.pv = Math.floor(K(c).pv / 2) - 3;
      AUT[nome].forEach((A, j) => {
        try {
          clr(); const i = idx(c, nome); if (i < 0) { erro.push(nome + ': não aparece em Ações'); return; }
          if (A.q) autoGo(i, j, A.q.min); else autoGo(i, j);
          if (A.dmg) { setIn('#adm', 10); dmgGo(i, j, 0); }
          n++;
          const h = sheet(); if (bad(h) || bad(tst())) erro.push(nome + ': undefined/NaN');
          if (isNaN(c.pv) || isNaN(c.pe) || isNaN(K(c).def)) erro.push(nome + ': valor NaN');
        } catch (e) { erro.push(nome + ': ' + e.message); }
      });
    });
    T(GD, n + ' ações executadas', erro, []);
    B(GD, 'todas as ações foram cobertas', n === Object.values(AUT).reduce((a, l) => a + l.length, 0), n);
  });
  safe(GD, 'cards (abc) e avisos de pendência desenham', () => {
    const c = mk('Ocultista', 99, { INT: 4, PRE: 4 }, { ab: ['Anular Ritual', 'Reanimação', 'Gladiador Paranormal'] });
    abc(idx(c, 'Anular Ritual')); B(GD, 'habilidade pendente mostra o aviso “Cálculo automático pendente”', /Cálculo automático pendente/.test(modalHtml()) && !bad(modalHtml()));
    abc(idx(c, 'Gladiador Paranormal')); B(GD, 'habilidade automática mostra o botão de uso', /autoGo\(/.test(modalHtml()) && !bad(modalHtml()));
    c.rit.push('Contato Paranormal'); rv('Contato Paranormal'); B(GD, 'ritual pendente mostra o aviso', /Cálculo automático pendente/.test(modalHtml()));
    sceneModal(); B(GD, 'janela de fim da cena desenha', /Fim da cena/.test(modalHtml()) && !bad(modalHtml()));
  });

  return R_;
})();
