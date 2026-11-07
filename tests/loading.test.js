/** Loading: 15 símbolos em sequência (0,5 s), tela cheia sem título, "SEM TRANSMISSÃO..." só offline, botão offline. */
const { loadApp } = require('./helpers/app-loader');
const fake = { createClient: () => ({ auth: { onAuthStateChange() {} } }) };
const app = loadApp({ cfg: { url: 'https://x.supabase.co', key: 'k' }, supabase: fake });
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
  AU.u = null; AU.perr = 0; AU.ld = 0; AU.off = 0; AU.fail = 1; AU.rtb = 0;
  aRetry();
  T('sem internet: reconecta sozinho (tentativa silenciosa, sem redesenhar)', [AU.rtb, AU.ld], [1, 0]);
  AU.rtb = 0; AU.off = 1;
  aRetry();
  T('depois de "Usar offline" para de tentar reconectar', AU.rtb, 0);
  cfgR();
  T('logado offline: sidebar tem o botão "Ficar online"', /class=cfgon[^>]*>Ficar online/.test($('#cfg').innerHTML), true);
  AU.off = 0; cfgR();
  T('fora do modo offline a sidebar NÃO tem o botão', /cfgon/.test($('#cfg').innerHTML), false);
  AU.off = 1; AU.fail = 0; AU.u = null; aOn();
  T('"Ficar online" sai do modo offline e tenta conectar (mostra o loading)', [AU.off, AU.ld], [0, 1]);
  // --- login: logo + imagem sorteada ---
  AU.ld = 0; AU.fail = 0; AU.perr = 0; AU.off = 0; AU.u = null; AU.mode = 'in'; LGI = undefined;
  const im = () => (loginv().match(/img\\/login\\/l(\\d)\\.webp/) || [])[1];
  const i1 = im(); AU.mode = 'up'; const i2 = im(); AU.mode = 'forgot'; const i3 = im(); AU.mode = 'in';
  T('login: mostra o logo (imagem) e uma das 4 imagens; a imagem não muda ao trocar de modo', [/img\\/logo\\.webp/.test(loginv()), /^[1-4]$/.test(i1), i1 == i2 && i2 == i3], [true, true, true]);
  T('login: a altura do formulário é reservada (imagem sempre no mesmo lugar)', /class=lgpage/.test(loginv()) && /class=lgform>/.test(loginv()), true);
  let q = 0; Math.random = () => ((q++ * 0.37) % 1);
  let repetiu = 0, vistos = new Set(), ant = i1;
  for (let k = 0; k < 60; k++) { LGI = undefined; const n = im(); if (n == ant) repetiu++; vistos.add(n); ant = n; }
  T('login: ao entrar de novo / recarregar sorteia outra imagem, nunca a anterior', [repetiu, vistos.size], [0, 4]);
  T('tela do loading não mostra imagem de login', /img\\/login/.test(ldr(1, 0, 1)), false);
  S.v = 'start'; const t1 = start(); S.v = 'home'; const t2 = home(); const t3 = mestre();
  T('título "Ordem Paranormal" é a imagem em Início, Jogador e Mestre (sem texto antigo)', [[t1, t2, t3].every(x => /img\\/logo\\.webp/.test(x)), [t1, t2, t3].some(x => /ORDEM<b>|class=logo>/.test(x))], [true, false]);
  return R_; })()`);
const lista = Array.from(res), falhas = lista.filter((r) => !r.ok);
lista.forEach((r) => console.log(`${r.ok ? 'OK   ' : 'FALHA'} | ${r.n}${r.d ? ' → ' + r.d : ''}`));
console.log(`${lista.length - falhas.length}/${lista.length} verificações passaram`);
process.exit(falhas.length ? 1 : 0);
