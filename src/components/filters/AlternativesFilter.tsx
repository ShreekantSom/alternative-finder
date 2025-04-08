
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { alternatives } from '@/assets/data';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AlternativesFilterProps {
  selectedCategory: string;
  onFilterChange: (filterCategory: string, platform: string, pricing: string, selectedTag?: string) => void;
  searchResultsExist: boolean;
}

export function AlternativesFilter({ 
  selectedCategory, 
  onFilterChange, 
  searchResultsExist 
}: AlternativesFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState(selectedCategory);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState('All');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Set filter category when selectedCategory prop changes
  useEffect(() => {
    setFilterCategory(selectedCategory);
  }, [selectedCategory]);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filterCategory, selectedPlatform, selectedPricing, selectedTag);
  }, [filterCategory, selectedPlatform, selectedPricing, selectedTag, onFilterChange]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const categories = ['All', ...Array.from(new Set(alternatives.map(alt => alt.category)))];
  const platforms = ['All', ...Array.from(new Set(alternatives.flatMap(alt => alt.platform)))];
  const pricingOptions = ['All', 'Free', 'Freemium', 'Paid', 'Open Source'];
  
  // Extract unique tags from all alternatives
  const allTags = alternatives.reduce((tags: string[], alt) => {
    if (alt.tags && Array.isArray(alt.tags)) {
      alt.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, []);
  
  // Popular tags would typically be determined by frequency or prioritized manually
  const popularTags = allTags.slice(0, 10);

  // Reset state when search results exist
  useEffect(() => {
    if (searchResultsExist) {
      setIsFilterOpen(false);
    }
  }, [searchResultsExist]);

  if (searchResultsExist) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={toggleFilter}
          variant="secondary"
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        {popularTags.length > 0 && (
          <div className="overflow-x-auto flex-1">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="flex-wrap">
                <TabsTrigger 
                  value="all" 
                  onClick={() => setSelectedTag('')}
                  className="text-xs px-3"
                >
                  All
                </TabsTrigger>
                {popularTags.map((tag, index) => (
                  <TabsTrigger 
                    key={index} 
                    value={tag} 
                    onClick={() => setSelectedTag(tag)}
                    className="text-xs px-3 flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>

      {/* Filters panel */}
      <motion.div
        initial={false}
        animate={{ height: isFilterOpen ? 'auto' : 0, opacity: isFilterOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mb-8 w-full"
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
          
          {/* Tag filter (extended display) */}
          {allTags.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <Button
                    key={index}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default AlternativesFilter;
