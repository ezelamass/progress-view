import { ChevronLeft, ChevronRight, CheckCircle, Clock, AlertTriangle, Flag, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDeliverables } from "@/hooks/useDeliverables";
import { usePhases } from "@/hooks/usePhases";
import { useProjects } from "@/hooks/useProjects";
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

const AdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | null>(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState<any>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const { language } = useTheme();
  const { user } = useAuth();
  
  // Get all projects for admin
  const { projects, loading: projectsLoading } = useProjects(user);
  
  // Default to all projects if none selected
  const projectsToShow = selectedProjects.length > 0 ? selectedProjects : projects.map(p => p.id);
  
  // Get phases and deliverables for selected projects
  const allPhases: any[] = [];
  const allDeliverables: any[] = [];
  
  projectsToShow.forEach(projectId => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      // We'll need to call hooks here - this is a simplified version
      // In practice, you'd need a different approach to avoid hook violations
    }
  });

  if (projectsLoading) {
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

  const handleProjectSelectionChange = (value: string) => {
    if (value === 'all') {
      setSelectedProjects([]);
    } else {
      const currentSelection = [...selectedProjects];
      const index = currentSelection.indexOf(value);
      if (index > -1) {
        currentSelection.splice(index, 1);
      } else {
        currentSelection.push(value);
      }
      setSelectedProjects(currentSelection);
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          {language === 'es' ? 'Calendario Administrativo' : 'Admin Calendar'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'es' 
            ? 'Vista general de todos los proyectos y sus fases'
            : 'Overview of all projects and their phases'
          }
        </p>
      </div>

      {/* Project Selection */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {language === 'es' ? 'Seleccionar Proyectos' : 'Select Projects'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedProjects.length === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedProjects([])}
            >
              {language === 'es' ? 'Todos los Proyectos' : 'All Projects'}
            </Button>
            {projects.map(project => (
              <Button
                key={project.id}
                variant={selectedProjects.includes(project.id) ? "default" : "outline"}
                size="sm"
                onClick={() => handleProjectSelectionChange(project.id)}
              >
                {project.name}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedProjects.length === 0 
              ? (language === 'es' ? `Mostrando todos los ${projects.length} proyectos` : `Showing all ${projects.length} projects`)
              : (language === 'es' ? `Mostrando ${selectedProjects.length} proyecto(s) seleccionado(s)` : `Showing ${selectedProjects.length} selected project(s)`)
            }
          </p>
        </CardContent>
      </Card>

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
            {days.map((day, index) => (
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
                
                {/* Phases and deliverables would be rendered here */}
                {/* This is a placeholder for the actual calendar content */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selected Projects Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {language === 'es' ? 'Proyectos Seleccionados' : 'Selected Projects'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(selectedProjects.length > 0 ? projects.filter(p => selectedProjects.includes(p.id)) : projects).map(project => (
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

        {/* Calendar Legend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {language === 'es' ? 'Leyenda' : 'Legend'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">{language === 'es' ? 'Fase de Descubrimiento' : 'Discovery Phase'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">{language === 'es' ? 'Fase de Desarrollo' : 'Development Phase'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm">{language === 'es' ? 'Otras Fases' : 'Other Phases'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{language === 'es' ? 'Completado' : 'Completed'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{language === 'es' ? 'En Progreso' : 'In Progress'}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">{language === 'es' ? 'Pendiente/Bloqueado' : 'Pending/Blocked'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCalendar;