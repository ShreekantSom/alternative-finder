
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { BookmarkPlus, Plus, Edit, Trash2, Share2, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alternative } from "@/assets/data";

interface WishlistItem {
  id: string;
  business: Alternative;
  dateAdded: string;
  notes?: string;
}

interface Wishlist {
  id: string;
  name: string;
  description?: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdAt: string;
}

export function UserWishlist() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([
    {
      id: "1",
      name: "My Favorites",
      description: "All my favorite businesses",
      items: [
        {
          id: "item1",
          business: {
            id: "1",
            name: "DoorDash",
            description: "Food delivery platform connecting customers with local restaurants",
            category: "Food Delivery",
            likes: 120,
            imageUrl: "/images/doordash.png",
            url: "https://doordash.com",
            pricing: "Paid",
            platform: ["Web", "iOS", "Android"]
          },
          dateAdded: "2023-06-15T14:30:00Z"
        },
        {
          id: "item2",
          business: {
            id: "7",
            name: "Netflix",
            description: "Subscription streaming platform for movies and TV shows",
            category: "Streaming",
            likes: 180,
            imageUrl: "/images/netflix.png",
            url: "https://netflix.com",
            pricing: "Subscription",
            platform: ["Web", "iOS", "Android", "Smart TV"]
          },
          dateAdded: "2023-05-22T09:15:00Z",
          notes: "Great for movie nights!"
        }
      ],
      isPublic: true,
      createdAt: "2023-04-10T08:00:00Z"
    },
    {
      id: "2",
      name: "To Try Later",
      description: "Businesses I want to check out",
      items: [
        {
          id: "item3",
          business: {
            id: "6",
            name: "Lyft",
            description: "Ridesharing platform offering alternatives to traditional taxis",
            category: "Ride Sharing",
            likes: 125,
            imageUrl: "/images/lyft.png",
            url: "https://lyft.com",
            pricing: "Paid",
            platform: ["Web", "iOS", "Android"]
          },
          dateAdded: "2023-06-20T16:45:00Z",
          notes: "Compare prices with Uber"
        }
      ],
      isPublic: false,
      createdAt: "2023-05-15T11:30:00Z"
    }
  ]);
  
  const [newWishlist, setNewWishlist] = useState({
    name: "",
    description: ""
  });
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const handleCreateWishlist = () => {
    if (!newWishlist.name.trim()) {
      toast({
        title: "Error",
        description: "Wishlist name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newList: Wishlist = {
      id: `wishlist-${Date.now()}`,
      name: newWishlist.name,
      description: newWishlist.description,
      items: [],
      isPublic: false,
      createdAt: new Date().toISOString()
    };
    
    setWishlists([...wishlists, newList]);
    setNewWishlist({ name: "", description: "" });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Wishlist "${newWishlist.name}" created successfully`
    });
  };
  
  const handleDeleteWishlist = (id: string) => {
    setWishlists(wishlists.filter(list => list.id !== id));
    toast({
      title: "Success",
      description: "Wishlist deleted successfully"
    });
  };
  
  const handleRemoveFromWishlist = (wishlistId: string, itemId: string) => {
    setWishlists(wishlists.map(list => {
      if (list.id === wishlistId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId)
        };
      }
      return list;
    }));
    
    toast({
      title: "Success",
      description: "Item removed from wishlist"
    });
  };
  
  const handleToggleVisibility = (wishlistId: string) => {
    setWishlists(wishlists.map(list => {
      if (list.id === wishlistId) {
        return {
          ...list,
          isPublic: !list.isPublic
        };
      }
      return list;
    }));
    
    const wishlist = wishlists.find(list => list.id === wishlistId);
    
    toast({
      title: "Success",
      description: `Wishlist is now ${wishlist?.isPublic ? 'private' : 'public'}`
    });
  };
  
  const handleShareWishlist = (wishlistId: string) => {
    // In a real app, this would generate a shareable link
    const shareableLink = `https://yourdomain.com/wishlist/${wishlistId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast({
        title: "Link Copied",
        description: "Shareable link copied to clipboard"
      });
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Wishlists</h2>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Wishlist</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Wishlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="wishlist-name" className="text-sm font-medium">Wishlist Name</label>
                <Input 
                  id="wishlist-name"
                  value={newWishlist.name}
                  onChange={(e) => setNewWishlist({...newWishlist, name: e.target.value})}
                  placeholder="My Awesome Wishlist"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="wishlist-description" className="text-sm font-medium">Description (Optional)</label>
                <Input 
                  id="wishlist-description"
                  value={newWishlist.description}
                  onChange={(e) => setNewWishlist({...newWishlist, description: e.target.value})}
                  placeholder="A collection of my favorite businesses"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateWishlist}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {wishlists.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <BookmarkPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">No Wishlists Yet</h3>
          <p className="text-muted-foreground mb-6">Start saving your favorite businesses by creating a wishlist</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>Create Your First Wishlist</Button>
        </div>
      ) : (
        <Tabs defaultValue={wishlists[0].id} className="w-full">
          <TabsList className="mb-6 overflow-x-auto flex flex-nowrap w-full">
            {wishlists.map(list => (
              <TabsTrigger key={list.id} value={list.id} className="flex-shrink-0">
                {list.name} ({list.items.length})
              </TabsTrigger>
            ))}
          </TabsList>
          
          {wishlists.map(list => (
            <TabsContent key={list.id} value={list.id}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <CardTitle className="text-xl">{list.name}</CardTitle>
                      {list.description && (
                        <CardDescription>{list.description}</CardDescription>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        Created on {formatDate(list.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {list.isPublic ? 'Public' : 'Private'}
                        </span>
                        <Switch 
                          checked={list.isPublic} 
                          onCheckedChange={() => handleToggleVisibility(list.id)}
                        />
                      </div>
                      {list.isPublic && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleShareWishlist(list.id)}
                          title="Share Wishlist"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteWishlist(list.id)}
                        title="Delete Wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {list.items.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        This wishlist is empty. Add businesses from the business detail pages.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {list.items.map(item => (
                        <div key={item.id} className="flex items-start border-b border-border pb-4 last:border-0 last:pb-0">
                          <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 mr-4">
                            <img 
                              src={item.business.imageUrl} 
                              alt={item.business.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <h3 className="font-medium">
                                <a href={`/business/${item.business.id}`} className="hover:underline">
                                  {item.business.name}
                                </a>
                              </h3>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(item.dateAdded)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.business.category}</p>
                            {item.notes && (
                              <div className="mt-2 text-sm p-2 bg-muted rounded-md">
                                <p className="italic">{item.notes}</p>
                              </div>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-2 text-destructive" 
                            onClick={() => handleRemoveFromWishlist(list.id, item.id)}
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

export default UserWishlist;
