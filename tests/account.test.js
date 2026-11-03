/**
 * Teste do sistema de contas (login, cadastro, recuperação de senha, JWT/sessão e sincronização das fichas).
 * Usa um Supabase FALSO em memória — não acessa a internet nem o seu projeto real.
 *
 *   node tests/account.test.js
 */
const { loadApp } = require('./helpers/app-loader');

let CONF = true; // resposta do confirm() do navegador
// ---- Supabase falso: servidor em memória que imita Auth + tabelas com RLS (cada usuário só vê as próprias linhas)
const DB={users:{},chars:{},st:{}},LOG=[];let cb=null,SESS=null,FAIL=false;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const query=(tb)=>{const q={tb,f:{},op:'sel'};const api={select(){q.op='sel';return api},eq(k,v){q.f[k]=v;return api},in(k,v){q.f['in:'+k]=v;return api},maybeSingle(){q.single=1;return api},
 upsert(rows){q.op='up';q.rows=rows;return api},delete(){q.op='del';return api},
 then(res,rej){return Promise.resolve().then(()=>{if(FAIL)return{data:null,error:{message:'Failed to fetch'}};
  if(!SESS)return{data:null,error:{message:'JWT'}};const uid=SESS.user.id;// RLS
  const T=tb=='characters'?DB.chars:DB.st;
  if(q.op=='sel'){let rows=Object.values(T).filter(r=>r.user_id==uid&&(!q.f.user_id||q.f.user_id==uid));if(q.f.user_id&&q.f.user_id!=uid)rows=[];return{data:q.single?(rows[0]||null):rows,error:null}}
  if(q.op=='up'){for(const r of [].concat(q.rows)){if(r.user_id!=uid)return{error:{message:'RLS violation'}};T[r.user_id+'/'+(r.cid||'')]={...r,data:JSON.parse(JSON.stringify(r.data))}}LOG.push('up:'+tb+':'+[].concat(q.rows).length);return{error:null}}
  if(q.op=='del'){const ids=q.f['in:cid'];for(const k of Object.keys(T))if(T[k].user_id==uid&&ids.includes(T[k].cid))delete T[k];LOG.push('del:'+ids.join(','));return{error:null}}}).then(res,rej)}};return api};
const auth={
 onAuthStateChange(f){cb=f;Promise.resolve().then(()=>f('INITIAL_SESSION',SESS))},
 async signInWithPassword({email,password}){const u=DB.users[email];if(!u||u.pw!=password)return{error:{message:'Invalid login credentials'}};if(!u.ok)return{error:{message:'Email not confirmed'}};SESS={user:{id:u.id,email}};cb('SIGNED_IN',SESS);return{data:{session:SESS}}},
 async signUp({email,password,options}){LOG.push('signup:'+options.emailRedirectTo);if(DB.users[email])return{data:{user:{identities:[]},session:null}};DB.users[email]={id:'u'+Object.keys(DB.users).length,pw:password,ok:DB.autoOk};if(DB.autoOk){SESS={user:{id:DB.users[email].id,email}};cb('SIGNED_IN',SESS);return{data:{user:{identities:[1]},session:SESS}}}return{data:{user:{identities:[1]},session:null}}},
 async resetPasswordForEmail(e,o){LOG.push('reset:'+e+':'+o.redirectTo);return{error:null}},
 async updateUser({password}){const em=SESS.user.email;if(DB.users[em].pw==password)return{error:{message:'New password should be different from the old password.'}};DB.users[em].pw=password;return{data:{}}},
 async signOut(){SESS=null;cb('SIGNED_OUT',null);return{}}};
const supabaseFake={createClient:(u,k,o)=>{LOG.push('client:'+o.auth.persistSession+':'+o.auth.autoRefreshToken+':'+!!o.auth.storage);return{auth,from:query}}};

