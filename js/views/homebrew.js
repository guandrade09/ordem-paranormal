/**
 * Homebrew do Mestre (por campanha): editor (menu do Mestre) e "injeção" nas listas que o app já tem.
 * Tipos: rit (ritual), hab (habilidade), pod (poder paranormal), mal (maldição), mel (melhoria/modificação),
 * eqp (equipamento: arma, proteção, munição, utilidade, paranormal, amaldiçoado). NÃO existe homebrew de monstros.
 * Os jogadores recebem o homebrew da campanha pelo servidor (js/account/campaigns.js) e ele entra nas MESMAS listas
 * do livro (RT, D.PP, CURSES, MW_*, CAT) enquanto a ficha vinculada à campanha está aberta (hbSync, chamado por R()).
 */

const HBT = [
  ['rit', 'Ritual'], ['hab', 'Habilidade'], ['pod', 'Poder paranormal'], ['mal', 'Maldição'],
  ['mel', 'Melhoria'], ['eqp', 'Equipamento']
],
      HBEL = ['Sangue', 'Morte', 'Conhecimento', 'Energia'],
      HBEQ = [['arm', 'Arma'], ['pro', 'Proteção'], ['mun', 'Munição'], ['uti', 'Utilidade'], ['par', 'Paranormal'],
              ['amd', 'Amaldiçoado']],
      HBF = {
        rit: [
          ['n', 'Nome', 't'], ['ci', 'Círculo', 's', [['1', '1º'], ['2', '2º'], ['3', '3º'], ['4', '4º']]],
          ['el', 'Elemento', 's', [...HBEL, 'Medo'].map(e => [e, e])], ['s', 'Resumo (uma linha)', 't'],
          ['x', 'Descrição completa', 'a'], ['ex', 'Execução (ex.: padrão)', 't'], ['al', 'Alcance', 't'],
          ['av', 'Alvo / Área', 't'], ['du', 'Duração', 't'], ['re', 'Resistência', 't'],
          ['img', 'Imagem do ritual (PNG, opcional)', 'i']
        ],
        hab: [['n', 'Nome', 't'], ['t', 'Descrição (se escrever "gasta 2 PE", o custo aparece no botão)', 'a']],
        pod: [
          ['n', 'Nome', 't'], ['el', 'Elemento', 's', HBEL.map(e => [e, e])], ['t', 'Descrição', 'a'],
          ['s', 'Resumo (opcional)', 't'], ['a', 'Afinidade (opcional)', 'a']
        ],
        mal: [
          ['n', 'Nome', 't'], ['el', 'Elemento', 's', HBEL.map(e => [e, e])],
          ['k', 'Aplica em', 's',
           [['arma', 'Qualquer arma'], ['corpo', 'Só corpo a corpo'], ['prot', 'Proteções e escudo'],
            ['acc', 'Utensílios e vestuários']]],
          ['t', 'Descrição', 'a']
        ],
        mel: [
          ['n', 'Nome', 't'],
          ['k', 'Aplica em', 's',
           [['arma', 'Armas'], ['fogo', 'Só armas de fogo'], ['prot', 'Proteções'], ['acc', 'Acessórios']]],
          ['t', 'Efeito', 'a']
        ],
        eqp: [
          ['n', 'Nome', 't'], ['k', 'Tipo de equipamento', 's', HBEQ],
          ['cat', 'Categoria', 's', [['0', '0'], ['1', 'I'], ['2', 'II'], ['3', 'III'], ['4', 'IV']]],
          ['e', 'Espaços', 'n'], ['t', 'Descrição', 'a'], ['el', 'Elemento (só amaldiçoado)', 's', HBEL.map(e => [e, e])],
          ['d', 'Dano (ex.: 1d8) — arma', 't'], ['c', 'Margem de crítico (ex.: 19) — arma', 'n'],
          ['x', 'Multiplicador do crítico (ex.: 2) — arma', 'n'],
          ['ty', 'Tipo de dano — arma', 's',
           ['corte', 'impacto', 'perfuração', 'balístico', 'fogo', 'gelo', 'químico'].map(e => [e, e])],
          ['m', 'Corpo a corpo?', 's', [['1', 'Sim'], ['0', 'Não (à distância)']]],
          ['pd', 'Defesa — proteção', 'n'],
          ['pr', 'Resistência (texto) — proteção', 't'], ['q', 'Quantidade/ataques — munição', 'n']
        ]
      };
