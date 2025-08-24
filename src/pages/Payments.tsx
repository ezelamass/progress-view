import { ArrowLeft, Download, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePayments } from "@/hooks/usePayments";
import { useProjectOptional } from "@/contexts/ProjectContext";
import { useMemo } from "react";

const Payments = () => {
  const { payments, loading } = usePayments();
  const projectContext = useProjectOptional();
  
  // Filter payments by selected project for clients
  const filteredPayments = useMemo(() => {
    if (!projectContext?.selectedProject) return payments;
    return payments.filter(payment => payment.project_id === projectContext.selectedProject?.id);
  }, [payments, projectContext?.selectedProject]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') {
      return (
        <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
          Paid
        </Badge>
      );
    }
    return (
      <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20">
        Pending
      </Badge>
    );
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
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
                <p className="text-sm text-muted-foreground">
                  View and manage your payment history
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
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
              <CardTitle>All Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                 <TableBody>
                   {loading ? (
                     <TableRow>
                       <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                         Loading payments...
                       </TableCell>
                     </TableRow>
                   ) : filteredPayments.length === 0 ? (
                     <TableRow>
                       <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                         No payments found for this project
                       </TableCell>
                     </TableRow>
                   ) : (
                     filteredPayments.map((payment) => (
                       <TableRow key={payment.id}>
                         <TableCell className="font-medium text-primary">
                           {payment.invoice_number || `INV-${payment.id.slice(0, 8)}`}
                         </TableCell>
                         <TableCell className="font-semibold">
                           {formatCurrency(Number(payment.amount))}
                         </TableCell>
                         <TableCell className="text-muted-foreground">
                           {formatDate(payment.due_date)}
                         </TableCell>
                         <TableCell>
                           {getStatusBadge(payment.status)}
                         </TableCell>
                         <TableCell className="text-muted-foreground">
                           {payment.payment_date ? formatDate(payment.payment_date) : '—'}
                         </TableCell>
                         <TableCell>
                           <Button variant="ghost" size="sm" className="gap-2">
                             <Download className="h-4 w-4" />
                           </Button>
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
                 Loading payments...
               </CardContent>
             </Card>
           ) : filteredPayments.length === 0 ? (
             <Card className="border-border/50 shadow-card bg-gradient-card">
               <CardContent className="p-8 text-center text-muted-foreground">
                 No payments found for this project
               </CardContent>
             </Card>
           ) : (
             filteredPayments.map((payment) => (
               <Card key={payment.id} className="border-border/50 shadow-card bg-gradient-card">
                 <CardContent className="p-4">
                   <div className="flex items-center justify-between mb-3">
                     <div className="font-medium text-primary">
                       {payment.invoice_number || `INV-${payment.id.slice(0, 8)}`}
                     </div>
                     {getStatusBadge(payment.status)}
                   </div>
                   
                   <div className="space-y-2">
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">Amount:</span>
                       <span className="font-semibold">{formatCurrency(Number(payment.amount))}</span>
                     </div>
                     
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">Due Date:</span>
                       <span>{formatDate(payment.due_date)}</span>
                     </div>
                     
                     {payment.payment_date && (
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">Paid Date:</span>
                         <span>{formatDate(payment.payment_date)}</span>
                       </div>
                     )}
                   </div>

                   <div className="mt-4 pt-4 border-t border-border/50">
                     <Button variant="outline" size="sm" className="w-full gap-2">
                       <Download className="h-4 w-4" />
                       Download Invoice
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             ))
           )}
         </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
           <Card className="border-border/50 shadow-card bg-gradient-card">
             <CardContent className="p-6">
               <div className="text-2xl font-bold text-foreground">
                 {formatCurrency(filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0))}
               </div>
               <p className="text-sm text-muted-foreground">Total Paid</p>
             </CardContent>
           </Card>

           <Card className="border-border/50 shadow-card bg-gradient-card">
             <CardContent className="p-6">
               <div className="text-2xl font-bold text-foreground">
                 {formatCurrency(filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0))}
               </div>
               <p className="text-sm text-muted-foreground">Outstanding</p>
             </CardContent>
           </Card>

           <Card className="border-border/50 shadow-card bg-gradient-card">
             <CardContent className="p-6">
               <div className="text-2xl font-bold text-foreground">
                 {filteredPayments.length}
               </div>
               <p className="text-sm text-muted-foreground">Total Invoices</p>
             </CardContent>
           </Card>
        </div>
      </main>
    </div>
  );
};

export default Payments;