/**
 * Subir de NEX: passos de escolha (trilha, atributos, perícias, poderes, rituais).
 */

// Passos do level-up
const stp = (cl, n) => {
  let l = (TB[cl].split(',').find(x => parseInt(x) == n) || '').replace(/^\d+/, ''), o = [];
  for (const ch of l)
    o.push({
      A: {t: 'info'},
      T: {t: 'trail'},
      H: {t: 'hab'},
      P: {t: 'pow'},
      S: {t: 'attr'},
      G: {t: 'grau'},
      V: {t: 'vers'},
      E: {t: 'info', e: 1}
    }[ch]);
  if (cl == 'Ocultista') o.push({t: 'rit'});
  return o
};
function up() {
  modal(
    '<b>Subir para o próximo NEX?</b><div class=grid2><button class=btn onclick="cm()">Cancelar</button><button class=btn onclick="cm();upd()">Confirmar</button></div>')
}
function upd() {
  let c = cur();
  // cópia da ficha ANTES de qualquer mudança: se a pessoa sair/cancelar, tudo volta como estava (lvCancel/lvDrop)
  const bak = JSON.stringify(c);
  if (c.classe == 'Mundano') {
    S.lv = {n: 5, sg: 0, i: 0, x: {}, mun: 1, st: [{t: 'cls'}, {t: 'attr'}], bak, cid: c.id};
    mut(z => {});
    return
  }
  let a = K(c), n = c.nex >= 95 ? 99 : c.nex + 5;
  mut(z => {
    z.nex = n;
    let b = K(z);
    z.pv += b.pv - a.pv;
    z.pe += b.pe - a.pe;
    S.lv = {n, sg: b.san - a.san, i: 0, x: {}, st: stp(z.classe, n), bak, cid: c.id};
    if ([25, 55, 85].includes(n) && hasAb(z, 'Saber Ampliado')) S.lv.st.push({t: 'rit', sa: 1});
    if ([55, 85].includes(n) && hasAb(z, 'Grimório Ritualístico')) {
      S.lv.gm = 0;
      S.lv.st.push({t: 'grm', cnt: 1})
    }
  })
}
// Desiste da subida de NEX: devolve a ficha EXATAMENTE como estava antes (NEX, PV, PE, atributos, poderes… nada muda).
// Só vale o que a pessoa CONFIRMOU até o fim da subida.
function lvDrop() {
  const L = S.lv;
  if (!L) return;
  if (L.bak) {
    const c = S.chars.find(x => x.id == L.cid);
    if (c) {
      Object.keys(c).forEach(k => delete c[k]);
      Object.assign(c, JSON.parse(L.bak))
    }
  }
  S.lv = null
}
function lvCancel(ask) {
  const L = S.lv;
  if (!L || !L.bak) return;  // subida antiga (sem cópia): não dá para desfazer, segue até o fim
  if (ask && L.i > 0 && !confirm('Cancelar a subida de NEX? Nada será alterado na ficha.')) return;
  lvDrop();
  cm();
  R()
}
const lvNext = () => {
  S.lv.i++;
  S.lv.x = {};
  lvStep()
};
function fin2() {
  let c = cur();
  if (S.lv.tr)
    c.stn = (c.stn || 0) + S.lv.sg;
  else
    c.san += S.lv.sg;
  S.lv = null;
  cm();
  R()
}