const HB = {k: [], key: '', mw: [], mod: {prot: [], acc: []}},
      HBMOD = HB.mod,
      // texto seguro (o Mestre escreve, o jogador lê: nunca confiar no HTML)
      hbT = s => String(s == null ? '' : s)
                   .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
                   .slice(0, 4000),
      // nome seguro (vai dentro de onclick="...('nome')" e do id "nome|elemento")
      hbN = s => String(s == null ? '' : s).replace(/[<>"'`\\|&{}$\r\n]/g, '').trim().slice(0, 60),
      hbId = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3) + (hbId.n = (hbId.n || 0) + 1).toString(36);

// Homebrew efetivo: junta as campanhas ativas; ficha vinculada guarda uma cópia (c.hbs) que nunca perde o que já tinha
function hbData() {
  const out = {rit: [], hab: [], pod: [], mal: [], mel: [], eqp: []}, L = S.camps || [], seen = {};
  let c = null;
  try {
    c = (S.v == 'sheet' || S.v == 'npc') ? cur() : (S.v == 'create' ? S.d : null)
  } catch (e) {
  }
  const add = (h) => HBT.forEach(([t]) => (h && h[t] || []).forEach(x => {
    if (!x || !x.n) return;
    const k = t + '|' + (x.id || x.n);
    if (seen[k]) return;
    seen[k] = 1;
    out[t].push(x)
  }));
  const own = c && !c.npc && c.camp ? L.find(x => x.id == c.camp) : null;
  if (c && !c.npc && c.camp) {
    if (own) {
      const old = c.hbs || {}, mg = {};
      HBT.forEach(([t]) => {
        const nw = (own.homebrew && own.homebrew[t]) || [], ids = new Set(nw.map(x => x.id));
        mg[t] = nw.concat((old[t] || []).filter(x => x && !ids.has(x.id)))
      });
      const sn = {};  // a cópia na ficha não leva imagens (a ficha não pode ficar pesada)
      HBT.forEach(([t]) => {sn[t] = mg[t].map(x => x && x.img ? (({img, ...r}) => r)(x) : x)});
      if (JSON.stringify(sn) != JSON.stringify(old) && S.v != 'create') c.hbs = sn;
      add(mg)
    } else
      add(c.hbs)
  } else
    L.filter(x => x.role == 'owner').forEach(x => add(x.homebrew));
  return out
}

// Lista de um tipo para a tela atual
const hbSrc = t => hbData()[t] || [], hbI = x => String((x && x.id) || '').replace(/[^\w]/g, '');

function hbClear() {
  const cut = (a) => {
    for (let i = a.length - 1; i >= 0; i--)
      if (a[i] && a[i].hb) a.splice(i, 1)
  };
  cut(RT);
  cut(CURSES);
  Object.keys(CAT).forEach(k => cut(CAT[k]));
  Object.keys(D.PP || {}).forEach(e => cut(D.PP[e]));
  HB.k.forEach(([o, k]) => {delete o[k]});
  HB.k = [];
  [MW_ALL, MW_FIRE].forEach(a => {
    for (let i = a.length - 1; i >= 0; i--)
      if (HB.mw.includes(a[i])) a.splice(i, 1)
  });
  HB.mw = [];
  HBMOD.prot.length = 0;
  HBMOD.acc.length = 0
}

function hbApply(H) {
  hbClear();
  const put = (o, k, v) => {
    o[k] = v;
    HB.k.push([o, k])
  }, free = (n, ...os) => n && !os.some(o => n in o);
  H.rit.forEach(r => {
    const n = hbN(r.n);
    if (!n || RT.some(z => z.n == n)) return;
    const el = [...HBEL, 'Medo'].includes(r.el) ? r.el : 'Conhecimento', ci = Math.min(4, Math.max(1, +r.ci || 1));
    RT.push({ci, el, n, s: hbT(r.s || r.x).slice(0, 140), d: null, v: null, hb: 1,
             img: typeof r.img == 'string' && r.img.length <= HBIMGMAX + 2000 && HBIMG.test(r.img) ? r.img : ''});
    put(INFO, n, [hbT(r.ex), hbT(r.al), hbT(r.av), hbT(r.du), hbT(r.re)]);
    put(DS, n, [hbT(r.x || r.s)])
  });
  H.pod.forEach(p => {
    const n = hbN(p.n), el = HBEL.includes(p.el) ? p.el : 'Conhecimento';
    if (!n || !D.PP[el] || D.PP[el].some(z => z.n == n)) return;
    D.PP[el].push({n, t: hbT(p.t), s: hbT(p.s), p: '', a: hbT(p.a), hb: 1})
  });
  H.mal.forEach(m => {
    const n = hbN(m.n), el = HBEL.includes(m.el) ? m.el : 'Conhecimento';
    if (!n || CURSES.some(z => z.n == n)) return;
    CURSES.push({n, el, k: ['arma', 'corpo', 'prot', 'acc'].includes(m.k) ? m.k : 'arma', t: hbT(m.t), hb: 1})
  });
  H.mel.forEach(m => {
    const n = hbN(m.n);
    if (!free(n, MTX)) return;
    put(MTX, n, hbT(m.t));
    if (m.k == 'fogo') {
      MW_FIRE.push(n);
      HB.mw.push(n)
    } else if (m.k == 'prot')
      HBMOD.prot.push(n);
    else if (m.k == 'acc')
      HBMOD.acc.push(n);
    else {
      MW_ALL.push(n);
      HB.mw.push(n)
    }
  });
  H.eqp.forEach(q => {
    const n = hbN(q.n), k = HBEQ.some(x => x[0] == q.k) ? q.k : 'uti';
    if (!n || CAT[k].some(z => z[0] == n) || BR[n]) return;
    const cat = Math.min(4, Math.max(0, +q.cat || 0)), e = Math.max(0, +q.e || 0), ds = hbT(q.t);
    let it;
    if (k == 'arm') {
      it = [n, cat, e, {
        m: q.m == '0' ? 0 : 1, d: hbT(q.d || '1d6').slice(0, 12), c: Math.max(2, Math.min(20, +q.c || 20)),
        x: Math.max(2, Math.min(6, +q.x || 2)), t: hbT(q.ty || 'impacto')
      }, ds]
    } else if (k == 'mun')
      it = [n, cat, e, {q: Math.max(1, Math.floor(+q.q || 1))}, ds];
    else if (k == 'amd')
      it = [n, cat, e, {}, `**${HBEL.includes(q.el) ? q.el : 'Conhecimento'}.** ${ds}`];
    else
      it = [n, cat, e, {}, ds];
    if (k == 'pro') it.hp = {d: Math.max(0, Math.floor(+q.pd || 0)), r: hbT(q.pr)};
    it.hb = 1;
    CAT[k].push(it);
    put(BR, n, ds)
  });
}

// Chamada por R(): reaplica o homebrew só quando ele (ou a ficha/tela) mudou
function hbSync() {
  let H;
  try {
    H = hbData()
  } catch (e) {
    H = {rit: [], hab: [], pod: [], mal: [], mel: [], eqp: []}
  }
  const key = JSON.stringify(H);
  if (key === HB.key) return;
  HB.key = key;
  try {
    hbApply(H)
  } catch (e) {
    hbClear()
  }
}

// ---- Habilidades homebrew na aba de habilidades da ficha ----
function hbAbSec(c) {
  const l = hbSrc('hab');
  if (!l.length) return '';
  return `<div class=bar>Habilidades homebrew</div>${l.map(h => {
    const has = (c.ab || []).some(a => a.hb == hbI(h));
    return `<div class="card row"><div style="flex:1"><b>${hbT(hbN(h.n))}</b><br><small>${
      md(hbT(h.t).slice(0, 90))}${hbT(h.t).length > 90 ? '…' : ''}</small></div><button class=btn style="width:auto;padding:6px 12px" onclick="hbAb('${
      hbI(h)}')">${has ? 'Remover' : 'Adicionar'}</button></div>`
  }).join('')}`
}
function hbAb(id) {
  const h = hbSrc('hab').find(x => hbI(x) == id);
  if (!h) return;
  mut(c => {
    c.ab = c.ab || [];
    if (c.ab.some(a => a.hb == id))
      c.ab = c.ab.filter(a => a.hb != id);
    else
      abAdd(c, {n: hbN(h.n), t: hbT(h.t), hb: id})
  })
}

// ---- Editor do Mestre ----
function hbMine() {
  return (S.camps || []).filter(x => x.role == 'owner')
}
function hbCur() {
  const L = hbMine();
  return L.find(x => x.id == S.hbc) || L[0] || null
}
function hbmv() {
  const L = hbMine(), c = hbCur(), t = S.hbt || 'rit';
  if (!L.length)
    return `<div class=fade><button onclick="S.v='mestre';R()">← Voltar</button><div class=bar>Homebrew</div><div class=card style="text-align:center;padding:26px 10px">Homebrew é guardado dentro de uma campanha.<br><small>Crie uma campanha na aba Campanhas do início para começar.</small></div><button class=btn onclick="campGo()">Ir para Campanhas</button></div>`;
  const l = (c.homebrew && c.homebrew[t]) || [];
  return `<div class=fade><button onclick="S.v='mestre';R()">← Voltar</button><div class=bar>Homebrew</div>${
    L.length > 1 ?
      `<div class=pills>${L.map(x => `<button class="${x.id == c.id ? 'on' : ''}" onclick="S.hbc='${x.id}';R()">${
                              aesc(x.name)}</button>`).join('')}</div>` :
      `<small>Campanha: <b>${aesc(c.name)}</b></small>`}<small style="display:block;margin:4px 0 8px;opacity:.75">Os jogadores da campanha recebem tudo daqui nas listas deles (rituais, armas, habilidades…). Monstros nunca são compartilhados.</small><div class=pills>${
    HBT.map(([k, n]) => `<button class="${k == t ? 'on' : ''}" onclick="S.hbt='${k}';R()">${n}</button>`).join('')
  }</div><button class=btn onclick="hbEdit('${t}','')">+ Novo(a) ${HBT.find(x => x[0] == t)[1].toLowerCase()}</button>${
    l.map(x => `<div class="card row" onclick="hbEdit('${t}','${x.id}')">${
      HBIMG.test(x.img || '') ? `<img class="rimg ic" style="width:48px;height:48px" src="${x.img}" alt="">` : ''}<div style="flex:1"><b>${aesc(x.n)}</b><br><small>${
      aesc(hbSub(t, x))}</small></div><button class=x onclick="event.stopPropagation();hbDel('${t}','${x.id}')">✕</button></div>`)
      .join('') || '<p><small>Nada criado neste tipo ainda.</small></p>'}</div>`
}
function hbSub(t, x) {
  return t == 'rit' ? `${x.ci || 1}º círculo · ${x.el || ''}` :
    t == 'pod' || t == 'mal'                              ? `${x.el || ''}${x.k ? ' · ' + x.k : ''}` :
    t == 'mel'                                            ? 'Melhoria · ' + (x.k || 'arma') :
    t == 'eqp'                                            ? (HBEQ.find(z => z[0] == x.k) || [, ''])[1] :
                                                            String(x.t || '').slice(0, 60)
}
function hbField(f, v) {
  const [k, lb, ty, op] = f, id = 'hf_' + k;
  v = v == null ? '' : v;
  if (ty == 'i')
    return `<div><small>${lb}</small><img id=hf_img_p class=rimg src="${HB.img || ''}" alt="" style="${
      HB.img ? '' : 'display:none'}"><input type=file accept="image/png,image/webp,image/jpeg" onchange="hbPick(this)" style="width:100%"><button class=btn style="width:auto;padding:4px 12px" onclick="hbImgX()">Tirar imagem</button><small style="display:block;opacity:.7">Fica pequena (até 160 px). PNG sem fundo fica melhor.</small></div>`;
  if (ty == 'a')
    return `<label><small>${lb}</small><textarea id=${id} rows=4 style="width:100%">${aesc(v)}</textarea></label>`;
  if (ty == 's')
    return `<label><small>${lb}</small><select id=${id} ${k == 'k' && lb == 'Tipo de equipamento' ? 'onchange="hbEqK()"' : ''} style="width:100%">${
      op.map(([a, b]) => `<option value="${aesc(a)}" ${String(v) == a ? 'selected' : ''}>${b}</option>`).join('')}</select></label>`;
  return `<label><small>${lb}</small><input id=${id} ${ty == 'n' ? 'type=number inputmode=numeric' : ''} value="${
    aesc(v)}" style="width:100%"></label>`
}
function hbEdit(t, id) {
  const c = hbCur(), x = id ? ((c.homebrew[t] || []).find(z => z.id == id) || {}) : {};
  HB.img = x.img || '';
  modal(`<button class=xc onclick="cm()">✕</button><b>${id ? 'Editar' : 'Novo(a)'} ${
    HBT.find(z => z[0] == t)[1].toLowerCase()}</b><div class=scr style="max-height:62vh">${
    HBF[t].map(f => hbField(f, x[f[0]])).join('')}</div><button class=btn onclick="hbSave('${t}','${id}')">Salvar</button>`);
  if (t == 'eqp') hbEqK()
}
// campos de arma/proteção/munição/elemento só aparecem quando fazem sentido
// Imagem do ritual: reduz para até 160 px (mantém transparência) e guarda como data URL pequena
const HBIMG = /^data:image\/(png|webp|jpeg);base64,[A-Za-z0-9+\/=]+$/, HBIMGMAX = 30000;
function hbShow() {
  const e = $('#hf_img_p');
  if (!e) return;
  e.src = HB.img || '';
  e.style.display = HB.img ? '' : 'none'
}
function hbImgX() {
  HB.img = '';
  hbShow()
}
function hbPick(inp) {
  const f = inp && inp.files && inp.files[0];
  if (!f) return;
  if (!/^image\/(png|webp|jpeg)$/.test(f.type)) return toast('Use uma imagem PNG, WebP ou JPG.');
  const r = new FileReader();
  r.onerror = () => toast('Não consegui ler a imagem.');
  r.onload = () => {
    const im = new Image();
    im.onerror = () => toast('Imagem inválida.');
    im.onload = () => {
      for (const m of [160, 112, 80]) {
        const k = Math.min(1, m / Math.max(im.width, im.height)), cv = document.createElement('canvas');
        cv.width = Math.max(1, Math.round(im.width * k));
        cv.height = Math.max(1, Math.round(im.height * k));
        cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
        const u = cv.toDataURL('image/webp', .85);
        if (HBIMG.test(u) && u.length <= HBIMGMAX) {
          HB.img = u;
          hbShow();
          return
        }
      }
      toast('Imagem pesada demais: use uma mais simples.')
    };
    im.src = r.result
  };
  r.readAsDataURL(f)
}
function hbEqK() {
  const k = ($('#hf_k') || {}).value, show = (ks, ids) => ids.forEach(i => {
    const e = $('#hf_' + i), l = e && e.closest ? e.closest('label') : null;
    if (l) l.style.display = ks.includes(k) ? '' : 'none'
  });
  show(['arm'], ['d', 'c', 'x', 'ty', 'm']);
  show(['pro'], ['pd', 'pr']);
  show(['mun'], ['q']);
  show(['amd'], ['el'])
}
function hbSave(t, id) {
  const c = hbCur(), o = {id: id || hbId()};
  HBF[t].forEach(([k]) => {
    const e = $('#hf_' + k);
    o[k] = e ? String(e.value || '').trim() : ''
  });
  o.n = hbN(o.n);
  if (!o.n) return toast('Dê um nome.');
  if (t == 'rit') o.img = HB.img || '';
  else delete o.img;
  const l = c.homebrew[t] = c.homebrew[t] || [], i = l.findIndex(z => z.id == id);
  if (l.some(z => z.id != o.id && hbN(z.n).toLowerCase() == o.n.toLowerCase())) return toast('Já existe um com esse nome.');
  if (i >= 0)
    l[i] = o;
  else
    l.push(o);
  campSave(c);
  cm();
  R()
}
function hbDel(t, id) {
  const c = hbCur(), x = (c.homebrew[t] || []).find(z => z.id == id);
  if (!x) return;
  modal(`<b>Excluir ${aesc(x.n)}?</b><p><small>Some da campanha. Jogadores que já usaram mantêm na ficha deles.</small></p><div class=grid2><button class=btn onclick="cm()">Cancelar</button><button class=btn style="background:var(--red)" onclick="cm();hbDel2('${t}','${id}')">Excluir</button></div>`)
}
function hbDel2(t, id) {
  const c = hbCur();
  c.homebrew[t] = (c.homebrew[t] || []).filter(z => z.id != id);
  campSave(c);
  R()
}
