import { useState, useMemo } from "react";
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
  Filter,
  Edit,
  Eye,
  Send,
  FileText,
  X,
  ArrowUpDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

// Mock data for payments
const mockPayments = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    client: "TechStart Solutions",
    clientId: 1,
    clientAvatar: "/client-1.jpg",
    project: "E-commerce Platform Development",
    projectId: 1,
    amount: 24500,
    status: "Paid",
    paymentType: "Final",
    method: "Credit Card",
    dueDate: "2024-02-15",
    paidDate: "2024-02-12",
    description: "Final payment for platform development and deployment",
    notes: "Payment received on time. Project completed successfully.",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-12"
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    client: "Digital Dynamics",
    clientId: 2,
    clientAvatar: "/client-2.jpg",
    project: "Mobile App Development",
    projectId: 2,
    amount: 9375,
    status: "Pending",
    paymentType: "Monthly",
    method: "Bank Transfer",
    dueDate: "2024-03-01",
    paidDate: null,
    description: "50% milestone payment for mobile app project",
    notes: "Awaiting payment confirmation from client.",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01"
  },
  {
    id: 3,
    invoiceNumber: "INV-003", 
    client: "Innovation Labs",
    clientId: 3,
    clientAvatar: "/client-3.jpg",
    project: "Website Redesign",
    projectId: 3,
    amount: 12200,
    status: "Paid",
    paymentType: "Initial",
    method: "ACH Transfer",
    dueDate: "2024-01-30",
    paidDate: "2024-01-28",
    description: "Complete payment for website redesign project",
    notes: "Early payment received with bonus discount applied.",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-28"
  },
  {
    id: 4,
    invoiceNumber: "INV-004",
    client: "Future Systems",
    clientId: 4,
    clientAvatar: "/client-4.jpg",
    project: "Custom CRM System",
    projectId: 4,
    amount: 16000,
    status: "Overdue",
    paymentType: "Initial",
    method: "Credit Card",
    dueDate: "2024-01-15",
    paidDate: null,
    description: "Initial payment for CRM development - 50% of total project value",
    notes: "Payment overdue by 30+ days. Follow-up required.",
    createdAt: "2023-12-15",
    updatedAt: "2024-01-15"
  },
  {
    id: 5,
    invoiceNumber: "INV-005",
    client: "Growth Partners",
    clientId: 5,
    clientAvatar: "/client-5.jpg",
    project: "API Integration Platform",
    projectId: 5,
    amount: 15500,
    status: "Cancelled",
    paymentType: "Final",
    method: "Wire Transfer",
    dueDate: "2024-01-20",
    paidDate: null,
    description: "Final payment for API integration platform completion",
    notes: "Cancelled due to project scope changes.",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-25"
  }
];

// Mock clients and projects data
const mockClients = [
  { id: 1, name: "TechStart Solutions" },
  { id: 2, name: "Digital Dynamics" },
  { id: 3, name: "Innovation Labs" },
  { id: 4, name: "Future Systems" },
  { id: 5, name: "Growth Partners" }
];

const mockProjects = [
  { id: 1, name: "E-commerce Platform Development", clientId: 1 },
  { id: 2, name: "Mobile App Development", clientId: 2 },
  { id: 3, name: "Website Redesign", clientId: 3 },
  { id: 4, name: "Custom CRM System", clientId: 4 },
  { id: 5, name: "API Integration Platform", clientId: 5 }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'default';
    case 'Pending': return 'secondary';
    case 'Overdue': return 'destructive';
    case 'Cancelled': return 'outline';
    default: return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Paid': return <CheckCircle className="h-4 w-4 text-success" />;
    case 'Pending': return <Clock className="h-4 w-4 text-warning" />;
    case 'Overdue': return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'Cancelled': return <X className="h-4 w-4 text-muted-foreground" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const calculateFinancials = (payments: any[]) => {
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);
  const avgInvoiceValue = payments.length > 0 ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length : 0;
  
  return { totalRevenue, pendingAmount, overdueAmount, avgInvoiceValue };
};

