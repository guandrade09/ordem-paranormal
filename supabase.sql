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
