/**
 * Regras: ataques com armas, duas armas e rolagens de dano.
 */

// Ataque com arma
function atk(u, pen, quiet) {
  let c = cur(), it = u < 0 ? {w: {m: 1, d: UNA(c), c: 20, x: 2, t: 'impacto'}} : c.inv[u], w = weff(c, it),
      sk = w.m ? 'Luta' : 'Pontaria', bad = m => quiet ? m : toast(m);
  if (w.am) {
    if (w.mx) {
      if (w.mag <= 0) return bad('⚠ Arma vazia! Recarregue antes de atirar.')
    } else if (!tot(c, w.am))
      return bad('⚠ Sem ' + w.am.toLowerCase() + ' no inventário.')
  }
  let k = K(c), sa = w.m ? c.attr[w.st || 'FOR'] : c.attr.AGI, a = Math.max(0, sa - (pen || 0)), d = rd(a || 2, 20),
      r = a ? Math.max(...d) : Math.min(...d), b = gb(c, sk, k.tr.includes(sk)) + (w.ab || 0), cr = r >= w.c,
      fl = +(w.d.match(/[+-]\d+$/) || [0])[0],
      dm = (rl(w.d) - fl) * (cr ? w.x : 1) + fl + (w.m ? c.attr[w.st || 'FOR'] : (w.pl ? c.attr[w.pl] : 0));
  if (!quiet) fx(w.t);
  if (w.am)
    mut(z => {
      if (w.mx)
        z.inv[u].w.mag--;
      else
        dec(z, w.am, 1)
    });
  let m = `${sk}: [${d}] ${r}+${b} = ${r + b}${cr ? ' · CRÍTICO!' : ''} · Dano ${dm} (${w.t})`;
  return quiet ? m : toast(m)
}

// Ataque duplo (Combater com Duas Armas)
function atk2(u) {
  let c = cur(), ws = c.inv.map((it, i) => it.w && i != u && !(DMG[it.n]) ? i : -1).filter(i => i >= 0),
      lt = i => c.inv[i].e <= 1;
  if (!ws.length) return toast('⚠ Você precisa de uma segunda arma no Inventário.');
  modal(`<button class=xc onclick="cm()">✕</button><b>Duas armas — ${
    c.inv[u].n} +</b><small> (–1 dado em todos os ataques; ao menos uma arma deve ser leve)</small>${
    ws.map(i => {
        let ok = lt(u) || lt(i);
        return `<button class=card ${ok ? '' : 'disabled style="opacity:.5"'} onclick="atk2go(${u},${i})"><b>${
          c.inv[i].n}</b>${ok ? '' : '<br><small class=red>Nenhuma das duas é leve</small>'}</button>`
      })
      .join('')}`)
}
function atk2go(u, v) {
  cm();
  let a = atk(u, 1, 1), b = atk(v, 1, 1);
  toast(a + ' ‖ ' + b)
}

// Rolagem de dano
function rc(i) {
  let c = cur(), it = c.inv[i], w = it.w, t = tot(c, w.am);
  if (w.mag >= w.mx) return toast('O pente já está cheio.');
  if (!t) return toast('⚠ Sem ' + w.am.toLowerCase() + ' no inventário.');
  let ds = DISC.includes(it.n), lost = ds ? w.mag : 0, take = ds ? Math.min(w.mx, t) : Math.min(w.mx - w.mag, t);
  mut(z => {
    let x = z.inv[i].w;
    dec(z, x.am, take);
    x.mag = ds ? take : x.mag + take
  });
  toast(`Recarregou: −${take} do pacote.${lost ? ' ' + lost + ' bala(s) do pente descartada(s).' : ''}`)
}
