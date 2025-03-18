
import { Alternative } from '@/assets/data';
import { AuthService } from './auth';
import { toast } from "@/components/ui/use-toast";
import { categoryService } from './categoryService';

const SOFTWARE_STORAGE_KEY = 'alternative_app_software';

// Initialize with some default software
const initSoftware = (): void => {
  if (!localStorage.getItem(SOFTWARE_STORAGE_KEY)) {
    // Use the alternatives from data.ts
    const defaultSoftware = [
      {
        id: '1',
        name: 'GIMP',
        description: 'A free and open-source raster graphics editor used for image manipulation and editing.',
        category: 'Photo Editing',
        likes: 3425,
        platform: ['Windows', 'macOS', 'Linux'],
        pricing: 'Open Source',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/The_GIMP_icon_-_gnome.svg/1200px-The_GIMP_icon_-_gnome.svg.png',
        url: 'https://www.gimp.org/'
      },
      {
        id: '2',
        name: 'Figma',
        description: 'A collaborative interface design tool that enables multiple designers to work on the same project simultaneously.',
        category: 'Design',
        likes: 5829,
        platform: ['Web', 'Windows', 'macOS'],
        pricing: 'Freemium',
        imageUrl: 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png?w=670&h=670&q=75&fit=max&auto=format',
        url: 'https://www.figma.com/'
      },
      {
        id: '3',
        name: 'Visual Studio Code',
        description: 'A source-code editor made by Microsoft with support for debugging, syntax highlighting, and Git integration.',
        category: 'Development',
        likes: 7291,
        platform: ['Windows', 'macOS', 'Linux'],
        pricing: 'Free',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png',
        url: 'https://code.visualstudio.com/'
      },
      {
        id: '4',
        name: 'DaVinci Resolve',
        description: 'A professional video editing, color correction, visual effects, and audio post-production application.',
        category: 'Video Editing',
        likes: 4128,
        platform: ['Windows', 'macOS', 'Linux'],
        pricing: 'Freemium',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/DaVinci_Resolve_17_logo.svg/1200px-DaVinci_Resolve_17_logo.svg.png',
        url: 'https://www.blackmagicdesign.com/products/davinciresolve/'
      },
      {
        id: '5',
        name: 'Brave Browser',
        description: 'A free and open-source web browser focused on privacy and security with built-in ad blocking.',
        category: 'Web Browsers',
        likes: 6239,
        platform: ['Windows', 'macOS', 'Linux', 'Android', 'iOS'],
        pricing: 'Free',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Brave_lion_icon.svg/1024px-Brave_lion_icon.svg.png',
        url: 'https://brave.com/'
      },
      {
        id: '6',
        name: 'Notion',
        description: 'An all-in-one workspace for notes, tasks, wikis, and databases with a flexible, modular design.',
        category: 'Productivity',
        likes: 8127,
        platform: ['Web', 'Windows', 'macOS', 'Android', 'iOS'],
        pricing: 'Freemium',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
        url: 'https://www.notion.so/'
      }
    ];
    localStorage.setItem(SOFTWARE_STORAGE_KEY, JSON.stringify(defaultSoftware));
  }
};

