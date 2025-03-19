
import { useState, useEffect } from 'react';
import { Alternative } from '@/assets/data';

export function useAlternativesFiltering(
  providedAlternatives: Alternative[],
  searchResults: Alternative[] = [],
  initialCategory: string = 'All'
) {
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState('All');
  const [allAlternatives, setAllAlternatives] = useState(providedAlternatives);
  
  // Update allAlternatives when providedAlternatives changes
  useEffect(() => {
    setAllAlternatives(providedAlternatives);
  }, [providedAlternatives]);
  
  // Set filter category when selectedCategory prop changes
  useEffect(() => {
    setFilterCategory(initialCategory);
  }, [initialCategory]);
  
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
      
  const handleFilterChange = (category: string, platform: string, pricing: string) => {
    setFilterCategory(category);
    setSelectedPlatform(platform);
    setSelectedPricing(pricing);
  };
  
  return {
    allAlternatives,
    setAllAlternatives,
    filteredAlternatives,
    filterCategory,
    selectedPlatform,
    selectedPricing,
    handleFilterChange
  };
}
