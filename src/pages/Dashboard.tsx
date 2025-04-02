
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthService } from '@/lib/auth';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { SoftwareManager } from '@/components/admin/SoftwareManager';
import { ApprovalManager } from '@/components/admin/ApprovalManager';
import { Button } from '@/components/ui/button';
import { LogOut, User, Plus } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
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
        <h1 className="text-3xl font-bold">{user.role === 'admin' ? 'Admin' : 'User'} Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Logged in as: <span className="font-medium text-foreground">{user.email}</span>
          </p>
          <Link to="/profile">
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </Link>
          {user.role === "user" && (
            <Link to="/brand-submission?type=suggestion">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Suggest Brand
              </Button>
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {user.role === 'admin' ? (
        <Tabs defaultValue="approvals" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="software">Software</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="approvals" className="mt-6">
            <ApprovalManager />
          </TabsContent>
          <TabsContent value="software" className="mt-6">
            <SoftwareManager />
          </TabsContent>
          <TabsContent value="categories" className="mt-6">
            <CategoryManager />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user.email}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link to="/brand-submission?type=suggestion">
              <div className="bg-card hover:bg-accent/50 transition-colors border rounded-lg p-6 cursor-pointer">
                <h3 className="text-lg font-medium mb-2">Suggest a Brand</h3>
                <p className="text-muted-foreground">
                  Know a great alternative that's not listed? Suggest it for review.
                </p>
              </div>
            </Link>
            <Link to="/collections">
              <div className="bg-card hover:bg-accent/50 transition-colors border rounded-lg p-6 cursor-pointer">
                <h3 className="text-lg font-medium mb-2">Browse Collections</h3>
                <p className="text-muted-foreground">
                  Discover curated collections of the best alternatives.
                </p>
              </div>
            </Link>
            <Link to="/discover">
              <div className="bg-card hover:bg-accent/50 transition-colors border rounded-lg p-6 cursor-pointer">
                <h3 className="text-lg font-medium mb-2">Discover</h3>
                <p className="text-muted-foreground">
                  Explore trending alternatives and new additions.
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
