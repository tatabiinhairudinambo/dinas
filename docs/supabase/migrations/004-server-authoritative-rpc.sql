-- ===========================================================================
-- 004-server-authoritative-rpc.sql — RPC SERVER (Fase 3A)
-- Jalankan setelah 003. Idempotent (CREATE OR REPLACE).
-- Aturan penilaian = docs/SERVER_AUTH.md §4.
-- ===========================================================================

-- =========================== SISWA =========================================

-- Siswa: mulai penilaian (cek entitlements + pub). Kembalikan soal TANPA kunci.
create or replace function public.start_attempt(p_package_id integer)
returns table(package_id integer, attempt_id uuid, started_at timestamptz, questions jsonb)
language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from entitlements
    where user_id = auth.uid() and package_id = p_package_id
  ) then
    raise exception 'tidak punya paket';
  end if;
  if not exists (select 1 from packages where id = p_package_id and pub) then
    raise exception 'paket tidak ada/tidak tayang';
  end if;
  -- Lanjutkan attempt aktif bila ada; kalau tidak, buat baru (retry = F3B).
  if not exists (
    select 1 from attempts
    where user_id = auth.uid() and package_id = p_package_id and status = 'active'
  ) then
    insert into attempts (user_id, package_id, answers, status)
    values (auth.uid(), p_package_id, '{}'::jsonb, 'active');
  end if;
  return query select
    p.id,
    a.id,
    a.started_at,
    (select jsonb_agg(jsonb_build_object(
        'idx', q.idx,
        'text', q.text,
        'img', q.img,
        'options', q.options,
        'type', q.type,
        'oi', coalesce(q.oi, '{}'::text[]))
       order by q.idx)
     from questions q
     where q.package_id = p.id) as questions
  from packages p
  join attempts a on a.user_id = auth.uid() and a.package_id = p_package_id
  where p.id = p_package_id and a.status = 'active';
end;
$$;

-- Siswa: kirim jawaban. Hitung skor SERVER sebagai aturan finish()/calcOk
-- (docs/SERVER_AUTH.md §4). Mendaftarkan ended_at + status done.
-- Kembalikan {ok, score}.
create or replace function public.submit_attempt(p_attempt_id uuid, p_answers jsonb)
returns table(ok boolean, score jsonb)
language plpgsql security definer set search_path = public as $$
declare
  v_attempt  record;
  v_twk int := 0; v_tiu int := 0; v_tkp int := 0;
  v_b, v_s, v_k, v_tot int := 0;
  v_det jsonb := '[]'::jsonb;
  v_v bool;
  v_rec record;
  v_a int;
  v_ok bool;
