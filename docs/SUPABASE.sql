-- ===========================================================================
-- Web Kedinasan — skema Supabase untuk mode dual (snapshot per user)
-- Jalankan di Supabase SQL Editor. Aman diulang.
-- ===========================================================================

create table if not exists public.app_snapshots (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

comment on table public.app_snapshots is
  'Snapshot state localStorage (key kedinasan_v2) per user. Kunci akun tidak pernah dikirim klien.';

alter table public.app_snapshots enable row level security;

-- Setiap user hanya bisa menyentuh barisnya sendiri.
drop policy if exists "snapshot baca sendiri" on public.app_snapshots;
create policy "snapshot baca sendiri"
  on public.app_snapshots for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "snapshot buat sendiri" on public.app_snapshots;
create policy "snapshot buat sendiri"
  on public.app_snapshots for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "snapshot ubah sendiri" on public.app_snapshots;
create policy "snapshot ubah sendiri"
  on public.app_snapshots for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.app_snapshots to authenticated;

-- Supaya tabel ikut terhapus saat user dihapus dari Auth:
-- (foreign key di atas sudah on delete cascade)

-- ===========================================================================
-- OPSIONAL: menandai akun sebagai operator panel /cms
-- Panel membaca klaim role dari session (window.HermesSync.role()); selama
-- belum ada akun operator, gerbang kunci lokal yang dipakai.
-- Jalankan lewat SQL Editor / service_role — jangan dari browser.
-- ===========================================================================
-- update auth.users
--    set raw_app_meta_data =
--        coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"operator"}'::jsonb
--  where email = 'operator@contoh.id';
--
-- Setelah itu akun harus login ulang (atau refresh token) supaya klaim baru
-- ikut ke JWT. Periksa:
--   select email, raw_app_meta_data from auth.users where email = 'operator@contoh.id';
--
-- Catatan: ini hanya menyembunyikan gerbang di klien. Pembatasan tulis yang
-- sebenarnya tetap di RLS — selama semua user boleh menulis snapshot-nya
-- sendiri, akun biasa masih bisa mengubah data lewat devtools. Kalau panel
-- harus benar-benar eksklusif, pakai tabel peran + policy:
--
--   create table if not exists public.profiles (
--     user_id uuid primary key references auth.users (id) on delete cascade,
--     role    text not null default 'student',
--     name    text
--   );
--   alter table public.profiles enable row level security;
--   create or replace function public.is_operator()
--     returns boolean language sql stable security definer set search_path = public as $$
--       select exists (select 1 from public.profiles p
--                      where p.user_id = auth.uid() and p.role = 'operator');
--     $$;
--   -- lalu tambahkan `and public.is_operator()` pada policy tulis app_snapshots
--   -- yang menyentuh data bersama (paket/soal), dan isi profiles.role manual.

-- ===========================================================================
-- 6. Storage aset (gambar CMS)
-- Bucket publik-baca, tulis hanya user login, limit 2 MB, hanya PNG/JPEG/WebP.
-- Kalau gagal upload dengan pesan "new row violates row-level security",
-- berarti policy belum ada / user belum login.
-- ===========================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('assets', 'assets', true, 2097152, array['image/png','image/jpeg','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "assets baca publik" on storage.objects;
create policy "assets baca publik"
  on storage.objects for select to public
  using (bucket_id = 'assets');

drop policy if exists "assets unggah login" on storage.objects;
create policy "assets unggah login"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'assets' and public.is_catalog_editor());

drop policy if exists "assets ubah login" on storage.objects;
create policy "assets ubah login"
  on storage.objects for update to authenticated
  using (bucket_id = 'assets') with check (bucket_id = 'assets');

drop policy if exists "assets hapus login" on storage.objects;
create policy "assets hapus login"
  on storage.objects for delete to authenticated
  using (bucket_id = 'assets');

-- ===========================================================================
-- 7. Katalog bersama (produk/paket/tampilan untuk semua akun siswa)
--    Satu baris (id = 1) berisi potongan state: packages, banner, logo,
--    pay/payAcc, promos, groups. Siswa membacanya saat login/boot sehingga
--    produk + gambar yang dibuat operator muncul di akun mereka.
--    Hanya email di catalog_editors yang boleh menulis.
-- ===========================================================================
create table if not exists public.catalog (
  id          smallint primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

create table if not exists public.catalog_editors (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  note        text,
  created_at  timestamptz not null default now()
);

alter table public.catalog enable row level security;
alter table public.catalog_editors enable row level security;

-- updated_at selalu waktu server, supaya perbandingan "katalog lebih baru"
-- tidak terpengaruh jam perangkat operator.
create or replace function public.touch_catalog()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists catalog_touch on public.catalog;
create trigger catalog_touch
  before insert or update on public.catalog
  for each row execute function public.touch_catalog();

create or replace function public.is_catalog_editor()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.catalog_editors
    where user_id = auth.uid()
  );
$$;
revoke all on function public.is_catalog_editor() from anon;
grant execute on function public.is_catalog_editor() to authenticated;

drop policy if exists "katalog baca login" on public.catalog;
create policy "katalog baca login"
  on public.catalog for select to authenticated using (true);

drop policy if exists "katalog tulis editor" on public.catalog;
create policy "katalog tulis editor"
  on public.catalog for all to authenticated
  using (public.is_catalog_editor())
  with check (public.is_catalog_editor());

-- Editor hanya bisa melihat barisnya sendiri (user_id = auth.uid()).
drop policy if exists "editor baca sendiri" on public.catalog_editors;
create policy "editor baca sendiri"
  on public.catalog_editors for select to authenticated
  using (user_id = auth.uid());

-- Daftar editor baru (MANUAL — via SQL Editor lewat layanan Supabase):
-- insert into public.catalog_editors (user_id, note)
--   values ('<uuid auth.users editor>', 'operator CMS');
