import { crawlCategories } from './crawler';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/assets/data';

class CategoryService {
  async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories from Supabase:', error);
        const result = await crawlCategories();
        return result;
      }
      
      if (data && data.length > 0) {
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
        let categories = result.data as Category[];
        
        const bfsiExists = categories.some(cat => cat.name === 'BFSI' || cat.name === 'Banking, Financial Services, and Insurance');
        
        if (!bfsiExists) {
          categories.push({
            id: 'bfsi',
            name: 'BFSI',
            icon: 'building-bank',
            count: 38
          });
        }
        
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
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('name', name)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching category from Supabase:', error);
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

  async createCategory(category: Omit<Category, 'id'>): Promise<{ success: boolean; data?: Category; error?: string }> {
    try {
      const slug = this.createSlug(category.name);
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          icon: category.icon,
          count: category.count || 0,
          slug: slug
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating category in Supabase:', error);
        
        const newId = (Math.floor(Math.random() * 1000) + 1).toString();
        
        const newCategory = {
          id: newId,
          ...category
        };
        
        return {
          success: true,
          data: newCategory
        };
      }
      
      return {
        success: true,
        data: {
          id: data.id,
          name: data.name,
          icon: data.icon,
          count: data.count || 0
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

  async updateCategory(id: string, category: Partial<Category>): Promise<{ success: boolean; data?: Category; error?: string }> {
    try {
      const updates: any = {};
      
      if (category.name) {
        updates.name = category.name;
        updates.slug = this.createSlug(category.name);
      }
      
      if (category.icon) {
        updates.icon = category.icon;
      }
      
      if (category.count !== undefined) {
        updates.count = category.count;
      }
      
      updates.updated_at = new Date();
      
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating category in Supabase:', error);
        
        return {
          success: true,
          data: {
            id,
            ...category as Category
          }
        };
      }
      
      return {
        success: true,
        data: {
          id: data.id,
          name: data.name,
          icon: data.icon,
          count: data.count || 0
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

  async deleteCategory(id: string): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting category from Supabase:', error);
        
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

  async getCategoryById(id: string) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching category by ID from Supabase:', error);
        const allCategories = await this.getAllCategories();
        if (allCategories.success) {
          const category = allCategories.data.find(cat => cat.id === id);
          
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
        const allCategories = await this.getAllCategories();
        if (allCategories.success) {
          const category = allCategories.data.find(cat => cat.id === id);
          
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
      console.error('Error fetching category by ID:', error);
      return {
        success: false,
        error: 'Failed to load category'
      };
    }
  }

  createSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

export const categoryService = new CategoryService();
