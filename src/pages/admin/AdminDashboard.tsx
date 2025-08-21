import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FolderKanban, 
  DollarSign, 
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Calendar
} from "lucide-react";

const statsData = [
  {
    title: "Total Clients",
    value: "24",
    change: "+2 this month",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Active Projects",
    value: "18",
    change: "+5 this quarter",
    icon: FolderKanban,
    color: "text-green-500",
  },
  {
    title: "Monthly Revenue",
    value: "$47,580",
    change: "+12.5% from last month",
    icon: DollarSign,
    color: "text-emerald-500",
  },
  {
    title: "Project Success Rate",
    value: "94.2%",
    change: "+2.1% this quarter",
    icon: TrendingUp,
    color: "text-purple-500",
  },
];

const recentActivity = [
  {
    id: 1,
    action: "New client onboarded",
    client: "TechStart Solutions",
    time: "2 hours ago",
    status: "success",
  },
  {
    id: 2,
    action: "Project completed",
    client: "Digital Dynamics",
    time: "4 hours ago",
    status: "success",
  },
  {
    id: 3,
    action: "Payment received",
    client: "Innovation Labs",
    time: "6 hours ago",
    status: "success",
  },
  {
    id: 4,
    action: "Project milestone reached",
    client: "Future Systems",
    time: "1 day ago",
    status: "info",
  },
  {
    id: 5,
    action: "Client meeting scheduled",
    client: "Growth Partners",
    time: "2 days ago",
    status: "info",
  },
];

const activeProjects = [
  {
    id: 1,
    name: "E-commerce Platform",
    client: "TechStart Solutions",
    progress: 65,
    status: "In Progress",
    dueDate: "Mar 15, 2024",
  },
  {
    id: 2,
    name: "Mobile App Development",
    client: "Digital Dynamics",
    progress: 30,
    status: "Planning",
    dueDate: "Apr 20, 2024",
  },
  {
    id: 3,
    name: "Website Redesign",
    client: "Innovation Labs",
    progress: 85,
    status: "Review",
    dueDate: "Feb 28, 2024",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your agency's client hub performance
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Active Projects</CardTitle>
            <CardDescription>Currently running client projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">{project.name}</h4>
                    <Badge variant="secondary" className="ml-2">
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{project.client}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>Progress: {project.progress}%</span>
                    <span>•</span>
                    <span>Due: {project.dueDate}</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex space-x-1 ml-4">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest updates across all projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div 
                  className={`h-2 w-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success' : 'bg-primary'
                  }`} 
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{activity.client}</span>
                    <span className="mx-2">•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Analytics Overview</CardTitle>
          <CardDescription>Revenue trends and project performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
          <div className="text-center space-y-2">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-sm font-medium text-muted-foreground">Charts Coming Soon</p>
            <p className="text-xs text-muted-foreground">
              Advanced analytics and reporting will be available here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}