
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AlternativesList from '@/components/AlternativesList';
import CategoriesList from '@/components/CategoriesList';
import FeaturedAlternative from '@/components/FeaturedAlternative';
import SearchBar from '@/components/SearchBar';
import { Alternative } from '@/assets/data';
import { softwareService } from '@/lib/softwareService';
import { useToast } from "@/components/ui/use-toast";

export function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<Alternative[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlternatives();
  }, [selectedCategory]);

  const fetchAlternatives = async () => {
    setIsLoading(true);
    try {
      let result;
      if (selectedCategory === "All") {
        result = await softwareService.getAllSoftware();
      } else {
        result = await softwareService.getSoftwareByCategory(selectedCategory);
      }
      
      if (result.success) {
        setAlternatives(result.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load software alternatives",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching alternatives:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowSearchResults(false);
  };

  const handleSearch = (results: Alternative[]) => {
    setSearchResults(results);
    setShowSearchResults(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        {/* Pass onSearch as a prop to SearchBar component */}
        <div className="container mx-auto px-4 py-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {showSearchResults ? (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            <AlternativesList 
              alternatives={searchResults} 
              isLoading={false} 
            />
          </div>
        ) : (
          <>
            <CategoriesList onCategorySelect={handleCategorySelect} />
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-bold mb-6">
                {selectedCategory === "All" ? "All Software" : selectedCategory}
              </h2>
              <AlternativesList 
                alternatives={alternatives} 
                isLoading={isLoading} 
              />
            </div>
          </>
        )}
        
        <FeaturedAlternative />
      </main>
    </div>
  );
}

export default Index;
