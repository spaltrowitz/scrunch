-- ============================================================
-- 90-day retention policy for analytics_events
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rqmplfyuonkikdmqngrj/sql
--
-- Schedules a daily job at 03:00 UTC that deletes analytics rows
-- older than 90 days, fulfilling the disclosure on /privacy.
-- ============================================================

create extension if not exists pg_cron with schema extensions;

-- Drop any prior schedule with the same name so this migration is idempotent
do $$
declare
  job_id bigint;
begin
  select jobid into job_id from cron.job where jobname = 'scrunch_analytics_retention_90d';
  if job_id is not null then
    perform cron.unschedule(job_id);
  end if;
end $$;

select cron.schedule(
  'scrunch_analytics_retention_90d',
  '0 3 * * *',
  $$ delete from public.analytics_events where created_at < now() - interval '90 days'; $$
);

-- Verify (should return one row showing the next scheduled run):
-- select jobname, schedule, active from cron.job where jobname = 'scrunch_analytics_retention_90d';
