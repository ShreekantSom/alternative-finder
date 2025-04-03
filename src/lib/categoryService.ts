import { Category } from '@/assets/data';
import { AuthService } from './auth';
import { toast } from "@/components/ui/use-toast";

const CATEGORIES_STORAGE_KEY = 'alternative_app_categories';
const SUBCATEGORIES_STORAGE_KEY = 'alternative_app_subcategories';

// Define subcategory interface
interface Subcategory {
  id: string;
  name: string;
  parentCategoryId: string;
  count?: number;
}

// Initialize with some default categories
const initCategories = (): void => {
  if (!localStorage.getItem(CATEGORIES_STORAGE_KEY)) {
    // Use the categories from crawler.ts
    const storedCategories = [
      { id: 'all', name: 'All Categories', icon: 'layers', count: 8641 },
      { id: 'business-finance', name: 'Business & Finance', icon: 'briefcase', count: 568 },
      { id: 'communication', name: 'Communication', icon: 'message-circle', count: 523 },
      { id: 'technology', name: 'Technology', icon: 'code', count: 1245 },
      { id: 'education-reference', name: 'Education & Reference', icon: 'graduation-cap', count: 412 },
      { id: 'entertainment', name: 'Entertainment', icon: 'gamepad-2', count: 897 },
      { id: 'home-lifestyle', name: 'Home & Lifestyle', icon: 'landmark', count: 376 },
      { id: 'fashion-apparel', name: 'Fashion & Apparel', icon: 'shirt', count: 743 },
      { id: 'food-beverages', name: 'Food & Beverages', icon: 'utensils', count: 489 },
      { id: 'health-wellness', name: 'Health & Wellness', icon: 'heart-pulse', count: 652 },
      { id: 'travel-hospitality', name: 'Travel & Hospitality', icon: 'plane', count: 712 },
      { id: 'automotive', name: 'Automotive', icon: 'car', count: 387 },
      { id: 'sports-fitness', name: 'Sports & Fitness', icon: 'dumbbell', count: 603 },
      { id: 'beauty-personal-care', name: 'Beauty & Personal Care', icon: 'scissors', count: 432 },
      { id: 'electronics', name: 'Electronics', icon: 'smartphone', count: 567 },
      { id: 'pets', name: 'Pets', icon: 'dog', count: 289 },
      { id: 'art-crafts', name: 'Art & Crafts', icon: 'palette', count: 341 },
      { id: 'books-media', name: 'Books & Media', icon: 'book', count: 418 },
      { id: 'baby-kids', name: 'Baby & Kids', icon: 'baby', count: 325 },
    ];
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(storedCategories));
  }

  // Initialize subcategories if not present
  if (!localStorage.getItem(SUBCATEGORIES_STORAGE_KEY)) {
    const initialSubcategories: Subcategory[] = [
      // Business & Finance
      { id: 'banking', name: 'Banking', parentCategoryId: 'business-finance' },
      { id: 'insurance', name: 'Insurance', parentCategoryId: 'business-finance' },
      { id: 'investment', name: 'Investment', parentCategoryId: 'business-finance' },
      { id: 'accounting', name: 'Accounting', parentCategoryId: 'business-finance' },
      { id: 'consulting', name: 'Consulting', parentCategoryId: 'business-finance' },
      
      // Technology
      { id: 'software', name: 'Software', parentCategoryId: 'technology' },
      { id: 'hardware', name: 'Hardware', parentCategoryId: 'technology' },
      { id: 'cloud-services', name: 'Cloud Services', parentCategoryId: 'technology' },
      { id: 'cybersecurity', name: 'Cybersecurity', parentCategoryId: 'technology' },
      { id: 'ai-ml', name: 'AI & Machine Learning', parentCategoryId: 'technology' },
      
      // Fashion & Apparel
      { id: 'clothing', name: 'Clothing', parentCategoryId: 'fashion-apparel' },
      { id: 'footwear', name: 'Footwear', parentCategoryId: 'fashion-apparel' },
      { id: 'accessories', name: 'Accessories', parentCategoryId: 'fashion-apparel' },
      { id: 'jewelry', name: 'Jewelry', parentCategoryId: 'fashion-apparel' },
      { id: 'luxury', name: 'Luxury', parentCategoryId: 'fashion-apparel' },
      
      // Health & Wellness
      { id: 'fitness', name: 'Fitness', parentCategoryId: 'health-wellness' },
      { id: 'nutrition', name: 'Nutrition', parentCategoryId: 'health-wellness' },
      { id: 'mental-health', name: 'Mental Health', parentCategoryId: 'health-wellness' },
      { id: 'meditation', name: 'Meditation', parentCategoryId: 'health-wellness' },
      { id: 'healthcare', name: 'Healthcare', parentCategoryId: 'health-wellness' },
      
      // Food & Beverages
      { id: 'restaurants', name: 'Restaurants', parentCategoryId: 'food-beverages' },
      { id: 'cafes', name: 'Cafes', parentCategoryId: 'food-beverages' },
      { id: 'grocery', name: 'Grocery', parentCategoryId: 'food-beverages' },
      { id: 'specialty-food', name: 'Specialty Food', parentCategoryId: 'food-beverages' },
      { id: 'beverages', name: 'Beverages', parentCategoryId: 'food-beverages' },
    ];
    
    localStorage.setItem(SUBCATEGORIES_STORAGE_KEY, JSON.stringify(initialSubcategories));
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
  },
  
  // Subcategories methods
  getAllSubcategories: async (): Promise<ServiceResult<Subcategory[]>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const subcategoriesJson = localStorage.getItem(SUBCATEGORIES_STORAGE_KEY);
      const subcategories: Subcategory[] = subcategoriesJson ? JSON.parse(subcategoriesJson) : [];
      
      return { success: true, data: subcategories };
    } catch (error) {
      console.error('Failed to get subcategories:', error);
      return { success: false, error: 'Failed to load subcategories' };
    }
  },
  
  getSubcategoriesByCategoryId: async (categoryId: string): Promise<ServiceResult<Subcategory[]>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const subcategoriesJson = localStorage.getItem(SUBCATEGORIES_STORAGE_KEY);
      const subcategories: Subcategory[] = subcategoriesJson ? JSON.parse(subcategoriesJson) : [];
      
      const filteredSubcategories = subcategories.filter(sc => sc.parentCategoryId === categoryId);
      
      return { success: true, data: filteredSubcategories };
    } catch (error) {
      console.error('Failed to get subcategories by category:', error);
      return { success: false, error: 'Failed to load subcategories' };
    }
  },
  
  createSubcategory: async (subcategoryData: Omit<Subcategory, 'id'>): Promise<ServiceResult<Subcategory>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const subcategoriesJson = localStorage.getItem(SUBCATEGORIES_STORAGE_KEY);
      const subcategories: Subcategory[] = subcategoriesJson ? JSON.parse(subcategoriesJson) : [];
      
      // Generate a unique ID
      const id = `subcategory-${Date.now()}`;
      
      const newSubcategory: Subcategory = {
        id,
        name: subcategoryData.name,
        parentCategoryId: subcategoryData.parentCategoryId,
        count: 0
      };
      
      subcategories.push(newSubcategory);
      localStorage.setItem(SUBCATEGORIES_STORAGE_KEY, JSON.stringify(subcategories));
      
      return { success: true, data: newSubcategory };
    } catch (error) {
      console.error('Failed to create subcategory:', error);
      return { success: false, error: 'Failed to create subcategory' };
    }
  }
};

// Export the Subcategory interface
export type { Subcategory };
