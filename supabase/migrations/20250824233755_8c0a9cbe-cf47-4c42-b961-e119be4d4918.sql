-- Enable real-time functionality for relevant tables
-- This allows Supabase to broadcast changes to subscribed clients

-- Make sure tables have full replica identity for real-time
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.payments REPLICA IDENTITY FULL;
ALTER TABLE public.deliverables REPLICA IDENTITY FULL;
ALTER TABLE public.activities REPLICA IDENTITY FULL;

-- Add tables to the realtime publication
-- This enables real-time subscriptions for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deliverables;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;