begin
  select a.*, p.type as ptype
  into v_attempt
  from attempts a join packages p on p.id = a.package_id
  where a.id = p_attempt_id and a.user_id = auth.uid();
  if not found or v_attempt.status <> 'active' then
    return query select false, null::jsonb;
    return;
  end if;

  for v_rec in (
    select q.idx,
           p_answers->>q.idx::text as a_txt,
           case
             when p.type = 'SKD' then
               case when q.idx < 30 then 'TWK' when q.idx < 65 then 'TIU' else 'TKP' end
             else p.type end as etype,
           qk.key as key, qk.weights as weights
    from questions q
    join packages p on p.id = q.package_id
    left join question_keys qk on qk.package_id = q.package_id and qk.idx = q.idx
    where q.package_id = v_attempt.package_id
    order by q.idx
  ) loop
    v_a := null;
    if v_rec.a_txt is not null and v_rec.a_txt <> '' then
      begin
        v_a := v_rec.a_txt::int;
      exception when invalid_text_representation then
        v_a := null;
      end;
    end if;
    if v_a is null then
      v_k := v_k + 1;
      v_det := v_det || jsonb_build_object('i', v_rec.idx, 'st', 'kosong');
    elsif v_rec.etype = 'TKP' then
      -- legacy: q.w[a] — a = 0..4 (JS); Postgres int[] = 1-based -> weights[a+1]
      v_tkp := v_tkp + coalesce((v_rec.weights)[v_a + 1], 0);
      v_b := v_b + 1;
      v_det := v_det || jsonb_build_object('i', v_rec.idx, 'st', 'jawab', 'a', v_a);
    elsif v_a = v_rec.key then
      if v_rec.etype = 'TWK' then v_twk := v_twk + 5;
      elsif v_rec.etype = 'TIU' then v_tiu := v_tiu + 5; end if;
      v_b := v_b + 1;
      v_det := v_det || jsonb_build_object('i', v_rec.idx, 'st', 'benar', 'a', v_a);
    else
      v_s := v_s + 1;
      v_det := v_det || jsonb_build_object('i', v_rec.idx, 'st', 'salah', 'a', v_a);
    end if;
  end loop;

  v_tot := v_twk + v_tiu + v_tkp;
  if v_attempt.ptype = 'SKD' then
    v_ok := (v_twk >= 65) and (v_tiu >= 80) and (v_tkp >= 156);
  elsif v_attempt.ptype = 'TWK' then
    v_ok := v_twk >= 65;
  elsif v_attempt.ptype = 'TIU' then
    v_ok := v_tiu >= 80;
  else
    v_ok := v_tkp >= 156;
  end if;
  -- Afirmasi (status penilaian 1-nilai) — docs/SERVER_AUTH.md §4 calcOk.
  if (v_attempt.std = 'afirmasi') then
    if v_attempt.ptype = 'SKD' then
      v_v := v_tot >= 281 and v_tiu >= 55;
    elsif v_attempt.ptype = 'TIU' then
      v_v := v_tiu >= 55;
    else
      v_v := null;
    end if;
  else
    v_v := v_ok;
  end if;

  update attempts
  set status = 'done', ended_at = now(), answers = coalesce(p_answers, '{}'::jsonb),
      score = jsonb_build_object(
        'sc', jsonb_build_object('TWK', v_twk, 'TIU', v_tiu, 'TKP', v_tkp),
        'inc', case when v_attempt.ptype = 'SKD'
                    then jsonb_build_array('TWK','TIU','TKP')
                    else jsonb_build_array(v_attempt.ptype) end,
        'ok', v_v,
        'b', v_b, 's', v_s, 'k', v_k,
        'det', v_det,
        'tot', v_tot,
        'std', v_attempt.std)
  where id = p_attempt_id;

  return query select v_v,
    jsonb_build_object(
      'sc', jsonb_build_object('TWK', v_twk, 'TIU', v_tiu, 'TKP', v_tkp),
      'inc', case when v_attempt.ptype = 'SKD'
                  then jsonb_build_array('TWK','TIU','TKP')
                  else jsonb_build_array(v_attempt.ptype) end,
      'ok', v_v, 'b', v_b, 's', v_s, 'k', v_k,
      'det', v_det, 'tot', v_tot, 'std', v_attempt.std);
end;
$$;

-- Siswa: buat pembayaran. Harga SERVER (docs/SERVER_AUTH.md §4, fin() REVISI 8).
create or replace function public.create_payment(p_package_id integer, p_method text, p_promo_code text)
returns table(payment_id uuid, amount integer)
language plpgsql security definer set search_path = public as $$
declare
  v_pkg   record;
  v_promos jsonb := '[]'::jsonb;
  v_promo record;
  v_b, v_amt int;
  v_pid   uuid;
begin
  -- Siswa membeli paket yang tayang dan belum dimiliki (docs/SERVER_AUTH.md §4).
  if exists (
    select 1 from entitlements
    where user_id = auth.uid() and package_id = p_package_id
  ) then
    raise exception 'paket sudah dimiliki';
  end if;
  select * into v_pkg from packages where id = p_package_id and pub;
  if not found then raise exception 'paket tidak ada/tidak tayang'; end if;

  select coalesce(c.data->'promos', '[]'::jsonb) into v_promos from catalog c where c.id = 1;
  v_b := coalesce(v_pkg.promo, 0);

  if p_promo_code is not null then
    select c into v_promo
    from jsonb_array_elements(v_promos) c
    where (c->>'code')::text = p_promo_code
    order by (c->>'amt')::int desc
    limit 1;
  end if;
  if v_promo is not null and (v_promo->>'on')::int = 1 then
    v_amt := least(greatest(0, (v_promo->>'amt')::int), v_b);
  else
    v_amt := 0;
  end if;

  insert into payments (user_id, package_id, amount, method, promo_code)
  values (auth.uid(), p_package_id, greatest(0, v_b - v_amt), p_method, p_promo_code)
  returning id into v_pid;

  return query select v_pid, greatest(0, v_b - v_amt);
end;
$$;

-- Siswa: tandai transfer berhasil (simulasi; hanya miliknya sendiri, hanya
-- pending → paid) + entitlement otomatis (source 'buy').
create or replace function public.mark_payment_paid(p_payment_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from payments
    where id = p_payment_id and user_id = auth.uid() and status = 'pending'
  ) then
    raise exception 'pembayaran tidak ada / bukan milikmu / sudah diproses';
  end if;
  update payments
  set status = 'paid', confirmed_by = auth.uid(), confirmed_at = now()
  where id = p_payment_id;
  insert into entitlements (user_id, package_id, source)
  select user_id, package_id, 'buy' from payments where id = p_payment_id
  on conflict (user_id, package_id) do nothing;
