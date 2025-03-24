
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AlternativesList from '@/components/AlternativesList';
import CategoriesList from '@/components/CategoriesList';
import FeaturedAlternative from '@/components/FeaturedAlternative';
import HomeNews from '@/components/home/HomeNews';
import AdvancedFilters from '@/components/filters/AdvancedFilters';
import { Alternative } from '@/assets/data';
import { softwareService } from '@/lib/softwareService';
import { useToast } from "@/components/ui/use-toast";

export function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<Alternative[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: [0, 1000],
    location: 'All',
    sustainability: false
  });
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    fetchAlternatives();
  }, [selectedCategory, advancedFilters]);

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
        // Apply advanced filters
        let filteredData = result.data;
        
        // Filter by price range if applicable
        if (advancedFilters.priceRange && advancedFilters.priceRange.length === 2) {
          filteredData = filteredData.filter(item => {
            // Assuming there's a price field or we extract it from description
            const price = extractPrice(item);
            return price >= advancedFilters.priceRange[0] && price <= advancedFilters.priceRange[1];
          });
        }
        
        // Filter by location if applicable
        if (advancedFilters.location && advancedFilters.location !== 'All') {
          filteredData = filteredData.filter(item => {
            return item.availablePincodes?.includes(advancedFilters.location);
          });
        }
        
        // Filter by sustainability if applicable
        if (advancedFilters.sustainability) {
          filteredData = filteredData.filter(item => {
            // Check if description mentions sustainability
            return item.description.toLowerCase().includes('sustainable') || 
                   item.description.toLowerCase().includes('eco-friendly');
          });
        }
        
        setAlternatives(filteredData);
      } else {
        toast({
          title: "Error",
          description: "Failed to load service providers",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract price from item
  const extractPrice = (item: Alternative): number => {
    // This is a simplified example. In a real app, you'd have a proper price field
    // For now, we'll return a random price based on the item's id for demonstration
    return parseInt(item.id) * 100;
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

  const handleAdvancedFilterChange = (filters: any) => {
    setAdvancedFilters(filters);
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
            {/* Featured Alternative Section - Now above Categories */}
            <FeaturedAlternative />
            
            {/* Categories Section */}
            <CategoriesList onCategorySelect={handleCategorySelect} />
            
            {/* Advanced Filters */}
            <div className="container mx-auto px-4 py-8">
              <AdvancedFilters onChange={handleAdvancedFilterChange} />
              
              <h2 className="text-2xl font-bold mb-6">
                {selectedCategory === "All" ? "All Service Providers" : `${selectedCategory} Services`}
              </h2>
              <AlternativesList 
                alternatives={alternatives} 
                isLoading={isLoading} 
                selectedCategory={selectedCategory}
              />
            </div>
            
            {/* News Section - Added at the bottom */}
            <HomeNews />
          </>
        )}
      </main>
    </div>
  );
}

export default Index;
