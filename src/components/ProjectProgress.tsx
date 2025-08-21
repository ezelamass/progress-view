import { Calendar, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const ProjectProgress = () => {
  const currentProgress = 65;
  const phases = [
    { name: "Setup", status: "completed", week: "Week 1" },
    { name: "Implementation", status: "current", week: "Week 2-3" },
    { name: "Testing", status: "upcoming", week: "Week 4" },
    { name: "Deployment", status: "upcoming", week: "Week 5" },
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
            <div className="text-lg font-semibold text-foreground">12</div>
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