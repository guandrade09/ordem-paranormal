/**
 * Conta: tela de login/cadastro/recuperação de senha e sair.
 */

// Sair da conta
async function aOut() {
  while (SYNC.busy) await new Promise(r => setTimeout(r, 100));
  clearTimeout(SYNC.t);
  await push();
  if (SYNC.st.startsWith('⚠') &&
    !confirm('Há alterações que não foram sincronizadas. Sair mesmo assim? Elas serão perdidas.'))
    return;
  if (!SYNC.st.startsWith('⚠') && !confirm('Sair da conta?')) return;
  clearTimeout(SYNC.t);
  try {
    await sb.auth.signOut()
  } catch (e) {
  }
  const th = S.theme;
  S = {chars: [], v: 'start', tab: 0};
  if (th) S.theme = th;
  SYNC.h = {};
  AU.u = null;
  AU.mode = 'in';
  AU.msg = '';
  AU.ok = '';
  AU.perr = 0;
  LGI = undefined;  // ao entrar de novo, sorteia outra imagem de login
  syncPut();
  cfgC();
  save();
  R()
}
function aMsgH() {
  return AU.msg ?
    `<div id=amsg role=alert style="color:var(--red);font-size:14px;margin:10px 0">${aesc(AU.msg)}</div>` :
    AU.ok ? `<div id=amsg style="font-size:14px;margin:10px 0">✔ ${aesc(AU.ok)}</div>` :
            '<div id=amsg></div>'
}
function aMsg(t, ok) {
  AU.msg = ok ? '' : t;
  AU.ok = ok ? t : '';
  const e = $('#amsg');
  if (e) e.outerHTML = aMsgH()
}
function aMode(m) {
  AU.em = aV('aem').trim() || AU.em;
  AU.mode = m;
  AU.msg = '';
  AU.ok = '';
  R()
}
function aEye() {
  const i = $('#apw');
  if (i) i.type = i.type == 'password' ? 'text' : 'password'
}

