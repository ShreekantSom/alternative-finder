
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled
          ? 'py-3 backdrop-blur-lg bg-white/80 dark:bg-black/80 shadow-sm'
          : 'py-6 bg-transparent'
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-opacity duration-300 hover:opacity-80"
          >
            <div className="rounded-xl bg-primary p-1.5">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
              </svg>
            </div>
            <span className="font-medium text-lg">AlternativeFinder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link to="/categories" className="nav-link text-sm font-medium hover:text-primary">
              Categories
            </Link>
            <Link to="/trending" className="nav-link text-sm font-medium hover:text-primary">
              Trending
            </Link>
            <Link to="/new" className="nav-link text-sm font-medium hover:text-primary">
              New
            </Link>
          </nav>

          {/* Search button */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="rounded-full p-2.5 bg-secondary hover:bg-primary/10 transition-colors duration-300"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-full p-2.5 bg-secondary hover:bg-primary/10 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out transform pt-24',
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="container mx-auto px-4 py-8">
          <nav className="flex flex-col space-y-6">
            <Link 
              to="/" 
              className="text-xl font-medium px-4 py-2 hover:bg-secondary rounded-md transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className="text-xl font-medium px-4 py-2 hover:bg-secondary rounded-md transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              to="/trending" 
              className="text-xl font-medium px-4 py-2 hover:bg-secondary rounded-md transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trending
            </Link>
            <Link 
              to="/new" 
              className="text-xl font-medium px-4 py-2 hover:bg-secondary rounded-md transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              New
            </Link>

            <div className="mt-6 px-4">
              <button className="w-full flex items-center justify-center space-x-2 bg-secondary hover:bg-primary/10 py-3 px-4 rounded-md transition-colors duration-200">
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
