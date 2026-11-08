/**
 * Telas de Campanhas: lista, entrar com código + senha, criar, e a campanha (Mestre: missões, código, senha;
 * jogador: escolhe UMA ficha ao entrar (ou cria uma "dentro deste mundo"), depois vê a ficha dele e a ordem do combate ao vivo).
 */

const campBr = t => aesc(t).replace(/\n/g, '<br>');

// Abre a aba Campanhas e atualiza do servidor em seguida
function campGo() {
  S.v = 'camps';
  R();
  campPull().then(() => {
    if (S.v == 'camps' || S.v == 'camp' || S.v == 'hbm') R()
  })
}

function campsv() {
  const L = S.camps || [], on = campOk();
  return `<div class=fade>${gear(1)}${logoH()}<div class=bar>Campanhas</div>${
    SB_ON && !AU.u ? '<div class=card><small>Entre na sua conta para usar campanhas.</small></div>' :
    AU.off || (typeof navigator !== 'undefined' && navigator.onLine === false) ?
                     '<div class=card><small>Sem conexão com a conta: dá para ver o que já foi baixado, mas criar ou entrar numa campanha precisa de internet.</small></div>' :
    !SB_ON           ? '<div class=card><small>Campanhas precisam de conta (login) e internet.</small></div>' :
                       ''}${CAMP.err ? `<div class=card style="border-color:var(--red)"><small>${aesc(CAMP.err)}</small></div>` : ''}${
    L.map(c => `<div class="card" onclick="campOpen('${c.id}')"><b>${aesc(c.name)}</b> <small style="border:1px solid currentColor;border-radius:8px;padding:0 6px;opacity:.8">${
                c.role == 'owner' ? 'Mestre' : 'Jogador'}</small><br><small>${
                aesc((c.descr || 'Sem descrição.').slice(0, 110))}</small></div>`).join('') ||
    '<p><small>Nenhuma campanha ainda.</small></p>'}<div class=grid2 style="gap:8px"><button class=btn ${
    on ? '' : 'disabled'} onclick="campNew()">+ Nova campanha</button><button class=btn ${
    on ? '' : 'disabled'} onclick="campJoinM()">Entrar com código</button></div></div>`
}

function campOpen(id) {
  S.cp = id;
  S.cpc = 0;
  S.v = 'camp';
  R();
  csPoll(true);  // Mestre: busca as fichas dos jogadores na hora (depois atualiza sozinho)
  cbPoll()  // jogador: busca a ordem do combate, se houver
}

// Mestre: abre o Criador de Combates desta campanha (publica o estado atual e busca as fichas dos jogadores)
function campCombat() {
  S.v = 'cmbc';
  R();
  cmbPub();
  csPoll(true)
}

// Jogador: quadro do combate (nomes na ordem, quem age agora em vermelho; sem dados nem números de iniciativa)
function cbH(c) {
  const d = CB.data[c.id];
  if (!d) return CB.perr ? '<small>⚠ Combate ao vivo indisponível: o Mestre precisa ativar no servidor.</small>' : '';
  return `<b style="font:24px 'Bebas Neue';letter-spacing:1px">⚔ Combate</b> <small>Rodada ${+d.r || 1}</small>${(d.l || []).map((x, i) =>
    `<div class="cmbr ${x.id == d.c ? 'cur' : ''}"><span class=cmbn>${i + 1}</span><div style="flex:1;min-width:0"><b style="word-break:break-word">${
      aesc(x.n)}</b>${x.id == d.c ? '<br><small>Turno atual</small>' : ''}</div></div>`).join('')}`
}

