-- Ordem Paranormal — banco de dados (Supabase / Postgres)
-- Cole tudo isto em: Supabase → SQL Editor → New query → Run.
-- Segurança: RLS (Row Level Security) ligada. Cada pessoa só enxerga e altera as PRÓPRIAS linhas,
-- verificado pelo servidor a partir do JWT do login (auth.uid()).

create table if not exists public.characters (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  cid        text        not null,                       -- id da ficha dentro do app
  data       jsonb       not null,                       -- ficha completa
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, cid),
  constraint characters_cid_len  check (char_length(cid) between 1 and 64),
  constraint characters_data_obj check (jsonb_typeof(data) = 'object'),
  constraint characters_size     check (octet_length(data::text) < 1000000)
);

create table if not exists public.user_state (
  user_id    uuid        primary key references auth.users(id) on delete cascade,
  data       jsonb       not null default '{}'::jsonb,   -- tema, combate do mestre etc.
  updated_at timestamptz not null default now(),
  constraint user_state_data_obj check (jsonb_typeof(data) = 'object'),
  constraint user_state_size     check (octet_length(data::text) < 1000000)
);

alter table public.characters enable row level security;
alter table public.user_state enable row level security;

-- characters: só o dono
drop policy if exists characters_select_own on public.characters;
drop policy if exists characters_insert_own on public.characters;
drop policy if exists characters_update_own on public.characters;
drop policy if exists characters_delete_own on public.characters;
create policy characters_select_own on public.characters for select to authenticated using ((select auth.uid()) = user_id);
create policy characters_insert_own on public.characters for insert to authenticated with check ((select auth.uid()) = user_id);
create policy characters_update_own on public.characters for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy characters_delete_own on public.characters for delete to authenticated using ((select auth.uid()) = user_id);

-- user_state: só o dono
drop policy if exists user_state_select_own on public.user_state;
drop policy if exists user_state_insert_own on public.user_state;
drop policy if exists user_state_update_own on public.user_state;
drop policy if exists user_state_delete_own on public.user_state;
create policy user_state_select_own on public.user_state for select to authenticated using ((select auth.uid()) = user_id);
create policy user_state_insert_own on public.user_state for insert to authenticated with check ((select auth.uid()) = user_id);
create policy user_state_update_own on public.user_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy user_state_delete_own on public.user_state for delete to authenticated using ((select auth.uid()) = user_id);

-- visitantes (sem login) não têm acesso nenhum
revoke all on public.characters from anon;
revoke all on public.user_state  from anon;
grant select, insert, update, delete on public.characters to authenticated;
grant select, insert, update, delete on public.user_state  to authenticated;

-- updated_at automático
create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists characters_touch on public.characters;
create trigger characters_touch before update on public.characters for each row execute function public.touch_updated_at();
drop trigger if exists user_state_touch on public.user_state;
create trigger user_state_touch before update on public.user_state for each row execute function public.touch_updated_at();

-- limite de fichas por conta (evita abuso)
create or replace function public.limit_characters() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (select count(*) from public.characters where user_id = new.user_id) >= 300 then
    raise exception 'Limite de 300 fichas por conta';
  end if;
  return new;
end $$;

drop trigger if exists characters_limit on public.characters;
create trigger characters_limit before insert on public.characters for each row execute function public.limit_characters();


