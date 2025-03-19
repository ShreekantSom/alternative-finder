
import { useState } from 'react';
import { Alternative } from '@/assets/data';
import { fetchMoreAlternatives } from '@/lib/crawler';
import { useToast } from "@/components/ui/use-toast";

export function useAlternativesLoader(initialAlternatives: Alternative[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { toast } = useToast();
  
  const loadMoreAlternatives = async (
    setAllAlternatives: React.Dispatch<React.SetStateAction<Alternative[]>>,
    category?: string
  ) => {
    setLoadingMore(true);
    
    try {
      const nextPage = currentPage + 1;
      const result = await fetchMoreAlternatives(nextPage, category !== 'All' ? category : undefined);
      
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
      setLoadingMore(false);
    }
  };
  
  // Reset currentPage when filters change
  const resetPagination = () => {
    setCurrentPage(1);
    setHasMore(true);
  };
  
  return {
    currentPage,
    hasMore,
    loadingMore,
    loadMoreAlternatives,
    resetPagination
  };
}
