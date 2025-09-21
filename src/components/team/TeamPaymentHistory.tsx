import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Calendar, FileText } from 'lucide-react';
import { useTeamPayments } from '@/hooks/useTeamPayments';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

const TeamPaymentHistory = () => {
  const { payments, loading } = useTeamPayments();
  const { profile } = useAuth();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter payments for current user only and sort by date
  const userPayments = payments
    .filter(payment => payment.user_id === profile?.user_id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10); // Show last 10 payments

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success/20 text-success border-success/30';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending': return 'bg-warning/20 text-warning border-warning/30';
      case 'cancelled': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'salary': return '💼';
      case 'bonus': return '🎁';
      case 'commission': return '📊';
      case 'milestone': return '🎯';
      default: return '💰';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Payment History
        </CardTitle>
        <CardDescription>
          Your recent payment transactions and status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userPayments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payment history available yet.</p>
            <p className="text-sm">Your payments will appear here once they're processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-lg font-semibold text-success">
                  ${userPayments
                    .filter(p => p.status === 'paid')
                    .reduce((sum, p) => sum + Number(p.amount), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-lg font-semibold text-warning">
                  ${userPayments
                    .filter(p => p.status === 'pending' || p.status === 'approved')
                    .reduce((sum, p) => sum + Number(p.amount), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">This Year</p>
                <p className="text-lg font-semibold">
                  ${userPayments
                    .filter(p => new Date(p.created_at).getFullYear() === new Date().getFullYear())
                    .reduce((sum, p) => sum + Number(p.amount), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payment Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(payment.payment_type)}</span>
                        <div>
                          <div className="font-medium capitalize">{payment.payment_type}</div>
                          {payment.description && (
                            <div className="text-xs text-muted-foreground truncate max-w-32">
                              {payment.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {payment.currency} {Number(payment.amount).toLocaleString()}
                      </div>
                      {payment.hours_worked && (
                        <div className="text-xs text-muted-foreground">
                          {payment.hours_worked}h worked
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {payment.payment_date 
                            ? format(new Date(payment.payment_date), 'MMM dd, yyyy')
                            : format(new Date(payment.created_at), 'MMM dd, yyyy')
                          }
                        </span>
                      </div>
                      {payment.due_date && payment.status !== 'paid' && (
                        <div className="text-xs text-muted-foreground">
                          Due: {format(new Date(payment.due_date), 'MMM dd')}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamPaymentHistory;