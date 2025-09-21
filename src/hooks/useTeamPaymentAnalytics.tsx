import { useMemo } from 'react';
import { useTeamPayments } from '@/hooks/useTeamPayments';
import { useTeamPaymentRates } from '@/hooks/useTeamPaymentRates';
import { useProjects } from '@/hooks/useProjects';
import { usePayments } from '@/hooks/usePayments';
import { startOfMonth, endOfMonth, addMonths, format } from 'date-fns';

export interface PaymentAnalytics {
  totalTeamCosts: number;
  totalClientPayments: number;
  projectProfitability: Array<{
    projectId: string;
    projectName: string;
    teamCosts: number;
    clientPayments: number;
    profit: number;
    profitMargin: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    teamCosts: number;
    clientPayments: number;
    profit: number;
  }>;
  teamMemberStats: Array<{
    userId: string;
    name: string;
    email: string;
    totalPaid: number;
    averageMonthly: number;
    lastPayment: string | null;
  }>;
  paymentTypeBreakdown: Record<string, number>;
  upcomingPayments: number;
  overduePendingPayments: Array<{
    id: string;
    userId: string;
    userName: string;
    amount: number;
    dueDate: string;
    daysPastDue: number;
  }>;
}

export const useTeamPaymentAnalytics = (): PaymentAnalytics => {
  const { payments: teamPayments } = useTeamPayments();
  const { rates } = useTeamPaymentRates();
  const { projects } = useProjects();
  const { payments: clientPayments } = usePayments();

  return useMemo(() => {
    const now = new Date();
    
    // Calculate total team costs (paid payments only)
    const totalTeamCosts = teamPayments
      .filter(payment => payment.status === 'paid')
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    // Calculate total client payments (paid payments only)
    const totalClientPayments = clientPayments
      .filter(payment => payment.status === 'paid')
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    // Calculate project profitability
    const projectProfitability = projects.map(project => {
      const projectTeamCosts = teamPayments
        .filter(payment => payment.project_id === project.id && payment.status === 'paid')
        .reduce((sum, payment) => sum + Number(payment.amount), 0);

      const projectClientPayments = clientPayments
        .filter(payment => payment.project_id === project.id && payment.status === 'paid')
        .reduce((sum, payment) => sum + Number(payment.amount), 0);

      const profit = projectClientPayments - projectTeamCosts;
      const profitMargin = projectClientPayments > 0 ? (profit / projectClientPayments) * 100 : 0;

      return {
        projectId: project.id,
        projectName: project.name,
        teamCosts: projectTeamCosts,
        clientPayments: projectClientPayments,
        profit,
        profitMargin,
      };
    });

    // Calculate monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const month = addMonths(now, -i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthTeamCosts = teamPayments
        .filter(payment => {
          const paymentDate = payment.payment_date ? new Date(payment.payment_date) : new Date(payment.created_at);
          return paymentDate >= monthStart && paymentDate <= monthEnd && payment.status === 'paid';
        })
        .reduce((sum, payment) => sum + Number(payment.amount), 0);

      const monthClientPayments = clientPayments
        .filter(payment => {
          const paymentDate = payment.payment_date ? new Date(payment.payment_date) : new Date(payment.created_at);
          return paymentDate >= monthStart && paymentDate <= monthEnd && payment.status === 'paid';
        })
        .reduce((sum, payment) => sum + Number(payment.amount), 0);

      monthlyTrends.push({
        month: format(month, 'MMM yyyy'),
        teamCosts: monthTeamCosts,
        clientPayments: monthClientPayments,
        profit: monthClientPayments - monthTeamCosts,
      });
    }

    // Calculate team member stats
    const teamMemberStats = teamPayments.reduce((acc, payment) => {
      const userId = payment.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          name: payment.profiles ? `${payment.profiles.first_name || ''} ${payment.profiles.last_name || ''}`.trim() : 'Unknown',
          email: payment.profiles?.email || 'unknown@email.com',
          payments: [],
        };
      }
      if (payment.status === 'paid') {
        acc[userId].payments.push(payment);
      }
      return acc;
    }, {} as Record<string, any>);

    const teamMemberStatsArray = Object.values(teamMemberStats).map((member: any) => {
      const totalPaid = member.payments.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0);
      const lastPayment = member.payments.length > 0 
        ? member.payments.sort((a: any, b: any) => new Date(b.payment_date || b.created_at).getTime() - new Date(a.payment_date || a.created_at).getTime())[0]
        : null;
      
      // Calculate average monthly (last 3 months with payments)
      const monthsWithPayments = new Set();
      member.payments.forEach((payment: any) => {
        const paymentDate = payment.payment_date ? new Date(payment.payment_date) : new Date(payment.created_at);
        monthsWithPayments.add(`${paymentDate.getFullYear()}-${paymentDate.getMonth()}`);
      });
      
      const averageMonthly = monthsWithPayments.size > 0 ? totalPaid / monthsWithPayments.size : 0;

      return {
        userId: member.userId,
        name: member.name,
        email: member.email,
        totalPaid,
        averageMonthly,
        lastPayment: lastPayment ? (lastPayment.payment_date || lastPayment.created_at) : null,
      };
    });

    // Calculate payment type breakdown
    const paymentTypeBreakdown = teamPayments
      .filter(payment => payment.status === 'paid')
      .reduce((acc, payment) => {
        const type = payment.payment_type;
        acc[type] = (acc[type] || 0) + Number(payment.amount);
        return acc;
      }, {} as Record<string, number>);

    // Calculate upcoming payments
    const upcomingPayments = teamPayments
      .filter(payment => payment.status === 'pending' || payment.status === 'approved')
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    // Calculate overdue pending payments
    const overduePendingPayments = teamPayments
      .filter(payment => {
        if (payment.status !== 'pending' && payment.status !== 'approved') return false;
        if (!payment.due_date) return false;
        return new Date(payment.due_date) < now;
      })
      .map(payment => {
        const dueDate = new Date(payment.due_date!);
        const daysPastDue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          id: payment.id,
          userId: payment.user_id,
          userName: payment.profiles ? `${payment.profiles.first_name || ''} ${payment.profiles.last_name || ''}`.trim() : 'Unknown',
          amount: Number(payment.amount),
          dueDate: payment.due_date!,
          daysPastDue,
        };
      })
      .sort((a, b) => b.daysPastDue - a.daysPastDue);

    return {
      totalTeamCosts,
      totalClientPayments,
      projectProfitability,
      monthlyTrends,
      teamMemberStats: teamMemberStatsArray,
      paymentTypeBreakdown,
      upcomingPayments,
      overduePendingPayments,
    };
  }, [teamPayments, rates, projects, clientPayments]);
};