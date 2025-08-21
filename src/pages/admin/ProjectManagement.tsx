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
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const projects = [
  {
    id: 1,
    name: "E-commerce Platform Development",
    client: "TechStart Solutions",
    clientAvatar: "/client-1.jpg",
    status: "In Progress",
    priority: "High",
    progress: 65,
    startDate: "Jan 15, 2024",
    dueDate: "Mar 15, 2024",
    budget: "$24,500",
    phase: "Week 3: Implementation",
    teamMembers: 4,
    description: "Building a comprehensive e-commerce platform with payment integration and inventory management.",
  },
  {
    id: 2,
    name: "Mobile App Development",
    client: "Digital Dynamics",
    clientAvatar: "/client-2.jpg",
    status: "Planning",
    priority: "Medium",
    progress: 15,
    startDate: "Feb 1, 2024",
    dueDate: "Apr 20, 2024",
    budget: "$18,750",
    phase: "Week 1: Setup",
    teamMembers: 3,
    description: "Native mobile application for iOS and Android with real-time synchronization features.",
  },
  {
    id: 3,
    name: "Website Redesign",
    client: "Innovation Labs",
    clientAvatar: "/client-3.jpg",
    status: "Review",
    priority: "Low",
    progress: 85,
    startDate: "Dec 1, 2023",
    dueDate: "Feb 28, 2024",
    budget: "$12,200",
    phase: "Week 4: Testing",
    teamMembers: 2,
    description: "Complete website redesign with modern UI/UX and improved performance optimization.",
  },
  {
    id: 4,
    name: "Custom CRM System",
    client: "Future Systems",
    clientAvatar: "/client-4.jpg",
    status: "On Hold",
    priority: "High",
    progress: 30,
    startDate: "Jan 8, 2024",
    dueDate: "May 10, 2024",
    budget: "$32,000",
    phase: "Week 2: Implementation",
    teamMembers: 5,
    description: "Custom customer relationship management system with advanced analytics and reporting.",
  },
  {
    id: 5,
    name: "API Integration Platform",
    client: "Growth Partners",
    clientAvatar: "/client-5.jpg",
    status: "Completed",
    priority: "Medium",
    progress: 100,
    startDate: "Nov 15, 2023",
    dueDate: "Jan 20, 2024",
    budget: "$15,500",
    phase: "Completed",
    teamMembers: 3,
    description: "Integration platform connecting multiple third-party APIs with centralized management.",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress': return 'default';
    case 'Planning': return 'secondary';
    case 'Review': return 'secondary';
    case 'Completed': return 'secondary';
    case 'On Hold': return 'destructive';
    default: return 'secondary';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-red-500';
    case 'Medium': return 'bg-yellow-500';
    case 'Low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

export default function ProjectManagement() {
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search projects by name, client, or status..."
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

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="bg-gradient-card hover:shadow-hover transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={project.clientAvatar} alt={project.client} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {project.client.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">Client: {project.client}</p>
                    <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${getPriorityColor(project.priority)}`} />
                  <Badge variant={getStatusColor(project.status) as any}>
                    {project.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>Assign Team</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Archive Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Phase and Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Phase</p>
                    <p className="font-medium text-foreground">{project.phase}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="font-medium text-foreground">{project.startDate}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="font-medium text-foreground">{project.dueDate}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      <span className="font-medium text-success">{project.budget}</span>
                    </div>
                  </div>
                </div>

                {/* Team and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{project.teamMembers} team members</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">
                      Update Status
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Total Projects</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">18</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <span className="text-sm text-muted-foreground">On Hold</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">1</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}