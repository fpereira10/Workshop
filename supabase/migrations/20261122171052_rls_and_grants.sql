-- Bounce · 5/7 · RLS, policies e permissões (privilégio mínimo).
-- (Reconstruída do catálogo de produção. Ver aviso na migration 1.)
--
-- Modelo: cada pessoa só enxerga e altera o que é dela (auth.uid() = user_id).
-- `anon` não tem acesso a nenhuma tabela. O perfil é criado só pelo trigger de cadastro.

alter table public.tracks enable row level security;
alter table public.profiles enable row level security;
alter table public.ideas enable row level security;
alter table public.sessions enable row level security;
alter table public.melodies enable row level security;
alter table public.transcriptions enable row level security;
alter table public.suggestions enable row level security;

-- ── Grants ─────────────────────────────────────────────────────────
revoke all on public.tracks, public.profiles, public.ideas, public.sessions,
              public.melodies, public.transcriptions, public.suggestions
  from anon, authenticated;

grant select, insert, update, delete on
  public.tracks, public.ideas, public.sessions,
  public.melodies, public.transcriptions, public.suggestions
  to authenticated;

-- Perfil: leitura total; só nome e faixa em foco podem ser editados.
grant select on public.profiles to authenticated;
grant update (display_name, focus_track_id) on public.profiles to authenticated;

-- As funções de trigger não são chamáveis pela API.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.suggestions_before_write() from public, anon, authenticated;
revoke all on function public.touch_track_from_idea() from public, anon, authenticated;
revoke all on function public.tracks_before_update() from public, anon, authenticated;

-- ── Policies ─────────────────────────────────────────────────────────
-- (select auth.uid()) evita reavaliar a função a cada linha.

-- tracks
create policy tracks_select_own on public.tracks for select to authenticated
  using ((select auth.uid()) = user_id);
create policy tracks_insert_own on public.tracks for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy tracks_update_own on public.tracks for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy tracks_delete_own on public.tracks for delete to authenticated
  using ((select auth.uid()) = user_id);

-- profiles (sem insert/delete: o perfil nasce e morre com a conta)
create policy profiles_select_own on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- ideas
create policy ideas_select_own on public.ideas for select to authenticated
  using ((select auth.uid()) = user_id);
create policy ideas_insert_own on public.ideas for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy ideas_update_own on public.ideas for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy ideas_delete_own on public.ideas for delete to authenticated
  using ((select auth.uid()) = user_id);

-- sessions
create policy sessions_select_own on public.sessions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy sessions_insert_own on public.sessions for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy sessions_update_own on public.sessions for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy sessions_delete_own on public.sessions for delete to authenticated
  using ((select auth.uid()) = user_id);

-- melodies
create policy melodies_select_own on public.melodies for select to authenticated
  using ((select auth.uid()) = user_id);
create policy melodies_insert_own on public.melodies for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy melodies_update_own on public.melodies for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy melodies_delete_own on public.melodies for delete to authenticated
  using ((select auth.uid()) = user_id);

-- transcriptions
create policy transcriptions_select_own on public.transcriptions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy transcriptions_insert_own on public.transcriptions for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy transcriptions_update_own on public.transcriptions for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy transcriptions_delete_own on public.transcriptions for delete to authenticated
  using ((select auth.uid()) = user_id);

-- suggestions
create policy suggestions_select_own on public.suggestions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy suggestions_insert_own on public.suggestions for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy suggestions_update_own on public.suggestions for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy suggestions_delete_own on public.suggestions for delete to authenticated
  using ((select auth.uid()) = user_id);
