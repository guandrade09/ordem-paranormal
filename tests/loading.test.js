/** Loading: 15 símbolos em sequência (0,5 s), tela cheia sem título, "SEM TRANSMISSÃO..." só offline, botão offline. */
const { loadApp } = require('./helpers/app-loader');
const app = loadApp({ cfg: { url: '', key: '' } });
const res = app.ev(`(() => {
  const R_ = [], T = (n, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); R_.push({ n, ok, d: ok ? '' : JSON.stringify(got) + ' ≠ ' + JSON.stringify(want) }); };
  const on = ldr(0), off = ldr(1, 0, 1), mini = ldr(0, 1);
  T('15 símbolos, 0,5 s entre eles', [(on.match(/<img/g) || []).length, (on.match(/animation-delay:([\\d.]+)s/g) || []).slice(0, 3)], [15, ['animation-delay:0s', 'animation-delay:0.5s', 'animation-delay:1s']]);
  T('loading normal: tela cheia, sem texto, sem botão, sem título', [/ldr full/.test(on), /ldr-txt|ldr-btn|Ordem Paranormal/.test(on)], [true, false]);
  T('sem internet: SEM TRANSMISSÃO... e botão "Usar offline só neste aparelho" (sem parênteses)', [/SEM TRANSMISSÃO/.test(off), /Usar offline só neste aparelho/.test(off), /\\(/.test(off.replace(/<[^>]*>/g, ''))], [true, true, false]);
  T('mini (status de sincronização): sem tela cheia e sem texto', [/ldr mini/.test(mini), /full|ldr-txt/.test(mini)], [true, false]);
  AU.ld = 0; AU.fail = 1; AU.perr = 0; AU.msg = 'Não foi possível conectar ao servidor.';
  const h = loginv();
  T('falha de conexão: loader offline + botão, sem mensagem de erro nem título', [/SEM TRANSMISSÃO/.test(h), /ldr-btn/.test(h), /Não foi possível|Ordem Paranormal|Tentar de novo/.test(h.replace(/<[^>]*>/g, ''))], [true, true, false]);
  AU.fail = 0; AU.perr = 1; AU.u = { id: 1 };
  T('erro ao carregar fichas: mesma tela, sem "Não foi possível carregar suas fichas"', [/ldr-btn/.test(loginv()), /carregar suas fichas/.test(loginv())], [true, false]);
  const g = gear();
  T('ícone da sidebar é a imagem do usuário (máscara), não o emoji', [/class=gi/.test(g), /⚙/.test(g)], [true, false]);
  return R_; })()`);
const lista = Array.from(res), falhas = lista.filter((r) => !r.ok);
lista.forEach((r) => console.log(`${r.ok ? 'OK   ' : 'FALHA'} | ${r.n}${r.d ? ' → ' + r.d : ''}`));
console.log(`${lista.length - falhas.length}/${lista.length} verificações passaram`);
process.exit(falhas.length ? 1 : 0);
