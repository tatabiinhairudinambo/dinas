-- ===========================================================================
-- 005-catalog-migrate.sql — backfill katalog lama → tabel server (Fase 3A)
-- Sumber: public.catalog.data (snapshot legacy, key 'kedinasan_v2').
--   data.packages = [{id,name,type,price,promo,desc,pub(0/1),hidden(0/1),
--                     qs:[...],thumb,rel,sim,promoCut,promoPrice}]
--   soal legacy   = {t, o[5], oi[], a(0-4|null), w[5], pem, pimg}
--   type soal     = engine qType (app.js:27): SKD → idx<30 TWK, idx<65 TIU,
--                   else TKP; paket non-SKD → p.type.
-- Jalankan SETELAH 003 + 004. Idempotent (UPSERT by primary key).
-- ===========================================================================

-- --- 1. packages ------------------------------------------------------------
insert into public.packages (id, name, type, price, promo, desc, pub, hidden,
                             exp, thumb, rel, sim)
select
  (p->>'id')::int,
  coalesce(p->>'name', ''),
  coalesce(p->>'type', 'SKD'),
  coalesce((p->>'price')::int, 0),
  coalesce((p->>'promo')::int, 0),
  coalesce(p->>'desc', ''),
  coalesce((p->>'pub')::int, 0) <> 0,
  coalesce((p->>'hidden')::int, 0) <> 0,
  null,                      -- legacy tidak punya exp (auto-draft)
  nullif(p->>'thumb', ''),
  nullif(p->>'rel', ''),
  coalesce((p->>'sim')::int, 0) <> 0
from public.catalog c,
     jsonb_array_elements(coalesce(c.data->'packages', '[]'::jsonb)) p
where jsonb_typeof(c.data->'packages') = 'array'
on conflict (id) do update set
  name = excluded.name, type = excluded.type, price = excluded.price,
  promo = excluded.promo, "desc" = excluded."desc", pub = excluded.pub,
  hidden = excluded.hidden, exp = excluded.exp, thumb = excluded.thumb,
  rel = excluded.rel, sim = excluded.sim;

-- --- 2. questions + question_keys (dari p.qs per paket) ----------------------
-- (a) questions — TANPA kunci (a/w/pem dibuang dari tabel siswa)
insert into public.questions (package_id, idx, text, img, oi, type, options)
select
  (p->>'id')::int,
  (q.ord - 1),                                     -- idx 0-based, sama dgn engine
  coalesce(q.value->>'t', ''),
  nullif(q.value->>'pimg', ''),
  (select array_agg(v) from jsonb_array_elements_text(
     coalesce(q.value->'oi', '[]'::jsonb)) v),
  case
    when coalesce(p->>'type', 'SKD') = 'SKD' then
      case when (q.ord - 1) < 30 then 'TWK'
           when (q.ord - 1) < 65 then 'TIU'
           else 'TKP' end
    else coalesce(p->>'type', 'SKD')
  end,
  coalesce((select array_agg(v) from jsonb_array_elements_text(
     q.value->'o') v), array[]::text[])
from public.catalog c
join jsonb_array_elements(coalesce(c.data->'packages', '[]'::jsonb)) p
  on jsonb_typeof(c.data->'packages') = 'array'
join lateral jsonb_array_elements(coalesce(p->'qs', '[]'::jsonb))
  with ordinality q(value, ord) on true
on conflict (package_id, idx) do update set
  text = excluded.text, img = excluded.img, oi = excluded.oi,
  type = excluded.type, options = excluded.options;

-- (b) question_keys — kunci + bobot + pembahasan (tabel editor-only)
insert into public.question_keys (package_id, idx, key, weights, pem)
select
  (p->>'id')::int,
  (q.ord - 1),
  nullif(q.value->>'a', '')::int,                  -- legacy q.a (0..4 | null)
  (select array_agg(v::int) from jsonb_array_elements_text(
     coalesce(q.value->'w', '[]'::jsonb)) v),      -- legacy q.w (urutan JS 0-4)
  nullif(q.value->>'pem', '')
from public.catalog c
join jsonb_array_elements(coalesce(c.data->'packages', '[]'::jsonb)) p
  on jsonb_typeof(c.data->'packages') = 'array'
join lateral jsonb_array_elements(coalesce(p->'qs', '[]'::jsonb))
  with ordinality q(value, ord) on true
on conflict (package_id, idx) do update set
  key = excluded.key, weights = excluded.weights, pem = excluded.pem;

-- --- 3. verifikasi manual (opsional, jalankan terpisah) ----------------------
-- select (select count(*) from public.packages)       as pkgs,
--        (select count(*) from public.questions)      as qs,
--        (select count(*) from public.question_keys)  as keys,
--        (select count(*) from public.packages p
--          join public.questions q on q.package_id = p.id
--          where p.type = 'SKD')                      as qs_skd;  -- harus 110/paket
