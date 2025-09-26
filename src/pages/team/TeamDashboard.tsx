import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/ProjectContext";
import { useDeliverables } from "@/hooks/useDeliverables";
import { useMeetings } from "@/hooks/useMeetings";
import { usePhases } from "@/hooks/usePhases";
import { Calendar, CheckCircle, Clock, Package, Video, ArrowRight, Building2 } from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { Link } from "react-router-dom";
import ProjectBreadcrumb from "@/components/ProjectBreadcrumb";

export default function TeamDashboard() {
  const { selectedProject } = useProject();
  
  const { deliverables } = useDeliverables();
  const { meetings } = useMeetings();
  const { phases } = usePhases(selectedProject?.id);

  // Filter data for current project
  const projectDeliverables = deliverables.filter(d => d.project_id === selectedProject?.id);
  const projectMeetings = meetings.filter(m => m.project_id === selectedProject?.id);

  // Calculate stats
  const deliverableStats = {
    total: projectDeliverables.length,
    completed: projectDeliverables.filter(d => d.status === 'completed').length,
    pending: projectDeliverables.filter(d => d.status === 'pending').length,
    overdue: projectDeliverables.filter(d => d.status === 'overdue').length,
  };

  // Get upcoming deliverables (due within next 7 days)
  const upcomingDeliverables = projectDeliverables
    .filter(d => {
      const dueDate = new Date(d.due_date);
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return isAfter(dueDate, now) && isBefore(dueDate, nextWeek) && d.status !== 'completed';
    })
    .slice(0, 3);

  // Get current phase
  const currentPhase = phases.find(p => p.status === 'in_progress') || phases[0];

  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <ProjectBreadcrumb pageName="Dashboard" />
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Project Selected</h3>
              <p className="text-muted-foreground">
                Please select a project to view your dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ProjectBreadcrumb pageName="Dashboard" />
      
      <div>
        <h1 className="text-3xl font-bold text-foreground">Team Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of {selectedProject.name} project
        </p>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{selectedProject.clients?.company}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Project Status</p>
                <Badge variant={selectedProject.status === 'active' ? 'default' : 'secondary'}>
                  {selectedProject.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${selectedProject.progress_percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{selectedProject.progress_percentage}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Environment</p>
                <p className="font-medium capitalize">{selectedProject.environment}</p>
              </div>
            </div>
            
            {currentPhase && (
              <div>
                <p className="text-sm text-muted-foreground">Current Phase</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{currentPhase.name}</Badge>
                  <Badge variant="secondary" className="text-xs">
                    {format(new Date(currentPhase.start_date), 'MMM dd')} - {format(new Date(currentPhase.end_date), 'MMM dd')}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Total Deliverables</p>
                <p className="text-2xl font-bold">{deliverableStats.total}</p>
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
                <p className="text-2xl font-bold">{deliverableStats.completed}</p>
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
                <p className="text-2xl font-bold">{deliverableStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4 text-purple-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Meetings</p>
                <p className="text-2xl font-bold">{projectMeetings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deliverables */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Deliverables</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/team/deliverables">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingDeliverables.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No upcoming deliverables in the next 7 days.
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingDeliverables.map((deliverable) => (
                <div key={deliverable.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{deliverable.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Due {format(new Date(deliverable.due_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {deliverable.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/team/phases">
                <Clock className="h-4 w-4 mr-2" />
                View Project Phases
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/team/meetings">
                <Video className="h-4 w-4 mr-2" />
                View Meetings
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/team/payments">
                <Calendar className="h-4 w-4 mr-2" />
                Check My Payments
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedProject.drive_folder_url && (
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href={selectedProject.drive_folder_url} target="_blank" rel="noopener noreferrer">
                  <Building2 className="h-4 w-4 mr-2" />
                  Project Drive Folder
                </a>
              </Button>
            )}
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/help">
                <Calendar className="h-4 w-4 mr-2" />
                Get Help & Support
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}