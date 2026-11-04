/**
 * Monstruário (Ameaças): lista agrupada por elemento e ficha da ameaça (abas Info / Ações).
 * A ficha usa a paleta do elemento (cores definidas em css/style.css, "Monstruário"), que não muda com o tema do app.
 */

// Ordem dos grupos na lista e cor/texto da barra de cada grupo (Realidade usa a barra padrão do app)
const THO = ['Sangue', 'Morte', 'Conhecimento', 'Energia', 'Medo', 'Realidade: Humanos', 'Realidade: Natureza'],
      THC = {Sangue: ['#d32f2f', '#000'], Morte: ['#6b6b6b', '#fff'], Conhecimento: ['#c79a1a', '#000'],
             Energia: ['#8a2be2', '#fff'], Medo: ['#1a1a1a', '#fff']},
      // Chave do tema da ficha (atributo data-thel); Realidade fica sem chave = tema padrão do app
      THK = {Sangue: 'sangue', Morte: 'morte', Conhecimento: 'conhecimento', Energia: 'energia', Medo: 'medo'},
      THIMG = {'Realidade: Humanos': 'img/ordo-realitas.png', 'Realidade: Natureza': 'img/natureza.png'};

// ---------- Utilidades ----------

// Imagem enviada pelo usuário para cada ameaça: guardada só neste aparelho (chave própria, fora do estado `S`)
const thImgs = () => {
  try {
    return JSON.parse(localStorage.getItem('op_thimg') || '{}')
  } catch (e) {
    return {}
  }
},
      thImgSet = (id, d) => {
        const m = thImgs();
        if (d) m[id] = d; else delete m[id];
        try {
          localStorage.setItem('op_thimg', JSON.stringify(m))
        } catch (e) {
          toast('Sem espaço para guardar a imagem neste aparelho.')
        }
      },
      // Ícone do grupo: PNG do símbolo do elemento (img/sym-*.png) ou a imagem de Humanos/Natureza
      thIcon = (el, sz) => THIMG[el] ?
        `<span class=thic><img src="${THIMG[el]}" width=${sz} height=${sz} alt=""></span>` :
        `<span class=thsy><img src="img/sym-${SYMF[el]}.png" width=${sz} height=${sz} alt=""></span>`,
      // Tags do livro: elementos em maiúsculas (em negrito) + tipo e tamanho
      // (o elemento vira uma etiqueta com o fundo e a fonte da cor do próprio elemento)
      thTags = t => t.tg.map(x => {
        const k = x == x.toUpperCase() && THO.find(e => e.toUpperCase() == x), c = k && THC[k];
        return c ? `<b class=thel style="background:${c[0]};color:${c[1]}">${x}</b>` : x
      }).join(' '),
      thSorted = el =>
        THREATS.filter(t => t.el == el).sort((a, b) => a.vd - b.vd || a.n.localeCompare(b.n, 'pt')),
      thv = x => x == null || x === '' ? '—' : x,
      thSel = () => THREATS.find(t => t.id == S.thid);

// Aplica (ou remove) a paleta do elemento no <html> e no <body>; chamada pelo roteador a cada tela
function thTheme() {
  const t = S.v == 'thd' ? thSel() : null, k = t ? THK[t.el] || '' : '',
        d = document.documentElement, b = document.body;
  if (k) {
    d.dataset.thel = k;
    b.dataset.thel = k
  } else {
    delete d.dataset.thel;
    delete b.dataset.thel
  }
}

// ---------- Lista ----------

function thFilter(q) {
  q = nz(q || '');
  document.querySelectorAll('.thc').forEach(b => {b.style.display = !q || b.dataset.n.includes(q) ? '' : 'none'});
  document.querySelectorAll('.thg').forEach(g => {
    g.style.display = [...g.querySelectorAll('.thc')].some(b => b.style.display != 'none') ? '' : 'none'
  })
}

const thCard = t => {
  const col = THC[t.el] ? THC[t.el][0] : 'var(--fg)';
  return `<button class="card thc" data-n="${nz(t.n)}" style="border-left:8px solid ${col}" onclick="thOpen('${
    t.id}')"><div class=row><div class=thsym style="color:${
    THC[t.el] && t.el != 'Medo' ? SC[t.el] : 'var(--fg)'}">${thIcon(t.el, 34)}</div><div class=thmid><b class=thn>${
    t.n}</b><div class=thtg>${thTags(t)}</div></div><div class=thvd><small>VD</small><b>${
    t.vd}</b></div></div></button>`
};

const thr = () => `<div class=fade><button onclick="S.v='mestre';R()">← Voltar</button><div class=bar>${
  S.w || 'Monstruário (Ameaças)'}</div><input id=thq type=search placeholder="Buscar ameaça…" oninput="thFilter(this.value)">${
  THO.map(el => {
    const l = thSorted(el), c = THC[el];
    return l.length ? `<div class=thg><div class=bar style="${c ? `background:${c[0]};color:${c[1]}` : ''}">${
      el.toUpperCase()} <small>· ${l.length}</small></div>${l.map(thCard).join('')}</div>` :
                      ''
  }).join('')}</div>`;

// ---------- Navegação ----------

