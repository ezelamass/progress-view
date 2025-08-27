import { Calendar, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ProjectWithClient } from "@/hooks/useProjects";

interface ProjectProgressProps {
  project?: ProjectWithClient | null;
}

const ProjectProgress = ({ project }: ProjectProgressProps) => {
  if (!project) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">📈</div>
              <p className="text-sm text-muted-foreground">
                Select a project to view progress
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentProgress = project.progress_percentage;
  
  // Calculate days remaining
  const endDate = new Date(project.end_date);
  const currentDate = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Generate phases based on project timeline
  const startDate = new Date(project.start_date);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate phase dates to match Calendar.tsx
  const totalDuration = endDate.getTime() - startDate.getTime();
  const implementationDuration = totalDuration - (2 * 7 * 24 * 60 * 60 * 1000); // Total minus first and last week
  
  const phases = [
    { 
      name: "Setup & Info Collection", 
      status: currentProgress >= 25 ? "completed" : currentProgress > 0 ? "current" : "upcoming", 
      week: "Week 1",
      startDate: startDate,
      endDate: new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000))
    },
    { 
      name: "Implementation & Development", 
      status: currentProgress >= 75 ? "completed" : currentProgress >= 25 ? "current" : "upcoming", 
      week: "Weeks 2-4",
      startDate: new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000)),
      endDate: new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000))
    },
    { 
      name: "Testing & Go-Live", 
      status: currentProgress >= 100 ? "completed" : currentProgress >= 75 ? "current" : "upcoming", 
      week: "Final Week",
      startDate: new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000)),
      endDate: endDate
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/20 text-success border-success/30";
      case "current": return "bg-primary/20 text-primary border-primary/30";
      default: return "bg-muted/50 text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="h-3 w-3" />;
    if (status === "current") return <Clock className="h-3 w-3" />;
    return <Calendar className="h-3 w-3" />;
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Project Progress</CardTitle>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-primary">{currentProgress}%</span>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Days remaining</div>
              <div className="text-lg font-semibold text-foreground">{daysRemaining}</div>
            </div>
          </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="text-foreground font-medium">{currentProgress}% Complete</span>
          </div>
          <Progress 
            value={currentProgress} 
            className="h-2 bg-muted"
          />
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium text-foreground">Project Phases</h4>
          <div className="space-y-2">
            {phases.map((phase, index) => (
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
                  {phase.status === "completed" ? "Done" : phase.status === "current" ? "In Progress" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectProgress;