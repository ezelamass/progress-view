import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/integrations/supabase/types';

type Activity = Database['public']['Tables']['activities']['Row'];

export interface ActivityWithProject extends Activity {
  projects?: {
    id: string;
    name: string;
  };
}

export const useActivities = (projectId?: string, limit: number = 10) => {
  const [activities, setActivities] = useState<ActivityWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useAuth();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('activities')
        .select(`
          *,
          projects:project_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      // Filter by project if specified
      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch activities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData: {
    project_id?: string;
    activity_type: 'payment_created' | 'project_updated' | 'deliverable_created' | 'deliverable_updated';
    description: string;
    metadata?: any;
  }) => {
    try {
      const { error } = await supabase
        .from('activities')
        .insert({
          ...activityData,
          user_id: profile?.user_id || '',
        });

      if (error) throw error;
      
      // Refetch activities
      await fetchActivities();
      
      return { error: null };
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({
        title: "Error",
        description: "Failed to create activity",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [projectId, limit]);

  return {
    activities,
    loading,
    refetch: fetchActivities,
    createActivity,
  };
};