
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchAlternatives } from '@/lib/crawler';
import { useToast } from "@/components/ui/use-toast";

interface SearchBarProps {
  className?: string;
  onSearch: (results: any[]) => void;
}

export function SearchBar({ className = '', onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    'Photoshop', 'Spotify', 'Microsoft Office', 'Chrome', 
    'Final Cut Pro', 'Windows', 'Adobe Illustrator', 'Slack'
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);
  const { toast } = useToast();

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch([]);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    const result = await searchAlternatives(searchTerm);
    setIsSearching(false);
    
    if (result.success && result.data) {
      onSearch(result.data);
      // Store search term in recent searches
      if (!suggestions.includes(searchTerm)) {
        setSuggestions(prev => [searchTerm, ...prev].slice(0, 8));
      }
    } else {
      toast({
        title: "Search failed",
        description: result.error || "Please try again later",
        variant: "destructive",
      });
      onSearch([]);
    }
  };

  // Handle input changes with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.trim()) {
      searchTimeoutRef.current = window.setTimeout(() => {
        handleSearch();
      }, 500);
    } else {
      onSearch([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative flex items-center overflow-hidden transition-all duration-300 ease-out
          ${isFocused 
            ? 'bg-white dark:bg-gray-900 shadow-lg ring-2 ring-primary/30 rounded-2xl' 
            : 'bg-secondary dark:bg-gray-800 rounded-2xl'
          }`
        }
      >
        <div className="flex items-center justify-center pl-5">
          <Search className={`w-5 h-5 ${isFocused ? 'text-primary' : 'text-muted-foreground'} transition-colors duration-200`} />
        </div>
        
        <input
          type="text"
          placeholder="Search for software alternatives..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay blur to allow clicking on suggestions
            setTimeout(() => setIsFocused(false), 200);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="w-full py-4 px-3 bg-transparent border-none focus:outline-none text-base md:text-lg placeholder:text-muted-foreground/70"
        />
        
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center p-2 mr-2 rounded-full hover:bg-secondary transition-colors duration-200"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>
        
        <button 
          className={`h-full flex items-center justify-center px-5 py-3 bg-primary text-white font-medium transition-all duration-200 hover:bg-primary/90 ${isSearching ? 'opacity-80' : ''}`}
          aria-label="Search"
          onClick={handleSearch}
          disabled={isSearching}
        >
          <span className="hidden md:inline">{isSearching ? 'Searching...' : 'Search'}</span>
          <Search className="w-5 h-5 md:hidden" />
        </button>
      </div>
      
      {/* Suggestions dropdown (only show when focused) */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg z-10 py-2 max-h-80 overflow-auto"
          >
            <div className="p-3 text-muted-foreground text-sm">
              {searchTerm ? 'Suggested searches:' : 'Popular searches:'}
            </div>
            <div className="px-2">
              {suggestions
                .filter(suggestion => searchTerm ? suggestion.toLowerCase().includes(searchTerm.toLowerCase()) : true)
                .map((suggestion, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors duration-200 text-sm flex items-center"
                    onClick={() => {
                      setSearchTerm(suggestion);
                      handleSearch();
                    }}
                  >
                    <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                    {suggestion}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
