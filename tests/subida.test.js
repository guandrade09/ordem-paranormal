/** Subir de NEX é tudo ou nada: cancelar/sair no meio devolve a ficha IDÊNTICA; só vale o que foi confirmado até o fim. */
const { loadApp } = require('./helpers/app-loader');
const app = loadApp({ cfg: { url: '', key: '' } });
const res = app.ev(`(() => {
  const R_ = [], T = (n, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); R_.push({ n, ok, d: ok ? '' : JSON.stringify(got) + ' ≠ ' + JSON.stringify(want) }); };
  newC(); const d = S.d; d.id = 8e6; d.name = 'Sub'; d.classe = 'Combatente'; d.origem = 2; d.nex = 5; d.attr = { AGI: 2, FOR: 3, INT: 1, PRE: 1, VIG: 2 }; fin();
  const c = cur(); S.cid = c.id; S.v = 'sheet';
  const snap = () => JSON.stringify(cur());
  let orig = snap();
  let ask = [], resp = true; confirm = (m) => { ask.push(m); return resp; };

  // 1) abre a subida e cancela logo no 1º passo
  upd();
  T('subir de NEX abre o fluxo e já mostra o NEX novo (provisório)', [!!S.lv, cur().nex], [true, 10]);
  lvCancel(1);
  T('cancelar no 1º passo: ficha idêntica, sem confirmação', [snap() === orig, S.lv, ask.length], [true, null, 0]);

  // 2) nível com 2 passos (NEX 50%: atributo + escolha): confirma o 1º passo e cancela no meio
  cur().nex = 45; cur().trail = D.Combatente.tr[0].n; const orig2 = snap();
  upd();
  T('NEX 50% tem 2 passos (atributo e escolha)', S.lv.st.map((s) => s.t), ['attr', 'vers']);
  S.lv.x.a = 'AGI'; lvAt();
  const mexeu = snap() !== orig2, i0 = S.lv ? S.lv.i : -1;
  ask = []; resp = false; lvCancel(1);
  T('depois de confirmar um passo, cancelar pergunta antes; "não" mantém a subida', [mexeu, i0, ask.length, !!S.lv], [true, 1, 1, true]);
  resp = true; lvCancel(1);
  T('"sim": volta TUDO (NEX, PV, PE, atributos, poderes) como estava', [snap() === orig2, S.lv, cur().attr.AGI], [true, null, 2]);
  cur().nex = 5; cur().trail = null; delete cur().trail;

  orig = snap();
  // 3) sair da ficha no meio da subida (ex.: ir para outra tela) também desiste
  upd(); lvNext && S.lv.st[0].t == 'info' && lvNext();
  S.v = 'home'; R();
  T('sair da ficha no meio: desiste e a ficha volta idêntica', [snap() === orig, S.lv], [true, null]);
  S.v = 'sheet';

  // 4) clicar fora (mesmo caminho do #m) e o botão ✕ existem
  upd();
  const mh = document.querySelector('#m').innerHTML;
  T('o passo mostra o ✕ de cancelar', /lvCancel\\(1\\)/.test(mh), true);
  S.lv.i = 0; lvCancel(1);
  T('cancelar de novo deixa idêntica', snap() === orig, true);

  // 5) concluir de verdade: só vale o que foi confirmado até o fim
  upd(); g = 0;
  while (S.lv && g++ < 100) {
    const s = S.lv.st[S.lv.i]; if (!s) { fin2(); break; }
    if (s.t == 'info') lvNext();
    else if (s.t == 'pow') { const i = D[c.classe].pow.findIndex((p) => !/^(Transcender|Treinamento|Ritual Predileto|Especialista|Mestre em)/.test(p.n) && okp(cur(), p.p)[0] && !hasAb(cur(), p.n)); S.lv.x.p = i; lvPc(i); }
    else if (s.t == 'attr') { S.lv.x.a = 'AGI'; lvAt(); }
    else if (s.t == 'trail') { S.lv.x.tr = D[c.classe].tr[0].n; lvTr(0); }
    else { lvNext(); }
  }
  T('concluir: NEX sobe e o fluxo termina', [S.lv, cur().nex], [null, 10]);
  T('concluído: não dá mais para "cancelar" (nada a desfazer)', (lvCancel(1), cur().nex), 10);

  // 6) enquanto sobe de NEX, o Desfazer da ficha não mexe
  upd(); const n1 = cur().nex; undo();
  T('Desfazer fica bloqueado durante a subida', [!!S.lv, cur().nex], [true, n1]);
  lvCancel(0);
  return R_; })()`);
const lista = Array.from(res), falhas = lista.filter((r) => !r.ok);
lista.forEach((r) => console.log(`${r.ok ? 'OK   ' : 'FALHA'} | ${r.n}${r.d ? ' → ' + r.d : ''}`));
console.log(`${lista.length - falhas.length}/${lista.length} verificações passaram`);
process.exit(falhas.length ? 1 : 0);
