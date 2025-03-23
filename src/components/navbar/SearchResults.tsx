
import { Alternative } from "@/assets/data";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResultsProps {
  results: Alternative[];
  onItemSelect: (alternative: Alternative) => void;
}

export function SearchResults({ results, onItemSelect }: SearchResultsProps) {
  if (!results.length) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
      <ScrollArea className="max-h-[300px]">
        <div className="p-2">
          <div className="flex justify-between items-center px-2 py-1 text-xs text-muted-foreground">
            <span>Search Results</span>
            <span>{results.length} found</span>
          </div>
          
          <div className="space-y-1">
            {results.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={() => onItemSelect(item)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.description.substring(0, 60)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="ml-2 text-xs">
                  {item.category}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default SearchResults;
