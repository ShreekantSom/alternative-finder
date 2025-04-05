
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Star, ThumbsUp, MessageSquare, Flag } from "lucide-react";
import { AuthService } from "@/lib/auth";

interface Review {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  userLiked?: boolean;
}

interface BusinessReviewsProps {
  businessId: string;
  businessName: string;
}

export function BusinessReviews({ businessId, businessName }: BusinessReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const user = AuthService.getCurrentUser();
  
  useEffect(() => {
    // Mock data - in a real app, fetch reviews from API
    const mockReviews: Review[] = [
      {
        id: "1",
        userId: "user1",
        username: "Alex Johnson",
        avatar: "",
        rating: 5,
        comment: "Excellent service! I've been using this for months and can't imagine switching to anything else.",
        date: "2025-03-15",
        likes: 12
      },
      {
        id: "2",
        userId: "user2",
        username: "Sam Taylor",
        avatar: "",
        rating: 4,
        comment: "Very good overall. There are a few features I wish they would add, but the customer service is excellent.",
        date: "2025-03-10",
        likes: 8
      },
      {
        id: "3",
        userId: "user3",
        username: "Jordan Lee",
        avatar: "",
        rating: 3,
        comment: "It's okay. Does what it says it does, but there are better options out there for the price.",
        date: "2025-03-05",
        likes: 3
      }
    ];
    
    setReviews(mockReviews);
  }, [businessId]);
  
  const handleRatingChange = (value: number) => {
    setRating(value);
  };
  
  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a review",
        variant: "destructive"
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive"
      });
      return;
    }
    
    if (!newReview.trim()) {
      toast({
        title: "Review required",
        description: "Please enter a review comment",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newReviewObj: Review = {
        id: `review-${Date.now()}`,
        userId: user.id || "current-user",
        username: user.email || "Current User",
        avatar: "",
        rating: rating,
        comment: newReview,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        userLiked: false
      };
      
      setReviews([newReviewObj, ...reviews]);
      setNewReview("");
      setRating(0);
      setIsSubmitting(false);
      
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your feedback!",
      });
    }, 1000);
  };
  
  const handleLikeReview = (reviewId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like reviews",
        variant: "destructive"
      });
      return;
    }
    
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        const liked = review.userLiked;
        return {
          ...review,
          likes: liked ? review.likes - 1 : review.likes + 1,
          userLiked: !liked
        };
      }
      return review;
    }));
  };
  
  const handleReportReview = (reviewId: string) => {
    toast({
      title: "Review reported",
      description: "Thank you for flagging this content. Our team will review it.",
    });
  };
  
  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle>Customer Reviews for {businessName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add a review section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Write a Review</h3>
            <div className="flex items-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      rating >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
              </span>
            </div>
            <Textarea
              placeholder={`Share your experience with ${businessName}...`}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <Button 
              onClick={handleSubmitReview} 
              disabled={isSubmitting}
            >
              Submit Review
            </Button>
          </div>
          
          {/* Reviews list */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Customer Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">
                No reviews yet. Be the first to share your experience!
              </p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} alt={review.username} />
                          <AvatarFallback>{review.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{review.username}</h4>
                          <div className="flex items-center space-x-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-2">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleLikeReview(review.id)}
                          className={`text-sm flex items-center ${
                            review.userLiked ? 'text-blue-500' : 'text-muted-foreground'
                          }`}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {review.likes}
                        </button>
                        <button 
                          onClick={() => handleReportReview(review.id)}
                          className="text-sm text-muted-foreground flex items-center"
                        >
                          <Flag className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-4">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BusinessReviews;
