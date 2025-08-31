import { Bell, ChevronDown, User, Settings, LogOut, CreditCard, Home, Calendar, HelpCircle, Building2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { useAuth } from "@/hooks/useAuth";
import { useProjectOptional } from "@/contexts/ProjectContext";
import { useState } from "react";
import AccountSettings from "@/components/AccountSettings";
import ProfileDialog from "@/components/ProfileDialog";
const DashboardHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const projectContext = useProjectOptional();
  const { selectedProject, projects, setSelectedProject } = projectContext || { selectedProject: null, projects: [], setSelectedProject: () => {} };
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { language } = useTheme();
  
  const displayName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : 'User';
    
  const initials = profile 
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || profile.email[0]?.toUpperCase()
    : 'U';

  const handleSignOut = async () => {
    await signOut();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'completed': return 'bg-primary/20 text-primary border-primary/30';
      case 'paused': return 'bg-warning/20 text-warning border-warning/30';
      case 'cancelled': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };
  const tabs = [{
    title: language === 'es' ? "Panel" : "Dashboard",
    icon: Home
  }, {
    title: language === 'es' ? "Calendario" : "Calendar",
    icon: Calendar
  }, {
    title: language === 'es' ? "Ayuda" : "Help",
    icon: HelpCircle
  }];

  // Determine selected tab based on current route
  const getSelectedIndex = () => {
    switch (location.pathname) {
      case '/':
        return 0;
      case '/calendar':
        return 1;
      case '/help':
        return 2;
      default:
        return 0;
      // Default to dashboard
    }
  };
  const handleTabChange = (index: number | null) => {
    if (index === null) return;
    switch (index) {
      case 0:
        navigate("/");
        break;
      case 1:
        navigate("/calendar");
        break;
      case 2:
        navigate("/help");
        break;
    }
  };
  return <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Company Logo and Name */}
          <div className="flex items-center space-x-3">
            {selectedProject?.clients?.logo_url ? (
              <div className="h-8 w-8 rounded-lg overflow-hidden border border-border/50">
                <img 
                  src={selectedProject.clients.logo_url} 
                  alt={selectedProject.clients.company || 'Company logo'} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center"><span class="text-sm font-bold text-primary-foreground">${selectedProject?.clients?.company?.substring(0, 2) || selectedProject?.clients?.name?.substring(0, 2) || 'CP'}</span></div>`;
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">
                  {selectedProject?.clients?.company?.substring(0, 2) || selectedProject?.clients?.name?.substring(0, 2) || 'CP'}
                </span>
              </div>
            )}
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-foreground">
                {selectedProject?.clients?.company || selectedProject?.clients?.name || 'Client Portal'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === 'es' ? 'Portal del Cliente' : 'Client Portal'}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex">
            <ExpandableTabs tabs={tabs} selectedIndex={getSelectedIndex()} onChange={handleTabChange} className="border-border/50" />
          </div>

          {/* Mobile nav - icons only */}
          <div className="flex md:hidden items-center space-x-2">
            <Button variant="ghost" onClick={() => handleTabChange(0)} aria-label="Dashboard" className={`p-2 ${getSelectedIndex() === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
              <Home className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={() => handleTabChange(1)} aria-label="Calendar" className={`p-2 ${getSelectedIndex() === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <Calendar className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={() => handleTabChange(2)} aria-label="Help" className={`p-2 ${getSelectedIndex() === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile and Actions */}
          <div className="flex items-center space-x-3">
            
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Project Selector for clients with multiple projects */}
                {profile?.role === 'client' && projects.length > 1 && (
                  <>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      {language === 'es' ? 'Cambiar Proyecto' : 'Switch Project'}
                    </DropdownMenuLabel>
                    {projects.map((project) => (
                      <DropdownMenuItem
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <div className="flex flex-col">
                            <span className="text-sm">{project.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {project.clients?.company}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedProject?.id === project.id && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(project.status)}`}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem onClick={() => setShowProfile(true)}>
                  <User className="mr-2 h-4 w-4" />
                  {language === 'es' ? 'Perfil' : 'Profile'}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/payments" className="cursor-pointer flex">
                    <CreditCard className="mr-2 h-4 w-4" />
                    {language === 'es' ? 'Historial de Pagos' : 'Payment History'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAccountSettings(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  {language === 'es' ? 'Configuración de Cuenta' : 'Account Settings'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {language === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <AccountSettings 
        open={showAccountSettings} 
        onOpenChange={setShowAccountSettings} 
      />
      
      <ProfileDialog 
        open={showProfile} 
        onOpenChange={setShowProfile} 
      />
    </header>;
};
export default DashboardHeader;