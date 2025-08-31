import ROICard from "@/components/ROICard";
import ProjectProgress from "@/components/ProjectProgress";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import { MeetingHistory } from "@/components/MeetingHistory";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProjectOptional } from "@/contexts/ProjectContext";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const { profile } = useAuth();
  const projectContext = useProjectOptional();
  const selectedProject = projectContext?.selectedProject;
  const { language } = useTheme();

  // Get display name from client name
  const getDisplayName = () => {
    // Try to get client name first
    const clientName = selectedProject?.clients?.name;
    if (clientName) {
      return clientName;
    }
    
    // Fallback to user name
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (profile?.email) {
      return profile.email.split('@')[0];
    }
    return 'there';
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {language === 'es' ? `Bienvenido de vuelta, ${getDisplayName()}` : `Welcome back, ${getDisplayName()}`}
        </h1>
        <p className="text-muted-foreground">
          {language === 'es' 
            ? 'Aquí tienes un resumen del progreso de tu proyecto y las actualizaciones recientes.'
            : "Here's an overview of your project progress and recent updates."
          }
        </p>
      </div>


      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions - Top Position */}
          <QuickActions project={selectedProject} />
          
          {/* ROI Visualizer - Only show in production */}
          {selectedProject?.environment === 'production' && (
            <ROICard project={selectedProject} />
          )}
          
          {/* Project Progress */}
          <ProjectProgress project={selectedProject} />
          
          {/* ROI Card for non-production environments. For 'test' hide on mobile (we'll render it below MeetingHistory). */}
          {selectedProject?.environment === 'test' ? (
            <div className="hidden sm:block">
              <ROICard project={selectedProject} />
            </div>
          ) : (
            selectedProject?.environment !== 'production' && (
              <ROICard project={selectedProject} />
            )
          )}
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <RecentActivity project={selectedProject} />
          
          {/* Meeting History */}
          <MeetingHistory />

          {/* For test environment only, show ROI below Meeting History on mobile */}
          {selectedProject?.environment === 'test' && (
            <div className="block sm:hidden">
              <ROICard project={selectedProject} />
            </div>
          )}
          
          {/* Statistics */}
          <div className="bg-card border border-border/50 rounded-lg p-6 relative">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {language === 'es' ? 'Estadísticas' : 'Statistics'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === 'es' ? 'Métricas clave de rendimiento' : 'Key performance metrics'}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 text-xs px-2 py-0 bg-muted text-muted-foreground"
            >
              {language === 'es' ? 'Próximamente' : 'Coming Soon'}
            </Badge>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-foreground">2,847</span>
                </div>
                <div className="text-xs text-success">↗ 12.5%</div>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'es' ? 'Total de Usuarios' : 'Total Users'}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-foreground">$45,231</span>
                </div>
                <div className="text-xs text-success">↗ 8.2%</div>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'es' ? 'Ingresos' : 'Revenue'}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-foreground">3.24%</span>
                </div>
                <div className="text-xs text-red-500">↓ 2.1%</div>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'es' ? 'Tasa de Conversión' : 'Conversion Rate'}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-foreground">1,234</span>
                </div>
                <div className="text-xs text-success">↗ 16.3%</div>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'es' ? 'Sesiones Activas' : 'Active Sessions'}
              </p>
            </div>
          </div>
          
          {/* Empty space for balance */}
        </div>
      </div>
    </div>
  );
};

export default Index;