-- =====================================================================================
-- CAMPANHAS (v0.26.0) — rode este bloco no SQL Editor DEPOIS do bloco acima (pode rodar de novo sem problema).
-- Mestre cria a campanha (nome, descrição, missões, homebrew). Jogadores entram com CÓDIGO de 6 dígitos + SENHA
-- e recebem só: nome, descrição e homebrew (nunca missões, nunca monstros).
-- Segurança: as tabelas ficam FECHADAS (RLS ligada e sem nenhuma política); tudo passa por funções (RPC) que
-- checam auth.uid() no servidor. A senha é guardada só como hash (bcrypt) e ninguém consegue ler o hash.
-- =====================================================================================
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.campaigns (
  id         uuid        primary key default gen_random_uuid(),
  owner      uuid        not null references auth.users(id) on delete cascade,
  name       text        not null,
  descr      text        not null default '',
  code       text        not null unique,                 -- 6 dígitos
  pass_hash  text        not null,
  missions   jsonb       not null default '[]'::jsonb,    -- só o Mestre enxerga
  homebrew   jsonb       not null default '{}'::jsonb,    -- rit, hab, pod, mal, mel, eqp (monstros NÃO existem aqui)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaigns_name_len  check (char_length(name) between 1 and 80),
  constraint campaigns_descr_len check (char_length(descr) <= 4000),
  constraint campaigns_code_fmt  check (code ~ '^[0-9]{6}$'),
  constraint campaigns_missions_arr check (jsonb_typeof(missions) = 'array'),
  constraint campaigns_homebrew_obj check (jsonb_typeof(homebrew) = 'object'),
  constraint campaigns_size check (octet_length(missions::text) + octet_length(homebrew::text) < 600000)
);

create table if not exists public.campaign_members (
  campaign_id uuid        not null references public.campaigns(id) on delete cascade,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (campaign_id, user_id)
);

create table if not exists public.campaign_attempts (      -- freio contra adivinhar código/senha
  user_id uuid        not null references auth.users(id) on delete cascade,
  at      timestamptz not null default now()
);
create index if not exists campaign_attempts_idx on public.campaign_attempts (user_id, at);

alter table public.campaigns         enable row level security;
alter table public.campaign_members  enable row level security;
alter table public.campaign_attempts enable row level security;
-- (sem políticas = ninguém acessa direto; só as funções abaixo, que rodam como "security definer")
revoke all on public.campaigns         from anon, authenticated;
revoke all on public.campaign_members  from anon, authenticated;
revoke all on public.campaign_attempts from anon, authenticated;

drop trigger if exists campaigns_touch on public.campaigns;
create trigger campaigns_touch before update on public.campaigns for each row execute function public.touch_updated_at();

