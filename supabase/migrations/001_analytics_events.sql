-- ============================================================
-- Analytics Events Table
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rqmplfyuonkikdmqngrj/sql
-- ============================================================

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  page_path text,
  referrer text,
  screen_width integer,
  metadata jsonb,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists analytics_events_type_idx on analytics_events (event_type);
create index if not exists analytics_events_created_idx on analytics_events (created_at);

-- RLS: anyone can insert (anonymous page views), only service role can read
alter table analytics_events enable row level security;
create policy "Anyone can insert analytics" on analytics_events for insert
  with check (true);
create policy "Only service role can read analytics" on analytics_events for select
  using (false);

-- Auto-populate user_id from auth context if logged in
create or replace function public.set_analytics_user_id()
returns trigger as $$
begin
  new.user_id := auth.uid();
  return new;
end;
$$ language plpgsql security definer;

create trigger set_analytics_user_id_trigger
  before insert on analytics_events
  for each row execute procedure public.set_analytics_user_id();
