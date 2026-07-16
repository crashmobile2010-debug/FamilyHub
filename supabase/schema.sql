-- ====================================================================
-- FAMILY HUB — Supabase schema
-- Run this ONCE in your Supabase project: Dashboard → SQL Editor →
-- paste this whole file → Run. Then copy the project URL + anon key
-- into config/config.js. Full walkthrough: docs/SETUP.md §3.
--
-- Security model (deliberately simple for a family app):
--   The anon key is public and the policies below are open, so the
--   FAMILY_CODE in config.js is the only gate. Anyone who knows your
--   hub URL could read/write rows, but they'd need your family code
--   to touch YOUR family's row. Pick an obscure FAMILY_CODE
--   (e.g. "kereru-42-lasagna", not "smith-family").
-- ====================================================================

-- 1) Shared state: one row per family, holding the whole hub state as JSON
create table if not exists public.hub_state (
  family_code text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.hub_state enable row level security;

drop policy if exists "hub read"   on public.hub_state;
drop policy if exists "hub insert" on public.hub_state;
drop policy if exists "hub update" on public.hub_state;
create policy "hub read"   on public.hub_state for select using (true);
create policy "hub insert" on public.hub_state for insert with check (true);
create policy "hub update" on public.hub_state for update using (true);

-- 2) Realtime: broadcast row changes so every device updates instantly
do $$
begin
  alter publication supabase_realtime add table public.hub_state;
exception when duplicate_object then null;
end $$;

-- 3) Photo storage: public bucket for family photo uploads
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "photos read"   on storage.objects;
drop policy if exists "photos upload" on storage.objects;
create policy "photos read"   on storage.objects for select using (bucket_id = 'photos');
create policy "photos upload" on storage.objects for insert with check (bucket_id = 'photos');
