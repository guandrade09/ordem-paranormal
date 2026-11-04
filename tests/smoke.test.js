/**
 * Teste de fumaça: o app abre, as telas desenham e os resultados continuam os mesmos.
 *
 *   node tests/smoke.test.js            compara com tests/snapshot.json
 *   UPDATE=1 node tests/smoke.test.js   regrava o snapshot (use só quando a mudança de resultado for intencional)
 *   node tests/smoke.test.js --html caminho/do/index-antigo.html   roda o mesmo cenário em outra versão (comparação)
 */
const fs = require('fs');
const path = require('path');
const { loadApp, ROOT } = require('./helpers/app-loader');

const SNAPSHOT = path.join(__dirname, 'snapshot.json');
const checks = [];
const check = (name, ok, detail = '') => { checks.push({ name, ok: !!ok, detail }); };

function run(htmlPath) {
  const app = loadApp({ html: htmlPath, cfg: { url: '', key: '' } }); // sem Supabase: testa o app em modo local
  check('o app carrega todos os scripts sem erro', app.scripts.length > 0, `${app.scripts.length} script(s)`);
  check('a primeira tela (início) é desenhada', /Ordem|Criar|Personagem|Mestre/i.test(app.html()), 'HTML inicial com ' + app.html().length + ' caracteres');
  const result = app.ev(fs.readFileSync(path.join(__dirname, 'helpers', 'scenario.in-app.js'), 'utf8'));
  return { app, result };
}

function main() {
  const i = process.argv.indexOf('--html');
  const alt = i > -1 ? path.resolve(process.argv[i + 1]) : null;
  const { result } = run(alt);
  const erros = Object.entries(result).filter(([, v]) => typeof v === 'string' && v.startsWith('ERRO'));
  check('nenhuma tela/cálculo do cenário lançou erro', erros.length === 0, erros.map(([k, v]) => `${k}: ${v}`).join('; '));
  check('cenário gerou resultados suficientes', Object.keys(result).length >= 40, Object.keys(result).length + ' resultados');

  const ordem = result['combate:ordem'] || '';
  check('combate: ordena por dado+bônus (empate: maior bônus), atraso 17→13 e limite = min(10+bônus, valor−1)', /^Ana17,Bruno15,Caio14,Davi14 \| Bruno15,Caio14,Davi14,Ana13 \| limiteCaio=13$/.test(ordem), ordem);

  check('DT de ritual = 10 + PE/rodada + Presença (Ocultista 5%/PRE3 = 14; 99%/PRE5 = 35; Combatente 70%/PRE1 = 25)',
    result['dt:rituais'] === 'Combatente5=12,Combatente70=25,Especialista35=18,Ocultista5=14,Ocultista99=35', result['dt:rituais']);
  check('editar ficha: salva nome/jogador/foto, remove a foto e recusa nome vazio',
    result['edicao:ficha'] === 'Novo Nome|Maria|true || Novo Nome|Maria|false', result['edicao:ficha']);

  // lv de NEX 15% = 3: Sangue de Ferro = +3 +3 PV; Presença Poderosa soma PRE(4) só ao limite de rituais; Mira de Elite soma INT(3) e Tiro Certeiro AGI(2)
  check('habilidades: Sangue de Ferro (PV), Presença Poderosa (rituais) e Mira de Elite/Tiro Certeiro (dano) usam os atributos',
    result['habilidades:atributos'] === '6|4|0|0|5| + 2 (AGI) + 3 (INT)', result['habilidades:atributos']);
  check('melhorias: maldições filtradas por tipo/elemento, categoria +II/+I, ➕/emoji no nome, dano extra, margem x2, Defesa (maior), PV, RD e atributo',
    result['melhorias:maldicoes'] === 'true|false|true|false|true|true|0|2|false|true|false|3|18→15|[["1d8","Sangue",1]]|Pistola🩸➕|true|5|15|2|3|2|1|0|0|true|true', result['melhorias:maldicoes']);
  check('maldições com PE: Usar desconta PE (e respeita PE/rodada e PE insuficiente), Regenerativa cura, aba Ações lista maldições; componentes ritualísticos = categoria 0',
    result['melhorias:uso'] === '9|true|7|1|true|3|0', result['melhorias:uso']);
  check('monstruário: 67 ameaças, grupos na ordem do livro e VD crescente em cada grupo',
    result['monstruario:lista'] === '67|Sangue>Morte>Conhecimento>Energia>Medo>Realidade: Humanos>Realidade: Natureza|true|true', result['monstruario:lista']);
  check('monstruário: todas as fichas (abas Info e Ações) desenham sem undefined/NaN', result['monstruario:fichas'] === 'ok', result['monstruario:fichas']);
  check('monstruário: paleta do elemento só nas fichas (Realidade e lista voltam ao tema padrão)', result['monstruario:tema'] === 'morte||', result['monstruario:tema']);
  check('monstruário: arte fixa das ameaças (sem upload, sem moldura)', result['monstruario:imagem'] === 'true|true|true|48', result['monstruario:imagem']);

  if (process.env.UPDATE) {
    fs.writeFileSync(SNAPSHOT, JSON.stringify(result, null, 1) + '\n');
    console.log('snapshot regravado:', Object.keys(result).length, 'resultados');
  } else if (fs.existsSync(SNAPSHOT)) {
    const base = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
    const diff = Object.keys({ ...base, ...result }).filter((k) => base[k] !== result[k]);
    check('resultados iguais ao snapshot (nada mudou nem quebrou)', diff.length === 0, diff.length ? 'diferentes: ' + diff.join(', ') : Object.keys(base).length + ' resultados idênticos');
  } else {
    check('snapshot existe (rode com UPDATE=1 uma vez)', false, 'tests/snapshot.json não encontrado');
  }
  return checks;
}

if (require.main === module) {
  const res = main();
  res.forEach((c) => console.log((c.ok ? 'OK    ' : 'FALHA ') + '| ' + c.name + (c.detail ? ' | ' + c.detail : '')));
  const falhas = res.filter((c) => !c.ok).length;
  console.log(`\n${res.length - falhas}/${res.length} verificações passaram`);
  process.exit(falhas ? 1 : 0);
}
module.exports = { main };
