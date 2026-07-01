-- =====================================================================
-- JobJapa — Seed data for admin dashboard preview
-- Paste this whole block into Supabase → SQL Editor → RUN.
-- Safe to re-run: uses ON CONFLICT DO NOTHING on reference/phone_number.
-- =====================================================================

-- 1) Ensure phone_number & reference are unique so re-running is idempotent
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_phone_number_unique'
  ) then
    alter table public.users add constraint users_phone_number_unique unique (phone_number);
  end if;
end$$;

-- 2) Insert 40 realistic Nigerian users
insert into public.users (name, phone_number, subscription_status, cv_rewrites_used, created_at) values
  ('Chinedu Okafor',      '+2348069954644', 'pro',     8, now() - interval '182 days'),
  ('Aisha Bello',         '+2348132045726', 'pro',     3, now() - interval '150 days'),
  ('Tunde Adeyemi',       '+2348032570698', 'free',    1, now() - interval '5 days'),
  ('Ngozi Eze',           '+2347069902533', 'pro',    10, now() - interval '210 days'),
  ('Emeka Obi',           '+2348147016116', 'pro',     7, now() - interval '95 days'),
  ('Fatima Ibrahim',      '+2348166859974', 'pro',    12, now() - interval '260 days'),
  ('Kunle Balogun',       '+2348128424692', 'pro',     2, now() - interval '18 days'),
  ('Amaka Nwosu',         '+2348124181362', 'free',    0, now() - interval '3 days'),
  ('Segun Adebayo',       '+2349088448281', 'free',    3, now() - interval '65 days'),
  ('Zainab Musa',         '+2348135567012', 'expired', 4, now() - interval '300 days'),
  ('Ifeanyi Okonkwo',     '+2348037778001', 'pro',     6, now() - interval '75 days'),
  ('Halima Yusuf',        '+2347031229087', 'pro',     4, now() - interval '48 days'),
  ('Damilola Ojo',        '+2348160145322', 'free',    2, now() - interval '11 days'),
  ('Chiamaka Uche',       '+2349011456789', 'pro',     9, now() - interval '132 days'),
  ('Bola Ajayi',          '+2348034987611', 'expired', 1, now() - interval '220 days'),
  ('Yetunde Ogun',        '+2348123344556', 'pro',     5, now() - interval '39 days'),
  ('Chukwuemeka Nnamdi',  '+2347049912233', 'free',    0, now() - interval '1 days'),
  ('Rashidat Salami',     '+2348131998877', 'pro',    11, now() - interval '198 days'),
  ('Obinna Iheanacho',    '+2348157733120', 'pro',     3, now() - interval '26 days'),
  ('Kemi Adekunle',       '+2348066554433', 'free',    2, now() - interval '9 days'),
  ('Musa Danladi',        '+2347022110099', 'expired', 0, now() - interval '280 days'),
  ('Blessing Okoro',      '+2348143221156', 'pro',     4, now() - interval '54 days'),
  ('Femi Bankole',        '+2348029009009', 'pro',     8, now() - interval '110 days'),
  ('Hadiza Aliyu',        '+2348108887766', 'free',    1, now() - interval '15 days'),
  ('Chinelo Umeh',        '+2349077332211', 'pro',     6, now() - interval '82 days'),
  ('Sola Bakare',         '+2348038765432', 'free',    3, now() - interval '32 days'),
  ('Ngozika Chukwu',      '+2347051002030', 'pro',     7, now() - interval '145 days'),
  ('Adaeze Nkem',         '+2348134445566', 'expired', 2, now() - interval '190 days'),
  ('Ibrahim Sani',        '+2348062334455', 'free',    0, now() - interval '2 days'),
  ('Titilayo Ade',        '+2348167788990', 'pro',     5, now() - interval '61 days'),
  ('Chidi Anozie',        '+2348139887766', 'pro',     3, now() - interval '28 days'),
  ('Uzoamaka Egwu',       '+2348057788112', 'free',    2, now() - interval '20 days'),
  ('Bashir Umar',         '+2348097665544', 'pro',    10, now() - interval '175 days'),
  ('Funmilayo Oke',       '+2348121003040', 'free',    1, now() - interval '7 days'),
  ('Ebuka Nwachukwu',     '+2348149006677', 'pro',     4, now() - interval '43 days'),
  ('Ronke Adeoti',        '+2348165544332', 'expired', 1, now() - interval '245 days'),
  ('Yakubu Bello',        '+2347036789012', 'pro',     6, now() - interval '99 days'),
  ('Adaora Onyeka',       '+2349055443322', 'pro',     2, now() - interval '17 days'),
  ('Kelechi Duru',        '+2348030220110', 'free',    0, now() - interval '4 days'),
  ('Modupe Ilori',        '+2348136655443', 'pro',     8, now() - interval '128 days')
