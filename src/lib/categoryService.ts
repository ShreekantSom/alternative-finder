
import { Category } from '@/assets/data';
import { AuthService } from './auth';
import { toast } from "@/components/ui/use-toast";

const CATEGORIES_STORAGE_KEY = 'alternative_app_categories';

// Initialize with some default categories
const initCategories = (): void => {
  if (!localStorage.getItem(CATEGORIES_STORAGE_KEY)) {
    // Use the categories from crawler.ts
    const storedCategories = [
      { id: 'all', name: 'All Categories', icon: 'layers', count: 8641 },
      { id: 'business-finance', name: 'Business & Finance', icon: 'briefcase', count: 568 },
      { id: 'communication', name: 'Communication', icon: 'message-circle', count: 523 },
      { id: 'development', name: 'Development', icon: 'code', count: 1245 },
      { id: 'education-reference', name: 'Education & Reference', icon: 'graduation-cap', count: 412 },
      { id: 'games-entertainment', name: 'Games & Entertainment', icon: 'gamepad-2', count: 897 },
      { id: 'home-lifestyle', name: 'Home & Lifestyle', icon: 'landmark', count: 376 },
      { id: 'multimedia', name: 'Multimedia', icon: 'image', count: 743 },
      { id: 'music-audio', name: 'Music & Audio', icon: 'music', count: 489 },
      { id: 'network-internet', name: 'Network & Internet', icon: 'globe', count: 652 },
      { id: 'productivity', name: 'Productivity', icon: 'briefcase', count: 712 },
      { id: 'security-privacy', name: 'Security & Privacy', icon: 'shield', count: 387 },
      { id: 'system-utilities', name: 'System & Utilities', icon: 'wrench', count: 603 },
      { id: 'design-photo', name: 'Design & Photo', icon: 'paintbrush', count: 432 },
    ];
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(storedCategories));
  }
};

// Call initialization
initCategories();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const categoryService = {
  getAllCategories: async (): Promise<ServiceResult<Category[]>> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const categories: Category[] = categoriesJson ? JSON.parse(categoriesJson) : [];
      
      return { success: true, data: categories };
    } catch (error) {
      console.error('Failed to get categories:', error);
      return { success: false, error: 'Failed to load categories' };
    }
  },
  
  getCategoryById: async (id: string): Promise<ServiceResult<Category>> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const categories: Category[] = categoriesJson ? JSON.parse(categoriesJson) : [];
      
      const category = categories.find(c => c.id === id);
      if (!category) {
        return { success: false, error: 'Category not found' };
      }
      
      return { success: true, data: category };
    } catch (error) {
      console.error('Failed to get category:', error);
      return { success: false, error: 'Failed to load category' };
    }
  },
  
  createCategory: async (categoryData: Omit<Category, 'id'>): Promise<ServiceResult<Category>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const categories: Category[] = categoriesJson ? JSON.parse(categoriesJson) : [];
      
      // Generate a unique ID
      const id = `category-${Date.now()}`;
      
      const newCategory: Category = {
        id,
        name: categoryData.name,
        icon: categoryData.icon,
        count: categoryData.count || 0,
      };
      
      categories.push(newCategory);
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      
      return { success: true, data: newCategory };
    } catch (error) {
      console.error('Failed to create category:', error);
      return { success: false, error: 'Failed to create category' };
    }
  },
  
  updateCategory: async (id: string, categoryData: Partial<Omit<Category, 'id'>>): Promise<ServiceResult<Category>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const categories: Category[] = categoriesJson ? JSON.parse(categoriesJson) : [];
      
      const categoryIndex = categories.findIndex(c => c.id === id);
      if (categoryIndex === -1) {
        return { success: false, error: 'Category not found' };
      }
      
      // Update category
      categories[categoryIndex] = {
        ...categories[categoryIndex],
        ...categoryData,
      };
      
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      
      return { success: true, data: categories[categoryIndex] };
    } catch (error) {
      console.error('Failed to update category:', error);
      return { success: false, error: 'Failed to update category' };
    }
  },
  
  deleteCategory: async (id: string): Promise<ServiceResult<void>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const categories: Category[] = categoriesJson ? JSON.parse(categoriesJson) : [];
      
      // Find category index
      const categoryIndex = categories.findIndex(c => c.id === id);
      if (categoryIndex === -1) {
        return { success: false, error: 'Category not found' };
      }
      
      // Prevent deleting "All Categories"
      if (id === 'all') {
        return { success: false, error: 'Cannot delete "All Categories"' };
      }
      
      // Remove category
      categories.splice(categoryIndex, 1);
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete category:', error);
      return { success: false, error: 'Failed to delete category' };
    }
  },

  // For crawler integration
  updateCategoryCount: async (categoryId: string, newCount: number): Promise<void> => {
    try {
      const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const categories: Category[] = categoriesJson ? JSON.parse(categoriesJson) : [];
      
      const categoryIndex = categories.findIndex(c => c.id === categoryId);
      if (categoryIndex !== -1) {
        categories[categoryIndex].count = newCount;
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      }
    } catch (error) {
      console.error('Failed to update category count:', error);
      toast({
        title: "Error",
        description: "Failed to update category count",
        variant: "destructive",
      });
    }
  }
};
