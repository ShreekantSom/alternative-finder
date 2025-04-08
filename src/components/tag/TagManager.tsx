
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag as TagIcon, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Badge } from "@/components/ui/badge";
import { businessService } from '@/lib/businessService';
import { createSlug } from '@/lib/softwareUtils';

interface Tag {
  name: string;
  count: number;
}

interface TagManagerProps {
  businessId?: string;
  existingTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  readOnly?: boolean;
}

export function TagManager({ 
  businessId, 
  existingTags = [], 
  onTagsChange,
  readOnly = false
}: TagManagerProps) {
  const [tags, setTags] = useState<string[]>(existingTags);
  const [newTag, setNewTag] = useState('');
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Fetch popular tags for suggestions
  useEffect(() => {
    const fetchPopularTags = async () => {
      setIsLoading(true);
      try {
        // This would be a real API call in a production app
        // Here we're simulating popular tags
        const mockPopularTags: Tag[] = [
          { name: "Food Delivery", count: 24 },
          { name: "Restaurants", count: 18 },
          { name: "Ridesharing", count: 15 },
          { name: "Fast Service", count: 12 },
          { name: "Mobile App", count: 30 },
          { name: "Budget Friendly", count: 8 },
          { name: "Premium", count: 10 },
          { name: "Subscription", count: 22 }
        ];
        
        setPopularTags(mockPopularTags);
      } catch (error) {
        console.error("Error fetching popular tags:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPopularTags();
  }, []);
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
      
      if (onTagsChange) {
        onTagsChange(updatedTags);
      }
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    
    if (onTagsChange) {
      onTagsChange(updatedTags);
    }
  };
  
  const handleAddSuggestion = (suggestion: string) => {
    if (!tags.includes(suggestion)) {
      const updatedTags = [...tags, suggestion];
      setTags(updatedTags);
      
      if (onTagsChange) {
        onTagsChange(updatedTags);
      }
    }
  };
  
  const handleTagClick = (tag: string) => {
    navigate(`/tag/${createSlug(tag)}`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TagIcon className="w-5 h-5 mr-2" />
          {readOnly ? "Tags" : "Manage Tags"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {tag}
                  {!readOnly && (
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  {readOnly && (
                    <button 
                      onClick={() => handleTagClick(tag)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <span className="sr-only">View tag</span>
                    </button>
                  )}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No tags added yet</p>
            )}
          </div>
        </div>
        
        {!readOnly && (
          <>
            {/* Add new tag */}
            <div className="flex space-x-2 mb-4">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a new tag"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button 
                onClick={handleAddTag}
                size="sm"
                disabled={!newTag.trim() || tags.includes(newTag.trim())}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            {/* Tag suggestions */}
            <div>
              <p className="text-sm font-medium mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => handleAddSuggestion(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default TagManager;
