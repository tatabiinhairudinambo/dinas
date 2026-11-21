-- ===========================================================================
-- 002-assets-editor-only.sql — bucket "assets": hanya editor (by user_id)
-- Jalankan di Supabase SQL Editor. Aman diulang (drop policy idempoten).
-- ===========================================================================

drop policy if exists "assets unggah login" on storage.objects;
create policy "assets unggah login"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'assets' and public.is_catalog_editor());
