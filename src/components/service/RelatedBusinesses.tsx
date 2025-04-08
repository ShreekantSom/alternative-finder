
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alternative } from '@/assets/data';
import { Badge } from '@/components/ui/badge';
import BusinessTags from './BusinessTags';

interface RelatedBusinessesProps {
  businesses: Alternative[];
  isLoading: boolean;
  category: string;
}

export function RelatedBusinesses({ businesses, isLoading, category }: RelatedBusinessesProps) {
  if (isLoading) {
    return (
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Related Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle>More Businesses in {category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {businesses.map((business) => (
            <Link 
              key={business.id} 
              to={`/business/${business.id}`} 
              className="flex items-center space-x-4 p-3 rounded-md hover:bg-accent transition-colors"
            >
              <img 
                src={business.imageUrl} 
                alt={business.name} 
                className="w-12 h-12 object-contain rounded" 
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{business.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{business.description}</p>
                {business.tags && business.tags.length > 0 && (
                  <BusinessTags business={business} limit={2} showIcon={false} className="mt-1" />
                )}
              </div>
              <Badge variant="outline" className="capitalize">
                {business.pricing}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RelatedBusinesses;
