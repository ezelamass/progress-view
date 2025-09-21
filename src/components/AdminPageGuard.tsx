import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldX } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminPageGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'team')[];
}

const AdminPageGuard = ({ children, allowedRoles = ['admin'] }: AdminPageGuardProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect team members to phases if they try to access admin-only pages
    if (profile?.role === 'team' && !allowedRoles.includes('team')) {
      navigate('/admin/phases');
    }
  }, [profile, allowedRoles, navigate]);

  if (!profile || !allowedRoles.includes(profile.role as 'admin' | 'team')) {
    // If it's a team member trying to access admin-only page, they'll be redirected
    if (profile?.role === 'team') {
      return null; // Will be redirected by useEffect
    }
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <ShieldX className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access this page. Contact your administrator if you believe this is an error.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminPageGuard;