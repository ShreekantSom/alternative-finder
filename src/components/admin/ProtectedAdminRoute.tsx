
import { Navigate } from 'react-router-dom';
import { AuthService } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated and is an admin
    const checkAdmin = () => {
      setIsLoading(true);
      const isAuthenticated = AuthService.isAuthenticated();
      const userIsAdmin = AuthService.isAdmin();
      
      setIsAdmin(isAuthenticated && userIsAdmin);
      setIsLoading(false);
    };

    checkAdmin();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="mt-4 text-lg text-muted-foreground">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
