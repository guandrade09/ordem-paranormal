/**
 * Conta: sincronização das fichas com o banco (pull, push, resolução de pendências).
 */

// Baixa fichas da conta e mescla com as locais
async function pull() {
  const u = AU.u;
  SYNC.st = '⏳ Carregando suas fichas…';
  const [a, b] = await Promise.all([
    sb.from('characters').select('cid,data').eq('user_id', u.id),
    sb.from('user_state').select('data').eq('user_id', u.id).maybeSingle()
  ]);
  if (a.error) throw a.error;
  if (b.error) throw b.error;
  syncLoad(u.id);
  if (S.uid && S.uid != u.id) {
    S.chars = [];
    S.cid = null;
    S.cmb = null;
    SYNC.h = {}
  } else if (!S.uid && S.chars.length &&
    !confirm('Encontramos ' + S.chars.length +
      ' ficha(s) salva(s) neste aparelho. Importar para a sua conta?\n\nOK = importar · Cancelar = descartar'))
    S.chars = [];
  S.uid = u.id;
  const loc = new Map(S.chars.map(c => [String(c.id), c])), rids = new Set();
  (a.data || []).forEach(r => {
    rids.add(r.cid);
    const l = loc.get(r.cid);
    if (l && SYNC.h[r.cid] !== hs(JSON.stringify(l))) return;
    // ficha que já foi sincronizada, mas não existe mais aqui = apagada neste aparelho (talvez offline):
    // não ressuscita; o push seguinte apaga na conta
    if (!l && r.cid in SYNC.h) return;
    const c = r.data;
    if (l)
      S.chars[S.chars.indexOf(l)] = c;
    else
      S.chars.push(c);
    SYNC.h[r.cid] = hs(JSON.stringify(c))
  });
  S.chars = S.chars.filter(c => {
    const k = String(c.id);
    return rids.has(k) || !(k in SYNC.h) || SYNC.h[k] !== hs(JSON.stringify(c))
  });
  const stN = () => hs(JSON.stringify({theme: S.theme || null, cmb: S.cmb || null})), rs = b.data && b.data.data;
  if (rs && (SYNC.h['#st'] === undefined || SYNC.h['#st'] === stN())) {
    if (rs.theme !== undefined) S.theme = rs.theme || undefined;
    if (rs.cmb) S.cmb = rs.cmb;
    try {
      if (S.theme) document.documentElement.dataset.theme = S.theme
    } catch (e) {
    }
    SYNC.h['#st'] = stN()
  }
  if (!cur()) S.cid = null;
  syncPut();
  save();
  SYNC.st = '☁ Sincronizado'
}

// Agenda envio (debounce)
function syncSoon() {
  if (!SB_ON || !sb || !AU.u) return;
  if (S.lv && S.lv.bak) return;  // subida de NEX em andamento: não envia ficha pela metade (envia ao concluir/cancelar)
  clearTimeout(SYNC.t);
  SYNC.t = setTimeout(push, 1200)
}

// Envia alterações pendentes (upsert/delete)
async function push() {
  if (!sb || !AU.u || AU.rec || AU.off || S.uid != AU.u.id) return;
  if (S.lv && S.lv.bak) return;  // idem: nada pela metade
  if (SYNC.busy) {
    SYNC.again = 1;
    return
  }
  const uid = AU.u.id, up = [], nh = {};
  S.chars.forEach(c => {
    const k = String(c.id), v = hs(JSON.stringify(c));
    nh[k] = v;
    if (SYNC.h[k] !== v) up.push({user_id: uid, cid: k, data: c})
  });
  const del = Object.keys(SYNC.h).filter(k => k != '#st' && !(k in nh)),
        st = {theme: S.theme || null, cmb: S.cmb || null}, sv = hs(JSON.stringify(st));
  if (!up.length && !del.length && SYNC.h['#st'] === sv) return;
  SYNC.busy = 1;
  SYNC.st = '⏳ Salvando…';
  stR();
  try {
    if (up.length) {
      const r = await sb.from('characters').upsert(up, {onConflict: 'user_id,cid'});
      if (r.error) throw r.error
    }
    if (del.length) {
      const r = await sb.from('characters').delete().eq('user_id', uid).in('cid', del);
      if (r.error) throw r.error
    }
    if (SYNC.h['#st'] !== sv) {
      const r = await sb.from('user_state').upsert({user_id: uid, data: st}, {onConflict: 'user_id'});
      if (r.error) throw r.error
    }
    nh['#st'] = sv;
    SYNC.h = nh;
    syncPut();
    SYNC.st = '☁ Salvo na conta'
  } catch (e) {
    SYNC.st = '⚠ Não sincronizou: ' + aerr(e);
    SYNC.t = setTimeout(push, 15000)
  }
  SYNC.busy = 0;
  stR();
  if (SYNC.again) {
    SYNC.again = 0;
    syncSoon()
  }
}

// Sincronizar agora
async function syncNow() {
  clearTimeout(SYNC.t);
  try {
    while (SYNC.busy) await new Promise(r => setTimeout(r, 100));
    await push();
    await pull();
    toast('Sincronizado');
    R()
  } catch (e) {
    SYNC.st = '⚠ ' + aerr(e);
    stR();
    toast(SYNC.st)
  }
}
