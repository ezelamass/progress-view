import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminMetrics {
  totalClients: number;
  activeProjects: number;
  monthlyRevenue: number;
  outstandingPayments: number;
  avgProjectProgress: number;
  overduePaymentsCount: number;
  clientGrowthData: Array<{ month: string; clients: number }>;
}

export const useAdminMetrics = () => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalClients: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    outstandingPayments: 0,
    avgProjectProgress: 0,
    overduePaymentsCount: 0,
    clientGrowthData: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMetrics = async () => {
    try {
      setLoading(true);

      // Fetch all required data in parallel
      const [
        clientsResponse,
        projectsResponse,
        paymentsResponse,
        clientGrowthResponse
      ] = await Promise.all([
        // Total active clients
        supabase
          .from('clients')
          .select('id, created_at')
          .eq('status', 'active'),

        // Active projects with progress
        supabase
          .from('projects')
          .select('id, progress_percentage')
          .eq('status', 'active'),

        // All payments for revenue and outstanding calculations
        supabase
          .from('payments')
          .select('id, amount, status, payment_date, due_date')
          .order('created_at', { ascending: false }),

        // Client growth data (last 6 months)
        supabase
          .from('clients')
          .select('created_at')
          .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      if (clientsResponse.error) throw clientsResponse.error;
      if (projectsResponse.error) throw projectsResponse.error;
      if (paymentsResponse.error) throw paymentsResponse.error;
      if (clientGrowthResponse.error) throw clientGrowthResponse.error;

      // Calculate metrics
      const totalClients = clientsResponse.data?.length || 0;
      const activeProjects = projectsResponse.data?.length || 0;
      
      // Calculate average project progress
      const avgProjectProgress = projectsResponse.data?.length > 0
        ? Math.round(
            projectsResponse.data.reduce((sum, project) => sum + (project.progress_percentage || 0), 0) / 
            projectsResponse.data.length
          )
        : 0;

      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = paymentsResponse.data
        ?.filter(payment => {
          if (payment.status !== 'paid' || !payment.payment_date) return false;
          const paymentDate = new Date(payment.payment_date);
          return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Calculate outstanding payments
      const outstandingPayments = paymentsResponse.data
        ?.filter(payment => payment.status === 'pending' || payment.status === 'overdue')
        .reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Count overdue payments
      const today = new Date().toISOString().split('T')[0];
      const overduePaymentsCount = paymentsResponse.data
        ?.filter(payment => 
          payment.status !== 'paid' && 
          payment.due_date && 
          payment.due_date < today
        ).length || 0;

      // Calculate client growth data
      const clientGrowthData = generateClientGrowthData(clientGrowthResponse.data || []);

      setMetrics({
        totalClients,
        activeProjects,
        monthlyRevenue,
        outstandingPayments,
        avgProjectProgress,
        overduePaymentsCount,
        clientGrowthData,
      });
    } catch (error) {
      console.error('Error fetching admin metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateClientGrowthData = (clients: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = months[targetDate.getMonth()];
      
      const clientsCount = clients.filter(client => {
        const clientDate = new Date(client.created_at);
        return clientDate.getMonth() <= targetDate.getMonth() && 
               clientDate.getFullYear() <= targetDate.getFullYear();
      }).length;

      data.push({ month: monthName, clients: clientsCount });
    }

    return data;
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    refetch: fetchMetrics,
  };
};