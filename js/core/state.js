/**
 * Estado global do app, atalhos de DOM, migração de dados antigos e persistência no localStorage.
 */

const $ = s => document.querySelector(s), A = ['AGI', 'FOR', 'INT', 'PRE', 'VIG'], AN = {
  AGI: 'Agilidade',
  FOR: 'Força',
  INT: 'Intelecto',
  PRE: 'Presença',
  VIG: 'Vigor'
},
      RM = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];

// Estado global (carregado do localStorage) + migração de nomes antigos de rituais
let S;
try {
  S = JSON.parse(localStorage.getItem('op'))
} catch (e) {
}
S = S || {chars: [], v: 'start', tab: 0};
{
  const RNM = {
    'Tecer Ilusão': 'Criar Ilusão',
    'Aprimorar Mente': 'Aprimoramento Mental',
    'Aprimorar Físico': 'Físico Aprimorado',
    'Miasma Entrópico': 'Miasma',
    'Dissipar Ritual': 'Neutralizar Ritual'
  },
        mg = a => (a || []).map(x => typeof x == 'string' ? x.replace(/^[^|]+/, n => RNM[n] || n) : x);
  (S.chars || []).forEach(c => {c.rit = mg(c.rit)});
  setTimeout(() => {
    try {
      (S.chars || []).forEach(c => {
        m4fix(c);
        abDedup(c);  // limpa habilidades duplicadas de fichas antigas
        if ((c.ab || []).some(a => a.n == 'Grimório Ritualístico')) grmItem(c)
      });
      save()
    } catch (e) {
    }
  }, 0);
  if (S.d && S.d.rit) S.d.rit = mg(S.d.rit)
}
S.v = 'start';
try {
  if (S.theme) document.documentElement.dataset.theme = S.theme
} catch (e) {
}
var MDC = null;

// Persistência local; com conta, agenda a sincronização
const save = () => {
  try {
    localStorage.setItem('op', JSON.stringify(S))
  } catch (e) {
  }
  if (SB_ON) {
    syncSoon();
    if (typeof csSoon == 'function') csSoon()  // cópia das fichas vinculadas a campanhas (o Mestre vê ao vivo)
  }
}, cur = () => S.chars.find(c => c.id == S.cid);

// Lixeira: ficha excluída (ou removida por outro aparelho) fica guardada aqui, para poder ser restaurada
function chTrash(c) {
  S.trash = [{t: Date.now(), c}].concat(S.trash || []).slice(0, 30)
}

// Excluir ficha DE PROPÓSITO: vai para a lixeira e deixa uma "lápide" (S.dl) — só lápide apaga na conta.
// Ficha que apenas "sumiu" do aparelho nunca é apagada no servidor.
function chDel(id) {
  const c = S.chars.find(z => z.id == id);
  if (!c) return;
  chTrash(c);
  S.chars = S.chars.filter(z => z !== c);
  const k = String(id);
  S.dl = (S.dl || []).filter(x => x != k).concat(k).slice(-200);
  if (S.cid == id) S.cid = null;
  save()
}

// Restaurar da lixeira (com id novo, para não colidir com a lápide)
function chRestore(i) {
  const e = (S.trash || [])[i];
  if (!e) return;
  S.trash.splice(i, 1);
  const c = e.c;
  c.id = Date.now();
  S.chars.push(c);
  save()
}
