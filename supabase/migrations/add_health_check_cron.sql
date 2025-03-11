-- Enable the pg_cron extension
create extension if not exists pg_cron;

-- Grant usage to postgres user
grant usage on schema cron to postgres;

-- Create the cron job to run every 5 minutes
select cron.schedule(
  'health-check-every-5-minutes',    -- name of the cron job
  '*/5 * * * *',                    -- every 5 minutes
  $$
  select
    net.http_post(
      url := 'http://localhost:54321/functions/v1/health',  -- function endpoint
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
    ) as request_id;
  $$
); 