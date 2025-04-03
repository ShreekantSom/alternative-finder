
import { Alternative } from '@/assets/data';
import { crawlCategories, fetchMoreAlternatives, searchAlternatives } from './crawler';

interface ServiceResult {
  success: boolean;
  data?: Alternative[] | Alternative | any;
  error?: string;
}

class SoftwareService {
  async getAllSoftware(): Promise<ServiceResult> {
    try {
      // In a real app, this would be a backend API call to a database
      // For demo purposes, we'll return mock data for businesses
      const { alternatives } = await import('@/assets/data');
      return {
        success: true,
        data: alternatives
      };
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
      // In a real app, this would be a backend API call to a database
      // For demo purposes, we'll filter the mock data
      const { alternatives } = await import('@/assets/data');
      const filteredAlternatives = alternatives.filter(item => item.category === category);
      return {
        success: true,
        data: filteredAlternatives
      };
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
      // In a real app, we'd call an API endpoint
      // For demo purposes, we're using the alternatives array
      
      // Import alternatives directly for server-side
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
      // Import alternatives
      const { alternatives } = await import('@/assets/data');
      
      // Create slug from name and find matching business
      const software = alternatives.find(item => this.createSlug(item.name) === slug);
      
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
      // In a real app, this would be a backend API call
      // For demo purposes, we'll just simulate a successful creation
      const { alternatives } = await import('@/assets/data');
      
      // Generate a new ID (in a real app, the backend would do this)
      const newId = (alternatives.length + 1).toString();
      
      const newBusiness = {
        id: newId,
        ...newService
      };
      
      // Note: In this demo, we aren't actually adding to the alternatives array
      // because it's imported and can't be modified. In a real app, this would 
      // be stored in a database.
      
      return {
        success: true,
        data: newBusiness
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
      // In a real app, this would be a backend API call
      // For demo purposes, we'll just simulate a successful update
      const { alternatives } = await import('@/assets/data');
      
      const existingService = alternatives.find(service => service.id === id);
      
      if (!existingService) {
        return {
          success: false,
          error: 'Business not found'
        };
      }
      
      // Create an updated version (in a real app, this would update the database)
      const updatedBusiness = {
        ...existingService,
        ...updatedService
      };
      
      return {
        success: true,
        data: updatedBusiness
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
      // In a real app, this would be a backend API call
      // For demo purposes, we'll just simulate a successful deletion
      const { alternatives } = await import('@/assets/data');
      
      const serviceExists = alternatives.some(service => service.id === id);
      
      if (!serviceExists) {
        return {
          success: false,
          error: 'Business not found'
        };
      }
      
      // Note: In this demo, we aren't actually removing from the alternatives array
      // because it's imported and can't be modified. In a real app, this would 
      // delete from a database.
      
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
}

export const softwareService = new SoftwareService();
