/**
 * Conta: estado de login, cliente Supabase e eventos de autenticação (JWT).
 */

// Estado de autenticação
let AU = {u: null, mode: 'in', busy: 0, msg: '', ok: '', em: '', off: 0, rec: 0, ld: SB_ON, fail: 0, perr: 0},
    sb = null, SYNC = {t: null, busy: 0, h: {}, st: '', again: 0};
const hs =
        s => {
          let h = 5381;
          for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
          return h + ':' + s.length
        },
      syncLoad =
        uid => {
          try {
            const o = JSON.parse(localStorage.getItem('op_sync'));
            SYNC.h = o && o.uid == uid && o.h ? o.h : {}
          } catch (e) {
            SYNC.h = {}
          }
        },
      syncPut =
        () => {
          try {
            localStorage.setItem('op_sync', JSON.stringify({uid: AU.u && AU.u.id, h: SYNC.h}))
          } catch (e) {
          }
        },
      stg = {
        getItem: k => {
          try {
            const a = localStorage.getItem(k);
            return a != null ? a : sessionStorage.getItem(k)
          } catch (e) {
            return null
          }
        },
        setItem: (k, v) => {
          try {
            const keep = localStorage.getItem('op_keep') != '0';
            (keep ? localStorage : sessionStorage).setItem(k, v);
            (keep ? sessionStorage : localStorage).removeItem(k)
          } catch (e) {
          }
        },
        removeItem: k => {
          try {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k)
          } catch (e) {
          }
        }
      },
      authGate = () => SB_ON && !AU.off && (!AU.u || AU.rec || AU.ld || AU.perr),
      stR = () => document.querySelectorAll('.sst').forEach(e => {e.innerHTML = sstH()}),
      aV =
        id => {
          const e = $('#' + id);
          return e ? String(e.value || '') : ''
        },
      aesc = s => String(s == null ?
          '' :
          s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'})[c]),
      aerr = e => {
        const m = String((e && e.message) || e || ''), l = m.toLowerCase();
        if (l.includes('invalid login')) return 'E-mail ou senha incorretos.';
        if (l.includes('not confirmed')) return 'Confirme seu e-mail antes de entrar (veja também a caixa de spam).';
        if (l.includes('already registered') || l.includes('already been registered'))
          return 'Este e-mail já tem conta. Tente entrar ou recuperar a senha.';
        if (l.includes('rate limit') || l.includes('too many') || l.includes('security purposes'))
          return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
        if (l.includes('same password') || l.includes('different from the old'))
          return 'A nova senha precisa ser diferente da atual.';
        if (l.includes('password should') || l.includes('weak')) return 'Senha fraca. Use pelo menos 8 caracteres.';
        if (l.includes('fetch') || l.includes('network')) return 'Sem conexão com o servidor.';
        return 'Erro: ' + m
      };

// Carrega o SDK do Supabase
function sbLoad() {
  return new Promise((ok, no) => {
    if (window.supabase) return ok();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
    s.onload = ok;
    s.onerror = () => no(new Error('cdn'));
    document.head.appendChild(s)
  })
}

// Inicia o cliente e escuta eventos de autenticação
async function aInit(quiet) {
  try {
    await sbLoad()
  } catch (e) {
    AU.ld = 0;
    AU.fail = 1;
    AU.msg = 'Não foi possível conectar ao servidor.';
    if (!quiet) R();  // tentativa silenciosa: não redesenha (não reinicia a animação)
    return
  }
  AU.fail = 0;
  if (/conectar ao servidor/.test(AU.msg || '')) AU.msg = '';  // reconectou: some o aviso antigo
  sb = window.supabase.createClient(
    CFG.url, CFG.key, {auth: {storage: stg, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true}});
  sb.auth.onAuthStateChange((ev, ses) => {setTimeout(() => aEv(ev, ses), 0)})
}

// Reage a login/logout/recuperação de senha
async function aEv(ev, ses) {
  if (ev == 'PASSWORD_RECOVERY') {
    AU.u = ses && ses.user;
    AU.rec = 1;
    AU.mode = 'reset';
    AU.ld = 0;
    R();
    return
  }
  if (ev == 'SIGNED_OUT') {
    LGI = undefined;
    AU.u = null;
    AU.ld = 0;
    AU.perr = 0;
    R();
    return
  }
  if (ses && ses.user) {
    if (AU.u && AU.u.id == ses.user.id) {
      AU.u = ses.user;
      return
    }
    AU.u = ses.user;
    if (AU.rec) {
      AU.ld = 0;
      R();
      return
    }
    await aEnter()
  } else if (ev == 'INITIAL_SESSION') {
    AU.ld = 0;
    R()
  }
}
async function aEnter(quiet) {
  if (!quiet) {
    AU.ld = 1;
    AU.perr = 0;
    R()
  }
  try {
    await pull();
    await campPull();  // campanhas (nunca trava a entrada: falhas ficam em CAMP.err)
    AU.ld = 0;
    AU.perr = 0;
    AU.msg = '';
    S.v = 'start';
    S.cid = null;
    R();
    syncSoon()
  } catch (e) {
    AU.ld = 0;
    AU.perr = 1;
    AU.msg = aerr(e);
    if (!quiet) R()
  }
}

// Escolheu "Usar offline" e agora quer voltar a ficar online (botão na sidebar)
function aOn() {
  cfgC();
  AU.off = 0;
  AU.msg = '';
  if (!sb) {
    AU.fail = 0;
    AU.ld = 1;
    R();
    aInit()
  } else if (AU.u)
    aEnter();
  else {
    AU.ld = 0;
    R()
  }
}
