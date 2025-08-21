import { ArrowLeft, Download, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockPayments = [
  {
    id: "INV-001",
    amount: 4500,
    dueDate: "2024-01-15",
    status: "paid",
    paidDate: "2024-01-14"
  },
  {
    id: "INV-002", 
    amount: 3200,
    dueDate: "2024-02-15",
    status: "paid",
    paidDate: "2024-02-13"
  },
  {
    id: "INV-003",
    amount: 2800,
    dueDate: "2024-03-15", 
    status: "pending",
    paidDate: null
  },
  {
    id: "INV-004",
    amount: 5000,
    dueDate: "2024-04-15",
    status: "pending", 
    paidDate: null
  },
  {
    id: "INV-005",
    amount: 3750,
    dueDate: "2024-05-15",
    status: "paid",
    paidDate: "2024-05-12"
  },
  {
    id: "INV-006",
    amount: 4200,
    dueDate: "2024-06-15",
    status: "pending",
    paidDate: null
  }
];

const Payments = () => {
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
                  {mockPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium text-primary">
                        {payment.id}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(payment.dueDate)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.paidDate ? formatDate(payment.paidDate) : '—'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {mockPayments.map((payment) => (
            <Card key={payment.id} className="border-border/50 shadow-card bg-gradient-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-primary">{payment.id}</div>
                  {getStatusBadge(payment.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span>{formatDate(payment.dueDate)}</span>
                  </div>
                  
                  {payment.paidDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid Date:</span>
                      <span>{formatDate(payment.paidDate)}</span>
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
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-border/50 shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0))}
              </div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))}
              </div>
              <p className="text-sm text-muted-foreground">Outstanding</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">
                {mockPayments.length}
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