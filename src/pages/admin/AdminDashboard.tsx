import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
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
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  FolderKanban,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  Target,
  Activity,
  Bell,
  UserPlus,
  FolderPlus,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  XCircle,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import QuickActionsWidget from "@/components/admin/widgets/QuickActionsWidget";

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

      {/* Quick Actions Section */}
      <QuickActionsWidget
        onClientAdded={() => {
          console.log("Client added");
        }}
        onProjectCreated={() => {
          console.log("Project created");
        }}
        onPaymentRecorded={() => {
          console.log("Payment recorded");
        }}
      />

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