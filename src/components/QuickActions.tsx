import { Calendar, FileText, Folder, GraduationCap, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

interface QuickActionsProps {
  project?: {
    id?: string;
    drive_folder_url?: string;
    status?: string;
  } | null;
}

const QuickActions = ({ project }: QuickActionsProps) => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const actions = [
    {
      icon: Calendar,
      label: language === 'es' ? "Programar Seguimiento" : "Schedule Follow-up",
      description: language === 'es' ? "Reservar una nueva reunión con el equipo" : "Book a new meeting with team members",
      action: () => window.open("https://calendly.com/ezequiellamas-advantx/15min-seguimiento", "_blank"),
      primary: true,
    },
    {
      icon: CheckSquare,
      label: language === 'es' ? "Ver Entregables" : "View Deliverables", 
      description: language === 'es' ? "Verificar entregables e hitos del proyecto" : "Check project deliverables and milestones",
      action: () => navigate("/deliverables"),
      primary: false,
    },
    {
      icon: Folder,
      label: language === 'es' ? "Gestionar Archivos" : "Manage Files",
      description: language === 'es' ? "Subir, organizar y compartir archivos del proyecto" : "Upload, organize and share project files",
      action: () => {
        if (project?.drive_folder_url) {
          window.open(project.drive_folder_url, "_blank");
        } else {
          window.open("https://drive.google.com", "_blank");
        }
      },
      primary: false,
    },
    {
      icon: GraduationCap,
      label: language === 'es' ? "Sección de Aprendizaje" : "Learn Section",
      description: language === 'es' ? "Acceder a tutoriales y documentación" : "Access tutorials and documentation", 
      action: () => console.log("Coming soon"),
      primary: false,
      comingSoon: true,
    },
  ];

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {language === 'es' ? 'Acciones Rápidas' : 'Quick Actions'}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {language === 'es' ? 'Acciones y atajos usados frecuentemente' : 'Frequently used actions and shortcuts'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <div key={index} className="relative">
              <Button
                variant="ghost"
                className={`w-full h-20 p-4 flex flex-col items-center justify-center gap-2 rounded-lg border transition-all ${
                  action.primary 
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-600 hover:from-purple-700 hover:to-purple-800" 
                    : "bg-muted/30 text-foreground border-border hover:bg-muted/50"
                }`}
                onClick={action.action}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-medium text-center leading-tight">
                  {action.label}
                </span>
              </Button>
              {action.comingSoon && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-1 -right-1 text-xs px-2 py-0 bg-muted text-muted-foreground"
                >
                  {language === 'es' ? 'Próximamente' : 'Coming Soon'}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;