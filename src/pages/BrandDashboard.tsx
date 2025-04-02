
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthService } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Star, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import BrandNewsList from '@/components/brand/BrandNewsList';
import BrandSpotlightManager from '@/components/brand/BrandSpotlightManager';

export function BrandDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'brand') {
      navigate('/auth');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Brand Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{user.brandName}</span>
          </p>
          <Link to="/brand-submission">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Update Brand Info
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {user.pendingApproval && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Pending Approval</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your brand account is waiting for admin approval. Some features may be limited until your account is approved.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="spotlight">Spotlights</TabsTrigger>
        </TabsList>
        <TabsContent value="news" className="mt-6">
          <BrandNewsList brandId={user.brandId} brandName={user.brandName} />
        </TabsContent>
        <TabsContent value="spotlight" className="mt-6">
          <BrandSpotlightManager brandId={user.brandId} brandName={user.brandName} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BrandDashboard;
