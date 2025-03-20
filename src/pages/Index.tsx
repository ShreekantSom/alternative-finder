
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AlternativesList from '@/components/AlternativesList';
import CategoriesList from '@/components/CategoriesList';
import FeaturedAlternative from '@/components/FeaturedAlternative';
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
  const location = useLocation();

  useEffect(() => {
    fetchAlternatives();
  }, [selectedCategory]);

  // Check for search results passed via location state (from Navbar)
  useEffect(() => {
    if (location.state?.searchResults) {
      setSearchResults(location.state.searchResults);
      setShowSearchResults(true);
      
      // Scroll to results section
      setTimeout(() => {
        const resultsSection = document.querySelector('.search-results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      // Clear the location state to prevent showing search results after refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
    
    // Scroll to results section
    setTimeout(() => {
      const resultsSection = document.querySelector('.search-results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero onSearch={handleSearch} />
        
        {showSearchResults ? (
          <div className="container mx-auto px-4 py-8 search-results-section">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            {searchResults.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No results found for your search. Try different keywords.</p>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Found {searchResults.length} results</p>
              </div>
            )}
            <AlternativesList 
              alternatives={searchResults} 
              isLoading={false} 
              searchResults={searchResults}
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
                selectedCategory={selectedCategory}
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
