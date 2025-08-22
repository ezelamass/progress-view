import { ChevronDown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useProject } from "@/contexts/ProjectContext";

const ProjectSelector = () => {
  const { selectedProject, projects, setSelectedProject } = useProject();

  if (projects.length <= 1) {
    return null; // Don't show selector if only one or no projects
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'completed': return 'bg-primary/20 text-primary border-primary/30';
      case 'paused': return 'bg-warning/20 text-warning border-warning/30';
      case 'cancelled': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  return (
    <div className="mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">{selectedProject?.name || 'Select Project'}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedProject?.clients?.company}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedProject && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(selectedProject.status)}`}
                >
                  {selectedProject.status}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[400px]">
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="p-3"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {project.clients?.company}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(project.status)}`}
                >
                  {project.status}
                </Badge>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProjectSelector;