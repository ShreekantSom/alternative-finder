
import { toast } from "@/components/ui/use-toast";

interface CrawlerResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function crawlCategories(): Promise<CrawlerResult> {
  try {
    // In a real app, this would be a backend API call to a crawler service
    // For demo purposes, we'll return mock data for D2C service categories
    const categories = [
      { id: 'all', name: 'All Categories', icon: 'layers', count: 356 },
      { id: 'quick-commerce', name: 'Quick Commerce', icon: 'truck', count: 24 },
      { id: 'food-delivery', name: 'Food Delivery', icon: 'utensils', count: 31 },
      { id: 'ride-sharing', name: 'Ride-Sharing', icon: 'car', count: 15 },
      { id: 'entertainment', name: 'Entertainment', icon: 'tv', count: 42 },
      { id: 'meal-kits', name: 'Meal Kits', icon: 'package', count: 18 },
      { id: 'grocery', name: 'Grocery', icon: 'shopping-basket', count: 27 },
      { id: 'health-wellness', name: 'Health & Wellness', icon: 'heart', count: 35 },
      { id: 'fashion', name: 'Fashion', icon: 'shirt', count: 29 },
      { id: 'beauty', name: 'Beauty', icon: 'sparkles', count: 23 },
      { id: 'home-goods', name: 'Home Goods', icon: 'home', count: 26 },
      { id: 'pet-supplies', name: 'Pet Supplies', icon: 'dog', count: 19 },
      { id: 'subscription-boxes', name: 'Subscription Boxes', icon: 'package', count: 32 },
      { id: 'travel', name: 'Travel', icon: 'plane', count: 18 },
      { id: 'bfsi', name: 'BFSI', icon: 'building-bank', count: 38 },
      { id: 'education', name: 'Education', icon: 'book-open', count: 29 },
      { id: 'healthcare', name: 'Healthcare', icon: 'heart-pulse', count: 33 },
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
    // For demo purposes, we'll generate mock D2C service data
    const categories = [
      'Quick Commerce', 'Food Delivery', 'Ride-Sharing', 'Entertainment', 
      'Meal Kits', 'Grocery', 'Health & Wellness', 'Fashion', 'BFSI'
    ];
    
    const platforms = ['iOS', 'Android', 'Web', 'Desktop', 'Smart TVs'];
    const pricing = ['Free', 'Freemium', 'Paid', 'Subscription'];
    
    const serviceNames = [
      'Rapid', 'Express', 'Quick', 'Metro', 'Urban', 'City', 'Prime', 'Fast',
      'Daily', 'Fresh', 'Now', 'Instant', 'Direct', 'Speedy', 'Swift', 'Easy'
    ];
    
    const serviceTypes = [
      'Delivery', 'Eats', 'Market', 'Shop', 'Store', 'Go', 'Rush', 'Run', 
      'Dash', 'Hub', 'Connect', 'Box', 'Pass', 'Club', 'Plus', 'Service'
    ];
    
    const tags = [
      'Fast Delivery', 'Low Fees', 'Free Shipping', 'Premium Support',
      'Student Discount', 'Free Trial', 'Eco-Friendly', 'High Quality',
      'Affordable', 'Sustainable', 'Award-Winning', 'Value for Money'
    ];
    
    const subcategories = {
      'Entertainment': ['Music Streaming', 'Video Streaming', 'Gaming', 'Music Labels', 'Cinema Chains'],
      'Food Delivery': ['Restaurant Delivery', 'Grocery Delivery', 'Meal Plans'],
      'BFSI': ['Banking', 'Insurance', 'Investing', 'Payment Processing', 'Lending'],
      'Healthcare': ['Telemedicine', 'Pharmacy', 'Fitness', 'Mental Health']
    };
    
    const randomCategory = category || categories[Math.floor(Math.random() * categories.length)];
    
    const newAlternatives = Array.from({ length: 6 }, (_, i) => {
      const serviceName = `${serviceNames[Math.floor(Math.random() * serviceNames.length)]}${serviceTypes[Math.floor(Math.random() * serviceTypes.length)]}`;
      
      // Pick a random subcategory if the category has subcategories
      const availableSubcategories = subcategories[randomCategory as keyof typeof subcategories] || [];
      const randomSubcategory = availableSubcategories.length > 0 
        ? availableSubcategories[Math.floor(Math.random() * availableSubcategories.length)]
        : undefined;
      
      // Generate random tags (2-4 tags)
      const numTags = Math.floor(Math.random() * 3) + 2;
      const randomTags = [...tags]
        .sort(() => 0.5 - Math.random())
        .slice(0, numTags);
      
      return {
        id: `${100 + (page * 6) + i}`,
        name: serviceName,
        description: `A ${randomCategory.toLowerCase()} service that offers fast and reliable delivery across your city.`,
        category: randomCategory,
        subcategory: randomSubcategory,
        likes: Math.floor(Math.random() * 5000) + 1000,
        platform: platforms.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
        pricing: pricing[Math.floor(Math.random() * pricing.length)] as 'Free' | 'Freemium' | 'Paid' | 'Subscription',
        imageUrl: `https://picsum.photos/seed/${serviceName.toLowerCase()}-${i}/200/200`,
        url: 'https://example.com/',
        tags: randomTags
      };
    });
    
    return {
      success: true,
      data: newAlternatives
    };
  } catch (error) {
    console.error('Error fetching more services:', error);
    return {
      success: false,
      error: 'Failed to load more services'
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
    // For demo purposes, we'll return mock search results for D2C services
    const categories = [
      'Quick Commerce', 'Food Delivery', 'Ride-Sharing', 'Entertainment', 
      'Meal Kits', 'Grocery', 'Health & Wellness', 'Fashion', 'BFSI'
    ];
    
    const platforms = ['iOS', 'Android', 'Web', 'Desktop', 'Smart TVs'];
    const pricing = ['Free', 'Freemium', 'Paid', 'Subscription'];
    
    const tags = [
      'Fast Delivery', 'Low Fees', 'Free Shipping', 'Premium Support',
      'Student Discount', 'Free Trial', 'Eco-Friendly', 'High Quality',
      'Affordable', 'Sustainable', 'Award-Winning', 'Value for Money'
    ];
    
    const subcategories = {
      'Entertainment': ['Music Streaming', 'Video Streaming', 'Gaming', 'Music Labels', 'Cinema Chains'],
      'Food Delivery': ['Restaurant Delivery', 'Grocery Delivery', 'Meal Plans'],
      'BFSI': ['Banking', 'Insurance', 'Investing', 'Payment Processing', 'Lending'],
      'Healthcare': ['Telemedicine', 'Pharmacy', 'Fitness', 'Mental Health']
    };
    
    const searchResults = Array.from({ length: 5 }, (_, i) => {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      // Pick a random subcategory if the category has subcategories
      const availableSubcategories = subcategories[randomCategory as keyof typeof subcategories] || [];
      const randomSubcategory = availableSubcategories.length > 0 
        ? availableSubcategories[Math.floor(Math.random() * availableSubcategories.length)]
        : undefined;
      
      // Generate random tags (2-4 tags)
      const numTags = Math.floor(Math.random() * 3) + 2;
      const randomTags = [...tags]
        .sort(() => 0.5 - Math.random())
        .slice(0, numTags);
      
      return {
        id: `search-${i}`,
        name: `${query.charAt(0).toUpperCase() + query.slice(1)}${i+1}`,
        description: `This is a ${randomCategory.toLowerCase()} service that matches your search for "${query}".`,
        category: randomCategory,
        subcategory: randomSubcategory,
        likes: Math.floor(Math.random() * 5000) + 1000,
        platform: platforms.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
        pricing: pricing[Math.floor(Math.random() * pricing.length)] as 'Free' | 'Freemium' | 'Paid' | 'Subscription',
        imageUrl: `https://picsum.photos/seed/search-${query}-${i}/200/200`,
        url: 'https://example.com/',
        tags: randomTags
      };
    });
    
    return {
      success: true,
      data: searchResults
    };
  } catch (error) {
    console.error('Error searching services:', error);
    return {
      success: false,
      error: 'Failed to search services'
    };
  }
}
