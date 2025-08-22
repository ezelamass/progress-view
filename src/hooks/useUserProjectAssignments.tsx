import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProjectAssignment {
  id: string;
  user_id: string;
  project_id: string;
  assigned_at: string;
  profiles: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
  projects: {
    name: string;
    clients: {
      company: string;
    };
  };
}

export interface User {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export interface Project {
  id: string;
  name: string;
  clients: {
    company: string;
  };
}

export const useUserProjectAssignments = () => {
  const [assignments, setAssignments] = useState<UserProjectAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchAssignments = async () => {
    try {
      // First get assignments
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('user_project_assignments')
        .select(`
          id,
          user_id,
          project_id,
          assigned_at
        `)
        .order('assigned_at', { ascending: false });

      if (assignmentError) throw assignmentError;

      if (!assignmentData || assignmentData.length === 0) {
        setAssignments([]);
        return;
      }

      // Get user IDs and project IDs
      const userIds = [...new Set(assignmentData.map(a => a.user_id))];
      const projectIds = [...new Set(assignmentData.map(a => a.project_id))];

      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, first_name, last_name')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Fetch projects with clients
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          clients (
            company
          )
        `)
        .in('id', projectIds);

      if (projectsError) throw projectsError;

      // Combine data
      const enrichedAssignments = assignmentData.map(assignment => ({
        ...assignment,
        profiles: profilesData?.find(p => p.user_id === assignment.user_id) || {
          email: 'Unknown',
          first_name: null,
          last_name: null
        },
        projects: projectsData?.find(p => p.id === assignment.project_id) || {
          name: 'Unknown Project',
          clients: { company: 'Unknown Client' }
        }
      }));

      setAssignments(enrichedAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user-project assignments",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, email, first_name, last_name')
        .order('email');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          clients (
            company
          )
        `)
        .order('name');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    }
  };

  const createAssignment = async (userId: string, projectId: string) => {
    try {
      setSubmitting(true);

      // Check if assignment already exists
      const { data: existing } = await supabase
        .from('user_project_assignments')
        .select('id')
        .eq('user_id', userId)
        .eq('project_id', projectId)
        .single();

      if (existing) {
        toast({
          title: "Assignment already exists",
          description: "This user is already assigned to this project",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('user_project_assignments')
        .insert({
          user_id: userId,
          project_id: projectId,
        });

      if (error) throw error;

      toast({
        title: "Assignment created",
        description: "User has been successfully assigned to the project",
      });

      await fetchAssignments();
      return true;
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('user_project_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Assignment removed",
        description: "User assignment has been removed from the project",
      });

      await fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to remove assignment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAssignments(),
        fetchUsers(),
        fetchProjects(),
      ]);
      setLoading(false);
    };

    loadData();

    // Set up real-time subscription for assignments
    const channel = supabase
      .channel('user-project-assignments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_project_assignments' },
        () => {
          fetchAssignments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    assignments,
    users,
    projects,
    loading,
    submitting,
    createAssignment,
    deleteAssignment,
    refetch: fetchAssignments,
  };
};