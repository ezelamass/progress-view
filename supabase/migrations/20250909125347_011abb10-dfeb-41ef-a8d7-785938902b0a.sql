-- Add is_bonus column to deliverables table
ALTER TABLE public.deliverables 
ADD COLUMN is_bonus BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for better performance when filtering bonus deliverables
CREATE INDEX idx_deliverables_is_bonus ON public.deliverables(is_bonus);

-- Add comment for documentation
COMMENT ON COLUMN public.deliverables.is_bonus IS 'Indicates if this deliverable is a bonus/extra deliverable';