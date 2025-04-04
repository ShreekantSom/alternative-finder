
import { Category } from "@/assets/data";

interface ServiceResult {
  success: boolean;
  data?: Category | Category[] | any;
  error?: string;
}

class CategoryService {
  async getAllCategories(): Promise<ServiceResult> {
    try {
      const { categories } = await import('@/assets/data');
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: 'Failed to load categories'
      };
    }
  }

  async getCategoryById(id: string): Promise<ServiceResult> {
    try {
      const { categories } = await import('@/assets/data');
      
      // First try direct ID match
      let category = categories.find(cat => cat.id === id);
      
      // If not found, try name match
      if (!category) {
        category = categories.find(cat => 
          cat.name.toLowerCase() === id.toLowerCase() ||
          this.createSlug(cat.name) === id.toLowerCase()
        );
      }
      
      if (category) {
        return {
          success: true,
          data: category
        };
      } else {
        return {
          success: false,
          error: 'Category not found'
        };
      }
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      return {
        success: false,
        error: 'Failed to load category'
      };
    }
  }
  
  // Add the missing methods
  async deleteCategory(id: string): Promise<ServiceResult> {
    try {
      // In a real app with a database, we would delete the category here
      // For this demo, we'll simulate a successful delete
      return {
        success: true,
        data: { id }
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        error: 'Failed to delete category'
      };
    }
  }

  async updateCategory(
    id: string, 
    categoryData: { name: string; icon: string; count: number }
  ): Promise<ServiceResult> {
    try {
      // In a real app with a database, we would update the category here
      // For this demo, we'll simulate a successful update
      return {
        success: true,
        data: {
          id,
          ...categoryData
        }
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        error: 'Failed to update category'
      };
    }
  }

  async createCategory(
    categoryData: { name: string; icon: string; count: number }
  ): Promise<ServiceResult> {
    try {
      // In a real app with a database, we would create the category here
      // For this demo, we'll simulate a successful creation with a random ID
      const id = Math.random().toString(36).substring(2, 9);
      return {
        success: true,
        data: {
          id,
          ...categoryData
        }
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        error: 'Failed to create category'
      };
    }
  }
  
  // Helper function to create URL-friendly slug from a string
  createSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove consecutive hyphens
      .trim();
  }
}

export const categoryService = new CategoryService();
