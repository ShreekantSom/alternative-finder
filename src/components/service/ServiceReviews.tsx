
import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Review {
  id: string;
  serviceId: string;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ServiceReviewsProps {
  serviceId: string;
  serviceName: string;
}

export default function ServiceReviews({ serviceId, serviceName }: ServiceReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const { toast } = useToast();
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    // Load reviews from localStorage
    const loadReviews = () => {
      const reviewsJson = localStorage.getItem('service_reviews');
      const allReviews: Review[] = reviewsJson ? JSON.parse(reviewsJson) : [];
      return allReviews.filter(review => review.serviceId === serviceId);
    };
    
    const serviceReviews = loadReviews();
    setReviews(serviceReviews);
    
    // Calculate average rating
    if (serviceReviews.length > 0) {
      const totalRating = serviceReviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(totalRating / serviceReviews.length);
    }
  }, [serviceId]);

  const handleRatingClick = (rating: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      return;
    }
    setUserRating(rating);
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      return;
    }

    if (userRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user has already reviewed this service
      const reviewsJson = localStorage.getItem('service_reviews');
      const allReviews: Review[] = reviewsJson ? JSON.parse(reviewsJson) : [];
      const existingReviewIndex = allReviews.findIndex(
        review => review.serviceId === serviceId && review.userId === user.id
      );

      const newReview: Review = {
        id: existingReviewIndex >= 0 ? allReviews[existingReviewIndex].id : `review-${Date.now()}`,
        serviceId,
        userId: user.id,
        userEmail: user.email,
        rating: userRating,
        comment: userComment,
        createdAt: existingReviewIndex >= 0 ? allReviews[existingReviewIndex].createdAt : new Date().toISOString(),
      };

      let updatedReviews: Review[];
      
      if (existingReviewIndex >= 0) {
        // Update existing review
        updatedReviews = allReviews.map((review, index) => 
          index === existingReviewIndex ? newReview : review
        );
        toast({
          title: "Review Updated",
          description: "Your review has been updated successfully",
        });
      } else {
        // Add new review
        updatedReviews = [...allReviews, newReview];
        toast({
          title: "Review Submitted",
          description: "Your review has been submitted successfully",
        });
      }

      // Save to localStorage
      localStorage.setItem('service_reviews', JSON.stringify(updatedReviews));
      
      // Update state
      const serviceReviews = updatedReviews.filter(review => review.serviceId === serviceId);
      setReviews(serviceReviews);
      
      // Recalculate average rating
      if (serviceReviews.length > 0) {
        const totalRating = serviceReviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(totalRating / serviceReviews.length);
      }
      
      // Clear form
      if (existingReviewIndex < 0) {
        setUserRating(0);
        setUserComment('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if the current user has already submitted a review
  const userReview = user && reviews.find(review => review.userId === user.id);
  
  useEffect(() => {
    if (userReview) {
      setUserRating(userReview.rating);
      setUserComment(userReview.comment);
    }
  }, [userReview]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="text-2xl font-bold mr-2">
            {averageRating > 0 ? averageRating.toFixed(1) : "No ratings yet"}
          </div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="ml-2 text-sm text-muted-foreground">
            ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
          </div>
        </div>
      </div>

      {user ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{userReview ? "Update Your Review" : "Write a Review"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Rating</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= userRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <Textarea
                placeholder="Share your experience with this service (optional)"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button 
              onClick={handleSubmitReview} 
              disabled={isSubmitting || userRating === 0}
            >
              {isSubmitting
                ? "Submitting..."
                : userReview
                  ? "Update Review"
                  : "Submit Review"
              }
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardContent className="py-6">
            <p className="text-center">
              Please sign in to leave a review.
            </p>
          </CardContent>
        </Card>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback>
                      {review.userEmail.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{review.userEmail}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <div className="mt-2">
                        {review.comment}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review {serviceName}!
          </p>
        </div>
      )}
    </div>
  );
}
