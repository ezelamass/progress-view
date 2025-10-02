import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';

type TeamPayment = Database['public']['Tables']['team_payments']['Row'];
type TeamPaymentInsert = Database['public']['Tables']['team_payments']['Insert'];
type TeamPaymentUpdate = Database['public']['Tables']['team_payments']['Update'];

export interface TeamPaymentWithDetails extends TeamPayment {
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
  projects?: {
    name: string;
  } | null;
}

export const useTeamPayments = (projectId?: string) => {
  const [payments, setPayments] = useState<TeamPaymentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, session } = useAuth();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      if (!session || !user) {
        setPayments([]);
        setLoading(false);
        return;
      }

      // RLS handles filtering - only user's payments for assigned projects are returned
      let query = supabase
        .from('team_payments')
        .select(`
          *,
          projects:project_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      // Optional: filter by specific project
      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setPayments((data as unknown) as TeamPaymentWithDetails[] || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch team payments",
        variant: "destructive",
      });
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (payment: TeamPaymentInsert) => {
    try {
      const { error } = await supabase
        .from('team_payments')
        .insert(payment);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team payment created successfully",
      });

      fetchPayments();
    } catch (error) {
      console.error('Error creating team payment:', error);
      toast({
        title: "Error",
        description: "Failed to create team payment",
        variant: "destructive",
      });
    }
  };

  const updatePayment = async (id: string, updates: TeamPaymentUpdate) => {
    try {
      const { error } = await supabase
        .from('team_payments')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team payment updated successfully",
      });

      fetchPayments();
    } catch (error) {
      console.error('Error updating team payment:', error);
      toast({
        title: "Error",
        description: "Failed to update team payment",
        variant: "destructive",
      });
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_payments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team payment deleted successfully",
      });

      fetchPayments();
    } catch (error) {
      console.error('Error deleting team payment:', error);
      toast({
        title: "Error",
        description: "Failed to delete team payment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (session && user) {
      fetchPayments();
    }
  }, [projectId, session, user]);

  return {
    payments,
    loading,
    createPayment,
    updatePayment,
    deletePayment,
    refetch: fetchPayments,
  };
};