
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { alternatives } from '@/assets/data';
import AlternativeCard from './AlternativeCard';

export function AlternativesList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState('All');

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filteredAlternatives = alternatives.filter(alt => {
    return (
      (selectedCategory === 'All' || alt.category === selectedCategory) &&
      (selectedPlatform === 'All' || alt.platform.includes(selectedPlatform)) &&
      (selectedPricing === 'All' || alt.pricing === selectedPricing)
    );
  });

  const categories = ['All', ...new Set(alternatives.map(alt => alt.category))];
  const platforms = ['All', ...new Set(alternatives.flatMap(alt => alt.platform))];
  const pricingOptions = ['All', 'Free', 'Freemium', 'Paid', 'Open Source'];

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
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Popular Alternatives</h2>
            <p className="text-muted-foreground">Discover the most loved alternatives by our community</p>
          </div>
          
          <button
            onClick={toggleFilter}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors duration-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
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
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
              key={alternative.id} 
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
        
        {/* Load more button */}
        {filteredAlternatives.length > 0 && (
          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-secondary hover:bg-secondary/70 rounded-lg font-medium transition-colors duration-200">
              Load more alternatives
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default AlternativesList;
