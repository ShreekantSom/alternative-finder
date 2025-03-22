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
          error: "Software not found"
        };
      }
    } catch (error) {
      console.error("Error fetching software by ID:", error);
      return {
        success: false,
        error: "Failed to load software"
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
}

export const softwareService = new SoftwareService();
