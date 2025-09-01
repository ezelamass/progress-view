import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: 'payment' | 'project' | 'client';
  message: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
}

export const useAdminAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const [paymentsResponse, deliverablesResponse, activitiesResponse] = await Promise.all([
        // Check for overdue payments
        supabase
          .from('payments')
          .select('id, amount, due_date, status')
          .neq('status', 'paid')
          .lt('due_date', new Date().toISOString().split('T')[0]),

        // Check for upcoming deliverables
        supabase
          .from('deliverables')
          .select('id, name, due_date, status')
          .neq('status', 'completed')
          .gte('due_date', new Date().toISOString().split('T')[0])
          .lte('due_date', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),

        // Check for client activity (last contact)
        supabase
          .from('activities')
          .select('project_id, created_at')
          .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      if (paymentsResponse.error) throw paymentsResponse.error;
      if (deliverablesResponse.error) throw deliverablesResponse.error;
      if (activitiesResponse.error) throw activitiesResponse.error;

      const generatedAlerts: Alert[] = [];

      // Overdue payments alert
      const overduePayments = paymentsResponse.data || [];
      if (overduePayments.length > 0) {
        const totalOverdue = overduePayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        generatedAlerts.push({
          id: 'overdue-payments',
          type: 'payment',
          message: `${overduePayments.length} payments overdue - $${totalOverdue.toLocaleString()} total`,
          priority: 'high',
          action: 'View Payments'
        });
      }

      // Upcoming deliverables alert
      const upcomingDeliverables = deliverablesResponse.data || [];
      if (upcomingDeliverables.length > 0) {
        generatedAlerts.push({
          id: 'upcoming-deliverables',
          type: 'project',
          message: `${upcomingDeliverables.length} deliverables due within 3 days`,
          priority: 'medium',
          action: 'View Projects'
        });
      }

      // Inactive clients alert (simplified - would need more complex query for actual implementation)
      const inactiveActivities = activitiesResponse.data || [];
      if (inactiveActivities.length > 0) {
        generatedAlerts.push({
          id: 'inactive-clients',
          type: 'client',
          message: `Some clients haven't been contacted recently`,
          priority: 'low',
          action: 'View Clients'
        });
      }

      setAlerts(generatedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts,
    loading,
    refetch: fetchAlerts,
  };
};