import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  Download,
  MoreHorizontal, 
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const payments = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    client: "TechStart Solutions",
    clientAvatar: "/client-1.jpg",
    amount: "$24,500",
    status: "Paid",
    method: "Credit Card",
    dueDate: "Feb 15, 2024",
    paidDate: "Feb 12, 2024",
    project: "E-commerce Platform",
    description: "Final payment for platform development and deployment",
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    client: "Digital Dynamics",
    clientAvatar: "/client-2.jpg",
    amount: "$9,375",
    status: "Pending",
    method: "Bank Transfer",
    dueDate: "Mar 1, 2024",
    paidDate: null,
    project: "Mobile App Development",
    description: "50% milestone payment for mobile app project",
  },
  {
    id: 3,
    invoiceNumber: "INV-003",
    client: "Innovation Labs",
    clientAvatar: "/client-3.jpg",
    amount: "$12,200",
    status: "Paid",
    method: "ACH Transfer",
    dueDate: "Jan 30, 2024",
    paidDate: "Jan 28, 2024",
    project: "Website Redesign",
    description: "Complete payment for website redesign project",
  },
  {
    id: 4,
    invoiceNumber: "INV-004",
    client: "Future Systems",
    clientAvatar: "/client-4.jpg",
    amount: "$16,000",
    status: "Overdue",
    method: "Credit Card",
    dueDate: "Jan 15, 2024",
    paidDate: null,
    project: "Custom CRM System",
    description: "Initial payment for CRM development - 50% of total project value",
  },
  {
    id: 5,
    invoiceNumber: "INV-005",
    client: "Growth Partners",
    clientAvatar: "/client-5.jpg",
    amount: "$15,500",
    status: "Paid",
    method: "Wire Transfer",
    dueDate: "Jan 20, 2024",
    paidDate: "Jan 18, 2024",
    project: "API Integration Platform",
    description: "Final payment for API integration platform completion",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Paid': return <CheckCircle className="h-4 w-4 text-success" />;
    case 'Pending': return <Clock className="h-4 w-4 text-warning" />;
    case 'Overdue': return <AlertCircle className="h-4 w-4 text-destructive" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Paid': return 'secondary';
    case 'Pending': return 'secondary';
    case 'Overdue': return 'destructive';
    default: return 'secondary';
  }
};

export default function PaymentManagement() {
  const totalRevenue = payments.reduce((sum, payment) => {
    if (payment.status === 'Paid') {
      return sum + parseFloat(payment.amount.replace('$', '').replace(',', ''));
    }
    return sum;
  }, 0);

  const pendingAmount = payments.reduce((sum, payment) => {
    if (payment.status === 'Pending') {
      return sum + parseFloat(payment.amount.replace('$', '').replace(',', ''));
    }
    return sum;
  }, 0);

  const overdueAmount = payments.reduce((sum, payment) => {
    if (payment.status === 'Overdue') {
      return sum + parseFloat(payment.amount.replace('$', '').replace(',', ''));
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
          <p className="text-muted-foreground">
            Track invoices, payments, and financial performance
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <span className="text-sm text-muted-foreground">Pending Payments</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">${pendingAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="text-sm text-muted-foreground">Overdue Amount</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">${overdueAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Avg Invoice Value</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">$15,515</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by invoice number, client, or project..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id} className="bg-gradient-card hover:shadow-hover transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={payment.clientAvatar} alt={payment.client} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {payment.client.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-foreground">{payment.invoiceNumber}</h3>
                      {getStatusIcon(payment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">Client: {payment.client}</p>
                    <p className="text-sm font-medium text-primary">{payment.project}</p>
                    <p className="text-xs text-muted-foreground mt-1">{payment.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{payment.amount}</p>
                    <Badge variant={getStatusBadge(payment.status) as any}>
                      {payment.status}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Invoice</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                      <DropdownMenuItem>Download PDF</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Cancel Invoice
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <div className="flex items-center">
                    <CreditCard className="h-3 w-3 mr-1" />
                    <span className="font-medium text-foreground">{payment.method}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <span className="font-medium text-foreground">{payment.dueDate}</span>
                </div>
                <div>
                  <p className="text-muted-foreground">Paid Date</p>
                  <span className="font-medium text-foreground">
                    {payment.paidDate || 'Not paid yet'}
                  </span>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}