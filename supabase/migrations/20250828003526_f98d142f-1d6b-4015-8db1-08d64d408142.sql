-- Create phase_type enum
CREATE TYPE public.phase_type AS ENUM ('descubrimiento', 'desarrollo', 'testing_implementacion');

-- Create phase_status enum  
CREATE TYPE public.phase_status AS ENUM ('not_started', 'in_progress', 'completed', 'blocked');

-- Create phases table
CREATE TABLE public.phases (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    phase_type phase_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status phase_status NOT NULL DEFAULT 'not_started',
    progress_percentage INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT phases_progress_check CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    CONSTRAINT phases_dates_check CHECK (start_date <= end_date)
);

-- Add foreign key reference to projects
ALTER TABLE public.phases 
ADD CONSTRAINT phases_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Add optional phase_id to deliverables for manual assignment
ALTER TABLE public.deliverables 
ADD COLUMN phase_id UUID REFERENCES public.phases(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for phases
CREATE POLICY "Admins can manage all phases" 
ON public.phases 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Clients can view phases for their projects" 
ON public.phases 
FOR SELECT 
USING (
    get_user_role(auth.uid()) = 'client' 
    AND user_has_project_access(auth.uid(), project_id)
);

-- Create indexes for better performance
CREATE INDEX idx_phases_project_id ON public.phases(project_id);
CREATE INDEX idx_phases_start_date ON public.phases(start_date);
CREATE INDEX idx_phases_end_date ON public.phases(end_date);
CREATE INDEX idx_deliverables_phase_id ON public.deliverables(phase_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_phases_updated_at
    BEFORE UPDATE ON public.phases
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default phases for existing projects
INSERT INTO public.phases (project_id, name, description, phase_type, start_date, end_date, order_index, status, progress_percentage)
SELECT 
    id as project_id,
    'Descubrimiento y Configuración' as name,
    'Recopilación de información y configuración inicial del proyecto' as description,
    'descubrimiento' as phase_type,
    start_date,
    start_date + INTERVAL '7 days' as end_date,
    1 as order_index,
    CASE 
        WHEN progress_percentage >= 25 THEN 'completed'::phase_status
        WHEN progress_percentage > 0 THEN 'in_progress'::phase_status
        ELSE 'not_started'::phase_status
    END as status,
    CASE 
        WHEN progress_percentage >= 25 THEN 100
        WHEN progress_percentage > 0 THEN (progress_percentage * 4)
        ELSE 0
    END as progress_percentage
FROM public.projects
WHERE status = 'active';

INSERT INTO public.phases (project_id, name, description, phase_type, start_date, end_date, order_index, status, progress_percentage)
SELECT 
    id as project_id,
    'Desarrollo e Implementación' as name,
    'Desarrollo de la solución y implementación de características principales' as description,
    'desarrollo' as phase_type,
    start_date + INTERVAL '7 days',
    end_date - INTERVAL '7 days' as end_date,
    2 as order_index,
    CASE 
        WHEN progress_percentage >= 75 THEN 'completed'::phase_status
        WHEN progress_percentage >= 25 THEN 'in_progress'::phase_status
        ELSE 'not_started'::phase_status
    END as status,
    CASE 
        WHEN progress_percentage >= 75 THEN 100
        WHEN progress_percentage >= 25 THEN ((progress_percentage - 25) * 2)
        ELSE 0
    END as progress_percentage
FROM public.projects
WHERE status = 'active';

INSERT INTO public.phases (project_id, name, description, phase_type, start_date, end_date, order_index, status, progress_percentage)
SELECT 
    id as project_id,
    'Testing e Implementación Final' as name,
    'Pruebas finales y puesta en producción' as description,
    'testing_implementacion' as phase_type,
    end_date - INTERVAL '7 days',
    end_date,
    3 as order_index,
    CASE 
        WHEN progress_percentage >= 100 THEN 'completed'::phase_status
        WHEN progress_percentage >= 75 THEN 'in_progress'::phase_status
        ELSE 'not_started'::phase_status
    END as status,
    CASE 
        WHEN progress_percentage >= 100 THEN 100
        WHEN progress_percentage >= 75 THEN ((progress_percentage - 75) * 4)
        ELSE 0
    END as progress_percentage
FROM public.projects
WHERE status = 'active';