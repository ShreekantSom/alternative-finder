import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Alternative } from '@/assets/data';
import AlternativesHeader from './alternatives/AlternativesHeader';
import AlternativesFilter from './filters/AlternativesFilter';
import AlternativesGrid from './alternatives/AlternativesGrid';
import LoadMoreButton from './pagination/LoadMoreButton';
import AlternativesPagination from './pagination/AlternativesPagination';
import { useAlternativesFiltering } from '@/hooks/useAlternativesFiltering';
import { useAlternativesLoader } from '@/hooks/useAlternativesLoader';

interface AlternativesListProps {
  alternatives: Alternative[];
  isLoading: boolean;
  searchResults?: Alternative[];
  selectedCategory?: string;
  onBusinessClick?: (businessId: string) => void;
}

export function AlternativesList({
  alternatives: providedAlternatives,
  isLoading,
  searchResults = [],
  selectedCategory = 'All',
  onBusinessClick
}: AlternativesListProps) {
  const {
    allAlternatives,
    setAllAlternatives,
    filteredAlternatives,
    filterCategory,
    handleFilterChange
  } = useAlternativesFiltering(providedAlternatives, searchResults, selectedCategory);
  
  const {
    currentPage,
    hasMore,
    loadingMore,
    loadMoreAlternatives,
    resetPagination
  } = useAlternativesLoader(providedAlternatives);

  useEffect(() => {
    resetPagination();
  }, [filterCategory, resetPagination]);

  const getHeaderContent = () => {
    if (searchResults.length > 0) {
      return {
        title: `Search Results (${searchResults.length})`,
        description: 'Showing results matching your search'
      };
    } else if (filterCategory !== 'All') {
      return {
        title: `${filterCategory} Alternatives`,
        description: `Discover ${filterCategory} alternatives loved by our community`
      };
    } else {
      return {
        title: 'Popular Alternatives',
        description: 'Discover the most loved alternatives by our community'
      };
    }
  };
  
  const {
    title,
    description
  } = getHeaderContent();
  
  const handleLoadMore = () => {
    loadMoreAlternatives(setAllAlternatives, filterCategory);
  };

  if (isLoading && !loadingMore) {
    return <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 mx-auto animate-spin mb-4" />
            <p>Loading alternatives...</p>
          </div>
        </div>
      </section>;
  }
  
  return <section className="px-4 py-0">
      <div className="container max-w-7xl mx-auto">
        <AlternativesHeader title={title} description={description} filterComponent={<AlternativesFilter selectedCategory={selectedCategory} onFilterChange={handleFilterChange} searchResultsExist={searchResults.length > 0} />} />
        
        <AlternativesGrid 
          alternatives={filteredAlternatives} 
          onBusinessClick={onBusinessClick}
        />
        
        {filteredAlternatives.length > 0 && !isLoading && !loadingMore && hasMore && searchResults.length === 0 && <LoadMoreButton hasMore={hasMore} isLoading={loadingMore} onLoadMore={handleLoadMore} />}
        
        {(isLoading || loadingMore) && <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center px-6 py-3 bg-secondary rounded-lg">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Loading more alternatives...</span>
            </div>
          </div>}
        
        {searchResults.length > 0 && <AlternativesPagination currentPage={1} totalPages={3} onPageChange={() => {}} />}
      </div>
    </section>;
}

export default AlternativesList;
