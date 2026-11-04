// Roda DENTRO do app. Bateria de testes de Melhorias: modificações e maldições (+ botões de PE).
// Retorna uma lista de {g: grupo, n: nome do teste, ok, d: detalhe}.
(function () {
  const R_ = [];
  const J = (x) => JSON.stringify(x);
  const T = (g, n, got, want) => { const ok = J(got) === J(want); R_.push({ g, n, ok, d: ok ? J(got) : 'obtido ' + J(got) + ' ≠ esperado ' + J(want) }); };
  const B = (g, n, ok, d) => R_.push({ g, n, ok: !!ok, d: d || '' });
  const safe = (g, n, fn) => { try { fn(); } catch (e) { R_.push({ g, n, ok: false, d: 'ERRO: ' + e.message }); } };

  const AT = (a) => Object.assign({ AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 1 }, a || {});
  const item = (n) => {
    for (const k of ['arm', 'pro', 'uti', 'mun']) {
      const x = (CAT[k] || []).find((z) => z[0] == n);
      if (x) return { n: x[0], cat: x[1], e: x[2], w: x[3].d ? { ...x[3], mag: x[3].mx || 0 } : null, q: x[3].q, am: 0, el: null, ds: '' };
    }
    throw new Error('item ' + n);
  };
  let uid = 0;
  const mk = (cl, nex, attr, items) => {
    newC(); const d = S.d;
    d.id = 2e6 + ++uid; d.name = 'Melhorias ' + uid; d.classe = cl; d.origem = 2; d.nex = nex; d.attr = AT(attr);
    fin(); const c = cur(); S.cid = c.id; c.inv = []; (items || []).forEach((n) => c.inv.push(item(n))); return c;
  };
  const tst = () => document.querySelector('#t').textContent;
  const clr = () => { document.querySelector('#t').textContent = ''; };
  const modalHtml = () => document.querySelector('#m').innerHTML;
  const names = (l) => l.map((d) => d.n || d);
  const bad = (h) => /undefined|NaN|\[object/.test(h);

  const MELEE = ['Faca', 'Machete', 'Katana'], FIRE = ['Pistola', 'Fuzil de caça', 'Submetralhadora', 'Espingarda'], BOW = ['Arco', 'Besta'];
  const PROT = ['Proteção leve', 'Proteção pesada', 'Escudo'], ACCOK = ['Utensílio', 'Vestimenta'];
  const NO = ['Kit de perícia', 'Corda', 'Granada de fragmentação', 'Lanterna tática'];

  // =====================================================================================
  // A. MODIFICAÇÕES
  // =====================================================================================
  const GA = 'A. Modificações';
  safe(GA, 'lista de modificações por tipo de item bate com o livro', () => {
    const o = (n) => names(modOpts(item(n)).map((m) => ({ n: m })));
    T(GA, 'arma corpo a corpo: Certeira, Cruel, Discreta, Perigosa, Tática', o('Faca'), ['Certeira', 'Cruel', 'Discreta', 'Perigosa', 'Tática']);
    T(GA, 'arco/besta (arma sem fogo) = mesmas do corpo a corpo', o('Arco'), ['Certeira', 'Cruel', 'Discreta', 'Perigosa', 'Tática']);
    T(GA, 'arma de fogo: + Alongada, Calibre Grosso, Ferrolho, Mira Laser, Mira Telescópica, Silenciador, Visão de Calor (sem Compensador se não for automática)', o('Pistola'),
      ['Certeira', 'Cruel', 'Discreta', 'Perigosa', 'Tática', 'Alongada', 'Calibre Grosso', 'Ferrolho Automático', 'Mira Laser', 'Mira Telescópica', 'Silenciador', 'Visão de Calor']);
    T(GA, 'arma automática (Fuzil de assalto) ganha Compensador', o('Fuzil de assalto').includes('Compensador'), true);
    T(GA, 'Submetralhadora e Metralhadora também aceitam Compensador', [o('Submetralhadora').includes('Compensador'), o('Metralhadora').includes('Compensador')], [true, true]);
    T(GA, 'Pistola só aceita Compensador depois de Ferrolho Automático', (() => { const it = item('Pistola'); it.mods = ['Ferrolho Automático']; return modOpts(it).includes('Compensador'); })(), true);
    T(GA, 'Proteção leve: Discreta e Reforçada (sem Antibombas/Blindada)', o('Proteção leve'), ['Discreta', 'Reforçada']);
    T(GA, 'Proteção pesada: Antibombas, Blindada e Reforçada (sem Discreta)', o('Proteção pesada'), ['Antibombas', 'Blindada', 'Reforçada']);
    T(GA, 'Escudo: só Reforçada', o('Escudo'), ['Reforçada']);
    T(GA, 'Utensílio / Vestimenta / Kit de perícia: Aprimorado, Discreto, Função adicional, Instrumental', [o('Utensílio'), o('Vestimenta'), o('Kit de perícia')],
      [['Aprimorado', 'Discreto', 'Função adicional', 'Instrumental'], ['Aprimorado', 'Discreto', 'Função adicional', 'Instrumental'], ['Aprimorado', 'Discreto', 'Função adicional', 'Instrumental']]);
    T(GA, 'itens que não aceitam modificação (Corda, Granada, Lanterna)', ['Corda', 'Granada de fragmentação', 'Lanterna tática'].map((n) => o(n).length), [0, 0, 0]);
  });
  safe(GA, 'exclusões entre modificações', () => {
    const l = item('Proteção leve'); l.mods = ['Reforçada'];
    T(GA, 'Reforçada tira Discreta da lista (proteção leve)', modOpts(l).includes('Discreta'), false);
    const l2 = item('Proteção leve'); l2.mods = ['Discreta'];
    T(GA, 'Discreta tira Reforçada da lista', modOpts(l2).includes('Reforçada'), false);
    const p = item('Pistola'); p.mods = ['Certeira'];
    T(GA, 'modificação já aplicada não aparece de novo', modOpts(p).includes('Certeira'), false);
  });
  safe(GA, 'cada modificação sobe +1 categoria (e só isso) — todas as modificações de cada tipo', () => {
    const falhas = [];
    ['Faca', 'Pistola', 'Fuzil de assalto', 'Proteção leve', 'Proteção pesada', 'Escudo', 'Utensílio', 'Kit de perícia'].forEach((n) => {
      const c = mk('Combatente', 10, {}, [n]); const it = c.inv[0], base = ecat(c, it);
      modOpts(it).forEach((m, k) => {
        modAdd(0, m);
        if (ecat(c, c.inv[0]) !== base + k + 1) falhas.push(n + ' + ' + m + ': cat ' + ecat(c, c.inv[0]) + ' (esperado ' + (base + k + 1) + ')');
      });
    });
    T(GA, 'categoria = base + nº de modificações (acumulando todas)', falhas, []);
  });
  safe(GA, 'espaço ocupado: Blindada +1, Reforçada +1, Discreta/Discreto −1 (mín. 0)', () => {
    const c = mk('Combatente', 10, {}, ['Proteção pesada', 'Proteção leve', 'Utensílio', 'Faca']);
    const [ph, pl, ut, fa] = c.inv, e0 = ph.e;
    modAdd(0, 'Blindada'); T(GA, 'Blindada: espaço +1', ee(c, c.inv[0]), e0 + 1);
    modAdd(0, 'Reforçada'); T(GA, 'Blindada + Reforçada: espaço +2', ee(c, c.inv[0]), e0 + 2);
    modAdd(1, 'Discreta'); T(GA, 'Discreta (proteção leve): espaço −1', ee(c, c.inv[1]), pl.e - 1);
    modAdd(2, 'Discreto'); T(GA, 'Discreto (acessório): espaço −1', ee(c, c.inv[2]), ut.e - 1);
    modAdd(3, 'Discreta'); T(GA, 'Discreta (arma de 1 espaço): nunca abaixo de 0', ee(c, c.inv[3]) >= 0, true);
  });
  safe(GA, 'efeitos em armas: ataque, dano, margem e dado extra', () => {
    const c = mk('Combatente', 10, {}, ['Faca', 'Pistola', 'Fuzil de caça']);
    const f0 = weff(c, c.inv[0]), p0 = weff(c, c.inv[1]), r0 = weff(c, c.inv[2]);
    modAdd(0, 'Certeira'); T(GA, 'Certeira: +2 em ataque', weff(c, c.inv[0]).ab, 2);
    modAdd(0, 'Cruel'); T(GA, 'Cruel: dano +2 (' + f0.d + ' → ' + weff(c, c.inv[0]).d + ')', weff(c, c.inv[0]).d, f0.d + '+2');
    modAdd(0, 'Perigosa'); T(GA, 'Perigosa: margem −2 (' + f0.c + ' → ' + weff(c, c.inv[0]).c + ')', weff(c, c.inv[0]).c, f0.c - 2);
    modAdd(1, 'Alongada'); T(GA, 'Alongada: +2 em ataque', weff(c, c.inv[1]).ab, 2);
    modAdd(1, 'Mira Laser'); T(GA, 'Mira Laser: margem −2', weff(c, c.inv[1]).c, p0.c - 2);
    modAdd(1, 'Perigosa'); T(GA, 'Mira Laser + Perigosa: margem −4', weff(c, c.inv[1]).c, p0.c - 4);
    modAdd(2, 'Calibre Grosso');
    const mm = r0.d.match(/^(\d+)d(\d+)/);
    T(GA, 'Calibre Grosso: +1 dado do mesmo tipo (' + r0.d + ' → ' + weff(c, c.inv[2]).d + ')', weff(c, c.inv[2]).d.startsWith((+mm[1] + 1) + 'd' + mm[2]), true);
    const c2 = mk('Combatente', 10, {}, ['Faca']); modAdd(0, 'Perigosa'); modAdd(0, 'Perigosa');
    T(GA, 'mesma modificação não duplica', c2.inv[0].mods.length, 1);
    // margem nunca cai abaixo de 2
    const c3 = mk('Combatente', 10, {}, ['Pistola']); c3.inv[0].w = { ...c3.inv[0].w, c: 3 }; modAdd(0, 'Mira Laser'); modAdd(0, 'Perigosa');
    T(GA, 'margem de ameaça nunca cai abaixo de 2', weff(c3, c3.inv[0]).c, 2);
  });
  safe(GA, 'efeitos em proteções: Defesa e resistência a dano', () => {
    const c = mk('Combatente', 10, { AGI: 0 }, ['Proteção pesada']);
    const d0 = K(c).def, r0 = K(c).pr.r;
    modAdd(0, 'Reforçada'); T(GA, 'Reforçada (pesada vestida): Defesa +2', K(c).def - d0, 2);
    modAdd(0, 'Blindada'); B(GA, 'Blindada: resistência a dano 2 → 5', /5/.test(K(c).pr.r) && /2/.test(r0), K(c).pr.r);
    const c2 = mk('Combatente', 10, { AGI: 0 }, ['Proteção leve', 'Escudo']);
    const d1 = K(c2).def; modAdd(1, 'Reforçada'); T(GA, 'Reforçada no Escudo: Defesa +2', K(c2).def - d1, 2);
    const c3 = mk('Combatente', 10, { AGI: 0 }, ['Proteção leve']); const d3 = K(c3).def; modAdd(0, 'Discreta');
    T(GA, 'Discreta não muda a Defesa', K(c3).def - d3, 0);
  });
  safe(GA, 'remoção de modificação e ícone ⭐', () => {
    const c = mk('Combatente', 10, {}, ['Faca', 'Proteção leve']);
    const cat0 = ecat(c, c.inv[0]);
    modAdd(0, 'Certeira'); modAdd(0, 'Cruel');
    T(GA, 'arma com modificação ganha ⭐ (sem ➕)', cuNm(c.inv[0]), 'Faca⭐');
    modDel(0, 0); T(GA, 'remover uma modificação desce a categoria em 1', ecat(c, c.inv[0]), cat0 + 1);
    modDel(0, 0); T(GA, 'sem modificações: categoria volta ao original e some o ⭐', [ecat(c, c.inv[0]), cuNm(c.inv[0])], [cat0, 'Faca']);
    modAdd(1, 'Reforçada'); T(GA, 'proteção não ganha ícone no nome (só armas)', cuNm(c.inv[1]), 'Proteção leve');
  });
  safe(GA, 'telas: Inventário (Melhorias), seletor e modais de modificação desenham sem erro', () => {
    const c = mk('Combatente', 40, {}, ['Faca', 'Pistola', 'Proteção pesada', 'Escudo', 'Utensílio']);
    c.inv.forEach((it, i) => modOpts(it).forEach((m) => modAdd(i, m)));
    S.v = 'sheet'; S.tab = 2; R(); const h = document.querySelector('#app').innerHTML;
    B(GA, 'aba Inventário mostra a seção Melhorias sem undefined/NaN', /Melhorias/.test(h) && !bad(h), bad(h) ? 'tem undefined/NaN' : '');
    const falhas = [];
    modPick(); if (bad(modalHtml())) falhas.push('modPick');
    c.inv.forEach((it, i) => { modItem(i); if (bad(modalHtml())) falhas.push('modItem ' + it.n); modMods(i); if (bad(modalHtml())) falhas.push('modMods ' + it.n); });
    T(GA, 'seletor de item e listas de modificação sem undefined/NaN', falhas, []);
    const maxCat = Math.max(...c.inv.map((it) => ecat(c, it)));
    B(GA, 'categoria máxima tem algarismo romano (RM) — máx. ' + maxCat, RM[maxCat] !== undefined, 'RM[' + maxCat + ']');
  });

  // =====================================================================================
  // B. MALDIÇÕES — compatibilidade
  // =====================================================================================
  const GB = 'B. Maldições: onde cada uma pode ser aplicada';
  safe(GB, 'catálogo', () => {
    T(GB, 'catálogo tem 35 maldições (12 de arma, 10 de proteção, 13 de acessório)', [CURSES.length, CURSES.filter((d) => d.k == 'arma').length + CURSES.filter((d) => d.k == 'corpo').length,
      CURSES.filter((d) => d.k == 'prot').length, CURSES.filter((d) => d.k == 'acc').length], [35, 12, 10, 13]);
    T(GB, 'todas as maldições têm elemento válido (ou "Varia" só na Proteção Elemental)', CURSES.filter((d) => !CUEL.includes(d.el) && d.n != 'Proteção Elemental').map((d) => d.n), []);
    T(GB, 'todas as maldições têm texto e resumo (CUX)', CURSES.filter((d) => !d.t || !(CUX[d.n] && CUX[d.n].s)).map((d) => d.n), []);
    T(GB, 'cada elemento tem ao menos 1 maldição de arma, 1 de proteção e 1 de acessório', CUEL.map((e) => ['arma', 'prot', 'acc'].every((k) => CURSES.some((d) => d.el == e && (d.k == k || (k == 'arma' && d.k == 'corpo'))))), [true, true, true, true]);
  });
  safe(GB, 'catálogo confere com as páginas 145–147 do livro (nomes por seção e elemento)', () => {
    const livro = {
      'arma|Conhecimento': ['Antielemento', 'Ritualística', 'Senciente'], 'arma|Energia': ['Empuxo', 'Energética', 'Vibrante'],
      'arma|Morte': ['Consumidora', 'Erosiva', 'Repulsora'], 'arma|Sangue': ['Lancinante', 'Predadora', 'Sanguinária'],
      'prot|Conhecimento': ['Abascanta', 'Profética', 'Sombria'], 'prot|Energia': ['Cinética', 'Lépida', 'Voltaica'],
      'prot|Morte': ['Letárgica', 'Repulsiva'], 'prot|Sangue': ['Regenerativa', 'Sádica'],
      'acc|Conhecimento': ['Carisma', 'Conjuração', 'Escudo Mental', 'Reflexão', 'Sagacidade'], 'acc|Energia': ['Defesa', 'Destreza', 'Potência'],
      'acc|Morte': ['Esforço Adicional'], 'acc|Sangue': ['Disposição', 'Pujança', 'Vitalidade'], 'acc|Varia': ['Proteção Elemental']
    };
    const app = {};
    CURSES.forEach((d) => { const k = (d.k == 'corpo' ? 'arma' : d.k) + '|' + d.el; (app[k] = app[k] || []).push(d.n); });
    Object.keys(livro).forEach((k) => T(GB, 'livro × app: ' + k.replace('|', ' / '), (app[k] || []).slice().sort(), livro[k].slice().sort()));
    T(GB, 'nenhuma seção a mais no app', Object.keys(app).filter((k) => !livro[k]), []);
  });
  safe(GB, 'matriz maldição × tipo de item', () => {
    const falhas = [];
    const mkIt = (n) => { const c = mk('Combatente', 10, {}, [n]); return c.inv[0]; };
    const cache = {}; [...MELEE, ...FIRE, ...BOW, ...PROT, ...ACCOK, ...NO].forEach((n) => { cache[n] = mkIt(n); });
    CURSES.forEach((d) => {
      Object.entries(cache).forEach(([n, it]) => {
        const isW = !!it.w, isM = isW && !!it.w.m, isP = PROT.includes(n), isA = ACCOK.includes(n);
        const quer = d.k == 'arma' ? isW : d.k == 'corpo' ? isM : d.k == 'prot' ? isP : d.k == 'acc' ? isA : false;
        const tem = cuOpts(it).some((o) => o.n == d.n);
        if (quer !== tem) falhas.push(d.n + ' em ' + n + ': ' + (tem ? 'aparece' : 'não aparece') + ' (esperado ' + (quer ? 'aparecer' : 'não aparecer') + ')');
      });
    });
    T(GB, CURSES.length + ' maldições × ' + (MELEE.length + FIRE.length + BOW.length + PROT.length + ACCOK.length + NO.length) + ' itens: cada uma só aparece onde o livro permite', falhas, []);
    T(GB, 'Empuxo (só corpo a corpo) não aparece em arma de fogo nem arco', [cuOpts(cache['Pistola']).some((o) => o.n == 'Empuxo'), cuOpts(cache['Arco']).some((o) => o.n == 'Empuxo'), cuOpts(cache['Faca']).some((o) => o.n == 'Empuxo')], [false, false, true]);
    T(GB, 'Kit de perícia, Corda, Granada e Lanterna não aceitam maldição', NO.map((n) => cuOpts(cache[n]).length), [0, 0, 0, 0]);
  });
  const GC = 'C. Maldições: categoria, elementos opressores e repetição';
  safe(GC, 'categoria: 1ª maldição +II, demais +I', () => {
    const c = mk('Combatente', 10, {}, ['Faca']); const cat0 = ecat(c, c.inv[0]);
    const seq = [];
    ['Lancinante', 'Predadora', 'Sanguinária'].forEach((m, k) => { curAdd(0, m); seq.push(ecat(c, c.inv[0]) - cat0); });
    T(GC, '1, 2 e 3 maldições somam +2, +3, +4', seq, [2, 3, 4]);
    modAdd(0, 'Certeira'); T(GC, 'modificação soma por cima (+1)', ecat(c, c.inv[0]) - cat0, 5);
    curDel(0, 2); curDel(0, 1); curDel(0, 0); modDel(0, 0);
    T(GC, 'remover tudo devolve a categoria original', ecat(c, c.inv[0]), cat0);
    const c2 = mk('Combatente', 10, {}, ['Utensílio']); const k0 = ecat(c2, c2.inv[0]);
    curAdd(0, 'Defesa'); T(GC, 'acessório também: +II na 1ª maldição', ecat(c2, c2.inv[0]) - k0, 2);
  });
  safe(GC, 'elementos opressores não combinam (todas as combinações 4×4)', () => {
    const rep = {}; const falhas = [];
    // item de teste: arma (aceita arma de todos os elementos); 1 maldição de cada elemento como "base"
    const pick = { Sangue: 'Lancinante', Morte: 'Erosiva', Conhecimento: 'Antielemento', Energia: 'Vibrante' };
    const ok = { 'Sangue|Energia': true, 'Energia|Sangue': true, 'Conhecimento|Morte': true, 'Morte|Conhecimento': true };
    CUEL.forEach((a) => CUEL.forEach((b) => {
      if (a == b) return;
      const c = mk('Combatente', 10, {}, ['Faca']); curAdd(0, pick[a]);
      const aparece = cuOpts(c.inv[0]).some((o) => o.el == b);
      rep[a + '+' + b] = aparece;
      if (aparece !== !!ok[a + '|' + b]) falhas.push(a + ' + ' + b + ': ' + (aparece ? 'liberou' : 'bloqueou') + ' contra o livro');
    }));
    T(GC, 'só Sangue+Energia e Conhecimento+Morte combinam', falhas, []);
    const c = mk('Combatente', 10, {}, ['Faca']); curAdd(0, 'Lancinante');
    T(GC, 'mesmo elemento sempre combina (Sangue + Sangue)', cuOpts(c.inv[0]).some((o) => o.n == 'Predadora'), true);
    T(GC, 'a mesma maldição não aparece duas vezes', cuOpts(c.inv[0]).some((o) => o.n == 'Lancinante'), false);
    curAdd(0, 'Lancinante'); T(GC, 'curAdd repetido não duplica a maldição', c.inv[0].cur.length, 1);
    T(GC, 'Sangue e Conhecimento (opressores) não liberam nem a Proteção Elemental desses elementos', (() => {
      const p = mk('Combatente', 10, {}, ['Utensílio']); curAdd(0, 'Pujança');  // Sangue
      return CUEL.filter((e) => cuElOk(p.inv[0], e));
    })(), ['Sangue', 'Morte', 'Energia'].filter((e) => !cuClash('Sangue', e)));
  });
  safe(GC, 'Proteção Elemental: elemento escolhido', () => {
    const c = mk('Combatente', 10, {}, ['Utensílio']);
    curAdd(0, 'Proteção Elemental (Morte)');
    T(GC, 'elemento da maldição é o escolhido', cuEl('Proteção Elemental (Morte)'), 'Morte');
    T(GC, 'bloqueia elementos opressores do escolhido na lista da Proteção Elemental (Morte: bloqueia Sangue e Energia)', CUEL.filter((e) => cuElOk(c.inv[0], e)), ['Morte', 'Conhecimento']);
    S.v = 'sheet'; S.tab = 2; R();
    curEl(0); B(GC, 'tela de escolha do elemento sem undefined', !bad(modalHtml()), '');
  });

  // =====================================================================================
  // D. MALDIÇÕES — efeitos automáticos na ficha
  // =====================================================================================
  const GD = 'D. Maldições: efeitos automáticos na ficha';
  // [maldição, item, campo, valor esperado]  (nível NEX 10, atributos 1; Defesa base = 10 + AGI(1) + proteção)
  safe(GD, 'bônus de cada maldição passiva', () => {
    const casos = [
      ['Repulsora', 'Faca', 'def', 2], ['Letárgica', 'Proteção leve', 'def', 2], ['Cinética', 'Proteção leve', 'def', 2], ['Defesa', 'Utensílio', 'def', 5],
      ['Cinética', 'Proteção leve', 'rd', 2], ['Cinética', 'Escudo', 'rd', 2], ['Cinética', 'Proteção pesada', 'rd', 5],
      ['Profética', 'Proteção leve', 'res.Conhecimento', 10], ['Voltaica', 'Proteção leve', 'res.Energia', 10], ['Repulsiva', 'Proteção leve', 'res.Morte', 10],
      ['Regenerativa', 'Proteção leve', 'res.Sangue', 10], ['Escudo Mental', 'Utensílio', 'res.Mental', 10],
      ['Proteção Elemental (Sangue)', 'Utensílio', 'res.Sangue', 10], ['Proteção Elemental (Energia)', 'Utensílio', 'res.Energia', 10],
      ['Sombria', 'Proteção leve', 'sk.Furtividade', 5], ['Lépida', 'Proteção leve', 'sk.Atletismo', 10], ['Lépida', 'Proteção leve', 'desl', 3],
      ['Carisma', 'Utensílio', 'attr.PRE', 1], ['Sagacidade', 'Utensílio', 'attr.INT', 1], ['Destreza', 'Utensílio', 'attr.AGI', 1], ['Disposição', 'Utensílio', 'attr.VIG', 1], ['Pujança', 'Utensílio', 'attr.FOR', 1],
      ['Potência', 'Utensílio', 'dt', 1], ['Esforço Adicional', 'Utensílio', 'pe', 5], ['Vitalidade', 'Utensílio', 'pv', 15]
    ];
    const get = (cf, k) => { const [a, b] = k.split('.'); return b ? (cf[a] || {})[b] || 0 : cf[a] || 0; };
    casos.forEach(([m, n, k, v]) => {
      const c = mk('Combatente', 10, {}, [n]); curAdd(0, m);
      const real = get(cfx(c), k);
      B(GD, m + ' em ' + n + ' → ' + k + ' +' + v, real === v, 'obtido ' + real);
    });
  });
  safe(GD, 'resultado final na ficha (Defesa, PV, PE, DT, atributos, perícias)', () => {
    const c0 = mk('Combatente', 10, { AGI: 2 }, ['Proteção leve', 'Utensílio']), kb = K(c0);
    curAdd(1, 'Defesa'); T(GD, 'Defesa (acessório) = +5 na Defesa final', K(c0).def - kb.def, 5);
    curDel(1, 0); curAdd(1, 'Destreza'); T(GD, 'Destreza: +1 AGI conta na Defesa (+1)', K(c0).def - kb.def, 1);
    T(GD, 'Destreza não altera o atributo salvo (c.attr.AGI) nem PV/PE', [c0.attr.AGI, ea(c0).AGI, K(c0).pv - kb.pv, K(c0).pe - kb.pe], [2, 3, 0, 0]);
    curDel(1, 0); curAdd(1, 'Esforço Adicional'); T(GD, 'Esforço Adicional: PE máximo +5', K(c0).pe - kb.pe, 5);
    curDel(1, 0); curAdd(1, 'Vitalidade'); T(GD, 'Vitalidade: PV máximo +15', K(c0).pv - kb.pv, 15);
    curDel(1, 0); curAdd(1, 'Potência'); T(GD, 'Potência: DT de ritual +1', K(c0).dt - kb.dt, 1);
    curDel(1, 0); curAdd(1, 'Sagacidade'); T(GD, 'Sagacidade: INT efetiva +1 e atributo salvo igual', [ea(c0).INT - c0.attr.INT, c0.attr.INT], [1, 1]);
    curDel(1, 0); curAdd(1, 'Carisma'); T(GD, 'Carisma: PRE efetiva +1 → DT +1', K(c0).dt - kb.dt, 1);
    curDel(1, 0); curAdd(1, 'Pujança'); T(GD, 'Pujança: FOR efetiva +1 (não altera a capacidade de carga)', [ea(c0).FOR - c0.attr.FOR, K(c0).carga - kb.carga], [1, 0]);
    curDel(1, 0); curAdd(1, 'Disposição'); T(GD, 'Disposição: VIG efetivo +1 (não gera PV extra)', [ea(c0).VIG - c0.attr.VIG, K(c0).pv - kb.pv], [1, 0]);
  });
  safe(GD, 'bônus não se acumulam: vale o maior, e maldição igual em 2 itens conta uma vez', () => {
    const c = mk('Combatente', 10, { AGI: 0 }, ['Proteção leve', 'Escudo', 'Utensílio', 'Vestimenta']); const d0 = K(c).def;
    curAdd(0, 'Cinética'); curAdd(1, 'Cinética');
    T(GD, 'Cinética em Proteção e Escudo: +2 Defesa (uma vez só)', K(c).def - d0, 2);
    curAdd(2, 'Defesa'); T(GD, 'Cinética (+2) + Defesa (+5): vale só o maior (+5)', K(c).def - d0, 5);
    curAdd(3, 'Defesa'); T(GD, 'Defesa em dois itens: ainda +5', K(c).def - d0, 5);
    const c2 = mk('Combatente', 10, {}, ['Utensílio', 'Vestimenta']);
    curAdd(0, 'Vitalidade'); curAdd(1, 'Vitalidade'); T(GD, 'Vitalidade em dois acessórios: +15 PV uma vez', cfx(c2).pv, 15);
    const c3 = mk('Combatente', 10, {}, ['Utensílio', 'Vestimenta']);
    curAdd(0, 'Proteção Elemental (Sangue)'); curAdd(1, 'Proteção Elemental (Energia)');
    T(GD, 'Proteção Elemental de elementos diferentes: ambas valem', [cfx(c3).res.Sangue, cfx(c3).res.Energia], [10, 10]);
  });
  safe(GD, 'proteção só vale se for a vestida (ou o escudo)', () => {
    const c = mk('Combatente', 10, {}, ['Proteção leve', 'Proteção pesada']);
    curAdd(0, 'Voltaica'); curAdd(1, 'Repulsiva');
    T(GD, 'com as duas no inventário vale só a pesada (a vestida): Morte 10, sem Energia', [cfx(c).res.Morte || 0, cfx(c).res.Energia || 0], [10, 0]);
    const c2 = mk('Combatente', 10, {}, ['Proteção leve']); curAdd(0, 'Regenerativa');
    c2.inv.push(item('Escudo')); curAdd(1, 'Profética');
    T(GD, 'escudo no inventário conta junto com a proteção', [cfx(c2).res.Sangue, cfx(c2).res.Conhecimento], [10, 10]);
    const c3 = mk('Combatente', 10, {}, ['Proteção leve', 'Proteção pesada']); curAdd(0, 'Cinética');
    T(GD, 'Cinética numa leve não vestida (há pesada) não conta', cfx(c3).def, 0);
  });
  safe(GD, 'resistência na ficha: aparece nas RESISTÊNCIAS e o atributo na ficha', () => {
    const c = mk('Combatente', 10, {}, ['Proteção leve', 'Utensílio']);
    curAdd(0, 'Cinética'); curAdd(0, 'Profética'); curAdd(1, 'Escudo Mental');
    S.v = 'sheet'; S.tab = 0; R(); const h = document.querySelector('#app').innerHTML;
    B(GD, 'ficha mostra "Conhecimento 10", "Mental 10" e "Dano 2"', /Conhecimento 10/.test(h) && /Mental 10/.test(h) && /Dano 2/.test(h), '');
    B(GD, 'ficha sem undefined/NaN', !bad(h), '');
    curAdd(0, 'Lépida') ;
  });
  safe(GD, 'deslocamento da ficha (Lépida +3m)', () => {
    const c = mk('Combatente', 10, {}, ['Proteção leve']); curAdd(0, 'Cinética');
    S.v = 'sheet'; S.tab = 0; R(); const h0 = document.querySelector('#app').innerHTML;
    curDel(0, 0); curAdd(0, 'Lépida'); R(); const h1 = document.querySelector('#app').innerHTML;
    B(GD, 'sem Lépida: DESL 9m', />9m</.test(h0) || /9m/.test(h0), '');
    B(GD, 'com Lépida: DESL 12m', /12m/.test(h1), '');
  });
  safe(GD, 'perícias com maldição (Sombria/Lépida) entram no bônus', () => {
    const c = mk('Combatente', 10, {}, ['Proteção leve']);
    curAdd(0, 'Lépida'); T(GD, 'ob(Atletismo) = +10 por Lépida', ob(c, 'Atletismo'), 10);
    curDel(0, 0); curAdd(0, 'Sombria'); T(GD, 'ob(Furtividade) = +5 por Sombria', [ob(c, 'Furtividade'), ob(c, 'Atletismo')], [5, 0]);
  });
  const GE = 'E. Maldições: efeitos em armas';
  safe(GE, 'dano extra e margem de ameaça', () => {
    const c = mk('Combatente', 10, {}, ['Faca', 'Fuzil de caça', 'Pistola']);
    const f0 = weff(c, c.inv[0]);
    curAdd(0, 'Lancinante'); T(GE, 'Lancinante: +1d8 de Sangue multiplicado no crítico', weff(c, c.inv[0]).ex, [['1d8', 'Sangue', 1]]);
    curAdd(1, 'Erosiva'); T(GE, 'Erosiva: +1d8 de Morte (não multiplica no crítico)', weff(c, c.inv[1]).ex, [['1d8', 'Morte', 0]]);
    const c2 = mk('Combatente', 10, {}, ['Faca']); curAdd(0, 'Lancinante');
    clr(); const m = atk(0, 0, 1);
    B(GE, 'ataque mostra o dano extra "+ Sangue N [1d8]"', /\+ Sangue \d+ \[\dd8\]/.test(String(m) + document.querySelector('#t').textContent + modalHtml()), String(m).slice(0, 120));
    [[17, 13], [19, 17], [20, 19], [18, 15], [16, 11]].forEach(([a, b]) => {
      const cc = mk('Combatente', 10, {}, ['Pistola']); cc.inv[0].w = { ...cc.inv[0].w, c: a }; curAdd(0, 'Predadora');
      T(GE, 'Predadora: margem ' + a + ' → ' + b, weff(cc, cc.inv[0]).c, b);
    });
    const c3 = mk('Combatente', 10, {}, ['Pistola']); const p0 = weff(c3, c3.inv[0]).c;
    curAdd(0, 'Predadora'); modAdd(0, 'Perigosa');
    T(GE, 'Predadora dobra antes de Perigosa (−2 depois)', weff(c3, c3.inv[0]).c, Math.max(2, 2 * p0 - 21) - 2);
    const cF = mk('Combatente', 10, {}, ['Faca']); curAdd(0, 'Vibrante');
    T(GE, 'maldições sem dano extra (Vibrante) não criam "ex"', weff(cF, cF.inv[0]).ex, undefined);
    const c4 = mk('Combatente', 10, {}, ['Faca']); curAdd(0, 'Lancinante'); curAdd(0, 'Predadora'); curAdd(0, 'Sanguinária'); modAdd(0, 'Cruel');
    T(GE, 'Lancinante + Predadora + Sanguinária + Cruel convivem', [weff(c4, c4.inv[0]).ex.length, weff(c4, c4.inv[0]).d.endsWith('+2')], [1, true]);
    // maldição em item que não é arma não quebra weff
    const c5 = mk('Combatente', 10, {}, ['Utensílio']); curAdd(0, 'Defesa'); T(GE, 'weff em item sem arma devolve nulo', weff(c5, c5.inv[0]) || null, null);
  });
  safe(GE, 'ícones no nome da arma (🔴⚫🟡🟣 e ⭐)', () => {
    const l = [['Lancinante', '🔴'], ['Erosiva', '⚫'], ['Antielemento', '🟡'], ['Vibrante', '🟣']];
    l.forEach(([m, e]) => { const c = mk('Combatente', 10, {}, ['Faca']); curAdd(0, m); T(GE, m + ' → Faca' + e, cuNm(c.inv[0]), 'Faca' + e); });
    const c = mk('Combatente', 10, {}, ['Faca']); curAdd(0, 'Lancinante'); curAdd(0, 'Vibrante'); modAdd(0, 'Cruel');
    T(GE, 'Sangue + Energia + modificação = Faca🔴🟣⭐', cuNm(c.inv[0]), 'Faca🔴🟣⭐');
    const c2 = mk('Combatente', 10, {}, ['Faca']); curAdd(0, 'Lancinante'); curAdd(0, 'Predadora');
    T(GE, 'duas maldições do mesmo elemento: um ícone só', cuNm(c2.inv[0]), 'Faca🔴');
    const c3 = mk('Combatente', 10, {}, ['Utensílio', 'Proteção leve']); curAdd(0, 'Defesa'); curAdd(1, 'Cinética');
    T(GE, 'acessório e proteção amaldiçoados não ganham ícone no nome', [cuNm(c3.inv[0]), cuNm(c3.inv[1])], ['Utensílio', 'Proteção leve']);
    const c4 = mk('Combatente', 10, {}, ['Faca']); S.v = 'sheet'; S.tab = 1; curAdd(0, 'Lancinante'); R();
    B(GE, 'aba Ações mostra o nome com o ícone', /Faca🔴/.test(document.querySelector('#app').innerHTML), '');
  });

  // =====================================================================================
  // F. MALDIÇÕES — usar (gasto de PE) e botões de PE
  // =====================================================================================
  const GF = 'F. Maldições: custo de PE e botões';
  safe(GF, 'custo de PE do resumo confere com o texto do livro', () => {
    const falhas = [];
    CURSES.forEach((d) => {
      const x = CUX[d.n] || {}; const m = d.t.match(/gastar (?:uma ação [^.]*? e )?(\d+) PE/i) || d.t.match(/gastar (\d+) PE/i);
      const livro = m ? +m[1] : 0;
      if ((x.pe || 0) !== livro && !x.v) falhas.push(d.n + ': app ' + (x.pe || 0) + ' PE × livro ' + livro + ' PE');
    });
    T(GF, 'CUX.pe = primeiro "gastar N PE" do texto (ou 0 quando não há)', falhas, []);
    T(GF, 'maldições de custo variável: Ritualística, Abascanta, Conjuração, Reflexão', CURSES.filter((d) => (CUX[d.n] || {}).v).map((d) => d.n), ['Ritualística', 'Abascanta', 'Conjuração', 'Reflexão']);
    T(GF, 'só a Senciente tem manutenção por turno (1 PE)', CURSES.filter((d) => (CUX[d.n] || {}).mt).map((d) => d.n + ':' + CUX[d.n].mt), ['Senciente:1']);
  });
  safe(GF, 'Usar: todas as maldições com PE descontam o PE certo', () => {
    CURSES.filter((d) => (CUX[d.n] || {}).pe).forEach((d) => {
      const base = d.k == 'prot' ? 'Proteção leve' : d.k == 'acc' ? 'Utensílio' : 'Faca';
      const c = mk('Combatente', 40, { PRE: 2 }, [base]); curAdd(0, d.n == 'Proteção Elemental' ? d.n + ' (Sangue)' : d.n);
      c.pe = 10; c.pv = 1; clr(); curUse(0, 0);
      const gasto = 10 - c.pe, esperado = CUX[d.n].pe;
      B(GF, 'Usar ' + d.n + ' gasta ' + esperado + ' PE', gasto === esperado, 'gastou ' + gasto + ' · ' + tst());
    });
  });
  safe(GF, 'Usar: limite por rodada, PE insuficiente e dados', () => {
    const c = mk('Combatente', 5, {}, ['Faca']); curAdd(0, 'Energética'); c.pe = 10;      // NEX 5%: limite 1 PE/rodada
    clr(); curUse(0, 0); T(GF, 'custo acima do limite por rodada é recusado (PE não muda)', [c.pe, /limite/.test(tst())], [10, true]);
    const c2 = mk('Combatente', 15, {}, ['Faca']); curAdd(0, 'Energética'); c2.pe = 1;
    clr(); curUse(0, 0); T(GF, 'PE insuficiente é recusado', [c2.pe, /insuficiente/.test(tst())], [1, true]);
    const c3 = mk('Combatente', 40, { VIG: 2 }, ['Proteção leve']); curAdd(0, 'Regenerativa'); c3.pe = 5; c3.pv = 1;
    curUse(0, 0); B(GF, 'Regenerativa cura 1d12 PV e não passa do máximo', c3.pv > 1 && c3.pv <= K(c3).pv, 'PV ' + c3.pv);
    c3.pv = K(c3).pv; c3.pe = 5; curUse(0, 0); T(GF, 'Regenerativa com PV cheio não ultrapassa o máximo', c3.pv, K(c3).pv);
    const c4 = mk('Combatente', 40, {}, ['Faca']); curAdd(0, 'Antielemento'); c4.pe = 5; clr(); curUse(0, 0);
    B(GF, 'Antielemento rola 4d8 de dano extra e avisa no toast', /4d8/.test(tst()), tst());
    const c5 = mk('Combatente', 40, {}, ['Faca']); curAdd(0, 'Lancinante'); c5.pe = 5; curUse(0, 0); T(GF, 'maldição passiva: Usar não gasta PE', c5.pe, 5);
  });
  safe(GF, 'Senciente: ativar, Manter (1 PE/turno), encerrar', () => {
    const c = mk('Combatente', 40, {}, ['Faca']); curAdd(0, 'Senciente'); c.pe = 10;
    T(GF, 'antes de ativar não há efeito ativo', [(c.sust || []).length, cuOn(c, c.inv[0], 'Senciente')], [0, false]);
    clr(); curKeep(0, 0); T(GF, 'Manter sem ativar não gasta PE', c.pe, 10);
    curUse(0, 0); T(GF, 'ativar (Usar) gasta 2 PE e deixa o efeito ativo', [c.pe, cuOn(c, c.inv[0], 'Senciente')], [8, true]);
    T(GF, 'efeito aparece nos efeitos sustentados da ficha', c.sust.map((q) => q.n), ['Senciente']);
    clr(); curUse(0, 0); T(GF, 'ativar de novo é recusado e orienta usar Manter', [c.pe, /Manter/.test(tst())], [8, true]);
    clr(); curKeep(0, 0); T(GF, 'Manter gasta 1 PE', [c.pe, /−1 PE/.test(tst())], [7, true]);
    curKeep(0, 0); curKeep(0, 0); T(GF, 'Manter por 3 turnos seguidos = 3 PE', c.pe, 5);
    S.v = 'sheet'; S.tab = 1; R(); const h = document.querySelector('#app').innerHTML;
    B(GF, 'aba Ações mostra o botão "Manter · 1 PE" e a marca "ativa"', /Manter · 1 PE/.test(h) && /ativa/.test(h) && !bad(h), '');
    S.tab = 2; R(); B(GF, 'Inventário (Melhorias) também mostra o botão Manter', /Manter · 1 PE/.test(document.querySelector('#app').innerHTML), '');
    curCard(0, 0); B(GF, 'detalhe da maldição ativa tem Manter e Encerrar efeito', /Manter · 1 PE/.test(modalHtml()) && /Encerrar efeito/.test(modalHtml()), '');
    dis(cuSid(c.inv[0], 'Senciente')); T(GF, 'encerrar remove o efeito e o botão Manter some', [c.sust.length, cuOn(c, c.inv[0], 'Senciente')], [0, false]);
    R(); B(GF, 'sem efeito ativo não há botão Manter', !/Manter · 1 PE/.test(document.querySelector('#app').innerHTML), '');
    curUse(0, 0); c.pe = 0; clr(); curKeep(0, 0); T(GF, 'Manter sem PE é recusado e o efeito continua para o jogador encerrar', [c.pe, /insuficiente/.test(tst())], [0, true]);
    c.pe = 10; curDel(0, 0); T(GF, 'remover a maldição também encerra o efeito ativo', [c.sust.length, c.inv[0].cur.length], [0, 0]);
  });
  safe(GF, 'Senciente ativa em duas armas diferentes mantém cada uma separada', () => {
    const c = mk('Combatente', 40, {}, ['Faca', 'Pistola']); curAdd(0, 'Senciente'); curAdd(1, 'Senciente'); c.pe = 20;
    curUse(0, 0); curUse(1, 0);
    T(GF, 'dois efeitos distintos (ids por item)', [c.sust.length, new Set(c.sust.map((q) => q.id)).size], [2, 2]);
    curKeep(1, 0); T(GF, 'Manter da segunda arma gasta só 1 PE', c.pe, 20 - 4 - 1);
  });
  safe(GF, 'custo variável: botão "Gastar PE do ritual"', () => {
    ['Ritualística', 'Abascanta', 'Reflexão', 'Conjuração'].forEach((m) => {
      const base = m == 'Ritualística' ? 'Faca' : m == 'Abascanta' ? 'Proteção leve' : 'Utensílio';
      const c = mk('Ocultista', 40, { PRE: 3 }, [base]); curAdd(0, m); c.pe = 20;
      S.v = 'sheet'; S.tab = 1; R(); const h = document.querySelector('#app').innerHTML;
      B(GF, m + ': aba Ações tem o botão "Gastar PE do ritual" e "PE var."', /Gastar PE do ritual/.test(h) && /PE var\./.test(h), '');
      curVar(0, 0); B(GF, m + ': janela de custo abre sem undefined', !bad(modalHtml()) && /Custo do ritual/.test(modalHtml()), '');
      const desc = m == 'Conjuração' ? 1 : 0; clr(); curPay(0, 0, 3);
      T(GF, m + ': ritual de 3 PE gasta ' + (3 - desc) + ' PE', 20 - c.pe, 3 - desc);
    });
    const c = mk('Ocultista', 40, { PRE: 3 }, ['Utensílio']); curAdd(0, 'Conjuração'); c.pe = 20;
    curPay(0, 0, 1); T(GF, 'Conjuração: ritual de 1 PE custa 0 (−1 PE, nunca negativo)', c.pe, 20);
    clr(); curPay(0, 0, 0); T(GF, 'custo 0/vazio é recusado', [c.pe, /Informe/.test(tst())], [20, true]);
    clr(); curPay(0, 0, 'abc'); T(GF, 'texto no campo é recusado sem travar', [c.pe, /Informe/.test(tst())], [20, true]);
    const c2 = mk('Ocultista', 10, {}, ['Utensílio']); curAdd(0, 'Reflexão'); c2.pe = 20; const lim = K(c2).rodR;
    clr(); curPay(0, 0, lim + 1); T(GF, 'custo acima do limite de PE por rodada (rituais) é recusado', [c2.pe, /limite/.test(tst())], [20, true]);
    c2.pe = 1; clr(); curPay(0, 0, lim); T(GF, 'PE insuficiente é recusado', [c2.pe, /insuficiente/.test(tst())], [1, true]);
    const c3 = mk('Ocultista', 40, { PRE: 3 }, ['Utensílio']); curAdd(0, 'Reflexão'); c3.pe = 10; curPay(0, 0, 2.9);
    T(GF, 'custo decimal é arredondado para baixo (2,9 → 2 PE)', 10 - c3.pe, 2);
  });
  safe(GF, 'maldições passivas não têm botão de PE', () => {
    const c = mk('Combatente', 10, {}, ['Faca', 'Proteção leve', 'Utensílio']);
    curAdd(0, 'Lancinante'); curAdd(1, 'Cinética'); curAdd(2, 'Defesa');
    S.v = 'sheet'; S.tab = 1; R(); const h = document.querySelector('#app').innerHTML;
    B(GF, 'sem "Manter" nem "Gastar PE do ritual" nas passivas', !/Manter · |Gastar PE do ritual/.test(h), '');
    curCard(0, 0); B(GF, 'detalhe de passiva diz que os bônus já entram na ficha', /passiva/.test(modalHtml()), '');
  });

  // =====================================================================================
  // G. MALDIÇÕES — telas e persistência
  // =====================================================================================
  const GG = 'G. Maldições: telas, modais e dados salvos';
  safe(GG, 'todas as 35 maldições: detalhe, aplicação e remoção', () => {
    const falhas = [], vazias = [];
    CURSES.forEach((d) => {
      const base = d.k == 'prot' ? 'Proteção leve' : d.k == 'acc' ? 'Utensílio' : d.k == 'corpo' ? 'Faca' : 'Pistola';
      const c = mk('Combatente', 40, {}, [base]);
      const nm = d.el == 'Varia' ? 'Proteção Elemental (Energia)' : d.n;
      curList(0); if (bad(modalHtml()) || !modalHtml().includes(d.n)) falhas.push('curList ' + d.n);
      curInfo(0, d.n); if (bad(modalHtml()) || !modalHtml().includes(d.n)) falhas.push('curInfo ' + d.n);
      curAdd(0, nm);
      if (!c.inv[0].cur.includes(nm)) falhas.push('curAdd ' + d.n);
      S.v = 'sheet'; S.tab = 2; R(); if (bad(document.querySelector('#app').innerHTML)) falhas.push('inventário ' + d.n);
      S.tab = 1; R(); if (bad(document.querySelector('#app').innerHTML)) falhas.push('ações ' + d.n);
      curCard(0, 0); if (bad(modalHtml())) falhas.push('curCard ' + d.n);
      if (!(CUX[d.n] && CUX[d.n].s)) vazias.push(d.n);
      curDel(0, 0); if ((c.inv[0].cur || []).length) falhas.push('curDel ' + d.n);
    });
    T(GG, 'nenhuma maldição quebra a lista, o detalhe, as abas Ações/Inventário ou a remoção', falhas, []);
    T(GG, 'todas têm resumo para os cards', vazias, []);
  });
  safe(GG, 'item completo (modificações + 3 maldições) em todas as abas', () => {
    const c = mk('Combatente', 99, { AGI: 3, FOR: 3, INT: 3, PRE: 3, VIG: 3 }, ['Fuzil de precisão', 'Proteção pesada', 'Escudo', 'Utensílio', 'Vestimenta']);
    ['Alongada', 'Mira Laser', 'Silenciador'].forEach((m) => modAdd(0, m));
    ['Lancinante', 'Predadora', 'Sanguinária', 'Vibrante'].forEach((m) => curAdd(0, m));
    ['Cinética', 'Regenerativa'].forEach((m) => curAdd(1, m)); curAdd(2, 'Profética');
    ['Defesa', 'Potência'].forEach((m) => curAdd(3, m)); ['Vitalidade', 'Pujança'].forEach((m) => curAdd(4, m));
    const falhas = [];
    ['sheet'].forEach(() => [0, 1, 2, 3].forEach((t) => { S.v = 'sheet'; S.tab = t; R(); if (bad(document.querySelector('#app').innerHTML)) falhas.push('aba ' + t); }));
    T(GG, 'ficha NEX 99% totalmente melhorada: abas 0–3 sem undefined/NaN', falhas, []);
    const k = K(c);
    B(GG, 'valores finais coerentes (Defesa, PV, PE, DT numéricos)', [k.def, k.pv, k.pe, k.dt].every((v) => Number.isFinite(v) && v > 0), J([k.def, k.pv, k.pe, k.dt]));
    B(GG, 'categoria da arma tem algarismo romano (cat ' + ecat(c, c.inv[0]) + ')', RM[ecat(c, c.inv[0])] !== undefined, '');
    const w = weff(c, c.inv[0]); B(GG, 'arma completa: ataque, dano e margem finitos', Number.isFinite(w.ab) && Number.isFinite(w.c) && !!w.d, J({ ab: w.ab, c: w.c, d: w.d }));
  });
  safe(GG, 'dados salvos: maldições, efeito ativo e desfazer', () => {
    const c = mk('Combatente', 40, {}, ['Faca']);
    curAdd(0, 'Senciente'); c.pe = 10; curUse(0, 0);
    const salvo = JSON.parse(localStorage.getItem('op') || '{}'); const sc = ((salvo.chars || []).find((x) => x.id == c.id)) || {};
    B(GG, 'maldição e efeito ativo foram salvos no armazenamento local', (sc.inv || [{}])[0].cur && (sc.inv[0].cur || []).includes('Senciente') && (sc.sust || []).length == 1, J({ cur: (sc.inv || [{}])[0].cur, sust: (sc.sust || []).length }));
    undo(); T(GG, 'desfazer volta ao estado anterior (PE de volta e sem efeito ativo)', [c.pe, (c.sust || []).length], [10, 0]);
    // ficha antiga sem a lista sust
    const c2 = mk('Combatente', 40, {}, ['Faca']); delete c2.sust; curAdd(0, 'Senciente'); c2.pe = 5;
    let erro = ''; try { curUse(0, 0); } catch (e) { erro = e.message; }
    T(GG, 'ficha antiga (sem lista de efeitos) ativa a Senciente sem erro', [erro, (c2.sust || []).length], ['', 1]);
  });
  safe(GG, 'maldição em item removido/duplicado', () => {
    const c = mk('Combatente', 10, {}, ['Faca', 'Faca']); curAdd(0, 'Lancinante');
    T(GG, 'duas facas: a maldição só vai na escolhida', [(c.inv[0].cur || []).length, (c.inv[1].cur || []).length], [1, 0]);
    c.inv.splice(0, 1); S.v = 'sheet'; S.tab = 2; R(); B(GG, 'remover o item amaldiçoado não quebra as telas', !bad(document.querySelector('#app').innerHTML), '');
  });
  return R_;
})();
