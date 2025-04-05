
import { Star, Truck } from 'lucide-react';
import { CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeatureDisplay } from '@/components/service/FeatureDisplay';
import { BusinessTags } from '@/components/service/BusinessTags';
import { Alternative } from '@/assets/data';

interface AlternativeCardContentProps {
  alternative: Alternative;
}

export function AlternativeCardContent({ alternative }: AlternativeCardContentProps) {
  return (
    <CardContent className="pt-4">
      <CardDescription className="line-clamp-2 min-h-[40px]">
        {alternative.description}
      </CardDescription>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center text-sm">
          <Star className="w-4 h-4 text-amber-500 mr-1" />
          <span className="font-medium">{alternative.likes.toLocaleString()}</span>
          <span className="text-muted-foreground ml-1">likes</span>
        </div>
        
        {alternative.deliveryOptions?.includes('Home Delivery') && (
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 text-xs">
            <Truck className="w-3 h-3" />
            Delivery
          </Badge>
        )}
      </div>
      
      {Array.isArray(alternative.features) && alternative.features.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {alternative.features.slice(0, 2).map((feature, i) => (
            <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
              <FeatureDisplay feature={feature} />
            </span>
          ))}
          {alternative.features.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{alternative.features.length - 2}
            </Badge>
          )}
        </div>
      )}
      
      {/* Show tags */}
      {alternative.tags && alternative.tags.length > 0 && (
        <BusinessTags 
          business={alternative} 
          className="mt-2" 
          limit={3} 
          showIcon={false}
        />
      )}
    </CardContent>
  );
}

export default AlternativeCardContent;
