-- Update the team member profile to have proper first_name and last_name
UPDATE profiles 
SET first_name = 'Team', last_name = 'Member'
WHERE role = 'team' AND (first_name IS NULL OR last_name IS NULL);

-- Add some test team payment data for the team member to see filtering in action
INSERT INTO team_payments (user_id, project_id, amount, payment_type, status, description, payment_date, due_date, currency) VALUES
-- Get the team member user_id from profiles
((SELECT user_id FROM profiles WHERE role = 'team' LIMIT 1), 
 (SELECT id FROM projects LIMIT 1), 
 2500.00, 
 'desarrollo', 
 'paid', 
 'Frontend development - Q1', 
 '2024-01-15', 
 NULL, 
 'USD'),

((SELECT user_id FROM profiles WHERE role = 'team' LIMIT 1), 
 (SELECT id FROM projects LIMIT 1), 
 1800.00, 
 'mantenimiento', 
 'pending', 
 'Bug fixes and maintenance', 
 NULL, 
 '2024-02-15', 
 'USD'),

((SELECT user_id FROM profiles WHERE role = 'team' LIMIT 1), 
 NULL, 
 500.00, 
 'bonus', 
 'paid', 
 'Performance bonus', 
 '2024-01-30', 
 NULL, 
 'USD'),

((SELECT user_id FROM profiles WHERE role = 'team' LIMIT 1), 
 (SELECT id FROM projects LIMIT 1), 
 3200.00, 
 'desarrollo', 
 'pending', 
 'Backend API development', 
 NULL, 
 '2024-02-28', 
 'USD');