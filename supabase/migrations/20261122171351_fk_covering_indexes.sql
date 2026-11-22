-- Bounce · 7/7 · índices que cobrem as chaves estrangeiras compostas.
-- (Reconstruída do catálogo de produção. Ver aviso na migration 1.)
--
-- Sem eles, apagar uma faixa ou ideia varre a tabela filha inteira.
-- Parciais (where ... is not null) quando a coluna aceita nulo.

create index ideas_track_id_user_id_idx on public.ideas (track_id, user_id)
  where track_id is not null;
create index melodies_track_id_user_id_idx on public.melodies (track_id, user_id)
  where track_id is not null;
create index sessions_track_id_user_id_idx on public.sessions (track_id, user_id)
  where track_id is not null;
create index suggestions_source_idea_id_user_id_idx on public.suggestions (source_idea_id, user_id)
  where source_idea_id is not null;
create index suggestions_track_id_user_id_idx on public.suggestions (track_id, user_id);
create index transcriptions_idea_id_user_id_idx on public.transcriptions (idea_id, user_id);
create index profiles_focus_track_id_id_idx on public.profiles (focus_track_id, id);
