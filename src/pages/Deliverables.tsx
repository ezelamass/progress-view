import { useState } from "react";
import { Calendar, CheckCircle, Clock, AlertTriangle, Flag, LayoutGrid, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockDeliverables, Deliverable } from "@/types/deliverables";
import { cn } from "@/lib/utils";

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

const getDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
  } else if (diffDays <= 3) {
    return { text: `Due in ${diffDays} days`, color: 'text-orange-600' };
  } else {
    return { text: new Date(dueDate).toLocaleDateString(), color: 'text-foreground' };
  }
};

export default function Deliverables() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Filter deliverables for current client (in real app, this would be based on user's projects)
  const clientDeliverables = mockDeliverables.filter(d => d.projectId === 'proj-1');
  
  const filteredDeliverables = clientDeliverables.filter(deliverable => {
    if (statusFilter === 'all') return true;
    return deliverable.status === statusFilter;
  });

  const statusCounts = {
    total: clientDeliverables.length,
    completed: clientDeliverables.filter(d => d.status === 'completed').length,
    pending: clientDeliverables.filter(d => d.status === 'pending').length,
    overdue: clientDeliverables.filter(d => d.status === 'overdue').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Project Deliverables</h1>
          <p className="text-muted-foreground">
            Track your project milestones and deliverables
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-4 md:grid-cols-4">
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

        {/* Filters and View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Deliverables Display */}
        {viewMode === 'table' ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deliverable</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliverables.map((deliverable) => {
                  const dueDateInfo = getDaysUntilDue(deliverable.dueDate);
                  return (
                    <TableRow key={deliverable.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{deliverable.name}</p>
                          <p className="text-sm text-muted-foreground">{deliverable.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={dueDateInfo.color}>{dueDateInfo.text}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(deliverable.status)}
                          {getStatusBadge(deliverable.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPriorityFlag(deliverable.priority)}
                          <span className="capitalize">{deliverable.priority}</span>
                        </div>
                      </TableCell>
                      <TableCell>{deliverable.assignedTo}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDeliverables.map((deliverable) => {
              const dueDateInfo = getDaysUntilDue(deliverable.dueDate);
              return (
                <Card key={deliverable.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{deliverable.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        {getPriorityFlag(deliverable.priority)}
                        {getStatusIcon(deliverable.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{deliverable.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Due Date:</span>
                        <span className={cn("text-sm", dueDateInfo.color)}>{dueDateInfo.text}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        {getStatusBadge(deliverable.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Assigned To:</span>
                        <span className="text-sm">{deliverable.assignedTo}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}