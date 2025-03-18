
import { toast } from "@/components/ui/use-toast";

interface CrawlerResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function crawlCategories(): Promise<CrawlerResult> {
  try {
    // In a real app, this would be a backend API call to a crawler service
    // For demo purposes, we'll return mock data based on the alternativeto.net site
    const categories = [
      { id: 'browsers', name: 'Web Browsers', icon: 'globe', count: 153 },
      { id: 'design', name: 'Design', icon: 'paintbrush', count: 284 },
      { id: 'development', name: 'Development', icon: 'code', count: 622 },
      { id: 'games', name: 'Games', icon: 'gamepad-2', count: 317 },
      { id: 'music', name: 'Music & Audio', icon: 'music', count: 209 },
      { id: 'office', name: 'Office & Productivity', icon: 'briefcase', count: 431 },
      { id: 'photos', name: 'Photo & Video', icon: 'image', count: 265 },
      { id: 'security', name: 'Security & Privacy', icon: 'shield', count: 194 },
      { id: 'social', name: 'Social & Communication', icon: 'message-circle', count: 276 },
      { id: 'utilities', name: 'Utilities', icon: 'tool', count: 389 },
      { id: 'education', name: 'Education', icon: 'graduation-cap', count: 157 },
      { id: 'finance', name: 'Finance', icon: 'landmark', count: 112 },
    ];
    
    return {
      success: true,
      data: categories
    };
  } catch (error) {
    console.error('Error crawling categories:', error);
    return {
      success: false,
      error: 'Failed to fetch categories'
    };
  }
}

// Function to fetch more alternatives
export async function fetchMoreAlternatives(page: number = 2, category?: string): Promise<CrawlerResult> {
  try {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll generate mock data
    const newAlternatives = Array.from({ length: 6 }, (_, i) => ({
      id: `${100 + (page * 6) + i}`,
      name: `Alternative ${100 + (page * 6) + i}`,
      description: `This is a ${category || 'software'} alternative that was loaded from page ${page}.`,
      category: category || ['Design', 'Development', 'Productivity', 'Photo Editing', 'Video Editing', 'Web Browsers'][Math.floor(Math.random() * 6)],
      likes: Math.floor(Math.random() * 5000) + 1000,
      platform: ['Windows', 'macOS', 'Linux', 'Web', 'Android', 'iOS'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
      pricing: ['Free', 'Freemium', 'Paid', 'Open Source'][Math.floor(Math.random() * 4)] as 'Free' | 'Freemium' | 'Paid' | 'Open Source',
      imageUrl: `https://picsum.photos/seed/${100 + (page * 6) + i}/200/200`,
      url: 'https://example.com/',
    }));
    
    return {
      success: true,
      data: newAlternatives
    };
  } catch (error) {
    console.error('Error fetching more alternatives:', error);
    return {
      success: false,
      error: 'Failed to load more alternatives'
    };
  }
}

// Search function
export async function searchAlternatives(query: string): Promise<CrawlerResult> {
  try {
    if (!query.trim()) {
      return { success: true, data: [] };
    }
    
    // In a real app, this would be an API call with the search query
    // For demo purposes, we'll return mock search results
    const searchResults = Array.from({ length: 5 }, (_, i) => ({
      id: `search-${i}`,
      name: `${query} Alternative ${i+1}`,
      description: `This is a search result for "${query}" that matches your query.`,
      category: ['Design', 'Development', 'Productivity', 'Photo Editing', 'Video Editing', 'Web Browsers'][Math.floor(Math.random() * 6)],
      likes: Math.floor(Math.random() * 5000) + 1000,
      platform: ['Windows', 'macOS', 'Linux', 'Web', 'Android', 'iOS'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
      pricing: ['Free', 'Freemium', 'Paid', 'Open Source'][Math.floor(Math.random() * 4)] as 'Free' | 'Freemium' | 'Paid' | 'Open Source',
      imageUrl: `https://picsum.photos/seed/search-${query}-${i}/200/200`,
      url: 'https://example.com/',
    }));
    
    return {
      success: true,
      data: searchResults
    };
  } catch (error) {
    console.error('Error searching alternatives:', error);
    return {
      success: false,
      error: 'Failed to search alternatives'
    };
  }
}