// Envia o formulário de login/cadastro/recuperação
async function aSub() {
  if (AU.busy) return;
  const m = AU.mode, em = aV('aem').trim().toLowerCase(), pw = aV('apw'), p2 = aV('apw2');
  if (em) AU.em = em;
  if (m != 'reset' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return aMsg('Digite um e-mail válido.');
  if (m == 'in' && !pw) return aMsg('Digite sua senha.');
  if ((m == 'up' || m == 'reset') && pw.length < 8) return aMsg('A senha precisa ter pelo menos 8 caracteres.');
  if ((m == 'up' || m == 'reset') && pw !== p2) return aMsg('As senhas não são iguais.');
  AU.busy = 1;
  const bt = $('#abtn');
  if (bt) bt.disabled = true;
  try {
    const back = location.origin + location.pathname;
    if (m == 'in') {
      try {
        localStorage.setItem('op_keep', $('#akp') && $('#akp').checked ? '1' : '0')
      } catch (e) {
      }
      const r = await sb.auth.signInWithPassword({email: em, password: pw});
      if (r.error) throw r.error
    } else if (m == 'up') {
      const r = await sb.auth.signUp({email: em, password: pw, options: {emailRedirectTo: back}});
      if (r.error) throw r.error;
      const d = r.data || {};
      if (!d.session) {
        if (d.user && d.user.identities && !d.user.identities.length) throw new Error('User already registered');
        AU.mode = 'in';
        AU.msg = '';
        AU.ok = 'Conta criada! Enviamos um e-mail de confirmação para ' + em + '. Abra o link e depois entre aqui.';
        R()
      }
    } else if (m == 'forgot') {
      const r = await sb.auth.resetPasswordForEmail(em, {redirectTo: back});
      if (r.error) throw r.error;
      aMsg('Se este e-mail tem conta, enviamos um link para criar uma nova senha.', 1)
    } else if (m == 'reset') {
      const r = await sb.auth.updateUser({password: pw});
      if (r.error) throw r.error;
      AU.rec = 0;
      AU.mode = 'in';
      AU.ok = '';
      await aEnter()
    }
  } catch (e) {
    aMsg(aerr(e))
  }
  AU.busy = 0;
  const b2 = $('#abtn');
  if (b2) b2.disabled = false
}

// Imagem sorteada da tela de login (4 opções): sorteia ao entrar/recarregar, nunca repete a anterior;
// dentro da mesma visita (entrar / criar conta / esqueci a senha) a imagem e o lugar dela não mudam.
const LGN = 4, LGH = 410;  // LGH = altura reservada do formulário (maior modo), mantém a imagem sempre no mesmo lugar
let LGI;
function lgPick() {
  let last = -1;
  try {
    last = parseInt(localStorage.getItem('op_lgi'), 10)
  } catch (e) {
  }
  // sorteia entre as outras imagens (nunca a anterior), sem laço que possa travar
  const n = last >= 0 && last < LGN ? (last + 1 + Math.floor(Math.random() * (LGN - 1))) % LGN :
                                      Math.floor(Math.random() * LGN);
  try {
    localStorage.setItem('op_lgi', n)
  } catch (e) {
  }
  LGI = n
}

// Tela de login
function loginv() {
  if (LGI === undefined) lgPick();
  const h = (x) => `<div style="max-width:420px;margin:0 auto">${logoH()}<div class=lgform style="--lgh:${LGH}px"><div class=fade>${
    x}</div></div><div class=lgimg><img src="img/login/l${LGI + 1}.webp" alt=""></div></div>`;
  // carregando: só os símbolos. Sem internet / servidor inalcançável: símbolos + "SEM TRANSMISSÃO..." e,
  // no canto inferior esquerdo, o botão "Usar offline". Nada de título, borda ou mensagem de erro.
  if (AU.ld) return ldr(semNet(), 0, semNet());
  if (AU.fail || AU.perr || semNet()) return ldr(1, 0, 1);
  const m = AU.mode, T = {in : 'Entrar', up: 'Criar conta', forgot: 'Recuperar senha', reset: 'Nova senha'}[m],
        f = (id, lb, ty, ac, extra = '') => `<label style="display:block;margin:10px 0 2px;font-size:14px">${
          lb}</label><input id=${id} type=${ty} autocomplete=${ac} ${extra}>`;
  let b = '';
  if (m != 'reset')
    b += f('aem', 'E-mail', 'email', 'email', `value="${aesc(AU.em)}" inputmode=email autocapitalize=off`);
  if (m == 'reset') b += '<p style="font-size:14px">Digite a sua nova senha.</p>';
  if (m != 'forgot')
    b += `<label style="display:block;margin:10px 0 2px;font-size:14px">${
      m == 'reset' ? 'Nova senha' :
                     'Senha'}</label><div style="display:flex;gap:6px"><input id=apw type=password autocomplete=${
      m == 'in' ?
        'current-password' :
        'new-password'}><button type=button aria-label="Mostrar senha" onclick="aEye()" style="width:auto;margin:0">👁</button></div>`;
  if (m == 'up' || m == 'reset') b += f('apw2', 'Repita a senha', 'password', 'new-password');
  if (m == 'in')
    b +=
      `<label style="display:flex;align-items:center;gap:8px;margin:12px 0;font-size:14px"><input id=akp type=checkbox checked style="width:auto"> Manter-me logado</label>`;
  if (m == 'up') b += '<small style="display:block;margin-top:6px;opacity:.7">Mínimo de 8 caracteres.</small>';
  const lk = (t, mm) => `<button type=button onclick="aMode('${
    mm}')" style="background:none;border:0;text-decoration:underline;width:auto;padding:6px 2px;margin:0;color:var(--fg);font:inherit;font-size:14px">${
    t}</button>`;
  const ln = m == 'in' ? lk('Esqueci a senha', 'forgot') + '<br>' + lk('Criar conta', 'up') :
    m == 'reset'       ? '' :
                         lk('← Voltar para entrar', 'in');
  return h(`<div class=card><div style="font:24px 'Bebas Neue';letter-spacing:1px">${
    T}</div><form onsubmit="aSub();return false" novalidate>${b}${
    aMsgH()}<button id=abtn type=submit style="margin-top:8px">${
    T}</button></form></div><div style="text-align:center">${ln}</div>`)
}
