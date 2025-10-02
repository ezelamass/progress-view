-- Phase 1: Add Foreign Key Constraint and Fix RLS Policies

-- 1. Add foreign key constraint from team_payments.project_id to projects.id
ALTER TABLE public.team_payments
ADD CONSTRAINT team_payments_project_id_fkey
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- 2. Drop the existing team member view policy
DROP POLICY IF EXISTS "Team members can view their own payments" ON public.team_payments;

-- 3. Create new comprehensive RLS policy for team members
-- Team members can view payments that are:
-- a) Assigned to them (user_id matches)
-- b) Either have no project_id (general payments) OR belong to a project they're assigned to
CREATE POLICY "Team members can view their assigned project payments"
ON public.team_payments
FOR SELECT
USING (
    auth.uid() = user_id
    AND (
        project_id IS NULL 
        OR user_has_project_access(auth.uid(), project_id)
    )
);

-- 4. Add index for better performance on project_id lookups
CREATE INDEX IF NOT EXISTS idx_team_payments_project_id ON public.team_payments(project_id);
CREATE INDEX IF NOT EXISTS idx_team_payments_user_id ON public.team_payments(user_id);