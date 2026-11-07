/** Desfazer: restaura a ficha inteira (sem deixar campos criados depois) e nunca duplica habilidades. */
const { loadApp } = require('./helpers/app-loader');
const app = loadApp({ cfg: { url: '', key: '' } });
const res = app.ev(`(() => {
  const R_ = [], T = (n, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); R_.push({ n, ok, d: ok ? '' : JSON.stringify(got) + ' ≠ ' + JSON.stringify(want) }); };
  newC(); const d = S.d; d.id = 9e6; d.name = 'Des'; d.classe = 'Combatente'; d.origem = 2; d.nex = 10; d.attr = { AGI: 2, FOR: 3, INT: 1, PRE: 1, VIG: 2 }; fin();
  const c = cur(); S.cid = c.id; S.v = 'sheet';
  T('ficha nova ainda não tem lista de habilidades (cenário do bug)', c.ab === undefined, true);

  // cenário do bug: ponto salvo SEM "ab"; depois nascem ab/af/gr; Desfazer; refazer a escolha
  mut(z => { z.pe = Math.max(0, z.pe - 1); });
  abAdd(c, { n: 'Ataque Especial', t: 'x', pw: 1 }); c.af = 'Morte'; c.gr = { Luta: 10 }; c.res = ['Sangue'];
  mut(z => { z.pe = Math.max(0, z.pe - 1); });
  undo(); undo();
  T('Desfazer apaga o que nasceu depois do ponto salvo (ab, af, gr, res)', [c.ab, c.af, c.gr, c.res], [undefined, undefined, undefined, undefined]);
  abAdd(c, { n: 'Ataque Especial', t: 'x', pw: 1 });
  T('refazer a escolha depois do Desfazer NÃO duplica a habilidade', c.ab.filter((a) => a.n == 'Ataque Especial').length, 1);

  // Desfazer volta exatamente ao estado salvo, também quando já havia ab e nasce um campo novo depois
  const antes = JSON.stringify({ ...cur(), hist: [] });
  mut(z => { z.pe = Math.max(0, z.pe - 1); });
  abAdd(c, { n: 'Reflexos Defensivos', t: 'y', pw: 1 }); c.sg = 3; c.stn = 2;
  undo();
  T('Desfazer devolve a ficha exatamente como estava (campos novos "sg"/"stn" também somem)', [JSON.stringify({ ...cur(), hist: [] }) === antes, cur().sg, cur().stn], [true, undefined, undefined]);

  // abAdd não duplica; mas aceita Ritual Predileto com rituais diferentes
  const e = cur(); e.ab = [];
  abAdd(e, { n: 'A', t: 't', pw: 1 }); abAdd(e, { n: 'A', t: 't', pw: 1 });
  abAdd(e, { n: 'Ritual Predileto', t: 't', pw: 1, rp: 'Cicatrização' }); abAdd(e, { n: 'Ritual Predileto', t: 't', pw: 1, rp: 'Armadura de Sangue' });
  T('abAdd: sem duplicata, mas Ritual Predileto de rituais diferentes pode', e.ab.map((a) => a.n + (a.rp ? ':' + a.rp : '')), ['A', 'Ritual Predileto:Cicatrização', 'Ritual Predileto:Armadura de Sangue']);

  // limpeza de fichas antigas já duplicadas
  e.ab = [{ n: 'A', t: 't', pw: 1 }, { n: 'B', t: 't', tr: 1 }, { n: 'A', t: 't', pw: 1 }, { n: 'B', t: 't', tr: 1 }, { n: 'Ritual Predileto', rp: 'X', pw: 1 }];
  abDedup(e);
  T('abDedup limpa duplicatas de fichas antigas e mantém a ordem', e.ab.map((a) => a.n), ['A', 'B', 'Ritual Predileto']);
  return R_; })()`);
const lista = Array.from(res), falhas = lista.filter((r) => !r.ok);
lista.forEach((r) => console.log(`${r.ok ? 'OK   ' : 'FALHA'} | ${r.n}${r.d ? ' → ' + r.d : ''}`));
console.log(`${lista.length - falhas.length}/${lista.length} verificações passaram`);
process.exit(falhas.length ? 1 : 0);
