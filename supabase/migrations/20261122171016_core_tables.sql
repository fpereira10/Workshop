-- Bounce · 2/7 · tabelas do estágio 1: tracks, profiles, ideas, sessions.
-- (Reconstruída do catálogo de produção. Ver aviso na migration 1.)
--
-- Chaves compostas (id, user_id): garantem que uma ideia, sessão ou foco só aponte
-- para uma faixa do MESMO usuário, mesmo se uma policy falhar.

create table public.tracks (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  bpm smallint not null,
  musical_key text,
  energy public.energy not null default 'hipnotica',
  status public.track_status not null default 'ideia',
  next_step text,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tracks_pkey primary key (id),
  constraint tracks_id_user_id_key unique (id, user_id),
  constraint tracks_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint tracks_name_check check (char_length(btrim(name)) >= 1 and char_length(btrim(name)) <= 80 and char_length(name) <= 80),
  constraint tracks_bpm_check check (bpm >= 40 and bpm <= 220),
  constraint tracks_musical_key_check check (musical_key is null or char_length(musical_key) <= 40),
  constraint tracks_next_step_check check (next_step is null or char_length(next_step) <= 280)
);

create table public.profiles (
  id uuid not null,
  display_name text not null,
  focus_track_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade,
  constraint profiles_focus_track_fkey foreign key (focus_track_id, id)
    references public.tracks (id, user_id) on delete set null (focus_track_id),
  constraint profiles_display_name_check check (char_length(btrim(display_name)) >= 1 and char_length(btrim(display_name)) <= 60 and char_length(display_name) <= 60)
);

create table public.ideas (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  track_id uuid,
  type public.idea_type not null,
  title text not null,
  body text,
  duration_sec integer,
  audio_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ideas_pkey primary key (id),
  constraint ideas_id_user_id_key unique (id, user_id),
  constraint ideas_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint ideas_track_fkey foreign key (track_id, user_id)
    references public.tracks (id, user_id) on delete set null (track_id),
  constraint ideas_title_check check (char_length(btrim(title)) >= 1 and char_length(btrim(title)) <= 120 and char_length(title) <= 120),
  constraint ideas_duration_sec_check check (duration_sec is null or duration_sec > 0),
  constraint ideas_memo_duration_check check (type <> 'memo' or duration_sec is not null),
  -- o áudio mora na pasta do próprio usuário: <user_id>/...
  constraint ideas_check check (audio_path is null or audio_path like user_id::text || '/%')
);

create table public.sessions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  day date not null,
  track_id uuid,
  source public.session_source not null default 'auto',
  created_at timestamptz not null default now(),
  constraint sessions_pkey primary key (id),
  constraint sessions_user_id_day_key unique (user_id, day),
  constraint sessions_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint sessions_track_fkey foreign key (track_id, user_id)
    references public.tracks (id, user_id) on delete set null (track_id)
);

-- Índices de consulta frequente
create index tracks_user_id_last_activity_at_idx on public.tracks (user_id, last_activity_at desc);
create index tracks_user_id_status_idx on public.tracks (user_id, status);
create index ideas_user_id_track_id_created_at_idx on public.ideas (user_id, track_id, created_at desc);
create index ideas_inbox_idx on public.ideas (user_id, created_at desc) where track_id is null;