async function main() {
  const app = loadApp({ cfg: { url: 'https://x.supabase.co', key: 'sb_publishable_teste' }, supabase: supabaseFake, confirm: () => CONF });
  const E = app.el, inputs = app.inputs, ls = app.ctx.localStorage;
  const CODIGO = app.scripts.map((s) => s.code).join('\n');
  const fn = (n) => (...a) => app.g[n](...a);
  const X = {
    S: () => app.g.S, AU: () => app.g.AU, SYNC: () => app.g.SYNC, R: fn('R'), pull: fn('pull'), push: fn('push'), aSub: fn('aSub'),
    aMode: fn('aMode'), aOut: fn('aOut'), aEv: fn('aEv'), syncNow: fn('syncNow'), loginv: fn('loginv'), hs: fn('hs'), save: fn('save'),
    authGate: () => app.g.authGate(), setS: (v) => app.setState(v),
  };
  const OUT = [];
  const T = (n, e, o, ok) => OUT.push((ok ? 'OK   ' : 'FALHA') + ' | ' + n + ' | esp: ' + e + ' | obs: ' + o);
  const set = (id, v) => { inputs['#' + id] = { value: v, checked: v === true }; };
  const clear = () => { for (const k in inputs) delete inputs[k]; };

 await sleep(30);
 T('Sem sessão: mostra a tela de login (e não o app)','login com E-mail, Senha, Manter-me logado, Esqueci a senha, Criar conta',(()=>{const h=E.innerHTML;return [/id=aem/.test(h),/id=apw/.test(h),/Manter-me logado/.test(h),/Esqueci a senha/.test(h),/Criar conta/.test(h)].join(',')})(),/id=aem/.test(E.innerHTML)&&/id=apw/.test(E.innerHTML)&&/Manter-me logado/.test(E.innerHTML)&&/Esqueci a senha/.test(E.innerHTML)&&/Criar conta/.test(E.innerHTML)&&X.authGate());
 T('Cliente criado com sessão persistente, auto-refresh do JWT e storage próprio','persist:true auto:true storage:true',LOG.find(x=>x.startsWith('client:')),LOG.includes('client:true:true:true'));
 // criar conta
 X.aMode('up');T('Tela "Criar conta" tem repetir senha','#apw2',/id=apw2/.test(E.innerHTML)?'presente':'ausente',/id=apw2/.test(E.innerHTML));
 const bad=async(em,p1,p2,txt)=>{set('aem',em);set('apw',p1);set('apw2',p2);await X.aSub();return X.AU().msg};
 let m=await bad('abc','12345678','12345678');T('Cadastro: e-mail inválido é barrado','"Digite um e-mail válido."',m,/e-mail válido/.test(m));
 m=await bad('a@b.com','123','123');T('Cadastro: senha curta (<8) é barrada','mensagem de 8 caracteres',m,/8 caracteres/.test(m));
 m=await bad('a@b.com','12345678','12345679');T('Cadastro: senhas diferentes são barradas','"As senhas não são iguais."',m,/não são iguais/.test(m));
 DB.autoOk=false;set('aem','Gustavo@Teste.com');set('apw','senha1234');set('apw2','senha1234');await X.aSub();
 T('Cadastro válido com confirmação por e-mail: avisa para confirmar e volta ao login','modo "in" + aviso com o e-mail (minúsculo); redirect para a URL do app',X.AU().mode+' | '+X.AU().ok+' | '+LOG.find(x=>x.startsWith('signup')),X.AU().mode=='in'&&/gustavo@teste\.com/.test(X.AU().ok)&&LOG.includes('signup:https://exemplo.github.io/app/'));
 X.aMode('up');set('aem','gustavo@teste.com');set('apw','senha1234');set('apw2','senha1234');await X.aSub();
 T('Cadastro com e-mail já existente: mensagem clara','"Este e-mail já tem conta…"',X.AU().msg,/já tem conta/.test(X.AU().msg));
 // login antes de confirmar
 X.aMode('in');set('aem','gustavo@teste.com');set('apw','senha1234');set('akp',true);await X.aSub();
 T('Login antes de confirmar o e-mail é barrado','"Confirme seu e-mail…"',X.AU().msg,/Confirme seu e-mail/.test(X.AU().msg)&&!X.AU().u);
 DB.users['gustavo@teste.com'].ok=true;
 set('apw','errada123');await X.aSub();T('Login com senha errada','"E-mail ou senha incorretos."',X.AU().msg,/incorretos/.test(X.AU().msg)&&!X.AU().u);
 // dados locais pré-existentes
 const S0=X.S();S0.chars=[{id:111,n:'Local A'},{id:112,n:'Local B'}];
 set('apw','senha1234');set('akp',true);CONF=true;await X.aSub();await sleep(80);
 T('Login correto: entra no app (gate liberado), mantém logado (localStorage)','usuário logado; op_keep=1',(X.AU().u&&X.AU().u.email)+' | keep='+ls.getItem('op_keep'),!!X.AU().u&&!X.authGate()&&ls.getItem('op_keep')=='1');
 await sleep(1500);
 T('Fichas locais antigas importadas para a conta (confirmou) e enviadas ao servidor','2 fichas no servidor do usuário',Object.values(DB.chars).map(r=>r.cid).join(','),Object.values(DB.chars).length==2&&X.S().uid==X.AU().u.id);
 // nova ficha -> push automático
 X.S().chars.push({id:113,n:'Nova C',x:[1,2]});X.save();await sleep(1500);
 T('Nova ficha é enviada automaticamente (debounce)','3 fichas no servidor; status "Salvo na conta"',Object.keys(DB.chars).length+' | '+X.SYNC().st,Object.keys(DB.chars).length==3&&/Salvo/.test(X.SYNC().st));
 // edição
 X.S().chars.find(c=>c.id==111).n='Local A editada';X.save();await sleep(1500);
 T('Edição de ficha vai só dessa ficha (upsert de 1)','servidor com nome atualizado; último upsert = 1 linha',DB.chars['u0/111'].data.n+' | '+LOG.filter(x=>x.startsWith('up:characters')).pop(),DB.chars['u0/111'].data.n=='Local A editada'&&LOG.filter(x=>x.startsWith('up:characters')).pop()=='up:characters:1');
 // exclusão
 X.S().chars=X.S().chars.filter(c=>c.id!=112);X.save();await sleep(1500);
 T('Excluir ficha remove no servidor','112 apagada',Object.values(DB.chars).map(r=>r.cid).sort().join(','),!DB.chars['u0/112']&&Object.keys(DB.chars).length==2);
 // tema
 X.S().theme='dark';X.save();await sleep(1500);
 T('Tema/estado do usuário sincroniza (user_state)','theme=dark no servidor',JSON.stringify(DB.st['u0/']&&DB.st['u0/'].data),DB.st['u0/']&&DB.st['u0/'].data.theme=='dark');
 // outro aparelho: simula local vazio e pull
 const keepRemote=JSON.stringify(Object.values(DB.chars).map(r=>r.cid).sort());
 X.setS({chars:[],v:'start',tab:0});ls.setItem('op_sync',JSON.stringify({uid:'u0',h:{}}));
 await X.pull();T('Outro aparelho (vazio): baixa as fichas da conta','111 e 113 + tema dark',X.S().chars.map(c=>c.id).sort().join(',')+' | '+X.S().theme,X.S().chars.length==2&&X.S().theme=='dark');
 // queda de rede
 FAIL=true;X.S().chars.push({id:114,n:'Offline D'});X.save();await sleep(1500);
 T('Sem rede: mostra aviso e tenta de novo depois, sem perder a ficha local','status ⚠; ficha 114 segue local',X.SYNC().st+' | local='+X.S().chars.length,/⚠/.test(X.SYNC().st)&&X.S().chars.length==3);
 FAIL=false;clearTimeout(X.SYNC().t);await X.push();
 T('Rede volta: sincroniza o que ficou pendente','114 no servidor',Object.values(DB.chars).map(r=>r.cid).sort().join(','),!!DB.chars['u0/114']&&/Salvo/.test(X.SYNC().st));
 // sair
 CONF=true;await X.aOut();await sleep(30);
 T('Sair: encerra sessão, apaga fichas locais deste aparelho e volta ao login','sem usuário; chars=[]; login visível',(X.AU().u?'logado':'deslogado')+' | chars='+X.S().chars.length+' | login='+/id=aem/.test(E.innerHTML),!X.AU().u&&X.S().chars.length==0&&/id=aem/.test(E.innerHTML)&&Object.keys(DB.chars).length==3);
 // segundo usuário isolado (RLS + local)
 DB.users['outra@pessoa.com']={id:'u9',pw:'outrasenha1',ok:true};
 X.aMode('in');set('aem','outra@pessoa.com');set('apw','outrasenha1');set('akp',false);await X.aSub();await sleep(80);
 T('Segundo usuário no mesmo aparelho: não vê fichas do primeiro','0 fichas; keep=0 (sessão só nesta aba)',X.S().chars.length+' | keep='+ls.getItem('op_keep'),X.S().chars.length==0&&ls.getItem('op_keep')=='0');
 X.S().chars.push({id:900,n:'Dela'});X.save();await sleep(1500);
 T('Dados do segundo usuário ficam separados (RLS)','ficha 900 só do u9; 3 do u0 intactas',Object.values(DB.chars).map(r=>r.user_id+':'+r.cid).sort().join(' '),DB.chars['u9/900']&&Object.values(DB.chars).filter(r=>r.user_id=='u0').length==3);
 // tentativa de escrever como outro usuário
 const sbc=supabaseFake.createClient('','',{auth:{storage:1}});const r=await sbc.from('characters').upsert([{user_id:'u0',cid:'777',data:{}}],{onConflict:'user_id,cid'});
 T('Tentativa de gravar na conta de outro usuário é recusada pelo servidor (RLS)','erro',r.error&&r.error.message,!!r.error&&!DB.chars['u0/777']);
 await X.aOut();await sleep(30);
 // esqueci a senha
 X.aMode('forgot');T('Tela "Esqueci a senha" só pede e-mail','sem campo de senha',/id=apw/.test(E.innerHTML)?'tem senha':'sem senha',!/id=apw/.test(E.innerHTML)&&/id=aem/.test(E.innerHTML));
 set('aem','gustavo@teste.com');await X.aSub();
 T('Esqueci a senha: pede o e-mail de redefinição com retorno para o app','reset:gustavo@teste.com:https://exemplo.github.io/app/',LOG.find(x=>x.startsWith('reset:')),LOG.includes('reset:gustavo@teste.com:https://exemplo.github.io/app/')&&/enviamos um link/.test(X.AU().ok));
 // link do e-mail -> PASSWORD_RECOVERY
 SESS={user:{id:'u0',email:'gustavo@teste.com'}};await X.aEv('PASSWORD_RECOVERY',SESS);
 T('Link do e-mail abre a tela "Nova senha" (sem liberar o app)','campos nova senha; gate ativo',(/Repita a senha/.test(E.innerHTML)?'tela nova senha':'?')+' | gate='+X.authGate(),/Repita a senha/.test(E.innerHTML)&&X.authGate()&&!/id=aem/.test(E.innerHTML));
 set('apw','curta');set('apw2','curta');await X.aSub();T('Nova senha curta é barrada','8 caracteres',X.AU().msg,/8 caracteres/.test(X.AU().msg));
 set('apw','senha1234');set('apw2','senha1234');await X.aSub();T('Nova senha igual à atual é recusada pelo servidor','"precisa ser diferente"',X.AU().msg,/diferente/.test(X.AU().msg));
 set('apw','novaSenha99');set('apw2','novaSenha99');await X.aSub();await sleep(80);
 T('Nova senha salva e usuário entra no app','senha trocada; logado; gate livre',DB.users['gustavo@teste.com'].pw+' | '+(X.AU().u?'logado':'não')+' | rec='+X.AU().rec,DB.users['gustavo@teste.com'].pw=='novaSenha99'&&!!X.AU().u&&!X.AU().rec&&!X.authGate());
 T('Fichas do usuário voltam após o login (dados ficaram na conta)','111 e 114 e 113',X.S().chars.map(c=>c.id).sort().join(','),X.S().chars.length==3);
 // segurança no HTML
 X.aMode('in');set('aem','"><img src=x onerror=alert(1)>');X.AU().em='"><img src=x onerror=alert(1)>';X.AU().msg='<b>x</b>';const h=X.loginv();
 T('Entradas exibidas são escapadas (anti-XSS) na tela de login','sem <img> nem <b> crus',/<img/.test(h)||/<b>x/.test(h)?'vulnerável':'escapado',!/<img/.test(h)&&!/<b>x/.test(h));
 T('Chave exposta no código é só a "anon" (CFG tem url+key; nenhuma service_role)','sem "service_role" no código',/service_role/.test(CODIGO)?'achou':'ok',!/service_role/.test(CODIGO));
 return OUT;
}

module.exports = { main };

if (require.main === module) {
  main().then((out) => {
    out.forEach((l) => console.log(l));
    const falhas = out.filter((l) => l.startsWith('FALHA')).length;
    console.log(`\n${out.length - falhas}/${out.length} verificações passaram`);
    process.exit(falhas ? 1 : 0);
  }).catch((e) => { console.error('ERRO', e); process.exit(1); });
}