// ---- criar ----
function campNew() {
  modal(`<button class=xc onclick="cm()">✕</button><b>Nova campanha</b><label><small>Nome</small><input id=cn_n maxlength=80 style="width:100%"></label><label><small>Descrição</small><textarea id=cn_d rows=4 style="width:100%"></textarea></label><label><small>Senha da sala (os jogadores vão precisar dela; use uma senha só desta campanha, não a da sua conta)</small><input id=cn_p maxlength=40 style="width:100%"></label><button class=btn onclick="campCreate()">Criar</button>`)
}
async function campCreate() {
  const n = aV('cn_n').trim(), d = aV('cn_d'), p = aV('cn_p');
  if (!n) return toast('Dê um nome à campanha.');
  if (p.length < 4) return toast('A senha precisa de pelo menos 4 caracteres.');
  if (!campOk()) return toast('Precisa de internet.');
  try {
    const r = await sb.rpc('camp_create', {p_name: n, p_descr: d, p_pass: p});
    if (r.error) throw r.error;
    await campPull();
    cm();
    campCodeM(r.data.code, p);
    campOpen(r.data.id)
  } catch (e) {
    toast(campErr(e))
  }
}
function campCodeM(code, pass) {
  modal(`<button class=xc onclick="cm()">✕</button><b>Campanha criada!</b><p>Mande para os jogadores:</p><div class=card style="text-align:center;font-size:20px">Código <b style="letter-spacing:3px">${
    aesc(code)}</b><br>Senha <b>${aesc(pass)}</b></div><small>Eles entram em Campanhas → Entrar com código. A senha fica guardada só como hash: se esquecer, é só trocar na campanha.</small><button class=btn onclick="campCopy('${
    aesc(code)}','${aesc(pass).replace(/'/g, '')}')">Copiar mensagem</button>`)
}
function campCopy(code, pass) {
  const t = `Entra na minha campanha no Ordem Paranormal: Campanhas → Entrar com código. Código ${code} · Senha ${pass}`;
  try {
    navigator.clipboard.writeText(t).then(() => toast('Copiado'), () => toast(t))
  } catch (e) {
    toast(t)
  }
}

// ---- entrar ----
function campJoinM() {
  modal(`<button class=xc onclick="cm()">✕</button><b>Entrar numa campanha</b><label><small>Código (6 dígitos)</small><input id=cj_c inputmode=numeric maxlength=6 style="width:100%;letter-spacing:4px;font-size:22px"></label><label><small>Senha</small><input id=cj_p maxlength=40 style="width:100%"></label><button class=btn onclick="campJoin()">Entrar</button>`)
}
async function campJoin() {
  const c = aV('cj_c').replace(/\D/g, ''), p = aV('cj_p');
  if (c.length != 6) return toast('O código tem 6 dígitos.');
  if (!p) return toast('Digite a senha.');
  if (!campOk()) return toast('Precisa de internet.');
  try {
    const r = await sb.rpc('camp_join', {p_code: c, p_pass: p});
    if (r.error) throw r.error;
    if (!r.data || !r.data.ok) return toast((r.data && r.data.msg) || 'Não foi possível entrar.');
    await campPull();
    cm();
    toast('Você entrou na campanha!');
    campOpen(r.data.id)
  } catch (e) {
    toast(campErr(e))
  }
}

// ---- tela da campanha ----
function campv() {
  const c = campOf(S.cp);
  if (!c) return `<div class=fade><button onclick="S.v='camps';R()">← Campanhas</button><p><small>Campanha não encontrada.</small></p></div>`;
  const own = c.role == 'owner';
  if (!own) return S.cpc || !campMine(c).length ? campcv(c) : campPv(c);
  return `<div class=fade><button onclick="S.v='camps';R()">← Campanhas</button><div class=bar>${aesc(c.name)}</div>${
    CAMP.err ? `<div class=card style="border-color:var(--red)"><small>${aesc(CAMP.err)}</small></div>` : ''}${
    own ? `<label><small>Nome</small><input value="${aesc(c.name)}" maxlength=80 style="width:100%" onchange="campEd('name',this.value)"></label><label><small>Descrição</small><textarea rows=4 style="width:100%" onchange="campEd('descr',this.value)">${
            aesc(c.descr || '')}</textarea></label><div class=card><small>Para convidar</small><br>Código <b style="font-size:22px;letter-spacing:3px">${
            aesc(c.code || '')}</b> · ${c.members || 0} jogador(es)<br><button class=btn style="margin-top:8px" onclick="campPassM()">Trocar senha</button></div><button class=btn onclick="S.hbx='${
            c.id}';S.v='hbm';R();gfLoad()">Homebrew desta campanha (${hbCount(c)} marcado(s))</button><button class=btn onclick="campCombat()">⚔ Criador de Combates${
            ((S.cmbs || {})[c.id] || {}).on ? ' (em andamento)' : ''}</button><div class=bar>Missões</div><small>Só você enxerga as missões: use para planejar.</small>${
            (c.missions || []).map(m => `<div class=card><div style="display:flex;gap:8px;align-items:center"><input type=checkbox class=ck ${
                                          m.ok ? 'checked' : ''} onchange="campMis('${m.id}','ok',this.checked)"><input value="${
                                          aesc(m.t)}" maxlength=100 style="flex:1;min-width:0;width:auto;margin:0" placeholder="Título" onchange="campMis('${
                                          m.id}','t',this.value)"><button class=x onclick="campMisDel('${
                                          m.id}')">✕</button></div><textarea rows=2 style="width:100%;margin-top:6px" placeholder="Anotações" onchange="campMis('${
                                          m.id}','d',this.value)">${aesc(m.d || '')}</textarea></div>`).join('') ||
              '<p><small>Nenhuma missão.</small></p>'}<button class=btn onclick="campMisAdd()">+ Missão</button>` : ''}${`<div class=bar>Fichas dos jogadores <small>● ao vivo</small></div><div id=csl>${csListH(c)}</div>`}<button class=btn style="background:var(--red)" onclick="campDelM()">Excluir campanha</button></div>`
}
// ---- jogador ----
// Fichas desta pessoa vinculadas a esta campanha (a regra é UMA; fichas antigas com mais de uma continuam aparecendo)
const campMine = c => S.chars.filter(z => !z.npc && z.camp == c.id);

