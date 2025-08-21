import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Calendar,
  Clock,
  DollarSign,
  Users,
  Filter,
  Edit,
  Eye,
  Trash2,
  ArrowLeft,
  ArrowRight,
  TestTube,
  Globe
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    name: "E-commerce Platform Development",
    client: "TechStart Solutions",
    clientId: 1,
    clientAvatar: "/client-1.jpg",
    status: "In Progress",
    progress: 65,
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    description: "Building a comprehensive e-commerce platform with payment integration and inventory management.",
    environment: "test",
    driveFolderUrl: "https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz",
    phases: [
      { name: "Week 1: Setup & Info Collection", status: "completed", duration: 7 },
      { name: "Week 2-3: Implementation & Development", status: "in-progress", duration: 14 },
      { name: "Week 4: Testing & Go-Live", status: "pending", duration: 7 }
    ],
    roiConfig: {
      employeeCount: 25,
      hoursPerEmployee: 4,
      costPerHour: 35
    },
    currentPhase: "Week 2-3: Implementation & Development"
  },
  {
    id: 2,
    name: "Mobile App Development",
    client: "Digital Dynamics",
    clientId: 2,
    clientAvatar: "/client-2.jpg",
    status: "Planning",
    progress: 15,
    startDate: "2024-02-01",
    endDate: "2024-04-20",
    description: "Native mobile application for iOS and Android with real-time synchronization features.",
    environment: "test",
    driveFolderUrl: "https://drive.google.com/drive/folders/2XyZwAbCdEfGhIjKlMnOpQr",
    phases: [
      { name: "Week 1: Setup & Info Collection", status: "in-progress", duration: 7 },
      { name: "Week 2-3: Implementation & Development", status: "pending", duration: 14 },
      { name: "Week 4: Testing & Go-Live", status: "pending", duration: 7 }
    ],
    roiConfig: {
      employeeCount: 15,
      hoursPerEmployee: 3,
      costPerHour: 40
    },
    currentPhase: "Week 1: Setup & Info Collection"
  },
  {
    id: 3,
    name: "Website Redesign",
    client: "Innovation Labs",
    clientId: 3,
    clientAvatar: "/client-3.jpg",
    status: "Completed",
    progress: 100,
    startDate: "2023-12-01",
    endDate: "2024-02-28",
    description: "Complete website redesign with modern UI/UX and improved performance optimization.",
    environment: "production",
    driveFolderUrl: "",
    phases: [
      { name: "Week 1: Setup & Info Collection", status: "completed", duration: 7 },
      { name: "Week 2-3: Implementation & Development", status: "completed", duration: 14 },
      { name: "Week 4: Testing & Go-Live", status: "completed", duration: 7 }
    ],
    roiConfig: {
      employeeCount: 8,
      hoursPerEmployee: 2,
      costPerHour: 30
    },
    currentPhase: "Completed"
  },
  {
    id: 4,
    name: "Custom CRM System",
    client: "Future Systems",
    clientId: 4,
    clientAvatar: "/client-4.jpg",
    status: "On Hold",
    progress: 30,
    startDate: "2024-01-08",
    endDate: "2024-05-10",
    description: "Custom customer relationship management system with advanced analytics and reporting.",
    environment: "test",
    driveFolderUrl: "https://drive.google.com/drive/folders/4StUvWxYzAbCdEfGhIjKl",
    phases: [
      { name: "Week 1: Setup & Info Collection", status: "completed", duration: 7 },
      { name: "Week 2-3: Implementation & Development", status: "on-hold", duration: 14 },
      { name: "Week 4: Testing & Go-Live", status: "pending", duration: 7 }
    ],
    roiConfig: {
      employeeCount: 50,
      hoursPerEmployee: 5,
      costPerHour: 45
    },
    currentPhase: "Week 2-3: Implementation & Development"
  }
];

// Mock clients data
const mockClients = [
  { id: 1, name: "TechStart Solutions" },
  { id: 2, name: "Digital Dynamics" },
  { id: 3, name: "Innovation Labs" },
  { id: 4, name: "Future Systems" },
  { id: 5, name: "Growth Partners" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress': return 'default';
    case 'Planning': return 'secondary';
    case 'Completed': return 'default';
    case 'On Hold': return 'destructive';
    case 'Cancelled': return 'destructive';
    default: return 'secondary';
  }
};

