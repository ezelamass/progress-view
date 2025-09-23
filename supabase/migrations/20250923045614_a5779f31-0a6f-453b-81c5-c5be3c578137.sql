-- First, let's check current payment_type values and update the constraint
-- Update any existing 'salary' records to use proper types
UPDATE team_payments 
SET payment_type = 'desarrollo' 
WHERE payment_type = 'salary';

-- Add proper check constraint for payment_type
ALTER TABLE team_payments 
DROP CONSTRAINT IF EXISTS team_payments_payment_type_check;

ALTER TABLE team_payments 
ADD CONSTRAINT team_payments_payment_type_check 
CHECK (payment_type IN ('mantenimiento', 'desarrollo', 'bonus', 'commission', 'reimbursement'));