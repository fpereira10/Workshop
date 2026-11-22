-- Bounce · 6/7 · buckets privados de áudio (memos e melodias) e policies por pasta.
-- (Reconstruída do catálogo de produção. Ver aviso na migration 1.)
--
-- Convenção de caminho: <user_id>/<arquivo>. A policy compara a 1ª pasta com auth.uid().
-- Os CHECKs de ideas/melodies exigem o mesmo prefixo no audio_path.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('memos',    'memos',    false, 26214400, array['audio/*']),
  ('melodies', 'melodies', false, 26214400, array['audio/*', 'application/x-midi'])
on conflict (id) do nothing;

create policy bounce_audio_select_own on storage.objects for select to authenticated
  using (
    bucket_id = any (array['memos', 'melodies'])
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy bounce_audio_insert_own on storage.objects for insert to authenticated
  with check (
    bucket_id = any (array['memos', 'melodies'])
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy bounce_audio_update_own on storage.objects for update to authenticated
  using (
    bucket_id = any (array['memos', 'melodies'])
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = any (array['memos', 'melodies'])
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy bounce_audio_delete_own on storage.objects for delete to authenticated
  using (
    bucket_id = any (array['memos', 'melodies'])
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
