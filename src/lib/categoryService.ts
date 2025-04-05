
import { crawlCategories } from './crawler';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/assets/data';

class CategoryService {
  async getAllCategories() {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories from Supabase:', error);
        // Fallback to mock data
        const result = await crawlCategories();
        return result;
      }
      
      // Check if we have categories in Supabase
      if (data && data.length > 0) {
        // Map Supabase data to match our Category interface
        const transformedData = data.map(category => ({
          id: category.id,
          name: category.name,
          icon: category.icon,
          count: category.count || 0
        }));
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // If no data in Supabase, fetch from crawler
        const result = await crawlCategories();
        return result;
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: 'Failed to load categories'
      };
    }
  }

  async getExtendedCategories() {
    try {
      const result = await this.getAllCategories();
      
      if (result.success) {
        // Add BFSI category and other extended categories if they don't exist
        let categories = result.data as Category[];
        
        // Check if BFSI already exists
        const bfsiExists = categories.some(cat => cat.name === 'BFSI' || cat.name === 'Banking, Financial Services, and Insurance');
        
        if (!bfsiExists) {
          // Add BFSI category
          categories.push({
            id: 'bfsi',
            name: 'BFSI',
            icon: 'building-bank',
            count: 38
          });
        }
        
        // Check for other potentially missing categories
        const categoryNames = categories.map(cat => cat.name.toLowerCase());
        
        if (!categoryNames.includes('education') && !categoryNames.includes('e-learning')) {
          categories.push({
            id: 'education',
            name: 'Education',
            icon: 'book-open',
            count: 29
          });
        }
        
        if (!categoryNames.includes('healthcare')) {
          categories.push({
            id: 'healthcare',
            name: 'Healthcare',
            icon: 'heart-pulse',
            count: 33
          });
        }
        
        return {
          success: true,
          data: categories
        };
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching extended categories:', error);
      return {
        success: false,
        error: 'Failed to load categories'
      };
    }
  }

  async getCategoryByName(name: string) {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('name', name)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching category from Supabase:', error);
        // Fallback to mock data
        const allCategories = await this.getAllCategories();
        if (allCategories.success) {
          const category = allCategories.data.find(cat => 
            cat.name.toLowerCase() === name.toLowerCase()
          );
          
          if (category) {
            return {
              success: true,
              data: category
            };
          }
        }
        
        return {
          success: false,
          error: 'Category not found'
        };
      }
      
      if (data) {
        return {
          success: true,
          data: {
            id: data.id,
            name: data.name,
            icon: data.icon,
            count: data.count || 0
          }
        };
      } else {
        // Fallback to mock data
        const allCategories = await this.getAllCategories();
        if (allCategories.success) {
          const category = allCategories.data.find(cat => 
            cat.name.toLowerCase() === name.toLowerCase()
          );
          
          if (category) {
            return {
              success: true,
              data: category
            };
          }
        }
        
        return {
          success: false,
          error: 'Category not found'
        };
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      return {
        success: false,
        error: 'Failed to load category'
      };
    }
  }

  async searchCategories(query: string) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('name');
      
      if (error) {
        console.error('Error searching categories in Supabase:', error);
        // Fallback to mock data
        const allCategories = await this.getAllCategories();
        if (allCategories.success) {
          const filteredCategories = allCategories.data.filter(cat => 
            cat.name.toLowerCase().includes(query.toLowerCase())
          );
          
          return {
            success: true,
            data: filteredCategories
          };
        }
        
        return {
          success: false,
          error: 'Failed to search categories'
        };
      }
      
      if (data) {
        // Transform to match our Category interface
        const transformedData = data.map(category => ({
          id: category.id,
          name: category.name,
          icon: category.icon,
          count: category.count || 0
        }));
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // Fallback to mock data
        const allCategories = await this.getAllCategories();
        if (allCategories.success) {
          const filteredCategories = allCategories.data.filter(cat => 
            cat.name.toLowerCase().includes(query.toLowerCase())
          );
          
          return {
            success: true,
            data: filteredCategories
          };
        }
        
        return {
          success: false,
          error: 'Failed to search categories'
        };
      }
    } catch (error) {
      console.error('Error searching categories:', error);
      return {
        success: false,
        error: 'Failed to search categories'
      };
    }
  }

  async getSubcategories(categoryName: string) {
    try {
      // In a real app, this would query the database
      // For now, return mock data based on the category
      let subcategories = [];
      
      switch (categoryName.toLowerCase()) {
        case 'entertainment':
          subcategories = [
            { id: 'music-streaming', name: 'Music Streaming' },
            { id: 'video-streaming', name: 'Video Streaming' },
            { id: 'music-labels', name: 'Music Labels' },
            { id: 'cinema-chains', name: 'Cinema Chains' },
            { id: 'gaming', name: 'Gaming' }
          ];
          break;
        case 'food delivery':
          subcategories = [
            { id: 'restaurant-delivery', name: 'Restaurant Delivery' },
            { id: 'grocery-delivery', name: 'Grocery Delivery' },
            { id: 'meal-plans', name: 'Meal Plans' }
          ];
          break;
        case 'bfsi':
        case 'banking, financial services, and insurance':
          subcategories = [
            { id: 'banking', name: 'Banking' },
            { id: 'insurance', name: 'Insurance' },
            { id: 'investing', name: 'Investing' },
            { id: 'payment-processing', name: 'Payment Processing' },
            { id: 'lending', name: 'Lending' }
          ];
          break;
        case 'healthcare':
          subcategories = [
            { id: 'telemedicine', name: 'Telemedicine' },
            { id: 'pharmacy', name: 'Pharmacy' },
            { id: 'fitness', name: 'Fitness' },
            { id: 'mental-health', name: 'Mental Health' }
          ];
          break;
        default:
          subcategories = [];
      }
      
      return {
        success: true,
        data: subcategories
      };
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return {
        success: false,
        error: 'Failed to load subcategories'
      };
    }
  }
}

export const categoryService = new CategoryService();
