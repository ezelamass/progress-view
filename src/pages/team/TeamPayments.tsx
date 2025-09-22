import { ArrowLeft, Download, Filter, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTeamPayments } from "@/hooks/useTeamPayments";
import { useAuth } from "@/hooks/useAuth";
import { useProjectOptional } from "@/contexts/ProjectContext";
import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const TeamPayments = () => {
  const { payments, loading } = useTeamPayments();
  const { profile } = useAuth();
  const projectContext = useProjectOptional();
  const { language } = useTheme();
  
  // Filter payments for current user and optionally by selected project
  const filteredPayments = useMemo(() => {
    let userPayments = payments.filter(payment => payment.user_id === profile?.user_id);
    
    if (projectContext?.selectedProject) {
      userPayments = userPayments.filter(payment => payment.project_id === projectContext.selectedProject?.id);
    }
    
    return userPayments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [payments, profile?.user_id, projectContext?.selectedProject]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
            {language === 'es' ? 'Pagado' : 'Paid'}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20">
            {language === 'es' ? 'Pendiente' : 'Pending'}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
            {language === 'es' ? 'Cancelado' : 'Cancelled'}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'salary':
        return '💰';
      case 'bonus':
        return '🎁';
      case 'hourly':
        return '⏰';
      case 'commission':
        return '📈';
      default:
        return '💵';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {language === 'es' ? 'Volver al Panel' : 'Back to Dashboard'}
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {language === 'es' ? 'Mis Pagos' : 'My Payments'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Ver tu historial de pagos y ganancias' : 'View your payment history and earnings'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                {language === 'es' ? 'Filtrar' : 'Filter'}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                {language === 'es' ? 'Exportar' : 'Export'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Card className="border-border/50 shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {language === 'es' ? 'Historial de Pagos' : 'Payment History'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'es' ? 'Tipo' : 'Type'}</TableHead>
                    <TableHead>{language === 'es' ? 'Proyecto' : 'Project'}</TableHead>
                    <TableHead>{language === 'es' ? 'Monto' : 'Amount'}</TableHead>
                    <TableHead>{language === 'es' ? 'Estado' : 'Status'}</TableHead>
                    <TableHead>{language === 'es' ? 'Fecha de Pago' : 'Payment Date'}</TableHead>
                    <TableHead>{language === 'es' ? 'Descripción' : 'Description'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {language === 'es' ? 'Cargando pagos...' : 'Loading payments...'}
                      </TableCell>
                    </TableRow>
                  ) : filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {language === 'es' ? 'No se encontraron pagos' : 'No payments found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getTypeIcon(payment.payment_type)}</span>
                            <span className="capitalize">{payment.payment_type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.projects?.name || (language === 'es' ? 'General' : 'General')}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(Number(payment.amount))}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(payment.status)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.payment_date ? formatDate(payment.payment_date) : '—'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.description || '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <Card className="border-border/50 shadow-card bg-gradient-card">
              <CardContent className="p-8 text-center text-muted-foreground">
                {language === 'es' ? 'Cargando pagos...' : 'Loading payments...'}
              </CardContent>
            </Card>
          ) : filteredPayments.length === 0 ? (
            <Card className="border-border/50 shadow-card bg-gradient-card">
              <CardContent className="p-8 text-center text-muted-foreground">
                {language === 'es' ? 'No se encontraron pagos' : 'No payments found'}
              </CardContent>
            </Card>
          ) : (
            filteredPayments.map((payment) => (
              <Card key={payment.id} className="border-border/50 shadow-card bg-gradient-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(payment.payment_type)}</span>
                      <span className="font-medium capitalize">{payment.payment_type}</span>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'es' ? 'Monto:' : 'Amount:'}</span>
                      <span className="font-semibold">{formatCurrency(Number(payment.amount))}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'es' ? 'Proyecto:' : 'Project:'}</span>
                      <span>{payment.projects?.name || (language === 'es' ? 'General' : 'General')}</span>
                    </div>
                    
                    {payment.payment_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{language === 'es' ? 'Fecha de Pago:' : 'Payment Date:'}</span>
                        <span>{formatDate(payment.payment_date)}</span>
                      </div>
                    )}

                    {payment.description && (
                      <div className="pt-2">
                        <span className="text-muted-foreground text-sm">{payment.description}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="border-border/50 shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0))}
              </div>
              <p className="text-sm text-muted-foreground">{language === 'es' ? 'Total Recibido' : 'Total Received'}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0))}
              </div>
              <p className="text-sm text-muted-foreground">{language === 'es' ? 'Pendiente' : 'Pending'}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">
                {filteredPayments.filter(p => p.status === 'paid').length}
              </div>
              <p className="text-sm text-muted-foreground">{language === 'es' ? 'Pagos Recibidos' : 'Payments Received'}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">
                {new Date().getMonth() + 1 === new Date().getMonth() + 1 
                  ? formatCurrency(filteredPayments.filter(p => 
                      p.status === 'paid' && 
                      new Date(p.payment_date || p.created_at).getMonth() === new Date().getMonth()
                    ).reduce((sum, p) => sum + Number(p.amount), 0))
                  : '$0.00'
                }
              </div>
              <p className="text-sm text-muted-foreground">{language === 'es' ? 'Este Mes' : 'This Month'}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeamPayments;