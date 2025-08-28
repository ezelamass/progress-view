import { useState } from "react";
import { Plus, Search, Calendar, CheckCircle, Clock, AlertTriangle, Flag, Edit, Trash2, FileText } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
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
import { cn } from "@/lib/utils";
import { useDeliverables } from "@/hooks/useDeliverables";
import { useProjects } from "@/hooks/useProjects";

const deliverableFormSchema = z.object({
  project_id: z.string().min(1, "Project is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  due_date: z.date({
    required_error: "Due date is required",
  }),
  priority: z.enum(["low", "medium", "high"]),
  loom_url: z.string().url().optional().or(z.literal("")),
});

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
  const [editingDeliverable, setEditingDeliverable] = useState<any>(null);
  const [pdfAttachments, setPdfAttachments] = useState<any[]>([]);
  
  const { deliverables, loading, createDeliverable, updateDeliverable, deleteDeliverable, updateDeliverableStatus } = useDeliverables();
  const { projects, loading: projectsLoading } = useProjects();

  const form = useForm<z.infer<typeof deliverableFormSchema>>({
    resolver: zodResolver(deliverableFormSchema),
    defaultValues: {
      project_id: "",
      name: "",
      description: "",
      priority: "medium",
      loom_url: "",
    },
  });

  const filteredDeliverables = deliverables.filter(deliverable => {
    const matchesSearch = deliverable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (deliverable.description && deliverable.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || deliverable.status === statusFilter;
    const matchesProject = projectFilter === 'all' || deliverable.project_id === projectFilter;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const statusCounts = {
    total: deliverables.length,
    completed: deliverables.filter(d => d.status === 'completed').length,
    pending: deliverables.filter(d => d.status === 'pending').length,
    overdue: deliverables.filter(d => d.status === 'overdue').length,
    in_progress: deliverables.filter(d => d.status === 'in_progress').length,
  };

  const onSubmit = async (values: z.infer<typeof deliverableFormSchema>) => {
    try {
      const deliverableData = {
        project_id: values.project_id,
        name: values.name,
        description: values.description || null,
        due_date: values.due_date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        priority: values.priority,
        attachments: pdfAttachments,
        loom_url: values.loom_url || null,
      };

      if (editingDeliverable) {
        await updateDeliverable(editingDeliverable.id, deliverableData);
      } else {
        await createDeliverable(deliverableData);
      }

      setIsDialogOpen(false);
      setEditingDeliverable(null);
      setPdfAttachments([]);
      form.reset();
    } catch (error) {
      console.error('Error submitting deliverable:', error);
    }
  };

  const handleEdit = (deliverable: any) => {
    setEditingDeliverable(deliverable);
    setPdfAttachments(Array.isArray(deliverable.attachments) ? deliverable.attachments : []);
    form.reset({
      project_id: deliverable.project_id,
      name: deliverable.name,
      description: deliverable.description || "",
      due_date: new Date(deliverable.due_date),
      priority: deliverable.priority,
      loom_url: deliverable.loom_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (deliverable: any) => {
    try {
      await deleteDeliverable(deliverable.id);
    } catch (error) {
      console.error('Error deleting deliverable:', error);
    }
  };

  const handleStatusChange = async (deliverable: any, newStatus: string) => {
    try {
      await updateDeliverableStatus(deliverable.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
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
                  name="project_id"
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
                          {projects.map((project) => (
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
                  name="due_date"
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
                   name="loom_url"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Loom Video URL (Optional)</FormLabel>
                       <FormControl>
                         <Input 
                           placeholder="https://www.loom.com/share/..."
                           {...field}
                         />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                  
                 {/* PDF Upload Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">PDF Documents</label>
                  <p className="text-xs text-muted-foreground">Upload PDF files for this deliverable</p>
                  {editingDeliverable && (
                    <FileUpload
                      deliverableId={editingDeliverable.id}
                      attachments={pdfAttachments}
                      onAttachmentsChange={setPdfAttachments}
                      acceptedFileTypes={['application/pdf', '.pdf']}
                      maxFileSize={10 * 1024 * 1024} // 10MB
                      fileTypeLabel="PDF files"
                    />
                  )}
                  {!editingDeliverable && (
                    <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center text-sm text-muted-foreground">
                      <FileText className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      Save deliverable first to upload PDF files
                    </div>
                  )}
                </div>
                
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
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.clients?.company} - {project.name}
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
              <TableHead>Loom</TableHead>
              <TableHead>PDFs</TableHead>
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
                  <span className="text-sm">{deliverable.projects?.name || 'Unknown Project'}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(deliverable.due_date).toLocaleDateString()}</span>
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
                <TableCell>
                  {deliverable.loom_url ? (
                    <a 
                      href={deliverable.loom_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      View Video
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {Array.isArray(deliverable.attachments) 
                        ? deliverable.attachments.filter((att: any) => 
                            att && typeof att === 'object' && att.fileName && 
                            att.fileName.toLowerCase().endsWith('.pdf')
                          ).length 
                        : 0
                      }
                    </span>
                  </div>
                </TableCell>
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