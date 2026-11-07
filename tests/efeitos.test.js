/** Efeitos temporários: o app só MOSTRA quanto PE/PV/Defesa temporário adicionar (não aplica sozinho). */
const { loadApp } = require('./helpers/app-loader');
const app = loadApp({ cfg: { url: '', key: '' } });
const res = app.ev(`(() => {
  const R_ = [], T = (n, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); R_.push({ n, ok, d: ok ? '' : JSON.stringify(got) + ' ≠ ' + JSON.stringify(want) }); };
  newC(); const d = S.d; d.id = 7e6; d.name = 'T'; d.classe = 'Ocultista'; d.origem = 2; d.nex = 30; d.attr = { AGI: 1, FOR: 1, INT: 3, PRE: 1, VIG: 1 }; fin();
  const c = cur(); S.cid = c.id; c.ab = c.ab || []; c.rit = c.rit || [];
  const t = () => document.querySelector('#t').textContent;
  T('Sentido Tático: +INT de Defesa temporária', tmpInfo(c, 'Sentido Tático'), '+3 de Defesa temporária (até o fim da cena)');
  T('Potencial Reaproveitado: +1 (e +2 com afinidade)', [tmpInfo(c, 'Potencial Reaproveitado', 0, false), tmpInfo(c, 'Potencial Reaproveitado', 0, true)], ['+1 PE temporário (até o fim da cena)', '+2 PE temporários (até o fim da cena)']);
  T('Forma Monstruosa: +5/30 e Verdadeiro +10/50', [tmpInfo(c, 'Forma Monstruosa', 0), tmpInfo(c, 'Forma Monstruosa', 2)], ['+5 de Defesa e 30 PV temporários', '+10 de Defesa e 50 PV temporários']);
  T('Equipe de Trauma só mostra com Resgate', [tmpInfo(c, 'Equipe de Trauma'), (c.ab.push({ n: 'Resgate', t: 'x' }), tmpInfo(c, 'Equipe de Trauma'))], ['', '+5 de Defesa temporária (Resgate)']);
  const v = tmpInfo(c, 'Vislumbres do Passado'); T('Vislumbres: 1d4 PE temporários', /^\\+[1-4] PE temporários/.test(v), true);
  c.ab.push({ n: 'Gladiador Paranormal', t: 'x' });
  const i = abl(c, K(c)).findIndex(p => p[0] == 'Gladiador Paranormal'), pe0 = c.pe, tp0 = c.t.pe || 0;
  abc(i); T('habilidade sem custo mostra o botão “Ver quanto adicionar”', /tmpShow/.test(document.querySelector('#m').innerHTML), true);
  tmpShow(i); T('o aviso mostra o valor e NÃO altera PE nem temporários', [/\\+2 PE temporários por acerto/.test(t()), c.pe === pe0, (c.t.pe || 0) === tp0], [true, true, true]);
  c.rit.push('Forma Monstruosa'); c.pe = 20; const d0 = K(c).def; cast('Forma Monstruosa', 0);
  T('conjurar Forma Monstruosa mostra o valor e não aplica Defesa/PV sozinho', [/\\+5 de Defesa e 30 PV temporários/.test(t()), K(c).def === d0, (c.t.pv || 0) === 0], [true, true, true]);
  const k0 = K(c); c.ab.push({ n: 'Potencial Aprimorado', t: 'x' }); c.ab.push({ n: 'Encarar a Morte', t: 'x' });
  const k1 = K(c); c.af = 'Morte'; const k2 = K(c); c.af = null;
  T('Potencial Aprimorado: +1 PE por nível (NEX 30% = +6; +12 com afinidade)', [k1.pe - k0.pe, k2.pe - k0.pe], [6, 12]);
  T('Encarar a Morte: +1 PE/rodada (+2 com afinidade), vale também para rituais', [k1.rod - k0.rod, k2.rod - k0.rod, k1.rodR - k0.rodR], [1, 2, 1]);
  return R_; })()`);
const lista = Array.from(res), falhas = lista.filter((r) => !r.ok);
lista.forEach((r) => console.log(`${r.ok ? 'OK   ' : 'FALHA'} | ${r.n}${r.d ? ' → ' + r.d : ''}`));
console.log(`${lista.length - falhas.length}/${lista.length} verificações passaram`);
process.exit(falhas.length ? 1 : 0);
