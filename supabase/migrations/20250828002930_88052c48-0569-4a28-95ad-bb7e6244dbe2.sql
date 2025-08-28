-- Add loom_url column to deliverables table
ALTER TABLE public.deliverables 
ADD COLUMN loom_url text;