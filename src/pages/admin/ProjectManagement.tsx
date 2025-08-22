import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import ProjectFormDialog from "@/components/admin/ProjectFormDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Filter, Eye, Edit, Trash2, Users, Calendar, Target, TrendingUp, Calendar as CalendarIcon, ArrowLeft, ArrowRight, User, Loader2, Globe, TestTube } from "lucide-react";
import CreateProjectButton from "@/components/admin/buttons/CreateProjectButton";
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
import { supabase } from "@/integrations/supabase/client";

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
  const lowercaseStatus = status.toLowerCase();
  switch (lowercaseStatus) {
    case 'in progress':
    case 'active': return 'default';
    case 'planning': return 'secondary';
    case 'completed': return 'default';
    case 'on hold':
    case 'paused': return 'destructive';
    case 'cancelled': return 'destructive';
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
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
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

  // Fetch data from database
  useEffect(() => {
    fetchProjects();
    fetchClients();
    
    // Set up real-time subscription for projects
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          clients!projects_client_id_fkey(
            id,
            company,
            logo_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error fetching projects",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, company')
        .eq('status', 'active')
        .order('company');

      if (error) throw error;

      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const filteredProjects = (projects || []).filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clients?.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesClient = clientFilter === "all" || project.client_id === clientFilter;
    
    return matchesSearch && matchesStatus && matchesClient;
  });


  const handleEditProject = (project: any) => {
    setEditingProject(project);
    form.reset({
      name: project.name,
      clientId: project.client_id,
      description: project.description,
      startDate: project.start_date,
      endDate: project.end_date,
      status: project.status.charAt(0).toUpperCase() + project.status.slice(1),
      progress: project.progress_percentage,
      environment: project.environment,
      driveFolderUrl: project.drive_folder_url || "",
      roiConfig: {
        employeeCount: project.roi_config?.employees || 10,
        hoursPerEmployee: project.roi_config?.hoursSaved || 2,
        costPerHour: project.roi_config?.hourlyRate || 30
      }
    });
    setDialogStep(1);
  };

  const handleUpdateProject = async (values: any) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: values.name,
          client_id: values.clientId,
          description: values.description,
          start_date: values.startDate,
          end_date: values.endDate,
          status: values.status.toLowerCase(),
          progress_percentage: values.progress,
          environment: values.environment,
          drive_folder_url: values.driveFolderUrl,
          roi_config: {
            employees: values.roiConfig.employeeCount,
            hourlyRate: values.roiConfig.costPerHour,
            hoursSaved: values.roiConfig.hoursPerEmployee
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingProject.id);

      if (error) throw error;

      setEditingProject(null);
      setDialogStep(1);
      form.reset();
      fetchProjects(); // Refresh the list
      
      toast({
        title: "Project Updated",
        description: "Project has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error updating project",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (project: any) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;

      setDeleteProject(null);
      fetchProjects(); // Refresh the list
      
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error deleting project",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const resetDialog = () => {
    setEditingProject(null);
    setDialogStep(1);
    form.reset();
  };

  const handleProjectSaved = () => {
    fetchProjects();
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
        <CreateProjectButton onProjectCreated={fetchProjects} />
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
                {(clients || []).map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company}
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading projects...</span>
            </div>
          ) : (
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
                        <p className="text-sm text-muted-foreground">
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={project.clients?.logo_url} alt={project.clients?.company} />
                          <AvatarFallback>
                            {project.clients?.company?.split(' ').map(n => n[0]).join('') || 'CL'}
                          </AvatarFallback>
                        </Avatar>
                        <span>{project.clients?.company || 'Unknown Client'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(project.status) as any}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
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
                          <span>{project.progress_percentage || 0}%</span>
                        </div>
                        <Progress value={project.progress_percentage || 0} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</TableCell>
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
          )}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No projects found matching your search criteria.
            </div>
          )}
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
            <p className="text-2xl font-bold text-foreground mt-1">{(projects || []).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {(projects || []).filter(p => p.status === 'completed').length}
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
              {(projects || []).filter(p => p.status === 'active' || p.status === 'in progress').length}
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
              {(projects || []).filter(p => p.status === 'on hold' || p.status === 'paused').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Project Dialog */}
      <ProjectFormDialog
        isOpen={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
        project={editingProject}
        onProjectSaved={handleProjectSaved}
        title="Edit Project"
        description="Update project information and configuration"
      />

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