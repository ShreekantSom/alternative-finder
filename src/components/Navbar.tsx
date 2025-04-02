import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, User, FileText, ChevronDown } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { Alternative } from '@/assets/data';
import { PincodeMenu } from './PincodeMenu';
import NavbarSearch from './navbar/NavbarSearch';
import MobileMenu from './navbar/MobileMenu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { crawlCategories } from '@/lib/crawler';
import { Globe, Paintbrush, Code, Gamepad2, Music, Briefcase, Image, Shield, MessageCircle, Wrench, GraduationCap, Landmark } from 'lucide-react';

interface Category {
  name: string;
  url: string;
}

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case 'Design Tools':
      return Paintbrush;
    case 'Development Tools':
      return Code;
    case 'Productivity':
      return Briefcase;
    case 'Marketing':
      return MessageCircle;
    case 'Utilities':
      return Wrench;
    case 'Education':
      return GraduationCap;
    case 'Entertainment':
      return Gamepad2;
    case 'Music & Audio':
      return Music;
    case 'Graphics & Design':
      return Image;
    case 'Security':
      return Shield;
    case 'Travel':
      return Landmark;
    default:
      return Globe;
  }
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{email: string; role?: string} | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await crawlCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Check authentication status
    const currentUser = AuthService.getCurrentUser();
    setIsLoggedIn(!!currentUser);
    setUser(currentUser);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/?query=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-6 w-6 text-primary"
            >
              <path d="m7 11 2-2-2-2" />
              <path d="M11 13h4" />
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            </svg>
            <span className="hidden sm:inline">Alternatives</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 w-[500px]">
                      {categories.map((category) => {
                        const Icon = getCategoryIcon(category.name);
                        return (
                          <Link
                            key={category.name}
                            to={`/?category=${encodeURIComponent(category.name)}`}
                            className="flex items-center gap-2 p-2 hover:bg-secondary rounded-md transition-colors"
                          >
                            <Icon className="h-4 w-4 text-primary" />
                            <span>{category.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/discover">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Discover
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/collections">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Collections
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/news">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      News
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <NavbarSearch />
        </div>
        
        {/* Right side - Auth buttons */}
        <div className="flex items-center gap-2">
          <PincodeMenu />
          
          <AnimatePresence initial={false}>
            {isLoggedIn ? (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex"
                  onClick={() => user?.role === 'brand' ? navigate('/brand-dashboard') : navigate('/dashboard')}
                >
                  <User className="h-4 w-4 mr-1" />
                  {user?.role === 'brand' ? 'Brand Dashboard' : 'Dashboard'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/auth?mode=signup')}
                >
                  Sign Up
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            categories={categories}
            getCategoryIcon={getCategoryIcon}
            isLoggedIn={isLoggedIn}
            user={user}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
