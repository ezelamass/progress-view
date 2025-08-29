import { User, Building2, Mail, Briefcase } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProjectOptional } from "@/contexts/ProjectContext";
import { useTheme } from "@/contexts/ThemeContext";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const { profile } = useAuth();
  const projectContext = useProjectOptional();
  const { projects, selectedProject } = projectContext || { projects: [], selectedProject: null };
  const { language } = useTheme();

  const displayName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : 'User';
    
  const initials = profile 
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || profile.email?.[0]?.toUpperCase()
    : 'U';

  // Get client company name from the selected project
  const clientCompany = selectedProject?.clients?.company || selectedProject?.clients?.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {language === 'es' ? 'Perfil de Usuario' : 'User Profile'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url} alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{displayName}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {profile?.role === 'client' 
                  ? (language === 'es' ? 'Cliente' : 'Client')
                  : (language === 'es' ? 'Administrador' : 'Admin')
                }
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {language === 'es' ? 'Correo electrónico' : 'Email'}
                  </p>
                  <p className="text-sm">{profile?.email}</p>
                </div>
              </div>

              {clientCompany && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {language === 'es' ? 'Empresa' : 'Company'}
                    </p>
                    <p className="text-sm">{clientCompany}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Projects */}
          {projects.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {language === 'es' ? 'Proyectos asignados' : 'Assigned Projects'}
                  </p>
                </div>
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between">
                      <span className="text-sm">{project.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          project.status === 'active' 
                            ? 'bg-success/20 text-success border-success/30'
                            : 'bg-muted/50 text-muted-foreground border-border'
                        }`}
                      >
                        {project.status === 'active' 
                          ? (language === 'es' ? 'Activo' : 'Active')
                          : project.status
                        }
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;