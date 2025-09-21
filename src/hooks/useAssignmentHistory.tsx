import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AssignmentHistory {
  id: string;
  user_id: string;
  project_id: string;
  assigned_at: string;
  unassigned_at?: string;
  assigned_by?: string;
  action: 'assigned' | 'unassigned';
  user_name: string;
  user_email: string;
  user_role: string;
  project_name: string;
  client_company: string;
}

export const useAssignmentHistory = () => {
  const [history, setHistory] = useState<AssignmentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Get current assignments (active)
      const { data: currentAssignments, error: currentError } = await supabase
        .from('user_project_assignments')
        .select(`
          id,
          user_id,
          project_id,
          assigned_at
        `)
        .order('assigned_at', { ascending: false });

      if (currentError) {
        console.error('Error fetching assignment history:', currentError);
        return;
      }

      // Fetch user and project details separately for each assignment
      const transformedHistory: AssignmentHistory[] = [];
      
      for (const assignment of currentAssignments || []) {
        // Fetch user details
        const { data: userData } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, role')
          .eq('user_id', assignment.user_id)
          .single();
        
        // Fetch project details  
        const { data: projectData } = await supabase
          .from('projects')
          .select('name, clients(company)')
          .eq('id', assignment.project_id)
          .single();

        if (userData && projectData) {
          transformedHistory.push({
            id: assignment.id,
            user_id: assignment.user_id,
            project_id: assignment.project_id,
            assigned_at: assignment.assigned_at,
            action: 'assigned' as const,
            user_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email,
            user_email: userData.email,
            user_role: userData.role,
            project_name: projectData.name,
            client_company: projectData.clients?.company || 'Unknown Company'
          });
        }
      }

      setHistory(transformedHistory);
    } catch (error: any) {
      console.error('Error fetching assignment history:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch assignment history.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logAssignmentAction = async (
    userId: string, 
    projectId: string, 
    action: 'assigned' | 'unassigned'
  ) => {
    try {
      // This could be expanded to log to a separate history table
      // For now, we just refetch the current state
      await fetchHistory();
    } catch (error) {
      console.error('Error logging assignment action:', error);
    }
  };

  const refetch = () => {
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();

    // Set up real-time subscription for assignment changes
    const subscription = supabase
      .channel('assignment_history_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_project_assignments'
      }, () => {
        fetchHistory();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    history,
    loading,
    logAssignmentAction,
    refetch
  };
};