// Passo atual do level-up
function lvStep() {
  let c = cur(), L = S.lv, s = L.st[L.i];
  if (!s) return fin2();
  let x = L.x, h = `${L.bak ? '<button class=xc aria-label="Cancelar" style="z-index:3" onclick="lvCancel(1)">✕</button>' : ''}<div class=bar style="margin-right:${L.bak ? 44 : 0}px">NEX ${L.n}% · ${c.classe}</div>`;
  if (s.t == 'info')
    h += `<p>${md(s.e ? engTxt(L.n) : infoTxt(c, L.n))}</p><button class=btn onclick="lvNext()">Confirmar</button>`;
  else if (s.t == 'trail')
    h += vTrail(0);
  else if (s.t == 'hab') {
    let t = D[c.classe].tr.find(z => z.n == c.trail), a = t && t.ab.find(z => z.nex == L.n);
    h += a ? `<b>Nova habilidade de trilha: ${a.n}</b><p>${
               md(a.t)}</p><button class=btn onclick="lvHab()">Confirmar</button>` :
             '<p>Nenhuma habilidade nova.</p><button class=btn onclick="lvNext()">Confirmar</button>'
  } else if (s.t == 'cls')
    h += vCls();
  else if (s.t == 'pow')
    h += vPow();
  else if (s.t == 'attr')
    h += vAttr();
  else if (s.t == 'grau')
    h += vSk('gr');
  else if (s.t == 'skI')
    h += vSk('in');
  else if (s.t == 'vers')
    h += vVers();
  else
    h +=
      (s.t == 'grm' ?
          `<b>Grimório Ritualístico</b><br><small>Escolha rituais para o grimório (${S.lv.gm || 0}/${
            s.cnt}) — círculos que você já acessa</small><button class=btn style="margin:6px 0" onclick="lvNext()">Concluir</button>` :
          s.sa ? `<b>Saber Ampliado</b><br><small>Ritual adicional de ${acc(L.n)}º círculo</small>` :
                 '<b>Aprender um ritual</b>') +
      vRit();
  modal(h)
}
function vTrail(first) {
  let c = cur(), x = S.lv.x, T = D[c.classe].tr.filter(t => !first || t.n != c.trail), sel = T.find(t => t.n == x.tr);
  return `<small>${
    first ?
      'Primeiro poder de uma trilha diferente da sua' :
      'Escolha sua trilha'}</small><div style="display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin:8px 0">${
    T.map(t => `<button class="${
            x.tr == t.n ? 'on' :
                          ''}" style="flex:0 0 calc((100% - 8px)/3);font-size:10px;padding:4px" onclick="S.lv.x.tr='${
            t.n}';lvStep()"><div style="font-size:26px">${ICT[t.n] || '✦'}</div><b>${t.n}</b><br>${
            t.esp ? cap1(t.esp) : t.prof.slice(0, 90) + '…'}</button>`)
      .join('')}</div>${
    sel ? `<div class=scr>${
            (first ? sel.ab.slice(0, 1) : sel.ab)
              .map(a => `<p><b>NEX ${a.nex}% — ${a.n}</b><br>${md(a.s || a.t)}</p>`)
              .join('')}</div>` :
          ''}${sel && sel.pre ? `<small class=red>Pré-requisito: ${sel.pre}</small>` : ''}<button class=btn ${
    sel ? '' : 'disabled'} onclick="lvTr(${first})">Confirmar</button>`
}
function lvTr(first) {
  let c = cur(), t = D[c.classe].tr.find(z => z.n == S.lv.x.tr);
  let a0 = K(c);
  if (!first) {
    c.trail = t.n;
    let b0 = K(c);
    c.pv += b0.pv - a0.pv
  }
  c.ab = c.ab || [];
  c.ab.push({n: t.ab[0].n, t: t.ab[0].t, tr: 1});
  if (t.ab[0].n == 'Saber Ampliado') S.lv.st.splice(S.lv.i + 1, 0, {t: 'rit', sa: 1});
  lvNext()
}
function lvHab() {
  let c = cur(), t = D[c.classe].tr.find(z => z.n == c.trail), a = t.ab.find(z => z.nex == S.lv.n);
  c.ab = c.ab || [];
  c.ab.push({n: a.n, t: a.t, tr: 1});
  m4fix(c);
  if (a.n == 'Grimório Ritualístico') {
    grmItem(c);
    S.lv.gm = 0;
    S.lv.st.splice(S.lv.i + 1, 0, {t: 'grm', cnt: gcap(c)})
  }
  lvNext()
}
const gcap = c => c.attr.INT + (acc(c.nex) >= 3) + (acc(c.nex) >= 4), grmItem = c => {
  if (!c.inv.some(i => i.n == 'Grimório Ritualístico'))
    c.inv.push({
      n: 'Grimório Ritualístico',
      cat: 0,
      e: 1,
      w: null,
      am: 0,
      el: null,
      am: 1,
      ds:
        'Armazena rituais que sua mente não seria capaz de guardar. Capacidade = Intelecto (+1 por círculo novo a partir do 3º). Para conjurar, empunhe o grimório e gaste uma ação completa folheando-o. Se perdido, pode ser replicado com duas ações de interlúdio.'
    })
};
function vAttr() {
  let c = cur(), x = S.lv.x;
  return `<small>Aumente um atributo em +1 (máximo 5)</small><div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:8px 0">${
    A.map(a => `<button style="flex:0 0 calc((100% - 12px)/3)" class="${x.a == a ? 'on' : ''}" ${
            c.attr[a] >= (S.lv.mun ? 3 : 5) ? 'disabled' : ''} onclick="S.lv.x.a='${a}';lvStep()"><b>${
            AN[a]}</b><br><span class=big>${c.attr[a]}${x.a == a ? ' → ' + (c.attr[a] + 1) : ''}</span></button>`)
      .join('')}</div><button class=btn ${x.a ? '' : 'disabled'} onclick="lvAt()">Confirmar</button>`
}
function lvAt() {
  let c = cur(), a = K(c);
  if (S.lv.x.a == 'INT') S.lv.st.splice(S.lv.i + 1, 0, {t: 'skI'});
  c.attr[S.lv.x.a]++;
  let b = K(c);
  c.pv += b.pv - a.pv;
  c.pe += b.pe - a.pe;
  lvNext()
}
function vSk(m) {
  let c = cur(), k = K(c), x = S.lv.x, sel = x.s || [],
      cap = c.nex >= 70 ? 15 :
    c.nex >= 35         ? 10 :
                          5,
      need = m == 'in' ? 1 :
    m == 'gr'          ? 2 + c.attr.INT :
                         2;
  return `<small>${
    m == 'in' ?
      'Intelecto aumentou — nova perícia treinada' :
      m == 'gr' ?
      'Grau de treinamento' :
      'Treinamento em perícia'}: escolha ${need} perícias (${sel.length}/${need}). Cada uma sobe um grau.</small>${
    SK.map((s, i) => {
        let tr = k.tr.includes(s.n), g = gb(c, s.n, tr), nx = tr ? g + 5 : 5,
            ok = m == 'in' ? !tr :
          m == 'gr'        ? tr && nx <= cap :
                             nx <= cap,
            v = c.attr[s.a];
        return `<button class="sk ${sel.includes(s.n) ? 'on' : ''}" style="width:100%;margin:2px 0;${
          ok ? '' : 'opacity:.35'}" ${ok ? '' : 'disabled'} onclick="skT('${s.n}',${need})"><span>${IC2[i]} ${
          s.n}</span><span>${v || 2}d20</span><span>+${g}</span><span>→ +${nx}</span><span></span></button>`
      })
      .join('')}<button class=btn ${sel.length == need ? '' : 'disabled'} onclick="lvSk()">Confirmar</button>`
}
function skT(n, need) {
  let x = S.lv.x;
  x.s = x.s || [];
  let i = x.s.indexOf(n);
  if (i >= 0)
    x.s.splice(i, 1);
  else if (x.s.length < need)
    x.s.push(n);
  lvStep()
}
function lvSk() {
  let c = cur(), k = K(c);
  S.lv.x.s.forEach(n => {
    if (k.tr.includes(n)) {
      c.gr = c.gr || {};
      c.gr[n] = (c.gr[n] || 5) + 5
    } else
      c.trained.push(n)
  });
  lvNext()
}
function vVers() {
  let x = S.lv.x;
  if (!x.vm)
    return `<small>NEX 50%: escolha uma das opções</small><div class=grid2 style="gap:8px;margin:8px 0"><button class=card onclick="S.lv.x.vm='p';lvStep()"><div style="font-size:30px">⭐</div><b>Poder de classe</b><br><small>Qualquer poder disponível da lista da classe.</small></button><button class=card onclick="S.lv.x.vm='t';lvStep()"><div style="font-size:30px">🧭</div><b>Habilidade de trilha</b><br><small>O primeiro poder de uma trilha diferente da sua.</small></button></div>`;
  return (x.p != null || x.pp || x.r != null || x.sub ?
             '' :
             `<button onclick="S.lv.x={};lvStep()">← Voltar às duas opções</button>`) +
    (x.vm == 'p' ? vPow() : vTrail(1))
}
function vPow() {
  let c = cur(), x = S.lv.x, m = x.mode;
  if (m == 'sk') return vSk('sk');
  if (m == 'tr') return vTr();
  if (m == 'rp') return vRp();
  if (m == 'ee') return vEe();
  if (x.p != null) {
    let p = D[c.classe].pow[x.p];
    return `<b>${p.n}</b><p>${md(p.t)}</p>${
      p.p ?
        `<small>Pré-requisito: ${p.p}</small>` :
        ''}<div class=grid2><button class=btn onclick="S.lv.x.p=null;lvStep()">Voltar</button><button class=btn onclick="lvPc(${
      x.p})">Confirmar</button></div>`
  }
  return `<input placeholder="🔎 Pesquisar poder..." value="${
    esc(x.q || '')}" oninput="S.lv.x.q=this.value;$('#pq').innerHTML=plist()"><div id=pq class=scr>${plist()}</div>`
}
function plist() {
  let c = cur(), q = nz(S.lv.x.q || '');
  return D[c.classe]
           .pow.map((p, i) => [p, i])
           .filter(([p]) => nz(p.n + p.t).includes(q))
           .map(([p, i]) => {
             let [ok, ms] = okp(c, p.p), rp = /^(Transcender|Treinamento)/.test(p.n), hv = !rp && hasAb(c, p.n),
                      off = !ok || hv;
             return `<button class="card ${off ? 'gy' : ''}" ${off ? '' : `onclick="S.lv.x.p=${i};lvStep()"`}><b>${
               p.n}</b>${hv ? ' ✔' : ''}<br><small>${p.s ? md(p.s) : p.t.slice(0, 95) + '…'}</small>${
               p.p ? `<br><small class=pre>Pré-requisito: ${p.p}${!ok ? ' — falta: ' + ms : ''}</small>` : ''}</button>`
           })
           .join('') ||
    '<small>Nenhum poder.</small>'
}
function lvPc(i) {
  let c = cur(), p = D[c.classe].pow[i], x = S.lv.x;
  if (/^Transcender/.test(p.n)) {
    x.mode = 'tr';
    x.p = null;
    x.q = '';
    return lvStep()
  }
  if (/^Treinamento/.test(p.n)) {
    x.mode = 'sk';
    x.s = [];
    return lvStep()
  }
  if (p.n == 'Ritual Predileto') {
    x.mode = 'rp';
    x.rp = null;
    return lvStep()
  }
  if (p.n == 'Especialista em Elemento') {
    x.mode = 'ee';
    x.el = null;
    return lvStep()
  }
  if (p.n == 'Mestre em Elemento') {
    let ee = (c.ab || []).find(a => a.ee);
    c.ab = c.ab || [];
    c.ab.push({n: p.n, t: p.t, pw: 1, me: ee ? ee.ee : null});
    return lvNext()
  }
  c.ab = c.ab || [];
  c.ab.push({n: p.n, t: p.t, pw: 1});
  lvNext()
}
function vEe() {
  let x = S.lv.x;
  return `<b>Especialista em Elemento</b><small> — escolha o elemento (DT dos seus rituais desse elemento +2)</small><div class=grid2 style="gap:6px;margin:8px 0">${
    ELP
      .map(e => `<button style="background:${EC[e]};color:#fff" onclick="S.lv.x.el='${e}';lvStep()">${e}${
             x.el == e ? ' ✔' : ''}</button>`)
      .join(
        '')}</div><div class=grid2><button class=btn onclick="S.lv.x.mode=null;S.lv.x.el=null;S.lv.x.p=null;lvStep()">Voltar</button><button class=btn ${
    x.el ? '' : 'disabled'} onclick="lvEe()">Confirmar</button></div>`
}
function lvEe() {
  let c = cur(), x = S.lv.x, p = D[c.classe].pow.find(z => z.n == 'Especialista em Elemento');
  c.ab = c.ab || [];
  c.ab.push({n: p.n, t: p.t, pw: 1, ee: x.el});
  x.mode = null;
  lvNext()
}
const RPD = (c, id) => {
  let n = id.split('|')[0], r = RT.find(z => z.n == n), e = id.split('|')[1] || (r && r.el), f = INFO[n] || [],
      mm = (c.ab || []).find(a => a.me), me = mm ? mm.me : ((c.ab || []).find(a => a.ee) || {}).ee;
  return (c.ab || []).filter(a => a.rp == id).length +
    (/^Amaldiçoar Arma/.test(id) && hasAb(c, 'Lâmina Maldita') ? 1 : 0) +
    (hasAb(c, 'Mestre em Elemento') && me && e == me ? 1 : 0) +
    (hasAb(c, 'Tatuagem Ritualística') && f[1] == 'pessoal' && f[2] == 'você' ? 1 : 0)
};
const RPT = (c, n, j) => {
  if (!hasAb(c, 'Ritual Potente')) return null;
  let x = EF[n] || {};
  if (x.heal && x.heal[j]) return 'cura';
  let d = DS[n] || [];
  return /\d+d\d+[^.]{0,80}dano|dano[^.]{0,60}\d+d\d+/i.test((d[0] || '') + ' ' + (d[j] || '')) ? 'dano' : null
};
function vRp() {
  let c = cur(), x = S.lv.x, l = c.rit.filter(r => typeof r == 'string' && !(c.ab || []).some(a => a.rp == r));
  return `<b>Ritual Predileto</b><small> — escolha um ritual que você já conhece (custo −1 PE)</small><div class=scr style="margin:8px 0">${
    l.map(id => {
       let r = RT.find(z => z.n == id.split('|')[0]), e = id.split('|')[1] || r.el;
       return `<button class="card ${x.rp == id ? 'on' : ''}" onclick="S.lv.x.rp='${id}';lvStep()"><b>${
         r.n}</b> <span class=el style="background:${EC[e]}">${e}</span>${x.rp == id ? ' ✔' : ''}<br><small>${
         r.ci}º círculo · ${BC[r.ci]} PE → <b>${Math.max(0, BC[r.ci] - 1)} PE</b></small></button>`
     })
      .join('') ||
    '<small>Você ainda não conhece nenhum ritual disponível.</small>'}</div><div class=grid2><button class=btn onclick="S.lv.x.mode=null;S.lv.x.rp=null;S.lv.x.p=null;lvStep()">Voltar</button><button class=btn ${
    x.rp ? '' : 'disabled'} onclick="lvRp()">Confirmar</button></div>`
}
function lvRp() {
  let c = cur(), x = S.lv.x, p = D[c.classe].pow.find(z => z.n == 'Ritual Predileto');
  c.ab = c.ab || [];
  c.ab.push({n: p.n, t: p.t, pw: 1, rp: x.rp});
  x.mode = null;
  lvNext()
}
const ELP = ['Conhecimento', 'Energia', 'Morte', 'Sangue'];
function vTr() {
  let c = cur(), x = S.lv.x;
  if (x.sub == 'ri')
    return (x.r != null ? '' : `<button onclick="S.lv.x.sub=null;S.lv.x.r=null;lvStep()">← Voltar</button>`) + vRit();
  if (x.sub == 'af' || x.sub == 'res')
    return `<button onclick="S.lv.x.sub=null;lvStep()">← Voltar</button><b>${
      x.sub == 'af' ? 'Afinidade Elemental' : 'Resistir a elemento'}</b><div class=grid2 style="gap:6px;margin:8px 0">${
      ELP
        .map(e => `<button style="background:${EC[e]};color:#fff" onclick="S.lv.x.el='${e}';lvStep()">${e}${
               x.el == e ? ' ✔' : ''}</button>`)
        .join('')}</div><button class=btn ${x.el ? '' : 'disabled'} onclick="lvEl()">Confirmar</button>`;
  if (x.pp) {
    let p = D.PP[x.pp[0]][x.pp[1]];
    return `<b>${p.n}</b> <span class=el style="background:${EC[x.pp[0]]}">${x.pp[0]}</span><p>${md(p.t)}</p>${
      p.p ? `<small>Pré-requisito: ${p.p}</small>` : ''}${
      afNote(p.a, x.pp[0],
        c)}<div class=grid2><button class=btn onclick="S.lv.x.pp=null;lvStep()">Voltar</button><button class=btn onclick="lvPP()">Confirmar</button></div>`
  }
  let af = c.nex < 50 || c.af;
  return `${
    x.vm ?
      '' :
      '<button onclick="S.lv.x.mode=null;S.lv.x.q=\'\';lvStep()">← Voltar</button>'}<b>Transcender</b><small> — sem ganho de Sanidade neste NEX</small><button class="card ${
    af ? 'gy' : ''}" ${
    af ?
      '' :
      `onclick="S.lv.x.sub='af';lvStep()"`}><b>Afinidade Elemental</b><br><small>Conecta você a um elemento (benefícios nos rituais e poderes do elemento).</small><br><small class=pre>Pré-requisito: NEX 50%${
    c.af ?
      ' — já escolhida (' + c.af + ')' :
      ''}</small></button><button class=card onclick="S.lv.x.sub='ri';lvStep()"><b>Aprender Ritual</b><br><small>Escolha um ritual dos círculos a que você tem acesso.</small></button><button class=card onclick="S.lv.x.sub='res';lvStep()"><b>Resistir a Elemento</b><br><small>Escolha Conhecimento, Energia, Morte ou Sangue.</small></button><input placeholder="🔎 Pesquisar poder paranormal..." value="${
    esc(x.q || '')}" oninput="S.lv.x.q=this.value;$('#ppq').innerHTML=pplist()"><div id=ppq class=scr>${pplist()}</div>`
}
function pplist() {
  let c = cur(), q = nz(S.lv.x.q || '');
  return ELP
           .map(e => {
             let l = (D.PP[e] || []).map((p, i) => [p, i]).filter(([p]) => nz(p.n + p.t).includes(q));
             return l.length ? `<div class=bar style="background:${EC[e]}">${e}</div>` +
                 l.map(([p, i]) => {
                    let [ok, ms] = okp(c, p.p), hv = hasAb(c, p.n), off = !ok || hv;
                    return `<button class="card ${off ? 'gy' : ''}" ${
                      off ? '' : `onclick="S.lv.x.pp=['${e}',${i}];lvStep()"`}><b>${p.n}</b>${
                      hv ? ' ✔' : ''}<br><small>${p.s ? md(p.s) : p.t.slice(0, 95) + '…'}</small>${
                      p.p ? `<br><small class=pre>Pré-requisito: ${p.p}${!ok ? ' — falta: ' + ms : ''}</small>` :
                            ''}</button>`
                  })
                   .join('') :
                               ''
           })
           .join('') ||
    '<small>Nenhum poder.</small>'
}
function lvEl() {
  let c = cur(), x = S.lv.x;
  if (x.sub == 'af')
    c.af = x.el;
  else {
    c.res = c.res || [];
    if (!c.res.includes(x.el)) c.res.push(x.el)
  }
  S.lv.tr = 1;
  lvNext()
}
function lvPP() {
  let c = cur(), [e, i] = S.lv.x.pp, p = D.PP[e][i];
  c.ab = c.ab || [];
  c.ab.push({n: p.n, t: p.t, aff: p.a || '', pw: 1, el: e});
  S.lv.tr = 1;
  lvNext()
}
function rlist2() {
  let c = cur(), q = nz(S.lv.x.q || ''), ac = acc(c.nex), st0 = S.lv.st[S.lv.i] || {}, h = '';
  for (let ci = 1; ci <= 4; ci++)
    for (const e of ['*', ...ELO]) {
      if (st0.sa && ci != ac) continue;
      let l = RT.filter(r => r.ci == ci && r.el == e && !M4(r) && nz(r.n + r.s).includes(q))
                .sort((p, r) => p.n.localeCompare(r.n, 'pt'));
      if (l.length)
        h += `<div class=bar style="background:${EC[e] || '#000'}">${ci}º círculo · ${
               e == '*' ? 'Qualquer elemento' : e}</div>` +
          l.map(r => {
             let off = ci > ac, hv = c.rit.some(z => typeof z == 'string' && z.split('|')[0] == r.n);
             return `<button class="card ${off || hv ? 'gy' : ''}" ${
               off || hv ? '' :
                           `onclick="lvRSel(${RT.indexOf(r)})"`}><b>${r.n}</b>${hv ? ' ✔' : ''}<br><small>${
               r.s}</small>${off ? `<br><small class=pre>Requer acesso ao ${ci}º círculo</small>` : ''}</button>`
           })
            .join('')
    }
  return h || '<small>Nenhum ritual encontrado.</small>'
}
// Escolher ritual / voltar à lista no mesmo ponto da rolagem
function lvRSel(i) {
  const l = $('#lq');
  S.lv.x.sy = [window.scrollY, l ? l.scrollTop : 0];
  S.lv.x.r = i;
  lvStep()
}
function lvRBack() {
  const [y, t] = S.lv.x.sy || [0, 0];
  S.lv.x.r = null;
  lvStep();
  window.scrollTo(0, y);
  if ($('#lq')) $('#lq').scrollTop = t
}
function vRit() {
  let x = S.lv.x;
  if (x.r != null) {
    let r = RT[x.r];
    return `<b>${r.n}</b> · ${r.ci}º círculo · ${BC[r.ci]} PE${rinfo(r)}<small>${rver(r)}</small>${
      r.el == '*' ? '<div class=grid2>' +
          ELO.slice(0, 4)
            .map(
              e => `<button class=btn style="background:${EC[e]}" onclick="lvRc('Amaldiçoar Arma|${e}')">${e}</button>`)
            .join('') +
          '</div>' :
                    `<button class=btn onclick="lvRc('${
                      r.n}')">Confirmar</button>`}<button onclick="lvRBack()">Voltar</button>`
  }
  return `<input placeholder="🔎 Pesquisar ritual..." value="${
    esc(x.q || '')}" oninput="S.lv.x.q=this.value;$('#lq').innerHTML=rlist2()"><div id=lq class=scr>${rlist2()}</div>`
}
function lvRc(id) {
  let c = cur(), st = S.lv.st[S.lv.i] || {};
  c.rit.push(id);
  if (st.t == 'grm') {
    c.grm = c.grm || [];
    c.grm.push(id);
    S.lv.gm = (S.lv.gm || 0) + 1;
    S.lv.x = {};
    if (S.lv.gm >= st.cnt) {
      S.lv.gm = 0;
      return lvNext()
    }
    return lvStep()
  }
  if (S.lv.x.mode == 'tr') S.lv.tr = 1;
  lvNext()
}
const AMC = {
  'Balas curtas': ['#d9a900', 5, 11],
  'Balas longas': ['#e0c060', 5, 16],
  Cartuchos: ['#c0392b', 8, 12],
  Flechas: ['#8b5a2b', 3, 18],
  Foguete: ['#9aa0a6', 7, 18],
  'Combustível': ['#e5560c', 9, 12]
};