export default function PaymentManagement() {
  const [payments, setPayments] = useState(mockPayments);
  const [clients] = useState(mockClients);
  const [projects] = useState(mockProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [sortField, setSortField] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [deletePayment, setDeletePayment] = useState<any>(null);

  const form = useForm({
    defaultValues: {
      invoiceNumber: "",
      clientId: "",
      projectId: "",
      amount: 0,
      paymentType: "Initial",
      dueDate: "",
      method: "Credit Card",
      description: "",
      notes: "",
      status: "Pending"
    }
  });

  const filteredAndSortedPayments = useMemo(() => {
    let filtered = payments.filter(payment => {
      const matchesSearch = 
        payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.project.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
      const matchesClient = clientFilter === "all" || payment.clientId.toString() === clientFilter;
      
      return matchesSearch && matchesStatus && matchesClient;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField as keyof typeof a];
      let bValue = b[sortField as keyof typeof b];
      
      if (sortField === 'amount') {
        aValue = a.amount;
        bValue = b.amount;
      } else if (sortField === 'dueDate') {
        aValue = new Date(a.dueDate).getTime();
        bValue = new Date(b.dueDate).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [payments, searchTerm, statusFilter, clientFilter, sortField, sortOrder]);

  const financials = useMemo(() => calculateFinancials(payments), [payments]);

  const availableProjects = useMemo(() => {
    const selectedClientId = form.watch("clientId");
    return selectedClientId 
      ? projects.filter(p => p.clientId.toString() === selectedClientId)
      : [];
  }, [form.watch("clientId"), projects]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreatePayment = (values: any) => {
    const client = clients.find(c => c.id.toString() === values.clientId);
    const project = projects.find(p => p.id.toString() === values.projectId);
    
    const newPayment = {
      ...values,
      id: Date.now(),
      client: client?.name || "",
      project: project?.name || "",
      clientAvatar: "/placeholder.jpg",
      paidDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setPayments([...payments, newPayment]);
    setIsCreateDialogOpen(false);
    form.reset();
    toast({
      title: "Payment Created",
      description: "New payment record has been created successfully.",
    });
  };

  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment);
    form.reset({
      ...payment,
      clientId: payment.clientId.toString(),
      projectId: payment.projectId.toString()
    });
  };

  const handleUpdatePayment = (values: any) => {
    const client = clients.find(c => c.id.toString() === values.clientId);
    const project = projects.find(p => p.id.toString() === values.projectId);
    
    const updatedPayments = payments.map(p => 
      p.id === editingPayment.id 
        ? { 
            ...p, 
            ...values,
            client: client?.name || "",
            project: project?.name || "",
            updatedAt: new Date().toISOString(),
            paidDate: values.status === 'Paid' && !p.paidDate ? new Date().toISOString() : p.paidDate
          }
        : p
    );
    setPayments(updatedPayments);
    setEditingPayment(null);
    form.reset();
    toast({
      title: "Payment Updated",
      description: "Payment record has been updated successfully.",
    });
  };

  const handleDeletePayment = (payment: any) => {
    setPayments(payments.filter(p => p.id !== payment.id));
    setDeletePayment(null);
    toast({
      title: "Payment Deleted",
      description: "Payment record has been deleted successfully.",
    });
  };

  const handleStatusChange = (paymentId: number, newStatus: string) => {
    const updatedPayments = payments.map(p => 
      p.id === paymentId 
        ? { 
            ...p, 
            status: newStatus,
            paidDate: newStatus === 'Paid' ? new Date().toISOString() : p.paidDate,
            updatedAt: new Date().toISOString()
          }
        : p
    );
    setPayments(updatedPayments);
    toast({
      title: "Status Updated",
      description: `Payment status changed to ${newStatus}.`,
    });
  };

  const resetDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingPayment(null);
    form.reset();
  };

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
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
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
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatCurrency(financials.totalRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <span className="text-sm text-muted-foreground">Pending Payments</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatCurrency(financials.pendingAmount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="text-sm text-muted-foreground">Overdue Amount</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatCurrency(financials.overdueAmount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Avg Invoice Value</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatCurrency(financials.avgInvoiceValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by invoice number, client, or project..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center">
                    Due Date <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{payment.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{payment.paymentType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={payment.clientAvatar} alt={payment.client} />
                        <AvatarFallback>
                          {payment.client.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{payment.client}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{payment.project}</p>
                    <p className="text-sm text-muted-foreground">{payment.method}</p>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-foreground">
                      {formatCurrency(payment.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{new Date(payment.dueDate).toLocaleDateString()}</p>
                      {payment.status === 'Overdue' && (
                        <p className="text-sm text-destructive">
                          {Math.ceil((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(payment.status)}
                      <Badge variant={getStatusColor(payment.status) as any}>
                        {payment.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEditPayment(payment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditPayment(payment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(payment.id, 'Paid')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletePayment(payment)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel Payment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Payment Dialog */}
      <Dialog open={isCreateDialogOpen || !!editingPayment} onOpenChange={resetDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPayment ? 'Edit Payment' : 'Add New Payment'}
            </DialogTitle>
            <DialogDescription>
              {editingPayment ? 'Update payment details and status' : 'Create a new payment record for tracking'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(editingPayment ? handleUpdatePayment : handleCreatePayment)}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number</FormLabel>
                        <FormControl>
                          <Input placeholder="INV-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Initial">Initial</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Milestone">Milestone</SelectItem>
                            <SelectItem value="Final">Final</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("projectId", "");
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map(client => (
                              <SelectItem key={client.id} value={client.id.toString()}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableProjects.map(project => (
                              <SelectItem key={project.id} value={project.id.toString()}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="5000"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Credit Card">Credit Card</SelectItem>
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            <SelectItem value="ACH Transfer">ACH Transfer</SelectItem>
                            <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                            <SelectItem value="Check">Check</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Overdue">Overdue</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Payment description or invoice details"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Internal notes about this payment"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Internal notes for tracking payment status and communications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={resetDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPayment ? 'Update Payment' : 'Create Payment'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletePayment} onOpenChange={() => setDeletePayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel payment "{deletePayment?.invoiceNumber}" for {formatCurrency(deletePayment?.amount || 0)}? 
              This will mark the payment as cancelled and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePayment(null)}>
              Keep Payment
            </Button>
            <Button variant="destructive" onClick={() => handleDeletePayment(deletePayment)}>
              Cancel Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}