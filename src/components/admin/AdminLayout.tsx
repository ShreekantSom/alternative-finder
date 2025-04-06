
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Package, 
  Users, 
  Newspaper, 
  Home, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Menu,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AuthService } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  const isMobile = window.innerWidth < 768;

  // Navigation items
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: <BarChart3 className="h-5 w-5" /> 
    },
    { 
      name: 'Businesses', 
      path: '/admin/businesses', 
      icon: <Package className="h-5 w-5" /> 
    },
    { 
      name: 'Categories', 
      path: '/admin/categories', 
      icon: <BarChart3 className="h-5 w-5" /> 
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'News', 
      path: '/admin/news', 
      icon: <Newspaper className="h-5 w-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  useEffect(() => {
    // Check if user is authenticated and is admin
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin');
      return;
    }
    setUser(currentUser);

    // Default sidebar state based on screen size
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/admin');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden md:block bg-card border-r transition-all duration-300 ease-in-out z-20`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            {sidebarOpen ? (
              <Link to="/admin/dashboard" className="text-xl font-bold">
                Admin Panel
              </Link>
            ) : (
              <Link to="/admin/dashboard" className="text-xl font-bold">
                AP
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-2">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm rounded-md ${
                    location.pathname === item.path 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground hover:bg-accent/50'
                  } ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
                >
                  {item.icon}
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              {sidebarOpen && user && (
                <div>
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <ThemeSwitcher />
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="md:hidden">
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30">
            <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-card shadow-lg z-40">
              <div className="flex items-center justify-between p-4 border-b">
                <Link to="/admin/dashboard" className="text-xl font-bold">
                  Admin Panel
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-2">
                <nav className="space-y-1 px-2">
                  {navItems.map((item) => (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      className={`flex items-center px-3 py-3 text-sm rounded-md ${
                        location.pathname === item.path 
                          ? 'bg-accent text-accent-foreground' 
                          : 'text-muted-foreground hover:bg-accent/50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  {user && (
                    <div>
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <ThemeSwitcher />
                    <Button variant="ghost" size="icon" onClick={handleLogout}>
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-card border-b h-16 flex items-center px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden mr-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu />
              </Button>
              <div className="flex items-center">
                <Link 
                  to="/"
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5 mr-1" />
                  <span>Back to Site</span>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize text-right">{user.role}</p>
                </div>
              )}
              <div className="hidden md:block">
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
