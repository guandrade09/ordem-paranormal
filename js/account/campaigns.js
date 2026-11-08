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
      return l && l.d && x.role == 'owner' ? l : x
    });
    CAMP.err = '';
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
    if (e && !busy) e.innerHTML = cmbPlH()
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
if (typeof setInterval == 'function') setInterval(csTick, 4000);


// ---- Combate da campanha: o Mestre publica só a ORDEM (nome, turno, rodada; nada de dado ou número de iniciativa)
const CB = {data: {}, sig: {}, t: null, pb: 0, on: {}};

// Mestre: publica (com atraso) o combate da campanha aberta; sem combate em andamento = apaga
function cmbPub() {
  clearTimeout(CB.t);
  CB.t = setTimeout(cmbPubGo, 600)
}
async function cmbPubGo() {
  const c = campOf(S.cp);
  if (!c || c.role != 'owner' || !campOk() || typeof sb.rpc != 'function') return;
  const m = (S.cmbs || {})[c.id];
  const pub = m && m.on && m.l.length ?
    {on: 1, r: m.r, c: m.c, l: m.l.map(x => ({id: x.id, n: String(x.n).slice(0, 60)}))} : null;
  try {
    await sb.rpc('camp_combat_set', {p_camp: c.id, p_data: pub})
  } catch (e) {
  }
}

// Jogador (e Mestre): busca a ordem publicada
async function cbPoll() {
  const c = campOf(S.cp);
  if (!c || c.role != 'member' || !campOk() || typeof sb.rpc != 'function' || CB.pb) return;
  CB.pb = 1;
  try {
    const r = await sb.rpc('camp_combat_get', {p_camp: c.id});
    if (!r.error) {
      const d = r.data && r.data.on ? r.data : null, sig = JSON.stringify(d);
      if (sig !== CB.sig[c.id]) {
        const first = CB.sig[c.id] === undefined;
        CB.sig[c.id] = sig;
        CB.data[c.id] = d;
        if (d && !CB.on[c.id] && !first) toast('⚔ Combate iniciado!');
        CB.on[c.id] = !!d;
        if (S.v == 'camp' && S.cp == c.id) {
          const e = $('#cbl');
          if (e) e.innerHTML = cbH(c)
        }
      }
    }
  } catch (e) {
  }
  CB.pb = 0
}
