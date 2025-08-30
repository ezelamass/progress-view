import { Calendar, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ProjectWithClient } from "@/hooks/useProjects";
import { usePhases } from "@/hooks/usePhases";
import { useTheme } from "@/contexts/ThemeContext";

interface ProjectProgressProps {
  project?: ProjectWithClient | null;
}

const ProjectProgress = ({ project }: ProjectProgressProps) => {
  const { phases, loading: phasesLoading } = usePhases(project?.id);
  const { language } = useTheme();

  if (!project) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            {language === 'es' ? 'Progreso del Proyecto' : 'Project Progress'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">📈</div>
              <p className="text-sm text-muted-foreground">
                {language === 'es' ? 'Selecciona un proyecto para ver el progreso' : 'Select a project to view progress'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate time-based progress
  const startDate = new Date(project.start_date);
  const endDate = new Date(project.end_date);
  const currentDate = new Date();
  
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.max(0, Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Calculate progress based on time elapsed
  const timeBasedProgress = Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));
  
  // Use database phases if available, otherwise fallback to default phases
  const displayPhases = phases.length > 0 ? phases.map(phase => ({
    name: phase.name,
    status: phase.status,
    week: `${new Date(phase.start_date).toLocaleDateString()} - ${new Date(phase.end_date).toLocaleDateString()}`,
    startDate: new Date(phase.start_date),
    endDate: new Date(phase.end_date)
  })) : [
    { 
      name: "Setup & Info Collection", 
      status: timeBasedProgress >= 25 ? "completed" : timeBasedProgress > 0 ? "in_progress" : "not_started", 
      week: "Week 1",
      startDate: startDate,
      endDate: new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000))
    },
    { 
      name: "Implementation & Development", 
      status: timeBasedProgress >= 75 ? "completed" : timeBasedProgress >= 25 ? "in_progress" : "not_started", 
      week: "Weeks 2-4",
      startDate: new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000)),
      endDate: new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000))
    },
    { 
      name: "Testing & Go-Live", 
      status: timeBasedProgress >= 100 ? "completed" : timeBasedProgress >= 75 ? "in_progress" : "not_started", 
      week: "Final Week",
      startDate: new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000)),
      endDate: endDate
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/20 text-success border-success/30";
      case "in_progress": return "bg-primary/20 text-primary border-primary/30";
      case "not_started": return "bg-muted/50 text-muted-foreground border-border";
      default: return "bg-muted/50 text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="h-3 w-3" />;
    if (status === "in_progress") return <Clock className="h-3 w-3" />;
    return <Calendar className="h-3 w-3" />;
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          {language === 'es' ? 'Progreso del Proyecto' : 'Project Progress'}
        </CardTitle>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-primary">{timeBasedProgress}%</span>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {language === 'es' ? 'Días restantes' : 'Days remaining'}
              </div>
              <div className="text-lg font-semibold text-foreground">{daysRemaining}</div>
            </div>
          </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {language === 'es' ? 'Progreso General' : 'Overall Progress'}
            </span>
            <span className="text-foreground font-medium">
              {language === 'es' ? `${timeBasedProgress}% Completado` : `${timeBasedProgress}% Complete`}
            </span>
          </div>
          <Progress 
            value={timeBasedProgress} 
            className="h-2 bg-muted"
          />
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium text-foreground">
            {language === 'es' ? 'Fases del Proyecto' : 'Project Phases'}
          </h4>
          {phasesLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {displayPhases.map((phase, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(phase.status)}
                    <div>
                      <div className="text-sm font-medium text-foreground">{phase.name}</div>
                      <div className="text-xs text-muted-foreground">{phase.week}</div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${getStatusColor(phase.status)}`}
                  >
                    {phase.status === "completed" 
                      ? (language === 'es' ? "Completado" : "Done")
                      : phase.status === "in_progress" 
                        ? (language === 'es' ? "En Progreso" : "In Progress")
                        : (language === 'es' ? "Pendiente" : "Pending")
                    }
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectProgress;