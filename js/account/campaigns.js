/**
 * Campanhas: Mestre cria (nome, descrição, missões, homebrew); jogadores entram com código + senha.
 * Tudo passa por funções do servidor (RPC, ver supabase.sql). S.camps é só o cache local, para funcionar sem internet:
 * {id, role: 'owner'|'member', name, descr, homebrew, missions (só Mestre), code (só Mestre), members, upd, d: alterado e não enviado}
 */
const CAMP = {err: '', busy: 0, t: null, off: 0};

// Mensagem amigável (principalmente quando o SQL de campanhas ainda não foi rodado no Supabase)
const campErr = e => {
  const m = String((e && (e.message || e.details)) || e || '');
  if (/could not find the function|schema cache|does not exist|PGRST20|42883|42P01/i.test(m + ' ' + ((e && e.code) || '')))
    return 'Campanhas ainda não foram ativadas neste servidor: rode o bloco "CAMPANHAS" do arquivo supabase.sql no Supabase (SQL Editor) uma vez.';
  return aerr(e)
};
const campOk = () => !!(SB_ON && sb && AU.u && !AU.off && (typeof navigator === 'undefined' || navigator.onLine !== false));
const campOf = id => (S.camps || []).find(c => c.id == id);

// Baixa as campanhas da conta e mescla (o que o Mestre mexeu aqui e ainda não enviou, vale)
async function campPull() {
  if (!campOk() || typeof sb.rpc != 'function') return false;
  try {
    const r = await sb.rpc('camp_mine');
    if (r.error) throw r.error;
    const loc = new Map((S.camps || []).map(c => [c.id, c]));
    S.camps = (r.data || []).map(x => {
      const l = loc.get(x.id);
      if (x.role == 'member' && l && l.gift) x.gift = l.gift;  // enquanto busca, mantém os itens exclusivos já recebidos
      return l && l.d && x.role == 'owner' ? l : x
    });
    CAMP.err = '';
    await Promise.all(S.camps.filter(x => x.role == 'member').map(gfMine));
    save();
    return true
  } catch (e) {
    CAMP.err = campErr(e);
    return false
  }
}

// Mestre alterou a campanha: marca e envia (com atraso)
function campSave(c) {
  c.d = 1;
  save();
  clearTimeout(CAMP.t);
  CAMP.t = setTimeout(campPush, 1200)
}
async function campPush() {
  if (!campOk() || CAMP.busy || typeof sb.rpc != 'function') return;
  const l = (S.camps || []).filter(c => c.role == 'owner' && c.d);
  if (!l.length) return;
  CAMP.busy = 1;
  try {
    for (const c of l) {
      const snap = JSON.stringify([c.name, c.descr, c.missions, c.homebrew]);
      const r = await sb.rpc('camp_update', {
        p_id: c.id, p_name: c.name, p_descr: c.descr || '', p_missions: c.missions || [], p_homebrew: c.homebrew || {}
      });
      if (r.error) throw r.error;
      if (JSON.stringify([c.name, c.descr, c.missions, c.homebrew]) === snap) c.d = 0;  // mexeu de novo durante o envio? fica pendente
      else CAMP.t = setTimeout(campPush, 600)
    }
    CAMP.err = ''
  } catch (e) {
    CAMP.err = campErr(e);
    CAMP.t = setTimeout(campPush, 15000)
  }
  CAMP.busy = 0;
  save()
}

// ---------------------------------------------------------------------------------------------
// Fichas ao vivo: o jogador envia cópia das fichas vinculadas (c.camp); o Mestre da campanha lê e vê as mudanças.
// ---------------------------------------------------------------------------------------------
const CS = {h: {}, set: {}, t: null, busy: 0, again: 0, pb: 0, data: {}, sig: {}, log: {}, err: ''};

