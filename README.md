# Ordem Paranormal RPG — app com contas

Site estático (HTML + CSS + JS puro, sem build) + banco/login no **Supabase** (grátis) + hospedagem no **GitHub Pages** (grátis).

## Como funciona a segurança
- Login por e-mail e senha feito pelo Supabase Auth (senha guardada com hash, nunca no seu código).
- Ao entrar, o servidor entrega um **JWT** (token assinado) que o app envia em toda requisição e renova sozinho.
- O banco usa **RLS**: o servidor só deixa cada pessoa ler/gravar as linhas cujo `user_id` é o dela (`supabase.sql`). Mesmo que alguém mexa no código do site, não consegue acessar a conta de outra pessoa.
- A chave que vai em `js/config.js` é a **publishable** (antiga anon): ela é feita para ficar pública. **Nunca** coloque a *secret key* (antiga `service_role`) no site.
- Textos da tela de login são escapados (anti-XSS); senha mínima de 8 caracteres.

## Passo a passo (uns 15 minutos)

### 1. Criar o projeto no Supabase
1. Entre em https://supabase.com → **New project** (anote a senha do banco; escolha a região mais próxima, ex.: São Paulo).
2. Menu **SQL Editor → New query**, cole o conteúdo de `supabase.sql` e clique **Run**.
3. Clique no botão **Connect** (topo da página do projeto): ali aparecem a **Project URL** (`https://xxxx.supabase.co`) e a **Publishable key** (`sb_publishable_...`). A Project URL também fica em **Project Settings → Data API**, e a chave em **Project Settings → API Keys**. A *Publishable key* é a versão nova da antiga chave "anon" e serve igual.

### 2. Colocar as chaves no app
Abra `js/config.js` e preencha:

    const CFG = { url: 'https://SEU-PROJETO.supabase.co', key: 'sb_publishable_...' }

### 3. Publicar no GitHub Pages
1. https://github.com → **New repository** (ex.: `ordem-paranormal`, público).
2. Envie todo o conteúdo desta pasta (`index.html`, `css/`, `js/`, `tests/` etc.) — de preferência com `git push`.
3. **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, pasta `/ (root)` → Save.
4. Em ~1 minuto o site fica em `https://SEU-USUARIO.github.io/ordem-paranormal/`.

### 4. Ligar o login ao endereço do site
No Supabase: **Authentication → URL Configuration**
- **Site URL**: `https://SEU-USUARIO.github.io/ordem-paranormal/`
- **Redirect URLs**: adicione a mesma URL (é para onde voltam os links de confirmar e-mail e de recuperar senha).

### 5. E-mails
- **Authentication → Providers → Email**: deixe "Confirm email" ligado para exigir confirmação (recomendado).
- O e-mail padrão do Supabase tem limite baixo (poucos e-mails por hora). Para uso real, configure um SMTP próprio em **Authentication → SMTP Settings** (Resend, Brevo, etc. têm plano grátis).
- Em **Authentication → Policies** você pode subir o mínimo de senha para 8+ e ligar a proteção contra senhas vazadas.
- Dica: personalize os textos em **Authentication → Email Templates** (em português).

## Estrutura do projeto

    index.html            marcação + lista de scripts (a ordem importa)
    css/style.css         estilos
    js/config.js          URL e chave pública do Supabase
    js/core/              estado, persistência e utilitários
    js/data/              tabelas do livro (classes, origens, rituais, itens, poderes...)
    js/rules/             cálculos (defesa, ataques, equipamento, habilidades...)
    js/ui/                roteador de telas e gestos
    js/views/             telas (ficha, criação, rituais, inventário, Mestre...)
    js/account/           login, sessão (JWT) e sincronização com o banco
    js/main.js            inicialização
    supabase.sql          tabelas e regras de segurança (RLS)
    tests/                testes automáticos

## Testes

    npm test          # ou: node tests/run.js  (não precisa instalar nada, só o Node 18+)

- `smoke.test.js`: abre o app, desenha todas as telas, monta fichas de exemplo e compara cálculos e telas com `tests/snapshot.json`. Se algo mudar ou quebrar, falha e mostra o que diferiu.
- `account.test.js`: login, cadastro, recuperação de senha, "manter-me logado", sincronização e isolamento entre usuários (com um Supabase falso).
- Mudou algo de propósito? `npm run test:update` regrava o snapshot (comite junto).

## O que é salvo na conta
- `characters`: cada ficha (e NPC) numa linha.
- `user_state`: tema e o combate do Mestre.
Sincroniza sozinho ~1 s depois de qualquer alteração; o botão **Sincronizar agora** fica em Configurações → Conta.

## Ainda não incluído
Excluir a própria conta pelo app, login com Google/Discord, compartilhar fichas/campanhas entre contas (a tabela já está pronta para isso ser adicionado depois).
