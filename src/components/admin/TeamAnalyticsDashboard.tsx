import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  AlertTriangle,
  PieChart,
  BarChart3
} from 'lucide-react';
import { useTeamPaymentAnalytics } from '@/hooks/useTeamPaymentAnalytics';
import { format } from 'date-fns';

const TeamAnalyticsDashboard = () => {
  const analytics = useTeamPaymentAnalytics();

  const profitMargin = analytics.totalClientPayments > 0 
    ? ((analytics.totalClientPayments - analytics.totalTeamCosts) / analytics.totalClientPayments) * 100 
    : 0;

  const isProfitable = profitMargin > 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${analytics.totalTeamCosts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All paid team payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${analytics.totalClientPayments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All client payments received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            {isProfitable ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              ${(analytics.totalClientPayments - analytics.totalTeamCosts).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {profitMargin.toFixed(1)}% profit margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${analytics.upcomingPayments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Approved & pending payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Payments Alert */}
      {analytics.overduePendingPayments.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
              <AlertTriangle className="h-5 w-5" />
              Overdue Payments ({analytics.overduePendingPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.overduePendingPayments.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-2 bg-card rounded border">
                  <div>
                    <p className="font-medium">{payment.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {format(new Date(payment.dueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-red-600">{payment.daysPastDue} days overdue</p>
                  </div>
                </div>
              ))}
              {analytics.overduePendingPayments.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{analytics.overduePendingPayments.length - 3} more overdue payments
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Profitability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Profitability
            </CardTitle>
            <CardDescription>Revenue vs team costs per project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.projectProfitability
                .filter(project => project.clientPayments > 0 || project.teamCosts > 0)
                .sort((a, b) => b.profit - a.profit)
                .slice(0, 5)
                .map((project) => (
                  <div key={project.projectId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{project.projectName}</span>
                      <Badge 
                        variant={project.profit > 0 ? "default" : "destructive"}
                        className="ml-2"
                      >
                        {project.profitMargin.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Revenue: ${project.clientPayments.toLocaleString()}</span>
                        <span>Costs: ${project.teamCosts.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={project.clientPayments > 0 ? (project.teamCosts / project.clientPayments) * 100 : 0} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Profit: ${project.profit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Payment Type Breakdown
            </CardTitle>
            <CardDescription>Team payments by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.paymentTypeBreakdown)
                .sort(([,a], [,b]) => b - a)
                .map(([type, amount]) => {
                  const percentage = analytics.totalTeamCosts > 0 
                    ? (amount / analytics.totalTeamCosts) * 100 
                    : 0;
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{type}</span>
                        <span className="text-sm">${amount.toLocaleString()}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total</p>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Member Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Member Performance
          </CardTitle>
          <CardDescription>Payment statistics by team member</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Member</TableHead>
                <TableHead>Total Paid</TableHead>
                <TableHead>Monthly Avg</TableHead>
                <TableHead>Last Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.teamMemberStats
                .sort((a, b) => b.totalPaid - a.totalPaid)
                .map((member) => (
                  <TableRow key={member.userId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${member.totalPaid.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      ${member.averageMonthly.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {member.lastPayment 
                        ? format(new Date(member.lastPayment), 'MMM dd, yyyy')
                        : 'No payments'
                      }
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Trends
          </CardTitle>
          <CardDescription>Revenue vs costs over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.monthlyTrends.map((month) => (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month.month}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600">Revenue: ${month.clientPayments.toLocaleString()}</span>
                    <span className="text-red-600">Costs: ${month.teamCosts.toLocaleString()}</span>
                    <Badge variant={month.profit > 0 ? "default" : "destructive"}>
                      Profit: ${month.profit.toLocaleString()}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={month.clientPayments > 0 ? (month.teamCosts / month.clientPayments) * 100 : 0} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAnalyticsDashboard;