
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { softwareService } from '@/lib/softwareService';
import { Alternative } from '@/assets/data';
import { useToast } from "@/components/ui/use-toast";

interface SearchBarProps {
  onSearch: (results: Alternative[]) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    setIsSearching(true);
    
    try {
      const result = await softwareService.getAllSoftware();
      
      if (result.success) {
        const filteredResults = result.data.filter(software => 
          software.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          software.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          software.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        console.info('Hero search results:', filteredResults);
        onSearch(filteredResults);
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

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for software alternatives..."
          className="pl-10 rounded-r-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" className="rounded-l-none" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
}

export default SearchBar;
