
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { AuthService } from '@/lib/auth';

type NavbarProps = {
  onSearch?: (results: any[]) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{email: string} | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, [location.pathname]); // Re-check when route changes

  // Handle scroll event to add background color
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (results: any[]) => {
    if (onSearch) {
      onSearch(results);
    }
  };

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-3 md:py-4 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="rounded-xl bg-primary p-1.5">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
            </svg>
          </div>
          <span className="font-bold text-lg">AlternativeFinder</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Search Bar (only on homepage) */}
          {location.pathname === '/' && onSearch && (
            <div className="max-w-md w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
          )}
          
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
            <Link to="/#alternatives-list" className="text-foreground/80 hover:text-foreground transition-colors">Discover</Link>
            <Link to="/#categories" className="text-foreground/80 hover:text-foreground transition-colors">Categories</Link>
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

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-foreground/80 hover:text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-background shadow-lg p-4 md:hidden"
            >
              {location.pathname === '/' && onSearch && (
                <div className="mb-4">
                  <SearchBar onSearch={handleSearch} />
                </div>
              )}
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors py-2">Home</Link>
                <Link to="/#alternatives-list" className="text-foreground/80 hover:text-foreground transition-colors py-2">Discover</Link>
                <Link to="/#categories" className="text-foreground/80 hover:text-foreground transition-colors py-2">Categories</Link>
                <Button 
                  variant="outline"
                  className="justify-start gap-1.5 w-full"
                  onClick={handleAuthClick}
                >
                  <User size={16} />
                  {user ? 'Dashboard' : 'Sign In'}
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Navbar;
