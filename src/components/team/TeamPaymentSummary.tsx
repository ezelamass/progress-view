import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useTeamPayments } from '@/hooks/useTeamPayments';
import { useAuth } from '@/hooks/useAuth';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';

const TeamPaymentSummary = () => {
  const { payments, loading } = useTeamPayments();
  const { profile } = useAuth();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter payments for current user only
  const userPayments = payments.filter(payment => payment.user_id === profile?.user_id);
  
  // Calculate current month earnings
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const currentMonthPayments = userPayments.filter(payment => {
    const paymentDate = payment.payment_date ? new Date(payment.payment_date) : new Date(payment.created_at);
    return paymentDate >= monthStart && paymentDate <= monthEnd && payment.status === 'paid';
  });
  
  const currentMonthEarnings = currentMonthPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  
  // Calculate total earnings
  const totalEarnings = userPayments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
  
  // Calculate pending payments
  const pendingPayments = userPayments
    .filter(payment => payment.status === 'pending' || payment.status === 'approved')
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
  
  // Next payment date
  const upcomingPayments = userPayments
    .filter(payment => payment.status === 'pending' || payment.status === 'approved')
    .filter(payment => payment.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());
  
  const nextPaymentDate = upcomingPayments.length > 0 ? upcomingPayments[0].due_date : null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Payment Summary
        </CardTitle>
        <CardDescription>
          Your earnings and payment status overview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Month Earnings */}
        <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold text-primary">
              ${currentMonthEarnings.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2 text-success">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Current</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-card rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Total Earned</span>
            </div>
            <p className="text-lg font-semibold">${totalEarnings.toLocaleString()}</p>
          </div>
          
          <div className="p-3 bg-card rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Pending</span>
            </div>
            <p className="text-lg font-semibold text-warning">
              ${pendingPayments.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Next Payment */}
        {nextPaymentDate && (
          <div className="p-4 bg-card rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Payment Due</p>
                <p className="text-lg font-semibold">
                  {format(new Date(nextPaymentDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Calendar className="h-3 w-3 mr-1" />
                Upcoming
              </Badge>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payments this month:</span>
            <span className="font-medium">{currentMonthPayments.length}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Total payments:</span>
            <span className="font-medium">{userPayments.filter(p => p.status === 'paid').length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPaymentSummary;