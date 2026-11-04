/** Roda todos os testes e resume o resultado:  node tests/run.js   (ou: npm test) */
const { spawnSync } = require('child_process');
const path = require('path');

const suites = [
  ['Verificação geral (telas, fichas, cálculos, combate)', 'smoke.test.js'],
  ['Melhorias (modificações, maldições e botões de PE)', 'melhorias.test.js'],
  ['Contas (login, senha, sincronização, segurança)', 'account.test.js'],
];
let falhou = false;
for (const [nome, arquivo] of suites) {
  const r = spawnSync(process.execPath, [path.join(__dirname, arquivo)], { encoding: 'utf8' });
  const linhas = (r.stdout || '').trim().split('\n');
  const resumo = linhas[linhas.length - 1];
  console.log(`${r.status === 0 ? '✔' : '✘'} ${nome}: ${resumo}`);
  if (r.status !== 0) { falhou = true; console.log((r.stdout || '') + (r.stderr || '')); }
}
process.exit(falhou ? 1 : 0);
