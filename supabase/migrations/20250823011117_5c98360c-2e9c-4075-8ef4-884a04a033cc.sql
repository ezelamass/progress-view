-- Create storage policies for client logos and documents
INSERT INTO storage.buckets (id, name, public) VALUES ('client-logos', 'client-logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false);

-- Create policies for client logo uploads (public bucket)
CREATE POLICY "Client logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'client-logos');

CREATE POLICY "Admins can upload client logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'client-logos' AND get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Admins can update client logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'client-logos' AND get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Admins can delete client logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'client-logos' AND get_user_role(auth.uid()) = 'admin'::user_role);

-- Create policies for project document uploads (private bucket)
CREATE POLICY "Users can view documents for their projects" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'project-documents' AND 
  (
    get_user_role(auth.uid()) = 'admin'::user_role OR
    (
      get_user_role(auth.uid()) = 'client'::user_role AND
      EXISTS (
        SELECT 1 FROM user_project_assignments upa
        WHERE upa.user_id = auth.uid() 
        AND (storage.foldername(name))[1] = upa.project_id::text
      )
    )
  )
);

CREATE POLICY "Admins can upload project documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-documents' AND get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Admins can update project documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-documents' AND get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Admins can delete project documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-documents' AND get_user_role(auth.uid()) = 'admin'::user_role);