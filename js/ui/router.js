/**
 * Roteador de telas (função R) e componentes visuais compartilhados (cores de afinidade, notas).
 */

// Roteador: renderiza a tela atual (ou a tela de login quando não há sessão)
function R() {
  if (authGate()) {
    $('#app').innerHTML = loginv();
    return
  }
  try {
    MDC = S.v == 'create' ? S.d : (S.v == 'sheet' || S.v == 'npc') ? cur() : null
  } catch (e) {
    MDC = null
  }
  $('#app').innerHTML = ({start, home, mestre, conta, create, sheet, wip, grim, minv, npc: npcv, cmb: cmbv, thr, thd})[S.v]();
  thTheme();
  save();
  if (S.lv && S.v == 'sheet') lvStep()
}

// Cores de afinidade
const AFC = {
  Conhecimento: ['#8a6d00', '#ffd600', '#ffd600', '#000', '#8a6d00'],
  Energia: ['#00e5ff', '#6a1b9a', '#6a1b9a', '#00e5ff', '#ff1493'],
  Morte: ['#8c8c8c', '#000', '#000', '#8c8c8c', '#8c8c8c'],
  Sangue: ['#d32f2f', '#6e0a0a', '#6e0a0a', '#ffd9d0', '#d32f2f']
};

// Nota de afinidade
const afNote = (t, e, c) => {
  if (!t || /^Não há/.test(t)) return '';
  let on = c && c.af == e, [, , vb, vt, vd] = AFC[e];
  return `<div style="margin:8px 0;padding:8px 10px;border-radius:6px;border:2px solid ${on ? vd : '#555'};background:${
    on ? vb : '#3a3a3a'};color:${on ? vt : '#9a9a9a'}"><b style="font-size:11px;letter-spacing:1px">AFINIDADE${
    on ? '' : ' (você não tem)'}</b><br>${esc(t)}</div>`
}, afBox = e => {
  let [tb, tt, vb, vt, vd] = AFC[e];
  return `<div class=fl><span class=bar style="background:${tb};color:${
    tt};display:flex;align-items:center;gap:6px">AFINIDADE <svg viewBox="0 0 100 100" width=24 height=24>${
    SYM[e](tt)}</svg></span><div class=box style="background:${vb};color:${vt};border-color:${vd}">${e}</div></div>`
};

// Logo "Ordem Paranormal" (imagem) — substitui todo título de texto "Ordem Paranormal"
const logoH = (st = '') => `<img class=logo-img src="img/logo.webp" alt="Ordem Paranormal"${st ? ` style="${st}"` : ''}>`;

// Botão de configurações
const gear = (back) => `<div class=topb><button class="gear" aria-label="Configurações" onclick="cfgT()"><i class=gi></i></button>${
  back ? `<button onclick="S.v='start';R()">← Início</button>` : ''}</div>`;

// Tela inicial
const start = () => `<div class=fade>${
  gear()}${logoH('margin:34px auto 14px')}<div style="text-align:center;margin:0 0 24px"><small style="border:1px solid currentColor;padding:2px 8px;border-radius:10px;opacity:.75">BETA v${APP_VERSION}</small></div><div class=bar>Quem é você?</div><button class="card big2" onclick="S.v='home';R()"><b>Jogador</b><br><small>Crie e jogue com suas fichas de agente.</small></button><button class="card big2" onclick="S.v='mestre';R()"><b>Mestre</b><br><small>Monstruário, grimório, NPCs, itens e mais.</small></button></div>`;
