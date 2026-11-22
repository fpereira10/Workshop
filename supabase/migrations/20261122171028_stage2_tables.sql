-- Bounce · 3/7 · tabelas do estágio 2 (plus): melodies, transcriptions, suggestions.
-- (Reconstruída do catálogo de produção. Ver aviso na migration 1.)

create table public.melodies (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  track_id uuid,
  title text not null,
  audio_path text not null,
  notes jsonb not null default '[]'::jsonb,
  bpm smallint not null,
  transpose smallint not null default 0,
  quantize text not null default 'off',
  midi_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint melodies_pkey primary key (id),
  constraint melodies_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint melodies_track_fkey foreign key (track_id, user_id)
    references public.tracks (id, user_id) on delete set null (track_id),
  constraint melodies_title_check check (char_length(btrim(title)) >= 1 and char_length(btrim(title)) <= 120 and char_length(title) <= 120),
  constraint melodies_bpm_check check (bpm >= 40 and bpm <= 220),
  constraint melodies_notes_check check (jsonb_typeof(notes) = 'array'),
  constraint melodies_transpose_check check (transpose >= -24 and transpose <= 24),
  constraint melodies_quantize_check check (quantize = any (array['off', '1/8', '1/16'])),
  constraint melodies_check check (audio_path like user_id::text || '/%'),
  constraint melodies_check1 check (midi_path is null or midi_path like user_id::text || '/%')
);

create table public.transcriptions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  idea_id uuid not null,
  text text not null,
  edited boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transcriptions_pkey primary key (id),
  constraint transcriptions_idea_id_key unique (idea_id),
  constraint transcriptions_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint transcriptions_idea_fkey foreign key (idea_id, user_id)
    references public.ideas (id, user_id) on delete cascade
);

create table public.suggestions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  track_id uuid not null,
  source_idea_id uuid,
  text text not null,
  state public.suggestion_state not null default 'pendente',
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint suggestions_pkey primary key (id),
  constraint suggestions_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint suggestions_track_fkey foreign key (track_id, user_id)
    references public.tracks (id, user_id) on delete cascade,
  constraint suggestions_source_idea_fkey foreign key (source_idea_id, user_id)
    references public.ideas (id, user_id) on delete set null (source_idea_id),
  constraint suggestions_text_check check (char_length(btrim(text)) >= 1)
);

create index melodies_user_id_track_id_created_at_idx on public.melodies (user_id, track_id, created_at desc);
create index transcriptions_user_id_idea_id_idx on public.transcriptions (user_id, idea_id);
create index suggestions_user_id_track_id_state_idx on public.suggestions (user_id, track_id, state);
