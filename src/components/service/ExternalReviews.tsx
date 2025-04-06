
import { Star, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExternalReview {
  source: string;
  rating: number;
  count: number;
  url: string;
  verified: boolean;
}

interface ExternalReviewsProps {
  reviews?: ExternalReview[];
  serviceName?: string; // Make this optional to maintain compatibility
}

export function ExternalReviews({ reviews, serviceName }: ExternalReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-400/50 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">External Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
              <div className="flex items-center mb-2 sm:mb-0">
                <div className="mr-4">
                  <h3 className="font-medium text-lg">{review.source}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm">{review.rating.toFixed(1)}/5 ({review.count} reviews)</span>
                  </div>
                </div>
                {review.verified && (
                  <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                    Verified
                  </Badge>
                )}
              </div>
              <a 
                href={review.url} 
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center text-primary hover:underline mt-2 sm:mt-0"
              >
                <span className="mr-1">Read reviews</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExternalReviews;
