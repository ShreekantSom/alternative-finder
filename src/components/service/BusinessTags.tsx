
import { Tag } from 'lucide-react';
import { Alternative } from '@/assets/data';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

interface BusinessTagsProps {
  business: Alternative;
  className?: string;
  limit?: number;
  showIcon?: boolean;
}

export function BusinessTags({ business, className = "", limit, showIcon = true }: BusinessTagsProps) {
  const navigate = useNavigate();
  
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`);
  };
  
  if (!business.tags || business.tags.length === 0) {
    return null;
  }
  
  const tagsToShow = limit ? business.tags.slice(0, limit) : business.tags;
  const remainingCount = limit && business.tags.length > limit ? business.tags.length - limit : 0;
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tagsToShow.map((tag, i) => (
        <Badge 
          key={i} 
          variant="outline" 
          className="hover:bg-primary/10 cursor-pointer transition-colors flex items-center gap-1 px-2 py-1 text-xs"
          onClick={(e) => handleTagClick(tag, e)}
        >
          {showIcon && <Tag className="h-3 w-3" />}
          {tag}
        </Badge>
      ))}
      
      {remainingCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}

export default BusinessTags;