// Escolher o personagem: aparece ao entrar na campanha (e em "Trocar de ficha"). A partir daqui o homebrew liberado já vale
function campcv(c) {
  const mine = campMine(c), chars = S.chars.filter(z => !z.npc);
  return `<div class=fade><button onclick="${mine.length && S.cpc ? "S.cpc=0;S.v='camp'" : "S.v='camps'"};R()">← ${
    mine.length && S.cpc ? 'Campanha' : 'Campanhas'}</button><div class=bar>${aesc(c.name)}</div><div class=card>${
    campBr(c.descr || 'Sem descrição.')}</div><div class=bar>Escolha seu personagem</div><small>O Mestre acompanha essa ficha ao vivo e você passa a usar o homebrew que ele liberou.</small>${
    chars.map(z => `<div class="card row" onclick="campPick(${z.id})">${ph(z)}<div style="flex:1"><b>${aesc(z.name || 'Sem nome')}</b><br><small>${
      aesc([z.classe, z.nex != null ? 'NEX ' + z.nex + '%' : ''].filter(Boolean).join(' · '))}${
      z.camp == c.id ? ' · ✔ atual' : z.camp ? ' · está em outra campanha (sai de lá)' : ''}</small></div></div>`).join('') ||
    '<p><small>Você ainda não tem fichas.</small></p>'}<button class=btn onclick="campNewChar()">+ Criar ficha neste mundo</button></div>`
}
function campPick(cid) {
  const z = S.chars.find(x => x.id == cid);
  if (!z) return;
  S.chars.forEach(x => {
    if (x.camp == S.cp && x.id != cid) delete x.camp  // uma ficha só por campanha
  });
  z.camp = S.cp;
  S.cpc = 0;
  S.v = 'camp';
  R();
  cbPoll()
}
// Tela inicial da campanha (jogador): título, descrição, a ficha, o quadro do combate e, no rodapé, sair
function campPv(c) {
  return `<div class="fade campp"><button onclick="S.v='camps';R()">← Campanhas</button><div class=bar>${aesc(c.name)}</div>${
    CAMP.err ? `<div class=card style="border-color:var(--red)"><small>${aesc(CAMP.err)}</small></div>` : ''}<div class=card>${
    campBr(c.descr || 'Sem descrição.')}</div><div class=bar>Ficha</div>${
    campMine(c).map(z => `<div class="card row" onclick="campOpenCh(${z.id})">${ph(z)}<div style="flex:1"><b>${
      aesc(z.name || 'Sem nome')}</b><br><small>${aesc([z.classe, z.origem, 'NEX ' + (z.nex || 0) + '%'].filter(Boolean).join(' · '))}</small></div></div>`).join('')}<button onclick="S.cpc=1;R()" style="width:100%">Trocar de ficha</button><div id=cbl class=cbbox>${
    cbH(c)}</div><button class=btn style="background:var(--red);margin-top:auto" onclick="campLeaveM()">Sair da campanha</button></div>`
}
function campEd(k, v) {
  const c = campOf(S.cp);
  if (!c || c.role != 'owner') return;
  c[k] = k == 'name' ? (v.trim() || c.name) : v;
  campSave(c)
}
function campMisAdd() {
  const c = campOf(S.cp);
  c.missions = (c.missions || []).concat([{id: hbId(), t: 'Nova missão', d: '', ok: 0}]);
  campSave(c);
  R()
}
function campMis(id, k, v) {
  const c = campOf(S.cp), m = c && (c.missions || []).find(x => x.id == id);
  if (!m) return;
  m[k] = k == 'ok' ? (v ? 1 : 0) : v;
  campSave(c)
}
function campMisDel(id) {
  const c = campOf(S.cp);
  c.missions = (c.missions || []).filter(x => x.id != id);
  campSave(c);
  R()
}
// Abre a ficha a partir da campanha: o "Voltar" da ficha volta para a campanha
function campOpenCh(id) {
  const z = S.chars.find(x => x.id == id);
  if (!z || z.npc == 'passivo') return;  // NPC passivo não tem ficha
  S.bk = 'camp';
  S.cid = id;
  S.v = 'sheet';
  S.tab = 0;
  R()
}
function campNewChar() {
  const id = S.cp;
  newC();
  S.bk = 'camp';
  S.d.camp = id;
  R()
}
function campPassM() {
  modal(`<button class=xc onclick="cm()">✕</button><b>Trocar senha da sala</b><label><small>Nova senha (mín. 4 caracteres)</small><input id=cp_p maxlength=40 style="width:100%"></label><button class=btn onclick="campPass()">Salvar</button>`)
}
async function campPass() {
  const p = aV('cp_p'), c = campOf(S.cp);
  if (p.length < 4) return toast('A senha precisa de pelo menos 4 caracteres.');
  if (!campOk()) return toast('Precisa de internet.');
  try {
    const r = await sb.rpc('camp_setpass', {p_id: c.id, p_pass: p});
    if (r.error) throw r.error;
    cm();
    campCodeM(c.code, p)
  } catch (e) {
    toast(campErr(e))
  }
}
function campDelM() {
  const c = campOf(S.cp);
  modal(`<b>Excluir ${aesc(c.name)}?</b><p><small>Apaga a campanha, as missões e o homebrew para todo mundo. Não dá para desfazer.</small></p><div class=grid2><button class=btn onclick="cm()">Cancelar</button><button class=btn style="background:var(--red)" onclick="cm();campRm('camp_delete')">Excluir</button></div>`)
}
function campLeaveM() {
  const c = campOf(S.cp);
  modal(`<b>Sair de ${aesc(c.name)}?</b><p><small>As fichas continuam com o que já usaram do homebrew, mas não recebem novidades.</small></p><div class=grid2><button class=btn onclick="cm()">Cancelar</button><button class=btn style="background:var(--red)" onclick="cm();campRm('camp_leave')">Sair</button></div>`)
}
async function campRm(fn) {
  const id = S.cp;
  if (!campOk()) return toast('Precisa de internet.');
  try {
    const r = await sb.rpc(fn, {p_id: id});
    if (r.error) throw r.error;
    S.camps = (S.camps || []).filter(c => c.id != id);
    S.v = 'camps';
    R()
  } catch (e) {
    toast(campErr(e))
  }
}

