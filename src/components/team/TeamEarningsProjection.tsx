import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Target, DollarSign } from 'lucide-react';
import { useTeamPayments } from '@/hooks/useTeamPayments';
import { useTeamPaymentRates } from '@/hooks/useTeamPaymentRates';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/hooks/useAuth';
import { format, addMonths, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

const TeamEarningsProjection = () => {
  const { payments } = useTeamPayments();
  const { rates } = useTeamPaymentRates();
  const { projects } = useProjects();
  const { profile } = useAuth();

  // Filter data for current user
  const userPayments = payments.filter(payment => payment.user_id === profile?.user_id);
  const userRates = rates.filter(rate => rate.user_id === profile?.user_id && rate.is_active);
  const activeProjects = projects.filter(project => project.status === 'active');

  // Calculate current month progress
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
  const daysPassed = differenceInDays(new Date(), monthStart) + 1;
  const monthProgress = Math.min((daysPassed / daysInMonth) * 100, 100);

  // Calculate current month earnings
  const currentMonthEarnings = userPayments
    .filter(payment => {
      const paymentDate = payment.payment_date ? new Date(payment.payment_date) : new Date(payment.created_at);
      return paymentDate >= monthStart && paymentDate <= monthEnd && payment.status === 'paid';
    })
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  // Calculate next month projection
  const nextMonth = addMonths(currentMonth, 1);
  
  // Base projection on active rates and projects
  let nextMonthProjection = 0;
  
  // Add salary rates
  const salaryRates = userRates.filter(rate => rate.rate_type === 'salary');
  nextMonthProjection += salaryRates.reduce((sum, rate) => sum + Number(rate.rate_amount), 0);
  
  // Add project-based estimates
  const hourlyRates = userRates.filter(rate => rate.rate_type === 'hourly');
  if (hourlyRates.length > 0) {
    const avgHourlyRate = hourlyRates.reduce((sum, rate) => sum + Number(rate.rate_amount), 0) / hourlyRates.length;
    // Estimate 160 hours per month (full-time)
    nextMonthProjection += avgHourlyRate * 160;
  }
  
  // Add potential bonuses based on active projects
  const bonusRates = userRates.filter(rate => rate.rate_type === 'bonus');
  const potentialBonuses = bonusRates.reduce((sum, rate) => sum + Number(rate.rate_amount), 0);
  
  // Calculate average monthly earnings from last 3 months for comparison
  const last3MonthsAvg = (() => {
    const last3Months = [];
    for (let i = 1; i <= 3; i++) {
      const month = addMonths(currentMonth, -i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthEarnings = userPayments
        .filter(payment => {
          const paymentDate = payment.payment_date ? new Date(payment.payment_date) : new Date(payment.created_at);
          return paymentDate >= monthStart && paymentDate <= monthEnd && payment.status === 'paid';
        })
        .reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      last3Months.push(monthEarnings);
    }
    
    return last3Months.reduce((sum, earnings) => sum + earnings, 0) / 3;
  })();

  // Use the higher of calculated projection or historical average
  const finalProjection = Math.max(nextMonthProjection, last3MonthsAvg);

  // Calculate projected monthly target based on rates
  const monthlyTarget = salaryRates.reduce((sum, rate) => sum + Number(rate.rate_amount), 0) || finalProjection;
  const currentProgress = monthlyTarget > 0 ? (currentMonthEarnings / monthlyTarget) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Earnings Projection
        </CardTitle>
        <CardDescription>
          Your estimated earnings and progress tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Month Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">This Month Progress</span>
            <span className="text-sm text-muted-foreground">
              ${currentMonthEarnings.toLocaleString()} / ${monthlyTarget.toLocaleString()}
            </span>
          </div>
          <Progress value={currentProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{Math.round(currentProgress)}% achieved</span>
            <span>{Math.round(monthProgress)}% month passed</span>
          </div>
        </div>

        {/* Next Month Projection */}
        <div className="p-4 bg-card rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Next Month Projection</span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400">
              {format(nextMonth, 'MMM yyyy')}
            </Badge>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            ${finalProjection.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on active rates and historical data
          </p>
        </div>

        {/* Projection Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Projection Breakdown
          </h4>
          
          {salaryRates.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-card rounded border">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Base Salary</span>
              </div>
              <span className="font-medium">
                ${salaryRates.reduce((sum, rate) => sum + Number(rate.rate_amount), 0).toLocaleString()}
              </span>
            </div>
          )}
          
          {hourlyRates.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-card rounded border">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm">Hourly Work (est.)</span>
              </div>
              <span className="font-medium">
                ${(hourlyRates.reduce((sum, rate) => sum + Number(rate.rate_amount), 0) * 40).toLocaleString()}/week
              </span>
            </div>
          )}
          
          {potentialBonuses > 0 && (
            <div className="flex items-center justify-between p-3 bg-card rounded border">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Potential Bonuses</span>
              </div>
              <span className="font-medium text-yellow-600">
                +${potentialBonuses.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Active Projects Impact */}
        {activeProjects.length > 0 && (
          <div className="p-3 bg-card rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Active Projects</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {activeProjects.length} active project{activeProjects.length > 1 ? 's' : ''} may provide additional earning opportunities
            </p>
          </div>
        )}

        {/* Comparison with average */}
        {last3MonthsAvg > 0 && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            3-month average: ${last3MonthsAvg.toLocaleString()} • 
            Projection vs avg: {finalProjection > last3MonthsAvg ? '+' : ''}
            {(((finalProjection - last3MonthsAvg) / last3MonthsAvg) * 100).toFixed(1)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamEarningsProjection;