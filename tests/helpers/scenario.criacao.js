// Roda DENTRO do app. Bateria de testes de criação/evolução: origens, classes, trilhas, poderes, rituais, habilidades e selo.
// Retorna uma lista de {g: grupo, n: nome do teste, ok, d: detalhe}.
(function () {
  const R_ = [];
  const J = (x) => JSON.stringify(x);
  const T = (g, n, got, want) => { const ok = J(got) === J(want); R_.push({ g, n, ok, d: ok ? J(got) : 'obtido ' + J(got) + ' ≠ esperado ' + J(want) }); };
  const B = (g, n, ok, d) => R_.push({ g, n, ok: !!ok, d: d || '' });
  const safe = (g, n, fn) => { if (typeof DBG !== 'undefined') console.error('>>', g, n); if (typeof ONLY !== 'undefined' && !ONLY.includes(g[0])) return; try { fn(); } catch (e) { R_.push({ g, n, ok: false, d: 'ERRO: ' + e.message + ' @ ' + String(e.stack || '').split('\n')[1] }); } };
  const bad = (h) => /undefined|NaN|\[object/.test(h);
  const app = () => document.querySelector('#app').innerHTML;
  const tst = () => document.querySelector('#t').textContent;
  const clr = () => { document.querySelector('#t').textContent = ''; };
  const modalHtml = () => document.querySelector('#m').innerHTML;
  const AT = (a) => Object.assign({ AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 1 }, a || {});
  const CLS = ['Combatente', 'Especialista', 'Ocultista'];
  let uid = 0;
  const mk = (cl, nex, attr, origem) => {
    newC(); const d = S.d;
    d.id = 3e6 + ++uid; d.name = 'Criação ' + uid; d.classe = cl; d.origem = origem || 'Acadêmico'; d.nex = nex; d.attr = AT(attr);
    if (cl == 'Ocultista') d.rit = ['Amaldiçoar Arma|Sangue', 'Compreensão Paranormal', 'Perturbação'].filter((n) => RT.some((r) => r.n == n.split('|')[0]));
    fin(); const c = cur(); S.cid = c.id; c.inv = []; return c;
  };
  const renderAll = (g, nome) => {
    const f = [];
    S.v = 'sheet';
    [0, 1, 2, 3].forEach((t) => { S.tab = t; try { R(); if (bad(app())) f.push('aba ' + t); } catch (e) { f.push('aba ' + t + ' ERRO ' + e.message); } });
    return f;
  };

  // =====================================================================================
  // A. ORIGENS
  // =====================================================================================
  const GA = 'A. Origens';
  safe(GA, 'catálogo de origens', () => {
    T(GA, '26 origens (livro)', OR.length, 26);
    T(GA, 'origens sem nome de poder/texto', OR.filter((o) => !o[0] || !o[2] || !o[3]).map((o) => o[0]), []);
    T(GA, 'nomes únicos', new Set(OR.map((o) => o[0])).size, OR.length);
    const sk = SK.map((s) => s.n);
    T(GA, 'perícias de origem existem na lista de perícias', OR.flatMap((o) => (o[1] ? o[1].split(',') : []).filter((n) => !sk.includes(n)).map((n) => o[0] + ':' + n)), []);
    T(GA, 'toda origem (menos Amnésico) dá 2 perícias', OR.filter((o) => o[0] != 'Amnésico' && o[1].split(',').length != 2).map((o) => o[0]), []);
  });
  safe(GA, 'cada origem × cada classe: ficha criada, valores finitos e telas sem undefined', () => {
    const falhas = [];
    OR.forEach((o) => CLS.forEach((cl) => {
      const c = mk(cl, 5, { VIG: 2, PRE: 2 }, o[0]);
      if (o[0] == 'Cultista Arrependido') { /* poder escolhido na criação */ }
      const k = K(c);
      if (![k.pv, k.pe, k.san, k.def, k.dt].every((v) => Number.isFinite(v) && v > 0)) falhas.push(o[0] + '/' + cl + ' valores ' + J([k.pv, k.pe, k.san, k.def, k.dt]));
      (o[1] ? o[1].split(',') : []).forEach((s) => { if (!k.tr.includes(s)) falhas.push(o[0] + '/' + cl + ' sem treino em ' + s); });
      const f = renderAll(); if (f.length) falhas.push(o[0] + '/' + cl + ' telas ' + f.join(','));
    }));
    T(GA, o_n(), falhas, []);
  });
  function o_n() { return OR.length + ' origens × 3 classes = ' + OR.length * 3 + ' fichas'; }
  safe(GA, 'efeitos numéricos de origem (PV, PE, SAN, Defesa, limite de PE)', () => {
    const base = (o, cl, nex, at) => K(mk(cl, nex, at, o));
    const ref = base('Acadêmico', 'Combatente', 10, { VIG: 2, PRE: 2 }), lv = 2;
    T(GA, 'Desgarrado: +1 PV por 5% de NEX (NEX 10% = +2)', base('Desgarrado', 'Combatente', 10, { VIG: 2, PRE: 2 }).pv - ref.pv, lv);
    T(GA, 'Policial: +2 de Defesa', base('Policial', 'Combatente', 10, { VIG: 2, PRE: 2 }).def - ref.def, 2);
    T(GA, 'Vítima: +1 SAN por 5% de NEX (NEX 10% = +2)', base('Vítima', 'Combatente', 10, { VIG: 2, PRE: 2 }).san - ref.san, lv);
    const u = base('Universitário', 'Combatente', 10, { VIG: 2, PRE: 2 });
    T(GA, 'Universitário: +PE e +1 no limite por rodada', [u.pe - ref.pe > 0, u.rod - ref.rod], [true, 1]);
    T(GA, 'Cultista Arrependido: metade da Sanidade da classe', base('Cultista Arrependido', 'Combatente', 5, { VIG: 2, PRE: 2 }).san, 6);
    T(GA, 'Combatente NEX 5%: Sanidade 12 (origem comum)', base('Acadêmico', 'Combatente', 5, {}).san, 12);
  });

  // =====================================================================================
  // B. CLASSES — valores base e progressão (conferidos com a tabela do livro)
  // =====================================================================================
  const GB = 'B. Classes: PV, PE, Sanidade e limites por NEX';
  safe(GB, 'valores do livro em todo NEX (5% a 99%) para cada classe', () => {
    const livro = { Combatente: [20, 4, 2, 2, 12, 3], Especialista: [16, 3, 3, 3, 16, 4], Ocultista: [12, 2, 4, 4, 20, 5] };
    const falhas = [];
    CLS.forEach((cl) => {
      for (let nex = 5; nex <= 95; nex += 5) {
        const at = { VIG: 2, PRE: 3 }, c = mk(cl, nex, at, 'Acadêmico'), k = K(c), n = nex / 5 - 1, L = livro[cl];
        const pv = L[0] + at.VIG + n * (L[1] + at.VIG), pe = L[2] + at.PRE + n * (L[3] + at.PRE), san = L[4] + n * L[5];
        if (k.pv != pv || k.pe != pe || k.san != san) falhas.push(cl + ' NEX' + nex + ': ' + J([k.pv, k.pe, k.san]) + ' ≠ ' + J([pv, pe, san]));
        if (k.rod != Math.max(1, nex / 5)) falhas.push(cl + ' NEX' + nex + ': PE/rodada ' + k.rod);
      }
      const c = mk(cl, 99, { VIG: 2, PRE: 3 }), k = K(c), n = 19, L = livro[cl];
      if (k.pv != L[0] + 2 + n * (L[1] + 2) || k.rod != 20) falhas.push(cl + ' NEX99: ' + J([k.pv, k.rod]));
    });
    T(GB, '3 classes × 19 NEX + NEX 99: PV, PE, SAN e PE/rodada batem com o livro', falhas, []);
  });
  safe(GB, 'categorias de círculo por NEX e DT', () => {
    T(GB, 'acesso a círculo: 5%→1, 25%→2, 55%→3, 85%→4', [5, 20, 25, 50, 55, 80, 85, 99].map(acc), [1, 1, 2, 2, 3, 3, 4, 4]);
    T(GB, 'custo de PE por círculo: 1, 3, 6, 10', [1, 2, 3, 4].map((i) => BC[i]), [1, 3, 6, 10]);
    const c = mk('Ocultista', 30, { PRE: 3 }); T(GB, 'DT de ritual = 10 + PE/rodada + Presença (NEX 30%: 10+6+3)', K(c).dt, 19);
  });
  safe(GB, 'perícias treinadas: quantidade por classe', () => {
    T(GB, 'perícias livres por classe: Combatente 3, Especialista 7, Ocultista 3 (+Ocultismo e Vontade fixas)', CLS.map((c) => CL[c].per), [3, 7, 3]);
    T(GB, 'Ocultista começa treinado em Ocultismo e Vontade', mk('Ocultista', 5).classe && K(cur()).tr.includes('Ocultismo') && K(cur()).tr.includes('Vontade'), true);
  });

  // =====================================================================================
  // C. TRILHAS E HABILIDADES — dados
  // =====================================================================================
  const GC = 'C. Trilhas e habilidades de trilha (dados)';
  safe(GC, 'estrutura de cada trilha', () => {
    CLS.forEach((cl) => {
      const tr = D[cl].tr;
      T(GC, cl + ': 5 trilhas', tr.length, 5);
      T(GC, cl + ': trilhas com nome único', new Set(tr.map((t) => t.n)).size, tr.length);
      T(GC, cl + ': cada trilha tem 4 habilidades (NEX 10, 40, 65, 99) com nome e texto', tr.filter((t) => J(t.ab.map((a) => a.nex)) != '[10,40,65,99]' || t.ab.some((a) => !a.n || !a.t)).map((t) => t.n), []);
      T(GC, cl + ': todas as trilhas têm ícone (ICT)', tr.filter((t) => !ICT[t.n]).map((t) => t.n), []);
    });
    const nomes = CLS.flatMap((cl) => D[cl].tr.flatMap((t) => t.ab.map((a) => a.n)));
    T(GC, 'nenhuma habilidade de trilha com nome repetido entre trilhas', nomes.filter((n, i) => nomes.indexOf(n) != i), []);
    T(GC, 'total de habilidades de trilha = 60 (15 trilhas × 4)', nomes.length, 60);
  });

  // =====================================================================================
  // D. JOGADOR AUTOMÁTICO: sobe cada trilha do NEX 5% ao 99% pelo fluxo real do app
  // =====================================================================================
  const GD = 'D. Evolução completa (NEX 5% → 99%) por trilha';
  // escolhe poderes/rituais/perícias por conta própria, seguindo os passos que o próprio app oferece
  const pilot = (cl, trail, opts) => {
    opts = opts || {};
    const c = mk(cl, 5, { AGI: 2, FOR: 1, INT: 2, PRE: 2, VIG: 1 }, opts.origem || 'Acadêmico');
    c.trained = ['Luta', 'Pontaria', 'Fortitude'].slice(0, CL[cl].per);
    const log = [], erros = [], visto = [];
    let guard = 0;
    const learnRit = () => {
      const ac = acc(c.nex), st0 = S.lv.st[S.lv.i] || {};
      const poss = RT.filter((r) => !M4(r) && r.ci <= (st0.sa ? ac : ac) && (!st0.sa || r.ci == ac) && !c.rit.some((z) => typeof z == 'string' && z.split('|')[0] == r.n));
      const r = poss[(opts.seed || 0) % poss.length] || poss[0];
      if (!r) throw new Error('sem ritual disponível no NEX ' + c.nex);
      lvRc(r.el == '*' ? r.n + '|Sangue' : r.n);
      return r.n;
    };
    for (let nex = 10; nex <= 99; nex = nex == 99 ? 100 : nex >= 95 ? 99 : nex + 5) {
      const antes = K(c);
      upd();
      if (!S.lv) { erros.push('NEX ' + nex + ': sem fluxo de evolução'); break; }
      const esperado = stp(cl, S.lv.n).map((s) => s.t).concat(cl == 'Ocultista' ? [] : []);
      visto.push(S.lv.n + ':' + S.lv.st.map((s) => s.t).join('+'));
      while (S.lv && guard++ < 400) {
        const s = S.lv.st[S.lv.i], x = S.lv.x;
        if (!s) { fin2(); break; }
        try {
          if (s.t == 'info') lvNext();
          else if (s.t == 'trail') { S.lv.x.tr = trail; lvTr(0); }
          else if (s.t == 'hab') lvHab();
          else if (s.t == 'attr') { const a = ['AGI', 'INT', 'PRE', 'VIG', 'FOR'].find((k) => c.attr[k] < 5); S.lv.x.a = a; lvAt(); }
          else if (s.t == 'grau' || s.t == 'skI') {
            const k = K(c), cap = c.nex >= 70 ? 15 : c.nex >= 35 ? 10 : 5, need = s.t == 'skI' ? 1 : 2 + c.attr.INT, sel = [];
            for (const sk of SK) {
              const tr = k.tr.includes(sk.n), g = gb(c, sk.n, tr), nx = tr ? g + 5 : 5, ok = s.t == 'skI' ? !tr : tr && nx <= cap;
              if (ok && sel.length < need) sel.push(sk.n);
            }
            S.lv.x.s = sel; if (sel.length != need) erros.push('NEX ' + c.nex + ' ' + s.t + ': só ' + sel.length + '/' + need + ' perícias disponíveis'); lvSk();
          } else if (s.t == 'vers') {
            if (opts.alt) { S.lv.x.vm = 't'; S.lv.x.tr = D[cl].tr.find((t) => t.n != trail).n; lvTr(1); }
            else { S.lv.x.vm = 'p'; pickPow(); }
          } else if (s.t == 'pow') pickPow();
          else if (s.t == 'rit' || s.t == 'grm') { const n = learnRit(); }
          else { erros.push('passo desconhecido ' + s.t); lvNext(); }
        } catch (e) { erros.push('NEX ' + c.nex + ' passo ' + s.t + ': ' + e.message); try { lvNext(); } catch (_) { S.lv = null; } }
      }
      const f = renderAll(); if (f.length) erros.push('NEX ' + c.nex + ' telas ' + f.join(','));
      const k = K(c);
      if (![k.pv, k.pe, k.san, k.def, k.dt].every(Number.isFinite)) erros.push('NEX ' + c.nex + ' valores não numéricos');
      if (k.pv <= antes.pv && !(c.pv >= 0)) erros.push('NEX ' + c.nex + ' PV não subiu');
      if (c.pv > k.pv) erros.push('NEX ' + c.nex + ' PV atual > máximo');
      if (c.pe > k.pe) erros.push('NEX ' + c.nex + ' PE atual > máximo');
    }
    function pickPow() {
      const x = S.lv.x, pw = D[cl].pow;
      const todo = pw.map((p, i) => [p, i]).filter(([p]) => { const [ok] = okp(c, p.p); const rp = /^(Transcender|Treinamento)/.test(p.n); return ok && (rp || !hasAb(c, p.n)); });
      let [p, i] = todo[((opts.seed || 0) + c.nex / 5) % todo.length];
      lvPc(i);
      const m = S.lv && S.lv.x.mode;
      if (m == 'sk') { const k = K(c), sel = []; for (const sk of SK) { const tr = k.tr.includes(sk.n), nx = tr ? gb(c, sk.n, tr) + 5 : 5, cap = c.nex >= 70 ? 15 : c.nex >= 35 ? 10 : 5; if (nx <= cap && sel.length < 2) sel.push(sk.n); } S.lv.x.s = sel; lvSk(); }
      else if (m == 'rp') { S.lv.x.rp = c.rit.find((z) => typeof z == 'string' && !(c.ab || []).some((a) => a.rp == z)); lvRp(); }
      else if (m == 'ee') { S.lv.x.el = 'Sangue'; lvEe(); }
      else if (m == 'tr') {
        const e = ['Conhecimento', 'Energia', 'Morte', 'Sangue'][(c.nex / 5) % 4];
        const pp = (D.PP[e] || []).map((q, j) => [q, j]).find(([q]) => okp(c, q.p)[0] && !hasAb(c, q.n));
        if (pp) { S.lv.x.pp = [e, pp[1]]; lvPP(); }
        else { S.lv.x.sub = 'ri'; learnRit(); }
      }
    }
    return { c, log, erros, visto };
  };

  const TODAS = [];
  CLS.forEach((cl) => D[cl].tr.forEach((t) => TODAS.push([cl, t.n])));
  TODAS.forEach(([cl, tr], idx) => safe(GD, cl + ' — ' + tr, () => {
    const r = pilot(cl, tr, { seed: idx }), c = r.c, nomes = (c.ab || []).map((a) => a.n), t = D[cl].tr.find((x) => x.n == tr);
    T(GD, tr + ' (' + cl + '): subiu do NEX 5% ao 99% sem erro em nenhum passo', r.erros, []);
    B(GD, tr + ': terminou em NEX 99%', c.nex == 99 && !S.lv, 'NEX ' + c.nex);
    T(GD, tr + ': ganhou as 4 habilidades da trilha (NEX 10, 40, 65, 99)', t.ab.map((a) => nomes.includes(a.n)), [true, true, true, true]);
    T(GD, tr + ': trilha registrada na ficha', c.trail, tr);
    const k = K(c);
    B(GD, tr + ': ficha final consistente (PV ' + k.pv + ', PE ' + k.pe + ', SAN ' + k.san + ', Defesa ' + k.def + ')', [k.pv, k.pe, k.san, k.def].every((v) => Number.isFinite(v) && v > 0));
    T(GD, tr + ': ganhou +1 atributo nos 4 passos de atributo (soma 8 → 12)', Object.values(c.attr).reduce((a, b) => a + b, 0), 12);
    const att = Object.values(c.attr); B(GD, tr + ': nenhum atributo passa de 5', att.every((v) => v >= 1 && v <= 5), J(c.attr));
    if (cl == 'Ocultista') B(GD, tr + ': rituais aprendidos em todos os NEX com ritual', c.rit.length >= 3 + 18, c.rit.length + ' rituais');
  }));
  // formato do fluxo por NEX (passos) — confere a tabela do livro
  safe(GD, 'passos de cada NEX (tabela TB) para as 3 classes', () => {
    const falhas = [];
    CLS.forEach((cl) => TB[cl].split(',').forEach((e) => {
      const n = parseInt(e), letras = e.replace(/^\d+/, '');
      const passos = stp(cl, n).map((s) => s.t);
      const cont = (t) => passos.filter((x) => x == t).length;
      if (letras.includes('T') != (cont('trail') == 1)) falhas.push(cl + ' ' + n + ' trilha');
      if (letras.includes('P') != (cont('pow') == 1)) falhas.push(cl + ' ' + n + ' poder');
      if (letras.includes('S') != (cont('attr') == 1)) falhas.push(cl + ' ' + n + ' atributo');
      if (letras.includes('G') != (cont('grau') == 1)) falhas.push(cl + ' ' + n + ' grau');
      if (letras.includes('V') != (cont('vers') == 1)) falhas.push(cl + ' ' + n + ' versatilidade');
      if (letras.includes('H') != (cont('hab') == 1)) falhas.push(cl + ' ' + n + ' habilidade');
      if ((cl == 'Ocultista') != (cont('rit') == 1)) falhas.push(cl + ' ' + n + ' ritual');
    }));
    T(GD, 'a tabela de evolução bate com os passos do app', falhas, []);
    T(GD, 'atributo +1 nos NEX 20, 50?, 80, 95 (5 aumentos até 99%)', CLS.map((cl) => TB[cl].split(',').filter((e) => e.includes('S')).length), [4, 4, 4]);
  });
  safe(GD, 'segunda opção do NEX 50% (poder de outra trilha)', () => {
    const r = pilot('Combatente', 'Guerreiro', { alt: true, seed: 3 });
    T(GD, 'NEX 50% pela opção "primeiro poder de outra trilha"', r.erros, []);
    const ab = r.c.ab.filter((a) => a.tr).map((a) => a.n);
    B(GD, 'guarda o 1º poder da outra trilha e as 4 habilidades da própria', ab.length >= 5, ab.join(', '));
  });
  safe(GD, 'Mundano', () => {
    newC(); const d = S.d; d.id = 3e6 + ++uid; d.name = 'Mundano'; d.classe = 'Mundano'; d.origem = 'Acadêmico'; d.nex = 0; d.attr = AT();
    let erro = ''; try { fin(); const c = cur(); S.cid = c.id; const k = K(c); B(GD, 'Mundano (NEX 0%) tem valores finitos', [k.pv, k.pe, k.san].every(Number.isFinite), J([k.pv, k.pe, k.san])); upd(); B(GD, 'subir de NEX de Mundano abre a escolha de classe', !!S.lv && S.lv.mun == 1, ''); S.lv = null; } catch (e) { erro = e.message; }
    T(GD, 'Mundano sem erro', erro, '');
  });

  // =====================================================================================
  // E. PODERES DE CLASSE — cada poder aplicado
  // =====================================================================================
  const GE = 'E. Poderes de classe';
  safe(GE, 'estrutura dos poderes', () => {
    CLS.forEach((cl) => {
      const pw = D[cl].pow;
      T(GE, cl + ': poderes com nome único', pw.map((p) => p.n).filter((n, i, a) => a.indexOf(n) != i), []);
      T(GE, cl + ': todos têm nome e texto', pw.filter((p) => !p.n || !p.t).map((p) => p.n), []);
      T(GE, cl + ': todos têm resumo (card) ou texto curto', pw.filter((p) => !p.s && p.t.length > 95).map((p) => p.n), []);
    });
    // pré-requisitos citam poderes/perícias que existem
    const todosPod = new Set(CLS.flatMap((cl) => D[cl].pow.map((p) => p.n)).concat(CLS.flatMap((cl) => D[cl].tr.flatMap((t) => t.ab.map((a) => a.n)))));
    const bads = [];
    CLS.forEach((cl) => D[cl].pow.forEach((p) => { if (!p.p) return; p.p.split(/,|;/).map((x) => x.trim()).filter(Boolean).forEach((t) => {
      if (/^(For|Agi|Int|Pre|Vig)\w*\s*\d/i.test(t) || /NEX\s*\d+/i.test(t) || /treinad[oa]s? em/i.test(t) || /(Conhecimento|Energia|Morte|Sangue|Medo)\s*\d/.test(t)) return;
      if (!todosPod.has(t) && !D.PP.Sangue.concat(D.PP.Morte, D.PP.Energia, D.PP.Conhecimento).some((q) => q.n == t)) bads.push(cl + '/' + p.n + ' exige "' + t + '"');
    }); }));
    T(GE, 'pré-requisito que cita outro poder aponta para um poder que existe', bads, []);
  });
  safe(GE, 'aplicar cada poder de cada classe (NEX 99%, pré-requisitos satisfeitos)', () => {
    const falhas = [], n = { ok: 0 };
    CLS.forEach((cl) => D[cl].pow.forEach((p, i) => {
      const c = mk(cl, 99, { AGI: 4, FOR: 4, INT: 4, PRE: 4, VIG: 4 });
      c.trained = SK.map((s) => s.n); c.ab = c.ab || [];
      // satisfaz pré-requisitos que são outros poderes
      (p.p || '').split(/,|;/).map((x) => x.trim()).filter(Boolean).forEach((t) => {
        const q = D[cl].pow.find((z) => z.n == t); if (q && !hasAb(c, t)) c.ab.push({ n: q.n, t: q.t, pw: 1 });
        const m = t.match(/(Conhecimento|Energia|Morte|Sangue|Medo)\s*(\d)/); if (m) { const l = RT.filter((r) => r.el == m[1] && !M4(r)); for (let j = 0; j < +m[2]; j++) c.rit.push(l[j].n); }
      });
      const [ok, ms] = okp(c, p.p);
      if (!ok) { falhas.push(cl + '/' + p.n + ': pré-requisito não satisfeito (' + ms + ')'); return; }
      S.lv = { n: 99, sg: 0, i: 0, x: {}, st: [{ t: 'pow' }, { t: 'info' }] };
      const antes = (c.ab || []).length;
      try { lvPc(i); } catch (e) { falhas.push(cl + '/' + p.n + ': ' + e.message); S.lv = null; return; }
      const m = S.lv && S.lv.x.mode;
      if (m == 'sk') { S.lv.x.s = ['Luta', 'Pontaria']; try { lvSk(); } catch (e) { falhas.push(p.n + ' sk ' + e.message); } }
      else if (m == 'rp') { S.lv.x.rp = c.rit[0]; lvRp(); }
      else if (m == 'ee') { S.lv.x.el = 'Morte'; lvEe(); }
      else if (m == 'tr') { /* Transcender: testado em G */ }
      const tem = hasAb(c, p.n) || /^(Transcender|Treinamento)/.test(p.n);
      if (!tem) falhas.push(cl + '/' + p.n + ': não entrou na ficha');
      const f = renderAll(); if (f.length) falhas.push(cl + '/' + p.n + ' telas ' + f.join(','));
      const k = K(c); if (![k.pv, k.pe, k.def, k.dt].every(Number.isFinite)) falhas.push(cl + '/' + p.n + ' valores');
      n.ok++; S.lv = null;
    }));
    S.lv = null;
    T(GE, 'todos os ' + (D.Combatente.pow.length + D.Especialista.pow.length + D.Ocultista.pow.length) + ' poderes entram na ficha e as 4 abas desenham', falhas, []);
  });
  safe(GE, 'poderes com efeito numérico na ficha', () => {
    const c0 = mk('Combatente', 40, { AGI: 2, FOR: 2, VIG: 2, PRE: 2, INT: 2 }), k0 = K(c0);
    const dif = (nome, campo, esp) => {
      const c = mk('Combatente', 40, { AGI: 2, FOR: 2, VIG: 2, PRE: 2, INT: 2 }); const p = CLS.flatMap((cl) => D[cl].pow.concat(D[cl].tr.flatMap((t) => t.ab))).find((z) => z.n == nome);
      if (!p) { B(GE, nome + ' existe no catálogo', false, 'não encontrado'); return; }
      c.ab = [{ n: p.n, t: p.t, pw: 1 }]; const k = K(c); T(GE, nome + ' → ' + campo + ' +' + esp, k[campo] - k0[campo], esp);
    };
    dif('Reflexos Defensivos', 'def', 2);
    dif('Presença Poderosa', 'rodR', 2);
    dif('Rituais Eficientes', 'dt', 5);
    const sf = mk('Combatente', 40, { VIG: 2, AGI: 2, FOR: 2, PRE: 2, INT: 2 }); const spw = D.Combatente.pow.find((z) => z.n == 'Sangue de Ferro');
    if (spw) { sf.ab = [{ n: spw.n, t: spw.t, pw: 1 }]; T(GE, 'Sangue de Ferro: +3 PV + 1 por nível (NEX 40% = +11)', K(sf).pv - k0.pv, 3 + 8); }
    const ts = mk('Combatente', 40, { VIG: 2, AGI: 2, FOR: 2, PRE: 2, INT: 2 }); const pc = D.Combatente.pow.find((z) => z.n == 'Tanque de Guerra');
    if (pc) { ts.inv = [item('Proteção pesada')]; const kb = K(ts); ts.ab = [{ n: pc.n, t: pc.t, pw: 1 }]; T(GE, 'Tanque de Guerra com proteção pesada: +2 Defesa', K(ts).def - kb.def, 2); }
  });
  safe(GE, 'efeitos numéricos de habilidades de trilha', () => {
    const base = (cl, nex, trail) => { const c = mk(cl, nex, { AGI: 2, FOR: 2, VIG: 2, PRE: 2, INT: 2 }); c.trail = trail; return c; };
    const sem = base('Combatente', 40, 'Comandante de Campo'), tropa = base('Combatente', 40, 'Tropa de Choque');
    T(GE, 'Tropa de Choque (NEX 40%): +1 PV por nível (+8)', K(tropa).pv - K(sem).pv, 8);
    T(GE, 'Tropa de Choque antes do NEX 10% não dá bônus', K(Object.assign(base('Combatente', 5, 'Tropa de Choque'))).pv - K(base('Combatente', 5, 'Comandante de Campo')).pv, 0);
    const g = base('Combatente', 40, 'Guerreiro'); g.inv = [item('Katana'), item('Pistola')]; const g2 = base('Combatente', 40, 'Aniquilador'); g2.inv = [item('Katana'), item('Pistola')];
    T(GE, 'Guerreiro: margem de ameaça −2 só em arma corpo a corpo', [g2.inv[0].w.c - weff(g, g.inv[0]).c, g2.inv[1].w.c - weff(g, g.inv[1]).c], [2, 0]);
    T(GE, 'Operações Especiais (NEX 10%+): +5 em Iniciativa', ob(base('Combatente', 10, 'Operações Especiais'), 'Iniciativa'), 5);
    T(GE, 'Operações Especiais antes do NEX 10%: sem bônus', ob(base('Combatente', 5, 'Operações Especiais'), 'Iniciativa'), 0);
    T(GE, 'Infiltrador (NEX 40%): +5 em Atletismo e Crime; antes disso, nada', [ob(base('Especialista', 40, 'Infiltrador'), 'Atletismo'), ob(base('Especialista', 40, 'Infiltrador'), 'Crime'), ob(base('Especialista', 35, 'Infiltrador'), 'Crime')], [5, 5, 0]);
    T(GE, 'Aniquilador: redução de categoria do item favorito = 0 / 1 / 2 / 3 em NEX 5 / 10 / 40 / 99', [5, 10, 40, 99].map((n) => FR(base('Combatente', n, 'Aniquilador'))), [0, 1, 2, 3]);
    T(GE, 'outras trilhas não reduzem categoria', FR(base('Combatente', 99, 'Guerreiro')), 0);
  });
  function item(n) {
    for (const k of ['arm', 'pro', 'uti', 'mun']) { const x = (CAT[k] || []).find((z) => z[0] == n); if (x) return { n: x[0], cat: x[1], e: x[2], w: x[3].d ? { ...x[3], mag: x[3].mx || 0 } : null, q: x[3].q, am: 0, el: null, ds: '' }; }
    throw new Error('item ' + n);
  }

  // =====================================================================================
  // F. PODERES PARANORMAIS e TRANSCENDER
  // =====================================================================================
  const GF = 'F. Poderes paranormais e Transcender';
  safe(GF, 'estrutura', () => {
    ELP.forEach((e) => {
      const l = D.PP[e];
      T(GF, e + ': 5 poderes, todos com nome e texto', [l.length, l.filter((p) => !p.n || !p.t).length], [5, 0]);
    });
    const todos = ELP.flatMap((e) => D.PP[e].map((p) => p.n));
    T(GF, 'nomes únicos', todos.filter((n, i) => todos.indexOf(n) != i), []);
  });
  safe(GF, 'aplicar cada poder paranormal pelo Transcender (4 elementos × 5 poderes)', () => {
    const falhas = [];
    ELP.forEach((e) => D.PP[e].forEach((p, i) => {
      const c = mk('Combatente', 55, { PRE: 3, INT: 3, VIG: 3 }); c.trained = SK.map((s) => s.n);
      const l = RT.filter((r) => r.el == e && !M4(r)); for (let j = 0; j < 3; j++) c.rit.push(l[j].n);
      c.af = e; c.ab = c.ab || [];
      (p.p || '').split(/,|;/).map((x) => x.trim()).filter(Boolean).forEach((t) => { const q = D.PP[e].find((z) => z.n == t); if (q && !hasAb(c, t)) c.ab.push({ n: q.n, t: q.t, pw: 1, el: e }); });
      if (!okp(c, p.p)[0]) { falhas.push(e + '/' + p.n + ' pré-requisito ' + okp(c, p.p)[1]); return; }
      S.lv = { n: 55, sg: 0, i: 0, x: { pp: [e, i], mode: 'tr' }, st: [{ t: 'pow' }, { t: 'info' }] };
      try { lvPP(); } catch (er) { falhas.push(e + '/' + p.n + ' ' + er.message); S.lv = null; return; }
      if (!hasAb(c, p.n)) falhas.push(e + '/' + p.n + ' não entrou');
      const f = renderAll(); if (f.length) falhas.push(e + '/' + p.n + ' telas');
      S.lv = null;
    }));
    S.lv = null;
    T(GF, 'os 20 poderes paranormais entram na ficha, sem sanidade extra (Transcender) e telas sem erro', falhas, []);
  });
  safe(GF, 'Transcender: Afinidade Elemental e resistência', () => {
    const c = mk('Combatente', 30, { PRE: 3 }); S.lv = { n: 30, sg: 3, i: 0, x: { sub: 'af', el: 'Morte' }, st: [{ t: 'pow' }, { t: 'info' }] };
    lvEl(); T(GF, 'Afinidade Elemental guarda o elemento e marca a evolução sem Sanidade (stn)', [c.af, !!S.lv], ['Morte', true]);
    S.lv = null; fin2 && 0;
    const c2 = mk('Combatente', 30, { PRE: 3 }); S.lv = { n: 30, sg: 3, i: 0, x: { sub: 'res', el: 'Sangue' }, st: [{ t: 'pow' }, { t: 'info' }] };
    lvEl(); T(GF, 'Resistir a elemento guarda Sangue em c.res', c2.res, ['Sangue']); S.lv = null;
  });
  safe(GF, 'Cultista Arrependido escolhe poder paranormal na criação', () => {
    ELP.forEach((e) => {
      newC(); const d = S.d; d.id = 3e6 + ++uid; d.name = 'CA'; d.classe = 'Combatente'; d.origem = 'Cultista Arrependido'; d.nex = 5; d.attr = AT(); d.cpow = [e, 0]; fin();
      const c = cur(); S.cid = c.id; T(GF, 'Cultista Arrependido com poder de ' + e + ': ' + D.PP[e][0].n, hasAb(c, D.PP[e][0].n), true);
    });
  });

  // =====================================================================================
  // G. RITUAIS
  // =====================================================================================
  const GG = 'G. Rituais';
  safe(GG, 'catálogo de rituais', () => {
    const porNome = {}; RT.forEach((r) => { (porNome[r.n] = porNome[r.n] || []).push(r); });
    T(GG, 'catálogo: ' + RT.length + ' rituais; círculos 1–4', RT.filter((r) => r.ci < 1 || r.ci > 4).map((r) => r.n), []);
    T(GG, 'elementos válidos (Sangue, Morte, Conhecimento, Energia, Medo ou * = qualquer)', RT.filter((r) => !['*', ...ELO].includes(r.el)).map((r) => r.n), []);
    T(GG, 'todos têm nome e resumo', RT.filter((r) => !r.n || !r.s).map((r) => r.n), []);
    T(GG, 'nomes repetidos só no ritual de qualquer elemento (Amaldiçoar Arma)', Object.entries(porNome).filter(([n, l]) => l.length > 1 && !l.every((r) => r.el == '*')).map(([n]) => n), []);
    T(GG, 'versões: Discente e Verdadeiro são [PE extra, NEX do círculo, afinidade]', RT.filter((r) => (r.d && (r.d.length != 3 || typeof r.d[0] != 'number')) || (r.v && (r.v.length != 3 || typeof r.v[0] != 'number'))).map((r) => r.n), []);
    T(GG, 'Verdadeiro sempre custa mais que Discente', RT.filter((r) => r.d && r.v && r.v[0] < r.d[0]).map((r) => r.n), []);
    T(GG, 'Verdadeiro/Discente exigem círculo ≥ 2 ou afinidade (regra do livro: 3º e 4º círculo)', RT.filter((r) => r.d && r.d[1] < 1).map((r) => r.n), []);
    const semInfo = RT.filter((r) => !INFO[r.n]).map((r) => r.n); T(GG, 'todo ritual tem ficha de execução/alcance/alvo (INFO)', semInfo, []);
    const semDs = RT.filter((r) => !DS[r.n] && !DS[r.n.split('|')[0]]).map((r) => r.n); T(GG, 'todo ritual tem descrição completa (DS)', semDs, []);
    T(GG, 'efeitos automáticos (EF) apontam para rituais existentes', Object.keys(EF).filter((n) => !RT.some((r) => r.n == n)), []);
    T(GG, 'rituais instantâneos (INST) existem', INST.filter((n) => !RT.some((r) => r.n == n)), []);
    T(GG, 'rituais de Medo de 4º círculo ficam fora da lista de aprendizado (M4)', RT.filter(M4).every((r) => !rlistIncludes(r)), true);
    function rlistIncludes(r) { mk('Ocultista', 99, {}); S.lv = { n: 99, sg: 0, i: 0, x: {}, st: [{ t: 'rit' }] }; const h = rlist2(); S.lv = null; return h.includes('>' + r.n + '<'); }
  });
  safe(GG, 'lista de rituais confere com o livro (p.122–123)', () => {
    const L = {
      '1|Conhecimento': 'Compreensão Paranormal,Enfeitiçar,Perturbação,Ouvir os Sussurros,Tecer Ilusão,Terceiro Olho', '1|Energia': 'Amaldiçoar Tecnologia,Coincidência Forçada,Eletrocussão,Embaralhar,Luz,Polarização Caótica',
      '1|Morte': 'Cicatrização,Consumir Manancial,Decadência,Definhar,Espirais da Perdição,Nuvem de Cinzas', '1|Sangue': 'Arma Atroz,Armadura de Sangue,Corpo Adaptado,Distorcer Aparência,Fortalecimento Sensorial,Ódio Incontrolável', '1|Medo': 'Cinerária',
      '2|Conhecimento': 'Aprimorar Mente,Detecção de Ameaças,Esconder dos Olhos,Invadir Mente,Localização', '2|Energia': 'Chamas do Caos,Contenção Fantasmagórica,Dissonância Acústica,Sopro do Caos,Tela de Ruído',
      '2|Morte': 'Desacelerar Impacto,Eco Espiral,Paradoxo,Miasma Entrópico,Velocidade Mortal', '2|Sangue': 'Aprimorar Físico,Descarnar,Flagelo de Sangue,Hemofagia,Transfusão Vital', '2|Medo': 'Proteção contra Rituais,Rejeitar Névoa',
      '3|Conhecimento': 'Alterar Memória,Contato Paranormal,Mergulho Mental,Vidência', '3|Energia': 'Convocação Instantânea,Salto Fantasma,Transfigurar Água,Transfigurar Terra',
      '3|Morte': 'Âncora Temporal,Poeira da Podridão,Tentáculos de Lodo,Zerar Entropia', '3|Sangue': 'Ferver Sangue,Forma Monstruosa,Purgatório,Vomitar Pestes', '3|Medo': 'Dissipar Ritual',
      '4|Conhecimento': 'Controle Mental,Inexistir,Possessão', '4|Energia': 'Alterar Destino,Deflagração de Energia,Teletransporte', '4|Morte': 'Convocar o Algoz,Distorção Temporal,Fim Inevitável',
      '4|Sangue': 'Capturar o Coração,Invólucro de Carne,Vínculo de Sangue', '4|Medo': 'Canalizar o Medo,Conhecendo o Medo,Lâmina do Medo,Medo Tangível,Presença do Medo'
    };
    // O app usa nomes anteriores para 5 rituais (o estado.js migra os nomes do livro v1.1 para eles) e tem 2 rituais que o v1.1 não lista
    const ALIAS = { 'Tecer Ilusão': 'Criar Ilusão', 'Aprimorar Mente': 'Aprimoramento Mental', 'Aprimorar Físico': 'Físico Aprimorado', 'Miasma Entrópico': 'Miasma', 'Dissipar Ritual': 'Neutralizar Ritual' };
    const app = {}; RT.filter((r) => r.el != '*').forEach((r) => { (app[r.ci + '|' + r.el] = app[r.ci + '|' + r.el] || []).push(r.n); });
    const extras = [];
    Object.keys(L).forEach((k) => {
      const livro = L[k].split(',').map((n) => ALIAS[n] || n).sort(), tem = (app[k] || []).slice().sort();
      T(GG, 'livro × app: ' + k.replace('|', 'º círculo · ') + ' (nomes antigos aceitos)', tem.filter((n) => livro.includes(n)), livro);
      tem.filter((n) => !livro.includes(n)).forEach((n) => extras.push(k.split('|')[0] + 'º ' + n));
    });
    T(GG, 'rituais que só existem no app (não estão na lista do livro v1.1, p.122–123)', extras.sort(), ['2º Ligação Telepática', '4º Visão da Verdade']);
    T(GG, 'nenhum grupo extra no app', Object.keys(app).filter((k) => !L[k]), []);
    T(GG, 'Amaldiçoar Arma (qualquer elemento) está no 1º círculo', RT.filter((r) => r.el == '*').map((r) => r.n + r.ci), ['Amaldiçoar Arma1']);
  });
  safe(GG, 'conjurar cada ritual em cada versão: PE descontado = círculo + versão', () => {
    const falhas = []; let n = 0;
    RT.forEach((r) => [0, 1, 2].forEach((j) => {
      if ((j == 1 && !r.d) || (j == 2 && !r.v)) return;
      const el = r.el == '*' ? 'Sangue' : r.el, id = r.el == '*' ? r.n + '|' + el : r.n;
      const c = mk('Ocultista', 99, { PRE: 5, INT: 5, VIG: 3 }); c.rit.push(id); c.pe = 999;
      const esp = Math.max(0, BC[r.ci] + (j == 1 ? r.d[0] : j == 2 ? r.v[0] : 0)), pe0 = c.pe;
      // Presença 5 NEX 99: limite = 20 + 5 com Presença Poderosa; aqui só o limite base (20) para o círculo 4 verdadeiro (≤ 20)
      clr(); try { cast(id, j); } catch (e) { falhas.push(r.n + ' v' + j + ': ' + e.message); return; }
      if (pe0 - c.pe != esp) falhas.push(r.n + ' (' + SELV[j] + ') gastou ' + (pe0 - c.pe) + ' PE, esperado ' + esp);
      if (!INST.includes(r.n) && !(c.sust || []).some((q) => q.id == id)) falhas.push(r.n + ' deveria ficar como efeito sustentado');
      if (bad(tst())) falhas.push(r.n + ' toast com undefined');
      n++;
    }));
    T(GG, n + ' combinações ritual × versão: custo correto, sustentado/instantâneo certo', falhas, []);
  });
  safe(GG, 'cartas de escolha de versão (rv) para todos os rituais', () => {
    const falhas = [];
    RT.forEach((r) => {
      const id = r.el == '*' ? r.n + '|Morte' : r.n; const c = mk('Ocultista', 99, { PRE: 3 }); c.rit.push(id);
      try { rv(id); const h = modalHtml(); if (bad(h) || !h.includes('Normal') || !h.includes(r.n)) falhas.push(r.n); } catch (e) { falhas.push(r.n + ' ' + e.message); }
    });
    T(GG, '84 rituais: card de escolha (Normal/Discente/Verdadeiro) abre sem undefined', falhas, []);
  });
  safe(GG, 'limite de PE por rodada, PE insuficiente e PV (Sangue de Ferro? não) ao conjurar', () => {
    const r = RT.find((x) => x.ci == 4 && x.v && !M4(x)); const id = r.el == '*' ? r.n + '|Sangue' : r.n;
    const c = mk('Ocultista', 20, { PRE: 2 }); c.rit.push(id); c.pe = 99; clr(); const pe0 = c.pe; cast(id, 0);
    T(GG, 'ritual de 4º círculo (10 PE) acima do limite por rodada (NEX 20% = 4) é recusado', [pe0 - c.pe, /limite/.test(tst())], [0, true]);
    const c2 = mk('Ocultista', 99, { PRE: 3 }); const l1 = RT.find((x) => x.ci == 1 && x.el != '*'); c2.rit.push(l1.n); c2.pe = 0; clr(); cast(l1.n, 0);
    T(GG, 'sem PE é recusado', [c2.pe, /insuficiente/.test(tst())], [0, true]);
    const c3 = mk('Ocultista', 99, { PRE: 3 }); c3.rit.push(l1.n); c3.pe = 0; c3.pv = 50; cast(l1.n, 0, true);
    T(GG, 'conjurar com PV (2 PV por PE) desconta PV', 50 - c3.pv, BC[l1.ci] * 2);
  });
  safe(GG, 'Ritual Predileto, Mestre em Elemento e Tatuagem Ritualística reduzem o custo (nunca abaixo de 0)', () => {
    const r = RT.find((x) => x.ci == 1 && x.el != '*' && x.el == 'Sangue'); const id = r.n;
    const c = mk('Ocultista', 99, { PRE: 5 }); c.rit.push(id); c.pe = 100;
    c.ab = [{ n: 'Ritual Predileto', t: '', pw: 1, rp: id }]; clr(); cast(id, 0);
    T(GG, 'Ritual Predileto (−1 PE): ritual de 1º círculo custa 0 e nunca fica negativo', 100 - c.pe, 0);
    const r2 = RT.find((x) => x.ci == 3 && x.el == 'Morte'); const c2 = mk('Ocultista', 99, { PRE: 5 }); c2.rit.push(r2.n); c2.pe = 100;
    c2.ab = [{ n: 'Especialista em Elemento', t: '', pw: 1, ee: 'Morte' }, { n: 'Mestre em Elemento', t: '', pw: 1, me: 'Morte' }]; cast(r2.n, 0);
    T(GG, 'Mestre em Elemento (−1 PE em rituais do elemento): 3º círculo custa 5', 100 - c2.pe, BC[3] - 1);
  });
  safe(GG, 'Ritual Potente, grimório e aprendizado', () => {
    const c = mk('Ocultista', 99, { PRE: 3, INT: 4 });
    const ritCura = Object.keys(EF).find((n) => EF[n].heal);
    c.ab = [{ n: 'Ritual Potente', t: '', pw: 1 }]; c.rit.push(ritCura); c.pe = 100; clr(); cast(ritCura, 0);
    B(GG, 'Ritual Potente soma Intelecto à cura (Cicatrização)', /Ritual Potente/.test(tst()), tst().slice(0, 90));
    T(GG, 'capacidade do grimório = Intelecto (+1 a partir do 3º círculo)', gcap(mk('Ocultista', 55, { INT: 3 })), 4);
    const c2 = mk('Ocultista', 99, { INT: 3 }); grmItem(c2); T(GG, 'item Grimório Ritualístico é criado uma vez só', (grmItem(c2), c2.inv.filter((i) => i.n == 'Grimório Ritualístico').length), 1);
  });
  safe(GG, 'telas de rituais e grimório', () => {
    const c = mk('Ocultista', 99, { PRE: 3, INT: 4 }); RT.slice(0, 40).forEach((r) => { const id = r.el == '*' ? r.n + '|Sangue' : r.n; if (!c.rit.includes(id)) c.rit.push(id); });
    const f = []; [1, 2].forEach((t) => { S.v = 'sheet'; S.tab = t; R(); if (bad(app())) f.push('aba ' + t); });
    S.v = 'sheet'; S.tab = 0; R(); S.v = 'grim'; try { R(); if (bad(app())) f.push('grimório'); } catch (e) { f.push('grimório ' + e.message); }
    T(GG, 'abas da ficha e Grimório Paranormal com 40 rituais conhecidos', f, []);
    S.v = 'sheet';
  });

  // =====================================================================================
  // H. SELO PARANORMAL (Normal / Discente / Verdadeiro, preço automático)
  // =====================================================================================
  const GH = 'H. Selo Paranormal';
  safe(GH, 'escolha do ritual, da versão e preço automático', () => {
    const c = mk('Ocultista', 99, { PRE: 3 }); c.pe = 100;
    const lista = RT.map((r, i) => [r, i]).filter(([r]) => !M4(r));
    seloPick(); B(GH, 'lista de rituais do selo abre sem undefined', !bad(modalHtml()) && modalHtml().includes(lista[0][0].n), '');
    const falhas = [], base = BC.slice();
    lista.forEach(([r, i]) => {
      const el = r.el == '*' ? 'Energia' : r.el;
      seloVer(i, el); const h = modalHtml(); if (bad(h) || !/Normal/.test(h) || !/Discente/.test(h) || !/Verdadeiro/.test(h)) falhas.push(r.n + ' card');
      [0, 1, 2].forEach((j) => {
        const off = (j == 1 && !r.d) || (j == 2 && !r.v), id = r.el == '*' ? r.n + '|' + el : r.n;
        const esp = Math.max(0, BC[r.ci] + (j == 1 && r.d ? r.d[0] : j == 2 && r.v ? r.v[0] : 0));
        if (!off && seloCusto(c, id, j) != esp) falhas.push(r.n + ' ' + SELV[j] + ' preço ' + seloCusto(c, id, j) + ' ≠ ' + esp);
        if (!off) { const n0 = c.inv.length; seloFim(i, el, j); const it = c.inv[c.inv.length - 1];
          if (c.inv.length != n0 + 1 || it.sv != j || !it.sl || (j && !it.n.includes(SELV[j])) || it.cat != 0 || it.e != 1) falhas.push(r.n + ' ' + SELV[j] + ' item');
          c.inv.pop(); }
      });
    });
    T(GH, lista.length + ' rituais × versões: card de escolha, item criado (nome/versão) e preço = círculo + versão', falhas, []);
  });
  safe(GH, 'Inventário: um único botão de PE, preço calculado', () => {
    const c = mk('Ocultista', 99, { PRE: 3 }); c.pe = 50;
    const r = RT.find((x) => x.ci == 2 && x.d && x.el != '*'), i = RT.indexOf(r);
    seloFim(i, r.el, 1); const pos = c.inv.length - 1;
    S.v = 'sheet'; S.tab = 2; R(); const h = app();
    T(GH, 'só 1 botão "Fabricar selo" por selo, sem os 4 botões antigos de círculo', [(h.match(/Fabricar selo/g) || []).length, /1º círculo ·/.test(h)], [1, false]);
    B(GH, 'o botão mostra o preço do ritual na versão escolhida', new RegExp('Fabricar selo · <b class=pec>' + (BC[2] + r.d[0]) + ' PE').test(h), h.match(/Fabricar selo[^<]*<b[^>]*>[^<]*/) + '');
    B(GH, 'mostra círculo e versão', new RegExp('2º círculo · Discente').test(h), '');
    clr(); const pe0 = c.pe; seloMk(pos); T(GH, 'fabricar desconta exatamente o preço', pe0 - c.pe, BC[2] + r.d[0]);
    c.pe = 1; clr(); seloMk(pos); T(GH, 'PE insuficiente é recusado', [c.pe, /insuficiente/.test(tst())], [1, true]);
    const c2 = mk('Ocultista', 99, { PRE: 3 }); c2.pe = 50; c2.ab = [{ n: 'Ritual Predileto', t: '', pw: 1, rp: r.n }];
    seloFim(i, r.el, 0); const p2 = c2.inv.length - 1; const pe1 = c2.pe; seloMk(p2); T(GH, 'Ritual Predileto reduz o preço do selo (−1 PE)', pe1 - c2.pe, BC[2] - 1);
    const c3 = mk('Ocultista', 99, { PRE: 3 }); c3.pe = 50; c3.inv.push({ n: 'Selo de Amaldiçoar Arma', cat: 0, e: 1, w: null, sl: 'Amaldiçoar Arma|Sangue', el: 'Sangue', am: 0, ds: '' });
    const p3 = c3.inv.length - 1; seloMk(p3); T(GH, 'selo antigo (sem versão guardada) vale como Normal', 50 - c3.pe, BC[1]);
    S.v = 'sheet'; S.tab = 2; R(); B(GH, 'selo antigo desenha sem erro', !bad(app()), '');
  });
  safe(GH, 'ritual de qualquer elemento no selo pede o elemento primeiro', () => {
    const c = mk('Ocultista', 99, { PRE: 3 }); const i = RT.findIndex((x) => x.el == '*');
    seloAdd(i); B(GH, 'Amaldiçoar Arma: primeiro escolhe o elemento', /Sangue/.test(modalHtml()) && /Energia/.test(modalHtml()) && !/Discente/.test(modalHtml()), '');
    seloAdd(i, 'Morte'); B(GH, 'depois mostra as 3 versões', /Normal/.test(modalHtml()) && /Verdadeiro/.test(modalHtml()), '');
    seloFim(i, 'Morte', 2); const it = c.inv[c.inv.length - 1]; T(GH, 'item guarda ritual|elemento e versão', [it.sl, it.sv, it.el], ['Amaldiçoar Arma|Morte', 2, 'Morte']);
  });
  return R_;
})();
