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
