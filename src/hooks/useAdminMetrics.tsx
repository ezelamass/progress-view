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
  onTimeDeliveryRate: number;
  clientRetentionRate: number;
  avgProjectValue: number;
  projectsThisQuarter: number;
  projectStatusCounts: {
    completed: number;
    inProgress: number;
    delayed: number;
  };
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
    onTimeDeliveryRate: 0,
    clientRetentionRate: 0,
    avgProjectValue: 0,
    projectsThisQuarter: 0,
    projectStatusCounts: {
      completed: 0,
      inProgress: 0,
      delayed: 0,
    },
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
        clientGrowthResponse,
        deliverablesResponse,
        allProjectsResponse
      ] = await Promise.all([
        // Total active clients
        supabase
          .from('clients')
          .select('id, created_at')
          .eq('status', 'active'),

        // Active projects with progress
        supabase
          .from('projects')
          .select('id, progress_percentage, created_at, status')
          .eq('status', 'active'),

        // All payments for revenue and outstanding calculations
        supabase
          .from('payments')
          .select('id, amount, status, payment_date, due_date, project_id')
          .order('created_at', { ascending: false }),

        // Client growth data (last 6 months)
        supabase
          .from('clients')
          .select('created_at')
          .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString()),

        // All deliverables for performance metrics
        supabase
          .from('deliverables')
          .select('id, due_date, completed_at, status'),

        // All projects for additional metrics
        supabase
          .from('projects')
          .select('id, status, created_at, payments:payments(amount, status)')
      ]);

      if (clientsResponse.error) throw clientsResponse.error;
      if (projectsResponse.error) throw projectsResponse.error;
      if (paymentsResponse.error) throw paymentsResponse.error;
      if (clientGrowthResponse.error) throw clientGrowthResponse.error;
      if (deliverablesResponse.error) throw deliverablesResponse.error;
      if (allProjectsResponse.error) throw allProjectsResponse.error;

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

      // Calculate performance metrics
      const onTimeDeliveryRate = calculateOnTimeDeliveryRate(deliverablesResponse.data || []);
      const clientRetentionRate = calculateClientRetentionRate(clientsResponse.data || []);
      const avgProjectValue = calculateAvgProjectValue(allProjectsResponse.data || []);
      const projectsThisQuarter = calculateProjectsThisQuarter(allProjectsResponse.data || []);
      const projectStatusCounts = calculateProjectStatusCounts(allProjectsResponse.data || []);

      setMetrics({
        totalClients,
        activeProjects,
        monthlyRevenue,
        outstandingPayments,
        avgProjectProgress,
        overduePaymentsCount,
        clientGrowthData,
        onTimeDeliveryRate,
        clientRetentionRate,
        avgProjectValue,
        projectsThisQuarter,
        projectStatusCounts,
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

  const calculateOnTimeDeliveryRate = (deliverables: any[]) => {
    const completed = deliverables.filter(d => d.status === 'completed' && d.completed_at && d.due_date);
    if (completed.length === 0) return 95; // Default value if no data
    
    const onTime = completed.filter(d => {
      const completedDate = new Date(d.completed_at);
      const dueDate = new Date(d.due_date);
      return completedDate <= dueDate;
    });
    
    return Math.round((onTime.length / completed.length) * 100);
  };

  const calculateClientRetentionRate = (clients: any[]) => {
    // Simplified calculation - in real world, this would be more complex
    if (clients.length === 0) return 85; // Default value
    
    const oldClients = clients.filter(client => {
      const clientDate = new Date(client.created_at);
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      return clientDate < sixMonthsAgo;
    });
    
    return oldClients.length > 0 ? Math.round((oldClients.length / clients.length) * 100) : 90;
  };

  const calculateAvgProjectValue = (projects: any[]) => {
    if (projects.length === 0) return 0;
    
    const totalValue = projects.reduce((sum, project) => {
      const projectValue = project.payments
        ?.filter((payment: any) => payment.status === 'paid')
        .reduce((pSum: number, payment: any) => pSum + Number(payment.amount), 0) || 0;
      return sum + projectValue;
    }, 0);
    
    return Math.round(totalValue / projects.length);
  };

  const calculateProjectsThisQuarter = (projects: any[]) => {
    const quarterStart = new Date();
    quarterStart.setMonth(Math.floor(quarterStart.getMonth() / 3) * 3, 1);
    quarterStart.setHours(0, 0, 0, 0);
    
    return projects.filter(project => {
      const projectDate = new Date(project.created_at);
      return projectDate >= quarterStart;
    }).length;
  };

  const calculateProjectStatusCounts = (projects: any[]) => {
    const completed = projects.filter(p => p.status === 'completed').length;
    const active = projects.filter(p => p.status === 'active').length;
    const delayed = projects.filter(p => p.status === 'delayed' || p.status === 'on_hold').length;
    
    return {
      completed,
      inProgress: active,
      delayed
    };
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