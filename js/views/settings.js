/**
 * Painel de configurações, backup (exportar/importar) e tema claro/escuro.
 */

// Painel de configurações
function cfgT() {
  let o = $('#cfg').classList.toggle('open');
  $('#cfgb').classList.toggle('open', o);
  document.querySelectorAll('.gear').forEach(g => g.classList.toggle('on2', o));
  cfgR()
}

// Fechar configurações
function cfgC() {
  $('#cfg').classList.remove('open');
  $('#cfgb').classList.remove('open');
  document.querySelectorAll('.gear').forEach(g => g.classList.remove('on2'))
}

// Versão exibida nas configurações
const VER = 'Beta ' + APP_VERSION + ' · ' + new Date().toISOString().slice(0, 10);

// Exportar backup (JSON)
function dExp() {
  try {
    let b = new Blob([JSON.stringify({app: 'op', ver: VER, data: S}, null, 1)], {type: 'application/json'}),
        a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = 'ordem-paranormal-backup.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove()
    }, 500);
    toast('Backup exportado')
  } catch (e) {
    toast('Não foi possível exportar')
  }
}

// Importar backup (JSON)
function dImp(f) {
  if (!f) return;
  let r = new FileReader();
  r.onload = () => {
    try {
      let j = JSON.parse(r.result), d = j.data || j;
      if (!d || !Array.isArray(d.chars)) throw 0;
      let n = 0;
      d.chars.forEach(c => {
        if (!S.chars.some(x => x.id == c.id)) {
          S.chars.push(c);
          n++
        }
      });
      save();
      toast(n + ' ficha(s) importada(s)');
      R()
    } catch (e) {
      toast('Arquivo de backup inválido')
    }
  };
  r.readAsText(f)
}

// Conteúdo do painel de configurações
function cfgR() {
  let d = document.documentElement.dataset.theme ||
    (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  $('#cfg').innerHTML =
    `<div class=bar>Configurações</div><button onclick="S.from=S.v;cfgC();S.v='conta';R()">👤 Conta</button><button onclick="tema()">${
      d == 'dark' ?
        '☀️ Tema claro' :
        '🌙 Tema escuro'}</button><div class=bar style="margin-top:14px">Dados (beta)</div><button onclick="dExp()">💾 Exportar backup</button><button onclick="$('#dimp').click()">📂 Importar backup</button><small style="display:block;padding:6px 2px;opacity:.7">${
      SB_ON && AU.u ?
        `<span class=sst>${sstH()}</span> · ${aesc(AU.u.email || '')}<br>` :
        'Suas fichas ficam salvas só neste navegador. Exporte um backup de vez em quando.<br>'}${VER}</small>`
}

// Alternar tema claro/escuro
function tema() {
  let d = document.documentElement,
      c =
        d.dataset.theme || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  d.dataset.theme = S.theme = c == 'dark' ? 'light' : 'dark';
  save();
  cfgR()
}

// Tela "em construção"
const wip = () => `<div class=fade><button onclick="S.v='mestre';R()">← Voltar</button><div class=bar>${
  S.w}</div><div class=card style="text-align:center;padding:40px 10px"><div style="font-size:50px">🕯️</div>EM CONSTRUÇÃO<br><small>O Ordo Realitas ainda está preparando este setor.</small></div></div>`;
