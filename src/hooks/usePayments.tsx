import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Payment = Database['public']['Tables']['payments']['Row'];
type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type PaymentUpdate = Database['public']['Tables']['payments']['Update'];

export interface PaymentWithProject extends Payment {
  projects?: {
    name: string;
    clients?: {
      company: string;
      name: string;
    };
  };
}

export const usePayments = () => {
  const [payments, setPayments] = useState<PaymentWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          projects:project_id (
            name,
            clients:client_id (
              company,
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (payment: PaymentInsert) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select(`
          *,
          projects:project_id (
            name,
            clients:client_id (
              company,
              name
            )
          )
        `)
        .single();

      if (error) throw error;
      
      setPayments(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Payment created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Error",
        description: "Failed to create payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePayment = async (id: string, updates: PaymentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          projects:project_id (
            name,
            clients:client_id (
              company,
              name
            )
          )
        `)
        .single();

      if (error) throw error;
      
      setPayments(prev => 
        prev.map(item => item.id === id ? data : item)
      );
      toast({
        title: "Success",
        description: "Payment updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPayments(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Payment deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    const updates: PaymentUpdate = {
      status: status as any,
      payment_date: status === 'paid' ? new Date().toISOString().split('T')[0] : null,
    };
    
    return updatePayment(id, updates);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    createPayment,
    updatePayment,
    deletePayment,
    updatePaymentStatus,
    refetch: fetchPayments,
  };
};