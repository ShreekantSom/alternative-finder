
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchAlternatives } from '@/lib/crawler';
import { Alternative } from '@/assets/data';
import { useToast } from "@/components/ui/use-toast";
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

interface SearchBarProps {
  onSearch: (results: Alternative[]) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [liveResults, setLiveResults] = useState<Alternative[]>([]);
  const { toast } = useToast();
  
  // Open command dialog with keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  // Live search when query changes
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const result = await searchAlternatives(searchQuery);
          if (result.success) {
            setLiveResults(result.data);
          }
        } catch (error) {
          console.error("Error during live search:", error);
        }
      } else {
        setLiveResults([]);
      }
    }, 300);
    
    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Use the crawler's search function for better search results
      const result = await searchAlternatives(searchQuery);
      
      if (result.success) {
        console.info('Search results:', result.data);
        onSearch(result.data);
        setOpen(false); // Close dialog after search
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

  const handleItemSelect = (alternative: Alternative) => {
    onSearch([alternative]);
    setOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for software alternatives..."
            className="pl-10 rounded-r-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={() => setOpen(true)}
          />
          <Button type="submit" className="rounded-l-none" disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-1.5 text-center">
          Press <kbd className="rounded border bg-muted px-1">⌘K</kbd> or <kbd className="rounded border bg-muted px-1">Ctrl+K</kbd> to search
        </div>
      </form>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search for software alternatives..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {liveResults.length > 0 && (
            <CommandGroup heading="Search Results">
              {liveResults.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleItemSelect(item)}
                  className="flex items-center justify-between p-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {item.category}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default SearchBar;
