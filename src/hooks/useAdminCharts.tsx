import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChartData {
  revenueData: Array<{ month: string; revenue: number; target: number }>;
  paymentStatusData: Array<{ name: string; value: number; amount: number; color: string }>;
  projectProfitabilityData: Array<{ project: string; revenue: number; costs: number; profit: number }>;
}

export const useAdminCharts = () => {
  const [chartData, setChartData] = useState<ChartData>({
    revenueData: [],
    paymentStatusData: [],
    projectProfitabilityData: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchChartData = async () => {
    try {
      setLoading(true);

      const [paymentsResponse, projectsResponse] = await Promise.all([
        // Fetch all payments for revenue and status data
        supabase
          .from('payments')
          .select('amount, status, payment_date, project_id'),

        // Fetch projects with client info for profitability
        supabase
          .from('projects')
          .select(`
            id,
            name,
            payments:payments(amount, status)
          `)
      ]);

      if (paymentsResponse.error) throw paymentsResponse.error;
      if (projectsResponse.error) throw projectsResponse.error;

      // Generate revenue data (last 12 months)
      const revenueData = generateRevenueData(paymentsResponse.data || []);

      // Generate payment status data
      const paymentStatusData = generatePaymentStatusData(paymentsResponse.data || []);

      // Generate project profitability data
      const projectProfitabilityData = generateProjectProfitabilityData(projectsResponse.data || []);

      setChartData({
        revenueData,
        paymentStatusData,
        projectProfitabilityData,
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch chart data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRevenueData = (payments: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const data = [];

    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = months[targetDate.getMonth()];
      
      const monthlyRevenue = payments
        .filter(payment => {
          if (payment.status !== 'paid' || !payment.payment_date) return false;
          const paymentDate = new Date(payment.payment_date);
          return paymentDate.getMonth() === targetDate.getMonth() && 
                 paymentDate.getFullYear() === targetDate.getFullYear();
        })
        .reduce((sum, payment) => sum + Number(payment.amount), 0);

      // Generate a realistic target (10% above average)
      const avgRevenue = monthlyRevenue > 0 ? monthlyRevenue : 30000;
      const target = Math.round(avgRevenue * 1.1);

      data.push({ 
        month: monthName, 
        revenue: monthlyRevenue, 
        target 
      });
    }

    return data;
  };

  const generatePaymentStatusData = (payments: any[]) => {
    const statusCounts = payments.reduce((acc: Record<string, { count: number; amount: number }>, payment) => {
      const status = payment.status;
      if (!acc[status]) {
        acc[status] = { count: 0, amount: 0 };
      }
      acc[status].count++;
      acc[status].amount += Number(payment.amount);
      return acc;
    }, {});

    const total = payments.length;
    const statusColors = {
      paid: 'hsl(var(--success))',
      pending: 'hsl(var(--warning))',
      overdue: 'hsl(var(--destructive))',
      cancelled: 'hsl(var(--muted-foreground))'
    };

    return Object.entries(statusCounts).map(([status, data]) => {
      const statusData = data as { count: number; amount: number };
      return {
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: Math.round((statusData.count / total) * 100),
        amount: statusData.amount,
        color: statusColors[status as keyof typeof statusColors] || 'hsl(var(--muted-foreground))'
      };
    });
  };

  const generateProjectProfitabilityData = (projects: any[]) => {
    return projects
      .map(project => {
        const revenue = project.payments
          ?.filter((payment: any) => payment.status === 'paid')
          .reduce((sum: number, payment: any) => sum + Number(payment.amount), 0) || 0;
        
        // Estimate costs as 60% of revenue (this should be replaced with actual cost tracking)
        const costs = Math.round(revenue * 0.6);
        const profit = revenue - costs;

        return {
          project: project.name,
          revenue,
          costs,
          profit
        };
      })
      .filter(project => project.revenue > 0)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5); // Top 5 most profitable
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return {
    chartData,
    loading,
    refetch: fetchChartData,
  };
};