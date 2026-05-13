-- ============================================================
-- Routines Table (if not already created from schema.sql)
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rqmplfyuonkikdmqngrj/sql
-- ============================================================

-- Create the routines table if it doesn't exist
create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  routine_type text check (routine_type in ('wash_day','refresh','deep_treatment','custom')),
  steps jsonb not null default '[]',
  is_public boolean default false,
  created_at timestamptz default now()
);

-- RLS policies
alter table routines enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Public routines visible" on routines;
drop policy if exists "Auth users can create routines" on routines;
drop policy if exists "Users can update own routines" on routines;
drop policy if exists "Users can delete own routines" on routines;

create policy "Public routines visible" on routines for select
  using (is_public = true or user_id = auth.uid());
create policy "Auth users can create routines" on routines for insert
  with check (user_id = auth.uid());
create policy "Users can update own routines" on routines for update
  using (user_id = auth.uid());
create policy "Users can delete own routines" on routines for delete
  using (user_id = auth.uid());

-- Index for listing public routines
create index if not exists routines_public_idx on routines (is_public, created_at desc);
create index if not exists routines_user_idx on routines (user_id);
