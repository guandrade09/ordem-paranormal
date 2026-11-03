/**
 * Dados visuais: cores e símbolos SVG de elementos e instrumentos rituais.
 */

// Cores de elementos
const SC = {
  Conhecimento: '#ffd21a',
  Energia: '#ff5cf0',
  Morte: '#e8e8e8',
  Sangue: '#ff3b3b',
  Medo: '#111'
},
      BG = {
        Conhecimento: ['#3a2c05', '#0d0a02'],
        Energia: ['#7a1fc8', '#240a45'],
        Morte: ['#2a2a2a', '#050505'],
        Sangue: ['#6b0a12', '#1a0204'],
        Medo: ['#f0f0f0', '#b5b5b5']
      };
const G = (c, w, d) =>
  `<g fill=none stroke="${c}" stroke-width=${w} stroke-linecap=round stroke-linejoin=round>${d}</g>`;

// Símbolos SVG
const SYM = {
  Conhecimento: c => {
    let s = '';
    [[40, 16], [30, 12], [20, 8]].forEach(([r, n], k) => {
      for (let i = 0; i < n; i++) {
        let a = i * 360 / n + k * 9, x = 50 + r * Math.cos(a * Math.PI / 180), y = 50 + r * Math.sin(a * Math.PI / 180);
        s += `<path d="M-2.5 -3 L1 3 M-3 0 L3 -1 M2 -4 Q4 0 1 2" transform="translate(${x} ${y}) rotate(${
          a + 90})" fill=none stroke="${c}" stroke-width=1.4 stroke-linecap=round />`
      }
    });
    return s + G(c, 2.6, '<circle cx=50 cy=44 r=5 /><circle cx=50 cy=56 r=5 />')
  },
  Energia: c => G(c, 3,
    '<path d="M50 82 L34 56 Q28 46 36 40 M50 82 L66 56 Q72 46 64 40" /><path d="M26 54 Q40 70 50 82 Q60 70 74 54" /><path d="M50 16 L50 52 M44 28 L50 16 L56 28" /><path d="M36 40 Q44 46 50 52 Q56 46 64 40" />'),
  Morte: c => G(c, 3,
    '<circle cx=50 cy=50 r=24 /><circle cx=50 cy=50 r=14 /><path d="M50 40 L50 64 M50 42 Q58 42 58 49 Q58 55 50 55" /><path d="M22 18 L38 36 M78 14 L66 34 M24 82 L38 66 M70 86 L62 66 M50 8 L50 20" />'),
  Sangue: c => G(c, 5.5, '<path d="M50 12 L50 82" /><path d="M26 44 L74 44" /><path d="M20 80 L80 80 L73 88" />'),
  Medo: c => G(c, 4,
    '<circle cx=26 cy=30 r=8 /><path d="M30 22 Q52 2 68 22 Q76 40 54 48" /><path d="M52 30 L52 90" /><path d="M12 46 Q40 72 74 42 Q86 40 82 56 Q78 70 60 66 M22 56 L30 78" /><path d="M50 62 Q30 66 32 80 Q38 94 56 88" />')
};

// Instrumentos rituais
const INST = [
  'Alterar Memória', 'Cicatrização', 'Convocação Instantânea', 'Decadência', 'Deflagração de Energia', 'Descarnar',
  'Eletrocussão', 'Hemofagia', 'Inexistir', 'Invadir Mente', 'Lâmina do Medo', 'Miasma', 'Ouvir os Sussurros',
  'Paradoxo', 'Salto Fantasma', 'Teletransporte', 'Transfusão Vital', 'Transfigurar Terra', 'Neutralizar Ritual',
  'Alterar Destino'
];
