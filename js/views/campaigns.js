/**
 * Telas de Campanhas: lista, entrar com código + senha, criar, e a campanha (Mestre: missões, código, senha;
 * jogador: fichas vinculadas e criar ficha "dentro deste mundo").
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
  S.v = 'camp';
  R()
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
  const own = c.role == 'owner', chars = S.chars.filter(z => own || !z.npc);
  return `<div class=fade><button onclick="S.v='camps';R()">← Campanhas</button><div class=bar>${aesc(c.name)}</div>${
    CAMP.err ? `<div class=card style="border-color:var(--red)"><small>${aesc(CAMP.err)}</small></div>` : ''}${
    own ? `<label><small>Nome</small><input value="${aesc(c.name)}" maxlength=80 style="width:100%" onchange="campEd('name',this.value)"></label><label><small>Descrição</small><textarea rows=4 style="width:100%" onchange="campEd('descr',this.value)">${
            aesc(c.descr || '')}</textarea></label><div class=card><small>Para convidar</small><br>Código <b style="font-size:22px;letter-spacing:3px">${
            aesc(c.code || '')}</b> · ${c.members || 0} jogador(es)<br><button class=btn style="margin-top:8px" onclick="campPassM()">Trocar senha</button></div><button class=btn onclick="S.hbc='${
            c.id}';S.v='hbm';R()">Homebrew desta campanha</button><div class=bar>Missões</div><small>Só você enxerga as missões: use para planejar.</small>${
            (c.missions || []).map(m => `<div class=card><div style="display:flex;gap:8px;align-items:center"><input type=checkbox style="width:26px;height:26px;flex:none;padding:0;margin:0" ${
                                          m.ok ? 'checked' : ''} onchange="campMis('${m.id}','ok',this.checked)"><input value="${
                                          aesc(m.t)}" maxlength=100 style="flex:1;min-width:0;width:auto;margin:0" placeholder="Título" onchange="campMis('${
                                          m.id}','t',this.value)"><button class=x onclick="campMisDel('${
                                          m.id}')">✕</button></div><textarea rows=2 style="width:100%;margin-top:6px" placeholder="Anotações" onchange="campMis('${
                                          m.id}','d',this.value)">${aesc(m.d || '')}</textarea></div>`).join('') ||
              '<p><small>Nenhuma missão.</small></p>'}<button class=btn onclick="campMisAdd()">+ Missão</button>` :
          `<div class=card>${campBr(c.descr || 'Sem descrição.')}</div><small>O Mestre desta campanha compartilha o homebrew dele com as fichas vinculadas abaixo (rituais, habilidades, armas…).</small>`}<div class=bar>Fichas nesta campanha</div>${
    chars.map(z => `<div class="card row"><div style="flex:1"><b>${aesc(z.name || 'Sem nome')}</b><br><small>${
                   z.npc ? 'NPC · ' : ''}${aesc(z.classe || '')}${
                   z.camp == c.id ? ' · ✔ nesta campanha' : z.camp ? ' · em outra campanha' : ''}</small></div><button class=btn style="width:auto;padding:6px 12px" onclick="campLink(${
                   z.id})">${z.camp == c.id ? 'Tirar' : 'Usar aqui'}</button></div>`).join('') ||
    '<p><small>Você ainda não tem fichas.</small></p>'}<button class=btn onclick="campNewChar()">+ Criar ficha neste mundo</button>${
    own ? '<button class=btn style="background:var(--red)" onclick="campDelM()">Excluir campanha</button>' :
          '<button class=btn style="background:var(--red)" onclick="campLeaveM()">Sair da campanha</button>'}</div>`
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
function campLink(cid) {
  const z = S.chars.find(x => x.id == cid);
  if (!z) return;
  if (z.camp == S.cp)
    delete z.camp;
  else
    z.camp = S.cp;
  R()
}
function campNewChar() {
  const id = S.cp;
  newC();
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
