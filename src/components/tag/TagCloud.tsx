
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { softwareService } from '@/lib/softwareService';
import { createSlug } from '@/lib/softwareUtils';

interface Tag {
  id: string;
  name: string;
  count: number;
}

interface TagCloudProps {
  limit?: number;
  title?: string;
  onTagSelect?: (tag: string) => void;
  clickable?: boolean;
}

export function TagCloud({ 
  limit = 20, 
  title = "Popular Tags", 
  onTagSelect,
  clickable = true 
}: TagCloudProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const result = await softwareService.searchTagsAndSubcategories('');
        if (result.success && result.data) {
          // Sort tags by count (most popular first)
          const sortedTags = result.data.tags.sort((a, b) => b.count - a.count);
          setTags(sortedTags.slice(0, limit));
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, [limit]);
  
  const getFontSize = (count: number) => {
    const max = Math.max(...tags.map(t => t.count));
    const min = Math.min(...tags.map(t => t.count));
    const range = max - min || 1;
    const normalized = (count - min) / range;
    return 0.8 + normalized * 0.7; // Scale from 0.8rem to 1.5rem
  };
  
  const getTagVariant = (count: number) => {
    const max = Math.max(...tags.map(t => t.count));
    if (count > max * 0.8) return "default";
    if (count > max * 0.5) return "secondary";
    return "outline";
  };
  
  if (isLoading) {
    return <TagCloudSkeleton />;
  }
  
  if (!tags.length) {
    return null;
  }
  
  return (
    <div className="mb-10">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const TagComponent = clickable
            ? onTagSelect 
              ? ({ children }: { children: React.ReactNode }) => (
                  <Badge 
                    key={tag.id}
                    variant={getTagVariant(tag.count) as any}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    style={{ fontSize: `${getFontSize(tag.count)}rem` }}
                    onClick={() => onTagSelect(tag.name)}
                  >
                    {children}
                  </Badge>
                )
              : ({ children }: { children: React.ReactNode }) => (
                  <Link to={`/tag/${createSlug(tag.name)}`}>
                    <Badge 
                      key={tag.id}
                      variant={getTagVariant(tag.count) as any}
                      className="hover:bg-primary/80 transition-colors"
                      style={{ fontSize: `${getFontSize(tag.count)}rem` }}
                    >
                      {children}
                    </Badge>
                  </Link>
                )
            : ({ children }: { children: React.ReactNode }) => (
                <Badge 
                  key={tag.id}
                  variant={getTagVariant(tag.count) as any}
                  style={{ fontSize: `${getFontSize(tag.count)}rem` }}
                >
                  {children}
                </Badge>
              );
          
          return (
            <TagComponent key={tag.id}>
              {tag.name} {tag.count > 0 && <span className="text-xs ml-1 opacity-70">({tag.count})</span>}
            </TagComponent>
          );
        })}
      </div>
    </div>
  );
}

function TagCloudSkeleton() {
  return (
    <div className="mb-10">
      <Skeleton className="h-8 w-40 mb-4" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 15 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export default TagCloud;
