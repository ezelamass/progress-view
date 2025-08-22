-- Create enums for better type safety
CREATE TYPE public.user_role AS ENUM ('admin', 'client');
CREATE TYPE public.project_status AS ENUM ('active', 'paused', 'completed', 'cancelled');
CREATE TYPE public.deliverable_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');
CREATE TYPE public.deliverable_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE public.activity_type AS ENUM ('project_created', 'project_updated', 'deliverable_created', 'deliverable_updated', 'payment_created', 'payment_updated', 'client_created', 'client_updated');

-- Create profiles table for user authentication and roles
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role user_role NOT NULL DEFAULT 'client',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create clients table for company information
CREATE TABLE public.clients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    logo_url TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create projects table for project management
CREATE TABLE public.projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status project_status NOT NULL DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    roi_config JSONB NOT NULL DEFAULT '{"employees": 10, "hoursSaved": 20, "hourlyRate": 50}',
    environment TEXT NOT NULL DEFAULT 'production',
    drive_folder_url TEXT,
    calendly_link TEXT,
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create deliverables table for project milestones
CREATE TABLE public.deliverables (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status deliverable_status NOT NULL DEFAULT 'pending',
    priority deliverable_priority NOT NULL DEFAULT 'medium',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create payments table for payment management
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    payment_date DATE,
    description TEXT,
    invoice_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create user_project_assignments for multi-tenant access control
CREATE TABLE public.user_project_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);

-- Create activities table for audit trail
CREATE TABLE public.activities (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    activity_type activity_type NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to prevent recursive RLS issues
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.user_has_project_access(user_uuid UUID, project_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_project_assignments 
        WHERE user_id = user_uuid AND project_id = project_uuid
    );
$$;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for clients table
CREATE POLICY "Admins can manage all clients" ON public.clients
    FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Clients can view their own client info" ON public.clients
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'client' AND
        EXISTS (
            SELECT 1 FROM public.projects p
            INNER JOIN public.user_project_assignments upa ON p.id = upa.project_id
            WHERE p.client_id = clients.id AND upa.user_id = auth.uid()
        )
    );

-- RLS Policies for projects table
CREATE POLICY "Admins can manage all projects" ON public.projects
    FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Clients can view their assigned projects" ON public.projects
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'client' AND
        public.user_has_project_access(auth.uid(), id)
    );

-- RLS Policies for deliverables table
CREATE POLICY "Admins can manage all deliverables" ON public.deliverables
    FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Clients can view deliverables for their projects" ON public.deliverables
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'client' AND
        public.user_has_project_access(auth.uid(), project_id)
    );

-- RLS Policies for payments table
CREATE POLICY "Admins can manage all payments" ON public.payments
    FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Clients can view payments for their projects" ON public.payments
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'client' AND
        public.user_has_project_access(auth.uid(), project_id)
    );

-- RLS Policies for user_project_assignments table
CREATE POLICY "Admins can manage all assignments" ON public.user_project_assignments
    FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can view their own assignments" ON public.user_project_assignments
    FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for activities table
CREATE POLICY "Admins can view all activities" ON public.activities
    FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Clients can view activities for their projects" ON public.activities
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'client' AND
        (project_id IS NULL OR public.user_has_project_access(auth.uid(), project_id))
    );

CREATE POLICY "All authenticated users can insert activities" ON public.activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name',
        COALESCE(NEW.raw_user_meta_data ->> 'role', 'client')::user_role
    );
    RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deliverables_updated_at
    BEFORE UPDATE ON public.deliverables
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically update deliverable status to overdue
CREATE OR REPLACE FUNCTION public.update_overdue_deliverables()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.deliverables 
    SET status = 'overdue'
    WHERE due_date < CURRENT_DATE 
    AND status NOT IN ('completed', 'overdue');
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_deliverables_project_id ON public.deliverables(project_id);
CREATE INDEX idx_deliverables_due_date ON public.deliverables(due_date);
CREATE INDEX idx_deliverables_status ON public.deliverables(status);
CREATE INDEX idx_payments_project_id ON public.payments(project_id);
CREATE INDEX idx_payments_due_date ON public.payments(due_date);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_user_project_assignments_user_id ON public.user_project_assignments(user_id);
CREATE INDEX idx_user_project_assignments_project_id ON public.user_project_assignments(project_id);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_project_id ON public.activities(project_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at);