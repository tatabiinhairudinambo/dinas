# Desain — Server-Authoritative (Kunci Jawaban, Penilaian, Kecemaran)

**Ruang lingkup Fase 3A:** desain + SQL saja. Perubahan klien di Fase 3B
(rencana di §6). Dokumen ini sertakan kedua.

Kondisi sekarang (Fase 3A, dari audit Langkah 1): kunci jawaban, penilaian,
kepemilikan, dan pembayaran diatur di klien — lihat [LAPORAN](#laporan) untuk
bukti file:baris.

---

## 1. Masalah saat ini (target)

- Kunci jawaban (`q.a`, `q.w` TKP) berada di `S.packages[].qs[]` — klien,
  termasuk `localStorage` dan `catalog.data`.
- Penilaian di `finish()` di browser (app.js:139).
- Kecemaran di `S.owned[pid]` (timestamp) — klien menulis, sendiri.
- Pembayaran: `VA` = random di app.js:121, `Cek Status` tidak nyata, `paid()`
  (app.js:1928) mengisi `S.owned` dari "Simulasikan Transfer".
- Fragmentasi: promo di `S.promos` lokal vs `catalog.promos` (shared);
  `paid` berbeda 4 kali (app.js 122/277/303/1928); `S.claimed` lokal.

## 2. Skema baru (baru — Fase 3B dijalankan)

```sql
-- packages (metadata + harga — SESUAI bentuk S.packages engine)
packages(
  id          integer primary key,
  name        text not null,
  type        text not null,          -- SKD | TWK | TIU | TKP (engine)
  price       integer not null default 0,
  promo       integer not null default 0,
  promo_on    boolean not null default false,
  promo_price integer not null default 0,
  promo_cut   integer not null default 0,
  desc        text not null default '',
  pub         boolean not null default false,
  hidden      boolean not null default false,
  exp         text,                   -- YYYY-MM-DD
  thumb       text,                   -- URL/dataURL engine
  rel         text,
  sim         boolean not null default false,
  q_count     int                     -- NEED[type] (30 TWK, 35 TIU, 45 TKP, 110 SKD)
);

-- questions — TANPA kunci jawaban
questions(
  package_id  integer not null,
  idx         integer not null,
  text        text not null,
  img         text,                   -- dataURL/URL
  oi          text[],                 -- dataURL per opsi (opsional)
  type        text not null,          -- SKD | TWK | TIU | TKP (engine: qType)
  options     text[] not null,        -- 5 opsi A-E
  primary key (package_id, idx)
);

-- question_keys — kunci jawaban (editor-only via RLS)
question_keys(
  package_id  integer not null,
  idx         integer not null,
  key         integer,                -- legacy q.a (0-4)
  weights     int[],                  -- legacy q.w (TKP 5-1)
  pem         text,                   -- pembahasan
  primary key (package_id, idx),
  foreign key (package_id, idx) references questions(package_id, idx)
);

-- entitlements — kecemaran SERVER
entitlements(
  user_id     uuid not null references auth.users(id) on delete cascade,
  package_id  integer not null references packages(id) on delete cascade,
  source      text not null default 'buy' check (source in ('buy','claim','grandfathered','free')),
  created_at  timestamptz not null default now(),
  primary key (user_id, package_id)
);

-- attempts — penilaian SERVER
attempts(
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  package_id  integer not null,
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  answers     jsonb not null default '{}'::jsonb,   -- {idx: int}
  score       jsonb,                                -- {sc, inc, ok, b, s, k, det, tot, std}
  status      text not null default 'active' check (status in ('active','done','expired')),
  updated_at  timestamptz not null default now(),
  unique (user_id, package_id)                      -- hanya satu aktif; retry via doHapusPk (lokal)
);

-- payments — pembayaran SERVER
payments(
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  package_id  integer not null,
  amount      integer not null default 0,
  method      text not null default 'QRIS',
  promo_code  text,
  status      text not null default 'pending' check (status in ('pending','paid','rejected')),
  proof_path  text,
  created_at  timestamptz not null default now(),
  confirmed_by uuid references auth.users(id),
  confirmed_at timestamptz
);
```

RLS aktif; siwa hanya membaca yang miliknya sendiri (`user_id = auth.uid()`),
hanya penulisan siswa melalui RPC (lihat §3). Tabel lain (packages,
questions, question_keys) publik-baca untuk siswa, editor-semu di tulis.

## 3. RPC (security definer, `set search_path = public`)

Semua error → `RAISE EXCEPTION` jelas; tanpa detail interna.

```sql
-- Siswa: mulai penilaian. Cek entitlement (buy/claim/grandfathered/free).
-- Kembalikan soal TANPA kunci. Siapkan/balikkan attempt aktif.
create function public.start_attempt(p_package_id int)
returns table(package_id int, attempt_id uuid, started_at timestamptz,
              questions jsonb)
  security definer set search_path = public as $$
    begin
      if not exists (select 1 from entitlements where user_id = auth.uid() and package_id = p_package_id)
      then raise exception 'tidak punya paket'; end if;
      if not exists (select 1 from packages where id = p_package_id)
      then raise exception 'paket tidak ada'; end if;
      ... insert/update attempt aktif, return {package_id, attempt_id, questions: [...]}
      -- questions: paket via questions/question_keys tidak kembalikan 'key'.
    end;
$$;

-- Siswa: kirim jawaban. Hitung skor SERVER sebagaimana aturan (lihat §4).
-- Tegakkan waktu dengan toleransi kecil (mis. waktu engine vs server:
-- perbedaan > 15 detik -> warn saja, poin saja yang dimasukkan).
create function public.submit_attempt(p_attempt_id uuid, p_answers jsonb)
returns table(ok boolean, score jsonb)
  security definer set search_path = public as $$ ... $$;

-- Siswa: buat pembayaran. Harga SERVER: p = packages row; fin =
--   max(0, (p.promo || p.price) - min(promo_amt, b))  [fin() REVISI 8].
create function public.create_payment(p_package_id int, p_method text, p_promo_code text)
returns table(payment_id uuid, amount integer)
  security definer set search_path = public as $$ ... $$;

-- Siswa: tanda pembayaran berhasil (dari pegangan/URL). 
-- (Variasi: proof path tetap menunjuk ke object bucket private.)
create function public.mark_payment_paid(p_payment_id uuid)
returns void security definer ...;

-- Editor: konfirmasi pembayaran → insert entitlements (source 'buy').
create function public.confirm_payment(p_payment_id uuid) returns void security definer ...;
create function public.reject_payment(p_payment_id uuid) returns void security definer ...;

-- Editor: redeem paket gratis/amal (lihat §8).
create function public.redeem_free_claim(p_package_id int) returns void security definer ...;

-- Editor: editor-only upsert paket (tabel packages).
create function public.upsert_packages(p_rows jsonb) returns void security definer ...;
-- Editor: editor-only upsert soal (tabel questions) — buat sebelumnya kunci jelas (separate RPC):
create function public.upsert_questions(p_rows jsonb) returns void security definer ...;
create function public.upsert_question_keys(p_rows jsonb) returns void security definer ...;

-- Editor: kirim katalog metadata (banner, logo, promos, groups, pay...).
create function public.set_catalog(p_data jsonb) returns void security definer ...;

-- Siswa: snapshot katalog metadata (tanpa packages).
create function public.get_catalog() returns jsonb security definer ...;
```

Notes Fase 3B penting: `start_attempt` kembalikan `answers` pending + soal saat
tidak ada attempt aktif; `submit_attempt` hanya poin/skip — **nilai akhir
tetap di `attempts.score`** (lihat §4). Antarmuka baru: `HermesSync.startAttempt`,
`HermesSync.submitAttempt`.

## 4. Aturan Penilaian (spesifikasi server — app.js:139 `finish()` + app.js:425 `calcOk`)

Untuk paket `p` dan jawaban `answers` (map `idx → int` dari `E.ans`):

```
sc = {TWK: 0, TIU: 0, TKP: 0}; b = 0; s = 0; k = 0; det = []
for i in 0..len(questions)-1:
    q  = questions[i]
    a  = answers[i]                 # indeks opsi A=0..E=4 (legacy E.ans)
    t  = engine_type(p, i)          # qType (app.js:27)
    if a == null: k++; det += {i, st: 'kosong'}
    elif t == 'TKP':
        sc.TKP += q.w[a] ?? 0; b++; det += {i, st: 'jawab', a}
    elif a === q.a:
        sc[t] += 5;                  # TWK/TIU +5 (calcOk legacy)
        b++; det += {i, st: 'benar', a}
    else: s++; det += {i, st: 'salah', a}

engine_type(p, i) = (p.type == 'SKD') ? (i < 30 ? 'TWK' : i < 65 ? 'TIU' : 'TKP')
                                     : p.type

inc = (p.type == 'SKD') ? ['TWK','TIU','TKP'] : [p.type]
tot = sc.TWK + sc.TIU + sc.TKP
ok_nasional = inc.every(t => sc[t] >= TH[t]), TH = {TWK: 65, TIU: 80, TKP: 156}   # TH app.js:26 + TKP=156 di app.js:380 (REVISI 17)
ok_afirmasi = (std == 'afirmasi')
    ? (p.type == 'SKD' ? tot >= 281 && sc.TIU >= 55 : (p.type == 'TIU' ? sc.TIU >= 55 : null))
    : ok_nasional

score = {sc, inc, ok: ok_afirmasi, b, s, k, det, tot, std}
```

Asumsi jumlah soal: SKD 110 (TWK 30 / TIU 35 / TKP 45 — NEED app.js:26).
Promo: dari `S.promos` (catalog, shareable — hanya baca/validasi), server menghitung harga final:
`b = p.promo || p.price; amt = promo.on ? min(promo.amt, b) : 0; amount = max(0, b - amt)`.

## 5. Kecemaran — Rencana Fase 3B (rencana saja, belum dijalankan)

```
S.owned[pid]          = HASIL DARI entitlements — paket per user (buat baca saat boot)
S.res[pid]            = HASIL DARI attempts.score (disimpan di server → klien tak bisa manipulasi)
S.claimed[me][pid]    = HASIL DARI entitlements (source 'claim')
```

Catatan: `S.sales`, `S.newPk`, `S.promoUse`, dll — baca saja (lokal), buat telemetri.

Nilai di `attempts.score` — client hanya copy (read-only).

## 6. Rencana Perubahan Klien (Fase 3B — RENCANA SAJA, diutusi di F3B)

| Item | File | Rencana |
| --- | --- | --- |
| Start exam | bridge-override.js + app.js | Mode Supabase: `HermesSync.startAttempt(packageId)` → E={id: attemptId, packageId, server:true,...}; Legacy: `start()` asli (mode lokal). |
| Finish | bridge-override.js | `finish()` Supabase → `HermesSync.submitAttempt(E.attemptId, E.ans)` — simpan `S.res[pid] = resp.score` (disimpan di server — klien tak bisa manipulasi). |
| Buy/pay | bridge-override.js | `createPayment(packageId, method, promoCode)` → `S.owned[pid]` dipasang dari entitlements; `markPaymentPaid(paymentId)`. |
| Owned/Res/Claims read | sync.js/legacyBridge | Satu sumber kebenaran: `S.owned ← entitlements`, `S.res ← attempts.score`, `S.claimed ← entitlements` (reads hanya via RPC/server). |
| Catalog | sync.js | Remove 'packages' dari CATALOG_KEYS — catalog.data hanya {banner, logo, pay, promos, groups, ...}; packages dari tabel server; hydrate `S.packages` ke `__legacy.replaceState` setelah legacy ready. |
| Editor | — | CMS — `pushCatalog` → `set_catalog(data)`; `PackageList` — CRUD dengan `upsert_packages/questions/question_keys`. |

Di luar scope F3A: minimalisasi kode klien — goal: **klien tidak pernah
mereset/edit `q.a`, `q.w`, `S.owned`, `S.res`, `S.claimed`, `attempts`,
`entitlements`, `payments`** (walau di devtools).

## 7. Strategi Bukti Transfer

**Decision: RPC-based (simpl) + ProofPath.**

- bucket PRIVAT `payment-proofs` (read via RPC for editor; siswa upload via
  RPC `set_payment_proof(paymentId, name, contentLength, mime)` — hmm —
  simplifikasi: student uploads proof file via Supabase Storage DIRECTLY —
  but private bucket... → **Decision: public bucket with RLS policies per
  user folder**: `bucket payment-proofs public=true`; policies:
  - insert: `auth.uid() = (split_part(name, '/', 1)::uuid)`
  - select: editor-only (`is_catalog_editor()`)
  Then payments.proof_path = `user_id/file.jpg`.)
- Proof upload dari `va()` — student upload proof (e.g., screenshot
  transfer). Rencana F3B.

## 8. Strategi Migrasi Data

**Script:** `docs/supabase/migrations/005-catalog-migrate.sql` (idempotent —
lihat file) — SQL backfill **metadata** dari `catalog.data.packages` lama →
tabel `packages`/`questions`/`question_keys`. **Saran grandfathering:**
snapshot `owned` dari `app_snapshots.data` → `entitlements` — dijalankan
manual oleh operator (user jalankan 1x); poin: biarkan pembeli lama tetap
layak di server (lengkapi `entitlements`).

## 9. Risiko & Hal yang Tidak Diketahui (butuh putusan)

1. **Transfer manual vs payment gateway:** F3A desain `mark_payment_paid(paymentId)` — editor klik setelah konfirmasi bca/gopay. Gateway (webhook endpoint `api/` via Vercel Serverless + service_role) — F3B.
2. **Paket gratis/demo (`sim` flag)** — sebaiknya baru `entitlements.source = 'free'` (operator-manual, lihat F3B); paket "free" baru tetap publik.
3. **Paket `rel`/exp/pub/hidden — editor publish via `upsert_packages`.**
4. **`question_keys` vs `attempts` — submit:** `start_attempt` baca soal dari tabel; `submit_attempt(attempt_id, answers: {idx: a})` — scoring di server — `p.a`/`q.w` di server dianggap tidak ada (silent fail ok).
5. **Toleransi waktu submit_attempt:** perbedaan engine vs server >15 detik → soft-reset attempts (lihat F3B).
6. **Negosiasi timeout:** engine tidak anti-curl saat ini — F3B client-side pilihan saat awal.
7. **Promo:** promo di `catalog.promos` — editor publish — students pull.
8. **package id:** legacy integer id — `packages.id` integer — tetap.

## 10. Rencana Verifikasi SQL (F3A file: `docs/supabase/tests/server-auth-checks.sql`)

Jalankan di Supabase SQL Editor dalam urutan sebelum/sesudah migration 003-005:
1. (Siswa, menggunakan anon session di konsol browser) `start_attempt(paket)`
2. (Siswa) `submit_attempt` dengan jawaban — periksa `score` = rujukan server.
3. (Siswa) `create_payment` — periksa amount.
4. (Siswa) `mark_payment_paid` — entitas entitlement terbantah di `entitlements` (poll via RPC F3B); `get_catalog` → metadata (banner/logo/promos/groups — packages pindah tabel, lihat 005).
5. Query bawah — jalankan sebagai anon/user — GAGAL diharapkan (bukti cegah).
6. Query editor-only — jalankan sebagai editor — LAJU.

## Laporan (Fase 3A)

- **Temuan Langkah 1 (file:baris):** dalam file ini (§2).
- **Daftar file baru:**
  - `docs/SERVER_AUTH.md` (desain)
  - `docs/supabase/migrations/003-server-authoritative-tables.sql`
  - `docs/supabase/migrations/004-server-authoritative-rpc.sql`
  - `docs/supabase/migrations/005-catalog-migrate.sql`
  - `docs/supabase/tests/server-auth-checks.sql`
- **Hal yang belum bisa diverifikasi:**
- SQL di Supabase — tak ada akses DB lokal; eksekusi di file 003–005 harus di-jalankan di staging.
- Aturan gateway + transfer manual — pipilih (§9.1).
- Grandfathering — prosedur manual (§8).
- **Rencana perubahan klien:** Fase 3B (§6).
