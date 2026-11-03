/**
 * Mestre: Criador de Combates (iniciativa dinâmica e atraso de ação).
 */

// Criador de Combates: limite de atraso (10 + bônus, mínimo 1)
const cmbLim = x => Math.max(0, Math.min(10 + x.b - (x.u || 0), x.i - 1)),
      cmbRd =
        m => {
          m.r++;
          m.l.forEach(x => {x.u = 0})
        },
      cmbS = () => (S.cmb = S.cmb || {l: [], on: 0, c: null, r: 1}),
      cmbSort = l =>
        l.map((x, k) => [x, k]).sort((p, q) => q[0].i - p[0].i || q[0].b - p[0].b || p[1] - q[1]).map(z => z[0]);

// Tela do Criador de Combates
function cmbv() {
  const m = cmbS();
  return `<div class=fade><button onclick="S.v='mestre';R()">← Voltar</button><div class=bar>Criador de Combates</div>
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
  const m = cmbS(), e = {id: (m.n = (m.n || 0) + 1), n, d: +d, b: +b || 0};
  e.i = e.d + e.b;
  if (m.on) {
    let p = m.l.findIndex(x => x.i < e.i || (x.i == e.i && x.b < e.b));
    if (p < 0) p = m.l.length;
    m.l.splice(p, 0, e)
  } else
    m.l.push(e);
  R()
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
  R()
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
  R()
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
  R()
}
function cmbClear() {
  S.cmb = {l: [], on: 0, c: null, r: 1};
  R()
}
function cmbDl(id) {
  const m = cmbS();
  m.dl = m.dl == id ? null : id;
  R()
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
  R()
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
  R()
}
