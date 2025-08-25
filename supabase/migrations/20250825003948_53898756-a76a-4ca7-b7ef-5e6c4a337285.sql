-- Add attachments column to deliverables table
ALTER TABLE public.deliverables 
ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;

-- Create RLS policies for deliverable file access in project-documents bucket
CREATE POLICY "Users can view deliverable files for their projects" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'project-documents' AND 
  (storage.foldername(name))[1] = 'deliverables' AND
  (
    get_user_role(auth.uid()) = 'admin'::user_role OR 
    (
      get_user_role(auth.uid()) = 'client'::user_role AND
      EXISTS (
        SELECT 1 FROM public.deliverables d
        JOIN public.projects p ON d.project_id = p.id
        WHERE user_has_project_access(auth.uid(), p.id)
        AND (storage.foldername(name))[2] = d.id::text
      )
    )
  )
);

CREATE POLICY "Users can upload deliverable files for their projects" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'project-documents' AND 
  (storage.foldername(name))[1] = 'deliverables' AND
  (
    get_user_role(auth.uid()) = 'admin'::user_role OR 
    (
      get_user_role(auth.uid()) = 'client'::user_role AND
      EXISTS (
        SELECT 1 FROM public.deliverables d
        JOIN public.projects p ON d.project_id = p.id
        WHERE user_has_project_access(auth.uid(), p.id)
        AND (storage.foldername(name))[2] = d.id::text
      )
    )
  )
);

CREATE POLICY "Users can delete deliverable files for their projects" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'project-documents' AND 
  (storage.foldername(name))[1] = 'deliverables' AND
  (
    get_user_role(auth.uid()) = 'admin'::user_role OR 
    (
      get_user_role(auth.uid()) = 'client'::user_role AND
      EXISTS (
        SELECT 1 FROM public.deliverables d
        JOIN public.projects p ON d.project_id = p.id
        WHERE user_has_project_access(auth.uid(), p.id)
        AND (storage.foldername(name))[2] = d.id::text
      )
    )
  )
);