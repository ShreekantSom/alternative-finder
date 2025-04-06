
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { AuthService } from '@/lib/auth';
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // Check if this is an admin login page based on the path
  useEffect(() => {
    const path = location.pathname;
    setIsAdminLogin(path === '/admin');

    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'signup') {
      setAuthMode('signup');
    } else if (mode === 'login') {
      setAuthMode('login');
    }
  }, [location]);

  useEffect(() => {
    // Redirect if already logged in
    if (AuthService.isAuthenticated()) {
      const currentUser = AuthService.getCurrentUser();
      
      // Redirect based on user role and login type
      if (isAdminLogin) {
        if (currentUser?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          // If not admin but on admin path, show error
          setSuccessMessage("Access denied. Admin credentials required.");
          AuthService.logout();
          return;
        }
      } else {
        // Regular domain redirects
        if (currentUser?.role === 'brand') {
          navigate('/brand-dashboard');
        } else if (currentUser?.role === 'admin') {
          navigate('/dashboard');
        } else {
          const redirectTo = location.state?.from || '/dashboard';
          navigate(redirectTo);
        }
      }
    }
  }, [navigate, location.state, isAdminLogin]);

  const handleAuthSuccess = (message: string) => {
    setSuccessMessage(message);
    
    // Check user role for redirection
    const currentUser = AuthService.getCurrentUser();
    
    // Special handling for admin login
    if (isAdminLogin) {
      if (currentUser?.role === 'admin') {
        // Redirect admin to dashboard after showing success message briefly
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      } else {
        // Not an admin but on admin path
        setSuccessMessage("Access denied. Admin credentials required.");
        AuthService.logout();
      }
      return;
    }
    
    // Regular domain redirects
    setTimeout(() => {
      if (currentUser?.role === 'brand') {
        navigate('/brand-dashboard');
      } else if (currentUser?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md">
        {successMessage && (
          <Alert className={successMessage.includes("denied") ? "mb-4 bg-red-50 border-red-200" : "mb-4 bg-green-50 border-green-200"}>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        <AuthForm 
          initialMode={authMode} 
          onSuccess={handleAuthSuccess}
          isAdminLogin={isAdminLogin}
        />
      </div>
    </div>
  );
}

export default Auth;
