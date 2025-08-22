import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Download,
  MoreHorizontal, 
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Eye,
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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePayments } from "@/hooks/usePayments";
import { useProjects } from "@/hooks/useProjects";

const paymentFormSchema = z.object({
  project_id: z.string().min(1, "Project is required"),
  invoice_number: z.string().optional(),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  due_date: z.string().min(1, "Due date is required"),
  status: z.enum(["pending", "paid", "overdue", "cancelled"]),
  description: z.string().optional(),
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'default';
    case 'pending': return 'secondary';
    case 'overdue': return 'destructive';
    case 'cancelled': return 'outline';
    default: return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid': return <CheckCircle className="h-4 w-4 text-success" />;
    case 'pending': return <Clock className="h-4 w-4 text-warning" />;
    case 'overdue': return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'cancelled': return <X className="h-4 w-4 text-muted-foreground" />;
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
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0);
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + Number(p.amount), 0);
  const avgInvoiceValue = payments.length > 0 ? payments.reduce((sum, p) => sum + Number(p.amount), 0) / payments.length : 0;
  
  return { totalRevenue, pendingAmount, overdueAmount, avgInvoiceValue };
};

export default function PaymentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [sortField, setSortField] = useState("due_date");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [deletePayment, setDeletePayment] = useState<any>(null);

  const { payments, loading, createPayment, updatePayment, deletePayment: removePayment, updatePaymentStatus } = usePayments();
  const { projects, loading: projectsLoading } = useProjects();

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      project_id: "",
      invoice_number: "",
      amount: 0,
      due_date: "",
      status: "pending",
      description: "",
    }
  });

  const filteredAndSortedPayments = useMemo(() => {
    let filtered = payments.filter(payment => {
      const matchesSearch = 
        (payment.invoice_number && payment.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payment.projects?.clients?.company && payment.projects.clients.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payment.projects?.name && payment.projects.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
      const matchesProject = projectFilter === "all" || payment.project_id === projectFilter;
      
      return matchesSearch && matchesStatus && matchesProject;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof typeof a];
      let bValue: any = b[sortField as keyof typeof b];
      
      if (sortField === 'amount') {
        aValue = Number(a.amount);
        bValue = Number(b.amount);
      } else if (sortField === 'due_date') {
        aValue = new Date(a.due_date).getTime();
        bValue = new Date(b.due_date).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [payments, searchTerm, statusFilter, projectFilter, sortField, sortOrder]);

  const financials = useMemo(() => calculateFinancials(payments), [payments]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreatePayment = async (values: z.infer<typeof paymentFormSchema>) => {
    try {
      const paymentData = {
        project_id: values.project_id,
        amount: values.amount,
        due_date: values.due_date,
        status: values.status,
        invoice_number: values.invoice_number || null,
        description: values.description || null,
      };
      await createPayment(paymentData);
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment);
    form.reset({
      project_id: payment.project_id,
      invoice_number: payment.invoice_number || "",
      amount: Number(payment.amount),
      due_date: payment.due_date,
      status: payment.status,
      description: payment.description || "",
    });
  };

  const handleUpdatePayment = async (values: z.infer<typeof paymentFormSchema>) => {
    try {
      await updatePayment(editingPayment.id, values);
      setEditingPayment(null);
      form.reset();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleDeletePayment = async (payment: any) => {
    try {
      await removePayment(payment.id);
      setDeletePayment(null);
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const handleStatusChange = async (paymentId: string, newStatus: string) => {
    try {
      await updatePaymentStatus(paymentId, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const resetDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingPayment(null);
    form.reset();
  };

  if (loading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              <CheckCircle className="h-5 w-5 text-primary" />
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
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.clients?.company} - {project.name}
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
                  onClick={() => handleSort('due_date')}
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
                      <p className="font-medium text-foreground">{payment.invoice_number || 'No Invoice #'}</p>
                      <p className="text-sm text-muted-foreground">Payment</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{payment.projects?.clients?.company || 'Unknown Client'}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{payment.projects?.name || 'Unknown Project'}</p>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-foreground">
                      {formatCurrency(Number(payment.amount))}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{new Date(payment.due_date).toLocaleDateString()}</p>
                      {payment.status === 'overdue' && (
                        <p className="text-sm text-destructive">
                          {Math.ceil((new Date().getTime() - new Date(payment.due_date).getTime()) / (1000 * 60 * 60 * 24))} days overdue
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
                          <DropdownMenuItem onClick={() => handleStatusChange(payment.id, 'paid')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Paid
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletePayment(payment)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Delete Payment
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
        <DialogContent className="max-w-lg">
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
                <FormField
                  control={form.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map(project => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.clients?.company} - {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="invoice_number"
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="due_date"
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
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
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
            <DialogTitle>Delete Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePayment(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDeletePayment(deletePayment)}>
              Delete Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}