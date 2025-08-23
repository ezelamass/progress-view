import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useDeliverables } from "@/hooks/useDeliverables";
import { useProjectOptional } from "@/contexts/ProjectContext";
import { formatDistanceToNow, format } from "date-fns";

const Deliverables = () => {
  const projectContext = useProjectOptional();
  const selectedProject = projectContext?.selectedProject;
  const { deliverables, loading } = useDeliverables(selectedProject?.id);

  // Filter deliverables for the current project
  const projectDeliverables = deliverables.filter(
    deliverable => deliverable.project_id === selectedProject?.id
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return "bg-success/20 text-success border-success/30";
      case 'in_progress': return "bg-warning/20 text-warning border-warning/30";
      case 'pending': return "bg-muted/20 text-muted-foreground border-muted/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return "bg-destructive/20 text-destructive border-destructive/30";
      case 'medium': return "bg-warning/20 text-warning border-warning/30";
      case 'low': return "bg-muted/20 text-muted-foreground border-muted/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Project Deliverables
        </h1>
        <p className="text-muted-foreground">
          {selectedProject ? (
            <>Track progress and milestones for <span className="font-medium">{selectedProject.name}</span></>
          ) : (
            "No project selected"
          )}
        </p>
      </div>

      {/* Project Info Card */}
      {selectedProject && (
        <Card className="mb-6 bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {selectedProject.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedProject.description || "No description available"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Progress</div>
                <div className="text-2xl font-bold text-primary">
                  {selectedProject.progress_percentage}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deliverables Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : projectDeliverables.length === 0 ? (
        <Card className="bg-card border-border/50">
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground mb-4">📋</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No deliverables found
            </h3>
            <p className="text-muted-foreground">
              {selectedProject 
                ? "No deliverables have been assigned to this project yet."
                : "Please select a project to view its deliverables."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectDeliverables.map((deliverable) => {
            const StatusIcon = getStatusIcon(deliverable.status);
            const isOverdue = new Date(deliverable.due_date) < new Date() && deliverable.status !== 'completed';
            
            return (
              <Card key={deliverable.id} className="bg-card border-border/50 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold text-foreground mb-2 line-clamp-2">
                        {deliverable.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {deliverable.description || "No description available"}
                      </p>
                    </div>
                    <StatusIcon className={`h-5 w-5 flex-shrink-0 ml-2 ${
                      deliverable.status === 'completed' ? 'text-success' :
                      deliverable.status === 'in_progress' ? 'text-warning' :
                      'text-muted-foreground'
                    }`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status and Priority */}
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${getStatusColor(deliverable.status)}`}
                    >
                      {deliverable.status.replace('_', ' ')}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${getPriorityColor(deliverable.priority)}`}
                    >
                      {deliverable.priority} priority
                    </Badge>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className={`${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                      Due {format(new Date(deliverable.due_date), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  {/* Time Info */}
                  <div className="text-xs text-muted-foreground">
                    {deliverable.completed_at ? (
                      <span>
                        Completed {formatDistanceToNow(new Date(deliverable.completed_at), { addSuffix: true })}
                      </span>
                    ) : (
                      <span>
                        Created {formatDistanceToNow(new Date(deliverable.created_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>

                  {/* Overdue Warning */}
                  {isOverdue && (
                    <div className="text-xs text-destructive font-medium">
                      ⚠️ Overdue
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Deliverables;