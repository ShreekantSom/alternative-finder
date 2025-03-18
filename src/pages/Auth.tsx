
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { AuthService } from '@/lib/auth';

export function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}

export default Auth;
