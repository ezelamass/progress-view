import { ChevronLeft, ChevronRight, CheckCircle, Clock, AlertTriangle, Flag, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { useDeliverables } from "@/hooks/useDeliverables";
import { format } from "date-fns";

interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  progress: number;
  color: string;
}

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | null>(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState<any>(null);
  
  const { selectedProject } = useProject();
  const { deliverables, loading } = useDeliverables(selectedProject?.id || undefined);
  
  if (!selectedProject) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">📅</div>
              <p className="text-sm text-muted-foreground">
                Select a project to view calendar
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate project phases based on timeline and progress
  const startDate = new Date(selectedProject.start_date);
  const endDate = new Date(selectedProject.end_date);
  const progress = selectedProject.progress_percentage;
  
  const projectPhases: ProjectPhase[] = [
    {
      id: "1",
      name: "Setup & Info Collection",
      description: "Initial setup, requirements gathering, and stakeholder interviews",
      startDate: startDate,
      endDate: new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000)), // 1 week
      status: progress >= 25 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started',
      progress: Math.min(progress * 4, 100), // First 25% of project
      color: 'bg-green-500'
    },
    {
      id: "2", 
      name: "Implementation & Development",
      description: "Core development work and feature implementation",
      startDate: new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000)), // Week 2
      endDate: new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000)), // Until last week
      status: progress >= 75 ? 'completed' : progress >= 25 ? 'in_progress' : 'not_started',
      progress: Math.max(0, Math.min((progress - 25) * 2, 100)), // 25% to 75% of project
      color: 'bg-blue-500'
    },
    {
      id: "3",
      name: "Testing & Go-Live", 
      description: "Quality assurance, final testing, and production deployment",
      startDate: new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000)), // Last week
      endDate: endDate,
      status: progress >= 100 ? 'completed' : progress >= 75 ? 'in_progress' : 'not_started',
      progress: Math.max(0, (progress - 75) * 4), // Last 25% of project
      color: 'bg-purple-500'
    }
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    return deliverables.filter(deliverable => 
      new Date(deliverable.due_date).toDateString() === date.toDateString()
    );
  };

  const getDeliverableStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 border-green-600';
      case 'overdue': return 'bg-red-500 border-red-600';
      case 'in_progress': return 'bg-blue-500 border-blue-600';
      default: return 'bg-gray-500 border-gray-600';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'in_progress': return <Clock className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };


  const days = getDaysInMonth(currentDate);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
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
                Today
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
                        title={`${phase.name} - ${phase.progress}% complete`}
                      >
                        {getStatusIcon(phase.status)}
                        {phase.startDate.toDateString() === day.date.toDateString() && (
                          <span className="truncate">{phase.name}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Deliverables */}
                    <div className="flex flex-wrap gap-1">
                      {dayDeliverables.map(deliverable => (
                        <div
                          key={deliverable.id}
                          className={`
                            relative flex items-center justify-center w-4 h-4 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform
                            ${getDeliverableStatusColor(deliverable.status)}
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeliverableClick(deliverable);
                          }}
                          title={`${deliverable.name} - ${deliverable.status}`}
                        >
                          {deliverable.status === 'completed' && (
                            <CheckCircle className="w-2.5 h-2.5 text-white" />
                          )}
                          {deliverable.priority === 'high' && (
                            <Flag className={`absolute -top-1 -right-1 w-2 h-2 ${getPriorityColor(deliverable.priority)}`} />
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

        {/* Legend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phase Legend */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-medium">Project Phases</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectPhases.map(phase => (
                  <div 
                    key={phase.id} 
                    className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded"
                    onClick={() => handlePhaseClick(phase)}
                  >
                    <div className={`w-4 h-4 rounded ${phase.color} flex items-center justify-center`}>
                      {getStatusIcon(phase.status)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{phase.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {phase.startDate.toLocaleDateString()} - {phase.endDate.toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {phase.progress}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deliverables Legend */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-medium">Deliverable Status & Priority</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-600 flex items-center justify-center">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-600" />
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-gray-600" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-600" />
                      <span className="text-sm">Overdue</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Priority</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Flag className="w-3 h-3 text-red-500" />
                      <span className="text-sm">High Priority</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Flag className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm">Medium Priority</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Flag className="w-3 h-3 text-green-500" />
                      <span className="text-sm">Low Priority</span>
                    </div>
                  </div>
                </div>
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
                  <h4 className="font-medium text-sm mb-1">Progress</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${selectedPhase.color}`}
                        style={{ width: `${selectedPhase.progress}%` }}
                      />
                    </div>
                    <span className="text-sm">{selectedPhase.progress}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Phase Deliverables</h4>
                  <div className="space-y-2">
                    {deliverables
                      .map(deliverable => (
                        <div key={deliverable.id} className="flex items-center gap-2 p-2 border rounded">
                          <div className={`w-3 h-3 rounded-full ${getDeliverableStatusColor(deliverable.status).split(' ')[0]}`} />
                          <span className="text-sm flex-1">{deliverable.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {new Date(deliverable.due_date).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Deliverable Details Modal */}
        <Dialog open={!!selectedDeliverable} onOpenChange={() => setSelectedDeliverable(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${selectedDeliverable && getDeliverableStatusColor(selectedDeliverable.status).split(' ')[0]}`} />
                {selectedDeliverable?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedDeliverable && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedDeliverable.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Due Date</h4>
                    <p className="text-sm">{new Date(selectedDeliverable.due_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Status</h4>
                    <Badge 
                      variant={selectedDeliverable.status === 'completed' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {selectedDeliverable.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Priority</h4>
                    <div className="flex items-center gap-1">
                      <Flag className={`w-3 h-3 ${getPriorityColor(selectedDeliverable.priority)}`} />
                      <span className="text-sm capitalize">{selectedDeliverable.priority}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Project</h4>
                    <p className="text-sm">{selectedDeliverable.projectName}</p>
                  </div>
                </div>
                {selectedDeliverable.assignedTo && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Assigned To</h4>
                    <p className="text-sm">{selectedDeliverable.assignedTo}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default Calendar;