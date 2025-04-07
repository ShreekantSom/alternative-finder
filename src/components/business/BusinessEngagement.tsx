
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function BusinessEngagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Engagement Tools</CardTitle>
          <CardDescription>
            Manage interactions with users interested in your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reviews">
            <TabsList className="mb-4">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="questions">Q&A</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reviews" className="space-y-4">
              <div className="space-y-4">
                {[
                  { 
                    id: 1, 
                    user: "Alex Thompson", 
                    rating: 4, 
                    date: "2023-11-15", 
                    content: "Great service with excellent features. The pricing is reasonable and the support team is responsive. Would recommend!", 
                    replied: false 
                  },
                  { 
                    id: 2, 
                    user: "Sam Wilson", 
                    rating: 5, 
                    date: "2023-10-22", 
                    content: "Absolutely love the product! It has streamlined our workflow and saved us countless hours. The UX is intuitive and clean.", 
                    replied: true,
                    replyContent: "Thank you for your kind words, Sam! We're thrilled to hear the product is working well for your team. Let us know if there's anything else we can help with!"
                  },
                  { 
                    id: 3, 
                    user: "Jordan Lee", 
                    rating: 3, 
                    date: "2023-09-30", 
                    content: "Decent offering but missing some key features. The interface could use some improvements and the pricing tiers are a bit confusing.", 
                    replied: false 
                  }
                ].map(review => (
                  <Card key={review.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex space-x-2 items-center">
                          <div className="font-medium">{review.user}</div>
                          <div className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</div>
                      </div>
                      <p>{review.content}</p>
                      
                      {review.replied && (
                        <div className="mt-3 pl-4 border-l-2 border-muted">
                          <p className="text-sm font-medium">Your response:</p>
                          <p className="text-sm">{review.replyContent}</p>
                        </div>
                      )}
                      
                      {!review.replied && (
                        <div className="mt-3">
                          <Textarea placeholder="Write a response to this review..." className="h-24" />
                          <div className="flex justify-end mt-2">
                            <Button size="sm">Post Response</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="questions" className="space-y-4">
              <div className="space-y-4">
                {[
                  { 
                    id: 1, 
                    user: "Taylor Kim", 
                    date: "2023-12-01", 
                    question: "Does your platform offer integration with Salesforce?", 
                    answered: false 
                  },
                  { 
                    id: 2, 
                    user: "Morgan Smith", 
                    date: "2023-11-25", 
                    question: "What kind of support do you offer for enterprise clients?", 
                    answered: true,
                    answer: "For our enterprise clients, we offer dedicated account management, 24/7 priority support, and custom integration services. We also provide personalized onboarding and training for your team."
                  }
                ].map(qa => (
                  <Card key={qa.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="font-medium">{qa.user}</div>
                        <div className="text-sm text-muted-foreground">{new Date(qa.date).toLocaleDateString()}</div>
                      </div>
                      <p className="font-medium">Q: {qa.question}</p>
                      
                      {qa.answered && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Your answer:</p>
                          <p>{qa.answer}</p>
                        </div>
                      )}
                      
                      {!qa.answered && (
                        <div className="mt-3">
                          <Textarea placeholder="Answer this question..." className="h-24" />
                          <div className="flex justify-end mt-2">
                            <Button size="sm">Post Answer</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Common Questions</CardTitle>
                  <CardDescription>
                    Add frequently asked questions to help users understand your business better
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="question">Question</Label>
                      <Input id="question" placeholder="Enter a common question" />
                    </div>
                    <div>
                      <Label htmlFor="answer">Answer</Label>
                      <Textarea id="answer" placeholder="Enter the answer" className="h-24" />
                    </div>
                    <Button>Add FAQ</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="offers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create Special Offer</CardTitle>
                  <CardDescription>
                    Create special promotions for users of this platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="offerTitle">Offer Title</Label>
                      <Input id="offerTitle" placeholder="e.g., 20% off for new customers" />
                    </div>
                    <div>
                      <Label htmlFor="offerDesc">Description</Label>
                      <Textarea id="offerDesc" placeholder="Describe your offer" className="h-24" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="couponCode">Coupon Code (Optional)</Label>
                      <Input id="couponCode" placeholder="e.g., SPECIAL20" />
                    </div>
                    <Button>Create Offer</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">New User Special: 15% Off</h3>
                          <p className="text-sm text-muted-foreground">Valid until Dec 31, 2023</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      <p className="mt-2">Get 15% off your first month with coupon code WELCOME15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="announcements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post Announcement</CardTitle>
                  <CardDescription>
                    Share news about product updates, features, or company milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="announcementTitle">Title</Label>
                      <Input id="announcementTitle" placeholder="e.g., New Feature Release" />
                    </div>
                    <div>
                      <Label htmlFor="announcementContent">Content</Label>
                      <Textarea id="announcementContent" placeholder="Describe your announcement" className="h-32" />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <div className="flex space-x-4 mt-1">
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="announcementType" defaultChecked />
                          <span>Feature Update</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="announcementType" />
                          <span>Company News</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="announcementType" />
                          <span>Maintenance Notice</span>
                        </label>
                      </div>
                    </div>
                    <Button>Publish Announcement</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">New API Documentation Released</h3>
                          <p className="text-sm text-muted-foreground">Posted on Nov 15, 2023</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </div>
                      </div>
                      <p className="mt-2">We've updated our API documentation to include new endpoints and improved examples...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default BusinessEngagement;
