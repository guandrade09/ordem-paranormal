/**
 * Utilitários: grupos de armas, rolagem de dados, toast, efeitos visuais, modal e escape de HTML.
 */

// Grupos de armas por proficiência
const SIM =
        [
          'Faca', 'Martelo', 'Punhal', 'Bastão', 'Machete', 'Lança', 'Cajado', 'Arco', 'Besta', 'Pistola', 'Revólver',
          'Fuzil de caça'
        ],
      PES = ['Bazuca', 'Lança-chamas', 'Metralhadora'], GT = [
        ['Armas simples', x => SIM.includes(x[0])], ['Armas táticas', x => !SIM.includes(x[0]) && !PES.includes(x[0])],
        ['Armas pesadas', x => PES.includes(x[0])]
      ];

// Rolagem de dados
const rd = (n, s) => Array.from({length: n}, () => 1 + Math.floor(Math.random() * s)), rl = t => {
  let m = t.match(/(\d+)d(\d+)([+-]\d+)?/);
  return rd(+m[1], +m[2]).reduce((a, b) => a + b, 0) + (+m[3] || 0)
};

// Aviso rápido na tela
const toast = t => {
  let e = $('#t');
  e.textContent = t;
  e.className = 'show';
  clearTimeout(toast.i);
  toast.i = setTimeout(() => e.className = '', 3800)
};

// Efeito visual de ritual
function fx(k, g2) {
  let [c, g] = FX[k] || FX.impacto, e = $('#fx');
  e.style.setProperty('--c', c);
  if (SYM[k])
    e.innerHTML = `<svg viewBox="0 0 100 100" style="width:70vw">${SYM[k](k == 'Medo' ? '#fff' : SC[k])}</svg>`;
  else
    e.textContent = g2 || g;
  e.className = 'go';
  setTimeout(() => e.className = '', 900)
}

// Janela modal
const modal = h => {
  $('#m').innerHTML = '<div class="card fade">' + h + '</div>';
  $('#m').className = 's'
}, cm = () => $('#m').className = '';

// Escape de aspas para atributos HTML
const esc = s => s.replace(/"/g, '&quot;');
