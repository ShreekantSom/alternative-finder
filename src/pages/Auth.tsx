
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

  // Check if there's a specific mode requested in the URL (e.g., /auth?mode=signup)
  useEffect(() => {
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
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo);
    }
  }, [navigate, location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md">
        {successMessage && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        <AuthForm 
          initialMode={authMode} 
          onSuccess={(message) => {
            setSuccessMessage(message);
            // Redirect after showing success message briefly
            setTimeout(() => {
              navigate('/dashboard');
            }, 1500);
          }}
        />
      </div>
    </div>
  );
}

export default Auth;
