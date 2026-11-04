/**
 * Bateria de testes de Melhorias (modificações e maldições) + relatório.
 *   node tests/melhorias.test.js            roda e imprime o resumo
 *   node tests/melhorias.test.js --report   também grava tests/relatorio-melhorias.json
 */
const fs = require('fs');
const path = require('path');
const { loadApp } = require('./helpers/app-loader');

const app = loadApp({ cfg: { url: '', key: '' } });
const res = app.ev(fs.readFileSync(path.join(__dirname, 'helpers', 'scenario.melhorias.js'), 'utf8'));
const lista = Array.from(res);
const grupos = {};
lista.forEach((r) => { (grupos[r.g] = grupos[r.g] || []).push(r); });
const falhas = lista.filter((r) => !r.ok);
if (process.argv.includes('--report')) fs.writeFileSync(path.join(__dirname, 'relatorio-melhorias.json'), JSON.stringify(lista, null, 1));
for (const [g, l] of Object.entries(grupos)) console.log(`${l.every((r) => r.ok) ? 'OK   ' : 'FALHA'} | ${g}: ${l.filter((r) => r.ok).length}/${l.length}`);
falhas.forEach((r) => console.log(`  ✘ [${r.g}] ${r.n} → ${r.d}`));
console.log(`${lista.length - falhas.length}/${lista.length} verificações passaram`);
process.exit(falhas.length ? 1 : 0);
