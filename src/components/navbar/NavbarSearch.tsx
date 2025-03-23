
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alternative } from '@/assets/data';
import { searchAlternatives } from '@/lib/crawler';
import { motion, AnimatePresence } from 'framer-motion';
import SearchResults from './SearchResults';

interface NavbarSearchProps {
  showSearch: boolean;
  onItemSelect: (alternative: Alternative) => void;
}

export function NavbarSearch({ showSearch, onItemSelect }: NavbarSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState<Alternative[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    try {
      const result = await searchAlternatives(searchQuery);
      
      if (result.success) {
        // Handle successful search
        setShowResults(false);
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  if (!showSearch) return null;

  return (
    <motion.div 
      className="navbar-search-container relative"
      ref={searchContainerRef}
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
      
      {showResults && <SearchResults results={liveResults} onItemSelect={onItemSelect} />}
    </motion.div>
  );
}

export default NavbarSearch;
