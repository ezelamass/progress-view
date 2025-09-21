import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];

export interface ProjectWithClient extends Project {
  clients?: {
    id: string;
    company: string;
    name: string;
    logo_url?: string;
  };
}

export const useProjects = (user?: any) => {
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Use provided user or get current user
      const currentUser = user || (await supabase.auth.getUser()).data.user;
      if (!currentUser) {
        setProjects([]);
        return;
      }

      // Get user profile to check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', currentUser.id)
        .single();

       let query = supabase
        .from('projects')
        .select(`
          *,
          clients:client_id (
            id,
            company,
            name,
            logo_url
          )
        `);

      // If user is a client or team member, only fetch their assigned projects
      if (profile?.role === 'client' || profile?.role === 'team') {
        
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            clients:client_id (
              id,
              company,
              name,
              logo_url
            ),
            user_project_assignments!inner(user_id)
           `)
           .eq('user_project_assignments.user_id', currentUser.id)
           .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } else {
        // Admin can see all projects
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  return {
    projects,
    loading,
    refetch: fetchProjects,
  };
};