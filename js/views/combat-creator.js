/**
 * Mestre: Criador de Combates (iniciativa dinâmica e atraso de ação).
 * Existe em dois lugares com a mesma tela: no menu do Mestre (S.cmb) e dentro de cada campanha (tela 'cmbc', S.cmbs[campanha]);
 * na campanha a ORDEM (só nomes, turno e rodada) é publicada para os jogadores (cmbPub em js/account/campaigns.js).
 */

// Criador de Combates: limite de atraso (10 + bônus, mínimo 1)
const cmbLim = x => Math.max(0, Math.min(10 + x.b - (x.u || 0), x.i - 1)),
      cmbRd =
        m => {
          m.r++;
          m.l.forEach(x => {x.u = 0})
        },
      cmbNew = () => ({l: [], on: 0, c: null, r: 1}),
      cmbC = () => S.v == 'cmbc',
      cmbS = () => cmbC() ? ((S.cmbs = S.cmbs || {})[S.cp] = S.cmbs[S.cp] || cmbNew()) : (S.cmb = S.cmb || cmbNew()),
      // redesenha; na campanha, publica a ordem para os jogadores
      cmbR = () => {
        if (cmbC()) cmbPub();
        R()
      },
      cmbSort = l =>
        l.map((x, k) => [x, k]).sort((p, q) => q[0].i - p[0].i || q[0].b - p[0].b || p[1] - q[1]).map(z => z[0]);

// Tela do Criador de Combates
function cmbv() {
  const m = cmbS(), cc = cmbC(), c = cc && campOf(S.cp);
  if (cc && !c) return `<div class=fade><button onclick="S.v='camps';R()">← Campanhas</button><p><small>Campanha não encontrada.</small></p></div>`;
  return `<div class=fade><button onclick="${cc ? "S.v='camp'" : "S.v='mestre'"};R()">← ${cc ? 'Campanha' : 'Voltar'}</button><div class=bar>Criador de Combates${
    cc ? ' · ' + esc(c.name) : ''}</div>${cc ? `<small>Os jogadores desta campanha veem a ordem assim que você clicar em Combate! (sem os números).</small>` : ''}${
    cc ? `<div id=cmp>${cmbPlH()}</div>` : ''}
<div class=card><b>Adicionar personagem</b><input id=cmn placeholder="Nome" style="margin:6px 0"><div class=grid2 style="margin-bottom:6px"><input id=cmr type=number inputmode=numeric placeholder="Dado rodado"><input id=cmb type=number inputmode=numeric placeholder="Bônus de Iniciativa"></div><button class=btn onclick="cmbAdd()">+ Adicionar</button></div>
${m.on ? `<div class=bar>Rodada ${m.r}</div>` : '<div class=bar>Ordem</div>'}
<div id=cml>${
    m.l.length ?
      m.l
        .map(
          (x, i) => `<div class="cmbr ${m.on && m.c == x.id ? 'cur' : ''}" data-id="${x.id}"><span class=cmbn>${
            i + 1}</span><div style="flex:1;min-width:0"><b style="word-break:break-word">${
            esc(x.n)}</b><br><small>Pode atrasar até <b>${
            cmbLim(x)}</b> pt(s) nesta rodada</small></div><span class=cmbi>${x.i}</span>${
            m.on ? `<button onclick="cmbDl(${x.id})" title="Atrasar ação">⏳</button>` :
                   ''}<button class=x onclick="cmbDel(${x.id})">✕</button>${
            m.dl == x.id ?
              `<div class=cmbd><input id=cda type=number inputmode=numeric min=1 placeholder="Atrasar quantos pontos?"><button onclick="cmbDo(${
                x.id})">OK</button></div>` :
              ''}</div>`)
        .join('') :
      '<small>Nenhum personagem adicionado.</small>'}</div>
${
    m.on ?
      `<button class=btn onclick="cmbNext()">Próximo turno ▶</button><div class=grid2><button onclick="cmbEnd()">Encerrar combate</button><button onclick="cmbClear()">Limpar tudo</button></div>` :
      `<button class=btn ${m.l.length ? '' : 'disabled'} onclick="cmbGo()">⚔ Combate!</button>${
        m.l.length ? '<button onclick="cmbClear()" style="width:100%">Limpar tudo</button>' : ''}`}</div>`
}

// Adicionar combatente
function cmbAdd() {
  const n = $('#cmn').value.trim(), d = $('#cmr').value, b = $('#cmb').value;
  if (!n) return toast('Informe o nome.');
  if (d === '' || isNaN(+d)) return toast('Informe o dado rodado.');
  if (b !== '' && isNaN(+b)) return toast('Bônus inválido.');
  cmbPush(n, +d, +b || 0)
}

// Coloca o combatente na ordem (iniciativa = dado + bônus); com combate em andamento entra na posição certa
function cmbPush(n, d, b, p) {
  const m = cmbS(), e = {id: (m.n = (m.n || 0) + 1), n, d, b};
  if (p) e.p = p;
  e.i = e.d + e.b;
  if (m.on) {
    let p = m.l.findIndex(x => x.i < e.i || (x.i == e.i && x.b < e.b));
    if (p < 0) p = m.l.length;
    m.l.splice(p, 0, e)
  } else
    m.l.push(e);
  cmbR()
}