on conflict (phone_number) do nothing;

-- 3) Insert ~55 payments across all statuses, with a chunk in the current month
insert into public.payments (reference, amount, type, status, created_at) values
  -- Current-month successful payments (so Monthly Revenue is meaningful)
  ('JJ-8K3XM2P7QN', 3500,  'pro_monthly', 'success', date_trunc('month', now()) + interval '2 days'),
  ('JJ-9V4YC8R2LM', 25000, 'pro_yearly',  'success', date_trunc('month', now()) + interval '3 days'),
  ('JJ-7B5NF9T6PJ', 1500,  'cv_rewrite',  'success', date_trunc('month', now()) + interval '4 days'),
  ('JJ-4H8QE3W1KX', 3500,  'pro_monthly', 'success', date_trunc('month', now()) + interval '5 days'),
  ('JJ-2M6JG5D9RT', 3500,  'pro_monthly', 'success', date_trunc('month', now()) + interval '6 days'),
  ('JJ-5Y7ZA4U2NB', 25000, 'pro_yearly',  'success', date_trunc('month', now()) + interval '8 days'),
  ('JJ-3F9LK6H8CE', 1500,  'cv_rewrite',  'success', date_trunc('month', now()) + interval '9 days'),
  ('JJ-6D2SV7X4WP', 1500,  'cv_rewrite',  'success', date_trunc('month', now()) + interval '10 days'),
  ('JJ-1G8UB5J3QY', 3500,  'pro_monthly', 'success', date_trunc('month', now()) + interval '12 days'),
  ('JJ-9C4RN2A7LK', 3500,  'pro_monthly', 'success', date_trunc('month', now()) + interval '14 days'),
  ('JJ-8T6EM3Y1XV', 2000,  'one_time',    'success', date_trunc('month', now()) + interval '15 days'),
  ('JJ-4B7WK9P5RD', 25000, 'pro_yearly',  'success', date_trunc('month', now()) + interval '17 days'),
  ('JJ-2H3FL8G6QN', 1500,  'cv_rewrite',  'success', date_trunc('month', now()) + interval '18 days'),
  ('JJ-7A9CX4Z2JM', 3500,  'pro_monthly', 'success', date_trunc('month', now()) + interval '20 days'),
  ('JJ-5S1TP6V8UH', 1500,  'cv_rewrite',  'success', date_trunc('month', now()) + interval '22 days'),

  -- Current-month pending / failed (for status filter demo)
  ('JJ-6E7RM2N4KJ', 3500,  'pro_monthly', 'pending', date_trunc('month', now()) + interval '11 days'),
  ('JJ-3W8YQ5B1XA', 25000, 'pro_yearly',  'pending', date_trunc('month', now()) + interval '13 days'),
  ('JJ-9L4CD7F6PT', 1500,  'cv_rewrite',  'failed',  date_trunc('month', now()) + interval '16 days'),
  ('JJ-2K5VH3G9RN', 3500,  'pro_monthly', 'failed',  date_trunc('month', now()) + interval '19 days'),
  ('JJ-8N1AS7U6MJ', 4500,  'one_time',    'pending', date_trunc('month', now()) + interval '21 days'),

  -- Prior months (mixed statuses)
  ('JJ-1Q6BF8H3WD', 3500,  'pro_monthly', 'success', now() - interval '35 days'),
  ('JJ-7P4XK9T2VL', 25000, 'pro_yearly',  'success', now() - interval '42 days'),
  ('JJ-4C8EM1J5RG', 1500,  'cv_rewrite',  'success', now() - interval '48 days'),
  ('JJ-9Y3NR6D7XB', 3500,  'pro_monthly', 'success', now() - interval '55 days'),
  ('JJ-2A5HK8L4QC', 3500,  'pro_monthly', 'failed',  now() - interval '58 days'),
  ('JJ-6M9BF2W1TP', 1500,  'cv_rewrite',  'success', now() - interval '62 days'),
  ('JJ-5J7GT3E8VN', 25000, 'pro_yearly',  'success', now() - interval '71 days'),
  ('JJ-3D4CX6Y2UH', 3500,  'pro_monthly', 'pending', now() - interval '76 days'),
  ('JJ-8R1LP9K5AM', 3500,  'pro_monthly', 'success', now() - interval '82 days'),
  ('JJ-4T6QS7B3JF', 1500,  'cv_rewrite',  'success', now() - interval '89 days'),
  ('JJ-9E2NM4H8CD', 25000, 'pro_yearly',  'success', now() - interval '95 days'),
  ('JJ-1V5UF6X7GK', 3500,  'pro_monthly', 'success', now() - interval '103 days'),
  ('JJ-7B8YR2L4WT', 1500,  'cv_rewrite',  'failed',  now() - interval '110 days'),
  ('JJ-5A3JQ9N1PM', 3500,  'pro_monthly', 'success', now() - interval '118 days'),
  ('JJ-2H6CE7X8VB', 25000, 'pro_yearly',  'success', now() - interval '124 days'),
  ('JJ-4G9DK5F3RN', 3500,  'pro_monthly', 'success', now() - interval '132 days'),
  ('JJ-8P1TW6M2SY', 1500,  'cv_rewrite',  'success', now() - interval '140 days'),
  ('JJ-3L7HJ4Q9AE', 3500,  'pro_monthly', 'pending', now() - interval '147 days'),
  ('JJ-6U5NB2C8XK', 25000, 'pro_yearly',  'success', now() - interval '155 days'),
  ('JJ-9F2DP7R4WM', 3500,  'pro_monthly', 'success', now() - interval '162 days'),
  ('JJ-1S4KV6Y3JT', 1500,  'cv_rewrite',  'success', now() - interval '170 days'),
  ('JJ-5C8GX9E1LP', 3500,  'pro_monthly', 'success', now() - interval '178 days'),
  ('JJ-7M3QN2H6BD', 3500,  'pro_monthly', 'failed',  now() - interval '185 days'),
  ('JJ-4A6RF5T8YU', 25000, 'pro_yearly',  'success', now() - interval '193 days'),
  ('JJ-2W9JK7L1XV', 1500,  'cv_rewrite',  'success', now() - interval '200 days'),
  ('JJ-8B3PS4M6NC', 3500,  'pro_monthly', 'success', now() - interval '208 days'),
  ('JJ-6E1UH8G5DR', 3500,  'pro_monthly', 'success', now() - interval '215 days'),
  ('JJ-3T7YV2Q9FA', 25000, 'pro_yearly',  'success', now() - interval '223 days'),
  ('JJ-9K4CX6J1WP', 1500,  'cv_rewrite',  'pending', now() - interval '230 days'),
  ('JJ-5D8NM3B7HL', 3500,  'pro_monthly', 'success', now() - interval '238 days'),
  ('JJ-1P2GF9R5TE', 3500,  'pro_monthly', 'success', now() - interval '246 days'),
  ('JJ-7X6JQ4V8YU', 1500,  'cv_rewrite',  'success', now() - interval '254 days'),
  ('JJ-4M9CH1L3AS', 25000, 'pro_yearly',  'success', now() - interval '262 days'),
  ('JJ-8Y5BF2N7WK', 3500,  'pro_monthly', 'failed',  now() - interval '270 days'),
  ('JJ-2R3DK6P9GT', 3500,  'pro_monthly', 'success', now() - interval '278 days')
on conflict (reference) do nothing;

-- Sanity check
select
  (select count(*) from public.users)    as users_count,
  (select count(*) from public.payments) as payments_count,
  (select coalesce(sum(amount),0) from public.payments
     where status='success' and created_at >= date_trunc('month', now())) as revenue_this_month;
