import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, User, FileText, ChevronDown, Globe, Paintbrush, Code, Gamepad2, Music, Briefcase, Image, Shield, MessageCircle, Wrench, GraduationCap, Landmark } from 'lucide-react';
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

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbarSearch, setShowNavbarSearch] = useState(false);
  const [user, setUser] = useState<{email: string} | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      const heroHeight = window.innerHeight * 0.8;
      setShowNavbarSearch(window.scrollY > heroHeight);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await crawlCategories();
        if (result.success && result.data) {
          setCategories(result.data.filter((cat: Category) => cat.id !== 'all'));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleItemSelect = (alternative: Alternative) => {
    const slug = alternative.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    navigate(`/d2c/${slug}`);
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: {[key: string]: any} = {
      'globe': Globe,
      'paintbrush': Paintbrush,
      'code': Code,
      'gamepad-2': Gamepad2,
      'music': Music,
      'briefcase': Briefcase,
      'image': Image,
      'shield': Shield,
      'message-circle': MessageCircle,
      'tool': Wrench,
      'wrench': Wrench,
      'graduation-cap': GraduationCap,
      'landmark': Landmark,
      // Add default
      'layers': Globe,
    };
    
    const IconComponent = iconMap[iconName] || Globe;
    return <IconComponent className="mr-2 h-4 w-4" />;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-3 md:py-4 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="rounded-xl bg-primary p-1.5">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
            </svg>
          </div>
          <span className="font-bold text-lg">D2C Directory</span>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex items-center space-x-4">
            <PincodeMenu className="border-none" />
            
            <AnimatePresence>
              <NavbarSearch 
                showSearch={showNavbarSearch} 
                onItemSelect={handleItemSelect} 
              />
            </AnimatePresence>

            <Link to="/discover" className="text-foreground/80 hover:text-foreground transition-colors">Discover</Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-foreground/80 hover:text-foreground hover:bg-transparent">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {categories.map((category) => (
                        <li key={category.id} className="row-span-1">
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/?category=${category.name}`}
                              className="flex p-2 select-none rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              {getIconComponent(category.icon)}
                              <div className="text-sm font-medium">
                                {category.name}
                                <div className="text-xs text-muted-foreground">
                                  {category.count} apps
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link to="/news" className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1.5">
              <FileText size={16} />
              News
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5"
              onClick={handleAuthClick}
            >
              <User size={16} />
              {user ? 'Dashboard' : 'Sign In'}
            </Button>
          </nav>
        </div>

        <button 
          className="md:hidden p-2 text-foreground/80 hover:text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <AnimatePresence>
          <MobileMenu 
            isOpen={isMenuOpen}
            showNavbarSearch={showNavbarSearch}
            user={user} 
            handleAuthClick={handleAuthClick}
            handleItemSelect={handleItemSelect}
          />
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Navbar;