// Iniciar combate
function cmbGo() {
  const m = cmbS();
  if (!m.l.length) return;
  m.l = cmbSort(m.l);
  m.on = 1;
  m.c = m.l[0].id;
  m.r = 1;
  m.dl = null;
  cmbR()
}

// Próximo turno
function cmbNext() {
  const m = cmbS();
  let i = m.l.findIndex(x => x.id == m.c);
  i++;
  if (i >= m.l.length) {
    i = 0;
    cmbRd(m)
  }
  m.c = m.l[i].id;
  m.dl = null;
  cmbR()
}
function cmbEnd() {
  const m = cmbS();
  m.on = 0;
  m.c = null;
  m.r = 1;
  m.dl = null;
  m.l.forEach(x => {
    x.i = x.d + x.b;
    x.u = 0
  });
  m.l = cmbSort(m.l);
  cmbR()
}
function cmbClear() {
  if (cmbC()) S.cmbs[S.cp] = cmbNew();
  else S.cmb = cmbNew();
  cmbR()
}
function cmbDl(id) {
  const m = cmbS();
  m.dl = m.dl == id ? null : id;
  cmbR()
}
function cmbDel(id) {
  const m = cmbS(), i = m.l.findIndex(x => x.id == id);
  if (i < 0) return;
  const was = m.c == id;
  m.l.splice(i, 1);
  if (was && m.l.length) {
    if (i >= m.l.length) {
      m.c = m.l[0].id;
      cmbRd(m)
    } else
      m.c = m.l[i].id
  }
  if (!m.l.length) {
    m.on = 0;
    m.c = null;
    m.r = 1
  }
  if (m.dl == id) m.dl = null;
  cmbR()
}

// Atrasar ação
function cmbDo(id) {
  const m = cmbS(), i = m.l.findIndex(x => x.id == id), e = m.l[i], v = Math.floor(+$('#cda').value);
  if (!e) return;
  if (!(v >= 1)) return toast('Informe quantos pontos atrasar.');
  const mx = cmbLim(e);
  if (v > mx) return toast('⚠ Limite desta rodada: ' + mx + ' ponto(s).');
  const was = m.c == id;
  e.i -= v;
  e.u = (e.u || 0) + v;
  m.l.splice(i, 1);
  let p = m.l.findIndex(x => x.i < e.i);
  if (p < 0) p = m.l.length;
  m.l.splice(p, 0, e);
  if (was) {
    if (m.l[i] && m.l[i].id != id)
      m.c = m.l[i].id;
    else {
      let j = m.l.findIndex(x => x.id == id) + 1;
      if (j >= m.l.length) {
        j = 0;
        cmbRd(m)
      }
      m.c = m.l[j].id
    }
  }
  m.dl = null;
  cmbR()
}

// ---- Jogadores presentes (só na campanha): fichas vinculadas, o Mestre só informa o dado
// bônus de Iniciativa da ficha do jogador (perícia + bônus de poderes), 0 se não der para calcular
function cmbBon(d) {
  try {
    const k = K(d), v = Math.floor(gb(d, 'Iniciativa', k.tr.includes('Iniciativa')) + ob(d, 'Iniciativa'));
    return isFinite(v) ? Math.max(-20, Math.min(60, v)) : 0
  } catch (e) {
    return 0
  }
}
let CMBP = {l: []};
function cmbPlH() {
  const c = campOf(S.cp), m = cmbS(), l = (c && CS.data[c.id]) || [];
  CMBP.l = l.map(x => ({p: x.k + '|' + x.cid, n: String((x.data && x.data.name) || 'Ficha').slice(0, 40), b: cmbBon(x.data || {})}));
  return `<div class=card><b>Jogadores presentes</b>${
    CMBP.l.map((z, i) => {
      const on = m.l.some(x => x.p == z.p);
      return `<div class=row style="gap:6px;margin-top:6px;align-items:center"><div style="flex:1;min-width:0;word-break:break-word"><b>${
        esc(z.n)}</b> <small>Iniciativa ${z.b >= 0 ? '+' : ''}${z.b}</small></div>${
        on ? '<small>✔ na ordem</small>' :
             `<input id=cpd${i} type=number inputmode=numeric placeholder="Dado" style="width:70px"><button onclick="cmbAddP(${i})" style="width:auto">+</button>`}</div>`
    }).join('') ||
    '<br><small>Nenhum jogador vinculou uma ficha a esta campanha ainda (eles escolhem "Usar aqui" na campanha). Você ainda pode adicionar à mão abaixo.</small>'}</div>`
}
function cmbAddP(i) {
  const z = CMBP.l[i], d = $('#cpd' + i).value;
  if (!z) return;
  if (d === '' || isNaN(+d)) return toast('Informe o dado rodado.');
  cmbPush(z.n, +d, z.b, z.p)
}
