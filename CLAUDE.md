# Ordem Paranormal RPG — guia para o Claude

App web mobile-first (HTML/CSS/JS puro, sem build) para jogar Ordem Paranormal RPG: ficha do jogador, área do Mestre e contas.
Base de regras: livro v1.1 + ficha oficial. Hospedagem: GitHub Pages. Login e banco: Supabase.

## Estrutura
- `index.html` — só a marcação e a lista de scripts (ORDEM IMPORTA: cada arquivo usa o que os anteriores declararam).
- `css/style.css` — estilos (a ordem das regras importa, é uma cascata).
- `js/` — scripts clássicos no escopo global (os `onclick="..."` do HTML chamam funções globais):
  `config` · `core` (estado, utilitários) · `data` (tabelas do livro) · `rules` (cálculos) · `ui` (roteador R, gestos) · `views` (telas) · `account` (login e sincronização) · `main.js` (inicia o app).
- `supabase.sql` — tabelas + RLS (cada usuário só acessa as próprias linhas).
- `tests/` — `npm test` (ou `node tests/run.js`). Sem dependências.

## Como mexer
1. Estado global `S` (salvo em `localStorage` chave `op` e, com login, sincronizado no Supabase). Telas por `S.v`; `R()` redesenha.
2. Novo arquivo JS: adicione o `<script>` no `index.html` na posição certa (depois do que ele usa).
3. Depois de qualquer mudança: `npm test`. Se a mudança de comportamento for INTENCIONAL, rode `npm run test:update` e comite o `tests/snapshot.json` junto.
4. Commits no padrão Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`).
5. Nunca coloque a *secret/service_role key* do Supabase no código. A chave "publishable" em `js/config.js` é pública por design.

## Decisões de regra do projeto (definidas pelo Mestre/usuário)
- Atrasar ação (iniciativa): por rodada, limite = 10 + bônus de Iniciativa; iniciativa mínima 1; o limite volta a cada rodada. A tela mostra só o número (dado + bônus).
- Empate de iniciativa: maior bônus age primeiro.
- Poderes que o usuário pediu para NÃO alterar (deixar como estão): Combate Defensivo, Saque Rápido, Conhecimento Aplicado, Hacker, Primeira Impressão, Camuflar Ocultismo, Envolto em Mistério, Fluxo de Poder, Intuição Paranormal, Improvisar Componentes; Especialista em Elemento só tem o card de escolha do elemento.
- Custo de PE nunca fica negativo (Ritual Predileto, Lâmina Maldita).
- Fundo escuro do tema: `#121212`.

## Pendências conhecidas
Monstruário, Escudo do Mestre, Criador de Cenas; DT +2 do Especialista em Elemento; excluir conta pelo app; compartilhar fichas/campanhas entre contas.

## Limites dos testes
Simulam navegador e servidor (Supabase falso). Não cobrem aparência visual nem o Supabase real: depois de publicar, teste o login uma vez de verdade.
