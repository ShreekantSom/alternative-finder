
import { useState, useEffect, useRef } from 'react';
import { Search, Tag, Layers, Hash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchAlternatives } from '@/lib/crawler';
import { Alternative } from '@/assets/data';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { softwareService } from '@/lib/softwareService';
import { categoryService } from '@/lib/categoryService';

interface SearchBarProps {
  onSearch: (results: Alternative[]) => void;
}

type SearchResultType = 'alternative' | 'category' | 'subcategory' | 'tag';

interface SearchResult {
  id: string;
  name: string;
  type: SearchResultType;
  description?: string;
  imageUrl?: string;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [liveResults, setLiveResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Live search when query changes
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          // Search alternatives
          const result = await searchAlternatives(searchQuery);
          let searchResults: SearchResult[] = [];
          
          if (result.success) {
            // Add business alternatives
            searchResults = result.data.map((alt: Alternative) => ({
              id: alt.id,
              name: alt.name,
              type: 'alternative' as SearchResultType,
              description: alt.description,
              imageUrl: alt.imageUrl
            }));
            
            // Search categories
            const categories = await categoryService.searchCategories(searchQuery);
            if (categories.success) {
              searchResults = [
                ...searchResults,
                ...categories.data.map((cat) => ({
                  id: cat.id,
                  name: cat.name,
                  type: 'category' as SearchResultType,
                  description: `${cat.count} businesses`,
                  imageUrl: undefined
                }))
              ];
            }
            
            // Search subcategories and tags
            const tagsAndSubcategories = await softwareService.searchTagsAndSubcategories(searchQuery);
            if (tagsAndSubcategories.success) {
              // Add subcategories
              if (tagsAndSubcategories.data.subcategories) {
                searchResults = [
                  ...searchResults,
                  ...tagsAndSubcategories.data.subcategories.map((sub) => ({
                    id: sub.id,
                    name: sub.name,
                    type: 'subcategory' as SearchResultType,
                    description: `Subcategory of ${sub.parentCategory}`,
                    imageUrl: undefined
                  }))
                ];
              }
              
              // Add tags
              if (tagsAndSubcategories.data.tags) {
                searchResults = [
                  ...searchResults,
                  ...tagsAndSubcategories.data.tags.map((tag) => ({
                    id: tag.id,
                    name: tag.name,
                    type: 'tag' as SearchResultType,
                    description: `${tag.count} businesses with this tag`,
                    imageUrl: undefined
                  }))
                ];
              }
            }
            
            setLiveResults(searchResults);
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
    
    setIsSearching(true);
    
    try {
      const result = await searchAlternatives(searchQuery);
      
      if (result.success) {
        console.info('Search results:', result.data);
        onSearch(result.data);
        setShowResults(false);
      } else {
        toast({
          title: "Search Error",
          description: "Failed to search alternatives",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during search:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleItemSelect = (result: SearchResult) => {
    switch (result.type) {
      case 'alternative':
        // Find the full alternative and search with it
        searchAlternatives(result.name).then(res => {
          if (res.success) {
            onSearch([res.data.find((alt: Alternative) => alt.id === result.id)].filter(Boolean));
          }
        });
        break;
      case 'category':
        // Navigate to category page
        window.location.href = `/category/${result.name.toLowerCase().replace(/\s+/g, '-')}`;
        break;
      case 'subcategory':
        // Search for items in this subcategory
        softwareService.getSoftwareBySubcategory(result.name).then(res => {
          if (res.success) {
            onSearch(res.data);
          }
        });
        break;
      case 'tag':
        // Search for items with this tag
        softwareService.getSoftwareByTag(result.name).then(res => {
          if (res.success) {
            onSearch(res.data);
          }
        });
        break;
    }
    setShowResults(false);
  };

  const getIconForResultType = (type: SearchResultType) => {
    switch (type) {
      case 'category':
        return <Layers className="w-4 h-4 text-primary" />;
      case 'subcategory':
        return <Layers className="w-4 h-4 text-secondary" />;
      case 'tag':
        return <Hash className="w-4 h-4 text-accent" />;
      default:
        return null;
    }
  };

  return (
    <div ref={searchContainerRef} className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search businesses, categories, tags..."
            className="pl-10 rounded-r-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
          <Button type="submit" className="rounded-l-none" disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>
      
      {showResults && liveResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
          <ScrollArea className="max-h-[380px]">
            <div className="p-2">
              <div className="flex justify-between items-center px-3 py-2 text-sm text-muted-foreground">
                <span>Search Results</span>
                <span>{liveResults.length} found</span>
              </div>
              
              <div className="space-y-1">
                {liveResults.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => handleItemSelect(item)}
                  >
                    <div className="flex items-center gap-2">
                      {item.imageUrl ? (
                        <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          {getIconForResultType(item.type)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`}
                        </p>
                      </div>
                    </div>
                    <Badge variant={item.type === 'alternative' ? 'outline' : 'secondary'} className="ml-2">
                      {item.type === 'alternative' ? (
                        <span>Business</span>
                      ) : (
                        <span className="flex items-center gap-1">
                          {getIconForResultType(item.type)}
                          <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                        </span>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground mt-1.5 text-center">
        Press <kbd className="rounded border bg-muted px-1">⌘K</kbd> or <kbd className="rounded border bg-muted px-1">Ctrl+K</kbd> to focus search
      </div>
    </div>
  );
}

export default SearchBar;
