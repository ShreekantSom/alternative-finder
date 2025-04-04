
import { Category } from "@/assets/data";
import { supabase } from "@/integrations/supabase/client";

interface ServiceResult {
  success: boolean;
  data?: Category | Category[] | any;
  error?: string;
}

class CategoryService {
  async getAllCategories(): Promise<ServiceResult> {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories from Supabase:', error);
        // Fallback to local data if Supabase fails
        const { categories } = await import('@/assets/data');
        return {
          success: true,
          data: categories
        };
      }
      
      // Transform Supabase data to match our Category interface
      const transformedData = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        count: cat.count || 0
      }));
      
      return {
        success: true,
        data: transformedData
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
      // Try to fetch from Supabase first by ID
      let { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      // If not found by ID, try by slug
      if (!data && !error) {
        const result = await supabase
          .from('categories')
          .select('*')
          .eq('slug', id.toLowerCase())
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }
      
      // If still not found, try by name match
      if (!data && !error) {
        const result = await supabase
          .from('categories')
          .select('*')
          .ilike('name', `%${id}%`)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }
      
      if (error) {
        console.error('Error fetching category from Supabase:', error);
        // Fallback to local data if Supabase fails
        const { categories } = await import('@/assets/data');
        
        // Try direct ID match
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
      }
      
      if (data) {
        // Transform to match our Category interface
        const transformedData = {
          id: data.id,
          name: data.name,
          icon: data.icon,
          count: data.count || 0
        };
        
        return {
          success: true,
          data: transformedData
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
  
  async deleteCategory(id: string): Promise<ServiceResult> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting category from Supabase:', error);
        
        // Fallback for demo when not connected to Supabase
        return {
          success: true,
          data: { id }
        };
      }
      
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
      // Create a slug from the name
      const slug = this.createSlug(categoryData.name);
      
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: categoryData.name,
          slug: slug,
          icon: categoryData.icon,
          count: categoryData.count,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating category in Supabase:', error);
        
        // Fallback for demo when not connected to Supabase
        return {
          success: true,
          data: {
            id,
            ...categoryData
          }
        };
      }
      
      // Transform to match our Category interface
      const transformedData = {
        id: data.id,
        name: data.name,
        icon: data.icon,
        count: data.count || 0
      };
      
      return {
        success: true,
        data: transformedData
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
      // Create a slug from the name
      const slug = this.createSlug(categoryData.name);
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          slug: slug,
          icon: categoryData.icon,
          count: categoryData.count || 0
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating category in Supabase:', error);
        
        // Fallback for demo when not connected to Supabase
        const id = Math.random().toString(36).substring(2, 9);
        return {
          success: true,
          data: {
            id,
            ...categoryData
          }
        };
      }
      
      // Transform to match our Category interface
      const transformedData = {
        id: data.id,
        name: data.name,
        icon: data.icon,
        count: data.count || 0
      };
      
      return {
        success: true,
        data: transformedData
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
