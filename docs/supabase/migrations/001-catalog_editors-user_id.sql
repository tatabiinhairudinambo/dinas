-- ===========================================================================
-- 001-catalog_editors-user_id.sql — catalog_editors: email -> user_id (uuid)
-- Jalankan di Supabase SQL Editor (lokal klien tidak perlu). Aman diulang
-- (idempotent).
-- ===========================================================================

-- Isi user_id dari email masing-masing baris lama (idempotent; hanya baris
-- yang belum punya user_id, dan hanya kalau akun masih ada di auth.users).
do $$
begin
  if exists (
    select 1 from pg_attribute
    where attrelid = 'public.catalog_editors'::regclass
      and attname = 'email'
      and not attisdropped
  ) then
    update public.catalog_editors
    set user_id = u.id
    from auth.users u
    where public.catalog_editors.user_id is null
      and lower(u.email) = lower(public.catalog_editors.email);
    -- Hapus baris tanpa user_id (editor tidak ditemukan — termasuk seed
    -- placeholder 'operator@contoh.id').
    delete from public.catalog_editors where user_id is null;
  end if;
end $$;

alter table public.catalog_editors add column if not exists user_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.catalog_editors'::regclass
      and conname = 'catalog_editors_user_id_pkey'
      and contype = 'p'
  ) then
    alter table public.catalog_editors add primary key (user_id);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.catalog_editors'::regclass
      and conname = 'catalog_editors_user_id_fkey'
      and contype = 'f'
  ) then
    alter table public.catalog_editors
      add constraint catalog_editors_user_id_fkey
      foreign key (user_id) references auth.users (id)
      on delete cascade;
  end if;
end $$;

alter table public.catalog_editors alter column user_id set not null;
alter table public.catalog_editors drop column if exists email;

-- is_catalog_editor(): memakai user_id = auth.uid().
create or replace function public.is_catalog_editor()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.catalog_editors
    where user_id = auth.uid()
  );
$$;

-- Editor hanya bisa melihat barisnya sendiri.
drop policy if exists "editor baca sendiri" on public.catalog_editors;
create policy "editor baca sendiri"
  on public.catalog_editors for select to authenticated
  using (user_id = auth.uid());

alter table public.catalog_editors enable row level security;

-- Tambah editor baru (MANUAL — jangan disertakan di migrasi, lihat
-- docs/DEPLOYMENT.md untuk perintah dengan UUID).
-- insert into public.catalog_editors (user_id, note)
--   values ('<uuid auth.users editor>', 'operator CMS');
