import { useState, useEffect } from "react";
import { Calendar, CheckCircle, Clock, AlertTriangle, Flag, LayoutGrid, List, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeliverables } from "@/hooks/useDeliverables";
import { useProjectOptional } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'in_progress':
      return <Clock className="h-4 w-4 text-primary" />;
    case 'overdue':
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  const variants = {
    completed: 'bg-success/20 text-success border-success/30',
    in_progress: 'bg-primary/20 text-primary border-primary/30',
    pending: 'bg-muted/50 text-muted-foreground border-border',
    overdue: 'bg-destructive/20 text-destructive border-destructive/30',
  } as const;
  
  return (
    <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.pending}>
      {status.replace('_', ' ')}
    </Badge>
  );
};

const getPriorityFlag = (priority: string) => {
  const colors = {
    high: 'text-destructive',
    medium: 'text-warning',
    low: 'text-success',
  };
  
  return <Flag className={cn("h-4 w-4", colors[priority as keyof typeof colors])} />;
};

const getDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-destructive' };
  } else if (diffDays <= 3) {
    return { text: `Due in ${diffDays} days`, color: 'text-warning' };
  } else {
    return { text: new Date(dueDate).toLocaleDateString(), color: 'text-foreground' };
  }
};

export default function DeliverablesView() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const navigate = useNavigate();
  const projectContext = useProjectOptional();
  const selectedProject = projectContext?.selectedProject;
  
  const { deliverables, loading } = useDeliverables(selectedProject?.id);

  const filteredDeliverables = deliverables.filter(deliverable => {
    if (statusFilter === 'all') return true;
    return deliverable.status === statusFilter;
  });

  const statusCounts = {
    total: deliverables.length,
    completed: deliverables.filter(d => d.status === 'completed').length,
    pending: deliverables.filter(d => d.status === 'pending').length,
    overdue: deliverables.filter(d => d.status === 'overdue').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Project Deliverables</h1>
          <p className="text-muted-foreground">
            Track your project milestones and deliverables
            {selectedProject && ` for ${selectedProject.name}`}
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
                <CheckCircle className="h-4 w-4 text-success" />
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
                <Clock className="h-4 w-4 text-primary" />
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
                <AlertTriangle className="h-4 w-4 text-destructive" />
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
        {filteredDeliverables.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No deliverables found</h3>
              <p className="text-muted-foreground">
                {statusFilter === 'all' 
                  ? 'No deliverables have been created for this project yet.'
                  : `No deliverables with status "${statusFilter}" found.`
                }
              </p>
            </CardContent>
          </Card>
        ) : viewMode === 'table' ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deliverable</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliverables.map((deliverable) => {
                  const dueDateInfo = getDaysUntilDue(deliverable.due_date);
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDeliverables.map((deliverable) => {
              const dueDateInfo = getDaysUntilDue(deliverable.due_date);
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
                        <span className="text-sm font-medium">Priority:</span>
                        <div className="flex items-center space-x-1">
                          {getPriorityFlag(deliverable.priority)}
                          <span className="text-sm capitalize">{deliverable.priority}</span>
                        </div>
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