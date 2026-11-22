-- Bounce · 1/7 · tipos enumerados e função auxiliar.
--
-- ATENÇÃO: reconstruída a partir do catálogo do banco de produção (projeto Workshop),
-- não é o arquivo original. O banco já tem estas 7 migrations aplicadas.
-- Serve para recriar o schema do zero (supabase db reset / novo projeto).
-- Não reaplique em produção.

create type public.energy as enum ('calma', 'melancolica', 'hipnotica', 'intensa', 'solar');
create type public.track_status as enum ('ideia', 'arranjo', 'mix', 'master', 'pronta');
create type public.idea_type as enum ('memo', 'nota');
create type public.session_source as enum ('auto', 'manual');
create type public.suggestion_state as enum ('pendente', 'aceita', 'descartada');

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path to ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
