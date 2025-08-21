import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  FolderKanban, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  UserPlus,
  FolderPlus,
  BarChart3,
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  DollarSignIcon
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import React, { useState } from "react";

// Mock data for charts and metrics
const revenueData = [
  { month: 'Jan', revenue: 32000, target: 30000 },
  { month: 'Feb', revenue: 28000, target: 32000 },
  { month: 'Mar', revenue: 35000, target: 33000 },
  { month: 'Apr', revenue: 42000, target: 35000 },
  { month: 'May', revenue: 38000, target: 38000 },
  { month: 'Jun', revenue: 45000, target: 40000 },
  { month: 'Jul', revenue: 48000, target: 42000 },
  { month: 'Aug', revenue: 52000, target: 45000 },
  { month: 'Sep', revenue: 47000, target: 48000 },
  { month: 'Oct', revenue: 55000, target: 50000 },
  { month: 'Nov', revenue: 58000, target: 52000 },
  { month: 'Dec', revenue: 62000, target: 55000 }
];

const paymentStatusData = [
  { name: 'Paid', value: 67, amount: 185000, color: 'hsl(var(--success))' },
  { name: 'Pending', value: 20, amount: 54000, color: 'hsl(var(--warning))' },
  { name: 'Overdue', value: 10, amount: 28000, color: 'hsl(var(--destructive))' },
  { name: 'Cancelled', value: 3, amount: 8000, color: 'hsl(var(--muted-foreground))' }
];

const projectProfitabilityData = [
  { project: 'E-commerce Platform', revenue: 85000, costs: 45000, profit: 40000 },
  { project: 'Mobile App', revenue: 65000, costs: 38000, profit: 27000 },
  { project: 'Website Redesign', revenue: 42000, costs: 28000, profit: 14000 },
  { project: 'CRM Integration', revenue: 38000, costs: 25000, profit: 13000 },
  { project: 'API Development', revenue: 32000, costs: 22000, profit: 10000 }
];

const clientGrowthData = [
  { month: 'Jan', clients: 18 },
  { month: 'Feb', clients: 19 },
  { month: 'Mar', clients: 20 },
  { month: 'Apr', clients: 22 },
  { month: 'May', clients: 21 },
  { month: 'Jun', clients: 24 }
];

const recentActivity = [
  {
    id: 1,
    type: 'client',
    message: 'New client "TechStart Solutions" onboarded',
    time: '2 hours ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'project',
    message: 'E-commerce Platform project completed',
    time: '4 hours ago',
    status: 'success'
  },
  {
    id: 3,
    type: 'payment',
    message: 'Payment of $15,000 received from Digital Dynamics',
    time: '6 hours ago',
    status: 'success'
  },
  {
    id: 4,
    type: 'project',
    message: 'Mobile App project milestone reached',
    time: '1 day ago',
    status: 'info'
  },
  {
    id: 5,
    type: 'alert',
    message: 'Website Redesign project approaching deadline',
    time: '1 day ago',
    status: 'warning'
  }
];

const alerts = [
  {
    id: 1,
    type: 'payment',
    message: '3 payments overdue - $28,000 total',
    priority: 'high',
    action: 'View Payments'
  },
  {
    id: 2,
    type: 'project',
    message: '2 projects due within 3 days',
    priority: 'medium',
    action: 'View Projects'
  },
  {
    id: 3,
    type: 'client',
    message: '5 clients haven\'t been contacted in 30+ days',
    priority: 'low',
    action: 'View Clients'
  }
];

// Data interfaces for quick actions
interface ClientFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  logoUrl: string;
  status: "Active" | "Inactive";
}

interface ProjectFormData {
  name: string;
  clientId: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  projectType: string;
  duration: string;
  employeeCount: number;
  hoursPerEmployee: number;
  costPerHour: number;
  priority: string;
}

interface PaymentFormData {
  clientId: string;
  projectId: string;
  amount: string;
  dueDate: Date | undefined;
  paymentType: string;
  description: string;
  invoiceNumber: string;
}

// Mock clients data for dropdowns
const mockClients = [
  { id: "1", name: "TechStart Solutions", contact: "Sarah Johnson" },
  { id: "2", name: "Digital Dynamics", contact: "Michael Chen" },
  { id: "3", name: "Innovation Labs", contact: "Emily Rodriguez" },
  { id: "4", name: "Future Systems", contact: "David Kim" },
];