const calculateROI = (employeeCount: number, hoursPerEmployee: number, costPerHour: number) => {
  const dailyROI = employeeCount * hoursPerEmployee * costPerHour;
  const monthlyROI = dailyROI * 22; // 22 working days per month
  const yearlyROI = monthlyROI * 12;
  const monthlyROIAfterFees = monthlyROI - 1500; // Subtract implementation fee
  
  return {
    daily: dailyROI,
    monthly: monthlyROI,
    yearly: yearlyROI,
    monthlyAfterFees: monthlyROIAfterFees > 0 ? monthlyROIAfterFees : 0
  };
};

export default function ProjectManagement() {
  const [projects, setProjects] = useState(mockProjects);
  const [clients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deleteProject, setDeleteProject] = useState<any>(null);
  const [dialogStep, setDialogStep] = useState(1);

  const form = useForm({
    defaultValues: {
      name: "",
      clientId: "",
      description: "",
      startDate: "",
      endDate: "",
      environment: "test",
      driveFolderUrl: "",
      phases: [
        { name: "Week 1: Setup & Info Collection", duration: 7 },
        { name: "Week 2-3: Implementation & Development", duration: 14 },
        { name: "Week 4: Testing & Go-Live", duration: 7 }
      ],
      roiConfig: {
        employeeCount: 10,
        hoursPerEmployee: 2,
        costPerHour: 30
      },
      status: "Planning",
      progress: 0
    }
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesClient = clientFilter === "all" || project.clientId.toString() === clientFilter;
    
    return matchesSearch && matchesStatus && matchesClient;
  });

  const handleCreateProject = (values: any) => {
    const newProject = {
      ...values,
      id: Date.now(),
      client: clients.find(c => c.id.toString() === values.clientId)?.name || "",
      clientAvatar: "/placeholder.jpg",
      currentPhase: values.phases[0].name,
      phases: values.phases.map((phase: any, index: number) => ({
        ...phase,
        status: index === 0 ? "in-progress" : "pending"
      }))
    };
    
    setProjects([...projects, newProject]);
    setIsCreateDialogOpen(false);
    setDialogStep(1);
    form.reset();
    toast({
      title: "Project Created",
      description: "New project has been created successfully.",
    });
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    form.reset(project);
    setDialogStep(1);
  };

  const handleUpdateProject = (values: any) => {
    const updatedProjects = projects.map(p => 
      p.id === editingProject.id 
        ? { 
            ...p, 
            ...values,
            client: clients.find(c => c.id.toString() === values.clientId)?.name || ""
          }
        : p
    );
    setProjects(updatedProjects);
    setEditingProject(null);
    setDialogStep(1);
    form.reset();
    toast({
      title: "Project Updated",
      description: "Project has been updated successfully.",
    });
  };

  const handleDeleteProject = (project: any) => {
    setProjects(projects.filter(p => p.id !== project.id));
    setDeleteProject(null);
    toast({
      title: "Project Deleted",
      description: "Project has been deleted successfully.",
    });
  };

  const resetDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingProject(null);
    setDialogStep(1);
    form.reset();
  };

  const roiValues = form.watch("roiConfig");
  const roi = calculateROI(roiValues.employeeCount, roiValues.hoursPerEmployee, roiValues.costPerHour);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
          <p className="text-muted-foreground">
            Track and manage all client projects from start to finish
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Project
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search projects by name or client..."
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
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.currentPhase}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.clientAvatar} alt={project.client} />
                        <AvatarFallback>
                          {project.client.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{project.client}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(project.status) as any}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {project.environment === "production" ? (
                        <Globe className="h-4 w-4 text-success" />
                      ) : (
                        <TestTube className="h-4 w-4 text-warning" />
                      )}
                      <span className="capitalize text-sm">
                        {project.environment}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEditProject(project)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditProject(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDeleteProject(project)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Project Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Total Projects</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{projects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {projects.filter(p => p.status === 'Completed').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {projects.filter(p => p.status === 'In Progress').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <span className="text-sm text-muted-foreground">On Hold</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {projects.filter(p => p.status === 'On Hold').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Project Dialog */}
      <Dialog open={isCreateDialogOpen || !!editingProject} onOpenChange={resetDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
            <DialogDescription>
              Step {dialogStep} of 3: {
                dialogStep === 1 ? 'Basic Information' :
                dialogStep === 2 ? 'Project Phases' : 'ROI Configuration'
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(editingProject ? handleUpdateProject : handleCreateProject)}>
              {dialogStep === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a client" />
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter project description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                     />
                    </div>
                   <FormField
                     control={form.control}
                     name="driveFolderUrl"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Google Drive Folder URL</FormLabel>
                         <FormControl>
                           <Input 
                             type="url"
                             placeholder="https://drive.google.com/drive/folders/..."
                             {...field} 
                           />
                         </FormControl>
                         <FormDescription>
                           Shared Google Drive folder for project files (optional)
                         </FormDescription>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="environment"
                     render={({ field }) => (
                       <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                         <div className="space-y-0.5">
                           <FormLabel>Environment</FormLabel>
                           <FormDescription>
                             Set project to Test (development) or Production (live)
                           </FormDescription>
                         </div>
                         <FormControl>
                           <div className="flex items-center space-x-2">
                             <TestTube className="h-4 w-4 text-warning" />
                             <Switch
                               checked={field.value === "production"}
                               onCheckedChange={(checked) => 
                                 field.onChange(checked ? "production" : "test")
                               }
                             />
                             <Globe className="h-4 w-4 text-success" />
                           </div>
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
                         <FormLabel>Project Status</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                             <SelectTrigger>
                               <SelectValue placeholder="Select project status" />
                             </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                             <SelectItem value="Planning">Planning</SelectItem>
                             <SelectItem value="In Progress">In Progress</SelectItem>
                             <SelectItem value="On Hold">On Hold</SelectItem>
                             <SelectItem value="Completed">Completed</SelectItem>
                             <SelectItem value="Cancelled">Cancelled</SelectItem>
                           </SelectContent>
                         </Select>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="progress"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Progress Percentage</FormLabel>
                         <FormControl>
                           <div className="px-3">
                             <Slider
                               min={0}
                               max={100}
                               step={5}
                               value={[field.value]}
                               onValueChange={(values) => field.onChange(values[0])}
                             />
                             <div className="flex justify-between text-sm text-muted-foreground mt-1">
                               <span>0%</span>
                               <span className="font-medium">{field.value}%</span>
                               <span>100%</span>
                             </div>
                           </div>
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>
               )}

               {dialogStep === 2 && (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Configure project phases and their durations. Default phases based on Client Hub standard workflow.
                  </div>
                  {form.watch("phases").map((phase: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <FormField
                        control={form.control}
                        name={`phases.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phase {index + 1} Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`phases.${index}.duration`}
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <FormLabel>Duration (days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}

              {dialogStep === 3 && (
                <div className="space-y-6">
                  <div className="text-sm text-muted-foreground">
                    Configure ROI calculation parameters to estimate monthly savings for the client.
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="roiConfig.employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Count</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Number of employees who will benefit from this automation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roiConfig.hoursPerEmployee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours Saved Per Employee Daily</FormLabel>
                        <FormControl>
                          <div className="px-3">
                            <Slider
                              min={1}
                              max={8}
                              step={0.5}
                              value={[field.value]}
                              onValueChange={(values) => field.onChange(values[0])}
                            />
                            <div className="flex justify-between text-sm text-muted-foreground mt-1">
                              <span>1 hour</span>
                              <span className="font-medium">{field.value} hours</span>
                              <span>8 hours</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Average hours of repetitive tasks saved per employee per day
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roiConfig.costPerHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Per Hour Per Employee ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Average hourly cost of employee time (salary + benefits)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ROI Preview */}
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-semibold mb-2">ROI Calculation Preview</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Daily Savings</p>
                        <p className="font-bold text-lg">${roi.daily.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly Savings</p>
                        <p className="font-bold text-lg">${roi.monthly.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly ROI (after $1,500 fee)</p>
                        <p className="font-bold text-lg text-success">${roi.monthlyAfterFees.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Yearly Savings</p>
                        <p className="font-bold text-lg text-success">${roi.yearly.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="mt-6">
                <div className="flex items-center justify-between w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogStep(Math.max(1, dialogStep - 1))}
                    disabled={dialogStep === 1}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  
                  {dialogStep < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setDialogStep(dialogStep + 1)}
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit">
                      {editingProject ? 'Update Project' : 'Create Project'}
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteProject} onOpenChange={() => setDeleteProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteProject?.name}"? This action cannot be undone.
              This project has {deleteProject?.phases?.length || 0} phases configured.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProject(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteProject(deleteProject)}>
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}