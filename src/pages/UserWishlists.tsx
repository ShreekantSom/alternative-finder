import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import { wishlistService, Wishlist } from '@/lib/wishlistService';
import { softwareService } from '@/lib/softwareService';
import { Alternative } from '@/assets/data';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Heart, 
  Plus, 
  Trash2, 
  Pencil, 
  Share2, 
  ExternalLink, 
  Globe, 
  Lock, 
  Copy 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlternativeCard from '@/components/AlternativeCard';
import { Skeleton } from '@/components/ui/skeleton';

export interface WishlistItem {
  businessId: string;
  dateAdded: string;
  notes?: string;
}

export function UserWishlists() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessesData, setBusinessesData] = useState<Record<string, Alternative>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [newWishlistDesc, setNewWishlistDesc] = useState('');
  const [tabValue, setTabValue] = useState('all-wishlists');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const user = AuthService.getCurrentUser();
      
      if (!user) {
        navigate('/auth', { state: { from: '/wishlists' } });
        return;
      }
      
      fetchWishlists(user.userId);
    };
    
    checkAuth();
  }, [navigate]);
  
  const fetchWishlists = async (userId: string) => {
    setLoading(true);
    try {
      const result = await wishlistService.getUserWishlists(userId);
      if (result.success && result.data) {
        setWishlists(result.data);
        
        if (result.data.length > 0) {
          setSelectedWishlist(result.data[0]);
          fetchBusinessesData(result.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      toast({
        title: "Error",
        description: "Failed to load your wishlists",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchBusinessesData = async (wishlist: Wishlist) => {
    setLoading(true);
    try {
      const businessIds = wishlist.items.map(item => item.businessId);
      const businessData: Record<string, Alternative> = {};
      
      for (const id of businessIds) {
        if (!businessesData[id]) {
          const result = await softwareService.getSoftwareById(id);
          if (result.success && result.data) {
            businessData[id] = result.data;
          }
        }
      }
      
      setBusinessesData(prev => ({...prev, ...businessData}));
    } catch (error) {
      console.error("Error fetching business data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateWishlist = async () => {
    const user = AuthService.getCurrentUser();
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!newWishlistName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your wishlist",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await wishlistService.createWishlist(user.userId, newWishlistName, newWishlistDesc);
      if (result.success && result.data) {
        setWishlists([...wishlists, result.data]);
        setSelectedWishlist(result.data);
        setIsCreateDialogOpen(false);
        setNewWishlistName('');
        setNewWishlistDesc('');
        
        toast({
          title: "Wishlist Created",
          description: `${newWishlistName} has been created`
        });
      }
    } catch (error) {
      console.error("Error creating wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to create wishlist",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateWishlist = async () => {
    if (!selectedWishlist) return;
    
    try {
      const result = await wishlistService.updateWishlist(selectedWishlist.id, {
        name: newWishlistName || selectedWishlist.name,
        description: newWishlistDesc,
      });
      
      if (result.success && result.data) {
        setWishlists(wishlists.map(list => 
          list.id === selectedWishlist.id ? result.data : list
        ));
        setSelectedWishlist(result.data);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteWishlist = async (wishlistId: string) => {
    if (!confirm("Are you sure you want to delete this wishlist?")) {
      return;
    }
    
    try {
      const result = await wishlistService.deleteWishlist(wishlistId);
      if (result.success) {
        const updatedWishlists = wishlists.filter(list => list.id !== wishlistId);
        setWishlists(updatedWishlists);
        
        if (selectedWishlist?.id === wishlistId) {
          if (updatedWishlists.length > 0) {
            setSelectedWishlist(updatedWishlists[0]);
            fetchBusinessesData(updatedWishlists[0]);
          } else {
            setSelectedWishlist(null);
          }
        }
      }
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to delete wishlist",
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveFromWishlist = async (businessId: string) => {
    if (!selectedWishlist) return;
    
    try {
      const result = await wishlistService.removeItemFromWishlist(selectedWishlist.id, businessId);
      if (result.success && result.data) {
        setWishlists(wishlists.map(list => 
          list.id === selectedWishlist.id ? result.data : list
        ));
        setSelectedWishlist(result.data);
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove business from wishlist",
        variant: "destructive"
      });
    }
  };
  
  const toggleWishlistVisibility = async () => {
    if (!selectedWishlist) return;
    
    try {
      const result = await wishlistService.updateWishlist(selectedWishlist.id, {
        isPublic: !selectedWishlist.isPublic
      });
      
      if (result.success && result.data) {
        setWishlists(wishlists.map(list => 
          list.id === selectedWishlist.id ? result.data : list
        ));
        setSelectedWishlist(result.data);
        
        toast({
          title: result.data.isPublic ? "Wishlist Made Public" : "Wishlist Made Private",
          description: result.data.isPublic 
            ? "Others can now view this wishlist with the share link" 
            : "This wishlist is now private"
        });
      }
    } catch (error) {
      console.error("Error updating wishlist visibility:", error);
    }
  };
  
  const copyShareLink = () => {
    if (!selectedWishlist?.shareableLink) return;
    
    navigator.clipboard.writeText(selectedWishlist.shareableLink)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Share link copied to clipboard"
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive"
        });
      });
  };
  
  const openEditDialog = (wishlist: Wishlist) => {
    setNewWishlistName(wishlist.name);
    setNewWishlistDesc(wishlist.description || '');
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlists</h1>
            <p className="text-muted-foreground">Create and manage collections of businesses you're interested in</p>
          </div>
          
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Wishlist
          </Button>
        </div>
        
        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all-wishlists">All Wishlists</TabsTrigger>
            {selectedWishlist && (
              <TabsTrigger value="view-wishlist">{selectedWishlist.name}</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="all-wishlists">
            {loading && wishlists.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border rounded-lg p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : wishlists.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No wishlists yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first wishlist to start saving businesses you're interested in
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Wishlist
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlists.map((wishlist) => (
                  <Card key={wishlist.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-primary" />
                          {wishlist.name}
                        </CardTitle>
                        {wishlist.isPublic ? (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <CardDescription>
                        {wishlist.items.length} businesses • Updated {new Date(wishlist.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {wishlist.description && <p className="text-sm">{wishlist.description}</p>}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedWishlist(wishlist);
                          fetchBusinessesData(wishlist);
                          setTabValue('view-wishlist');
                        }}
                      >
                        View Details
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(wishlist)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteWishlist(wishlist.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="view-wishlist">
            {selectedWishlist && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold">{selectedWishlist.name}</h2>
                      {selectedWishlist.isPublic ? (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    {selectedWishlist.description && (
                      <p className="text-muted-foreground mb-2">{selectedWishlist.description}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(selectedWishlist.createdAt).toLocaleDateString()}
                      {' • '}
                      Updated {new Date(selectedWishlist.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={toggleWishlistVisibility}>
                      {selectedWishlist.isPublic ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Share2 className="mr-2 h-4 w-4" />
                          Make Public
                        </>
                      )}
                    </Button>
                    
                    {selectedWishlist.isPublic && selectedWishlist.shareableLink && (
                      <Button variant="outline" onClick={copyShareLink}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Share Link
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(selectedWishlist)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteWishlist(selectedWishlist.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-8">
                  {selectedWishlist.items.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg">
                      <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No businesses saved yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start exploring and add businesses to this wishlist
                      </p>
                      <Button onClick={() => navigate('/')}>
                        Explore Businesses
                      </Button>
                    </div>
                  ) : loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map(i => (
                        <Card key={i}>
                          <Skeleton className="h-40 w-full" />
                          <CardHeader>
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedWishlist.items.map((item, idx) => {
                        const businessData = businessesData[item.businessId];
                        return businessData ? (
                          <AlternativeCard 
                            key={item.businessId} 
                            alternative={businessData} 
                            index={idx} 
                          />
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Create Wishlist Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Wishlist</DialogTitle>
              <DialogDescription>
                Create a new collection of businesses you're interested in.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="create-name">Wishlist Name</Label>
                <Input
                  id="create-name"
                  placeholder="e.g. My Favorite Restaurants"
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-description">Description (Optional)</Label>
                <Textarea
                  id="create-description"
                  placeholder="Add a description for your wishlist..."
                  value={newWishlistDesc}
                  onChange={(e) => setNewWishlistDesc(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateWishlist} 
                disabled={!newWishlistName.trim()}
              >
                Create Wishlist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Wishlist Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Wishlist</DialogTitle>
              <DialogDescription>
                Update your wishlist details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Wishlist Name</Label>
                <Input
                  id="edit-name"
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Add a description for your wishlist..."
                  value={newWishlistDesc}
                  onChange={(e) => setNewWishlistDesc(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpdateWishlist} 
                disabled={!newWishlistName.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default UserWishlists;
