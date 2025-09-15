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
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { useAdminCharts } from "@/hooks/useAdminCharts";
import { useAdminAlerts } from "@/hooks/useAdminAlerts";
import { useActivities } from "@/hooks/useActivities";


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
  const { metrics, loading: metricsLoading } = useAdminMetrics();
  const { chartData, loading: chartsLoading } = useAdminCharts();
  const { alerts, loading: alertsLoading } = useAdminAlerts();
  const { activities, loading: activitiesLoading } = useActivities(undefined, 5);
  
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
            value={metricsLoading ? "..." : metrics.totalClients.toString()}
            change="+12% this month"
            trend="up"
            icon={Users}
            color="text-blue-500"
            subtitle="Active clients"
          >
            <div className="mt-3">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={metrics.clientGrowthData}>
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
            value={metricsLoading ? "..." : metrics.activeProjects.toString()}
            change="+5 this quarter"
            trend="up"
            icon={FolderKanban}
            color="text-green-500"
            subtitle={`${metrics.avgProjectProgress}% avg completion`}
          >
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span>{metrics.avgProjectProgress}%</span>
              </div>
              <Progress value={metrics.avgProjectProgress} className="h-2" />
            </div>
          </MetricCard>
        </Link>

        <MetricCard
          title="Monthly Revenue"
          value={metricsLoading ? "..." : formatCurrency(metrics.monthlyRevenue)}
          change="+18.5% vs last month"
          trend="up"
          icon={DollarSign}
          color="text-emerald-500"
          subtitle={`Current month revenue`}
        >
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">This Month</span>
              <span>{formatCurrency(metrics.monthlyRevenue)}</span>
            </div>
            <Progress value={Math.min((metrics.monthlyRevenue / 50000) * 100, 100)} className="h-2" />
          </div>
        </MetricCard>

        <Link to="/admin/payments">
          <MetricCard
            title="Outstanding Payments"
            value={metricsLoading ? "..." : formatCurrency(metrics.outstandingPayments)}
            change={`${metrics.overduePaymentsCount} overdue`}
            trend="down"
            icon={AlertTriangle}
            color="text-red-500"
            subtitle="Pending + overdue"
          >
            <div className="mt-3 flex items-center space-x-2">
              {metrics.overduePaymentsCount > 0 && (
                <Badge variant="destructive" className="text-xs">Urgent</Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {metrics.overduePaymentsCount > 0 ? "Requires attention" : "All up to date"}
              </span>
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
              {activitiesLoading ? (
                <div className="space-y-3">
                  <div className="animate-pulse flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-muted rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-48"></div>
                        <div className="h-3 bg-muted rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activities.length > 0 ? (
                activities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(activity.created_at), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-muted rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">No recent actions</p>
                      <p className="text-xs text-muted-foreground">Start by creating a project</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    Start
                  </Button>
                </div>
              )}
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
            <CardDescription>Monthly revenue from paid invoices (last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartsLoading ? [] : chartData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Revenue"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
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
                  data={chartsLoading ? [] : chartData.paymentStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {(chartsLoading ? [] : chartData.paymentStatusData).map((entry, index) => (
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
            {!chartsLoading && chartData.paymentStatusData.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {chartData.paymentStatusData.map((item) => (
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project Profitability and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project Profitability */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Project Revenue</CardTitle>
            <CardDescription>Revenue generated by each project</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartsLoading ? [] : chartData.projectProfitabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="project" stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  tickFormatter={(value) => `$${value}`}
                  domain={[100, 3000]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
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
            {activitiesLoading ? (
              <div className="space-y-3">
                <div className="animate-pulse flex space-x-3">
                  <div className="h-2 w-2 bg-muted rounded-full mt-2"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full mt-2 bg-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
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
            {alertsLoading ? (
              <div className="space-y-3">
                <div className="animate-pulse p-4 rounded-lg border-l-4 border-l-muted bg-muted/5">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ) : alerts.length > 0 ? (
              alerts.map((alert) => (
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
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No alerts at this time</p>
            )}
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
                <span className="text-sm font-bold text-success">
                  {metricsLoading ? "..." : `${metrics.onTimeDeliveryRate}%`}
                </span>
              </div>
              <Progress value={metricsLoading ? 0 : metrics.onTimeDeliveryRate} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Client Retention Rate</span>
                <span className="text-sm font-bold text-success">
                  {metricsLoading ? "..." : `${metrics.clientRetentionRate}%`}
                </span>
              </div>
              <Progress value={metricsLoading ? 0 : metrics.clientRetentionRate} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Project Value</span>
                <span className="text-sm font-bold">
                  {metricsLoading ? "..." : formatCurrency(metrics.avgProjectValue)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Projects This Quarter</span>
                <span className="text-sm font-bold">
                  {metricsLoading ? "..." : metrics.projectsThisQuarter.toString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-sm font-bold">
                  {metricsLoading ? "..." : metrics.projectStatusCounts.completed.toString()}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                <p className="text-xs text-muted-foreground">In Progress</p>
                <p className="text-sm font-bold">
                  {metricsLoading ? "..." : metrics.projectStatusCounts.inProgress.toString()}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-xs text-muted-foreground">Delayed</p>
                <p className="text-sm font-bold">
                  {metricsLoading ? "..." : metrics.projectStatusCounts.delayed.toString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}