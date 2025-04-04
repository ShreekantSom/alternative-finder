import { useState } from 'react';
import { Heart, Plus, Check, ListPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { wishlistService, Wishlist } from '@/lib/wishlistService';
import { AuthService } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

interface WishlistButtonProps {
  businessId: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export function WishlistButton({ businessId, variant = "outline", size = "default" }: WishlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false);
  const [userWishlists, setUserWishlists] = useState<Wishlist[]>([]);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleOpenWishlistMenu = async () => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/auth', { state: { from: window.location.pathname } });
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.userId);
      
      if (error) {
        console.error("Error fetching wishlists from Supabase:", error);
        const result = await wishlistService.getUserWishlists(user.userId);
        if (result.success && result.data) {
          setUserWishlists(result.data);
        }
      } else {
        const transformedData = data.map(list => ({
          id: list.id,
          name: list.name,
          description: list.description || '',
          isPublic: list.is_public,
          userId: list.user_id,
          items: []
        }));
        
        setUserWishlists(transformedData);
      }
    } catch (error) {
      console.error("Error fetching wishlists:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddToWishlist = async (wishlistId: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: wishlistId,
          business_id: businessId,
          notes: notes
        });
      
      if (error) {
        console.error("Error adding to wishlist in Supabase:", error);
        const result = await wishlistService.addItemToWishlist(wishlistId, businessId, notes);
        if (result.success) {
          setIsAddDialogOpen(false);
          setNotes('');
          toast({
            title: "Added to Wishlist",
            description: "Business has been added to your wishlist"
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add to wishlist",
            variant: "destructive"
          });
        }
      } else {
        setIsAddDialogOpen(false);
        setNotes('');
        toast({
          title: "Added to Wishlist",
          description: "Business has been added to your wishlist"
        });
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateWishlist = async () => {
    if (!newListName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your wishlist",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    const user = AuthService.getCurrentUser();
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          name: newListName,
          description: newListDescription,
          is_public: false,
          user_id: user.userId
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating wishlist in Supabase:", error);
        const result = await wishlistService.createWishlist(user.userId, newListName, newListDescription);
        if (result.success && result.data) {
          setUserWishlists([...userWishlists, result.data]);
          setIsNewListDialogOpen(false);
          setNewListName('');
          setNewListDescription('');
          
          await wishlistService.addItemToWishlist(result.data.id, businessId, notes);
          
          toast({
            title: "Wishlist Created",
            description: `${newListName} created and business added`
          });
          
          setIsAddDialogOpen(false);
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create wishlist",
            variant: "destructive"
          });
        }
      } else {
        const newWishlist = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          isPublic: data.is_public,
          userId: data.user_id,
          items: []
        };
        
        setUserWishlists([...userWishlists, newWishlist]);
        setIsNewListDialogOpen(false);
        setNewListName('');
        setNewListDescription('');
        
        await supabase
          .from('wishlist_items')
          .insert({
            wishlist_id: data.id,
            business_id: businessId,
            notes: notes
          });
        
        toast({
          title: "Wishlist Created",
          description: `${newListName} created and business added`
        });
        
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating wishlist:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={variant} 
            size={size}
            onClick={handleOpenWishlistMenu}
            disabled={isLoading}
          >
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Add to wishlist</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {userWishlists.length > 0 ? (
            userWishlists.map((list) => (
              <DropdownMenuItem 
                key={list.id}
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Heart className="w-4 h-4 mr-2" />
                {list.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No wishlists found</DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsNewListDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create new wishlist
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Wishlist</DialogTitle>
            <DialogDescription>
              Add this business to one of your wishlists. You can also add optional notes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="wishlist">Select Wishlist</Label>
              {userWishlists.map((list) => (
                <div key={list.id} className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleAddToWishlist(list.id)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {list.name}
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this business..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsNewListDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> New Wishlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isNewListDialogOpen} onOpenChange={setIsNewListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Wishlist</DialogTitle>
            <DialogDescription>
              Create a new collection of businesses you're interested in.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Wishlist Name</Label>
              <Input
                id="name"
                placeholder="e.g. My Favorite Restaurants"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a description for your wishlist..."
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewListDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateWishlist} 
              disabled={isLoading || !newListName.trim()}
            >
              {isLoading ? "Creating..." : "Create & Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default WishlistButton;