// Call initialization
initSoftware();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const softwareService = {
  getAllSoftware: async (): Promise<ServiceResult<Alternative[]>> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const softwareJson = localStorage.getItem(SOFTWARE_STORAGE_KEY);
      const software: Alternative[] = softwareJson ? JSON.parse(softwareJson) : [];
      
      return { success: true, data: software };
    } catch (error) {
      console.error('Failed to get software:', error);
      return { success: false, error: 'Failed to load software' };
    }
  },
  
  getSoftwareById: async (id: string): Promise<ServiceResult<Alternative>> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const softwareJson = localStorage.getItem(SOFTWARE_STORAGE_KEY);
      const software: Alternative[] = softwareJson ? JSON.parse(softwareJson) : [];
      
      const softwareItem = software.find(s => s.id === id);
      if (!softwareItem) {
        return { success: false, error: 'Software not found' };
      }
      
      return { success: true, data: softwareItem };
    } catch (error) {
      console.error('Failed to get software:', error);
      return { success: false, error: 'Failed to load software' };
    }
  },
  
  getSoftwareByCategory: async (category: string): Promise<ServiceResult<Alternative[]>> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const softwareJson = localStorage.getItem(SOFTWARE_STORAGE_KEY);
      const software: Alternative[] = softwareJson ? JSON.parse(softwareJson) : [];
      
      // If "All Categories", return all software
      if (category === 'All Categories' || category === 'all') {
        return { success: true, data: software };
      }
      
      const filteredSoftware = software.filter(s => s.category === category);
      return { success: true, data: filteredSoftware };
    } catch (error) {
      console.error('Failed to get software by category:', error);
      return { success: false, error: 'Failed to load software' };
    }
  },
  
  createSoftware: async (softwareData: Omit<Alternative, 'id'>): Promise<ServiceResult<Alternative>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const softwareJson = localStorage.getItem(SOFTWARE_STORAGE_KEY);
      const software: Alternative[] = softwareJson ? JSON.parse(softwareJson) : [];
      
      // Generate a unique ID
      const id = `software-${Date.now()}`;
      
      const newSoftware: Alternative = {
        id,
        name: softwareData.name,
        description: softwareData.description,
        category: softwareData.category,
        likes: softwareData.likes || 0,
        platform: softwareData.platform,
        pricing: softwareData.pricing,
        imageUrl: softwareData.imageUrl,
        url: softwareData.url,
      };
      
      software.push(newSoftware);
      localStorage.setItem(SOFTWARE_STORAGE_KEY, JSON.stringify(software));
      
      // Update category counts
      await updateCategoryCount(newSoftware.category, 1);
      
      return { success: true, data: newSoftware };
    } catch (error) {
      console.error('Failed to create software:', error);
      return { success: false, error: 'Failed to create software' };
    }
  },
  
  updateSoftware: async (id: string, softwareData: Partial<Alternative>): Promise<ServiceResult<Alternative>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const softwareJson = localStorage.getItem(SOFTWARE_STORAGE_KEY);
      const software: Alternative[] = softwareJson ? JSON.parse(softwareJson) : [];
      
      const softwareIndex = software.findIndex(s => s.id === id);
      if (softwareIndex === -1) {
        return { success: false, error: 'Software not found' };
      }
      
      const oldCategory = software[softwareIndex].category;
      const newCategory = softwareData.category || oldCategory;
      
      // Update software
      software[softwareIndex] = {
        ...software[softwareIndex],
        ...softwareData,
      };
      
      localStorage.setItem(SOFTWARE_STORAGE_KEY, JSON.stringify(software));
      
      // Update category counts if category changed
      if (oldCategory !== newCategory) {
        await updateCategoryCount(oldCategory, -1);
        await updateCategoryCount(newCategory, 1);
      }
      
      return { success: true, data: software[softwareIndex] };
    } catch (error) {
      console.error('Failed to update software:', error);
      return { success: false, error: 'Failed to update software' };
    }
  },
  
  deleteSoftware: async (id: string): Promise<ServiceResult<void>> => {
    try {
      if (!AuthService.isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const softwareJson = localStorage.getItem(SOFTWARE_STORAGE_KEY);
      const software: Alternative[] = softwareJson ? JSON.parse(softwareJson) : [];
      
      const softwareIndex = software.findIndex(s => s.id === id);
      if (softwareIndex === -1) {
        return { success: false, error: 'Software not found' };
      }
      
      const category = software[softwareIndex].category;
      
      // Remove software
      software.splice(softwareIndex, 1);
      localStorage.setItem(SOFTWARE_STORAGE_KEY, JSON.stringify(software));
      
      // Update category counts
      await updateCategoryCount(category, -1);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete software:', error);
      return { success: false, error: 'Failed to delete software' };
    }
  },
  
  likeSoftware: async (id: string): Promise<ServiceResult<Alternative>> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const softwareJson = localStorage.getItem(SOFTWARE_STORAGE_KEY);
      const software: Alternative[] = softwareJson ? JSON.parse(softwareJson) : [];
      
      const softwareIndex = software.findIndex(s => s.id === id);
      if (softwareIndex === -1) {
        return { success: false, error: 'Software not found' };
      }
      
      // Increment likes
      software[softwareIndex].likes += 1;
      localStorage.setItem(SOFTWARE_STORAGE_KEY, JSON.stringify(software));
      
      return { success: true, data: software[softwareIndex] };
    } catch (error) {
      console.error('Failed to like software:', error);
      return { success: false, error: 'Failed to like software' };
    }
  }
};

// Helper function to update category counts
async function updateCategoryCount(categoryName: string, change: number): Promise<void> {
  try {
    const categoriesJson = localStorage.getItem('alternative_app_categories');
    const categories = categoriesJson ? JSON.parse(categoriesJson) : [];
    
    // Find category by name
    const category = categories.find((cat: any) => cat.name === categoryName);
    if (category) {
      category.count = Math.max(0, category.count + change);
      localStorage.setItem('alternative_app_categories', JSON.stringify(categories));
    }
    
    // Also update the "All Categories" count
    const allCategory = categories.find((cat: any) => cat.id === 'all');
    if (allCategory) {
      allCategory.count = Math.max(0, allCategory.count + change);
      localStorage.setItem('alternative_app_categories', JSON.stringify(categories));
    }
  } catch (error) {
    console.error('Failed to update category count:', error);
  }
}
