import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { 
  Calendar, 
  CreditCard, 
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Home,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useProjectOptional } from "@/contexts/ProjectContext";
import { useTheme } from "@/contexts/ThemeContext";

const teamNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Calendar",
    href: "/team/calendar",
    icon: Calendar,
  },
  {
    title: "Payments",
    href: "/team/payments",
    icon: CreditCard,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
];

export default function TeamLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const projectContext = useProjectOptional();
  const { selectedProject } = projectContext || { selectedProject: null };
  const { language } = useTheme();

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('team-sidebar-collapsed');
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleSidebarCollapsed = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('team-sidebar-collapsed', JSON.stringify(newState));
  };

  const displayName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : 'Team Member';
    
  const initials = profile 
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || profile.email[0]?.toUpperCase()
    : 'TM';

  const handleSignOut = async () => {
    await signOut();
  };

  const isActivePath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <TooltipProvider>
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
            sidebarCollapsed ? "w-16" : "w-64",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Project Info and Collapse Toggle */}
            <div className="flex h-16 items-center border-b border-border px-6 justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                {selectedProject?.clients?.logo_url ? (
                  <div className="h-8 w-8 rounded-lg overflow-hidden border border-border/50 flex-shrink-0">
                    <img 
                      src={selectedProject.clients.logo_url} 
                      alt={selectedProject.clients.company || 'Company logo'} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">
                      {selectedProject?.clients?.company?.substring(0, 2) || 'CP'}
                    </span>
                  </div>
                )}
                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <h1 className="text-lg font-semibold text-foreground truncate">
                      {selectedProject?.clients?.company || 'Team Dashboard'}
                    </h1>
                    <p className="text-xs text-muted-foreground truncate">
                      {selectedProject?.name || 'Team Portal'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Collapse toggle - hidden on mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex h-8 w-8 flex-shrink-0"
                onClick={toggleSidebarCollapsed}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
              {teamNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                
                const navItem = (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      sidebarCollapsed ? "justify-center" : "space-x-3",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{language === 'es' ? getSpanishTitle(item.title) : item.title}</span>}
                  </Link>
                );

                // Wrap with tooltip when collapsed
                if (sidebarCollapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        {navItem}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {language === 'es' ? getSpanishTitle(item.title) : item.title}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return navItem;
              })}
            </nav>
          </div>
        </aside>
      </TooltipProvider>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            
            {/* User menu */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url} alt="Team Member" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{profile?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    {language === 'es' ? 'Perfil' : 'Profile'}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/team/payments" className="w-full flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      {language === 'es' ? 'Mis Pagos' : 'Payments'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    {language === 'es' ? 'Configuración' : 'Settings'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {language === 'es' ? 'Cerrar Sesión' : 'Sign out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function getSpanishTitle(title: string): string {
  const translations: Record<string, string> = {
    'Dashboard': 'Panel',
    'Calendar': 'Calendario',
    'Payments': 'Pagos',
    'Help': 'Ayuda',
  };
  return translations[title] || title;
}