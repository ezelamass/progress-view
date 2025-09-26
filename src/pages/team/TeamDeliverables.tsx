import { useState } from "react";
import { Calendar, CheckCircle, Clock, AlertTriangle, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDeliverables } from "@/hooks/useDeliverables";
import { useProject } from "@/contexts/ProjectContext";
import { format } from "date-fns";
import ProjectBreadcrumb from "@/components/ProjectBreadcrumb";

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

export default function TeamDeliverables() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { selectedProject } = useProject();
  
  const { deliverables, loading } = useDeliverables();

  // Filter deliverables for the selected project
  const projectDeliverables = deliverables.filter(d => d.project_id === selectedProject?.id);
  
  const filteredDeliverables = projectDeliverables.filter(deliverable => {
    const matchesSearch = deliverable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (deliverable.description && deliverable.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || deliverable.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: projectDeliverables.length,
    completed: projectDeliverables.filter(d => d.status === 'completed').length,
    pending: projectDeliverables.filter(d => d.status === 'pending').length,
    overdue: projectDeliverables.filter(d => d.status === 'overdue').length,
    in_progress: projectDeliverables.filter(d => d.status === 'in_progress').length,
  };

  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <ProjectBreadcrumb pageName="Deliverables" />
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Project Selected</h3>
              <p className="text-muted-foreground">
                Please select a project to view deliverables.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectBreadcrumb pageName="Deliverables" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Deliverables</h1>
          <p className="text-muted-foreground">
            View deliverables for {selectedProject.name}
          </p>
        </div>
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
      <Card>
        <CardHeader>
          <CardTitle>Filter Deliverables</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search deliverables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
        </CardContent>
      </Card>

      {/* Deliverables Table */}
      <Card>
        <CardHeader>
          <CardTitle>Deliverables</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading deliverables...</div>
          ) : filteredDeliverables.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? "No deliverables match your filters."
                : "No deliverables found for this project."
              }
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliverables.map((deliverable) => (
                  <TableRow key={deliverable.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{deliverable.name}</span>
                          {deliverable.is_bonus && (
                            <Badge variant="secondary" className="text-xs">
                              Bonus
                            </Badge>
                          )}
                        </div>
                        {deliverable.description && (
                          <p className="text-sm text-muted-foreground">
                            {deliverable.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getPriorityFlag(deliverable.priority)}
                        <span className="capitalize">{deliverable.priority}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(deliverable.due_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(deliverable.status)}
                        {getStatusBadge(deliverable.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {deliverable.loom_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(deliverable.loom_url!, '_blank')}
                          >
                            View Video
                          </Button>
                        )}
                        {Array.isArray(deliverable.attachments) && deliverable.attachments.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {deliverable.attachments.length} files
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}