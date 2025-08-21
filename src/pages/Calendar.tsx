import { ArrowLeft, Calendar as CalendarIcon, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const navigate = useNavigate();

  // Mock project timeline data
  const projectPhases = [
    {
      id: 1,
      title: "Setup & Info Collection",
      week: "Week 1",
      dates: "Jan 8-12, 2024",
      status: "completed",
      icon: CheckCircle,
      description: "Initial setup, requirements gathering, and stakeholder interviews",
      deliverables: ["Requirements document", "Project setup", "Team onboarding"]
    },
    {
      id: 2,
      title: "Implementation & Development", 
      week: "Week 2-3",
      dates: "Jan 15-26, 2024",
      status: "in-progress",
      icon: Clock,
      description: "Core development work and feature implementation",
      deliverables: ["Core features", "API integration", "Testing framework"]
    },
    {
      id: 3,
      title: "Testing & Go-Live",
      week: "Week 4",
      dates: "Jan 29 - Feb 2, 2024",
      status: "upcoming",
      icon: AlertTriangle,
      description: "Quality assurance, final testing, and production deployment",
      deliverables: ["QA testing", "Deployment", "Training materials"]
    }
  ];

  const getPhaseStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          card: "border-success bg-gradient-to-r from-success/10 to-success/5",
          badge: "bg-success text-success-foreground",
          icon: "text-success"
        };
      case 'in-progress':
        return {
          card: "border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-glow",
          badge: "bg-primary text-primary-foreground",
          icon: "text-primary"
        };
      default:
        return {
          card: "border-muted bg-gradient-to-r from-muted/10 to-muted/5",
          badge: "bg-muted text-muted-foreground",
          icon: "text-muted-foreground"
        };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      default: return 'Upcoming';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
            <h1 className="text-2xl font-semibold text-foreground">Project Timeline</h1>
          </div>
        </div>

        {/* Project Overview */}
        <Card className="mb-8 bg-gradient-card border-border shadow-card">
          <CardHeader>
            <h2 className="text-xl font-medium text-foreground">TechStart Solutions - Automation Platform</h2>
            <p className="text-muted-foreground">4-week implementation timeline with key deliverables</p>
          </CardHeader>
        </Card>

        {/* Timeline */}
        <div className="space-y-6">
          {projectPhases.map((phase, index) => {
            const styles = getPhaseStyles(phase.status);
            const IconComponent = phase.icon;
            
            return (
              <Card 
                key={phase.id} 
                className={`${styles.card} border transition-all duration-300 hover:shadow-hover`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Icon and Status */}
                    <div className="flex items-center gap-3 md:flex-col md:items-center md:gap-2 md:min-w-[80px]">
                      <IconComponent className={`h-6 w-6 ${styles.icon}`} />
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles.badge}`}>
                        {getStatusLabel(phase.status)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-foreground mb-1">{phase.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">{phase.week}</span>
                            <span>•</span>
                            <span>{phase.dates}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{phase.description}</p>

                      {/* Deliverables */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Key Deliverables:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {phase.deliverables.map((deliverable, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-2"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${styles.icon.replace('text-', 'bg-')}`} />
                              {deliverable}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Timeline Progress */}
        <Card className="mt-8 bg-gradient-card border-border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">Overall Progress</h3>
              <span className="text-2xl font-bold text-primary">65%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-primary h-3 rounded-full shadow-glow transition-all duration-500"
                style={{ width: '65%' }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Currently in Week 3: Implementation phase with 9 days remaining
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;