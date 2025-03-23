
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
      // For demo purposes, we'll return mock data for D2C service providers
      const { alternatives } = await import('@/assets/data');
      return {
        success: true,
        data: alternatives
      };
    } catch (error) {
      console.error('Error fetching services:', error);
      return {
        success: false,
        error: 'Failed to load services'
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
      console.error('Error fetching services by category:', error);
      return {
        success: false,
        error: 'Failed to load services by category'
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
          error: "D2C service not found"
        };
      }
    } catch (error) {
      console.error("Error fetching D2C service by ID:", error);
      return {
        success: false,
        error: "Failed to load D2C service"
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
      // In a real app, this would be a backend API call
      // For demo purposes, we'll just simulate a successful creation
      const { alternatives } = await import('@/assets/data');
      
      // Generate a new ID (in a real app, the backend would do this)
      const newId = (alternatives.length + 1).toString();
      
      const newD2CService = {
        id: newId,
        ...newService
      };
      
      // Note: In this demo, we aren't actually adding to the alternatives array
      // because it's imported and can't be modified. In a real app, this would 
      // be stored in a database.
      
      return {
        success: true,
        data: newD2CService
      };
    } catch (error) {
      console.error('Error creating D2C service:', error);
      return {
        success: false,
        error: 'Failed to create D2C service'
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
          error: 'D2C service not found'
        };
      }
      
      // Create an updated version (in a real app, this would update the database)
      const updatedD2CService = {
        ...existingService,
        ...updatedService
      };
      
      return {
        success: true,
        data: updatedD2CService
      };
    } catch (error) {
      console.error('Error updating D2C service:', error);
      return {
        success: false,
        error: 'Failed to update D2C service'
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
          error: 'D2C service not found'
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
      console.error('Error deleting D2C service:', error);
      return {
        success: false,
        error: 'Failed to delete D2C service'
      };
    }
  }
}

export const softwareService = new SoftwareService();
