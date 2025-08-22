import { useState } from "react";
import { Plus, Search, Calendar, CheckCircle, Clock, AlertTriangle, Flag, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { mockDeliverables, Deliverable, DeliverableFormData } from "@/types/deliverables";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const deliverableFormSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  priority: z.enum(["low", "medium", "high"]),
  assignedTo: z.string().optional(),
});

const mockProjects = [
  { id: 'proj-1', name: 'TechStart Solutions - CRM Implementation' },
  { id: 'proj-2', name: 'Retail Plus - Inventory System' },
  { id: 'proj-3', name: 'HealthCorp - Patient Management' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'in_progress':
      return <Clock className="h-4 w-4 text-blue-600" />;
    case 'overdue':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  const variants = {
    completed: 'default',
    in_progress: 'secondary',
    pending: 'outline',
    overdue: 'destructive',
  } as const;
  
  return (
    <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
      {status.replace('_', ' ')}
    </Badge>
  );
};

const getPriorityFlag = (priority: string) => {
  const colors = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500',
  };
  
  return <Flag className={cn("h-4 w-4", colors[priority as keyof typeof colors])} />;
};

export default function DeliverableManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeliverable, setEditingDeliverable] = useState<Deliverable | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof deliverableFormSchema>>({
    resolver: zodResolver(deliverableFormSchema),
    defaultValues: {
      projectId: "",
      name: "",
      description: "",
      priority: "medium",
      assignedTo: "",
    },
  });

  const filteredDeliverables = mockDeliverables.filter(deliverable => {
    const matchesSearch = deliverable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deliverable.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || deliverable.status === statusFilter;
    const matchesProject = projectFilter === 'all' || deliverable.projectId === projectFilter;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const statusCounts = {
    total: mockDeliverables.length,
    completed: mockDeliverables.filter(d => d.status === 'completed').length,
    pending: mockDeliverables.filter(d => d.status === 'pending').length,
    overdue: mockDeliverables.filter(d => d.status === 'overdue').length,
    in_progress: mockDeliverables.filter(d => d.status === 'in_progress').length,
  };

  const onSubmit = (values: z.infer<typeof deliverableFormSchema>) => {
    console.log("Creating/updating deliverable:", values);
    toast({
      title: editingDeliverable ? "Deliverable Updated" : "Deliverable Created",
      description: `${values.name} has been ${editingDeliverable ? 'updated' : 'created'} successfully.`,
    });
    setIsDialogOpen(false);
    setEditingDeliverable(null);
    form.reset();
  };

  const handleEdit = (deliverable: Deliverable) => {
    setEditingDeliverable(deliverable);
    form.reset({
      projectId: deliverable.projectId,
      name: deliverable.name,
      description: deliverable.description,
      dueDate: new Date(deliverable.dueDate),
      priority: deliverable.priority,
      assignedTo: deliverable.assignedTo || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (deliverable: Deliverable) => {
    console.log("Deleting deliverable:", deliverable.id);
    toast({
      title: "Deliverable Deleted",
      description: `${deliverable.name} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const handleStatusChange = (deliverable: Deliverable, newStatus: string) => {
    console.log("Updating status:", deliverable.id, newStatus);
    toast({
      title: "Status Updated",
      description: `${deliverable.name} status changed to ${newStatus.replace('_', ' ')}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deliverable Management</h1>
          <p className="text-muted-foreground">
            Manage project deliverables and track progress
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingDeliverable(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Deliverable
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingDeliverable ? 'Edit Deliverable' : 'Add New Deliverable'}
              </DialogTitle>
              <DialogDescription>
                {editingDeliverable 
                  ? 'Update the deliverable details below.'
                  : 'Create a new deliverable for a project. Fill in the details below.'
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockProjects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deliverable Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter deliverable name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter deliverable description"
                          className="resize-none"
                          {...field}
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter assignee name (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingDeliverable ? 'Update Deliverable' : 'Create Deliverable'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Total</p>
                <p className="text-2xl font-bold">{statusCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Completed</p>
                <p className="text-2xl font-bold">{statusCounts.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">In Progress</p>
                <p className="text-2xl font-bold">{statusCounts.in_progress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Pending</p>
                <p className="text-2xl font-bold">{statusCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Overdue</p>
                <p className="text-2xl font-bold">{statusCounts.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deliverables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {mockProjects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deliverables Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deliverable</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeliverables.map((deliverable) => (
              <TableRow key={deliverable.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{deliverable.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{deliverable.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{deliverable.projectName}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(deliverable.dueDate).toLocaleDateString()}</span>
                </TableCell>
                <TableCell>
                  <Select 
                    value={deliverable.status} 
                    onValueChange={(value) => handleStatusChange(deliverable, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(deliverable.status)}
                          <span className="capitalize">{deliverable.status.replace('_', ' ')}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getPriorityFlag(deliverable.priority)}
                    <span className="capitalize">{deliverable.priority}</span>
                  </div>
                </TableCell>
                <TableCell>{deliverable.assignedTo}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(deliverable)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(deliverable)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}