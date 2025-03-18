
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import SearchBar from './SearchBar';

export function Navbar({ onSearch }: { onSearch?: (results: any[]) => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle search results (if search functionality is passed)
  const handleSearch = (results: any[]) => {
    if (onSearch) {
      onSearch(results);
      setIsMobileMenuOpen(false); // Close mobile menu after search
    }
  };

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/50 py-3' : 'py-5'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <div className="rounded-xl bg-primary p-1.5">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
            </svg>
          </div>
          <span className="font-medium text-lg">AlternativeFinder</span>
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <SearchBar className="w-[400px]" onSearch={handleSearch} />
          
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Categories</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Trending</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Submit</a>
          </nav>
          
          {/* Theme toggle button */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Mobile Navigation Button */}
        <div className="md:hidden flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container max-w-7xl mx-auto px-4 py-4">
              <SearchBar className="w-full mb-4" onSearch={handleSearch} />
              
              <nav className="flex flex-col space-y-4">
                <a href="#" className="py-2 hover:text-primary">Categories</a>
                <a href="#" className="py-2 hover:text-primary">Trending</a>
                <a href="#" className="py-2 hover:text-primary">Submit</a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
