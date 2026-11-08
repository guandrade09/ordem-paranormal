/**
 * Campanhas + homebrew: Mestre cria, jogador entra com código e senha, homebrew aparece nas listas do jogador,
 * missões/código/monstros nunca chegam ao jogador. Servidor FALSO em memória que imita as funções do supabase.sql.
 *   node tests/campanhas.test.js
 */
const { loadApp } = require('./helpers/app-loader');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DB = { camps: [], members: [], att: [], n: 0, noSql: false, sheets: [] };

function rpc(uid, name, a) {
  if (DB.noSql) return { data: null, error: { message: 'Could not find the function public.' + name + ' in the schema cache', code: 'PGRST202' } };
  const mine = (id) => DB.camps.find((c) => c.id == id && c.owner == uid);
  if (name == 'camp_create') {
    if ((a.p_pass || '').length < 4) return { error: { message: 'A senha da campanha precisa de pelo menos 4 caracteres.' } };
    const code = String(100000 + DB.camps.length * 7919).slice(0, 6), id = 'c' + ++DB.n;
    DB.camps.push({ id, owner: uid, name: a.p_name, descr: a.p_descr, code, pass: a.p_pass, missions: [], homebrew: {} });
    return { data: { id, code } };
  }
  if (name == 'camp_mine') {
    const out = DB.camps.filter((c) => c.owner == uid).map((c) => ({ id: c.id, role: 'owner', name: c.name, descr: c.descr, homebrew: c.homebrew, missions: c.missions, code: c.code, members: DB.members.filter((m) => m.c == c.id).length }))
      .concat(DB.camps.filter((c) => DB.members.some((m) => m.c == c.id && m.u == uid)).map((c) => ({ id: c.id, role: 'member', name: c.name, descr: c.descr, homebrew: c.homebrew })));
    return { data: JSON.parse(JSON.stringify(out)) };
  }
  if (name == 'camp_update') { const c = mine(a.p_id); if (!c) return { error: { message: 'Campanha não encontrada.' } }; Object.assign(c, { name: a.p_name, descr: a.p_descr, missions: JSON.parse(JSON.stringify(a.p_missions)), homebrew: JSON.parse(JSON.stringify(a.p_homebrew)) }); return { data: 'ts' }; }
  if (name == 'camp_setpass') { const c = mine(a.p_id); if (!c) return { error: { message: 'Campanha não encontrada.' } }; c.pass = a.p_pass; return { data: null }; }
  if (name == 'camp_join') {
    if (DB.att.filter((x) => x == uid).length >= 8) return { error: { message: 'Muitas tentativas. Aguarde alguns minutos.' } };
    const c = DB.camps.find((x) => x.code == String(a.p_code).replace(/\D/g, ''));
    if (!c || c.pass != a.p_pass) { DB.att.push(uid); return { data: { ok: false, msg: 'Código ou senha incorretos.' } }; }
    if (c.owner == uid) return { data: { ok: false, msg: 'Você é o Mestre desta campanha.' } };
    if (!DB.members.some((m) => m.c == c.id && m.u == uid)) DB.members.push({ c: c.id, u: uid });
    return { data: { ok: true, id: c.id } };
  }
  if (name == 'camp_sheet_put') {
    if (!DB.members.some((m) => m.c == a.p_camp && m.u == uid)) return { error: { message: 'Você não está nesta campanha.' } };
    const x = DB.sheets.find((z) => z.c == a.p_camp && z.u == uid && z.cid == a.p_cid), d = JSON.parse(JSON.stringify(a.p_data));
    if (x) { x.data = d; x.upd = new Date(++DB.n + 1.7e12).toISOString(); } else DB.sheets.push({ c: a.p_camp, u: uid, cid: a.p_cid, data: d, upd: new Date(++DB.n + 1.7e12).toISOString() });
    return { data: null };
  }
  if (name == 'camp_sheet_keep') { DB.sheets = DB.sheets.filter((z) => !(z.c == a.p_camp && z.u == uid) || a.p_cids.includes(z.cid)); return { data: null }; }
  if (name == 'camp_sheets') {
    if (!mine(a.p_camp)) return { error: { message: 'Campanha não encontrada.' } };
    return { data: JSON.parse(JSON.stringify(DB.sheets.filter((z) => z.c == a.p_camp).map((z) => ({ k: z.u.slice(0, 8), cid: z.cid, data: z.data, upd: z.upd })))) };
  }
  if (name == 'camp_leave') { DB.sheets = DB.sheets.filter((z) => !(z.c == a.p_id && z.u == uid)); DB.members = DB.members.filter((m) => !(m.c == a.p_id && m.u == uid)); return { data: null }; }
  if (name == 'camp_delete') { DB.camps = DB.camps.filter((c) => !(c.id == a.p_id && c.owner == uid)); DB.members = DB.members.filter((m) => DB.camps.some((c) => c.id == m.c)); return { data: null }; }
  return { error: { message: 'função desconhecida' } };
}
function sbFor(user) {
  const tbl = (t) => { const q = {}; const api = { select() { return api; }, eq() { return api; }, in() { return api; }, maybeSingle() { q.s = 1; return api; }, upsert() { return api; }, delete() { return api; }, then(res, rej) { return Promise.resolve({ data: q.s ? null : [], error: null }).then(res, rej); } }; return api; };
  const auth = { onAuthStateChange(f) { Promise.resolve().then(() => f('INITIAL_SESSION', { user: user })); }, async signOut() { return {}; } };
  return { createClient: () => ({ auth, from: tbl, rpc: async (n, a) => rpc(user.id, n, a) }) };
}
async function mk(user) {
  const app = loadApp({ cfg: { url: 'https://x.supabase.co', key: 'sb_publishable_t' }, supabase: sbFor(user), confirm: () => true });
  await sleep(40);
  return app;
}
const OUT = [];
const T = (n, ok, d) => OUT.push({ n, ok: !!ok, d });
const setIn = (app, o) => { for (const k in app.inputs) delete app.inputs[k]; for (const k in o) app.inputs['#' + k] = { value: o[k], checked: false, closest: () => ({ style: {} }) }; };