// Mock projects data for payments
const mockProjects = [
  { id: "1", name: "AI Implementation", clientId: "1" },
  { id: "2", name: "Website Redesign", clientId: "1" },
  { id: "3", name: "CRM Integration", clientId: "2" },
  { id: "4", name: "Mobile App", clientId: "3" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color, 
  subtitle, 
  onClick, 
  children 
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
  subtitle?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) => (
  <Card className={`cursor-pointer transition-all hover:shadow-md ${onClick ? 'hover:scale-[1.02]' : ''}`} onClick={onClick}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="flex items-center space-x-2">
        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
          {trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          {change}
        </div>
      </div>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
      {children}
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const { toast } = useToast();
  
  // Quick Actions State Management
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [projectStep, setProjectStep] = useState(1);
  
  // Form Data States
  const [clientForm, setClientForm] = useState<ClientFormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    logoUrl: "",
    status: "Active",
  });
  
  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    name: "",
    clientId: "",
    description: "",
    startDate: undefined,
    endDate: undefined,
    projectType: "AI Implementation",
    duration: "4 weeks",
    employeeCount: 10,
    hoursPerEmployee: 2,
    costPerHour: 50,
    priority: "Medium",
  });
  
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    clientId: "",
    projectId: "",
    amount: "",
    dueDate: undefined,
    paymentType: "Initial",
    description: "",
    invoiceNumber: "",
  });
  
  const [clientErrors, setClientErrors] = useState<Partial<ClientFormData>>({});
  
  // Quick Actions Handlers
  const handleClientSubmit = () => {
    const errors: Partial<ClientFormData> = {};
    if (!clientForm.name.trim()) errors.name = "Contact person is required";
    if (!clientForm.company.trim()) errors.company = "Company name is required";
    if (!clientForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(clientForm.email)) {
      errors.email = "Invalid email format";
    }
    
    setClientErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      toast({
        title: "Client added successfully",
        description: `${clientForm.company} has been added to your client list.`,
      });
      setIsClientDialogOpen(false);
      resetClientForm();
    }
  };
  
  const handleProjectSubmit = () => {
    toast({
      title: "Project created successfully",
      description: `${projectForm.name} has been created and scheduled.`,
    });
    setIsProjectDialogOpen(false);
    setProjectStep(1);
    resetProjectForm();
  };
  
  const handlePaymentSubmit = () => {
    toast({
      title: "Payment recorded successfully",
      description: `Payment of ${paymentForm.amount} has been scheduled.`,
    });
    setIsPaymentDialogOpen(false);
    resetPaymentForm();
  };
  
  const resetClientForm = () => {
    setClientForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      logoUrl: "",
      status: "Active",
    });
    setClientErrors({});
  };
  
  const resetProjectForm = () => {
    setProjectForm({
      name: "",
      clientId: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      projectType: "AI Implementation",
      duration: "4 weeks",
      employeeCount: 10,
      hoursPerEmployee: 2,
      costPerHour: 50,
      priority: "Medium",
    });
  };
  
  const resetPaymentForm = () => {
    setPaymentForm({
      clientId: "",
      projectId: "",
      amount: "",
      dueDate: undefined,
      paymentType: "Initial",
      description: "",
      invoiceNumber: "",
    });
  };
  
  // ROI Calculation
  const calculateROI = () => {
    const dailyROI = projectForm.employeeCount * projectForm.hoursPerEmployee * projectForm.costPerHour;
    const monthlyROI = dailyROI * 22; // Working days per month
    const yearlyROI = monthlyROI * 12;
    const implementationFee = 1500;
    const netYearlyROI = yearlyROI - implementationFee;
    
    return {
      daily: dailyROI,
      monthly: monthlyROI,
      yearly: yearlyROI,
      netYearly: netYearlyROI,
    };
  };
  
  const roi = calculateROI();
  
  // Filter projects by selected client
  const availableProjects = mockProjects.filter(project => project.clientId === paymentForm.clientId);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your agency.
          </p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/clients">
          <MetricCard
            title="Total Clients"
            value="24"
            change="+12% this month"
            trend="up"
            icon={Users}
            color="text-blue-500"
            subtitle="Active clients"
          >
            <div className="mt-3">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={clientGrowthData}>
                  <Area 
                    type="monotone" 
                    dataKey="clients" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </MetricCard>
        </Link>

        <Link to="/admin/projects">
          <MetricCard
            title="Active Projects"
            value="18"
            change="+5 this quarter"
            trend="up"
            icon={FolderKanban}
            color="text-green-500"
            subtitle="73% avg completion"
          >
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span>73%</span>
              </div>
              <Progress value={73} className="h-2" />
            </div>
          </MetricCard>
        </Link>

        <MetricCard
          title="Monthly Revenue"
          value={formatCurrency(62000)}
          change="+18.5% vs last month"
          trend="up"
          icon={DollarSign}
          color="text-emerald-500"
          subtitle="Target: $55,000"
        >
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Target Achievement</span>
              <span>112%</span>
            </div>
            <Progress value={112} className="h-2" />
          </div>
        </MetricCard>

        <Link to="/admin/payments">
          <MetricCard
            title="Outstanding Payments"
            value={formatCurrency(28000)}
            change="3 overdue"
            trend="down"
            icon={AlertTriangle}
            color="text-red-500"
            subtitle="Avg 12 days overdue"
          >
            <div className="mt-3 flex items-center space-x-2">
              <Badge variant="destructive" className="text-xs">Urgent</Badge>
              <span className="text-xs text-muted-foreground">Requires attention</span>
            </div>
          </MetricCard>
        </Link>
      </div>

      {/* Quick Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
          <CardDescription>Streamlined access to common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Add New Client */}
            <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="h-24 flex flex-col gap-2 bg-primary hover:bg-primary/90"
                  onClick={resetClientForm}
                >
                  <UserPlus className="h-6 w-6" />
                  <span>Add New Client</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Quick Add Client</DialogTitle>
                  <DialogDescription>
                    Create a new client profile for your agency.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      value={clientForm.company}
                      onChange={(e) => setClientForm(prev => ({ ...prev, company: e.target.value }))}
                      className={clientErrors.company ? "border-destructive" : ""}
                    />
                    {clientErrors.company && (
                      <p className="text-sm text-destructive">{clientErrors.company}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="name">Contact Person *</Label>
                    <Input
                      id="name"
                      value={clientForm.name}
                      onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                      className={clientErrors.name ? "border-destructive" : ""}
                    />
                    {clientErrors.name && (
                      <p className="text-sm text-destructive">{clientErrors.name}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientForm.email}
                      onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                      className={clientErrors.email ? "border-destructive" : ""}
                    />
                    {clientErrors.email && (
                      <p className="text-sm text-destructive">{clientErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={clientForm.phone}
                      onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={clientForm.status === "Active"}
                      onCheckedChange={(checked) => 
                        setClientForm(prev => ({ ...prev, status: checked ? "Active" : "Inactive" }))
                      }
                    />
                    <Label htmlFor="status">Active Status</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsClientDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleClientSubmit}>Add Client</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Create Project */}
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => { resetProjectForm(); setProjectStep(1); }}
                >
                  <FolderPlus className="h-6 w-6" />
                  <span>Create Project</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Project - Step {projectStep} of 3</DialogTitle>
                  <DialogDescription>
                    {projectStep === 1 && "Enter basic project information"}
                    {projectStep === 2 && "Configure project phases and timeline"}
                    {projectStep === 3 && "Set up ROI calculations and settings"}
                  </DialogDescription>
                </DialogHeader>
                
                {/* Step 1: Basic Info */}
                {projectStep === 1 && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="projectName">Project Name *</Label>
                      <Input
                        id="projectName"
                        value={projectForm.name}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="AI Implementation Project"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="clientSelect">Client *</Label>
                      <Select 
                        value={projectForm.clientId} 
                        onValueChange={(value) => setProjectForm(prev => ({ ...prev, clientId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name} ({client.contact})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief project description..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={projectForm.startDate ? format(projectForm.startDate, 'yyyy-MM-dd') : ''}
                          onChange={(e) => setProjectForm(prev => ({ 
                            ...prev, 
                            startDate: e.target.value ? new Date(e.target.value) : undefined 
                          }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={projectForm.endDate ? format(projectForm.endDate, 'yyyy-MM-dd') : ''}
                          onChange={(e) => setProjectForm(prev => ({ 
                            ...prev, 
                            endDate: e.target.value ? new Date(e.target.value) : undefined 
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Project Phases */}
                {projectStep === 2 && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="projectType">Project Type</Label>
                      <Select 
                        value={projectForm.projectType} 
                        onValueChange={(value) => setProjectForm(prev => ({ ...prev, projectType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AI Implementation">AI Implementation</SelectItem>
                          <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                          <SelectItem value="CRM Integration">CRM Integration</SelectItem>
                          <SelectItem value="Mobile App">Mobile App Development</SelectItem>
                          <SelectItem value="Custom">Custom Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select 
                        value={projectForm.duration} 
                        onValueChange={(value) => setProjectForm(prev => ({ ...prev, duration: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2 weeks">2 weeks</SelectItem>
                          <SelectItem value="4 weeks">4 weeks (Standard)</SelectItem>
                          <SelectItem value="8 weeks">8 weeks</SelectItem>
                          <SelectItem value="12 weeks">12 weeks</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium">Standard Project Phases:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>Week 1: Setup & Info Collection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>Week 2-3: Implementation & Development</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>Week 4: Testing & Go-Live</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select 
                        value={projectForm.priority} 
                        onValueChange={(value) => setProjectForm(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                {/* Step 3: ROI Configuration */}
                {projectStep === 3 && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="employeeCount">Number of Employees</Label>
                      <Input
                        id="employeeCount"
                        type="number"
                        value={projectForm.employeeCount}
                        onChange={(e) => setProjectForm(prev => ({ 
                          ...prev, 
                          employeeCount: parseInt(e.target.value) || 0 
                        }))}
                        min="1"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="hoursPerEmployee">
                        Hours spent on repetitive tasks per employee per day: {projectForm.hoursPerEmployee}
                      </Label>
                      <Slider
                        id="hoursPerEmployee"
                        min={1}
                        max={8}
                        step={0.5}
                        value={[projectForm.hoursPerEmployee]}
                        onValueChange={(value) => setProjectForm(prev => ({ 
                          ...prev, 
                          hoursPerEmployee: value[0] 
                        }))}
                        className="py-4"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="costPerHour">Cost per hour per employee ($)</Label>
                      <Input
                        id="costPerHour"
                        type="number"
                        value={projectForm.costPerHour}
                        onChange={(e) => setProjectForm(prev => ({ 
                          ...prev, 
                          costPerHour: parseFloat(e.target.value) || 0 
                        }))}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="space-y-3 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium">ROI Calculation Preview:</h4>
                      <div className="space-y-1 text-sm">
                        <p>Daily savings: <strong>{formatCurrency(roi.daily)}</strong></p>
                        <p>Monthly savings: <strong>{formatCurrency(roi.monthly)}</strong></p>
                        <p>Yearly savings: <strong>{formatCurrency(roi.yearly)}</strong></p>
                        <p className="text-muted-foreground">Implementation fee: ${formatCurrency(1500)}</p>
                        <p className="text-success font-medium">
                          Net yearly ROI: <strong>{formatCurrency(roi.netYearly)}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <div className="flex w-full justify-between">
                    <div>
                      {projectStep > 1 && (
                        <Button 
                          variant="outline" 
                          onClick={() => setProjectStep(prev => prev - 1)}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                        Cancel
                      </Button>
                      {projectStep < 3 ? (
                        <Button onClick={() => setProjectStep(prev => prev + 1)}>
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      ) : (
                        <Button onClick={handleProjectSubmit}>
                          Create Project
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Record Payment */}
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-24 flex flex-col gap-2 border-success text-success hover:bg-success/10"
                  onClick={resetPaymentForm}
                >
                  <DollarSignIcon className="h-6 w-6" />
                  <span>Record Payment</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Quick Payment Entry</DialogTitle>
                  <DialogDescription>
                    Record a new payment for a client project.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="paymentClient">Client *</Label>
                    <Select 
                      value={paymentForm.clientId} 
                      onValueChange={(value) => setPaymentForm(prev => ({ 
                        ...prev, 
                        clientId: value,
                        projectId: "" // Reset project when client changes
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="paymentProject">Project *</Label>
                    <Select 
                      value={paymentForm.projectId} 
                      onValueChange={(value) => setPaymentForm(prev => ({ ...prev, projectId: value }))}
                      disabled={!paymentForm.clientId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProjects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount ($) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="15000"
                        step="0.01"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="paymentDueDate">Due Date</Label>
                      <Input
                        id="paymentDueDate"
                        type="date"
                        value={paymentForm.dueDate ? format(paymentForm.dueDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setPaymentForm(prev => ({ 
                          ...prev, 
                          dueDate: e.target.value ? new Date(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="paymentType">Payment Type</Label>
                    <Select 
                      value={paymentForm.paymentType} 
                      onValueChange={(value) => setPaymentForm(prev => ({ ...prev, paymentType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Initial">Initial Payment</SelectItem>
                        <SelectItem value="Monthly">Monthly Payment</SelectItem>
                        <SelectItem value="Final">Final Payment</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="paymentDescription">Description</Label>
                    <Input
                      id="paymentDescription"
                      value={paymentForm.description}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Payment for project milestone..."
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="invoiceNumber">Invoice Number (Optional)</Label>
                    <Input
                      id="invoiceNumber"
                      value={paymentForm.invoiceNumber}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="INV-2024-001"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePaymentSubmit}>Record Payment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Generate Report */}
            <Button 
              size="lg" 
              variant="outline"
              className="h-24 flex flex-col gap-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950/20"
              onClick={() => {
                toast({
                  title: "Report generation coming soon",
                  description: "Advanced reporting features will be available in the next update.",
                });
              }}
            >
              <BarChart3 className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Actions & Shortcuts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Recent Actions</CardTitle>
            <CardDescription>Continue where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Last worked with TechStart Solutions</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Continue
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-success rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Payment recorded for Digital Dynamics</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-warning rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">AI Implementation project updated</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Smart Shortcuts</CardTitle>
            <CardDescription>Context-aware suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/admin/payments">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                  Complete 3 overdue tasks
                </Button>
              </Link>
              
              <Link to="/admin/clients">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  Follow up with 5 clients
                </Button>
              </Link>
              
              <Link to="/admin/projects">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2 text-warning" />
                  Update project progress
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  toast({
                    title: "Workflow automation",
                    description: "Set up client workflow automation features coming soon.",
                  });
                }}
              >
                <Calendar className="h-4 w-4 mr-2 text-success" />
                Set up new client workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue vs targets (last 12 months)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => [formatCurrency(value), '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="Target"
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Revenue"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Payment Status Distribution</CardTitle>
            <CardDescription>Current payment status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any, name: any, props: any) => [
                    `${value}% (${formatCurrency(props.payload.amount)})`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {paymentStatusData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground ml-1">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Profitability and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project Profitability */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Project Profitability</CardTitle>
            <CardDescription>Top 5 most profitable projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProfitabilityData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${value/1000}k`} />
                <YAxis type="category" dataKey="project" stroke="hsl(var(--muted-foreground))" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => [formatCurrency(value), '']}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                <Bar dataKey="costs" fill="hsl(var(--muted))" name="Costs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest updates and events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div 
                  className={`h-2 w-2 rounded-full mt-2 ${
                    activity.status === 'success' 
                      ? 'bg-success' 
                      : activity.status === 'warning'
                      ? 'bg-warning'
                      : 'bg-primary'
                  }`} 
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-4">
              <Eye className="h-4 w-4 mr-2" />
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Performance Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Alerts & Notifications
            </CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  alert.priority === 'high' 
                    ? 'border-l-destructive bg-destructive/5' 
                    : alert.priority === 'medium'
                    ? 'border-l-warning bg-warning/5'
                    : 'border-l-primary bg-primary/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge 
                        variant={
                          alert.priority === 'high' 
                            ? 'destructive' 
                            : alert.priority === 'medium'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs"
                      >
                        {alert.priority}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Performance Metrics</CardTitle>
            <CardDescription>Project and client performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">On-time Delivery Rate</span>
                <span className="text-sm font-bold text-success">94.2%</span>
              </div>
              <Progress value={94.2} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Client Retention Rate</span>
                <span className="text-sm font-bold text-success">87.5%</span>
              </div>
              <Progress value={87.5} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Project Value</span>
                <span className="text-sm font-bold">{formatCurrency(45600)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Projects This Quarter</span>
                <span className="text-sm font-bold">23</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-sm font-bold">18</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                <p className="text-xs text-muted-foreground">In Progress</p>
                <p className="text-sm font-bold">4</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-xs text-muted-foreground">Delayed</p>
                <p className="text-sm font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}