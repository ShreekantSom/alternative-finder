
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
      { id: 'all', name: 'All Categories', icon: 'layers', count: 8641 },
      { id: 'business-finance', name: 'Business & Finance', icon: 'briefcase', count: 568 },
      { id: 'communication', name: 'Communication', icon: 'message-circle', count: 523 },
      { id: 'development', name: 'Development', icon: 'code', count: 1245 },
      { id: 'education-reference', name: 'Education & Reference', icon: 'graduation-cap', count: 412 },
      { id: 'games-entertainment', name: 'Games & Entertainment', icon: 'gamepad-2', count: 897 },
      { id: 'home-lifestyle', name: 'Home & Lifestyle', icon: 'landmark', count: 376 },
      { id: 'multimedia', name: 'Multimedia', icon: 'image', count: 743 },
      { id: 'music-audio', name: 'Music & Audio', icon: 'music', count: 489 },
      { id: 'network-internet', name: 'Network & Internet', icon: 'globe', count: 652 },
      { id: 'productivity', name: 'Productivity', icon: 'briefcase', count: 712 },
      { id: 'security-privacy', name: 'Security & Privacy', icon: 'shield', count: 387 },
      { id: 'system-utilities', name: 'System & Utilities', icon: 'tool', count: 603 },
      { id: 'design-photo', name: 'Design & Photo', icon: 'paintbrush', count: 432 },
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
      category: category || ['Design & Photo', 'Development', 'Productivity', 'Multimedia', 'Communication', 'Network & Internet'][Math.floor(Math.random() * 6)],
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
      category: ['Design & Photo', 'Development', 'Productivity', 'Multimedia', 'Communication', 'Network & Internet'][Math.floor(Math.random() * 6)],
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
