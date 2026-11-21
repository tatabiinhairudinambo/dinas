-- ===========================================================================
-- 003-server-authoritative-tables.sql — tabel SERVER (Fase 3A)
-- Source of truth: packages / questions / question_keys / entitlements /
-- attempts / payments. Kunci jawaban + penilaian + kecemaran baru di server.
-- Jalankan di Supabase SQL Editor. Idempotent (create table if not exists).
-- ===========================================================================

-- --- packages: metadata + harga (SESUAI bentuk S.packages engine) ------------
create table if not exists public.packages (
  id          integer primary key,
  name        text not null,
  type        text not null check (type in ('SKD','TWK','TIU','TKP')),
  price       integer not null default 0,
  promo       integer not null default 0,
  promo_on    boolean not null default false,
  promo_price integer not null default 0,
  promo_cut   integer not null default 0,
  desc        text not null default '',      -- "desc": keyword, quote saat dipakai
  pub         boolean not null default false,
  hidden      boolean not null default false,
  exp         text,                          -- YYYY-MM-DD (auto draft)
  thumb       text,                          -- URL / data URL (engine)
  rel         text,
  sim         boolean not null default false
);
comment on table public.packages is 'metadata + harga paket (siswa read, editor write)';

-- --- questions: TANPA kunci jawaban -------------------------------------------
create table if not exists public.questions (
  package_id  integer not null references public.packages(id) on delete cascade,
  idx         integer not null,
  text        text not null,
  img         text,                          -- data URL engine
  oi          text[],                        -- data URL per opsi (opsional)
  type        text not null check (type in ('SKD','TWK','TIU','TKP')),  -- engine qType
  options     text[] not null,
  primary key (package_id, idx)
);
comment on table public.questions is 'soal — TANPA kunci (siswa read, editor write)';

-- --- question_keys: kunci jawaban — SISWA TIDAK BOLEH READ --------------------
create table if not exists public.question_keys (
  package_id  integer not null references public.packages(id) on delete cascade,
  idx         integer not null,
  key         integer,                        -- legacy q.a (A=0..E=4)
  weights     int[],                          -- legacy q.w (TKP: 5,4,3,2,1)
  pem         text,                           -- pembahasan
  primary key (package_id, idx),
  foreign key (package_id, idx) references public.questions(package_id, idx)
);
comment on table public.question_keys is 'kunci + pembahasan — editor only (no siswa select)';

-- --- entitlements: kecemaran SERVER -------------------------------------------
create table if not exists public.entitlements (
  user_id     uuid not null references auth.users(id) on delete cascade,
  package_id  integer not null references public.packages(id) on delete cascade,
  source      text not null default 'buy' check (source in ('buy','claim','grandfathered','free')),
  created_at  timestamptz not null default now(),
  primary key (user_id, package_id)
);
comment on table public.entitlements is 'paket dimiliki per user (siswa read own, editor all)';

-- --- attempts: penilaian SERVER -------------------------------------------------
create table if not exists public.attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  package_id  integer not null references public.packages(id) on delete cascade,
  std         text not null default 'nasional' check (std in ('nasional','afirmasi')),
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  answers     jsonb not null default '{}'::jsonb,   -- {idx: int}
  score       jsonb,                                 -- {sc, inc, ok, b, s, k, det, tot, std}
  status      text not null default 'active' check (status in ('active','done','expired')),
  updated_at  timestamptz not null default now()
);
comment on table public.attempts is 'penilaian ujian (siswa read own, editor all)';

-- --- payments: pembayaran SERVER -------------------------------------------------
create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  package_id   integer not null references public.packages(id) on delete cascade,
  amount       integer not null default 0,
  method       text not null default 'QRIS',
  promo_code   text,
  status       text not null default 'pending' check (status in ('pending','paid','rejected')),
  proof_path   text,
  created_at   timestamptz not null default now(),
  confirmed_by uuid references auth.users(id),
  confirmed_at timestamptz
);
comment on table public.payments is 'invoice pembayaran (siswa read own, editor all)';

-- --- RLS: siswa read own / editor all; question_keys: editor only --------------
alter table public.packages enable row level security;
alter table public.questions enable row level security;
alter table public.question_keys enable row level security;
alter table public.entitlements enable row level security;
alter table public.attempts enable row level security;
alter table public.payments enable row level security;

-- packages: read-all (untuk siswa hydrate S.packages).
drop policy if exists "packages publik read" on public.packages;
create policy "packages publik read" on public.packages for select to authenticated using (true);
drop policy if exists "packages editor write" on public.packages;
create policy "packages editor write" on public.packages for all to authenticated
  using (public.is_catalog_editor()) with check (true);

-- questions: read-all.
drop policy if exists "questions publik read" on public.questions;
create policy "questions publik read" on public.questions for select to authenticated using (true);
drop policy if exists "questions editor write" on public.questions;
create policy "questions editor write" on public.questions for all to authenticated
  using (public.is_catalog_editor()) with check (true);

-- question_keys: editor only — SISWA TIDAK BOLEH SELECT.
drop policy if exists "question_keys editor write" on public.question_keys;
create policy "question_keys editor write" on public.question_keys for all to authenticated
  using (public.is_catalog_editor()) with check (true);

-- entitlements: siswa read own.
drop policy if exists "entitlements read own" on public.entitlements;
create policy "entitlements read own" on public.entitlements for select to authenticated
  using (user_id = auth.uid());
drop policy if exists "entitlements editor write" on public.entitlements;
create policy "entitlements editor write" on public.entitlements for all to authenticated
  using (public.is_catalog_editor()) with check (true);

-- attempts: siswa read own.
drop policy if exists "attempts read own" on public.attempts;
create policy "attempts read own" on public.attempts for select to authenticated
  using (user_id = auth.uid());
drop policy if exists "attempts editor write" on public.attempts;
create policy "attempts editor write" on public.attempts for all to authenticated
  using (public.is_catalog_editor()) with check (true);

-- payments: siswa read own + update status pending (simulasi transfer).
drop policy if exists "payments read own" on public.payments;
create policy "payments read own" on public.payments for select to authenticated
  using (user_id = auth.uid());
drop policy if exists "payments student update own" on public.payments;
create policy "payments student update own" on public.payments for update to authenticated
  using (user_id = auth.uid() and status = 'pending') with check (true);
drop policy if exists "payments editor write" on public.payments;
create policy "payments editor write" on public.payments for all to authenticated
  using (public.is_catalog_editor()) with check (true);

-- izin dasar (RLS yang membatasi baris; question_keys tidak diberi grant select
-- ke authenticated agar siswa tidak bisa mengecek keberadaan tabel):
grant select on public.packages, public.questions to authenticated;
grant select, update on public.entitlements, public.attempts, public.payments to authenticated;
grant insert on public.attempts, public.payments to authenticated;
grant execute on function public.start_attempt(integer),
                            public.submit_attempt(uuid, jsonb),
                            public.create_payment(integer, text, text),
                            public.mark_payment_paid(uuid),
                            public.confirm_payment(uuid),
                            public.reject_payment(uuid),
                            public.grant_free_claim(uuid, integer),
                            public.upsert_packages(jsonb),
                            public.upsert_questions(jsonb),
                            public.upsert_question_keys(jsonb),
                            public.set_catalog(jsonb),
                            public.get_catalog() to authenticated;
