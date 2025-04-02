
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Star, Star as StarIcon, StarHalf, StarOff, MessageSquare, AlertCircle, ThumbsUp } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Review {
  id: string;
  userId: string;
  userName: string;
  serviceId: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
}

interface ServiceReviewsProps {
  serviceId: string;
  serviceName: string;
}

export function ServiceReviews({ serviceId, serviceName }: ServiceReviewsProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  // Mock reviews data
  useEffect(() => {
    // In a real app, this would be an API call to fetch reviews
    setTimeout(() => {
      const mockReviews = [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          serviceId,
          rating: 5,
          comment: "This service exceeded my expectations! Great customer support and very user-friendly interface.",
          date: '2023-10-15',
          helpfulCount: 12
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Jane Smith',
          serviceId,
          rating: 4,
          comment: "Really good service overall. The only thing I'd improve is the mobile experience, but desktop works flawlessly.",
          date: '2023-09-22',
          helpfulCount: 8
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Mike Johnson',
          serviceId,
          rating: 3,
          comment: "It's okay. Does what it promises, but nothing extraordinary. The pricing is reasonable though.",
          date: '2023-11-05',
          helpfulCount: 3
        }
      ];
      
      setReviews(mockReviews);
      
      // Calculate average rating
      const total = mockReviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(total / mockReviews.length);
      
      setIsLoading(false);
    }, 800);
  }, [serviceId]);

  const handleSubmitReview = () => {
    const user = AuthService.getCurrentUser();
    
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    
    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be an API call to submit the review
    const newReview = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.email.split('@')[0], // Simple way to get a username
      serviceId,
      rating: userRating,
      comment: userReview,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0
    };
    
    setReviews([newReview, ...reviews]);
    
    // Recalculate average
    const total = reviews.reduce((sum, review) => sum + review.rating, 0) + userRating;
    setAverageRating(total / (reviews.length + 1));
    
    // Reset form
    setUserReview('');
    setUserRating(0);
    
    toast({
      title: "Review submitted",
      description: "Thank you for sharing your feedback!",
    });
  };

  const markHelpful = (reviewId: string) => {
    const user = AuthService.getCurrentUser();
    
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    
    // In a real app, this would be an API call and would check if the user already marked this review
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpfulCount: review.helpfulCount + 1 } 
        : review
    ));
    
    toast({
      description: "You marked this review as helpful",
    });
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Reviews</h2>
          <p className="text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} for {serviceName}
          </p>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          {renderStarRating(averageRating)}
          <span className="ml-2 font-semibold">{averageRating.toFixed(1)}/5</span>
        </div>
      </div>

      {/* Write a review */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
          <CardDescription>Share your experience with this service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="mb-1">Your rating</p>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="mr-1"
                >
                  <StarIcon 
                    className={`h-6 w-6 ${
                      (hoverRating || userRating) >= star 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Write your review here... (optional)"
            value={userReview}
            onChange={e => setUserReview(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4 inline mr-1" />
            Your review will be public
          </div>
          <Button onClick={handleSubmitReview}>Submit Review</Button>
        </CardFooter>
      </Card>

      {showLoginAlert && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-8 flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-300">Please sign in</h4>
            <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
              You need to be logged in to submit reviews or mark reviews as helpful.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-700"
              onClick={() => {
                setShowLoginAlert(false);
                window.location.href = '/auth';
              }}
            >
              Sign In
            </Button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border border-border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>{review.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{review.userName}</h4>
                    <div className="flex items-center space-x-2 mt-0.5">
                      {renderStarRating(review.rating)}
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 text-muted-foreground hover:text-foreground"
                  onClick={() => markHelpful(review.id)}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" /> 
                  Helpful ({review.helpfulCount})
                </Button>
              </div>
              <p className="mt-3 text-gray-700 dark:text-gray-300">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No reviews yet</h3>
            <p className="text-muted-foreground">Be the first to share your experience with this service.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceReviews;