-- cria campanha (devolve id e código)
create or replace function public.camp_create(p_name text, p_descr text, p_pass text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare u uuid := auth.uid(); v_code text; v_id uuid; n int := 0;
begin
  if u is null then raise exception 'Faça login.'; end if;
  if char_length(coalesce(p_pass,'')) < 4 then raise exception 'A senha da campanha precisa de pelo menos 4 caracteres.'; end if;
  if (select count(*) from public.campaigns where owner = u) >= 20 then raise exception 'Limite de 20 campanhas por conta.'; end if;
  loop
    v_code := lpad((floor(random() * 1000000))::int::text, 6, '0');
    exit when not exists (select 1 from public.campaigns where code = v_code);
    n := n + 1; if n > 50 then raise exception 'Tente de novo.'; end if;
  end loop;
  insert into public.campaigns (owner, name, descr, code, pass_hash)
  values (u, left(coalesce(nullif(trim(p_name),''),'Campanha'), 80), left(coalesce(p_descr,''), 4000), v_code,
          extensions.crypt(p_pass, extensions.gen_salt('bf')))
  returning id into v_id;
  return jsonb_build_object('id', v_id, 'code', v_code);
end $$;

-- minhas campanhas (como Mestre e como jogador). Missões e código só vão para o Mestre.
create or replace function public.camp_mine() returns jsonb
language plpgsql security definer stable set search_path = '' as $$
declare u uuid := auth.uid(); r jsonb;
begin
  if u is null then raise exception 'Faça login.'; end if;
  select coalesce(jsonb_agg(x order by x->>'name'), '[]'::jsonb) into r from (
    select jsonb_build_object('id', c.id, 'role', 'owner', 'name', c.name, 'descr', c.descr, 'homebrew', c.homebrew,
             'missions', c.missions, 'code', c.code, 'upd', c.updated_at,
             'members', (select count(*) from public.campaign_members m where m.campaign_id = c.id)) x
      from public.campaigns c where c.owner = u
    union all
    select jsonb_build_object('id', c.id, 'role', 'member', 'name', c.name, 'descr', c.descr, 'homebrew', c.homebrew,
             'upd', c.updated_at)
      from public.campaigns c join public.campaign_members m on m.campaign_id = c.id where m.user_id = u
  ) t;
  return r;
end $$;

-- Mestre salva nome/descrição/missões/homebrew
create or replace function public.camp_update(p_id uuid, p_name text, p_descr text, p_missions jsonb, p_homebrew jsonb) returns timestamptz
language plpgsql security definer set search_path = '' as $$
declare t timestamptz;
begin
  update public.campaigns set name = left(coalesce(nullif(trim(p_name),''),'Campanha'), 80), descr = left(coalesce(p_descr,''), 4000),
         missions = coalesce(p_missions, '[]'::jsonb), homebrew = coalesce(p_homebrew, '{}'::jsonb)
   where id = p_id and owner = auth.uid() returning updated_at into t;
  if t is null then raise exception 'Campanha não encontrada.'; end if;
  return t;
end $$;

-- Mestre troca a senha
create or replace function public.camp_setpass(p_id uuid, p_pass text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if char_length(coalesce(p_pass,'')) < 4 then raise exception 'A senha da campanha precisa de pelo menos 4 caracteres.'; end if;
  update public.campaigns set pass_hash = extensions.crypt(p_pass, extensions.gen_salt('bf')) where id = p_id and owner = auth.uid();
  if not found then raise exception 'Campanha não encontrada.'; end if;
end $$;

-- jogador entra com código + senha (erro de código e de senha dão a mesma resposta)
create or replace function public.camp_join(p_code text, p_pass text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare u uuid := auth.uid(); c public.campaigns;
begin
  if u is null then raise exception 'Faça login.'; end if;
  delete from public.campaign_attempts where at < now() - interval '1 day';
  if (select count(*) from public.campaign_attempts where user_id = u and at > now() - interval '15 minutes') >= 8 then
    raise exception 'Muitas tentativas. Aguarde alguns minutos.';
  end if;
  select * into c from public.campaigns where code = regexp_replace(coalesce(p_code,''), '\D', '', 'g');
  if not found or c.pass_hash <> extensions.crypt(coalesce(p_pass,''), c.pass_hash) then
    insert into public.campaign_attempts (user_id) values (u);
    return jsonb_build_object('ok', false, 'msg', 'Código ou senha incorretos.');
  end if;
  if c.owner = u then return jsonb_build_object('ok', false, 'msg', 'Você é o Mestre desta campanha.'); end if;
  if (select count(*) from public.campaign_members where campaign_id = c.id) >= 30
     and not exists (select 1 from public.campaign_members where campaign_id = c.id and user_id = u) then
    return jsonb_build_object('ok', false, 'msg', 'Campanha cheia (30 jogadores).');
  end if;
  if (select count(*) from public.campaign_members where user_id = u) >= 50 then
    return jsonb_build_object('ok', false, 'msg', 'Limite de 50 campanhas.');
  end if;
  insert into public.campaign_members (campaign_id, user_id) values (c.id, u) on conflict do nothing;
  return jsonb_build_object('ok', true, 'id', c.id);
end $$;

create or replace function public.camp_leave(p_id uuid) returns void
language sql security definer set search_path = '' as $$
  delete from public.campaign_members where campaign_id = p_id and user_id = auth.uid();
$$;

create or replace function public.camp_delete(p_id uuid) returns void
language sql security definer set search_path = '' as $$
  delete from public.campaigns where id = p_id and owner = auth.uid();
$$;

-- só quem está logado chama as funções
revoke all on function public.camp_create(text,text,text), public.camp_mine(), public.camp_update(uuid,text,text,jsonb,jsonb),
  public.camp_setpass(uuid,text), public.camp_join(text,text), public.camp_leave(uuid), public.camp_delete(uuid) from public, anon;
grant execute on function public.camp_create(text,text,text), public.camp_mine(), public.camp_update(uuid,text,text,jsonb,jsonb),
  public.camp_setpass(uuid,text), public.camp_join(text,text), public.camp_leave(uuid), public.camp_delete(uuid) to authenticated;


-- =====================================================================================
-- FICHAS AO VIVO NA CAMPANHA (v0.26.3) — rode este bloco no SQL Editor DEPOIS do bloco de CAMPANHAS (pode rodar de novo).
-- O jogador que vincula uma ficha à campanha envia uma cópia dela; só o Mestre dessa campanha consegue ler.
-- =====================================================================================
create table if not exists public.campaign_sheets (
  campaign_id uuid        not null references public.campaigns(id) on delete cascade,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  cid         text        not null,
  data        jsonb       not null,
  updated_at  timestamptz not null default now(),
  primary key (campaign_id, user_id, cid),
  constraint campaign_sheets_obj  check (jsonb_typeof(data) = 'object'),
  constraint campaign_sheets_cid  check (char_length(cid) between 1 and 64),
  constraint campaign_sheets_size check (octet_length(data::text) < 400000)
);
alter table public.campaign_sheets enable row level security;
revoke all on public.campaign_sheets from anon, authenticated;

-- jogador (membro) envia/atualiza a cópia da ficha vinculada
create or replace function public.camp_sheet_put(p_camp uuid, p_cid text, p_data jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare u uuid := auth.uid();
begin
  if u is null then raise exception 'Faça login.'; end if;
  if not exists (select 1 from public.campaign_members where campaign_id = p_camp and user_id = u) then
    raise exception 'Você não está nesta campanha.';
  end if;
  if not exists (select 1 from public.campaign_sheets where campaign_id = p_camp and user_id = u and cid = p_cid)
     and (select count(*) from public.campaign_sheets where campaign_id = p_camp and user_id = u) >= 10 then
    raise exception 'Limite de 10 fichas por campanha.';
  end if;
  insert into public.campaign_sheets (campaign_id, user_id, cid, data) values (p_camp, u, p_cid, p_data)
  on conflict (campaign_id, user_id, cid) do update set data = excluded.data, updated_at = now();
end $$;

-- jogador mantém só as fichas que ainda estão vinculadas (as outras somem da campanha)
create or replace function public.camp_sheet_keep(p_camp uuid, p_cids text[]) returns void
language sql security definer set search_path = '' as $$
  delete from public.campaign_sheets
   where campaign_id = p_camp and user_id = auth.uid() and not (cid = any(coalesce(p_cids, '{}'::text[])));
$$;

-- só o Mestre da campanha lê as fichas
create or replace function public.camp_sheets(p_camp uuid) returns jsonb
language plpgsql security definer stable set search_path = '' as $$
declare r jsonb;
begin
  if not exists (select 1 from public.campaigns where id = p_camp and owner = auth.uid()) then
    raise exception 'Campanha não encontrada.';
  end if;
  select coalesce(jsonb_agg(jsonb_build_object('k', left(md5(s.user_id::text), 8), 'cid', s.cid, 'data', s.data, 'upd', s.updated_at)
                            order by s.updated_at desc), '[]'::jsonb)
    into r from public.campaign_sheets s where s.campaign_id = p_camp;
  return r;
end $$;

-- sair da campanha também retira as fichas do jogador
create or replace function public.camp_leave(p_id uuid) returns void
language sql security definer set search_path = '' as $$
  delete from public.campaign_sheets where campaign_id = p_id and user_id = auth.uid();
  delete from public.campaign_members where campaign_id = p_id and user_id = auth.uid();
$$;

revoke all on function public.camp_sheet_put(uuid,text,jsonb), public.camp_sheet_keep(uuid,text[]), public.camp_sheets(uuid),
  public.camp_leave(uuid) from public, anon;
grant execute on function public.camp_sheet_put(uuid,text,jsonb), public.camp_sheet_keep(uuid,text[]), public.camp_sheets(uuid),
  public.camp_leave(uuid) to authenticated;
