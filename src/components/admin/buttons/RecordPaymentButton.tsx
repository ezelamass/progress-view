import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Plus, DollarSign } from "lucide-react";

// Mock data - in real app this would come from props or context
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

interface Payment {
  id: number;
  invoiceNumber: string;
  client: string;
  clientId: number;
  clientAvatar: string;
  project: string;
  projectId: number;
  amount: number;
  status: string;
  paymentType: string;
  method: string;
  dueDate: string;
  paidDate: string | null;
  description: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface RecordPaymentButtonProps {
  onPaymentRecorded?: (payment: Payment) => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: boolean;
  children?: React.ReactNode;
}

export default function RecordPaymentButton({ 
  onPaymentRecorded, 
  variant = "default", 
  size = "default",
  icon = true,
  children
}: RecordPaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  const availableProjects = useMemo(() => {
    const selectedClientId = form.watch("clientId");
    return selectedClientId 
      ? mockProjects.filter(p => p.clientId.toString() === selectedClientId)
      : [];
  }, [form.watch("clientId")]);

  const handleCreatePayment = (values: any) => {
    const client = mockClients.find(c => c.id.toString() === values.clientId);
    const project = mockProjects.find(p => p.id.toString() === values.projectId);
    
    const newPayment: Payment = {
      ...values,
      id: Date.now(),
      client: client?.name || "",
      project: project?.name || "",
      clientAvatar: "/placeholder.jpg",
      paidDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Call callback if provided
    if (onPaymentRecorded) {
      onPaymentRecorded(newPayment);
    }

    toast({
      title: "Payment Created",
      description: "New payment record has been created successfully.",
    });

    resetDialog();
  };

  const resetDialog = () => {
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          {icon && <DollarSign className="mr-2 h-4 w-4" />}
          {children || "Record Payment"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
          <DialogDescription>
            Create a new payment record for tracking
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreatePayment)}>
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
                          {mockClients.map(client => (
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
                Create Payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}