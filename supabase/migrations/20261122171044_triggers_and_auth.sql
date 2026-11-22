-- Bounce · 4/7 · funções, triggers e criação automática de perfil.
-- (Reconstruída do catálogo de produção. Ver aviso na migration 1.)

-- Atividade da faixa: editar a faixa renova last_activity_at (base do rótulo "esfriando").
create function public.tracks_before_update()
returns trigger
language plpgsql
set search_path to ''
as $$
begin
  new.updated_at := now();
  if new.last_activity_at is not distinct from old.last_activity_at then
    new.last_activity_at := now();
  end if;
  return new;
end;
$$;

-- Ligar uma ideia a uma faixa também conta como atividade dela.
create function public.touch_track_from_idea()
returns trigger
language plpgsql
set search_path to ''
as $$
declare
  ts timestamptz := case when tg_op = 'INSERT' then new.created_at else now() end;
begin
  if new.track_id is not null
     and (tg_op = 'INSERT' or new.track_id is distinct from old.track_id) then
    update public.tracks t
       set last_activity_at = ts
     where t.id = new.track_id
       and t.user_id = new.user_id
       and t.last_activity_at < ts;
  end if;
  return null;
end;
$$;

-- Sugestão: pendente zera resolved_at; aceita/descartada carimba a data da decisão.
create function public.suggestions_before_write()
returns trigger
language plpgsql
set search_path to ''
as $$
begin
  if tg_op = 'UPDATE' then
    new.updated_at := now();
  end if;
  if new.state = 'pendente' then
    new.resolved_at := null;
  elsif new.resolved_at is null
        or (tg_op = 'UPDATE' and new.state is distinct from old.state) then
    new.resolved_at := now();
  end if;
  return new;
end;
$$;

-- Perfil automático no cadastro. SECURITY DEFINER porque roda em auth.users.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(
      coalesce(
        nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
        nullif(btrim(split_part(coalesce(new.email, ''), '@', 1)), ''),
        'Produtor'
      ),
      60
    )
  );
  return new;
end;
$$;

create trigger tracks_before_update before update on public.tracks
  for each row execute function public.tracks_before_update();
create trigger ideas_touch_track after insert or update of track_id on public.ideas
  for each row execute function public.touch_track_from_idea();
create trigger suggestions_before_write before insert or update on public.suggestions
  for each row execute function public.suggestions_before_write();

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger ideas_set_updated_at before update on public.ideas
  for each row execute function public.set_updated_at();
create trigger melodies_set_updated_at before update on public.melodies
  for each row execute function public.set_updated_at();
create trigger transcriptions_set_updated_at before update on public.transcriptions
  for each row execute function public.set_updated_at();

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
