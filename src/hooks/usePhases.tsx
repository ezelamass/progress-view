import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define types locally since the table might not be in generated types yet
type Phase = {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  phase_type: 'descubrimiento' | 'desarrollo' | 'testing_implementacion';
  start_date: string;
  end_date: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  order_index: number;
  created_at: string;
  updated_at: string;
};

type PhaseInsert = Omit<Phase, 'id' | 'created_at' | 'updated_at' | 'status'>;
type PhaseUpdate = Partial<PhaseInsert>;

export interface PhaseWithDeliverables extends Phase {
  deliverables?: Array<{
    id: string;
    name: string;
    due_date: string;
    status: string;
    priority: string;
  }>;
}

export const usePhases = (projectId?: string) => {
  const [phases, setPhases] = useState<PhaseWithDeliverables[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPhases = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('phases' as any)
        .select(`
          *,
          deliverables (
            id,
            name,
            due_date,
            status,
            priority
          )
        `)
        .order('order_index', { ascending: true });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Calculate status based on current date
      const now = new Date();
      const phasesWithStatus = (data || []).map((phase: any) => {
        const startDate = new Date(phase.start_date);
        const endDate = new Date(phase.end_date);
        
        let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';
        
        if (now > endDate) {
          status = 'completed';
        } else if (now >= startDate && now <= endDate) {
          status = 'in_progress';
        }
        
        return {
          ...phase,
          status,
        };
      });
      
      setPhases(phasesWithStatus);
    } catch (error) {
      console.error('Error fetching phases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch phases",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPhase = async (phase: PhaseInsert) => {
    try {
      const { error } = await supabase.from('phases' as any).insert(phase);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Phase created successfully",
      });
      
      await fetchPhases();
    } catch (error) {
      console.error('Error creating phase:', error);
      toast({
        title: "Error",
        description: "Failed to create phase",
        variant: "destructive",
      });
    }
  };

  const updatePhase = async (id: string, updates: PhaseUpdate) => {
    try {
      const { error } = await supabase
        .from('phases' as any)
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Phase updated successfully",
      });
      
      await fetchPhases();
    } catch (error) {
      console.error('Error updating phase:', error);
      toast({
        title: "Error",
        description: "Failed to update phase",
        variant: "destructive",
      });
    }
  };

  const deletePhase = async (id: string) => {
    try {
      const { error } = await supabase.from('phases' as any).delete().eq('id', id);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Phase deleted successfully",
      });
      
      await fetchPhases();
    } catch (error) {
      console.error('Error deleting phase:', error);
      toast({
        title: "Error",
        description: "Failed to delete phase",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPhases();
  }, [projectId]);

  return {
    phases,
    loading,
    createPhase,
    updatePhase,
    deletePhase,
    refetch: fetchPhases,
  };
};