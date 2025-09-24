import { ChevronRight, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProjectOptional } from "@/contexts/ProjectContext";
import { useTheme } from "@/contexts/ThemeContext";

interface ProjectBreadcrumbProps {
  pageName: string;
  className?: string;
}

const ProjectBreadcrumb = ({ pageName, className = "" }: ProjectBreadcrumbProps) => {
  const projectContext = useProjectOptional();
  const { selectedProject } = projectContext || { selectedProject: null };
  const { language } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'completed': return 'bg-primary/20 text-primary border-primary/30';
      case 'paused': return 'bg-warning/20 text-warning border-warning/30';
      case 'cancelled': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  if (!selectedProject) {
    return (
      <nav className={`flex items-center space-x-2 text-sm text-muted-foreground ${className}`}>
        <span>{pageName}</span>
      </nav>
    );
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">
          {selectedProject.clients?.company || 'Project'}
        </span>
        <Badge 
          variant="outline" 
          className={`text-xs ${getStatusColor(selectedProject.status)}`}
        >
          {selectedProject.status}
        </Badge>
      </div>
      
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      
      <span className="text-foreground font-medium">
        {selectedProject.name}
      </span>
      
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      
      <span className="text-muted-foreground">
        {pageName}
      </span>
    </nav>
  );
};

export default ProjectBreadcrumb;