end;
$$;

-- =========================== EDITOR ========================================

-- Editor: konfirmasi pembayaran → entitlement (source 'buy') + status paid.
create or replace function public.confirm_payment(p_payment_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_catalog_editor() then
    raise exception 'hanya editor';
  end if;
  update payments
  set status = 'paid', confirmed_by = auth.uid(), confirmed_at = now()
  where id = p_payment_id and status = 'pending';
  insert into entitlements (user_id, package_id, source)
  select user_id, package_id, 'buy' from payments where id = p_payment_id
  on conflict (user_id, package_id) do nothing;
end;
$$;

-- Editor: tolak pembayaran.
create or replace function public.reject_payment(p_payment_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_catalog_editor() then
    raise exception 'hanya editor';
  end if;
  update payments set status = 'rejected' where id = p_payment_id and status = 'pending';
end;
$$;

-- Editor: grant entitlement gratis/amal (klaim paket, docs/SERVER_AUTH.md §8).
create or replace function public.grant_free_claim(p_user_id uuid, p_package_id integer)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_catalog_editor() then
    raise exception 'hanya editor';
  end if;
  if not exists (select 1 from packages where id = p_package_id and pub) then
    raise exception 'paket tidak ada/tidak tayang';
  end if;
  insert into entitlements (user_id, package_id, source)
  values (p_user_id, p_package_id, 'free')
  on conflict (user_id, package_id) do update set source = excluded.source;
end;
$$;

-- Editor: editor-only upsert paket (sesuai bentuk S.packages engine).
create or replace function public.upsert_packages(p_rows jsonb)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_catalog_editor() then
    raise exception 'hanya editor';
  end if;
  insert into packages (id, name, type, price, promo, desc, pub, hidden, exp, thumb, rel, sim)
  select r.id, r.name, r.type, r.price, r.promo, r."desc", r.pub, r.hidden,
         r.exp, r.thumb, r.rel, r.sim
  from jsonb_to_recordset(p_rows) as r (
    id integer, name text, type text, price integer, promo integer,
    "desc" text, pub boolean, hidden boolean, exp text, thumb text, rel text, sim boolean
  )
  on conflict (id) do update set
    name = excluded.name, type = excluded.type, price = excluded.price,
    promo = excluded.promo, "desc" = excluded."desc", pub = excluded.pub,
    hidden = excluded.hidden, exp = excluded.exp, thumb = excluded.thumb,
    rel = excluded.rel, sim = excluded.sim;
end;
$$;

-- Editor: editor-only upsert soal (tanpa kunci).
create or replace function public.upsert_questions(p_rows jsonb)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_catalog_editor() then
    raise exception 'hanya editor';
  end if;
  insert into questions (package_id, idx, text, img, oi, type, options)
  select r.package_id, r.idx, r."text", r.img, r.oi, r.type, r.options
  from jsonb_to_recordset(p_rows) as r (
    package_id integer, idx integer, "text" text, img text, oi text[], type text, options text[]
  )
  on conflict (package_id, idx) do update set
    text = excluded.text, img = excluded.img, oi = excluded.oi,
    type = excluded.type, options = excluded.options;
end;
$$;

-- Editor: editor-only upsert kunci jawaban.
create or replace function public.upsert_question_keys(p_rows jsonb)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_catalog_editor() then
    raise exception 'hanya editor';
  end if;
  insert into question_keys (package_id, idx, key, weights, pem)
  select r.package_id, r.idx, r."key", r.weights, r.pem
  from jsonb_to_recordset(p_rows) as r (
    package_id integer, idx integer, "key" integer, weights int[], pem text
  )
  on conflict (package_id, idx) do update set
    key = excluded.key, weights = excluded.weights, pem = excluded.pem;
end;
$$;

-- Editor: kirim katalog metadata (banner, logo, promos, groups, pay, ...).
-- NOTE: 'packages' TIDAK masuk CATALOG_KEYS lagi (F3B, lihat §6 SERVER_AUTH.md).
create or replace function public.set_catalog(p_data jsonb)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_catalog_editor() then
    raise exception 'hanya editor';
  end if;
  insert into catalog (id, data)
  values (1, p_data)
  on conflict (id) do update set data = excluded.data;
end;
$$;

-- Siswa: baca katalog metadata (tanpa packages).
create or replace function public.get_catalog()
returns jsonb
language sql stable security definer set search_path = public as $$
  select data from catalog where id = 1;
$$;
