-- ═══════════════════════════════════════════════════════════════════════════
-- Courts — Supabase setup
--
-- Run this ONCE in your Supabase project:
--   Supabase dashboard → SQL Editor → New query → paste all of this → Run.
--
-- It creates the `bookings` and `reviews` tables and the Row-Level Security
-- (RLS) rules so that:
--   • A logged-in user can see/insert/update only THEIR OWN bookings.
--   • The ADMIN (identified by email) can see and update ALL bookings.
--
-- 👉 IMPORTANT: replace the admin email on the line marked below if you ever
--    change NEXT_PUBLIC_ADMIN_EMAIL in your app.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Helper: is the current user the admin? ──────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() ->> 'email') = 'applicationdevelopmentincloud@gmail.com', -- 👈 admin email
    false
  );
$$;

-- ── Table: bookings ─────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  customer_name  text not null,
  customer_email text not null,
  court_id       text not null,
  court_name     text not null,
  sport          text not null,
  slot_label     text not null,
  booking_date   date not null,
  start_time     timestamptz not null,
  reference      text not null,
  total          integer not null,
  deposit        integer not null,
  balance        integer not null,
  promo_code     text,
  status         text not null default 'CONFIRMED',
  created_at     timestamptz not null default now()
);

-- Prevent double-booking: only ONE active booking per court+date+slot.
-- (Cancelled bookings are excluded so a freed slot can be re-booked.)
create unique index if not exists bookings_unique_active_slot
  on public.bookings (court_id, booking_date, slot_label)
  where (status <> 'CANCELLED');

create index if not exists bookings_user_idx on public.bookings (user_id);
create index if not exists bookings_date_idx on public.bookings (booking_date);

alter table public.bookings enable row level security;

-- SELECT: owner or admin.
drop policy if exists bookings_select on public.bookings;
create policy bookings_select on public.bookings
  for select using (auth.uid() = user_id or public.is_admin());

-- INSERT: only as yourself.
drop policy if exists bookings_insert on public.bookings;
create policy bookings_insert on public.bookings
  for insert with check (auth.uid() = user_id);

-- UPDATE: owner (e.g. cancel) or admin (no-show/complete).
drop policy if exists bookings_update on public.bookings;
create policy bookings_update on public.bookings
  for update using (auth.uid() = user_id or public.is_admin());

-- DELETE: admin only (the "clear all bookings" button).
drop policy if exists bookings_delete on public.bookings;
create policy bookings_delete on public.bookings
  for delete using (public.is_admin());

-- ── Table: reviews ──────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  court_id   text not null,
  user_id    uuid not null references auth.users(id) on delete cascade,
  user_name  text not null,
  rating     integer not null check (rating between 1 and 5),
  comment    text not null,
  created_at timestamptz not null default now()
);

create index if not exists reviews_court_idx on public.reviews (court_id);

alter table public.reviews enable row level security;

-- SELECT: reviews are public (anyone can read).
drop policy if exists reviews_select on public.reviews;
create policy reviews_select on public.reviews
  for select using (true);

-- INSERT: only as yourself (must be logged in).
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews
  for insert with check (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- Done! Your database is ready.
--
-- To FREE STORAGE / wipe demo data later, run either:
--   truncate table public.bookings;              -- empties bookings only
--   truncate table public.bookings, public.reviews;  -- empties both
-- (Or use the admin "Clear all bookings" button in the app.)
-- ═══════════════════════════════════════════════════════════════════════════
