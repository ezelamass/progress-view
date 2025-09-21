-- Add 'team' to the existing user_role enum
ALTER TYPE user_role ADD VALUE 'team';

-- Add RLS policies for team members on phases table
CREATE POLICY "Team members can view phases for assigned projects" 
ON public.phases 
FOR SELECT 
USING ((get_user_role(auth.uid()) = 'team'::user_role) AND user_has_project_access(auth.uid(), project_id));

CREATE POLICY "Team members can create phases for assigned projects" 
ON public.phases 
FOR INSERT 
WITH CHECK ((get_user_role(auth.uid()) = 'team'::user_role) AND user_has_project_access(auth.uid(), project_id));

CREATE POLICY "Team members can update phases for assigned projects" 
ON public.phases 
FOR UPDATE 
USING ((get_user_role(auth.uid()) = 'team'::user_role) AND user_has_project_access(auth.uid(), project_id));

-- Add RLS policies for team members on deliverables table
CREATE POLICY "Team members can view deliverables for assigned projects" 
ON public.deliverables 
FOR SELECT 
USING ((get_user_role(auth.uid()) = 'team'::user_role) AND user_has_project_access(auth.uid(), project_id));

CREATE POLICY "Team members can create deliverables for assigned projects" 
ON public.deliverables 
FOR INSERT 
WITH CHECK ((get_user_role(auth.uid()) = 'team'::user_role) AND user_has_project_access(auth.uid(), project_id));

CREATE POLICY "Team members can update deliverables for assigned projects" 
ON public.deliverables 
FOR UPDATE 
USING ((get_user_role(auth.uid()) = 'team'::user_role) AND user_has_project_access(auth.uid(), project_id));

-- Add RLS policies for team members on meetings table
CREATE POLICY "Team members can view meetings for assigned projects" 
ON public.meetings 
FOR SELECT 
USING ((get_user_role(auth.uid()) = 'team'::user_role) AND user_has_project_access(auth.uid(), project_id));

CREATE POLICY "Team members can create meetings for assigned projects" 
ON public.meetings 
FOR INSERT 
WITH CHECK ((get_user_role(auth.uid()) = 'team'::user_role) AND user_has_project_access(auth.uid(), project_id));

CREATE POLICY "Team members can update meetings for assigned projects" 
ON public.meetings 
FOR UPDATE 
USING ((get_user_role(auth.uid()) = 'team'::user_role) AND user_has_project_access(auth.uid(), project_id));

-- Add RLS policies for team members on projects table (read-only)
CREATE POLICY "Team members can view assigned projects" 
ON public.projects 
FOR SELECT 
USING ((get_user_role(auth.uid()) = 'team'::user_role) AND user_has_project_access(auth.uid(), id));

-- Add RLS policies for team members on activities table
CREATE POLICY "Team members can view activities for assigned projects" 
ON public.activities 
FOR SELECT 
USING ((get_user_role(auth.uid()) = 'team'::user_role) AND ((project_id IS NULL) OR user_has_project_access(auth.uid(), project_id)));

CREATE POLICY "Team members can create activities for assigned projects" 
ON public.activities 
FOR INSERT 
WITH CHECK ((get_user_role(auth.uid()) = 'team'::user_role) AND auth.uid() = user_id AND ((project_id IS NULL) OR user_has_project_access(auth.uid(), project_id)));