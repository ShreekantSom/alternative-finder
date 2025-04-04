
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
