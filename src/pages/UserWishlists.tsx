
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, Plus, Heart, Copy, Lock, Globe, Trash, Pencil, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Alternative } from '@/assets/data';
import { softwareService } from '@/lib/softwareService';
import { wishlistService, Wishlist, WishlistItem } from '@/lib/wishlistService';
import { AuthService } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default function UserWishlists() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  const [businesses, setBusinesses] = useState<Record<string, Alternative>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false);
  const [isEditingWishlist, setIsEditingWishlist] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [newWishlistDescription, setNewWishlistDescription] = useState('');
  const [editedWishlistName, setEditedWishlistName] = useState('');
  const [editedWishlistDescription, setEditedWishlistDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [activeTab, setActiveTab] = useState('my-wishlists');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id: sharedWishlistId } = useParams<{ id?: string }>();

  useEffect(() => {
    const checkAuth = () => {
      const user = AuthService.getCurrentUser();
      if (!user && !sharedWishlistId) {
        navigate('/auth', { state: { from: '/wishlists' } });
        return false;
      }
      return true;
    };

    const fetchWishlists = async () => {
      setIsLoading(true);
      try {
        if (!checkAuth() && !sharedWishlistId) return;

        if (sharedWishlistId) {
          setActiveTab('shared-wishlist');
          const result = await wishlistService.getWishlistById(sharedWishlistId);
          if (result.success && result.data) {
            setSelectedWishlist(result.data);
            await loadBusinessesForWishlist(result.data);
          } else {
            toast({
              title: "Error",
              description: "Shared wishlist not found or is private",
              variant: "destructive",
            });
            navigate('/');
          }
        } else {
          const user = AuthService.getCurrentUser();
          if (user) {
            const result = await wishlistService.getUserWishlists(user.userId);
            if (result.success && result.data) {
              setWishlists(result.data);
              if (result.data.length > 0) {
                setSelectedWishlist(result.data[0]);
                await loadBusinessesForWishlist(result.data[0]);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching wishlists:", error);
        toast({
          title: "Error",
          description: "Failed to load wishlists",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlists();
  }, [navigate, toast, sharedWishlistId]);

  const loadBusinessesForWishlist = async (wishlist: Wishlist) => {
    const newBusinesses = { ...businesses };
    const unloadedBusinessIds = wishlist.items
      .map(item => item.businessId)
      .filter(id => !newBusinesses[id]);

    if (unloadedBusinessIds.length === 0) return;

    try {
      const promises = unloadedBusinessIds.map(async (id) => {
        const result = await softwareService.getSoftwareById(id);
        if (result.success && result.data) {
          return { id, data: result.data };
        }
        return null;
      });

      const results = await Promise.all(promises);
      results.forEach(result => {
        if (result) {
          newBusinesses[result.id] = result.data as Alternative;
        }
      });

      setBusinesses(newBusinesses);
    } catch (error) {
      console.error("Error loading businesses:", error);
    }
  };

  const handleSelectWishlist = async (wishlist: Wishlist) => {
    setSelectedWishlist(wishlist);
    await loadBusinessesForWishlist(wishlist);
  };

  const handleCreateWishlist = async () => {
    if (!newWishlistName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const result = await wishlistService.createWishlist(
        user.userId, 
        newWishlistName, 
        newWishlistDescription
      );

      if (result.success && result.data) {
        setWishlists([...wishlists, result.data]);
        setSelectedWishlist(result.data);
        setNewWishlistName('');
        setNewWishlistDescription('');
        setIsCreatingWishlist(false);
        toast({
          title: "Success",
          description: "Wishlist created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create wishlist",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating wishlist:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleUpdateWishlist = async () => {
    if (!selectedWishlist) return;
    
    if (!editedWishlistName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const updates = {
        name: editedWishlistName,
        description: editedWishlistDescription,
        isPublic
      };

      const result = await wishlistService.updateWishlist(
        selectedWishlist.id,
        updates
      );

      if (result.success && result.data) {
        // Update local state
        const updatedWishlists = wishlists.map(wl => 
          wl.id === result.data.id ? result.data : wl
        );
        setWishlists(updatedWishlists);
        setSelectedWishlist(result.data);
        setIsEditingWishlist(false);
        toast({
          title: "Success",
          description: "Wishlist updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update wishlist",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWishlist = async () => {
    if (!selectedWishlist) return;
    
    try {
      const result = await wishlistService.deleteWishlist(selectedWishlist.id);

      if (result.success) {
        const updatedWishlists = wishlists.filter(wl => wl.id !== selectedWishlist.id);
        setWishlists(updatedWishlists);
        setSelectedWishlist(updatedWishlists.length > 0 ? updatedWishlists[0] : null);
        toast({
          title: "Success",
          description: "Wishlist deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete wishlist",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!selectedWishlist) return;
    
    try {
      const result = await wishlistService.removeItemFromWishlist(
        selectedWishlist.id,
        itemId
      );

      if (result.success && result.data) {
        // Update local state
        const updatedWishlists = wishlists.map(wl => 
          wl.id === result.data.id ? result.data : wl
        );
        setWishlists(updatedWishlists);
        setSelectedWishlist(result.data);
        toast({
          title: "Success",
          description: "Item removed from wishlist",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleShareLink = () => {
    if (!selectedWishlist?.shareableLink) return;
    
    navigator.clipboard.writeText(selectedWishlist.shareableLink);
    toast({
      title: "Link copied",
      description: "Shareable link copied to clipboard",
    });
  };

  const handleEditClick = () => {
    if (!selectedWishlist) return;
    
    setEditedWishlistName(selectedWishlist.name);
    setEditedWishlistDescription(selectedWishlist.description || '');
    setIsPublic(selectedWishlist.isPublic);
    setIsEditingWishlist(true);
  };

  const renderWishlistItem = (item: WishlistItem) => {
    const business = businesses[item.businessId];
    
    if (!business) {
      return (
        <div key={item.businessId} className="animate-pulse p-4 border rounded">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      );
    }
    
    return (
      <Card key={item.businessId} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex-shrink-0">
              <img 
                src={business.imageUrl} 
                alt={business.name} 
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{business.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{business.description}</p>
                  <span className="text-xs bg-secondary px-2 py-1 rounded inline-block mt-1">{business.category}</span>
                </div>
                {!sharedWishlistId && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveItem(item.businessId)}
                  >
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
              
              {item.notes && (
                <div className="mt-2 text-sm border-l-2 border-primary pl-2 italic">
                  {item.notes}
                </div>
              )}
              
              <div className="mt-2">
                <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                  <Link to={`/business/${item.businessId}`}>
                    View Business
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading wishlists...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {sharedWishlistId ? (
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        ) : null}
        
        <Tabs defaultValue="my-wishlists" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              {!sharedWishlistId && (
                <TabsTrigger value="my-wishlists" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  My Wishlists
                </TabsTrigger>
              )}
              {sharedWishlistId && (
                <TabsTrigger value="shared-wishlist" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Shared Wishlist
                </TabsTrigger>
              )}
            </TabsList>
            
            {!sharedWishlistId && (
              <Button onClick={() => setIsCreatingWishlist(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Wishlist
              </Button>
            )}
          </div>
          
          {!sharedWishlistId && (
            <TabsContent value="my-wishlists" className="space-y-8">
              {wishlists.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Wishlists Yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first wishlist to save businesses you're interested in.</p>
                  <Button onClick={() => setIsCreatingWishlist(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Create Wishlist
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 space-y-4">
                    <h2 className="text-xl font-semibold mb-4">My Wishlists</h2>
                    {wishlists.map(wishlist => (
                      <div 
                        key={wishlist.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedWishlist?.id === wishlist.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                        onClick={() => handleSelectWishlist(wishlist)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{wishlist.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {wishlist.items.length} businesses
                            </p>
                          </div>
                          {wishlist.isPublic && (
                            <div className="text-xs bg-secondary px-2 py-1 rounded flex items-center">
                              <Globe className="h-3 w-3 mr-1" /> Public
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="md:col-span-2">
                    {selectedWishlist ? (
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h2 className="text-2xl font-bold">{selectedWishlist.name}</h2>
                            {selectedWishlist.description && (
                              <p className="text-muted-foreground mt-1">{selectedWishlist.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleEditClick}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </Button>
                            {selectedWishlist.isPublic && (
                              <Button variant="outline" size="sm" onClick={handleShareLink}>
                                <Copy className="h-4 w-4 mr-2" /> Share
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {selectedWishlist.items.length === 0 ? (
                          <div className="text-center py-12 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">This wishlist is empty. Add businesses by clicking the "Save" button on business pages.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {selectedWishlist.items.map(item => renderWishlistItem(item))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">Select a wishlist to view its contents</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          )}
          
          {sharedWishlistId && (
            <TabsContent value="shared-wishlist" className="space-y-8">
              {selectedWishlist ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedWishlist.name}</h2>
                      {selectedWishlist.description && (
                        <p className="text-muted-foreground mt-1">{selectedWishlist.description}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">Shared by: User {selectedWishlist.userId.substring(0, 8)}</p>
                    </div>
                  </div>
                  
                  {selectedWishlist.items.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">This wishlist is empty.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedWishlist.items.map(item => renderWishlistItem(item))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">This shared wishlist doesn't exist or is private</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
        
        {/* Create Wishlist Dialog */}
        <Dialog open={isCreatingWishlist} onOpenChange={setIsCreatingWishlist}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Wishlist</DialogTitle>
              <DialogDescription>
                Create a new collection of businesses you're interested in.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Wishlist Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. My Favorite Restaurants"
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for your wishlist..."
                  value={newWishlistDescription}
                  onChange={(e) => setNewWishlistDescription(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingWishlist(false)}>Cancel</Button>
              <Button onClick={handleCreateWishlist}>Create Wishlist</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Wishlist Dialog */}
        <Dialog open={isEditingWishlist} onOpenChange={setIsEditingWishlist}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Wishlist</DialogTitle>
              <DialogDescription>
                Update your wishlist details and privacy settings.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Wishlist Name</Label>
                <Input
                  id="edit-name"
                  value={editedWishlistName}
                  onChange={(e) => setEditedWishlistName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  value={editedWishlistDescription}
                  onChange={(e) => setEditedWishlistDescription(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public">Make Public</Label>
                  <p className="text-sm text-muted-foreground">
                    Public wishlists can be shared with others.
                  </p>
                </div>
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center">
              <Button 
                variant="destructive" 
                type="button"
                onClick={handleDeleteWishlist}
              >
                Delete Wishlist
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditingWishlist(false)}>Cancel</Button>
                <Button onClick={handleUpdateWishlist}>Save Changes</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