// ---- Mestre: fichas dos jogadores ao vivo ----
const csAgo = t => {
  const s = Math.max(0, Math.round((Date.now() - new Date(t).getTime()) / 1000));
  return s < 8 ? 'agora' : s < 60 ? 'há ' + s + ' s' : s < 3600 ? 'há ' + Math.round(s / 60) + ' min' :
    s < 86400 ? 'há ' + Math.round(s / 3600) + ' h' : 'há ' + Math.round(s / 86400) + ' d'
}, csBar = (l, v, m, col) => `<div style="flex:1;min-width:0"><small>${l} <b>${v}</b>/${m}</small><div style="height:6px;background:rgba(128,128,128,.3);margin-top:2px"><i style="display:block;height:100%;width:${
  m > 0 ? Math.max(0, Math.min(100, v / m * 100)) : 0}%;background:${col}"></i></div></div>`,
      csMax = d => {
        try {
          return K(d)
        } catch (e) {
          return {pv: d.pv, pe: d.pe, san: d.san, def: ''}
        }
      };
function csListH(c) {
  const l = CS.data[c.id] || [], lg = (CS.log[c.id] || []).slice(0, 12);
  return (CS.err ? `<small style="color:var(--red)">${aesc(CS.err)}</small>` : '') +
    (l.map(x => {
       const d = x.data || {}, k = csMax(d);
       return `<div class=card onclick="csOpen('${x.k}','${String(x.cid).replace(/[^\w]/g, '')}')"><b>${aesc(d.name || 'Sem nome')}</b> <small>${
         aesc(d.player ? '· ' + d.player : '')}</small><br><small>${aesc(d.classe || '')} · NEX ${d.nex || 0}% · atualizada ${
         csAgo(x.upd)}</small><div class=row style="gap:8px;margin-top:6px">${csBar('PV', d.pv, k.pv, '#c62828')}${
         csBar('PE', d.pe, k.pe, '#1565c0')}${csBar('SAN', d.san, k.san, '#6a1b9a')}</div></div>`
     }).join('') ||
     '<p><small>Nenhum jogador vinculou uma ficha a esta campanha ainda.</small></p>') +
    (lg.length ? `<div class=bar>Mudanças recentes</div>${
                   lg.map(e => `<div><small>${csAgo(e.t)} · <b>${aesc(e.w)}</b>: ${aesc(e.m)}</small></div>`).join('')}` :
                 '')
}
function csOpen(k, cid) {
  S.cs = {k, cid};
  S.v = 'cs';
  R()
}
function csv() {
  const c = campOf(S.cp), x = c && (CS.data[c.id] || []).find(z => z.k == S.cs.k && String(z.cid).replace(/[^\w]/g, '') == S.cs.cid);
  if (!c || !x)
    return `<div class=fade><button onclick="S.v='camp';R()">← Campanha</button><p><small>Esta ficha não está mais na campanha.</small></p></div>`;
  const d = x.data || {}, k = csMax(d), t = d.t || {}, key = x.k + '|' + x.cid,
        lg = (CS.log[c.id] || []).filter(e => e.k == key).slice(0, 25), list = (a, f) => a.length ? a.map(f).join(', ') : '—';
  return `<div class=fade><button onclick="S.v='camp';R()">← Campanha</button><div class=bar>${aesc(d.name || 'Sem nome')}</div><small>${
    aesc([d.player ? 'Jogador: ' + d.player : '', d.classe, d.origem, 'NEX ' + (d.nex || 0) + '%'].filter(Boolean).join(' · '))} · atualizada ${
    csAgo(x.upd)} <b>● ao vivo</b></small><div class=card><div class=row style="gap:8px">${csBar('PV', d.pv, k.pv, '#c62828')}${
    csBar('PE', d.pe, k.pe, '#1565c0')}${csBar('SAN', d.san, k.san, '#6a1b9a')}</div><small>${
    t.pv || t.pe || t.san ? 'Temporários: PV ' + (t.pv || 0) + ' · PE ' + (t.pe || 0) + ' · SAN ' + (t.san || 0) + '<br>' : ''}Defesa <b>${
    k.def == null ? '—' : k.def}</b></small></div><div class=card><small>${
    A.map(a => a + ' <b>' + ((d.attr || {})[a] == null ? '—' : d.attr[a]) + '</b>').join(' · ')}</small></div><div class=card><small><b>Perícias treinadas:</b> ${
    aesc(list(d.trained || [], z => (z && z.n) || z))}<br><b>Habilidades:</b> ${
    aesc(list(d.ab || [], z => z.n))}<br><b>Rituais:</b> ${
    aesc(list((d.rit || []).filter(z => typeof z == 'string'), z => z.split('|')[0]))}<br><b>Inventário:</b> ${
    aesc(list(d.inv || [], z => z.n + (z.q != null ? ' ×' + z.q : '')))}<br><b>Efeitos ativos:</b> ${
    aesc(list(d.sust || [], z => z.n || z.id))}</small></div><div class=bar>Mudanças desta ficha</div>${
    lg.map(e => `<div><small>${csAgo(e.t)} · ${aesc(e.m)}</small></div>`).join('') ||
    '<small>Nada mudou desde que você abriu a campanha.</small>'}</div>`
}
