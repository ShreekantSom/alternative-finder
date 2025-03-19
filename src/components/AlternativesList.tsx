
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Loader2 } from 'lucide-react';
import { alternatives } from '@/assets/data';
import AlternativeCard from './AlternativeCard';
import { fetchMoreAlternatives } from '@/lib/crawler';
import { useToast } from "@/components/ui/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Alternative } from '@/assets/data';

interface AlternativesListProps {
  alternatives: Alternative[];
  isLoading: boolean;
  searchResults?: Alternative[];
  selectedCategory?: string;
}

export function AlternativesList({ alternatives: providedAlternatives, isLoading, searchResults = [], selectedCategory = 'All' }: AlternativesListProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState('All');
  const [allAlternatives, setAllAlternatives] = useState(providedAlternatives);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  // Update allAlternatives when providedAlternatives changes
  useEffect(() => {
    setAllAlternatives(providedAlternatives);
  }, [providedAlternatives]);

  // Set filter category when selectedCategory prop changes
  useEffect(() => {
    setFilterCategory(selectedCategory);
  }, [selectedCategory]);

  // Filter alternatives based on filters and search results
  const filteredAlternatives = searchResults.length > 0 
    ? searchResults 
    : allAlternatives.filter(alt => {
        return (
          (filterCategory === 'All' || alt.category === filterCategory) &&
          (selectedPlatform === 'All' || alt.platform.includes(selectedPlatform)) &&
          (selectedPricing === 'All' || alt.pricing === selectedPricing)
        );
      });

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const categories = ['All', ...new Set(alternatives.map(alt => alt.category))];
  const platforms = ['All', ...new Set(alternatives.flatMap(alt => alt.platform))];
  const pricingOptions = ['All', 'Free', 'Freemium', 'Paid', 'Open Source'];

  const loadMoreAlternatives = async () => {
    setIsLoading(true);
    
    try {
      const nextPage = currentPage + 1;
      const result = await fetchMoreAlternatives(nextPage, filterCategory !== 'All' ? filterCategory : undefined);
      
      if (result.success && result.data) {
        if (result.data.length > 0) {
          setAllAlternatives(prev => [...prev, ...result.data]);
          setCurrentPage(nextPage);
        } else {
          setHasMore(false);
          toast({
            title: "No more alternatives",
            description: "You've reached the end of the list",
          });
        }
      } else {
        toast({
          title: "Couldn't load more",
          description: result.error || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading more alternatives:', error);
      toast({
        title: "Error",
        description: "Failed to load more alternatives",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when search results change
  useEffect(() => {
    if (searchResults.length > 0) {
      setIsFilterOpen(false);
    }
  }, [searchResults]);

  // Reset currentPage when filters change
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
  }, [filterCategory, selectedPlatform, selectedPricing]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              {searchResults.length > 0 
                ? `Search Results (${searchResults.length})` 
                : filterCategory !== 'All'
                  ? `${filterCategory} Alternatives`
                  : 'Popular Alternatives'}
            </h2>
            <p className="text-muted-foreground">
              {searchResults.length > 0 
                ? 'Showing results matching your search'
                : filterCategory !== 'All'
                  ? `Discover ${filterCategory} alternatives loved by our community`
                  : 'Discover the most loved alternatives by our community'}
            </p>
          </div>
          
          {searchResults.length === 0 && (
            <Button
              onClick={toggleFilter}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </Button>
          )}
        </div>
        
        {/* Filters panel */}
        <motion.div
          initial={false}
          animate={{ height: isFilterOpen ? 'auto' : 0, opacity: isFilterOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mb-8"
        >
          <div className="p-6 bg-secondary/30 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Platform filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select 
                  value={selectedPlatform} 
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
              
              {/* Pricing filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Pricing</label>
                <select 
                  value={selectedPricing} 
                  onChange={(e) => setSelectedPricing(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {pricingOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Alternatives grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredAlternatives.map((alternative, index) => (
            <AlternativeCard 
              key={`${alternative.id}-${index}`} 
              alternative={alternative} 
              index={index}
            />
          ))}
        </motion.div>
        
        {/* Empty state */}
        {filteredAlternatives.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No alternatives found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to find more results</p>
          </div>
        )}
        
        {/* Load more button and pagination */}
        {filteredAlternatives.length > 0 && !isLoading && hasMore && searchResults.length === 0 && (
          <div className="mt-12 text-center">
            <Button 
              variant="secondary"
              size="lg"
              className="mx-auto"
              onClick={loadMoreAlternatives}
            >
              Load more alternatives
            </Button>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center px-6 py-3 bg-secondary rounded-lg">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Loading more alternatives...</span>
            </div>
          </div>
        )}
        
        {/* Pagination for search results */}
        {searchResults.length > 0 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
}

export default AlternativesList;
