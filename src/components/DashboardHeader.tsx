import { Bell, ChevronDown, User, Settings, LogOut, CreditCard, Home, Calendar, HelpCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { useAuth } from "@/hooks/useAuth";
const DashboardHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  
  const displayName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : 'User';
    
  const initials = profile 
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || profile.email[0]?.toUpperCase()
    : 'U';

  const handleSignOut = async () => {
    await signOut();
  };
  const tabs = [{
    title: "Dashboard",
    icon: Home
  }, {
    title: "Calendar",
    icon: Calendar
  }, {
    title: "Help",
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
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">TS</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">TechStart Solutions</h1>
              <p className="text-xs text-muted-foreground">Client Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex">
            <ExpandableTabs tabs={tabs} selectedIndex={getSelectedIndex()} onChange={handleTabChange} className="border-border/50" />
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
                  <span className="hidden sm:block text-sm text-foreground">{displayName}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/payments" className="cursor-pointer flex">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>;
};
export default DashboardHeader;