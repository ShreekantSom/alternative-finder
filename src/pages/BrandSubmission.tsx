
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '@/lib/auth';
import BrandSubmissionForm from '@/components/brand/BrandSubmissionForm';

export function BrandSubmission() {
  const [searchParams] = useSearchParams();
  const isSuggestion = searchParams.get('type') === 'suggestion';
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const authenticated = AuthService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (!authenticated) {
      navigate('/auth', { state: { from: '/brand-submission' + window.location.search } });
    }
  }, [navigate, searchParams]);

  if (!isAuthenticated) {
    return null; // Will redirect to auth
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {isSuggestion ? "Suggest a Business" : "Submit Your Business"}
      </h1>
      
      <BrandSubmissionForm isSuggestion={isSuggestion} />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {isSuggestion 
            ? "Thank you for helping us grow our directory of businesses!" 
            : "After submission, your business will be reviewed by our team."}
        </p>
      </div>
    </div>
  );
}

export default BrandSubmission;
