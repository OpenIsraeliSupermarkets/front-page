-- Enable the pg_cron extension
create extension if not exists pg_cron;
create extension if not exists pg_net;
-- Grant usage to postgres user
grant usage on schema cron to postgres;

create table if not exists public.app_settings (
    key text primary key,
    value text not null
);
insert into public.app_settings (key, value)
values ('ANON_KEY', 'your_anon_key_here')
on conflict (key) do update set value = excluded.value;

-- Create the cron job to run every 5 minutes
select cron.schedule(
  'health-check-every-1-minute',    -- name of the cron job
  '*/1 * * * *',                    -- every 5 minutes
  $$
  select
    net.http_post(
      url := 'https://sjifhmsdzwktdglnpyba.supabase.co/functions/v1/health',
      headers := format('{"Content-Type": "application/json", "Authorization": "Bearer %s"}',
        (select value from public.app_settings where key = 'ANON_KEY'))::jsonb,
      body := '{"name":"Functions"}'::jsonb
    ) as request_id;
  $$
); 