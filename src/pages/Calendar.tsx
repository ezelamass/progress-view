import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

interface Deliverable {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  phaseId: string;
  priority: 'low' | 'medium' | 'high';
}

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock data for project phases
  const projectPhases: ProjectPhase[] = [
    {
      id: "1",
      name: "Setup & Info Collection",
      description: "Initial setup, requirements gathering, and stakeholder interviews",
      startDate: new Date(2024, 1, 5), // Feb 5, 2024
      endDate: new Date(2024, 1, 9), // Feb 9, 2024
      status: 'completed',
      progress: 100,
      color: 'bg-green-500'
    },
    {
      id: "2", 
      name: "Implementation & Development",
      description: "Core development work and feature implementation",
      startDate: new Date(2024, 1, 12), // Feb 12, 2024
      endDate: new Date(2024, 1, 23), // Feb 23, 2024
      status: 'in_progress',
      progress: 65,
      color: 'bg-blue-500'
    },
    {
      id: "3",
      name: "Testing & Go-Live", 
      description: "Quality assurance, final testing, and production deployment",
      startDate: new Date(2024, 1, 26), // Feb 26, 2024
      endDate: new Date(2024, 2, 1), // Mar 1, 2024
      status: 'not_started',
      progress: 0,
      color: 'bg-purple-500'
    }
  ];

  // Mock deliverables data
  const deliverables: Deliverable[] = [
    {
      id: "d1",
      name: "Requirements Document",
      description: "Complete project requirements document",
      dueDate: new Date(2024, 1, 7),
      status: 'completed',
      phaseId: "1",
      priority: 'high'
    },
    {
      id: "d2",
      name: "API Integration",
      description: "Third-party API integrations complete",
      dueDate: new Date(2024, 1, 16),
      status: 'completed',
      phaseId: "2", 
      priority: 'high'
    },
    {
      id: "d3",
      name: "Core Features",
      description: "Main application features implemented",
      dueDate: new Date(2024, 1, 20),
      status: 'pending',
      phaseId: "2",
      priority: 'high'
    },
    {
      id: "d4",
      name: "QA Testing",
      description: "Complete quality assurance testing",
      dueDate: new Date(2024, 1, 28),
      status: 'pending',
      phaseId: "3",
      priority: 'medium'
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
      deliverable.dueDate.toDateString() === date.toDateString()
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'in_progress': return <Clock className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const getDeliverableColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Project Calendar</h1>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Overall Progress:</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary">65%</Badge>
          </div>
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
                      <div className={`
                        ${phase.color} text-white text-xs p-1 rounded mb-1 flex items-center gap-1
                        ${phase.startDate.toDateString() === day.date.toDateString() ? 'rounded-l' : ''}
                        ${phase.endDate.toDateString() === day.date.toDateString() ? 'rounded-r' : ''}
                      `}>
                        {getStatusIcon(phase.status)}
                        {phase.startDate.toDateString() === day.date.toDateString() && (
                          <span className="truncate">{phase.name}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Deliverables */}
                    {dayDeliverables.map(deliverable => (
                      <div
                        key={deliverable.id}
                        className={`
                          w-2 h-2 rounded-full mb-1 ${getDeliverableColor(deliverable.status)}
                        `}
                        title={deliverable.name}
                      />
                    ))}
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
                  <div key={phase.id} className="flex items-center gap-3">
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
              <h3 className="font-medium">Deliverable Status</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Due Soon / Pending</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">Overdue</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Future Deliverable</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;