// Cópia enviada: sem histórico do Desfazer, sem cópia do homebrew e sem foto pesada
const csStrip = c => {
  const o = {...c};
  delete o.hist;
  delete o.hbs;
  if (o.photo && o.photo.length > 60000) delete o.photo;
  return o
};
function csSoon() {
  if (!campOk()) return;
  clearTimeout(CS.t);
  CS.t = setTimeout(csPush, 1500)
}
// Manda já (sem esperar o atraso) ao ir para segundo plano/fechar e quando a internet volta: edição feita na aba
// Agentes não pode ficar para trás da cópia que o Mestre vê
function csFlush() {
  clearTimeout(CS.t);
  csPush()
}
try {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState == 'hidden') csFlush()
  });
  addEventListener('pagehide', csFlush);
  addEventListener('online', csSoon)
} catch (e) {
}
async function csPush() {
  if (!campOk() || typeof sb.rpc != 'function') return;
  if (S.lv && S.lv.bak) return;  // subida de NEX em andamento: não envia ficha pela metade
  const mem = (S.camps || []).filter(c => c.role == 'member');
  if (!mem.length) return;
  if (CS.busy) {
    CS.again = 1;
    return
  }
  CS.busy = 1;
  try {
    for (const cp of mem) {
      const l = S.chars.filter(c => c.camp == cp.id && c.npc != 'passivo');
      for (const c of l) {
        const d = csStrip(c), hh = hs(JSON.stringify(d)), k = cp.id + '|' + c.id;
        if (CS.h[k] === hh) continue;
        const r = await sb.rpc('camp_sheet_put', {p_camp: cp.id, p_cid: String(c.id), p_data: d});
        if (r.error) throw r.error;
        CS.h[k] = hh
      }
      const ids = l.map(c => String(c.id)).sort().join(',');
      if (CS.set[cp.id] !== ids) {  // fichas desvinculadas somem da campanha
        const r = await sb.rpc('camp_sheet_keep', {p_camp: cp.id, p_cids: l.map(c => String(c.id))});
        if (r.error) throw r.error;
        CS.set[cp.id] = ids;
        // o que saiu da campanha precisa ser reenviado por inteiro se voltar igualzinho
        Object.keys(CS.h).forEach(k => {
          if (k.startsWith(cp.id + '|') && !l.some(c => cp.id + '|' + c.id == k)) delete CS.h[k]
        })
      }
    }
    CS.err = ''
  } catch (e) {
    CS.err = campErr(e);
    CS.t = setTimeout(csPush, 15000)
  }
  CS.busy = 0;
  if (CS.again) {
    CS.again = 0;
    csSoon()
  }
}

// O que mudou entre duas versões da ficha (texto curto, para o registro do Mestre)
function csDiff(a, b) {
  const o = [], nm = x => (x || []).map(i => (i && (i.n || i)) + '').filter(Boolean);
  [['pv', 'PV', ''], ['pe', 'PE', ''], ['san', 'SAN', ''], ['nex', 'NEX', '%']].forEach(([k, l, u]) => {
    if (a[k] !== b[k]) o.push(`${l} ${a[k] == null ? 0 : a[k]}${u} → ${b[k] == null ? 0 : b[k]}${u}`)
  });
  ['pv', 'pe', 'san'].forEach(k => {
    const x = (a.t || {})[k] || 0, y = (b.t || {})[k] || 0;
    if (x !== y) o.push(`${k.toUpperCase()} temporário ${x} → ${y}`)
  });
  if (a.classe !== b.classe) o.push(`Classe: ${a.classe || '—'} → ${b.classe || '—'}`);
  A.forEach(k => {
    const x = (a.attr || {})[k], y = (b.attr || {})[k];
    if (x !== y) o.push(`${k} ${x} → ${y}`)
  });
  const dif = (ra, rb, f) => {
    const x = nm(ra), y = nm(rb);
    y.filter(n => !x.includes(n)).forEach(n => o.push(f + ' ' + n));
    x.filter(n => !y.includes(n)).forEach(n => o.push('Perdeu ' + n))
  };
  dif(a.inv, b.inv, 'Item:');
  dif(a.ab, b.ab, 'Habilidade:');
  dif((a.rit || []).filter(x => typeof x == 'string').map(x => x.split('|')[0]),
      (b.rit || []).filter(x => typeof x == 'string').map(x => x.split('|')[0]), 'Ritual:');
  const sn = r => nm((r || []).map(s => s.n || s.id)), sa = sn(a.sust);
  sn(b.sust).filter(n => !sa.includes(n)).forEach(n => o.push('Efeito ativo: ' + n));
  return o
}

