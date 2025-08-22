import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Deliverable = Database['public']['Tables']['deliverables']['Row'];
type DeliverableInsert = Database['public']['Tables']['deliverables']['Insert'];
type DeliverableUpdate = Database['public']['Tables']['deliverables']['Update'];

export interface DeliverableWithProject extends Deliverable {
  projects?: {
    name: string;
    clients?: {
      company: string;
    };
  };
}

export const useDeliverables = (projectId?: string) => {
  const [deliverables, setDeliverables] = useState<DeliverableWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDeliverables = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deliverables')
        .select(`
          *,
          projects:project_id (
            name,
            clients:client_id (
              company
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliverables(data || []);
    } catch (error) {
      console.error('Error fetching deliverables:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deliverables",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDeliverable = async (deliverable: DeliverableInsert) => {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .insert(deliverable)
        .select(`
          *,
          projects:project_id (
            name,
            clients:client_id (
              company
            )
          )
        `)
        .single();

      if (error) throw error;
      
      setDeliverables(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Deliverable created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating deliverable:', error);
      toast({
        title: "Error",
        description: "Failed to create deliverable",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateDeliverable = async (id: string, updates: DeliverableUpdate) => {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          projects:project_id (
            name,
            clients:client_id (
              company
            )
          )
        `)
        .single();

      if (error) throw error;
      
      setDeliverables(prev => 
        prev.map(item => item.id === id ? data : item)
      );
      toast({
        title: "Success",
        description: "Deliverable updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating deliverable:', error);
      toast({
        title: "Error",
        description: "Failed to update deliverable",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteDeliverable = async (id: string) => {
    try {
      const { error } = await supabase
        .from('deliverables')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDeliverables(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Deliverable deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting deliverable:', error);
      toast({
        title: "Error",
        description: "Failed to delete deliverable",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateDeliverableStatus = async (id: string, status: string) => {
    const updates: DeliverableUpdate = {
      status: status as any,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    };
    
    return updateDeliverable(id, updates);
  };

  useEffect(() => {
    fetchDeliverables();
  }, [projectId]);

  return {
    deliverables,
    loading,
    createDeliverable,
    updateDeliverable,
    deleteDeliverable,
    updateDeliverableStatus,
    refetch: fetchDeliverables,
  };
};