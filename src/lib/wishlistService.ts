
import { AuthService } from './auth';
import { toast } from "@/components/ui/use-toast";

// Wishlist interfaces
export interface WishlistItem {
  businessId: string;
  dateAdded: string;
  notes?: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  shareableLink?: string;
}

const WISHLISTS_STORAGE_KEY = 'alternative_app_wishlists';

// Initialize wishlists if not present
const initWishlists = (): void => {
  if (!localStorage.getItem(WISHLISTS_STORAGE_KEY)) {
    localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Call initialization
initWishlists();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const wishlistService = {
  getUserWishlists: async (userId: string): Promise<ServiceResult<Wishlist[]>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      
      const wishlistsJson = localStorage.getItem(WISHLISTS_STORAGE_KEY);
      const allWishlists: Wishlist[] = wishlistsJson ? JSON.parse(wishlistsJson) : [];
      
      const userWishlists = allWishlists.filter(list => list.userId === userId);
      
      return { success: true, data: userWishlists };
    } catch (error) {
      console.error('Failed to get user wishlists:', error);
      return { success: false, error: 'Failed to load wishlists' };
    }
  },
  
  getWishlistById: async (wishlistId: string): Promise<ServiceResult<Wishlist>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const wishlistsJson = localStorage.getItem(WISHLISTS_STORAGE_KEY);
      const allWishlists: Wishlist[] = wishlistsJson ? JSON.parse(wishlistsJson) : [];
      
      const wishlist = allWishlists.find(list => list.id === wishlistId);
      
      if (!wishlist) {
        return { success: false, error: 'Wishlist not found' };
      }
      
      // Check if the wishlist is public or belongs to the current user
      const currentUser = AuthService.getCurrentUser();
      if (!wishlist.isPublic && (!currentUser || currentUser.userId !== wishlist.userId)) {
        return { success: false, error: 'You do not have permission to view this wishlist' };
      }
      
      return { success: true, data: wishlist };
    } catch (error) {
      console.error('Failed to get wishlist:', error);
      return { success: false, error: 'Failed to load wishlist' };
    }
  },
  
  createWishlist: async (userId: string, name: string, description?: string): Promise<ServiceResult<Wishlist>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const wishlistsJson = localStorage.getItem(WISHLISTS_STORAGE_KEY);
      const allWishlists: Wishlist[] = wishlistsJson ? JSON.parse(wishlistsJson) : [];
      
      const newWishlist: Wishlist = {
        id: `wishlist-${Date.now()}`,
        userId,
        name,
        description,
        items: [],
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      allWishlists.push(newWishlist);
      localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify(allWishlists));
      
      toast({
        title: "Wishlist Created",
        description: `Your wishlist "${name}" has been created`
      });
      
      return { success: true, data: newWishlist };
    } catch (error) {
      console.error('Failed to create wishlist:', error);
      return { success: false, error: 'Failed to create wishlist' };
    }
  },
  
  updateWishlist: async (wishlistId: string, updates: {
    name?: string;
    description?: string;
    isPublic?: boolean;
  }): Promise<ServiceResult<Wishlist>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const wishlistsJson = localStorage.getItem(WISHLISTS_STORAGE_KEY);
      const allWishlists: Wishlist[] = wishlistsJson ? JSON.parse(wishlistsJson) : [];
      
      const wishlistIndex = allWishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex === -1) {
        return { success: false, error: 'Wishlist not found' };
      }
      
      // Check if the current user owns this wishlist
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser || currentUser.userId !== allWishlists[wishlistIndex].userId) {
        return { success: false, error: 'You do not have permission to update this wishlist' };
      }
      
      allWishlists[wishlistIndex] = {
        ...allWishlists[wishlistIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // If making the wishlist public, generate a shareable link
      if (updates.isPublic === true && !allWishlists[wishlistIndex].shareableLink) {
        allWishlists[wishlistIndex].shareableLink = `${window.location.origin}/shared-wishlist/${wishlistId}`;
      }
      
      localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify(allWishlists));
      
      toast({
        title: "Wishlist Updated",
        description: `Your wishlist has been updated successfully`
      });
      
      return { success: true, data: allWishlists[wishlistIndex] };
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      return { success: false, error: 'Failed to update wishlist' };
    }
  },
  
  deleteWishlist: async (wishlistId: string): Promise<ServiceResult<void>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const wishlistsJson = localStorage.getItem(WISHLISTS_STORAGE_KEY);
      const allWishlists: Wishlist[] = wishlistsJson ? JSON.parse(wishlistsJson) : [];
      
      const wishlistIndex = allWishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex === -1) {
        return { success: false, error: 'Wishlist not found' };
      }
      
      // Check if the current user owns this wishlist
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser || currentUser.userId !== allWishlists[wishlistIndex].userId) {
        return { success: false, error: 'You do not have permission to delete this wishlist' };
      }
      
      allWishlists.splice(wishlistIndex, 1);
      localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify(allWishlists));
      
      toast({
        title: "Wishlist Deleted",
        description: `Your wishlist has been deleted successfully`
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete wishlist:', error);
      return { success: false, error: 'Failed to delete wishlist' };
    }
  },
  
  addItemToWishlist: async (wishlistId: string, businessId: string, notes?: string): Promise<ServiceResult<Wishlist>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const wishlistsJson = localStorage.getItem(WISHLISTS_STORAGE_KEY);
      const allWishlists: Wishlist[] = wishlistsJson ? JSON.parse(wishlistsJson) : [];
      
      const wishlistIndex = allWishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex === -1) {
        return { success: false, error: 'Wishlist not found' };
      }
      
      // Check if the current user owns this wishlist
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser || currentUser.userId !== allWishlists[wishlistIndex].userId) {
        return { success: false, error: 'You do not have permission to update this wishlist' };
      }
      
      // Check if item already exists in the wishlist
      const itemExists = allWishlists[wishlistIndex].items.some(item => item.businessId === businessId);
      
      if (itemExists) {
        return { success: false, error: 'This business is already in your wishlist' };
      }
      
      // Add the item
      allWishlists[wishlistIndex].items.push({
        businessId,
        dateAdded: new Date().toISOString(),
        notes
      });
      
      allWishlists[wishlistIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify(allWishlists));
      
      toast({
        title: "Business Added",
        description: `Business added to ${allWishlists[wishlistIndex].name}`
      });
      
      return { success: true, data: allWishlists[wishlistIndex] };
    } catch (error) {
      console.error('Failed to add item to wishlist:', error);
      return { success: false, error: 'Failed to add business to wishlist' };
    }
  },
  
  removeItemFromWishlist: async (wishlistId: string, businessId: string): Promise<ServiceResult<Wishlist>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const wishlistsJson = localStorage.getItem(WISHLISTS_STORAGE_KEY);
      const allWishlists: Wishlist[] = wishlistsJson ? JSON.parse(wishlistsJson) : [];
      
      const wishlistIndex = allWishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex === -1) {
        return { success: false, error: 'Wishlist not found' };
      }
      
      // Check if the current user owns this wishlist
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser || currentUser.userId !== allWishlists[wishlistIndex].userId) {
        return { success: false, error: 'You do not have permission to update this wishlist' };
      }
      
      // Filter out the item
      allWishlists[wishlistIndex].items = allWishlists[wishlistIndex].items.filter(
        item => item.businessId !== businessId
      );
      
      allWishlists[wishlistIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify(allWishlists));
      
      toast({
        title: "Business Removed",
        description: `Business removed from ${allWishlists[wishlistIndex].name}`
      });
      
      return { success: true, data: allWishlists[wishlistIndex] };
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
      return { success: false, error: 'Failed to remove business from wishlist' };
    }
  }
};
