// Roda DENTRO do app (mesmo escopo dos scripts). Retorna um objeto {nome: resultado} com o que o app produz.
(function () {
  const out = {};
  const hash = (s) => { let h = 5381; s = String(s); for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h + ':' + s.length; };
  const safe = (name, fn) => { try { out[name] = fn(); } catch (e) { out[name] = 'ERRO: ' + e.message; } };
  const screen = () => hash(document.querySelector('#app').innerHTML);
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
    d.id = 1e6 + ++uid; d.name = 'Teste ' + cl + nex; d.classe = cl; d.origem = 2; d.nex = nex; d.attr = AT(attr);
    fin(); const c = cur(); S.cid = c.id; c.inv = []; (items || []).forEach((n) => c.inv.push(item(n))); return c;
  };

  // --- telas gerais ---
  S.chars = []; S.v = 'start';
  ['start', 'home', 'mestre', 'conta', 'grim', 'minv', 'cmb', 'wip'].forEach((v) => safe('tela:' + v, () => { S.v = v; R(); return screen(); }));

  // --- fichas de exemplo: valores derivados + todas as abas ---
  const casos = [
    ['Combatente', 5, { FOR: 3, VIG: 2 }, ['Faca', 'Pistola', 'Proteção leve']],
    ['Combatente', 70, { FOR: 4, AGI: 3 }, ['Faca', 'Pistola', 'Proteção pesada', 'Escudo']],
    ['Especialista', 35, { AGI: 3, INT: 3 }, ['Faca', 'Pistola', 'Utensílio']],
    ['Ocultista', 5, { INT: 2, PRE: 3 }, ['Faca']],
    ['Ocultista', 99, { INT: 3, PRE: 5 }, ['Faca', 'Proteção leve']],
  ];
  casos.forEach(([cl, nex, attr, items]) => {
    const c = mk(cl, nex, attr, items);
    const k = cl + nex;
    safe('derivados:' + k, () => JSON.stringify(K(c)).length + ':' + hash(JSON.stringify(K(c))));
    for (let tab = 0; tab < 5; tab++) safe(`ficha:${k}:aba${tab}`, () => { S.lv = null; S.cid = c.id; S.v = 'sheet'; S.tab = tab; R(); return screen(); });
  });

  // --- DT de ritual = 10 + PE/rodada + Presença ---
  safe('dt:rituais', () => casos.map(([cl, nex, attr, items]) => cl + nex + '=' + K(mk(cl, nex, attr, items)).dt).join(','));

  // --- editar nome, jogador e foto na ficha ---
  safe('edicao:ficha', () => {
    const c = mk('Combatente', 5, {}, []); S.cid = c.id; S.v = 'sheet'; S.tab = 0;
    edOpen(); S.ed.name = 'Novo Nome'; S.ed.player = 'Maria'; S.ed.photo = 'data:image/jpeg;base64,xx'; edSave();
    const a = [c.name, c.player, !!c.photo].join('|');
    edOpen(); edNoPhoto(); edSave();
    edOpen(); S.ed.name = '  '; edSave(); // nome vazio é recusado
    return a + ' || ' + [c.name, c.player, !!c.photo].join('|');
  });

  // --- criação e level-up ---
  safe('criacao:novo', () => { newC(); S.v = 'create'; R(); return screen(); });
  safe('levelup:trilha', () => { const c = mk('Combatente', 10, {}, []); S.lv = { n: 10, sg: 0, i: 0, x: {}, st: [{ t: 'trail' }] }; const h = vTrail(0); S.lv = null; return hash(h); });
  safe('levelup:atributo', () => { S.lv = { n: 20, sg: 0, i: 0, x: {}, st: [{ t: 'attr' }] }; const h = vAttr(); S.lv = null; return hash(h); });

  // --- catálogo e modificações ---
  safe('catalogo:armas', () => { S.v = 'minv'; S.mk = 'arm'; R(); return screen(); });
  safe('modificacoes:lista', () => { const c = mk('Combatente', 15, {}, ['Faca', 'Pistola']); S.cid = c.id; S.v = 'sheet'; S.tab = 2; R(); return screen(); });

  // --- ataque com dado fixo ---
  safe('ataque:pistola', () => { const c = mk('Combatente', 15, { AGI: 3 }, ['Pistola']); S.cid = c.id; S.v = 'sheet'; S.tab = 1; R(); atk(0); return hash(document.querySelector('#t').textContent + document.querySelector('#app').innerHTML); });

  // --- criador de combates ---
  const campos = { '#cmn': { value: '' }, '#cmr': { value: '' }, '#cmb': { value: '' }, '#cda': { value: '' } };
  safe('combate:ordem', () => {
    S.cmb = null; S.v = 'cmb';
    const orig = document.querySelector;
    document.querySelector = (s) => campos[s] || orig(s);
    const add = (n, d, b) => { campos['#cmn'].value = n; campos['#cmr'].value = String(d); campos['#cmb'].value = b == null ? '' : String(b); cmbAdd(); };
    add('Ana', 12, 5); add('Bruno', 15, 0); add('Caio', 9, 5); add('Davi', 14, 0);
    cmbGo();
    const antes = S.cmb.l.map((x) => x.n + x.i).join(',');
    const ana = S.cmb.l.find((x) => x.n == 'Ana'); cmbDl(ana.id); campos['#cda'].value = '4'; cmbDo(ana.id);
    const depois = S.cmb.l.map((x) => x.n + x.i).join(',');
    const lim = cmbLim(S.cmb.l.find((x) => x.n == 'Caio'));
    document.querySelector = orig;
    return antes + ' | ' + depois + ' | limiteCaio=' + lim;
  });

  // --- Monstruário (Ameaças): grupos por elemento, VD crescente e fichas sem dados faltando ---
  safe('monstruario:lista', () => {
    S.v = 'thr'; R();
    const h = document.querySelector('#app').innerHTML;
    const ordem = THO.filter((e) => THREATS.some((t) => t.el == e));
    const pos = ordem.map((e) => h.indexOf(e.toUpperCase() + ' <small>'));
    const crescente = THO.every((e) => thSorted(e).every((t, i, l) => !i || l[i - 1].vd <= t.vd));
    return [THREATS.length, ordem.join('>'), pos.every((p, i) => p > -1 && (!i || p > pos[i - 1])), crescente].join('|');
  });
  safe('monstruario:fichas', () => {
    let ruins = [];
    THREATS.forEach((t) => {
      ['i', 'a'].forEach((tab) => {
        S.thid = t.id; S.tht = tab; S.v = 'thd'; R();
        const h = document.querySelector('#app').innerHTML;
        if (/undefined|NaN|null|\[object/.test(h) || !h.includes(t.n)) ruins.push(t.id + ':' + tab);
      });
    });
    return ruins.length ? 'RUINS ' + ruins.join(',') : 'ok';
  });
  safe('monstruario:tema', () => {
    S.thid = 'nidere'; S.tht = 'i'; S.v = 'thd'; R();
    const a = document.body.dataset.thel;
    S.thid = 'bandido'; R();
    const b = document.body.dataset.thel || '';
    S.v = 'thr'; R();
    return a + '|' + b + '|' + (document.body.dataset.thel || '');
  });
  safe('monstruario:imagem', () => {
    thImgSet('nidere', 'data:image/jpeg;base64,xx'); const a = !!thImgs().nidere;
    thImgSet('nidere', ''); return a + '|' + !!thImgs().nidere;
  });

  // --- dados (Math.random fixo em 0.5) ---
  safe('dados:rd', () => rd(3, 6).join(',') + '|' + String(rl('2d6+3')));

  // --- exportação de backup (JSON) ---
  safe('estado:serializavel', () => JSON.stringify(S).length > 10);
  return out;
})()
