/**
 * Cards de itens, ícones e controles de quantidade.
 */

function dis(id, i) {
  mut(z => {
    let q = id ? z.sust.find(w => w.id == id) : z.sust[i];
    if (q && q.tpv) z.t.pv = Math.max(0, z.t.pv - q.tpv);
    z.sust = z.sust.filter(w => w !== q)
  })
}

// Card de item
const itemCard = (it, i) => `<div class="card row"><div style="flex:1"><b>${
  it.el ? it.n.replace(/ de (Conhecimento|Energia|Morte|Sangue|Medo)$/, '') : it.n}${cuIcon(it)}</b>${
  it.el ? ` <span class=el style="background:${EC[it.el]}">${it.el}</span>` : ''}${lack(cur(), it) ? ' ⚠️' : ''}${
  it.w && it.w.mx ?
    ` <small>pente ${it.w.mag}/${it.w.mx}</small> <button onclick="rc(${i})">Recarregar</button>` :
    ''}${it.q != null ? ` <small>${it.q} balas</small>` : ''}${dsOf(it) ? `<br><small>${md(dsOf(it))}</small>` : ''}${
  it.w && it.w.mx ? '<br>' + bulRow(it.w.am, it.w.mag, it.w.mx) :
                    ''}${it.q != null ? '<br>' + bulRow(it.n, it.q, AMX[it.n] || 20) : ''}${flagBox(it, i)}${
  it.sl ?
    `<div class=flag style="display:block"><button style="width:100%" onclick="event.stopPropagation();seloMk(${i})">Fabricar selo · <b class=pec>${
      seloCusto(cur(), it.sl, it.sv || 0)} PE</b></button><small>${
      (RT.find(z => z.n == it.sl.split('|')[0]) || {}).ci}º círculo · ${SELV[it.sv || 0]} (preço automático)</small></div>` :
    ''}</div><div class=ib><div><small>Cat.</small><b>${
  RM[ecat(cur(), it)]}</b></div><div><small>Espaços</small><b>${ee(cur(), it)}</b></div>${
  it.w ? `<div><small>Dano</small><b>${weff(cur(), it).d}${wEx(weff(cur(), it))}</b></div><div><small>Crítico</small><b>${
           weff(cur(), it).c}/x${it.w.x}</b></div>` :
         ''}</div><button class=x onclick="mut(z=>z.inv.splice(${i},1))">✕</button></div>`;
const tot = (c, n) => c.inv.filter(x => x.n == n && x.q > 0).reduce((a, x) => a + x.q, 0), dec = (z, n, k) => {
  for (const x of z.inv)
    if (x.n == n && x.q > 0 && k > 0) {
      let t = Math.min(x.q, k);
      x.q -= t;
      k -= t
    }
}, EXR = [];

// Ícones de poderes
const ICO = {
  'Saber é Poder': '🧠',
  'Ataque Especial': '💥',
  'Eclético': '🧩',
  'Perito': '🎯',
  '110%': '🏃',
  'Posição de Combate': '🛡️',
  'Espírito Cívico': '🤝',
  'Motor de Busca': '🌐',
  'Impostor': '🎭',
  'Processo Otimizado': '📈',
  'Faro para Pistas': '🔎',
  'Paramédico': '⚕️'
};
const art4 = ci => ELO.slice(0, 4).map(e => `<svg viewBox="0 0 100 100" width=56>${art(e, ci)}</svg>`).join('');