(async () => {
  const mestre = await mk({ id: 'm1', email: 'mestre@x.com' }), jog = await mk({ id: 'j1', email: 'jog@x.com' });
  const M = mestre.g, J = jog.g;

  // ---- 1. Mestre cria a campanha
  T('Mestre entra e a lista de campanhas começa vazia', (M.S.camps || []).length == 0 && !M.AU.u == false);
  setIn(mestre, { cn_n: 'Cidade Fantasma', cn_d: 'Uma cidade esquecida.', cn_p: 'abc' });
  await M.campCreate();
  T('Senha curta (<4) é barrada e nada é criado', DB.camps.length == 0);
  setIn(mestre, { cn_n: 'Cidade Fantasma', cn_d: 'Uma cidade esquecida.', cn_p: 'senha1' });
  await M.campCreate();
  const camp = M.S.camps[0];
  T('Criar campanha: servidor guarda e o Mestre recebe código de 6 dígitos', DB.camps.length == 1 && /^\d{6}$/.test(camp.code) && camp.role == 'owner', camp && camp.code);

  // ---- 2. Missões
  M.S.cp = camp.id; M.campMisAdd(); M.campMis(M.campOf(camp.id).missions[0].id, "t", "Investigar o hotel");
  await sleep(1500);
  T('Missão criada e enviada (só o Mestre tem)', DB.camps[0].missions.length == 1 && DB.camps[0].missions[0].t == 'Investigar o hotel');

  // ---- 3. Homebrew: um de cada tipo
  M.S.hbx = camp.id;
  const save = async (t, vals) => { setIn(mestre, Object.fromEntries(Object.entries(vals).map(([k, v]) => ['hf_' + k, v]))); M.hbSave(t, ''); };
  await save('rit', { n: 'Chuva de Cinzas', ci: '2', el: 'Morte', s: 'Cinzas caem do céu.', x: 'Todos em 6m sofrem **2d6** de dano.', ex: 'padrão', al: 'curto', av: 'área', du: 'cena', re: 'Fortitude parcial' });
  await save('hab', { n: 'Faro para Problemas', t: 'Gaste 2 PE para sentir perigo.' });
  await save('pod', { n: 'Pele de Cinza', el: 'Morte', t: 'Você ganha RD 2.', s: 'RD 2.', a: '' });
  await save('mal', { n: 'Faminta', el: 'Sangue', k: 'arma', t: 'A arma devora o que corta.' });
  await save('mel', { n: 'Balanceada', k: 'arma', t: '+1 em ataque.' });
  await save('eqp', { n: 'Cutelo do Açougueiro', k: 'arm', cat: '1', e: '2', t: 'Cutelo pesado.', d: '1d10', c: '19', x: '2', ty: 'corte', m: '1' });
  await save('eqp', { n: 'Colete Reforçado Z', k: 'pro', cat: '2', e: '2', t: 'Colete.', pd: '8', pr: 'Balístico 3' });
  await save('eqp', { n: 'Amuleto Maldito', k: 'amd', cat: '2', e: '1', t: 'Sussurra.', el: 'Energia' });
  await save('rit', { n: "Evil');alert(1);//<img src=x>", ci: '1', el: 'Sangue', s: '<script>alert(2)</script>', x: '<b>x</b>' });
  await sleep(1500);
  const hbS = DB.camps[0].homebrew;
  T('Homebrew dos 6 tipos chega ao servidor', ['rit', 'hab', 'pod', 'mal', 'mel', 'eqp'].every((k) => (hbS[k] || []).length), JSON.stringify(Object.keys(hbS)));
  T('Não existe homebrew de monstros em lugar nenhum', !Object.keys(hbS).some((k) => /mon|amea|thr/i.test(k)));
  M.S.camps[0].d = 0;

  // ---- 4. Jogador: senha errada, depois certa
  await J.campPull();
  setIn(jog, { cj_c: camp.code, cj_p: 'errada' });
  await J.campJoin();
  T('Senha errada: não entra', !(J.S.camps || []).length && !DB.members.length);
  setIn(jog, { cj_c: '000000', cj_p: 'senha1' });
  await J.campJoin();
  T('Código errado: não entra (mesma mensagem)', !DB.members.length);
  setIn(jog, { cj_c: camp.code, cj_p: 'senha1' });
  await J.campJoin();
  const jc = (J.S.camps || [])[0];
  T('Código + senha certos: entra como jogador', DB.members.length == 1 && jc && jc.role == 'member');
  T('Jogador recebe nome, descrição e homebrew — mas NUNCA missões nem código', jc && jc.name == 'Cidade Fantasma' && jc.homebrew.rit.length && jc.missions === undefined && jc.code === undefined, JSON.stringify(Object.keys(jc || {})));

  // freio de tentativas
  for (let i = 0; i < 9; i++) { setIn(jog, { cj_c: '123456', cj_p: 'x' + i }); await J.campJoin(); }
  T('Muitas tentativas erradas são freadas pelo servidor', DB.att.length >= 8 && DB.att.length <= 9);

  // ---- 5. Ficha do jogador: sem vínculo não vê; com vínculo vê em todas as listas
  J.newC(); J.S.d.id = 5e6; J.S.d.name = 'Ana'; J.S.d.classe = 'Ocultista'; J.S.d.origem = 'Acadêmico'; J.S.d.nex = 10; J.S.d.attr = { AGI: 1, FOR: 1, INT: 3, PRE: 2, VIG: 1 }; J.fin();
  const ana = J.cur(); J.S.cid = ana.id; J.S.v = 'sheet'; J.S.tab = 1; J.R();
  const has = () => ({ rit: J.RT.some((r) => r.n == 'Chuva de Cinzas'), pod: J.D.PP.Morte.some((p) => p.n == 'Pele de Cinza'), mal: J.CURSES.some((x) => x.n == 'Faminta'), mel: J.MW_ALL.includes('Balanceada'), arm: J.CAT.arm.some((x) => x[0] == 'Cutelo do Açougueiro'), pro: J.CAT.pro.some((x) => x[0] == 'Colete Reforçado Z'), amd: J.CAT.amd.some((x) => x[0] == 'Amuleto Maldito') });
  T('Ficha NÃO vinculada: nada de homebrew nas listas', Object.values(has()).every((v) => !v), JSON.stringify(has()));
  J.S.cp = jc.id; J.campLink(ana.id); J.S.v = 'sheet'; J.R();
  const h = has();
  T('Ficha vinculada: ritual, poder, maldição, melhoria, arma, proteção e item amaldiçoado aparecem nas listas', Object.values(h).every(Boolean), JSON.stringify(h));
  T('Ritual homebrew traz círculo, elemento e texto de ativação', (() => { const r = J.RT.find((x) => x.n == 'Chuva de Cinzas'); return r.ci == 2 && r.el == 'Morte' && J.INFO['Chuva de Cinzas'][3] == 'cena' && /2d6/.test(J.DS['Chuva de Cinzas'][0]); })());
  T('Lista de rituais do livro (rlist) mostra o ritual homebrew', /Chuva de Cinzas/.test(J.rlist(2)));
  T('Arma homebrew tem dano, crítico e tipo certos', (() => { const x = J.CAT.arm.find((z) => z[0] == 'Cutelo do Açougueiro'); return x[3].d == '1d10' && x[3].c == 19 && x[3].x == 2 && x[3].t == 'corte' && x[3].m == 1; })());
  T('Lista do catálogo (mlist) e descrição mostram o item homebrew', (J.S.mk = 'arm', /Cutelo do Açougueiro/.test(J.mlist())));
  T('Maldição homebrew aparece como opção para armas', J.CURSES.find((x) => x.n == 'Faminta').k == 'arma');
  // adicionar a arma ao inventário pelo fluxo normal e usar a melhoria
  const iw = J.CAT.arm.findIndex((x) => x[0] == 'Cutelo do Açougueiro'); J.add('arm', iw);
  const it = J.cur().inv.find((x) => x.n == 'Cutelo do Açougueiro');
  T('Arma homebrew entra no inventário como arma (dano 1d10)', it && it.w && it.w.d == '1d10');
  T('Melhoria homebrew é oferecida para a arma', J.modOpts(it).includes('Balanceada'));
  // proteção homebrew vale na Defesa
  const ip = J.CAT.pro.findIndex((x) => x[0] == 'Colete Reforçado Z'); const d0 = J.K(J.cur()).def;
  J.add('pro', ip);
  const k1 = J.K(J.cur());
  T('Proteção homebrew soma na Defesa e mostra a resistência', k1.def > d0 && /Colete Reforçado Z/.test(k1.pr.n) && k1.pr.r == 'Balístico 3', d0 + ' → ' + k1.def);
  // habilidade homebrew na aba de habilidades
  const sec = J.hbAbSec(J.cur());
  T('Aba de habilidades oferece a habilidade homebrew', /Faro para Problemas/.test(sec) && /Adicionar/.test(sec));
  J.hbAb(jc.homebrew.hab[0].id);
  T('Adicionar: vira habilidade da ficha, com o custo em PE lido do texto', J.cur().ab.some((a) => a.n == 'Faro para Problemas') && J.abl(J.cur(), J.K(J.cur())).some((p) => p[0] == 'Faro para Problemas' && p[1] == 2));
  J.hbAb(jc.homebrew.hab[0].id);
  T('Remover tira a habilidade', !J.cur().ab.some((a) => a.n == 'Faro para Problemas'));
  J.hbAb(jc.homebrew.hab[0].id);

  // ---- 6. Segurança: texto do Mestre nunca vira HTML/JS no jogador
  const evil = J.RT.find((r) => /Evil/.test(r.n));
  T('Nome do ritual malicioso é limpo (sem aspas, <, >, ponto-e-vírgula de script quebrado)', evil && !/['"<>]/.test(evil.n) && !/<script/i.test(evil.s) && !/<b>/.test(J.DS[evil.n][0]), evil && evil.n);

  // ---- 7. Mestre vê o próprio homebrew nas telas dele
  M.S.v = 'grim'; M.R();
  T('Mestre vê o homebrew nas listas das telas dele (Grimório)', M.RT.some((r) => r.n == 'Chuva de Cinzas'));

  // ---- 7b. Imagem do ritual (homebrew com upload; rituais do livro por slug)
  const IMG = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  M.HB.img = IMG; await save('rit', { n: 'Selo de Cinza', ci: '1', el: 'Morte', s: 'Com imagem.', x: 'Texto.' });
  M.HB.img = 'data:image/svg+xml;base64,PHN2Zz4='; await save('rit', { n: 'Selo Falso', ci: '1', el: 'Morte', s: 'Imagem proibida.', x: 'Texto.' });
  M.HB.img = 'javascript:alert(1)'; await save('rit', { n: 'Selo Js', ci: '1', el: 'Morte', s: 'x', x: 'y' });
  await sleep(1500); await J.campPull(); J.S.v = 'sheet'; J.S.tab = 1; J.R();
  const rs = J.RT.find((r) => r.n == 'Selo de Cinza'), rf = J.RT.find((r) => r.n == 'Selo Falso'), rj = J.RT.find((r) => r.n == 'Selo Js');
  T('Ritual homebrew com imagem: o jogador recebe a imagem', rs && rs.img == IMG);
  T('Imagem que não é PNG/WebP/JPG em base64 (SVG, javascript:) é recusada', rf && rf.img === '' && rj && rj.img === '');
  T('Card do ritual mostra a imagem pequena, sem borda (classe rimg, sem style de borda)', (() => { const h = J.rimg(rs); return /<img class="rimg" src="data:image\/webp/.test(h) && !/border/.test(h) && J.rimg(rf) === ''; })());
  T('Na lista da ficha a imagem vira o ícone do ritual (rimg ic)', /class="rimg ic"/.test(J.rimg(rs, 1)));
  T('A cópia do homebrew guardada na ficha NÃO leva imagens (ficha leve)', J.cur().hbs && !/data:image/.test(JSON.stringify(J.cur().hbs)) && J.cur().hbs.rit.some((r) => r.n == 'Selo de Cinza'));
  T('Ritual do livro sem imagem continua com o desenho de sempre; com slug em RART mostra o PNG', (() => { const r = J.RT.find((z) => z.n == 'Cicatrização'); const a = J.rimg(r); J.RART.add('cicatrizacao'); const b = J.rimg(r); J.RART.delete('cicatrizacao'); return a === '' && /src="img\/rit\/cicatrizacao\.png"/.test(b); })());

  // ---- 7c. Biblioteca do Mestre + seleção por campanha
  M.S.hbx = null;
  await save('hab', { n: 'Habilidade Reserva', t: 'Só para outra campanha.' });
  await save('pod', { n: 'Poder Reserva', el: 'Sangue', t: 'Só para outra campanha.', s: 'x' });
  await sleep(1500);
  const campS = () => DB.camps[0].homebrew;
  T('Item criado pela biblioteca (fora de campanha) NÃO vai para a campanha nem para os jogadores', !(campS().hab || []).some((x) => x.n == 'Habilidade Reserva') && !(campS().pod || []).some((x) => x.n == 'Poder Reserva'));
  await J.campPull(); J.S.v = 'sheet'; J.R();
  T('Jogador não vê o item não marcado (nem na lista de habilidades, nem nos poderes)', !/Habilidade Reserva/.test(J.hbAbSec(J.cur())) && !J.D.PP.Sangue.some((p) => p.n == 'Poder Reserva'));
  M.S.hbx = camp.id; M.S.hbt = 'hab';
  const reserva = M.hbLib().hab.find((x) => x.n == 'Habilidade Reserva');
  M.hbTog('hab', reserva.id); await sleep(1500);
  T('Marcar o check publica o item na campanha', (campS().hab || []).some((x) => x.n == 'Habilidade Reserva'));
  await J.campPull(); J.S.v = 'sheet'; J.R();
  T('Jogador passa a ver o item marcado', /Habilidade Reserva/.test(J.hbAbSec(J.cur())));
  M.hbTog('hab', reserva.id); await sleep(1500);
  await J.campPull(); J.S.v = 'sheet'; J.R();
  T('Desmarcar tira o item dos jogadores (e da cópia da ficha, porque ela não usava)', !(campS().hab || []).some((x) => x.n == 'Habilidade Reserva') && !/Habilidade Reserva/.test(J.hbAbSec(J.cur())) && !((J.cur().hbs || {}).hab || []).some((x) => x.n == 'Habilidade Reserva'));
  M.S.hbt = 'pod'; M.hbAll(1); await sleep(1500);
  T('Marcar todos publica todos do tipo; desmarcar todos limpa', (campS().pod || []).some((x) => x.n == 'Poder Reserva'));
  M.hbAll(0); await sleep(1500);
  T('Desmarcar todos limpa o tipo na campanha, mas a biblioteca continua com os itens', !(campS().pod || []).length && M.hbLib().pod.some((x) => x.n == 'Poder Reserva'));
  // item que a ficha JÁ usa continua funcionando depois de desmarcado
  M.S.hbt = 'hab'; M.hbTog('hab', reserva.id); await sleep(1500); await J.campPull(); J.S.v = 'sheet'; J.R(); J.hbAb(reserva.id.replace(/[^\w]/g, ''));
  M.hbTog('hab', reserva.id); await sleep(1500); await J.campPull(); J.S.v = 'sheet'; J.R();
  T('Item já usado pela ficha continua nela depois de desmarcado', J.cur().ab.some((a) => a.n == 'Habilidade Reserva') && ((J.cur().hbs || {}).hab || []).some((x) => x.n == 'Habilidade Reserva'));
  J.hbAb(reserva.id.replace(/[^\w]/g, '')); J.R();
  // editar na biblioteca atualiza as campanhas que já publicam o item
  M.S.hbx = camp.id; M.S.hbt = 'rit';
  const rr = M.hbLib().rit.find((x) => x.n == 'Chuva de Cinzas');
  setIn(mestre, { hf_n: 'Chuva de Cinzas', hf_ci: '3', hf_el: 'Morte', hf_s: 'Editado.', hf_x: 'Novo texto.' }); M.HB.img = ''; M.hbSave('rit', rr.id); await sleep(1500);
  T('Editar um item da biblioteca atualiza a cópia nas campanhas que o publicam', campS().rit.find((x) => x.n == 'Chuva de Cinzas').ci == '3');
  T('Biblioteca vai para a conta (user_state) e volta num aparelho novo', /"hb"/.test(JSON.stringify(Object.keys(M.stO([]))).concat(M.stO([]).hb ? '"hb"' : '')));

  // ---- 7d. Fichas ao vivo: jogador envia, só o Mestre lê
  await J.csPush();
  T('Ficha vinculada do jogador é enviada à campanha (sem histórico do Desfazer nem cópia do homebrew)', DB.sheets.length == 1 && DB.sheets[0].data.name == 'Ana' && DB.sheets[0].data.hist === undefined && DB.sheets[0].data.hbs === undefined);
  await M.csPoll(true);
  const lista = M.CS.data[camp.id] || [];
  T('Mestre recebe a ficha do jogador (sem poder criar a dele nesta tela)', lista.length == 1 && lista[0].data.name == 'Ana');
  M.S.cp = camp.id; M.S.v = 'camp'; M.R();
  const hc = mestre.el.innerHTML;
  T('Tela da campanha do Mestre mostra "Fichas dos jogadores", sem "Criar ficha neste mundo" nem "Usar aqui"', /Fichas dos jogadores/.test(hc) && /ao vivo/.test(hc) && /Ana/.test(hc) && !/Criar ficha neste mundo/.test(hc) && !/Usar aqui/.test(hc));
  // mudança em tempo real
  J.cur().pv = Math.max(0, J.cur().pv - 3); J.cur().inv.push({ n: 'Lanterna', cat: 0, e: 1, ds: '' }); J.save(); await J.csPush();
  await M.csPoll();
  const lg = (M.CS.log[camp.id] || []).map((e) => e.m);
  T('Mestre vê o registro do que mudou (PV e item novo)', lg.some((m) => /^PV \d+ → \d+$/.test(m)) && lg.includes('Item: Lanterna'), JSON.stringify(lg));
  M.csOpen(lista[0].k, String(lista[0].cid)); const hd = mestre.el.innerHTML;
  T('Detalhe da ficha: PV/PE/SAN, atributos, inventário e mudanças', /Ana/.test(hd) && /Lanterna/.test(hd) && /Mudanças desta ficha/.test(hd) && /PV/.test(hd));
  M.S.v = 'camp';
  // outro Mestre/ jogador não lê; desvincular tira da campanha
  const rj2 = await J.sb.rpc('camp_sheets', { p_camp: camp.id });
  T('Jogador NÃO consegue ler as fichas da campanha (só o Mestre)', !!rj2.error && !rj2.data);
  J.S.cp = jc.id; J.campLink(J.cur().id); await J.csPush();
  T('Desvincular a ficha retira ela da campanha do Mestre', DB.sheets.length == 0);
  J.campLink(J.cur().id); await J.csPush();
  T('Vincular de novo devolve a ficha', DB.sheets.length == 1);

  // ---- 8. Mestre apaga um ritual: a ficha que já usou continua funcionando
  const ana2 = J.cur(); ana2.rit.push('Chuva de Cinzas'); J.S.v = 'sheet'; J.R();
  M.S.hbx = camp.id; M.hbDel2('rit', M.S.camps[0].homebrew.rit[0].id); await sleep(1500);
  await J.campPull(); J.S.v = 'sheet'; J.S.tab = 1;
  let ok8 = true; try { J.R(); J.rsheet(J.cur(), J.K(J.cur())); } catch (e) { ok8 = false; }
  T('Mestre apagou o ritual do servidor: a ficha que já tinha continua abrindo (cópia na ficha)', ok8 && J.RT.some((r) => r.n == 'Chuva de Cinzas'));

  // ---- 9. Jogador sai da campanha: ficha mantém o que já tinha, sem quebrar
  J.S.cp = jc.id; J.S.v = 'camp';
  await J.campRm('camp_leave');
  J.S.cid = ana.id; J.S.v = 'sheet'; J.R();
  T('Sair da campanha: some da lista; ficha continua abrindo com o homebrew que já usava', !(J.S.camps || []).length && !DB.members.length && J.RT.some((r) => r.n == 'Chuva de Cinzas') && J.cur().ab.some((a) => a.n == 'Faro para Problemas'));

  // ---- 10. Ficha nova criada "dentro do mundo"
  DB.att = [];
  setIn(jog, { cj_c: camp.code, cj_p: 'senha1' }); await J.campJoin();
  J.S.cp = (J.S.camps || [])[0].id; J.campNewChar();
  T('Criar ficha neste mundo: a ficha nasce vinculada e já vê o homebrew na criação', J.S.d.camp == J.S.cp && J.S.v == 'create' && J.CAT.arm.some((x) => x[0] == 'Cutelo do Açougueiro'));
  // voltar da ficha aberta pela campanha leva de volta à campanha (e não à lista de agentes)
  const fid = J.S.chars[0].id; J.S.v = 'camp'; J.R(); J.campOpenCh(fid);
  const bh = jog.el.innerHTML;
  T('Ficha aberta pela campanha: o botão de voltar diz "Campanha" e leva para a campanha', J.S.v == 'sheet' && J.S.bk == 'camp' && /← Campanha<\/button>/.test(bh) && /S\.v=S\.bk\|\|/.test(bh));
  J.S.v = J.S.bk || 'home'; J.S.bk = null; J.R();
  T('Depois de voltar, estamos na tela da campanha; abrir ficha pela lista de agentes volta para agentes', J.S.v == 'camp' && (J.S.bk = null, J.S.cid = fid, J.S.v = 'sheet', J.R(), /← Agentes<\/button>/.test(jog.el.innerHTML)));
  J.S.d = null; J.S.v = 'start';

  // ---- 11. Mestre troca a senha / exclui
  M.S.cp = camp.id; setIn(mestre, { cp_p: 'nova123' }); await M.campPass();
  T('Trocar a senha vale no servidor', DB.camps[0].pass == 'nova123');
  setIn(mestre, { cp_p: 'ab' }); await M.campPass();
  T('Senha nova curta é barrada', DB.camps[0].pass == 'nova123');
  await M.campRm('camp_delete');
  T('Excluir campanha apaga no servidor e do cache', DB.camps.length == 0 && !(M.S.camps || []).length);

  // ---- 12. Servidor sem o SQL novo: avisa e nada quebra
  DB.noSql = true; M.S.v = 'start'; M.AU.u = M.AU.u;
  const ok = await M.campPull();
  M.campGo(); await sleep(30);
  T('Sem o SQL no Supabase: mensagem clara e o app segue funcionando', ok === false && /supabase\.sql/.test(M.CAMP.err) && /Campanhas/.test(mestre.el.innerHTML));
  DB.noSql = false;

  // ---- 13. Telas renderizam
  M.S.camps = [{ id: 'z', role: 'owner', name: 'T<b>x</b>', descr: 'd<script>1</script>', code: '123456', members: 1, missions: [{ id: 'a', t: '"><img src=x>', d: '', ok: 0 }], homebrew: {} }];
  M.S.v = 'camps'; M.R(); const h1 = mestre.el.innerHTML;
  M.S.cp = 'z'; M.S.v = 'camp'; M.R(); const h2 = mestre.el.innerHTML;
  M.S.hbx = 'z'; M.S.v = 'hbm'; M.R(); const h3 = mestre.el.innerHTML;
  T('Telas de campanha, detalhe e homebrew renderizam e escapam HTML', /Campanhas/.test(h1) && /Missões/.test(h2) && /Homebrew/.test(h3) && !/<img src=x/.test(h2) && !/<script>1/.test(h1 + h2) && !/<b>x<\/b>/.test(h1));
  M.S.v = 'start'; M.R();
  T('Início tem o botão Campanhas abaixo de Jogador e Mestre', (() => { const h = mestre.el.innerHTML; return h.indexOf('Jogador') < h.indexOf('Mestre') && h.indexOf('Mestre') < h.indexOf('Campanhas'); })());
  T('Menu do Mestre tem a opção Homebrew', M.MS.includes('Homebrew'));

  OUT.forEach((r) => console.log(`${r.ok ? 'OK   ' : 'FALHA'} | ${r.n}${r.ok ? '' : ' → ' + r.d}`));
  const f = OUT.filter((r) => !r.ok);
  console.log(`${OUT.length - f.length}/${OUT.length} verificações passaram`);
  process.exit(f.length ? 1 : 0);
})().catch((e) => { OUT.forEach((r) => console.log((r.ok ? 'OK   ' : 'FALHA') + ' | ' + r.n + (r.ok ? '' : ' → ' + r.d))); console.log('ERRO', e); process.exit(1); });
