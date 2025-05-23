import { Alternative } from '@/assets/data';
import { crawlCategories, fetchMoreAlternatives, searchAlternatives } from './crawler';
import { supabase } from '@/integrations/supabase/client';
import { mapPricing, createSlug, getExternalReviews, transformBusinessToAlternative } from './softwareUtils';
import { getMockAlternatives } from './mockData';

interface ServiceResult {
  success: boolean;
  data?: Alternative[] | Alternative | any;
  error?: string;
}

interface TransformedBusiness extends Omit<Alternative, 'externalReviews'> {
  externalReviews?: Array<{
    source: string;
    rating: number;
    count: number;
    url: string;
    verified: boolean;
  }>;
}

class SoftwareService {
  async getAllSoftware(): Promise<ServiceResult> {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching businesses from Supabase:', error);
        // Fallback to mock data if Supabase fails
        const mockAlternatives = getMockAlternatives();
        return {
          success: true,
          data: mockAlternatives
        };
      }
      
      if (data.length > 0) {
        // Transform Supabase data to match our Alternative interface
        const transformedData = data.map(business => transformBusinessToAlternative(business));
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // If no data is found in Supabase, fallback to mock data
        const mockAlternatives = getMockAlternatives();
        return {
          success: true,
          data: mockAlternatives
        };
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      return {
        success: false,
        error: 'Failed to load businesses'
      };
    }
  }

  async getSoftwareByCategory(category: string): Promise<ServiceResult> {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('category_name', category)
        .order('name');
      
      if (error) {
        console.error('Error fetching businesses by category from Supabase:', error);
        // Fallback to mock data if Supabase fails
        const mockAlternatives = getMockAlternatives();
        const filteredAlternatives = mockAlternatives.filter(item => item.category === category);
        return {
          success: true,
          data: filteredAlternatives
        };
      }
      
      if (data.length > 0) {
        // Transform Supabase data to match our Alternative interface
        const transformedData = data.map(business => transformBusinessToAlternative(business));
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // If no data is found in Supabase, fallback to mock data
        const mockAlternatives = getMockAlternatives();
        const filteredAlternatives = mockAlternatives.filter(item => item.category === category);
        return {
          success: true,
          data: filteredAlternatives
        };
      }
    } catch (error) {
      console.error('Error fetching businesses by category:', error);
      return {
        success: false,
        error: 'Failed to load businesses by category'
      };
    }
  }

  async getSoftwareById(id: string) {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching business by ID from Supabase:', error);
        // Fallback to mock data if Supabase fails
        const mockAlternatives = getMockAlternatives();
        const software = mockAlternatives.find(item => item.id === id);
        
        if (software) {
          return {
            success: true,
            data: software
          };
        } else {
          return {
            success: false,
            error: "Business not found"
          };
        }
      }
      
      if (data) {
        // Transform to match our Alternative interface
        const transformedData = transformBusinessToAlternative(data);
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // If not found in Supabase, try fallback
        const mockAlternatives = getMockAlternatives();
        const software = mockAlternatives.find(item => item.id === id);
        
        if (software) {
          return {
            success: true,
            data: software
          };
        } else {
          return {
            success: false,
            error: "Business not found"
          };
        }
      }
    } catch (error) {
      console.error("Error fetching business by ID:", error);
      return {
        success: false,
        error: "Failed to load business"
      };
    }
  }

  async getSoftwareBySlug(slug: string) {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching business by slug from Supabase:', error);
        // Fallback to mock data if Supabase fails
        const mockAlternatives = getMockAlternatives();
        const software = mockAlternatives.find(item => createSlug(item.name) === slug);
        
        if (software) {
          const externalReviews = await getExternalReviews(software.id);
          const enhancedSoftware = {
            ...software,
            externalReviews
          };
          return {
            success: true,
            data: enhancedSoftware
          };
        } else {
          return {
            success: false,
            error: "Business not found"
          };
        }
      }
      
      if (data) {
        // Transform to match our Alternative interface with externalReviews
        const transformedData: TransformedBusiness = transformBusinessToAlternative(data);
        
        const externalReviews = await getExternalReviews(data.id);
        transformedData.externalReviews = externalReviews;
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // If not found in Supabase, try fallback
        const mockAlternatives = getMockAlternatives();
        const software = mockAlternatives.find(item => createSlug(item.name) === slug);
        
        if (software) {
          const externalReviews = await getExternalReviews(software.id);
          const enhancedSoftware = {
            ...software,
            externalReviews
          };
          return {
            success: true,
            data: enhancedSoftware
          };
        } else {
          return {
            success: false,
            error: "Business not found"
          };
        }
      }
    } catch (error) {
      console.error("Error fetching business by slug:", error);
      return {
        success: false,
        error: "Failed to load business"
      };
    }
  }

  async getCategories() {
    return crawlCategories();
  }

  async getMoreAlternatives(page: number = 2, category?: string) {
    return fetchMoreAlternatives(page, category);
  }

  async searchSoftware(query: string) {
    return searchAlternatives(query);
  }

  async createSoftware(newService: Omit<Alternative, 'id'>): Promise<ServiceResult> {
    try {
      // Create slug from name
      const slug = createSlug(newService.name);
      
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          name: newService.name,
          slug: slug,
          description: newService.description,
          short_description: newService.description.substring(0, 100) + '...',
          image_url: newService.imageUrl,
          logo_url: newService.imageUrl,
          category_name: newService.category,
          website_url: newService.url,
          founded_year: new Date().getFullYear(),
          rating: 4.0,
          reviews_count: newService.likes || 0,
          is_new: true,
          available_pincodes: [],
          pricing: newService.pricing
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating business in Supabase:', error);
        
        // Fallback for demo
        const newId = (Math.floor(Math.random() * 1000) + 1).toString();
        
        const newBusiness = {
          id: newId,
          ...newService
        };
        
        return {
          success: true,
          data: newBusiness
        };
      }
      
      // Transform to match our Alternative interface
      const transformedData = transformBusinessToAlternative(data);
      
      return {
        success: true,
        data: transformedData
      };
    } catch (error) {
      console.error('Error creating business:', error);
      return {
        success: false,
        error: 'Failed to create business'
      };
    }
  }

  async updateSoftware(id: string, updatedService: Partial<Alternative>): Promise<ServiceResult> {
    try {
      // Create updates object based on what's provided
      const updates: any = {};
      
      if (updatedService.name) {
        updates.name = updatedService.name;
        updates.slug = createSlug(updatedService.name);
      }
      
      if (updatedService.description) {
        updates.description = updatedService.description;
        updates.short_description = updatedService.description.substring(0, 100) + '...';
      }
      
      if (updatedService.category) {
        updates.category_name = updatedService.category;
      }

      if (updatedService.subcategory) {
        updates.subcategory = updatedService.subcategory;
      }
      
      if (updatedService.imageUrl) {
        updates.image_url = updatedService.imageUrl;
        updates.logo_url = updatedService.imageUrl;
      }
      
      if (updatedService.url) {
        updates.website_url = updatedService.url;
      }
      
      if (updatedService.likes !== undefined) {
        updates.reviews_count = updatedService.likes;
      }

      if (updatedService.tags) {
        updates.tags = updatedService.tags;
      }
      
      updates.updated_at = new Date();
      
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating business in Supabase:', error);
        
        // Fallback to mock data if Supabase fails
        const { alternatives } = await import('@/assets/data');
        const existingService = alternatives.find(service => service.id === id);
        
        if (!existingService) {
          return {
            success: false,
            error: 'Business not found'
          };
        }
        
        // Create an updated version
        const updatedBusiness = {
          ...existingService,
          ...updatedService
        };
        
        return {
          success: true,
          data: updatedBusiness
        };
      }
      
      // Transform to match our Alternative interface
      const transformedData = transformBusinessToAlternative(data);
      
      return {
        success: true,
        data: transformedData
      };
    } catch (error) {
      console.error('Error updating business:', error);
      return {
        success: false,
        error: 'Failed to update business'
      };
    }
  }

  async deleteSoftware(id: string): Promise<ServiceResult> {
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting business from Supabase:', error);
        
        // Fallback for demo
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
      console.error('Error deleting business:', error);
      return {
        success: false,
        error: 'Failed to delete business'
      };
    }
  }

  async getSoftwareWithExternalReviews(id: string) {
    const result = await this.getSoftwareById(id);
    
    if (result.success && result.data) {
      const externalReviews = await getExternalReviews(id);
      return {
        ...result,
        data: {
          ...result.data,
          externalReviews
        }
      };
    }
    
    return result;
  }

  async getSoftwareByTag(tag: string): Promise<ServiceResult> {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .contains('tags', [tag])
        .order('name');
      
      if (error) {
        console.error('Error fetching businesses by tag from Supabase:', error);
        // Fallback to mock data if Supabase fails
        const mockAlternatives = getMockAlternatives();
        const filteredAlternatives = mockAlternatives.filter(item => 
          item.tags && item.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
        return {
          success: true,
          data: filteredAlternatives
        };
      }
      
      if (data.length > 0) {
        // Transform Supabase data to match our Alternative interface
        const transformedData = data.map(business => transformBusinessToAlternative(business));
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // If no data is found in Supabase, fallback to mock data
        const mockAlternatives = getMockAlternatives();
        const filteredAlternatives = mockAlternatives.filter(item => 
          item.tags && item.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
        return {
          success: true,
          data: filteredAlternatives
        };
      }
    } catch (error) {
      console.error('Error fetching businesses by tag:', error);
      return {
        success: false,
        error: 'Failed to load businesses by tag'
      };
    }
  }

  async getSoftwareBySubcategory(subcategory: string): Promise<ServiceResult> {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('subcategory', subcategory)
        .order('name');
      
      if (error) {
        console.error('Error fetching businesses by subcategory from Supabase:', error);
        // Fallback to mock data if Supabase fails
        const mockAlternatives = getMockAlternatives();
        const filteredAlternatives = mockAlternatives.filter(item => 
          item.subcategory && item.subcategory.toLowerCase() === subcategory.toLowerCase()
        );
        return {
          success: true,
          data: filteredAlternatives
        };
      }
      
      if (data.length > 0) {
        // Transform Supabase data to match our Alternative interface
        const transformedData = data.map(business => transformBusinessToAlternative(business));
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // If no data is found in Supabase, fallback to mock data
        const mockAlternatives = getMockAlternatives();
        const filteredAlternatives = mockAlternatives.filter(item => 
          item.subcategory && item.subcategory.toLowerCase() === subcategory.toLowerCase()
        );
        return {
          success: true,
          data: filteredAlternatives
        };
      }
    } catch (error) {
      console.error('Error fetching businesses by subcategory:', error);
      return {
        success: false,
        error: 'Failed to load businesses by subcategory'
      };
    }
  }

  async searchTagsAndSubcategories(query: string): Promise<ServiceResult> {
    try {
      // In a real app, this would query the database for tags and subcategories
      // For now, we'll return some mock data
      const mockTags = [
        { id: 'tag1', name: 'Fast Delivery', count: 12 },
        { id: 'tag2', name: 'Low Fees', count: 8 },
        { id: 'tag3', name: 'Free Shipping', count: 15 },
        { id: 'tag4', name: 'Premium Support', count: 5 },
        { id: 'tag5', name: 'Student Discount', count: 9 },
        { id: 'tag6', name: 'Free Trial', count: 14 },
        { id: 'tag7', name: 'Eco-Friendly', count: 7 }
      ];
      
      const mockSubcategories = [
        { id: 'sub1', name: 'Music Streaming', parentCategory: 'Entertainment' },
        { id: 'sub2', name: 'Video Streaming', parentCategory: 'Entertainment' },
        { id: 'sub3', name: 'Food Ordering', parentCategory: 'Food Delivery' },
        { id: 'sub4', name: 'Meal Preparation', parentCategory: 'Meal Kits' },
        { id: 'sub5', name: 'Banking', parentCategory: 'BFSI' },
        { id: 'sub6', name: 'Insurance', parentCategory: 'BFSI' },
        { id: 'sub7', name: 'Investing', parentCategory: 'BFSI' },
        { id: 'sub8', name: 'Music Labels', parentCategory: 'Entertainment' },
        { id: 'sub9', name: 'Cinema Chains', parentCategory: 'Entertainment' }
      ];
      
      const filteredTags = mockTags.filter(tag => 
        tag.name.toLowerCase().includes(query.toLowerCase())
      );
      
      const filteredSubcategories = mockSubcategories.filter(sub => 
        sub.name.toLowerCase().includes(query.toLowerCase()) || 
        sub.parentCategory.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        success: true,
        data: {
          tags: filteredTags,
          subcategories: filteredSubcategories
        }
      };
    } catch (error) {
      console.error('Error searching tags and subcategories:', error);
      return {
        success: false,
        error: 'Failed to search tags and subcategories'
      };
    }
  }

  async checkPincodeAvailability(serviceId: string, pincode: string): Promise<boolean> {
    try {
      const result = await this.getSoftwareById(serviceId);
      if (result.success && result.data) {
        // In a real app, this would check against the business's available pincodes
        // For demo purposes, we'll simulate with simple logic
        const service = result.data as Alternative;
        if (service.availablePincodes) {
          return service.availablePincodes.includes(pincode);
        }
        // Default to available if no pincodes are specified
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking pincode availability:", error);
      return false;
    }
  }
}

export const softwareService = new SoftwareService();
