-- Add "mantenimiento" and "desarrollo" as specific payment types
-- First, let's see what payment types currently exist and update accordingly

-- Update team_payments table to use specific payment types if not already constrained
-- Add a check constraint for payment_type to ensure only valid types are used
ALTER TABLE public.team_payments 
DROP CONSTRAINT IF EXISTS team_payments_payment_type_check;

ALTER TABLE public.team_payments 
ADD CONSTRAINT team_payments_payment_type_check 
CHECK (payment_type IN ('salary', 'hourly', 'bonus', 'commission', 'mantenimiento', 'desarrollo'));

-- Update existing generic payment types to the new specific types
-- This is a safe migration that assigns logical defaults
UPDATE public.team_payments 
SET payment_type = 'desarrollo' 
WHERE payment_type IN ('project', 'development', 'task') OR payment_type IS NULL;

UPDATE public.team_payments 
SET payment_type = 'mantenimiento' 
WHERE payment_type IN ('maintenance', 'support', 'fix');

-- Ensure all payment_type fields have valid values
UPDATE public.team_payments 
SET payment_type = 'desarrollo' 
WHERE payment_type NOT IN ('salary', 'hourly', 'bonus', 'commission', 'mantenimiento', 'desarrollo');