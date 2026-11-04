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
// Símbolos dos elementos: os PNG oficiais em img/ (sym-*.png, brancos). Em fundos claros o símbolo vira preto (filtro).
const SYMF = {Sangue: 'sangue', Morte: 'morte', Conhecimento: 'conhecimento', Energia: 'energia', Medo: 'medo'},
      // Cor escura = fundo claro: o símbolo é desenhado em preto
      symDark = c => {
        const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c || '');
        if (!m) return false;
        const h = m[1].length == 3 ? m[1].replace(/./g, '$&$&') : m[1], [r, g, b] = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
        return (r * 299 + g * 587 + b * 114) / 1000 < 70
      },
      // SYM[elemento](cor) devolve o <image> para colocar dentro de um <svg viewBox="0 0 100 100">
      SYM = Object.fromEntries(Object.entries(SYMF).map(([k, f]) => [k, c =>
        `<image href="img/sym-${f}.png" x=0 y=0 width=100 height=100${symDark(c) ? ' style="filter:brightness(0)"' : ''} />`]));

// Instrumentos rituais
const INST = [
  'Alterar Memória', 'Cicatrização', 'Convocação Instantânea', 'Decadência', 'Deflagração de Energia', 'Descarnar',
  'Eletrocussão', 'Hemofagia', 'Inexistir', 'Invadir Mente', 'Lâmina do Medo', 'Miasma', 'Ouvir os Sussurros',
  'Paradoxo', 'Salto Fantasma', 'Teletransporte', 'Transfusão Vital', 'Transfigurar Terra', 'Neutralizar Ritual',
  'Alterar Destino'
];
