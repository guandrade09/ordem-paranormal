/**
 * Campanhas + homebrew: Mestre cria, jogador entra com código e senha, homebrew aparece nas listas do jogador,
 * missões/código/monstros nunca chegam ao jogador. Servidor FALSO em memória que imita as funções do supabase.sql.
 *   node tests/campanhas.test.js
 */
const { loadApp } = require('./helpers/app-loader');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DB = { camps: [], members: [], att: [], n: 0, noSql: false, sheets: [], combat: {}, noCombat: false };

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
  if ((name == 'camp_combat_set' || name == 'camp_combat_get') && DB.noCombat) return { error: { message: 'Could not find the function public.' + name + ' in the schema cache' } };
  if (name == 'camp_combat_set') {
    if (!mine(a.p_camp)) return { error: { message: 'Campanha não encontrada.' } };
    if (a.p_data == null) delete DB.combat[a.p_camp]; else DB.combat[a.p_camp] = JSON.parse(JSON.stringify(a.p_data));
    return { data: null };
  }
  if (name == 'camp_combat_get') {
    if (!mine(a.p_camp) && !DB.members.some((m) => m.c == a.p_camp && m.u == uid)) return { error: { message: 'Campanha não encontrada.' } };
    return { data: DB.combat[a.p_camp] ? JSON.parse(JSON.stringify(DB.combat[a.p_camp])) : null };
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
  T('Ao entrar na campanha, abre a escolha de personagem (antes da tela inicial), com criar ficha neste mundo e sem o botão de sair', /Escolha seu personagem/.test(jog.el.innerHTML) && /Criar ficha neste mundo/.test(jog.el.innerHTML) && /Cidade Fantasma/.test(jog.el.innerHTML) && !/Sair da campanha/.test(jog.el.innerHTML));

  // freio de tentativas
  for (let i = 0; i < 9; i++) { setIn(jog, { cj_c: '123456', cj_p: 'x' + i }); await J.campJoin(); }
  T('Muitas tentativas erradas são freadas pelo servidor', DB.att.length >= 8 && DB.att.length <= 9);

  // ---- 5. Ficha do jogador: sem vínculo não vê; com vínculo vê em todas as listas
  J.newC(); J.S.d.id = 5e6; J.S.d.name = 'Ana'; J.S.d.classe = 'Ocultista'; J.S.d.origem = 'Acadêmico'; J.S.d.nex = 10; J.S.d.attr = { AGI: 1, FOR: 1, INT: 3, PRE: 2, VIG: 1 }; J.fin();
  const ana = J.cur(); J.S.cid = ana.id; J.S.v = 'sheet'; J.S.tab = 1; J.R();
  const has = () => ({ rit: J.RT.some((r) => r.n == 'Chuva de Cinzas'), pod: J.D.PP.Morte.some((p) => p.n == 'Pele de Cinza'), mal: J.CURSES.some((x) => x.n == 'Faminta'), mel: J.MW_ALL.includes('Balanceada'), arm: J.CAT.arm.some((x) => x[0] == 'Cutelo do Açougueiro'), pro: J.CAT.pro.some((x) => x[0] == 'Colete Reforçado Z'), amd: J.CAT.amd.some((x) => x[0] == 'Amuleto Maldito') });
  T('Ficha NÃO vinculada: nada de homebrew nas listas', Object.values(has()).every((v) => !v), JSON.stringify(has()));
  J.S.cp = jc.id; J.S.v = 'camp'; J.R();
  T('Sem ficha escolhida a campanha continua na tela de escolha (mostra a ficha existente)', /Escolha seu personagem/.test(jog.el.innerHTML) && /Ana/.test(jog.el.innerHTML));
  J.campPick(ana.id);
  const pv = jog.el.innerHTML;
  T('Depois de escolher: tela inicial com título, descrição, "Ficha" com o card do personagem, quadro do combate e Sair — sem "Minhas fichas"', /Cidade Fantasma/.test(pv) && /class=bar>Ficha</.test(pv) && /Ana/.test(pv) && /cbbox/.test(pv) && /Sair da campanha/.test(pv) && !/Minhas fichas/.test(pv) && !/Escolha seu personagem/.test(pv) && ana.camp == jc.id);
  T('Botão Sair da campanha é o último elemento da tela (rodapé)', pv.lastIndexOf('Sair da campanha') > pv.lastIndexOf('cbbox') && pv.lastIndexOf('Trocar de ficha') < pv.lastIndexOf('Sair da campanha'));
  J.S.v = 'sheet'; J.R();
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
  // habilidade homebrew: entra na lista de poderes de classe (subida de NEX); NÃO existe seção na aba de ações
  const inPow = (app, n, cl) => app.D[cl].pow.some((z) => z.n == n);
  T('Habilidade homebrew "Geral" entra nos poderes das três classes', ['Combatente', 'Especialista', 'Ocultista'].every((cl) => inPow(J, 'Faro para Problemas', cl)));
  J.S.lv = { x: { q: '' } };
  T('Aparece na lista de escolha de poder ao subir de NEX', /Faro para Problemas/.test(J.plist()));
  J.S.lv = null; J.S.v = 'sheet'; J.S.tab = 1; J.R();
  T('Aba de ações NÃO tem a seção "Habilidades homebrew"', !/Habilidades homebrew/.test(jog.el.innerHTML));
  J.abAdd(J.cur(), { n: 'Faro para Problemas', t: 'Gaste 2 PE para sentir perigo.', pw: 1 });
  T('Ao escolher o poder: vira habilidade da ficha, com o custo em PE lido do texto', J.cur().ab.some((a) => a.n == 'Faro para Problemas') && J.abl(J.cur(), J.K(J.cur())).some((p) => p[0] == 'Faro para Problemas' && p[1] == 2));

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
  T('Jogador não vê o item não marcado (nem na lista de habilidades, nem nos poderes)', !inPow(J, 'Habilidade Reserva', 'Ocultista') && !J.D.PP.Sangue.some((p) => p.n == 'Poder Reserva'));
  M.S.hbx = camp.id; M.S.hbt = 'hab';
  const reserva = M.hbLib().hab.find((x) => x.n == 'Habilidade Reserva');
  M.hbTog('hab', reserva.id); await sleep(1500);
  T('Marcar o check publica o item na campanha', (campS().hab || []).some((x) => x.n == 'Habilidade Reserva'));
  await J.campPull(); J.S.v = 'sheet'; J.R();
  T('Jogador passa a ver o item marcado', inPow(J, 'Habilidade Reserva', 'Ocultista'));
  M.hbTog('hab', reserva.id); await sleep(1500);
  await J.campPull(); J.S.v = 'sheet'; J.R();
  T('Desmarcar tira o item dos jogadores (e da cópia da ficha, porque ela não usava)', !(campS().hab || []).some((x) => x.n == 'Habilidade Reserva') && !inPow(J, 'Habilidade Reserva', 'Ocultista') && !((J.cur().hbs || {}).hab || []).some((x) => x.n == 'Habilidade Reserva'));
  M.S.hbt = 'pod'; M.hbAll(1); await sleep(1500);
  T('Marcar todos publica todos do tipo; desmarcar todos limpa', (campS().pod || []).some((x) => x.n == 'Poder Reserva'));
  M.hbAll(0); await sleep(1500);
  T('Desmarcar todos limpa o tipo na campanha, mas a biblioteca continua com os itens', !(campS().pod || []).length && M.hbLib().pod.some((x) => x.n == 'Poder Reserva'));
  // item que a ficha JÁ usa continua funcionando depois de desmarcado
  M.S.hbt = 'hab'; M.hbTog('hab', reserva.id); await sleep(1500); await J.campPull(); J.S.v = 'sheet'; J.R(); J.abAdd(J.cur(), { n: 'Habilidade Reserva', t: 'Só para outra campanha.', pw: 1 });
  M.hbTog('hab', reserva.id); await sleep(1500); await J.campPull(); J.S.v = 'sheet'; J.R();
  T('Item já usado pela ficha continua nela depois de desmarcado', J.cur().ab.some((a) => a.n == 'Habilidade Reserva') && ((J.cur().hbs || {}).hab || []).some((x) => x.n == 'Habilidade Reserva'));
  J.cur().ab = J.cur().ab.filter((a) => a.n != 'Habilidade Reserva'); J.R();
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
  J.S.cp = jc.id; delete J.cur().camp; J.save(); await J.csPush();
  T('Desvincular a ficha retira ela da campanha do Mestre', DB.sheets.length == 0);
  J.campPick(J.cur().id); await J.csPush();
  T('Vincular de novo devolve a ficha', DB.sheets.length == 1);
  // uma ficha só por campanha: escolher outra tira a anterior
  J.newC(); J.S.d.id = 5e6 + 1; J.S.d.name = 'Bia'; J.S.d.classe = 'Combatente'; J.S.d.origem = 'Acadêmico'; J.S.d.nex = 10; J.S.d.attr = { AGI: 1, FOR: 3, INT: 1, PRE: 1, VIG: 2 }; J.fin();
  const bia = J.cur(); J.S.cp = jc.id; J.S.cpc = 1; J.S.v = 'camp'; J.R();
  T('"Trocar de ficha": mostra a escolha, com a atual marcada', /Escolha seu personagem/.test(jog.el.innerHTML) && /✔ atual/.test(jog.el.innerHTML) && /Bia/.test(jog.el.innerHTML));
  J.campPick(bia.id); await J.csPush();
  T('Escolher outra ficha tira a anterior da campanha (e do Mestre): só uma por campanha', bia.camp == jc.id && !ana.camp && DB.sheets.length == 1 && DB.sheets[0].data.name == 'Bia');
  J.campPick(ana.id); await J.csPush(); J.chDel(bia.id); J.S.cid = ana.id; J.S.v = 'sheet'; J.R();
  T('Volta a ficha da Ana para a campanha', ana.camp == jc.id && DB.sheets.length == 1 && DB.sheets[0].data.name == 'Ana');

  // ---- 7d2. É a MESMA ficha: o que o jogador muda na aba Agentes (fora da campanha) também chega ao Mestre
  J.S.v = 'home'; J.R();
  const antes = DB.sheets[0].data.pv;
  J.S.cid = J.cur().id; J.mut((z) => { z.pv = Math.max(0, z.pv - 2); z.inv.push({ n: 'Corda', cat: 0, e: 1, ds: '' }); });
  await sleep(2300);
  T('Edição feita pela aba Agentes chega sozinha à cópia da campanha (sem abrir a campanha)', DB.sheets[0].data.pv === antes - 2 && DB.sheets[0].data.inv.some((i) => i.n == 'Corda'), antes + ' → ' + DB.sheets[0].data.pv);
  J.cur().pv += 1; J.save(); J.csFlush(); await sleep(50);
  T('csFlush manda na hora (app indo para segundo plano)', DB.sheets[0].data.pv === antes - 1);
  await M.csPoll(true);
  T('Mestre vê o valor novo ao vivo', (M.CS.data[camp.id].find((x) => x.data.name == 'Ana') || {}).data.pv === antes - 1);

  // ---- 7e. Ritual homebrew com versões Discente e Verdadeiro
  const chk = (id, on) => { mestre.inputs['#hf_' + id] = { type: 'checkbox', checked: on, value: '', closest: () => ({ style: {} }) }; };
  const ritV = async (vals, flags) => { setIn(mestre, Object.fromEntries(Object.entries(vals).map(([k, v]) => ['hf_' + k, v]))); Object.entries(flags).forEach(([k, v]) => chk(k, v)); M.hbSave('rit', ''); };
  await ritV({ n: 'Ritual Triplo', ci: '1', el: 'Sangue', s: 'r', x: 'Normal.', dt: 'Texto do discente.', dp: '', dr: '2', vt: 'Texto do verdadeiro.', vp: '4', vr: '3' }, { hd: true, da: false, hv: true, va: true });
  await ritV({ n: 'Ritual Só Normal', ci: '1', el: 'Sangue', s: 'r', x: 'Só normal.', dt: 'não deve aparecer', vt: 'não deve aparecer' }, { hd: false, da: true, hv: false, va: true });
  await ritV({ n: 'Ritual Só Verdadeiro', ci: '2', el: 'Morte', s: 'r', x: 'N.', vt: 'V.', vp: '', vr: '' }, { hd: false, da: false, hv: true, va: false });
  await sleep(1500); await J.campPull(); J.S.v = 'sheet'; J.R();
  const rt = (n) => J.RT.find((r) => r.n == n);
  T('Ritual com Discente e Verdadeiro: PE a mais, círculo exigido e afinidade (PE vazio usa +2 / +5)', JSON.stringify(rt('Ritual Triplo').d) == '[2,2,0]' && JSON.stringify(rt('Ritual Triplo').v) == '[4,3,1]', JSON.stringify([rt('Ritual Triplo').d, rt('Ritual Triplo').v]));
  T('Ritual sem as versões marcadas fica só com o Normal (mesmo com afinidade marcada e texto escrito)', rt('Ritual Só Normal').d === null && rt('Ritual Só Normal').v === null && J.DS['Ritual Só Normal'].length == 3 && !J.DS['Ritual Só Normal'][1] && !J.DS['Ritual Só Normal'][2]);
  T('Ritual só com Verdadeiro: Discente indisponível, Verdadeiro sem requisito', rt('Ritual Só Verdadeiro').d === null && JSON.stringify(rt('Ritual Só Verdadeiro').v) == '[5,1,0]');
  T('Descrição mostra os textos de Discente e Verdadeiro; o resumo diz o requisito', /Discente:<\/b> .*Texto do discente/.test(J.rdesc(rt('Ritual Triplo'))) && /Verdadeiro:<\/b> .*Texto do verdadeiro/.test(J.rdesc(rt('Ritual Triplo'))) && /requer 3º círculo\) \(afinidade\)/.test(J.rver(rt('Ritual Triplo'))) && !/Discente:<\/b>/.test(J.rdesc(rt('Ritual Só Normal'))));
  T('Formulário: check de existência e requisito de 2º a 4º círculo (sem 1º)', /class=ck id=hf_hd checked/.test(M.hbField(['hd', 'x', 'c'], '1')) && /Sem requisito/.test(M.hbField(['dr', 'x', 's', M.HBREQ], '')) && !/Requer 1º/.test(M.hbField(['dr', 'x', 's', M.HBREQ], '')) && /Requer 4º/.test(M.hbField(['dr', 'x', 's', M.HBREQ], '')));
  M.S.hbx = camp.id;

  // ---- 7f. Combate da campanha: Mestre vê tudo, jogador só a ordem
  await M.csPoll(true);
  M.S.cp = camp.id; M.S.v = 'camp'; M.R();
  J.S.cp = camp.id; J.S.v = 'camp'; J.R();
  T('Campanha do Mestre tem o botão do Criador de Combates; a do jogador não', /Criador de Combates/.test(mestre.el.innerHTML) && !/Criador de Combates/.test(jog.el.innerHTML));
  M.campCombat(); await sleep(50);
  T('Tela do combate na campanha lista os jogadores presentes (fichas vinculadas)', M.S.v == 'cmbc' && /Jogadores presentes/.test(mestre.el.innerHTML) && /Ana/.test(M.cmbPlH()) && M.CMBP.l.length == 1);
  setIn(mestre, { cmn: 'Zumbi', cmr: '12', cmb: '2', cmh: '' }); M.cmbAdd();
  setIn(mestre, { cpd0: '17' }); M.cmbAddP(0);
  const cm1 = M.S.cmbs[camp.id];
  T('Jogador presente entra pela lista (sem digitar o nome), com iniciativa = dado + bônus da ficha', cm1.l.length == 2 && cm1.l.some((x) => x.n == 'Ana' && x.d == 17 && x.p));
  T('Combate da campanha não mexe no combate do menu do Mestre', !M.S.cmb || !M.S.cmb.l.length);
  M.R(); T('Jogador já adicionado aparece como "na ordem"', /na ordem/.test(M.cmbPlH()));
  await sleep(1000);
  await J.campPull(); J.S.cp = camp.id; J.S.v = 'camp'; await J.cbPoll();
  T('Antes de clicar em Combate!, o jogador não vê nada', !DB.combat[camp.id] && !J.cbH(J.campOf(camp.id)));
  M.cmbGo(); await sleep(1000); await J.cbPoll();
  const pub = DB.combat[camp.id], ph = J.cbH(J.campOf(camp.id));
  T('Ao clicar em Combate!, o servidor recebe a ordem final (nomes na ordem certa, turno e rodada)', pub && pub.on == 1 && pub.r == 1 && pub.l.length == 2 && pub.l[0].n == 'Ana' && pub.l[1].n == 'Zumbi' && pub.c == pub.l[0].id, JSON.stringify(pub));
  T('O que vai para o servidor NÃO tem dado, bônus nem número de iniciativa', !/"(i|d|b|p)":/.test(JSON.stringify(pub)), JSON.stringify(pub));
  T('Jogador vê a ordem e o turno atual, sem os números de iniciativa', /Ana/.test(ph) && /Zumbi/.test(ph) && /Turno atual/.test(ph) && /Rodada 1/.test(ph) && !/cmbi/.test(ph));
  T('Mestre vê a página normal com os números', /cmbi/.test(mestre.el.innerHTML = M.cmbv()) && /Pode atrasar/.test(mestre.el.innerHTML));
  M.cmbNext(); await sleep(1000); await J.cbPoll();
  T('Próximo turno chega ao jogador', J.CB.data[camp.id].c == pub.l[1].id);
  M.cmbEnd(); await sleep(1000); await J.cbPoll();
  T('Ao encerrar o combate some para o jogador', !DB.combat[camp.id] && !J.cbH(J.campOf(camp.id)));
  const lixo = await J.sb.rpc('camp_combat_set', { p_camp: camp.id, p_data: { on: 1, l: [] } });
  T('Jogador NÃO consegue publicar combate (só o Mestre)', !!lixo.error && !DB.combat[camp.id]);
  M.cmbClear(); M.S.v = 'camp';

  // ---- 7g. Custo de PE e classe nas habilidades, poderes e maldições
  M.S.hbx = camp.id;
  await save('hab', { n: 'Golpe Teste', cl: 'Combatente', pe: '3', t: 'Um golpe.' });
  await save('hab', { n: 'Passiva Zero', cl: 'Geral', pe: '0', t: 'Gasta 5 PE (texto), mas o campo diz 0.' });
  await save('hab', { n: 'Custo Do Texto', cl: 'Especialista', pe: '', t: 'Você gasta 6 PE para isso.' });
  await save('pod', { n: 'Poder Pago', el: 'Sangue', pe: '4', t: 'Poder.', s: 's', a: '' });
  await save('mal', { n: 'Maldição Paga', el: 'Morte', k: 'arma', pe: '2', t: 'Maldição que gasta PE.' });
  await sleep(1500); await J.campPull(); J.S.v = 'sheet'; J.S.tab = 0; J.R();
  T('Habilidade de classe só aparece na classe dela (Geral aparece nas três)', inPow(J, 'Golpe Teste', 'Combatente') && !inPow(J, 'Golpe Teste', 'Ocultista') && !inPow(J, 'Golpe Teste', 'Especialista') && inPow(J, 'Passiva Zero', 'Ocultista') && inPow(J, 'Passiva Zero', 'Combatente') && inPow(J, 'Custo Do Texto', 'Especialista') && !inPow(J, 'Custo Do Texto', 'Combatente'));
  const custo = (n, extra) => { J.abAdd(J.cur(), Object.assign({ n, t: 'x', pw: 1 }, extra || {})); const v = J.abl(J.cur(), J.K(J.cur())).find((p) => p[0] == n); J.cur().ab = J.cur().ab.filter((a) => a.n != n); return v && v[1]; };
  T('Campo de custo de PE da habilidade vale (3); 0 vale como passiva; vazio lê do texto (6)', custo('Golpe Teste') === 3 && custo('Passiva Zero') === 0 && custo('Custo Do Texto') === 6, [custo('Golpe Teste'), custo('Passiva Zero'), custo('Custo Do Texto')].join());
  T('Poder paranormal homebrew com custo de PE (4)', custo('Poder Pago', { el: 'Sangue' }) === 4);
  T('Maldição homebrew com custo de PE (2) fica usável (CUX), com resumo', J.CUX['Maldição Paga'] && J.CUX['Maldição Paga'].pe == 2 && /Maldição que gasta PE/.test(J.CUX['Maldição Paga'].s));
  T('Formulário tem Classe e Custo de PE em habilidade, poder e maldição', ['hab', 'pod', 'mal'].every((t) => M.HBF[t].some((f) => f[0] == 'pe' && f[2] == 'n')) && M.HBF.hab.some((f) => f[0] == 'cl' && f[3].map((o) => o[0]).join() == 'Geral,Combatente,Especialista,Ocultista'));
  M.S.hbx = null; await J.campPull(); J.S.v = 'sheet'; J.R();

  // ---- 7f2. Ameaça diversa e do livro, vida (só do Mestre), ficha da ameaça
  M.S.cp = camp.id; M.S.v = 'cmbc'; M.S.cmbk = 'd'; M.R();
  setIn(mestre, { cmn: 'Cultista', cmr: '10', cmb: '1', cmh: '30' }); M.cmbAdd();
  M.S.cmbk = 'l'; M.R();
  const zb = M.THREATS.find((t) => t.id == 'zumbi-de-sangue');
  setIn(mestre, { cmt: zb.id, cmr: '14', cmb: '2' }); M.cmbAdd();
  setIn(mestre, { cmt: zb.id, cmr: '8', cmb: '0' }); M.cmbAdd();
  await M.csPoll(true); M.cmbPlH(); setIn(mestre, { cpd0: '11' }); M.cmbAddP(0);
  const l2 = M.S.cmbs[camp.id].l, cu = l2.find((x) => x.n == 'Cultista'), z1 = l2.find((x) => x.n == 'Zumbi de Sangue'), z2 = l2.find((x) => x.n == 'Zumbi de Sangue 2'), an = l2.find((x) => x.p);
  T('Ameaça diversa: nome, dado e vida digitada', cu && cu.hp == 30 && cu.mx == 30 && !cu.th && cu.d == 10);
  T('Ameaça do livro: vida automática do livro e nome numerado quando repete', z1 && z2 && z1.hp == zb.pv[0] && z1.th == zb.id && z2.hp == zb.pv[0]);
  mestre.el.innerHTML = M.cmbv();
  const hv = mestre.el.innerHTML;
  T('Tela do Mestre mostra a vida de todos e o nome da ameaça do livro é link para a ficha', /PV <b class=cmhv/.test(hv) && /cmbTh\('zumbi-de-sangue'\)/.test(hv) && /Ameaça diversa/.test(hv) && /Ameaça do livro/.test(hv));
  const dano = (x, n, sg) => { setIn(mestre, n === '' ? {} : { ['hpd' + x.id]: String(n) }); M.cmbHp(x.id, sg); return x.hp; };
  T('Mestre reduz e aumenta a vida da ameaça (limites 0 e máximo)', dano(cu, 5, -1) == 25 && dano(cu, '', 1) == 26 && dano(cu, 99, 1) == 30 && dano(cu, 999, -1) == 0);
  T('Vida de jogador NÃO é editável pelo Mestre (só ao vivo)', (() => { const a0 = an.hp; M.cmbHp(an.id, -1); return an.hp === a0 && !/hpd/.test(M.cmbHpH(an)) && /ao vivo/.test(M.cmbHpH(an)); })());
  const sh0 = DB.sheets.find((x) => x.data.name == 'Ana').data;
  T('Vida do jogador presente vem da ficha dele', M.cmbHpT(an) == sh0.pv + '/' + M.csMax(sh0).pv, M.cmbHpT(an));
  J.cur().pv = Math.max(0, J.cur().pv - 1); J.save(); await J.csPush(); await M.csPoll(true);
  T('Vida do jogador atualiza ao vivo no combate do Mestre', M.cmbHpT(an) == (sh0.pv - 1) + '/' + M.csMax(sh0).pv || M.cmbHpT(an).split('/')[0] == String(J.cur().pv), M.cmbHpT(an));
  M.cmbTh(zb.id);
  T('Tocar na ameaça abre a ficha dela, com "← Combate" para voltar', M.S.v == 'thd' && M.S.thbk == 'cmbc' && /← Combate/.test(M.thd()));
  M.thBack();
  T('Voltar da ficha da ameaça retorna ao combate da campanha', M.S.v == 'cmbc' && M.S.thbk == null);
  M.cmbGo(); await sleep(1000); await J.cbPoll();
  const pj = JSON.stringify(DB.combat[camp.id]), jv = J.cbH(J.campOf(camp.id));
  T('Servidor recebe só a ordem (nomes, turno, rodada): sem vida, ficha, dado nem iniciativa', /Zumbi de Sangue 2/.test(pj) && /Cultista/.test(pj) && !/"(hp|mx|th|d|b|i|p)":/.test(pj), pj);
  T('Jogador vê nomes, rodada e turno; NENHUMA vida nem número de dado', /Zumbi de Sangue 2/.test(jv) && /Rodada 1/.test(jv) && !/PV|cmhp|cmbi|30|hp/.test(jv.replace(/cmbn/g, '')), jv);
  // sem o SQL novo: o erro aparece (Mestre e jogador), nada quebra
  DB.noCombat = true; M.S.v = 'cmbc'; M.cmbPub(); await sleep(900); await J.cbPoll();
  T('Sem o SQL do combate: Mestre vê aviso vermelho com o nome do bloco', /COMBATE NA CAMPANHA/.test(M.CB.err) && /COMBATE NA CAMPANHA/.test(M.cmbv()));
  J.S.cp = camp.id; J.CB.data[camp.id] = null; DB.noCombat = true; await J.cbPoll();
  T('Sem o SQL do combate: jogador vê "indisponível" (e não quebra)', /indisponível/.test(J.cbH(J.campOf(camp.id))));
  DB.noCombat = false; M.cmbPub(); await sleep(900);
  T('Com o SQL ativo o aviso some e o combate é publicado', M.CB.err === '' && M.CB.ok === 1 && DB.combat[camp.id]);
  M.cmbClear(); await sleep(900); M.S.v = 'camp';

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
