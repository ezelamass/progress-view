import { ChevronLeft, ChevronRight, CheckCircle, Clock, AlertTriangle, Flag, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDeliverables } from "@/hooks/useDeliverables";
import { usePhases } from "@/hooks/usePhases";
import { useProjects } from "@/hooks/useProjects";
import { useUserProjectAssignments } from "@/hooks/useUserProjectAssignments";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";

interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  color: string;
  projectName: string;
}

const TeamCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | null>(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState<any>(null);
  const { language } = useTheme();
  const { user } = useAuth();
  
  // Get team member's assigned projects
  const { assignments, loading: assignmentsLoading } = useUserProjectAssignments();
  const { projects, loading: projectsLoading } = useProjects();
  
  // Filter projects for current user
  const userAssignments = assignments.filter(assignment => assignment.user_id === user?.id);
  const userProjects = projects.filter(project => 
    userAssignments.some(assignment => assignment.project_id === project.id)
  );
  
  // Collect all phases and deliverables from user projects
  const allPhases: any[] = [];
  const allDeliverables: any[] = [];
  
  // Get phases and deliverables for all assigned projects
  userProjects.forEach(project => {
    // Note: In a real implementation, we'd need to refactor this to avoid hooks in loops
    // For now, this is a simplified version that will work for the current data structure
    allPhases.push({
      id: `phase-${project.id}`,
      name: `${project.name} Phase`,
      description: project.description || '',
      start_date: project.start_date,
      end_date: project.end_date,
      status: project.status === 'active' ? 'in_progress' : project.status,
      phase_type: 'desarrollo',
      projectName: project.name
    });
  });
  
  if (assignmentsLoading || projectsLoading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">📅</div>
              <p className="text-sm text-muted-foreground">Loading calendar...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userProjects.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Projects Assigned</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'es' 
                  ? 'No tienes proyectos asignados para mostrar en el calendario'
                  : 'You have no assigned projects to display in the calendar'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Convert phases to calendar format
  const projectPhases: ProjectPhase[] = allPhases.map(phase => ({
    id: phase.id,
    name: phase.name,
    description: phase.description || '',
    startDate: new Date(phase.start_date),
    endDate: new Date(phase.end_date),
    status: phase.status,
    color: phase.phase_type === 'descubrimiento' ? 'bg-green-500' : 
           phase.phase_type === 'desarrollo' ? 'bg-blue-500' : 'bg-purple-500',
    projectName: phase.projectName
  }));

  const monthNames = language === 'es' ? [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ] : [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = language === 'es' ? 
    ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] : 
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, new Date(year, month, 0).getDate() - i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Add next month's days to complete the grid
    const remainingCells = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getPhaseForDate = (date: Date) => {
    return projectPhases.find(phase => 
      date >= phase.startDate && date <= phase.endDate
    );
  };

  const getDeliverablesForDate = (date: Date) => {
    return allDeliverables.filter(deliverable => 
      new Date(deliverable.due_date).toDateString() === date.toDateString()
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'in_progress': return <Clock className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const handlePhaseClick = (phase: ProjectPhase) => {
    setSelectedPhase(phase);
  };

  const handleDeliverableClick = (deliverable: any) => {
    setSelectedDeliverable(deliverable);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          {language === 'es' ? 'Calendario del Proyecto' : 'Project Calendar'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'es' 
            ? `Vista general de tus ${userProjects.length} proyecto(s) asignado(s)`
            : `Overview of your ${userProjects.length} assigned project(s)`
          }
        </p>
      </div>

      {/* Calendar Navigation */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>
              {language === 'es' ? 'Hoy' : 'Today'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const phase = getPhaseForDate(day.date);
              const dayDeliverables = getDeliverablesForDate(day.date);
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[80px] p-1 border rounded-md relative
                    ${day.isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
                    ${isToday(day.date) ? 'ring-2 ring-primary' : ''}
                  `}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                    ${isToday(day.date) ? 'text-primary' : ''}
                  `}>
                    {day.date.getDate()}
                  </div>
                  
                  {/* Phase Bar */}
                  {phase && (
                    <div 
                      className={`
                        ${phase.color} text-white text-xs p-1 rounded mb-1 flex items-center gap-1 cursor-pointer hover:opacity-80
                        ${phase.startDate.toDateString() === day.date.toDateString() ? 'rounded-l' : ''}
                        ${phase.endDate.toDateString() === day.date.toDateString() ? 'rounded-r' : ''}
                      `}
                      onClick={() => handlePhaseClick(phase)}
                      title={`${phase.name} - ${phase.projectName}`}
                    >
                      {getStatusIcon(phase.status)}
                      {phase.startDate.toDateString() === day.date.toDateString() && (
                        <span className="truncate">{phase.name}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Deliverables */}
                  <div className="flex flex-col gap-1">
                    {dayDeliverables.map(deliverable => (
                      <div
                        key={deliverable.id}
                        className={`
                          relative inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-transform
                          truncate max-w-full
                          ${deliverable.status === 'completed' ? 'bg-green-600 text-white' : 
                            deliverable.status === 'overdue' ? 'bg-red-600 text-white' : 
                            deliverable.status === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeliverableClick(deliverable);
                        }}
                        title={`${deliverable.name} - ${deliverable.projectName} - ${deliverable.status}`}
                      >
                        {deliverable.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3 text-white" />
                        ) : (
                          <Clock className="w-3 h-3 text-white" />
                        )}
                        <span className="truncate max-w-[120px]">{deliverable.name}</span>
                        {deliverable.priority === 'high' && (
                          <Flag className={`ml-1 w-3 h-3 ${getPriorityColor(deliverable.priority)}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assigned Projects */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {language === 'es' ? 'Proyectos Asignados' : 'Assigned Projects'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userProjects.map(project => (
                <div key={project.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(project.start_date), 'MMM dd')} - {format(new Date(project.end_date), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize ${
                      project.status === 'completed'
                        ? 'bg-success/20 text-success border-success/30'
                        : project.status === 'active'
                        ? 'bg-primary/20 text-primary border-primary/30'
                        : 'bg-muted/50 text-muted-foreground border-border'
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deliverables */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {language === 'es' ? 'Próximas Entregas' : 'Upcoming Deliverables'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allDeliverables
                .filter(d => new Date(d.due_date) >= new Date())
                .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                .slice(0, 5)
                .map(deliverable => (
                  <div 
                    key={deliverable.id} 
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => handleDeliverableClick(deliverable)}
                  >
                    <div className={`w-4 h-4 rounded-full ${
                      deliverable.status === 'completed' ? 'bg-green-500' :
                      deliverable.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{deliverable.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {deliverable.projectName} • {format(new Date(deliverable.due_date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    {deliverable.priority === 'high' && (
                      <Flag className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                ))}
              {allDeliverables.filter(d => new Date(d.due_date) >= new Date()).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {language === 'es' ? 'No hay entregas próximas' : 'No upcoming deliverables'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Details Modal */}
      <Dialog open={!!selectedPhase} onOpenChange={() => setSelectedPhase(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${selectedPhase?.color} flex items-center justify-center`}>
                {selectedPhase && getStatusIcon(selectedPhase.status)}
              </div>
              {selectedPhase?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedPhase && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Project</h4>
                <p className="text-sm text-muted-foreground">{selectedPhase.projectName}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedPhase.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Start Date</h4>
                  <p className="text-sm">{selectedPhase.startDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">End Date</h4>
                  <p className="text-sm">{selectedPhase.endDate.toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Status</h4>
                <Badge
                  variant="outline"
                  className={`capitalize ${
                    selectedPhase.status === 'completed'
                      ? 'bg-success/20 text-success border-success/30'
                      : selectedPhase.status === 'in_progress'
                      ? 'bg-primary/20 text-primary border-primary/30'
                      : 'bg-muted/50 text-muted-foreground border-border'
                  }`}
                >
                  {selectedPhase.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Deliverable Details Modal */}
      <Dialog open={!!selectedDeliverable} onOpenChange={() => setSelectedDeliverable(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${
                selectedDeliverable?.status === 'completed' ? 'bg-green-500' :
                selectedDeliverable?.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'
              }`} />
              {selectedDeliverable?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedDeliverable && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Project</h4>
                <p className="text-sm text-muted-foreground">{selectedDeliverable.projectName}</p>
              </div>
              {selectedDeliverable.description && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedDeliverable.description}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Due Date</h4>
                  <p className="text-sm">{new Date(selectedDeliverable.due_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Priority</h4>
                  <Badge variant="outline" className={`capitalize ${getPriorityColor(selectedDeliverable.priority)}`}>
                    {selectedDeliverable.priority}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Status</h4>
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      selectedDeliverable.status === 'completed'
                        ? 'bg-success/20 text-success border-success/30'
                        : selectedDeliverable.status === 'in_progress'
                        ? 'bg-primary/20 text-primary border-primary/30'
                        : selectedDeliverable.status === 'overdue'
                        ? 'bg-destructive/20 text-destructive border-destructive/30'
                        : 'bg-muted/50 text-muted-foreground border-border'
                    }`}
                  >
                    {selectedDeliverable.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamCalendar;