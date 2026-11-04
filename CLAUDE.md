# Ordem Paranormal RPG — guia para o Claude

App web mobile-first (HTML/CSS/JS puro, sem build) para jogar Ordem Paranormal RPG: ficha do jogador, área do Mestre e contas.
Base de regras: livro v1.1 + ficha oficial. Hospedagem: GitHub Pages. Login e banco: Supabase.

## Estrutura
- `index.html` — só a marcação e a lista de scripts (ORDEM IMPORTA: cada arquivo usa o que os anteriores declararam).
- `css/style.css` — estilos (a ordem das regras importa, é uma cascata).
- `js/` — scripts clássicos no escopo global (os `onclick="..."` do HTML chamam funções globais):
  `config` · `core` (estado, utilitários) · `data` (tabelas do livro) · `rules` (cálculos) · `ui` (roteador R, gestos) · `views` (telas) · `account` (login e sincronização) · `main.js` (inicia o app).
- `js/data/threats.js` — ameaças do livro (`THREATS`); `js/views/threats.js` — Monstruário (lista `thr` e ficha `thd`, abas Info/Ações). Paletas por elemento em `css/style.css` (seção "Monstruário"), aplicadas por `thTheme()` e independentes do tema claro/escuro. Fundos das fichas = `img/bg-{sangue,morte,conhecimento,energia,medo}.svg` (um por elemento, para TODAS as criaturas do elemento), gerados por `python3 -I tools/gen-fundos.py` (determinístico; edite o script e rode de novo, não o SVG; o símbolo oficial vai embutido em base64). Conhecimento e Medo têm fundo escuro, então a paleta deles é de texto claro. Relíquias (VD ≥ 400: Diabo, Deus da Morte, Máscara do Desespero, Anfitrião) só se diferenciam por um card em destaque na lista (`.threl`, cores por elemento); Realidade (Humanos/Natureza) = símbolo `img/bg-humanos.png`/`bg-natureza.png` a 15% de opacidade via `data-thbg` (`THBG`/`thTheme()`). Ícones de Humanos/Natureza em `img/`. Símbolos dos elementos = PNG oficiais `img/sym-*.png` (brancos), usados por `SYM[el](cor)` em `js/data/symbols.js` (vira preto em fundo claro) e por `thIcon`; não redesenhar em SVG.
- `js/data/curses.js` + `js/rules/curses.js` + `js/views/modifications.js` — Melhorias do Inventário: modificações (+1 categoria) e maldições do livro (`it.cur`; 1ª maldição +II de categoria, demais +I; elementos opressores não combinam). Efeitos automáticos em `cfx(c)` (Defesa, PV, PE, DT, resistências, perícias, atributos via `ea(c)`) e em `weff` (Lancinante/Erosiva = dano extra, Predadora = margem x2). O nome da arma melhorada ganha emoji depois do nome: 🔴⚫🟡🟣 (Sangue, Morte, Conhecimento, Energia) e ⭐ (modificação), ex.: Besta🟣⭐ (`cuNm`). Maldições com PE: `curUse` (Usar); Senciente fica ativa em `c.sust` (id `cu|item|maldição`) e tem botão Manter (`curKeep`, 1 PE/turno); as de custo variável (Ritualística, Abascanta, Conjuração, Reflexão) têm `curVar`/`curPay`. Lépida soma +3m em DESL (`cf.desl`). Testes: `tests/melhorias.test.js` (+ `--report` grava `tests/relatorio-melhorias.json`).
- `supabase.sql` — tabelas + RLS (cada usuário só acessa as próprias linhas).
- `tests/` — `npm test` (ou `node tests/run.js`). Sem dependências.

## Como mexer
1. Estado global `S` (salvo em `localStorage` chave `op` e, com login, sincronizado no Supabase). Telas por `S.v`; `R()` redesenha.
2. Novo arquivo JS: adicione o `<script>` no `index.html` na posição certa (depois do que ele usa).
3. Depois de qualquer mudança: `npm test`. Se a mudança de comportamento for INTENCIONAL, rode `npm run test:update` e comite o `tests/snapshot.json` junto.
4. Versão: a cada publicação (push) suba `APP_VERSION` em `js/config.js` (aparece ao lado de BETA na tela inicial; o usuário usa para saber se a versão nova já chegou).
5. Commits no padrão Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`).
6. Nunca coloque a *secret/service_role key* do Supabase no código. A chave "publishable" em `js/config.js` é pública por design.

## Decisões de regra do projeto (definidas pelo Mestre/usuário)
- Atrasar ação (iniciativa): por rodada, limite = 10 + bônus de Iniciativa; iniciativa mínima 1; o limite volta a cada rodada. A tela mostra só o número (dado + bônus).
- Empate de iniciativa: maior bônus age primeiro.
- Poderes que o usuário pediu para NÃO alterar (deixar como estão): Combate Defensivo, Saque Rápido, Conhecimento Aplicado, Hacker, Primeira Impressão, Camuflar Ocultismo, Envolto em Mistério, Fluxo de Poder, Intuição Paranormal, Improvisar Componentes; Especialista em Elemento só tem o card de escolha do elemento.
- Custo de PE nunca fica negativo (Ritual Predileto, Lâmina Maldita).
- Fundo escuro do tema: `#121212`.

## Pendências conhecidas
Escudo do Mestre, Criador de Cenas; Melhorias: itens amaldiçoados especiais ainda não existem; o app não controla PV/RD do item amaldiçoado (+10 PV e +10 RD por maldição, livro p.145); Monstruário: faltam os Perigos (armadilhas/doenças), a Máscara do Desespero não tem o texto do Enigma de Medo, só 48 ameaças (Sangue, Morte, Conhecimento e Energia) têm arte (`THART` em `js/views/threats.js`, arquivos `img/th/<id>.webp`, PNG sem fundo, sem moldura; não há upload; `THSM` = exceções exibidas menores, ex.: Zumbi de Sangue); DT +2 do Especialista em Elemento; excluir conta pelo app; compartilhar fichas/campanhas entre contas.

## Limites dos testes
Simulam navegador e servidor (Supabase falso). Não cobrem aparência visual nem o Supabase real: depois de publicar, teste o login uma vez de verdade.