function thOpen(id) {
  S.thid = id;
  S.tht = 'i';
  S.v = 'thd';
  R();
  window.scrollTo(0, 0)
}
function thTab(t) {
  S.tht = t;
  R()
}
function thBack() {
  S.v = 'thr';
  R()
}

// ---------- Imagem da ameaça ----------

function thPhoto(i) {
  photoFrom(i.files[0], 320, d => {
    thImgSet(S.thid, d);
    R()
  })
}
function thNoPhoto() {
  thImgSet(S.thid, '');
  R()
}

// ---------- Ficha: cabeçalho ----------

const thHead = t => `<div class=thh><div class=thsym>${thIcon(t.el, 44)}</div><div class=thmid><h2>${
  t.n}</h2><div class=thtg>${thTags(t)}</div></div><div class=thvd><small>VD</small><b>${t.vd}</b></div></div>`;

// ---------- Ficha: aba Info ----------

const thInfo = t => {
  const [dt, mental, nex] = t.pr || [], [perc, ini, nota] = t.sn, [def, fo, re, vo] = t.df,
        img = thImgs()[t.id],
        hx = (x, i, p) => `<div class=hx style="left:${p[0]}px;top:${p[1]}px"><i><small>${AN[x]}</small><b>${
          thv(t.at[i])}</b><span>${x}</span></i></div>`,
        li = (l, v) => v ? `<div class=thl><span>${l}</span><b>${v}</b></div>` : '';
  return `<div class=thimgw><label class=thpick title="${img ? 'Trocar imagem' : 'Enviar imagem'}">${
    img ? `<img class=thimg src="${img}" alt="${t.n}">` :
          '<div class="thimg thnoimg">Toque para<br>enviar uma imagem</div>'}<input type=file accept="image/*" hidden onchange="thPhoto(this)"></label>${
    img ? '<button class=thrm onclick="thNoPhoto()">✕ Remover imagem</button>' : ''}</div>
<div class=bar>ATRIBUTOS</div><div class=hexbox>${hx('AGI', 0, [102, 0])}${hx('FOR', 1, [8, 62])}${
    hx('INT', 2, [196, 62])}${hx('PRE', 3, [40, 168])}${hx('VIG', 4, [164, 168])}<div class=core>ATRIBUTOS</div></div>${
    t.pr ? `<div class=bar>PRESENÇA PERTURBADORA</div><div class=thtx>DT <b>${dt}</b> • <b>${mental}</b>${
             nex ? ` • NEX <b>${nex}%+</b> é imune` : ''}</div>` :
           ''}<div class=bar>SENTIDOS</div><div class=thtx>${li('Percepção', thv(perc))}${li('Iniciativa', thv(ini))}${
    nota && nota != '—' ? `<small>${nota}</small>` : ''}</div><div class=bar>DEFESA</div><div class=thdf><div class=thbig>${
    thv(def)}</div><div class=thsv>${li('Fortitude', thv(fo))}${li('Reflexos', thv(re))}${
    li('Vontade', thv(vo))}</div></div><div class=bar>PONTOS DE VIDA</div><div class=thdf><div class=thbig>${
    t.pv[0]}</div><div class=thsv>${li('Imunidades', t.im)}${li('Resistências', t.rs)}${
    li('Vulnerabilidades', t.vu)}</div></div>${
    t.pe ? `<div class=bar>PERÍCIAS</div><div class=thtx>${
             t.pe.split(', ').map(p => {const i = p.lastIndexOf(' ');return li(p.slice(0, i), p.slice(i + 1))}).join(
               '')}</div>` :
           ''}<div class=bar>DESLOCAMENTO</div><div class=thtx><b>${t.ds.replace(/; /g, ' · ')}</b></div>`
};

// ---------- Ficha: aba Ações ----------

const thActs = t => {
  const pa = t.pa.map(([n, d]) => `<div class=thpa><b>${n}</b><br>${d}</div>`).join(''),
        ac = t.ac.map(([tp, n, at, tx]) =>
          `<div class=thac><div class=thah><span>${tp}</span> · <b>${n}</b></div>${
            at.map(([a, al, te, da]) => `<div class=thatk><b>${a}</b> <i>${al}</i><br>Teste <b>${te}</b> · Dano <b>${
                       da}</b></div>`).join('')}${tx ? `<div class=thtx2>${tx}</div>` : ''}</div>`).join('');
  return `${pa ? `<div class=bar>HABILIDADES</div>${pa}` : ''}${
    ac ? `<div class=bar>AÇÕES</div>${ac}` : ''}${!pa && !ac ? '<small>Sem ações.</small>' : ''}`
};

// ---------- Ficha ----------

function thd() {
  const t = thSel();
  if (!t) {
    S.v = 'thr';
    return thr()
  }
  const a = S.tht == 'a';
  return `<div class="fade thsheet"><button onclick="thBack()">← Ameaças</button>${thHead(t)}<div class=pills><button class="${
    a ? '' : 'on'}" onclick="thTab('i')">Info</button><button class="${
    a ? 'on' : ''}" onclick="thTab('a')">Ações</button></div>${a ? thActs(t) : thInfo(t)}</div>`
}
