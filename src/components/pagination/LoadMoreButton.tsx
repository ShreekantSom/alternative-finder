
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export function LoadMoreButton({ hasMore, isLoading, onLoadMore }: LoadMoreButtonProps) {
  if (isLoading) {
    return (
      <div className="mt-8 text-center">
        <div className="inline-flex items-center justify-center px-6 py-3 bg-secondary rounded-lg">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          <span>Loading more alternatives...</span>
        </div>
      </div>
    );
  }

  if (!hasMore) {
    return null;
  }

  return (
    <div className="mt-12 text-center">
      <Button 
        variant="secondary"
        size="lg"
        className="mx-auto"
        onClick={onLoadMore}
      >
        Load more alternatives
      </Button>
    </div>
  );
}

export default LoadMoreButton;
