
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Search, News } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { searchAlternatives } from '@/lib/crawler';
import { Alternative } from '@/assets/data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PincodeMenu } from './PincodeMenu';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbarSearch, setShowNavbarSearch] = useState(false);
  const [user, setUser] = useState<{email: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState<Alternative[]>([]);
  const [showResults, setShowResults] = useState(false);
  
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
      
      // Check if we've scrolled past the hero section (approx. 80vh)
      const heroHeight = window.innerHeight * 0.8;
      setShowNavbarSearch(window.scrollY > heroHeight);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Live search when query changes
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const result = await searchAlternatives(searchQuery);
          if (result.success) {
            setLiveResults(result.data);
            setShowResults(true);
          }
        } catch (error) {
          console.error("Error during live search:", error);
        }
      } else {
        setLiveResults([]);
        setShowResults(false);
      }
    }, 300);
    
    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    try {
      const result = await searchAlternatives(searchQuery);
      
      if (result.success) {
        // Navigate to home with search results
        navigate('/', { state: { searchResults: result.data } });
        setShowResults(false);
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleItemSelect = (alternative: Alternative) => {
    // Navigate to the service detail page with slug
    const slug = alternative.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    navigate(`/d2c/${slug}`);
    setShowResults(false);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector('.navbar-search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <span className="font-bold text-lg">D2C Directory</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex items-center space-x-4">
            {/* Pincode Menu */}
            <PincodeMenu className="border-none" />
            
            {/* Search bar that appears when scrolled down */}
            <AnimatePresence>
              {showNavbarSearch && (
                <motion.div 
                  className="navbar-search-container relative"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSearch} className="w-full">
                    <div className="relative flex items-center">
                      <Search className="absolute left-3 text-muted-foreground" size={16} />
                      <Input
                        type="text"
                        placeholder="Search services..."
                        className="pl-9 h-9 w-[250px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </form>
                  
                  {showResults && liveResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                      <ScrollArea className="max-h-[300px]">
                        <div className="p-2">
                          <div className="flex justify-between items-center px-2 py-1 text-xs text-muted-foreground">
                            <span>Search Results</span>
                            <span>{liveResults.length} found</span>
                          </div>
                          
                          <div className="space-y-1">
                            {liveResults.slice(0, 6).map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                                onClick={() => handleItemSelect(item)}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded overflow-hidden flex-shrink-0">
                                    <img 
                                      src={item.imageUrl} 
                                      alt={item.name}
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                      {item.description.substring(0, 60)}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.category}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
            <Link to="/#alternatives-list" className="text-foreground/80 hover:text-foreground transition-colors">Discover</Link>
            <Link to="/#categories" className="text-foreground/80 hover:text-foreground transition-colors">Categories</Link>
            <Link to="/news" className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1.5">
              <News size={16} />
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
              <nav className="flex flex-col space-y-4">
                {/* Pincode menu for mobile */}
                <div className="py-2">
                  <PincodeMenu className="w-full border-none" />
                </div>
                
                {/* Mobile search bar when scrolled */}
                {showNavbarSearch && (
                  <div className="navbar-search-container relative mb-2">
                    <form onSubmit={handleSearch} className="w-full">
                      <div className="relative flex items-center">
                        <Search className="absolute left-3 text-muted-foreground" size={16} />
                        <Input
                          type="text"
                          placeholder="Search services..."
                          className="pl-9 h-9 w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </form>
                    
                    {showResults && liveResults.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                        <ScrollArea className="max-h-[300px]">
                          <div className="p-2">
                            <div className="space-y-1">
                              {liveResults.slice(0, 6).map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                                  onClick={() => handleItemSelect(item)}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded overflow-hidden flex-shrink-0">
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.name}
                                        className="w-full h-full object-cover" 
                                      />
                                    </div>
                                    <p className="font-medium text-sm">{item.name}</p>
                                  </div>
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {item.category}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                )}

                <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors py-2">Home</Link>
                <Link to="/#alternatives-list" className="text-foreground/80 hover:text-foreground transition-colors py-2">Discover</Link>
                <Link to="/#categories" className="text-foreground/80 hover:text-foreground transition-colors py-2">Categories</Link>
                <Link to="/news" className="text-foreground/80 hover:text-foreground transition-colors py-2 flex items-center gap-1.5">
                  <News size={16} />
                  News
                </Link>
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
