
import { Heart, Share2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alternative } from '@/assets/data';

interface AlternativeCardFooterProps {
  alternative: Alternative;
  isLiked: boolean;
  onLike: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}

export function AlternativeCardFooter({ 
  alternative, 
  isLiked, 
  onLike, 
  onShare 
}: AlternativeCardFooterProps) {
  const getPricingBgColor = (pricing: string) => {
    switch(pricing) {
      case 'Free':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Freemium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Paid':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Subscription':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Open Source':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4">
      <span className={`text-xs px-2 py-1 rounded-full ${getPricingBgColor(alternative.pricing)}`}>
        {alternative.pricing}
      </span>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={onLike}
          className={`p-1.5 rounded-full transition-colors ${
            isLiked 
              ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' 
              : 'hover:bg-secondary text-muted-foreground'
          }`}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        
        <button 
          onClick={onShare}
          className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </CardFooter>
  );
}

export default AlternativeCardFooter;
