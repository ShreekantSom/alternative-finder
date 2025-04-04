
import { Alternative } from '@/assets/data';
import { crawlCategories, fetchMoreAlternatives, searchAlternatives } from './crawler';
import { supabase } from '@/integrations/supabase/client';

interface ServiceResult {
  success: boolean;
  data?: Alternative[] | Alternative | any;
  error?: string;
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
        const { alternatives } = await import('@/assets/data');
        return {
          success: true,
          data: alternatives
        };
      }
      
      if (data.length > 0) {
        // Transform Supabase data to match our Alternative interface
        const transformedData = data.map(business => ({
          id: business.id,
          name: business.name,
          description: business.description,
          category: business.category_name,
          likes: business.reviews_count || 0,
          imageUrl: business.image_url || 'https://picsum.photos/200',
          url: business.website_url || 'https://example.com',
          pricing: 'Freemium', // Default value
          platform: ['Web'], // Default value
          availablePincodes: business.available_pincodes || []
        }));
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // If no data is found in Supabase, fallback to mock data
        const { alternatives } = await import('@/assets/data');
        return {
          success: true,
          data: alternatives
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
        const { alternatives } = await import('@/assets/data');
        const filteredAlternatives = alternatives.filter(item => item.category === category);
        return {
          success: true,
          data: filteredAlternatives
        };
      }
      
      if (data.length > 0) {
        // Transform Supabase data to match our Alternative interface
        const transformedData = data.map(business => ({
          id: business.id,
          name: business.name,
          description: business.description,
          category: business.category_name,
          likes: business.reviews_count || 0,
          imageUrl: business.image_url || 'https://picsum.photos/200',
          url: business.website_url || 'https://example.com',
          pricing: 'Freemium', // Default value
          platform: ['Web'], // Default value
          availablePincodes: business.available_pincodes || []
        }));
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // If no data is found in Supabase, fallback to mock data
        const { alternatives } = await import('@/assets/data');
        const filteredAlternatives = alternatives.filter(item => item.category === category);
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
        const { alternatives } = await import('@/assets/data');
        const software = alternatives.find(item => item.id === id);
        
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
        const transformedData = {
          id: data.id,
          name: data.name,
          description: data.description,
          category: data.category_name,
          likes: data.reviews_count || 0,
          imageUrl: data.image_url || 'https://picsum.photos/200',
          url: data.website_url || 'https://example.com',
          pricing: 'Freemium', // Default value
          platform: ['Web'], // Default value
          availablePincodes: data.available_pincodes || []
        };
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // If not found in Supabase, try fallback
        const { alternatives } = await import('@/assets/data');
        const software = alternatives.find(item => item.id === id);
        
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
        const { alternatives } = await import('@/assets/data');
        const software = alternatives.find(item => this.createSlug(item.name) === slug);
        
        if (software) {
          const externalReviews = await getExternalReviews(software.id);
          software.externalReviews = externalReviews;
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
        const transformedData = {
          id: data.id,
          name: data.name,
          description: data.description,
          category: data.category_name,
          likes: data.reviews_count || 0,
          imageUrl: data.image_url || 'https://picsum.photos/200',
          url: data.website_url || 'https://example.com',
          pricing: 'Freemium', // Default value
          platform: ['Web'], // Default value
          availablePincodes: data.available_pincodes || []
        };
        
        const externalReviews = await getExternalReviews(data.id);
        transformedData.externalReviews = externalReviews;
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        // If not found in Supabase, try fallback
        const { alternatives } = await import('@/assets/data');
        const software = alternatives.find(item => this.createSlug(item.name) === slug);
        
        if (software) {
          const externalReviews = await getExternalReviews(software.id);
          software.externalReviews = externalReviews;
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
      console.error("Error fetching business by slug:", error);
      return {
        success: false,
        error: "Failed to load business"
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

  async getCategories() {
    return crawlCategories();
  }

  async getMoreAlternatives(page: number = 2, category?: string) {
    return fetchMoreAlternatives(page, category);
  }

  async searchSoftware(query: string) {
    return searchAlternatives(query);
  }

  // Check if a business is available in a specific pincode
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

  async createSoftware(newService: Omit<Alternative, 'id'>): Promise<ServiceResult> {
    try {
      // Create slug from name
      const slug = this.createSlug(newService.name);
      
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
          available_pincodes: []
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
      const transformedData = {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category_name,
        likes: data.reviews_count || 0,
        imageUrl: data.image_url || 'https://picsum.photos/200',
        url: data.website_url || 'https://example.com',
        pricing: newService.pricing,
        platform: newService.platform,
        availablePincodes: data.available_pincodes || []
      };
      
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
        updates.slug = this.createSlug(updatedService.name);
      }
      
      if (updatedService.description) {
        updates.description = updatedService.description;
        updates.short_description = updatedService.description.substring(0, 100) + '...';
      }
      
      if (updatedService.category) {
        updates.category_name = updatedService.category;
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
      const transformedData = {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category_name,
        likes: data.reviews_count || 0,
        imageUrl: data.image_url || 'https://picsum.photos/200',
        url: data.website_url || 'https://example.com',
        pricing: updatedService.pricing || 'Freemium',
        platform: updatedService.platform || ['Web'],
        availablePincodes: data.available_pincodes || []
      };
      
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
}

async function getExternalReviews(serviceId: string) {
  // In a real app, this would fetch from an API or scraping service
  // For demo purposes, we're returning mock data
  
  const mockReviews = [
    {
      source: "TrustPilot",
      rating: 4.5,
      count: 1247,
      url: "https://trustpilot.com",
      verified: true
    },
    {
      source: "Google Reviews",
      rating: 4.3,
      count: 853,
      url: "https://google.com",
      verified: true
    },
    {
      source: "Yelp",
      rating: 3.8,
      count: 412,
      url: "https://yelp.com",
      verified: false
    }
  ];
  
  // Simulate different reviews for different services
  const lastDigit = parseInt(serviceId.slice(-1), 10);
  if (lastDigit % 3 === 0) {
    mockReviews[0].rating = 3.9;
    mockReviews[1].rating = 4.1;
  } else if (lastDigit % 3 === 1) {
    mockReviews[0].rating = 4.7;
    mockReviews[2].rating = 4.2;
  }
  
  return mockReviews;
}

export const softwareService = new SoftwareService();
