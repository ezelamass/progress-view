import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type TeamPaymentRate = Database['public']['Tables']['team_payment_rates']['Row'];
type TeamPaymentRateInsert = Database['public']['Tables']['team_payment_rates']['Insert'];
type TeamPaymentRateUpdate = Database['public']['Tables']['team_payment_rates']['Update'];

export interface TeamPaymentRateWithDetails extends TeamPaymentRate {
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
  projects?: {
    name: string;
  } | null;
}

export const useTeamPaymentRates = () => {
  const [rates, setRates] = useState<TeamPaymentRateWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_payment_rates')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          ),
          projects:project_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRates((data as unknown) as TeamPaymentRateWithDetails[] || []);
    } catch (error) {
      console.error('Error fetching team payment rates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch team payment rates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRate = async (rate: TeamPaymentRateInsert) => {
    try {
      const { error } = await supabase
        .from('team_payment_rates')
        .insert(rate);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team payment rate created successfully",
      });

      fetchRates();
    } catch (error) {
      console.error('Error creating team payment rate:', error);
      toast({
        title: "Error", 
        description: "Failed to create team payment rate",
        variant: "destructive",
      });
    }
  };

  const updateRate = async (id: string, updates: TeamPaymentRateUpdate) => {
    try {
      const { error } = await supabase
        .from('team_payment_rates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team payment rate updated successfully",
      });

      fetchRates();
    } catch (error) {
      console.error('Error updating team payment rate:', error);
      toast({
        title: "Error",
        description: "Failed to update team payment rate",
        variant: "destructive",
      });
    }
  };

  const deleteRate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_payment_rates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team payment rate deleted successfully",
      });

      fetchRates();
    } catch (error) {
      console.error('Error deleting team payment rate:', error);
      toast({
        title: "Error",
        description: "Failed to delete team payment rate",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return {
    rates,
    loading,
    createRate,
    updateRate,
    deleteRate,
    refetch: fetchRates,
  };
};