// Mestre: busca as fichas da campanha aberta e registra o que mudou
async function csPoll(force) {
  const c = campOf(S.cp);
  if (!c || c.role != 'owner' || !campOk() || typeof sb.rpc != 'function' || CS.pb) return;
  CS.pb = 1;
  try {
    const r = await sb.rpc('camp_sheets', {p_camp: c.id});
    if (r.error) throw r.error;
    const nw = r.data || [], prev = CS.data[c.id];
    if (prev) {
      const pm = new Map(prev.map(x => [x.k + '|' + x.cid, x]));
      nw.forEach(x => {
        const p = pm.get(x.k + '|' + x.cid), nome = (x.data && x.data.name) || 'Ficha';
        const m = p ? csDiff(p.data || {}, x.data || {}) : ['entrou na campanha'];
        m.forEach(t => (CS.log[c.id] = CS.log[c.id] || []).unshift({t: Date.now(), w: nome, k: x.k + '|' + x.cid, m: t}));
        if (CS.log[c.id]) CS.log[c.id] = CS.log[c.id].slice(0, 80)
      })
    }
    CS.data[c.id] = nw;
    CS.err = '';
    const sig = JSON.stringify(nw.map(x => [x.k, x.cid, x.upd]));
    if (force || sig !== CS.sig[c.id]) {
      CS.sig[c.id] = sig;
      csRender()
    }
  } catch (e) {
    CS.err = campErr(e)
  }
  CS.pb = 0
}
function csRender() {
  if (S.v == 'camp') {
    const e = $('#csl'), c = campOf(S.cp);
    if (e && c) e.innerHTML = csListH(c)
  } else if (S.v == 'cs')
    R()
  else if (S.v == 'cmbc') {
    const e = $('#cmp');
    // não apaga o dado que o Mestre está digitando
    let busy = false;
    try {
      busy = [...e.querySelectorAll('input')].some(i => i.value !== '' || i === document.activeElement)
    } catch (x) {
    }
    if (e && !busy) e.innerHTML = cmbPlH();
    cmbHpPaint()  // vida dos jogadores no combate, ao vivo
  }
}
function csTick() {
  try {
    if (document.visibilityState == 'hidden') return
  } catch (e) {
  }
  if (S.v == 'camp' || S.v == 'cs' || S.v == 'cmbc') csPoll();
  if (S.v == 'camp') cbPoll()
}
if (typeof setInterval == 'function') setInterval(csTick, 3000);


// ---- Combate da campanha: o Mestre publica só a ORDEM (nome, turno, rodada; nada de dado, vida ou número de iniciativa)
const CB = {data: {}, sig: {}, html: {}, t: null, pb: 0, on: {}, err: '', ok: 0, perr: ''};

// Erro de combate com texto próprio (o mais comum: o SQL "COMBATE NA CAMPANHA" ainda não foi rodado)
const cbMiss = e => /could not find the function|schema cache|does not exist|PGRST20|42883|42P01/i.test(
  String((e && (e.message || e.details)) || e || '') + ' ' + ((e && e.code) || ''));
const cbErr = e => cbMiss(e) ?
  'O combate ao vivo ainda não foi ativado neste servidor: rode o bloco "COMBATE NA CAMPANHA" do supabase.sql no Supabase (SQL Editor) uma vez.' :
  aerr(e);
const cbStat = () => CB.err ? `<div class=card style="border-color:var(--red)"><small>⚠ ${aesc(CB.err)}</small></div>` :
                              CB.ok ? '<small>● Os jogadores estão vendo a ordem ao vivo</small>' : '';

// Mestre: publica (com atraso) o combate da campanha aberta; sem combate em andamento = apaga
function cmbPub() {
  clearTimeout(CB.t);
  CB.t = setTimeout(cmbPubGo, 600)
}
async function cmbPubGo() {
  const c = campOf(S.cp);
  if (!c || c.role != 'owner' || typeof sb.rpc != 'function') return;
  const m = (S.cmbs || {})[c.id], on = !!(m && m.on && m.l.length);
  const paint = () => {
    const e = $('#cbe');
    if (e) e.innerHTML = cbStat()
  };
  if (!campOk()) {
    if (on) CB.err = 'Sem internet: os jogadores não estão vendo o combate.';
    return paint()
  }
  const pub = on ? {on: 1, r: m.r, c: m.c, l: m.l.map(x => ({id: x.id, n: String(x.n).slice(0, 60)}))} : null;
  try {
    const r = await sb.rpc('camp_combat_set', {p_camp: c.id, p_data: pub});
    if (r.error) throw r.error;
    CB.err = '';
    CB.ok = on ? 1 : 0
  } catch (e) {
    CB.err = cbErr(e);
    CB.ok = 0
  }
  paint()
}

