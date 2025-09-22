import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client' | 'team' | ('admin' | 'client' | 'team')[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if user role is authorized
  const isAuthorized = (
    userRole: string | undefined, 
    required: 'admin' | 'client' | 'team' | ('admin' | 'client' | 'team')[]
  ): boolean => {
    if (!userRole) return false;
    if (Array.isArray(required)) {
      return required.includes(userRole as 'admin' | 'client' | 'team');
    }
    return userRole === required;
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }

      if (requiredRole && !isAuthorized(profile?.role, requiredRole)) {
        // Redirect based on actual role
        if (profile?.role === 'admin' || profile?.role === 'team') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        return;
      }

      // For admin routes without specific role requirement, ensure user has admin or team role
      if (!requiredRole && location.pathname.startsWith('/admin') && 
          profile?.role !== 'admin' && profile?.role !== 'team') {
        navigate('/');
        return;
      }
    }
  }, [user, profile, loading, navigate, requiredRole, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && !isAuthorized(profile?.role, requiredRole)) {
    return null;
  }

  // For admin routes without specific role requirement, ensure user has admin or team role
  if (!requiredRole && location.pathname.startsWith('/admin') && 
      profile?.role !== 'admin' && profile?.role !== 'team') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;