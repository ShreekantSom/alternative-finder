
import { Link, useNavigate } from 'react-router-dom';
import { News, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Alternative } from '@/assets/data';
import { PincodeMenu } from '../PincodeMenu';
import { motion } from 'framer-motion';
import { searchAlternatives } from '@/lib/crawler';
import { useState, useEffect } from 'react';
import SearchResults from './SearchResults';

interface MobileMenuProps {
  isOpen: boolean;
  showNavbarSearch: boolean;
  user: { email: string } | null;
  handleAuthClick: () => void;
  handleItemSelect: (alternative: Alternative) => void;
}

export function MobileMenu({ 
  isOpen, 
  showNavbarSearch, 
  user, 
  handleAuthClick,
  handleItemSelect 
}: MobileMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState<Alternative[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Search functionality
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    try {
      const result = await searchAlternatives(searchQuery);
      
      if (result.success) {
        navigate('/', { state: { searchResults: result.data } });
        setShowResults(false);
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  if (!isOpen) return null;

  return (
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
            
            {showResults && <SearchResults results={liveResults} onItemSelect={handleItemSelect} />}
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
  );
}

export default MobileMenu;