// Jogador: busca a ordem publicada e desenha no quadro da tela inicial da campanha
async function cbPoll() {
  const c = campOf(S.cp);
  if (!c || c.role != 'member' || !campOk() || typeof sb.rpc != 'function' || CB.pb) return;
  CB.pb = 1;
  try {
    const r = await sb.rpc('camp_combat_get', {p_camp: c.id});
    if (r.error) {
      CB.perr = cbMiss(r.error) ? 'miss' : ''
    } else {
      CB.perr = '';
      const d = r.data && r.data.on ? r.data : null;
      if (d && !CB.on[c.id] && CB.sig[c.id] !== undefined) toast('⚔ Combate iniciado!');
      CB.on[c.id] = !!d;
      CB.sig[c.id] = JSON.stringify(d);
      CB.data[c.id] = d
    }
  } catch (e) {
  }
  CB.pb = 0;
  if (S.v == 'camp' && S.cp == c.id) {
    const e = $('#cbl'), h = cbH(c);
    if (e && h !== CB.html[c.id]) {
      CB.html[c.id] = h;
      e.innerHTML = h
    }
  }
}


// ---- Homebrew EXCLUSIVO por jogador (o Mestre dá um item a UM jogador; só ele recebe, os outros nunca veem) ----
// Mestre: CG.all[campanha] = { <código do jogador>: { rit: [...], hab: [...] … } } (a verdade fica no servidor)
// Jogador: S.camps[i].gift = o que é só dele (guardado para funcionar sem internet)
const CG = {all: {}, err: '', busy: {}};
const gfErr = e => cbMiss(e) ?
  'O homebrew exclusivo ainda não foi ativado neste servidor: rode o bloco "HOMEBREW EXCLUSIVO POR JOGADOR" do supabase.sql no Supabase (SQL Editor) uma vez.' :
  aerr(e);
async function gfMine(c) {
  try {
    const r = await sb.rpc('camp_gifts_mine', {p_camp: c.id});
    if (!r.error && r.data && typeof r.data == 'object') c.gift = r.data
  } catch (e) {
  }
}
async function gfFetch(c) {
  if (!campOk() || typeof sb.rpc != 'function') return CG.all[c.id] || {};
  try {
    const r = await sb.rpc('camp_gifts', {p_camp: c.id});
    if (r.error) throw r.error;
    CG.all[c.id] = r.data && typeof r.data == 'object' ? r.data : {};
    CG.err = ''
  } catch (e) {
    CG.err = gfErr(e)
  }
  return CG.all[c.id] || {}
}
// Envia o que é exclusivo de UM jogador (vazio = nada)
async function gfPush(c, k) {
  const pl = (CG.all[c.id] || {})[k] || {}, empty = !HBT.some(([t]) => (pl[t] || []).length);
  if (!campOk() || typeof sb.rpc != 'function') {
    CG.err = 'Sem internet: o item exclusivo não foi enviado.';
    return
  }
  try {
    const r = await sb.rpc('camp_gift_set', {p_camp: c.id, p_k: k, p_data: empty ? null : pl});
    if (r.error) throw r.error;
    CG.err = ''
  } catch (e) {
    CG.err = gfErr(e)
  }
}
// Item da biblioteca mudou ou foi excluído: atualiza (ou tira) as cópias exclusivas já entregues
async function gfPropagate(t, x, id) {
  for (const c of S.camps || []) {
    if (c.role != 'owner') continue;
    const all = await gfFetch(c);
    for (const k of Object.keys(all)) {
      const l = (all[k] || {})[t] || [], i = l.findIndex(z => z.id == id);
      if (i < 0) continue;
      if (x) l[i] = hbCopy(x);
      else l.splice(i, 1);
      await gfPush(c, k)
    }
  }
}
